
import React from 'react';
import SignupForm from './SignupForm';
import { useAuth } from '@/contexts/AuthContext';

const SignupFormWrapper = () => {
  const { signUp } = useAuth();
  
  // Create a wrapper function that matches the expected parameter count
  const handleSignUp = (email: string, password: string, userData?: Record<string, any>) => {
    return signUp(email, password, userData);
  };
  
  return <SignupForm signUp={handleSignUp} />;
};

export default SignupFormWrapper;
