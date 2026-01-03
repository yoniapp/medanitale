"use client";

import React from 'react';
import { ProtectedRoute } from '@/components/AuthProvider';
import RiderPrescriptionCard from '@/components/RiderPrescriptionCard';
import { Button } from '@/components/ui/button';
import { useRiderDashboardLogic } from '@/hooks/use-rider-dashboard-logic';

export default function RiderDashboardPage() {
    const {
        user,
        authLoading,
        availablePrescriptions,
        fetchingTasks,
        handleTaskAccepted,
        handleLogout,
    } = useRiderDashboardLogic();

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
