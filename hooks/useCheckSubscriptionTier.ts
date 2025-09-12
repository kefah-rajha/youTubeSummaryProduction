import { useFetchSubscriptionData } from '@/hooks/useFetchSubscriptionData';

/**
 * Custom hook to verify if the user's current subscription matches any of the specified tiers
 * 
 * This hook checks the user's active subscription against a list of allowed tier names
 * to determine access rights or feature availability based on subscription level
 * 
 * @param tiers - Array of subscription tier names to check against user's current subscription
 * @returns Boolean indicating whether user's subscription matches any of the provided tiers
 */
export const useCheckSubscriptionTier = (tiers: string[]): boolean => {
  // Retrieve user subscription data from the subscription API hook
  // Contains information about current subscription plan and status
  const { data } = useFetchSubscriptionData();
  
  // Extract the current subscription object from user data
  // Will be undefined if no active subscription exists
  const subscriptionTier = data?.currentSubscriptionId;
  
  /**
   * Check if the user's subscription product name matches any tier in the provided list
   * Uses Array.some() to return true if any tier name matches the subscription's productName
   * Returns false if no subscription exists or no matches are found
   */
  const checkSubscriptionTier = tiers.some((tier: string) => {
    return subscriptionTier?.productName === tier;
  });
  
  // Return the result of the tier validation check
  return checkSubscriptionTier;
};