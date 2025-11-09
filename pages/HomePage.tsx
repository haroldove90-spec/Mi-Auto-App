import React, { useState, useEffect, useMemo } from 'react';
import Hero from '../components/Hero';
import VehicleList from '../components/VehicleList';
import { Vehicle, Page } from '../types';
import { useVehicle } from '../contexts/VehicleContext';
import { useAuth } from '../contexts/AuthContext';
import VehicleFilters from '../components/VehicleFilters';

interface HomePageProps {
    onNavigate: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { vehicles, selectVehicle } = useVehicle();
  const { users, role } = useAuth();
  const [isSearching, setIsSearching] = useState(false);
  
  const [filters, setFilters] = useState({
    type: 'all',
    price: 'any',
    transmission: 'all',
    fuel: 'all',
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 500);
  };

  const resetFilters = () => {
    setFilters({ type: 'all', price: 'any', transmission: 'all', fuel: 'all' });
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 500);
  };
  
  const filteredVehicles = useMemo(() => {
    const verifiedLessorUsernames = new Set(
        Object.entries(users)
            .filter(([, userData]) => userData.role === 'arrendador' && userData.isVerified)
            .map(([username]) => username)
    );

    return vehicles.filter(vehicle => {
      if (role !== 'admin' && !verifiedLessorUsernames.has(vehicle.ownerId)) {
        return false;
      }
      
      // Type filter
      if (filters.type !== 'all' && vehicle.specs.type !== filters.type) {
        return false;
      }
      // Transmission filter
      if (filters.transmission !== 'all' && vehicle.specs.transmission !== filters.transmission) {
        return false;
      }
      // Fuel filter
      if (filters.fuel !== 'all' && vehicle.specs.fuel !== filters.fuel) {
        return false;
      }
      // Price filter
      if (filters.price !== 'any') {
        const maxPrice = parseInt(filters.price, 10);
        if (vehicle.pricePerDay > maxPrice) {
          return false;
        }
      }
      return true;
    });
  }, [vehicles, filters, users, role]);


  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
        setIsSearching(false);
    }, 1000);
  };
  
  const handleViewDetails = (vehicleId: number) => {
    selectVehicle(vehicleId);
    onNavigate('vehicle-detail');
  };


  return (
    <>
      <Hero onSearch={handleSearch} />
      <VehicleFilters 
        vehicles={vehicles} 
        filters={filters} 
        onFilterChange={handleFilterChange}
        onReset={resetFilters}
      />
      <VehicleList vehicles={filteredVehicles} onViewDetails={handleViewDetails} isSearching={isSearching} />
    </>
  );
};

export default HomePage;