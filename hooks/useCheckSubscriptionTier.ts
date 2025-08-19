import { useFetchSubscriptionData } from '@/hooks/useFetchSubscriptionData';


export const useCheckSubscriptionTier = ( tiers : string[]) => {
    const { data } = useFetchSubscriptionData()
    const subscriptionTier = data?.currentSubscriptionId
    console.log(subscriptionTier, "subscriptionTier")
    const checkSubscriptionTier = tiers.some((tier: string) => {
        return subscriptionTier?.productName === tier
    })
    return checkSubscriptionTier

}
