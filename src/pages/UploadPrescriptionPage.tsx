"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { showLoading, dismissToast, showError, showSuccess } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const UploadPrescriptionPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      showError('Please select a prescription image to upload.');
      return;
    }

    setLoading(true);
    const toastId = showLoading('Uploading prescription...');

    try {
      // In a real application, you would upload the file to Supabase Storage here
      // and then create a record in your database.
      // For now, we'll simulate a successful upload.
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      showSuccess('Prescription uploaded successfully! We will find a rider for you.');
      navigate('/'); // Navigate back to home after "upload"
    } catch (error: any) {
      showError(`Error uploading prescription: ${error.message}`);
    } finally {
      dismissToast(toastId);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md p-6">
        <CardHeader className="text-center">
          <Button variant="ghost" onClick={() => navigate('/')} className="absolute top-4 left-4">
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
  );
};

export default UploadPrescriptionPage;