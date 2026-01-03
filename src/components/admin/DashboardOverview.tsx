"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { showLoading, dismissToast, showError } from '@/utils/toast';
import { FileText, CheckCircle2, Users, Hospital } from 'lucide-react';
import { useRouter } from 'next/navigation';

const DashboardOverview: React.FC = () => {
  const router = useRouter();
  const [metrics, setMetrics] = useState({
    totalPrescriptions: 0,
    pendingPrescriptions: 0,
    confirmedPrescriptions: 0,
    registeredPharmacies: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      const toastId = showLoading('Fetching dashboard metrics...');
      try {
        const { count: totalPrescriptionsCount, error: totalError } = await supabase
          .from('prescriptions')
          .select('*', { count: 'exact', head: true });
        if (totalError) throw totalError;

        const { count: pendingPrescriptionsCount, error: pendingError } = await supabase
          .from('prescriptions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'awaiting_pharmacy_response');
        if (pendingError) throw pendingError;

        const { count: confirmedPrescriptionsCount, error: confirmedError } = await supabase
          .from('prescriptions')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pharmacy_confirmed');
        if (confirmedError) throw confirmedError;

        const { count: pharmaciesCount, error: pharmaciesError } = await supabase
          .from('pharmacies')
          .select('*', { count: 'exact', head: true });
        if (pharmaciesError) throw pharmaciesError;

        const { count: activeUsersCount, error: usersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        if (usersError) throw usersError;

        setMetrics({
          totalPrescriptions: totalPrescriptionsCount || 0,
          pendingPrescriptions: pendingPrescriptionsCount || 0,
          confirmedPrescriptions: confirmedPrescriptionsCount || 0,
          registeredPharmacies: pharmaciesCount || 0,
          activeUsers: activeUsersCount || 0,
        });
      } catch (error: any) {
        showError(`Error fetching metrics: ${error.message}`);
      } finally {
        dismissToast(toastId);
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

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
          <Button variant="outline" onClick={() => router.push('/admin-dashboard?section=prescriptions&filter=pending')}>
            View Pending Prescriptions
          </Button>
          <Button variant="outline" onClick={() => router.push('/admin-dashboard?section=prescriptions&filter=pharmacy_confirmed')}>
            View Confirmed Prescriptions
          </Button>
          <Button variant="outline" onClick={() => router.push('/admin-dashboard?section=users')}>
            Manage Users
          </Button>
          <Button variant="outline" onClick={() => router.push('/admin-dashboard?section=pharmacies')}>
            Manage Pharmacies
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;