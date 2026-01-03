"use client";

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { showLoading, dismissToast, showError } from '@/utils/toast';

interface Prescription {
    id: string;
    user_id: string;
    image_url: string;
    status: 'pending' | 'assigned' | 'picked_up' | 'delivered' | 'rejected' | 'awaiting_pharmacy_response' | 'pharmacy_confirmed';
    upload_date: string;
    notes?: string;
    rider_id?: string;
}

interface Pharmacy {
    id: string;
    name: string;
    address?: string;
    latitude?: number;
    longitude?: number;
}

interface PrescriptionPharmacyResponse {
    id: string;
    prescription_id: string;
    pharmacy_id: string;
    has_stock: boolean;
    price?: number;
    response_date: string;
    notes?: string;
    pharmacies: Pharmacy;
}

export const usePrescriptionDetailsLogic = () => {
    const params = useParams();
    const id = params.id as string;
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [prescription, setPrescription] = useState<Prescription | null>(null);
    const [pharmacyResponses, setPharmacyResponses] = useState<PrescriptionPharmacyResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPrescriptionDetails = useCallback(async () => {
        if (!user || !id) {
            setLoading(false);
            return;
        }

        setLoading(true);
        const toastId = showLoading('Fetching prescription details...');
        try {
            const { data: prescriptionData, error: prescriptionError } = await supabase
                .from('prescriptions')
                .select('*')
                .eq('id', id)
                .eq('user_id', user.id)
                .single();

            if (prescriptionError) throw prescriptionError;
            setPrescription(prescriptionData as Prescription);

            const { data: responsesData, error: responsesError } = await supabase
                .from('prescription_pharmacy_responses')
                .select(`
          *,
          pharmacies (
            id,
            name,
            address,
            latitude,
            longitude
          )
        `)
                .eq('prescription_id', id)
                .eq('has_stock', true)
                .order('response_date', { ascending: false });

            if (responsesError) throw responsesError;
            setPharmacyResponses(responsesData as unknown as PrescriptionPharmacyResponse[]);

        } catch (error: any) {
            showError(`Error fetching details: ${error.message}`);
            setPrescription(null);
            setPharmacyResponses([]);
        } finally {
            dismissToast(toastId);
            setLoading(false);
        }
    }, [id, user]);

    useEffect(() => {
        if (!authLoading && user) {
            fetchPrescriptionDetails();

            const subscription = supabase
                .channel(`prescription_details_${id}`)
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'prescriptions',
                        filter: `id=eq.${id}`,
                    },
                    (payload) => {
                        console.log('Prescription change received!', payload);
                        fetchPrescriptionDetails();
                    }
                )
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'prescription_pharmacy_responses',
                        filter: `prescription_id=eq.${id}`,
                    },
                    (payload) => {
                        console.log('Pharmacy response change received!', payload);
                        fetchPrescriptionDetails();
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(subscription);
            };
        } else if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, id, router, fetchPrescriptionDetails]);

    const handleBack = () => {
        router.push('/');
    };

    return {
        prescription,
        pharmacyResponses,
        loading,
        authLoading,
        handleBack,
    };
};
