import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserCircleIcon } from '../components/icons/UserCircleIcon';

const ProfilePage: React.FC = () => {
  const { user, role, logout } = useAuth();

  if (!user) {
    return (
        <div className="text-center py-20">
            <p>Por favor, inicia sesión para ver tu perfil.</p>
        </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-full py-12">
        <div className="container mx-auto px-6 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8">Mi Perfil</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center space-x-6">
                    <UserCircleIcon className="w-24 h-24 text-slate-300"/>
                    <div>
                        <h2 className="text-2xl font-bold">{user.name}</h2>
                        <p className="text-gray-500">@{user.username}</p>
                        <span className="mt-2 inline-block bg-secondary text-primary text-xs font-semibold px-3 py-1 rounded-full capitalize">
                            {role}
                        </span>
                    </div>
                </div>
                <div className="mt-8 border-t pt-8">
                   <h3 className="text-lg font-semibold text-primary mb-4">Información de la Cuenta</h3>
                   <div className="space-y-2 text-gray-700">
                       <p><span className="font-semibold">Email:</span> {user.username}@example.com</p>
                       <p><span className="font-semibold">Miembro desde:</span> Enero 2024</p>
                   </div>
                </div>
                 <div className="mt-8 flex justify-end">
                    <button onClick={logout} className="bg-red-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-600 transition-colors">
                        Cerrar Sesión
                    </button>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default ProfilePage;
