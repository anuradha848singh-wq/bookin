import React from "react";
import "./globals.css";
import { Metadata } from "next";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

export const metadata: Metadata = {
  title: "BookIn — The Scheduling Platform Clinics Love",
  description: "All-in-one booking, payments, patient CRM, and automated alerts. Embed a beautiful scheduling widget on your website in minutes.",
  keywords: "clinic booking, appointment scheduling, patient management, healthcare SaaS, booking widget",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <div className="bk-root">
          <Navbar />
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
