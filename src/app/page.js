'use client';

import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { AuthScreen } from '@/components/auth/AuthScreen';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { CourseCatalog } from '@/components/courses/CourseCatalog';
import { CourseDetail } from '@/components/courses/CourseDetail';
import { MyCourses } from '@/components/student/MyCourses';
import { ProgressView } from '@/components/student/ProgressView';
import { NewsSection } from '@/components/news/NewsSection';
import { ManageCourses } from '@/components/admin/ManageCourses';
import { EditCourseLessons } from '@/components/admin/EditCourseLessons';
import { ManageStudents } from '@/components/admin/ManageStudents';
import { Submissions } from '@/components/admin/Submissions';
import { ManageNews } from '@/components/admin/ManageNews';
import { Analytics } from '@/components/admin/Analytics';
import { seedInitialData } from '@/lib/firestore';
import { ROLE_DEFAULT_VIEW, getAllowedViews } from '@/utils/roles';

function AppContent() {
  const {
    isAuthenticated,
    role,
    user,
    isAdmin,
    isDirector,
    isTeacher,
    currentView,
    setCurrentView,
    loading,
  } = useApp();
  const [seeding, setSeeding] = useState(true);

  // Seed initial data on first load
  useEffect(() => {
    const initData = async () => {
      try {
        await seedInitialData();
      } catch (error) {
        console.log('Data seeding skipped or error:', error);
      } finally {
        setSeeding(false);
      }
    };
    initData();
  }, []);

  // Loading state
  if (loading || seeding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Cargando EduPortal Prax...</p>
        </div>
      </div>
    );
  }

  const allowedViews = getAllowedViews(user);
  const fallbackView = ROLE_DEFAULT_VIEW[role] || 'dashboard';

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!allowedViews.includes(currentView)) {
      setCurrentView(fallbackView);
    }
  }, [allowedViews, currentView, fallbackView, isAuthenticated, setCurrentView]);

  // Not authenticated - show auth screen
  if (!isAuthenticated) {
    return (
      <MainLayout>
        <AuthScreen />
      </MainLayout>
    );
  }

  const allowedViews = getAllowedViews(user);
  const fallbackView = ROLE_DEFAULT_VIEW[role] || 'dashboard';

  useEffect(() => {
    if (!isAuthenticated) return;
    if (!allowedViews.includes(currentView)) {
      setCurrentView(fallbackView);
    }
  }, [allowedViews, currentView, fallbackView, isAuthenticated, setCurrentView]);

  // Render view based on current view and role
  const renderView = () => {
    if (!allowedViews.includes(currentView)) {
      return isAdmin || isDirector || isTeacher ? (
        <AdminDashboard />
      ) : (
        <StudentDashboard />
      );
    }

    switch (currentView) {
      case 'dashboard':
        return isAdmin || isDirector || isTeacher ? <AdminDashboard /> : <StudentDashboard />;
      case 'manage-courses':
        return <ManageCourses />;
      case 'edit-course':
        return <EditCourseLessons />;
      case 'manage-students':
        return <ManageStudents />;
      case 'submissions':
        return <Submissions />;
      case 'manage-news':
        return <ManageNews />;
      case 'analytics':
        return <Analytics />;
      case 'courses':
        return <CourseCatalog />;
      case 'my-courses':
        return <MyCourses />;
      case 'course-detail':
        return <CourseDetail />;
      case 'progress':
        return <ProgressView />;
      case 'news':
        return <NewsSection />;
      default:
        return isAdmin || isDirector || isTeacher ? <AdminDashboard /> : <StudentDashboard />;
    }
  };

  return <MainLayout>{renderView()}</MainLayout>;
}

export default function Home() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
