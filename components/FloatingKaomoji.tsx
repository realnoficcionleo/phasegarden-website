'use client';

import { useEffect, useRef, useState } from 'react';

export default function FloatingKaomoji() {
  const kaomojiRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 100, y: 100 });
  const velocityRef = useRef({ x: 1, y: 1 }); // Slowed down slightly
  const animationFrameRef = useRef<number>();
  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  // Effect to set and update screen bounds
  useEffect(() => {
    const updateBounds = () => {
      setBounds({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      });
    };

    // Initial bounds
    updateBounds();

    // Update bounds on resize
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  // Effect for animation
  useEffect(() => {
    const kaomoji = kaomojiRef.current;
    if (!kaomoji || bounds.width === 0) return; // Don't animate until bounds are set

    const animate = () => {
      const kaomojiWidth = kaomoji.offsetWidth;
      const kaomojiHeight = kaomoji.offsetHeight;
      const maxX = bounds.width - kaomojiWidth;
      const maxY = bounds.height - kaomojiHeight;

      // Update position
      posRef.current.x += velocityRef.current.x;
      posRef.current.y += velocityRef.current.y;

      // Bounce off edges
      if (posRef.current.x <= 0 || posRef.current.x >= maxX) {
        velocityRef.current.x *= -1;
        posRef.current.x = Math.max(0, Math.min(maxX, posRef.current.x));
      }
      if (posRef.current.y <= 0 || posRef.current.y >= maxY) {
        velocityRef.current.y *= -1;
        posRef.current.y = Math.max(0, Math.min(maxY, posRef.current.y));
      }

      // Apply position
      kaomoji.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [bounds]); // Rerun effect if bounds change

  return (
    <div
      ref={kaomojiRef}
      className="holographic-kaomoji"
    >
      (˵ ͡° ͜ʖ ͡°˵)
    </div>
  );
}