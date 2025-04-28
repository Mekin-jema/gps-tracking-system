import express from 'express';
import cors from 'cors';
import vehicleRoutes from './routes/vehicleRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/vehicles', vehicleRoutes);

export default app;
