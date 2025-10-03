import React from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

// Define missing icons locally to avoid creating new files
const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  const icons = {
    success: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
    error: <XCircleIcon className="w-6 h-6 text-red-500" />,
    info: <InfoIcon className="w-6 h-6 text-blue-500" />,
  };

  return (
    <div className="fixed top-20 right-0 p-4 space-y-2 z-50" style={{ pointerEvents: 'none' }}>
      {notifications.map(notification => (
        <div 
            key={notification.id} 
            className="bg-white rounded-lg shadow-lg p-4 w-80 flex items-start animate-slide-in-left"
            style={{ pointerEvents: 'auto' }}
        >
          <div className="flex-shrink-0">
            {icons[notification.type]}
          </div>
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">{notification.message}</p>
          </div>
          <button onClick={() => removeNotification(notification.id)} className="ml-4 text-gray-400 hover:text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationContainer;
