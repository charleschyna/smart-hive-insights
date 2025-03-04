
import React from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
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
