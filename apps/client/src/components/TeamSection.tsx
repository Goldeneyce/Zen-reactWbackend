// components/TeamSection.tsx
import React from 'react';
import { TeamMember } from '@/types';

interface TeamSectionProps {
  title: string;
  subtitle: string;
  members: TeamMember[];
}

export default function TeamSection({ title, subtitle, members }: TeamSectionProps) {
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white dark:bg-white-dark rounded-lg shadow-custom dark:shadow-dark-custom overflow-hidden hover:-translate-y-2 transition-transform duration-300"
            >
              <div className="h-48 bg-gradient-to-br from-primary to-secondary relative">
                <div className="absolute inset-0 flex items-center justify-center text-white text-4xl">
                  {member.name.charAt(0)}
                </div>
              </div>
              
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-primary mb-1">
                  {member.name}
                </h3>
                <span className="text-secondary font-medium block mb-3">
                  {member.role}
                </span>
                <p className="text-gray-600 dark:text-gray-300">
                  {member.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}