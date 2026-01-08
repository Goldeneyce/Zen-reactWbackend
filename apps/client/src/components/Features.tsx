// components/Features.tsx
import React from 'react';
import {
  LeafIcon,
  ShieldIcon,
  HomeIcon,
  HeadsetIcon,
} from './Icons';

export default function Features() {
  const features = [
    {
      icon: <LeafIcon className="w-8 h-8" />,
      title: 'Eco-Friendly Solutions',
      description: 'Harness solar energy to reduce your carbon footprint and electricity bills with our sustainable power systems.',
    },
    {
      icon: <ShieldIcon className="w-8 h-8" />,
      title: 'Enhanced Security',
      description: 'Protect your property with our smart security systems, including CCTV, electric fencing, and smart access control.',
    },
    {
      icon: <HomeIcon className="w-8 h-8" />,
      title: 'Smart Home Automation',
      description: 'Transform your living space with intelligent automation for lighting, irrigation, entertainment, and appliances.',
    },
    {
      icon: <HeadsetIcon className="w-8 h-8" />,
      title: 'Expert Support',
      description: 'Our team of certified professionals provides consultation, installation, and ongoing maintenance services.',
    },
  ];

  return (
    <section className="py-16">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Why Choose Zenon Electrics
          </h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-white-dark p-8 rounded-lg shadow-custom dark:shadow-dark-custom text-center hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white mx-auto mb-6">
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-bold text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}