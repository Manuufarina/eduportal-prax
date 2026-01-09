# EduPortal Prax 🎓

Plataforma de capacitaciones educativas moderna construida con Next.js 14, Firebase/Firestore y Tailwind CSS.

![EduPortal Prax](https://img.shields.io/badge/EduPortal-Prax-9333ea?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=flat-square)

## ✨ Características

### Para Estudiantes
- 📚 Catálogo de cursos con búsqueda y filtros
- 🎯 Sistema de inscripción con un clic
- 📹 Videos embebidos de YouTube por clase
- 📄 Archivos descargables por lección
- ✅ Sistema de entregas de tareas
- 📊 Seguimiento de progreso detallado
- 📰 Sección de novedades y comunicados

### Para Administradores
- 📈 Dashboard con métricas globales
- 🎓 Gestión completa de cursos (CRUD)
- 📝 Editor de clases con videos, archivos y tareas
- 👥 Gestión de estudiantes
- ✍️ Sistema de corrección de entregas
- 📢 Publicación de noticias
- 📊 Panel de analíticas

## 🚀 Comenzar

### Prerequisitos

- Node.js 18+ 
- npm o yarn
- Cuenta de Firebase
- Cuenta de Vercel (para deploy)

### 1. Clonar el repositorio

```bash
git clone <tu-repo>
cd eduportal-prax
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o usa uno existente
3. Habilita **Firestore Database**
4. Habilita **Authentication** (Email/Password)
5. Ve a Configuración del proyecto > Tus apps > Web
6. Copia las credenciales

### 4. Variables de entorno

Crea un archivo `.env.local` en la raíz:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_proyecto
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

### 5. Configurar reglas de Firestore

En Firebase Console > Firestore > Reglas:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura a todos los usuarios autenticados
    match /{document=**} {
      allow read: if true;
      allow write: if true;
    }
  }
}
```

> ⚠️ Para producción, configura reglas más restrictivas

### 6. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

## 📦 Deploy en Vercel

### Opción 1: Deploy automático

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Opción 2: CLI de Vercel

```bash
npm i -g vercel
vercel
```

### Configurar variables en Vercel

1. Ve a tu proyecto en [Vercel Dashboard](https://vercel.com)
2. Settings > Environment Variables
3. Agrega todas las variables de `.env.local`

## 🔑 Credenciales de prueba

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@eduportalprax.com | admin123 |
| Estudiante | alumno@test.com | 123456 |

## 📁 Estructura del proyecto

```
eduportal-prax/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js
│   ├── components/
│   │   ├── admin/
│   │   │   ├── Analytics.jsx
│   │   │   ├── EditCourseLessons.jsx
│   │   │   ├── ManageCourses.jsx
│   │   │   ├── ManageNews.jsx
│   │   │   ├── ManageStudents.jsx
│   │   │   └── Submissions.jsx
│   │   ├── auth/
│   │   │   └── AuthScreen.jsx
│   │   ├── courses/
│   │   │   ├── CourseCatalog.jsx
│   │   │   └── CourseDetail.jsx
│   │   ├── dashboard/
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── StudentDashboard.jsx
│   │   ├── layout/
│   │   │   ├── AnimatedBackground.jsx
│   │   │   ├── MainLayout.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── news/
│   │   │   └── NewsSection.jsx
│   │   ├── student/
│   │   │   ├── MyCourses.jsx
│   │   │   └── ProgressView.jsx
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Input.jsx
│   │       └── Modal.jsx
│   ├── context/
│   │   └── AppContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useFirestore.js
│   ├── lib/
│   │   ├── firebase.js
│   │   └── firestore.js
│   └── utils/
│       └── helpers.js
├── .env.local.example
├── next.config.js
├── package.json
├── tailwind.config.js
└── vercel.json
```

## 🎨 Paleta de colores

La aplicación usa tonalidades de violeta:

- **Primary**: `#a855f7` (violet-500)
- **Accent**: `#d946ef` (fuchsia-500)
- **Background**: `#0f172a` (slate-900)

## 🛠️ Tecnologías

- **Framework**: Next.js 14 (App Router)
- **Base de datos**: Firebase Firestore
- **Autenticación**: Firebase Auth (simplificada)
- **Estilos**: Tailwind CSS
- **Iconos**: Lucide React
- **Deploy**: Vercel

## 📝 Scripts disponibles

```bash
npm run dev      # Desarrollo local
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linter
```

## 🔧 Personalización

### Cambiar colores

Edita `tailwind.config.js`:

```javascript
colors: {
  primary: {
    500: '#tu-color',
    // ...
  }
}
```

### Agregar categorías de cursos

Las categorías son dinámicas basadas en los cursos creados.

### Agregar nuevos campos a cursos

1. Actualiza la función `createCourse` en `src/lib/firestore.js`
2. Modifica el formulario en `src/components/admin/ManageCourses.jsx`

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - ver [LICENSE](LICENSE) para detalles.

---

Hecho con 💜 para EduPortal Prax
