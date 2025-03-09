
import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignupForm from './SignupForm';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const SignupFormWrapper = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const { toast } = useToast();

  const handleSignup = async (email: string, password: string, userData: { 
    firstName: string;
    lastName: string;
  }) => {
    try {
      console.log("Attempting to sign up with:", { email, userData });
      const { error } = await signUp(email, password, userData);
      
      if (error) {
        console.error("Signup error:", error);
        toast({
          title: 'Signup failed',
          description: error.message,
          variant: 'destructive',
        });
        return false;
      }
      
      toast({
        title: 'Account created!',
        description: 'Your account has been successfully created. You can now log in.',
      });
      
      navigate('/login');
      return true;
    } catch (error: any) {
      console.error("Unexpected signup error:", error);
      toast({
        title: 'Signup failed',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  return <SignupForm onSubmit={handleSignup} />;
};

export default SignupFormWrapper;
