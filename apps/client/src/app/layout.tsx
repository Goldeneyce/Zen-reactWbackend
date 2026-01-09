// app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'Zenon Electrics - Powering Smarter, Safer, Sustainable Living',
  description: 'Zenon Electrics provides cutting-edge solar power, home automation, and security solutions to transform your space into an efficient, secure, and sustainable environment.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
        <body className="font-sans text-dark bg-light dark:text-dark-light dark:bg-light-dark transition-colors duration-300">
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <ToastContainer position="top-left" theme="light" />
        </body>
      </html>
    </ClerkProvider>
  );
}