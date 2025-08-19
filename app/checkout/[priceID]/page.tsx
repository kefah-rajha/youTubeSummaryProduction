"use client"
import React from 'react'
import PaddleCheckoutPage from "@/components/Subscription/checkOut/checkout"
import '@/style/checkout.css';
import { CheckoutGradients } from '@/components/gradients/checkout-gradients';
import { useParams } from 'next/navigation';


function Page() {
     const params = useParams();
    const priceId = params?.priceID as string;
  return (
    <div>
       <div className={'w-full min-h-screen relative overflow-hidden'}>
      <CheckoutGradients />
      <div
        className={'mx-auto max-w-6xl relative px-[16px] md:px-[32px] py-[24px] flex flex-col gap-6 justify-between'}
      ></div>
        <PaddleCheckoutPage priceId={priceId} />
    </div>
    </div>
  )
}

export default Page