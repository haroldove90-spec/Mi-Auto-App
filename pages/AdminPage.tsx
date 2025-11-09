import React, { useState } from 'react';
import { Vehicle, User } from '../types';
import { PlusCircleIcon } from '../components/icons/PlusCircleIcon';
import { useVehicle } from '../contexts/VehicleContext';
import AddCarModal from '../components/AddCarModal';
import { useAuth } from '../contexts/AuthContext';
import { EyeIcon } from '../components/icons/EyeIcon';

const LessorDocumentsModal: React.FC<{ user: User; onClose: () => void }> = ({ user, onClose }) => {
    const documentLabels: Record<string, string> = {
        selfie: 'Selfie',
        ineFront: 'INE (Frente)',
        ineBack: 'INE (Reverso)',
        licenseFront: 'Licencia (Frente)',
        licenseBack: 'Licencia (Reverso)',
        registrationCard: 'Tarjeta de Circulación',
        insurance: 'Póliza de Seguro',
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl relative" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                   </svg>
                </button>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-primary mb-6">Documentos de {user.name}</h2>
                    <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-4">
                        {!user.documents || Object.keys(user.documents).length === 0 ? (
                            <p className="text-gray-600">Este usuario no ha subido documentos.</p>
                        ) : (
                            Object.entries(user.documents).map(([key, base64]) => (
                                <div key={key}>
                                    <h4 className="font-semibold text-gray-800">{documentLabels[key] || key}</h4>
                                    <img src={`data:image/jpeg;base64,${base64}`} alt={documentLabels[key] || key} className="mt-2 border rounded-lg w-full object-contain" />
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const LessorCard: React.FC<{ user: User; onToggleVerify: (username: string) => void; onViewDocs: (user: User) => void; }> = ({ user, onToggleVerify, onViewDocs }) => (
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
                onClick={() => onViewDocs(user)}
                className="flex-1 text-sm bg-slate-200 text-slate-800 px-3 py-2 rounded-md hover:bg-slate-300 transition-colors flex items-center justify-center space-x-2">
                <EyeIcon className="w-4 h-4" />
                <span>Documentos</span>
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
        <img src={vehicle.imageUrl[0]} alt={vehicle.name} className="w-full h-48 object-cover" />
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-bold text-primary">{vehicle.brand} {vehicle.name}</h3>
            <p className="text-sm text-gray-500">Propietario: <span className="font-semibold">{vehicle.ownerId}</span></p>
            <p className="text-gray-600">${vehicle.pricePerDay}/día</p>
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
    </div>
);


const AdminPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'vehicles' | 'lessors'>('vehicles');

    const { users, toggleUserVerification } = useAuth();
    const lessors = Object.entries(users)
                          .filter(([, u]) => u.role === 'arrendador')
                          .map(([username, userData]) => ({ ...userData, username })) as User[];

    const [viewingDocsFor, setViewingDocsFor] = useState<User | null>(null);

    const [isVehicleModalOpen, setVehicleModalOpen] = useState(false);
    const [selectedCar, setSelectedCar] = useState<Vehicle | null>(null);
    const { vehicles, deleteVehicle } = useVehicle();

    const handleOpenAddVehicleModal = () => {
        setSelectedCar(null);
        setVehicleModalOpen(true);
    };

    const handleOpenEditVehicleModal = (vehicle: Vehicle) => {
        setSelectedCar(vehicle);
        setVehicleModalOpen(true);
    };

    const handleCloseVehicleModal = () => {
        setVehicleModalOpen(false);
        setSelectedCar(null);
    };

    const handleDeleteCar = (vehicleId: number) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este auto? Esta acción no se puede deshacer.')) {
            deleteVehicle(vehicleId);
        }
    };

    const TabButton: React.FC<{tab: typeof activeTab, label: string}> = ({tab, label}) => (
        <button onClick={() => setActiveTab(tab)} className={`px-4 py-2 font-semibold rounded-md transition-colors ${activeTab === tab ? 'bg-primary text-white' : 'text-gray-600 hover:bg-slate-200'}`}>
            {label}
        </button>
    );

    return (
        <>
            <div className="bg-slate-100 min-h-full py-12">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold text-primary">Panel de Administrador</h1>
                        {activeTab === 'vehicles' && (
                            <button 
                                onClick={handleOpenAddVehicleModal}
                                className="flex items-center space-x-2 bg-secondary text-primary font-semibold py-2 px-4 rounded-md hover:brightness-90 transition-all">
                                <PlusCircleIcon className="w-5 h-5"/>
                                <span>Agregar Vehículo</span>
                            </button>
                        )}
                    </div>

                    <div className="mb-8 flex space-x-2 bg-slate-100 p-1 rounded-lg border">
                        <TabButton tab="vehicles" label="Gestión de Vehículos" />
                        <TabButton tab="lessors" label="Gestión de Arrendadores" />
                    </div>

                    {activeTab === 'vehicles' && (
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {vehicles.map(car => (
                                <AdminVehicleCard key={car.id} vehicle={car} onEdit={handleOpenEditVehicleModal} onDelete={handleDeleteCar} />
                            ))}
                        </div>
                    )}
                    
                    {activeTab === 'lessors' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                           {lessors.map(lessor => (
                               <LessorCard 
                                   key={lessor.username} 
                                   user={lessor} 
                                   onToggleVerify={toggleUserVerification} 
                                   onViewDocs={setViewingDocsFor}
                                />
                           ))}
                           {lessors.length === 0 && (
                                <div className="text-center py-16 text-gray-500 bg-white rounded-lg shadow-md col-span-full">
                                    <h3 className="text-xl font-semibold">No hay arrendadores registrados</h3>
                                </div>
                           )}
                        </div>
                    )}
                </div>
            </div>
            {isVehicleModalOpen && <AddCarModal onClose={handleCloseVehicleModal} vehicleToEdit={selectedCar} />}
            {viewingDocsFor && <LessorDocumentsModal user={viewingDocsFor} onClose={() => setViewingDocsFor(null)} />}
        </>
    );
};

export default AdminPage;