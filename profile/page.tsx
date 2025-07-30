'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// 1. Import the new 'sonner' toast function
import { toast } from 'sonner';
// 2. Import the new Toaster component from sonner
import { Toaster } from '@/components/ui/sonner';

// Define the schema for the profile form
const profileFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  instagram: z.string().optional(),
  phoneNumber: z.string().optional(),
  age: z.coerce.number().positive().int().optional(),
});

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const auth = getAuth(app);
  const db = getFirestore(app);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      instagram: "",
      phoneNumber: "",
    },
  });

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // User is signed in, now fetch their profile data
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          // Pre-fill the form with data from Firestore
          form.reset(userDoc.data());
        }
      } else {
        // User is signed out, redirect to login
        router.push('/login');
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth, router, db, form]);

  // Handle form submission to update the profile
  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    if (!user) return;

    try {
      const userDocRef = doc(db, 'users', user.uid);
      // Use setDoc with merge: true to update the document without overwriting other fields
      await setDoc(userDocRef, values, { merge: true });
      // 3. Use the simpler 'sonner' toast API for success
      toast.success("Profile Updated!", {
        description: "Your information has been saved successfully.",
      });
    } catch (error) {
      // 4. Use the simpler 'sonner' toast API for errors
      toast.error("Error", {
        description: "Failed to update profile. Please try again.",
      });
    }
  }

  if (loading) {
    return <p className="text-center mt-12">Loading...</p>;
  }

  return (
    <>
      <div className="max-w-2xl mx-auto my-12 p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Your Profile
        </h1>
        <p className="text-center text-gray-500 mb-8">
          Keep your information up to date.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram Username</FormLabel>
                  <FormControl>
                    <Input placeholder="@username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="(555) 123-4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Your age" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">Save Changes</Button>
          </form>
        </Form>
      </div>
      {/* 5. Render the new Toaster component */}
      <Toaster />
    </>
  );
}
