export type Page = 'home' | 'bookings' | 'my-cars' | 'profile' | 'admin' | 'how-it-works' | 'support' | 'terms' | 'login' | 'contact' | 'lessor-onboarding';

export type Role = 'cliente' | 'arrendador' | 'admin';

export interface User {
  username: string;
  name: string;
  role: Role;
}

export interface VehicleSpecs {
  type: string;
  passengers: number;
  transmission: 'Automática' | 'Manual';
  fuel: 'Gasolina' | 'Diesel' | 'Eléctrico' | 'Híbrido';
}

export interface Vehicle {
  id: number;
  brand: string;
  name: string;
  imageUrl: string;
  pricePerDay: number;
  specs: VehicleSpecs;
  owner?: 'platform' | 'lessor';
}

export interface Booking {
    id: number;
    vehicle: Vehicle;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: 'confirmada' | 'completada' | 'cancelada';
    clientName: string;
    clientEmail: string;
    clientPhone: string;
}

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}