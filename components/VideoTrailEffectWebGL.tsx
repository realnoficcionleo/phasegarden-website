'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function VideoTrailEffectWebGL() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshesRef = useRef<THREE.Mesh[]>([]);
  const textureRef = useRef<THREE.Texture | null>(null);
  const videoTextureRef = useRef<THREE.VideoTexture | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const offsetRef = useRef({ x: 0, y: 0 });
  const targetOffsetRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup - orthographic for 2D (centered coordinate system)
    const camera = new THREE.OrthographicCamera(
      -450, 450, // left, right (centered at 0)
      297.5, -297.5, // top, bottom (centered at 0, flipped)
      0.1, 1000
    );
    camera.position.z = 500;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      premultipliedAlpha: false
    });
    renderer.setSize(900, 595);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Setup video element for front layer
    const video = document.createElement('video');
    video.src = '/videotrail.mov';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';
    video.preload = 'auto';
    videoRef.current = video;

    // Wait for video to be ready before creating texture
    video.addEventListener('loadeddata', () => {
      console.log('Video loaded successfully');
    });

    video.addEventListener('error', (e) => {
      console.error('Video failed to load:', e);
    });

    // Start playing
    video.play().catch(err => console.error('Video play failed:', err));

    // Create video texture
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.needsUpdate = true;
    videoTextureRef.current = videoTexture;

    // Load static image texture for back layers
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('/videotrail-static.png', (texture) => {
      textureRef.current = texture;
      // Fix color space and format
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;

      // Image dimensions
      const imageWidth = 494;
      const imageHeight = 394;

      // Half-pipe arc positions
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

      // Create half-pipe curve with arc displacement
      const numLayers = 60;
      const startPos = basePositions[0];
      const endPos = basePositions[basePositions.length - 1];

      const meshes: THREE.Mesh[] = [];

      for (let i = 0; i < numLayers; i++) {
        const progress = i / (numLayers - 1);

        // Arc calculation
        const angle = progress * Math.PI / 2;
        const radius = 300;

        const arcCenterX = startPos.x;
        const arcCenterY = startPos.y - radius;

        const arcX = arcCenterX + radius * Math.sin(angle);
        const arcY = arcCenterY + radius * Math.cos(angle);

        const blendFactor = progress * progress;
        const x = arcX + (endPos.x - arcX) * blendFactor;
        const y = arcY + (endPos.y - arcY) * blendFactor;

        // Create plane geometry
        const geometry = new THREE.PlaneGeometry(imageWidth, imageHeight);

        // Use video texture for front layer (i=0), static image for all others
        const useVideoForFront = true; // Set to false to disable video
        const isFirstLayer = i === 0;
        const layerTexture = (isFirstLayer && useVideoForFront) ? videoTexture : texture;

        // Material with texture - NO transparency/opacity that causes blending issues
        const material = new THREE.MeshBasicMaterial({
          map: layerTexture,
          transparent: false, // Turn off transparency - causing opacity issue
          opacity: 1,
          side: THREE.FrontSide,
          depthWrite: true,
          depthTest: true
        });

        const mesh = new THREE.Mesh(geometry, material);

        // Store original position and target opacity in userData
        mesh.userData.originalX = x;
        mesh.userData.originalY = y;
        mesh.userData.targetOpacity = i === 0 ? 1 : 0.85;
        mesh.userData.layerIndex = i;
        mesh.userData.appeared = false;

        // Position - convert to centered coordinate system
        // Canvas coords (0,0) to (900,595) -> Three coords (-450,-297.5) to (450,297.5)
        mesh.position.x = x + imageWidth / 2 - 450; // Center horizontally
        mesh.position.y = 297.5 - (y + imageHeight / 2); // Center vertically and flip
        mesh.position.z = -i * 0.1; // Layer depth

        scene.add(mesh);
        meshes.push(mesh);
      }

      meshesRef.current = meshes;

      // Set start time AFTER meshes are created
      startTimeRef.current = Date.now();
    });

    // Auto-drag animation on load
    const startTimeRef = { current: 0 }; // Will be set when meshes are created
    offsetRef.current = { x: -200, y: -100 };
    setTimeout(() => {
      targetOffsetRef.current = { x: 0, y: 0 };
    }, 100);

    // Scroll handler
    let lastScrollY = 0;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const gravityMultiplier = scrollY - lastScrollY > 0 ? 0.5 : 0.15;
      targetOffsetRef.current = {
        x: -scrollY * 0.3,
        y: scrollY * gravityMultiplier
      };
      lastScrollY = scrollY;
    };
    window.addEventListener('scroll', handleScroll);

    // Animation loop
    const animate = () => {
      // Smooth interpolation
      offsetRef.current.x += (targetOffsetRef.current.x - offsetRef.current.x) * 0.15;
      offsetRef.current.y += (targetOffsetRef.current.y - offsetRef.current.y) * 0.15;

      // Calculate elapsed time for sequential appearance (only if start time is set)
      const elapsed = startTimeRef.current > 0 ? Date.now() - startTimeRef.current : 0;
      const layerDelay = 15; // 15ms delay between layers

      // Update mesh positions and opacity
      meshesRef.current.forEach((mesh) => {
        const origX = mesh.userData.originalX || 0;
        const origY = mesh.userData.originalY || 0;
        const imageWidth = 494;
        const imageHeight = 394;

        // Sequential appearance - reverse order (back to front)
        const layerIndex = mesh.userData.layerIndex || 0;
        const numLayers = meshesRef.current.length;
        const reversedIndex = numLayers - 1 - layerIndex; // Flip the order
        const layerAppearTime = reversedIndex * layerDelay;

        if (elapsed >= layerAppearTime && !mesh.userData.appeared) {
          mesh.userData.appeared = true;
        }

        // Make visible when appeared (no opacity fade to avoid transparency issues)
        if (mesh.userData.appeared) {
          mesh.visible = true;
        } else {
          mesh.visible = false;
        }

        // Apply offset to original position
        const x = origX + offsetRef.current.x;
        const y = origY + offsetRef.current.y;

        // Convert to Three.js coordinates
        mesh.position.x = x + imageWidth / 2 - 450;
        mesh.position.y = 297.5 - (y + imageHeight / 2);
      });

      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current = null;
      }
      renderer.dispose();
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="trail-canvas-container" />;
}
