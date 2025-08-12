'use client';

// Update the import path if SocialLogins is in the same project folder structure
import SocialLogins from '@/app/components/SocialLogins';
// If '@/components/SocialLogins' does not exist, update the path to the actual location, e.g.:
// import SocialLogins from '../../components/SocialLogins';
// or
// import SocialLogins from '../components/SocialLogins';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
// Make sure to import signInWithEmailAndPassword
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// Validation schema for the login form
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  // Password can be shorter for login, we just need to know it's not empty
  password: z.string().min(1, { message: "Password is required." }),
});

// Rename the component to LoginPage
export default function LoginPage() {
  const [firebaseError, setFirebaseError] = useState('');
  const router = useRouter();
  const auth = getAuth(app);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // The onSubmit function now handles signing in
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setFirebaseError('');
    try {
      // Use Firebase's signInWithEmailAndPassword function
      await signInWithEmailAndPassword(auth, values.email, values.password);
      router.push('/'); // Redirect to home on success
    } catch (error: any) {
      // Provide a generic error for security
      setFirebaseError("Failed to log in. Please check your email and password.");
    }
  }

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-lg shadow-lg">
      {/* Update the title */}
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Login to Your Account
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {firebaseError && (
            <p className="text-red-500 text-sm text-center">{firebaseError}</p>
          )}

          {/* Update the button text */}
          <Button type="submit" className="w-full">Login</Button>
        </form>
      </Form>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <SocialLogins />
    </div>
  );
}
