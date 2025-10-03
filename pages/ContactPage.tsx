
import React, { useState } from 'react';
import { useNotification } from '../contexts/NotificationContext';

const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { addNotification } = useNotification();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    setError('');
    console.log({ name, email, message });
    
    // Simulate API call
    addNotification({
        message: '¡Gracias por tu mensaje! Te contactaremos pronto.',
        type: 'success'
    });

    // Reset form
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="bg-white min-h-full py-12">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-primary">Contáctanos</h1>
            <p className="text-gray-600 mt-2">¿Tienes alguna pregunta o comentario? Rellena el formulario y nos pondremos en contacto contigo.</p>
        </div>
        <div className="mt-10 bg-slate-50 p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
              <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-gray-900" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-gray-900" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
              <textarea id="message" value={message} onChange={e => setMessage(e.target.value)} rows={5} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-gray-900"></textarea>
            </div>
            {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
            <div>
              <button type="submit" className="w-full bg-accent text-primary font-bold py-3 px-6 rounded-md hover:brightness-90 transition-all text-lg">
                Enviar Mensaje
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
