import { useFetchSubscriptionData } from '@/hooks/useFetchSubscriptionData';
import { useHasActiveSubscription } from "./useHasActiveSubscription"

/**
 * Custom hook to determine if a user is a paying customer
 * 
 * A user is considered a paying user if they either:
 * 1. Have a lifetime deal (one-time payment for permanent access), OR
 * 2. Have an active recurring subscription
 * 
 * This hook combines both lifetime deals and active subscriptions
 * to provide a comprehensive check of paid user status
 * 
 * @returns {boolean} True if user has either a lifetime deal or active subscription, false otherwise
 */
export const useIsPayingUser = (): boolean => {
  // Fetch user's subscription data from the server
  const { data } = useFetchSubscriptionData();
  
  // Extract lifetime deal status from subscription data
  // lifetime deal indicates a one-time payment for permanent access
  const lifeTimeDeal = data?.lifeTimeDeal;

  // Check if user has an active recurring subscription
  const hasActiveSubscription = useHasActiveSubscription();

  // Debugging log (consider removing in production)
  // Logs the result of the check for troubleshooting purposes
  console.log(lifeTimeDeal || hasActiveSubscription, " lifeTimeDeal || hasActiveSubscription");

  // User is considered a paying user if they have either a lifetime deal or active subscription
  return lifeTimeDeal || hasActiveSubscription;
};