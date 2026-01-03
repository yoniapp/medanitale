"use client";

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardOverview from '@/components/admin/DashboardOverview';
import UserManagement from '@/components/admin/UserManagement';
import PrescriptionManagement from '@/components/admin/PrescriptionManagement';
import PharmacyManagement from '@/components/admin/PharmacyManagement';
import { useLocation, useNavigate } from 'react-router-dom';

const AdminDashboardPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialSection = queryParams.get('section') || 'overview';
  const [activeSection, setActiveSection] = useState(initialSection);

  useEffect(() => {
    const sectionFromUrl = queryParams.get('section') || 'overview';
    setActiveSection(sectionFromUrl);
  }, [location.search, queryParams]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    navigate(`/admin-dashboard?section=${section}`);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview />;
      case 'users':
        return <UserManagement />;
      case 'prescriptions':
        return <PrescriptionManagement />;
      case 'pharmacies':
        return <PharmacyManagement />;
      // case 'logs':
      //   return <div>Audit & Logs Content (Future)</div>;
      // case 'notifications':
      //   return <div>Notifications & Alerts Content (Future)</div>;
      // case 'analytics':
      //   return <div>Analytics Content (Future)</div>;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <AdminSidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
      <div className="flex-1 flex flex-col lg:ml-64"> {/* Adjust margin for desktop sidebar */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;