# Rive Animation Creation Guide for Humanaira

This guide will help you create the required Rive animations for the Humanaira platform.

## Required Animations

### 1. **ai-orb.riv** - Rotating AI Orb
**Location:** `/public/animations/ai-orb.riv`

**What to create:**
- A 3D-looking sphere with gradient from `#35BFFF` (cyan) to darker blue
- Add glow effect around the edges
- Smooth continuous rotation animation
- Add subtle pulsing scale effect (0.95 to 1.05)

**Steps in Rive:**
1. Create a new artboard (340x340px)
2. Draw a circle shape
3. Apply radial gradient: `#35BFFF` → `#1a5f7f` → `#0a2f4f`
4. Add outer glow with `rgba(53,191,255,0.4)`
5. Create animation timeline:
   - Rotation: 0° to 360° over 8 seconds (loop)
   - Scale: 0.95 to 1.05 over 3 seconds (ping-pong)
6. Add State Machine called "State Machine 1" with autoplay

---

### 2. **loading-dots.riv** - Loading Spinner
**Location:** `/public/animations/loading-dots.riv`

**What to create:**
- Three dots bouncing up and down
- Color: `#35BFFF`
- Staggered animation timing

**Steps in Rive:**
1. Create artboard (80x32px)
2. Draw 3 circles (8px diameter each)
3. Space them 12px apart horizontally
4. Create animation:
   - Dot 1: translateY -8px over 0.6s (delay 0s)
   - Dot 2: translateY -8px over 0.6s (delay 0.2s)
   - Dot 3: translateY -8px over 0.6s (delay 0.4s)
5. Set to loop with ease-in-out

---

### 3. **floating-particles.riv** - Background Particles
**Location:** `/public/animations/floating-particles.riv`

**What to create:**
- 15-20 small circles/particles
- Random sizes (2px - 8px)
- Float slowly across screen
- Color: `rgba(53,191,255,0.15)` to `rgba(53,191,255,0.4)`

**Steps in Rive:**
1. Create large artboard (1920x1080px)
2. Scatter 15-20 small circles randomly
3. Vary opacity and size
4. Create animation for each particle:
   - Slow drift (translateX + translateY)
   - Random speeds (20-60 seconds per cycle)
   - Slight rotation
5. Set all to loop infinitely

---

### 4. **hero-glow.riv** - Hero Section Glow
**Location:** `/public/animations/hero-glow.riv`

**What to create:**
- Large gradient blob that slowly morphs
- Colors: `rgba(53,191,255,0.2)` to transparent
- Subtle pulsing and morphing

**Steps in Rive:**
1. Create artboard (1200x800px)
2. Draw large ellipse with blur
3. Apply radial gradient
4. Create animation:
   - Morph shape (change width/height)
   - Rotate slowly (0-360° over 30s)
   - Pulse opacity (0.2 to 0.4 over 5s)
5. Add gaussian blur effect (50-80px)

---

### 5. **counter-up.riv** - Animated Counter
**Location:** `/public/animations/counter-up.riv`

**What to create:**
- Simple number counting animation
- Optional: upward arrow or graph line
- Color: `#35BFFF`

**Steps in Rive:**
1. Create artboard (96x64px)
2. Draw upward arrow path
3. Create animation:
   - Arrow draws from bottom to top (stroke animation)
   - Duration: 1.2s
   - Ease: ease-out-cubic
4. Add State Machine with boolean input "isAnimating"
5. Set to play once when triggered

---

### 6. **button-hover.riv** - Button Hover Effect
**Location:** `/public/animations/button-hover.riv`

**What to create:**
- Glow effect behind button
- Expands on hover
- Color: `rgba(53,191,255,0.3)`

**Steps in Rive:**
1. Create artboard (200x60px)
2. Draw rounded rectangle (border-radius 12px)
3. Apply gradient glow
4. Create State Machine "Hover":
   - Boolean input: "isHover"
   - Default state: scale 0, opacity 0
   - Hover state: scale 1, opacity 0.5
5. Add transitions with 0.3s duration

---

## Creating Animations in Rive

### Getting Started:
1. Go to [rive.app](https://rive.app)
2. Sign up or log in (free tier works)
3. Click "Create New File"
4. Follow the steps above for each animation

### Export Settings:
- File format: `.riv` (default)
- Export each animation separately
- Download and place in `/public/animations/` folder

### Tips:
- Use State Machines for interactive animations (hover, click)
- Keep file sizes small (< 50KB each)
- Test animations at different speeds
- Use easing curves for smooth motion
- Preview in Rive before exporting

---

## Alternative: Using Pre-made Assets

If you want to start quickly, you can:

1. **Browse Rive Community:**
   - Go to [rive.app/community](https://rive.app/community)
   - Search for: "loading", "particles", "glow", "orb"
   - Download and customize to match colors

2. **Placeholder Files:**
   - You can create simple placeholder animations
   - Replace with polished versions later
   - Components will show fallback loading states if files are missing

---

## Testing Your Animations

After creating and placing files in `/public/animations/`:

```bash
# Start dev server
npm run dev
```

Visit `http://localhost:3000` to see:
- Background particles floating
- Hero glow animation
- AI orb in ServiceShowcase section
- Animated stats on scroll
- Loading spinner when clicking "Contact Seller"

---

## Color Palette Reference

Use these colors to match the Humanaira brand:

- **Primary Cyan:** `#35BFFF`
- **Dark Background:** `#070D1C`, `#0F1629`
- **Glow Effects:** `rgba(53,191,255,0.2)` to `rgba(53,191,255,0.6)`
- **Subtle Borders:** `rgba(53,191,255,0.12)`

---

## Need Help?

- **Rive Docs:** https://rive.app/community/doc
- **Rive Tutorials:** https://rive.app/community/tag/tutorial
- **Discord Support:** https://discord.gg/rive
