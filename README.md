# Web Automation Portfolio

A responsive demo website for **Brightside Home Cleaning**, a **fictional** home cleaning company. It is a portfolio project that shows the kind of small-business website I build for U.S. clients.

> **Disclaimer:** Brightside Home Cleaning does not exist. The name, phone number, email, address, hours, and testimonials are examples. No real customer reviews, results, or credentials are claimed anywhere on the site.

## Features

- Responsive layout for mobile, tablet, and desktop
- Sticky navigation with an accessible mobile menu
- Hero, services, benefits, process, fictional testimonials, FAQ, and contact sections
- "Request a Free Quote" calls to action throughout the page
- Accessibility basics: skip link, semantic landmarks, visible focus, labeled form fields, reduced-motion support
- SEO basics: title, description, Open Graph tags, JSON-LD, `robots.txt`, `sitemap.xml`
- No frameworks, no build step, no paid services, no secrets

## Tech stack

Plain **HTML, CSS, and vanilla JavaScript**. Node.js is used only for developer tooling (preview server, linting, tests); nothing from npm ships to visitors.

## Project structure

```
index.html              The whole page
assets/css/styles.css   Styles (colors and sizes are CSS variables at the top)
assets/js/main.js       Mobile menu and demo form validation
assets/img/             SVG logo, hero illustration, social image
tests/smoke.test.mjs    Browser smoke tests (Playwright)
.github/workflows/      CI (lint and tests) and optional GitHub Pages deploy
robots.txt, sitemap.xml SEO files
```

## Setup

Requirements: [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npx playwright install chromium   # one-time, needed only for tests
```

## Development

```bash
npm start
```

Open http://localhost:8080. Edit `index.html`, `assets/css/styles.css`, or `assets/js/main.js` and refresh the browser. You can also just open `index.html` directly in a browser.

To re-brand the site for a client, change the `--color-*` variables at the top of `styles.css`, replace the text in `index.html`, and swap the SVGs in `assets/img/`.

## Testing

```bash
npm run lint   # validates HTML and CSS
npm test       # starts a local server and checks the page in headless Chromium
```

The tests check that all sections exist, there is exactly one `h1`, images have alt text, there is no horizontal scrolling at 375, 768, and 1280 px wide, the mobile menu works, and the form validates.

If Playwright cannot find a browser, run `npx playwright install chromium`, or set `CHROMIUM_PATH` to an existing Chrome/Chromium executable.

## Making the form work in production

**The contact form is a demo and does not send anything.** It validates the fields in the browser and then shows a message saying nothing was sent. To receive real quote requests you need a backend. Options:

1. **A hosted form service** (easiest). Formspree, Web3Forms, or Netlify Forms all have free tiers. You typically add an `action` URL (and `method="post"`) to the `<form>`, then update `assets/js/main.js` so it submits with `fetch` instead of only showing the demo message. Follow the provider's current documentation.
2. **A small serverless function** (Netlify Functions, Cloudflare Workers, etc.) that emails you through a provider such as Resend or Postmark. Keep API keys in the host's environment variables, never in the repository.

Before going live, also add spam protection (a honeypot field or CAPTCHA), a privacy policy link, and test that messages actually arrive.

## Deployment

It is a static site, so any static host works:

- **GitHub Pages:** in the repo, go to Settings > Pages and choose "GitHub Actions" as the source. `.github/workflows/pages.yml` then deploys on every push to `main`.
- **Netlify or Cloudflare Pages:** connect the repository, leave the build command empty, and set the publish directory to the repository root.

For a real client site, update `sitemap.xml` and the URLs in `index.html`, and **remove `noindex`** from the `<meta name="robots">` tag and `Disallow: /` from `robots.txt`. The demo blocks search engines on purpose.

## Known limitations

- The form is not connected to a server (see above).
- All business details and testimonials are fictional placeholders.
- Illustrations are simple SVGs; a real client site would use their own photos.
- Social preview image is an SVG; some platforms require PNG or JPG.
- Automated tests do not replace a manual accessibility review or a Lighthouse audit.

## License

MIT. See [LICENSE](LICENSE).
