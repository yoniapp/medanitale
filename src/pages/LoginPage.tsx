"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { showLoading, dismissToast, showError, showSuccess } from '@/utils/toast';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

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
      const from = location.state?.from || '/home'; // Redirect to /home or the previously attempted protected route
      navigate(from);
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
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (error) throw error;

      showSuccess('Sign up successful! Please check your email to confirm your account.');
      setEmail('');
      setPassword('');
      setIsSignUp(false); // Switch back to login after sign up
      // No immediate redirect to /home after signup, as email confirmation is required.
      // User will be redirected to /home by AuthProvider once session is established after confirmation.
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
};

export default LoginPage;