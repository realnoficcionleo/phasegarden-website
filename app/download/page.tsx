'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import FloatingKaomoji from '@/components/FloatingKaomoji';
import MobileMenu from '@/components/MobileMenu';

// Set to false to enable checkout, true to disable
const COMING_SOON_MODE = false;

export default function DownloadPage() {
  const [isHovering, setIsHovering] = useState(false);

  // Preload button images
  useEffect(() => {
    const img1 = new Image();
    const img2 = new Image();
    img1.src = '/purchase1.svg';
    img2.src = '/purchase2.svg';
  }, []);

  const handlePurchaseClick = (e: React.MouseEvent) => {
    if (COMING_SOON_MODE) {
      e.preventDefault();
      // Disabled until launch
    }
  };

  const handleDemoClick = (e: React.MouseEvent) => {
    if (COMING_SOON_MODE) {
      e.preventDefault();
      // Disabled until launch
    }
  };

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
              VST3 • AU • macOS 10.13+
            </p>

            {/* Main CTA - Purchase */}
            <div className="purchase-section-main">
              <div className="price-display">
                <span className="price-original">$20</span>
                <span className="price-current">$12</span>
              </div>
              <a
                href={COMING_SOON_MODE ? "#" : "/checkout"}
                className="purchase-btn-main"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
                onClick={handlePurchaseClick}
                style={{ cursor: COMING_SOON_MODE ? 'default' : 'pointer' }}
              >
                <img
                  src={isHovering ? '/purchase2.svg' : '/purchase1.svg'}
                  alt="Purchase"
                  className="button-svg"
                />
              </a>
            </div>

            {/* Download Section */}
            <div className="download-section-secondary">
              <p className="download-subtitle">Or try the 10-day demo</p>
              <div className="download-buttons">
                <a
                  href="/PhaseGarden_v1.0_Installer.pkg"
                  download
                  className="download-btn"
                  style={{ textDecoration: 'none', display: 'inline-block' }}
                >
                  Mac
                </a>
                <button
                  className="download-btn"
                  style={{ opacity: 0.5, cursor: 'not-allowed' }}
                  disabled
                >
                  Windows (soon)
                </button>
              </div>
            </div>

            {/* Footer links */}
            <div className="download-links">
              <a href="https://ig.me/m/rnfaudio" target="_blank" rel="noopener noreferrer">Support</a>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="download-footer">
          <span>© RNF 2025 • <a href="https://instagram.com/rnfaudio" target="_blank" rel="noopener noreferrer">@rnfaudio</a></span>
        </footer>
      </div>
    </>
  );
}
