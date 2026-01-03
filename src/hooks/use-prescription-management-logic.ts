"use client";

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { showLoading, dismissToast, showError } from '@/utils/toast';
import { useRouter } from 'next/navigation';

interface Prescription {
    id: string;
    user_id: string;
    image_url: string;
    status: 'pending' | 'assigned' | 'picked_up' | 'delivered' | 'rejected' | 'awaiting_pharmacy_response' | 'pharmacy_confirmed';
    upload_date: string;
    notes?: string;
    rider_id?: string;
}

export const usePrescriptionManagementLogic = () => {
    const router = useRouter();
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const fetchPrescriptions = useCallback(async () => {
        setLoading(true);
        const toastId = showLoading('Fetching prescriptions...');
        try {
            let query = supabase
                .from('prescriptions')
                .select('*')
                .order('upload_date', { ascending: false });

            if (filterStatus !== 'all') {
                query = query.eq('status', filterStatus);
            }

            const { data, error } = await query;

            if (error) throw error;
            setPrescriptions(data as Prescription[]);
        } catch (error: any) {
            showError(`Error fetching prescriptions: ${error.message}`);
            setPrescriptions([]);
        } finally {
            dismissToast(toastId);
            setLoading(false);
        }
    }, [filterStatus]);

    useEffect(() => {
        fetchPrescriptions();
    }, [fetchPrescriptions]);

    const handleViewDetails = (id: string) => {
        router.push(`/prescription/${id}`);
    };

    return {
        prescriptions,
        loading,
        filterStatus,
        setFilterStatus,
        handleViewDetails,
    };
};
