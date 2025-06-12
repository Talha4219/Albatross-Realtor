
import type { Property, Agent, Project, Testimonial, BlogPost } from '@/types';

export const mockAgents: Agent[] = [
  {
    id: 'alice-wonderland',
    name: 'Alice Wonderland',
    phone: '555-123-4567',
    email: 'alice@estateexplore.com',
    imageUrl: 'https://placehold.co/100x100.png',
    isVerified: true,
    specialty: 'Luxury Homes in Pleasantville',
    rating: 4.8,
  },
  {
    id: 'bob-the-builder',
    name: 'Bob The Builder',
    phone: '555-987-6543',
    email: 'bob@estateexplore.com',
    imageUrl: 'https://placehold.co/100x100.png',
    isVerified: false,
    specialty: 'Downtown Apartments & Lofts',
    rating: 4.2,
  },
  {
    id: 'carol-danvers',
    name: 'Carol Danvers',
    phone: '555-222-3333',
    email: 'carol@estateexplore.com',
    imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxNXx8bXVsdGFuJTIwbWVufGVufDB8fHx8MTc0OTcwNTQwOHww&ixlib=rb-4.1.0&q=80&w=1080',
    isVerified: true,
    specialty: 'Suburban Family Townhouses',
    rating: 4.9,
  },
  {
    id: 'david-copperfield',
    name: 'David Copperfield',
    phone: '555-444-5555',
    email: 'david@estateexplore.com',
    imageUrl: 'https://placehold.co/100x100.png',
    isVerified: false,
    specialty: 'Waterfront Properties & Condos',
    rating: 4.5,
  },
];


