import { SubscriptionBillingCycleInput } from "@/components/Subscription/SubscriptionBillingCycleInput"
import { SubscriptionPrice } from "@/components/Subscription/SubscriptionPrice"
import { getAnnualSubscriptionSavings } from "@/utils/getAnnualSubscriptionSavings"
import { useSubscriptionBillingCycle } from "@/context/SubscriptionBillingCycle"

// import { MembershipBenefits } from "membership/components/MembershipBenefits"
import { SubscriptionPricesQueryDependant } from "@/components/paddle-ui/SubscriptionPricesQueryDependant"

export const SubscriptionOffer = () => {
  const [billingCycle, setBillingCycle] = useSubscriptionBillingCycle()

  return (
    <div>
      <SubscriptionPricesQueryDependant
        success={(prices: { year: { amount: number; currency: string }; month: { amount: number } }) => (
          <>
            <SubscriptionBillingCycleInput
              value={billingCycle}
              onChange={setBillingCycle}
              saving={getAnnualSubscriptionSavings(
                prices.year.amount,
                prices.month.amount
              )}
            />
            <SubscriptionPrice
              currency={prices.year.currency}
              billingCycle={billingCycle}
              price={{
                month: prices.month.amount,
                year: prices.year.amount,
              }}
            />
          </>
        )}
      />
      {/* <MembershipBenefits /> */}
    </div>
  )
}