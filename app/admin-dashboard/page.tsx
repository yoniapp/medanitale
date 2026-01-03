"use client";

import React, { Suspense } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import DashboardOverview from '@/components/admin/DashboardOverview';
import UserManagement from '@/components/admin/UserManagement';
import PrescriptionManagement from '@/components/admin/PrescriptionManagement';
import PharmacyManagement from '@/components/admin/PharmacyManagement';
import AuditLogs from '@/components/admin/AuditLogs';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProtectedRoute } from '@/components/AuthProvider';

function AdminDashboardContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeSection = searchParams.get('section') || 'overview';

    const handleSectionChange = (section: string) => {
        router.push(`/admin-dashboard?section=${section}`);
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
            case 'logs':
                return <AuditLogs />;
            default:
                return <DashboardOverview />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
            <AdminSidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
            <div className="flex-1 flex flex-col lg:ml-64">
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

export default function AdminDashboardPage() {
    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <Suspense fallback={<div>Loading dashboard...</div>}>
                <AdminDashboardContent />
            </Suspense>
        </ProtectedRoute>
    );
}
