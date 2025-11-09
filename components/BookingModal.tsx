import React, { useState, useMemo, useEffect } from 'react';
import { Vehicle, Page } from '../types';
import { useBooking } from '../contexts/BookingContext';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import Calendar from './Calendar';
import PayPalButton from './PayPalButton';

interface BookingModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onNavigate: (page: 'bookings') => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ vehicle, onClose, onNavigate }) => {
  const { bookings, requestBooking } = useBooking();
  
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [modalStep, setModalStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | null>(null);
  const [payeeEmail, setPayeeEmail] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, this would come from a backend. Here we use localStorage
    // as configured by the admin in their dashboard.
    const storedEmail = localStorage.getItem('paypalMerchantEmail');
    setPayeeEmail(storedEmail);
  }, []);


  if (!vehicle) return null;

  const bookedDates = useMemo(() => {
    if (!vehicle) return new Set<string>();

    const dates = new Set<string>();
    const bookingsForVehicle = bookings.filter(
      (b) => b.vehicleId === vehicle.id && (b.status === 'confirmed' || b.status === 'pending')
    );

    bookingsForVehicle.forEach((booking) => {
      // Use UTC to avoid timezone issues with date calculations
      let currentDate = new Date(booking.startDate + 'T00:00:00');
      const stopDate = new Date(booking.endDate + 'T00:00:00');

      while (currentDate <= stopDate) {
        dates.add(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    return dates;
  }, [bookings, vehicle]);

  const totalDays = useMemo(() => {
    setError('');
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
        setError('La fecha de devolución debe ser posterior a la de recogida.');
        return 0;
    };
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include the start day
    return diffDays;
  }, [startDate, endDate]);

  const totalPrice = totalDays * vehicle.pricePerDay;
  
  const handleBookingConfirmed = (method: 'paypal') => {
      if(!startDate || !endDate) return;
    setPaymentMethod(method);
    requestBooking({ vehicle, startDate, endDate });
    setIsSuccess(true);
  };

  const handleGoToBookings = () => {
    onClose();
    onNavigate('bookings');
  }
  
  const handleDatesSelected = (dates: { startDate: string | null; endDate: string | null }) => {
    setStartDate(dates.startDate);
    setEndDate(dates.endDate);
  };

  const SuccessView = () => (
    <div className="text-center p-8">
        <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-primary mb-2">¡Reserva Exitosa!</h2>
        <p className="text-gray-600 mb-6">
            Tu pago ha sido procesado con éxito. ¡Gracias por tu confianza!
        </p>
        <button 
            onClick={handleGoToBookings}
            className="w-full bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-90 transition-all text-lg">
            Ver Mis Viajes
        </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-lg relative animate-fade-in-up overflow-hidden" 
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
           </svg>
        </button>
        
        {isSuccess ? <SuccessView/> : (
        <div className="p-6">
          {modalStep === 1 && (
            <>
              <h2 id="booking-modal-title" className="text-2xl font-bold text-primary mb-2">Selecciona las Fechas</h2>
              <p className="text-gray-600 mb-6">Elige el rango de días para rentar el <span className="font-semibold">{vehicle.brand} {vehicle.name}</span>.</p>
              
              <div className="space-y-6">
                <div>
                    <h4 className="font-semibold text-primary border-b pb-2 mb-4">Fechas de Renta</h4>
                    <Calendar bookedDates={bookedDates} onDateChange={handleDatesSelected} />
                </div>
                
                {error && <p className="text-red-500 text-sm text-center font-semibold bg-red-100 p-3 rounded-md">{error}</p>}
                
                <div className="mt-4 pt-4 border-t">
                    <button 
                        onClick={() => setModalStep(2)} 
                        disabled={!startDate || !endDate || totalDays <= 0 || !!error}
                        className="w-full bg-accent text-primary font-bold py-3 px-6 rounded-md hover:brightness-90 transition-all text-lg disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                        Continuar
                    </button>
                </div>
              </div>
            </>
          )}
          {modalStep === 2 && (
             <>
              <h2 id="booking-modal-title" className="text-2xl font-bold text-primary mb-2">Confirmar y Pagar</h2>
              <p className="text-gray-600 mb-6">Revisa los detalles y completa el pago para confirmar tu reserva.</p>
              
              <div className="space-y-4">
                  {totalPrice > 0 && (
                      <div className="bg-slate-100 p-4 rounded-lg animate-fade-in-up">
                         <div className="flex justify-between items-center text-gray-600 text-sm">
                             <span>${vehicle.pricePerDay.toLocaleString()} x {totalDays} día(s)</span>
                             <span>${(totalDays * vehicle.pricePerDay).toLocaleString()}</span>
                         </div>
                          <div className="flex justify-between items-center text-gray-600 text-sm mt-1">
                             <span>Tarifa de servicio</span>
                             <span>$0</span>
                         </div>
                         <div className="flex justify-between items-center font-bold text-primary mt-2 pt-2 border-t">
                             <span>Total a pagar (USD)</span>
                             <span>${totalPrice.toFixed(2)}</span>
                         </div>
                      </div>
                  )}

                  <div className="mt-4">
                    {payeeEmail ? (
                         <PayPalButton 
                            amount={totalPrice.toFixed(2)} 
                            onSuccess={() => handleBookingConfirmed('paypal')} 
                            payeeEmail={payeeEmail}
                        />
                    ) : (
                        <div className="text-center p-4 bg-yellow-100 text-yellow-800 rounded-lg">
                            <p className="font-semibold">El sistema de pagos no está configurado.</p>
                            <p className="text-sm">Por favor, contacta al administrador de la plataforma para habilitar los pagos.</p>
                        </div>
                    )}
                  </div>

                  <div className="mt-2 text-center">
                      <button onClick={() => setModalStep(1)} className="text-sm text-gray-600 hover:underline">
                          Volver a seleccionar fechas
                      </button>
                  </div>
              </div>
             </>
          )}
        </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;