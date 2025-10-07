import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Page } from '../types';
import { logoUrl } from '../logo';
import { EyeIcon } from '../components/icons/EyeIcon';
import { EyeOffIcon } from '../components/icons/EyeOffIcon';

interface RegisterClientPageProps {
  onNavigate: (page: Page) => void;
}

const RegisterClientPage: React.FC<RegisterClientPageProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const { addNotification } = useNotification();
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    dateOfBirth: '',
    licenseNumber: '',
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { name, username, password, confirmPassword, phone, dateOfBirth, licenseNumber } = formData;
    if (!name || !username || !password || !confirmPassword || !phone || !dateOfBirth || !licenseNumber) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    const success = register({
      name,
      username,
      password,
      phone,
      dateOfBirth,
      licenseNumber,
    });
    
    if (success) {
      addNotification({ message: '¡Registro exitoso! Bienvenido a Mi Auto App.', type: 'success' });
      // The AuthProvider will automatically log the user in, so the App component will redirect to the homepage.
    } else {
      setError('El nombre de usuario ya existe. Por favor, elige otro.');
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col justify-center items-center p-4">
      <div className="absolute top-6 left-6">
        <button onClick={() => onNavigate('home')} className="text-white hover:text-secondary flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Volver</span>
        </button>
      </div>
       <div className="text-center mb-8">
          <img src={logoUrl} alt="Mi Auto App Logo" className="h-20 mx-auto" />
      </div>
      <div className="bg-secondary rounded-lg shadow-2xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-primary mb-2 text-center">Crea tu Cuenta</h2>
        <p className="text-center text-primary/80 mb-6">Regístrate para empezar a rentar autos.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" name="name" placeholder="Nombre Completo" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900" />
            <input type="text" name="username" placeholder="Nombre de usuario (ej. juanperez)" value={formData.username} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900" />
            <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-primary">
                    {showPassword ? <EyeOffIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                </button>
            </div>
            <div className="relative">
                <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Confirmar Contraseña" value={formData.confirmPassword} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 pr-10" />
                 <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-primary">
                    {showConfirmPassword ? <EyeOffIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                </button>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="tel" name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900" />
                <input type="text" name="dateOfBirth" placeholder="Fecha de Nacimiento" onFocus={(e) => e.target.type='date'} onBlur={(e) => { if(!e.target.value) e.target.type='text'; }} value={formData.dateOfBirth} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900" />
            </div>
            <input type="text" name="licenseNumber" placeholder="Número de Licencia de Conducir" value={formData.licenseNumber} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900" />

            {error && <p className="text-sm text-white bg-red-600 p-3 rounded-md text-center font-semibold">{error}</p>}
            
            <button type="submit" className="w-full px-6 py-3 bg-primary text-white font-bold rounded-md hover:bg-opacity-90 transition-colors">
            Crear Cuenta
            </button>
        </form>
         <div className="text-center mt-4">
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home');}} className="text-sm text-primary hover:underline">¿Ya tienes una cuenta? Inicia Sesión</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterClientPage;