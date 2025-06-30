

import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import User from '@/models/User'; 
import { z } from 'zod';
import type { PropertyTypeEnum, PropertyStatusEnum } from '@/types';
import mongoose from 'mongoose';

const propertyTypes: [PropertyTypeEnum, ...PropertyTypeEnum[]] = [
    'House', 'Apartment', 'Condo', 'Townhouse', 'Land', 'Plot', 
    'Flat', 'Upper Portion', 'Lower Portion', 'Farm House', 'Room', 'Penthouse',
    'Residential Plot', 'Commercial Plot', 'Agricultural Land', 'Industrial Land', 'Plot File', 'Plot Form',
    'Office', 'Shop', 'Warehouse', 'Factory', 'Building', 'Other'
];
const propertyStatuses: [PropertyStatusEnum, ...PropertyStatusEnum[]] = ['For Sale', 'For Rent', 'Sold', 'Pending Approval', 'Draft'];


const PropertyAPISchema = z.object({
  address: z.string().min(5),
  city: z.string().min(2),
  state: z.string().min(2),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/),
  price: z.coerce.number().positive(),
  bedrooms: z.coerce.number().int().min(0),
  bathrooms: z.coerce.number().min(0),
  areaSqFt: z.coerce.number().positive(),
  description: z.string().min(20),
  propertyType: z.enum(propertyTypes),
  status: z.enum(propertyStatuses), 
  yearBuilt: z.coerce.number().optional().nullable(),
  images: z.array(z.string()).min(1),
  features: z.array(z.string()).optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
}).refine(data => {
    if (['Plot', 'Land', 'Residential Plot', 'Commercial Plot', 'Agricultural Land', 'Industrial Land', 'Plot File', 'Plot Form'].includes(data.propertyType)) {
        return data.bedrooms === 0 && data.bathrooms === 0;
    }
    return true;
}, {
    message: "Bedrooms and bathrooms must be 0 for a Plot or Land.",
    path: ["bedrooms"],
});


export async function GET(request: NextRequest) {
  const userRole = request.headers.get('x-user-role'); 
  const { searchParams } = new URL(request.url);
  
  // Admin/User specific filters
  const submittedById = searchParams.get('submittedById');
  
  // Search and filter parameters
  const searchQuery = searchParams.get('search'); // Main text query
  const statusFilter = searchParams.get('status') as PropertyStatusEnum | null;
  const propertyTypeFilter = searchParams.get('propertyType') as PropertyTypeEnum | null;
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const beds = searchParams.get('beds'); // Minimum beds
  const baths = searchParams.get('baths'); // Minimum baths
  const minArea = searchParams.get('minArea');
  const maxArea = searchParams.get('maxArea');

  try {
    await dbConnect();
    
    let query: any = {}; 
    
    // Non-admins only see approved properties, unless they are the owner (which this route doesn't check, handled in [id] route)
    if (userRole !== 'admin') {
      query.approvalStatus = 'Approved';
    }
    
    // For admin role, they can see all properties, but can filter by submitter
    if (userRole === 'admin') {
      if (submittedById && mongoose.Types.ObjectId.isValid(submittedById)) {
        query.submittedBy = new mongoose.Types.ObjectId(submittedById);
      }
    }
    
    // Applying search filters
    if (statusFilter && propertyStatuses.includes(statusFilter)) {
        // Non-admins can only filter by 'For Sale' or 'For Rent' publicly
        if(userRole !== 'admin' && !['For Sale', 'For Rent'].includes(statusFilter)) {
            // ignore other status filters for non-admins
        } else {
             query.status = statusFilter;
        }
    }
    
    if (propertyTypeFilter && propertyTypes.includes(propertyTypeFilter)) {
        query.propertyType = propertyTypeFilter;
    }

    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (beds) {
        query.bedrooms = { $gte: Number(beds) };
    }

    if (baths) {
        query.bathrooms = { $gte: Number(baths) };
    }

    if (minArea || maxArea) {
        query.areaSqFt = {};
        if (minArea) query.areaSqFt.$gte = Number(minArea);
        if (maxArea) query.areaSqFt.$lte = Number(maxArea);
    }
    
    if (searchQuery) {
      const regex = new RegExp(searchQuery, 'i');
      query.$or = [
        { address: { $regex: regex } },
        { city: { $regex: regex } },
        { state: { $regex: regex } },
        { zip: { $regex: regex } },
        { description: { $regex: regex } },
        { propertyType: { $regex: regex } },
      ];
    }

    const properties = await Property.find(query)
                                     .sort({ createdAt: -1 })
                                     .populate('submittedBy', 'name email'); 
    
    const transformedProperties = properties.map(prop => prop.toObject());

    return NextResponse.json({ success: true, data: transformedProperties }, { status: 200 });
  } catch (error) {
    console.error("API Error fetching properties:", error);
    let errorMessage = 'An unknown error occurred while fetching properties.';
    if (error instanceof Error) {
        if (error.message.includes("MONGODB_URI environment variable")) {
            errorMessage = "Database configuration error: MONGODB_URI is not defined. Please check server environment variables.";
            return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
        }
        errorMessage = error.message;
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id'); 

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized: User ID not found in token.' }, { status: 401 });
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, error: "Invalid user ID format from token." }, { status: 400 });
  }


  try {
    await dbConnect();
    const body = await request.json();

    const validation = PropertyAPISchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: "Invalid input data.", details: validation.error.flatten() }, { status: 400 });
    }

    const { ...propertyData } = validation.data;
    
    const newPropertyData: any = {
      ...propertyData,
      images: propertyData.images.filter(img => img?.trim() !== ''),
      features: propertyData.features?.filter(feat => feat?.trim() !== '') || [],
      approvalStatus: 'Pending', 
      status: propertyData.status === 'Pending Approval' || !propertyData.status ? 'Pending Approval' : propertyData.status, 
      isVerified: false, 
      submittedBy: new mongoose.Types.ObjectId(userId) 
    };

    if (propertyData.yearBuilt === null || propertyData.yearBuilt === undefined) {
      delete newPropertyData.yearBuilt;
    }

    const property = await Property.create(newPropertyData);
    const createdPropertyObject = property.toObject();

    return NextResponse.json({ success: true, data: createdPropertyObject }, { status: 201 });
  } catch (error) {
    console.error("API Error creating property:", error);
    let errorMessage = 'An unknown error occurred while creating the property.';
     if (error instanceof z.ZodError) {
        errorMessage = "Validation error during property creation.";
        return NextResponse.json({ success: false, error: errorMessage, details: error.flatten() }, { status: 400 });
    }
    if (error instanceof Error) {
        if (error.message.includes("MONGODB_URI environment variable")) {
            errorMessage = "Database configuration error: MONGODB_URI is not defined. Please check server environment variables.";
            return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
        }
        errorMessage = error.message;
    }
    return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
  }
}
