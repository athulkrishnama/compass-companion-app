export type VehicleType = "sedan" | "suv" | "auto" | "bike" | string;

export interface Vehicle {
  model: string;
  type: VehicleType;
  registrationNumber: string;
  images: string[];
}

export interface IGetCabDetailsResponseDTO {
  baseLocation?: {
    city: string;
    coordinates: [number, number];
  };
  isOnline: boolean;
  vehicleDetails?: Vehicle;
}
