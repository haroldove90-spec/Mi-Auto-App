export type Page = 'home' | 'bookings' | 'my-cars' | 'profile' | 'admin' | 'how-it-works' | 'support' | 'terms' | 'contact' | 'lessor-onboarding' | 'vehicle-detail' | 'privacy-policy' | 'register-client';

export type Role = 'cliente' | 'arrendador' | 'admin';

export interface User {
  username: string;
  name: string;
  role: Role;
  avatarUrl?: string;
  memberSince: string;
  averageRating: number;
  isVerified: boolean;
  phone?: string;
  dateOfBirth?: string;
  licenseNumber?: string;
}

export interface VehicleSpecs {
  type: string;
  passengers: number;
  transmission: 'Automática' | 'Manual';
  fuel: 'Gasolina' | 'Diesel' | 'Eléctrico' | 'Híbrido';
}

export interface Vehicle {
  id: number;
  ownerId: string;
  brand: string;
  name: string;
  year: number;
  licensePlate: string;
  pricePerDay: number;
  location: string;
  imageUrl: string[];
  specs: VehicleSpecs;
  features: string[];
  availability: Availability[];
  averageRating: number;
}

export interface Booking {
    id: number;
    vehicleId: number;
    ownerId: string;
    clientId: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rejected';
}

export interface Review {
    id: number;
    bookingId: number;
    vehicleId: number;
    reviewerId: string;
    revieweeId: string; // Can be a client or an owner
    rating: number;
    comment: string;
    timestamp: string;
}

export interface Availability {
    date: string; // YYYY-MM-DD
    isBooked: boolean;
}

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}