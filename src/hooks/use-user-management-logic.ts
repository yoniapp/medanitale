"use client";

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { showLoading, dismissToast, showError, showSuccess } from '@/utils/toast';
import { useAuth } from '@/components/AuthProvider';

interface UserProfile {
    id: string;
    email: string;
    role: 'patient' | 'rider' | 'admin' | 'pharmacy' | 'doctor' | 'caregiver';
    is_blocked: boolean;
    created_at: string;
}

export const useUserManagementLogic = () => {
    const { user: adminUser } = useAuth();
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState<string>('all');

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        const toastId = showLoading('Fetching users...');
        try {
            let query = supabase
                .from('profiles')
                .select('id, email, role, is_blocked, created_at')
                .order('created_at', { ascending: false });

            if (filterRole !== 'all') {
                query = query.eq('role', filterRole);
            }

            if (searchTerm) {
                query = query.ilike('email', `%${searchTerm}%`);
            }

            const { data, error } = await query;

            if (error) throw error;
            setUsers(data as UserProfile[]);
        } catch (error: any) {
            showError(`Error fetching users: ${error.message}`);
            setUsers([]);
        } finally {
            dismissToast(toastId);
            setLoading(false);
        }
    }, [filterRole, searchTerm]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleToggleBlockUser = async (targetUser: UserProfile, currentBlockedStatus: boolean) => {
        const action = currentBlockedStatus ? 'Unblocking' : 'Blocking';
        const logAction = currentBlockedStatus ? 'USER_UNBLOCKED' : 'USER_BLOCKED';
        const toastId = showLoading(`${action} user...`);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_blocked: !currentBlockedStatus })
                .eq('id', targetUser.id);

            if (error) throw error;

            await supabase.from('logs').insert({
                user_id: adminUser?.id,
                action: logAction,
                target_id: targetUser.id,
                description: `${adminUser?.email || 'Admin'} ${action.toLowerCase()} user ${targetUser.email}.`,
                metadata: {
                    target_user_email: targetUser.email,
                    previous_status: currentBlockedStatus,
                    new_status: !currentBlockedStatus,
                },
            });

            showSuccess(`User ${currentBlockedStatus ? 'unblocked' : 'blocked'} successfully!`);
            fetchUsers();
        } catch (error: any) {
            showError(`Error ${action.toLowerCase()} user: ${error.message}`);
        } finally {
            dismissToast(toastId);
        }
    };

    return {
        users,
        loading,
        searchTerm,
        setSearchTerm,
        filterRole,
        setFilterRole,
        handleToggleBlockUser,
    };
};
