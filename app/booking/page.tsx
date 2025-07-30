'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/lib/AuthContext'; // We'll use this to get the logged-in user
import { app } from '@/lib/firebase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

// Define the schema for the booking form
const bookingFormSchema = z.object({
  name: z.string().min(1, { message: "Your full name is required." }),
  email: z.string().email({ message: "A valid email is required." }),
  service: z.string({ required_error: "Please select a service." }),
  date: z.string().min(1, { message: "Please select a date." }),
});

// We can get the service list from your homepage data or define it here
const services = [
  "Classic Manicure",
  "Gel-X Extensions",
  "Spa Pedicure",
  "Eyelash Extensions",
];

export default function BookingPage() {
  const { user, loading } = useAuth(); // Get the current user from our AuthContext
  const router = useRouter();
  const db = getFirestore(app);

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      email: "",
      date: "",
    },
  });

  // This effect protects the page
  useEffect(() => {
    // If the auth state is done loading and there's no user, redirect to login
    if (!loading && !user) {
      router.push('/login');
    }
    // Pre-fill email if user is logged in
    if (user) {
      form.setValue('email', user.email || '');
    }
  }, [user, loading, router, form]);

  // Handle form submission
  async function onSubmit(values: z.infer<typeof bookingFormSchema>) {
    if (!user) {
      toast.error("You must be logged in to book an appointment.");
      return;
    }

    try {
      // Create a new document in the "appointments" collection
      await addDoc(collection(db, "appointments"), {
        userId: user.uid, // Link the appointment to the logged-in user
        ...values, // Add all the form data (name, email, service, date)
        status: 'pending', // Set an initial status for the appointment
        createdAt: serverTimestamp(), // Add a server-side timestamp
      });

      toast.success("Appointment Requested!", {
        description: "We've received your request and will be in touch shortly to confirm.",
      });
      form.reset(); // Clear the form after successful submission
    } catch (error) {
      toast.error("Submission Failed", {
        description: "Something went wrong. Please try again.",
      });
    }
  }

  // Don't render the form until we know if the user is logged in
  if (loading || !user) {
    return <p className="text-center mt-12">Loading...</p>;
  }

  return (
    <>
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Book Your Appointment
        </h1>
        <p className="text-center text-gray-500 mb-8">
          We can't wait to see you!
        </p>

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
            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services.map(service => (
                        <SelectItem key={service} value={service}>{service}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Request Appointment</Button>
          </form>
        </Form>
      </div>
      <Toaster />
    </>
  );
}
