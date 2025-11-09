import React, { useState } from 'react';
import { User, Vehicle } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useVehicle } from '../contexts/VehicleContext';
import AddCarModal from '../components/AddCarModal';
import { EyeIcon } from '../components/icons/EyeIcon';
import { PlusCircleIcon } from '../components/icons/PlusCircleIcon';

const LessorReviewModal: React.FC<{ user: User; vehicles: Vehicle[]; onClose: () => void; onToggleVerify: (username: string) => void; }> = ({ user, vehicles, onClose, onToggleVerify }) => {
    const documentLabels: Record<string, string> = {
        selfie: 'Selfie',
        ineFront: 'INE (Frente)',
        ineBack: 'INE (Reverso)',
        licenseFront: 'Licencia (Frente)',
        licenseBack: 'Licencia (Reverso)',
        registrationCard: 'Tarjeta de Circulación',
        insurance: 'Póliza de Seguro',
    };

    const calculateAge = (dateOfBirth: string) => {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                </button>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-primary mb-1">Revisión de Arrendador</h2>
                    <p className="text-gray-500 mb-6">Verifica la información y documentos para aprobar o desactivar al usuario.</p>
                    
                    <div className="max-h-[70vh] overflow-y-auto pr-2 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* User & Vehicle Info Column */}
                        <div className="space-y-6">
                           {/* User Info */}
                           <div className="bg-slate-50 p-4 rounded-lg">
                                <h3 className="font-bold text-lg text-primary mb-4 border-b pb-2">Información del Arrendador</h3>
                                <div className="flex items-center space-x-4 mb-4">
                                    <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full" />
                                    <div>
                                        <p className="font-bold">{user.name}</p>
                                        <p className="text-sm text-gray-500">@{user.username}</p>
                                        {user.isVerified ? (
                                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 inline-block mt-1">Verificado</span>
                                        ) : (
                                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 inline-block mt-1">Pendiente de Verificación</span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-sm space-y-2 text-gray-700">
                                    <p><strong className="font-semibold w-28 inline-block">Edad:</strong> {user.dateOfBirth ? `${calculateAge(user.dateOfBirth)} años` : 'N/A'}</p>
                                    <p><strong className="font-semibold w-28 inline-block">Dirección:</strong> {user.address || 'No especificada'}</p>
                                    <p><strong className="font-semibold w-28 inline-block">Teléfono:</strong> {user.phone || 'N/A'}</p>
                                    <p><strong className="font-semibold w-28 inline-block">Licencia:</strong> {user.licenseNumber || 'N/A'}</p>
                                </div>
                           </div>
                           {/* Vehicle Info */}
                            <div className="bg-slate-50 p-4 rounded-lg">
                                <h3 className="font-bold text-lg text-primary mb-4 border-b pb-2">Vehículos Registrados</h3>
                                {vehicles.length > 0 ? (
                                    <div className="space-y-3">
                                        {vehicles.map(v => (
                                            <div key={v.id} className="flex items-center space-x-3 text-sm">
                                                <img src={v.imageUrl[0]} alt={v.name} className="w-16 h-12 object-cover rounded-md" />
                                                <div>
                                                    <p className="font-semibold">{v.brand} {v.name} ({v.year})</p>
                                                    <p className="text-gray-500">Placas: {v.licensePlate}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-600">Este arrendador aún no ha registrado vehículos.</p>
                                )}
                            </div>
                        </div>

                        {/* Documents Column */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg text-primary mb-4 border-b pb-2">Documentos Cargados</h3>
                            {!user.documents || Object.keys(user.documents).length === 0 ? (
                                <p className="text-gray-600 bg-slate-50 p-4 rounded-lg">Este usuario no ha subido documentos.</p>
                            ) : (
                                Object.entries(user.documents).map(([key, base64]) => (
                                    <div key={key} className="bg-slate-50 p-3 rounded-lg">
                                        <h4 className="font-semibold text-gray-800 text-sm mb-2">{documentLabels[key] || key}</h4>
                                        <img src={`data:image/jpeg;base64,${base64}`} alt={documentLabels[key] || key} className="border rounded-lg w-full object-contain" />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                     <div className="mt-6 pt-4 border-t flex justify-end">
                        <button 
                            onClick={() => { onToggleVerify(user.username); onClose(); }}
                            className={`text-white px-6 py-2 rounded-md transition-colors text-sm font-semibold ${user.isVerified ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                            {user.isVerified ? 'Desactivar Arrendador' : 'Aprobar Arrendador'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LessorCard: React.FC<{ user: User; onToggleVerify: (username: string) => void; onReview: (user: User) => void; }> = ({ user, onToggleVerify, onReview }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col p-4">
        <div className="flex items-center space-x-4">
            <img src={user.avatarUrl} alt={user.name} className="w-16 h-16 rounded-full" />
            <div>
                <h3 className="text-lg font-bold text-primary">{user.name}</h3>
                <p className="text-sm text-gray-500">@{user.username}</p>
                {user.isVerified ? (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 inline-block mt-1">Verificado</span>
                ) : (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 inline-block mt-1">Pendiente</span>
                )}
            </div>
        </div>
        <div className="mt-4 flex space-x-2 mt-auto pt-4 border-t border-slate-100">
            <button 
                onClick={() => onReview(user)}
                className="flex-1 text-sm bg-slate-200 text-slate-800 px-3 py-2 rounded-md hover:bg-slate-300 transition-colors flex items-center justify-center space-x-2">
                <EyeIcon className="w-4 h-4" />
                <span>Revisar Perfil</span>
            </button>
            <button 
                onClick={() => onToggleVerify(user.username)}
                className={`flex-1 text-sm text-white px-3 py-2 rounded-md transition-colors ${user.isVerified ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
                {user.isVerified ? 'Desactivar' : 'Verificar'}
            </button>
        </div>
    </div>
);

const AdminVehicleCard: React.FC<{ vehicle: Vehicle; onEdit: (vehicle: Vehicle) => void; onDelete: (vehicleId: number) => void; }> = ({ vehicle, onEdit, onDelete }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col p-4">
        <img src={vehicle.imageUrl[0]} alt={vehicle.name} className="w-full h-40 object-cover rounded-md" />
        <div className="mt-2">
            <h3 className="text-md font-bold text-primary">{vehicle.brand} {vehicle.name}</h3>
            <p className="text-sm text-gray-500">Dueño: @{vehicle.ownerId}</p>
            <p className="text-gray-600 font-semibold">${vehicle.pricePerDay}/día</p>
        </div>
        <div className="mt-4 flex space-x-2 mt-auto pt-4 border-t border-slate-100">
            <button 
                onClick={() => onEdit(vehicle)}
                className="flex-1 text-sm bg-slate-200 text-slate-800 px-3 py-2 rounded-md hover:bg-slate-300 transition-colors">
                    Editar
            </button>
            <button 
                onClick={() => onDelete(vehicle.id)}
                className="flex-1 text-sm bg-red-100 text-red-700 px-3 py-2 rounded-md hover:bg-red-200 transition-colors">
                    Eliminar
            </button>
        </div>
    </div>
);


const AdminPage: React.FC = () => {
    const { users, toggleUserVerification } = useAuth();
    const { vehicles, deleteVehicle } = useVehicle();
    const lessors = Object.entries(users)
                          .filter(([, u]) => u.role === 'arrendador')
                          .map(([username, userData]) => ({ ...userData, username })) as User[];
                          
    const [activeTab, setActiveTab] = useState<'lessors' | 'vehicles'>('lessors');
    const [reviewingLessor, setReviewingLessor] = useState<User | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState<Vehicle | null>(null);

    const handleOpenAddModal = () => {
        setSelectedCar(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (vehicle: Vehicle) => {
        setSelectedCar(vehicle);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCar(null);
    };

    const handleDeleteCar = (vehicleId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este auto? Esta acción no se puede deshacer.')) {
            deleteVehicle(vehicleId);
        }
    };


    const TabButton: React.FC<{tab: 'lessors' | 'vehicles', label: string}> = ({tab, label}) => (
        <button onClick={() => setActiveTab(tab)} className={`px-4 py-2 font-semibold rounded-md transition-colors ${activeTab === tab ? 'bg-primary text-white' : 'text-gray-600 hover:bg-slate-200'}`}>
            {label}
        </button>
    );

    return (
        <>
            <div className="bg-slate-100 min-h-full py-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold text-primary">Dashboard del Administrador</h1>
                             <p className="text-gray-600 mt-1">Gestiona arrendadores y vehículos de la plataforma.</p>
                        </div>
                         {activeTab === 'vehicles' && (
                            <button 
                                onClick={handleOpenAddModal}
                                className="flex items-center space-x-2 bg-secondary text-primary font-semibold py-2 px-4 rounded-md hover:brightness-90 transition-all mt-4 sm:mt-0">
                                <PlusCircleIcon className="w-5 h-5"/>
                                <span>Agregar Vehículo</span>
                            </button>
                        )}
                    </div>
                    
                    <div className="mb-8 flex space-x-2 bg-slate-100 p-1 rounded-lg border">
                        <TabButton tab="lessors" label="Gestión de Arrendadores" />
                        <TabButton tab="vehicles" label="Gestión de Vehículos" />
                    </div>

                    {activeTab === 'lessors' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                           {lessors.map(lessor => (
                               <LessorCard 
                                   key={lessor.username} 
                                   user={lessor} 
                                   onToggleVerify={toggleUserVerification} 
                                   onReview={setReviewingLessor}
                                />
                           ))}
                           {lessors.length === 0 && (
                                <div className="text-center py-16 text-gray-500 bg-white rounded-lg shadow-md col-span-full">
                                    <h3 className="text-xl font-semibold">No hay arrendadores registrados</h3>
                                </div>
                           )}
                        </div>
                    )}
                    
                    {activeTab === 'vehicles' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {vehicles.map(vehicle => (
                                <AdminVehicleCard 
                                    key={vehicle.id} 
                                    vehicle={vehicle} 
                                    onEdit={handleOpenEditModal} 
                                    onDelete={handleDeleteCar} 
                                />
                            ))}
                            {vehicles.length === 0 && (
                                <div className="text-center py-16 text-gray-500 bg-white rounded-lg shadow-md col-span-full">
                                    <h3 className="text-xl font-semibold">No hay vehículos en la plataforma</h3>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            {reviewingLessor && (
                <LessorReviewModal 
                    user={reviewingLessor} 
                    vehicles={vehicles.filter(v => v.ownerId === reviewingLessor.username)}
                    onClose={() => setReviewingLessor(null)}
                    onToggleVerify={toggleUserVerification}
                />
            )}
            {isModalOpen && <AddCarModal onClose={handleCloseModal} vehicleToEdit={selectedCar} />}
        </>
    );
};

export default AdminPage;