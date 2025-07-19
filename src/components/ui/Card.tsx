import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'glass' | 'elevated' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export function Card({ 
  children, 
  className = '', 
  hover = false, 
  onClick,
  variant = 'default',
  padding = 'md'
}: CardProps) {
  const baseClasses = 'transition-all duration-300 will-change-transform';
  
  const variants = {
    default: 'bg-white rounded-2xl shadow-lg border border-gray-100',
    glass: 'bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20',
    elevated: 'bg-white rounded-2xl shadow-xl border border-gray-50',
    bordered: 'bg-white rounded-2xl border-2 border-gray-200 shadow-md'
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const hoverClasses = hover ? 'hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] cursor-pointer' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { 
        y: -8, 
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 17 }
      } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`
        ${baseClasses} 
        ${variants[variant]} 
        ${paddings[padding]}
        ${hoverClasses} 
        ${clickableClasses}
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}