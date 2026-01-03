"use client";

import React, { useState } from 'react';
import { showLoading, dismissToast, showError, showSuccess } from '@/utils/toast';
import { useNavigate } from 'react-router-dom';

export const usePrescriptionUpload = () => {
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
      // Simulate API call for uploading the file
      await new Promise(resolve => setTimeout(resolve, 2000));

      showSuccess('Prescription uploaded successfully! We will find a rider for you.');
      navigate('/'); // Navigate back to home after "upload"
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