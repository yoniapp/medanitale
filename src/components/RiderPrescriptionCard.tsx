"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, CalendarDays, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { showLoading, dismissToast, showError, showSuccess } from '@/utils/toast';
import { useAuth } from '@/components/AuthProvider';

interface Prescription {
  id: string;
  user_id: string;
  image_url: string;
  status: 'pending' | 'assigned' | 'picked_up' | 'delivered' | 'rejected';
  upload_date: string;
  notes?: string;
  rider_id?: string;
}

interface RiderPrescriptionCardProps {
  prescription: Prescription;
  onAccept: (prescriptionId: string) => void;
}

const RiderPrescriptionCard: React.FC<RiderPrescriptionCardProps> = ({ prescription, onAccept }) => {
  const { user } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleAcceptTask = async () => {
    if (!user) {
      showError('You must be logged in to accept a task.');
      return;
    }

    setLoading(true);
    const toastId = showLoading('Accepting task...');
    try {
      const { error } = await supabase
        .from('prescriptions')
        .update({ status: 'assigned', rider_id: user.id })
        .eq('id', prescription.id);

      if (error) throw error;

      showSuccess('Task accepted successfully!');
      onAccept(prescription.id); // Notify parent component to update list
    } catch (error: any) {
      showError(`Error accepting task: ${error.message}`);
    } finally {
      dismissToast(toastId);
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        {prescription.image_url ? (
          <img src={prescription.image_url} alt="Prescription" className="object-cover w-full h-full" />
        ) : (
          <ImageIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
        )}
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">Prescription #{prescription.id.substring(0, 8)}</CardTitle>
        <CardDescription className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <CalendarDays className="h-3 w-3 mr-1" />
          Uploaded: {new Date(prescription.upload_date).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
          <MapPin className="h-4 w-4 mr-2" />
          <span>Patient ID: {prescription.user_id.substring(0, 8)}...</span>
        </div>
        {prescription.notes && (
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-medium">Notes:</span> {prescription.notes}
          </p>
        )}
        <Button onClick={handleAcceptTask} className="w-full" disabled={loading}>
          {loading ? 'Accepting...' : 'Accept Task'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default RiderPrescriptionCard;