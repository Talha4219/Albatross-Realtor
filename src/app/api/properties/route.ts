
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import User from '@/models/User'; 
import { mockAgents } from '@/lib/mock-data';
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
  agentId: z.string().optional().nullable(),
});

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@albatrossrealtor.com';


export async function GET(request: NextRequest) {
  const userEmail = request.headers.get('x-user-email'); 
  const submittedById = request.nextUrl.searchParams.get('submittedById');
  const statusFilter = request.nextUrl.searchParams.get('status') as PropertyStatusEnum | null;

  try {
    await dbConnect();
    
    let query: any = {}; 
    
    if (userEmail === ADMIN_EMAIL) {
      // Admin can see all properties, or filter by submittedById if provided
      if (submittedById && mongoose.Types.ObjectId.isValid(submittedById)) {
        query.submittedBy = new mongoose.Types.ObjectId(submittedById);
      }
      // Admin can also filter by status if provided (e.g. for specific admin views)
      if (statusFilter && propertyStatuses.includes(statusFilter)) {
        query.status = statusFilter;
      }
    } else {
      // Non-admins only see approved properties
      query.approvalStatus = 'Approved';
      // If status filter is provided for public view, it must be 'For Sale' or 'For Rent'
      if (statusFilter && (statusFilter === 'For Sale' || statusFilter === 'For Rent')) {
        query.status = statusFilter;
      } else if (statusFilter) {
        // If any other status is requested by non-admin, return empty or error
        return NextResponse.json({ success: true, data: [] }, { status: 200 }); // Or 403 Forbidden
      }
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

    const { agentId, ...propertyData } = validation.data;
    
    let agentDetails = null;
    if (agentId) {
      const foundAgent = mockAgents.find(a => a.id === agentId); 
      if (foundAgent) {
        agentDetails = {
          id: foundAgent.id,
          name: foundAgent.name,
          email: foundAgent.email,
          phone: foundAgent.phone,
          imageUrl: foundAgent.imageUrl,
          isVerified: foundAgent.isVerified,
          specialty: foundAgent.specialty,
          rating: foundAgent.rating,
        };
      } else {
         console.warn(`Agent with ID ${agentId} not found in mock data during property submission.`);
      }
    }

    const newPropertyData: any = {
      ...propertyData,
      images: propertyData.images.filter(img => img.trim() !== ''),
      features: propertyData.features?.filter(feat => feat.trim() !== '') || [],
      approvalStatus: 'Pending', 
      status: propertyData.status === 'Pending Approval' || !propertyData.status ? 'Pending Approval' : propertyData.status, 
      isVerified: false, 
      submittedBy: new mongoose.Types.ObjectId(userId) 
    };

    if (agentDetails) {
      newPropertyData.agent = agentDetails;
    }
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
