"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import '@/style/home-page.css';
import { HomeBackground } from '@/components/gradients/home-style';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  User,
  Mail,
  Calendar,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  Shield,
} from "lucide-react";
import { IUserBase } from "@/dataType/Subscription"
import SubscriptionDetails from "@/components/user/subscriptionDetails";
import { useAuth } from "@clerk/nextjs";

// User interface based on your schema
// interface UserDetails {
//   _id: string;
//   clerkId: string;
//   email: string;
//   firstName?: string;
//   lastName?: string;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   settings?: any;
//   paddleCustomerId?: string;
//   freeTrialEnd?: number;
//   lifeTimeDeal?: boolean;
//   currentSubscription?: {
//     status: 'active' | 'canceled' | 'pastDue' | 'trialing' | 'ended';
//     planId: string;
//     endsAt?: number;
//     startDate: number;
//     billingCycle: 'month' | 'year';
//     paymentProcessorSubscriptionId: string;
//   };
//   createdAt?: string | Date;
//   updatedAt?: string | Date;
// }

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
  className?: string;
}

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

interface LoadingSkeletonProps {
  className?: string;
}

function LoadingSkeleton({ className = "" }: LoadingSkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30">
          <Skeleton className="h-5 w-5 mt-0.5" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function UserDetailsPage() {
  const router = useRouter();
  const [user, setUser] = useState<IUserBase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const userClerk = useAuth()
  const userId = userClerk?.userId ? userClerk?.userId : ""



  useEffect(() => {
    if (userId) {
      fetchUserDetails(userId);
    }
  }, [userId]);

  const fetchUserDetails = async (id: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/user/getUser/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data, "data")

      if (data.success === false) {
        throw new Error(data.message || "Failed to fetch user details");
      }

      setUser(data.data[0]);
    } catch (err) {
      console.error("Error fetching user:", err);
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };


  // Helper functions
  const formatDate = (dateString?: string | Date | number) => {
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

  const getFullName = (user: IUserBase) => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.firstName || user.lastName || "N/A";
  };


  if (loading) {
    return (
      <div className="container mx-auto py-6 max-w-4xl pt-20">
        <div className="flex items-center space-x-4 mb-6">
          <Skeleton className="h-10 w-10" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <LoadingSkeleton />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent>
              <LoadingSkeleton />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-6 max-w-4xl mt-16">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
              <h3 className="mt-2 text-lg font-semibold">Error Loading User</h3>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
              <div className="mt-6 space-x-2">
                <Button onClick={() => fetchUserDetails(userId)} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={() => router.back()} variant="ghost">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Go Back
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <User className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-semibold">User Not Found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                The user youre looking for doesnt exist or has been removed.
              </p>
              <Button onClick={() => router.back()} className="mt-6" variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }


  return (
    <div className=" mx-auto py-6 pt-16" >
      <HomeBackground />
      {/* Header */}
      <div className="flex items-center justify-between  mb-6">
        <div className="flex items-center w-10/12 m-auto pt-6 space-x-4">
          <Button
            onClick={() => router.push("/")}
            variant="ghost"
            size="icon"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{getFullName(user)}</h1>
            <p className="text-muted-foreground">User Details</p>
          </div>
        </div>


      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2 w-10/12 m-auto">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoItem
              icon={<User className="h-5 w-5" />}
              label="Full Name"
              value={getFullName(user)}
            />

            <InfoItem
              icon={<Mail className="h-5 w-5" />}
              label="Email Address"
              value={user.email}
            />

            <InfoItem
              icon={<Shield className="h-5 w-5" />}
              label="Clerk ID"
              value={user.clerkId}
            />

            <InfoItem
              icon={<Calendar className="h-5 w-5" />}
              label="Account Created"
              value={formatDate(user.createdAt)}
            />

            <InfoItem
              icon={<RefreshCw className="h-5 w-5" />}
              label="Last Updated"
              value={formatDate(user.updatedAt)}
            />
          </CardContent>
        </Card>

        {/* Subscription Information */}

        <SubscriptionDetails user={user} />
        {/* 
        {(user.settings || user.currentSubscription?.paymentProcessorSubscriptionId) && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Additional Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.currentSubscription?.paymentProcessorSubscriptionId && (
                <InfoItem
                  icon={<CreditCard className="h-5 w-5" />}
                  label="Payment Processor Subscription ID"
                  value={user.currentSubscription.paymentProcessorSubscriptionId}
                />
              )}

              {user.settings && Object.keys(user.settings).length > 0 && (
                <InfoItem
                  icon={<Settings className="h-5 w-5" />}
                  label="User Settings"
                  value={
                    <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                      {JSON.stringify(user.settings, null, 2)}
                    </pre>
                  }
                />
              )}
            </CardContent>
          </Card>
        )} */}
      </div>
      <div className="fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-card to-transparent z-0 pointer-events-none"></div>

    </div>
  );
}