'use client';

import { useEffect, useRef } from 'react';

export default function FloatingKaomoji() {
  const kaomojiRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 100, y: 100 });
  const velocityRef = useRef({ x: 2, y: 2 });
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const kaomoji = kaomojiRef.current;
    if (!kaomoji) return;

    const animate = () => {
      // Calculate bounds on every frame for accuracy
      const kaomojiWidth = kaomoji.offsetWidth;
      const kaomojiHeight = kaomoji.offsetHeight;
      const maxX = document.documentElement.clientWidth - kaomojiWidth;
      const maxY = document.documentElement.clientHeight - kaomojiHeight;

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

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={kaomojiRef}
      className="holographic-kaomoji"
    >
      (˵ ͡° ͜ʖ ͡°˵)
    </div>
  );
}
