import mongoose, { Document, Schema } from 'mongoose';

export interface IVehicle extends Document {
  plateNumber: string;
  location: {
    lat: number;
    lng: number;
  };
  updatedAt: Date;
}

const VehicleSchema = new Schema<IVehicle>({
  plateNumber: { type: String, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  updatedAt: { type: Date, default: Date.now }
});

export const Vehicle = mongoose.model<IVehicle>('Vehicle', VehicleSchema);
