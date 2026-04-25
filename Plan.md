# Plan.md — PT Hot Dog Water Sport Website
## Single Source of Truth — Eksekusi v1.0

| Item         | Detail                                       |
| ------------ | -------------------------------------------- |
| Status       | ACTIVE                                       |
| Dibuat       | 24 April 2026                                |
| Stack        | Next.js 14+ App Router · TS · Tailwind · ReactBits · Framer Motion |
| Deploy       | Vercel (SSG)                                 |
| Referensi    | PRD.md v1.0                                  |

---

## FASE 0 — Constraint & Placeholder Registry

Semua nilai placeholder terpusat di sini. Update ketika aset klien tersedia.

```
WHATSAPP_NUMBER       = +62XXXXXXXXXX
BUSINESS_NAME         = PT Hot Dog Water Sport
LOCATION_CITY         = [LOCATION]          # Bali / Nusa Dua / Tanjung Benoa
LOCATION_ADDRESS      = [FULL ADDRESS]
LOCATION_COORDS_LAT   = [LAT]
LOCATION_COORDS_LNG   = [LNG]
BUSINESS_EMAIL        = info@hotdogwatersport.com
OPERATING_HOURS       = Mon–Sun 08:00–18:00 WIB
INSTAGRAM_URL         = https://instagram.com/[handle]
TIKTOK_URL            = https://tiktok.com/@[handle]
FACEBOOK_URL          = https://facebook.com/[handle]
CONTACT_FORM_ENABLED  = false               # flip to true saat Formspree aktif
ANALYTICS_GA4_ID      = G-XXXXXXXXXX
META_PIXEL_ID         = [PIXEL_ID]
```

---

## FASE 1 — Project Setup & Design System

### 1.1 Init Project

```bash
npx create-next-app@latest hotdog-watersport \
  --typescript --tailwind --app --src-dir=false \
  --import-alias "@/*"
```

Dependencies yang diinstall:
```bash
npm install framer-motion lucide-react react-hook-form zod
npm install @next/font sharp
npm install -D prettier eslint-config-prettier
```

### 1.2 Folder Structure (sesuai PRD §9.4)

