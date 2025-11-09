import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Role } from '../types';
import { SwitchUserIcon } from './icons/SwitchUserIcon';

const RoleSwitcher: React.FC = () => {
    const { user, switchRole } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    const roles: Array<{ key: 'cliente' | 'arrendador' | 'admin', label: string }> = [
        { key: 'cliente', label: 'Cliente' },
        { key: 'arrendador', label: 'Arrendador' },
        { key: 'admin', label: 'Admin' },
    ];

    const handleSwitch = (username: 'cliente' | 'arrendador' | 'admin') => {
        switchRole(username);
        setIsOpen(false);
    };

    if (!user) return null;

    return (
        <div className="fixed bottom-20 right-4 md:bottom-4 z-50">
            <div className="relative">
                {isOpen && (
                    <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-xl py-2 border">
                        <p className="px-4 py-1 text-sm font-semibold text-gray-500">Cambiar Rol de Prueba</p>
                        <div className="border-t my-1"></div>
                        {roles.map(({ key, label }) => (
                            <button
                                key={key}
                                onClick={() => handleSwitch(key)}
                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                    user.username === key 
                                    ? 'bg-secondary text-primary font-bold' 
                                    : 'text-gray-700 hover:bg-slate-100'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                )}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-primary text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-90 transition-all transform hover:scale-110"
                    aria-label="Cambiar de rol"
                >
                    <SwitchUserIcon className="w-7 h-7" />
                </button>
            </div>
        </div>
    );
};

export default RoleSwitcher;
