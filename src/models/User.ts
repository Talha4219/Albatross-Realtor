
import mongoose, { Document, Schema, Model } from 'mongoose';
import type { UserRole } from '@/types';

export interface IUser extends Document {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  profilePictureUrl?: string;
  phone?: string;
  specialty?: string;
  isEmailVerified: boolean;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+@.+\..+/, 'Please fill a valid email address'],
  },
  passwordHash: {
    type: String,
    required: true,
    select: false, // Prevent password hash from being returned by default
  },
  role: {
    type: String,
    enum: ['user', 'agent', 'admin'],
    default: 'user',
    required: true,
  },
  profilePictureUrl: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    trim: true,
  },
  specialty: {
    type: String,
    trim: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: true,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetTokenExpires: {
    type: Date,
    select: false,
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
      delete ret.passwordHash;
      delete ret.passwordResetToken;
      delete ret.passwordResetTokenExpires;
    }
  },
  toObject: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
      delete ret.passwordHash;
      delete ret.passwordResetToken;
      delete ret.passwordResetTokenExpires;
    }
  }
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
