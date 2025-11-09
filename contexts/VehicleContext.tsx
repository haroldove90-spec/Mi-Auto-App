import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Vehicle, VehicleData } from '../types';
import { VEHICLES } from '../constants';
import { useNotification } from './NotificationContext';
import { useAuth } from './AuthContext';

interface VehicleContextType {
  vehicles: Vehicle[];
  selectedVehicle: Vehicle | null;
  selectVehicle: (vehicleId: number | null) => void;
  addVehicle: (vehicleData: Omit<VehicleData, 'imageUrl'> & { imageUrls: string[] }) => void;
  updateVehicle: (updatedVehicle: Vehicle) => void;
  deleteVehicle: (vehicleId: number) => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { addNotification } = useNotification();
    const { user, role } = useAuth();
    
    const getInitialState = () => {
        try {
            const storedVehicles = localStorage.getItem('vehicles');
            if (storedVehicles) {
                return JSON.parse(storedVehicles);
            }
        } catch (error) {
            console.error("Failed to parse vehicles from localStorage", error);
        }
        return [...VEHICLES];
    };

  const [vehicles, setVehicles] = useState<Vehicle[]>(getInitialState);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  useEffect(() => {
    try {
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
    } catch (error) {
        console.error("Failed to save vehicles to localStorage", error);
    }
  }, [vehicles]);

  const selectVehicle = (vehicleId: number | null) => {
      if (vehicleId === null) {
          setSelectedVehicle(null);
      } else {
          const vehicle = vehicles.find(v => v.id === vehicleId) || null;
          setSelectedVehicle(vehicle);
      }
  };

  const addVehicle = (vehicleData: Omit<VehicleData, 'imageUrl'> & { imageUrls: string[] }) => {
    if (!user) return;
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: Date.now(),
      ownerId: role === 'admin' ? 'arrendador' : user.username,
      availability: [],
      averageRating: 0,
      imageUrl: vehicleData.imageUrls,
    };
    setVehicles(prevVehicles => [...prevVehicles, newVehicle]);
  };
  
  const updateVehicle = (updatedVehicle: Vehicle) => {
    setVehicles(prevVehicles => 
        prevVehicles.map(vehicle => 
            vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
        )
    );
  };

  const deleteVehicle = (vehicleId: number) => {
    setVehicles(prevVehicles =>
      prevVehicles.filter(vehicle => vehicle.id !== vehicleId)
    );
    addNotification({ message: 'Auto eliminado correctamente.', type: 'info' });
  };

  return (
    <VehicleContext.Provider value={{ vehicles, selectedVehicle, selectVehicle, addVehicle, updateVehicle, deleteVehicle }}>
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicle = (): VehicleContextType => {
  const context = useContext(VehicleContext);
  if (context === undefined) {
    throw new Error('useVehicle must be used within a VehicleProvider');
  }
  return context;
};