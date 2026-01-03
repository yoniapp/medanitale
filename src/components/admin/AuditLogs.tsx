"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { showLoading, dismissToast, showError } from '@/utils/toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Clock } from 'lucide-react';

interface LogEntry {
  id: string;
  timestamp: string;
  user_id: string | null;
  action: string;
  target_id: string | null;
  description: string | null;
  metadata: Record<string, any> | null;
}

const AuditLogs: React.FC = () => {
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

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold">Audit & Logs</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        <Select value={filterAction} onValueChange={setFilterAction}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Filter by Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            <SelectItem value="USER_BLOCKED">User Blocked</SelectItem>
            <SelectItem value="USER_UNBLOCKED">User Unblocked</SelectItem>
            <SelectItem value="PHARMACY_VERIFIED">Pharmacy Verified</SelectItem>
            <SelectItem value="PHARMACY_UNVERIFIED">Pharmacy Unverified</SelectItem>
            <SelectItem value="PRESCRIPTION_UPLOADED">Prescription Uploaded</SelectItem>
            <SelectItem value="PRESCRIPTION_STATUS_UPDATE">Prescription Status Update</SelectItem>
            <SelectItem value="PHARMACY_RESPONSE">Pharmacy Response</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground">Loading logs...</div>
      ) : logs.length === 0 ? (
        <div className="text-center text-muted-foreground">No audit logs found.</div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Target ID</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Metadata</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium text-xs">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                      {log.action.replace(/_/g, ' ')}
                    </div>
                  </TableCell>
                  <TableCell>{log.user_id ? log.user_id.substring(0, 8) + '...' : 'N/A'}</TableCell>
                  <TableCell>{log.target_id ? log.target_id.substring(0, 8) + '...' : 'N/A'}</TableCell>
                  <TableCell className="max-w-[200px] truncate">{log.description}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[150px] truncate">
                    {log.metadata ? JSON.stringify(log.metadata) : 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;