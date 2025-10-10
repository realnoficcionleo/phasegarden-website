'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isLandingPage = pathname === '/';

  return (
    <>
      {/* Hamburger Button */}
      <button
        className="mobile-menu-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
        <span className={`hamburger-line ${isOpen ? 'open' : ''}`}></span>
      </button>

      {/* Menu Overlay */}
      {isOpen && (
        <div className="mobile-menu-overlay" onClick={() => setIsOpen(false)}>
          <nav className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
            {!isLandingPage && <Link href="/" onClick={() => setIsOpen(false)}>home</Link>}
            <Link href="/about" onClick={() => setIsOpen(false)}>about</Link>
            <Link href="/download" onClick={() => setIsOpen(false)}>downloads</Link>
          </nav>
        </div>
      )}
    </>
  );
}
