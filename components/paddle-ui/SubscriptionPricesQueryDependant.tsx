import {
  QueryDependant,
  QueryDependantProps,} from "@/components/fetch-ui/QueryDependant"

// import {
//   SubscriptionPrices, // سنستخدم هذا النوع لبياناتنا الوهمية
//   useSubscriptionPricesQuery, // سنقوم بالتعليق على استخدامه
// } from "../hooks/useSubscriptionPricesQuery"
interface SubscriptionPricesDetails{
    amount:number;
    currency:string

}
interface SubscriptionPrices {
    month:SubscriptionPricesDetails;
    year:SubscriptionPricesDetails
}

type SubscriptionPricesQueryDependantProps = Pick<QueryDependantProps<SubscriptionPrices>, "success">

const mockSubscriptionPrices: SubscriptionPrices = {
  month: { amount: 2499, currency: 'USD' }, // $24.99
  year: { amount: 23999, currency: 'USD' },  // $239.99
};


 const currentMockState = 'success' as 'success' | 'loading' | 'error' // <<< قم بتغيير هذا لاختبار حالات مختلفة

const mockQueryLoading = {
  status: 'loading' as const, // 'as const' لتحديد النوع بدقة
  isLoading: true,
  isError: false,
  data: undefined,
  error: undefined,
};

const mockQueryError = {
  status: 'error' as const,
  isLoading: false,
  isError: true,
  data: undefined,
  error: new Error('Failed to fetch subscription prices (Mock Error)'),
};

const mockQuerySuccess = {
  status: 'success' as const,
  isLoading: false,
  isError: false,
  data: mockSubscriptionPrices,
  error: undefined,
};

export const SubscriptionPricesQueryDependant = ({
  success,
}: SubscriptionPricesQueryDependantProps) => {

 let query: typeof mockQueryLoading | typeof mockQueryError | typeof mockQuerySuccess;

  switch (currentMockState) {
    case 'loading':
      query = mockQueryLoading;
      break;
    case 'error':
      query = mockQueryError;
      break;
    case 'success': // أو default:
      query = mockQuerySuccess;
      break;
    // إذا كان لديك حالات أخرى في QueryStatus، يجب أن تعالجها هنا
  }
  // const query = useSubscriptionPricesQuery(); // << قم بالتعليق على هذا السطر الأصلي

  return (
    <QueryDependant
      {...query}
      error={() => <span>Failed to load subscription price</span>}
      loading={() => (
        <span>Loading</span>
      )}
      success={success}
    />
  )
}