import type { Types } from 'mongoose';
import type { UserRole } from '@/models/User';

export type PropertyTypeEnum = 'House' | 'Apartment' | 'Condo' | 'Townhouse' | 'Land';
export type PropertyStatusEnum = 'For Sale' | 'For Rent' | 'Sold' | 'Pending Approval' | 'Draft';
export type PropertyApprovalStatusEnum = 'Pending' | 'Approved' | 'Rejected';
export const blogCategories = ['Buying Guide', 'Selling Guide', 'Market Trends', 'General Guide', 'News'] as const;
export type BlogCategory = (typeof blogCategories)[number];

// User interface for frontend and API responses (excluding sensitive data like passwordHash)
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  profilePictureUrl?: string;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  description: string;
  images: string[];
  propertyType: PropertyTypeEnum;
  yearBuilt?: number;
  features?: string[];
  latitude?: number;
  longitude?: number;
  status: PropertyStatusEnum;
  postedDate: string; // ISO date string
  isVerified?: boolean;
  approvalStatus?: PropertyApprovalStatusEnum;
  submittedBy?: string | Types.ObjectId | UserProfile; // Can be ID string or populated UserProfile
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface Project {
  id: string;
  name: string;
  location: string;
  developer: string;
  imageUrl: string; // Make mandatory for consistency with model
  dataAiHint?: string;
  description?: string;
  keyHighlights: string[]; // Make mandatory for consistency with model
  amenities?: string[];
  isVerified?: boolean;
  status?: 'Upcoming' | 'Trending' | 'Launched';
  timeline?: string;
  learnMoreLink?: string;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  imageUrl?: string;
  dataAiHint?: string;
  rating: number;
  successTag?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string; // Add full content for the blog post page
  imageUrl: string;
  dataAiHint?: string;
  category: BlogCategory;
  author?: string;
  tags?: string[];
  status: 'published' | 'draft';
  approvalStatus?: PropertyApprovalStatusEnum;
  submittedBy?: UserProfile;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}
