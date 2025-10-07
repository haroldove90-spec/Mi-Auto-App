import React, { useState, useEffect } from 'react';
import { useVehicle } from '../contexts/VehicleContext';
import { useNotification } from '../contexts/NotificationContext';
import { Vehicle, VehicleSpecs } from '../types';

interface AddCarModalProps {
  onClose: () => void;
  vehicleToEdit: Vehicle | null;
}

const ALL_FEATURES = ['Aire Acondicionado', 'GPS', 'Bluetooth', 'Cámara de Reversa', 'Techo Solar', 'Asientos de Piel', 'Modo Sport', 'Entretenimiento DVD'];

const AddCarModal: React.FC<AddCarModalProps> = ({ onClose, vehicleToEdit }) => {
  const { addVehicle, updateVehicle } = useVehicle();
  const { addNotification } = useNotification();

  const isEditMode = Boolean(vehicleToEdit);

  const getInitialState = () => {
    if (isEditMode && vehicleToEdit) {
      return {
        brand: vehicleToEdit.brand,
        name: vehicleToEdit.name,
        year: String(vehicleToEdit.year),
        licensePlate: vehicleToEdit.licensePlate,
        imageUrl: vehicleToEdit.imageUrl[0] || '',
        pricePerDay: String(vehicleToEdit.pricePerDay),
        location: vehicleToEdit.location,
        specs: vehicleToEdit.specs,
        features: new Set(vehicleToEdit.features),
      };
    }
    return {
      brand: '', name: '', year: '', licensePlate: '', imageUrl: '', pricePerDay: '', location: '',
      specs: { type: '', passengers: 5, transmission: 'Automática' as const, fuel: 'Gasolina' as const },
      features: new Set<string>(),
    };
  };

  const [formData, setFormData] = useState(getInitialState);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, specs: { ...prev.specs, [name]: name === 'passengers' ? parseInt(value) || 0 : value }}));
  };

  const handleFeatureChange = (feature: string) => {
      setFormData(prev => {
          const newFeatures = new Set(prev.features);
          if (newFeatures.has(feature)) {
              newFeatures.delete(feature);
          } else {
              newFeatures.add(feature);
          }
          return { ...prev, features: newFeatures };
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { brand, name, imageUrl, pricePerDay, specs, year, licensePlate, location, features } = formData;
    if (!brand || !name || !imageUrl || !pricePerDay || !specs.type || !specs.passengers || !year || !licensePlate || !location) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    const price = parseFloat(pricePerDay);
    if (isNaN(price) || price <= 0) {
        setError('El precio por día debe ser un número válido.');
        return;
    }

    const vehicleData = {
        brand, name, imageUrl, pricePerDay: price, specs,
        year: parseInt(year), licensePlate, location, features: Array.from(features)
    };

    if (isEditMode && vehicleToEdit) {
        // @ts-ignore
        updateVehicle({ ...vehicleToEdit, ...vehicleData, imageUrl: [imageUrl] });
        addNotification({ message: '¡Auto actualizado exitosamente!', type: 'success' });
    } else {
        // @ts-ignore
        addVehicle(vehicleData);
        addNotification({ message: '¡Auto agregado exitosamente!', type: 'success' });
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
           </svg>
        </button>
        
        <div className="p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">{isEditMode ? 'Editar Vehículo' : 'Agregar Nuevo Vehículo'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="Marca (Ej. Toyota)" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900" />
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Modelo (Ej. Corolla)" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900" />
                    <input type="number" name="year" value={formData.year} onChange={handleInputChange} placeholder="Año (Ej. 2023)" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900" />
                    <input type="text" name="licensePlate" value={formData.licensePlate} onChange={handleInputChange} placeholder="Matrícula (Ej. ABC-123)" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900" />
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange} placeholder="Ubicación (Ej. Ciudad de México)" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900" />
                    <input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleInputChange} placeholder="Precio por Día (MXN)" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900" />
                    <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} placeholder="URL de la Imagen Principal" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 col-span-full" />
                </div>

                <div className="border-t pt-4">
                     <h4 className="font-semibold text-primary mb-2">Especificaciones</h4>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <input type="text" name="type" value={formData.specs.type} onChange={handleSpecsChange} placeholder="Tipo (Ej. Sedán)" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900" />
                        <input type="number" name="passengers" value={formData.specs.passengers} onChange={handleSpecsChange} placeholder="Pasajeros" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900" />
                        <select name="transmission" value={formData.specs.transmission} onChange={handleSpecsChange} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"><option>Automática</option><option>Manual</option></select>
                        <select name="fuel" value={formData.specs.fuel} onChange={handleSpecsChange} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"><option>Gasolina</option><option>Diesel</option><option>Eléctrico</option><option>Híbrido</option></select>
                     </div>
                </div>

                 <div className="border-t pt-4">
                     <h4 className="font-semibold text-primary mb-2">Características Adicionales</h4>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {ALL_FEATURES.map(feature => (
                            <label key={feature} className="flex items-center space-x-2 text-sm">
                                <input type="checkbox" checked={formData.features.has(feature)} onChange={() => handleFeatureChange(feature)} className="rounded text-primary focus:ring-primary"/>
                                <span>{feature}</span>
                            </label>
                        ))}
                     </div>
                </div>

                {error && <p className="text-red-500 text-sm text-center font-semibold bg-red-100 p-3 rounded-md">{error}</p>}
                
                <div className="pt-4">
                    <button type="submit" className="w-full bg-accent text-primary font-bold py-3 px-6 rounded-md hover:brightness-90 transition-all text-lg">
                        {isEditMode ? 'Guardar Cambios' : 'Agregar Vehículo'}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AddCarModal;