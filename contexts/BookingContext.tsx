import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Booking, Vehicle } from '../types';
import { BOOKINGS } from '../constants';
import { useNotification } from './NotificationContext';

interface BookingContextType {
  bookings: Booking[];
  createBooking: (details: { vehicle: Vehicle; startDate: string; endDate: string; clientName: string; clientEmail: string; clientPhone: string; }) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>(BOOKINGS);
  const { addNotification } = useNotification();

  const createBooking = (details: { vehicle: Vehicle; startDate: string; endDate: string; clientName: string; clientEmail: string; clientPhone: string; }) => {
    const { vehicle, startDate, endDate, clientName, clientEmail, clientPhone } = details;
    const days = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24);
    
    const newBooking: Booking = {
      id: Date.now(),
      vehicle,
      startDate,
      endDate,
      totalPrice: Math.max(1, Math.ceil(days)) * vehicle.pricePerDay,
      status: 'confirmada',
      clientName,
      clientEmail,
      clientPhone,
    };
    
    setBookings(prev => [newBooking, ...prev]);
    addNotification({ message: '¡Reserva confirmada con éxito!', type: 'success' });
  };

  return (
    <BookingContext.Provider value={{ bookings, createBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = (): BookingContextType => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
