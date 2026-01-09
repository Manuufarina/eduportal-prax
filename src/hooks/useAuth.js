'use client';

import { useState, useEffect, useCallback } from 'react';
import { getUserByEmail, createUser, updateUser } from '@/lib/firestore';

const AUTH_KEY = 'eduportal-prax-user';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Error loading user:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const foundUser = await getUserByEmail(email);
      
      if (!foundUser) {
        throw new Error('Usuario no encontrado');
      }

      if (foundUser.password !== password) {
        throw new Error('Contraseña incorrecta');
      }

      setUser(foundUser);
      localStorage.setItem(AUTH_KEY, JSON.stringify(foundUser));
      return foundUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const existingUser = await getUserByEmail(userData.email);
      
      if (existingUser) {
        throw new Error('Este email ya está registrado');
      }

      const newUser = await createUser({
        ...userData,
        role: 'student',
        avatar: '👤',
      });

      setUser(newUser);
      localStorage.setItem(AUTH_KEY, JSON.stringify(newUser));
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(AUTH_KEY);
  }, []);

  // Update user data
  const updateUserData = useCallback(async (data) => {
    if (!user) return;

    try {
      await updateUser(user.id, data);
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem(AUTH_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [user]);

  // Refresh user data from Firestore
  const refreshUser = useCallback(async () => {
    if (!user) return;

    try {
      const freshUser = await getUserByEmail(user.email);
      if (freshUser) {
        setUser(freshUser);
        localStorage.setItem(AUTH_KEY, JSON.stringify(freshUser));
      }
    } catch (err) {
      console.error('Error refreshing user:', err);
    }
  }, [user]);

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUserData,
    refreshUser,
    isAuthenticated: !!user,
    role: user?.role,
    isAdmin: user?.role === 'admin',
    isDirector: user?.role === 'director',
    isTeacher: user?.role === 'teacher',
    isStudent: user?.role === 'student',
    isStaff: ['admin', 'director', 'teacher'].includes(user?.role),
  };
}
