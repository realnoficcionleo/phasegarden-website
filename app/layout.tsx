import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PhaseGarden - RNF Audio',
  description: 'A swamp of voices, a broken mirror of sound',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
