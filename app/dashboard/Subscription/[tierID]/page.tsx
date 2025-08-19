'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Check, Star } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EditTierDialog } from "@/components/Subscription/subscription-dashboard/EditTierDialog"
import Image from 'next/image'

interface IPriceId {
  month: string;
  year: string;
}

interface ITier {
  _id: string;
  name: string;
  id: string;
  icon: string;
  description: string;
  features: string[];
  featured: boolean;
  priceId: IPriceId;
  createdAt: string;
  updatedAt: string;
}
interface ITierSubmit {
  name: string;
  id: string;
  icon: string;
  description: string;
  features: string[];
  featured: boolean;
  priceId: IPriceId;

}

const TierDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const tierID = params?.tierID as string;

  const [tier, setTier] = useState<ITier>({} as ITier);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch tier data
  const fetchTier = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/tiers/${tierID}`, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to fetch tier');
      }

      setTier(result.data);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err?.message as string);
    } finally {
      setLoading(false);
    }
  },[tierID])
  const handleSaveTier = async (data: ITierSubmit) => {
    console.log("test")
    try {
      const response = await fetch(`/api/UpdateTiers/${tierID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update tier');
      }

      const updatedTier = await response.json();
      console.log(updatedTier, "updatedTier")
      if (updatedTier.success) {
        setTier(updatedTier.data);

      }

      // Optional: Show success message
      // You can add a toast notification here
    } catch (error) {
      console.error('Error updating tier:', error);
      throw error; // Re-throw to be handled by the dialog
    }
  };

  useEffect(() => {
    if (tierID) {
      fetchTier();
    }
  }, [tierID,fetchTier]);

  // Loading skeleton
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">

        <div className="mb-6">
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-96" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Alert variant="destructive">
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // No tier found
  if (!tier) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Alert>
          <AlertDescription>
            Tier not found.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <EditTierDialog tier={tier} onSave={handleSaveTier} />

      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Tiers
      </Button>

      {/* Main Tier Card */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              {/* Tier Icon */}
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                <Image     
                             src={tier.icon}
                  alt={`${tier.name} icon`}
                  className="w-8 h-8"
                  onError={(e: { currentTarget: { style: { display: string; }; }; }) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <CardTitle className="text-3xl">{tier.name}</CardTitle>
                  {tier.featured && (
                    <Badge variant="default" className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-current" />
                      <span>Featured</span>
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-lg mt-2">
                  {tier.description}
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Features Section */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Features</h3>
            <div className="grid gap-3">
              {tier?.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Price ID:</p>
                  <code className="block p-2 bg-muted rounded text-xs break-all">
                    {tier.priceId.month || 'Not set'}
                  </code>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Yearly Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Price ID:</p>
                  <code className="block p-2 bg-muted rounded text-xs break-all">
                    {tier.priceId.year || 'Not set'}
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Metadata */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Tier Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Tier ID</p>
                <p className="font-mono">{tier.id}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Created</p>
                <p>{new Date(tier.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Updated</p>
                <p>{new Date(tier.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TierDetailPage;