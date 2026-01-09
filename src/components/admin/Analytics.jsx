'use client';

import React from 'react';
import {
  TrendingUp,
  Users,
  BookOpen,
  Award,
  Target,
  Star,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useStudents, useSubmissions } from '@/hooks/useFirestore';
import { Card, StatCard } from '@/components/ui/Card';

export function Analytics() {
  const { courses } = useApp();
  const { students } = useStudents();
  const { submissions } = useSubmissions();

  const totalEnrollments = courses.reduce(
    (acc, c) => acc + (c.enrolledStudents || 0),
    0
  );

  const totalLessons = courses.reduce(
    (acc, c) => acc + (c.lessons?.length || 0),
    0
  );

  const gradedSubmissions = submissions.filter((s) => s.grade !== null);
  const averageGrade = gradedSubmissions.length > 0
    ? Math.round(
        gradedSubmissions.reduce((acc, s) => acc + s.grade, 0) /
          gradedSubmissions.length
      )
    : 0;

  const passRate = gradedSubmissions.length > 0
    ? Math.round(
        (gradedSubmissions.filter((s) => s.grade >= 60).length /
          gradedSubmissions.length) *
          100
      )
    : 0;

  const stats = [
    {
      label: 'Cursos Activos',
      value: courses.length,
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      label: 'Total Estudiantes',
      value: students.length,
      icon: Users,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'Total Inscripciones',
      value: totalEnrollments,
      icon: Target,
      color: 'from-primary-500 to-accent-500',
    },
    {
      label: 'Tasa de Aprobación',
      value: `${passRate}%`,
      icon: Award,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const popularCourses = [...courses]
    .sort((a, b) => (b.enrolledStudents || 0) - (a.enrolledStudents || 0))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-display">
          Analíticas
        </h1>
        <p className="text-slate-400">Métricas y estadísticas de la plataforma</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Courses */}
        <Card>
          <h2 className="text-xl font-bold text-white mb-6 font-display">
            Cursos Más Populares
          </h2>
          <div className="space-y-4">
            {popularCourses.map((course, index) => (
              <div key={course.id} className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${
                    index === 0
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                      : index === 1
                      ? 'bg-gradient-to-br from-slate-400 to-slate-500'
                      : index === 2
                      ? 'bg-gradient-to-br from-amber-600 to-amber-700'
                      : 'bg-white/10'
                  }`}
                >
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{course.title}</p>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Users className="w-4 h-4" />
                    {course.enrolledStudents || 0} estudiantes
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-primary-400">
                    <Star className="w-4 h-4" />
                    {course.rating || 0}
                  </div>
                </div>
              </div>
            ))}

            {popularCourses.length === 0 && (
              <p className="text-center text-slate-400 py-8">
                No hay datos disponibles
              </p>
            )}
          </div>
        </Card>

        {/* Performance Stats */}
        <Card>
          <h2 className="text-xl font-bold text-white mb-6 font-display">
            Rendimiento Académico
          </h2>
          <div className="space-y-6">
            {/* Average Grade */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-400">Promedio General</span>
                <span className="text-white font-medium">{averageGrade}/100</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-400 to-accent-500 rounded-full transition-all"
                  style={{ width: `${averageGrade}%` }}
                />
              </div>
            </div>

            {/* Pass Rate */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-slate-400">Tasa de Aprobación</span>
                <span className="text-white font-medium">{passRate}%</span>
              </div>
              <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all"
                  style={{ width: `${passRate}%` }}
                />
              </div>
            </div>

            {/* Total Submissions */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{submissions.length}</p>
                <p className="text-sm text-slate-400">Entregas totales</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">{totalLessons}</p>
                <p className="text-sm text-slate-400">Clases disponibles</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Distribution */}
      <Card>
        <h2 className="text-xl font-bold text-white mb-6 font-display">
          Distribución por Categoría
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...new Set(courses.map((c) => c.category))].map((category) => {
            const categoryCount = courses.filter(
              (c) => c.category === category
            ).length;
            const percentage = Math.round((categoryCount / courses.length) * 100) || 0;

            return (
              <div key={category} className="bg-white/5 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white mb-1">{categoryCount}</p>
                <p className="text-sm text-slate-400 mb-2">{category}</p>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-400 to-accent-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
