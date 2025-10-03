
import React, { useState, useMemo } from 'react';
import { Vehicle } from '../types';
import { useBooking } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';
import { CalendarIcon } from './icons/CalendarIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

interface BookingModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onNavigate: (page: 'bookings') => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ vehicle, onClose, onNavigate }) => {
  const { createBooking } = useBooking();
  const { user } = useAuth();
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [clientName, setClientName] = useState(user?.name || '');
  const [clientEmail, setClientEmail] = useState(`${user?.username}@example.com` || '');
  const [clientPhone, setClientPhone] = useState('');
  
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!vehicle) return null;

  const totalDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start >= end) return 0;
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [startDate, endDate]);

  const totalPrice = totalDays * vehicle.pricePerDay;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!startDate || !endDate) {
      setError('Por favor, selecciona las fechas de inicio y fin.');
      return;
    }
    if (!clientName || !clientEmail || !clientPhone) {
        setError('Por favor, completa todos tus datos personales.');
        return;
    }
    if (totalDays <= 0) {
      setError('La fecha de devolución debe ser posterior a la de recogida.');
      return;
    }
    
    createBooking({
        vehicle,
        startDate,
        endDate,
        clientName,
        clientEmail,
        clientPhone,
    });
    setIsSuccess(true);
  };

  const handleGoToBookings = () => {
    onClose();
    onNavigate('bookings');
  }
  
  const SuccessView = () => (
    <div className="text-center p-8">
        <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-primary mb-2">¡Reserva Confirmada!</h2>
        <p className="text-gray-600 mb-6">Tu {vehicle.brand} {vehicle.name} te estará esperando. Revisa tu correo para más detalles.</p>
        <p className="font-semibold text-lg mb-6">Pago Contra Entrega</p>
        <button 
            onClick={handleGoToBookings}
            className="w-full bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-90 transition-all text-lg">
            Ver Mis Reservas
        </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative animate-fade-in-up overflow-hidden" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
           <svg xmlns="http://www.w.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
           </svg>
        </button>
        
        {isSuccess ? <SuccessView/> : (
        <div className="p-6">
            <h2 className="text-2xl font-bold text-primary mb-2">Confirmar Reserva</h2>
            <p className="text-gray-600 mb-6">Estás a punto de reservar el <span className="font-semibold">{vehicle.brand} {vehicle.name}</span>.</p>
            
            <div className="flex items-start space-x-4 mb-6">
                <img src={vehicle.imageUrl} alt={vehicle.name} className="w-40 h-28 object-cover rounded-lg" />
                <div>
                    <h3 className="text-lg font-bold">{vehicle.brand} {vehicle.name}</h3>
                    <p className="text-xl font-extrabold text-primary">${vehicle.pricePerDay}<span className="text-sm font-normal text-gray-500">/día</span></p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <h4 className="font-semibold text-primary border-b pb-2 mb-4">Fechas de Renta</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">Recogida</label>
                        <div className="relative">
                        <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
                        <input type="date" id="start-date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-gray-900" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">Devolución</label>
                        <div className="relative">
                        <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"/>
                        <input type="date" id="end-date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-gray-900" />
                        </div>
                    </div>
                    </div>
                </div>

                <div>
                    <h4 className="font-semibold text-primary border-b pb-2 mb-4">Datos Personales</h4>
                    <div className="space-y-4">
                         <div>
                            <label htmlFor="client-name" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                            <input type="text" id="client-name" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Tu nombre" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-gray-900" />
                        </div>
                         <div>
                            <label htmlFor="client-email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
                            <input type="email" id="client-email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="tu@email.com" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-gray-900" />
                        </div>
                         <div>
                            <label htmlFor="client-phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                            <input type="tel" id="client-phone" value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="10 dígitos" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-gray-900" />
                        </div>
                    </div>
                </div>
                
                {totalPrice > 0 && (
                    <div className="bg-slate-100 p-4 rounded-lg text-right">
                        <p className="text-gray-600">Total por {totalDays} día(s):</p>
                        <p className="text-2xl font-bold text-primary">${totalPrice.toLocaleString()}</p>
                    </div>
                )}

                {error && <p className="text-red-500 text-sm text-center font-semibold bg-red-100 p-3 rounded-md">{error}</p>}
                
                <button type="submit" className="w-full bg-accent text-primary font-bold py-3 px-6 rounded-md hover:brightness-90 transition-all text-lg">
                    Confirmar Reserva
                </button>
            </form>
        </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
