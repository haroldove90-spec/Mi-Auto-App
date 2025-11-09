import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Page } from '../types';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { logoUrl } from '../logo';

interface HeaderProps {
  onNavigate: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const { user, logout, role } = useAuth();
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileMenuOpen(false);
  };

  const navLinks = useMemo(() => {
      const links = [
        { label: 'Vehículos', page: 'home' as Page },
        { label: 'Contacto', page: 'contact' as Page },
      ];
      if (role === 'admin') {
          return links.filter(link => link.page !== 'contact');
      }
      return links;
  }, [role]);

  const renderDesktopNav = () => (
    <nav className="hidden md:flex items-center space-x-8">
      {navLinks.map(link => (
          <a key={link.page} href="#" onClick={(e) => { e.preventDefault(); onNavigate(link.page); }} className="text-gray-200 hover:text-white transition-colors">{link.label}</a>
      ))}
      {role === 'cliente' && (
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('lessor-onboarding'); }} className="bg-secondary text-primary font-bold py-2 px-4 rounded-md hover:brightness-90 transition-all text-sm">
            Renta tu Auto
        </a>
      )}
      <div className="relative" ref={profileMenuRef}>
        <button 
          onClick={() => setProfileMenuOpen(!isProfileMenuOpen)} 
          className="flex items-center space-x-2 text-gray-200 hover:text-white"
          aria-expanded={isProfileMenuOpen}
          aria-haspopup="true"
        >
          <UserCircleIcon className="w-8 h-8"/>
          <span className="font-semibold">{user?.name}</span>
        </button>
        {isProfileMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 text-primary">
            <a href="#" onClick={(e)=>{e.preventDefault(); onNavigate('profile'); setProfileMenuOpen(false);}} className="block px-4 py-2 text-sm hover:bg-slate-100">Perfil</a>
            {role === 'cliente' && <a href="#" onClick={(e)=>{e.preventDefault(); onNavigate('bookings'); setProfileMenuOpen(false);}} className="block px-4 py-2 text-sm hover:bg-slate-100">Mis Reservas</a>}
            {role === 'arrendador' && <a href="#" onClick={(e)=>{e.preventDefault(); onNavigate('my-cars'); setProfileMenuOpen(false);}} className="block px-4 py-2 text-sm hover:bg-slate-100">Mis Autos</a>}
            {role === 'admin' && <a href="#" onClick={(e)=>{e.preventDefault(); onNavigate('admin'); setProfileMenuOpen(false);}} className="block px-4 py-2 text-sm hover:bg-slate-100">Dashboard</a>}
            <div className="border-t border-slate-200 my-1"></div>
            <button onClick={handleLogout} className="w-full text-left flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-slate-100">
              <LogoutIcon className="w-4 h-4"/>
              <span>Cerrar Sesión</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );

  const renderMobileMenu = () => (
    <div className={`absolute top-full left-0 right-0 bg-primary shadow-lg md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="flex flex-col px-6 py-4 space-y-4">
            {navLinks.map(link => (
                 <a key={link.page} href="#" onClick={(e) => { e.preventDefault(); onNavigate(link.page); setMobileMenuOpen(false); }} className="text-gray-200 hover:text-white transition-colors">{link.label}</a>
            ))}
            {role === 'cliente' && (
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('lessor-onboarding'); setMobileMenuOpen(false); }} className="bg-secondary text-primary font-bold py-2 px-4 rounded-md text-center">
                    Renta tu Auto
                </a>
            )}
            <div className="border-t border-gray-700 pt-4 space-y-4">
              <a href="#" onClick={(e)=>{e.preventDefault(); onNavigate('profile'); setMobileMenuOpen(false);}} className="block text-gray-200 hover:text-white">Perfil</a>
              {role === 'cliente' && <a href="#" onClick={(e)=>{e.preventDefault(); onNavigate('bookings'); setMobileMenuOpen(false);}} className="block text-gray-200 hover:text-white">Mis Reservas</a>}
              {role === 'arrendador' && <a href="#" onClick={(e)=>{e.preventDefault(); onNavigate('my-cars'); setMobileMenuOpen(false);}} className="block text-gray-200 hover:text-white">Mis Autos</a>}
                {role === 'admin' && <a href="#" onClick={(e)=>{e.preventDefault(); onNavigate('admin'); setMobileMenuOpen(false);}} className="block text-gray-200 hover:text-white">Dashboard</a>}
              <button onClick={handleLogout} className="w-full text-left flex items-center space-x-2 text-red-400 hover:text-red-300">
                  <LogoutIcon className="w-4 h-4"/>
                  <span>Cerrar Sesión</span>
              </button>
            </div>
        </div>
    </div>
  );

  return (
    <header 
      className="bg-primary shadow-md sticky top-0 z-40"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate(role === 'admin' ? 'admin' : 'home'); }} className="flex items-center">
          <img src={logoUrl} alt="Mi Auto App Logo" className="h-10" />
        </a>
        {renderDesktopNav()}
        <button 
          className="md:hidden text-gray-200 hover:text-white" 
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Abrir menú de navegación"
          aria-expanded={isMobileMenuOpen}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
        {renderMobileMenu()}
      </div>
    </header>
  );
};

export default Header;