// components/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import {
  PhoneIcon,
  EmailIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedInIcon,
  YouTubeIcon,
  WhatsAppIcon,
  ShoppingCartIcon,
  BellIcon,
  UserIcon,
  SearchIcon,
  MoonIcon,
  SunIcon,
  HamburgerIcon,
  ChevronDownIcon,
} from '@/components/Icons';
import ShoppingCartIconWithBadge from '@/components/ShoppingCartIcon';
import Searchbar from '@/components/Searchbar';

export default function Navbar() {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    return isDark;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCartStore();

  useEffect(() => {
    // Apply initial theme preference to DOM
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Shop' },
    { href: '/services', label: 'Services' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-white dark:bg-white-dark shadow-custom dark:shadow-dark-custom sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-primary text-white py-1">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Link href="tel:+1234567890" className="flex items-center gap-2 text-sm hover:text-accent transition-colors">
                <PhoneIcon className="w-4 h-4" />
                <span>+123 456 7890</span>
              </Link>
              <Link href="mailto:info@zentrics.com" className="flex items-center gap-2 text-sm hover:text-accent transition-colors">
                <EmailIcon className="w-4 h-4" />
                <span>info@zentrics.com</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )}
              </button>
              
              <div className="flex gap-3">
                <Link href="#" className="hover:text-accent transition-colors">
                  <FacebookIcon className="w-4 h-4" />
                </Link>
                <Link href="#" className="hover:text-accent transition-colors">
                  <TwitterIcon className="w-4 h-4" />
                </Link>
                <Link href="#" className="hover:text-accent transition-colors">
                  <InstagramIcon className="w-4 h-4" />
                </Link>
                <Link href="#" className="hover:text-accent transition-colors">
                  <LinkedInIcon className="w-4 h-4" />
                </Link>
                <Link href="#" className="hover:text-accent transition-colors">
                  <YouTubeIcon className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="py-3">
        <div className="container">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-xl">
                Z
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-primary">ZENTRICS</h1>
                <span className="text-xs text-secondary font-medium">
                  Powering Smarter, Safer, Sustainable Living
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex flex-1 justify-center">
              <ul className="flex gap-6">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-dark dark:text-gray-100 font-medium hover:text-secondary transition-colors relative py-1 group"
                    >
                      {item.label}
                      <span className={`absolute bottom-0 left-0 h-0.5 bg-secondary group-hover:w-full transition-all duration-300 ${
                        pathname === item.href ? 'w-full' : 'w-0'
                      }`} />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Header Icons */}
            <div className="hidden md:flex items-center gap-3">
              <ShoppingCartIconWithBadge />
              
              <Link href="#" className="relative p-2 text-[var(--color-dark)] dark:text-[var(--color-dark-light)] hover:text-[var(--color-secondary)] transition-colors">
                <BellIcon className="w-6 h-6" />
                <span className="icon-badge">2</span>
              </Link>
              
              <Link
                href="/login"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-light dark:hover:bg-light-dark border border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition-all"
              >
                <UserIcon className="w-5 h-5" />
                <span className="text-sm font-medium">Account</span>
              </Link>
            </div>

            {/* Mobile Menu Button and Cart */}
            <div className="md:hidden flex items-center gap-3">
              <ShoppingCartIconWithBadge />
              
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-primary"
                aria-label="Toggle menu"
              >
                <HamburgerIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/90 z-50 pt-20">
          <button
            onClick={closeMobileMenu}
            className="absolute top-4 right-4 text-white dark:text-red-500 p-2"
            aria-label="Close menu"
          >
            <span className="text-4xl">&times;</span>
          </button>
          
          <nav className="p-6">
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`block py-3 text-lg transition-colors ${
                      pathname === item.href
                        ? 'text-secondary dark:text-secondary underline'
                        : 'text-white dark:text-gray-100 hover:text-secondary'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div className="mt-8 pt-8 border-t border-white/20">
              <div className="flex flex-col gap-4">
                <Link
                  href="#"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 text-white dark:text-gray-100 hover:text-secondary transition-colors"
                >
                  <BellIcon className="w-6 h-6" />
                  <span>Notifications</span>
                </Link>
                
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 text-white dark:text-gray-100 hover:text-secondary transition-colors"
                >
                  <UserIcon className="w-6 h-6" />
                  <span>Account</span>
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}