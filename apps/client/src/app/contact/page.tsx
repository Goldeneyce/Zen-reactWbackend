// app/contact/page.tsx
'use client';

import { useState } from 'react';
import Searchbar from '@/components/Searchbar';
import FAQSection from '@/components/FAQSection';
import {
  LocationIcon,
  PhoneIcon,
  EmailIcon,
  ClockIcon,
} from '@/components/Icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ContactFormData } from '@/types';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  service: z.string().min(1, 'Please select a service'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Form submitted:', data);
      setSubmitSuccess(true);
      reset();
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs: Array<{ id: string; question: string; answer: string; category: 'products' | 'services' }> = [
    {
      id: '1',
      question: 'How long does installation take?',
      answer: 'Installation time varies based on the project complexity. A typical home automation system takes 1-3 days, while solar installations may take 2-5 days. We provide a detailed timeline during our consultation.',
      category: 'products',
    },
    {
      id: '2',
      question: 'Do you offer maintenance plans?',
      answer: 'Yes, we offer comprehensive maintenance plans for all our installations. Our plans include regular check-ups, priority service, and discounts on parts. Contact us for plan details and pricing.',
      category: 'products',
    },
    {
      id: '3',
      question: 'What warranties do you provide?',
      answer: 'We provide product warranties as per manufacturer specifications, typically 1-5 years. Our workmanship warranty covers installation for 2 years. Extended warranties are available for most products.',
      category: 'services',
    },
    {
      id: '4',
      question: 'Can I integrate existing systems?',
      answer: 'In most cases, yes! We specialize in integrating new solutions with existing systems. During our consultation, we\'ll assess your current setup and recommend the best integration approach.',
      category: 'services',
    },
  ];

  return (
    <>
      <Searchbar className="my-8" />
      
      <section className="py-8 bg-light dark:bg-light-dark">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white dark:bg-white-dark p-8 rounded-lg shadow-custom dark:shadow-dark-custom">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">
                Request a Quote
              </h2>
              
              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 rounded-lg">
                  Thank you for your inquiry! We'll contact you within 24 hours.
                </div>
              )}
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-secondary"
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-secondary"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-secondary"
                    {...register('phone')}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>
                
                <div>
                  <select
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-secondary"
                    {...register('service')}
                    defaultValue=""
                  >
                    <option value="" disabled>Service Interested In</option>
                    <option value="solar">Solar Solutions</option>
                    <option value="automation">Home Automation</option>
                    <option value="security">Security Systems</option>
                    <option value="installation">Installation Services</option>
                    <option value="maintenance">Maintenance & Repair</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.service && (
                    <p className="mt-1 text-sm text-red-500">{errors.service.message}</p>
                  )}
                </div>
                
                <div>
                  <textarea
                    placeholder="Message"
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-white-dark text-dark dark:text-light focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
                    {...register('message')}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            </div>
            
            {/* Contact Details */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-white-dark p-6 rounded-lg shadow-custom dark:shadow-dark-custom text-center">
                  <LocationIcon className="w-8 h-8 text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-primary mb-2">Our Location</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    123 Tech Avenue, Innovation City
                  </p>
                </div>
                
                <div className="bg-white dark:bg-white-dark p-6 rounded-lg shadow-custom dark:shadow-dark-custom text-center">
                  <PhoneIcon className="w-8 h-8 text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-primary mb-2">Phone Number</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    +123 456 7890
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Mon-Fri: 8:00 AM - 6:00 PM
                  </p>
                </div>
                
                <div className="bg-white dark:bg-white-dark p-6 rounded-lg shadow-custom dark:shadow-dark-custom text-center">
                  <EmailIcon className="w-8 h-8 text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-primary mb-2">Email Address</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    info@zenonelectrics.com
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    support@zenonelectrics.com
                  </p>
                </div>
                
                <div className="bg-white dark:bg-white-dark p-6 rounded-lg shadow-custom dark:shadow-dark-custom text-center">
                  <ClockIcon className="w-8 h-8 text-secondary mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-primary mb-2">Business Hours</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Monday-Friday: 8:00 AM - 6:00 PM
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Saturday: 9:00 AM - 4:00 PM
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Sunday: Closed
                  </p>
                </div>
              </div>
              
              {/* Map */}
              <div className="bg-white dark:bg-white-dark rounded-lg shadow-custom dark:shadow-dark-custom overflow-hidden h-75">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.24126455984!2d-73.98784368458957!3d40.748440979328!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1690000000000"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Zenon Electrics Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <FAQSection 
        title="Frequently Asked Questions"
        subtitle="Common questions about our products and services"
        faqs={faqs}
      />
    </>
  );
}