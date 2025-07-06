
import mongoose, { Document, Schema, Model } from 'mongoose';
import type { Testimonial as TestimonialType } from '@/types';

export interface ITestimonial extends Omit<TestimonialType, 'id'>, Document {}

const TestimonialSchema = new Schema<ITestimonial>({
  name: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  quote: { type: String, required: true, trim: true },
  imageUrl: { type: String, trim: true, default: 'https://placehold.co/80x80.png' },
  dataAiHint: { type: String, trim: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  successTag: { type: String, trim: true },
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

const TestimonialModel: Model<ITestimonial> = mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);

export default TestimonialModel;
