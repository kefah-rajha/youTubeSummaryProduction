import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Edit } from 'lucide-react';

// Zod schema for tier validation
const tierSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  icon: z.string().min(1, 'Icon is required'),
  id:z.string().min(1, 'Icon is required'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  features: z.array(z.string().min(1, 'Feature cannot be empty')).min(1, 'At least one feature is required'),
  featured: z.boolean(),
  priceId: z.object({
    month: z.string().min(1, 'Monthly price ID is required'),
    year: z.string().min(1, 'Yearly price ID is required'),
  }),
});

type TierFormData = z.infer<typeof tierSchema>;

interface ITier {
  _id: string;
  name: string;
  id: string;
  icon: string;
  description: string;
  features: string[];
  featured: boolean;
  priceId: {
    month: string;
    year: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface EditTierDialogProps {
  tier: ITier;
  onSave: (data: TierFormData) => Promise<void>;
}

export function EditTierDialog({ tier, onSave }: EditTierDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newFeature, setNewFeature] = useState('');

  const form = useForm<TierFormData>({
    resolver: zodResolver(tierSchema),
    defaultValues: {
      name: tier.name,
      icon: tier.icon,
      id:tier.id,
      description: tier.description,
      features: tier.features,
      featured: tier.featured,
      priceId: {
        month: tier?.priceId?.month,
        year: tier?.priceId?.year,
      },
    },
  });
  const {
   
    formState: { errors },
   
  } = form;
console.log(errors,"errors")
  const watchedFeatures = form.watch('features');

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      const currentFeatures = form.getValues('features');
      form.setValue('features', [...currentFeatures, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    const currentFeatures = form.getValues('features');
    form.setValue('features', currentFeatures.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: TierFormData) => {
    console.log("test in edit")
    try {
      setIsLoading(true);
      await onSave(data);
      setOpen(false);
      form.reset(data); // Reset with new data
    } catch (error) {
      console.error('Error saving tier:', error);
      // You might want to show a toast notification here
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset(); // Reset to original values
    setOpen(false);
    setNewFeature('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit Tier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Tier</DialogTitle>
          <DialogDescription>
            Make changes to the tier information. Click save when youre done.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}  className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter tier name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="icon"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Icon</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter icon (emoji or icon name)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter tier description" 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
     <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter tier description" 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priceId.month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Price ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter monthly price ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="priceId.year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yearly Price ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter yearly price ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="featured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Featured Tier</FormLabel>
                    <FormDescription>
                      Mark this tier as featured to highlight it to users.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="features"
              render={() => (
                <FormItem>
                  <FormLabel>Features</FormLabel>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a new feature"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddFeature();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddFeature}
                        disabled={!newFeature.trim()}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {watchedFeatures.map((feature:string, index:number) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {feature}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 ml-2 hover:bg-transparent"
                            onClick={() => handleRemoveFeature(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    
                    {watchedFeatures.length === 0 && (
                      <p className="text-sm text-muted-foreground">No features added yet.</p>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit"  >
                { isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}