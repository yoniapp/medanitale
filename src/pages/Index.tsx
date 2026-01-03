import { MadeWithDyad } from "@/components/made-with-dyad";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { showLoading, dismissToast, showError, showSuccess } from "@/utils/toast";

const Index = () => {
  const { user, loading } = useAuth();

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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">Loading user data...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
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
        <Button onClick={handleLogout} className="mt-4">
          Logout
        </Button>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;