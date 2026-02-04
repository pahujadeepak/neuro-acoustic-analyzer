import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Neuro-Acoustic Analyzer',
  description: 'See how music moves through your brain - analyze YouTube audio for brain region activation, brainwave states, and emotional responses',
  keywords: ['music', 'brain', 'neuroscience', 'analysis', 'emotions', 'brainwaves'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen antialiased">
        <div className="flex flex-col min-h-screen">
          <header className="border-b border-gray-800">
            <div className="container mx-auto px-4 py-4">
              <a href="/" className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                🧠 Neuro-Acoustic Analyzer
              </a>
            </div>
          </header>

          <main className="flex-1">
            {children}
          </main>

          <footer className="border-t border-gray-800 py-4">
            <div className="container mx-auto px-4 text-center text-sm text-gray-500">
              <p>For educational purposes only. Brain predictions based on audio feature analysis.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
