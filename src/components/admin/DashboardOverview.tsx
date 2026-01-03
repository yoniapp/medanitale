"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle2, Users, Hospital } from 'lucide-react';
import { useDashboardOverviewLogic } from '@/hooks/use-dashboard-overview-logic';

const DashboardOverview: React.FC = () => {
  const { metrics, loading, handleAction } = useDashboardOverviewLogic();

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold">Dashboard Overview</h2>

      {loading ? (
        <div className="text-center text-muted-foreground">Loading metrics...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Prescriptions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalPrescriptions}</div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Prescriptions</CardTitle>
              <FileText className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.pendingPrescriptions}</div>
              <p className="text-xs text-muted-foreground">Awaiting pharmacy response</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed Prescriptions</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.confirmedPrescriptions}</div>
              <p className="text-xs text-muted-foreground">Pharmacies confirmed stock</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Registered Pharmacies</CardTitle>
              <Hospital className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.registeredPharmacies}</div>
              <p className="text-xs text-muted-foreground">Total active pharmacies</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.activeUsers}</div>
              <p className="text-xs text-muted-foreground">Total user profiles</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Perform common administrative tasks.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Button variant="outline" onClick={() => handleAction('/admin-dashboard?section=prescriptions&filter=pending')}>
            View Pending Prescriptions
          </Button>
          <Button variant="outline" onClick={() => handleAction('/admin-dashboard?section=prescriptions&filter=pharmacy_confirmed')}>
            View Confirmed Prescriptions
          </Button>
          <Button variant="outline" onClick={() => handleAction('/admin-dashboard?section=users')}>
            Manage Users
          </Button>
          <Button variant="outline" onClick={() => handleAction('/admin-dashboard?section=pharmacies')}>
            Manage Pharmacies
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;