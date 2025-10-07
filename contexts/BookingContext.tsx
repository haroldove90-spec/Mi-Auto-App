import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Booking, Review, Vehicle } from '../types';
import { BOOKINGS, REVIEWS } from '../constants';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';

interface BookingContextType {
  bookings: Booking[];
  reviews: Review[];
  requestBooking: (details: { vehicle: Vehicle; startDate: string; endDate: string; }) => void;
  updateBookingStatus: (bookingId: number, status: Booking['status']) => void;
  addReview: (reviewData: Omit<Review, 'id' | 'timestamp' | 'reviewerId'>) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>(BOOKINGS);
  const [reviews, setReviews] = useState<Review[]>(REVIEWS);
  const { addNotification } = useNotification();
  const { user } = useAuth();

  const requestBooking = (details: { vehicle: Vehicle; startDate: string; endDate: string; }) => {
    if (!user) return;
    const { vehicle, startDate, endDate } = details;
    const days = (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24);
    
    const newBooking: Booking = {
      id: Date.now(),
      vehicleId: vehicle.id,
      ownerId: vehicle.ownerId,
      clientId: user.username,
      startDate,
      endDate,
      totalPrice: Math.max(1, Math.ceil(days)) * vehicle.pricePerDay,
      status: 'confirmed', // The booking is confirmed automatically. Payment is handled on delivery.
    };
    
    setBookings(prev => [newBooking, ...prev]);
    addNotification({ message: '¡Tu reserva ha sido confirmada!', type: 'success' });
  };

  const updateBookingStatus = (bookingId: number, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
    let message = '';
    if (status === 'confirmed') message = 'Reserva confirmada.';
    if (status === 'rejected') message = 'Reserva rechazada.';
    if (status === 'cancelled') message = 'Reserva cancelada.';
    if (message) addNotification({ message, type: 'info' });
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'timestamp' | 'reviewerId'>) => {
    if (!user) return;
    const newReview: Review = {
        ...reviewData,
        id: Date.now(),
        reviewerId: user.username,
        timestamp: new Date().toISOString(),
    };
    setReviews(prev => [...prev, newReview]);
    addNotification({ message: 'Gracias por tu reseña.', type: 'success' });
  };

  return (
    <BookingContext.Provider value={{ bookings, reviews, requestBooking, updateBookingStatus, addReview }}>
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