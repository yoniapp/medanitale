"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { MadeWithDyad } from '@/components/made-with-dyad';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4 text-center">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
          Welcome to Medanit Ale!
        </h1>
        <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
          Your trusted platform for managing and delivering prescriptions.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            onClick={() => navigate('/login')}
            className="px-8 py-3 text-lg"
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/login')} // Can be changed to a "Learn More" page if needed
            className="px-8 py-3 text-lg"
          >
            Learn More
          </Button>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default LandingPage;