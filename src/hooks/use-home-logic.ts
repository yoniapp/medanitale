"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { showLoading, dismissToast, showError, showSuccess } from "@/utils/toast";
import { useRouter } from "next/navigation";

interface Prescription {
    id: string;
    image_url: string;
    status: 'pending' | 'assigned' | 'picked_up' | 'delivered' | 'rejected' | 'awaiting_pharmacy_response' | 'pharmacy_confirmed';
    upload_date: string;
    notes?: string;
    rider_id?: string;
}

export const useHomeLogic = () => {
    const { user, profile, loading: authLoading } = useAuth();
    const router = useRouter();
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [fetchingPrescriptions, setFetchingPrescriptions] = useState(true);

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
    }, [user]);

    useEffect(() => {
        if (!authLoading && user) {
            fetchPrescriptions();

            const subscription = supabase
                .channel('prescriptions_channel')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'prescriptions',
                        filter: `user_id=eq.${user.id}`,
                    },
                    (payload) => {
                        console.log('Change received!', payload);
                        fetchPrescriptions();
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(subscription);
            };
        } else if (!authLoading && !user) {
            setFetchingPrescriptions(false);
        }
    }, [user, authLoading, fetchPrescriptions]);

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

    const handleUploadPrescription = () => {
        router.push('/upload-prescription');
    };

    const handleSearchMedicine = () => {
        router.push('/search');
    };

    const handleGoToRiderDashboard = () => {
        router.push('/rider-dashboard');
    };

    const handleGoToAdminDashboard = () => {
        router.push('/admin-dashboard');
    };

    const handleViewPrescriptionDetails = (id: string) => {
        router.push(`/prescription/${id}`);
    };

    return {
        user,
        profile,
        authLoading,
        prescriptions,
        fetchingPrescriptions,
        handleLogout,
        handleUploadPrescription,
        handleSearchMedicine,
        handleGoToRiderDashboard,
        handleGoToAdminDashboard,
        handleViewPrescriptionDetails,
    };
};
