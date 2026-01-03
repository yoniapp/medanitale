"use client";

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Mail, Phone, MapPin } from 'lucide-react';
import { usePharmacyManagementLogic } from '@/hooks/use-pharmacy-management-logic';

const PharmacyManagement: React.FC = () => {
  const {
    pharmacies,
    loading,
    handleToggleVerification,
  } = usePharmacyManagementLogic();

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold">Pharmacy Management</h2>

      {loading ? (
        <div className="text-center text-muted-foreground">Loading pharmacies...</div>
      ) : pharmacies.length === 0 ? (
        <div className="text-center text-muted-foreground">No pharmacies found.</div>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registered On</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pharmacies.map((pharmacy) => (
                <TableRow key={pharmacy.id}>
                  <TableCell className="font-medium">{pharmacy.id.substring(0, 8)}...</TableCell>
                  <TableCell>{pharmacy.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {pharmacy.contact_email && (
                        <span className="flex items-center text-sm text-muted-foreground">
                          <Mail className="h-3 w-3 mr-1" /> {pharmacy.contact_email}
                        </span>
                      )}
                      {pharmacy.phone_number && (
                        <span className="flex items-center text-sm text-muted-foreground">
                          <Phone className="h-3 w-3 mr-1" /> {pharmacy.phone_number}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {pharmacy.address ? (
                      <span className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" /> {pharmacy.address}
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-sm italic">N/A</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {pharmacy.is_verified ? (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900 dark:text-green-200 flex items-center w-fit">
                        <CheckCircle2 className="h-3 w-3 mr-1" /> Verified
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="flex items-center w-fit">
                        <XCircle className="h-3 w-3 mr-1" /> Unverified
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{new Date(pharmacy.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={pharmacy.is_verified ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => handleToggleVerification(pharmacy, pharmacy.is_verified)}
                    >
                      {pharmacy.is_verified ? 'Unverify' : 'Verify'}
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

export default PharmacyManagement;