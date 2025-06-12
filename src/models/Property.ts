
import mongoose, { Document, Schema, Model, Types } from 'mongoose';
import type { Property as PropertyType, Agent as AgentType, PropertyTypeEnum, PropertyStatusEnum, PropertyApprovalStatusEnum } from '@/types';

// Define a schema for the embedded Agent
const AgentSchema = new Schema<AgentType>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  imageUrl: String,
  isVerified: Boolean,
  specialty: String,
  rating: Number,
}, { _id: false });

export interface IProperty extends Omit<PropertyType, 'id' | 'agent' | 'postedDate' | 'propertyType' | 'status' | 'approvalStatus' | 'submittedBy'>, Document {
  id?: string;
  agent?: AgentType; // Embedded agent, can be optional
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
  propertyType: { type: String, enum: ['House', 'Apartment', 'Condo', 'Townhouse', 'Land'], required: true },
  yearBuilt: Number,
  features: [{ type: String }],
  agent: { type: AgentSchema, required: false },
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
