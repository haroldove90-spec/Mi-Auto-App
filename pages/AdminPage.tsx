import React, { useState } from 'react';
import { Vehicle } from '../types';
import { PlusCircleIcon } from '../components/icons/PlusCircleIcon';
import { useVehicle } from '../contexts/VehicleContext';
import AddCarModal from '../components/AddCarModal';

const AdminVehicleCard: React.FC<{ vehicle: Vehicle; onEdit: (vehicle: Vehicle) => void; onDelete: (vehicleId: number) => void; }> = ({ vehicle, onEdit, onDelete }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
        <img src={vehicle.imageUrl[0]} alt={vehicle.name} className="w-full h-48 object-cover" />
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-bold text-primary">{vehicle.brand} {vehicle.name}</h3>
            <p className="text-sm text-gray-500">Propietario: <span className="font-semibold">{vehicle.ownerId}</span></p>
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


const AdminPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Vehicle | null>(null);
  const { vehicles, deleteVehicle } = useVehicle();

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

  return (
    <>
      <div className="bg-slate-100 min-h-full py-12">
          <div className="container mx-auto px-6">
              <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-primary">Gestión de Vehículos</h1>
                 <button 
                    onClick={handleOpenAddModal}
                    className="flex items-center space-x-2 bg-secondary text-primary font-semibold py-2 px-4 rounded-md hover:brightness-90 transition-all">
                    <PlusCircleIcon className="w-5 h-5"/>
                    <span>Agregar Vehículo</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {vehicles.map(car => (
                      <AdminVehicleCard key={car.id} vehicle={car} onEdit={handleOpenEditModal} onDelete={handleDeleteCar} />
                  ))}
                  {vehicles.length === 0 && (
                      <div className="text-center py-16 text-gray-500 bg-white rounded-lg shadow-md col-span-full">
                          <h3 className="text-xl font-semibold">No hay vehículos en la plataforma</h3>
                          <p>Agrega el primer vehículo para empezar.</p>
                      </div>
                  )}
              </div>
          </div>
      </div>
      {isModalOpen && <AddCarModal onClose={handleCloseModal} vehicleToEdit={selectedCar} />}
    </>
  );
};

export default AdminPage;
