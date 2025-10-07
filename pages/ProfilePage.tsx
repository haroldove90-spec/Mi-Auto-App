import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { IdIcon } from '../components/icons/IdIcon';

const StarIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);


const ProfilePage: React.FC = () => {
  const { user, role, logout, updateUser } = useAuth();
  const { addNotification } = useNotification();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: `${user.username}@example.com`,
      });
    }
  }, [user]);

  if (!user) {
    return (
        <div className="text-center py-20">
            <p>Por favor, inicia sesión para ver tu perfil.</p>
        </div>
    );
  }
  
  const handleEditToggle = () => {
      setIsEditing(!isEditing);
      if (isEditing) {
          setFormData({ name: user.name, email: `${user.username}@example.com` });
      }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = () => {
      updateUser(formData.name); 
      addNotification({ message: 'Perfil actualizado con éxito.', type: 'success' });
      setIsEditing(false);
  };
  
  const handleAddPayoutMethod = () => {
    addNotification({ message: 'Funcionalidad para agregar método de cobro en desarrollo.', type: 'info' });
  };


  return (
    <div className="bg-slate-100 min-h-full py-12">
        <div className="container mx-auto px-6 max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-8">Mi Perfil</h1>
            <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row items-center sm:space-x-6">
                    <img src={user.avatarUrl} alt={user.name} className="w-24 h-24 rounded-full border-4 border-secondary"/>
                    <div className="mt-4 sm:mt-0 text-center sm:text-left">
                        {isEditing ? (
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="text-2xl font-bold border-b-2 border-primary focus:outline-none bg-transparent"
                            />
                        ) : (
                            <h2 className="text-2xl font-bold flex items-center">
                                {user.name}
                                {user.isVerified && <CheckCircleIcon className="w-6 h-6 text-blue-500 ml-2" title="Usuario Verificado"/>}
                            </h2>
                        )}
                        <p className="text-gray-500">@{user.username}</p>
                        <div className="flex items-center space-x-4 mt-2 justify-center sm:justify-start">
                            <span className="bg-secondary text-primary text-xs font-semibold px-3 py-1 rounded-full capitalize">
                                {role}
                            </span>
                            <div className="flex items-center text-yellow-500">
                                <StarIcon className="w-4 h-4 mr-1"/>
                                <span className="font-bold">{user.averageRating.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 border-t pt-8">
                   <h3 className="text-lg font-semibold text-primary mb-4">Información de la Cuenta</h3>
                   <div className="space-y-4 text-gray-700">
                       <div>
                            <span className="font-semibold w-32 inline-block">Email:</span>
                            {isEditing ? (
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="border-b focus:outline-none focus:border-primary bg-transparent"
                                />
                            ) : (
                                <span>{user.username}@example.com</span>
                            )}
                       </div>
                       <p><span className="font-semibold w-32 inline-block">Miembro desde:</span> {new Date(user.memberSince).toLocaleDateString('es-MX', { year: 'numeric', month: 'long' })}</p>
                   </div>
                </div>
                
                {role === 'arrendador' && (
                    <>
                        <div className="mt-8 border-t pt-8">
                           <h3 className="text-lg font-semibold text-primary mb-4">Verificación de Documentos</h3>
                           <div className="flex items-center justify-between bg-slate-50 p-4 rounded-lg">
                                <div className="flex items-center">
                                    <IdIcon className="w-6 h-6 text-gray-500 mr-3"/>
                                    <span>Licencia de Conducir</span>
                                </div>
                                <span className="text-sm font-semibold text-green-600">Verificada</span>
                           </div>
                        </div>
                        <div className="mt-8 border-t pt-8">
                           <h3 className="text-lg font-semibold text-primary mb-4">Métodos de Cobro</h3>
                            <div className="bg-slate-50 p-4 rounded-lg flex items-center justify-between">
                               <p className="text-sm text-gray-600">Configura cómo recibirás tus ganancias.</p>
                               <button onClick={handleAddPayoutMethod} className="bg-primary text-white font-semibold py-2 px-4 rounded-md hover:bg-opacity-90 transition-all text-sm whitespace-nowrap">
                                    Agregar Cuenta
                                </button>
                            </div>
                        </div>
                    </>
                )}


                <div className="mt-8 border-t pt-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    {isEditing ? (
                        <div className="flex space-x-4">
                            <button onClick={handleSaveChanges} className="bg-accent text-primary font-semibold py-2 px-4 rounded-md hover:brightness-90 transition-colors">
                                Guardar Cambios
                            </button>
                             <button onClick={handleEditToggle} className="bg-slate-200 text-slate-800 font-semibold py-2 px-4 rounded-md hover:bg-slate-300 transition-colors">
                                Cancelar
                            </button>
                        </div>
                    ) : (
                         <button onClick={handleEditToggle} className="bg-secondary text-primary font-semibold py-2 px-4 rounded-md hover:brightness-90 transition-colors">
                            Editar Perfil
                        </button>
                    )}
                 
                    <button onClick={logout} className="bg-red-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-600 transition-colors w-full sm:w-auto">
                        Cerrar Sesión
                    </button>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default ProfilePage;