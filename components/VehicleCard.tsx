import React from 'react';
import { Vehicle } from '../types';
import { UserIcon } from './icons/UserIcon';
import { GasIcon } from './icons/GasIcon';
import { TransmissionIcon } from './icons/TransmissionIcon';

const StarIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);


interface VehicleCardProps {
  vehicle: Vehicle;
  onViewDetails: (vehicleId: number) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onViewDetails }) => {
  return (
    <div 
        className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl cursor-pointer"
        onClick={() => onViewDetails(vehicle.id)}
    >
      <div className="relative">
        <img loading="lazy" className="w-full h-48 object-cover" src={vehicle.imageUrl[0]} alt={`${vehicle.brand} ${vehicle.name}`} />
        <div className="absolute top-2 right-2 bg-primary/80 text-white text-xs font-bold px-2 py-1 rounded">{vehicle.specs.type}</div>
         <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded-md flex items-center">
            <StarIcon className="w-4 h-4 text-yellow-400 mr-1"/>
            <span className="text-sm font-bold">{vehicle.averageRating.toFixed(1)}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800">{vehicle.brand} {vehicle.name} ({vehicle.year})</h3>
        <p className="text-sm text-gray-500">{vehicle.location}</p>
        
        <div className="grid grid-cols-3 gap-2 text-center my-4 text-gray-600 text-sm">
          <div className="flex flex-col items-center p-2 rounded-lg bg-slate-100">
            <UserIcon className="w-5 h-5 mb-1 text-secondary" />
            <span>{vehicle.specs.passengers}</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-slate-100">
            <TransmissionIcon className="w-5 h-5 mb-1 text-secondary" />
            <span>{vehicle.specs.transmission}</span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-lg bg-slate-100">
            <GasIcon className="w-5 h-5 mb-1 text-secondary" />
            <span>{vehicle.specs.fuel}</span>
          </div>
        </div>

        <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-100">
            <p className="text-lg font-extrabold text-primary">
                ${vehicle.pricePerDay}<span className="text-sm font-normal text-gray-500">/día</span>
            </p>
            <button
                className="bg-secondary text-primary font-semibold py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors duration-300 transform group-hover:scale-105"
            >
                Ver Detalles
            </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;