export const mockProperties: Property[] = [
  {
    id: '1',
    address: '123 Main St',
    city: 'Pleasantville',
    state: 'CA',
    zip: '90210',
    price: 750000,
    bedrooms: 3,
    bathrooms: 2,
    areaSqFt: 1800,
    description: 'Charming single-family home in a quiet neighborhood. Features a spacious backyard and updated kitchen. Perfect for families.',
    images: [
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
    ],
    propertyType: 'House',
    yearBuilt: 1985,
    features: ['Hardwood Floors', 'Granite Countertops', 'Fenced Yard', '2-Car Garage', 'Furnished', 'Pool Access'],
    agent: mockAgents.find(a => a.id === 'alice-wonderland'),
    latitude: 34.0522,
    longitude: -118.2437,
    status: 'For Sale',
    postedDate: '2024-07-15T10:00:00Z',
    isVerified: true,
  },
  {
    id: '2',
    address: '456 Oak Ave',
    city: 'Metropolis',
    state: 'NY',
    zip: '10001',
    price: 1200000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1200,
    description: 'Modern apartment in the heart of the city. Stunning views, rooftop pool, and concierge service. Walk to shops and restaurants.',
    images: [
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
    ],
    propertyType: 'Apartment',
    yearBuilt: 2018,
    features: ['City View', 'Rooftop Pool', 'Gym', 'Concierge', 'Valet Parking', 'Pool'],
    agent: mockAgents.find(a => a.id === 'bob-the-builder'),
    latitude: 40.7128,
    longitude: -74.0060,
    status: 'For Sale',
    postedDate: '2024-07-20T14:30:00Z',
    isVerified: false,
  },
  {
    id: '3',
    address: '789 Pine Ln',
    city: 'Suburbia',
    state: 'TX',
    zip: '75001',
    price: 450000,
    bedrooms: 4,
    bathrooms: 3,
    areaSqFt: 2500,
    description: 'Spacious townhouse with a community pool and park. Great school district. Ideal for growing families. Not furnished.',
    images: [
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
    ],
    propertyType: 'Townhouse',
    yearBuilt: 2005,
    features: ['Community Pool', 'Playground', 'Attached Garage', 'Patio'],
    agent: mockAgents.find(a => a.id === 'carol-danvers'),
    latitude: 32.7767,
    longitude: -96.7970,
    status: 'For Rent',
    postedDate: '2024-06-30T09:00:00Z',
    isVerified: true,
  },
   {
    id: '4',
    address: '101 River Rd',
    city: 'Riverside',
    state: 'FL',
    zip: '33301',
    price: 980000,
    bedrooms: 3,
    bathrooms: 2.5,
    areaSqFt: 2200,
    description: 'Beautiful waterfront condo with boat slip. Panoramic ocean views and luxury amenities. Gated community. Furnished option available.',
    images: [
      'https://placehold.co/600x400.png',
      'https://placehold.co/600x400.png',
    ],
    propertyType: 'Condo',
    yearBuilt: 2010,
    features: ['Waterfront', 'Boat Slip', 'Ocean View', 'Fitness Center', 'Gated Community', 'Furnished'],
    agent: mockAgents.find(a => a.id === 'david-copperfield'),
    latitude: 26.1224,
    longitude: -80.1373,
    status: 'Sold',
    postedDate: '2024-05-10T12:00:00Z',
    isVerified: true,
  },
  {
    id: '5',
    address: '22 Sky High Apt',
    city: 'Metropolis',
    state: 'NY',
    zip: '10002',
    price: 2500000,
    bedrooms: 4,
    bathrooms: 3.5,
    areaSqFt: 3000,
    description: 'Luxurious penthouse with private elevator and panoramic city views. Fully furnished with designer pieces.',
    images: ['https://placehold.co/600x400.png'],
    propertyType: 'Apartment',
    yearBuilt: 2022,
    features: ['Private Elevator', 'Panoramic View', 'Furnished', 'Smart Home System', 'Terrace'],
    agent: mockAgents.find(a => a.id === 'alice-wonderland'), 
    status: 'For Sale',
    postedDate: '2024-07-25T10:00:00Z',
    isVerified: true,
  },
  {
    id: '6',
    address: '77 Green Valley',
    city: 'Pleasantville',
    state: 'CA',
    zip: '90211',
    price: 850000,
    bedrooms: 3,
    bathrooms: 2,
    areaSqFt: 1950,
    description: 'Eco-friendly home with solar panels and a large garden. No pool but very spacious.',
    images: ['https://placehold.co/600x400.png'],
    propertyType: 'House',
    yearBuilt: 2015,
    features: ['Solar Panels', 'Large Garden', 'Recycled Materials', 'Rainwater Harvesting'],
    agent: mockAgents.find(a => a.id === 'bob-the-builder'), 
    status: 'For Sale',
    postedDate: '2024-07-22T10:00:00Z',
    isVerified: true,
  },
  {
    id: 'property-usa-1',
    address: '123 Liberty Ave',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    price: 1250000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqFt: 1100,
    description: 'Classic brownstone apartment in a prime NYC location.',
    images: ['https://placehold.co/600x400.png'],
    propertyType: 'Apartment',
    yearBuilt: 1910,
    latitude: 40.7128,
    longitude: -74.0060,
    status: 'For Sale',
    postedDate: '2024-07-01T00:00:00Z',
    isVerified: true,
  },
  {
    id: 'property-pakistan-1',
    address: '456 Gulberg Rd',
    city: 'Lahore',
    state: 'Punjab',
    zip: '54000',
    price: 250000, // USD equivalent for example
    bedrooms: 5,
    bathrooms: 4,
    areaSqFt: 3500,
    description: 'Spacious family home in a well-established Lahore neighborhood.',
    images: ['https://placehold.co/600x400.png'],
    propertyType: 'House',
    yearBuilt: 2005,
    latitude: 31.5204,
    longitude: 74.3587,
    status: 'For Sale',
    postedDate: '2024-07-05T00:00:00Z',
    isVerified: true,
  },
  {
    id: 'property-brazil-1',
    address: '789 Ipanema Beach Ave',
    city: 'Rio de Janeiro',
    state: 'RJ',
    zip: '22410-002',
    price: 950000,
    bedrooms: 3,
    bathrooms: 3,
    areaSqFt: 1500,
    description: 'Stunning apartment with ocean views in Ipanema.',
    images: ['https://placehold.co/600x400.png'],
    propertyType: 'Apartment',
    yearBuilt: 1995,
    latitude: -22.9836,
    longitude: -43.2045,
    status: 'For Rent',
    postedDate: '2024-07-10T00:00:00Z',
    isVerified: true,
  },
];

