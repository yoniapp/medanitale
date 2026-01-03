"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { showLoading, dismissToast, showError, showSuccess } from '@/utils/toast';

export const useLoginLogic = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();
    const from = searchParams.get('from') || '/';

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const toastId = showLoading('Logging in...');
        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            showSuccess('Logged in successfully!');
            router.push(from);
        } catch (error: any) {
            showError(error.message);
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
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        role: 'patient', // Default role
                    },
                },
            });
            if (error) throw error;
            showSuccess('Signup successful! Please check your email for verification.');
            setIsSignUp(false);
        } catch (error: any) {
            showError(error.message);
        } finally {
            dismissToast(toastId);
            setLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        isSignUp,
        setIsSignUp,
        handleLogin,
        handleSignUp,
    };
};
