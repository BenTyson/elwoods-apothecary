import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'El Woods Apothecary | The Forest Provides',
  description:
    "Where ancient plant wisdom meets modern understanding. Explore our herbal knowledge base, learn preparation methods, and discover nature's remedies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-deep-forest via-forest-900 to-forest-950 antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
