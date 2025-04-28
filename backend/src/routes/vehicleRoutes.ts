import { Router } from 'express';
import { registerVehicle, updateVehicleLocation, getAllVehicles } from '../controllers/vehicleController';

const router = Router();

router.post('/', registerVehicle);
router.get('/', getAllVehicles);
router.put('/:id', updateVehicleLocation);

export default router;
