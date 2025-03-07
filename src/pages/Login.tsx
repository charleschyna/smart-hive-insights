
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect logged in users to dashboard
  useEffect(() => {
    if (user && !isLoading) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  // Show a more brief loading state
  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-honey-500 mb-4" />
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  // If we're not loading and don't have a user, show the login form
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
