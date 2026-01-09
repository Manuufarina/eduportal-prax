'use client';

import React from 'react';
import {
  BookOpen,
  Users,
  FileText,
  Award,
  ChevronRight,
  Star,
  CheckCircle,
  Upload,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useStudents } from '@/hooks/useFirestore';
import { Card, StatCard } from '@/components/ui/Card';

export function AdminDashboard() {
  const { user, courses, setCurrentView, setSelectedCourse } = useApp();
  const { students } = useStudents();

  const stats = [
    {
      label: 'Cursos Activos',
      value: courses.length,
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      label: 'Estudiantes',
      value: students.length,
      icon: Users,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'Entregas Pendientes',
      value: 12,
      icon: FileText,
      color: 'from-primary-500 to-accent-500',
    },
    {
      label: 'Tasa de Aprobación',
      value: '87%',
      icon: Award,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const recentActivity = [
    {
      text: 'María García completó "Ciclo de Vida del Aedes aegypti"',
      time: 'Hace 2 horas',
      icon: CheckCircle,
      color: 'text-emerald-400',
    },
    {
      text: 'Juan Pérez se inscribió en "Gestión Municipal de Residuos"',
      time: 'Hace 4 horas',
      icon: Users,
      color: 'text-blue-400',
    },
    {
      text: 'Nueva entrega recibida de Ana López',
      time: 'Hace 5 horas',
      icon: Upload,
      color: 'text-primary-400',
    },
    {
      text: 'Carlos Ruiz completó el curso "Control de Vectores"',
      time: 'Ayer',
      icon: Award,
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-display">
          ¡Hola, {user.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-slate-400">
          Bienvenido al panel de administración
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Courses */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white font-display">
              Cursos Recientes
            </h2>
            <button
              onClick={() => setCurrentView('manage-courses')}
              className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-1"
            >
              Ver todos <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {courses.slice(0, 5).map((course) => (
              <Card
                key={course.id}
                hover
                className="flex items-center gap-4 cursor-pointer"
                onClick={() => {
                  setSelectedCourse(course);
                  setCurrentView('edit-course');
                }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-2xl flex-shrink-0">
                  {course.thumbnail}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-400">{course.instructor}</p>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {course.enrolledStudents}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-primary-400" /> {course.rating}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4 font-display">
            Actividad Reciente
          </h2>
          <Card>
            <div className="space-y-4">
              {recentActivity.map((activity, i) => (
                <div key={i} className="flex items-start gap-3">
                  <activity.icon
                    className={`w-5 h-5 ${activity.color} mt-0.5 flex-shrink-0`}
                  />
                  <div>
                    <p className="text-slate-300 text-sm">{activity.text}</p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 font-display">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: 'Crear Nuevo Curso',
              icon: BookOpen,
              action: () => setCurrentView('manage-courses'),
              color: 'from-blue-500 to-indigo-500',
            },
            {
              label: 'Revisar Entregas',
              icon: FileText,
              action: () => setCurrentView('submissions'),
              color: 'from-primary-500 to-accent-500',
            },
            {
              label: 'Publicar Noticia',
              icon: Users,
              action: () => setCurrentView('manage-news'),
              color: 'from-emerald-500 to-teal-500',
            },
          ].map((item, i) => (
            <Card
              key={i}
              hover
              className="flex items-center gap-4 cursor-pointer"
              onClick={item.action}
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg`}
              >
                <item.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-white font-medium">{item.label}</span>
              <ChevronRight className="w-5 h-5 text-slate-400 ml-auto" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
