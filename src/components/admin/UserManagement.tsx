"use client";

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Ban, CheckCircle2, Search } from 'lucide-react';
import { useUserManagementLogic } from '@/hooks/use-user-management-logic';

const UserManagement: React.FC = () => {
  const {
    users,
    loading,
    searchTerm,
    setSearchTerm,
    filterRole,
    setFilterRole,
    handleToggleBlockUser,
  } = useUserManagementLogic();

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