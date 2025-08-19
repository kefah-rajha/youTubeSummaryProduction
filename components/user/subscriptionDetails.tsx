import React, { useState } from 'react';
import { UserProfile } from '@clerk/nextjs'

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { IUserBase } from "@/dataType/Subscription";
import { toast } from "sonner";
import Image from "next/image";

import {
    Calendar,
    CreditCard,
    Clock,
    Zap,
    DollarSign,
    AlertCircle,
    Crown,
    User,
    CheckCircle,
    XCircle,
    X,
    Loader2,
} from "lucide-react";

interface SubscriptionManagementProps {
    user: IUserBase;
    onSubscriptionUpdate?: () => void;
}

function SubscriptionManagement({ user, onSubscriptionUpdate }: SubscriptionManagementProps) {
    const [isCanceling, setIsCanceling] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isOpenUpdateUser, setIsOpenUpateUser] = useState(false);

    interface InfoItemProps {
        icon: React.ReactNode;
        label: string;
        value: string | React.ReactNode;
        className?: string;
    }

    const formatDate = (dateString?: string | Date | number | string) => {
        if (!dateString) return "N/A";

        if (typeof dateString === 'number') {
            return new Date(dateString * 1000).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    function InfoItem({ icon, label, value, className = "" }: InfoItemProps) {
        return (
            <div className={`flex items-start space-x-3 p-3 rounded-lg bg-muted/30 ${className}`}>
                <div className="flex-shrink-0 mt-0.5 text-muted-foreground">
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-muted-foreground mb-1">{label}</p>
                    <div className="text-sm font-semibold text-foreground">{value}</div>
                </div>
            </div>
        );
    }

    const isInFreeTrial = (user: IUserBase) => {
        if (!user.freeTrialEnd) return false;
        return Date.now() / 1000 < +user.freeTrialEnd;
    };

    const getProductInfo = (planId?: string) => {
        console.log(planId, " planIdplanId")
        const planMapping = {
            'starter': {
                name: 'Starter',
                icon: '/assets/icons/price-tiers/free-icon.svg'
            },
            'pro': {
                name: 'Pro',
                icon: '/assets/icons/price-tiers/basic-icon.svg'
            },
            'advanced': {
                name: 'Advanced',
                icon: '/assets/icons/price-tiers/pro-icon.svg'
            }
        };

        // Extract plan name from planId or use default
        const planKey = planId?.toLowerCase().includes('starter') ? 'starter' :
            planId?.toLowerCase().includes('pro') ? 'pro' :
                planId?.toLowerCase().includes('advanced') ? 'advanced' : 'starter';

        return planMapping[planKey] || planMapping.starter;
    };

    const getSubscriptionStatusInfo = (user: IUserBase) => {
        if (user.lifeTimeDeal) {
            return {
                badge: (
                    <Badge className="bg-yellow-100 border-yellow-500 text-yellow-700">
                        <Crown className="h-3 w-3 mr-1" />
                        Lifetime Deal
                    </Badge>
                ),
                icon: <Crown className="h-5 w-5" />,
                description: "This user has lifetime access to all features"
            };
        }

        if (!user.currentSubscriptionId) {
            return {
                badge: <Badge variant="outline">Free Plan</Badge>,
                icon: <User className="h-5 w-5" />,
                description: "User is on the free plan"
            };
        }

        const status = user.currentSubscriptionId.status;
        const statusConfig = {
            active: {
                badge: <Badge className="bg-green-100 border-green-500 text-green-700"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>,
                icon: <CheckCircle className="h-5 w-5 text-green-600" />,
                description: "Subscription is active and in good standing"
            },
            trialing: {
                badge: <Badge className="bg-blue-100 border-blue-500 text-blue-700"><Clock className="h-3 w-3 mr-1" />Trial</Badge>,
                icon: <Clock className="h-5 w-5 text-blue-600" />,
                description: "User is currently in trial period"
            },
            paused: {
                badge: <Badge className="bg-blue-100 border-blue-500 text-blue-700"><Clock className="h-3 w-3 mr-1" />Paused</Badge>,
                icon: <Clock className="h-5 w-5 text-blue-600" />,
                description: "Subscription is currently paused"
            },
            canceled: {
                badge: <Badge className="bg-red-100 border-red-500 text-red-700"><XCircle className="h-3 w-3 mr-1" />Canceled</Badge>,
                icon: <XCircle className="h-5 w-5 text-red-600" />,
                description: "Subscription has been canceled"
            },
            past_due: {
                badge: <Badge className="bg-orange-100 border-orange-500 text-orange-700"><AlertCircle className="h-3 w-3 mr-1" />Past Due</Badge>,
                icon: <AlertCircle className="h-5 w-5 text-orange-600" />,
                description: "Payment is past due"
            },
            ended: {
                badge: <Badge className="bg-gray-100 border-gray-500 text-gray-700"><XCircle className="h-3 w-3 mr-1" />Ended</Badge>,
                icon: <XCircle className="h-5 w-5 text-gray-600" />,
                description: "Subscription has ended"
            }
        };

        return statusConfig[status] || statusConfig.ended;
    };

    const handleCancelSubscription = async () => {
        if (!user.currentSubscriptionId) {
            toast.error("No active subscription to cancel");
            return;
        }

        setIsCanceling(true);

        try {
            const response = await fetch('/api/cancelSubscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    subscriptionId: user.currentSubscriptionId.paddleSubscriptionId || user.currentSubscriptionId.paddleSubscriptionId,
                    userId: user.clerkId
                })
            });

            if (!response.ok) {
                throw new Error('Failed to cancel subscription');
            }

            const result = await response.json();
            console.log(result, " resultresult")

            toast.success("Subscription canceled successfully");
            setIsDialogOpen(false);

            // Call the callback to refresh user data
            if (onSubscriptionUpdate) {
                onSubscriptionUpdate();
            }

        } catch (error) {
            console.error('Error canceling subscription:', error);
            toast.error("Failed to cancel subscription. Please try again.");
        } finally {
            setIsCanceling(false);

        }
    };

    const handleUpdateSubscription = () => {
        // Placeholder for update functionality
        toast.info("Update subscription functionality coming soon!");
    };

    const subscriptionInfo = getSubscriptionStatusInfo(user);
    const productInfo = getProductInfo(user.currentSubscriptionId?.productName);

    const canCancel = user.currentSubscriptionId &&
        ['active', 'trialing', 'paused'].includes(user.currentSubscriptionId.status);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <CreditCard className="h-5 w-5" />
                        <span>Subscription Management</span>


                    </div>
                    <div className="flex items-center space-x-2">
                        <Dialog open={isOpenUpdateUser} onOpenChange={setIsOpenUpateUser}>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleUpdateSubscription}
                                >
                                    
                                    Update
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="w-fit h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>User Profile</DialogTitle>
                                </DialogHeader>
                                <div className="mt-4">
                                    <UserProfile />
                                </div>
                            </DialogContent>
                        </Dialog>

                        {canCancel && (
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="destructive" size="sm">
                                        <X className="h-4 w-4 mr-2" />
                                        Cancel
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Cancel Subscription</DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to cancel your subscription? This action cannot be undone.
                                            Your subscription will remain active until the end of your current billing period.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsDialogOpen(false)}
                                            disabled={isCanceling}
                                        >
                                            Keep Subscription
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            onClick={handleCancelSubscription}
                                            disabled={isCanceling}
                                        >
                                            {isCanceling ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Canceling...
                                                </>
                                            ) : (
                                                'Cancel Subscription'
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <InfoItem
                    icon={subscriptionInfo.icon}
                    label="Status"
                    value={
                        <div className="space-y-1">
                            {subscriptionInfo.badge}
                            <p className="text-xs text-muted-foreground">
                                {subscriptionInfo.description}
                            </p>
                        </div>
                    }
                />

                {user.currentSubscriptionId && (
                    <>
                        <InfoItem
                            icon={
                                <div className="relative">
                                    <Image src={productInfo.icon} height={40} width={40} alt={productInfo.name} />
                                </div>
                            }
                            label="Product"
                            value={
                                <div className="flex items-center space-x-2">
                                    <span>{productInfo.name}</span>
                                    <Badge variant="secondary" className="text-xs">
                                        {user.currentSubscriptionId.planId}
                                    </Badge>
                                </div>
                            }
                        />

                        {user.currentSubscriptionId.amount && (
                            <InfoItem
                                icon={<DollarSign className="h-5 w-5" />}
                                label="Amount"
                                value={
                                    <div className="flex items-center space-x-1">
                                        <span className="font-semibold">
                                            {user.currentSubscriptionId.currency?.toUpperCase() || 'USD'} {user.currentSubscriptionId.amount}
                                        </span>
                                        <Badge variant="outline" className="capitalize text-xs">
                                            {user.currentSubscriptionId.billingCycle.interval}ly
                                        </Badge>
                                    </div>
                                }
                            />
                        )}

                        <InfoItem
                            icon={<Calendar className="h-5 w-5" />}
                            label="Started"
                            value={formatDate(user.currentSubscriptionId.startDate)}
                        />

                        {user.currentSubscriptionId?.nextBillingDate && (
                            <InfoItem
                                icon={<Clock className="h-5 w-5" />}
                                label="Next Billing"
                                value={formatDate(user.currentSubscriptionId?.nextBillingDate)}
                            />
                        )}
                    </>
                )}

                {user.paddleCustomerId && (
                    <InfoItem
                        icon={<CreditCard className="h-5 w-5" />}
                        label="Paddle Customer ID"
                        value={user.paddleCustomerId}
                    />
                )}

                {isInFreeTrial(user) && user?.freeTrialEnd && (
                    <InfoItem
                        icon={<Zap className="h-5 w-5" />}
                        label="Free Trial"
                        value={
                            <div className="space-y-1">
                                <Badge className="bg-blue-100 border-blue-500 text-blue-700">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Active Trial
                                </Badge>
                                <p className="text-xs text-muted-foreground">
                                    Ends: {formatDate(user?.freeTrialEnd)}
                                </p>
                            </div>
                        }
                    />
                )}
            </CardContent>
        </Card>
    );
}

export default SubscriptionManagement;