import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Booking, Review, Vehicle } from '../types';
import { BOOKINGS as INITIAL_BOOKINGS, REVIEWS as INITIAL_REVIEWS } from '../constants';
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
    const getInitialBookings = () => {
        try {
            const storedBookings = localStorage.getItem('bookings');
            return storedBookings ? JSON.parse(storedBookings) : INITIAL_BOOKINGS;
        } catch (error) {
            console.error("Failed to parse bookings from localStorage", error);
            return INITIAL_BOOKINGS;
        }
    };
    
    const getInitialReviews = () => {
        try {
            const storedReviews = localStorage.getItem('reviews');
            return storedReviews ? JSON.parse(storedReviews) : INITIAL_REVIEWS;
        } catch (error) {
            console.error("Failed to parse reviews from localStorage", error);
            return INITIAL_REVIEWS;
        }
    };

  const [bookings, setBookings] = useState<Booking[]>(getInitialBookings());
  const [reviews, setReviews] = useState<Review[]>(getInitialReviews());
  const { addNotification } = useNotification();
  const { user } = useAuth();

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


  const requestBooking = (details: { vehicle: Vehicle; startDate: string; endDate: string; }) => {
    if (!user) return;
    const { vehicle, startDate, endDate } = details;
    
    // CRITICAL FIX: Ensure price calculation is consistent with BookingModal.
    // The modal calculates total days inclusively (e.g., Mon to Wed is 3 days).
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    const newBooking: Booking = {
      id: Date.now(),
      vehicleId: vehicle.id,
      ownerId: vehicle.ownerId,
      clientId: user.username,
      startDate,
      endDate,
      totalPrice: totalDays * vehicle.pricePerDay,
      status: 'confirmed', // The booking is confirmed automatically. Payment is handled on delivery.
    };
    
    setBookings(prev => [newBooking, ...prev]);
    addNotification({ message: '¡Reserva confirmada! El pago se realizará al recoger el vehículo.', type: 'success' });
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