
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { 
  Crown, 
  Star, 
  Zap, 
  Gift,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
// Adjust import path as needed


interface SubscriptionStatusProps {
  lifeTimeDeal?: boolean;
  freeTrialEnd?: Date | null;
  subscriptionStatus?: 'active' | 'canceled' | 'past_due' | 'paused' | 'trialing' | 'ended';
  productName?: string;
  isLoading: boolean;
}

export function SubscriptionStatus({ 
  lifeTimeDeal, 
  freeTrialEnd, 
  subscriptionStatus, 
  productName, 
  isLoading 
}: SubscriptionStatusProps) {
  if (isLoading) {
    return <Skeleton className="h-6 w-20 rounded-full" />;
  }

  // Determine subscription status
  const getSubscriptionInfo = () => {
    // Lifetime Deal
    if (lifeTimeDeal) {
      return {
        label: 'Lifetime',
        icon: Crown,
        bgColor: 'bg-gradient-to-r from-yellow-500 to-orange-500',
        textColor: 'text-white',
        borderColor: 'border-yellow-400',
        tooltip: `Lifetime Deal - Premium access forever`
      };
    }

    // Has active subscription
    if (subscriptionStatus && productName) {
      switch (subscriptionStatus) {
        case 'active':
          return {
            label: productName,
            icon: CheckCircle,
            bgColor: 'bg-gradient-to-r from-green-300 to-emerald-500',
            textColor: 'text-white',
            borderColor: 'border',
            tooltip: `Active ${productName} subscription`
          };
        
        case 'trialing':
          return {
            label: `${productName} Trial`,
            icon: Clock,
            bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
            textColor: 'text-white',
            borderColor: 'border-blue-400',
            tooltip: `Free trial of ${productName}`
          };
        
        case 'past_due':
          return {
            label: 'Past Due',
            icon: AlertCircle,
            bgColor: 'bg-gradient-to-r from-yellow-500 to-amber-500',
            textColor: 'text-white',
            borderColor: 'border-yellow-400',
            tooltip: `Payment past due for ${productName}`
          };
        
        case 'paused':
          return {
            label: 'Paused',
            icon: Clock,
            bgColor: 'bg-gradient-to-r from-gray-500 to-slate-500',
            textColor: 'text-white',
            borderColor: 'border-gray-400',
            tooltip: `${productName} subscription paused`
          };
        
        case 'canceled':
        case 'ended':
          return {
            label: 'Canceled',
            icon: XCircle,
            bgColor: 'bg-gradient-to-r from-red-500 to-rose-500',
            textColor: 'text-white',
            borderColor: 'border-red-400',
            tooltip: `${productName} subscription canceled`
          };
        
        default:
          return {
            label: productName,
            icon: Star,
            bgColor: 'bg-gradient-to-r from-purple-500 to-indigo-500',
            textColor: 'text-white',
            borderColor: 'border-purple-400',
            tooltip: `${productName} subscription`
          };
      }
    }

    // Check for free trial
    if (freeTrialEnd) {
      const trialEndDate = new Date(freeTrialEnd);
      const now = new Date();
      const isTrialActive = trialEndDate > now;
      
      if (isTrialActive) {
        const daysLeft = Math.ceil((trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return {
          label: `Trial (${daysLeft}d)`,
          icon: Gift,
          bgColor: 'bg-gradient-to-r from-blue-500 to-cyan-500',
          textColor: 'text-white',
          borderColor: 'border-blue-400',
          tooltip: `Free trial ends in ${daysLeft} days`
        };
      }
    }

    // Default to free
    return {
      label: 'Free',
      icon: Zap,
      bgColor: 'bg-gradient-to-r from-gray-400 to-gray-500',
      textColor: 'text-white',
      borderColor: 'border-gray-300',
      tooltip: 'Free plan - Upgrade to unlock premium features'
    };
  };

  const statusInfo = getSubscriptionInfo();
  const IconComponent = statusInfo.icon;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={`
              ${statusInfo.bgColor} 
              ${statusInfo.textColor} 
              ${statusInfo.borderColor}
              px-3 py-1.5 
              font-medium 
              text-xs
              shadow-lg
              hover:shadow-xl
              transition-all
              duration-200
              cursor-pointer
              border-2
            `}
          >
            <IconComponent className="w-3 h-3 mr-1.5" />
            {statusInfo.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{statusInfo.tooltip}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
