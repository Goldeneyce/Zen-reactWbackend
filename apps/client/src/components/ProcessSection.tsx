// components/ProcessSection.tsx
import React from 'react';

interface ProcessStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface ProcessSectionProps {
  title: string;
  subtitle: string;
  steps: ProcessStep[];
}

export default function ProcessSection({ title, subtitle, steps }: ProcessSectionProps) {
  return (
    <section className="py-16 bg-white dark:bg-white-dark">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="relative text-center bg-light dark:bg-light-dark p-8 rounded-lg shadow-custom dark:shadow-dark-custom hover:-translate-y-2 transition-transform duration-300"
            >
              {/* Step Number */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              
              {/* Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white mx-auto mb-6">
                {step.icon}
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-primary mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}