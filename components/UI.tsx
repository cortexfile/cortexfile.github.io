import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children?: any;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: any;
  [key: string]: any;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  className = '',
  ...props
}: ButtonProps) => {
  const baseStyles = "relative inline-flex items-center justify-center font-bold tracking-wide transition-all duration-300 rounded-lg overflow-hidden group";

  const variants = {
    primary: "bg-gradient-to-r from-cyber-primary to-cyber-accent text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] hover:shadow-[0_0_30px_rgba(217,70,239,0.6)] hover:scale-[1.02]",
    secondary: "bg-cyber-card text-white border border-white/10 hover:bg-white/5",
    outline: "bg-transparent border border-cyber-primary/50 text-cyber-primary hover:bg-cyber-primary/10",
    danger: "bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30",
    ghost: "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out skew-y-12 origin-bottom"></div>
      )}
    </motion.button>
  );
};

export const Badge = ({ children, color = 'bg-cyber-primary', className = '' }: { children: any; color?: string; className?: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color} bg-opacity-20 text-white border border-white/10 ${className}`}>
    {children}
  </span>
);

export const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="text-center mb-16">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 mb-4"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="w-24 h-1 bg-gradient-to-r from-cyber-primary to-cyber-accent mx-auto rounded-full"
      />
    )}
  </div>
);