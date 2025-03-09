
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Login = () => {
  const { user, loading } = useAuth();
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isMissingConfig = !supabaseUrl || !supabaseKey || supabaseUrl === 'https://placeholder.supabase.co';
  
  // If user is already authenticated, redirect to dashboard
  if (user && !loading) {
    return <Navigate to="/dashboard" replace />;
  }
  
  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-honey-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading authentication...</p>
        </div>
      </div>
    );
  }
  
  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to your Smart Nyuki account"
    >
      {isMissingConfig && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Supabase configuration is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.
          </AlertDescription>
        </Alert>
      )}
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
