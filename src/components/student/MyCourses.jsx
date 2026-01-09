'use client';

import React from 'react';
import { BookOpen, Clock, Video, Target } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card, CourseCard } from '@/components/ui/Card';
import { calculateProgress } from '@/utils/helpers';

export function MyCourses() {
  const { user, courses, setCurrentView, setSelectedCourse } = useApp();

  const enrolledCourses = courses.filter((c) =>
    user.enrolledCourses?.includes(c.id)
  );

  const inProgress = enrolledCourses.filter((c) => {
    const progress = user.progress?.[c.id];
    const completed = progress?.completedLessons?.length || 0;
    return completed > 0 && completed < (c.lessons?.length || 0);
  });

  const notStarted = enrolledCourses.filter((c) => {
    const progress = user.progress?.[c.id];
    return !progress?.completedLessons?.length;
  });

  const completed = enrolledCourses.filter((c) => {
    const progress = user.progress?.[c.id];
    return (progress?.completedLessons?.length || 0) === (c.lessons?.length || 0);
  });

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setCurrentView('course-detail');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-display">
          Mis Cursos
        </h1>
        <p className="text-slate-400">
          {enrolledCourses.length} cursos inscriptos
        </p>
      </div>

      {/* In Progress */}
      {inProgress.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-primary-400" />
            En Progreso ({inProgress.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {inProgress.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                progress={user.progress?.[course.id]}
                showProgress
                isEnrolled
                onClick={() => handleCourseClick(course)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Not Started */}
      {notStarted.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-amber-400" />
            Por Comenzar ({notStarted.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notStarted.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                progress={user.progress?.[course.id]}
                showProgress
                isEnrolled
                onClick={() => handleCourseClick(course)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Video className="w-6 h-6 text-emerald-400" />
            Completados ({completed.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completed.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                progress={user.progress?.[course.id]}
                showProgress
                isEnrolled
                onClick={() => handleCourseClick(course)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {enrolledCourses.length === 0 && (
        <Card className="text-center py-16">
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
  );
}
