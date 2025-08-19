import { useRhythmicRerender } from "@/hooks/useRhythmicRerender"
import { convertDuration } from "@/utils/time/convertDuration"
import { useFetchSubscriptionData } from '@/hooks/useFetchSubscriptionData';

export const useHasFreeTrial = () => {
     const {data} =useFetchSubscriptionData()
     const freeTrialEnd =data?.freeTrialEnd

  const now = useRhythmicRerender(convertDuration(1, "min", "ms"))

  return freeTrialEnd && +freeTrialEnd > now
}