'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export default function FloatingKaomoji() {
  const kaomojiRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 100, y: 100 });
  const velocityRef = useRef({ x: 1, y: 1 });
  const animationFrameRef = useRef<number>();
  const [bounds, setBounds] = useState({ width: 0, height: 0 });
  const [isMounted, setIsMounted] = useState(false);

  // Set mounted state after initial render
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Effect to set and update screen bounds
  useEffect(() => {
    const updateBounds = () => {
      setBounds({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight,
      });
    };
    updateBounds();
    window.addEventListener('resize', updateBounds);
    return () => window.removeEventListener('resize', updateBounds);
  }, []);

  // Effect for animation
  useEffect(() => {
    const kaomoji = kaomojiRef.current;
    if (!kaomoji || bounds.width === 0) return;

    const animate = () => {
      const kaomojiWidth = kaomoji.offsetWidth;
      const kaomojiHeight = kaomoji.offsetHeight;
      const maxX = bounds.width - kaomojiWidth;
      const maxY = bounds.height - kaomojiHeight;

      posRef.current.x += velocityRef.current.x;
      posRef.current.y += velocityRef.current.y;

      if (posRef.current.x <= 0 || posRef.current.x >= maxX) {
        velocityRef.current.x *= -1;
        posRef.current.x = Math.max(0, Math.min(maxX, posRef.current.x));
      }
      if (posRef.current.y <= 0 || posRef.current.y >= maxY) {
        velocityRef.current.y *= -1;
        posRef.current.y = Math.max(0, Math.min(maxY, posRef.current.y));
      }

      kaomoji.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px)`;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [bounds]);

  const kaomojiMarkup = (
    <div ref={kaomojiRef} className="holographic-kaomoji">
      (˵ ͡° ͜ʖ ͡°˵)
    </div>
  );

  if (!isMounted) {
    return null;
  }

  return createPortal(kaomojiMarkup, document.body);
}
