
import mongoose, { Document, Schema, Model } from 'mongoose';
import './User'; // Ensure User model is registered for population
import type { Project as ProjectType, UserProfile } from '@/types'; // Using existing Project type

// Define a Mongoose schema based on the ProjectType
// Note: 'id' is virtual or handled by toJSON/toObject, so we don't define it in schema explicitly.
export interface IProject extends Omit<ProjectType, 'id' | 'submittedBy'>, Document {
  // Mongoose will add _id automatically
  submittedBy?: mongoose.Types.ObjectId;
}

const ProjectSchemaField: Record<keyof Omit<ProjectType, 'id' | 'createdAt' | 'updatedAt' | 'submittedBy'>, any> = {
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  developer: { type: String, required: true, trim: true },
  imageUrl: { type: String, required: true }, // Assuming an image is always provided
  dataAiHint: { type: String, trim: true },
  description: { type: String, trim: true },
  keyHighlights: [{ type: String, trim: true }],
  amenities: [{ type: String, trim: true }],
  isVerified: { type: Boolean, default: false },
  status: { type: String, enum: ['Upcoming', 'Trending', 'Launched'], trim: true },
  timeline: { type: String, trim: true },
  learnMoreLink: { type: String, trim: true },
};

const ProjectSchema = new Schema<IProject>({
    ...ProjectSchemaField,
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true, // Adds createdAt and updatedAt
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

ProjectSchema.virtual('id').get(function() {
  return this._id.toHexString();
});

const ProjectModel: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default ProjectModel;
