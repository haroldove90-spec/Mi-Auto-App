
import React, { useState, useEffect } from 'react';
import { useVehicle } from '../contexts/VehicleContext';
import { useNotification } from '../contexts/NotificationContext';
import { Vehicle, VehicleSpecs } from '../types';

interface AddCarModalProps {
  onClose: () => void;
  vehicleToEdit: Vehicle | null;
}

const AddCarModal: React.FC<AddCarModalProps> = ({ onClose, vehicleToEdit }) => {
  const { addVehicle, updateVehicle } = useVehicle();
  const { addNotification } = useNotification();

  const isEditMode = Boolean(vehicleToEdit);

  const [brand, setBrand] = useState('');
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [pricePerDay, setPricePerDay] = useState('');
  const [specs, setSpecs] = useState<VehicleSpecs>({
    type: '',
    passengers: 5,
    transmission: 'Automática',
    fuel: 'Gasolina',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode && vehicleToEdit) {
      setBrand(vehicleToEdit.brand);
      setName(vehicleToEdit.name);
      setImageUrl(vehicleToEdit.imageUrl);
      setPricePerDay(String(vehicleToEdit.pricePerDay));
      setSpecs(vehicleToEdit.specs);
    }
  }, [isEditMode, vehicleToEdit]);

  const handleSpecsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setSpecs(prev => ({ ...prev, [name]: name === 'passengers' ? parseInt(value) || 0 : value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!brand || !name || !imageUrl || !pricePerDay || !specs.type || !specs.passengers) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    const price = parseFloat(pricePerDay);
    if (isNaN(price) || price <= 0) {
        setError('El precio por día debe ser un número válido.');
        return;
    }

    const vehicleData = {
        brand,
        name,
        imageUrl,
        pricePerDay: price,
        specs,
    };

    if (isEditMode && vehicleToEdit) {
        updateVehicle({ ...vehicleToEdit, ...vehicleData });
        addNotification({ message: '¡Auto actualizado exitosamente!', type: 'success' });
    } else {
        addVehicle(vehicleData);
        addNotification({ message: '¡Auto agregado exitosamente!', type: 'success' });
    }
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
           </svg>
        </button>
        
        <div className="p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">{isEditMode ? 'Editar Auto' : 'Agregar Nuevo Auto'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div>
                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
                    <input type="text" id="brand" value={brand} onChange={e => setBrand(e.target.value)} placeholder="Ej. Toyota" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-gray-900" />
                </div>
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre / Modelo</label>
                    <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Corolla" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-gray-900" />
                </div>
                <div>
                    <label htmlFor="imageUpload" className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
                    <input type="file" id="imageUpload" accept="image/png, image/jpeg, image/webp" onChange={handleImageChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary/20 file:text-primary hover:file:bg-secondary/30"/>
                    {imageUrl && <img src={imageUrl} alt="Vista previa" className="mt-2 rounded-lg w-40 h-auto object-cover" />}
                </div>
                 <div>
                    <label htmlFor="pricePerDay" className="block text-sm font-medium text-gray-700 mb-1">Precio por Día (USD)</label>
                    <input type="number" id="pricePerDay" value={pricePerDay} onChange={e => setPricePerDay(e.target.value)} placeholder="Ej. 50" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-gray-900" />
                </div>

                <div className="border-t pt-4">
                     <h4 className="font-semibold text-primary mb-2">Especificaciones</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">Tipo de Vehículo</label>
                            <input type="text" id="type" name="type" value={specs.type} onChange={handleSpecsChange} placeholder="Ej. Sedán" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-gray-900" />
                        </div>
                        <div>
                            <label htmlFor="passengers" className="block text-sm font-medium text-gray-700 mb-1">Pasajeros</label>
                            <input type="number" id="passengers" name="passengers" value={specs.passengers} onChange={handleSpecsChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-gray-900" />
                        </div>
                        <div>
                            <label htmlFor="transmission" className="block text-sm font-medium text-gray-700 mb-1">Transmisión</label>
                            <select id="transmission" name="transmission" value={specs.transmission} onChange={handleSpecsChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-gray-900">
                                <option>Automática</option>
                                <option>Manual</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="fuel" className="block text-sm font-medium text-gray-700 mb-1">Combustible</label>
                            <select id="fuel" name="fuel" value={specs.fuel} onChange={handleSpecsChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-gray-900">
                                <option>Gasolina</option>
                                <option>Diesel</option>
                                <option>Eléctrico</option>
                                <option>Híbrido</option>
                            </select>
                        </div>
                     </div>
                </div>

                {error && <p className="text-red-500 text-sm text-center font-semibold bg-red-100 p-3 rounded-md">{error}</p>}
                
                <div className="pt-4">
                    <button type="submit" className="w-full bg-accent text-primary font-bold py-3 px-6 rounded-md hover:brightness-90 transition-all text-lg">
                        {isEditMode ? 'Guardar Cambios' : 'Agregar Auto'}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default AddCarModal;
