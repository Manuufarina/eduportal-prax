'use client';

import React, { useState } from 'react';
import { Plus, Video, Edit, Trash2, Users, Star } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { Input, Textarea, Select } from '@/components/ui/Input';

const emojis = ['📚', '🎓', '💻', '🔬', '🌿', '🏥', '🦟', '♻️', '📊', '🎨', '🔧', '📈'];

export function ManageCourses() {
  const { courses, addCourse, editCourse, removeCourse, setCurrentView, setSelectedCourse } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor: '',
    category: '',
    level: 'Básico',
    thumbnail: '📚',
    duration: '4 semanas',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      instructor: '',
      category: '',
      level: 'Básico',
      thumbnail: '📚',
      duration: '4 semanas',
    });
    setEditingCourse(null);
  };

  const handleOpenModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        title: course.title,
        description: course.description,
        instructor: course.instructor,
        category: course.category,
        level: course.level,
        thumbnail: course.thumbnail,
        duration: course.duration,
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingCourse) {
        await editCourse(editingCourse.id, formData);
      } else {
        await addCourse(formData);
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleDelete = async () => {
    if (courseToDelete) {
      try {
        await removeCourse(courseToDelete.id);
        setCourseToDelete(null);
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 font-display">
            Gestionar Cursos
          </h1>
          <p className="text-slate-400">Administrá los cursos de la plataforma</p>
        </div>
        <Button icon={Plus} onClick={() => handleOpenModal()}>
          Nuevo curso
        </Button>
      </div>

      {/* Courses Table */}
      <Card padding={false} className="overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-4 text-slate-400 font-medium">Curso</th>
              <th className="text-left p-4 text-slate-400 font-medium">Categoría</th>
              <th className="text-left p-4 text-slate-400 font-medium">Clases</th>
              <th className="text-left p-4 text-slate-400 font-medium">Estudiantes</th>
              <th className="text-left p-4 text-slate-400 font-medium">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr
                key={course.id}
                className="border-b border-white/5 hover:bg-white/5"
              >
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-2xl">
                      {course.thumbnail}
                    </div>
                    <div>
                      <p className="text-white font-medium">{course.title}</p>
                      <p className="text-sm text-slate-400">{course.instructor}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm">
                    {course.category}
                  </span>
                </td>
                <td className="p-4 text-white">{course.lessons?.length || 0}</td>
                <td className="p-4 text-white">{course.enrolledStudents}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setCurrentView('edit-course');
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                      title="Editar clases"
                    >
                      <Video className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleOpenModal(course)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                      title="Editar curso"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setCourseToDelete(course);
                        setShowDeleteConfirm(true);
                      }}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                      title="Eliminar"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Course Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingCourse ? 'Editar curso' : 'Nuevo curso'}
        size="lg"
      >
        <div className="space-y-4">
          {/* Emoji Selector */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Ícono</label>
            <div className="flex flex-wrap gap-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => setFormData({ ...formData, thumbnail: emoji })}
                  className={`w-12 h-12 rounded-xl text-2xl transition-all ${
                    formData.thumbnail === emoji
                      ? 'bg-primary-500 scale-110'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Título"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <Textarea
            label="Descripción"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <Input
            label="Instructor"
            value={formData.instructor}
            onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Categoría"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
            <Select
              label="Nivel"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              options={[
                { value: 'Básico', label: 'Básico' },
                { value: 'Intermedio', label: 'Intermedio' },
                { value: 'Avanzado', label: 'Avanzado' },
              ]}
            />
          </div>

          <Input
            label="Duración"
            placeholder="4 semanas"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          />

          <div className="flex gap-3 pt-4">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                setShowModal(false);
                resetForm();
              }}
            >
              Cancelar
            </Button>
            <Button fullWidth onClick={handleSave}>
              Guardar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setCourseToDelete(null);
        }}
        onConfirm={handleDelete}
        title="¿Eliminar curso?"
        message={`¿Estás seguro de que querés eliminar "${courseToDelete?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
      />
    </div>
  );
}
