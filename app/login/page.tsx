"use client";

import React, { Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLoginLogic } from '@/hooks/use-login-logic';

function LoginContent() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        loading,
        isSignUp,
        setIsSignUp,
        handleLogin,
        handleSignUp,
    } = useLoginLogic();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        {isSignUp ? 'Create an Account' : 'Welcome Back'}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {isSignUp
                            ? 'Enter your details to register as a Patient.'
                            : 'Enter your credentials to access your account.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="email">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="password">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? (isSignUp ? 'Creating Account...' : 'Logging in...') : (isSignUp ? 'Sign Up' : 'Login')}
                        </Button>
                    </form>
                    <div className="mt-4 text-center">
                        <button
                            className="text-sm text-primary hover:underline hover:cursor-pointer"
                            onClick={() => setIsSignUp(!isSignUp)}
                        >
                            {isSignUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading login...</div>}>
            <LoginContent />
        </Suspense>
    );
}
