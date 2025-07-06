
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import mongoose from 'mongoose';
import { z } from 'zod';
import type { PropertyTypeEnum, PropertyStatusEnum } from '@/types';

const propertyTypes: [PropertyTypeEnum, ...PropertyTypeEnum[]] = [
    'House', 'Apartment', 'Condo', 'Townhouse', 'Land', 'Plot',
    'Flat', 'Upper Portion', 'Lower Portion', 'Farm House', 'Room', 'Penthouse',
    'Residential Plot', 'Commercial Plot', 'Agricultural Land', 'Industrial Land', 'Plot File', 'Plot Form',
    'Office', 'Shop', 'Warehouse', 'Factory', 'Building', 'Other'
];
const allPropertyStatuses: [PropertyStatusEnum, ...PropertyStatusEnum[]] = ['For Sale', 'For Rent', 'Sold', 'Pending Approval', 'Draft'];


const PropertyUpdateSchema = z.object({
  address: z.string().min(5).optional(),
  city: z.string().min(2).optional(),
  price: z.coerce.number().min(1, 'Price must be at least PKR 1.').optional(),
  bedrooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().min(0).optional(),
  areaSqFt: z.coerce.number().min(1, "Area must be at least 1.").optional(),
  description: z.string().min(20).optional(),
  propertyType: z.enum(propertyTypes).optional(),
  status: z.enum(allPropertyStatuses).optional(),
  yearBuilt: z.coerce.number().optional().nullable().refine(val => val === null || val === undefined || (val >= 1800 && val <= new Date().getFullYear() + 5), {
    message: `Year built must be between 1800 and ${new Date().getFullYear() + 5} or empty.`
  }),
  images: z.array(z.string().min(1)).min(1, "At least one image is required.").optional(),
  features: z.array(z.string().min(1)).optional(),
});


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Invalid property ID format' }, { status: 400 });
  }

  try {
    await dbConnect();
    const property = await Property.findById(id).populate('submittedBy', 'name email phone profilePictureUrl role');

    if (!property) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }
    
    // Public can see approved properties
    if (property.approvalStatus !== 'Approved') {
      const requestingUserId = request.headers.get('x-user-id');
      const requestingUserRole = request.headers.get('x-user-role');
      const isOwner = property.submittedBy && property.submittedBy._id.toString() === requestingUserId;
      const isAdmin = requestingUserRole === 'admin';
      
      if (!isOwner && !isAdmin) {
        return NextResponse.json({ success: false, error: 'Forbidden: You do not have access to this property.' }, { status: 403 });
      }
    }

    return NextResponse.json({ success: true, data: property.toObject() }, { status: 200 });
  } catch (error) {
    console.error(`API Error fetching property ${id}:`, error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}


export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const requestingUserId = request.headers.get('x-user-id');
  const requestingUserRole = request.headers.get('x-user-role');

  if (!requestingUserId) {
    return NextResponse.json({ success: false, error: 'Unauthorized: User ID not found.' }, { status: 401 });
  }

  const { id } = params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Invalid property ID format' }, { status: 400 });
  }

  try {
    await dbConnect();
    const propertyToUpdate = await Property.findById(id);
    if (!propertyToUpdate) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    const isOwner = propertyToUpdate.submittedBy?.toString() === requestingUserId;
    const isAdmin = requestingUserRole === 'admin';
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ success: false, error: 'Forbidden: You do not have permission.' }, { status: 403 });
    }

    const body = await request.json();
    const validation = PropertyUpdateSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Invalid input data.', details: validation.error.flatten() }, { status: 400 });
    }

    const updatedProperty = await Property.findByIdAndUpdate(id, { $set: validation.data }, { new: true, runValidators: true });

    if (!updatedProperty) {
      return NextResponse.json({ success: false, error: 'Property not found after update attempt.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedProperty.toObject() }, { status: 200 });
  } catch (error) {
    console.error(`API Error updating property ${id}:`, error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const requestingUserId = request.headers.get('x-user-id');
  const requestingUserRole = request.headers.get('x-user-role');

  if (!requestingUserId) {
    return NextResponse.json({ success: false, error: 'Unauthorized: User ID not found.' }, { status: 401 });
  }

  const { id } = params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Invalid property ID format' }, { status: 400 });
  }

  try {
    await dbConnect();
    const propertyToDelete = await Property.findById(id);

    if (!propertyToDelete) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    const isOwner = propertyToDelete.submittedBy?.toString() === requestingUserId;
    const isAdmin = requestingUserRole === 'admin';
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ success: false, error: 'Forbidden: You do not have permission.' }, { status: 403 });
    }

    await Property.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Property deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`API Error deleting property ${id}:`, error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
