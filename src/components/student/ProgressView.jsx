'use client';

import React from 'react';
import {
  BarChart3,
  BookOpen,
  CheckCircle,
  FileText,
  Award,
  Target,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card, StatCard } from '@/components/ui/Card';
import { calculateProgress, calculateAverageGrade, getGradeColor, cn } from '@/utils/helpers';

export function ProgressView() {
  const { user, courses, setCurrentView, setSelectedCourse } = useApp();

  const enrolledCourses = courses.filter((c) =>
    user.enrolledCourses?.includes(c.id)
  );

  // Global stats
  const totalLessons = enrolledCourses.reduce(
    (acc, c) => acc + (c.lessons?.length || 0),
    0
  );

  const totalCompletedLessons = Object.values(user.progress || {}).reduce(
    (acc, p) => acc + (p.completedLessons?.length || 0),
    0
  );

  const allSubmissions = Object.values(user.progress || {}).flatMap(
    (p) => p.submissions || []
  );

  const gradedSubmissions = allSubmissions.filter((s) => s.grade !== null);
  const averageGrade = calculateAverageGrade(allSubmissions);

  const completedCourses = enrolledCourses.filter((c) => {
    const progress = user.progress?.[c.id];
    return (progress?.completedLessons?.length || 0) === (c.lessons?.length || 0);
  }).length;

  const stats = [
    {
      label: 'Cursos Inscriptos',
      value: enrolledCourses.length,
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      label: 'Cursos Completados',
      value: completedCourses,
      icon: Award,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'Clases Completadas',
      value: `${totalCompletedLessons}/${totalLessons}`,
      icon: CheckCircle,
      color: 'from-primary-500 to-accent-500',
    },
    {
      label: 'Promedio General',
      value: averageGrade !== null ? `${averageGrade}` : '-',
      icon: Target,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-display">
          Mi Progreso
        </h1>
        <p className="text-slate-400">
          Seguimiento de tu avance académico
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Course Progress */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 font-display">
          Progreso por Curso
        </h2>
        
        {enrolledCourses.length > 0 ? (
          <div className="space-y-4">
            {enrolledCourses.map((course) => {
              const progress = user.progress?.[course.id];
              const completedLessons = progress?.completedLessons?.length || 0;
              const totalCourseLessons = course.lessons?.length || 0;
              const progressPercent = calculateProgress(
                progress?.completedLessons,
                totalCourseLessons
              );

              const submissions = progress?.submissions || [];
              const courseGrade = calculateAverageGrade(submissions);

              return (
                <Card
                  key={course.id}
                  hover
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedCourse(course);
                    setCurrentView('course-detail');
                  }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-3xl">
                      {course.thumbnail}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">
                        {course.title}
                      </h3>
                      <p className="text-sm text-slate-400">{course.instructor}</p>
                    </div>
                    {courseGrade !== null && (
                      <div
                        className={cn(
                          'px-4 py-2 rounded-xl font-medium',
                          getGradeColor(courseGrade)
                        )}
                      >
                        Promedio: {courseGrade}
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-slate-400">
                        {completedLessons} de {totalCourseLessons} clases completadas
                      </span>
                      <span className="text-primary-400 font-medium">
                        {progressPercent}%
                      </span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          progressPercent === 100
                            ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                            : 'bg-gradient-to-r from-primary-400 to-accent-500'
                        )}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Submissions Summary */}
                  <div className="flex gap-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <FileText className="w-4 h-4" />
                      {submissions.length} entregas
                    </div>
                    {submissions.filter((s) => s.grade !== null).length > 0 && (
                      <div className="flex items-center gap-2 text-emerald-400">
                        <CheckCircle className="w-4 h-4" />
                        {submissions.filter((s) => s.grade !== null).length} calificadas
                      </div>
                    )}
                    {submissions.filter((s) => s.grade === null).length > 0 && (
                      <div className="flex items-center gap-2 text-amber-400">
                        <Target className="w-4 h-4" />
                        {submissions.filter((s) => s.grade === null).length} pendientes
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="text-center py-16">
            <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Sin datos de progreso
            </h3>
            <p className="text-slate-400">
              Inscribite a cursos para ver tu progreso aquí
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
