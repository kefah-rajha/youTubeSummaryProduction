"use client";
import React, { useEffect, useState, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Skeleton } from "@/components/ui/skeleton";



import { Users2, Eye, Crown, Calendar } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Updated user interface based on your schema
interface ISubscription {
    user: string;
    paddleSubscriptionId: string;
    status: 'active' | 'canceled' | 'past_due' | 'paused' | 'trialing' | 'ended';
    planId: string;
    planName: string;
    priceId: string;
    productId: string;
    productName: string;
    transactionId: string;
    currency: string;
    amount: number;
    billingCycle: {
        interval: 'day' | 'week' | 'month' | 'year';
        frequency: number;
    };
    startDate: Date;
    nextBillingDate?: Date;
    endDate?: Date;
    canceledAt?: Date;
    pausedAt?: Date;
    trialEnd?: Date;
    customData?: {
        user_id?: string;
        internal_user_id?: string;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    };
    items: Array<{
        priceId: string;
        productId: string;
        quantity: number;
        amount: number;
    }>;
    history: Array<{
        eventType: string;
        eventDate: Date;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        changes: Record<string, any>;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        metadata?: Record<string, any>;
    }>;
}

interface User {
    _id: string;
    clerkId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    settings?: any;
    paddleCustomerId?: string;
    freeTrialEnd?: number;
    lifeTimeDeal?: boolean;
    currentSubscriptionId?: ISubscription;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

// Props interface for TruncatedCell component
interface TruncatedCellProps {
    children: ReactNode;
    className?: string;
}

// TruncatedCell component for handling long text with tooltip
function TruncatedCell({ children, className = "" }: TruncatedCellProps) {
    const [isTruncated, setIsTruncated] = useState(false);
    const textRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const checkTruncation = () => {
            const element = textRef.current;
            if (element) {
                setIsTruncated(element.scrollWidth > element.clientWidth);
            }
        };

        checkTruncation();
        window.addEventListener('resize', checkTruncation);
        return () => window.removeEventListener('resize', checkTruncation);
    }, [children]);

    if (!children || children === "N/A") {
        return <span className={className}>{children}</span>;
    }

    return (
        <TooltipProvider>
            <Tooltip delayDuration={300}>
                <TooltipTrigger asChild>
                    <div
                        ref={textRef}
                        className={`truncate max-w-full ${className}`}
                    >
                        {children}
                    </div>
                </TooltipTrigger>
                {isTruncated && (
                    <TooltipContent>
                        <p className="max-w-xs break-words">{children}</p>
                    </TooltipContent>
                )}
            </Tooltip>
        </TooltipProvider>
    );
}
interface UserType {
    _id: string;
    clerkId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    settings?: any;
    paddleCustomerId?: string;
    freeTrialEnd?: number;
    lifeTimeDeal?: boolean;
    currentSubscription?: {
        status: 'active' | 'canceled' | 'pastDue' | 'trialing' | 'ended';
        planId: string;
        endsAt?: number;
        startDate: number;
        billingCycle: 'month' | 'year';
        paymentProcessorSubscriptionId: string;
    };
    createdAt?: string | Date;
    updatedAt?: string | Date;
}
interface usersType {
    users: UserType[];
    loading: boolean

}
function TableUser({ users, loading }: usersType) {
    const { push } = useRouter();

    // Format date for display
    const formatDate = (dateString?: string | Date | number) => {
        if (!dateString) return "N/A";

        // Handle timestamp (number) format
        if (typeof dateString === 'number') {
            return new Date(dateString * 1000).toLocaleDateString();
        }

        return new Date(dateString).toLocaleDateString();
    };

    // Get full name
    const getFullName = (user: User) => {
        if (user.firstName && user.lastName) {
            return `${user.firstName} ${user.lastName}`;
        }
        return user.firstName || user.lastName || "N/A";
    };

    // Get subscription status badge
    const getSubscriptionBadge = (user: User) => {
        if (user.lifeTimeDeal) {
            return (
                <Badge className="bg-yellow-100 border-yellow-500 text-yellow-700">
                    <Crown className="h-3 w-3 mr-1" />
                    Lifetime
                </Badge>
            );
        }

        if (!user.currentSubscriptionId) {
            return (
                <Badge variant="outline" className="border-gray-300 text-gray-600">
                    Free
                </Badge>
            );
        }

        const status = user.currentSubscriptionId.status;
        const badgeConfig = {
            active: { className: "bg-green-100 border-green-500 text-green-700", text: "Active" },
            trialing: { className: "bg-blue-100 border-blue-500 text-blue-700", text: "Trial" },
            paused: { className: "bg-blue-100 border-blue-500 text-blue-700", text: "paused" },

            canceled: { className: "bg-red-100 border-red-500 text-red-700", text: "Canceled" },
            past_due: { className: "bg-orange-100 border-orange-500 text-orange-700", text: "Past Due" },
            ended: { className: "bg-gray-100 border-gray-500 text-gray-700", text: "Ended" }
        };

        const config = badgeConfig[status] || badgeConfig.ended;

        return (
            <Badge className={config.className}>
                {config.text}
            </Badge>
        );
    };

    // Check if user is in free trial
    const isInFreeTrial = (user: User) => {
        if (!user.freeTrialEnd) return false;
        return Date.now() / 1000 < user.freeTrialEnd;
    };
    // Loading skeleton component
    const LoadingSkeleton = () => (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead className="hidden md:table-cell">Status</TableHead>
                        <TableHead className="hidden lg:table-cell">Billing</TableHead>
                        <TableHead className="hidden lg:table-cell">Expires/Trial</TableHead>
                        <TableHead className="hidden md:table-cell">Joined</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                                <Skeleton className="h-4 w-40" />
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                <Skeleton className="h-6 w-16 rounded-full" />
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                                <Skeleton className="h-6 w-20 rounded-full" />
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                                <Skeleton className="h-4 w-24" />
                            </TableCell>


                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );

    const rowsUser = users?.map((user: User) => (
        <TableRow key={user._id} className="cursor-pointer hover:bg-foreground/5">
            <TableCell className="font-medium max-w-[150px]">
                <TruncatedCell>
                    {getFullName(user)}
                </TruncatedCell>
            </TableCell>

            <TableCell className="max-w-[200px]">
                <TruncatedCell>
                    {user.email}
                </TruncatedCell>
            </TableCell>

            <TableCell className="hidden md:table-cell">
                {getSubscriptionBadge(user)}
            </TableCell>

            <TableCell className="hidden lg:table-cell max-w-[120px]">
                <TruncatedCell>
                    {user.currentSubscriptionId?.billingCycle ? (
                        <Badge variant="outline" className="capitalize">
                            {user.currentSubscriptionId.billingCycle.interval}ly
                        </Badge>
                    ) : (
                        "N/A"
                    )}
                </TruncatedCell>
            </TableCell>

            <TableCell className="hidden lg:table-cell">
                {isInFreeTrial(user) ? (
                    <Badge className="bg-blue-100 border-blue-500 text-blue-700">
                        <Calendar className="h-3 w-3 mr-1" />
                        Trial Ends {formatDate(user.freeTrialEnd)}
                    </Badge>
                ) : (
                    user.currentSubscriptionId?.endDate ?
                        formatDate(user.currentSubscriptionId.endDate) :
                        "N/A"
                )}
            </TableCell>

            <TableCell className="hidden md:table-cell">
                {formatDate(user.createdAt)}
            </TableCell>

            <TableCell>
                <div className="flex items-center space-x-1">
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => push(`/dashboard/user/${user.clerkId}`)}
                        title="View user details"
                        className="bg-background shadow h-8 w-8 cursor-pointer"
                    >
                        <Eye className="h-4 w-4 text-orange-500" />
                    </Button>




                </div>
            </TableCell>
        </TableRow>
    ));

    return (
        <div className="container mx-auto py-6">
            <Card className="shadow-sm">
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle className="text-3xl font-bold">
                                User Management
                            </CardTitle>
                            <CardDescription className="text-lg pt-1">
                                Manage your users and their subscription information
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <LoadingSkeleton />
                    ) : users && users.length > 0 ? (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead className="hidden md:table-cell">Status</TableHead>
                                        <TableHead className="hidden lg:table-cell">Billing</TableHead>
                                        <TableHead className="hidden lg:table-cell">Expires/Trial</TableHead>
                                        <TableHead className="hidden md:table-cell">Joined</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {rowsUser}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center p-8">
                            <Users2 className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-lg font-medium">No users found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                No users are currently registered in the system.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

export default TableUser;




