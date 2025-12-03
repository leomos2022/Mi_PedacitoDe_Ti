import mongoose, { Document, Schema } from 'mongoose';

export interface IConnectionLog extends Document {
  userId: mongoose.Types.ObjectId;
  action: 'connected' | 'disconnected';
  timestamp: Date;
}

const ConnectionLogSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  action: {
    type: String,
    enum: ['connected', 'disconnected'],
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Índice para consultas de estado de conexión
ConnectionLogSchema.index({ userId: 1, timestamp: -1 });

export default mongoose.model<IConnectionLog>('ConnectionLog', ConnectionLogSchema);
