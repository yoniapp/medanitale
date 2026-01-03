"use client";

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { showLoading, dismissToast, showError } from '@/utils/toast';

interface LogEntry {
    id: string;
    timestamp: string;
    user_id: string | null;
    action: string;
    target_id: string | null;
    description: string | null;
    metadata: Record<string, any> | null;
}

export const useAuditLogsLogic = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterAction, setFilterAction] = useState<string>('all');

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        const toastId = showLoading('Fetching audit logs...');
        try {
            let query = supabase
                .from('logs')
                .select('*')
                .order('timestamp', { ascending: false });

            if (filterAction !== 'all') {
                query = query.eq('action', filterAction);
            }

            if (searchTerm) {
                query = query.ilike('description', `%${searchTerm}%`);
            }

            const { data, error } = await query;

            if (error) throw error;
            setLogs(data as LogEntry[]);
        } catch (error: any) {
            showError(`Error fetching logs: ${error.message}`);
            setLogs([]);
        } finally {
            dismissToast(toastId);
            setLoading(false);
        }
    }, [filterAction, searchTerm]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    return {
        logs,
        loading,
        searchTerm,
        setSearchTerm,
        filterAction,
        setFilterAction,
    };
};
