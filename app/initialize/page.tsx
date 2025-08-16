'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { initializeDefaultTechnician } from '@/scripts/setupDefaultTechnician';

export default function InitializePage() {
  const [isInitializing, setIsInitializing] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleInitialize = async () => {
    setIsInitializing(true);
    try {
      await initializeDefaultTechnician();
      setIsInitialized(true);
      toast.success('Default technician "YVD Nails" has been created successfully!');
    } catch (error) {
      console.error('Initialization error:', error);
      toast.error('Failed to initialize. Please check the console for errors.');
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Initialize Multi-Technician System</CardTitle>
            <p className="text-gray-600 text-center">
              Set up the default "YVD Nails" technician to migrate to the new multi-technician system
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>What this will do:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Create a default technician profile for "YVD Nails"</li>
                <li>Set up all the existing services with proper pricing</li>
                <li>Enable the new booking flow with technician selection</li>
                <li>Prepare the admin dashboard for per-technician management</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Next Steps After Initialization:</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
                <li>Visit <code>/admin/setup</code> to create additional technician profiles</li>
                <li>Each technician will have their own calendar and availability</li>
                <li>Customers will be able to choose their preferred technician</li>
                <li>Each technician manages their own appointments independently</li>
              </ol>
            </div>

            {!isInitialized ? (
              <Button 
                onClick={handleInitialize} 
                disabled={isInitializing}
                className="w-full"
                size="lg"
              >
                {isInitializing ? 'Initializing...' : 'Initialize Multi-Technician System'}
              </Button>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-green-600 font-semibold">✅ System Initialized Successfully!</div>
                <div className="space-y-2">
                  <Button 
                    onClick={() => window.open('/booking', '_blank')}
                    variant="outline"
                    className="w-full"
                  >
                    Test New Booking Flow
                  </Button>
                  <Button 
                    onClick={() => window.open('/admin', '_blank')}
                    variant="outline" 
                    className="w-full"
                  >
                    Access Admin Dashboard
                  </Button>
                  <Button 
                    onClick={() => window.open('/admin/setup', '_blank')}
                    className="w-full"
                  >
                    Add More Technicians
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
