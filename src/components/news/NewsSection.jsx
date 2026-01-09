'use client';

import React from 'react';
import { Bell, AlertTriangle, Calendar } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { formatDate, cn } from '@/utils/helpers';

export function NewsSection() {
  const { news } = useApp();

  const importantNews = news.filter((n) => n.important);
  const regularNews = news.filter((n) => !n.important);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 font-display">
          Novedades
        </h1>
        <p className="text-slate-400">
          Comunicados y noticias de la plataforma
        </p>
      </div>

      {/* Important News */}
      {importantNews.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-primary-400" />
            Importante
          </h2>
          <div className="space-y-4">
            {importantNews.map((item) => (
              <Card
                key={item.id}
                className="border-primary-500/50 bg-gradient-to-r from-primary-500/10 to-accent-500/10"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center flex-shrink-0">
                    <Bell className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-medium text-primary-400 bg-primary-500/20 px-2 py-1 rounded-full">
                        Importante
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.date || item.createdAt?.toDate?.() || item.createdAt)}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-300">{item.content}</p>
                    <p className="text-sm text-slate-400 mt-3">Por {item.author}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Regular News */}
      {regularNews.length > 0 && (
        <section>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Bell className="w-6 h-6 text-slate-400" />
            Noticias
          </h2>
          <div className="space-y-4">
            {regularNews.map((item) => (
              <Card key={item.id}>
                <div className="flex items-center gap-3 mb-3 text-sm text-slate-400">
                  <Calendar className="w-4 h-4" />
                  {formatDate(item.date || item.createdAt?.toDate?.() || item.createdAt)}
                  <span>•</span>
                  <span>{item.author}</span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-300">{item.content}</p>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {news.length === 0 && (
        <Card className="text-center py-16">
          <Bell className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Sin novedades
          </h3>
          <p className="text-slate-400">
            Las noticias y comunicados aparecerán aquí
          </p>
        </Card>
      )}
    </div>
  );
}
