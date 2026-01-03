import React from "react"; // Added React import
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import UploadPrescriptionPage from "./pages/UploadPrescriptionPage";
import RiderDashboardPage from "./pages/RiderDashboardPage";
import PrescriptionDetailsPage from "./pages/PrescriptionDetailsPage";
import { AuthProvider, ProtectedRoute } from "./components/AuthProvider";
import Footer from "./components/ui/animated-footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
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
        </AuthProvider>
      </BrowserRouter>
      <Footer
        leftLinks={[
          { href: "/terms-of-service", label: "Terms of Service" },
          { href: "/privacy-policy", label: "Privacy Policy" },
          { href: "/how-it-works", label: "How It Works" },
          { href: "/faq", label: "FAQ" },
          { href: "/contact", label: "Contact" },
        ]}
        rightLinks={[
          { href: "/about", label: "About" },
          { href: "https://www.instagram.com/taher_max_", label: "Instagram" },
          { href: "https://www.facebook.com/yourpage", label: "Facebook" }, {/* Placeholder URL */}
          { href: "https://www.linkedin.com/in/yourprofile", label: "LinkedIn" }, {/* Placeholder URL */}
          { href: "https://x.com/taher_max_", label: "Twitter" },
          { href: "https://github.com/tahermaxse", label: "GitHub" },
        ]}
        copyrightText="Medanit Ale 2025. All Rights Reserved"
        barCount={23}
      />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;