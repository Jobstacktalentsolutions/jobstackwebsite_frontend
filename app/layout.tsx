import "./global.css";
import type { Metadata } from "next";
import AppToaster from "@/app/components/toaster";
import { Geist, Geist_Mono,  DM_Sans } from "next/font/google";


const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'], // choose the weights you need
  variable: '--font-dmSans',
})

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'JobStack',
  description: 'Find your dream job or hire top vetted talent.',
  icons: {
    icon: '/favicon.png',
  },
  
  openGraph: {
    title: 'Job stack',
    description: 'Find your dream job or hire top vetted talent',
    url: '../app/assets/heroimage.png',
    siteName: 'Your Site Name',
    images: [
      {
        url: '../app/assets/heroimage.png',
        width: 1200,
        height: 630,
        alt: 'Preview image for your site',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'Get hired! Find Talents!',
    title: 'Jobstack',
    description: 'Find your dream job or hire top vetted talent.',
    images: ['../app/assets/heroimage.png'],
    creator: '@yourhandle',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${dmSans.variable}`}
      >
        {children}
        <AppToaster />
      </body>
    </html>
  );
}
