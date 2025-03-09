
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

// Define Props interface
interface SignupFormProps {
  signUp: (email: string, password: string, userData?: Record<string, any>) => Promise<{ error: Error | null }>;
}

const SignupForm: React.FC<SignupFormProps> = ({ signUp }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, agreeToTerms: checked }));
    
    if (errors.agreeToTerms) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.agreeToTerms;
        return newErrors;
      });
    }
  };
  
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      const { error } = await signUp(formData.email, formData.password, {
        email: formData.email,
      });
      
      if (!error) {
        // Redirect to dashboard or verification page
        navigate('/dashboard');
      } else {
        // Handle signup error
        if (error.message.includes('email')) {
          setErrors(prev => ({ ...prev, email: error.message }));
        } else {
          setErrors(prev => ({ ...prev, form: error.message }));
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors(prev => ({ ...prev, form: 'An unexpected error occurred' }));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {errors.form && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {errors.form}
        </div>
      )}
      
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="john.doe@example.com"
          value={formData.email}
          onChange={handleChange}
          className={errors.email ? 'border-red-500' : ''}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          className={errors.password ? 'border-red-500' : ''}
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
        )}
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          className={errors.confirmPassword ? 'border-red-500' : ''}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="agreeToTerms" 
          checked={formData.agreeToTerms}
          onCheckedChange={handleCheckboxChange}
        />
        <label
          htmlFor="agreeToTerms"
          className={`text-sm font-medium leading-none ${errors.agreeToTerms ? 'text-red-500' : ''}`}
        >
          I agree to the terms and conditions
        </label>
      </div>
      {errors.agreeToTerms && (
        <p className="text-red-500 text-xs mt-1">{errors.agreeToTerms}</p>
      )}
      
      <Button 
        type="submit"
        className="w-full bg-honey-500 hover:bg-honey-600 text-black font-medium h-11"
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <>
            Sign up <ArrowRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
      
      <p className="text-center text-sm mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-honey-600 hover:text-honey-700 font-medium">
          Log in
        </Link>
      </p>
    </motion.form>
  );
};

export default SignupForm;
