export interface Vehicle {
    _id: string;
    plateNumber: string;
    location: {
      lat: number;
      lng: number;
    };
    updatedAt: string;
  }
  