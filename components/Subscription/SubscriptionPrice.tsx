import { SubscriptionBillingCycle } from '@/lib/subscription/Subscription'

import { MONTHS_IN_YEAR } from "@/utils/time/timeIndex"
// import { HStackSeparatedBy, slashSeparator } from "../../ui/StackSeparatedBy"
// import { Text } from "../../ui/Text"

interface SubscriptionPriceProps {
  billingCycle: SubscriptionBillingCycle
  currency: string
  price: Record<SubscriptionBillingCycle, number>
}

const monthsInPeriod: Record<SubscriptionBillingCycle, number> = {
  month: 1,
  year: MONTHS_IN_YEAR,
}

export const SubscriptionPrice = ({
  billingCycle,
  currency,
  price,
}: SubscriptionPriceProps) => {
  return (
    <div >
      <div >
        <span >
          {currency}
        </span>
        <div
          
        >
          <span >
            {(price[billingCycle] / monthsInPeriod[billingCycle]).toFixed(2)}
          </span>
          <span >
            mo
          </span>
        </div>
      </div>
      <span
       
      >
        {currency}
        {price[billingCycle]} per year
      </span>
    </div>
  )
}