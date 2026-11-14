import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Madarat · Atomic Lesson',
  description: 'Beginner-first interactive Arabic lesson for atomic orbitals and quantum numbers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
