import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Neuro-Acoustic Analyzer',
  description: 'Visualize how music affects your brain - analyze YouTube audio for brain region activation, brainwave states, and emotional responses',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        {children}
      </body>
    </html>
  );
}
