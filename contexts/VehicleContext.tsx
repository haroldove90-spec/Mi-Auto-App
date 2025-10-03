import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Vehicle } from '../types';
import { VEHICLES } from '../constants';
import { useNotification } from './NotificationContext';

type VehicleData = Omit<Vehicle, 'id' | 'owner'>;

interface VehicleContextType {
  vehicles: Vehicle[];
  addVehicle: (vehicleData: VehicleData) => void;
  updateVehicle: (updatedVehicle: Vehicle) => void;
  deleteVehicle: (vehicleId: number) => void;
}

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { addNotification } = useNotification();
    
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

  useEffect(() => {
    try {
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
    } catch (error) {
        console.error("Failed to save vehicles to localStorage", error);
    }
  }, [vehicles]);

  const addVehicle = (vehicleData: VehicleData) => {
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: Date.now(),
      owner: 'lessor',
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
    <VehicleContext.Provider value={{ vehicles, addVehicle, updateVehicle, deleteVehicle }}>
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