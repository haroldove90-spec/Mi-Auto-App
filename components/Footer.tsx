import React from 'react';
import { Page } from '../types';
import { logoUrl } from '../logo';
import { useAuth } from '../contexts/AuthContext';

interface FooterProps {
  onNavigate: (page: Page) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { role } = useAuth();
  
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
               <img src={logoUrl} alt="Mi Auto App Logo" className="h-10" />
            </div>
            <p className="text-gray-400">Tu aventura sobre ruedas comienza aquí. Renta de autos fácil y confiable.</p>
          </div>
          <div>
            <h3 className="font-bold mb-4 uppercase tracking-wider">Compañía</h3>
            <ul>
              <li className="mb-2"><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('how-it-works'); }} className="hover:text-secondary transition-colors">Cómo funciona</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4 uppercase tracking-wider">Soporte</h3>
            <ul>
              <li className="mb-2"><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('support'); }} className="hover:text-secondary transition-colors">Soporte</a></li>
              {role !== 'admin' && (
                <li className="mb-2"><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('contact'); }} className="hover:text-secondary transition-colors">Contáctanos</a></li>
              )}
              <li className="mb-2"><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('terms'); }} className="hover:text-secondary transition-colors">Términos y Condiciones</a></li>
              <li className="mb-2"><a href="#" onClick={(e) => { e.preventDefault(); onNavigate('privacy-policy'); }} className="hover:text-secondary transition-colors">Política de Privacidad</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Mi Auto App. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;