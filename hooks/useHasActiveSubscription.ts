import { useRhythmicRerender } from "@/hooks/useRhythmicRerender"
import { convertDuration } from "@/utils/time/convertDuration"
import { useFetchSubscriptionData } from '@/hooks/useFetchSubscriptionData';
import { isActiveSubscription } from "@/hooks/isActiveSubscription"

export const useHasActiveSubscription = () => {
   const {data} =useFetchSubscriptionData()
     const subscription =data?.currentSubscriptionId 
     console.log(subscription,"subscription")

  useRhythmicRerender(convertDuration(1, "min", "ms"))

  if (!subscription) return false

  return isActiveSubscription(subscription)
}