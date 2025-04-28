import { Request, Response } from 'express';
import { Vehicle } from '../models/vehicle.model';

export const registerVehicle = async (req: Request, res: Response) => {
  try {
    const { plateNumber, location } = req.body;
    const newVehicle = new Vehicle({ plateNumber, location });
    await newVehicle.save();
    res.status(201).json(newVehicle);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const updateVehicleLocation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { lat, lng } = req.body;
    const vehicle = await Vehicle.findByIdAndUpdate(id, {
      location: { lat, lng },
      updatedAt: new Date()
    }, { new: true });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.json(vehicle);
  } catch (err) {
    res.status(400).json({ error: err });
  }
};

export const getAllVehicles = async (_req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
