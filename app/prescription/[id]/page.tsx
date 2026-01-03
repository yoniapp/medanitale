"use client";

import React from 'react';
import { ProtectedRoute } from '@/components/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Image as ImageIcon, CalendarDays, CheckCircle2, XCircle, Truck, Package, Search, MapPin, DollarSign } from 'lucide-react';
import { usePrescriptionDetailsLogic } from '@/hooks/use-prescription-details-logic';

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    assigned: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    picked_up: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    awaiting_pharmacy_response: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    pharmacy_confirmed: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
};

const statusIcons: Record<string, React.ReactNode> = {
    pending: <CalendarDays className="h-4 w-4 mr-1" />,
    assigned: <Truck className="h-4 w-4 mr-1" />,
    picked_up: <Package className="h-4 w-4 mr-1" />,
    delivered: <CheckCircle2 className="h-4 w-4 mr-1" />,
    rejected: <XCircle className="h-4 w-4 mr-1" />,
    awaiting_pharmacy_response: <Search className="h-4 w-4 mr-1" />,
    pharmacy_confirmed: <CheckCircle2 className="h-4 w-4 mr-1" />,
};

export default function PrescriptionDetailsPage() {
    const {
        prescription,
        pharmacyResponses,
        loading,
        authLoading,
        handleBack,
    } = usePrescriptionDetailsLogic();

    if (loading || authLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">Loading details...</div>;
    }

    if (!prescription) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
                <Card className="w-full max-w-md p-6 text-center">
                    <CardTitle className="text-2xl font-bold mb-4">Prescription Not Found</CardTitle>
                    <CardDescription>The prescription you are looking for does not exist or you do not have access.</CardDescription>
                    <Button onClick={handleBack} className="mt-6">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-4">
                <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-8 mt-8 relative">
                    <Button variant="ghost" onClick={handleBack} className="absolute top-4 left-4">
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    <CardHeader className="text-center">
                        <CardTitle className="text-3xl font-bold">Prescription Details</CardTitle>
                        <CardDescription className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                            <CalendarDays className="h-3 w-3 mr-1" />
                            Uploaded: {new Date(prescription.upload_date).toLocaleDateString()}
                        </CardDescription>
                        <Badge className={`${statusColors[prescription.status]} flex items-center justify-center mx-auto mt-2 w-fit`}>
                            {statusIcons[prescription.status]}
                            {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1).replace(/_/g, ' ')}
                        </Badge>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="relative h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center rounded-md overflow-hidden">
                            {prescription.image_url ? (
                                <img src={prescription.image_url} alt="Prescription" className="object-contain w-full h-full" />
                            ) : (
                                <ImageIcon className="h-16 w-16 text-gray-400 dark:text-gray-500" />
                            )}
                        </div>
                        {prescription.notes && (
                            <p className="text-base text-gray-700 dark:text-gray-300">
                                <span className="font-medium">Notes:</span> {prescription.notes}
                            </p>
                        )}

                        <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900 dark:text-white text-center">Pharmacy Responses</h2>
                        {pharmacyResponses.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {pharmacyResponses.map((response) => (
                                    <Card key={response.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between">
                                        <div>
                                            <CardTitle className="text-lg">{response.pharmacies.name}</CardTitle>
                                            {response.pharmacies.address && (
                                                <CardDescription className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                    <MapPin className="h-3 w-3 mr-1" /> {response.pharmacies.address}
                                                </CardDescription>
                                            )}
                                            {response.price && (
                                                <p className="flex items-center text-md text-gray-800 dark:text-gray-200 mt-2">
                                                    <DollarSign className="h-4 w-4 mr-1" /> Price: {response.price} ETB
                                                </p>
                                            )}
                                            {response.notes && (
                                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                                                    <span className="font-medium">Pharmacy Notes:</span> {response.notes}
                                                </p>
                                            )}
                                        </div>
                                        <Button className="mt-4 sm:mt-0 sm:ml-4">Select Pharmacy</Button>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <p className="text-lg text-gray-600 dark:text-gray-300 text-center">
                                No pharmacies have confirmed stock yet. Please check back later.
                            </p>
                        )}
                    </CardContent>
                </div>
            </div>
        </ProtectedRoute>
    );
}
