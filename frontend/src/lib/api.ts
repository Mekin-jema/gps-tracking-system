import { Vehicle } from "@/types/vehicle";

const BASE_URL = "http://localhost:5000/api/vehicles";

export const fetchVehicles = async (): Promise<Vehicle[]> => {
  const res = await fetch(BASE_URL, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch vehicles");
  }
  return res.json();
};
