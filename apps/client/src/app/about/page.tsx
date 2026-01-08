// app/about/page.tsx
import Searchbar from '@/components/Searchbar';
import Hero from '@/components/Hero';
import {
  LocationIcon,
  PhoneIcon,
  EmailIcon,
  ClockIcon,
} from '@/components/Icons';
import TeamSection from '@/components/TeamSection';
import CTA from '@/components/CTA';

export default function AboutPage() {
  const teamMembers = [
    {
      id: '1',
      name: 'Alex Johnson',
      role: 'Founder & CEO',
      description: '15+ years in electronics and smart home technology',
    },
    {
      id: '2',
      name: 'Sarah Williams',
      role: 'Head of Technology',
      description: 'Expert in home automation and security systems',
    },
    {
      id: '3',
      name: 'Michael Chen',
      role: 'Solar Solutions Director',
      description: 'Renewable energy specialist with 12 years experience',
    },
    {
      id: '4',
      name: 'David Rodriguez',
      role: 'Customer Experience Manager',
      description: 'Ensuring exceptional service for every client',
    },
  ];

  return (
    <>
      <Hero
        title="About Zenon Electrics"
        subtitle="Learn about our mission, vision, and the team behind our success"
        backgroundImage="/zenhero1.avif"
      />
      
      <Searchbar className="my-8" />
      
      {/* About Story Section */}
      <section className="py-16 bg-white dark:bg-white-dark">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url(/colorSplash.avif)' }}
              />
            </div>
            
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-primary">
                Our Story
              </h2>
              
              <p className="text-gray-600 dark:text-gray-300">
                Founded in 2010, Zenon Electrics started as a small electronics store with a vision to bring innovative technology solutions to homes and businesses. Over the years, we've grown into a leading provider of smart home and energy solutions, serving thousands of satisfied customers.
              </p>
              
              <p className="text-gray-600 dark:text-gray-300">
                Our journey began with a simple mission: to make cutting-edge technology accessible, reliable, and sustainable. Today, we're proud to be at the forefront of the smart home revolution, helping our customers create more efficient, secure, and comfortable living spaces.
              </p>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">Our Mission</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  To empower homes and businesses with integrated technology solutions designed for comfort, security, efficiency, and entertainment. We strive to make sustainable living accessible to everyone through innovative products and exceptional service.
                </p>
                
                <h3 className="text-2xl font-bold text-primary">Our Values</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span><strong>Innovation:</strong> Constantly exploring new technologies to improve lives</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span><strong>Integrity:</strong> Honest business practices and transparent communication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span><strong>Sustainability:</strong> Promoting eco-friendly solutions for a better future</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span><strong>Excellence:</strong> Commitment to quality in everything we do</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-secondary mt-1">•</span>
                    <span><strong>Customer Focus:</strong> Putting our customers at the heart of our business</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team Section */}
      <TeamSection 
        title="Meet Our Leadership Team"
        subtitle="The experts behind Zenon Electrics' success"
        members={teamMembers}
      />
      
      {/* CTA */}
      <CTA
        title="Ready to Experience Smart Living?"
        description="Contact us today to learn how Zenon Electrics can transform your space with innovative technology solutions."
        primaryButton={{ text: 'Contact Us', href: '/contact' }}
        secondaryButton={{ text: 'Browse Products', href: '/products' }}
      />
    </>
  );
}