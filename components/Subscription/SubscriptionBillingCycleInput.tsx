import { toPercents } from "@/utils/toPercents"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

import { SubscriptionBillingCycle } from '@/lib/subscription/Subscription'

interface SubscriptionBillingCycleInputProps {
  saving: number;
  value:string;
  onChange:(value:SubscriptionBillingCycle
)=>void
}

export const SubscriptionBillingCycleInput = ({
  value,
  onChange,
  saving,
}: SubscriptionBillingCycleInputProps) => {
  return (
    <div>
     <div className="flex items-center space-x-2">
        <Switch id="billing-toggle" checked={  value=== "year"} onCheckedChange={(value:boolean)=>onChange(value? "year" : "month")} />
        <Label htmlFor="billing-toggle">Annual billing</Label>
      </div>
      <span > {toPercents(saving, "round")}</span>
    </div>
  )
}