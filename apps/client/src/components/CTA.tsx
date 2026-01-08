// components/CTA.tsx
import React from 'react';

interface CTAProps {
  title: string;
  description: string;
  primaryButton: {
    text: string;
    href: string;
  };
  secondaryButton?: {
    text: string;
    href: string;
  };
}

export default function CTA({ title, description, primaryButton, secondaryButton }: CTAProps) {
  return (
    <section 
      className="py-16 bg-cover bg-center text-white"
      style={{
        backgroundImage: 'linear-gradient(rgba(10, 79, 122, 0.7), rgba(10, 79, 122, 0.7)), url(/Home.avif)',
      }}
    >
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-lg mb-8">
            {description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={primaryButton.href}
              className="btn bg-white! text-primary! hover:bg-secondary! hover:text-white!"
            >
              {primaryButton.text}
            </a>
            
            {secondaryButton && (
              <a
                href={secondaryButton.href}
                className="btn btn-outline border-white! text-white! hover:bg-white! hover:text-primary!"
              >
                {secondaryButton.text}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}