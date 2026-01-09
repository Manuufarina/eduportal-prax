'use client';

import React from 'react';
import {
  BookOpen,
  Target,
  CheckCircle,
  Award,
  Bell,
  ChevronRight,
  Clock,
  Star,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card, StatCard, CourseCard } from '@/components/ui/Card';
import { calculateProgress } from '@/utils/helpers';

export function StudentDashboard() {
  const { user, courses, news, setCurrentView, setSelectedCourse } = useApp();

  const enrolledCourses = courses.filter((c) =>
    user.enrolledCourses?.includes(c.id)
  );

  const totalCompletedLessons = Object.values(user.progress || {}).reduce(
    (acc, p) => acc + (p.completedLessons?.length || 0),
    0
  );

  const totalLessons = enrolledCourses.reduce(
    (acc, c) => acc + (c.lessons?.length || 0),
    0
  );

  const totalProgress = totalLessons > 0
    ? Math.round((totalCompletedLessons / totalLessons) * 100)
    : 0;

  const importantNews = news.filter((n) => n.important);

  const stats = [
    {
      label: 'Cursos Inscriptos',
      value: enrolledCourses.length,
      icon: BookOpen,
      color: 'from-blue-500 to-indigo-500',
    },
    {
      label: 'Progreso General',
      value: `${totalProgress}%`,
      icon: Target,
      color: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'Clases Completadas',
      value: totalCompletedLessons,
      icon: CheckCircle,
      color: 'from-primary-500 to-accent-500',
    },
    {
      label: 'Certificados',
      value: 0,
      icon: Award,
      color: 'from-purple-500 to-pink-500',
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
          Continuá aprendiendo donde lo dejaste
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Important News */}
      {importantNews.length > 0 && (
        <div className="bg-gradient-to-r from-primary-500/20 to-accent-500/20 rounded-2xl p-6 border border-primary-500/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center flex-shrink-0">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">
                {importantNews[0].title}
              </h3>
              <p className="text-slate-300">{importantNews[0].content}</p>
            </div>
          </div>
        </div>
      )}

      {/* Continue Learning */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white font-display">
            Continuar Aprendiendo
          </h2>
          <button
            onClick={() => setCurrentView('courses')}
            className="text-primary-400 hover:text-primary-300 text-sm font-medium flex items-center gap-1"
          >
            Ver todos <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledCourses.slice(0, 3).map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                progress={user.progress?.[course.id]}
                showProgress
                isEnrolled
                onClick={() => {
                  setSelectedCourse(course);
                  setCurrentView('course-detail');
                }}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No estás inscripto en ningún curso
            </h3>
            <p className="text-slate-400 mb-4">
              Explorá el catálogo y comenzá tu aprendizaje
            </p>
            <button
              onClick={() => setCurrentView('courses')}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary-500/30 transition-all"
            >
              Ver cursos disponibles
            </button>
          </Card>
        )}
      </div>

      {/* Recommended Courses */}
      {enrolledCourses.length < courses.length && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white font-display">
              Cursos Recomendados
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses
              .filter((c) => !user.enrolledCourses?.includes(c.id))
              .slice(0, 3)
              .map((course) => (
                <Card
                  key={course.id}
                  hover
                  padding={false}
                  className="overflow-hidden group"
                  onClick={() => {
                    setSelectedCourse(course);
                    setCurrentView('course-detail');
                  }}
                >
                  <div className="h-32 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-5xl group-hover:scale-110 transition-transform">
                    {course.thumbnail}
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-medium text-primary-400 bg-primary-500/20 px-2 py-1 rounded-full">
                      {course.category}
                    </span>
                    <h3 className="text-lg font-semibold text-white mt-3 mb-2">
                      {course.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-primary-400" /> {course.rating}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
