import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { Booking, Review } from '../types';
import { BOOKINGS as initialBookings, REVIEWS as initialReviews } from '../constants';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';

interface BookingContextType {
  bookings: Booking[];
  reviews: Review[];
  addBooking: (bookingData: Omit<Booking, 'id' | 'clientId' | 'status'>, paymentMethod: 'paypal' | 'cash') => void;
  addReview: (reviewData: Omit<Review, 'id' | 'reviewerId' | 'timestamp'>) => void;
  updateBookingStatus: (bookingId: number, status: Booking['status']) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { addNotification } = useNotification();
  const { user } = useAuth();

  const getInitialState = <T,>(key: string, fallback: T[]): T[] => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error(`Failed to parse ${key} from localStorage`, error);
    }
    return fallback;
  };

  const [bookings, setBookings] = useState<Booking[]>(() => getInitialState('bookings', initialBookings));
  const [reviews, setReviews] = useState<Review[]>(() => getInitialState('reviews', initialReviews));

  useEffect(() => {
    try {
      localStorage.setItem('bookings', JSON.stringify(bookings));
    } catch (error) {
      console.error("Failed to save bookings to localStorage", error);
    }
  }, [bookings]);

  useEffect(() => {
    try {
      localStorage.setItem('reviews', JSON.stringify(reviews));
    } catch (error) {
      console.error("Failed to save reviews to localStorage", error);
    }
  }, [reviews]);

  const addBooking = useCallback((bookingData: Omit<Booking, 'id' | 'clientId' | 'status'>, paymentMethod: 'paypal' | 'cash') => {
    if (!user) {
        addNotification({ message: 'Debes iniciar sesión para realizar una reserva.', type: 'error' });
        return;
    }
    const newBooking: Booking = {
      ...bookingData,
      id: Date.now(),
      clientId: user.username,
      status: 'confirmed', // Always confirmed for both payment methods
    };
    setBookings(prevBookings => [...prevBookings, newBooking]);
    
    const message = paymentMethod === 'paypal'
        ? '¡Pago procesado con PayPal! Tu reserva está confirmada.'
        : '¡Tu reserva está confirmada! Realizarás el pago al recoger el vehículo.';
    addNotification({ message, type: 'success' });

  }, [user, addNotification]);

  const addReview = useCallback((reviewData: Omit<Review, 'id' | 'reviewerId' | 'timestamp'>) => {
    if (!user) {
        addNotification({ message: 'Debes iniciar sesión para dejar una reseña.', type: 'error' });
        return;
    }
    const newReview: Review = {
        ...reviewData,
        id: Date.now(),
        reviewerId: user.username,
        timestamp: new Date().toISOString(),
    };
    setReviews(prev => [...prev, newReview]);
    addNotification({ message: '¡Gracias por tu reseña!', type: 'success' });
  }, [user, addNotification]);

  const updateBookingStatus = useCallback((bookingId: number, status: Booking['status']) => {
    setBookings(prev =>
      prev.map(booking =>
        booking.id === bookingId ? { ...booking, status } : booking
      )
    );
    addNotification({ message: 'Estado de la reserva actualizado.', type: 'info' });
  }, [addNotification]);

  return (
    <BookingContext.Provider value={{ bookings, reviews, addBooking, addReview, updateBookingStatus }}>
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