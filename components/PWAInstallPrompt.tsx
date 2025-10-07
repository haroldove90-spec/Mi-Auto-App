import React, { useState, useEffect } from 'react';

interface PWAInstallPromptProps {
    show: boolean;
    onInstall: () => void;
    onDismiss: () => void;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ show, onInstall, onDismiss }) => {
    const [isIos, setIsIos] = useState(false);
    const [promptType, setPromptType] = useState<'install' | 'ios' | null>(null);

    useEffect(() => {
        const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

        if (isIosDevice && !isStandalone) {
            setIsIos(true);
            // Only show prompt if not dismissed recently
            if (!sessionStorage.getItem('pwaInstallDismissed')) {
                setPromptType('ios');
            }
        } else if (show) {
            setPromptType('install');
        } else {
            setPromptType(null);
        }
    }, [show]);
    
    const handleDismiss = () => {
        sessionStorage.setItem('pwaInstallDismissed', 'true');
        setPromptType(null);
        onDismiss();
    };

    const IosInstructions: React.FC = () => (
        <>
            <p className="text-sm text-gray-200 mb-3">
                Para la mejor experiencia, instala la app en tu pantalla de inicio.
            </p>
            <p className="text-sm text-gray-200">
                Toca el ícono de <b className="font-bold">Compartir</b> y luego selecciona <b className="font-bold">"Agregar a la pantalla de inicio"</b>.
            </p>
             <button
                onClick={handleDismiss}
                className="absolute top-2 right-2 text-gray-400 hover:text-white"
                aria-label="Cerrar"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </>
    );

    const InstallButton: React.FC = () => (
        <div className="flex-1">
             <h3 className="font-bold text-white">Instala Mi Auto App</h3>
             <p className="text-sm text-gray-300">Acceso rápido y una mejor experiencia.</p>
        </div>
    );
    

    if (!promptType) {
        return null;
    }

    return (
        <div 
            className={`fixed bottom-0 inset-x-0 z-50 p-4 transition-transform duration-500 ease-in-out ${promptType ? 'translate-y-0' : 'translate-y-full'}`}
            role="dialog"
            aria-labelledby="pwa-install-title"
            aria-modal="true"
        >
            <div className="bg-primary/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl max-w-md mx-auto flex items-center space-x-4">
                <img src="https://miautoapp.com.mx/miautoapp.png" alt="Mi Auto App Icon" className="w-14 h-14" />
                <div className="flex-grow">
                   {promptType === 'install' ? <InstallButton /> : <IosInstructions />}
                </div>
                 {promptType === 'install' && (
                    <div className="flex space-x-2">
                         <button
                            onClick={handleDismiss}
                            className="text-sm text-gray-300 font-medium px-4 py-2 rounded-lg hover:bg-white/10"
                        >
                            Ahora no
                        </button>
                        <button
                            onClick={onInstall}
                            className="bg-secondary text-primary font-bold px-5 py-2 rounded-lg hover:brightness-90 transition-all text-sm whitespace-nowrap"
                        >
                            Instalar
                        </button>
                    </div>
                 )}
            </div>
        </div>
    );
};

export default PWAInstallPrompt;
