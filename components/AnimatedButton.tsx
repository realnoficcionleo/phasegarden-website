'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AnimatedButton() {
  const [isHovering, setIsHovering] = useState(false);

  // Preload both button images
  useEffect(() => {
    const img1 = new Image();
    const img3 = new Image();
    img1.src = '/button1.svg';
    img3.src = '/button3.svg';
  }, []);

  return (
    <Link
      href="/download"
      className="animated-button"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <img
        src={`/button${isHovering ? 3 : 1}.svg`}
        alt="Get it!"
        className="button-svg"
      />
    </Link>
  );
}
