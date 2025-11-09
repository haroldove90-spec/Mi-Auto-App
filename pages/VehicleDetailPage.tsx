import React, { useState, useMemo } from 'react';
import { useVehicle } from '../contexts/VehicleContext';
import { useBooking } from '../contexts/BookingContext';
import { useAuth } from '../contexts/AuthContext';
import { Page, User } from '../types';
import { USERS } from '../constants';
import BookingModal from '../components/BookingModal';
// FIX: Import CheckCircleIcon component.
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';

const StarIcon: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const StarRating: React.FC<{rating: number}> = ({rating}) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <StarIcon key={i} className={`w-5 h-5 ${i < Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'}`} />
        ))}
    </div>
);


const VehicleDetailPage: React.FC<{ onNavigate: (page: Page) => void; }> = ({ onNavigate }) => {
    const { selectedVehicle: vehicle } = useVehicle();
    const { reviews } = useBooking();
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [mainImage, setMainImage] = useState(vehicle?.imageUrl[0] || '');

    React.useEffect(() => {
        if (vehicle) {
            setMainImage(vehicle.imageUrl[0]);
        }
    }, [vehicle]);

    // This is a mock since we don't have a full user list context
    const owner: User | undefined = useMemo(() => {
        if (!vehicle) return undefined;
        const ownerData = USERS[vehicle.ownerId];
        if (!ownerData) return undefined;
        return {
            username: vehicle.ownerId,
            name: ownerData.name,
            role: ownerData.role,
            avatarUrl: ownerData.avatarUrl,
            memberSince: ownerData.memberSince,
            averageRating: ownerData.averageRating,
            isVerified: ownerData.isVerified,
        };
    }, [vehicle]);

    const vehicleReviews = useMemo(() => {
        return reviews.filter(r => r.vehicleId === vehicle?.id && r.revieweeId === vehicle?.ownerId);
    }, [reviews, vehicle]);


    if (!vehicle || !owner) {
        return (
            <div className="container mx-auto px-6 py-20 text-center">
                <h2 className="text-2xl font-bold">Vehículo no encontrado</h2>
                <button onClick={() => onNavigate('home')} className="mt-4 bg-secondary text-primary font-semibold py-2 px-4 rounded-md">Volver a inicio</button>
            </div>
        );
    }
    
    return (
        <>
            <div className="bg-white">
                <div className="container mx-auto px-6 py-12">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-primary">{vehicle.brand} {vehicle.name} ({vehicle.year})</h1>
                        <div className="flex items-center space-x-4 text-gray-600 mt-2">
                            <div className="flex items-center">
                                <StarIcon className="w-5 h-5 text-yellow-400 mr-1"/>
                                <span className="font-bold">{(vehicle.averageRating || 0).toFixed(1)}</span>
                                <span className="ml-1">({vehicleReviews.length} reseñas)</span>
                            </div>
                            <span>·</span>
                            <span>{vehicle.location}</span>
                        </div>
                    </div>

                    {/* Image Gallery */}
                    <div className="mb-12">
                        <img 
                            src={mainImage} 
                            alt={`${vehicle.brand} ${vehicle.name}`} 
                            className="w-full max-h-[500px] object-cover rounded-lg shadow-lg mb-4" 
                        />
                        {vehicle.imageUrl.length > 1 && (
                            <div className="grid grid-cols-5 gap-2">
                                {vehicle.imageUrl.map((img, index) => (
                                    <img 
                                        key={index}
                                        src={img}
                                        alt={`Vista ${index + 1}`}
                                        className={`w-full h-24 object-cover rounded-md cursor-pointer border-4 ${mainImage === img ? 'border-primary' : 'border-transparent hover:border-slate-300'}`}
                                        onClick={() => setMainImage(img)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>


                    {/* Main Content */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        <div className="lg:col-span-2">
                            {/* Owner Info */}
                            <div className="flex justify-between items-center border-b pb-6">
                                <div>
                                    <h2 className="text-2xl font-semibold">Vehículo de {owner.name}</h2>
                                    <p className="text-gray-500">{vehicle.specs.type} · {vehicle.specs.passengers} pasajeros · {vehicle.specs.transmission}</p>
                                </div>
                                <img src={owner.avatarUrl} alt={owner.name} className="w-16 h-16 rounded-full" />
                            </div>
                             {/* Features */}
                            <div className="py-6 border-b">
                                <h3 className="text-xl font-semibold mb-4">Características</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {vehicle.features.map(feature => (
                                        <div key={feature} className="flex items-center text-gray-700">
                                             <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Reviews */}
                            <div className="py-6">
                                <h3 className="text-xl font-semibold mb-4">Reseñas ({vehicleReviews.length})</h3>
                                <div className="space-y-6">
                                    {vehicleReviews.slice(0, 2).map(review => {
                                        const reviewer = USERS[review.reviewerId];
                                        return (
                                        <div key={review.id}>
                                            <div className="flex items-center space-x-3">
                                                <img src={reviewer.avatarUrl} alt={reviewer.name} className="w-10 h-10 rounded-full"/>
                                                <div>
                                                    <p className="font-semibold">{reviewer.name}</p>
                                                    <StarRating rating={review.rating} />
                                                </div>
                                            </div>
                                            <p className="text-gray-600 mt-2">{review.comment}</p>
                                        </div>
                                    )})}
                                </div>
                            </div>
                        </div>

                        {/* Booking Box */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24 border rounded-xl shadow-lg p-6">
                                <p className="text-2xl font-bold mb-4">
                                    ${vehicle.pricePerDay} <span className="text-base font-normal text-gray-600">/ día</span>
                                </p>
                                 <button onClick={() => setIsBookingModalOpen(true)} className="w-full bg-accent text-primary font-bold py-3 px-6 rounded-md hover:brightness-90 transition-all text-lg">
                                    Solicitar Reserva
                                 </button>
                                <p className="text-xs text-gray-500 text-center mt-2">No se te cobrará nada aún</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {isBookingModalOpen && <BookingModal vehicle={vehicle} onClose={() => setIsBookingModalOpen(false)} onNavigate={onNavigate as (page: 'bookings') => void} />}
        </>
    );
};

export default VehicleDetailPage;