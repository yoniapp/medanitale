"use client";

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Image as ImageIcon, CalendarDays, CheckCircle2, XCircle, Truck, Package, Search, Eye } from 'lucide-react';
import { usePrescriptionManagementLogic } from '@/hooks/use-prescription-management-logic';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  assigned: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  picked_up: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  awaiting_pharmacy_response: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  pharmacy_confirmed: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <CalendarDays className="h-3 w-3 mr-1" />,
  assigned: <Truck className="h-3 w-3 mr-1" />,
  picked_up: <Package className="h-3 w-3 mr-1" />,
  delivered: <CheckCircle2 className="h-3 w-3 mr-1" />,
  rejected: <XCircle className="h-3 w-3 mr-1" />,
  awaiting_pharmacy_response: <Search className="h-3 w-3 mr-1" />,
  pharmacy_confirmed: <CheckCircle2 className="h-3 w-3 mr-1" />,
};

const PrescriptionManagement: React.FC = () => {
  const {
    prescriptions,
    loading,
    filterStatus,
    setFilterStatus,
    handleViewDetails,
  } = usePrescriptionManagementLogic();

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold">Prescription Management</h2>

      <div className="flex justify-end mb-4">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="awaiting_pharmacy_response">Awaiting Pharmacy Response</SelectItem>
            <SelectItem value="pharmacy_confirmed">Pharmacy Confirmed</SelectItem>
            <SelectItem value="pending">Pending (Rider)</SelectItem>
            <SelectItem value="assigned">Assigned (Rider)</SelectItem>
            <SelectItem value="picked_up">Picked Up</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-center text-muted-foreground">Loading prescriptions...</div>
      ) : prescriptions.length === 0 ? (
        <div className="text-center text-muted-foreground">No prescriptions found.</div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Uploader ID</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell className="font-medium">{prescription.id.substring(0, 8)}...</TableCell>
                  <TableCell>{prescription.user_id.substring(0, 8)}...</TableCell>
                  <TableCell>
                    {prescription.image_url ? (
                      <img src={prescription.image_url} alt="Prescription" className="h-10 w-10 object-cover rounded-md" />
                    ) : (
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={`${statusColors[prescription.status]} flex items-center w-fit`}>
                      {statusIcons[prescription.status]}
                      {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1).replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(prescription.upload_date).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(prescription.id)}>
                      <Eye className="h-4 w-4 mr-2" /> View
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

export default PrescriptionManagement;