"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Image as ImageIcon, CalendarDays, CheckCircle2, XCircle, Truck, Package, Search, Hospital } from 'lucide-react'; // Changed Pharmacy to Hospital

interface PrescriptionCardProps {
  id: string;
  imageUrl: string;
  status: 'pending' | 'assigned' | 'picked_up' | 'delivered' | 'rejected' | 'awaiting_pharmacy_response' | 'pharmacy_confirmed';
  uploadDate: string;
  notes?: string;
  onViewDetails: (id: string) => void;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  assigned: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  picked_up: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  awaiting_pharmacy_response: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  pharmacy_confirmed: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
};

const statusIcons = {
  pending: <CalendarDays className="h-4 w-4 mr-1" />,
  assigned: <Truck className="h-4 w-4 mr-1" />,
  picked_up: <Package className="h-4 w-4 mr-1" />,
  delivered: <CheckCircle2 className="h-4 w-4 mr-1" />,
  rejected: <XCircle className="h-4 w-4 mr-1" />,
  awaiting_pharmacy_response: <Search className="h-4 w-4 mr-1" />,
  pharmacy_confirmed: <CheckCircle2 className="h-4 w-4 mr-1" />,
};

const PrescriptionCard: React.FC<PrescriptionCardProps> = ({
  id,
  imageUrl,
  status,
  uploadDate,
  notes,
  onViewDetails,
}) => {
  return (
    <Card className="w-full max-w-sm overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt="Prescription" className="object-cover w-full h-full" />
        ) : (
          <ImageIcon className="h-12 w-12 text-gray-400 dark:text-gray-500" />
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">Prescription</CardTitle>
          <Badge className={`${statusColors[status]} flex items-center`}>
            {statusIcons[status]}
            {status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')}
          </Badge>
        </div>
        <CardDescription className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <CalendarDays className="h-3 w-3 mr-1" />
          Uploaded: {new Date(uploadDate).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {notes && (
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
            <span className="font-medium">Notes:</span> {notes}
          </p>
        )}
        <Button onClick={() => onViewDetails(id)} className="w-full mt-4">
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default PrescriptionCard;