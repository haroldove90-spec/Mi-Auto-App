import React from 'react';
import { Vehicle } from '../types';

interface Filters {
  type: string;
  price: string;
  transmission: string;
  fuel: string;
}

interface VehicleFiltersProps {
  vehicles: Vehicle[];
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  onReset: () => void;
}

const VehicleFilters: React.FC<VehicleFiltersProps> = ({ vehicles, filters, onFilterChange, onReset }) => {

  const vehicleTypes = [...new Set(vehicles.map(v => v.specs.type))];
  const transmissions = [...new Set(vehicles.map(v => v.specs.transmission))];
  const fuelTypes = [...new Set(vehicles.map(v => v.specs.fuel))];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onFilterChange({ ...filters, [name]: value });
  };
  
  return (
    <div className="bg-slate-50 py-6">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Vehículo</label>
              <select id="type" name="type" value={filters.type} onChange={handleChange} className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-gray-900">
                <option value="all">Todos</option>
                {vehicleTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Precio Máximo/Día</label>
              <select id="price" name="price" value={filters.price} onChange={handleChange} className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-gray-900">
                <option value="any">Cualquiera</option>
                <option value="50">Hasta $50</option>
                <option value="80">Hasta $80</option>
                <option value="120">Hasta $120</option>
                <option value="200">Hasta $200</option>
              </select>
            </div>

            <div>
              <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 mb-1">Transmisión</label>
              <select id="transmission" name="transmission" value={filters.transmission} onChange={handleChange} className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-gray-900">
                <option value="all">Todas</option>
                {transmissions.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

             <div>
              <label htmlFor="fuel" className="block text-sm font-medium text-gray-700 mb-1">Combustible</label>
              <select id="fuel" name="fuel" value={filters.fuel} onChange={handleChange} className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-gray-900">
                <option value="all">Todos</option>
                {fuelTypes.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>

          <div>
             <button
              onClick={onReset}
              className="w-full bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-md hover:bg-slate-300 transition-colors duration-200"
            >
              Limpiar
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default VehicleFilters;