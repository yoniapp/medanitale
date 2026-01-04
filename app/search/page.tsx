"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMedicineSearch } from '@/hooks/use-medicine-search';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Search, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthProvider';
import { showLoading, dismissToast, showError, showSuccess } from '@/utils/toast';

const strengths = [
    "5mg", "10mg", "20mg", "25mg", "50mg", "100mg", "250mg", "500mg", "1000mg",
    "5ml", "10ml", "15ml", "30ml", "60ml", "120ml"
];

export default function SearchMedicinePage() {
    const router = useRouter();
    const { user } = useAuth();
    const { searchTerm, setSearchTerm, suggestions, loading: searching } = useMedicineSearch();
    const [selectedMedicine, setSelectedMedicine] = useState<string | null>(null);
    const [selectedStrength, setSelectedStrength] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSelectMedicine = (name: string) => {
        setSelectedMedicine(name);
        setSearchTerm(name);
    };

    const handleSubmit = async () => {
        if (!user) {
            showError("You must be logged in to request medicine availability.");
            router.push('/login');
            return;
        }

        if (!selectedMedicine) {
            showError("Please select a medicine first.");
            return;
        }

        setIsSubmitting(true);
        const toastId = showLoading("Submitting request...");

        try {
            const { error } = await supabase
                .from('prescriptions')
                .insert([
                    {
                        user_id: user.id,
                        status: 'awaiting_pharmacy_response',
                        upload_date: new Date().toISOString(),
                        notes: `Search Request: ${selectedMedicine}${selectedStrength ? ` (${selectedStrength})` : ''}`,
                        // We store the medicine identifiers in notes for now as a simple MVP alignment
                    },
                ]);

            if (error) throw error;

            showSuccess("Request submitted! Checking with pharmacies...");
            router.push('/home');
        } catch (error: any) {
            showError(`Error submitting request: ${error.message}`);
        } finally {
            dismissToast(toastId);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                <Button
                    variant="ghost"
                    onClick={() => router.push('/')}
                    className="mb-8 hover:bg-transparent"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
                </Button>

                <Card className="shadow-xl border-none bg-white dark:bg-gray-900">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                            <Search className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="text-3xl font-bold">Search Medicine</CardTitle>
                        <CardDescription className="text-lg">
                            Find which pharmacies have your medication in stock.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {/* Search Input */}
                        <div className="relative">
                            <label className="text-sm font-medium mb-2 block">Medicine Name</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        if (selectedMedicine) setSelectedMedicine(null);
                                    }}
                                    placeholder="Start typing (e.g., Amoxicillin)..."
                                    className="pl-10 h-12 text-lg"
                                />
                                {searching && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                    </div>
                                )}
                            </div>

                            {/* Suggestions Dropdown */}
                            {!selectedMedicine && suggestions.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border rounded-md shadow-lg max-h-60 overflow-auto">
                                    {suggestions.map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-b last:border-0"
                                            onClick={() => handleSelectMedicine(suggestion)}
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Strength Selection (Visible only after medicine selected) */}
                        {selectedMedicine && (
                            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                                <label className="text-sm font-medium mb-3 block">Strength / Dosage (Optional)</label>
                                <div className="flex flex-wrap gap-2">
                                    {strengths.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setSelectedStrength(s === selectedStrength ? null : s)}
                                            className={`px-4 py-2 rounded-full border transition-all ${selectedStrength === s
                                                    ? 'bg-primary text-primary-foreground border-primary'
                                                    : 'hover:border-primary/50'
                                                }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            className="w-full h-14 text-xl font-bold rounded-xl shadow-lg transition-transform active:scale-[0.98]"
                            disabled={!selectedMedicine || isSubmitting}
                            onClick={handleSubmit}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" /> Submitting...
                                </span>
                            ) : (
                                "Check Availability"
                            )}
                        </Button>

                        <p className="text-center text-sm text-muted-foreground">
                            We will notify nearby pharmacies to check their stock.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