```
hotdog-watersport/
├── app/
│   ├── (marketing)/
│   │   ├── layout.tsx               # shared marketing layout
│   │   ├── page.tsx                 # Home
│   │   ├── about/page.tsx
│   │   ├── services/page.tsx
│   │   ├── gallery/page.tsx
│   │   ├── faq/page.tsx
│   │   └── contact/page.tsx
│   ├── layout.tsx                   # root layout: fonts, metadata, GA4, JSON-LD
│   ├── globals.css
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileMenu.tsx
│   │   └── WhatsAppFAB.tsx          # floating action button
│   ├── sections/                    # per-halaman section components
│   │   ├── home/
│   │   │   ├── HeroSection.tsx
│   │   │   ├── BrandStatement.tsx
│   │   │   ├── ServicesPreview.tsx
│   │   │   ├── GalleryTeaser.tsx
│   │   │   ├── WhyChooseUs.tsx
│   │   │   └── CTABanner.tsx
│   │   ├── about/
│   │   │   ├── AboutHero.tsx
│   │   │   ├── BrandStory.tsx
│   │   │   ├── CompanyValues.tsx
│   │   │   └── SafetyCommitment.tsx
│   │   ├── services/
│   │   │   └── ServiceSection.tsx   # reusable per layanan
│   │   ├── gallery/
│   │   │   ├── GalleryGrid.tsx
│   │   │   ├── GalleryFilter.tsx
│   │   │   └── Lightbox.tsx
│   │   ├── faq/
│   │   │   ├── FAQAccordion.tsx
│   │   │   └── SafetyStandards.tsx
│   │   └── contact/
│   │       ├── ContactInfo.tsx
│   │       ├── GoogleMap.tsx
│   │       └── ContactForm.tsx
│   ├── ui/
│   │   ├── Button.tsx               # variant: primary, ghost, whatsapp
│   │   ├── Badge.tsx
│   │   ├── ScrollProgressBar.tsx
│   │   └── PageTransition.tsx
│   └── animations/                  # ReactBits generated + wrappers
│       ├── SplitText.tsx
│       ├── BlurText.tsx
│       ├── ScrollReveal.tsx
│       ├── SpotlightCard.tsx
│       ├── TiltedCard.tsx
│       ├── GlareHover.tsx
│       ├── CountUp.tsx
│       ├── LogoLoop.tsx
│       ├── Dock.tsx
│       └── StarBorder.tsx
├── lib/
│   ├── constants.ts                 # placeholder registry exported
│   ├── whatsapp.ts                  # buildWhatsAppURL() helper
│   ├── metadata.ts                  # shared metadata builder
│   └── services-data.ts             # static data: services, FAQ, gallery
├── public/
│   ├── images/
│   │   ├── placeholder/             # dimensioned placeholder images
│   │   ├── services/
│   │   ├── gallery/
│   │   └── about/
│   ├── videos/
│   └── logo/
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

### 1.3 Tailwind Design Tokens

`tailwind.config.ts` — token semantik (semua swap nanti tanpa refactor):

```typescript
colors: {
  primary:    { DEFAULT: '#0A7EA4', dark: '#065F7A' },   // PLACEHOLDER ocean teal
  secondary:  { DEFAULT: '#F4A028', dark: '#C47E10' },   // PLACEHOLDER sun amber
  accent:     { DEFAULT: '#E8F4FD' },                    // PLACEHOLDER light wave
  surface:    { DEFAULT: '#FFFFFF' },
  'surface-muted': { DEFAULT: '#F7F8FA' },
  'surface-dark':  { DEFAULT: '#0D1117' },
  'text-primary':  { DEFAULT: '#0D1117' },
  'text-muted':    { DEFAULT: '#6B7280' },
  'text-inverse':  { DEFAULT: '#FFFFFF' },
},
fontFamily: {
  display: ['var(--font-display)', 'Georgia', 'serif'],  // Playfair Display / swap
  body:    ['var(--font-body)', 'system-ui', 'sans-serif'], // Inter / swap
},
```

### 1.4 Typography Scale

Heading scale ratio 1.333 (perfect fourth):
- `text-7xl` / `text-6xl` — Hero display
- `text-5xl` / `text-4xl` — Section headline h1
- `text-3xl` / `text-2xl` — Sub-headline h2
- `text-xl` / `text-lg` — Card title h3
- `text-base` — Body
- `text-sm` — Caption / meta

Fonts di `app/layout.tsx`:
- Display: `next/font/google` Playfair Display (fallback: serif berkarakter)
- Body: `next/font/google` Inter

---

## FASE 2 — Global Layout & Components

### 2.1 Root Layout (`app/layout.tsx`)

- Load fonts via `next/font`
- Inject JSON-LD LocalBusiness schema
- Inject GA4 script (lazy, `strategy="afterInteractive"`)
- Global metadata defaults
- `<ScrollProgressBar />`
- `<PageTransition />`

### 2.2 Header

**Behavior:**
- Sticky; pada scroll > 80px: `backdrop-blur-md bg-surface/80 border-b shadow-sm`
- Sebelum scroll: transparent overlay di atas hero
- Menu items: Home · About · Services · Gallery · FAQ · Contact
- Active indicator: underline animasi atau dot
- Desktop CTA kanan: `<Button variant="whatsapp">Book via WhatsApp</Button>`
- Mobile: hamburger → full-screen overlay slide-down dengan animasi Framer

**Accessibility:**
- `aria-label="Main navigation"` pada `<nav>`
- Hamburger: `aria-expanded`, `aria-controls`
- Focus trap saat mobile menu terbuka

### 2.3 Footer

Sections:
1. Logo + tagline brand (kiri)
2. Quick links (3 kolom: Services, Info, Connect)
3. Kontak singkat + jam operasional
4. `<LogoLoop />` untuk sertifikasi/partner logos (jika ada)
5. `<Dock />` untuk social icons (Instagram, TikTok, Facebook)
6. Copyright + credit

### 2.4 WhatsApp Floating Button

```tsx
// lib/whatsapp.ts
export function buildWhatsAppURL(message?: string) {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
```

- Posisi: `fixed bottom-6 right-6 z-50`
- Icon: WhatsApp SVG atau `MessageCircle` dari lucide
- Pulse animation setiap 8 detik: `@keyframes pulse-delayed` — `prefers-reduced-motion: reduce` → no animation
- Default pre-filled: `"Hi Hot Dog Water Sport, I'm interested in your water sports rentals!"`

---

## FASE 3 — Halaman Home

### Section: Hero

**Elemen:**
- Full viewport (`min-h-screen`) dengan video background loop
- Overlay gradient gelap (bottom-to-top) untuk readability
- `<BlurText>` atau `<SplitText>` untuk headline reveal on mount
- Subheadline: `opacity-0 animate-fade-up delay-300ms`
- Primary CTA: `<StarBorder>` wrapping `<Button variant="whatsapp">`
- Secondary CTA: "Explore Services" anchor scroll ke #services
- Scroll indicator: arrow bounce animation bawah

**Performance:**
- Video: `preload="none" muted autoPlay loop playsInline`
- Fallback: `<Image>` poster frame jika video tidak load
- Video pause on `visibilitychange` event
- Mobile: ganti video dengan static hero image (koneksi pertimbangan)

**Reduced motion:** semua reveal menjadi instant, tidak ada transform

### Section: Brand Statement

- 1-2 kalimat besar filosofi perusahaan
- `<ScrollReveal>` atau `<ScrollFloat>` trigger on viewport enter
- Background: solid atau subtle pattern, bukan gradient busy
- Tipografi: display font ukuran `text-5xl md:text-6xl lg:text-7xl`

### Section: Services Preview

- Grid responsif: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- `<SpotlightCard>` atau `<TiltedCard>` per layanan
- Tiap card: thumbnail image, nama layanan, teaser 1 kalimat, link `→ /services#[anchor]`
- Stagger reveal on scroll (Framer `staggerChildren`)

### Section: Gallery Teaser

- 6-8 foto dalam masonry atau horizontal scroll
- `<GlareHover>` per foto
- CTA: "View Full Gallery →" ke `/gallery`
- Lazy load images via `next/image` dengan `loading="lazy"`

### Section: Why Choose Us

- 4 pillar: Safety · Quality Equipment · Local Expertise · Location
- Icon dari lucide-react per pillar
- `<CountUp>` untuk angka (contoh: "500+ happy customers", "5+ years")
- Layout: `grid-cols-2 lg:grid-cols-4`

### Section: CTA Banner (Bottom)

- Full-width background image dramatis
- Overlay gelap
- Headline besar: "Ready to Hit the Water?"
- `<Button variant="whatsapp" size="xl">` dengan pulse animation
- Framer `whileHover` scale subtle

---

## FASE 4 — Halaman About

### Sections secara berurut:

1. **About Hero** — halaman title sederhana + breadcrumb, background subtle
2. **Brand Story** — paragraf editorial 3-4 paragraf, scroll-based text reveal `<ScrollReveal>`; asimetris: teks kiri, foto editorial kanan (di desktop)
3. **Company Values** — 3 kartu: Safety First · Well-Maintained Equipment · Local Expertise; `<TiltedCard>` atau `<ElectricBorder>`
4. **Safety Commitment** — highlight komitmen keselamatan, checklist visual dengan icon lucide
5. **Optional: Team / Facility Photos** — jika foto tersedia, komposisi editorial bukan grid kaku

---

## FASE 5 — Halaman Services

### Struktur Single Long Page + Anchor Nav

Sticky anchor nav di atas: `#surfing · #jetski · #diving · #swimming`

Setiap `<ServiceSection>` memuat:
1. Nama layanan — `text-6xl display font`, stagger reveal
2. Hero image / video pendek
3. Deskripsi 2-3 kalimat
4. Daftar peralatan: list dengan icon `CheckCircle` lucide
5. Info durasi sewa + catatan (tanpa harga)
6. Gallery kecil 3-6 foto — `<GlareHover>`
7. CTA "Inquire on WhatsApp": pre-filled message spesifik

**Pre-filled messages per layanan:**
```
Surfing:  "Hi Hot Dog Water Sport, I would like to ask about Surfboard rental. Could you share the details and availability?"
Jet Ski:  "Hi Hot Dog Water Sport, I would like to ask about Jet Ski rental. Could you share the details and availability?"
Diving:   "Hi Hot Dog Water Sport, I would like to ask about Diving Equipment rental. Could you share the details and availability?"
Swimming: "Hi Hot Dog Water Sport, I would like to ask about Swimming Gear rental. Could you share the details and availability?"
```

Semua disimpan di `lib/services-data.ts` sebagai static typed data.

---

## FASE 6 — Halaman Gallery

### Filter System

```tsx
type GalleryCategory = 'all' | 'surfing' | 'jetski' | 'diving' | 'swimming'
```

- Filter tabs: animasi underline slide dengan Framer `layoutId`
- Item filter: `AnimatePresence` fade + scale saat switch kategori

### Grid Layout

- Masonry: CSS column-count approach atau `react-masonry-css` (ringan)
- Lazy loading: `next/image loading="lazy"` + Intersection Observer
- Mixed content: `<Image>` untuk foto, thumbnail + play icon untuk video
- Hover: `<GlareHover>` + slight scale

### Lightbox

- Custom atau `yet-another-react-lightbox` (lightweight)
- Keyboard nav: ArrowLeft/Right, Escape
- Swipe support mobile
- Focus trap saat open

### Load More

- "Load more" button (tidak infinite scroll — lebih performant dan aksesibel)
- Increment 12 item per load

---

## FASE 7 — Halaman FAQ & Safety

### FAQ Accordion

```tsx
type FAQCategory = 'general' | 'booking' | 'safety' | 'equipment' | 'location'
```

- Tab filter per kategori
- Accordion: Framer AnimatePresence untuk smooth height animation
- ARIA: `role="button" aria-expanded aria-controls` — full keyboard nav

### Safety Standards Section

Highlight 4 poin dengan icon:
1. Sertifikasi yang dimiliki
2. Pemeriksaan rutin alat
3. Briefing wajib sebelum rental
4. Perlengkapan safety (life jacket, helm, dll)

### Call-out Box

```tsx
<CalloutBox variant="warning">
  Activity suspended in extreme weather or wave conditions exceeding safety limits.
</CalloutBox>
```

---

## FASE 8 — Halaman Contact

### Layout

1. **Contact Info**: alamat, nomor, email, jam operasional — icon lucide per item
2. **Google Maps embed**: lazy load via Intersection Observer (`loading="lazy"` pada iframe)
3. **Primary CTA**: tombol WhatsApp besar, centered
4. **Contact Form** (jika `CONTACT_FORM_ENABLED = true`): nama, email, message — Formspree endpoint; validasi zod + react-hook-form
5. **Social links**: Instagram, TikTok, Facebook

---

## FASE 9 — SEO & Metadata

### Per-halaman Metadata

```typescript
// lib/metadata.ts
export function buildMetadata(params: {
  title: string
  description: string
  path: string
  ogImage?: string
}): Metadata
```

Setiap `page.tsx` export `generateMetadata()` dengan:
- `title` unique + brand suffix `| PT Hot Dog Water Sport`
- `description` 150-160 karakter
- Open Graph: `og:image` 1200×630px per halaman
- Twitter card: `summary_large_image`
- `canonical` URL

### JSON-LD LocalBusiness

Di `app/layout.tsx`:
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "PT Hot Dog Water Sport",
  "description": "...",
  "url": "https://[domain]",
  "telephone": "[WA NUMBER]",
  "address": { "@type": "PostalAddress", ... },
  "geo": { "@type": "GeoCoordinates", ... },
  "openingHours": "Mo-Su 08:00-18:00",
  "priceRange": "$$",
  "image": "...",
  "sameAs": ["[instagram]", "[facebook]", "[tiktok]"]
}
```

### Sitemap & Robots

`app/sitemap.ts` — auto-generate semua 6 halaman + priority + lastmod
`app/robots.ts` — allow all, sitemap pointer

---

## FASE 10 — Performance Optimization

### Image Strategy

- Semua gambar via `next/image`
- Format: AVIF (utama) > WebP (fallback), via `formats: ['image/avif', 'image/webp']` di `next.config.js`
- `blurDataURL` untuk blur-up placeholder (base64 tiny)
- `sizes` prop sesuai breakpoint layout
- Hero image: `priority={true}` untuk LCP

### Video Strategy

- Video hero: `<video muted autoPlay loop playsInline preload="none">`
- Pause on `document.visibilityState === 'hidden'`
- Mobile fallback: static image (media query atau JS check)
- Hosting: `/public/videos/` atau Vercel Blob untuk file besar

### Bundle Optimization

- ReactBits components: di-copy langsung ke `components/animations/`, bukan import runtime
- `next/dynamic` dengan `{ ssr: false }` untuk komponen berat (Lightbox, GoogleMap)
- Framer Motion: tree-shake via `import { motion } from 'framer-motion'` spesifik

### Core Web Vitals Targets

| Metric | Target    | Strategi                                          |
| ------ | --------- | ------------------------------------------------- |
| LCP    | < 2.5s    | Hero image priority, preconnect fonts             |
| CLS    | < 0.1     | Explicit width/height semua image, font fallback  |
| INP    | < 200ms   | No heavy JS on main thread, animation GPU layer   |

---

## FASE 11 — Accessibility Audit

Checklist sebelum deploy:

- [ ] Semua gambar punya `alt` text deskriptif (bukan "image1.jpg")
- [ ] `h1` hanya sekali per halaman, hierarchy `h2 > h3` rapi
- [ ] Semua icon-only button punya `aria-label`
- [ ] Warna contrast ratio memenuhi WCAG 2.1 AA (4.5:1 normal text, 3:1 large)
- [ ] Focus indicator terlihat di semua interactive element
- [ ] Mobile menu: focus trap aktif, `aria-modal="true"`
- [ ] Lightbox: focus trap, Escape menutup
- [ ] Semua animasi: `@media (prefers-reduced-motion: reduce)` → instant/none
- [ ] Keyboard navigation penuh (Tab, Enter, Space, Escape, Arrow keys)
- [ ] Skip-to-main link di awal `<body>`
- [ ] Form fields: `label` explicit atau `aria-label`
- [ ] Error messages: `role="alert"` dan linked via `aria-describedby`
- [ ] Touch targets: minimal 44×44px (terutama mobile)

---

## FASE 12 — Animasi: Implementation Guide

### Prinsip Implementasi

Setiap komponen animasi di `components/animations/` harus:
1. Cek `useReducedMotion()` dari Framer Motion
2. Jika `reducedMotion === true`: render statis, tanpa transform/opacity transition
3. Tidak ada animasi yang berjalan otomatis tanpa henti (kecuali video hero dan LogoLoop yang boleh berjalan tapi harus pause on reduced-motion)

### Mapping Komponen per Section

| Halaman / Section          | Komponen Animasi               | Catatan                           |
| -------------------------- | ------------------------------ | --------------------------------- |
| Home Hero bg               | Waves / Silk (ambient)         | z-index di belakang konten        |
| Home Hero headline         | BlurText atau SplitText        | Trigger on mount                  |
| Home Hero CTA button       | StarBorder + Magnet            | Desktop only untuk Magnet         |
| Home Brand Statement       | ScrollReveal                   | Trigger 20% viewport entry        |
| Home Services cards        | SpotlightCard                  | Pointer tracking, fallback plain  |
| Home Gallery teaser        | GlareHover                     | Hover only, no auto               |
| Home Why Choose Us         | CountUp                        | Trigger on viewport entry         |
| About Values cards         | TiltedCard                     | Subtle tilt, max ±5deg            |
| Services Gallery           | GlareHover                     | Same as Home                      |
| Gallery thumbnails         | GlareHover + scale             | Combined                          |
| Footer partner logos       | LogoLoop                       | Pause on reduced-motion           |
| Footer social icons        | Dock                           | Magnetic hover                    |
| Page transitions           | Framer layout fade             | 200ms opacity                     |
| WhatsApp FAB               | Custom pulse                   | 8s interval, stop reduced-motion  |

### ReactBits MCP Workflow

1. Buka MCP session
2. Request komponen dengan konteks: "Generate [ComponentName] component for water sports website, dark/light mode aware, TypeScript, Tailwind classes"
3. Review output — pastikan tidak ada external dependency yang tidak ada di package.json
4. Simpan ke `components/animations/[ComponentName].tsx`
5. Tambah `useReducedMotion` guard
6. Test di browser sebelum integrate ke section

---

## FASE 13 — Data Layer (Static)

### `lib/constants.ts`

```typescript
export const WHATSAPP_NUMBER = '+62XXXXXXXXXX'
export const BUSINESS_NAME = 'PT Hot Dog Water Sport'
export const LOCATION_CITY = '[LOCATION]'
export const OPERATING_HOURS = 'Mon–Sun, 08:00–18:00 WIB'
export const CONTACT_FORM_ENABLED = false
export const GA4_ID = 'G-XXXXXXXXXX'
```

### `lib/services-data.ts`

```typescript
export interface ServiceData {
  id: 'surfing' | 'jetski' | 'diving' | 'swimming'
  title: string
  headline: string
  description: string
  equipment: string[]
  rentalDuration: string
  operationalNotes: string
  images: string[]        // paths ke /public/images/services/
  whatsappMessage: string
}
export const SERVICES: ServiceData[] = [...]
```

### `lib/faq-data.ts`

```typescript
export interface FAQItem {
  id: string
  category: FAQCategory
  question: string
  answer: string
}
```

### `lib/gallery-data.ts`

```typescript
export interface GalleryItem {
  id: string
  category: GalleryCategory
  type: 'image' | 'video'
  src: string
  alt: string
  width: number
  height: number
}
```

---

## FASE 14 — Testing & QA

### Pre-Deploy Checklist

**Fungsional:**
- [ ] Semua 6 halaman render tanpa error
- [ ] Semua CTA WhatsApp membuka wa.me dengan pre-filled message benar
- [ ] Gallery filter bekerja di semua kategori
- [ ] Lightbox buka/tutup, navigasi prev/next, Escape
- [ ] FAQ accordion expand/collapse semua item
- [ ] Google Maps embed load (lazy)
- [ ] Contact form submit (jika enabled): validasi dan error handling
- [ ] Mobile menu open/close dan semua link berfungsi
- [ ] Scroll progress bar akurat
- [ ] Page transitions tidak menyebabkan layout jump

**Responsif:**
- [ ] 375px (iPhone SE)
- [ ] 390px (iPhone 14)
- [ ] 430px (iPhone 14 Plus)
- [ ] 768px (iPad)
- [ ] 1024px (iPad landscape / small desktop)
- [ ] 1280px (standard desktop)
- [ ] 1536px (large desktop)

**Performance:**
- [ ] Lighthouse mobile ≥ 90 di semua halaman
- [ ] Lighthouse desktop ≥ 95 di semua halaman
- [ ] Tidak ada horizontal overflow
- [ ] Tidak ada CLS saat image load

**Cross-browser:**
- [ ] Chrome (latest)
- [ ] Safari (latest + iOS 15+)
- [ ] Firefox (latest)
- [ ] Edge (latest)

**Accessibility:**
- [ ] Tab navigation tidak terjebak
- [ ] Screen reader: heading hierarchy benar
- [ ] Reduced-motion: semua animasi off / instant

---

## FASE 15 — Deployment

### Vercel Setup

1. Push repo ke GitHub
2. Import project di Vercel
3. Set environment variables (jika ada — saat ini semua hardcode di constants)
4. Custom domain → add ke Vercel dashboard → update DNS
5. Enable Vercel Analytics

### Post-Deploy

- [ ] Submit sitemap ke Google Search Console
- [ ] Verifikasi JSON-LD via Rich Results Test
- [ ] Test Open Graph via opengraph.xyz
- [ ] Setup Google Analytics 4 property
- [ ] Monitor Core Web Vitals di Vercel Analytics
- [ ] Daftar Google Business Profile (rekomendasi ke klien)

---

## Status Tracker

> **Catatan stack aktual**: Next.js 16.2.4, React 19.2.4, Tailwind v4 (tokens via `@theme` di CSS, bukan tailwind.config.ts)

| Fase            | Status       | Catatan                                                |
| --------------- | ------------ | ------------------------------------------------------ |
| Fase 0: Registry | ✅ DONE     | `lib/constants.ts` — semua placeholder terpusat        |
| Fase 1: Setup    | ✅ DONE     | Build clean, 11 static routes, TS 0 errors             |
| Fase 2: Layout   | ✅ DONE     | Header, Footer, WhatsAppFAB, ScrollProgressBar, Button |
| Fase 3: Home     | ✅ DONE     | 6 sections selesai, perlu animasi ReactBits (Fase 12)  |
| Fase 4: About    | ✅ DONE     | 4 sections selesai                                     |
| Fase 5: Services | ✅ DONE     | ServiceSection reusable, anchor nav                    |
| Fase 6: Gallery  | ✅ DONE     | Filter + masonry + load more + lightbox selesai        |
| Fase 7: FAQ      | ✅ DONE     | Accordion + SafetyStandards selesai                    |
| Fase 8: Contact  | ✅ DONE     | ContactInfo + lazy GoogleMap embed                     |
| Fase 9: SEO      | ✅ DONE     | metadata per halaman, JSON-LD, sitemap, robots         |
| Fase 10: Perf    | ✅ DONE     | AVIF/WebP ✓, font preconnect ✓, optimizePackageImports ✓ |
| Fase 11: A11y    | ✅ DONE     | Focus trap Lightbox + mobile menu, ARIA tabs, focus-visible |
| Fase 12: Animasi | ✅ DONE     | BlurText, ScrollReveal, SpotlightCard, GlareHover, CountUp, PageTransition, Lightbox |
| Fase 13: Data    | ✅ DONE     | services, faq, gallery data files selesai              |
| Fase 14: QA      | ✅ DONE     | Build clean, TS 0 errors, 8 static routes, WA URLs ok  |
| Fase 15: Deploy  | ✅ DONE     | .env.example + DEPLOY.md checklist lengkap             |

---

*Plan.md ini hidup. Update status tracker setiap fase selesai. Jika ada perubahan requirement, tambahkan entry di PRD.md Change Log, lalu update Plan.md ini.*
