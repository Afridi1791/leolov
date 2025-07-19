import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Chrome } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { login, loginWithGoogle, signup, resetPassword } = useAuth();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (mode !== 'reset') {
      if (!password) {
        newErrors.password = 'Password is required';
      } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    if (mode === 'signup' && !displayName) {
      newErrors.displayName = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else if (mode === 'signup') {
        await signup(email, password, displayName);
      } else if (mode === 'reset') {
        await resetPassword(email);
        setMode('login');
      }
      
      if (mode !== 'reset') {
        onClose();
      }
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      onClose();
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setDisplayName('');
    setErrors({});
  };

  const switchMode = (newMode: 'login' | 'signup' | 'reset') => {
    setMode(newMode);
    resetForm();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {mode === 'login' && 'Welcome Back'}
          {mode === 'signup' && 'Create Account'}
          {mode === 'reset' && 'Reset Password'}
        </h2>
        <p className="text-gray-600">
          {mode === 'login' && 'Sign in to your NicheNav account'}
          {mode === 'signup' && 'Start discovering profitable niches today'}
          {mode === 'reset' && 'Enter your email to reset your password'}
        </p>
      </div>

      {/* Google Sign In Button */}
      {mode !== 'reset' && (
        <div className="mb-6">
          <Button
            onClick={handleGoogleLogin}
            loading={loading}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
            size="lg"
          >
            <Chrome className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <Input
            label="Full Name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            icon={<User className="w-5 h-5 text-gray-400" />}
            error={errors.displayName}
            placeholder="Enter your full name"
          />
        )}

        <Input
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail className="w-5 h-5 text-gray-400" />}
          error={errors.email}
          placeholder="Enter your email"
        />

        {mode !== 'reset' && (
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-5 h-5 text-gray-400" />}
            error={errors.password}
            placeholder="Enter your password"
          />
        )}

        <Button
          type="submit"
          className="w-full"
          loading={loading}
          size="lg"
        >
          {mode === 'login' && 'Sign In'}
          {mode === 'signup' && 'Create Account'}
          {mode === 'reset' && 'Send Reset Email'}
        </Button>
      </form>

      <div className="mt-6 text-center space-y-2">
        {mode === 'login' && (
          <>
            <button
              onClick={() => switchMode('reset')}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              Forgot your password?
            </button>
            <div className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => switchMode('signup')}
                className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
              >
                Sign up
              </button>
            </div>
          </>
        )}

        {mode === 'signup' && (
          <div className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => switchMode('login')}
              className="text-blue-600 hover:text-blue-700 transition-colors font-medium"
            >
              Sign in
            </button>
          </div>
        )}

        {mode === 'reset' && (
          <button
            onClick={() => switchMode('login')}
            className="text-sm text-gray-600 hover:text-gray-700 transition-colors"
          >
            Back to sign in
          </button>
        )}
      </div>
    </Modal>
  );
}