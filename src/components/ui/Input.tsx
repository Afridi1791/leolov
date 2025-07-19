import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
  variant?: 'default' | 'filled' | 'outlined';
  inputSize?: 'sm' | 'md' | 'lg';
}

export function Input({ 
  label, 
  error, 
  icon, 
  helperText,
  variant = 'default',
  inputSize = 'md',
  type = 'text',
  className = '', 
  ...props 
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const baseClasses = 'block w-full rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent';
  
  const variants = {
    default: 'border border-gray-300 bg-white/80 backdrop-blur-sm',
    filled: 'border-0 bg-gray-100 focus:bg-white',
    outlined: 'border-2 border-gray-300 bg-transparent'
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  };

  const iconPadding = icon ? (inputSize === 'lg' ? 'pl-12' : inputSize === 'sm' ? 'pl-8' : 'pl-10') : '';
  const passwordPadding = type === 'password' ? (inputSize === 'lg' ? 'pr-12' : inputSize === 'sm' ? 'pr-8' : 'pr-10') : '';

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="space-y-2">
      {label && (
        <motion.label 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="block text-sm font-semibold text-gray-700"
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative">
        {icon && (
          <div className={`absolute inset-y-0 left-0 flex items-center pointer-events-none ${
            inputSize === 'lg' ? 'pl-4' : inputSize === 'sm' ? 'pl-2.5' : 'pl-3'
          }`}>
            <div className={`text-gray-400 ${isFocused ? 'text-blue-500' : ''} transition-colors duration-200`}>
              {icon}
            </div>
          </div>
        )}
        
        <motion.input
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
          type={inputType}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            ${baseClasses} 
            ${variants[variant]} 
            ${sizes[inputSize]}
            ${iconPadding}
            ${passwordPadding}
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${isFocused ? 'shadow-lg' : 'shadow-sm'}
            ${className}
          `}
          {...props}
        />
        
        {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute inset-y-0 right-0 flex items-center ${
              inputSize === 'lg' ? 'pr-4' : inputSize === 'sm' ? 'pr-2.5' : 'pr-3'
            } text-gray-400 hover:text-gray-600 transition-colors duration-200`}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 font-medium"
        >
          {error}
        </motion.p>
      )}
      
      {helperText && !error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-500"
        >
          {helperText}
        </motion.p>
      )}
    </div>
  );
}