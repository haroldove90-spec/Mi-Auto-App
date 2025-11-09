import React, { useState, useMemo, useEffect } from 'react';
import { Vehicle } from '../types';
import { useBooking } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';
import Calendar from './Calendar';
import PayPalButton from './PayPalButton';

interface BookingModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  onNavigate: (page: 'bookings') => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ vehicle, onClose, onNavigate }) => {
  const [dates, setDates] = useState<{ startDate: string | null; endDate: string | null }>({ startDate: null, endDate: null });
  const [payeeEmail, setPayeeEmail] = useState<string | null>(null);
  const [step, setStep] = useState(1);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || ''
  });
  const [formError, setFormError] = useState('');
  
  const isFormValid = useMemo(() => {
      return formData.name.trim() !== '' && formData.phone.trim() !== '';
  }, [formData]);


  const { addBooking, bookings } = useBooking();
  
  useEffect(() => {
    const email = localStorage.getItem('paypalMerchantEmail');
    if (email) {
      setPayeeEmail(email);
    } else {
      console.warn("PayPal merchant email not set in admin settings.");
    }
  }, []);

  const bookedDates = useMemo(() => {
    const dates = new Set<string>();
    bookings
      .filter(b => b.vehicleId === vehicle.id && b.status === 'confirmed')
      .forEach(b => {
        let currentDate = new Date(b.startDate + 'T00:00:00');
        const endDate = new Date(b.endDate + 'T00:00:00');
        while (currentDate <= endDate) {
          dates.add(currentDate.toISOString().split('T')[0]);
          currentDate.setDate(currentDate.getDate() + 1);
        }
      });
    return dates;
  }, [bookings, vehicle.id]);


  const { totalPrice, numberOfDays } = useMemo(() => {
    if (dates.startDate && dates.endDate) {
      const start = new Date(dates.startDate);
      const end = new Date(dates.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return { totalPrice: diffDays * vehicle.pricePerDay, numberOfDays: diffDays };
    }
    return { totalPrice: 0, numberOfDays: 0 };
  }, [dates, vehicle.pricePerDay]);
  
  const handleBookingRequest = (paymentMethod: 'paypal' | 'cash') => {
    if (!isFormValid) {
        setFormError('Por favor, completa tu nombre y teléfono para continuar.');
        return;
    }
    setFormError('');
    if (dates.startDate && dates.endDate) {
      addBooking({
        vehicleId: vehicle.id,
        ownerId: vehicle.ownerId,
        startDate: dates.startDate,
        endDate: dates.endDate,
        totalPrice: totalPrice,
      }, paymentMethod);
      onClose();
      onNavigate('bookings');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const renderStepOne = () => (
    <>
      <h2 className="text-2xl font-bold text-primary mb-1">Paso 1: Selecciona las Fechas</h2>
      <p className="text-gray-600 mb-4">{vehicle.brand} {vehicle.name}</p>
      
      <Calendar bookedDates={bookedDates} onDateChange={setDates} />
      
      <div className="mt-6 border-t pt-4">
          {numberOfDays > 0 ? (
              <>
                  <div className="flex justify-between items-center text-gray-700">
                      <span>${vehicle.pricePerDay} x {numberOfDays} días</span>
                      <span className="font-semibold">${totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-primary font-bold text-lg mt-2">
                      <span>Total a Pagar</span>
                      <span>${totalPrice.toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={() => setStep(2)} 
                    className="w-full mt-4 bg-secondary text-primary font-bold py-3 px-6 rounded-md hover:brightness-90 transition-all text-lg"
                  >
                    Continuar
                  </button>
              </>
          ) : (
              <p className="text-center text-gray-500">Selecciona un rango de fechas en el calendario.</p>
          )}
      </div>
    </>
  );

  const renderStepTwo = () => (
    <>
        <div className="flex items-center mb-4">
            <button onClick={() => setStep(1)} className="p-2 rounded-full hover:bg-slate-100 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <h2 className="text-2xl font-bold text-primary">Paso 2: Confirma y Paga</h2>
        </div>
        
        <div className="space-y-4">
            <div>
                <h3 className="font-semibold text-gray-800 mb-2">Tus Datos</h3>
                <div className="space-y-3 bg-slate-50 p-4 rounded-lg">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"/>
                    </div>
                     <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
                        <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"/>
                    </div>
                </div>
            </div>

            <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-2">Resumen de la Reserva</h3>
                <div className="text-gray-700 space-y-1 bg-slate-50 p-4 rounded-lg">
                    <p><strong>Vehículo:</strong> {vehicle.brand} {vehicle.name}</p>
                    <p><strong>Fechas:</strong> {dates.startDate} al {dates.endDate}</p>
                    <div className="flex justify-between items-center text-primary font-bold text-lg pt-2 border-t mt-2">
                        <span>Total</span>
                        <span>${totalPrice.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-2">Elige tu Método de Pago</h3>
                 {formError && <p className="text-red-500 text-sm text-center mb-2">{formError}</p>}
                
                {!isFormValid && (
                  <div className="text-center p-3 mb-4 bg-blue-50 text-blue-700 rounded-md text-sm">
                    <p>Por favor, completa tu nombre y teléfono para habilitar las opciones de pago.</p>
                  </div>
                )}
                
                <div className={!isFormValid ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}>
                    {payeeEmail ? (
                        <div>
                            <PayPalButton amount={totalPrice.toFixed(2)} onSuccess={() => handleBookingRequest('paypal')} payeeEmail={payeeEmail} />
                        </div>
                    ) : (
                        <div className="text-center p-4 bg-yellow-100 text-yellow-800 rounded-md">
                            <p>Los pagos con PayPal no están habilitados. El administrador debe configurar una cuenta.</p>
                        </div>
                    )}
                </div>

                 <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-500 text-sm">O</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                <button 
                    onClick={() => handleBookingRequest('cash')} 
                    disabled={!isFormValid}
                    className="w-full bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-90 transition-all text-lg disabled:bg-slate-400 disabled:cursor-not-allowed">
                    Confirmar Reserva (Pago Contra Entrega)
                </button>
            </div>
        </div>
    </>
  );
  
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
           </svg>
        </button>
        <div className="p-6">
            {step === 1 ? renderStepOne() : renderStepTwo()}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;