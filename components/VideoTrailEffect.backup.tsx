'use client';

import { useEffect, useRef } from 'react';

interface Trail {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  scale: number;
  rotation: number;
  life: number;
}

export default function VideoTrailEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const staticImageRef = useRef<HTMLImageElement>(null);
  const trailsRef = useRef<Trail[]>([]);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const animationFrameRef = useRef<number>();
  const offsetRef = useRef({ x: 0, y: 0 });
  const targetOffsetRef = useRef({ x: 0, y: 0 });
  const hasInitializedRef = useRef(false);
  const startTimeRef = useRef<number>(0);
  const isMovingRef = useRef(false);
  const lastOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const staticImg = staticImageRef.current;
    if (!canvas || !staticImg) return;

    const ctx = canvas.getContext('2d', {
      willReadFrequently: true,
      alpha: true
    });
    if (!ctx) return;

    // High quality rendering settings
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Set canvas size with device pixel ratio for high quality
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = 900 * dpr;
      canvas.height = 595 * dpr;
      canvas.style.width = '900px';
      canvas.style.height = '595px';
      ctx.scale(dpr, dpr);

      // Reapply quality settings after resize
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    };
    resizeCanvas();

    // No video loading needed - using static images only

    // Auto-drag on page load - start dragged backward
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      startTimeRef.current = Date.now();
      offsetRef.current = { x: -200, y: -100 };
      // Animate to final position
      setTimeout(() => {
        targetOffsetRef.current = { x: 0, y: 0 };
      }, 100);
    }

    // Scroll handler with gravity effect - pulls waterfall down when scrolling down
    let lastScrollY = 0;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const scrollDelta = scrollY - lastScrollY;
      const heroHeight = 689; // Section 1 starts after hero

      // Gravity effect: when scrolling down, pull waterfall down more (positive y)
      // When scrolling up, pull back up
      const gravityMultiplier = scrollDelta > 0 ? 0.5 : 0.15; // stronger pull down
      targetOffsetRef.current = {
        x: -scrollY * 0.3,
        y: scrollY * gravityMultiplier  // positive y = down (gravity)
      };

      // No need to track scroll copies - trail created by canvas fade
      lastScrollY = scrollY;
    };

    window.addEventListener('scroll', handleScroll);

    // Mouse/Touch handlers - disabled
    // const handleStart = (e: MouseEvent | TouchEvent) => {
    //   isDraggingRef.current = true;
    //   const pos = getPosition(e);
    //   lastPosRef.current = pos;
    // };

    // const handleMove = (e: MouseEvent | TouchEvent) => {
    //   if (!isDraggingRef.current) return;

    //   const pos = getPosition(e);
    //   const dx = pos.x - lastPosRef.current.x;
    //   const dy = pos.y - lastPosRef.current.y;

    //   // Create trail
    //   trailsRef.current.push({
    //     x: pos.x,
    //     y: pos.y,
    //     vx: dx * 0.5,
    //     vy: dy * 0.5,
    //     alpha: 1,
    //     scale: 1,
    //     rotation: Math.atan2(dy, dx),
    //     life: 1,
    //   });

    //   // Limit trails
    //   if (trailsRef.current.length > 30) {
    //     trailsRef.current.shift();
    //   }

    //   lastPosRef.current = pos;
    // };

    // const handleEnd = () => {
    //   isDraggingRef.current = false;
    // };

    // const getPosition = (e: MouseEvent | TouchEvent): { x: number; y: number } => {
    //   const rect = canvas.getBoundingClientRect();
    //   if (e instanceof MouseEvent) {
    //     return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    //   } else {
    //     const touch = e.touches[0];
    //     return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    //   }
    // };

    // canvas.addEventListener('mousedown', handleStart);
    // canvas.addEventListener('mousemove', handleMove);
    // canvas.addEventListener('mouseup', handleEnd);
    // canvas.addEventListener('touchstart', handleStart);
    // canvas.addEventListener('touchmove', handleMove);
    // canvas.addEventListener('touchend', handleEnd);

    // Animation loop - all 35 layers with waterfall cascade
    const animate = () => {
      // Clear canvas for crisp rendering
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Smooth interpolation for offset
      offsetRef.current.x += (targetOffsetRef.current.x - offsetRef.current.x) * 0.15;
      offsetRef.current.y += (targetOffsetRef.current.y - offsetRef.current.y) * 0.15;

      // Check if moving
      const deltaX = Math.abs(offsetRef.current.x - lastOffsetRef.current.x);
      const deltaY = Math.abs(offsetRef.current.y - lastOffsetRef.current.y);
      isMovingRef.current = deltaX > 0.5 || deltaY > 0.5;
      lastOffsetRef.current = { ...offsetRef.current };

      // Calculate elapsed time for sequential appearance
      const elapsed = Date.now() - startTimeRef.current;
      const layerDelay = 15; // 15ms delay between each layer - faster, laggy feel

      // Draw all 35 layers with static image for waterfall cascade
      if (staticImg.complete && staticImg.naturalWidth > 0) {
        // Image dimensions according to Figma
        const imageWidth = 494;
        const imageHeight = 394;

        // Half-pipe arc positions - extending to top right corner
        // Canvas is 900px wide, image is 494px, so far right = 900 - 494 = 406
        const basePositions = [
          { x: 0, y: 200.96 },
          { x: 27, y: 189.24 },
          { x: 64, y: 180.96 },
          { x: 94, y: 170.96 },
          { x: 113, y: 160.96 },
          { x: 127, y: 150.96 },
          { x: 136, y: 140.96 },
          { x: 147, y: 130.96 },
          { x: 160, y: 120.96 },
          { x: 173, y: 110.96 },
          { x: 186, y: 100.96 },
          { x: 195, y: 90.96 },
          { x: 204, y: 80.96 },
          { x: 215.71, y: 70.49 },
          { x: 228, y: 60.96 },
          { x: 235, y: 50.96 },
          { x: 241, y: 40.96 },
          { x: 250, y: 30.96 },
          { x: 260, y: 20.96 },
          { x: 265, y: 10.96 },
          { x: 274, y: 0.96 },
          // Extend to top right corner with more layers
          { x: 280, y: -5 },
          { x: 290, y: -12 },
          { x: 300, y: -20 },
          { x: 310, y: -28 },
          { x: 320, y: -36 },
          { x: 330, y: -44 },
          { x: 340, y: -52 },
          { x: 350, y: -60 },
          { x: 360, y: -68 },
          { x: 370, y: -76 },
          { x: 380, y: -84 },
          { x: 390, y: -92 },
          { x: 400, y: -100 },
          { x: 406, y: -106 }
        ];

        // PERFORMANCE OPTIMIZATION - Easy to revert
        // To revert: change numLayers back to 60
        const PERFORMANCE_MODE = false;
        const numLayers = PERFORMANCE_MODE ? 40 : 60; // Reduced from 60 to 40

        // Create half-pipe curve with arc displacement
        const positions = [];

        const startPos = basePositions[0]; // Front: (0, 200.96)
        const endPos = basePositions[basePositions.length - 1]; // Back: (406, -106)

        for (let i = 0; i < numLayers; i++) {
          const progress = i / (numLayers - 1);

          // Arc angle: 0° (front) to 90° (back) for half-pipe drop
          const angle = progress * Math.PI / 2; // 0 to 90 degrees

          // Arc radius
          const radius = 300;

          // Calculate arc path
          // Arc center positioned so front is at startPos and back curves up to endPos
          const arcCenterX = startPos.x;
          const arcCenterY = startPos.y - radius;

          // Position on the arc
          const arcX = arcCenterX + radius * Math.sin(angle);
          const arcY = arcCenterY + radius * Math.cos(angle);

          // Blend with target end position to reach the exact corner
          const blendFactor = progress * progress; // Quadratic blend
          const x = arcX + (endPos.x - arcX) * blendFactor;
          const y = arcY + (endPos.y - arcY) * blendFactor;

          positions.push({ x, y });
        }

        const layers = positions.length;

        // Draw layers back to front
        for (let i = layers - 1; i >= 0; i--) {
          // Sequential appearance based on elapsed time
          const layerAppearTime = i * layerDelay;
          if (elapsed < layerAppearTime) continue;

          const pos = positions[i];
          const layerProgress = i / (layers - 1); // 0 (front) to 1 (back)

          // PERFORMANCE OPTIMIZATION - Progressive scaling and opacity
          // To revert: remove scale calculation and set alpha = i === 0 ? 1 : 0.85
          const scale = PERFORMANCE_MODE
            ? 1.0 - (layerProgress * 0.3) // Front: 100%, Back: 70%
            : 1.0; // Original: all 100%

          const alpha = PERFORMANCE_MODE
            ? 1.0 // Keep all opaque for now
            : (i === 0 ? 1 : 0.85); // Original opacity

          const scaledWidth = imageWidth * scale;
          const scaledHeight = imageHeight * scale;

          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.drawImage(
            staticImg,
            pos.x + offsetRef.current.x,
            pos.y + offsetRef.current.y,
            scaledWidth,
            scaledHeight
          );
          ctx.restore();
        }
      }

      // Trails disabled - no interactive drag effect
      // trailsRef.current = trailsRef.current.filter((trail) => {
      //   // Physics
      //   trail.x += trail.vx;
      //   trail.y += trail.vy;
      //   trail.vx *= 0.95;
      //   trail.vy *= 0.95;
      //   trail.life -= 0.02;
      //   trail.alpha = trail.life;
      //   trail.scale = 0.8 + trail.life * 0.2;

      //   if (trail.life <= 0) return false;

      //   // Draw with chromatic aberration (RGB split)
      //   const size = 150 * trail.scale;
      //   const offset = 5 * (1 - trail.life);

      //   if (video.readyState >= 2) {
      //     ctx.save();
      //     ctx.translate(trail.x, trail.y);
      //     ctx.rotate(trail.rotation);
      //     ctx.globalAlpha = trail.alpha * 0.8;

      //     // Red channel
      //     ctx.globalCompositeOperation = 'source-over';
      //     ctx.filter = 'hue-rotate(0deg) saturate(150%) brightness(1.1)';
      //     ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight,
      //       -size / 2 - offset, -size / 2, size, size);

      //     // Green channel
      //     ctx.globalCompositeOperation = 'screen';
      //     ctx.filter = 'hue-rotate(120deg) saturate(150%) brightness(1.1)';
      //     ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight,
      //       -size / 2, -size / 2, size, size);

      //     // Blue channel
      //     ctx.filter = 'hue-rotate(240deg) saturate(150%) brightness(1.1)';
      //     ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight,
      //       -size / 2 + offset, -size / 2, size, size);

      //     ctx.restore();
      //   }

      //   return true;
      // });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      // canvas.removeEventListener('mousedown', handleStart);
      // canvas.removeEventListener('mousemove', handleMove);
      // canvas.removeEventListener('mouseup', handleEnd);
      // canvas.removeEventListener('touchstart', handleStart);
      // canvas.removeEventListener('touchmove', handleMove);
      // canvas.removeEventListener('touchend', handleEnd);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Static image for all layers with VHS glitch effect on front layer */}
      <img
        ref={staticImageRef}
        src="/videotrail-static.png"
        alt=""
        style={{ display: 'none' }}
      />
      <canvas ref={canvasRef} className="trail-canvas" />
    </>
  );
}
