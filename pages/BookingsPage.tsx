import React, { useState, useMemo } from 'react';
import { useBooking } from '../contexts/BookingContext';
import { useVehicle } from '../contexts/VehicleContext';
import { useAuth } from '../contexts/AuthContext';
import { Booking, Vehicle } from '../types';
import ReviewModal from '../components/ReviewModal';

const BookingCard: React.FC<{ booking: Booking; vehicle?: Vehicle; onReview: (booking: Booking) => void; }> = ({ booking, vehicle, onReview }) => {
    
    const getStatusChipClass = (status: Booking['status']) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
            case 'rejected':
                return 'bg-red-100 text-red-800';
        }
    }
    
    if (!vehicle) return null;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row">
            <img src={vehicle.imageUrl[0]} alt={vehicle.name} className="w-full md:w-1/3 h-48 md:h-auto object-cover" />
            <div className="p-4 flex flex-col flex-grow">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="text-lg font-bold text-primary">{vehicle.brand} {vehicle.name}</h3>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${getStatusChipClass(booking.status)} capitalize`}>{booking.status}</span>
                    </div>
                    <p className="text-sm text-gray-500">{vehicle.specs.type}</p>
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
                        <p className="text-sm text-gray-500">Total:</p>
                        <p className="text-lg font-extrabold text-primary">${booking.totalPrice.toLocaleString()}</p>
                    </div>
                    {booking.status === 'completed' && (
                        <button onClick={() => onReview(booking)} className="text-sm text-primary font-semibold hover:underline">Dejar Reseña</button>
                    )}
                     {booking.status === 'confirmed' && (
                        <button className="text-sm text-gray-600 hover:underline">Contactar al Dueño</button>
                    )}
                </div>
            </div>
        </div>
    );
};

const BookingsPage: React.FC<{onNavigate: (page: 'home') => void}> = ({ onNavigate }) => {
  const { bookings } = useBooking();
  const { vehicles } = useVehicle();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [bookingToReview, setBookingToReview] = useState<Booking | null>(null);

  const myBookings = useMemo(() => {
    return bookings.filter(b => b.clientId === user?.username).sort((a,b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
  }, [bookings, user]);

  const filteredBookings = useMemo(() => {
    switch(activeTab) {
        case 'upcoming':
            return myBookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
        case 'completed':
            return myBookings.filter(b => b.status === 'completed');
        case 'cancelled':
            return myBookings.filter(b => b.status === 'cancelled' || b.status === 'rejected');
        default:
            return [];
    }
  }, [activeTab, myBookings]);

  const TabButton: React.FC<{tab: typeof activeTab, label: string}> = ({tab, label}) => (
      <button onClick={() => setActiveTab(tab)} className={`px-4 py-2 font-semibold rounded-md transition-colors ${activeTab === tab ? 'bg-primary text-white' : 'text-gray-600 hover:bg-slate-200'}`}>
          {label}
      </button>
  );
  
  return (
    <>
    <div className="bg-slate-100 min-h-full py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8">Mis Viajes</h1>
        
        <div className="mb-8 flex space-x-2 bg-slate-100 p-1 rounded-lg border">
            <TabButton tab="upcoming" label="Próximos" />
            <TabButton tab="completed" label="Completados" />
            <TabButton tab="cancelled" label="Cancelados" />
        </div>

        {filteredBookings.length > 0 ? (
          <div className="space-y-6">
              {filteredBookings.map(booking => {
                  const vehicle = vehicles.find(v => v.id === booking.vehicleId);
                  return <BookingCard key={booking.id} booking={booking} vehicle={vehicle} onReview={setBookingToReview} />
              })}
          </div>
        ) : (
            <div className="text-center py-16 text-gray-500 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold">No tienes viajes en esta categoría</h3>
                <p className="mt-2">¡Encuentra tu auto ideal y empieza a viajar!</p>
                 <button onClick={() => onNavigate('home')} className="mt-4 bg-secondary text-primary font-semibold py-2 px-4 rounded-md hover:brightness-90 transition-all">
                    Buscar Vehículos
                </button>
            </div>
        )}
      </div>
    </div>
    {bookingToReview && <ReviewModal booking={bookingToReview} onClose={() => setBookingToReview(null)} />}
    </>
  );
};

export default BookingsPage;