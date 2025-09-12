import { Opener } from "@/lib/ui/Opener"
import { useCheckSubscriptionTier } from "@/hooks/useCheckSubscriptionTier"
// For now, we need to uncomment this for the code to work
 import { SubscriptionPrompt } from "@/components/Subscription/SubscriptionPrompt"

type Action = () => void
type ActionFun = (...args: any[]) => void | Promise<void>;

interface RenderProps {
  action: Action
}

type Tier = "Advanced" | "pro" | "starter";

interface MemberOnlyActionProps {
  action: ActionFun
  render: (props: RenderProps) => React.ReactElement
  tiers: Tier[] 
}

export const MemberAndCheckSubscriptionAction = ({ action, render ,tiers }: MemberOnlyActionProps) => {
  const IsSubscriptionTier = useCheckSubscriptionTier(tiers)

  if (IsSubscriptionTier) {
    return render({ action })
  }

  return (
    <Opener
      renderOpener={({ onOpen }) => render({ action: onOpen })}
      renderContent={({ onClose }) => <SubscriptionPrompt onClose={onClose} />}
    />
  )
}