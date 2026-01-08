// components/FAQSection.tsx
'use client';

import { useState } from 'react';
import { FAQ } from '@/types';
import { ChevronDownIcon } from './Icons';

interface FAQSectionProps {
  title: string;
  subtitle: string;
  faqs: FAQ[];
}

export default function FAQSection({ title, subtitle, faqs }: FAQSectionProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'products' | 'services'>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>(faqs[0]?.id || null);

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);

  const toggleFaq = (id: string) => {
    setOpenFaqId(openFaqId === id ? null : id);
  };

  return (
    <section className="py-16 bg-light dark:bg-light-dark">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {subtitle}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-6 py-2 rounded-full border-2 transition-colors ${
              activeCategory === 'all'
                ? 'bg-primary text-white border-primary'
                : 'border-primary text-primary hover:bg-primary hover:text-white'
            }`}
          >
            All FAQ
          </button>
          <button
            onClick={() => setActiveCategory('products')}
            className={`px-6 py-2 rounded-full border-2 transition-colors ${
              activeCategory === 'products'
                ? 'bg-primary text-white border-primary'
                : 'border-primary text-primary hover:bg-primary hover:text-white'
            }`}
          >
            Products FAQ
          </button>
          <button
            onClick={() => setActiveCategory('services')}
            className={`px-6 py-2 rounded-full border-2 transition-colors ${
              activeCategory === 'services'
                ? 'bg-primary text-white border-primary'
                : 'border-primary text-primary hover:bg-primary hover:text-white'
            }`}
          >
            Services FAQ
          </button>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className={`bg-white dark:bg-white-dark rounded-lg shadow-custom dark:shadow-dark-custom overflow-hidden transition-all duration-300 ${
                openFaqId === faq.id ? 'ring-2 ring-secondary' : ''
              }`}
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full px-6 py-4 flex justify-between items-center text-left"
              >
                <h3 className="text-lg font-semibold text-primary">
                  {faq.question}
                </h3>
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                    openFaqId === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <div
                className={`px-6 overflow-hidden transition-all duration-300 ${
                  openFaqId === faq.id ? 'pb-4' : 'max-h-0'
                }`}
              >
                <p className="text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}