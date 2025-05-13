
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Header from '@/components/layout/header';
import { initSentry } from '@/lib/sentry';

if (typeof window !== 'undefined') {
    initSentry();
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter', 
});

export const metadata: Metadata = {
  title: 'Plenty of π',
  description: 'Learn and explore with Plenty of π - interactive math and CS tools.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      {/* Removed whitespace text node from here */}
      <body className={`font-sans antialiased flex flex-col min-h-screen`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
