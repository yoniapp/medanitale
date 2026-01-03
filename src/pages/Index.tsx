import { MadeWithDyad } from "@/components/made-with-dyad";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { showLoading, dismissToast, showError, showSuccess } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import PrescriptionCard from "@/components/PrescriptionCard";
import React, { useEffect, useState, useCallback } from "react"; // Import useCallback

// Define the type for a prescription
interface Prescription {
  id: string;
  image_url: string;
  status: 'pending' | 'assigned' | 'picked_up' | 'delivered' | 'rejected' | 'awaiting_pharmacy_response' | 'pharmacy_confirmed'; // Updated status types
  upload_date: string;
  notes?: string;
  rider_id?: string; // Added rider_id
}

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [fetchingPrescriptions, setFetchingPrescriptions] = useState(true);

  // Function to fetch prescriptions, memoized with useCallback
  const fetchPrescriptions = useCallback(async () => {
    if (!user) {
      setFetchingPrescriptions(false);
      return;
    }

    setFetchingPrescriptions(true);
    const toastId = showLoading('Fetching your prescriptions...');
    try {
      const { data, error } = await supabase
        .from('prescriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('upload_date', { ascending: false });

      if (error) throw error;

      setPrescriptions(data as Prescription[]);
      showSuccess('Prescriptions loaded!');
    } catch (error: any) {
      showError(`Error fetching prescriptions: ${error.message}`);
      setPrescriptions([]);
    } finally {
      dismissToast(toastId);
      setFetchingPrescriptions(false);
    }
  }, [user]); // Dependency on user

  useEffect(() => {
    if (!authLoading && user) {
      fetchPrescriptions();

      // Set up real-time subscription
      const subscription = supabase
        .channel('prescriptions_channel')
        .on(
          'postgres_changes',
          {
            event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
            schema: 'public',
            table: 'prescriptions',
            filter: `user_id=eq.${user.id}`, // Only listen for changes related to the current user
          },
          (payload) => {
            console.log('Change received!', payload);
            // Re-fetch prescriptions to ensure the list is up-to-date
            // A more optimized approach would be to directly manipulate the state based on payload.new/payload.old
            // but re-fetching is simpler and robust for now.
            fetchPrescriptions();
          }
        )
        .subscribe();

      return () => {
        // Clean up the subscription when the component unmounts
        supabase.removeChannel(subscription);
      };
    } else if (!authLoading && !user) {
      setFetchingPrescriptions(false); // No user, no prescriptions to fetch
    }
  }, [user, authLoading, fetchPrescriptions]); // Dependencies for useEffect

  const handleLogout = async () => {
    const toastId = showLoading('Logging out...');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      showSuccess('Logged out successfully!');
    } catch (error: any) {
      showError(`Error logging out: ${error.message}`);
    } finally {
      dismissToast(toastId);
    }
  };

  const handleUploadPrescription = () => {
    navigate('/upload-prescription');
  };

  const handleGoToRiderDashboard = () => {
    navigate('/rider-dashboard');
  };

  const handleViewPrescriptionDetails = (id: string) => {
    navigate(`/prescription/${id}`);
  };

  if (authLoading || fetchingPrescriptions) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">Loading data...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl mb-8 mt-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Welcome to Medanit Ale!</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          You are logged in.
        </p>
        {user && (
          <div className="mb-6">
            <p className="text-lg text-gray-700 dark:text-gray-200">
              User ID: <span className="font-mono">{user.id}</span>
            </p>
            {user.phone && (
              <p className="text-lg text-gray-700 dark:text-gray-200">
                Phone: <span className="font-mono">{user.phone}</span>
              </p>
            )}
          </div>
        )}
        <div className="flex flex-col space-y-4 mt-4">
          <Button onClick={handleUploadPrescription}>
            Upload New Prescription
          </Button>
          <Button onClick={handleGoToRiderDashboard} variant="secondary">
            Go to Rider Dashboard
          </Button>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </div>

      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">Your Prescriptions</h2>
        {prescriptions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {prescriptions.map((prescription) => (
              <PrescriptionCard
                key={prescription.id}
                id={prescription.id}
                imageUrl={prescription.image_url}
                status={prescription.status}
                uploadDate={prescription.upload_date}
                notes={prescription.notes}
                onViewDetails={handleViewPrescriptionDetails}
              />
            ))}
          </div>
        ) : (
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center">No prescriptions uploaded yet.</p>
        )}
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;