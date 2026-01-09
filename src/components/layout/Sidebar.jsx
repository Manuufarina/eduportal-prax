'use client';

import React from 'react';
import {
  Home,
  BookOpen,
  Folder,
  BarChart3,
  Bell,
  Users,
  FileText,
  TrendingUp,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/utils/helpers';
import { useApp } from '@/context/AppContext';

const studentMenu = [
  { id: 'dashboard', icon: Home, label: 'Inicio' },
  { id: 'courses', icon: BookOpen, label: 'Cursos' },
  { id: 'my-courses', icon: Folder, label: 'Mis Cursos' },
  { id: 'progress', icon: BarChart3, label: 'Mi Progreso' },
  { id: 'news', icon: Bell, label: 'Novedades' },
];

const adminMenu = [
  { id: 'dashboard', icon: Home, label: 'Dashboard' },
  { id: 'manage-courses', icon: BookOpen, label: 'Gestionar Cursos' },
  { id: 'manage-students', icon: Users, label: 'Alumnos' },
  { id: 'submissions', icon: FileText, label: 'Entregas' },
  { id: 'manage-news', icon: Bell, label: 'Noticias' },
  { id: 'analytics', icon: TrendingUp, label: 'Analíticas' },
];

export function Sidebar() {
  const {
    user,
    logout,
    currentView,
    setCurrentView,
    sidebarCollapsed,
    setSidebarCollapsed,
    isAdmin,
  } = useApp();

  const menu = isAdmin ? adminMenu : studentMenu;

  if (!user) return null;

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-full bg-slate-900/95 backdrop-blur-xl border-r border-white/10',
        'transition-all duration-300 z-50',
        sidebarCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h2 className="font-bold text-white font-display">EduPortal</h2>
                <p className="text-xs text-primary-400 font-medium">Prax</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all',
                currentView === item.id
                  ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 text-primary-400 border border-primary-500/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!sidebarCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-white/10">
          <div
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 mb-3',
              sidebarCollapsed ? 'justify-center' : ''
            )}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-lg">
              {user.avatar}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{user.name}</p>
                <p className="text-xs text-slate-400 capitalize">
                  {isAdmin ? 'Administrador' : 'Estudiante'}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span>Cerrar sesión</span>}
          </button>
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-1/2 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform"
        >
          <ChevronRight
            className={cn(
              'w-4 h-4 transition-transform',
              !sidebarCollapsed && 'rotate-180'
            )}
          />
        </button>
      </div>
    </aside>
  );
}
