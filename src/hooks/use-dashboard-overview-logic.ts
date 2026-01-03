"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { showLoading, dismissToast, showError } from '@/utils/toast';
import { useRouter } from 'next/navigation';

export const useDashboardOverviewLogic = () => {
    const router = useRouter();
    const [metrics, setMetrics] = useState({
        totalPrescriptions: 0,
        pendingPrescriptions: 0,
        confirmedPrescriptions: 0,
        registeredPharmacies: 0,
        activeUsers: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMetrics = async () => {
            setLoading(true);
            const toastId = showLoading('Fetching dashboard metrics...');
            try {
                const { count: totalPrescriptionsCount, error: totalError } = await supabase
                    .from('prescriptions')
                    .select('*', { count: 'exact', head: true });
                if (totalError) throw totalError;

                const { count: pendingPrescriptionsCount, error: pendingError } = await supabase
                    .from('prescriptions')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'awaiting_pharmacy_response');
                if (pendingError) throw pendingError;

                const { count: confirmedPrescriptionsCount, error: confirmedError } = await supabase
                    .from('prescriptions')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'pharmacy_confirmed');
                if (confirmedError) throw confirmedError;

                const { count: pharmaciesCount, error: pharmaciesError } = await supabase
                    .from('pharmacies')
                    .select('*', { count: 'exact', head: true });
                if (pharmaciesError) throw pharmaciesError;

                const { count: activeUsersCount, error: usersError } = await supabase
                    .from('profiles')
                    .select('*', { count: 'exact', head: true });
                if (usersError) throw usersError;

                setMetrics({
                    totalPrescriptions: totalPrescriptionsCount || 0,
                    pendingPrescriptions: pendingPrescriptionsCount || 0,
                    confirmedPrescriptions: confirmedPrescriptionsCount || 0,
                    registeredPharmacies: pharmaciesCount || 0,
                    activeUsers: activeUsersCount || 0,
                });
            } catch (error: any) {
                showError(`Error fetching metrics: ${error.message}`);
            } finally {
                dismissToast(toastId);
                setLoading(false);
            }
        };

        fetchMetrics();
    }, []);

    const handleAction = (path: string) => {
        router.push(path);
    };

    return {
        metrics,
        loading,
        handleAction,
    };
};
