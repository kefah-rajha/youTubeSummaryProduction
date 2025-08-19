import { useEffect, useState } from "react"
import { Match } from "@/lib/ui/Match"
import { SubscriptionBillingCycleProvider } from "@/context/SubscriptionBillingCycle"
// import { SubscriptionOffer } from "@/components/Subscription/SubscriptionOffer"
import { SubscriptionCheckout } from "@/components/Subscription/SubscriptionCheckout"
import SubscriptionHome from "@/components/Subscription/SubscriptionComponent/SubscriptionHome"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"
import { X } from "lucide-react"

type SubscriptionPromptStage = "offer" | "checkout"
type OnCloseProp = {
  onClose: () => void
}
export const SubscriptionPrompt = ({ onClose }: OnCloseProp) => {
  const [stage] = useState<SubscriptionPromptStage>("offer")
  const [open, setOpen] = useState(true) // Start with dialog open

  // Handle dialog close event
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      onClose(); // Call the parent's onClose when dialog is closed
    }
  }

  // Watch for stage changes
  useEffect(() => {
    if (stage === "offer") {
      setOpen(true); // Always open dialog when stage is set to "offer"
    }
  }, [stage])


  return (
    <SubscriptionBillingCycleProvider>


      <Match
        value={stage}
        offer={() => (

          <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="w-[90vw] sm:w-[90vw] h-[100vh] overflow-hidden">
              <DialogClose className="fixed right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events shadow-none">
                <X className="w-4 h-4 cursor-pointer" onClick={onClose} />
                <span className="sr-only cursor-pointer">Close</span>
              </DialogClose>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
              </DialogHeader>
              <div className="overflow-auto">
              <SubscriptionHome />
              </div>
              <DialogFooter>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        )}
        checkout={() => <SubscriptionCheckout onClose={onClose} />}
      />
    </SubscriptionBillingCycleProvider>
  )
}





