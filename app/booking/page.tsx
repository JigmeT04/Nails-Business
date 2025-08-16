'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/lib/AuthContext';
import { app } from '@/lib/firebase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import LoadingSpinner, { LoadingPage } from '@/app/components/LoadingSpinner';
import ErrorDisplay from '@/app/components/ErrorDisplay';
import TechnicianSelector from '@/app/components/TechnicianSelector';
import { Technician, getTechnicianAvailability } from '@/lib/technicianService';

const bookingFormSchema = z.object({
  name: z.string().min(1, { message: "Your full name is required." }),
  email: z.string().email({ message: "A valid email is required." }),
  technicianId: z.string().min(1, { message: "Please select a nail technician." }),
  service: z.string({ required_error: "Please select a service." }),
  date: z.string().min(1, { message: "Please select a date." }),
  time: z.string({ required_error: "Please select a time slot." }),
  additionalNotes: z.string().optional(),
});

export default function BookingPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const db = getFirestore(app);

  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTechnician, setSelectedTechnician] = useState<Technician | null>(null);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: '',
      email: '',
      technicianId: '',
      service: '',
      date: '',
      time: '',
      additionalNotes: '',
    },
  });

  const watchedDate = form.watch("date");
  const watchedTechnicianId = form.watch("technicianId");

  // Update available slots when date or technician changes
  useEffect(() => {
    if (watchedDate !== selectedDate || watchedTechnicianId) {
      setSelectedDate(watchedDate);
      form.setValue('time', ''); // Clear time when date changes
      if (watchedDate && selectedTechnician) {
        fetchAvailableTimeSlots(watchedDate, selectedTechnician.id);
      } else {
        setAvailableSlots([]);
      }
    }
  }, [watchedDate, watchedTechnicianId, selectedDate, selectedTechnician, form]);

  const fetchAvailableTimeSlots = async (date: string, technicianId: string) => {
    setIsFetchingSlots(true);
    try {
      // Get technician's availability for the selected date
      const availability = await getTechnicianAvailability(technicianId, date, date);
      const slots = availability[date] || [];
      setAvailableSlots(slots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      setAvailableSlots([]);
    } finally {
      setIsFetchingSlots(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
    if (user && userData) {
      form.setValue('email', user.email || '');
      form.setValue('name', `${userData.displayName || ''}`.trim());
    }
  }, [user, userData, authLoading, router, form]);

  // Handle technician selection
  const handleTechnicianSelect = (technician: Technician) => {
    setSelectedTechnician(technician);
    form.setValue('technicianId', technician.id);
    // Clear date and time when switching technicians
    form.setValue('date', '');
    form.setValue('time', '');
    setAvailableSlots([]);
  };

  async function onSubmit(values: z.infer<typeof bookingFormSchema>) {
    if (!user) {
      toast.error("Authentication required", {
        description: "You must be logged in to book an appointment."
      });
      return;
    }

    if (!userData?.isApproved) {
      toast.error("Waitlist approval required", {
        description: "Your account must be approved from our waitlist before you can book appointments."
      });
      return;
    }

    if (!userData?.hasSignedTerms) {
      toast.error("Terms of Service required", {
        description: "Please sign the Terms of Service in your profile before booking."
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // Save appointment to the selected technician's subcollection
      await addDoc(collection(db, "technicians", values.technicianId, "appointments"), {
        userId: user.uid,
        customerName: userData.displayName || values.name,
        customerEmail: values.email,
        service: values.service,
        date: values.date,
        time: values.time,
        additionalNotes: values.additionalNotes,
        technicianId: values.technicianId,
        technicianName: selectedTechnician?.name,
        technicianBusinessName: selectedTechnician?.businessName,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      
      toast.success("Appointment Requested!", {
        description: `We've sent your request to ${selectedTechnician?.name}. You'll receive confirmation shortly.`,
      });
      form.reset();
      setAvailableSlots([]);
      setSelectedTechnician(null);
    } catch (error) {
      console.error("Error submitting appointment: ", error);
      toast.error("Submission Failed", {
        description: "Something went wrong while booking your appointment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (authLoading) {
    return <LoadingPage text="Loading booking page..." />;
  }

  if (!user) {
    return (
      <ErrorDisplay
        title="Authentication Required"
        message="Please log in to book an appointment."
        onRetry={() => router.push('/login')}
        showRetry={true}
      />
    );
  }

  // Check if user is approved
  if (!userData?.isApproved) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⏳</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Waitlist Approval Required</h1>
          <p className="text-gray-600 mb-6">
            Your account is currently on our waitlist for approval. You'll be able to book appointments once your account is approved.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              Approval typically takes 24-48 hours. You'll receive an email notification once approved.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => router.push('/profile')} variant="outline">
              View Profile
            </Button>
            <Button onClick={() => router.push('/')} variant="default">
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Check if user has signed terms
  if (!userData?.hasSignedTerms) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-lg shadow-lg text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">📝</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Terms of Service Required</h1>
          <p className="text-gray-600 mb-6">
            Please sign our Terms of Service before booking appointments. You only need to do this once.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-800 text-sm">
              Visit your profile to review and sign the Terms of Service. This signature will apply to all your future bookings.
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => router.push('/terms')} variant="default">
              Sign Terms of Service
            </Button>
            <Button onClick={() => router.push('/')} variant="outline">
              Return Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light-gray to-brand-nude py-12">
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-2xl border border-brand-pink/20">
        <div className="text-center mb-8">
          <h1 className="font-title text-4xl font-semibold text-brand-taupe mb-4 tracking-wider">Book Your Appointment</h1>
          <p className="font-body text-brand-taupe-light">Reserve your spot for professional nail artistry</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField 
              control={form.control} 
              name="name" 
              render={({ field }) => ( 
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem> 
              )} 
            />

            <FormField 
              control={form.control} 
              name="email" 
              render={({ field }) => ( 
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem> 
              )} 
            />

            {/* Technician Selection */}
            <div className="space-y-4">
              <TechnicianSelector 
                onSelect={handleTechnicianSelect}
                selectedTechnician={selectedTechnician}
              />
            </div>

            <FormField 
              control={form.control} 
              name="service" 
              render={({ field }) => ( 
                <FormItem>
                  <FormLabel>Service</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={selectedTechnician ? "Select a service" : "Please select a technician first"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedTechnician?.services.map(service => (
                        <SelectItem key={service.id} value={`${service.name} ($${service.price})`}>
                          {service.name} - ${service.price}
                          {service.duration && <span className="text-gray-500 ml-2">({service.duration}min)</span>}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem> 
              )} 
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField 
                control={form.control} 
                name="date" 
                render={({ field }) => ( 
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem> 
                )} 
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={!selectedDate || isFetchingSlots}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isFetchingSlots ? "Loading..." : "Select a time"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availableSlots.length > 0 ? (
                          availableSlots.map(time => (<SelectItem key={time} value={time}>{time}</SelectItem>))
                        ) : (
                          <SelectItem value="none" disabled>No slots available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="additionalNotes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Let us know about any specific design ideas, allergies, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-brand-taupe hover:bg-brand-taupe-dark text-brand-cream border-0 py-3 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Submitting...</span>
                </>
              ) : (
                "Request Appointment"
              )}
            </Button>
          </form>
        </Form>
      </div>
      <Toaster />
    </div>
  );
}
