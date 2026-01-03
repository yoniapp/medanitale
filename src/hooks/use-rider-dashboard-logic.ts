"use client";

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { showLoading, dismissToast, showError, showSuccess } from '@/utils/toast';
import { useRouter } from 'next/navigation';

interface Prescription {
    id: string;
    user_id: string;
    image_url: string;
    status: 'pending' | 'assigned' | 'picked_up' | 'delivered' | 'rejected';
    upload_date: string;
    notes?: string;
    rider_id?: string;
}

export const useRiderDashboardLogic = () => {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [availablePrescriptions, setAvailablePrescriptions] = useState<Prescription[]>([]);
    const [fetchingTasks, setFetchingTasks] = useState(true);

    const fetchAvailablePrescriptions = useCallback(async () => {
        if (!user) {
            setFetchingTasks(false);
            return;
        }

        setFetchingTasks(true);
        const toastId = showLoading('Fetching available tasks...');
        try {
            const { data, error } = await supabase
                .from('prescriptions')
                .select('*')
                .eq('status', 'pending')
                .is('rider_id', null)
                .order('upload_date', { ascending: true });

            if (error) throw error;

            setAvailablePrescriptions(data as Prescription[]);
            showSuccess('Available tasks loaded!');
        } catch (error: any) {
            showError(`Error fetching tasks: ${error.message}`);
            setAvailablePrescriptions([]);
        } finally {
            dismissToast(toastId);
            setFetchingTasks(false);
        }
    }, [user]);

    const handleTaskAccepted = (acceptedPrescriptionId: string) => {
        setAvailablePrescriptions((prev) =>
            prev.filter((p) => p.id !== acceptedPrescriptionId)
        );
    };

    const handleLogout = async () => {
        const toastId = showLoading('Logging out...');
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            showSuccess('Logged out successfully!');
            router.push('/login');
        } catch (error: any) {
            showError(`Error logging out: ${error.message}`);
        } finally {
            dismissToast(toastId);
        }
    };

    useEffect(() => {
        if (!authLoading && user) {
            fetchAvailablePrescriptions();

            const subscription = supabase
                .channel('rider_tasks_channel')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'prescriptions',
                        filter: 'status=eq.pending',
                    },
                    (payload) => {
                        console.log('New pending prescription received!', payload);
                        const newPrescription = payload.new as Prescription;
                        if (!newPrescription.rider_id) {
                            setAvailablePrescriptions((prev) => [newPrescription, ...prev]);
                        }
                    }
                )
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'prescriptions',
                        filter: 'status=eq.assigned',
                    },
                    (payload) => {
                        console.log('Prescription status updated!', payload);
                        const updatedPrescription = payload.new as Prescription;
                        setAvailablePrescriptions((prev) =>
                            prev.filter((p) => p.id !== updatedPrescription.id)
                        );
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(subscription);
            };
        } else if (!authLoading && !user) {
            setFetchingTasks(false);
        }
    }, [user, authLoading, fetchAvailablePrescriptions]);

    return {
        user,
        authLoading,
        availablePrescriptions,
        fetchingTasks,
        handleTaskAccepted,
        handleLogout,
    };
};
