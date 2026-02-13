// components/Footer.tsx
import Link from 'next/link';
import {
  LocationIcon,
  PhoneIcon,
  EmailIcon,
  ClockIcon,
  ChevronRightIcon,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  WhatsAppIcon,
  HeartIcon,
} from './Icons';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-light)] dark:bg-[#2d3436] text-[var(--color-dark)] dark:text-[var(--color-dark-light)] py-12 md:py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* About Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-accent relative pb-3">
              About Zentrics
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-secondary" />
            </h3>
            <p className="text-sm">
              We empower homes and businesses with integrated technology solutions designed for comfort, security, efficiency, and entertainment.
            </p>
            <div className="space-y-2">
              <h4 className="font-semibold">Follow Us</h4>
              <div className="flex gap-3">
                <Link href="#" className="text-[var(--color-dark)] dark:text-[var(--color-dark-light)] hover:text-[var(--color-secondary)] transition-colors">
                  <FacebookIcon className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-[var(--color-dark)] dark:text-[var(--color-dark-light)] hover:text-[var(--color-secondary)] transition-colors">
                  <TwitterIcon className="w-5 h-5" />
                </Link>
                <Link href="#" className="text-[var(--color-dark)] dark:text-[var(--color-dark-light)] hover:text-[var(--color-secondary)] transition-colors">
                  <InstagramIcon className="w-5 h-5" />
                </Link>
                <Link href="https://wa.me/2348162031086" target="_blank" className="text-[var(--color-dark)] dark:text-[var(--color-dark-light)] hover:text-[var(--color-secondary)] transition-colors">
                  <WhatsAppIcon className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-accent relative pb-3">
              Contact Info
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-secondary" />
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <LocationIcon className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <span>123 Tech Avenue, Innovation City</span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneIcon className="w-4 h-4 text-secondary" />
                <span>+123 456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <EmailIcon className="w-4 h-4 text-secondary" />
                <span>info@zenonelectrics.com</span>
              </li>
              <li className="flex items-start gap-3">
                <ClockIcon className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
                <span>
                  Mon-Fri: 8:00 AM - 6:00 PM<br />
                  Sat: 9:00 AM - 4:00 PM
                </span>
              </li>
            </ul>
          </div>

          {/* Links Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-accent relative pb-3">
              Quick Links
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-secondary" />
            </h3>
            <ul className="space-y-2 text-sm">
              {[
                { href: '/', label: 'Home' },
                { href: '/about', label: 'About Us' },
                { href: '/products', label: 'Shop' },
                { href: '/services', label: 'Services' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-2 text-[var(--color-dark)] dark:text-[var(--color-dark-light)] hover:text-[var(--color-secondary)] transition-colors group"
                  >
                    <ChevronRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hours Column */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-accent relative pb-3">
              Business Hours
              <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-secondary" />
            </h3>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span className="font-medium">Monday - Friday</span>
                <span>8:00 AM - 6:00 PM</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Saturday</span>
                <span>9:00 AM - 4:00 PM</span>
              </p>
              <p className="flex justify-between">
                <span className="font-medium">Sunday</span>
                <span>Closed</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[var(--color-dark)]/10 dark:border-[var(--color-dark-light)]/10 text-center text-sm">
          <p className="flex items-center justify-center gap-1">
            <span>&copy; {currentYear} Zentrics. All Rights Reserved. | Designed with</span>
            <HeartIcon className="w-4 h-4 text-red-500 inline-block" />
            <span>for Smart Living</span>
          </p>
        </div>
      </div>

      {/* WhatsApp Float Button */}
      <Link
        href="https://wa.me/2348162031086"
        target="_blank"
        className="whatsapp-float"
        aria-label="Chat on WhatsApp"
      >
        <WhatsAppIcon className="w-8 h-8" />
      </Link>
    </footer>
  );
}