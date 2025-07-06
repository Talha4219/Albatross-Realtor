
import mongoose, { Document, Schema, Model } from 'mongoose';
import './User';
import type { Property as PropertyType, PropertyTypeEnum, PropertyStatusEnum, PropertyApprovalStatusEnum } from '@/types';

const allPropertyTypes: PropertyTypeEnum[] = [
    'House', 'Apartment', 'Condo', 'Townhouse', 'Land', 'Plot',
    'Flat', 'Upper Portion', 'Lower Portion', 'Farm House', 'Room', 'Penthouse',
    'Residential Plot', 'Commercial Plot', 'Agricultural Land', 'Industrial Land', 'Plot File', 'Plot Form',
    'Office', 'Shop', 'Warehouse', 'Factory', 'Building', 'Other'
];

const allPropertyStatuses: PropertyStatusEnum[] = ['For Sale', 'For Rent', 'Sold', 'Pending Approval', 'Draft'];
const allApprovalStatuses: PropertyApprovalStatusEnum[] = ['Pending', 'Approved', 'Rejected'];

export interface IProperty extends Omit<PropertyType, 'id'>, Document {}

const PropertySchema = new Schema<IProperty>({
  address: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 1 },
  bedrooms: { type: Number, required: true, min: 0 },
  bathrooms: { type: Number, required: true, min: 0 },
  areaSqFt: { type: Number, required: true, min: 1 },
  description: { type: String, required: true, trim: true },
  images: { type: [String], required: true, default: [] },
  propertyType: { type: String, enum: allPropertyTypes, required: true },
  yearBuilt: { type: Number, sparse: true },
  features: { type: [String], default: [] },
  latitude: { type: Number, sparse: true },
  longitude: { type: Number, sparse: true },
  status: { type: String, enum: allPropertyStatuses, required: true, default: 'For Sale' },
  isVerified: { type: Boolean, default: true },
  approvalStatus: { type: String, enum: allApprovalStatuses, required: true, default: 'Pending' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  views: { type: Number, default: 0 },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
    }
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
    }
  }
});

PropertySchema.index({ address: 'text', city: 'text', description: 'text', propertyType: 'text' });

const Property: Model<IProperty> = mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);

export default Property;
