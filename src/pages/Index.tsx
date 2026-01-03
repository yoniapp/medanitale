import { MadeWithDyad } from "@/components/made-with-dyad";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { showLoading, dismissToast, showError, showSuccess } from "@/utils/toast";
import { useNavigate } from "react-router-dom";
import PrescriptionCard from "@/components/PrescriptionCard"; // Import the new component

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Dummy prescription data for demonstration
  const dummyPrescriptions = [
    {
      id: '1',
      imageUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=Rx1', // Placeholder image
      status: 'delivered' as const,
      uploadDate: '2023-10-26T10:00:00Z',
      notes: 'Delivered to main address.',
    },
    {
      id: '2',
      imageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Rx2', // Placeholder image
      status: 'processing' as const,
      uploadDate: '2023-11-15T14:30:00Z',
      notes: 'Awaiting rider assignment.',
    },
    {
      id: '3',
      imageUrl: 'https://via.placeholder.com/150/008000/FFFFFF?text=Rx3', // Placeholder image
      status: 'pending' as const,
      uploadDate: '2023-12-01T09:15:00Z',
      notes: 'New upload, waiting for review.',
    },
    {
      id: '4',
      imageUrl: 'https://via.placeholder.com/150/FFFF00/000000?text=Rx4', // Placeholder image
      status: 'rejected' as const,
      uploadDate: '2023-09-01T11:00:00Z',
      notes: 'Image unclear, please re-upload.',
    },
  ];

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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">Loading user data...</div>;
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
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>
      </div>

      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">Your Prescriptions</h2>
        {dummyPrescriptions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
            {dummyPrescriptions.map((prescription) => (
              <PrescriptionCard key={prescription.id} {...prescription} />
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