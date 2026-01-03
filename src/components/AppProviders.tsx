/** @jsxImportSource react */
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./AuthProvider";
import Footer from "./ui/animated-footer";

const queryClient = new QueryClient();

interface AppProvidersProps {
  children: React.ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          {children}
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
          { href: "https://www.facebook.com/yourpage", label: "Facebook" },
          { href: "https://www.linkedin.com/in/yourprofile", label: "LinkedIn" },
          { href: "https://x.com/taher_max_", label: "Twitter" },
          { href: "https://github.com/tahermaxse", label: "GitHub" },
        ]}
        copyrightText="Medanit Ale 2025. All Rights Reserved"
        barCount={23}
      />
    </TooltipProvider>
  </QueryClientProvider>
);

export default AppProviders;