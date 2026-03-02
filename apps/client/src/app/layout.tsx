// app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import { draftMode } from 'next/headers';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WishlistSync from '@/components/WishlistSync';
import VisualEditingWrapper from '@/components/VisualEditingWrapper';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const montserrat = Montserrat({ 
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: 'Zentrics - Powering Smarter, Safer, Sustainable Living',
  description: 'Zentrics provides cutting-edge solar power, home automation, and security solutions to transform your space into an efficient, secure, and sustainable environment.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    // <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="font-sans text-dark bg-light dark:text-dark-light dark:bg-light-dark transition-colors duration-300">
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <ToastContainer position="top-left" theme="light" />
        <WishlistSync />
        {isDraftMode && <VisualEditingWrapper />}
      </body>
    </html>
  );
}