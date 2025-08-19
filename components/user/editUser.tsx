// "use client"
// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import toast from "react-hot-toast";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {

//   RefreshCw,
//   Edit,
  
// } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Switch } from "@/components/ui/switch";
// import { Button } from "../ui/button";
// // Zod schema for user updates
// const userUpdateSchema = z.object({
//   planId: z.string().min(1, "Plan ID is required"),
//   status: z.enum(['active', 'canceled', 'pastDue', 'trialing', 'ended'], {
//     required_error: "Status is required",
//   }),
//   billingCycle: z.enum(['month', 'year'], {
//     required_error: "Billing cycle is required",
//   }),
//   lifeTimeDeal: z.boolean(),
//   endsAt: z.string().optional(),
// });

// type UserUpdateForm = z.infer<typeof userUpdateSchema>;
// function EditUser() {
//       const [dialogOpen, setDialogOpen] = useState(false);
//   const [updateLoading, setUpdateLoading] = useState(false);
//    // Form setup
//     const form = useForm<UserUpdateForm>({
//       resolver: zodResolver(userUpdateSchema),
//       defaultValues: {
//         planId: "",
//         status: "active",
//         billingCycle: "month",
//         lifeTimeDeal: false,
//         endsAt: "",
//       },
//     });
  
//     // Reset form when user data changes
//     useEffect(() => {
//       if (user) {
//         const endsAtDate = user.currentSubscription?.endsAt 
//           ? new Date(user.currentSubscription.endsAt * 1000).toISOString().split('T')[0]
//           : "";
          
//         form.reset({
//           planId: user.currentSubscription?.planId || "",
//           status: user.currentSubscription?.status || "active",
//           billingCycle: user.currentSubscription?.billingCycle || "month",
//           lifeTimeDeal: user.lifeTimeDeal || false,
//           endsAt: endsAtDate,
//         });
//       }
//     }, [user, form]);
    
//       // Handle form submission
//       const onSubmit = async (data: UserUpdateForm) => {
//         setUpdateLoading(true);
        
//         try {
//           // Convert date string to timestamp if provided
//           const endsAtTimestamp = data.endsAt 
//             ? Math.floor(new Date(data.endsAt).getTime() / 1000)
//             : undefined;
    
//           const updatePayload = {
//             currentSubscription: {
//               planId: data.planId,
//               status: data.status,
//               billingCycle: data.billingCycle,
//               startDate: user?.currentSubscription?.startDate || Math.floor(Date.now() / 1000),
//               paymentProcessorSubscriptionId: user?.currentSubscription?.paymentProcessorSubscriptionId || "updated_via_admin",
//               ...(endsAtTimestamp && { endsAt: endsAtTimestamp }),
//             },
//             lifeTimeDeal: data.lifeTimeDeal,
//           };
    
//           const response = await fetch(`/api/user/${userId}`, {
//             method: "PUT",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(updatePayload),
//           });
    
//           if (!response.ok) {
//             throw new Error(`Failed to update user: ${response.statusText}`);
//           }
    
//           const result = await response.json();
          
//           if (result.success === false) {
//             throw new Error(result.message || "Failed to update user");
//           }
    
//           // Update local user state
//           setUser(result.user || { ...user, ...updatePayload });
//           setDialogOpen(false);
//           toast.success("User updated successfully!");
          
//         } catch (err) {
//           console.error("Error updating user:", err);
//           toast.error(err instanceof Error ? err.message : "Failed to update user");
//         } finally {
//           setUpdateLoading(false);
//         }
//       };
    
     
//   return (
//           <div className="flex items-center space-x-2">
//               <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//                 <DialogTrigger asChild>
//                   <Button variant="outline">
//                     <Edit className="h-4 w-4 mr-2" />
//                     Edit User
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent className="w-[70%] h-[90%] overflow-auto ">
//                   <DialogHeader>
//                     <DialogTitle>Edit User Subscription</DialogTitle>
//                     <DialogDescription>
//                       Update the users plan and subscription status. Changes will be applied immediately.
//                     </DialogDescription>
//                   </DialogHeader>
                  
//                   <Form {...form}>
//                     <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//                       <FormField
//                         control={form.control}
//                         name="planId"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Plan ID</FormLabel>
//                             <FormControl>
//                               <Input placeholder="Enter plan ID" {...field} />
//                             </FormControl>
//                             <FormDescription>
//                               The subscription plan identifier
//                             </FormDescription>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
    
//                       <FormField
//                         control={form.control}
//                         name="status"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Subscription Status</FormLabel>
//                             <Select onValueChange={field.onChange} defaultValue={field.value}>
//                               <FormControl>
//                                 <SelectTrigger>
//                                   <SelectValue placeholder="Select status" />
//                                 </SelectTrigger>
//                               </FormControl>
//                               <SelectContent>
//                                 <SelectItem value="active">Active</SelectItem>
//                                 <SelectItem value="trialing">Trialing</SelectItem>
//                                 <SelectItem value="canceled">Canceled</SelectItem>
//                                 <SelectItem value="pastDue">Past Due</SelectItem>
//                                 <SelectItem value="ended">Ended</SelectItem>
//                               </SelectContent>
//                             </Select>
//                             <FormDescription>
//                               Current subscription status
//                             </FormDescription>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
    
//                       <FormField
//                         control={form.control}
//                         name="billingCycle"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Billing Cycle</FormLabel>
//                             <Select onValueChange={field.onChange} defaultValue={field.value}>
//                               <FormControl>
//                                 <SelectTrigger>
//                                   <SelectValue placeholder="Select billing cycle" />
//                                 </SelectTrigger>
//                               </FormControl>
//                               <SelectContent>
//                                 <SelectItem value="month">Monthly</SelectItem>
//                                 <SelectItem value="year">Yearly</SelectItem>
//                               </SelectContent>
//                             </Select>
//                             <FormDescription>
//                               How often the user is billed
//                             </FormDescription>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
    
//                       <FormField
//                         control={form.control}
//                         name="endsAt"
//                         render={({ field }) => (
//                           <FormItem>
//                             <FormLabel>Subscription End Date</FormLabel>
//                             <FormControl>
//                               <Input type="date" {...field} />
//                             </FormControl>
//                             <FormDescription>
//                               When the subscription ends (optional)
//                             </FormDescription>
//                             <FormMessage />
//                           </FormItem>
//                         )}
//                       />
    
//                       <FormField
//                         control={form.control}
//                         name="lifeTimeDeal"
//                         render={({ field }) => (
//                           <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
//                             <div className="space-y-0.5">
//                               <FormLabel className="text-base">Lifetime Deal</FormLabel>
//                               <FormDescription>
//                                 Grant this user lifetime access to all features
//                               </FormDescription>
//                             </div>
//                             <FormControl>
//                               <Switch
//                                 checked={field.value}
//                                 onCheckedChange={field.onChange}
//                               />
//                             </FormControl>
//                           </FormItem>
//                         )}
//                       />
    
//                       <DialogFooter>
//                         <Button
//                           type="button"
//                           variant="outline"
//                           onClick={() => setDialogOpen(false)}
//                           disabled={updateLoading}
//                         >
//                           Cancel
//                         </Button>
//                         <Button type="submit" disabled={updateLoading}>
//                           {updateLoading ? (
//                             <>
//                               <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
//                               Updating...
//                             </>
//                           ) : (
//                             "Update User"
//                           )}
//                         </Button>
//                       </DialogFooter>
//                     </form>
//                   </Form>
//                 </DialogContent>
//               </Dialog>
//             </div>
//   )
// }

// export default EditUser