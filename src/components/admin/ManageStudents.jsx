'use client';

import React from 'react';
import { Eye, Mail, Calendar } from 'lucide-react';
import { useStudents } from '@/hooks/useFirestore';
import { Card } from '@/components/ui/Card';
import { formatDate } from '@/utils/helpers';

export function ManageStudents() {
  const { students, loading } = useStudents();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-display">
          Gestionar Alumnos
        </h1>
        <p className="text-slate-400">{students.length} estudiantes registrados</p>
      </div>

      {/* Students Table */}
      <Card padding={false} className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-slate-400 font-medium">Alumno</th>
              <th className="text-left p-4 text-slate-400 font-medium">Email</th>
              <th className="text-left p-4 text-slate-400 font-medium">Cursos</th>
              <th className="text-left p-4 text-slate-400 font-medium">Registro</th>
              <th className="text-left p-4 text-slate-400 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="border-b border-white/5 hover:bg-white/5"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-lg">
                      {student.avatar}
                    </div>
                    <span className="text-white font-medium">{student.name}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Mail className="w-4 h-4 text-slate-500" />
                    {student.email}
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm">
                    {student.enrolledCourses?.length || 0} cursos
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Calendar className="w-4 h-4" />
                    {student.createdAt?.toDate
                      ? formatDate(student.createdAt.toDate())
                      : formatDate(student.createdAt)}
                  </div>
                </td>
                <td className="p-4">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
                    <Eye className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {students.length === 0 && (
          <div className="text-center py-16">
            <p className="text-slate-400">No hay estudiantes registrados</p>
          </div>
        )}
      </Card>
    </div>
  );
}
