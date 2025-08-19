'use client'
// import { PricingTier } from '@/contants/tier';
import { IBillingFrequency } from '@/contants/billing-frequency';
import { FeaturesList } from '@/components/Subscription/SubscriptionComponent/features-list';
import { PriceAmount } from '@/components/Subscription/SubscriptionComponent/price-amount';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { PriceTitle } from '@/components/Subscription/SubscriptionComponent/price-title';
import { Separator } from '@/components/ui/separator';
import { FeaturedCardGradient } from '@/components/gradients/featured-card-gradient';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import { getTier } from "@/services/subscriptionTier-fetch/getTier"
import { useEffect, useState } from 'react';
import { Tier } from '@/contants/tier';
import toast from 'react-hot-toast';

interface Props {
  loading: boolean;
  frequency: IBillingFrequency;
  priceMap: Record<string, string>;
}

export function PriceCards({ loading, frequency, priceMap }: Props) {
  const pathname = usePathname()
  const isDashboardPath = pathname.includes('/dashboard');
  const [PricingTier, setPricingTier] = useState<[]>([])
  useEffect(() => {
    const getTiersSub = async () => {
      try {
        const Tiers = await getTier()
        console.log(Tiers, "Tiers test")
        if (Tiers) {
          setPricingTier(Tiers.data)
        }
      }catch(err ){
        console.error('Error creating tier:', err,"in function");
          toast.error((err as Error).message, {
            id: 'tier-fetch-error', // لمنع تكرار الإشعار
        });

      }
     
    }
    getTiersSub()

  }, [])

  return (
    <div className="isolate mx-auto grid grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3 ">
      {PricingTier?.map((tier: Tier) => (
        <div key={tier.id} className={cn('rounded-lg bg-background/70 shadow-md backdrop-blur-[6px] overflow-hidden')}>
          <div className={cn('flex gap-5 flex-col rounded-lg rounded-b-none pricing-card-border')}>
            {tier.featured && <FeaturedCardGradient />}
            <PriceTitle tier={tier} />
            <PriceAmount
              loading={loading}
              tier={tier}
              priceMap={priceMap}
              value={frequency.value}
              priceSuffix={frequency.priceSuffix}
            />
            <div className={'px-8'}>
              <Separator className={'bg-border'} />
            </div>
            <div className={'px-8 text-[16px] leading-[24px]'}>{tier.description}</div>
          </div>
          <div className={'px-8 mt-8'}>
            {isDashboardPath ? (
              <Button className={'w-full bg-white/80 shadow-md'} variant={'secondary'} asChild={true}>
                <Link href={`/dashboard/Subscription/${tier._id}`}>Edit</Link>
              </Button>
            ) : (
              <Button className={'w-full'} variant={'secondary'} asChild={true}>
                <Link href={`/checkout/${tier.priceId[frequency.value]}`}>Get started</Link>
              </Button>
            )}
          </div>
          <FeaturesList tier={tier} />
        </div>
      ))}
    </div>
  );
}