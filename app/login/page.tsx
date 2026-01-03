"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { showLoading, dismissToast, showError, showSuccess } from '@/utils/toast';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const toastId = showLoading('Logging in...');
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) throw error;

            showSuccess('Successfully logged in!');
            const from = searchParams.get('from') || '/home';
            router.push(from);
        } catch (error: any) {
            showError(`Error logging in: ${error.message}`);
        } finally {
            dismissToast(toastId);
            setLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const toastId = showLoading('Signing up...');
        try {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (signUpError) throw signUpError;

            if (signUpData.user) {
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert([
                        { id: signUpData.user.id, email: signUpData.user.email, role: 'patient', is_blocked: false }
                    ]);
                if (profileError) throw profileError;
            }

            showSuccess('Sign up successful! Please check your email to confirm your account.');
            setEmail('');
            setPassword('');
            setIsSignUp(false);
        } catch (error: any) {
            showError(`Error signing up: ${error.message}`);
        } finally {
            dismissToast(toastId);
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <Card className="w-full max-w-md p-6">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Medanit Ale</CardTitle>
                    <CardDescription>
                        {isSignUp ? 'Create your account' : 'Enter your email and password to log in'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full"
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? (isSignUp ? 'Signing up...' : 'Logging in...') : (isSignUp ? 'Sign Up' : 'Login')}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        {isSignUp ? (
                            <>
                                Already have an account?{' '}
                                <Button variant="link" onClick={() => setIsSignUp(false)} className="p-0 h-auto">
                                    Login
                                </Button>
                            </>
                        ) : (
                            <>
                                Don't have an account?{' '}
                                <Button variant="link" onClick={() => setIsSignUp(true)} className="p-0 h-auto">
                                    Sign Up
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
