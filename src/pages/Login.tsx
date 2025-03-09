
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Login = () => {
  const { user, loading } = useAuth();
  // We don't need to check for environment variables anymore since we have fallbacks
  // in the supabase client configuration
  
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
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
