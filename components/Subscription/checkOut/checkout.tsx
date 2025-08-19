'use client';
import { useEffect, useState } from 'react';
import { type Environments, initializePaddle, type Paddle } from '@paddle/paddle-js';
import type { CheckoutEventsData } from '@paddle/paddle-js/types/checkout/events';
import { useAuth, useUser } from '@clerk/nextjs';
// import { getCheckoutUrl } from "@/services/paddle-fetch/getCheckoutUrl"
import { useRouter } from 'next/navigation';
interface PaddleCheckoutPageType {
    priceId: string
}
export default function PaddleCheckoutPage({ priceId }: PaddleCheckoutPageType) {
    const { userId } = useAuth();
    const user = useUser()
    console.log(user?.user?.primaryEmailAddress?.emailAddress, "userId")
    const { push } = useRouter()


    useEffect(() => {
        if (!userId) {
            push("/sign-up")
        }
    })
    // const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    console.log(priceId, "priceId")
    // const [quantity, setQuantity] = useState<number>(1);
    const [paddle, setPaddle] = useState<Paddle | null>(null);
    const [checkoutData, setCheckoutData] = useState<CheckoutEventsData | null>(null);
    const userEmail = user?.user?.primaryEmailAddress?.emailAddress
    console.log(checkoutData, userId)
    const handleCheckoutEvents = (event: CheckoutEventsData) => {
        setCheckoutData(event);
    };

    useEffect(() => {
        const setupPaddle = async () => {
            try {


                if (!userId) return;
                console.log(userId, "inSide")
                // 1. جلب بيانات Checkout
                // const txnId = await getCheckoutUrl(userId)
                // console.log(txnId, "txnId")

                // if (!txnId) throw new Error('Missing checkout URL');
                // console.log(process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN, process.env.NEXT_PUBLIC_PADDLE_ENV, "test")

                // 3. تحميل Paddle بشكل غير متزامن
                if (!paddle?.Initialized && process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN && process.env.NEXT_PUBLIC_PADDLE_ENV) {
                    console.log(process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN, process.env.NEXT_PUBLIC_PADDLE_ENV, "test1111")

                    initializePaddle({
                        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
                        environment: process.env.NEXT_PUBLIC_PADDLE_ENV as Environments,
                        eventCallback: (event) => {
                            if (event.data && event.name) {
                                handleCheckoutEvents(event.data);
                            }
                        },
                        checkout: {
                            settings: {
                                variant: 'one-page',
                                displayMode: 'inline',
                                theme: 'dark',
                                // allowLogout: !userEmail,
                                frameTarget: 'paddle-checkout-frame',
                                frameInitialHeight: 450,
                                frameStyle: 'width: 100%; background-color: transparent; border: none',
                                successUrl: '/checkout/success',
                            },
                        },
                    }).then(async (paddle) => {
                        if (paddle && priceId) {
                            setPaddle(paddle);
                            paddle.Checkout.open({
                                ...(userEmail && { customer: { email: userEmail } }),
                                items: [{ priceId: priceId, quantity: 1 }],
                                customData: {
                                    user_id: userId, // أضف المعرف الداخلي للمستخدم
                                    internal_user_id: userId // يمكنك استخدام أي اسم مناسب
                                }
                            });
                        }
                    });
                }

            } catch (err) {
                console.error('Checkout error:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setIsLoading(false);
            }
        };

        setupPaddle();

        // تنظيف الاشتراكات عند إلغاء المكون
        // return () => {
        //   const cleanup = async () => {
        //     const paddle = await Paddle.({ environment: 'sandbox' });
        //     paddle.Checkout.close();
        //   };
        //   cleanup();
        // };
    }, [paddle?.Initialized, userId,priceId,userEmail]);

    return (
        <div
            className={
                'rounded-lg bg-foreground/60 md:backdrop-blur-[24px]  flex flex-col justify-between relative w-[90%] m-auto'
            }
        >

            {isLoading && <p>جاري تحميل بوابة الدفع...</p>}
            {error && <p className="text-red-500">خطأ: {error}</p>}
            <div
            >
                <div className={'flex flex-col md:flex-row gap-8 md:gap-16 '}>
                    <div className={'w-full md:w-[400px]'}>
                    </div>
                    <div className={'min-w-[375px] lg:min-w-[535px]'}>
                        <div className={'text-base leading-[20px] font-semibold mb-8 mt-8 text-white'}>Payment details</div>
                        <div className={'paddle-checkout-frame'} />
                    </div>
                </div>
            </div>

        </div>
    );
}