/** @jsxImportSource react */
import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import UploadPrescriptionPage from "./pages/UploadPrescriptionPage";
import RiderDashboardPage from "./pages/RiderDashboardPage";
import PrescriptionDetailsPage from "./pages/PrescriptionDetailsPage";
import { ProtectedRoute } from "./components/AuthProvider";
import AppProviders from "./components/AppProviders"; // Import the new AppProviders component

const App = () => (
  <AppProviders>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload-prescription"
        element={
          <ProtectedRoute>
            <UploadPrescriptionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rider-dashboard"
        element={
          <ProtectedRoute>
            <RiderDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/prescription/:id"
        element={
          <ProtectedRoute>
            <PrescriptionDetailsPage />
          </ProtectedRoute>
        }
      />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </AppProviders>
);

export default App;