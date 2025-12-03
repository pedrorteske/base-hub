export interface ContactInfo {
  name: string;
  phone: string;
  email?: string;
}

export interface OperatingHours {
  open: string;
  close: string;
  is24h?: boolean;
}

export interface ServiceAvailability {
  name: string;
  available: boolean;
  notes?: string;
}

export type Region = "Sul" | "Sudeste" | "Centro-Oeste" | "Nordeste" | "Norte";

export interface Base {
  id: string;
  name: string;
  icaoCode: string;
  city: string;
  state: string;
  region: Region;
  airportCategory?: number;
  manager: ContactInfo;
  federalPolice: {
    present: boolean;
    contact?: ContactInfo;
    hours?: OperatingHours;
  };
  federalRevenue: {
    present: boolean;
    contact?: ContactInfo;
    hours?: OperatingHours;
  };
  airportHours: OperatingHours;
  services: ServiceAvailability[];
  equipment: string[];
  capacity: {
    maxAircraftLength: number; // meters
    maxAircraftWingspan: number; // meters
    maxAircraftWeight: number; // tons
    parkingSpots: number;
    hangarCapacity: number;
  };
  notes?: string;
  status: 'operational' | 'restricted' | 'closed';
}
