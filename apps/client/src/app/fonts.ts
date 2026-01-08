import { Roboto, Montserrat } from 'next/font/google';

// Define Roboto with specific weights and subsets
export const roboto = Roboto({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto', // Define a CSS variable name
});

// Define Montserrat with specific weights and subsets
export const montserrat = Montserrat({
  weight: ['700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat', // Define a CSS variable name
});