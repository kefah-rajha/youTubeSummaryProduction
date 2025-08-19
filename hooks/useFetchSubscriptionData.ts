import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs'; // أو useAuth حسب الحاجة

interface ISubscription {
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


interface SubscriptionData {
  clerkId: string; // Unique ID from Clerk, links to Clerk's user record
  email: string; // User's email address
  firstName?: string; // User's first name (optional)
  lastName?: string; // User's last name (optional)
  settings?: Record<string, unknown>; // Flexible storage for user settings

  // Subscription status fields for quick access
  freeTrialEnd: Date | null; // Timestamp trial ends, or null if no trial
  lifeTimeDeal: boolean; // True if user has lifetime access, false otherwise
  currentSubscriptionId?: ISubscription | null; // Embedded object for current subscription details, or null if no subscription
}

interface UseSubscriptionData {
  data: SubscriptionData | null;
  isLoading: boolean;
  error: Error | null;
}

export const useFetchSubscriptionData = (): UseSubscriptionData => {
  const { userId, isSignedIn } = useAuth(); // استخدم خطاف Clerk للحصول على المستخدم ومعرفه
  const [data, setData] = useState<SubscriptionData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // لا تجلب البيانات إذا لم يكن المستخدم مسجلاً الدخول أو لم يتم تحميل المستخدم بعد
    if (!isSignedIn || !userId) {
      setIsLoading(false); // توقف التحميل إذا لم يكن هناك مستخدم
      // setError(new Error("User not authenticated")); // اختياري: تعيين خطأ إذا لزم الأمر
      return;
    }

    setIsLoading(true);
    setError(null); // مسح أي أخطاء سابقة

   // معرف المستخدم من Clerk

    const fetchSubscription = async () => {
      try {
        // قم بطلب الـ REST API الخاص بك باستخدام معرف المستخدم
        const response = await fetch(`http://localhost:5000/api/user/getUser/${userId}`); // مثال لمسار API
        
        if (!response.ok) {
          throw new Error(`Error fetching subscription: ${response.statusText}`);
        }

        const result = await response.json();
        console.log(result.data[0],"result")
        setData(result.data[0]); // تحديث حالة البيانات بالنتيجة

      } catch (err:unknown) {
        setError(err as Error); // تحديث حالة الخطأ
        setData(null); // مسح البيانات في حالة وجود خطأ
      } finally {
        setIsLoading(false); // إنهاء حالة التحميل بغض النظر عن النتيجة
      }
    };

    fetchSubscription();


    return () => {
      // إلغاء الطلب إذا كان ممكناً
    };

  }, [userId, isSignedIn]); // أعد تشغيل التأثير إذا تغير معرف المستخدم أو حالة تسجيل الدخول

  return { data, isLoading, error };
};