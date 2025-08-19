import React, { useState } from 'react'
import Checkout from "@/components/Subscription/checkOut/checkout"
import { X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog"
type OnCloseProp = {
  onClose: () => void
}
export function SubscriptionCheckout({ onClose }: OnCloseProp) {
    console.log(onClose)
      const [open, setOpen] = useState(true) // Start with dialog open
    
      // Handle dialog close event
      const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
          onClose(); // Call the parent's onClose when dialog is closed
        }
      }
  return (
    <div>
 <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[625px]">
              <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events shadow-none">
                <X className="w-4 h-4 cursor-pointer" onClick={onClose} />
                <span className="sr-only cursor-pointer">Close</span>
              </DialogClose>
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
              </DialogHeader>
               <Checkout priceId={''} /> 
              <DialogFooter>
              
              </DialogFooter>
            </DialogContent>
          </Dialog>

    </div>
  )
}

