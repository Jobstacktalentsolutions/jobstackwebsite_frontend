import type { Metadata } from "next";
import { Geist, Geist_Mono,  DM_Sans } from "next/font/google";
import "./styles/globals.css"

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
      </body>
    </html>
  );
}
