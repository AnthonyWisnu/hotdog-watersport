import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hotdogwatersport.com"),
  title: {
    default: "PT Hot Dog Water Sport | Premium Water Sports Rental",
    template: "%s | PT Hot Dog Water Sport",
  },
  description:
    "Rent surfboards, jet skis, diving equipment, and swimming gear from PT Hot Dog Water Sport. Premium water sports rental with top safety standards.",
  keywords: [
    "water sports rental",
    "jet ski rental",
    "surfboard rental",
    "diving equipment rental",
    "water sports",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "PT Hot Dog Water Sport",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "PT Hot Dog Water Sport",
  description:
    "Premium water sports rental: surfboards, jet skis, diving equipment, and swimming gear.",
  url: "https://hotdogwatersport.com",
  telephone: "+62XXXXXXXXXX",
  email: "info@hotdogwatersport.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "[STREET ADDRESS]",
    addressLocality: "[LOCATION]",
    addressRegion: "[REGION]",
    addressCountry: "ID",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "[LAT]",
    longitude: "[LNG]",
  },
  openingHours: "Mo-Su 08:00-18:00",
  priceRange: "$$",
  image: "https://hotdogwatersport.com/og-default.jpg",
  sameAs: [
    "https://instagram.com/[handle]",
    "https://facebook.com/[handle]",
    "https://tiktok.com/@[handle]",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`h-full ${inter.variable} ${playfairDisplay.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessSchema),
          }}
        />
      </head>
      <body className="min-h-full antialiased">
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        {children}
        {/* GA4, replace G-XXXXXXXXXX when live */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </body>
    </html>
  );
}
