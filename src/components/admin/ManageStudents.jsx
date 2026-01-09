'use client';

import React, { useMemo, useState } from 'react';
import { Eye, Mail, Calendar, ShieldCheck } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useStudents } from '@/hooks/useFirestore';
import { updateUser } from '@/lib/firestore';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Input, Select, Checkbox } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/utils/helpers';
import { ALL_VIEWS, ROLE_LABELS, ROLE_VIEWS } from '@/utils/roles';

export function ManageStudents() {
  const { user } = useApp();
  const { students, loading, fetchStudents } = useStudents();
  const [editingUser, setEditingUser] = useState(null);
  const [roleValue, setRoleValue] = useState('student');
  const [permissions, setPermissions] = useState([]);
  const [saving, setSaving] = useState(false);

  const canManagePermissions = user?.role === 'admin';

  const sortedUsers = useMemo(() => {
    return [...students].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [students]);

  const openPermissions = (selectedUser) => {
    setEditingUser(selectedUser);
    setRoleValue(selectedUser.role || 'student');
    const defaultViews = ROLE_VIEWS[selectedUser.role] || ROLE_VIEWS.student;
    setPermissions(selectedUser.permissions?.views || defaultViews);
  };

  const togglePermission = (viewId) => {
    setPermissions((prev) =>
      prev.includes(viewId) ? prev.filter((view) => view !== viewId) : [...prev, viewId]
    );
  };

  const handleSave = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      await updateUser(editingUser.id, {
        role: roleValue,
        permissions: {
          views: permissions,
        },
      });
      await fetchStudents();
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setSaving(false);
    }
  };

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
          Gestionar Usuarios
        </h1>
        <p className="text-slate-400">{students.length} usuarios registrados</p>
      </div>

      {/* Students Table */}
      <Card padding={false} className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-slate-400 font-medium">Usuario</th>
              <th className="text-left p-4 text-slate-400 font-medium">Email</th>
              <th className="text-left p-4 text-slate-400 font-medium">Rol</th>
              <th className="text-left p-4 text-slate-400 font-medium">Cursos</th>
              <th className="text-left p-4 text-slate-400 font-medium">Registro</th>
              <th className="text-left p-4 text-slate-400 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((student) => (
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
                  <span className="px-3 py-1 bg-white/10 text-slate-200 rounded-full text-sm">
                    {ROLE_LABELS[student.role] || 'Usuario'}
                  </span>
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
                  {canManagePermissions && (
                    <button
                      onClick={() => openPermissions(student)}
                      className="ml-2 p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                      title="Editar permisos"
                    >
                      <ShieldCheck className="w-5 h-5" />
                    </button>
                  )}
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

      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Editar rol y permisos"
        size="lg"
      >
        {editingUser && (
          <div className="space-y-4">
            <Input label="Nombre" value={editingUser.name} disabled />
            <Input label="Email" value={editingUser.email} disabled />

            <Select
              label="Rol"
              value={roleValue}
              onChange={(e) => setRoleValue(e.target.value)}
              options={[
                { value: 'admin', label: 'Administrador total' },
                { value: 'director', label: 'Director' },
                { value: 'teacher', label: 'Docente' },
                { value: 'student', label: 'Alumno' },
              ]}
            />

            <div>
              <label className="block text-sm text-slate-400 mb-2">
                Permisos de vistas
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {ALL_VIEWS.map((view) => (
                  <Checkbox
                    key={view}
                    label={view}
                    checked={permissions.includes(view)}
                    onChange={() => togglePermission(view)}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => setEditingUser(null)}
              >
                Cancelar
              </Button>
              <Button fullWidth onClick={handleSave} loading={saving}>
                Guardar cambios
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
