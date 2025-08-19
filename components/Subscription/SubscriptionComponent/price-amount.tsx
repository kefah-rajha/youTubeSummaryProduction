import { Tier } from '@/contants/tier';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  loading: boolean;
  tier: Tier;
  priceMap: Record<string, string>;
  value: string;
  priceSuffix: string;
}

export function PriceAmount({ loading, priceMap, priceSuffix, tier, value }: Props) {
  console.log(priceMap[tier.priceId[value]],"priceMap[tier.priceId[value]]")
  return (
    <div className="mt-6 flex flex-col px-8">
      {loading ? (
        <Skeleton className="h-[96px] w-full bg-border" />
      ) : (
        <>
        
          <div className={cn('text-[80px] leading-[96px] tracking-[-1.6px] font-medium')}>
            {tier?.priceId[value] == ""? <span className='text-[40px] text-red-500'>No Amount</span> :priceMap[tier?.priceId[value]]?.replace(/\.00$/, '')}
            
          </div>
          <div className={cn('font-medium leading-[12px] text-[12px]')}>{priceSuffix}</div>
        </>
      )}
    </div>
  );
}