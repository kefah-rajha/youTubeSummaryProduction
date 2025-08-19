import { SubscriptionBillingCycle } from '@/lib/subscription/Subscription'
import { createContext, ReactNode, useContext, useState } from 'react'
export type ChildrenProp = {
  children: ReactNode
}
interface BillingCycleContextValue {
  value: SubscriptionBillingCycle
  setValue: (value: SubscriptionBillingCycle) => void
}

const BillingCycleContext = createContext<BillingCycleContextValue | undefined>(
  undefined,
)

export const SubscriptionBillingCycleProvider = ({
  children,
}: ChildrenProp) => {
  const [value, setValue] = useState<SubscriptionBillingCycle>('year')

  return (
    <BillingCycleContext.Provider value={{ value, setValue }}>
      {children}
    </BillingCycleContext.Provider>
  )
}

export const useSubscriptionBillingCycle = () => {
  const state = useContext(BillingCycleContext)

  if (!state) {
    throw new Error(
      'useSubscriptionBillingCycle must be used within SubscriptionBillingCycleProvider',
    )
  }

  return [state.value, state.setValue] as const
}