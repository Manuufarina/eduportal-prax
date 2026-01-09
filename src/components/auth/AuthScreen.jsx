'use client';

import React, { useState } from 'react';
import { User, Mail, Lock, AlertCircle, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useApp } from '@/context/AppContext';

export function AuthScreen() {
  const { login, register, loading, error } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          setLocalError('Las contraseñas no coinciden');
          return;
        }
        await register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        });
      }
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 mb-4 shadow-2xl shadow-primary-500/30">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 font-display">
            EduPortal Prax
          </h1>
          <p className="text-slate-400">Plataforma de Capacitaciones</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Tab Switcher */}
          <div className="flex mb-6 bg-white/10 rounded-xl p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                isLogin
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                !isLogin
                  ? 'bg-primary-500 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Registrarse
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <Input
                type="text"
                placeholder="Nombre completo"
                icon={User}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required={!isLogin}
              />
            )}

            <Input
              type="email"
              placeholder="Email"
              icon={Mail}
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <Input
              type="password"
              placeholder="Contraseña"
              icon={Lock}
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />

            {!isLogin && (
              <Input
                type="password"
                placeholder="Confirmar contraseña"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required={!isLogin}
              />
            )}

            {displayError && (
              <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-lg">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{displayError}</span>
              </div>
            )}

            <Button type="submit" fullWidth loading={loading}>
              {isLogin ? 'Ingresar' : 'Crear cuenta'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-slate-400 text-sm text-center">
              {isLogin ? (
                <>
                  <span className="block mb-1">Demo Admin: admin@eduportalprax.com / admin123</span>
                  <span className="block">Demo Alumno: alumno@test.com / 123456</span>
                </>
              ) : (
                <>Al registrarte aceptás los términos y condiciones</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
