import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';

// ==================== COLLECTIONS ====================
export const COLLECTIONS = {
  USERS: 'users',
  COURSES: 'courses',
  LESSONS: 'lessons',
  NEWS: 'news',
  SUBMISSIONS: 'submissions',
  ENROLLMENTS: 'enrollments',
};

// ==================== USER OPERATIONS ====================
export const createUser = async (userData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.USERS), {
      ...userData,
      createdAt: serverTimestamp(),
      enrolledCourses: [],
      progress: {},
    });
    return { id: docRef.id, ...userData };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const q = query(collection(db, COLLECTIONS.USERS), where('email', '==', email));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

export const updateUser = async (userId, data) => {
  try {
    const docRef = doc(db, COLLECTIONS.USERS, userId);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
    return { id: userId, ...data };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const getAllStudents = async () => {
  try {
    const q = query(collection(db, COLLECTIONS.USERS), where('role', '==', 'student'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting students:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const snapshot = await getDocs(collection(db, COLLECTIONS.USERS));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

// ==================== COURSE OPERATIONS ====================
export const createCourse = async (courseData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.COURSES), {
      ...courseData,
      createdAt: serverTimestamp(),
      enrolledStudents: 0,
      rating: 0,
      lessons: [],
    });
    return { id: docRef.id, ...courseData };
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const getAllCourses = async () => {
  try {
    const q = query(collection(db, COLLECTIONS.COURSES), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting courses:', error);
    throw error;
  }
};

export const getCourseById = async (courseId) => {
  try {
    const docRef = doc(db, COLLECTIONS.COURSES, courseId);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    console.error('Error getting course:', error);
    throw error;
  }
};

export const updateCourse = async (courseId, data) => {
  try {
    const docRef = doc(db, COLLECTIONS.COURSES, courseId);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
    return { id: courseId, ...data };
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const deleteCourse = async (courseId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.COURSES, courseId));
    return true;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// ==================== LESSON OPERATIONS ====================
export const addLessonToCourse = async (courseId, lessonData) => {
  try {
    const courseRef = doc(db, COLLECTIONS.COURSES, courseId);
    const courseSnap = await getDoc(courseRef);
    
    if (!courseSnap.exists()) throw new Error('Course not found');
    
    const course = courseSnap.data();
    const newLesson = {
      id: Date.now().toString(),
      ...lessonData,
      createdAt: new Date().toISOString(),
    };
    
    const updatedLessons = [...(course.lessons || []), newLesson];
    await updateDoc(courseRef, { lessons: updatedLessons });
    
    return newLesson;
  } catch (error) {
    console.error('Error adding lesson:', error);
    throw error;
  }
};

export const updateLesson = async (courseId, lessonId, lessonData) => {
  try {
    const courseRef = doc(db, COLLECTIONS.COURSES, courseId);
    const courseSnap = await getDoc(courseRef);
    
    if (!courseSnap.exists()) throw new Error('Course not found');
    
    const course = courseSnap.data();
    const updatedLessons = course.lessons.map(lesson =>
      lesson.id === lessonId ? { ...lesson, ...lessonData } : lesson
    );
    
    await updateDoc(courseRef, { lessons: updatedLessons });
    return { id: lessonId, ...lessonData };
  } catch (error) {
    console.error('Error updating lesson:', error);
    throw error;
  }
};

export const deleteLesson = async (courseId, lessonId) => {
  try {
    const courseRef = doc(db, COLLECTIONS.COURSES, courseId);
    const courseSnap = await getDoc(courseRef);
    
    if (!courseSnap.exists()) throw new Error('Course not found');
    
    const course = courseSnap.data();
    const updatedLessons = course.lessons.filter(lesson => lesson.id !== lessonId);
    
    await updateDoc(courseRef, { lessons: updatedLessons });
    return true;
  } catch (error) {
    console.error('Error deleting lesson:', error);
    throw error;
  }
};

// ==================== ENROLLMENT OPERATIONS ====================
export const enrollUserInCourse = async (userId, courseId) => {
  try {
    const batch = writeBatch(db);
    
    // Update user's enrolled courses
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    
    const enrolledCourses = [...(userData.enrolledCourses || []), courseId];
    const progress = { 
      ...userData.progress, 
      [courseId]: { completedLessons: [], submissions: [] } 
    };
    
    batch.update(userRef, { enrolledCourses, progress });
    
    // Update course enrolled count
    const courseRef = doc(db, COLLECTIONS.COURSES, courseId);
    const courseSnap = await getDoc(courseRef);
    const courseData = courseSnap.data();
    
    batch.update(courseRef, { 
      enrolledStudents: (courseData.enrolledStudents || 0) + 1 
    });
    
    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error enrolling user:', error);
    throw error;
  }
};

export const markLessonComplete = async (userId, courseId, lessonId) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    
    const courseProgress = userData.progress?.[courseId] || { completedLessons: [], submissions: [] };
    
    if (!courseProgress.completedLessons.includes(lessonId)) {
      courseProgress.completedLessons = [...courseProgress.completedLessons, lessonId];
    }
    
    await updateDoc(userRef, {
      progress: { ...userData.progress, [courseId]: courseProgress }
    });
    
    return true;
  } catch (error) {
    console.error('Error marking lesson complete:', error);
    throw error;
  }
};

// ==================== SUBMISSION OPERATIONS ====================
export const submitAssignment = async (userId, courseId, lessonId, fileData) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    
    const courseProgress = userData.progress?.[courseId] || { completedLessons: [], submissions: [] };
    
    const newSubmission = {
      lessonId,
      file: fileData.fileName,
      fileUrl: fileData.fileUrl || null,
      submittedAt: new Date().toISOString(),
      grade: null,
      feedback: null,
    };
    
    courseProgress.submissions = [...courseProgress.submissions, newSubmission];
    
    await updateDoc(userRef, {
      progress: { ...userData.progress, [courseId]: courseProgress }
    });
    
    return newSubmission;
  } catch (error) {
    console.error('Error submitting assignment:', error);
    throw error;
  }
};

export const gradeSubmission = async (userId, courseId, lessonId, grade, feedback) => {
  try {
    const userRef = doc(db, COLLECTIONS.USERS, userId);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.data();
    
    const courseProgress = userData.progress?.[courseId];
    
    if (courseProgress) {
      courseProgress.submissions = courseProgress.submissions.map(sub =>
        sub.lessonId === lessonId ? { ...sub, grade, feedback } : sub
      );
      
      await updateDoc(userRef, {
        progress: { ...userData.progress, [courseId]: courseProgress }
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error grading submission:', error);
    throw error;
  }
};

export const getAllSubmissions = async () => {
  try {
    const students = await getAllStudents();
    const courses = await getAllCourses();
    const allSubmissions = [];
    
    students.forEach(student => {
      Object.entries(student.progress || {}).forEach(([courseId, progress]) => {
        const course = courses.find(c => c.id === courseId);
        progress.submissions?.forEach(sub => {
          const lesson = course?.lessons?.find(l => l.id === sub.lessonId);
          allSubmissions.push({
            ...sub,
            odentId: student.id,
            studentName: student.name,
            studentAvatar: student.avatar,
            courseId,
            courseTitle: course?.title,
            lessonTitle: lesson?.title,
          });
        });
      });
    });
    
    return allSubmissions;
  } catch (error) {
    console.error('Error getting submissions:', error);
    throw error;
  }
};

// ==================== NEWS OPERATIONS ====================
export const createNews = async (newsData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.NEWS), {
      ...newsData,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, ...newsData };
  } catch (error) {
    console.error('Error creating news:', error);
    throw error;
  }
};

export const getAllNews = async () => {
  try {
    const q = query(collection(db, COLLECTIONS.NEWS), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting news:', error);
    throw error;
  }
};

export const updateNews = async (newsId, data) => {
  try {
    const docRef = doc(db, COLLECTIONS.NEWS, newsId);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
    return { id: newsId, ...data };
  } catch (error) {
    console.error('Error updating news:', error);
    throw error;
  }
};

export const deleteNews = async (newsId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.NEWS, newsId));
    return true;
  } catch (error) {
    console.error('Error deleting news:', error);
    throw error;
  }
};

// ==================== REAL-TIME LISTENERS ====================
export const subscribeToCollection = (collectionName, callback) => {
  const q = query(collection(db, collectionName), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(data);
  });
};

// ==================== SEED DATA ====================
export const seedInitialData = async () => {
  try {
    // Check if data already exists
    const coursesSnap = await getDocs(collection(db, COLLECTIONS.COURSES));
    if (!coursesSnap.empty) {
      console.log('Data already seeded');
      return;
    }

    // Seed admin user
    await addDoc(collection(db, COLLECTIONS.USERS), {
      email: 'farinamanuel.18@gmail.com',
      password: 'Prax2026',
      name: 'Administrador total',
      role: 'admin',
      avatar: '👨‍💼',
      createdAt: serverTimestamp(),
      enrolledCourses: [],
      progress: {},
    });

    // Seed director user
    await addDoc(collection(db, COLLECTIONS.USERS), {
      email: 'director@eduportalprax.com',
      password: 'director123',
      name: 'Dirección General',
      role: 'director',
      avatar: '🧑‍💼',
      createdAt: serverTimestamp(),
      enrolledCourses: [],
      progress: {},
    });

    // Seed teacher user
    await addDoc(collection(db, COLLECTIONS.USERS), {
      email: 'docente@eduportalprax.com',
      password: 'docente123',
      name: 'Docente Demo',
      role: 'teacher',
      avatar: '👩‍🏫',
      createdAt: serverTimestamp(),
      enrolledCourses: [],
      progress: {},
    });

    // Seed demo student
    await addDoc(collection(db, COLLECTIONS.USERS), {
      email: 'alumno@test.com',
      password: '123456',
      name: 'María García',
      role: 'student',
      avatar: '👩‍🎓',
      createdAt: serverTimestamp(),
      enrolledCourses: [],
      progress: {},
    });

    // Seed courses
    await addDoc(collection(db, COLLECTIONS.COURSES), {
      title: 'Control Integrado de Vectores',
      description: 'Aprende las técnicas más modernas de control de vectores urbanos y prevención de enfermedades transmitidas por mosquitos.',
      instructor: 'Dr. Roberto Sánchez',
      thumbnail: '🦟',
      category: 'Salud Pública',
      duration: '8 semanas',
      level: 'Intermedio',
      enrolledStudents: 45,
      rating: 4.8,
      createdAt: serverTimestamp(),
      lessons: [
        {
          id: '1',
          title: 'Introducción a la Vectorología',
          description: 'Conceptos fundamentales sobre vectores urbanos',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          files: [
            { name: 'Manual_Vectores.pdf', size: '2.4 MB' },
            { name: 'Presentacion_Clase1.pptx', size: '5.1 MB' }
          ],
          duration: '45 min',
          hasAssignment: false,
          messages: [
            {
              id: 'm1',
              author: 'Equipo académico',
              content: 'Bienvenidos a la primera clase. Revisen el material antes del viernes.',
              createdAt: new Date().toISOString(),
            },
          ],
        },
        {
          id: '2',
          title: 'Ciclo de Vida del Aedes aegypti',
          description: 'Estudio detallado del mosquito transmisor del dengue',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          files: [{ name: 'Ciclo_Aedes.pdf', size: '1.8 MB' }],
          duration: '60 min',
          hasAssignment: true,
          assignmentDesc: 'Realizar un informe sobre los criaderos identificados en tu zona',
          messages: [],
        },
      ],
    });

    await addDoc(collection(db, COLLECTIONS.COURSES), {
      title: 'Gestión Municipal de Residuos',
      description: 'Estrategias efectivas para la gestión integral de residuos sólidos urbanos.',
      instructor: 'Ing. Laura Méndez',
      thumbnail: '♻️',
      category: 'Medio Ambiente',
      duration: '6 semanas',
      level: 'Básico',
      enrolledStudents: 32,
      rating: 4.6,
      createdAt: serverTimestamp(),
      lessons: [
        {
          id: '1',
          title: 'Marco Legal Ambiental',
          description: 'Normativa vigente sobre gestión de residuos',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          files: [{ name: 'Normativa_2024.pdf', size: '1.5 MB' }],
          duration: '40 min',
          hasAssignment: false,
          messages: [],
        },
      ],
    });

    // Seed news
    await addDoc(collection(db, COLLECTIONS.NEWS), {
      title: '¡Bienvenidos al nuevo ciclo lectivo 2025!',
      content: 'Nos complace anunciar el inicio del ciclo de capacitaciones 2025. Este año contamos con nuevos cursos y material actualizado para todos nuestros alumnos.',
      author: 'Administración',
      date: new Date().toISOString().split('T')[0],
      important: true,
      createdAt: serverTimestamp(),
    });

    console.log('Initial data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
};
