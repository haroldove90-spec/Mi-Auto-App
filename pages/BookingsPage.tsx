import React from 'react';
import { useBooking } from '../contexts/BookingContext';
import { Booking } from '../types';

const BookingCard: React.FC<{ booking: Booking }> = ({ booking }) => {
    
    const getStatusChipClass = (status: Booking['status']) => {
        switch (status) {
            case 'confirmada':
                return 'bg-blue-100 text-blue-800';
            case 'completada':
                return 'bg-green-100 text-green-800';
            case 'cancelada':
                return 'bg-red-100 text-red-800';
        }
    }
    
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
            <img src={booking.vehicle.imageUrl} alt={booking.vehicle.name} className="w-full md:w-1/3 h-48 md:h-auto object-cover" />
            <div className="p-4 flex flex-col flex-grow">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-primary">{booking.vehicle.brand} {booking.vehicle.name}</h3>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getStatusChipClass(booking.status)} capitalize`}>{booking.status}</span>
                    </div>
                    <p className="text-sm text-gray-500">{booking.vehicle.specs.type}</p>
                    <p className="text-sm text-gray-600 mt-1">Reservado por: <span className="font-semibold">{booking.clientName}</span></p>
                </div>
                <div className="grid grid-cols-2 gap-4 my-4 text-sm text-gray-700">
                    <div>
                        <p className="font-semibold">Recogida:</p>
                        <p>{new Date(booking.startDate).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                     <div>
                        <p className="font-semibold">Devolución:</p>
                        <p>{new Date(booking.endDate).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-100">
                    <div>
                        <p className="text-sm text-gray-500">Total Pagado:</p>
                        <p className="text-lg font-extrabold text-primary">${booking.totalPrice.toLocaleString()}</p>
                    </div>
                    <button className="text-sm text-primary hover:underline">Ver detalles</button>
                </div>
            </div>
        </div>
    );
};

const BookingsPage: React.FC = () => {
  const { bookings } = useBooking();
  
  return (
    <div className="bg-slate-100 min-h-full py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8">Mis Reservas</h1>
        
        {bookings.length > 0 ? (
          <div className="space-y-6">
              {bookings.map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
              ))}
          </div>
        ) : (
            <div className="text-center py-16 text-gray-500 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold">Aún no tienes reservas</h3>
                <p>¡Encuentra tu auto ideal y empieza a viajar!</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
