'use client';

import React, { useState } from 'react';
import {
  ChevronRight,
  User,
  Clock,
  Video,
  Users,
  Star,
  CheckCircle,
  Check,
  FileText,
  Download,
  Upload,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useEnrollment } from '@/hooks/useFirestore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { cn, getYouTubeEmbedUrl } from '@/utils/helpers';

export function CourseDetail() {
  const {
    user,
    selectedCourse: course,
    setCurrentView,
    refreshUser,
  } = useApp();
  
  const { enroll, completeLesson, submit, loading } = useEnrollment(user?.id);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submissionFile, setSubmissionFile] = useState('');

  if (!course) {
    setCurrentView('courses');
    return null;
  }

  const isEnrolled = user.enrolledCourses?.includes(course.id);
  const progress = user.progress?.[course.id];
  const completedLessons = progress?.completedLessons || [];
  const progressPercent = course.lessons?.length
    ? Math.round((completedLessons.length / course.lessons.length) * 100)
    : 0;

  const handleEnroll = async () => {
    try {
      await enroll(course.id);
      await refreshUser();
    } catch (error) {
      console.error('Error enrolling:', error);
    }
  };

  const handleMarkComplete = async (lessonId) => {
    try {
      await completeLesson(course.id, lessonId);
      await refreshUser();
    } catch (error) {
      console.error('Error marking complete:', error);
    }
  };

  const handleSubmit = async (lessonId) => {
    if (!submissionFile) return;
    try {
      await submit(course.id, lessonId, { fileName: submissionFile });
      await refreshUser();
      setShowSubmitModal(false);
      setSubmissionFile('');
    } catch (error) {
      console.error('Error submitting:', error);
    }
  };

  const getSubmission = (lessonId) => {
    return progress?.submissions?.find((s) => s.lessonId === lessonId);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => setCurrentView('courses')}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
      >
        <ChevronRight className="w-5 h-5 rotate-180" /> Volver a cursos
      </button>

      {/* Course Header */}
      <Card padding={false} className="overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-8xl">
          {course.thumbnail}
        </div>
        <div className="p-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-sm font-medium text-primary-400 bg-primary-500/20 px-3 py-1 rounded-full">
              {course.category}
            </span>
            <span className="text-sm text-slate-400 bg-white/10 px-3 py-1 rounded-full">
              {course.level}
            </span>
            <span className="text-sm text-slate-400 bg-white/10 px-3 py-1 rounded-full flex items-center gap-1">
              <Star className="w-4 h-4 text-primary-400" /> {course.rating}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4 font-display">
            {course.title}
          </h1>
          <p className="text-slate-300 mb-6">{course.description}</p>

          <div className="flex flex-wrap items-center gap-6 text-slate-400 mb-6">
            <span className="flex items-center gap-2">
              <User className="w-5 h-5" /> {course.instructor}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-5 h-5" /> {course.duration}
            </span>
            <span className="flex items-center gap-2">
              <Video className="w-5 h-5" /> {course.lessons?.length || 0} clases
            </span>
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5" /> {course.enrolledStudents} estudiantes
            </span>
          </div>

          {!isEnrolled && (
            <Button onClick={handleEnroll} loading={loading}>
              Inscribirse al curso
            </Button>
          )}

          {isEnrolled && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
              <span className="text-emerald-400 font-medium">
                Estás inscripto en este curso
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lessons */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white font-display">
            Contenido del curso
          </h2>

          {course.lessons?.map((lesson, index) => {
            const isComplete = completedLessons.includes(lesson.id);
            const submission = getSubmission(lesson.id);
            const isExpanded = selectedLesson === lesson.id;
            const messages = lesson.messages || [];

            return (
              <Card
                key={lesson.id}
                padding={false}
                className={cn(
                  'transition-all',
                  isExpanded && 'border-primary-500/50'
                )}
              >
                <button
                  onClick={() => setSelectedLesson(isExpanded ? null : lesson.id)}
                  className="w-full p-5 flex items-center gap-4 text-left"
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                      isComplete
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/10 text-slate-400'
                    )}
                  >
                    {isComplete ? <Check className="w-5 h-5" /> : index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white">{lesson.title}</h3>
                    <p className="text-sm text-slate-400 truncate">
                      {lesson.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {lesson.duration}
                    </span>
                    {lesson.hasAssignment && (
                      <span className="text-primary-400 bg-primary-500/20 px-2 py-1 rounded-full text-xs">
                        Tarea
                      </span>
                    )}
                    <ChevronRight
                      className={cn(
                        'w-5 h-5 transition-transform',
                        isExpanded && 'rotate-90'
                      )}
                    />
                  </div>
                </button>

                {isExpanded && isEnrolled && (
                  <div className="px-5 pb-5 space-y-4 border-t border-white/10 pt-4">
                    {/* Video */}
                    <div className="aspect-video rounded-xl overflow-hidden bg-black">
                      <iframe
                        src={getYouTubeEmbedUrl(lesson.videoUrl)}
                        className="w-full h-full"
                        allowFullScreen
                        title={lesson.title}
                      />
                    </div>

                    {/* Files */}
                    {lesson.files?.length > 0 && (
                      <div>
                        <h4 className="text-white font-medium mb-3">
                          Archivos de la clase
                        </h4>
                        <div className="space-y-2">
                          {lesson.files.map((file, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                            >
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-primary-400" />
                                <div>
                                  <p className="text-white text-sm">{file.name}</p>
                                  <p className="text-xs text-slate-400">{file.size}</p>
                                </div>
                              </div>
                              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white">
                                <Download className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Assignment */}
                    {lesson.hasAssignment && (
                      <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4">
                        <h4 className="text-primary-400 font-medium mb-2 flex items-center gap-2">
                          <FileText className="w-5 h-5" /> Tarea
                        </h4>
                        <p className="text-slate-300 text-sm mb-4">
                          {lesson.assignmentDesc}
                        </p>

                        {submission ? (
                          <div className="bg-white/5 rounded-xl p-4">
                            <p className="text-sm text-slate-400 mb-2">
                              Archivo enviado:{' '}
                              <span className="text-white">{submission.file}</span>
                            </p>
                            {submission.grade !== null ? (
                              <div className="space-y-2">
                                <p className="text-emerald-400 font-medium">
                                  Nota: {submission.grade}/100
                                </p>
                                <p className="text-sm text-slate-300">
                                  Feedback: {submission.feedback}
                                </p>
                              </div>
                            ) : (
                              <p className="text-primary-400 text-sm">
                                Pendiente de corrección
                              </p>
                            )}
                          </div>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            icon={Upload}
                            onClick={() => setShowSubmitModal(true)}
                          >
                            Enviar tarea
                          </Button>
                        )}
                      </div>
                    )}

                    {/* Messages */}
                    <div className="bg-white/5 rounded-xl p-4">
                      <h4 className="text-white font-medium mb-3">
                        Mensajes de la clase
                      </h4>
                      {messages.length === 0 ? (
                        <p className="text-sm text-slate-400">
                          Todavía no hay mensajes para esta clase.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {messages.map((message, i) => {
                            const parsedDate = message.createdAt
                              ? new Date(message.createdAt)
                              : null;
                            const dateLabel =
                              parsedDate && !Number.isNaN(parsedDate.getTime())
                                ? parsedDate.toLocaleDateString('es-AR')
                                : message.createdAt;

                            return (
                              <div
                                key={message.id || i}
                                className="border-b border-white/10 pb-3 last:border-b-0 last:pb-0"
                              >
                                <p className="text-sm text-white font-medium">
                                  {message.author || 'Equipo docente'}
                                </p>
                                <p className="text-sm text-slate-300">
                                  {message.content}
                                </p>
                                {dateLabel && (
                                  <p className="text-xs text-slate-500 mt-1">
                                    {dateLabel}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Mark Complete Button */}
                    <div className="flex justify-end">
                      {!isComplete && (
                        <Button
                          onClick={() => handleMarkComplete(lesson.id)}
                          loading={loading}
                          className="bg-gradient-to-r from-emerald-500 to-teal-500"
                          icon={Check}
                        >
                          Marcar como completada
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Progress */}
          {isEnrolled && (
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4">
                Tu progreso
              </h3>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    className="stroke-white/10"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    className="stroke-primary-500"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${progressPercent * 3.5186} 351.86`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">
                    {progressPercent}%
                  </span>
                </div>
              </div>
              <p className="text-center text-slate-400">
                {completedLessons.length} de {course.lessons?.length || 0} clases
                completadas
              </p>
            </Card>
          )}

          {/* Instructor */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4">
              Instructor
            </h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-2xl">
                👨‍🏫
              </div>
              <div>
                <p className="text-white font-medium">{course.instructor}</p>
                <p className="text-sm text-slate-400">Instructor certificado</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Submit Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Enviar tarea"
      >
        <div className="space-y-4">
          <Input
            label="Nombre del archivo"
            placeholder="mi_tarea.pdf"
            value={submissionFile}
            onChange={(e) => setSubmissionFile(e.target.value)}
          />
          <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center">
            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-400">
              Arrastrá tu archivo aquí o hacé clic para seleccionar
            </p>
            <p className="text-sm text-slate-500 mt-2">PDF, DOC, DOCX hasta 10MB</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => setShowSubmitModal(false)}
            >
              Cancelar
            </Button>
            <Button
              fullWidth
              onClick={() => handleSubmit(selectedLesson)}
              disabled={!submissionFile}
              loading={loading}
            >
              Enviar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
