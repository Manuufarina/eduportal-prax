'use client';

import React from 'react';
import { cn } from '@/utils/helpers';

const variants = {
  primary: 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg hover:shadow-primary-500/30',
  secondary: 'bg-white/10 text-white hover:bg-white/20',
  danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30',
  success: 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30',
  ghost: 'text-slate-400 hover:text-white hover:bg-white/10',
};

const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-3',
  lg: 'px-6 py-4 text-lg',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  loading,
  icon: Icon,
  iconPosition = 'left',
  fullWidth,
  ...props
}) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'transform active:scale-[0.98]',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
          <span>Procesando...</span>
        </>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
        </>
      )}
    </button>
  );
}
