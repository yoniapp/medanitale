"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth, ProtectedRoute } from '@/components/AuthProvider';
import { showLoading, dismissToast, showError, showSuccess } from '@/utils/toast';
import RiderPrescriptionCard from '@/components/RiderPrescriptionCard';
import { Button } from '@/components/ui/button';
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

export default function RiderDashboardPage() {
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

    if (authLoading || fetchingTasks) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">Loading tasks...</div>;
    }

    return (
        <ProtectedRoute allowedRoles={['rider', 'admin']}>
            <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-4">
                <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl mb-8 mt-8">
                    <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Rider Dashboard</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                        Available tasks for you.
                    </p>
                    {user && (
                        <div className="mb-6">
                            <p className="text-lg text-gray-700 dark:text-gray-200">
                                Rider ID: <span className="font-mono">{user.id}</span>
                            </p>
                        </div>
                    )}
                    <Button onClick={handleLogout} variant="outline">
                        Logout
                    </Button>
                </div>

                <div className="w-full max-w-4xl">
                    <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">Available Prescriptions</h2>
                    {availablePrescriptions.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                            {availablePrescriptions.map((prescription) => (
                                <RiderPrescriptionCard
                                    key={prescription.id}
                                    prescription={prescription}
                                    onAccept={handleTaskAccepted}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-lg text-gray-600 dark:text-gray-300 text-center">No available prescription tasks at the moment.</p>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
