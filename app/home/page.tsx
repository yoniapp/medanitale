"use client";

import { MadeWithDyad } from "@/components/made-with-dyad";
import { ProtectedRoute } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import PrescriptionCard from "@/components/PrescriptionCard";
import React from "react";
import { ImageUploadDemo } from "@/components/ImageUploadDemo";
import { useHomeLogic } from "@/hooks/use-home-logic";

export default function HomePage() {
    const {
        user,
        profile,
        authLoading,
        prescriptions,
        fetchingPrescriptions,
        handleLogout,
        handleUploadPrescription,
        handleGoToRiderDashboard,
        handleGoToAdminDashboard,
        handleViewPrescriptionDetails,
    } = useHomeLogic();

    if (authLoading || fetchingPrescriptions) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">Loading data...</div>;
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-4">
                <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-2xl mb-8 mt-8">
                    <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Welcome to Medanit Ale!</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                        You are logged in.
                    </p>
                    {user && (
                        <div className="mb-6">
                            <p className="text-lg text-gray-700 dark:text-gray-200">
                                User ID: <span className="font-mono">{user.id}</span>
                            </p>
                            {user.phone && (
                                <p className="text-lg text-gray-700 dark:text-gray-200">
                                    Phone: <span className="font-mono">{user.phone}</span>
                                </p>
                            )}
                            {profile && (
                                <p className="text-lg text-gray-700 dark:text-gray-200">
                                    Role: <span className="font-mono">{profile.role}</span>
                                </p>
                            )}
                        </div>
                    )}
                    <div className="flex flex-col space-y-4 mt-4">
                        <Button onClick={handleUploadPrescription}>
                            Upload New Prescription
                        </Button>
                        <Button onClick={handleGoToRiderDashboard} variant="secondary">
                            Go to Rider Dashboard
                        </Button>
                        {profile?.role === 'admin' && (
                            <Button onClick={handleGoToAdminDashboard} variant="secondary">
                                Go to Admin Dashboard
                            </Button>
                        )}
                        <Button onClick={handleLogout} variant="outline">
                            Logout
                        </Button>
                    </div>
                </div>

                <div className="w-full max-w-4xl mb-8">
                    <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">Image Upload Demo</h2>
                    <div className="flex justify-center">
                        <ImageUploadDemo />
                    </div>
                </div>

                <div className="w-full max-w-4xl">
                    <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">Your Prescriptions</h2>
                    {prescriptions.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
                            {prescriptions.map((prescription) => (
                                <PrescriptionCard
                                    key={prescription.id}
                                    id={prescription.id}
                                    imageUrl={prescription.image_url}
                                    status={prescription.status}
                                    uploadDate={prescription.upload_date}
                                    notes={prescription.notes}
                                    onViewDetails={handleViewPrescriptionDetails}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-lg text-gray-600 dark:text-gray-300 text-center">No prescriptions uploaded yet.</p>
                    )}
                </div>
                <MadeWithDyad />
            </div>
        </ProtectedRoute>
    );
}
