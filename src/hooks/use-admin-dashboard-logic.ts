"use client";

import { useRouter, useSearchParams } from 'next/navigation';

export const useAdminDashboardLogic = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeSection = searchParams.get('section') || 'overview';

    const handleSectionChange = (section: string) => {
        router.push(`/admin-dashboard?section=${section}`);
    };

    return {
        activeSection,
        handleSectionChange,
    };
};
