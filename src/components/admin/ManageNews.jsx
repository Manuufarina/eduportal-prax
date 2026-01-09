'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Bell, AlertTriangle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal, ConfirmModal } from '@/components/ui/Modal';
import { Input, Textarea, Checkbox } from '@/components/ui/Input';
import { formatDate, cn } from '@/utils/helpers';

export function ManageNews() {
  const { news, addNews, editNews, removeNews } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [newsToDelete, setNewsToDelete] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: 'Administración',
    important: false,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      author: 'Administración',
      important: false,
    });
    setEditingNews(null);
  };

  const handleOpenModal = (newsItem = null) => {
    if (newsItem) {
      setEditingNews(newsItem);
      setFormData({
        title: newsItem.title,
        content: newsItem.content,
        author: newsItem.author,
        important: newsItem.important || false,
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const data = {
        ...formData,
        date: new Date().toISOString().split('T')[0],
      };
      
      if (editingNews) {
        await editNews(editingNews.id, data);
      } else {
        await addNews(data);
      }
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  const handleDelete = async () => {
    if (newsToDelete) {
      try {
        await removeNews(newsToDelete.id);
        setNewsToDelete(null);
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 font-display">
            Gestionar Noticias
          </h1>
          <p className="text-slate-400">Publicá comunicados y novedades</p>
        </div>
        <Button icon={Plus} onClick={() => handleOpenModal()}>
          Nueva noticia
        </Button>
      </div>

      {/* News List */}
      <div className="space-y-4">
        {news.map((item) => (
          <Card
            key={item.id}
            className={cn(
              'transition-all',
              item.important && 'border-primary-500/50 bg-primary-500/5'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {item.important && (
                    <span className="flex items-center gap-1 text-xs font-medium text-primary-400 bg-primary-500/20 px-2 py-1 rounded-full">
                      <AlertTriangle className="w-3 h-3" /> Importante
                    </span>
                  )}
                  <span className="text-xs text-slate-400">
                    {formatDate(item.date || item.createdAt?.toDate?.() || item.createdAt)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-300 mb-3">{item.content}</p>
                <p className="text-sm text-slate-400">Por {item.author}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleOpenModal(item)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400 hover:text-white"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    setNewsToDelete(item);
                    setShowDeleteConfirm(true);
                  }}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-slate-400 hover:text-red-400"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Card>
        ))}

        {news.length === 0 && (
          <Card className="text-center py-16">
            <Bell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              Sin noticias
            </h3>
            <p className="text-slate-400">
              Publicá la primera noticia para los estudiantes
            </p>
          </Card>
        )}
      </div>

      {/* News Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
        title={editingNews ? 'Editar noticia' : 'Nueva noticia'}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Título"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <Textarea
            label="Contenido"
            rows={5}
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          />

          <Input
            label="Autor"
            value={formData.author}
            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
          />

          <Checkbox
            label="Marcar como importante"
            checked={formData.important}
            onChange={(e) =>
              setFormData({ ...formData, important: e.target.checked })
            }
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
              {editingNews ? 'Guardar cambios' : 'Publicar'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setNewsToDelete(null);
        }}
        onConfirm={handleDelete}
        title="¿Eliminar noticia?"
        message={`¿Estás seguro de que querés eliminar "${newsToDelete?.title}"?`}
        confirmText="Eliminar"
      />
    </div>
  );
}
