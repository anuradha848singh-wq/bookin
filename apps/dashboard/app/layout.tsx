import React from "react";
import "./globals.css";
import { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Outfit } from "next/font/google";
import { Providers } from "@/components/Providers";
import { CommandPalette } from "@/components/CommandPalette";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "BookIn Dashboard - Clinic Admin Panel",
  description: "Manage your clinic bookings, services, slot generation, and booking page settings.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakartaSans.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head />
      <body style={{
        fontFamily: "var(--font-body)",
        "--font-body": "var(--font-inter), -apple-system, BlinkMacSystemFont, sans-serif",
        "--font-display": "var(--font-plus-jakarta-sans), var(--font-inter), sans-serif",
      } as React.CSSProperties}>
        <Providers>
          {children}
          <CommandPalette />
        </Providers>
      </body>
    </html>
  );
}

