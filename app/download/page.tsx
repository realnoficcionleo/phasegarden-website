'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FloatingKaomoji from '@/components/FloatingKaomoji';
import MobileMenu from '@/components/MobileMenu';

export default function DownloadPage() {
  const [isHovering, setIsHovering] = useState(false);

  // Preload button images
  useEffect(() => {
    const img1 = new Image();
    const img2 = new Image();
    img1.src = '/purchase1.svg';
    img2.src = '/purchase2.svg';
  }, []);

  return (
    <>
      <FloatingKaomoji />
      <div className="download-page">
        {/* Header */}
        <header className="download-header">
          <Link href="/" className="download-logo">
            RNF<br />AUDIO
          </Link>
          <nav className="download-nav">
            <Link href="/">home</Link>
            <Link href="/about">about</Link>
            <Link href="/download">downloads</Link>
          </nav>
          <MobileMenu />
        </header>

        {/* Main Content */}
        <main className="download-main">
          <div className="download-container">
            {/* Title */}
            <h1 className="download-title">PhaseGarden</h1>

            {/* Info line */}
            <p className="download-info-line">
              VST3 • AU • AAX • macOS 10.13+ • Windows 10+
            </p>

            {/* Main CTA - Purchase */}
            <div className="purchase-section-main">
              <div className="price-display">
                <span className="price-original">$20</span>
                <span className="price-current">$12</span>
              </div>
              <Link
                href="/checkout"
                className="purchase-btn-main"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                <img
                  src={isHovering ? '/purchase2.svg' : '/purchase1.svg'}
                  alt="Purchase"
                  className="button-svg"
                />
              </Link>
            </div>

            {/* Download Section */}
            <div className="download-section-secondary">
              <p className="download-subtitle">Or try the 10-day demo</p>
              <div className="download-buttons">
                <button className="download-btn">Mac</button>
                <button className="download-btn">Windows</button>
              </div>
            </div>

            {/* Footer links */}
            <div className="download-links">
              <a href="#">User Manual</a>
              <span>•</span>
              <a href="#">Newsletter</a>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="download-footer">
          <span>© RNF 2025 • <a href="https://instagram.com/rnf_audio" target="_blank" rel="noopener noreferrer">@rnf_audio</a> • <a href="mailto:leonardo@rnfaudio.com">contact</a></span>
        </footer>
      </div>
    </>
  );
}
