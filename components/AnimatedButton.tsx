'use client';

import { useState, useEffect } from 'react';

// Set to false to enable checkout, true to disable
const COMING_SOON_MODE = true;

export default function AnimatedButton() {
  const [isHovering, setIsHovering] = useState(false);

  // Preload both button images
  useEffect(() => {
    const img1 = new Image();
    const img3 = new Image();
    img1.src = '/button1.svg';
    img3.src = '/button3.svg';
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (COMING_SOON_MODE) {
      e.preventDefault();
      // Do nothing - button is disabled for now
      // When ready to launch, just change COMING_SOON_MODE to false
    }
  };

  return (
    <a
      href={COMING_SOON_MODE ? "#" : "/download"}
      className="animated-button"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={handleClick}
      style={{ cursor: COMING_SOON_MODE ? 'default' : 'pointer' }}
    >
      <img
        src={`/button${isHovering ? 3 : 1}.svg`}
        alt="Get it!"
        className="button-svg"
      />
    </a>
  );
}
