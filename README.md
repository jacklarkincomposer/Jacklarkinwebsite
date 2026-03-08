# Jack Larkin Composer — Website

A custom-built static website for [jacklarkincomposer.co.uk](https://jacklarkincomposer.co.uk).

---

## File Structure

```
├── index.html          # Homepage
├── about.html          # About + Testimonials
├── portfolio.html      # Portfolio gallery + Audio tracks
├── services.html       # Services overview
├── contact.html        # Contact form (EmailJS)
├── sound-design.html   # Sound Design sub-portfolio
├── assets/
│   ├── css/
│   │   └── style.css   # All shared site styles
│   ├── js/
│   │   └── main.js     # Shared nav, mobile menu, parallax & JLPlayer
│   └── images/
│       ├── bg-texture.png  # Background texture image
│       └── logo.png        # Site logo
└── README.md
```

---

## Tech Stack

- Pure HTML / CSS / JS — no build tools, no frameworks
- Google Fonts: Playfair Display, Syne, DM Sans
- EmailJS for contact form submissions (`service_vobl839`, `template_ea5tghs`, public key `5FtKlbfKWIuJqIPPQ`)
- YouTube embeds for video portfolio via JLPlayer
- Cloudflare CDN for self-hosted video files
- GitHub Pages for hosting

---

## Deploying to GitHub Pages

1. Create a GitHub repo and push all files to the `main` branch
2. In repo Settings → Pages → set source to `main` branch, root `/`
3. Point your domain: add a `CNAME` file containing `jacklarkincomposer.co.uk`
4. In your domain registrar, add a CNAME record pointing to `<username>.github.io`

> **Note on case sensitivity:** GitHub Pages runs on Linux, which is case-sensitive. All HTML filenames must be lowercase-hyphenated (e.g. `sound-design.html`, not `Sound design.html`). All internal links must match exactly.

---

## Design System

### Fonts
- **Playfair Display** — page headings, mobile nav links, testimonial quotes
- **Syne** — desktop nav links, section headings, buttons, labels
- **DM Sans** — body text, form fields, captions

### Colour Tokens (CSS custom properties in `style.css`)
| Variable | Value | Usage |
|---|---|---|
| `--gold` | `#d4a84b` | Primary accent |
| `--gold-dim` | `rgba(212,168,75,0.18)` | Hover fills, badge backgrounds |
| `--gold-mid` | `rgba(212,168,75,0.45)` | Borders, dividers |
| `--bg` | `#0a0a0a` | Page background |
| `--text` | `#e0e0e0` | Body text |
| `--text-muted` | `#888888` | Secondary text |
| `--glass-bg` | `rgba(8,8,14,0.25)` | Lightest glass layer |
| `--glass-bg-mid` | `rgba(8,8,14,0.45)` | Nav bar, cards |
| `--glass-bg-deep` | `rgba(8,8,14,0.65)` | Player bar, dropdowns |
| `--glass-blur` | `blur(24px)` | Standard backdrop blur |

### Liquid Glass Effect
Components like the nav bar, testimonial cards, gallery cards, audio player, and contact form use:
```css
background: var(--glass-bg-mid);
backdrop-filter: var(--glass-blur);
border: 1px solid var(--glass-border);
```
Contact form inputs use a solid dark background (`rgba(10,10,14,0.85)`) so text is legible against the glass card.

---

## Key Architectural Decisions

### Background Parallax
`.site-bg` is set to `height: 115%` with `will-change: transform`. On scroll, `main.js` applies a `translateY()` shift (multiplier `0.04`, clamped to 8% of viewport height) via `requestAnimationFrame`. This gives a subtle parallax without ever revealing the image edge.

### JLPlayer — Unified Video Overlay
`window.JLPlayer` (in `main.js`) is a singleton overlay used on all three pages that show videos (index, portfolio, sound-design). It handles:
- YouTube iframes and Cloudflare native `<video>` elements
- Prev / Next navigation through a passed array of video objects
- An info wing (sliding panel) with title and description
- Keyboard shortcuts: `Escape`, `i`, `←`, `→`
- Mobile swipe-down to close
- On mobile (≤640px): the overlay is centred (not glued to the bottom), rounded corners all sides

Video objects passed to `JLPlayer.open(videos, startIndex)` follow this shape:
```js
{
  type: 'youtube' | 'cloudflare',
  ytId: 'abc123',        // YouTube only
  src: 'https://...',    // Cloudflare only
  title: 'Track title',
  badge: 'Rescore',
  desc: ['Para 1', 'Para 2']
}
```

### Audio Player (portfolio.html)
Custom-built audio player with track list. Features:
- Waveform-style scrubber, volume slider, time display
- Keyboard shortcuts: `Space` (play/pause), `←`/`→` (seek 10s), `M` (mute)
- On mobile: keyboard shortcut hints are hidden; functional buttons (−10s, Mute, +10s, Time) are shown instead, using the same `data-action` pattern
- Auto-advance to the next track on end
- Capped at **8 tracks** visible by default; a "Show More / Show Less" toggle reveals the rest
- Capped tracks are excluded from auto-advance

### Gallery Caps — Show More / Show Less
All three gallery-style sections have a cap to prevent the page from becoming too long when more content is added:
- **Video gallery** (portfolio.html, sound-design.html): cap 6
- **Audio tracks** (portfolio.html): cap 8
- **Recent Work grid** (index.html): cap 6 (future-proofing)

Items beyond the cap get `display: none !important` via `.gal-capped` / `.track-capped` / `.card-capped`. A "Show More ↓ / Show Less ↑" button toggles them. The arrow rotates via CSS.

### Contact Form (contact.html)
Uses EmailJS to send form data without a backend. Anti-spam measures:
- Honeypot field (hidden off-screen, bots fill it in, submission is silently swallowed)
- 3-second minimum time-on-page before a real send is attempted
- 30-second cooldown between submissions

Fields: Name\*, Email\*, Company/Channel, Project Type\* (with "Other" expand), Music Style\* (tag grid + free-text), Budget\*, Timeline\* (with rush-fee note), Reference/Inspiration (link to a song), Additional Details (1500 char limit with live counter).

### Testimonials (about.html)
Desktop: stacked cards with animated progress-bar navigation and auto-rotation timer. Mobile (≤600px): swipe-able card carousel with prev/next arrow buttons and a counter. Implemented as two separate HTML structures — `.test-cards-container` (desktop) and `.test-mobile` (mobile) — toggled via CSS.

### Navigation
- Sticky nav bar with liquid glass effect
- "Get in Touch" CTA button hidden until the announcement bar scrolls out of the viewport (IntersectionObserver)
- Mobile: full-screen overlay with Playfair Display font, compact spacing
- Desktop nav links use Syne font
- Active page link highlighted via JS matching `window.location.pathname`

---

## Adding Content

### New Video (Portfolio or Sound Design)
Add a new object to the `VIDEOS` array in the relevant page's `<script>` block. The gallery cap will automatically handle the "Show More" button if you go beyond 6.

### New Audio Track (Portfolio)
Add a new object to the `TRACKS` array in `portfolio.html`. The player cap will handle "Show More" if you go beyond 8.

### New Testimonial (About)
Add to both the desktop `TESTIMONIALS` array and the matching mobile `MOBILE_TESTIMONIALS` array in `about.html`.

---

## Known Considerations

- All filenames are lowercase-hyphenated for GitHub Pages compatibility
- The background texture is loaded from `assets/images/bg-texture.png` — this can be moved to CDN by updating the `url()` in `style.css`
- EmailJS credentials are embedded in the client-side JS; this is standard practice for EmailJS as they are designed to be public-facing
- The sound-design page may take a moment to propagate after any filename rename on GitHub Pages (Linux CDN caching)
