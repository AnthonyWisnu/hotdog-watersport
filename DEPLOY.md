# Pre-Launch Checklist — PT Hot Dog Water Sport

## 1. Replace Placeholder Content

Search for these strings across the codebase and replace with real values:

| Placeholder | File | What to put |
|---|---|---|
| `+62XXXXXXXXXX` | `lib/constants.ts` | Real WhatsApp number e.g. `+6281234567890` |
| `[LOCATION]` | `lib/constants.ts`, `app/layout.tsx` | City name e.g. `Seminyak, Bali` |
| `[STREET ADDRESS]` | `app/layout.tsx` | Full street address |
| `[REGION]` | `app/layout.tsx` | Province e.g. `Bali` |
| `[LAT]` / `[LNG]` | `app/layout.tsx` | Decimal coordinates |
| `[handle]` | `lib/constants.ts`, `app/layout.tsx` | Social media handles |
| `G-XXXXXXXXXX` | `lib/constants.ts`, `app/layout.tsx` | Real GA4 Measurement ID |
| `info@hotdogwatersport.com` | `lib/constants.ts`, `app/layout.tsx` | Real email |
| Maps embed URL | `components/sections/contact/GoogleMap.tsx` | Real Google Maps embed URL |

## 2. Replace Placeholder Images

All `next/image` `src` props currently point to placeholder paths.
Replace with real images in `/public/`:

```
public/
  images/
    hero/
      hero-main.jpg          (1920×1080 min)
      hero-mobile.jpg        (768×1024 min)
    services/
      surfing-hero.jpg
      jetski-hero.jpg
      diving-hero.jpg
      swimming-hero.jpg
    gallery/
      gallery-01.jpg ... gallery-13.jpg
    about/
      team.jpg
      location.jpg
  og-default.jpg             (1200×630 — Open Graph image)
  favicon.ico
  apple-touch-icon.png       (180×180)
```

Image tips:
- WebP or JPEG, quality 80–85
- Hero images: ≤ 200 KB after compression
- Gallery images: ≤ 100 KB each
- Use [Squoosh](https://squoosh.app) or ImageOptim to compress

## 3. Add Logo

Replace the `<Waves>` icon in `components/layout/Header.tsx` and `Footer.tsx`
with a real `<Image src="/logo.svg" />` or `<Image src="/logo.png" />`.

## 4. Flip Feature Flags

In `lib/constants.ts`:
```ts
export const ANALYTICS_ENABLED = true;   // was false
```

In `app/layout.tsx`, update the GA4 ID in the `<Script>` src and `gtag('config', ...)` call.

## 5. Verify SEO

- [ ] All 6 pages have unique `<title>` and `<meta description>`
- [ ] `/public/og-default.jpg` exists (1200×630)
- [ ] JSON-LD LocalBusiness schema in `app/layout.tsx` has real address + phone
- [ ] `/sitemap.xml` auto-generated (visit `/sitemap.xml` after deploy)
- [ ] `/robots.txt` auto-generated (visit `/robots.txt` after deploy)

## 6. Deploy to Vercel

```bash
# Option A: Vercel CLI
npm i -g vercel
vercel --prod

# Option B: GitHub → Vercel dashboard
# 1. Push repo to GitHub
# 2. Import project at vercel.com/new
# 3. Framework: Next.js (auto-detected)
# 4. No env vars needed unless using .env.local values
# 5. Deploy
```

Domain setup:
- Add custom domain in Vercel → Project → Settings → Domains
- Point your DNS `A` record to `76.76.21.21` (Vercel's IP)
- Or add `CNAME www → cname.vercel-dns.com`

## 7. Post-Launch

- [ ] Submit sitemap to Google Search Console: `https://hotdogwatersport.com/sitemap.xml`
- [ ] Set up Google Business Profile (free) — critical for local SEO
- [ ] Verify GA4 is receiving data (Realtime report)
- [ ] Test WhatsApp CTA on mobile — confirm messages are pre-filled correctly
- [ ] Check all pages on mobile (iPhone Safari + Android Chrome)
- [ ] Run Lighthouse audit (Chrome DevTools → Lighthouse)
  - Target: Performance ≥ 90, Accessibility ≥ 95, SEO 100

## 8. Google Business Profile (Recommended)

Create a free profile at `business.google.com`:
- Business name: PT Hot Dog Water Sport
- Category: Water Sports Instruction
- Address: (exact location)
- Phone: (WhatsApp number)
- Website: https://hotdogwatersport.com
- Hours: Mon–Sun 08:00–18:00
- Add photos: minimum 10 photos of equipment and location
- Ask first customers for Google reviews

This is the #1 highest-ROI action for local search visibility.
