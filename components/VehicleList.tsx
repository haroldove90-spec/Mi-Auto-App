
import React from 'react';
import { Vehicle } from '../types';
import VehicleCard from './VehicleCard';
import { CarIcon } from './icons/CarIcon';

interface VehicleListProps {
  vehicles: Vehicle[];
  onRentNow: (vehicle: Vehicle) => void;
  isSearching: boolean;
}

const SkeletonCard: React.FC = () => (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden animate-pulse">
      <div className="bg-slate-200 h-48 w-full"></div>
      <div className="p-4">
        <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
        <div className="h-10 bg-slate-200 rounded w-full"></div>
      </div>
    </div>
);

const VehicleList: React.FC<VehicleListProps> = ({ vehicles, onRentNow, isSearching }) => {
  return (
    <section id="vehicles" className="py-12 md:py-20 bg-slate-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">Nuestra Flota</h2>
            <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Elige entre una amplia variedad de autos que se adaptan a tus necesidades y presupuesto.</p>
        </div>
        {isSearching ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} onRentNow={onRentNow} />
            ))}
          </div>
        )}
        { !isSearching && vehicles.length === 0 && (
            <div className="text-center py-16 text-gray-500">
                <CarIcon className="w-16 h-16 mx-auto mb-4 text-gray-300"/>
                <h3 className="text-xl font-semibold">No se encontraron vehículos</h3>
                <p>Intenta cambiar tus criterios de búsqueda.</p>
            </div>
        )}
      </div>
    </section>
  );
};

export default VehicleList;
