import express from 'express';
import vehicleModel from '../models/vehicle.model';
// import Vehicle from '../models/Vehicle';

const router = express.Router();

// Update vehicle position
router.post('/:id/position', async (req, res) => {
  try {
    const { id } = req.params;
    const { longitude, latitude } = req.body;
    
    if (!longitude || !latitude) {
      return res.status(400).json({ message: 'Longitude and latitude are required' });
    }
    
    const vehicle = await vehicleModel.findByIdAndUpdate(
      id,
      {
        currentLocation: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        lastUpdated: new Date()
      },
      { new: true }
    ).populate('driver', 'username email') as (typeof vehicleModel.schema.obj & { 
      currentLocation: { coordinates: [number, number] }, 
      lastUpdated: Date 
    }) | null;
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    // Emit real-time update
    const io = req.app.get('io');
    io.to(id).emit('position-update', {
      vehicleId: id,
      position: vehicle.currentLocation.coordinates,
      lastUpdated: vehicle.lastUpdated
    });
    
    res.status(200).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Get vehicle position
router.get('/:id/position', async (req, res) => {
  try {
    const { id } = req.params;
    const vehicle = await vehicleModel.findById(id).select('currentLocation lastUpdated') as (typeof vehicleModel.schema.obj & { 
      currentLocation: { coordinates: [number, number] }, 
      lastUpdated: Date 
    }) | null;
    
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    
    res.status(200).json({
      position: vehicle.currentLocation.coordinates,
      lastUpdated: vehicle.lastUpdated
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;