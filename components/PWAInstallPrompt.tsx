import React, { useState, useEffect } from 'react';

interface PWAInstallPromptProps {
    show: boolean;
    onInstall: () => void;
    onDismiss: () => void;
}

const PWAInstallPrompt: React.FC<PWAInstallPromptProps> = ({ show, onInstall, onDismiss }) => {
    const [promptType, setPromptType] = useState<'install' | 'ios' | null>(null);

    useEffect(() => {
        const isIosDevice = () => {
            const userAgent = window.navigator.userAgent;
            // Basic check for iPhone, iPad, iPod
            if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
                return true;
            }
            // Check for iPad on iOS 13+ that may identify as a Mac
            return (
                navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1
            );
        };

        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

        if (isIosDevice() && !isStandalone) {
            // Only show prompt if not dismissed recently in this session
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
        setPromptType(null); // Hide prompt after dismissal
        onDismiss();
    };

    const IosInstructions: React.FC = () => (
        <div className="flex-grow">
            <h3 className="font-bold text-white mb-1">Instala la App</h3>
            <p className="text-sm text-gray-300">
                Toca <img src="https://img.icons8.com/ios-glyphs/20/ffffff/share-3.png" alt="Share Icon" className="inline h-5 w-5 mx-1"/> y luego "Agregar a la pantalla de inicio".
            </p>
        </div>
    );

    const InstallButton: React.FC = () => (
        <div className="flex-grow">
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
            <div className="bg-primary/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl max-w-md mx-auto flex items-center space-x-4 relative">
                <img src="https://miautoapp.com.mx/miautoapp.png" alt="Mi Auto App Icon" className="w-14 h-14 flex-shrink-0" />
                
                {promptType === 'install' ? <InstallButton /> : <IosInstructions />}
                
                 {promptType === 'install' && (
                    <div className="flex space-x-2 flex-shrink-0">
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

                 {promptType === 'ios' && (
                     <button
                        onClick={handleDismiss}
                        className="absolute top-1 right-1 text-gray-400 hover:text-white"
                        aria-label="Cerrar"
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                 )}
            </div>
        </div>
    );
};

export default PWAInstallPrompt;