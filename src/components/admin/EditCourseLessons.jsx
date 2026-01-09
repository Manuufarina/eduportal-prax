'use client';

import React, { useState } from 'react';
import { ChevronRight, Plus, Video, Edit, Trash2, Clock, File, FileText, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useCourse } from '@/hooks/useFirestore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { Input, Textarea, Checkbox } from '@/components/ui/Input';

export function EditCourseLessons() {
  const { selectedCourse, setCurrentView } = useApp();
  const { course, addLesson, editLesson, removeLesson, fetchCourse } = useCourse(selectedCourse?.id);
  
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: '',
    hasAssignment: false,
    assignmentDesc: '',
    files: [],
  });
  const [newFile, setNewFile] = useState({ name: '', size: '' });

  if (!course) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      videoUrl: '',
      duration: '',
      hasAssignment: false,
      assignmentDesc: '',
      files: [],
    });
    setEditingLesson(null);
    setNewFile({ name: '', size: '' });
  };

  const handleOpenModal = (lesson = null) => {
    if (lesson) {
      setEditingLesson(lesson);
      setFormData({
        title: lesson.title,
        description: lesson.description,
        videoUrl: lesson.videoUrl,
        duration: lesson.duration,
        hasAssignment: lesson.hasAssignment || false,
        assignmentDesc: lesson.assignmentDesc || '',
        files: lesson.files || [],
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (editingLesson) {
        await editLesson(editingLesson.id, formData);
      } else {
        await addLesson(formData);
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving lesson:', error);
    }
  };

  const handleDelete = async () => {
    if (lessonToDelete) {
      try {
        await removeLesson(lessonToDelete.id);
        setLessonToDelete(null);
      } catch (error) {
        console.error('Error deleting lesson:', error);
      }
    }
  };

  const addFile = () => {
    if (newFile.name) {
      setFormData({
        ...formData,
        files: [...formData.files, { ...newFile }],
      });
      setNewFile({ name: '', size: '' });
    }
  };

  const removeFile = (index) => {
    setFormData({
      ...formData,
      files: formData.files.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => setCurrentView('manage-courses')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ChevronRight className="w-5 h-5 rotate-180" /> Volver a cursos
      </button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 font-display">
            {course.title}
          </h1>
          <p className="text-slate-400">Gestionar clases y contenido</p>
        </div>
        <Button icon={Plus} onClick={() => handleOpenModal()}>
          Nueva clase
        </Button>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        {course.lessons?.map((lesson, index) => (
          <Card key={lesson.id} className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {lesson.title}
                </h3>
                <p className="text-slate-400 text-sm mb-2">{lesson.description}</p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-4 h-4" /> {lesson.duration}
                  </span>
                  <span className="text-slate-400 flex items-center gap-1">
                    <File className="w-4 h-4" /> {lesson.files?.length || 0} archivos
                  </span>
                  {lesson.hasAssignment && (
                    <span className="text-primary-400 bg-primary-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <FileText className="w-4 h-4" /> Con tarea
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleOpenModal(lesson)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={() => {
                  setLessonToDelete(lesson);
                  setShowDeleteConfirm(true);
                }}
                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-slate-400 hover:text-red-400"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </Card>
        ))}

        {(!course.lessons || course.lessons.length === 0) && (
          <Card className="text-center py-16">
            <Video className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Sin clases</h3>
            <p className="text-slate-400">Agregá la primera clase a este curso</p>
          </Card>
        )}
      </div>

      {/* Lesson Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingLesson ? 'Editar clase' : 'Nueva clase'}
        size="2xl"
      >
        <div className="space-y-4">
          <Input
            label="Título"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <Textarea
            label="Descripción"
            rows={2}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="URL del video (YouTube embed)"
              placeholder="https://www.youtube.com/embed/..."
              value={formData.videoUrl}
              onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
            />
            <Input
              label="Duración"
              placeholder="45 min"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            />
          </div>

          {/* Files Section */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">
              Archivos de la clase
            </label>
            <div className="space-y-2 mb-3">
              {formData.files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary-400" />
                    <span className="text-white">{file.name}</span>
                    <span className="text-slate-400 text-sm">{file.size}</span>
                  </div>
                  <button
                    onClick={() => removeFile(i)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Nombre del archivo"
                value={newFile.name}
                onChange={(e) => setNewFile({ ...newFile, name: e.target.value })}
                containerClassName="flex-1"
              />
              <Input
                placeholder="Tamaño"
                value={newFile.size}
                onChange={(e) => setNewFile({ ...newFile, size: e.target.value })}
                containerClassName="w-24"
              />
              <Button onClick={addFile} className="px-4">
                <Plus className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Assignment Section */}
          <div className="bg-white/5 rounded-xl p-4">
            <Checkbox
              label="Esta clase tiene tarea"
              checked={formData.hasAssignment}
              onChange={(e) =>
                setFormData({ ...formData, hasAssignment: e.target.checked })
              }
              className="mb-3"
            />
            {formData.hasAssignment && (
              <Textarea
                label="Descripción de la tarea"
                rows={2}
                value={formData.assignmentDesc}
                onChange={(e) =>
                  setFormData({ ...formData, assignmentDesc: e.target.value })
                }
              />
            )}
          </div>

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
          setLessonToDelete(null);
        }}
        onConfirm={handleDelete}
        title="¿Eliminar clase?"
        message={`¿Estás seguro de que querés eliminar "${lessonToDelete?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
      />
    </div>
  );
}
