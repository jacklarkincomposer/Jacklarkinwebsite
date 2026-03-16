# Jack Larkin Composer — Website

A custom-built static website for [jacklarkincomposer.co.uk](https://jacklarkincomposer.co.uk).

- **`_standalone/`** — contains self-contained projects (e.g. The Ancient Wanderer). Do not modify anything in this folder unless explicitly asked.

---

## File Structure

```
├── index.html              # Homepage (served at /)
├── about/
│   └── index.html          # About + Testimonials (served at /about/)
├── portfolio/
│   └── index.html          # Portfolio gallery + Audio tracks (served at /portfolio/)
├── services/
│   └── index.html          # Services overview (served at /services/)
├── contact/
│   └── index.html          # Contact form (served at /contact/)
├── sound-design/
│   └── index.html          # Sound Design sub-portfolio (served at /sound-design/)
├── 404.html                # Custom 404 page (auto-served by GitHub Pages)
├── CNAME                   # Custom domain: jacklarkincomposer.co.uk
├── assets/
│   ├── css/
│   │   └── style.css       # All shared site styles
│   ├── js/
│   │   └── main.js         # Shared nav, mobile menu, parallax, scroll-to-top & JLPlayer
│   └── images/
│       ├── bg-texture.png  # Background texture image
│       └── logo.png        # Site logo
└── README.md
```

### Asset path convention
- Root `index.html` references assets with no prefix: `assets/css/style.css`
- All subdirectory pages use `../assets/css/style.css`, `../assets/js/main.js` etc.

---

## Tech Stack

- Pure HTML / CSS / JS — no build tools, no frameworks
- Google Fonts: Libre Baskerville, Montserrat, Lora (italic)
- EmailJS for contact form submissions (`service_vobl839`, `template_ea5tghs`, public key `5FtKlbfKWIuJqIPPQ`)
- YouTube embeds for video portfolio via JLPlayer
- Cloudflare CDN for self-hosted video files and email obfuscation
- GitHub Pages for hosting

---

## Deploying to GitHub Pages

1. Create a GitHub repo and push all files to the `main` branch
2. In repo Settings → Pages → set source to `main` branch, root `/`
3. Add a `CNAME` file at the repo root containing `jacklarkincomposer.co.uk` — this is required for the custom domain to resolve; without it GitHub Pages serves a 404 for the domain
4. In your domain registrar, add a CNAME record pointing to `<username>.github.io`

### Clean URLs
GitHub Pages supports clean URLs (no `.html` extension) via the folder/index.html pattern. Each page lives in its own directory (`about/index.html`), so GitHub Pages serves it at `/about/`. There is no `.htaccess` or server config involved — the directory structure alone provides this.

> **Note on case sensitivity:** GitHub Pages runs on Linux, which is case-sensitive. All filenames and directory names must be lowercase-hyphenated. All internal links must match exactly.

---

## Design System

### Fonts
- **Libre Baskerville** — page headings, mobile nav links, testimonial quotes
- **Montserrat** — desktop nav links, section headings, buttons, labels
- **Lora (italic)** — body text, form fields, captions

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
Contact form inputs use a solid dark background (`rgba(10,10,14,0.85)`) so text is legible against the glass card. The audio player uses darker overrides (`rgba(8,8,14,0.35–0.60)`) applied via an inline `<style>` block at the top of `portfolio/index.html`.

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

### Audio Player (`portfolio/index.html`)
Custom-built audio player with track list. Features:
- Waveform-style scrubber, volume slider, time display
- Keyboard shortcuts: `Space` (play/pause), `←`/`→` (seek 10s), `M` (mute)
- On mobile: keyboard shortcut hints are hidden; functional buttons (−10s, Mute, +10s, Time) are shown instead, using the same `data-action` pattern
- Auto-advance to the next track on end
- Capped at **8 tracks** visible by default; a "Show More / Show Less" toggle reveals the rest
- Capped tracks are excluded from auto-advance

### Gallery Caps — Show More / Show Less
All three gallery-style sections have a cap to prevent the page from becoming too long when more content is added:
- **Video gallery** (portfolio, sound-design): cap 6
- **Audio tracks** (portfolio): cap 8
- **Recent Work grid** (index): cap 6 (future-proofing)

Items beyond the cap get `display: none !important` via `.gal-capped` / `.track-capped` / `.card-capped`. A "Show More ↓ / Show Less ↑" button toggles them. The arrow rotates via CSS.

### Navigation

**Desktop nav CTA ("Get in Touch" button)**
- On all pages except the contact page: links to `/contact/`
- On the contact page: text changes to "Prefer email?" and links directly to `mailto:jacklarkincomposer@gmail.com?subject=Commission%20Enquiry` — this avoids a redundant round-trip to a page the user is already on

**Announcement bar**
- Mirrors the same logic: "Get in Touch" → `/contact/` on all pages except contact, where it reads "Prefer email?" and links to `mailto:`

**CTA visibility**
- The nav CTA is hidden by default and revealed via `IntersectionObserver` once the announcement bar scrolls out of the viewport, preventing duplicate CTAs when both are visible

**Active nav link**
- `main.js` reads `window.location.pathname` and adds `.active` to any nav link whose `href` matches exactly. This works with the clean URL structure (`/`, `/about/`, `/portfolio/` etc.)
- Desktop: active link is white (`color: #fff`) with the gold underline bar at full scale
- Mobile: active link is gold (`color: var(--gold)`)

**Mobile menu**
- Full-screen overlay panel with Libre Baskerville font, vertical link list
- External links (YouTube, Instagram, SoundCloud) grouped separately below a "Links" label, displayed inline
- Closes on link click, close button, or `aria-expanded` toggle

### Scroll-to-Top Button
A 44px glass circle button is injected into the DOM by `main.js` on every page. It:
- Appears (opacity + translateY transition) after the user scrolls more than 300px
- Smooth-scrolls to the top on click
- Sits fixed bottom-right (28px from edges; 18px on mobile)
- Uses `--glass-bg-mid` / `--glass-bg-deep` on hover, with a gold arrow icon

### Contact Form (`contact/index.html`)
Uses EmailJS to send form data without a backend. Anti-spam measures:
- Honeypot field (hidden off-screen; bots fill it in, submission is silently swallowed)
- 3-second minimum time-on-page before a real send is attempted
- 30-second cooldown between submissions

Fields: Name\*, Email\*, Company/Channel, Project Type\* (with "Other" expand), Music Style\* (tag grid + free-text), Budget\*, Timeline\* (with rush-fee note), Reference/Inspiration (link to a song), Additional Details (1500 char limit with live counter).

### Testimonials (`about/index.html`)
Desktop: stacked cards with animated progress-bar navigation and auto-rotation timer. Mobile (≤600px): swipe-able card carousel with prev/next arrow buttons and a counter. Implemented as two separate HTML structures — `.test-cards-container` (desktop) and `.test-mobile` (mobile) — toggled via CSS.

### Custom 404 Page (`404.html`)
Served automatically by GitHub Pages for any unrecognised URL. Matches the site design — same nav, footer, liquid glass variables, and font stack. Contains a gold "Back to Home" link. Lives at the repo root (not in a subdirectory) so GitHub Pages picks it up correctly.

### Hero Image Preload (`index.html`)
The homepage hero thumbnail (`https://i.ytimg.com/vi/zTgk1UZA76k/maxresdefault.jpg`) is preloaded via:
```html
<link rel="preload" as="image" href="https://i.ytimg.com/vi/zTgk1UZA76k/maxresdefault.jpg">
```
This tells the browser to fetch the image at the same priority as CSS, eliminating the flash of empty space before the thumbnail loads.

---

## Adding Content

### New Video (Portfolio or Sound Design)
Add a new object to the `VIDEOS` array in the relevant page's `<script>` block. The gallery cap will automatically handle the "Show More" button if you go beyond 6.

### New Audio Track (Portfolio)
Add a new object to the `TRACKS` array in `portfolio/index.html`. The player cap will handle "Show More" if you go beyond 8.

### New Testimonial (About)
Add to both the desktop `TESTIMONIALS` array and the matching mobile `MOBILE_TESTIMONIALS` array in `about/index.html`.

---

## Known Considerations

- All filenames and directory names are lowercase-hyphenated for GitHub Pages compatibility
- The `CNAME` file must always be present in the repo root; GitHub Pages will remove the custom domain binding if it is ever deleted (e.g. via a force-push that omits it)
- The background texture is loaded from `assets/images/bg-texture.png` — this can be moved to CDN by updating the `url()` in `style.css`
- EmailJS credentials are embedded in the client-side JS; this is standard practice for EmailJS as they are designed to be public-facing
- Cloudflare proxies the site in production and obfuscates email addresses in the HTML (replacing them with `data-cfemail` encoded spans decoded by a Cloudflare script). The `404.html` uses a plain `mailto:` link because it may be served before Cloudflare's script loads
