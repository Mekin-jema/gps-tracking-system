
import mongoose, { Document, Model, Schema } from "mongoose";

// Plain interface for fields
export interface IVehicle{
  registrationNumber: string;
  model: string;
  driver: mongoose.Types.ObjectId;
  currentLocation?: {
    type: string;
    coordinates: [number, number];
  };
  lastUpdated?: Date;
  isActive?: boolean;
}

// Schema definition
const VehicleSchema: Schema<IVehicle> = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true },
  model: { type: String, required: true },
  driver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  currentLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  lastUpdated: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});


const Vechicle:Model<IVehicle>=mongoose.model('Vehicle', VehicleSchema );
export default Vechicle;
