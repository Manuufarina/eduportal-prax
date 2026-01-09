'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useCourses, useNews } from '@/hooks/useFirestore';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const auth = useAuth();
  const coursesData = useCourses();
  const newsData = useNews();
  
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Reset view when user logs out
  useEffect(() => {
    if (!auth.user) {
      setCurrentView('dashboard');
      setSelectedCourse(null);
    }
  }, [auth.user]);

  const value = {
    // Auth
    ...auth,
    
    // Navigation
    currentView,
    setCurrentView,
    selectedCourse,
    setSelectedCourse,
    sidebarCollapsed,
    setSidebarCollapsed,
    
    // Data
    courses: coursesData.courses,
    coursesLoading: coursesData.loading,
    fetchCourses: coursesData.fetchCourses,
    addCourse: coursesData.addCourse,
    editCourse: coursesData.editCourse,
    removeCourse: coursesData.removeCourse,
    
    news: newsData.news,
    newsLoading: newsData.loading,
    fetchNews: newsData.fetchNews,
    addNews: newsData.addNews,
    editNews: newsData.editNews,
    removeNews: newsData.removeNews,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
