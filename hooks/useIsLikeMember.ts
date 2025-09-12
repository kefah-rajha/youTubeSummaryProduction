import { useIsPayingUser } from "./useIsPayingUser"
import { useHasFreeTrial } from "@/hooks/useHasFreeTrial"

/**
 * Custom hook to determine if a user has member-like privileges
 * 
 * A user is considered "like a member" if they either:
 * 1. Have an active free trial, OR
 * 2. Are a paying user (active subscription)
 * 
 * This hook combines both free trial and paid subscription status
 * to provide a unified membership-like access check
 * 
 * @returns {boolean} True if user has member-like access, false otherwise
 */
export const useIsLikeMember = (): boolean => {
  // Check if user currently has an active free trial
  const hasFreeTrial = useHasFreeTrial()
  
  // Check if user is a currently paying subscriber
  const isPayingUser = useIsPayingUser()

  // User is considered "like a member" if they have either free trial or paid subscription
  return hasFreeTrial || isPayingUser
}