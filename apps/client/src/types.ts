// types.ts
export interface Category {
  id: number;
  name: string;
  slug: string;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: ProductCategory;
  categories?: Category[];
  image: string;
  images?: string[];
  rating: number;
  reviews: number;
  features: string[];
  specifications: ProductSpecification[];
  inStock: boolean;
  badge?: 'New' | 'Best Seller' | 'Smart' | 'Energy Efficient' | 'Top Rated';
}

export interface ProductSpecification {
  key: string;
  value: string;
}

export type ProductCategory = 
  | 'all'
  | 'power'
  | 'appliances'
  | 'entertainment'
  | 'kitchen'
  | 'security'
  | 'cooling'
  | 'solar'
  | 'automation'
  | 'lighting';

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  features: string[];
  icon: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'products' | 'services';
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ShippingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface PaymentFormData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export type Theme = 'light' | 'dark';