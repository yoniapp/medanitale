"use client";

import React, { useState } from 'react';
import { showLoading, dismissToast, showError, showSuccess } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider'; // Import useAuth to get the current user

export const usePrescriptionUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the current user from AuthProvider

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
    if (!user) {
      showError('You must be logged in to upload a prescription.');
      return;
    }

    setLoading(true);
    const toastId = showLoading('Uploading prescription...');

    try {
      const fileExtension = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
      const filePath = `prescriptions/${user.id}/${fileName}`;

      // 1. Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('prescription-images') // Ensure you have a bucket named 'prescription-images'
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get the public URL of the uploaded file
      const { data: publicUrlData } = supabase.storage
        .from('prescription-images')
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        throw new Error('Could not get public URL for uploaded image.');
      }

      // 2. Insert prescription record into Supabase database
      const { error: insertError } = await supabase
        .from('prescriptions') // Ensure you have a table named 'prescriptions'
        .insert([
          {
            user_id: user.id,
            image_url: publicUrlData.publicUrl,
            status: 'awaiting_pharmacy_response', // New initial status
            upload_date: new Date().toISOString(),
          },
        ]);

      if (insertError) throw insertError;

      showSuccess('Prescription uploaded successfully! We are now checking with nearby pharmacies.');
      navigate('/'); // Navigate back to home after successful upload
    } catch (error: any) {
      showError(`Error uploading prescription: ${error.message}`);
    } finally {
      dismissToast(toastId);
      setLoading(false);
    }
  };

  return {
    selectedFile,
    loading,
    handleFileChange,
    handleSubmit,
  };
};