"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import VehicleMap from '../components/VehicleMap';
import { useQuery } from '@tanstack/react-query';

interface Vehicle {
  _id: string;
  registrationNumber: string;
  model: string;
  currentLocation: {
    coordinates: [number, number];
  };
}

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [selectedVehicle, setSelectedVehicle] = useState<string | null>(null);

  const { data: vehicles, isLoading } = useQuery<Vehicle[]>({
    queryKey: ['vehicles'],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/vehicles`);
      return res.data;
    },
    enabled: user?.role === 'admin'
  });

  const { data: driverVehicle, isLoading: isDriverLoading } = useQuery<Vehicle>({
    queryKey: ['driverVehicle'],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/vehicles/driver`);
      return res.data;
    },
    enabled: user?.role === 'driver'
  });

  useEffect(() => {
    if (user?.role === 'driver' && driverVehicle) {
      setSelectedVehicle(driverVehicle._id);
    }
  }, [driverVehicle, user]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Vehicle Tracking System</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {user.role === 'admin' && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Vehicles</h2>
            {isLoading ? (
              <p>Loading vehicles...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {vehicles?.map((vehicle) => (
                  <div
                    key={vehicle._id}
                    className={`p-4 border rounded-lg cursor-pointer ${selectedVehicle === vehicle._id ? 'bg-blue-50 border-blue-500' : 'bg-white'}`}
                    onClick={() => setSelectedVehicle(vehicle._id)}
                  >
                    <h3 className="font-medium">{vehicle.registrationNumber}</h3>
                    <p className="text-sm text-gray-600">{vehicle.model}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="h-96">
            {selectedVehicle ? (
              <VehicleMap vehicleId={selectedVehicle} adminView={user.role === 'admin'} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  {user.role === 'admin' ? 'Select a vehicle to track' : 'No vehicle assigned'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}