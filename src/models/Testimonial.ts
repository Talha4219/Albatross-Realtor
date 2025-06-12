
import mongoose, { Document, Schema, Model } from 'mongoose';
import type { Testimonial as TestimonialType } from '@/types';

export interface ITestimonial extends Omit<TestimonialType, 'id'>, Document {}

const TestimonialSchemaField: Record<keyof Omit<TestimonialType, 'id' | 'createdAt' | 'updatedAt'>, any> = {
  name: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  quote: { type: String, required: true, trim: true },
  imageUrl: { type: String, trim: true, default: 'https://placehold.co/80x80.png' },
  dataAiHint: { type: String, trim: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  successTag: { type: String, trim: true },
};

const TestimonialSchema = new Schema<ITestimonial>(TestimonialSchemaField, {
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

TestimonialSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const TestimonialModel: Model<ITestimonial> = mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

export default TestimonialModel;
