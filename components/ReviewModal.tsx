import React, { useState } from 'react';
import { Booking } from '../types';
import { useBooking } from '../contexts/BookingContext';

const StarIcon: React.FC<{className?: string, onClick?: () => void}> = ({className, onClick}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor" onClick={onClick}>
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

interface ReviewModalProps {
  booking: Booking;
  onClose: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ booking, onClose }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const { addReview } = useBooking();

  const handleSubmit = () => {
      if (rating > 0 && comment) {
          addReview({
              bookingId: booking.id,
              vehicleId: booking.vehicleId,
              revieweeId: booking.ownerId,
              rating,
              comment
          });
          onClose();
      }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative animate-fade-in-up" onClick={e => e.stopPropagation()}>
        <div className="p-6">
            <h2 className="text-2xl font-bold text-primary mb-4">Deja una Reseña</h2>
            <div className="mb-4">
                <p className="font-semibold text-gray-700">Calificación</p>
                <div className="flex items-center space-x-1" onMouseLeave={() => setHoverRating(0)}>
                    {[...Array(5)].map((_, i) => (
                        <StarIcon 
                            key={i} 
                            className={`w-8 h-8 cursor-pointer transition-colors ${(hoverRating || rating) > i ? 'text-yellow-400' : 'text-gray-300'}`}
                            onClick={() => setRating(i + 1)}
                            onMouseEnter={() => setHoverRating(i + 1)}
                        />
                    ))}
                </div>
            </div>
             <div className="mb-6">
                <label htmlFor="comment" className="font-semibold text-gray-700">Comentario</label>
                <textarea 
                    id="comment" 
                    value={comment} 
                    onChange={e => setComment(e.target.value)}
                    rows={4}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-gray-900"
                    placeholder="Describe tu experiencia..."
                ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
                 <button onClick={onClose} className="bg-slate-200 text-slate-800 font-semibold py-2 px-4 rounded-md hover:bg-slate-300 transition-colors">
                    Cancelar
                </button>
                 <button onClick={handleSubmit} disabled={rating === 0 || !comment} className="bg-accent text-primary font-bold py-2 px-4 rounded-md hover:brightness-90 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed">
                    Enviar Reseña
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;