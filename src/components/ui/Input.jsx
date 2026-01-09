'use client';

import React from 'react';
import { cn } from '@/utils/helpers';

export function Input({
  label,
  error,
  icon: Icon,
  className,
  containerClassName,
  ...props
}) {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm text-slate-400 mb-2">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        )}
        <input
          className={cn(
            'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl',
            'text-white placeholder-slate-500',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'transition-all',
            Icon && 'pl-12',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}

export function Textarea({
  label,
  error,
  className,
  containerClassName,
  ...props
}) {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm text-slate-400 mb-2">{label}</label>
      )}
      <textarea
        className={cn(
          'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl',
          'text-white placeholder-slate-500',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'transition-all resize-none',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}

export function Select({
  label,
  error,
  options,
  className,
  containerClassName,
  ...props
}) {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="block text-sm text-slate-400 mb-2">{label}</label>
      )}
      <select
        className={cn(
          'w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl',
          'text-white',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'transition-all',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-800">
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}

export function Checkbox({ label, className, ...props }) {
  return (
    <label className={cn('flex items-center gap-3 cursor-pointer', className)}>
      <input
        type="checkbox"
        className="w-5 h-5 rounded bg-white/10 border-white/20 text-primary-500 focus:ring-primary-500"
        {...props}
      />
      <span className="text-white">{label}</span>
    </label>
  );
}
