export interface MediaItem {
  url: string;
  type: 'image' | 'video';
}

export interface Project {
  _id?: string;
  id: string;
  title: string;
  description: string;
  client: string;
  year: number;
  section: Section;
  images: string[];
  media?: MediaItem[];
  heroMedia?: string;
  tags?: string[];
  reflection?: string;
  featured?: boolean;
  order?: number;
  pricePerDay?: number; // For rental items
  categories?: string[]; // For rental items: Peanas, Módulos, Superficies para productos, A la venta, Piezas esculpidas a pedido
  createdAt?: Date;
  updatedAt?: Date;
}

export type Section = 
  | 'set-buildings'
  | 'fotografia'
  | 'art-direction'
  | 'rental';

export interface TeamMember {
  _id?: string;
  id: string;
  name: string;
  role: string;
  image: string;
  portfolio?: string;
  linkedin?: string;
  isPartner: boolean;
}

export interface GalleryPost {
  _id?: string;
  id: string;
  title: string;
  artist: string;
  date: string;
  description: string;
  images: string[];
  content: string;
}

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface User {
  _id?: string;
  username: string;
  password: string;
  role: 'admin';
}
