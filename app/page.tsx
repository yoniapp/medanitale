"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Users, Hospital, UploadCloud, Truck, DollarSign, Search } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';

export default function LandingPage() {
    const router = useRouter();

    return (
        <div className="relative min-h-screen w-full bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-50">
            {/* Hero Section */}
            <HeroGeometric
                badge="Medanit Ale"
                title1="Your Health, Delivered"
                title2="Seamless Prescription Management"
            />
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col sm:flex-row gap-4">
                <Button
                    onClick={() => router.push('/search')}
                    className="px-8 py-3 text-lg bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                    <Search className="h-5 w-5" /> Search Medicine
                </Button>
                <Button
                    onClick={() => router.push('/upload-prescription')}
                    className="px-8 py-3 text-lg bg-white text-gray-900 rounded-full shadow-lg hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                    <UploadCloud className="h-5 w-5" /> Upload Prescription
                </Button>
            </div>

            {/* How It Works Section */}
            <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-12">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="text-center p-6 shadow-lg">
                        <CardHeader>
                            <UploadCloud className="h-12 w-12 text-primary mx-auto mb-4" />
                            <CardTitle className="text-xl font-semibold mb-2">Step 1: Upload Your Prescription</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Take a photo or upload PDF.</p>
                            <p className="text-muted-foreground">Anyone can upload: patient, doctor, or caregiver.</p>
                        </CardContent>
                    </Card>
                    <Card className="text-center p-6 shadow-lg">
                        <CardHeader>
                            <Hospital className="h-12 w-12 text-primary mx-auto mb-4" />
                            <CardTitle className="text-xl font-semibold mb-2">Step 2: Pharmacies Confirm Availability</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Nearby pharmacies see your request.</p>
                            <p className="text-muted-foreground">Only pharmacies can confirm if they have the medicine.</p>
                        </CardContent>
                    </Card>
                    <Card className="text-center p-6 shadow-lg">
                        <CardHeader>
                            <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
                            <CardTitle className="text-xl font-semibold mb-2">Step 3: Get Your Medicine</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">See which pharmacy has your prescription.</p>
                            <p className="text-muted-foreground">Go there or request delivery (future feature).</p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Features / Benefits Section */}
            <section className="bg-gray-100 dark:bg-gray-900 py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto rounded-lg shadow-inner">
                <h2 className="text-4xl font-bold text-center mb-12">Why Medanit Ale?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <Card className="p-6 text-center shadow-md">
                        <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-4" />
                        <CardTitle className="text-lg font-semibold">Fast</CardTitle>
                        <CardContent className="p-0 pt-2 text-muted-foreground">No more wandering between pharmacies.</CardContent>
                    </Card>
                    <Card className="p-6 text-center shadow-md">
                        <UploadCloud className="h-10 w-10 text-blue-500 mx-auto mb-4" />
                        <CardTitle className="text-lg font-semibold">Easy</CardTitle>
                        <CardContent className="p-0 pt-2 text-muted-foreground">Upload prescriptions in seconds.</CardContent>
                    </Card>
                    <Card className="p-6 text-center shadow-md">
                        <CheckCircle2 className="h-10 w-10 text-purple-500 mx-auto mb-4" />
                        <CardTitle className="text-lg font-semibold">Reliable</CardTitle>
                        <CardContent className="p-0 pt-2 text-muted-foreground">Only verified pharmacies respond.</CardContent>
                    </Card>
                    <Card className="p-6 text-center shadow-md">
                        <DollarSign className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
                        <CardTitle className="text-lg font-semibold">Transparent</CardTitle>
                        <CardContent className="p-0 pt-2 text-muted-foreground">See which pharmacy has your medicine.</CardContent>
                    </Card>
                </div>
            </section>

            {/* User Types / Who It’s For Section */}
            <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
                <h2 className="text-4xl font-bold text-center mb-12">Designed for Everyone</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="p-6 text-center shadow-md">
                        <Users className="h-10 w-10 text-indigo-500 mx-auto mb-4" />
                        <CardTitle className="text-lg font-semibold">Patients & Caregivers</CardTitle>
                        <CardContent className="p-0 pt-2 text-muted-foreground">Find medicines quickly.</CardContent>
                    </Card>
                    <Card className="p-6 text-center shadow-md">
                        <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto mb-4" />
                        <CardTitle className="text-lg font-semibold">Doctors</CardTitle>
                        <CardContent className="p-0 pt-2 text-muted-foreground">Ensure patients get prescriptions fulfilled.</CardContent>
                    </Card>
                    <Card className="p-6 text-center shadow-md">
                        <Hospital className="h-10 w-10 text-orange-500 mx-auto mb-4" />
                        <CardTitle className="text-lg font-semibold">Pharmacies</CardTitle>
                        <CardContent className="p-0 pt-2 text-muted-foreground">Reach real patients with available stock.</CardContent>
                    </Card>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="bg-gray-100 dark:bg-gray-900 py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto rounded-lg shadow-inner">
                <h2 className="text-4xl font-bold text-center mb-12">What People Are Saying</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="p-6 shadow-md">
                        <p className="text-lg italic text-muted-foreground mb-4">
                            “I finally got my prescription without wasting time. Medanit Ale is amazing!”
                        </p>
                        <p className="font-semibold text-right">— Patient</p>
                    </Card>
                    <Card className="p-6 shadow-md">
                        <p className="text-lg italic text-muted-foreground mb-4">
                            “It helps me know real demand in my pharmacy.”
                        </p>
                        <p className="font-semibold text-right">— Pharmacist</p>
                    </Card>
                </div>
            </section>

            {/* For Pharmacies Section */}
            <section className="bg-primary/5 dark:bg-primary/10 py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto rounded-lg mt-8">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-4xl font-bold mb-6">For Pharmacies</h2>
                    <p className="text-xl text-muted-foreground mb-8">
                        Join the MedRide network to reach more customers, reduce phone inquiries, and provide verified availability to patients in need.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-left">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                            <p>Increase your visibility to local patients searching for specific stock.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0 mt-1" />
                            <p>Streamline availability requests without time-consuming calls.</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => router.push('/login')}
                        variant="default"
                        size="lg"
                        className="rounded-full px-8"
                    >
                        Join as a Pharmacy
                    </Button>
                </div>
            </section>

            {/* Trust & Compliance Section */}
            <section className="py-16 px-4 md:px-8 lg:px-16 max-w-7xl mx-auto text-center border-t mt-8">
                <h2 className="text-3xl font-bold mb-12">Trust & Compliance</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                    <div>
                        <h3 className="text-xl font-semibold mb-3">Prescription Respected</h3>
                        <p className="text-muted-foreground">We ensure that prescriptions are handled securely and only accessible to authorized healthcare providers.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-3">Verified Availability</h3>
                        <p className="text-muted-foreground">Responses come only from licensed, verified pharmacies within our professional network.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="w-full py-12 px-4 md:px-8 mt-16 border-t bg-white dark:bg-gray-950">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <Hospital className="h-6 w-6 text-primary" />
                        <span className="text-xl font-bold">MedRide</span>
                    </div>
                    <div className="flex gap-8 text-sm text-muted-foreground">
                        <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
                        <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-primary transition-colors">Contact</a>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        © 2026 MedRide. Availability first.
                    </div>
                </div>
                <div className="mt-8 flex justify-center">
                    <MadeWithDyad />
                </div>
            </footer>
        </div>
    );
}
