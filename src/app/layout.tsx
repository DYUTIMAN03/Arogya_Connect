import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ArogyaConnect — Teleconsultation Queue & Triage System',
  description: 'Intelligent, offline-first triage and queue management for rural Indian Primary Health Centres.',
  manifest: '/manifest.json',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
