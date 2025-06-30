

import type { Types } from 'mongoose';

export type UserRole = 'user' | 'agent' | 'admin';
export type PropertyTypeEnum = 
  'House' | 'Apartment' | 'Condo' | 'Townhouse' | 'Land' | 'Plot' | 
  'Flat' | 'Upper Portion' | 'Lower Portion' | 'Farm House' | 'Room' | 'Penthouse' |
  'Residential Plot' | 'Commercial Plot' | 'Agricultural Land' | 'Industrial Land' | 'Plot File' | 'Plot Form' |
  'Office' | 'Shop' | 'Warehouse' | 'Factory' | 'Building' | 'Other';
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
  phone?: string;
  isEmailVerified?: boolean;
  createdAt?: string; // ISO date string
  updatedAt?: string; // ISO date string
}

export interface Agent extends UserProfile {
  specialty?: string;
  rating?: number;
  isVerified?: boolean;
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
  yearBuilt?: number | null; // Allow null
  features?: string[];
  latitude?: number;
  longitude?: number;
  status: PropertyStatusEnum;
  postedDate: string; // ISO date string
  isVerified?: boolean;
  approvalStatus?: PropertyApprovalStatusEnum;
  submittedBy?: UserProfile; 
  agent?: Agent; // Agent specific details.
  views?: number;
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
  submittedBy?: UserProfile;
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
