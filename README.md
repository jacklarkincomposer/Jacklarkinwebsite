# Jack Larkin Composer — Website

A custom-built static website for [jacklarkincomposer.co.uk](https://jacklarkincomposer.co.uk).

## Structure

```
├── index.html          # Homepage
├── about.html          # About + Testimonials
├── portfolio.html      # Portfolio gallery + Tracks
├── services.html       # Services overview
├── contact.html        # Contact form (EmailJS)
├── assets/
│   ├── css/
│   │   └── style.css   # Shared site styles
│   ├── js/
│   │   └── main.js     # Shared nav & mobile menu JS
│   └── images/
│       ├── bg-texture.png  # Background texture
│       └── logo.png        # Site logo
└── README.md
```

## Deploying to GitHub Pages

1. Create a new GitHub repo (e.g. `jacklarkincomposer.github.io` or `website`)
2. Push all files to the `main` branch
3. In repo Settings → Pages → set source to `main` branch, root `/`
4. Point your domain: add a `CNAME` file containing `jacklarkincomposer.co.uk`
5. In your domain registrar, add a CNAME record pointing to `<username>.github.io`

## Things to update

- **Background image**: Currently uses local `assets/images/bg-texture.png`. 
  You can update `style.css` to use your CDN: `url('https://cdn.jacklarkincomposer.co.uk/images/bg-texture.png')`
- **Tracks section** (portfolio.html): Add your SoundCloud embed or custom audio player
- **Sound Design Portfolio link**: Update the `#` href to your sound design reel
- **Listen button** (index.html): Update href to SoundCloud or audio section
- **Second testimonial**: Replace the placeholder with a real testimonial as you get more

## Tech stack

- Pure HTML/CSS/JS (no build tools, no frameworks)
- Google Fonts: Syne + DM Sans
- EmailJS for contact form
- YouTube embeds for video portfolio
- Cloudflare CDN for self-hosted videos

## Making changes

Since this is plain HTML, you can edit any file directly. For bigger changes, use **Claude Code** in your terminal for quick iterations.
