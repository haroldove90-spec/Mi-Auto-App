import React from 'react';
import { Vehicle } from '../types';
import { UserIcon } from './icons/UserIcon';
import { GasIcon } from './icons/GasIcon';
import { TransmissionIcon } from './icons/TransmissionIcon';

interface VehicleCardProps {
  vehicle: Vehicle;
  onRentNow: (vehicle: Vehicle) => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onRentNow }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col group transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
      <div className="relative">
        <img className="w-full h-48 object-cover" src={vehicle.imageUrl} alt={`${vehicle.brand} ${vehicle.name}`} />
        <div className="absolute top-2 right-2 bg-primary/80 text-white text-xs font-bold px-2 py-1 rounded">{vehicle.specs.type}</div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800">{vehicle.brand} {vehicle.name}</h3>
        
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
                onClick={() => onRentNow(vehicle)}
                className="bg-secondary text-primary font-semibold py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors duration-300 transform group-hover:scale-105"
            >
                Rentar ahora
            </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
