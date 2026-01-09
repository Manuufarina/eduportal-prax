'use client';

import React, { useState } from 'react';
import { FileText, Check, Clock, Star } from 'lucide-react';
import { useSubmissions } from '@/hooks/useFirestore';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { formatRelativeTime, getGradeColor, cn } from '@/utils/helpers';

export function Submissions() {
  const { submissions, loading, grade } = useSubmissions();
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [gradeData, setGradeData] = useState({ grade: '', feedback: '' });
  const [filter, setFilter] = useState('pending');

  const pendingSubmissions = submissions.filter((s) => s.grade === null);
  const gradedSubmissions = submissions.filter((s) => s.grade !== null);

  const displayedSubmissions = filter === 'pending' ? pendingSubmissions : gradedSubmissions;

  const handleGrade = async () => {
    if (!selectedSubmission || !gradeData.grade) return;
    
    try {
      await grade(
        selectedSubmission.odentId,
        selectedSubmission.courseId,
        selectedSubmission.lessonId,
        parseInt(gradeData.grade),
        gradeData.feedback
      );
      setShowGradeModal(false);
      setSelectedSubmission(null);
      setGradeData({ grade: '', feedback: '' });
    } catch (error) {
      console.error('Error grading:', error);
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
          Entregas de Tareas
        </h1>
        <p className="text-slate-400">
          {pendingSubmissions.length} pendientes de corrección
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('pending')}
          className={cn(
            'px-4 py-2 rounded-xl font-medium transition-all',
            filter === 'pending'
              ? 'bg-primary-500 text-white'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          )}
        >
          Pendientes ({pendingSubmissions.length})
        </button>
        <button
          onClick={() => setFilter('graded')}
          className={cn(
            'px-4 py-2 rounded-xl font-medium transition-all',
            filter === 'graded'
              ? 'bg-primary-500 text-white'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          )}
        >
          Corregidas ({gradedSubmissions.length})
        </button>
      </div>

      {/* Submissions List */}
      <div className="space-y-4">
        {displayedSubmissions.map((submission, index) => (
          <Card key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-accent-500 flex items-center justify-center text-lg">
                {submission.studentAvatar || '👤'}
              </div>
              <div>
                <p className="text-white font-medium">{submission.studentName}</p>
                <p className="text-sm text-slate-400">
                  {submission.courseTitle} - {submission.lessonTitle}
                </p>
                <p className="text-xs text-slate-500">
                  Enviado {formatRelativeTime(submission.submittedAt)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-400 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {submission.file}
                </p>
              </div>

              {submission.grade !== null ? (
                <div
                  className={cn(
                    'px-4 py-2 rounded-xl font-medium',
                    getGradeColor(submission.grade)
                  )}
                >
                  {submission.grade}/100
                </div>
              ) : (
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedSubmission(submission);
                    setShowGradeModal(true);
                  }}
                >
                  Calificar
                </Button>
              )}
            </div>
          </Card>
        ))}

        {displayedSubmissions.length === 0 && (
          <Card className="text-center py-16">
            {filter === 'pending' ? (
              <>
                <Check className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  ¡Todo al día!
                </h3>
                <p className="text-slate-400">
                  No hay entregas pendientes de corrección
                </p>
              </>
            ) : (
              <>
                <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Sin entregas corregidas
                </h3>
                <p className="text-slate-400">
                  Las entregas corregidas aparecerán aquí
                </p>
              </>
            )}
          </Card>
        )}
      </div>

      {/* Grade Modal */}
      <Modal
        isOpen={showGradeModal}
        onClose={() => {
          setShowGradeModal(false);
          setSelectedSubmission(null);
          setGradeData({ grade: '', feedback: '' });
        }}
        title="Calificar entrega"
        size="md"
      >
        {selectedSubmission && (
          <div className="space-y-4">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-white font-medium mb-1">
                {selectedSubmission.studentName}
              </p>
              <p className="text-sm text-slate-400">
                {selectedSubmission.courseTitle} - {selectedSubmission.lessonTitle}
              </p>
              <p className="text-sm text-primary-400 mt-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                {selectedSubmission.file}
              </p>
            </div>

            <Input
              label="Nota (0-100)"
              type="number"
              min="0"
              max="100"
              value={gradeData.grade}
              onChange={(e) =>
                setGradeData({ ...gradeData, grade: e.target.value })
              }
            />

            <Textarea
              label="Feedback"
              rows={4}
              placeholder="Comentarios sobre la entrega..."
              value={gradeData.feedback}
              onChange={(e) =>
                setGradeData({ ...gradeData, feedback: e.target.value })
              }
            />

            <div className="flex gap-3 pt-4">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => {
                  setShowGradeModal(false);
                  setSelectedSubmission(null);
                  setGradeData({ grade: '', feedback: '' });
                }}
              >
                Cancelar
              </Button>
              <Button
                fullWidth
                onClick={handleGrade}
                disabled={!gradeData.grade}
              >
                Guardar calificación
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
