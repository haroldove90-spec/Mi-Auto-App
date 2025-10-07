import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Page } from '../types';
import { ClipboardListIcon } from './icons/ClipboardListIcon';
import { CarIcon } from './icons/CarIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { CogIcon } from './icons/CogIcon';

interface BottomNavProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center flex-1 pt-2 pb-1 transition-colors duration-200 ${
      isActive ? 'text-secondary' : 'text-gray-400'
    }`}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ activePage, onNavigate }) => {
  const { role } = useAuth();

  const getNavItems = () => {
    const commonItems = [
      {
        page: 'home' as Page,
        label: 'Vehículos',
        icon: <CarIcon className="w-6 h-6" />,
      },
    ];

    const roleSpecificItems = {
      cliente: [
        ...commonItems,
        {
          page: 'bookings' as Page,
          label: 'Reservas',
          icon: <ClipboardListIcon className="w-6 h-6" />,
        },
        {
          page: 'profile' as Page,
          label: 'Perfil',
          icon: <UserCircleIcon className="w-6 h-6" />,
        },
      ],
      arrendador: [
        ...commonItems,
        {
          page: 'my-cars' as Page,
          label: 'Mis Autos',
          icon: <CogIcon className="w-6 h-6" />,
        },
        {
          page: 'profile' as Page,
          label: 'Perfil',
          icon: <UserCircleIcon className="w-6 h-6" />,
        },
      ],
      admin: [
        ...commonItems,
        {
          page: 'admin' as Page,
          label: 'Admin',
          icon: <CogIcon className="w-6 h-6" />,
        },
        {
          page: 'profile' as Page,
          label: 'Perfil',
          icon: <UserCircleIcon className="w-6 h-6" />,
        },
      ],
    };

    return role ? roleSpecificItems[role] : [];
  };

  const navItems = getNavItems();

  return (
    <div 
      className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-primary shadow-lg z-30 border-t border-gray-700"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex justify-around items-center h-full">
        {navItems.map((item) => (
          <NavItem
            key={item.page}
            icon={item.icon}
            label={item.label}
            isActive={activePage === item.page}
            onClick={() => onNavigate(item.page)}
          />
        ))}
      </div>
    </div>
  );
};

export default BottomNav;