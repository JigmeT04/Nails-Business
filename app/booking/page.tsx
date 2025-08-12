'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { useAuth } from '@/lib/AuthContext';
import { app } from '@/lib/firebase';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import LoadingSpinner, { LoadingPage } from '@/app/components/LoadingSpinner';
import ErrorDisplay from '@/app/components/ErrorDisplay';

const bookingFormSchema = z.object({
  name: z.string().min(1, { message: "Your full name is required." }),
  email: z.string().email({ message: "A valid email is required." }),
  service: z.string({ required_error: "Please select a service." }),
  date: z.string().min(1, { message: "Please select a date." }),
  time: z.string({ required_error: "Please select a time slot." }),
  additionalNotes: z.string().optional(),
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

export default function BookingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const db = getFirestore(app);

  // State to hold the dynamically fetched time slots
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: { name: "", email: "", date: "" },
  });

  // Get the selected date from the form's state
  const selectedDate = form.watch('date');

  // This effect fetches available slots when a date is selected
  useEffect(() => {
    if (!selectedDate) return;

    const fetchSlots = async () => {
      setIsFetchingSlots(true);
      setAvailableSlots([]); // Clear old slots
      form.setValue('time', ''); // Reset selected time
      setError(null);
      try {
        const dateString = format(new Date(selectedDate), 'yyyy-MM-dd');
        const docRef = doc(db, 'availability', dateString);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setAvailableSlots(docSnap.data().slots || []);
        } else {
          setAvailableSlots([]); // No slots available for this date
        }
      } catch (error) {
        console.error("Error fetching time slots: ", error);
        setError("Could not load available time slots");
        toast.error("Could not fetch time slots", {
          description: "Please try selecting a different date or refresh the page."
        });
      } finally {
        setIsFetchingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate, db, form]);
  
  // Page protection and email pre-fill
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      form.setValue('email', user.email || '');
    }
  }, [user, loading, router, form]);

  async function onSubmit(values: z.infer<typeof bookingFormSchema>) {
    if (!user) {
      toast.error("Authentication required", {
        description: "You must be logged in to book an appointment."
      });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "appointments"), {
        userId: user.uid,
        ...values,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      toast.success("Appointment Requested!", {
        description: "We've received your request and will be in touch shortly to confirm.",
      });
      form.reset();
      setAvailableSlots([]);
    } catch (error) {
      console.error("Error submitting appointment: ", error);
      toast.error("Submission Failed", {
        description: "Something went wrong while booking your appointment. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-light-gray to-brand-nude py-12">
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow-2xl border border-brand-pink/20">
        <div className="text-center mb-8">
          <h1 className="font-title text-4xl font-semibold text-brand-taupe mb-4 tracking-wider">Book Your Appointment</h1>
          <p className="font-body text-brand-taupe-light">Reserve your spot for professional nail artistry</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={form.control} name="name" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Your full name" {...field} /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input placeholder="Your email" {...field} disabled /></FormControl><FormMessage /></FormItem> )} />
            <FormField control={form.control} name="service" render={({ field }) => ( <FormItem><FormLabel>Service</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger></FormControl><SelectContent>{services.map(service => (<SelectItem key={service} value={service}>{service}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem> )} />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <FormField control={form.control} name="date" render={({ field }) => ( <FormItem><FormLabel>Date</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem> )} />
              
              {/* This Time Slot Dropdown is now dynamic */}
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

            <FormField control={form.control} name="additionalNotes" render={({ field }) => ( <FormItem><FormLabel>Additional Notes (Optional)</FormLabel><FormControl><Textarea placeholder="Let us know about any specific design ideas, allergies, etc." {...field} /></FormControl><FormMessage /></FormItem> )} />
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