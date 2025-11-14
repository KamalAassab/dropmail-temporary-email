import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { StructuredData } from "@/components/StructuredData";

// Poppins font from Google Fonts
const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

// Base URL - Update this with your actual domain
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dropmail.app";
const siteName = "dropmail";
const defaultTitle = "dropmail - Instant Temporary Email Service | Zero Trace";
const defaultDescription = "Generate temporary email addresses instantly. No signup required. Protect your privacy with disposable emails. Instant creation, zero trace, auto-delete. Free temporary email service for privacy protection.";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  keywords: [
    "temporary email",
    "disposable email",
    "temp mail",
    "fake email",
    "email generator",
    "privacy email",
    "anonymous email",
    "email service",
    "spam protection",
    "email privacy",
    "temporary email address",
    "disposable email address",
    "free email service",
    "email verification",
    "test email",
    "throwaway email",
    "one-time email",
    "email masking",
    "privacy protection",
    "email security",
  ],
  authors: [{ name: "dropmail Team" }],
  creator: "dropmail",
  publisher: "dropmail",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["fr_FR"],
    url: baseUrl,
    siteName: siteName,
    title: defaultTitle,
    description: defaultDescription,
    images: [
      {
        url: `${baseUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: "dropmail - Temporary Email Service",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [`${baseUrl}/logo.png`],
    creator: "@dropmail",
    site: "@dropmail",
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      "en-US": baseUrl,
      "fr-FR": `${baseUrl}/fr`,
    },
  },
  category: "Technology",
  classification: "Email Service",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": siteName,
    "mobile-web-app-capable": "yes",
    "theme-color": "#ff1616",
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
    // yahoo: "your-yahoo-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#ff1616" />
        <meta name="msapplication-TileColor" content="#ff1616" />
      </head>
      <StructuredData />
      <body className={poppins.className} suppressHydrationWarning>{children}</body>
    </html>
  );
}

