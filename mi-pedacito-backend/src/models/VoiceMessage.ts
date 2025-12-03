import mongoose, { Document, Schema } from 'mongoose';

export interface IVoiceMessage extends Document {
  userId: mongoose.Types.ObjectId;
  audioUrl: string;
  duration: number;
  isPlayed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VoiceMessageSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    audioUrl: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 0,
    },
    isPlayed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Índice para búsquedas ordenadas por fecha
VoiceMessageSchema.index({ createdAt: -1 });
VoiceMessageSchema.index({ userId: 1, isPlayed: 1 });

export default mongoose.model<IVoiceMessage>('VoiceMessage', VoiceMessageSchema);
