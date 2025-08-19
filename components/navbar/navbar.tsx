'use client'


import { UserRound } from 'lucide-react'
import { ModeToggle } from '../header/ModeToggle'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { useFetchSubscriptionData } from '@/hooks/useFetchSubscriptionData'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { SubscriptionStatus } from './SubscriptionStatus'
import { useUser } from '@clerk/nextjs'
import { usePathname } from 'next/navigation';


export default function Navbar() {
  const { push } = useRouter()
  const { data, isLoading, error } = useFetchSubscriptionData();
  const { user, isLoaded } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const pathname = usePathname();
  

  // Show error toast when error occurs
  useEffect(() => {
    if (error) {
      toast.error('Failed to load subscription data');
    }
  }, [error]);
  useEffect(() => {
    if (isLoaded && user) {
      const userRole = user.publicMetadata?.role || user.publicMetadata as { role?: string }
      setIsAdmin(userRole === 'admin')
    }
  }, [user, isLoaded])


    if (pathname?.startsWith('/dashboard')) {
    return null;
  }

  return (
    <div className="flex justify-between items-center p-4 fixed w-full h-16 bg-transparent backdrop-filter backdrop-blur-md shadow-lg">

      <div className=" flex justify-between items-center gap-3">

        <ModeToggle />


        <Button variant="outline" size="icon" className='cursor-pointer' onClick={() => {
          push("/profile")
        }}>

          <div>
            <UserRound className='text-green-300 relative z-10' />
          </div>
        </Button>
        <h4>{data?.firstName}</h4>
        <SubscriptionStatus lifeTimeDeal={data?.lifeTimeDeal}
          freeTrialEnd={data?.freeTrialEnd}
          subscriptionStatus={data?.currentSubscriptionId?.status}
          productName={data?.currentSubscriptionId?.productName}
          isLoading={isLoading} />
          <Button variant="outline" size="default" className='cursor-pointer ' onClick={() => {
        push("/Pricing")
      }}>

        <div className='text-green-300'>
          Pricing
        </div>
      </Button>
      </div>
      {user && isAdmin && <Button variant="outline" size="default" className='cursor-pointer ' onClick={() => {
        push("/dashboard")
      }}>

        <div className='text-green-300'>
          Dashboard
        </div>
      </Button>}

      


    </div>
  )
}