export const mockProjectsData: Project[] = [
  {
    id: 'proj1',
    name: 'Skyline Towers',
    location: 'Metropolis Downtown',
    developer: 'Prestige Developers Inc.',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'modern skyscraper residential',
    description: 'Luxury apartments with breathtaking city views and state-of-the-art amenities.',
    keyHighlights: ['Luxury Apartments', 'Rooftop Pool', 'Smart Homes'],
    amenities: ['Rooftop Pool', 'Gym', 'Concierge', 'Smart Homes', 'Private Cinema'],
    isVerified: true,
    status: 'Trending',
    timeline: 'Completion Q4 2025',
    learnMoreLink: '/new-projects#skyline-towers',
  },
  {
    id: 'proj2',
    name: 'Greenwood Villas',
    location: 'Suburbia Greens',
    developer: 'EcoBuild Homes Ltd.',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'eco-friendly houses suburban',
    description: 'Eco-friendly villas nestled in nature, offering a sustainable and serene lifestyle.',
    keyHighlights: ['Eco-Friendly Villas', 'Community Garden', 'Solar Panels'],
    amenities: ['Solar Panels', 'Community Garden', 'Clubhouse', 'Jogging Tracks', 'Yoga Studio'],
    isVerified: true,
    status: 'Upcoming',
    timeline: 'Phase 1 Ready Q2 2025',
    learnMoreLink: '/new-projects#greenwood-villas',
  },
  {
    id: 'proj3',
    name: 'Commerce Hub',
    location: 'Central Business District',
    developer: 'UrbanConstruct Co.',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'commercial building office',
    description: 'State-of-the-art commercial plaza with modern office spaces and retail outlets.',
    keyHighlights: ['Commercial Plaza', 'Prime Location', 'Flexible Office Spaces'],
    amenities: ['High-speed Internet', 'Ample Parking', 'Food Court', 'Conference Halls', '24/7 Security'],
    isVerified: false,
    status: 'Launched',
    timeline: 'Operational',
    learnMoreLink: '/new-projects#commerce-hub',
  },
  {
    id: 'proj4',
    name: 'Orchard County Plots',
    location: 'Pleasantville Outskirts',
    developer: 'Landmark Holdings',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'land plot development',
    description: 'Residential plots in a master-planned community with lush green spaces.',
    keyHighlights: ['Residential Plots', 'Gated Community', 'Easy Installments'],
    amenities: ['Parks & Green Areas', 'Community Center', 'School Inside', 'Hospital Nearby'],
    isVerified: true,
    status: 'Trending',
    timeline: 'Booking Open',
    learnMoreLink: '/new-projects#orchard-county',
  },
];

export const mockTestimonials: Testimonial[] = [
  {
    id: 'testimonial1',
    name: 'Sarah K.',
    role: 'Homebuyer',
    quote: "Estate Explore made finding our dream home so easy! The verified listings gave us peace of mind, and the AI chat was surprisingly helpful.",
    imageUrl: 'https://placehold.co/80x80.png',
    dataAiHint: 'happy person portrait',
    rating: 5,
    successTag: "Found Home in Pleasantville",
  },
  {
    id: 'testimonial2',
    name: 'John B.',
    role: 'Real Estate Agent',
    quote: "Listing my properties on Estate Explore has significantly increased my leads. The platform is user-friendly and the agent tools are great.",
    imageUrl: 'https://placehold.co/80x80.png',
    dataAiHint: 'professional agent',
    rating: 4.5,
    successTag: "Increased Sales by 20%",
  },
  {
    id: 'testimonial3',
    name: 'Ahmed & Fatima',
    role: 'Investors',
    quote: "We found an amazing investment opportunity in a new project showcased on Estate Explore. The market insights helped us make an informed decision.",
    imageUrl: 'https://placehold.co/80x80.png',
    dataAiHint: 'couple smiling',
    rating: 5,
    successTag: "Invested in Skyline Towers",
  },
  {
    id: 'testimonial4',
    name: 'Maria L.',
    role: 'Renter',
    quote: "The search filters are fantastic! I found the perfect apartment to rent within my budget in just a few days. Highly recommend this platform.",
    imageUrl: 'https://placehold.co/80x80.png',
    dataAiHint: 'young woman student',
    rating: 4,
    successTag: "Rented Apartment in Metropolis",
  },
];

