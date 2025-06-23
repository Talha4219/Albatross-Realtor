
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import User from '@/models/User'; 
import { z } from 'zod';
import type { PropertyTypeEnum, PropertyStatusEnum } from '@/types';
import mongoose from 'mongoose';

const propertyTypes: [PropertyTypeEnum, ...PropertyTypeEnum[]] = ['House', 'Apartment', 'Condo', 'Townhouse', 'Land'];
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
  images: z.array(z.string().url()).min(1),
  features: z.array(z.string()).optional(),
});

export async function GET(request: NextRequest) {
  const userRole = request.headers.get('x-user-role'); 
  const { searchParams } = new URL(request.url);
  const submittedById = searchParams.get('submittedById');
  const statusFilter = searchParams.get('status') as PropertyStatusEnum | null;
  const searchQuery = searchParams.get('search');

  try {
    await dbConnect();
    
    let query: any = {}; 
    
    if (userRole === 'admin') {
      if (submittedById && mongoose.Types.ObjectId.isValid(submittedById)) {
        query.submittedBy = new mongoose.Types.ObjectId(submittedById);
      }
      if (statusFilter && propertyStatuses.includes(statusFilter)) {
        query.status = statusFilter;
      }
    } else {
      query.approvalStatus = 'Approved';
      if (statusFilter && (statusFilter === 'For Sale' || statusFilter === 'For Rent')) {
        query.status = statusFilter;
      } else if (statusFilter) {
        return NextResponse.json({ success: true, data: [] }, { status: 200 });
      }
    }
    
    if (searchQuery) {
      const regex = new RegExp(searchQuery, 'i');
      query.$or = [
        { address: { $regex: regex } },
        { city: { $regex: regex } },
        { state: { $regex: regex } },
        { zip: { $regex: regex } },
        { description: { $regex: regex } }
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
      images: propertyData.images.filter(img => img.trim() !== ''),
      features: propertyData.features?.filter(feat => feat.trim() !== '') || [],
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
