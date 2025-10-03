import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import VehicleList from '../components/VehicleList';
import BookingModal from '../components/BookingModal';
import { Vehicle, Page } from '../types';
import { useVehicle } from '../contexts/VehicleContext';

interface HomePageProps {
    onNavigate: (page: Page) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { vehicles } = useVehicle();
  const [displayedVehicles, setDisplayedVehicles] = useState<Vehicle[]>(vehicles);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  // Update displayed vehicles if the main list changes (e.g., a car is added/deleted)
  useEffect(() => {
    setDisplayedVehicles(vehicles);
  }, [vehicles]);
  
  const handleSearch = () => {
    setIsSearching(true);
    // Simulate API call with search filters
    setTimeout(() => {
        // In a real app, you would filter based on search criteria from Hero component
        // For this demo, we'll just shuffle the list to show a change
        setDisplayedVehicles([...vehicles].sort(() => Math.random() - 0.5));
        setIsSearching(false);
    }, 1000);
  };
  
  const handleRentNow = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleCloseModal = () => {
    setSelectedVehicle(null);
  };

  return (
    <>
      <Hero onSearch={handleSearch} />
      <VehicleList vehicles={displayedVehicles} onRentNow={handleRentNow} isSearching={isSearching} />
      {selectedVehicle && <BookingModal vehicle={selectedVehicle} onClose={handleCloseModal} onNavigate={onNavigate as (page: 'bookings') => void} />}
    </>
  );
};

export default HomePage;