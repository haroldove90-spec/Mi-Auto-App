import React from 'react';

interface LoginModalProps {
    onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  // This is a placeholder component as the app uses a full LoginPage.
  // It's created to resolve the file error.
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white p-8 rounded-lg" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold mb-4">Iniciar Sesión</h2>
        <p>El contenido del modal de inicio de sesión iría aquí.</p>
        <button onClick={onClose} className="mt-4 px-4 py-2 bg-primary text-white rounded">Cerrar</button>
      </div>
    </div>
  );
};

export default LoginModal;
