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

