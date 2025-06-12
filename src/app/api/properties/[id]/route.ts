
import { NextResponse, type NextRequest } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Property from '@/models/Property';
import User from '@/models/User'; // Needed for populating submittedBy
import mongoose from 'mongoose';
import { z } from 'zod';
import type { PropertyTypeEnum, PropertyStatusEnum } from '@/types';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@albatrossrealtor.com';

const propertyTypes: [PropertyTypeEnum, ...PropertyTypeEnum[]] = ['House', 'Apartment', 'Condo', 'Townhouse', 'Land'];
// For updates, admin might change status to more options, but frontend form limits initial user submission
const allPropertyStatuses: [PropertyStatusEnum, ...PropertyStatusEnum[]] = ['For Sale', 'For Rent', 'Sold', 'Pending Approval', 'Draft'];


const PropertyUpdateSchema = z.object({
  address: z.string().min(5).optional(),
  city: z.string().min(2).optional(),
  state: z.string().min(2).optional(),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/).optional(),
  price: z.coerce.number().positive().optional(),
  bedrooms: z.coerce.number().int().min(0).optional(),
  bathrooms: z.coerce.number().min(0).optional(),
  areaSqFt: z.coerce.number().positive().optional(),
  description: z.string().min(20).optional(),
  propertyType: z.enum(propertyTypes).optional(),
  status: z.enum(allPropertyStatuses).optional(),
  yearBuilt: z.coerce.number().optional().nullable().refine(val => val === null || val === undefined || (val >= 1800 && val <= new Date().getFullYear() + 5), {
    message: `Year built must be between 1800 and ${new Date().getFullYear() + 5} or empty.`
  }),
  images: z.array(z.string().url().min(1)).min(1, "At least one image URL is required.").optional(),
  features: z.array(z.string().min(1)).optional(),
  agentId: z.string().optional().nullable(),
  // approvalStatus can be updated via a separate route
});


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const requestingUserId = request.headers.get('x-user-id');
  const requestingUserEmail = request.headers.get('x-user-email');

  const { id } = params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ success: false, error: 'Invalid property ID format' }, { status: 400 });
  }

  try {
    await dbConnect();
    const property = await Property.findById(id).populate('submittedBy', 'name email');
    if (!property) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    // Access control: 
    // 1. Admin can see any property.
    // 2. Owner can see their own property.
    // 3. Public can see 'Approved' properties (this might be handled by a general /api/properties if this GET is only for edit/admin)
    // For now, assuming this GET is used for edit, so owner/admin check is primary.
    const isOwner = property.submittedBy && property.submittedBy.id.toString() === requestingUserId;
    const isAdmin = requestingUserEmail === ADMIN_EMAIL;

    if (!isOwner && !isAdmin) {
         // If property is not approved, and user is not owner or admin, deny access
        if (property.approvalStatus !== 'Approved') {
            return NextResponse.json({ success: false, error: 'Forbidden: You do not have access to this property or it is not approved.' }, { status: 403 });
        }
    }
    // If execution reaches here, it's either owner, admin, or an approved property (if public access logic was added)
    return NextResponse.json({ success: true, data: property.toObject() }, { status: 200 });

  } catch (error) {
    console.error(`API Error fetching property ${id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}


export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const requestingUserId = request.headers.get('x-user-id');
  const requestingUserEmail = request.headers.get('x-user-email');

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
    const isAdmin = requestingUserEmail === ADMIN_EMAIL;

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ success: false, error: 'Forbidden: You do not have permission to update this property.' }, { status: 403 });
    }

    const body = await request.json();
    const validation = PropertyUpdateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ success: false, error: 'Invalid input data.', details: validation.error.flatten() }, { status: 400 });
    }
    
    const updateData = validation.data;
    
    // Handle agentId separately to allow setting it to null
    if (updateData.hasOwnProperty('agentId')) {
        if (updateData.agentId === null || updateData.agentId === '') {
            // If agentId is explicitly set to null or empty string, remove it
            updateData.agent = undefined; // Or handle in schema to unset
             // Mongoose specific way to remove a subdocument or field
            (updateData as any).$unset = { agent: 1 };
            delete updateData.agentId; // remove from updateData to avoid processing as a field
        } else if (updateData.agentId) {
            // If agentId is provided, you might want to fetch agent details similarly to POST
            // For simplicity here, assuming agentId is just a string and not embedding full agent object on update
            // Or, if your mock-data has a getAgentById, you could use it.
            // This part needs to align with how you handle agent info.
            // Example: const agentDetails = mockAgents.find(a => a.id === updateData.agentId);
            // if (agentDetails) propertyToUpdate.agent = agentDetails; else propertyToUpdate.agent = undefined;
            // For now, we'll assume frontend doesn't send full agent object on update, only ID.
            // This field would likely be handled differently if agents were DB entities.
            // Let's assume for now that we only update if body includes full agent object (which schema doesn't ask for)
            // Or we simply store agentId if that's what Property model stores for agent (it stores full object)
            // This logic for agent update remains as in POST for simplicity, but might need refinement.
             const { mockAgents } = await import('@/lib/mock-data'); // Dynamic import if needed
             const foundAgent = mockAgents.find(a => a.id === updateData.agentId);
             if (foundAgent) {
                updateData.agent = foundAgent;
             } else {
                updateData.agent = undefined; // Or $unset as above
             }
        }
    }
     // Ensure yearBuilt is correctly handled (null or number)
    if (updateData.hasOwnProperty('yearBuilt')) {
        updateData.yearBuilt = updateData.yearBuilt ? Number(updateData.yearBuilt) : null;
        if(updateData.yearBuilt === null) {
            (updateData as any).$unset = { ...((updateData as any).$unset || {}), yearBuilt: 1 };
        }
    }


    const updatedProperty = await Property.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });

    if (!updatedProperty) {
         // Should not happen if findById found it earlier, but as a safeguard
        return NextResponse.json({ success: false, error: 'Property not found after update attempt.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedProperty.toObject() }, { status: 200 });

  } catch (error) {
    console.error(`API Error updating property ${id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const requestingUserId = request.headers.get('x-user-id');
  const requestingUserEmail = request.headers.get('x-user-email');

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
    const isAdmin = requestingUserEmail === ADMIN_EMAIL;

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ success: false, error: 'Forbidden: You do not have permission to delete this property.' }, { status: 403 });
    }

    await Property.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Property deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error(`API Error deleting property ${id}:`, error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
