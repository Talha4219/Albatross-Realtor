
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
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
  address: z.string().optional(),
  city: z.string().optional(),
  price: z.coerce.number().optional(),
  bedrooms: z.coerce.number().int().optional(),
  bathrooms: z.coerce.number().optional(),
  areaSqFt: z.coerce.number().optional(),
  description: z.string().optional(),
  propertyType: z.enum(propertyTypes).optional(),
  status: z.enum(['For Sale', 'For Rent', 'Draft']).optional(),
  yearBuilt: z.coerce.number().optional().nullable().refine(val => val === null || val === undefined || (val >= 1800 && val <= new Date().getFullYear() + 5), {
    message: `Year built must be between 1800 and ${new Date().getFullYear() + 5} or empty.`
  }),
  images: z.array(z.string()).optional(),
  features: z.array(z.string()).optional(),
}).refine(data => {
    if (data.propertyType && ['Plot', 'Land', 'Residential Plot', 'Commercial Plot', 'Agricultural Land', 'Industrial Land', 'Plot File', 'Plot Form'].includes(data.propertyType)) {
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

  const searchQuery = searchParams.get('search');
  const statusFilter = searchParams.get('status') as PropertyStatusEnum | null;
  const propertyTypeFilter = searchParams.get('propertyType') as PropertyTypeEnum | null;
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const beds = searchParams.get('beds');
  const baths = searchParams.get('baths');
  const minArea = searchParams.get('minArea');
  const maxArea = searchParams.get('maxArea');
  const submittedById = searchParams.get('submittedById');
  const approvalStatusFilter = searchParams.get('approvalStatus');

  try {
    await dbConnect();
    let query: any = {};
    
    // Default for public users is to only see approved properties
    if (userRole !== 'admin') {
      query.approvalStatus = 'Approved';
    } else {
      // Admins can filter by approval status
      if (approvalStatusFilter && ['Pending', 'Approved', 'Rejected'].includes(approvalStatusFilter)) {
        query.approvalStatus = approvalStatusFilter;
      }
    }

    if (submittedById && mongoose.Types.ObjectId.isValid(submittedById)) {
      query.submittedBy = new mongoose.Types.ObjectId(submittedById);
    }
    
    if (statusFilter && propertyStatuses.includes(statusFilter) && ['For Sale', 'For Rent'].includes(statusFilter)) {
        query.status = statusFilter;
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
        { description: { $regex: regex } },
        { propertyType: { $regex: regex } },
      ];
    }

    const properties = await Property.find(query)
                                     .sort({ createdAt: -1 })
                                     .populate('submittedBy', 'name email');

    return NextResponse.json({ success: true, data: properties.map(p => p.toObject()) }, { status: 200 });
  } catch (error) {
    console.error("API Error fetching properties:", error);
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const userId = request.headers.get('x-user-id');
  const userRole = request.headers.get('x-user-role');

  if (!userId) {
    return NextResponse.json({ success: false, error: 'Unauthorized: User ID not found.' }, { status: 401 });
  }
  if (!mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ success: false, error: "Invalid user ID format." }, { status: 400 });
  }
  if (userRole !== 'agent' && userRole !== 'admin') {
    return NextResponse.json({ success: false, error: 'Forbidden: Only agents and admins can post properties.' }, { status: 403 });
  }

  try {
    await dbConnect();
    const body = await request.json();

    const validation = PropertyAPISchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: "Invalid input data.", details: validation.error.flatten() }, { status: 400 });
    }

    const propertyData = validation.data;
    const newPropertyData: any = {
      ...propertyData,
      submittedBy: new mongoose.Types.ObjectId(userId),
    };

    // Admins and Agents can auto-approve their own listings.
    if (userRole === 'admin' || userRole === 'agent') {
      newPropertyData.approvalStatus = 'Approved';
    }

    if (propertyData.yearBuilt === null || propertyData.yearBuilt === undefined) {
      delete newPropertyData.yearBuilt;
    }

    const property = await Property.create(newPropertyData);
    return NextResponse.json({ success: true, data: property.toObject() }, { status: 201 });
  } catch (error) {
    console.error("API Error creating property:", error);
    let errorMessage = 'An unknown error occurred.';
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: "Validation error.", details: error.flatten() }, { status: 400 });
    }
    if (error instanceof Error) errorMessage = error.message;
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
