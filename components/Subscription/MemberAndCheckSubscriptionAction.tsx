import { Opener } from "@/lib/ui/Opener"
import { useCheckSubscriptionTier } from "@/hooks/useCheckSubscriptionTier"
// For now, we need to uncomment this for the code to work
 import { SubscriptionPrompt } from "@/components/Subscription/SubscriptionPrompt"

type Action = () => void

interface RenderProps {
  action: Action
}

interface MemberOnlyActionProps {
  action: () => void
  render: (props: RenderProps) => React.ReactElement
  tiers: string[] 
}

export const MemberOnlyAction = ({ action, render ,tiers }: MemberOnlyActionProps) => {
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