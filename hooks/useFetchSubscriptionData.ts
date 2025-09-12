import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import {ISubscription} from "@/dataType/Subscription"

interface SubscriptionData {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  settings?: Record<string, unknown>;
  freeTrialEnd: Date | null;
  lifeTimeDeal: boolean;
  currentSubscriptionId?: ISubscription | null;
}

interface UseSubscriptionData {
  data: SubscriptionData | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Custom hook to fetch user subscription data from the API
 * Handles authentication, loading states, and errors
 */
export const useFetchSubscriptionData = (): UseSubscriptionData => {
  const { userId, isSignedIn } = useAuth();
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // Use environment variable for API URL with fallback to localhost for development
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

  useEffect(() => {
    // Skip fetching if user is not signed in
    if (!isSignedIn || !userId) {
      setIsLoading(false);
      setData(null);
      return;
    }

    // Abort controller for request cancellation
    const abortController = new AbortController();

    const fetchSubscription = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/api/user/getUser/${userId}`, {
          cache:'no-cache',
          signal: abortController.signal,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch subscription: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();
        console.log(result,"result")
        
        // Basic validation to ensure we have the expected data structure
        if (result && Array.isArray(result.data) && result.data.length > 0) {

          setData(result.data[0]);
        } else {
          throw new Error('Invalid data format received from server');
        }

      } catch (err: unknown) {
        // Only handle errors if the request wasn't aborted
        if (!abortController.signal.aborted) {
          const error = err instanceof Error ? err : new Error('Unknown error occurred');
          setError(error);
          setData(null);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    fetchSubscription();

    // Cleanup function to abort ongoing request if component unmounts
    return () => {
      abortController.abort();
    };

  }, [userId, isSignedIn, API_BASE_URL]);
  console.log(error, "ddassssd")

  return { data, isLoading, error };
};