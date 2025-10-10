# Asset Setup Guide

## Required Assets

You need to add the following files to the `public/` folder:

### 1. **landscape.mp4** (Video for trail effect)
- The glitchy mountain landscape video
- Recommended: 1920x1080 or 1280x720
- Format: MP4 (H.264 codec)
- Duration: 5-10 seconds looping

### 2. **landscape-bg.png** (Static background)
- The glitchy mountain landscape image
- Used as background and video poster
- Recommended: 1920x1080 or higher

### 3. **sheep-landscape.png** (Bottom section)
- Landscape with sheep image
- Used in the bottom section
- Recommended: 1920x1080 or higher

### 4. **demo-video.mp4** (Optional)
- Demo/showcase video
- Format: MP4 (H.264 codec)
- Recommended: 1920x1080, 16:9 aspect ratio

## Quick Setup

The images you shared via chat need to be saved to the public folder:

```bash
# From the project root
cd phasegarden-website/public

# Save your landscape image here as landscape-bg.png
# Save your sheep landscape as sheep-landscape.png
```

## Converting Static Image to Video

If you only have a static landscape image, you can create a looping video:

### Option 1: Using FFmpeg (Recommended)

```bash
# Install FFmpeg if you don't have it
# macOS: brew install ffmpeg
# Windows: Download from ffmpeg.org
# Linux: sudo apt install ffmpeg

# Create looping video from image
ffmpeg -loop 1 -i landscape-bg.png -c:v libx264 -t 10 -pix_fmt yuv420p -vf scale=1920:1080 public/landscape.mp4
```

### Option 2: Use Static Image Instead

Modify `components/VideoTrailEffect.tsx` to use an image:

1. Replace the `<video>` element with:
```tsx
<img
  ref={imageRef}
  src="/landscape-bg.png"
  alt="Landscape"
  style={{ display: 'none' }}
/>
```

2. Update the ref type:
```tsx
const imageRef = useRef<HTMLImageElement>(null);
```

3. Update the animate function to use `imageRef.current` instead of `videoRef.current`

### Option 3: Use Animated Background

Create a subtle animated version using CSS:
```css
.video-trail-container {
  background: url('/landscape-bg.png') center/cover no-repeat;
  animation: subtle-drift 30s infinite alternate;
}

@keyframes subtle-drift {
  0% { background-position: center center; }
  100% { background-position: 48% 52%; }
}
```

## File Locations

After setup, your `public/` folder should look like:

```
public/
├── landscape.mp4          ✅ Trail effect video
├── landscape-bg.png       ✅ Static background
├── sheep-landscape.png    ✅ Bottom section
└── demo-video.mp4         ⚠️  Optional showcase video
```

## Optimizing Assets

### Images
- Use WebP format for better compression
- Optimize with tools like TinyPNG or ImageOptim
- Recommended max size: 2MB per image

### Videos
- Compress with HandBrake or FFmpeg
- Use H.264 codec for best compatibility
- Target bitrate: 2-5 Mbps
- Recommended max size: 5MB

### Example FFmpeg Optimization

```bash
# Optimize video file
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k public/landscape.mp4
```

## Troubleshooting

**Images not showing:**
- Check file names match exactly (case-sensitive)
- Ensure files are in `public/` folder, not `public/assets/`
- Clear browser cache and refresh

**Video not playing:**
- Check browser console for errors
- Ensure video codec is H.264
- Try converting with FFmpeg using the commands above

**Performance issues:**
- Reduce image/video resolution
- Compress files to smaller sizes
- Use WebP for images
