import React from 'react';
import { LocationIcon } from './icons/LocationIcon';
import { CalendarIcon } from './icons/CalendarIcon';

interface HeroProps {
  onSearch: () => void;
}

const Hero: React.FC<HeroProps> = ({ onSearch }) => {
  return (
    <div className="relative h-[60vh] min-h-[450px] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')" }}>
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative container mx-auto px-6 h-full flex flex-col justify-center items-start text-white">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">Tu viaje, tu elección</h2>
        <p className="text-lg md:text-xl max-w-2xl mb-8 drop-shadow-md">Renta autos de personas cerca de ti. Seguro, fácil y al mejor precio.</p>
        
        <div className="bg-white p-4 lg:p-6 rounded-lg shadow-2xl w-full max-w-4xl text-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
            <div className="flex-grow">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
              <div className="relative">
                <LocationIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"/>
                <input type="text" id="location" placeholder="Ciudad, aeropuerto, o dirección" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-gray-900" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 lg:col-span-1">
               <div>
                <label htmlFor="pickup-date" className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                 <div className="relative">
                   <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"/>
                   <input type="date" id="pickup-date" className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-gray-900" />
                 </div>
              </div>
              <div>
                <label htmlFor="dropoff-date" className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                <div className="relative">
                  <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"/>
                  <input type="date" id="dropoff-date" className="w-full pl-10 pr-2 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-gray-900" />
                </div>
              </div>
            </div>
            
            <button
              onClick={onSearch}
              className="w-full bg-accent text-primary font-bold py-3 px-6 rounded-md hover:brightness-90 transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;