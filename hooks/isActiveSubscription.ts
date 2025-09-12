import { ISubscription } from "@/dataType/Subscription"

/**
 * Utility function to determine if a subscription is currently active
 * 
 * Checks whether the current date/time is before the subscription's end date
 * A subscription is considered active if it has no end date or if the end date is in the future
 * 
 * @param params - Object containing the endDate property from ISubscription
 * @param params.endDate - The expiration date of the subscription (optional)
 * @returns Boolean indicating whether the subscription is currently active
 */
export const isActiveSubscription = ({
  endDate,
}: Pick<ISubscription, "endDate">): boolean => {
  // If no end date is provided, consider the subscription as active (no expiration)
  if (!endDate) return true;

  // Convert endDate to timestamp for comparison
  // Handles both Date objects and date strings by converting to timestamp
  const endTimestamp = endDate instanceof Date 
    ? endDate.getTime() 
    : +new Date(endDate);
  
  // Compare current timestamp with subscription end timestamp
  // Returns true if current time is before end date (subscription is active)
  return Date.now() < endTimestamp;
};