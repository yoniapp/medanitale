"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { showLoading, dismissToast, showError, showSuccess } from '@/utils/toast';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Ban, CheckCircle2, Search, User } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider'; // Import useAuth to get current admin user

interface UserProfile {
  id: string;
  email: string;
  role: 'patient' | 'rider' | 'admin' | 'pharmacy' | 'doctor' | 'caregiver';
  is_blocked: boolean;
  created_at: string;
}

const UserManagement: React.FC = () => {
  const { user: adminUser } = useAuth(); // Get the currently logged-in admin user
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

      // Log the action
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
      fetchUsers(); // Re-fetch users to update the list
    } catch (error: any) {
      showError(`Error ${action.toLowerCase()} user: ${error.message}`);
    } finally {
      dismissToast(toastId);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold">User Management</h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        <Select value={filterRole} onValueChange={setFilterRole}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="patient">Patient</SelectItem>
            <SelectItem value="rider">Rider</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="pharmacy">Pharmacy</SelectItem>
            <SelectItem value="doctor">Doctor</SelectItem>
            <SelectItem value="caregiver">Caregiver</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground">Loading users...</div>
      ) : users.length === 0 ? (
        <div className="text-center text-muted-foreground">No users found.</div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registered On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.id.substring(0, 8)}...</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    {user.is_blocked ? (
                      <Badge variant="destructive" className="flex items-center w-fit">
                        <Ban className="h-3 w-3 mr-1" /> Blocked
                      </Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900 dark:text-green-200 flex items-center w-fit">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Active
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={user.is_blocked ? 'outline' : 'destructive'}
                      size="sm"
                      onClick={() => handleToggleBlockUser(user, user.is_blocked)}
                    >
                      {user.is_blocked ? 'Unblock' : 'Block'}
                    </Button>
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

export default UserManagement;