import React, { useState, useMemo } from 'react';
import { Vehicle, Booking } from '../types';
import { PlusCircleIcon } from '../components/icons/PlusCircleIcon';
import { useVehicle } from '../contexts/VehicleContext';
import { useBooking } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';
import AddCarModal from '../components/AddCarModal';

const MyCarCard: React.FC<{ vehicle: Vehicle; onEdit: (vehicle: Vehicle) => void; onDelete: (vehicleId: number) => void; }> = ({ vehicle, onEdit, onDelete }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
        <img src={vehicle.imageUrl[0]} alt={vehicle.name} className="w-full h-48 object-cover" />
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-bold text-primary">{vehicle.brand} {vehicle.name}</h3>
            <p className="text-gray-600">${vehicle.pricePerDay}/día</p>
            <div className="mt-4 flex space-x-2 mt-auto pt-4 border-t border-slate-100">
                <button 
                    onClick={() => onEdit(vehicle)}
                    className="flex-1 text-sm bg-slate-200 text-slate-800 px-3 py-2 rounded-md hover:bg-slate-300 transition-colors">
                        Editar
                </button>
                <button 
                    onClick={() => onDelete(vehicle.id)}
                    className="flex-1 text-sm bg-red-100 text-red-700 px-3 py-2 rounded-md hover:bg-red-200 transition-colors">
                        Eliminar
                </button>
            </div>
        </div>
    </div>
);

const LessorBookingCard: React.FC<{ booking: Booking }> = ({ booking }) => {
    const { vehicles } = useVehicle();
    const vehicle = vehicles.find(v => v.id === booking.vehicleId);
    if (!vehicle) return null;

    return (
        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
                <img src={vehicle.imageUrl[0]} alt={vehicle.name} className="w-20 h-20 rounded-lg object-cover" />
                <div>
                    <p className="font-bold text-primary">{vehicle.brand} {vehicle.name}</p>
                    <p className="text-sm text-gray-600">Cliente: <strong>{booking.clientId}</strong></p>
                    <p className="text-sm text-gray-600">Fechas: {booking.startDate} al {booking.endDate}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm text-gray-500">Ingreso</p>
                <p className="font-bold text-lg text-green-600">${booking.totalPrice.toLocaleString()}</p>
            </div>
        </div>
    );
};


const MyCarsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Vehicle | null>(null);
  const { user } = useAuth();
  const { vehicles, deleteVehicle } = useVehicle();
  const { bookings } = useBooking();
  const [activeTab, setActiveTab] = useState<'vehicles' | 'bookings'>('vehicles');

  const myCars = vehicles.filter(v => v.ownerId === user?.username);
  const myConfirmedBookings = useMemo(() => {
      const myCarIds = myCars.map(c => c.id);
      return bookings.filter(b => myCarIds.includes(b.vehicleId) && b.status === 'confirmed')
                     .sort((a,b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  }, [bookings, myCars]);

  const handleOpenAddModal = () => {
    setSelectedCar(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (vehicle: Vehicle) => {
    setSelectedCar(vehicle);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCar(null);
  };

  const handleDeleteCar = (vehicleId: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este auto? Esta acción no se puede deshacer.')) {
        deleteVehicle(vehicleId);
    }
  };

  const TabButton: React.FC<{tab: typeof activeTab, label: string, count: number}> = ({tab, label, count}) => (
      <button onClick={() => setActiveTab(tab)} className={`relative px-4 py-2 font-semibold rounded-md transition-colors ${activeTab === tab ? 'bg-primary text-white' : 'text-gray-600 hover:bg-slate-200'}`}>
          {label}
          {count > 0 && <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{count}</span>}
      </button>
  );

  return (
    <>
        <div className="bg-slate-100 min-h-full py-12">
        <div className="container mx-auto px-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-primary">Panel de Arrendador</h1>
                {activeTab === 'vehicles' && (
                    <button 
                        onClick={handleOpenAddModal}
                        className="flex items-center space-x-2 bg-secondary text-primary font-semibold py-2 px-4 rounded-md hover:brightness-90 transition-all">
                        <PlusCircleIcon className="w-5 h-5"/>
                        <span>Agregar Auto</span>
                    </button>
                )}
            </div>

             <div className="mb-8 flex space-x-2 bg-slate-100 p-1 rounded-lg border">
                <TabButton tab="vehicles" label="Mis Vehículos" count={0} />
                <TabButton tab="bookings" label="Reservas" count={myConfirmedBookings.length} />
            </div>

            {activeTab === 'vehicles' && (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {myCars.map(car => (
                        <MyCarCard key={car.id} vehicle={car} onEdit={handleOpenEditModal} onDelete={handleDeleteCar} />
                    ))}
                    {myCars.length === 0 && (
                        <div className="text-center py-16 text-gray-500 bg-white rounded-lg shadow-md col-span-full">
                            <h3 className="text-xl font-semibold">No has publicado ningún auto</h3>
                            <p>¡Publica tu primer auto y empieza a ganar dinero!</p>
                        </div>
                    )}
                </div>
            )}
            
            {activeTab === 'bookings' && (
                <div className="space-y-4">
                    {myConfirmedBookings.map(req => (
                        <LessorBookingCard key={req.id} booking={req} />
                    ))}
                    {myConfirmedBookings.length === 0 && (
                        <div className="text-center py-16 text-gray-500 bg-white rounded-lg shadow-md col-span-full">
                            <h3 className="text-xl font-semibold">No tienes reservas confirmadas</h3>
                            <p>Cuando un cliente pague por la reserva de uno de tus autos, aparecerá aquí.</p>
                        </div>
                    )}
                </div>
            )}

        </div>
        </div>
        {isModalOpen && <AddCarModal onClose={handleCloseModal} vehicleToEdit={selectedCar} />}
    </>
  );
};

export default MyCarsPage;