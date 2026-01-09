import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'EduPortal Prax - Plataforma de Capacitaciones',
  description: 'Plataforma de capacitaciones educativas con gestión de cursos, entregas de tareas y seguimiento de progreso.',
  keywords: 'educación, capacitaciones, cursos online, aprendizaje',
  authors: [{ name: 'EduPortal Prax' }],
  openGraph: {
    title: 'EduPortal Prax',
    description: 'Plataforma de capacitaciones educativas',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
