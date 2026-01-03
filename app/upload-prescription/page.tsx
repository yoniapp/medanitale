"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { usePrescriptionUpload } from '@/hooks/use-prescription-upload';
import { ProtectedRoute } from '@/components/AuthProvider';

export default function UploadPrescriptionPage() {
    const router = useRouter();
    const { selectedFile, loading, handleFileChange, handleSubmit } = usePrescriptionUpload();

    return (
        <ProtectedRoute>
            <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
                <Card className="w-full max-w-md p-6 relative">
                    <CardHeader className="text-center">
                        <Button variant="ghost" onClick={() => router.push('/')} className="absolute top-4 left-4">
                            <ArrowLeft className="h-4 w-4 mr-2" /> Back
                        </Button>
                        <CardTitle className="text-2xl font-bold">Upload Prescription</CardTitle>
                        <CardDescription>
                            Please upload a clear image of your prescription.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="prescription-image" className="sr-only">Prescription Image</label>
                                <Input
                                    id="prescription-image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required
                                    className="w-full"
                                />
                                {selectedFile && (
                                    <p className="text-sm text-gray-500 mt-2">Selected file: {selectedFile.name}</p>
                                )}
                            </div>
                            <Button type="submit" className="w-full" disabled={loading || !selectedFile}>
                                {loading ? 'Uploading...' : 'Submit Prescription'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoute>
    );
}
