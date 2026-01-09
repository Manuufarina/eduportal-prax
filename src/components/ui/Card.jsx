'use client';

import React from 'react';
import { cn } from '@/utils/helpers';

export function Card({
  children,
  className,
  hover = false,
  onClick,
  padding = true,
  ...props
}) {
  return (
    <div
      className={cn(
        'bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10',
        hover && 'hover:border-primary-500/50 transition-all cursor-pointer',
        padding && 'p-6',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  color = 'from-primary-500 to-accent-500',
  className,
}) {
  return (
    <Card className={cn('hover:transform hover:scale-105 transition-all', className)}>
      <div className={cn(
        'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4 shadow-lg',
        color
      )}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-slate-400 text-sm">{label}</p>
      {trend && (
        <p className={cn(
          'text-sm mt-2',
          trend > 0 ? 'text-emerald-400' : 'text-red-400'
        )}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs mes anterior
        </p>
      )}
    </Card>
  );
}

export function CourseCard({
  course,
  progress,
  onClick,
  showProgress = false,
  showEnrollButton = false,
  isEnrolled = false,
  onEnroll,
}) {
  const progressPercent = progress
    ? Math.round((progress.completedLessons?.length || 0) / (course.lessons?.length || 1) * 100)
    : 0;

  return (
    <Card hover onClick={onClick} padding={false} className="overflow-hidden group">
      <div className="h-40 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform">
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
        <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
        <p className="text-slate-400 text-sm mb-4 line-clamp-2">{course.description}</p>

        {showProgress && isEnrolled && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-400">
                {progress?.completedLessons?.length || 0} de {course.lessons?.length || 0} clases
              </span>
              <span className="text-primary-400 font-medium">{progressPercent}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-400 to-accent-500 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {showEnrollButton && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isEnrolled && onEnroll) onEnroll(course.id);
            }}
            disabled={isEnrolled}
            className={cn(
              'w-full py-3 font-medium rounded-xl transition-all',
              isEnrolled
                ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
                : 'bg-gradient-to-r from-primary-500 to-accent-500 text-white hover:shadow-lg hover:shadow-primary-500/30'
            )}
          >
            {isEnrolled ? '✓ Inscripto' : 'Inscribirse'}
          </button>
        )}
      </div>
    </Card>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}) {
  return (
    <Card className="text-center py-16">
      {Icon && <Icon className="w-16 h-16 text-slate-600 mx-auto mb-4" />}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      {description && <p className="text-slate-400 mb-4">{description}</p>}
      {action}
    </Card>
  );
}
