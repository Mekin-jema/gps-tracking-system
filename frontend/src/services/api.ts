import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Add a request interceptor to include the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const updateVehiclePosition = async (vehicleId: string, longitude: number, latitude: number) => {
  return api.post(`/vehicles/${vehicleId}/position`, { longitude, latitude });
};

export const getVehiclePosition = async (vehicleId: string) => {
  return api.get(`/vehicles/${vehicleId}/position`);
};

export const getVehicles = async () => {
  return api.get('/admin/vehicles');
};

export const getDriverVehicle = async () => {
  return api.get('/vehicles/driver');
};