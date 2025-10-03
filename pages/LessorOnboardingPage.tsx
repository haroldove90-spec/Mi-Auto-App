
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';
import { Page } from '../types';
import { useNotification } from '../contexts/NotificationContext';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { CameraIcon } from '../components/icons/CameraIcon';
import { UploadIcon } from '../components/icons/UploadIcon';
import { IdIcon } from '../components/icons/IdIcon';

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

interface LessorOnboardingPageProps {
    onNavigate: (page: Page) => void;
}

const LessorOnboardingPage: React.FC<LessorOnboardingPageProps> = ({ onNavigate }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [selfie, setSelfie] = useState<string | null>(null);
    const [ineFront, setIneFront] = useState<string | null>(null);
    const [ineBack, setIneBack] = useState<string | null>(null);
    
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [verificationResult, setVerificationResult] = useState<{ success: boolean; message: string } | null>(null);
    const [error, setError] = useState<string>('');
    const { addNotification } = useNotification();

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsCameraOn(true);
        } catch (err) {
            console.error("Error accessing camera:", err);
            setError("No se pudo acceder a la cámara. Asegúrate de haber otorgado los permisos.");
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraOn(false);
    };
    
    useEffect(() => {
        return () => {
          // Cleanup camera on component unmount
          stopCamera();
        };
    }, []);

    const handleDataSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.phone) {
            setError('Todos los campos son obligatorios.');
            return;
        }
        setError('');
        setStep(2);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fileType: 'ineFront' | 'ineBack') => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const base64 = await fileToBase64(file);
                if (fileType === 'ineFront') setIneFront(base64);
                else setIneBack(base64);
            } catch (err) {
                setError('Error al procesar la imagen.');
            }
        }
    };
    
    const takeSelfie = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d')?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setSelfie(dataUrl.split(',')[1]);
            stopCamera();
        }
    };

    const handleVerification = async () => {
        if (!selfie || !ineFront || !ineBack) {
            setError("Por favor, completa los tres requisitos: selfie, frente y reverso del INE.");
            return;
        }
        setError('');
        setIsLoading(true);
        setVerificationResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Eres un sistema de verificación de identidad para una app de renta de autos. Analiza estas tres imágenes: una selfie, el frente de una credencial de elector mexicana (INE), y el reverso de la misma.
            1. Compara el rostro de la selfie con la foto del INE. ¿Son la misma persona?
            2. Extrae el nombre completo que aparece en el INE.
            3. Compara si el nombre extraído del INE coincide con el nombre proporcionado por el usuario: "${formData.name}".
            4. Basado en todo lo anterior, determina si la verificación es exitosa. La verificación es exitosa SOLO si el rostro coincide Y el nombre coincide.
            
            Responde únicamente con un JSON.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: {
                    parts: [
                        { text: prompt },
                        { inlineData: { mimeType: 'image/jpeg', data: selfie } },
                        { inlineData: { mimeType: 'image/jpeg', data: ineFront } },
                        { inlineData: { mimeType: 'image/jpeg', data: ineBack } },
                    ]
                },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            faceMatch: { type: Type.BOOLEAN },
                            nameMatch: { type: Type.BOOLEAN },
                            extractedName: { type: Type.STRING },
                            isVerificationSuccessful: { type: Type.BOOLEAN },
                            reason: { type: Type.STRING },
                        }
                    }
                }
            });

            const result = JSON.parse(response.text);

            if (result.isVerificationSuccessful) {
                setVerificationResult({ success: true, message: "¡Verificación exitosa! Tu cuenta de arrendador ha sido aprobada." });
                addNotification({ message: '¡Registro completado!', type: 'success' });
                setStep(3);
            } else {
                setVerificationResult({ success: false, message: result.reason || "La verificación falló. Por favor, inténtalo de nuevo." });
            }

        } catch (err) {
            console.error("AI Verification Error:", err);
            setVerificationResult({ success: false, message: "Ocurrió un error al contactar al servicio de verificación. Inténtalo más tarde." });
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderStep1 = () => (
         <form onSubmit={handleDataSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo (como aparece en tu INE)</label>
              <input type="text" id="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-gray-900" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
              <input type="email" id="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-gray-900" />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input type="tel" id="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary bg-white text-gray-900" />
            </div>
            {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
            <button type="submit" className="w-full bg-accent text-primary font-bold py-3 px-6 rounded-md hover:brightness-90 transition-all text-lg">
                Siguiente
            </button>
        </form>
    );

    const renderStep2 = () => (
        <div className="space-y-8">
            {/* Selfie Section */}
            <div className="text-center p-4 border rounded-lg">
                <h3 className="font-semibold text-lg flex items-center justify-center"><CameraIcon className="w-6 h-6 mr-2 text-secondary"/> Tómate una Selfie</h3>
                {isCameraOn ? (
                    <div className="my-4">
                        <video ref={videoRef} autoPlay className="w-full max-w-sm mx-auto rounded-lg"></video>
                        <button onClick={takeSelfie} className="mt-4 bg-primary text-white font-semibold py-2 px-4 rounded-md">Capturar Foto</button>
                    </div>
                ) : selfie ? (
                     <div className="my-4 relative inline-block">
                        <img src={`data:image/jpeg;base64,${selfie}`} alt="Selfie" className="w-40 h-40 object-cover rounded-full mx-auto border-4 border-green-500"/>
                        <CheckCircleIcon className="w-8 h-8 text-white bg-green-500 rounded-full absolute bottom-2 right-2"/>
                    </div>
                ) : (
                    <div className="my-4">
                        <button onClick={startCamera} className="bg-slate-200 text-primary font-semibold py-2 px-4 rounded-md">Activar Cámara</button>
                    </div>
                )}
            </div>
            {/* INE Upload Section */}
            <div className="text-center p-4 border rounded-lg">
                 <h3 className="font-semibold text-lg flex items-center justify-center"><IdIcon className="w-6 h-6 mr-2 text-secondary"/> Sube tu INE</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                    <div className="flex flex-col items-center">
                        <label htmlFor="ine-front" className="cursor-pointer bg-slate-200 text-primary font-semibold py-2 px-4 rounded-md flex items-center"><UploadIcon className="w-5 h-5 mr-2"/>Frente</label>
                        <input id="ine-front" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'ineFront')}/>
                        {ineFront && <img src={`data:image/jpeg;base64,${ineFront}`} className="mt-2 h-24 rounded-lg border-2 border-green-500"/>}
                    </div>
                     <div className="flex flex-col items-center">
                        <label htmlFor="ine-back" className="cursor-pointer bg-slate-200 text-primary font-semibold py-2 px-4 rounded-md flex items-center"><UploadIcon className="w-5 h-5 mr-2"/>Reverso</label>
                        <input id="ine-back" type="file" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e, 'ineBack')}/>
                        {ineBack && <img src={`data:image/jpeg;base64,${ineBack}`} className="mt-2 h-24 rounded-lg border-2 border-green-500"/>}
                    </div>
                 </div>
            </div>

            {error && <p className="text-red-500 text-sm font-semibold text-center">{error}</p>}
            
            {verificationResult && (
                <p className={`text-center font-semibold p-3 rounded-md ${verificationResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {verificationResult.message}
                </p>
            )}

            <button onClick={handleVerification} disabled={isLoading} className="w-full bg-accent text-primary font-bold py-3 px-6 rounded-md hover:brightness-90 transition-all text-lg disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center">
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Verificando con IA...
                    </>
                ) : 'Verificar Identidad'}
            </button>
             <button onClick={() => setStep(1)} className="w-full text-center text-sm text-gray-600 hover:underline mt-2">
                Volver
            </button>
        </div>
    );
    
    const renderStep3 = () => (
        <div className="text-center p-8">
            <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-primary mb-2">¡Registro Completado!</h2>
            <p className="text-gray-600 mb-6">{verificationResult?.message || "Tu cuenta ha sido creada y verificada."}</p>
            <button 
                onClick={() => onNavigate('my-cars')}
                className="w-full bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-90 transition-all text-lg">
                Ir a Mis Autos
            </button>
        </div>
    );
    
    return (
        <>
            <div className="bg-white min-h-full py-12">
                <div className="container mx-auto px-6 max-w-2xl">
                     <div className="text-center">
                        <h1 className="text-3xl md:text-4xl font-bold text-primary">Registro de Arrendador</h1>
                        <p className="text-gray-600 mt-2">Únete a nuestra comunidad y empieza a ganar dinero con tu auto.</p>
                    </div>
                    {/* Stepper */}
                    <div className="flex justify-between items-center my-8 max-w-sm mx-auto">
                        <div className={`flex items-center flex-col ${step >= 1 ? 'text-secondary' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'bg-secondary text-primary border-secondary' : 'border-gray-400'}`}>1</div>
                            <p className="text-sm mt-1">Datos</p>
                        </div>
                        <div className={`flex-grow h-0.5 ${step >= 2 ? 'bg-secondary' : 'bg-gray-300'}`}></div>
                         <div className={`flex items-center flex-col ${step >= 2 ? 'text-secondary' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'bg-secondary text-primary border-secondary' : 'border-gray-400'}`}>2</div>
                            <p className="text-sm mt-1">Verificación</p>
                        </div>
                        <div className={`flex-grow h-0.5 ${step >= 3 ? 'bg-secondary' : 'bg-gray-300'}`}></div>
                         <div className={`flex items-center flex-col ${step >= 3 ? 'text-secondary' : 'text-gray-400'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'bg-secondary text-primary border-secondary' : 'border-gray-400'}`}>3</div>
                            <p className="text-sm mt-1">Listo</p>
                        </div>
                    </div>

                    <div className="mt-10 bg-slate-50 p-8 rounded-lg shadow-lg">
                       {step === 1 && renderStep1()}
                       {step === 2 && renderStep2()}
                       {step === 3 && renderStep3()}
                    </div>
                </div>
            </div>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </>
    );
};

// Add new icons needed for this page
const CameraIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);
const UploadIcon: React.FC<{className?: string}> = ({ className }) => (
     <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);
const IdIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-6 0h6" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 18v-1a2 2 0 00-2-2h-4a2 2 0 00-2 2v1" />
    </svg>
);

export default LessorOnboardingPage;
