# Next Steps - Getting Your Site Running

## 📋 Quick Checklist

- [ ] Install dependencies: `npm install`
- [ ] Add your images to `public/` folder
- [ ] Convert landscape image to video (or modify code to use static image)
- [ ] Run development server: `npm run dev`
- [ ] Open http://localhost:3000

## 🖼️ About Your Images

You shared two images in the chat:
1. **First design mockup** - Full website layout with text and stacked images
2. **Glitchy landscape** - The mountain/forest scene with chromatic aberration

### What to Do With These Images:

1. **Save the glitchy landscape image:**
   - Right-click and save it from our chat
   - Name it `landscape-bg.png`
   - Place it in `phasegarden-website/public/` folder

2. **For the trail effect, you have 3 options:**

   **Option A: Convert image to video** (Recommended for authenticity)
   ```bash
   ffmpeg -loop 1 -i public/landscape-bg.png -c:v libx264 -t 10 -pix_fmt yuv420p public/landscape.mp4
   ```

   **Option B: Use static image** (Simpler)
   - Modify `components/VideoTrailEffect.tsx`
   - Change `<video>` to `<img>` (see ASSETS.md for details)

   **Option C: Use a real video** (Best for movement)
   - Create or find a video of the landscape with subtle movement
   - Save as `public/landscape.mp4`

3. **Add sheep landscape:**
   - If you have a separate sheep image, save it as `sheep-landscape.png`
   - Or reuse the main landscape: `cp public/landscape-bg.png public/sheep-landscape.png`

## 🎨 Customization Tips

### Update Text Content
Edit `app/page.tsx` to change:
- PhaseGarden description
- Feature list items
- Button text and links

### Adjust Colors
Edit `app/globals.css`:
- Line 18: Background color
- Line 110: Button color (currently blue)
- Add more glitch effects as needed

### Fine-tune Trail Effect
Edit `components/VideoTrailEffect.tsx`:
- Line 85: Max number of trails (currently 30)
- Line 104: Fade speed (currently 0.02)
- Line 129: Trail size (currently 150)
- Line 130: RGB split intensity (currently 5)

## 🚀 Running the Site

```bash
# Install dependencies
cd phasegarden-website
npm install

# Run development server
npm run dev

# Open in browser
# Navigate to http://localhost:3000
```

## ⚡ Testing the Trail Effect

1. Open the site in your browser
2. **Click and drag** your mouse across the hero section (right side)
3. You should see video/image trails following your cursor
4. Try different drag speeds and patterns
5. Works on mobile with touch gestures too!

## 🐛 Common Issues

**"Module not found" error:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Images not showing:**
- Check files are in `public/` (not `public/assets/`)
- File names must match exactly (case-sensitive)
- Try hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

**Trail effect not working:**
- Check browser console (F12) for errors
- Make sure you're dragging in the right section (hero, right side)
- Try Chrome browser (best compatibility)

## 📦 Deployment

When ready to deploy:

```bash
# Build for production
npm run build

# Test production build locally
npm start
```

Then deploy to:
- **Vercel** (recommended): `vercel deploy`
- **Netlify**: Drag `out/` folder to Netlify
- **Any static host**: Upload `.next/` and run `npm start`

## 💡 Next Enhancements

Consider adding:
- Audio player integration
- Purchase/download functionality
- Email signup form
- More interactive elements
- Loading animations
- Page transitions

---

Need help? Check:
- README.md - Full documentation
- ASSETS.md - Asset preparation guide
- Component comments - Inline code documentation
