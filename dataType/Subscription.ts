export interface ISubscription {
  user: string;
  paddleSubscriptionId: string;
  status: 'active' | 'canceled' | 'past_due' | 'paused' | 'trialing' | 'ended';
  planId: string;
  planName: string;
  priceId: string;
  productId: string;
  productName: string;
  transactionId: string;
  currency: string;
  amount: number;
  billingCycle: {
    interval: 'day' | 'week' | 'month' | 'year';
    frequency: number;
  };
  startDate: Date;
  nextBillingDate?: Date;
  endDate?: Date;
  canceledAt?: Date;
  pausedAt?: Date;
  trialEnd?: Date;
  customData?: {
    user_id?: string;
    internal_user_id?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  items: Array<{
    priceId: string;
    productId: string;
    quantity: number;
    amount: number;
  }>;
  history: Array<{
    eventType: string;
    eventDate: Date;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    changes: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata?: Record<string, any>;
  }>;
}
export interface IUserBase {
  clerkId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  settings?: Record<string, any>;
  paddleCustomerId?: string;
  freeTrialEnd?: Date | null;
  lifeTimeDeal?: boolean;
  currentSubscriptionId: ISubscription |null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}


export interface Tier {
  name: string;
  _id:string;
  id: 'starter' | 'pro' | 'advanced';
  icon: string;
  description: string;
  features: string[];
  featured: boolean;
  priceId: Record<string, string>;
}
