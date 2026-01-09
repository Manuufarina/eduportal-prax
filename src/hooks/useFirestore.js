'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addLessonToCourse,
  updateLesson,
  deleteLesson,
  getAllNews,
  createNews,
  updateNews,
  deleteNews,
  getAllStudents,
  enrollUserInCourse,
  markLessonComplete,
  submitAssignment,
  gradeSubmission,
  getAllSubmissions,
  subscribeToCollection,
  COLLECTIONS,
} from '@/lib/firestore';

// Hook for courses
export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllCourses();
      setCourses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const addCourse = async (courseData) => {
    const newCourse = await createCourse(courseData);
    setCourses(prev => [newCourse, ...prev]);
    return newCourse;
  };

  const editCourse = async (courseId, data) => {
    await updateCourse(courseId, data);
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, ...data } : c));
  };

  const removeCourse = async (courseId) => {
    await deleteCourse(courseId);
    setCourses(prev => prev.filter(c => c.id !== courseId));
  };

  return {
    courses,
    loading,
    error,
    fetchCourses,
    addCourse,
    editCourse,
    removeCourse,
  };
}

// Hook for a single course with lessons
export function useCourse(courseId) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourse = useCallback(async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const data = await getCourseById(courseId);
      setCourse(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);

  const addLesson = async (lessonData) => {
    const newLesson = await addLessonToCourse(courseId, lessonData);
    setCourse(prev => ({
      ...prev,
      lessons: [...(prev.lessons || []), newLesson],
    }));
    return newLesson;
  };

  const editLesson = async (lessonId, data) => {
    await updateLesson(courseId, lessonId, data);
    setCourse(prev => ({
      ...prev,
      lessons: prev.lessons.map(l => l.id === lessonId ? { ...l, ...data } : l),
    }));
  };

  const removeLesson = async (lessonId) => {
    await deleteLesson(courseId, lessonId);
    setCourse(prev => ({
      ...prev,
      lessons: prev.lessons.filter(l => l.id !== lessonId),
    }));
  };

  return {
    course,
    loading,
    error,
    fetchCourse,
    addLesson,
    editLesson,
    removeLesson,
  };
}

// Hook for news
export function useNews() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllNews();
      setNews(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const addNews = async (newsData) => {
    const newItem = await createNews(newsData);
    setNews(prev => [newItem, ...prev]);
    return newItem;
  };

  const editNews = async (newsId, data) => {
    await updateNews(newsId, data);
    setNews(prev => prev.map(n => n.id === newsId ? { ...n, ...data } : n));
  };

  const removeNews = async (newsId) => {
    await deleteNews(newsId);
    setNews(prev => prev.filter(n => n.id !== newsId));
  };

  return {
    news,
    loading,
    error,
    fetchNews,
    addNews,
    editNews,
    removeNews,
  };
}

// Hook for students (admin)
export function useStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllStudents();
      setStudents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  return {
    students,
    loading,
    error,
    fetchStudents,
  };
}

// Hook for submissions (admin)
export function useSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllSubmissions();
      setSubmissions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const grade = async (userId, courseId, lessonId, gradeValue, feedback) => {
    await gradeSubmission(userId, courseId, lessonId, gradeValue, feedback);
    await fetchSubmissions();
  };

  return {
    submissions,
    loading,
    error,
    fetchSubmissions,
    grade,
  };
}

// Hook for enrollment and progress
export function useEnrollment(userId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const enroll = async (courseId) => {
    setLoading(true);
    try {
      await enrollUserInCourse(userId, courseId);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeLesson = async (courseId, lessonId) => {
    setLoading(true);
    try {
      await markLessonComplete(userId, courseId, lessonId);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const submit = async (courseId, lessonId, fileData) => {
    setLoading(true);
    try {
      await submitAssignment(userId, courseId, lessonId, fileData);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    enroll,
    completeLesson,
    submit,
  };
}
