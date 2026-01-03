"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroGeometric } from '@/components/ui/shape-landing-hero'; // Import the new HeroGeometric component

const LandingPage = () => {
  const navigate = useNavigate();

  // The HeroGeometric component will take up the full screen and handle its own content.
  // If you need buttons or other interactive elements on top of it, you would layer them.
  // For now, we'll just render the HeroGeometric.
  return (
    <div className="relative min-h-screen w-full">
      <HeroGeometric
        badge="Medanit Ale"
        title1="Your Health, Delivered"
        title2="Seamless Prescription Management"
      />
      {/* You can add overlay content here if needed, e.g., a "Get Started" button */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20">
        <button
          onClick={() => navigate('/login')}
          className="px-8 py-3 text-lg bg-white text-gray-900 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default LandingPage;