import type { Metadata } from 'next';
import './globals.css';
import AiChat from '@/components/AiChat';

export const metadata: Metadata = {
  title: 'Qestra — Event Planner',
  description: 'Organisez vos événements de A à Z avec Qestra',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        {children}
        <AiChat />
      </body>
    </html>
  );
}
