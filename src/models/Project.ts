
import mongoose, { Document, Schema, Model } from 'mongoose';
import './User';
import type { Project as ProjectType } from '@/types';

export interface IProject extends Omit<ProjectType, 'id' | 'submittedBy'>, Document {
  submittedBy?: mongoose.Types.ObjectId;
}

const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  developer: { type: String, required: true, trim: true },
  imageUrl: { type: String, required: true },
  dataAiHint: { type: String, trim: true },
  description: { type: String, trim: true },
  keyHighlights: [{ type: String, trim: true }],
  amenities: [{ type: String, trim: true }],
  isVerified: { type: Boolean, default: true },
  status: { type: String, enum: ['Upcoming', 'Trending', 'Launched'], trim: true },
  timeline: { type: String, trim: true },
  learnMoreLink: { type: String, trim: true },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
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

const ProjectModel: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default ProjectModel;
