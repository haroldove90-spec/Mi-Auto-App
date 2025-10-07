import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { EyeIcon } from '../components/icons/EyeIcon';
import { EyeOffIcon } from '../components/icons/EyeOffIcon';
import { logoUrl } from '../logo';
import { Page } from '../types';

interface LoginPageProps {
    onNavigate: (page: Page) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [view, setView] = useState<'welcome' | 'login'>('welcome');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Por favor, ingresa tu usuario y contraseña.');
      return;
    }
    const success = login(username, password);
    if (!success) {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  const renderWelcomeView = () => (
    <div className="min-h-screen bg-cover bg-center text-white flex flex-col" style={{ backgroundImage: "url('https://picsum.photos/seed/welcome-road/1920/1080')" }}>
      <div className="absolute inset-0 bg-black/60"></div>
      <div className="relative z-10 container mx-auto px-6 flex flex-col flex-grow justify-center items-center text-center">
        <img src={logoUrl} alt="Mi Auto App Logo" className="h-24 mb-6" />
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 drop-shadow-lg">Tu viaje, tu auto, tu libertad</h1>
        <p className="text-lg md:text-xl max-w-2xl mb-10 drop-shadow-md">La plataforma comunitaria para rentar y ofrecer vehículos de forma segura y sencilla.</p>
        
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6">
          <button 
            onClick={() => onNavigate('register-client')}
            className="bg-secondary text-primary font-bold py-4 px-10 rounded-lg text-lg hover:brightness-90 transition-all transform hover:scale-105 shadow-xl"
          >
            Buscar un Viaje
          </button>
          <button 
            onClick={() => onNavigate('lessor-onboarding')}
            className="bg-transparent border-2 border-secondary text-secondary font-bold py-4 px-10 rounded-lg text-lg hover:bg-secondary hover:text-primary transition-all transform hover:scale-105 shadow-xl"
          >
            Ofrecer mi Auto
          </button>
        </div>

        <button onClick={() => setView('login')} className="mt-12 text-gray-300 hover:text-white underline transition-colors">
            ¿Ya tienes una cuenta? Inicia Sesión
        </button>
      </div>
    </div>
  );

  const renderLoginView = () => (
    <div className="min-h-screen bg-primary flex flex-col justify-center items-center p-4">
       <button onClick={() => setView('welcome')} className="absolute top-6 left-6 text-white hover:text-secondary flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Volver</span>
        </button>
        <div className="text-center mb-8">
            <img src={logoUrl} alt="Mi Auto App Logo" className="h-20 mx-auto" />
        </div>
      <div
        className="bg-secondary rounded-lg shadow-2xl w-full max-w-sm p-8"
      >
        <div>
          <h2 className="text-2xl font-bold text-primary mb-2 text-center">Bienvenido de Nuevo</h2>
          <p className="text-center text-primary/80 mb-6">Accede a tu cuenta para continuar.</p>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-primary">Usuario</label>
                <input 
                  type="text" 
                  id="username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary bg-white text-gray-900 placeholder-gray-500" 
                  placeholder="ej. cliente"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-primary">Contraseña</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    id="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary pr-10 bg-white text-gray-900 placeholder-gray-500" 
                    placeholder="*******"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-primary"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOffIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                  </button>
                </div>
              </div>
            </div>
            
            {error && <p className="mt-4 text-sm text-white bg-red-600 p-3 rounded-md text-center font-semibold">{error}</p>}
            
            <div className="mt-6">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-primary text-white font-bold rounded-md hover:bg-opacity-90 transition-colors"
              >
                Ingresar
              </button>
            </div>
          </form>
           <div className="text-center mt-4 space-y-1">
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('register-client');}} className="text-sm text-primary hover:underline">¿No tienes cuenta? Regístrate aquí</a>
                <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('lessor-onboarding');}} className="text-sm text-primary hover:underline block">¿Quieres rentar tu auto? Regístrate aquí</a>
            </div>
        </div>
      </div>
       <div className="bg-black/20 text-white p-4 rounded-lg mt-6 w-full max-w-sm text-sm">
            <h4 className="font-bold text-center mb-2 text-secondary">Credenciales de Prueba</h4>
            <ul className="text-xs space-y-1 text-center text-gray-300">
                <li><strong className="font-semibold text-white">Admin:</strong> admin / admin123</li>
                <li><strong className="font-semibold text-white">Cliente:</strong> cliente / cliente123</li>
                <li><strong className="font-semibold text-white">Arrendador:</strong> arrendador / arrendador123</li>
            </ul>
        </div>
    </div>
  );

  return view === 'welcome' ? renderWelcomeView() : renderLoginView();
};

export default LoginPage;