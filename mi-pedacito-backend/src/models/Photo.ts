import mongoose, { Document, Schema } from 'mongoose';

export interface IPhoto extends Document {
  userId: mongoose.Types.ObjectId;
  imageUrl: string;
  thumbnailUrl?: string;
  caption: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'other';
  category: 'together_mode' | 'shared_gallery' | 'synchronized_sunsets' | 'general';
  isMemory: boolean;
  scheduledDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PhotoSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    thumbnailUrl: {
      type: String,
      default: '',
    },
    caption: {
      type: String,
      default: '',
      maxlength: 500,
    },
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack', 'other'],
      default: 'other',
    },
    category: {
      type: String,
      enum: ['together_mode', 'shared_gallery', 'synchronized_sunsets', 'general'],
      default: 'general',
    },
    isMemory: {
      type: Boolean,
      default: false,
    },
    scheduledDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Índice para búsquedas rápidas de memorias programadas
PhotoSchema.index({ scheduledDate: 1, isMemory: 1 });
PhotoSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<IPhoto>('Photo', PhotoSchema);
