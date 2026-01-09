export const ROLE_LABELS = {
  admin: 'Administrador total',
  director: 'Director',
  teacher: 'Docente',
  student: 'Alumno',
};

export const ROLE_DEFAULT_VIEW = {
  admin: 'dashboard',
  director: 'dashboard',
  teacher: 'dashboard',
  student: 'dashboard',
};

export const ROLE_VIEWS = {
  admin: [
    'dashboard',
    'manage-courses',
    'edit-course',
    'manage-students',
    'submissions',
    'manage-news',
    'analytics',
  ],
  director: ['dashboard', 'manage-students', 'manage-news', 'analytics'],
  teacher: ['dashboard', 'manage-courses', 'edit-course', 'submissions', 'manage-news'],
  student: ['dashboard', 'courses', 'my-courses', 'course-detail', 'progress', 'news'],
};

export const STAFF_ROLES = new Set(['admin', 'director', 'teacher']);

export const ALL_VIEWS = [
  'dashboard',
  'manage-courses',
  'edit-course',
  'manage-students',
  'submissions',
  'manage-news',
  'analytics',
  'courses',
  'my-courses',
  'course-detail',
  'progress',
  'news',
];

export const getAllowedViews = (user) => {
  if (!user) return ROLE_VIEWS.student;
  if (user.permissions?.views?.length) {
    return user.permissions.views;
  }
  return ROLE_VIEWS[user.role] || ROLE_VIEWS.student;
};