export const mockBlogPosts: BlogPost[] = [
  {
    id: 'blog1',
    title: 'How to Buy a Home in Pleasantville in 2025',
    excerpt: 'Learn the essential steps to secure your dream home in Pleasantville with confidence this year.',
    imageUrl: 'https://placehold.co/300x200.png',
    dataAiHint: 'house keys contract',
    category: 'Buying Guide',
    slug: 'how-to-buy-home-pleasantville-2025',
    author: 'Alice Wonderland',
    date: '2024-07-28T10:00:00Z',
  },
  {
    id: 'blog2',
    title: '5 Tips for Selling Your Plot Fast in Metropolis',
    excerpt: 'Maximize your plot\'s value and attract buyers quickly with these expert selling strategies.',
    imageUrl: 'https://placehold.co/300x200.png',
    dataAiHint: 'land plot for sale sign',
    category: 'Selling Tips',
    slug: '5-tips-selling-plot-fast-metropolis',
    author: 'Bob The Builder',
    date: '2024-07-25T14:30:00Z',
  },
  {
    id: 'blog3',
    title: 'Understanding Real Estate Market Trends in Suburbia',
    excerpt: 'Dive into the latest market insights for Suburbia to make informed investment decisions.',
    imageUrl: 'https://placehold.co/300x200.png',
    dataAiHint: 'market graph chart city',
    category: 'Market Insights',
    slug: 'understanding-real-estate-market-trends-suburbia',
    author: 'Carol Danvers',
    date: '2024-07-22T09:00:00Z',
  },
  {
    id: 'blog4',
    title: 'Navigating Legal Aspects of Property Investment',
    excerpt: 'A comprehensive guide to understanding the legalities involved in property investment to protect your assets.',
    imageUrl: 'https://placehold.co/300x200.png',
    dataAiHint: 'legal document gavel',
    category: 'Legal Advice',
    slug: 'navigating-legal-aspects-property-investment',
    author: 'David Copperfield',
    date: '2024-07-20T12:00:00Z',
  },
];


export const getPropertyById = (id: string): Property | undefined => {
  return mockProperties.find(p => p.id === id);
};

export const getAgentById = (agentId: string): Agent | undefined => {
  const allAgentsFromProperties = mockProperties.map(p => p.agent).filter(Boolean) as Agent[];
  const uniqueAgentsMap = new Map<string, Agent>();

  allAgentsFromProperties.forEach(agent => {
    if (agent.id && !uniqueAgentsMap.has(agent.id)) {
      uniqueAgentsMap.set(agent.id, agent);
    }
  });
  
  mockAgents.forEach(agent => {
    if (agent.id && !uniqueAgentsMap.has(agent.id)) {
      uniqueAgentsMap.set(agent.id, agent);
    }
  });
  
  return uniqueAgentsMap.get(agentId);
};

export const getProjectById = (id: string): Project | undefined => {
  return mockProjectsData.find(p => p.id === id);
};

export const getTestimonialById = (id: string): Testimonial | undefined => {
  return mockTestimonials.find(t => t.id === id);
};

export const getBlogPostById = (id: string): BlogPost | undefined => {
  return mockBlogPosts.find(b => b.id === id);
};

export const getBlogPostsBySlug = (slug: string): BlogPost | undefined => {
  return mockBlogPosts.find(b => b.slug === slug);
};

