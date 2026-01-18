// app/products/[id]/page.tsx
import ProductDetailClient from './ProductDetailClient';
import { Product } from '@/types';

// This would normally come from an API/database
const product = {
  id: '1',
  name: 'UltraHD 4K LED Projector',
  description: 'Experience cinema-quality entertainment in the comfort of your home with our UltraHD 4K LED Projector. This state-of-the-art projector delivers stunning 4K resolution with HDR10 support, ensuring vibrant colors and exceptional detail. Perfect for movie nights, gaming, and presentations, this projector features smart connectivity, built-in streaming apps, and a long-lasting LED light source that provides up to 30,000 hours of viewing.',
  price: 349.99,
  originalPrice: 499.99,
  category: 'entertainment',
  image: '/products/laptop.avif',
  images: [
    '/products/laptop.avif',
    '/products/tab.avif',
    '/products/tvRemote.avif',
    '/products/fridge.avif',
  ],
  sizes: ['Mini', 'Standard', 'Pro'],
  colors: ['Black', 'Silver', 'Carbon'],
  rating: 4.5,
  reviews: 142,
  features: [
    'Native 4K UHD Resolution (3840 x 2160)',
    'HDR10 Support for Enhanced Color & Contrast',
    'Smart TV with Built-in Android OS',
    '3,500 Lumens Brightness',
    '1,000,000:1 Dynamic Contrast Ratio',
    'Wi-Fi & Bluetooth Connectivity',
    'Multiple HDMI & USB Ports',
    'Built-in 20W Stereo Speakers',
    'LED Light Source with 30,000 Hour Lifespan',
    'Keystone Correction & Auto Focus',
  ],
  specifications: [
    { key: 'Resolution', value: '4K UHD (3840x2160)' },
    { key: 'Brightness', value: '3,500 Lumens' },
    { key: 'Contrast Ratio', value: '1,000,000:1' },
    { key: 'Light Source', value: 'LED (30,000 hours)' },
    { key: 'Connectivity', value: 'Wi-Fi, Bluetooth, 3x HDMI, 2x USB' },
    { key: 'Sound', value: 'Built-in 20W Stereo Speakers' },
    { key: 'Throw Ratio', value: '1.2:1' },
    { key: 'Dimensions', value: '12.6" x 9.8" x 4.7"' },
    { key: 'Weight', value: '8.8 lbs' },
  ],
  inStock: true,
  badge: 'New',
} as Product;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}) {
  // TODO: get the product from db
  // TEMPORARY
  return {
    title: product.name,
    description: product.description,
  };
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return <ProductDetailClient product={product} />;
}