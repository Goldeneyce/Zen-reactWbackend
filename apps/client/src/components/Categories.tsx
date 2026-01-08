// components/Categories.tsx
'use client';

import { useState } from 'react';
import {
  SolarPanelIcon,
  RobotIcon,
  CameraIcon,
  TVIcon,
  PlugIcon,
  LightbulbIcon,
} from './Icons';

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    {
      id: 'solar',
      title: 'Solar Power Systems',
      description: 'Complete solar solutions for homes and businesses',
      icon: <SolarPanelIcon className="w-12 h-12" />,
      features: [
        'Solar Generators',
        'Lithium-Ion Batteries',
        'Inverters',
        'Solar Street Lighting',
      ],
    },
    {
      id: 'automation',
      title: 'Home Automation',
      description: 'Smart solutions for modern living',
      icon: <RobotIcon className="w-12 h-12" />,
      features: [
        'Smart Lighting Systems',
        'Automated Irrigation',
        'Smart Locks & Gates',
        'Smart Appliances',
      ],
    },
    {
      id: 'security',
      title: 'Security Systems',
      description: 'Protect what matters most',
      icon: <CameraIcon className="w-12 h-12" />,
      features: [
        'CCTV & Smart Cameras',
        'Electric Fencing',
        'Smart Access Control',
        'Surveillance Solutions',
      ],
    },
    {
      id: 'entertainment',
      title: 'Home Entertainment',
      description: 'Immersive entertainment experiences',
      icon: <TVIcon className="w-12 h-12" />,
      features: [
        'Android TV Projectors',
        'Projector Stands',
        'Video Game Pads',
        'Diffusers',
      ],
    },
    {
      id: 'power',
      title: 'Power Solutions',
      description: 'Reliable power for all needs',
      icon: <PlugIcon className="w-12 h-12" />,
      features: [
        'Voltage Stabilizers',
        'Inverters',
        'Battery Systems',
        'Wiring Accessories',
      ],
    },
    {
      id: 'lighting',
      title: 'Lighting Solutions',
      description: 'Illumination for every space',
      icon: <LightbulbIcon className="w-12 h-12" />,
      features: [
        'Practical Lighting',
        'Decorative Lighting',
        'Solar Lighting',
        'Specialty Lighting',
      ],
    },
  ];

  const filteredCategories = selectedCategory === 'all' 
    ? categories 
    : categories.filter(cat => cat.id === selectedCategory);

  return (
    <section className="py-16 bg-white dark:bg-white-dark">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Our Product Categories
          </h2>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-lg border transition-colors ${
              selectedCategory === 'all'
                ? 'bg-primary text-white border-primary'
                : 'border-primary text-primary hover:bg-primary hover:text-white'
            }`}
          >
            All Categories
          </button>
          {['solar', 'automation', 'security', 'entertainment'].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-lg border transition-colors ${
                selectedCategory === category
                  ? 'bg-primary text-white border-primary'
                  : 'border-primary text-primary hover:bg-primary hover:text-white'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCategories.map((category) => (
            <div
              key={category.id}
              className="bg-light dark:bg-light-dark p-6 rounded-lg shadow-custom dark:shadow-dark-custom hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="w-20 h-20 bg-primary rounded-lg flex items-center justify-center text-white mx-auto mb-6">
                {category.icon}
              </div>
              
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-primary mb-2">
                  {category.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {category.description}
                </p>
              </div>
              
              <ul className="space-y-2">
                {category.features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-gray-600 dark:text-gray-300"
                  >
                    <span className="text-secondary mt-1">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}