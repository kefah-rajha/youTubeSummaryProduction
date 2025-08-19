import { Opener } from "@/lib/ui/Opener"
import { useIsLikeMember } from "@/hooks/useIsLikeMember"
// For now, we need to uncomment this for the code to work
 import { SubscriptionPrompt } from "@/components/Subscription/SubscriptionPrompt"

type Action = () => void

interface RenderProps {
  action: Action
}

interface MemberOnlyActionProps {
  action: () => void
  render: (props: RenderProps) => React.ReactElement
}

export const MemberOnlyAction = ({ action, render }: MemberOnlyActionProps) => {
  const isLikeMember = useIsLikeMember()

  if (isLikeMember) {
    return render({ action })
  }

  return (
    <Opener
      renderOpener={({ onOpen }) => render({ action: onOpen })}
      renderContent={({ onClose }) => <SubscriptionPrompt onClose={onClose} />}
    />
  )
}