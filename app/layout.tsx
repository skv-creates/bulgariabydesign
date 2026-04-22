import type { Metadata } from "next";
import { Sofia_Sans, Sofia_Sans_Semi_Condensed } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const sofiaSans = Sofia_Sans({
  variable: "--font-sofia-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const sofiaSansSemiCondensed = Sofia_Sans_Semi_Condensed({
  variable: "--font-sofia-sans-condensed",
  subsets: ["latin", "cyrillic"],
  style: ["normal", "italic"],
  display: "swap",
});

const description =
  "„България по дизайн“ е инициатива за достоен и модерен визуален облик на държавните институции. Вижте нашата визия за по-красива България и подкрепете манифеста.";

export const metadata: Metadata = {
  title: "България по дизайн",
  description,
  openGraph: {
    title: "България по дизайн",
    description,
    locale: "bg_BG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "България по дизайн",
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="bg"
      className={`${sofiaSans.variable} ${sofiaSansSemiCondensed.variable} antialiased`}
    >
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
