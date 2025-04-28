import express, { Request } from 'express';
import vehicleModel from '../models/vehicle.model';
import { IUser } from '../models/user.model';

// Extend the Request interface to include the user property
interface CustomRequest extends Request {
  user?: IUser;
}

const router = express.Router();

// Middleware to check if user is admin
router.use((req, res, next) => {
  const user = (req as CustomRequest).user;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
});

// Get all vehicles
router.get('/vehicles', async (req, res) => {
  try {
    const vehicles = await vehicleModel.find().populate('driver', 'username email');
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get vehicle details
router.get('/vehicles/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await vehicleModel.findById(id).populate('driver', 'username email');
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;