import {  ISubscription} from "@/dataType/Subscription"

export const isActiveSubscription = ({
  endDate,
}: Pick<ISubscription, "endDate">) => {
  if (!endDate) return true

  const endTimestamp = endDate instanceof Date ? endDate.getTime() : +new Date(endDate)
  
  return Date.now() < endTimestamp
}