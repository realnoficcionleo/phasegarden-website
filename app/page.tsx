'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import AnimatedButton from '@/components/AnimatedButton';
import FloatingKaomoji from '@/components/FloatingKaomoji';
import MobileMenu from '@/components/MobileMenu';

// WEBGL VERSION - To revert to Canvas 2D: change VideoTrailEffectWebGL back to VideoTrailEffect
const VideoTrailEffect = dynamic(() => import('@/components/VideoTrailEffectWebGL'), {
  ssr: false,
});

const ASCIIText = dynamic(() => import('@/components/ASCIIText'), { ssr: false });

export default function Home() {
  return (
    <>
      <FloatingKaomoji />
      <div className="site-wrapper landing-page">
      {/* Logo */}
      <Link href="/" className="logo">
        RNF<br />AUDIO
      </Link>

      {/* Navigation Links */}
      <nav className="landing-nav">
        <Link href="/about">about</Link>
        <Link href="/download">downloads</Link>
      </nav>

      {/* Mobile Menu */}
      <MobileMenu />

      {/* Decorative Stars */}
      <div className="landing-stars">
        *<br />
        *<br />
        *<br />
        *<br />
        *<br />
        *
      </div>

      {/* Hero Section */}
      <section className="hero">
        {/* Stacked Images with Trail Effect - Right side */}
        <div className="stacked-images-container">
          <VideoTrailEffect />
        </div>

        {/* Title with ASCII effect */}
        <div className="hero-title-container">
          <ASCIIText
            text="PhaseGarden"
            asciiFontSize={4}
            textFontSize={60}
            textColor="#fdf9f3"
            planeBaseHeight={10}
            enableWaves={true}
          />
        </div>

        {/* Mobile Video - positioned after title */}
        <div className="mobile-hero-video">
          <div className="video-scribble-container">
            <span className="scribble scribble-top-left">*</span>
            <span className="scribble scribble-top-right">*</span>
            <video
              className="mobile-video"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/videotrail.mov" type="video/mp4" />
            </video>
            <span className="scribble scribble-bottom-left">*</span>
            <span className="scribble scribble-bottom-right">*</span>
          </div>
        </div>

        {/* Hero Content - Left side */}
        <div className="hero-content">
          <p className="hero-description hero-description-desktop">
            PhaseGarden isn't just a chorus. It's a swamp of voices, a broken mirror of sound, a garden where every petal is detuned and dripping static. It's grime and silk at the same time. Imagine a cassette tape melting in the sun while a choir of robots drowns in it.
          </p>
          <p className="hero-description hero-description-mobile" style={{color: '#ffffff'}}>
            <mark>PhaseGarden isn't just a chorus. It's a swamp of voices, a broken mirror of sound, a garden where every petal is detuned and dripping static. It's grime and silk at the same time. Imagine a cassette tape melting in the sun while a choir of robots drowns in it.</mark>
          </p>

          <AnimatedButton />
        </div>
      </section>

      {/* Section 1 - Video and Features */}
      <section className="section-1">
        <div className="section-content">
          <pre className="ascii-title">{`              _____                    _____                    _____                    _____                    _____                _____                    _____
             /\\    \\                  /\\    \\                  /\\    \\                  /\\    \\                  /\\    \\              /\\    \\                  /\\    \\
            /::\\    \\                /::\\    \\                /::\\    \\                /::\\    \\                /::\\    \\            /::\\    \\                /::\\    \\
           /::::\\    \\              /::::\\    \\              /::::\\    \\              /::::\\    \\              /::::\\    \\           \\:::\\    \\              /::::\\    \\
          /::::::\\    \\            /::::::\\    \\            /::::::\\    \\            /::::::\\    \\            /::::::\\    \\           \\:::\\    \\            /::::::\\    \\
         /:::/\\:::\\    \\          /:::/\\:::\\    \\          /:::/\\:::\\    \\          /:::/\\:::\\    \\          /:::/\\:::\\    \\           \\:::\\    \\          /:::/\\:::\\    \\
        /:::/__\\:::\\    \\        /:::/__\\:::\\    \\        /:::/__\\:::\\    \\        /:::/__\\:::\\    \\        /:::/__\\:::\\    \\           \\:::\\    \\        /:::/__\\:::\\    \\
       /::::\\   \\:::\\    \\      /::::\\   \\:::\\    \\      /::::\\   \\:::\\    \\       \\:::\\   \\:::\\    \\      /::::\\   \\:::\\    \\          /::::\\    \\       \\:::\\   \\:::\\    \\
      /::::::\\   \\:::\\    \\    /::::::\\   \\:::\\    \\    /::::::\\   \\:::\\    \\    ___\\:::\\   \\:::\\    \\    /::::::\\   \\:::\\    \\        /::::::\\    \\    ___\\:::\\   \\:::\\    \\
     /:::/\\:::\\   \\:::\\____\\  /:::/\\:::\\   \\:::\\____\\  /:::/\\:::\\   \\:::\\    \\  /\\   \\:::\\   \\:::\\    \\  /:::/\\:::\\   \\:::\\    \\      /:::/\\:::\\    \\  /\\   \\:::\\   \\:::\\    \\
    /:::/  \\:::\\   \\:::|    |/:::/  \\:::\\   \\:::|    |/:::/__\\:::\\   \\:::\\____\\/::\\   \\:::\\   \\:::\\____\\/:::/__\\:::\\   \\:::\\____\\    /:::/  \\:::\\____\\/::\\   \\:::\\   \\:::\\____\\
    \\::/    \\:::\\  /:::|____|\\::/   |::::\\  /:::|____|\\:::\\   \\:::\\   \\::/    /\\:::\\   \\:::\\   \\::/    /\\:::\\   \\:::\\   \\::/    /   /:::/    \\::/    /\\:::\\   \\:::\\   \\::/    /
     \\/_____/\\:::\\/:::/    /  \\/____|::::::\\/:::/    /  \\:::\\   \\:::\\   \\/____/  \\:::\\   \\:::\\   \\/____/  \\:::\\   \\:::\\   \\/____/   /:::/    / \\/____/  \\:::\\   \\:::\\   \\/____/
              \\::::::/    /         |:::::::::/    /    \\:::\\   \\:::\\    \\       \\:::\\   \\:::\\    \\       \\:::\\   \\:::\\    \\      /:::/    /            \\:::\\   \\:::\\    \\
               \\::::/    /          |::|\\::::/    /      \\:::\\   \\:::\\____\\       \\:::\\   \\:::\\____\\       \\:::\\   \\:::\\____\\    /:::/    /              \\:::\\   \\:::\\____\\
                \\::/____/           |::| \\::/____/        \\:::\\   \\::/    /        \\:::\\  /:::/    /        \\:::\\   \\::/    /    \\::/    /                \\:::\\  /:::/    /
                 ~~                 |::|  ~|               \\:::\\   \\/____/          \\:::\\/:::/    /          \\:::\\   \\/____/      \\/____/                  \\:::\\/:::/    /
                                    |::|   |                \\:::\\    \\               \\::::::/    /            \\:::\\    \\                                    \\::::::/    /
                                    \\::|   |                 \\:::\\____\\               \\::::/    /              \\:::\\____\\                                    \\::::/    /
                                     \\:|   |                  \\::/    /                \\::/    /                \\::/    /                                     \\::/    /
                                      \\|___|                   \\/____/                  \\/____/                  \\/____/                                       \\/____/`}</pre>
          <div className="video-features-row">
            {/* Video */}
            <div className="video-container">
              <iframe
                src="https://www.youtube.com/embed/gWleJjUrYIU"
                title="PhaseGarden Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>

            {/* Features List */}
            <div className="features-list">
              <div className="feature-item">// A Constellation of Six Voices &lt;/]</div>
              <div className="feature-item">// Granular Clouds &amp; Tape Melt &lt;/]</div>
              <div className="feature-item">// Zero-Latency, Real-Time Mangling &lt;/]</div>
            </div>
          </div>

          {/* Second CTA Button */}
          <AnimatedButton />
        </div>
      </section>


      {/* Section 3 - Mobile Presets */}
      <section className="section-3">
        <div className="section-content">
          <pre className="ascii-title">{`              _____                    _____                    _____                    _____                    _____                _____                    _____
             /\\    \\                  /\\    \\                  /\\    \\                  /\\    \\                  /\\    \\              /\\    \\                  /\\    \\
            /::\\    \\                /::\\    \\                /::\\    \\                /::\\    \\                /::\\    \\            /::\\    \\                /::\\    \\
           /::::\\    \\              /::::\\    \\              /::::\\    \\              /::::\\    \\              /::::\\    \\           \\:::\\    \\              /::::\\    \\
          /::::::\\    \\            /::::::\\    \\            /::::::\\    \\            /::::::\\    \\            /::::::\\    \\           \\:::\\    \\            /::::::\\    \\
         /:::/\\:::\\    \\          /:::/\\:::\\    \\          /:::/\\:::\\    \\          /:::/\\:::\\    \\          /:::/\\:::\\    \\           \\:::\\    \\          /:::/\\:::\\    \\
        /:::/__\\:::\\    \\        /:::/__\\:::\\    \\        /:::/__\\:::\\    \\        /:::/__\\:::\\    \\        /:::/__\\:::\\    \\           \\:::\\    \\        /:::/__\\:::\\    \\
       /::::\\   \\:::\\    \\      /::::\\   \\:::\\    \\      /::::\\   \\:::\\    \\       \\:::\\   \\:::\\    \\      /::::\\   \\:::\\    \\          /::::\\    \\       \\:::\\   \\:::\\    \\
      /::::::\\   \\:::\\    \\    /::::::\\   \\:::\\    \\    /::::::\\   \\:::\\    \\    ___\\:::\\   \\:::\\    \\    /::::::\\   \\:::\\    \\        /::::::\\    \\    ___\\:::\\   \\:::\\    \\
     /:::/\\:::\\   \\:::\\____\\  /:::/\\:::\\   \\:::\\____\\  /:::/\\:::\\   \\:::\\    \\  /\\   \\:::\\   \\:::\\    \\  /:::/\\:::\\   \\:::\\    \\      /:::/\\:::\\    \\  /\\   \\:::\\   \\:::\\    \\
    /:::/  \\:::\\   \\:::|    |/:::/  \\:::\\   \\:::|    |/:::/__\\:::\\   \\:::\\____\\/::\\   \\:::\\   \\:::\\____\\/:::/__\\:::\\   \\:::\\____\\    /:::/  \\:::\\____\\/::\\   \\:::\\   \\:::\\____\\
    \\::/    \\:::\\  /:::|____|\\::/   |::::\\  /:::|____|\\:::\\   \\:::\\   \\::/    /\\:::\\   \\:::\\   \\::/    /\\:::\\   \\:::\\   \\::/    /   /:::/    \\::/    /\\:::\\   \\:::\\   \\::/    /
     \\/_____/\\:::\\/:::/    /  \\/____|::::::\\/:::/    /  \\:::\\   \\:::\\   \\/____/  \\:::\\   \\:::\\   \\/____/  \\:::\\   \\:::\\   \\/____/   /:::/    / \\/____/  \\:::\\   \\:::\\   \\/____/
              \\::::::/    /         |:::::::::/    /    \\:::\\   \\:::\\    \\       \\:::\\   \\:::\\    \\       \\:::\\   \\:::\\    \\      /:::/    /            \\:::\\   \\:::\\    \\
               \\::::/    /          |::|\\::::/    /      \\:::\\   \\:::\\____\\       \\:::\\   \\:::\\____\\       \\:::\\   \\:::\\____\\    /:::/    /              \\:::\\   \\:::\\____\\
                \\::/____/           |::| \\::/____/        \\:::\\   \\::/    /        \\:::\\  /:::/    /        \\:::\\   \\::/    /    \\::/    /                \\:::\\  /:::/    /
                 ~~                 |::|  ~|               \\:::\\   \\/____/          \\:::\\/:::/    /          \\:::\\   \\/____/      \\/____/                  \\:::\\/:::/    /
                                    |::|   |                \\:::\\    \\               \\::::::/    /            \\:::\\    \\                                    \\::::::/    /
                                    \\::|   |                 \\:::\\____\\               \\::::/    /              \\:::\\____\\                                    \\::::/    /
                                     \\:|   |                  \\::/    /                \\::/    /                \\::/    /                                     \\::/    /
                                      \\|___|                   \\/____/                  \\/____/                  \\/____/                                       \\/____/`}</pre>

          {/* Video */}
          <div className="video-container">
            <iframe
              src="https://www.youtube.com/embed/gWleJjUrYIU"
              title="PhaseGarden Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Features List */}
          <div className="features-list">
            <div className="feature-item">// 6 voices &lt;/]</div>
            <div className="feature-item">// unique chorus engine&lt;/]</div>
            <div className="feature-item">// 4 oscillators &lt;/]</div>
            <div className="feature-item">[/&gt; dripping static&lt;/]</div>
            <div className="feature-item">[/&gt; slime and silk &lt;/]</div>
          </div>

          {/* CTA Button */}
          <AnimatedButton />
        </div>
      </section>

      {/* Decorative vertical lines */}
      <div className="decor-vertical">
        {[...Array(200)].map((_, i) => (
          <div key={i} className="decor-line"></div>
        ))}
      </div>
    </div>

    {/* Footer */}
    <footer className="landing-footer">
      <span>© RNF 2025 • <a href="https://instagram.com/rnf_audio" target="_blank" rel="noopener noreferrer">@rnf_audio</a></span>
    </footer>
    </>
  );
}
