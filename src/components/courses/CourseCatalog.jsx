'use client';

import React, { useState, useMemo } from 'react';
import { Search, Clock, Video, Star, Users } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useEnrollment } from '@/hooks/useFirestore';
import { Card, CourseCard } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { cn } from '@/utils/helpers';

export function CourseCatalog() {
  const { user, courses, setCurrentView, setSelectedCourse, refreshUser } = useApp();
  const { enroll, loading: enrolling } = useEnrollment(user?.id);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(() => {
    const cats = new Set(courses.map((c) => c.category));
    return ['all', ...cats];
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || c.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [courses, search, selectedCategory]);

  const handleEnroll = async (courseId) => {
    try {
      await enroll(courseId);
      await refreshUser();
    } catch (error) {
      console.error('Error enrolling:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-display">
          Catálogo de Cursos
        </h1>
        <p className="text-slate-400">Explorá todos los cursos disponibles</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Buscar cursos..."
            icon={Search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-xl font-medium transition-all',
                selectedCategory === cat
                  ? 'bg-primary-500 text-white'
                  : 'bg-white/5 text-slate-300 hover:bg-white/10'
              )}
            >
              {cat === 'all' ? 'Todos' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => {
          const isEnrolled = user.enrolledCourses?.includes(course.id);

          return (
            <Card
              key={course.id}
              hover
              padding={false}
              className="overflow-hidden group"
            >
              <div
                className="h-40 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform cursor-pointer"
                onClick={() => {
                  setSelectedCourse(course);
                  setCurrentView('course-detail');
                }}
              >
                {course.thumbnail}
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-primary-400 bg-primary-500/20 px-2 py-1 rounded-full">
                    {course.category}
                  </span>
                  <span className="text-xs text-slate-400 bg-white/10 px-2 py-1 rounded-full">
                    {course.level}
                  </span>
                </div>
                <h3
                  className="text-xl font-semibold text-white mb-2 cursor-pointer hover:text-primary-400 transition-colors"
                  onClick={() => {
                    setSelectedCourse(course);
                    setCurrentView('course-detail');
                  }}
                >
                  {course.title}
                </h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Video className="w-4 h-4" /> {course.lessons?.length || 0} clases
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-primary-400" /> {course.rating}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedCourse(course);
                      setCurrentView('course-detail');
                    }}
                    className="flex-1 py-3 bg-white/10 text-white font-medium rounded-xl hover:bg-white/20 transition-all"
                  >
                    Ver detalles
                  </button>
                  <button
                    onClick={() => !isEnrolled && handleEnroll(course.id)}
                    disabled={isEnrolled || enrolling}
                    className={cn(
                      'flex-1 py-3 font-medium rounded-xl transition-all',
                      isEnrolled
                        ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
                        : 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg hover:shadow-primary-500/30'
                    )}
                  >
                    {isEnrolled ? '✓ Inscripto' : 'Inscribirse'}
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <Card className="text-center py-16">
          <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            No se encontraron cursos
          </h3>
          <p className="text-slate-400">
            Intentá con otros términos de búsqueda
          </p>
        </Card>
      )}
    </div>
  );
}
