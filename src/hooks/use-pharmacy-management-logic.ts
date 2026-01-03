"use client";

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { showLoading, dismissToast, showError, showSuccess } from '@/utils/toast';
import { useAuth } from '@/components/AuthProvider';

interface Pharmacy {
    id: string;
    name: string;
    address?: string;
    contact_email?: string;
    phone_number?: string;
    is_verified: boolean;
    created_at: string;
}

export const usePharmacyManagementLogic = () => {
    const { user: adminUser } = useAuth();
    const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPharmacies = useCallback(async () => {
        setLoading(true);
        const toastId = showLoading('Fetching pharmacies...');
        try {
            const { data, error } = await supabase
                .from('pharmacies')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setPharmacies(data as Pharmacy[]);
        } catch (error: any) {
            showError(`Error fetching pharmacies: ${error.message}`);
            setPharmacies([]);
        } finally {
            dismissToast(toastId);
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPharmacies();
    }, [fetchPharmacies]);

    const handleToggleVerification = async (pharmacy: Pharmacy, currentVerifiedStatus: boolean) => {
        const action = currentVerifiedStatus ? 'Unverifying' : 'Verifying';
        const logAction = currentVerifiedStatus ? 'PHARMACY_UNVERIFIED' : 'PHARMACY_VERIFIED';
        const toastId = showLoading(`${action} pharmacy...`);
        try {
            const { error } = await supabase
                .from('pharmacies')
                .update({ is_verified: !currentVerifiedStatus })
                .eq('id', pharmacy.id);

            if (error) throw error;

            await supabase.from('logs').insert({
                user_id: adminUser?.id,
                action: logAction,
                target_id: pharmacy.id,
                description: `${adminUser?.email || 'Admin'} ${action.toLowerCase()} pharmacy ${pharmacy.name}.`,
                metadata: {
                    pharmacy_name: pharmacy.name,
                    previous_status: currentVerifiedStatus,
                    new_status: !currentVerifiedStatus,
                },
            });

            showSuccess(`Pharmacy ${currentVerifiedStatus ? 'unverified' : 'verified'} successfully!`);
            fetchPharmacies();
        } catch (error: any) {
            showError(`Error ${action.toLowerCase()} pharmacy: ${error.message}`);
        } finally {
            dismissToast(toastId);
        }
    };

    return {
        pharmacies,
        loading,
        handleToggleVerification,
    };
};
