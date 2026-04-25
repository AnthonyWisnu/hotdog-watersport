# 🌊 PT Hot Dog Water Sport

> Company profile website for **PT Hot Dog Water Sport and Dive Center** — a premium water sports rental business located in Benoa, Bali, Indonesia.

<br/>

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=for-the-badge&logo=framer&logoColor=white)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Pages](#-pages)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Assets](#-assets)
- [Contact Info](#-contact-info)
- [Deployment](#-deployment)

---

## 🔍 Overview

A modern, fully responsive company profile website built with Next.js App Router. Designed to showcase water sports rental services, drive WhatsApp bookings, and rank well on search engines through server-side rendering and structured metadata.

---

## ✨ Features

- **Fully Responsive** — mobile-first design, works on all screen sizes
- **WhatsApp Booking** — every CTA links directly to WhatsApp with pre-filled messages
- **Scroll Animations** — smooth reveal animations powered by Framer Motion
- **Photo Gallery** — filterable masonry grid with lightbox viewer
- **Google Maps Embed** — lazy-loaded map showing the exact business location
- **SEO Ready** — structured metadata, Open Graph tags, and JSON-LD schema on every page
- **Accessible** — ARIA labels, keyboard navigation, focus management, reduced motion support
- **Performance** — lazy-loaded images via `next/image`, lazy-loaded video, deferred map iframe

---

## 📄 Pages

| Route | Description |
|---|---|
| `/` | Homepage with hero video, services preview, gallery teaser, and CTA |
| `/about` | Brand story, company values, and safety commitment |
| `/services` | Detailed breakdown of all rental services with photo grids |
| `/gallery` | Filterable photo gallery with lightbox |
| `/faq` | Frequently asked questions and safety standards |
| `/contact` | Contact details with embedded Google Maps |

---

## 🛠 Tech Stack

| Category | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion 12 |
| Icons | Lucide React |
| Image Optimization | next/image |
| Form Handling | React Hook Form + Zod |
| Local Dev | Laragon (Windows) |

---

## 📁 Project Structure

```
hotdog-watersport/
├── app/
│   ├── (marketing)/         # All public-facing pages
│   │   ├── page.tsx         # Homepage
│   │   ├── about/
│   │   ├── services/
│   │   ├── gallery/
│   │   ├── faq/
│   │   └── contact/
│   ├── layout.tsx           # Root layout + metadata + schema
│   ├── robots.ts
│   └── sitemap.ts
│
├── components/
│   ├── animations/          # ScrollReveal, BlurText, CountUp, etc.
│   ├── layout/              # Header, Footer, WhatsAppFAB
│   ├── sections/            # Page-specific sections
│   └── ui/                  # Button, PageTransition, etc.
│
├── lib/
│   ├── constants.ts         # Business info (name, phone, address, hours)
│   ├── gallery-data.ts      # Gallery items and categories
│   ├── services-data.ts     # Services content and image paths
│   ├── faq-data.ts          # FAQ questions and answers
│   ├── whatsapp.ts          # WhatsApp URL builder
│   └── metadata.ts          # Shared metadata helper
│
└── public/
    ├── images/
    │   ├── about/           # bali-watersport.jpg, jetski.jpg
    │   ├── gallery/         # 16 activity photos
    │   ├── services/        # 12 service photos (3 per service)
    │   └── placeholder/     # cta-bg.jpg
    ├── videos/
    │   └── jetski.mp4       # Hero section background video
    └── logo/
        └── logo.jpg
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm / pnpm / yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/AnthonyWisnu/hotdog-watersport.git

# Navigate into the project
cd hotdog-watersport

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

---

## 🖼 Assets

All assets live inside `/public`. The table below lists every file the codebase expects:

### Images

| Path | Used In |
|---|---|
| `/images/about/bali-watersport.jpg` | About page (brand story main photo), Hero poster |
| `/images/about/jetski.jpg` | About page (brand story secondary photo) |
| `/images/placeholder/cta-bg.jpg` | Homepage CTA banner background |
| `/images/gallery/*.jpg` | Gallery page and homepage gallery teaser |
| `/images/services/surfing-board1-3.jpg` | Services page, homepage cards |
| `/images/services/jetski1-3.jpg` | Services page, homepage cards |
| `/images/services/divingequipment1-3.jpg/png` | Services page, homepage cards |
| `/images/services/swimminggear1-3.jpg` | Services page, homepage cards |
| `/logo/logo.jpg` | Header and Footer logo |

### Video

| Path | Used In |
|---|---|
| `/videos/jetski.mp4` | Homepage hero background (autoplay, muted, loop) |

---

## 📞 Contact Info

Business details are centralized in `lib/constants.ts`. Update this file to change contact info across the entire site:

```ts
export const WHATSAPP_NUMBER   = "+62 877-5445-9235";
export const LOCATION_ADDRESS  = "66FF+G34, Jl. Pratama No.62E, Benoa, Bali";
export const BUSINESS_EMAIL    = "info@hotdogwatersport.com";
export const OPERATING_HOURS   = "Mon – Sun, 08:00 – 18:00 WIB";
```

---

## 🌐 Deployment

The recommended platform is **Vercel** (built by the creators of Next.js).

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect the GitHub repository directly at [vercel.com/new](https://vercel.com/new) for automatic deployments on every push to `main`.

---

<div align="center">
  <sub>Built for PT Hot Dog Water Sport and Dive Center — Benoa, Bali 🏄</sub>
</div>
