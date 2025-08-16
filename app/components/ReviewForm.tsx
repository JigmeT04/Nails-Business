'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/lib/AuthContext';
import { ReviewService } from '@/lib/reviewService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import StarRating from './StarRating';
import LoadingSpinner from './LoadingSpinner';

const reviewSchema = z.object({
  service: z.string().min(1, 'Please select a service'),
  technician: z.string().min(1, 'Please select a technician'),
  rating: z.number().min(1, 'Please provide a rating').max(5),
  comment: z.string().min(10, 'Please provide at least 10 characters in your review'),
});

const services = [
  "Design Tier 1", 
  "Design Tier 2", 
  "Design Tier 3", 
  "Design Tier 4",
  "GELX Tier 1 ($85)",
  "GELX Tier 2 ($95)", 
  "GELX Tier 3 ($105)",
  "GELX Tier 4 ($115)",
  "Soak Off ($20)",
  "Removals ($0)"
];

const technicians = [
  "Sarah Chen",
  "Maria Rodriguez", 
  "Ashley Kim",
  "Jennifer Lee",
  "Studio Team"
];

interface ReviewFormProps {
  appointmentId?: string;
  prefilledService?: string;
  prefilledTechnician?: string;
  onSubmitSuccess?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({ 
  appointmentId, 
  prefilledService, 
  prefilledTechnician,
  onSubmitSuccess,
  onCancel 
}: ReviewFormProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      service: prefilledService || '',
      technician: prefilledTechnician || '',
      rating: 0,
      comment: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof reviewSchema>) => {
    if (!user) {
      toast.error('Authentication required', {
        description: 'You must be logged in to submit a review.'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await ReviewService.submitReview({
        userId: user.uid,
        customerName: user.displayName || user.email?.split('@')[0] || 'Anonymous',
        service: values.service,
        technician: values.technician,
        rating: values.rating,
        comment: values.comment,
        appointmentId,
      });

      toast.success('Review submitted successfully!', {
        description: 'Thank you for your feedback. It helps us improve our service.'
      });

      form.reset();
      setSelectedRating(0);
      onSubmitSuccess?.();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review', {
        description: 'Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating);
    form.setValue('rating', rating);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-brand-pink/20">
      <div className="mb-6">
        <h3 className="font-title text-2xl font-semibold text-brand-taupe mb-2">
          Share Your Experience
        </h3>
        <p className="text-brand-taupe-light">
          Your feedback helps us maintain the highest quality of service
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Received</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services.map(service => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="technician"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Technician</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select technician" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {technicians.map(technician => (
                        <SelectItem key={technician} value={technician}>
                          {technician}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Overall Rating</FormLabel>
                <FormControl>
                  <div className="py-2">
                    <StarRating
                      rating={selectedRating}
                      onRatingChange={handleRatingChange}
                      size="lg"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Review</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Share details about your experience, the quality of service, and what stood out to you..."
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-brand-taupe hover:bg-brand-taupe-dark text-brand-cream py-3 rounded-full font-semibold transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Submitting...</span>
                </>
              ) : (
                'Submit Review'
              )}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1 border-brand-taupe text-brand-taupe hover:bg-brand-taupe hover:text-brand-cream py-3 rounded-full font-semibold transition-all duration-300"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
