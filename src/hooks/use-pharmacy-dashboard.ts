"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { showLoading, dismissToast, showError, showSuccess } from '@/utils/toast';

export interface PrescriptionRequest {
    id: string;
    user_id: string;
    image_url?: string;
    status: string;
    upload_date: string;
    notes?: string;
    profiles?: {
        email: string;
    };
}

export const usePharmacyDashboard = () => {
    const { user, profile } = useAuth();
    const [requests, setRequests] = useState<PrescriptionRequest[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = useCallback(async () => {
        if (!user || profile?.role !== 'pharmacy') {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            // Fetch all prescriptions awaiting response
            // In a real app, we might filter by proximity or assigned pharmacies
            const { data, error } = await supabase
                .from('prescriptions')
                .select(`
                    *,
                    profiles:user_id (
                        email
                    )
                `)
                .eq('status', 'awaiting_pharmacy_response')
                .order('upload_date', { ascending: false });

            if (error) throw error;
            setRequests(data as any[]);
        } catch (error: any) {
            showError(`Error fetching requests: ${error.message}`);
        } finally {
            setLoading(false);
        }
    }, [user, profile]);

    useEffect(() => {
        fetchRequests();

        const subscription = supabase
            .channel('pharmacy_requests')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'prescriptions', filter: 'status=eq.awaiting_pharmacy_response' },
                () => fetchRequests()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [fetchRequests]);

    const respondToRequest = async (prescriptionId: string, hasStock: boolean, price?: number) => {
        if (!user) return;

        const toastId = showLoading("Submitting response...");
        try {
            // 1. Record the response
            const { error: responseError } = await supabase
                .from('prescription_pharmacy_responses')
                .insert([
                    {
                        prescription_id: prescriptionId,
                        pharmacy_id: user.id, // Assuming pharmacy user ID is linked to pharmacy entry
                        has_stock: hasStock,
                        price: price,
                        response_date: new Date().toISOString()
                    }
                ]);

            if (responseError) throw responseError;

            // 2. If stock is confirmed, update prescription status
            if (hasStock) {
                const { error: updateError } = await supabase
                    .from('prescriptions')
                    .update({ status: 'pharmacy_confirmed' })
                    .eq('id', prescriptionId);

                if (updateError) throw updateError;
            }

            showSuccess(hasStock ? "Stock confirmed!" : "Response recorded.");
            fetchRequests();
        } catch (error: any) {
            showError(`Error responding: ${error.message}`);
        } finally {
            dismissToast(toastId);
        }
    };

    return {
        requests,
        loading,
        respondToRequest,
        fetchRequests
    };
};
