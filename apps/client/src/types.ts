import { shippingFormSchema, type ShippingFormData, type ProductType, type CategoryType } from "@repo/types";

export type Product = ProductType & {
  category?: ProductCategory; // UI field for category filtering; DB stores in many-to-many
  specifications?: ProductSpecification[]; // UI field; DB has relationship via ProductSpecification
  slug?: string;
  sizes?: string[];
  colors?: string[];
  createdAt?: Date;
  updatedAt?: Date;
};
export type Category = CategoryType;

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

export type ProductSpecification = {
  id?: string;
  key: string;
  value: string;
  productId?: string;
};

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  selectedSize?: string;
  selectedColor?: string;
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
  rememberMe?: boolean;
}

export { shippingFormSchema };
export type ShippingFormInputs = ShippingFormData;

