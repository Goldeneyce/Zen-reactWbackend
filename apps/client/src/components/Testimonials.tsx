// components/Testimonials.tsx
import React from 'react';
import { Testimonial } from '@/types';
import { StarIcon } from './Icons';

interface TestimonialsProps {
  title: string;
  subtitle: string;
  testimonials: Testimonial[];
}

export default function Testimonials({ title, subtitle, testimonials }: TestimonialsProps) {
  const renderRating = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, index) => (
        <StarIcon
          key={index}
          className={`w-5 h-5 ${index < rating ? 'text-accent' : 'text-gray-300'}`}
        />
      ));
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white dark:bg-white-dark p-8 rounded-lg shadow-custom dark:shadow-dark-custom"
            >
              <div className="flex gap-1 mb-4">
                {renderRating(testimonial.rating)}
              </div>
              
              <p className="text-gray-600 dark:text-gray-300 italic mb-6">
                &quot;{testimonial.content}&quot;
              </p>
              
              <div className="text-center">
                <h4 className="font-bold text-primary mb-1">
                  {testimonial.name}
                </h4>
                <span className="text-gray-600 dark:text-gray-300">
                  {testimonial.role}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}