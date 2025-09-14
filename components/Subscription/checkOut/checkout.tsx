'use client';
import { useEffect, useState } from 'react';
import { type Environments, initializePaddle, type Paddle } from '@paddle/paddle-js';
import type { CheckoutEventsData } from '@paddle/paddle-js/types/checkout/events';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

interface PaddleCheckoutPageType {
    priceId: string;
}

/**
 * PaddleCheckoutPage Component
 * 
 * A React component that handles Paddle checkout integration for subscription payments.
 * This component initializes Paddle, handles user authentication, and displays the checkout interface.
 * 
 * @param priceId - The price ID of the subscription plan to be purchased
 * @returns React component with Paddle checkout integration
 */
export default function PaddleCheckoutPage({ priceId }: PaddleCheckoutPageType) {
    // Authentication and user data
    const { userId } = useAuth();
    const user = useUser();
    const { push } = useRouter();
    
    // Extract user email for pre-filling checkout form
    const userEmail = user?.user?.primaryEmailAddress?.emailAddress;
    
    // State management
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [paddle, setPaddle] = useState<Paddle | null>(null);
    const [checkoutData, setCheckoutData] = useState<CheckoutEventsData | null>(null);
    console.log(checkoutData)
    // Redirect to sign-up if user is not authenticated
    useEffect(() => {
        if (!userId) {
            push("/sign-up");
        }
    }, [userId, push]);

    /**
     * Handles checkout events from Paddle
     * @param event - Checkout event data from Paddle
     */
    const handleCheckoutEvents = (event: CheckoutEventsData) => {
        setCheckoutData(event);
        // You can add additional event handling logic here
        // For example: tracking conversions, updating user status, etc.
    };

    // Initialize Paddle and setup checkout
    useEffect(() => {
        const setupPaddle = async () => {
            try {
                // Skip setup if user is not authenticated
                if (!userId) return;
                
                // Initialize Paddle if not already initialized and environment variables are set
                if (!paddle?.Initialized && process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN && process.env.NEXT_PUBLIC_PADDLE_ENV) {
                    console.log('Initializing Paddle with token:', process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN);
                    
                    initializePaddle({
                        // Paddle client token from environment variables
                        token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN,
                        // Paddle environment (sandbox or production)
                        environment: process.env.NEXT_PUBLIC_PADDLE_ENV as Environments,
                        // Event callback for handling checkout events
                        eventCallback: (event) => {
                            if (event.data && event.name) {
                                handleCheckoutEvents(event.data);
                            }
                        },
                        // Checkout configuration
                        checkout: {
                            settings: {
                                variant: 'one-page', // One-page checkout flow
                                displayMode: 'inline', // Embed checkout in page
                                theme: 'dark', // Dark theme
                                // allowLogout: !userEmail, // Allow logout option
                                frameTarget: 'paddle-checkout-frame', // Target element for checkout iframe
                                frameInitialHeight: 450, // Initial height of checkout iframe
                                frameStyle: 'width: 100%; background-color: transparent; border: none', // Iframe styling
                                successUrl: '/success', // Redirect URL after successful payment
                            },
                        },
                    }).then(async (paddleInstance) => {
                        if (paddleInstance && priceId) {
                            setPaddle(paddleInstance);
                            
                            // Open checkout with configured items and customer data
                            paddleInstance.Checkout.open({
                                // Pre-fill customer email if available
                                ...(userEmail && { customer: { email: userEmail } }),
                                // Items to purchase (subscription plan)
                                items: [{ priceId: priceId, quantity: 1 }],
                                // Custom data to associate with the transaction
                                customData: {
                                    user_id: userId, // Internal user ID for reference
                                    internal_user_id: userId // Additional user reference
                                }
                            });
                        }
                    });
                }

            } catch (err) {
                console.error('Checkout initialization error:', err);
                setError(err instanceof Error ? err.message : 'Unknown error occurred during checkout setup');
            } finally {
                setIsLoading(false);
            }
        };

        setupPaddle();

      
    }, [paddle?.Initialized, userId, priceId, userEmail]);

    return (
        <div
            className={
                'rounded-lg bg-foreground/60 md:backdrop-blur-[24px] flex flex-col justify-between relative w-[90%] m-auto'
            }
        >
            {/* Loading state */}
            {isLoading && <p>Loading payment gateway...</p>}
            
            {/* Error state */}
            {error && <p className="text-red-500">Error: {error}</p>}
            
            <div>
                <div className={'flex flex-col md:flex-row gap-8 md:gap-16'}>
                    <div className={'w-full md:w-[400px]'}>
                        {/* Additional content can be added here */}
                    </div>
                    
                    <div className={'min-w-[375px] lg:min-w-[535px]'}>
                        {/* Checkout section header */}
                        <div className={'text-base leading-[20px] font-semibold mb-8 mt-8 text-white'}>
                            Payment details
                        </div>
                        
                        {/* Paddle checkout iframe container */}
                        <div className={'paddle-checkout-frame'} />
                    </div>
                </div>
            </div>
        </div>
    );
}