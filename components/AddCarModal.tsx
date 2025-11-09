import React, { useState, useEffect } from 'react';
import { useVehicle } from '../contexts/VehicleContext';
import { useNotification } from '../contexts/NotificationContext';
import { Vehicle } from '../types';

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
        imageUrls: [...vehicleToEdit.imageUrl],
        pricePerDay: String(vehicleToEdit.pricePerDay),
        location: vehicleToEdit.location,
        specs: vehicleToEdit.specs,
        features: new Set(vehicleToEdit.features),
      };
    }
    return {
      brand: '', name: '', year: '', licensePlate: '', imageUrls: [''], pricePerDay: '', location: '',
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
  
  const handleImageUrlChange = (index: number, value: string) => {
    setFormData(prev => {
        const newImageUrls = [...prev.imageUrls];
        newImageUrls[index] = value;
        return { ...prev, imageUrls: newImageUrls };
    });
  };

  const addImageUrlField = () => {
      if (formData.imageUrls.length < 11) { // 1 main + 10 additional
          setFormData(prev => ({ ...prev, imageUrls: [...prev.imageUrls, '']}));
      }
  };

  const removeImageUrlField = (index: number) => {
      // Cannot remove the main image field
      if (index === 0) return;
      setFormData(prev => ({ ...prev, imageUrls: prev.imageUrls.filter((_, i) => i !== index) }));
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

    const { brand, name, imageUrls, pricePerDay, specs, year, licensePlate, location, features } = formData;
    const finalImageUrls = imageUrls.filter(url => url.trim() !== '');

    if (!brand || !name || finalImageUrls.length === 0 || !pricePerDay || !specs.type || !specs.passengers || !year || !licensePlate || !location) {
      setError('Todos los campos son obligatorios y debe haber al menos una imagen principal.');
      return;
    }
    const price = parseFloat(pricePerDay);
    if (isNaN(price) || price <= 0) {
        setError('El precio por día debe ser un número válido.');
        return;
    }

    const vehicleData = {
        brand, name, 
        pricePerDay: price, specs,
        year: parseInt(year), licensePlate, location, features: Array.from(features)
    };

    if (isEditMode && vehicleToEdit) {
        // @ts-ignore
        updateVehicle({ ...vehicleToEdit, ...vehicleData, imageUrl: finalImageUrls });
        addNotification({ message: '¡Auto actualizado exitosamente!', type: 'success' });
    } else {
        // @ts-ignore
        addVehicle({ ...vehicleData, imageUrls: finalImageUrls });
        addNotification({ message: '¡Auto agregado exitosamente!', type: 'success' });
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
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
                </div>
                 <div className="border-t pt-4">
                     <h4 className="font-semibold text-primary mb-2">Imágenes del Vehículo</h4>
                     <div>
                         <label className="block text-sm font-medium text-gray-700 mb-1">Imagen Principal (URL)</label>
                         <input type="text" value={formData.imageUrls[0]} onChange={(e) => handleImageUrlChange(0, e.target.value)} placeholder="https://ejemplo.com/foto.png" className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"/>
                     </div>
                     <div className="mt-4">
                         <label className="block text-sm font-medium text-gray-700 mb-1">Imágenes Adicionales ({formData.imageUrls.length - 1} / 10)</label>
                         <div className="space-y-2">
                             {formData.imageUrls.slice(1).map((url, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input type="text" value={url} onChange={(e) => handleImageUrlChange(index + 1, e.target.value)} placeholder={`URL de imagen adicional ${index + 1}`} className="flex-grow px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900"/>
                                    <button type="button" onClick={() => removeImageUrlField(index + 1)} className="p-2 text-red-500 hover:bg-red-100 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                    </button>
                                </div>
                             ))}
                         </div>
                         {formData.imageUrls.length < 11 && (
                            <button type="button" onClick={addImageUrlField} className="mt-2 text-sm text-primary font-semibold hover:underline">
                                + Agregar otra imagen
                            </button>
                         )}
                     </div>
                      <div className="mt-4 grid grid-cols-4 gap-2">
                        {formData.imageUrls.map((url, index) => url && (
                            <img key={index} src={url} alt={`Preview ${index}`} className="w-full h-20 object-cover rounded-md border" onError={(e) => e.currentTarget.style.display='none'} onLoad={(e) => e.currentTarget.style.display='block'}/>
                        ))}
                    </div>
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