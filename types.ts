export interface Product {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  category: 'Utility' | 'Security' | 'Design' | 'Gaming';
  rating: number;
  reviews: number;
  image: string;
  features: string[];
  version: string;
  downloadSize: string;
  fileUrl?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar: string;
}

export type SortOption = 'price-asc' | 'price-desc' | 'rating' | 'newest';
