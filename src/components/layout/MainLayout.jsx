'use client';

import React from 'react';
import { cn } from '@/utils/helpers';
import { useApp } from '@/context/AppContext';
import { Sidebar } from './Sidebar';
import { AnimatedBackground } from './AnimatedBackground';

export function MainLayout({ children }) {
  const { sidebarCollapsed, isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900">
        <AnimatedBackground />
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <AnimatedBackground />
      <Sidebar />
      <main
        className={cn(
          'min-h-screen p-8 transition-all duration-300',
          sidebarCollapsed ? 'ml-20' : 'ml-64'
        )}
      >
        {children}
      </main>
    </div>
  );
}
