'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { getFirestore, collection, getDocs, doc, updateDoc, query, getDoc, setDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

const db = getFirestore(app);

export default function AdminCleanupPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const cleanupAdminAccounts = async () => {
    setIsProcessing(true);
    const logMessages: string[] = [];

    try {
      // Known admin emails (add more as needed)
      const knownAdminEmails = [
        'jigmetondup@gmail.com',
        'admin@yvdnails.com'
      ];

      // Get all technicians (admins)
      const techniciansQuery = query(collection(db, 'technicians'));
      const techniciansSnapshot = await getDocs(techniciansQuery);
      const adminEmails = new Set<string>();
      
      techniciansSnapshot.docs.forEach(doc => {
        const techData = doc.data();
        if (techData.email) {
          adminEmails.add(techData.email.toLowerCase());
          logMessages.push(`Found existing admin: ${techData.email}`);
        }
      });

      // Add known admin emails to the set
      knownAdminEmails.forEach(email => {
        adminEmails.add(email.toLowerCase());
        if (!Array.from(adminEmails).some(existingEmail => existingEmail === email.toLowerCase())) {
          logMessages.push(`Added known admin email: ${email}`);
        }
      });

      // Get all users
      const usersQuery = query(collection(db, 'users'));
      const usersSnapshot = await getDocs(usersQuery);
      
      let adminAccountsFixed = 0;
      let technicianRecordsCreated = 0;

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data();
        const userEmail = userData.email?.toLowerCase() || '';
        
        if (adminEmails.has(userEmail)) {
          // This is an admin account in the users collection
          const updates: { [key: string]: boolean | Date } = {};
          let needsUpdate = false;

          // Ensure admin accounts have proper admin flag
          if (!userData.isAdmin) {
            updates.isAdmin = true;
            needsUpdate = true;
            logMessages.push(`Added admin flag for: ${userData.email}`);
          }

          // Ensure admin accounts are approved
          if (!userData.isApproved && !userData.isVerified) {
            updates.isApproved = true;
            updates.isVerified = true;
            needsUpdate = true;
            logMessages.push(`Auto-approved admin account: ${userData.email}`);
          }

          if (needsUpdate) {
            await updateDoc(doc(db, 'users', userDoc.id), updates);
            adminAccountsFixed++;
          }

          // Create technician record if it doesn't exist
          try {
            const technicianDoc = await getDoc(doc(db, 'technicians', userDoc.id));
            if (!technicianDoc.exists()) {
              // Create a basic technician record
              await setDoc(doc(db, 'technicians', userDoc.id), {
                name: userData.displayName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'Admin User',
                email: userData.email,
                businessName: userData.businessName || 'YVD Nails Admin',
                description: 'Administrator account',
                specialties: ['Administration', 'Nail Art'],
                services: [
                  {
                    id: 'consultation',
                    name: 'Consultation',
                    price: 0,
                    duration: 30,
                    category: 'Other',
                    description: 'Administrative consultation'
                  }
                ],
                location: {
                  address: '123 Main Street',
                  city: 'Admin City',
                  state: 'State',
                  zipCode: '12345'
                },
                contact: {
                  phone: userData.phone || '(000) 000-0000'
                },
                isActive: true,
                isAdmin: true,
                joinedDate: new Date(),
                rating: 5.0,
                totalReviews: 0
              });
              
              technicianRecordsCreated++;
              logMessages.push(`Created technician record for: ${userData.email}`);
            }
          } catch (error) {
            logMessages.push(`Failed to create technician record for ${userData.email}: ${error}`);
          }
        }
      }

      logMessages.push(`\n✅ Cleanup completed!`);
      logMessages.push(`Fixed ${adminAccountsFixed} admin user records`);
      logMessages.push(`Created ${technicianRecordsCreated} technician records`);
      
      if (adminAccountsFixed > 0 || technicianRecordsCreated > 0) {
        toast.success(`Successfully processed ${adminAccountsFixed} admin accounts and created ${technicianRecordsCreated} technician records!`);
      } else {
        toast.success('All admin accounts are already properly configured!');
      }

    } catch (error) {
      console.error('Error during cleanup:', error);
      logMessages.push(`❌ Error: ${error}`);
      toast.error('Cleanup failed. Check console for details.');
    } finally {
      setResults(logMessages);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Admin Account Cleanup</CardTitle>
            <p className="text-gray-600 text-center">
              Fix admin accounts that were incorrectly processed through the regular approval workflow
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-800 mb-2">⚠️ What this tool does:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-amber-700">
                <li>Identifies admin accounts in the users collection</li>
                <li>Ensures admin accounts have proper admin flags</li>
                <li>Removes conflicting approval statuses</li>
                <li>Does NOT modify the technicians collection</li>
              </ul>
            </div>

            {!results.length ? (
              <Button 
                onClick={cleanupAdminAccounts} 
                disabled={isProcessing}
                className="w-full"
                size="lg"
              >
                {isProcessing ? 'Processing Admin Cleanup...' : 'Run Admin Account Cleanup'}
              </Button>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-50 border rounded-lg p-4 max-h-96 overflow-y-auto">
                  <h3 className="font-semibold mb-2">Cleanup Results:</h3>
                  <pre className="text-sm whitespace-pre-wrap">
                    {results.join('\n')}
                  </pre>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      setResults([]);
                    }}
                    variant="outline"
                    className="flex-1"
                  >
                    Run Again
                  </Button>
                  <Button 
                    onClick={() => window.location.reload()}
                    className="flex-1"
                  >
                    Refresh Page & Test
                  </Button>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">After running cleanup:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                <li>Refresh your profile page to see the correct "Admin" status</li>
                <li>Check the waitlist management - admin accounts should no longer appear</li>
                <li>Admin accounts will be automatically approved for all booking functions</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
