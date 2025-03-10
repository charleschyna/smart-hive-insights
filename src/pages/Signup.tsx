
import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthLayout from '@/components/auth/AuthLayout';
import SignupFormWrapper from '@/components/auth/SignupFormWrapper';
import { useAuth } from '@/contexts/AuthContext';

const Signup = () => {
  const { user, loading } = useAuth();
  
  console.log("Signup page - User:", user ? "Authenticated" : "Not authenticated", "Loading:", loading);
  
  // If user is already authenticated, redirect to dashboard
  if (user && !loading) {
    console.log("User already authenticated, redirecting to dashboard");
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
  
  console.log("Rendering signup form");
  return (
    <AuthLayout 
      title="Create Account" 
      subtitle="Join Smart Nyuki to start monitoring your hives"
    >
      <SignupFormWrapper />
    </AuthLayout>
  );
};

export default Signup;
