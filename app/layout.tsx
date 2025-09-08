import type React from "react";
import "./global.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {Providers} from "@/app/providers";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vodafone Albania Tourist Pack',
  description: 'Stay connected during your visit to Albania with Vodafone special tourist packages. Choose the perfect plan for your needs.',
  keywords: 'Vodafone, Albania, tourist, mobile, data, roaming, SIM card',
  openGraph: {
    title: 'Vodafone Albania Tourist Pack',
    description: 'Stay connected during your visit to Albania with Vodafone special tourist packages.',
    url: 'https://vodafone.al/tourist',
    siteName: 'Vodafone Albania Tourist Pack',
    images: [
      {
        url: 'https://home.vodafone.al/tourist/_next/static/media/Desktop_EN.92db70a3.jpeg',
        width: 1200,
        height: 630,
        alt: 'Vodafone Albania Tourist Pack',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vodafone Albania Tourist Pack',
    description: 'Stay connected during your visit to Albania with Vodafone special tourist packages.',
    images: ['https://home.vodafone.al/tourist/_next/static/media/Desktop_EN.92db70a3.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
  verification: {
    google: 'google-site-verification-code', // Replace with actual verification code when available
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
            <Header />
            {children}
        </Providers>
        <Footer />
      </body>
    </html>
  );
}
