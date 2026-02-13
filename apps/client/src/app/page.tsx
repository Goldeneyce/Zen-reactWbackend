// app/page.tsx
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Categories from '@/components/Categories';
import Services from '@/components/Services';
import Testimonials from '@/components/Testimonials';
import CTA from '@/components/CTA';

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
      content: 'We hired Zentrics for our office security system upgrade. Their team designed a comprehensive solution that perfectly addressed our needs. The installation was smooth, and their ongoing support has been invaluable.',
      rating: 5,
    },
  ];

export default function Home() {
  return (
    <>
      <Hero title="Smart Solutions for Modern Living" subtitle="Zentrics provides cutting-edge solar power, home automation, and security solutions to transform your space into an efficient, secure, and sustainable environment." showSearch={true} />
      <Features />
      <Categories />
      <Services services={[]} />
      <Testimonials 
        title="What Our Clients Say"
        subtitle="Hear from those who have experienced our services"
        testimonials={testimonials}
      />
      <CTA 
        title="Ready to Get Started?" 
        description="Join us today and experience the difference" 
        primaryButton={{ text: "Get Started", href: "/get-started" }} 
      />
    </>
  );
}