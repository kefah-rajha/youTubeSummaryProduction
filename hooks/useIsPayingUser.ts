import { useFetchSubscriptionData } from '@/hooks/useFetchSubscriptionData';
import { useHasActiveSubscription } from "./useHasActiveSubscription"

export const useIsPayingUser = () => {
  const {data} =useFetchSubscriptionData()
     const lifeTimeDeal =data?.lifeTimeDeal
  const hasActiveSubscription = useHasActiveSubscription()
  console.log( lifeTimeDeal || hasActiveSubscription," lifeTimeDeal || hasActiveSubscription")

  return lifeTimeDeal || hasActiveSubscription
}