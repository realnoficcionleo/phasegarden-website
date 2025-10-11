'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import FloatingKaomoji from '@/components/FloatingKaomoji';
import MobileMenu from '@/components/MobileMenu';

const ASCIIText = dynamic(() => import('@/components/ASCIIText'), { ssr: false });

export default function AboutPage() {
  return (
    <>
      <FloatingKaomoji />
      <div className="about-page">
        {/* Header */}
        <header className="about-header">
          <Link href="/" className="about-logo">
            RNF<br />AUDIO
          </Link>
          <nav className="about-nav">
            <Link href="/">home</Link>
            <Link href="/about">about</Link>
            <Link href="/download">downloads</Link>
          </nav>
          <MobileMenu />
        </header>

        {/* Main Content */}
        <main className="about-main">
          <div className="about-container">
            {/* ASCII Title */}
            <div className="about-ascii-wrapper">
              <ASCIIText
                text="About"
                asciiFontSize={10}
                textFontSize={250}
                textColor="#fdf9f3"
                planeBaseHeight={10}
                enableWaves={true}
              />
            </div>

            <div className="about-text-content">
              <p className="about-text">
                Hey, I'm Leonardo Stroka, an experimental plugin dev and musician.
              </p>

              <p className="about-text">
                Follow <a href="https://instagram.com/rnf_audio" target="_blank" rel="noopener noreferrer">@rnf_audio</a> if you want to test new sounds before anyone else.
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="about-footer">
          <span>© RNF 2025 • <a href="https://instagram.com/rnf_audio" target="_blank" rel="noopener noreferrer">@rnf_audio</a></span>
        </footer>
      </div>
    </>
  );
}
