import { Paddle, PricePreviewParams } from '@paddle/paddle-js';
import { useEffect, useState, useCallback } from 'react';
import { getTier } from "@/services/subscriptionTier-fetch/getTier"

export type PaddlePrices = Record<string, string>;

// تعريف أنواع للبيانات
interface PriceId {
  month: string;
  year: string;
}

interface PricingTier {
  id: string;
  name: string;
  description: string;
  priceId: PriceId;
  // أضف خصائص أخرى حسب الحاجة
}

interface PaddleErrorDetail {
  field?: string;
  message: string;
}

interface PaddleErrorResponse {
  code: string;
  detail: string;
  documentation_url: string;
  errors: PaddleErrorDetail[];
  type: string;
}

interface PaddleApiError {
  error: PaddleErrorResponse;
  meta: {
    request_id: string;
  };
}

export function usePaddlePrices(
  paddle: Paddle | undefined,
  country: string,
): { prices: PaddlePrices; loading: boolean; error: string | null } {
  const [prices, setPrices] = useState<PaddlePrices>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [pricingTier, setPricingTier] = useState<PricingTier[]>([]);
  const [error, setError] = useState<string | null>(null);

  // جلب بيانات الـ PricingTier
  useEffect(() => {
    const fetchPricingTier = async () => {
      try {
        const response = await getTier();
        // التحقق من أن البيانات تأتي بالشكل المتوقع
        if (Array.isArray(response?.data)) {
          setPricingTier(response.data);
        } else {
          throw new Error('Invalid pricing tiers data');
        }
      } catch (err) {
        console.error('Failed to fetch pricing tiers:', err);
        setError('Failed to load subscription plans');
        setLoading(false);
      }
    };

    fetchPricingTier();
  }, []);

  // إنشاء العناصر مع التحقق من صحة priceId
  const getLineItems = useCallback((): PricePreviewParams['items'] => {
    const validPriceIds: string[] = [];

    pricingTier.forEach((tier) => {
      // التحقق من وجود priceId وتطابقه مع النمط المطلوب
      const isValidPriceId = (id: string | undefined): id is string => 
        !!id && /^pri_[a-z\d]{26}$/.test(id);

      if (isValidPriceId(tier.priceId.month)) {
        validPriceIds.push(tier.priceId.month);
      }
      if (isValidPriceId(tier.priceId.year)) {
        validPriceIds.push(tier.priceId.year);
      }
    });

    return validPriceIds.map(priceId => ({ priceId, quantity: 1 }));
  }, [pricingTier]);

  // جلب الأسعار مع معالجة الأخطاء
  const fetchPrices = useCallback(async () => {
    if (!paddle) {
      setError('Payment system not initialized');
      setLoading(false);
      return;
    }

    const lineItems = getLineItems();
    
    if (lineItems.length === 0) {
      setError('No valid subscription plans found');
      setLoading(false);
      return;
    }

    const paddlePricePreviewRequest: PricePreviewParams = {
      items: lineItems,
      ...(country !== 'OTHERS' && { address: { countryCode: country } }),
    };
console.log(paddle,"paddlePricePreviewRequest")
    try {
      const pricesResponse = await paddle.PricePreview(paddlePricePreviewRequest);
      console.log(pricesResponse,"pricesResponse 2222")
      
      setPrices(pricesResponse.data.details.lineItems.reduce((acc, item) => {
        acc[item.price.id] = item.formattedTotals.total;
        return acc;
      }, {} as PaddlePrices));
      
      setError(null);
    } catch (err) {
      let errorMessage = 'Failed to load prices';
      
      // معالجة أخطاء Paddle بشكل خاص
      if (isPaddleApiError(err)) {
        const errorDetails = err.error.errors.map(e => 
          `${e.field ? `[${e.field}] ` : ''}${e.message}`
        ).join(', ');
        errorMessage = `Payment error: ${errorDetails}`;
      } 
      // معالجة أخطاء الشبكة العامة
      else if (err instanceof Error) {
        errorMessage = `Network error: ${err.message}`;
      }
      
      console.error('Paddle price preview failed:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [paddle, country, getLineItems]);

  // تشغيل عملية جلب الأسعار عند تحديث البيانات
  useEffect(() => {
    if (pricingTier.length > 0) {
          console.log(pricingTier,"pricingTier test")

      fetchPrices();
    }
  }, [pricingTier, fetchPrices]);

  return { prices, loading, error };
}

// دالة مساعدة للتحقق من نوع خطأ Paddle
function isPaddleApiError(err: unknown): err is PaddleApiError {
  if (typeof err !== 'object' || err === null) return false;
  
  const potentialError = err as Record<string, unknown>;
  if (!('error' in potentialError)) return false;
  
  const errorObj = potentialError.error as Record<string, unknown>;
  return (
    typeof errorObj === 'object' &&
    errorObj !== null &&
    'errors' in errorObj &&
    Array.isArray(errorObj.errors)
  );
}