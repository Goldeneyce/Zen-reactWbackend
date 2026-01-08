// components/Service.tsx
import React from 'react';
import { Service } from '@/types';
import { CheckCircleIcon } from './Icons';

interface ServicesProps {
  services: Service[];
}

export default function Services({ services }: ServicesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {services.map((service) => (
        <div
          key={service.id}
          className="bg-white dark:bg-white-dark p-6 rounded-lg shadow-custom dark:shadow-dark-custom hover:-translate-y-2 transition-transform duration-300"
        >
          <h3 className="text-xl font-bold text-primary mb-3">
            {service.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {service.description}
          </p>
          
          <ul className="space-y-2">
            {service.features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-gray-600 dark:text-gray-300"
              >
                <CheckCircleIcon className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}