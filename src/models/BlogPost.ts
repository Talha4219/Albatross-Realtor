import mongoose, { Document, Schema, Model } from 'mongoose';
import type { BlogPost as BlogPostType, PropertyApprovalStatusEnum, BlogCategory } from '@/types';
import { blogCategories } from '@/types';

// Omit fields that are automatically handled or transformed
export interface IBlogPost extends Omit<BlogPostType, 'id' | 'createdAt' | 'updatedAt' | 'tags' | 'submittedBy' | 'category'>, Document {
  tags: string[]; // In Mongoose, it's a direct array of strings
  submittedBy?: mongoose.Types.ObjectId;
  approvalStatus: PropertyApprovalStatusEnum;
  category: BlogCategory;
}

const BlogPostSchemaField: Record<keyof Omit<BlogPostType, 'id' | 'createdAt' | 'updatedAt' | 'submittedBy' | 'approvalStatus' | 'tags' | 'category'>, any> = {
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, trim: true },
  excerpt: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  imageUrl: { type: String, required: true },
  dataAiHint: { type: String, trim: true },
  author: { type: String, trim: true },
  status: { type: String, enum: ['published', 'draft'], default: 'draft', required: true },
};

const BlogPostSchema = new Schema<IBlogPost>({
    ...BlogPostSchemaField,
    category: { type: String, enum: [...blogCategories], required: true },
    tags: [{ type: String, trim: true }],
    approvalStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending', required: true },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true, // This adds createdAt and updatedAt
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

BlogPostSchema.virtual('id').get(function() {
  return this._id.toHexString();
});


// Create a text index for searching
BlogPostSchema.index({ title: 'text', content: 'text', category: 'text', tags: 'text' });


const BlogPostModel: Model<IBlogPost> = mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);

export default BlogPostModel;
