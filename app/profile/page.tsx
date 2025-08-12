'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '@/lib/firebase';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Toaster, toast } from 'sonner';
import LoadingSpinner, { LoadingPage } from '@/app/components/LoadingSpinner';
import ErrorDisplay from '@/app/components/ErrorDisplay';

interface Appointment {
  id: string;
  service: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: any;
}

const profileFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
  instagram: z.string().optional(),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      dateOfBirth: "",
    },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (currentUser) {
          setUser(currentUser);
          
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            form.reset(userDoc.data());
          }

          const appointmentsQuery = query(
            collection(db, 'appointments'),
            where('userId', '==', currentUser.uid)
          );
          const querySnapshot = await getDocs(appointmentsQuery);
          let userAppointments = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          } as Appointment));

          userAppointments.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
          setAppointments(userAppointments);

        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error("Error loading profile: ", error);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, router, db, form]);

  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, values, { merge: true });
      toast.success("Profile Updated!", {
        description: "Your profile information has been saved successfully."
      });
    } catch (error) {
      console.error("Error updating profile: ", error);
      toast.error("Failed to update profile", {
        description: "There was an error saving your profile. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return <LoadingPage text="Loading your profile..." />;
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Failed to Load Profile"
        message={error}
        onRetry={() => window.location.reload()}
        showRetry={true}
      />
    );
  }

  if (!user) {
    return (
      <ErrorDisplay
        title="Authentication Required"
        message="Please log in to view your profile."
        onRetry={() => router.push('/login')}
        showRetry={true}
      />
    );
  }

  return (
    <>
      <div className="max-w-4xl mx-auto my-12 p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">Your Information</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="firstName" render={({ field }) => ( <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                  <FormField control={form.control} name="lastName" render={({ field }) => ( <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                </div>
                <FormField control={form.control} name="instagram" render={({ field }) => ( <FormItem><FormLabel>Instagram</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="phoneNumber" render={({ field }) => ( <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                <FormField control={form.control} name="dateOfBirth" render={({ field }) => ( <FormItem><FormLabel>Date of Birth</FormLabel><FormControl><Input type="date" {...field} /></FormControl><FormMessage /></FormItem> )} />
                {/* --- THIS BUTTON IS NOW STYLED --- */}
                <Button type="submit" className="w-full md:w-auto" style={{ backgroundColor: '#FAD1E8', color: '#333' }}>Save Changes</Button>
              </form>
            </Form>
        </div>
        
        <div>
            <h2 className="text-2xl font-semibold mb-4">My Appointments</h2>
            {appointments.length === 0 ? (
                <p className="text-gray-500">You have not requested any appointments yet.</p>
            ) : (
                <div className="space-y-4">
                    {appointments.map(appt => (
                        <div key={appt.id} className="border rounded-lg p-4 flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{appt.service}</p>
                                <p className="text-sm text-gray-600">Date: {new Date(appt.date).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              appt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {appt.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
      <Toaster />
    </>
  );
}
