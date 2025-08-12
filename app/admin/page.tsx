'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getFirestore, collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { useAuth } from '@/lib/AuthContext';
import { app } from '@/lib/firebase';

import { Button } from '@/components/ui/button';
import { Toaster, toast } from 'sonner';
import LoadingSpinner, { LoadingPage } from '@/app/components/LoadingSpinner';
import ErrorDisplay from '@/app/components/ErrorDisplay';
import ConfirmationDialog from '@/app/components/ConfirmationDialog';

// Define a type for our appointment data
interface Appointment {
  id: string;
  name: string;
  email: string;
  service: string;
  date: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

const ADMIN_UID = process.env.NEXT_PUBLIC_ADMIN_UID;;

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const db = getFirestore(app);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: 'default' | 'destructive';
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: () => {},
  });

  // Function to fetch all appointments from Firestore
  const fetchAppointments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Query the "appointments" collection, ordering by newest first
      const q = query(collection(db, "appointments"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const apptsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Appointment));
      setAppointments(apptsData);
    } catch (error) {
      console.error("Error fetching appointments: ", error);
      setError("Failed to load appointments. Please try again.");
      toast.error("Failed to fetch appointments.", {
        description: "There was an error loading the appointment data."
      });
    } finally {
      setIsLoading(false);
    }
  };

  // This effect hook handles page protection and data fetching
  useEffect(() => {
    if (!loading) {
      if (!user || user.uid !== ADMIN_UID) {
        // If the user is not logged in or is not the admin, deny access
        toast.error("Access Denied", { description: "You do not have permission to view this page."});
        router.push('/');
      } else {
        // If the user is the admin, fetch the appointment data
        fetchAppointments();
      }
    }
  }, [user, loading, router]);

  // Function to update the status of an appointment
  const handleUpdateStatus = async (id: string, status: Appointment['status']) => {
    const statusText = status === 'confirmed' ? 'confirm' : 'cancel';
    const appointmentToUpdate = appointments.find(apt => apt.id === id);
    
    setConfirmDialog({
      isOpen: true,
      title: `${statusText.charAt(0).toUpperCase() + statusText.slice(1)} Appointment`,
      description: `Are you sure you want to ${statusText} ${appointmentToUpdate?.name}'s appointment for ${appointmentToUpdate?.service}?`,
      variant: status === 'cancelled' ? 'destructive' : 'default',
      onConfirm: () => confirmUpdateStatus(id, status)
    });
  };

  const confirmUpdateStatus = async (id: string, status: Appointment['status']) => {
    try {
      const appointmentRef = doc(db, "appointments", id);
      await updateDoc(appointmentRef, { status });
      toast.success(`Appointment ${status} successfully`, {
        description: "The appointment status has been updated."
      });
      // Refresh the list to show the change immediately
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment status: ", error);
      toast.error("Failed to update appointment status", {
        description: "There was an error updating the appointment. Please try again."
      });
    }
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  // Show a loading state while we verify the user
  if (loading) {
    return <LoadingPage text="Verifying admin access..." />;
  }

  if (!user || user.uid !== ADMIN_UID) {
    return (
      <ErrorDisplay
        title="Access Denied"
        message="You do not have permission to view this page."
        onRetry={() => router.push('/')}
        showRetry={true}
      />
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        title="Failed to Load Dashboard"
        message={error}
        onRetry={fetchAppointments}
        showRetry={true}
      />
    );
  }

  // Render the main dashboard content
  return (
    <>
      <div className="max-w-6xl mx-auto my-12 p-4 md:p-8">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Appointment Requests</h2>
          {isLoading ? (
            <LoadingSpinner text="Loading appointments..." />
          ) : appointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No appointment requests found.</p>
              <p className="text-gray-400 text-sm mt-2">New appointments will appear here when customers book.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="p-4">Requested Date</th>
                    <th className="p-4">Name</th>
                    <th className="p-4">Service</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(appt => (
                    <tr key={appt.id} className="border-b hover:bg-gray-50">
                      <td className="p-4">{new Date(appt.date).toLocaleDateString()}</td>
                      <td className="p-4">{appt.name}</td>
                      <td className="p-4">{appt.service}</td>
                      <td className="p-4 capitalize font-medium">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          appt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {appt.status}
                        </span>
                      </td>
                      <td className="p-4 flex gap-2 justify-end">
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateStatus(appt.id, 'confirmed')}
                          disabled={appt.status === 'confirmed'}
                          className="bg-brand-taupe hover:bg-brand-taupe-dark text-brand-cream border-0"
                        >
                          Confirm
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive" 
                          onClick={() => handleUpdateStatus(appt.id, 'cancelled')}
                          disabled={appt.status === 'cancelled'}
                        >
                          Cancel
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        description={confirmDialog.description}
        variant={confirmDialog.variant}
      />
      
      <Toaster />
    </>
  );
}