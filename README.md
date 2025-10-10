# PhaseGarden Website

A Next.js website for PhaseGarden by RNF Audio, featuring an interactive drag-video-trail effect with chromatic aberration.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd phasegarden-website
npm install
```

### 2. Add Your Assets

Place the following files in the `public/` folder:

- `landscape.mp4` - Video file for the trail effect (convert the glitchy landscape image to video or use a looping video)
- `landscape-bg.png` - Static background image (the glitchy mountain landscape)
- `sheep-landscape.png` - Bottom section background (landscape with sheep)
- `demo-video.mp4` - (Optional) Demo video for the showcase section

**Converting Image to Video:**

If you only have static images, you can convert them to video using FFmpeg:

```bash
# Create a 10-second looping video from static image
ffmpeg -loop 1 -i landscape-bg.png -c:v libx264 -t 10 -pix_fmt yuv420p -vf scale=1920:1080 public/landscape.mp4
```

Alternatively, you can modify `VideoTrailEffect.tsx` to use a static image instead of video:
- Replace the `<video>` element with an `<img>` element
- Update the canvas drawing code to use the image instead of video frames

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
phasegarden-website/
├── app/
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Main page with all sections
│   └── globals.css      # Global styles
├── components/
│   └── VideoTrailEffect.tsx  # Interactive trail effect component
├── public/
│   └── (add your assets here)
└── package.json
```

## 🎨 Features

- ✅ Interactive drag-video-trail effect with chromatic aberration
- ✅ Glitch text effects
- ✅ DotGothic16 font (loaded from Google Fonts)
- ✅ Responsive design (mobile & desktop)
- ✅ Touch support for mobile devices
- ✅ Performance optimized with object pooling
- ✅ Smooth 60fps animations
- ✅ Canvas-based rendering with WebGL-ready architecture

## 🎮 How the Trail Effect Works

1. **Drag your mouse/finger** across the hero section
2. Video frames appear as trails following your movement
3. **RGB chromatic aberration** creates the glitchy effect
4. Trails fade out smoothly with physics simulation
5. Touch and mouse events both supported

## 🔧 Customization

### Adjust Trail Parameters

Edit `components/VideoTrailEffect.tsx`:

```typescript
// Maximum number of trails
if (trailsRef.current.length > 30) { // Change 30 to your preference

// Trail fade speed
trail.life -= 0.02; // Lower = slower fade

// Trail size
const size = 150 * trail.scale; // Change 150 to adjust size

// Chromatic aberration intensity
const offset = 5 * (1 - trail.life); // Change 5 to adjust RGB split
```

### Change Colors

Edit `app/globals.css`:

```css
/* Background color */
body {
  background: #ffffff; /* Change to your color */
}

/* CTA button color */
.cta-button {
  background: #0000ff; /* Change to your color */
}
```

## 📱 Browser Support

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 🐛 Troubleshooting

**Video not loading:**
- Check that `landscape.mp4` exists in `public/` folder
- Ensure video codec is H.264 (most compatible)
- Check browser console for errors

**Trail effect not working:**
- Ensure JavaScript is enabled
- Check that canvas is supported in your browser
- Try a different browser (Chrome recommended)

**Performance issues:**
- Reduce max trails (line ~85 in VideoTrailEffect.tsx)
- Use a smaller video resolution
- Enable hardware acceleration in browser

## 📄 License

All rights reserved - RNF Audio

---

Built with Next.js 14, React 18, and Canvas API
