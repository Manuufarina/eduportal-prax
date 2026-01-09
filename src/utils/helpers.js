import { clsx } from 'clsx';

// Combine class names
export function cn(...classes) {
  return clsx(classes);
}

// Format date
export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

// Format relative time
export function formatRelativeTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Justo ahora';
  if (minutes < 60) return `Hace ${minutes} minutos`;
  if (hours < 24) return `Hace ${hours} horas`;
  if (days < 7) return `Hace ${days} días`;
  
  return formatDate(dateString);
}

// Calculate progress percentage
export function calculateProgress(completedLessons = [], totalLessons = 0) {
  if (totalLessons === 0) return 0;
  return Math.round((completedLessons.length / totalLessons) * 100);
}

// Calculate average grade
export function calculateAverageGrade(submissions = []) {
  const graded = submissions.filter(s => s.grade !== null);
  if (graded.length === 0) return null;
  return Math.round(graded.reduce((acc, s) => acc + s.grade, 0) / graded.length);
}

// Get grade color class
export function getGradeColor(grade) {
  if (grade >= 80) return 'text-emerald-400 bg-emerald-500/20';
  if (grade >= 60) return 'text-amber-400 bg-amber-500/20';
  return 'text-red-400 bg-red-500/20';
}

// Convert YouTube URL to embed URL
export function getYouTubeEmbedUrl(url) {
  if (!url) return '';
  
  // Already an embed URL
  if (url.includes('/embed/')) return url;
  
  // Extract video ID from various YouTube URL formats
  let videoId = '';
  
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1].split('?')[0];
  } else if (url.includes('watch?v=')) {
    videoId = url.split('watch?v=')[1].split('&')[0];
  } else if (url.includes('/v/')) {
    videoId = url.split('/v/')[1].split('?')[0];
  }
  
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
}

// Generate initials from name
export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Truncate text
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

// File size formatter
export function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// Validate email
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
