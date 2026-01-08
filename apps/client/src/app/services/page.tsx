// app/services/page.tsx
import Searchbar from '@/components/Searchbar';
import ServicesComponent from '@/components/Services';
import Testimonials from '@/components/Testimonials';
import ProcessSection from '@/components/ProcessSection';
import CTA from '@/components/CTA';
import {
  CommentIcon,
  PencilRulerIcon,
  ToolsIcon,
  HeadsetIcon,
} from '@/components/Icons';

export default function ServicesPage() {
  const services = [
    {
      id: '1',
      title: 'Installation Services',
      description: 'Our certified technicians provide professional installation for all our products, ensuring optimal performance and safety.',
      features: [
        'Solar System Installation',
        'Home Automation Setup',
        'Security System Installation',
        'Lighting System Setup',
        'Appliance Installation',
      ],
      icon: 'tools',
    },
    {
      id: '2',
      title: 'Consultation & Design',
      description: 'We offer customized solutions tailored to your specific needs through expert consultation and system design.',
      features: [
        'Energy Efficiency Audits',
        'Smart Home Planning',
        'Security System Design',
        'Custom Solar Solutions',
        'Lighting Design',
      ],
      icon: 'design',
    },
    {
      id: '3',
      title: 'Maintenance & Repair',
      description: 'Keep your systems running smoothly with our comprehensive maintenance and repair services.',
      features: [
        'System Health Checks',
        'Preventive Maintenance',
        '24/7 Emergency Repairs',
        'Component Replacement',
        'Warranty Services',
      ],
      icon: 'maintenance',
    },
    {
      id: '4',
      title: 'After-Sales Support',
      description: 'Our commitment continues after installation with dedicated support and training.',
      features: [
        'User Training Sessions',
        'Technical Support',
        'Warranty Management',
        'System Upgrades',
        'Remote Troubleshooting',
      ],
      icon: 'support',
    },
  ];

  const processSteps = [
    {
      id: '1',
      title: 'Consultation',
      description: 'We start with a detailed discussion to understand your needs, preferences, and budget.',
      icon: <CommentIcon className="w-8 h-8" />,
    },
    {
      id: '2',
      title: 'Solution Design',
      description: 'Our experts create a customized plan tailored to your specific requirements.',
      icon: <PencilRulerIcon className="w-8 h-8" />,
    },
    {
      id: '3',
      title: 'Professional Installation',
      description: 'Our certified technicians implement the solution with precision and care.',
      icon: <ToolsIcon className="w-8 h-8" />,
    },
    {
      id: '4',
      title: 'Ongoing Support',
      description: 'We provide continuous support to ensure your system performs optimally.',
      icon: <HeadsetIcon className="w-8 h-8" />,
    },
  ];

  const testimonials = [
    {
      id: '1',
      name: 'Robert Davis',
      role: 'Homeowner',
      content: 'The Zenon team installed a complete solar and automation system for our home. Their professionalism and attention to detail were exceptional. We\'ve been enjoying significant energy savings and enhanced security ever since.',
      rating: 5,
    },
    {
      id: '2',
      name: 'Jennifer Martinez',
      role: 'Business Owner',
      content: 'We hired Zenon Electrics for our office security system upgrade. Their team designed a comprehensive solution that perfectly addressed our needs. The installation was smooth, and their ongoing support has been invaluable.',
      rating: 5,
    },
  ];

  return (
    <>
      <div className="py-8">
        <div className="container">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
              Our Service Offerings
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              From consultation to ongoing support, we provide end-to-end solutions
            </p>
          </div>
          
          <Searchbar className="mb-8" />
          
          <ServicesComponent services={services} />
        </div>
      </div>
      
      <ProcessSection 
        title="Our Service Process"
        subtitle="How we deliver exceptional service from start to finish"
        steps={processSteps}
      />
      
      <Testimonials 
        title="Client Testimonials"
        subtitle="What our customers say about our services"
        testimonials={testimonials}
      />
      
      <CTA
        title="Ready to Enhance Your Space?"
        description="Contact us today for a free consultation and discover how our services can benefit you."
        primaryButton={{ text: 'Schedule Consultation', href: '/contact' }}
        secondaryButton={{ text: 'Call Now: +123 456 7890', href: 'tel:+1234567890' }}
      />
    </>
  );
}