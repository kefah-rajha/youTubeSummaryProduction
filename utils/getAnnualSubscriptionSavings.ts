import { MONTHS_IN_YEAR } from '@/utils/time/timeIndex'

export const getAnnualSubscriptionSavings = (
  annualPrice: number,
  monthlyPrice: number,
) => {
  const monthlyYearTotal = monthlyPrice * MONTHS_IN_YEAR

  return (monthlyYearTotal - annualPrice) / monthlyYearTotal
}