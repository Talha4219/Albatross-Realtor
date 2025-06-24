
import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import type { Property as PropertyType, PropertyTypeEnum, PropertyStatusEnum, PropertyApprovalStatusEnum } from '@/types';

export interface IProperty extends Omit<PropertyType, 'id' | 'postedDate' | 'propertyType' | 'status' | 'approvalStatus' | 'submittedBy'>, Document {
  id?: string;
  postedDate: Date;
  propertyType: PropertyTypeEnum;
  status: PropertyStatusEnum;
  approvalStatus: PropertyApprovalStatusEnum;
  submittedBy?: mongoose.Schema.Types.ObjectId; // Link to a User model
}


const PropertySchema = new Schema<IProperty>({
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: String, required: true },
  price: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  areaSqFt: { type: Number, required: true },
  description: { type: String, required: true },
  images: [{ type: String }],
  propertyType: { type: String, enum: ['House', 'Apartment', 'Condo', 'Townhouse', 'Land', 'Plot'], required: true },
  yearBuilt: Number,
  features: [{ type: String }],
  latitude: Number,
  longitude: Number,
  status: { type: String, enum: ['For Sale', 'For Rent', 'Sold', 'Pending Approval', 'Draft'], required: true, default: 'Pending Approval' },
  postedDate: { type: Date, required: true, default: Date.now },
  isVerified: { type: Boolean, default: false },
  approvalStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], required: true, default: 'Pending' },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
    }
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
    }
  }
});

PropertySchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const Property: Model<IProperty> = mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);

export default Property;
