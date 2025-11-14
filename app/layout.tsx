import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// Poppins font from Google Fonts
const poppins = Poppins({ 
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "dropmail - Instant emails. Zero trace.",
  description: "Generate temporary email addresses instantly. No signup required. Protect your privacy with disposable emails. Instant creation, zero trace, auto-delete.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
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
      </head>
      <body className={poppins.className} suppressHydrationWarning>{children}</body>
    </html>
  );
}

