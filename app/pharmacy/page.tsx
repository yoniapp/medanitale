"use client";

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/AuthProvider';
import { usePharmacyDashboard } from '@/hooks/use-pharmacy-dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Hospital, MapPin, CalendarDays, CheckCircle2, XCircle, Search, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function PharmacyDashboardPage() {
    const { requests, loading, respondToRequest } = usePharmacyDashboard();
    const [prices, setPrices] = useState<Record<string, string>>({});

    const handlePriceChange = (id: string, value: string) => {
        setPrices(prev => ({ ...prev, [id]: value }));
    };

    return (
        <ProtectedRoute allowedRoles={['pharmacy']}>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8">
                <div className="max-w-5xl mx-auto">
                    <header className="flex justify-between items-center mb-10">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <Hospital className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold">Pharmacy Dashboard</h1>
                                <p className="text-muted-foreground">Manage incoming medicine availability requests.</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="px-4 py-1 text-sm">
                            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                            Live Updates Active
                        </Badge>
                    </header>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                            <p className="text-muted-foreground font-medium">Loading requests...</p>
                        </div>
                    ) : requests.length === 0 ? (
                        <Card className="border-dashed border-2 bg-transparent">
                            <CardContent className="flex flex-col items-center justify-center py-20">
                                <Search className="h-16 w-16 text-muted-foreground mb-4 opacity-20" />
                                <h3 className="text-xl font-semibold mb-2">No pending requests</h3>
                                <p className="text-muted-foreground">New requests will appear here automatically.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {requests.map((request) => (
                                <Card key={request.id} className="overflow-hidden flex flex-col h-full border-none shadow-md hover:shadow-lg transition-shadow">
                                    <div className="shrink-0 relative h-40 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                        {request.image_url ? (
                                            <img
                                                src={request.image_url}
                                                alt="Prescription"
                                                className="object-cover w-full h-full"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                <ImageIcon className="h-8 w-8" />
                                                <span className="text-xs font-medium">Digital Search Request</span>
                                            </div>
                                        )}
                                        <Badge className="absolute top-3 right-3 bg-blue-500 hover:bg-blue-600">
                                            {request.image_url ? 'Photo' : 'Digital Search'}
                                        </Badge>
                                    </div>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-xl leading-tight">
                                            {request.notes?.replace('Search Request: ', '') || 'Prescription Request'}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2 mt-1">
                                            <CalendarDays className="h-3 w-3" />
                                            {new Date(request.upload_date).toLocaleString()}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pb-4 flex-grow">
                                        <div className="space-y-4">
                                            <div className="p-3 bg-muted/50 rounded-lg text-sm">
                                                <span className="font-semibold block mb-1">Patient Details:</span>
                                                <span className="text-muted-foreground">{request.profiles?.email || 'Anonymous'}</span>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                    Enter Estimated Price (Optional)
                                                </label>
                                                <Input
                                                    type="number"
                                                    placeholder="Price in ETB"
                                                    value={prices[request.id] || ''}
                                                    onChange={(e) => handlePriceChange(request.id, e.target.value)}
                                                    className="bg-background"
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="grid grid-cols-2 gap-3 pt-4 border-t bg-muted/30">
                                        <Button
                                            variant="outline"
                                            className="w-full bg-white dark:bg-transparent"
                                            onClick={() => respondToRequest(request.id, false)}
                                        >
                                            <XCircle className="h-4 w-4 mr-2 text-red-500" />
                                            No Stock
                                        </Button>
                                        <Button
                                            className="w-full"
                                            onClick={() => respondToRequest(request.id, true, Number(prices[request.id]) || undefined)}
                                        >
                                            <CheckCircle2 className="h-4 w-4 mr-2" />
                                            Confirmed
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}
