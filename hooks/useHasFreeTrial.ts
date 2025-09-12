import { useRhythmicRerender } from "@/hooks/useRhythmicRerender"
import { convertDuration } from "@/utils/time/convertDuration"
import { useFetchSubscriptionData } from '@/hooks/useFetchSubscriptionData';

/**
 * Custom hook to determine if a user currently has an active free trial
 * 
 * This hook checks the user's subscription data to see if they have an active free trial
 * that hasn't expired yet. It also automatically re-renders every minute to update
 * the trial status in real-time as time passes.
 * 
 * @returns {boolean} True if user has an active free trial that hasn't expired, false otherwise
 */export const useHasFreeTrial = () => {
  // Fetch user subscription data from the server
  // Contains information about free trial status and expiration
  const { data } = useFetchSubscriptionData();
  
  // Extract the free trial end timestamp from subscription data
  const freeTrialEnd = data?.freeTrialEnd;

  // Get current timestamp for comparison
  const now = Date.now();
  
  // Calculate remaining time until trial expiration in milliseconds
  // If freeTrialEnd is undefined, default to 0 (no time remaining)
  const timeRemaining = freeTrialEnd ? +freeTrialEnd - now : 0;
  
  // Set default refresh interval to 1 hour (3600000 milliseconds)
  let refreshInterval = 60 * 60 * 1000;

  // If less than 24 hours remaining, refresh more frequently (every 15 minutes)
  if (timeRemaining < 24 * 60 * 60 * 1000) {
    refreshInterval = 15 * 60 * 1000; // 15 minutes in milliseconds
  }
  
  // If less than 1 hour remaining, refresh even more frequently (every minute)
  if (timeRemaining < 60 * 60 * 1000) {
    refreshInterval = 60 * 1000; // 1 minute in milliseconds
  }
  
  // Use rhythmic rerender hook to get a timestamp that updates at the calculated interval
  // This ensures the component re-renders and re-evaluates trial status appropriately
  const currentTime = useRhythmicRerender(refreshInterval);
  
  // Return true if free trial exists and hasn't expired yet
  // The + operator ensures numeric comparison even if freeTrialEnd is a string
  return freeTrialEnd && +freeTrialEnd > currentTime;
};