
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';
import { Page } from '../types';
import { useNotification } from '../contexts/NotificationContext';
import { CheckCircleIcon } from '../components/icons/CheckCircleIcon';
import { CameraIcon } from '../components/icons/CameraIcon';
import { UploadIcon } from '../components/icons/UploadIcon';
import { IdIcon } from '../components/icons/IdIcon';
import { CarIcon } from '../components/icons/CarIcon';

// Helper function to convert file to base64
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

interface CameraModalProps {
    facingMode: 'user' | 'environment';
    onCapture: (imageData: string) => void;
    onClose: () => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ facingMode, onCapture, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [cameraError, setCameraError] = useState('');

    useEffect(() => {
        const startCamera = async () => {
            try {
                setCameraError('');
                const stream = await navigator.mediaDevices.getUserMedia({ 
                    video: { facingMode: facingMode } 
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    streamRef.current = stream;
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setCameraError("No se pudo acceder a la cámara. Revisa los permisos.");
            }
        };

        startCamera();

        return () => {
            // Cleanup: stop camera stream when component unmounts
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
            }
        };
    }, [facingMode]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d')?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
            const dataUrl = canvas.toDataURL('image/jpeg');
            onCapture(dataUrl.split(',')[1]); // Send base64 data without prefix
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-gray-900 rounded-lg overflow-hidden">
                {cameraError ? (
                    <div className="p-8 text-white text-center">
                        <p className="text-red-400">{cameraError}</p>
                    </div>
                ) : (
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto"></video>
                )}
            </div>
            <div className="flex items-center justify-center space-x-4 mt-4">
                 <button onClick={onClose} className="bg-gray-700 text-white font-semibold py-3 px-6 rounded-md">Cancelar</button>
                 <button onClick={handleCapture} disabled={!!cameraError} className="bg-secondary text-primary font-bold py-3 px-6 rounded-full text-lg disabled:bg-gray-500">
                    Tomar Foto
                </button>
            </div>
             <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>
    );
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
    const [licenseFront, setLicenseFront] = useState<string | null>(null);
    const [licenseBack, setLicenseBack] = useState<string | null>(null);
    const [registrationCard, setRegistrationCard] = useState<string | null>(null);
    const [insurance, setInsurance] = useState<string | null>(null);
    
    const [cameraFor, setCameraFor] = useState<'selfie' | 'ineFront' | 'ineBack' | 'licenseFront' | 'licenseBack' | 'registrationCard' | 'insurance' | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [verificationResult, setVerificationResult] = useState<{ success: boolean; message: string } | null>(null);
    const [error, setError] = useState<string>('');
    const { addNotification } = useNotification();

    const handleDataSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.phone) {
            setError('Todos los campos son obligatorios.');
            return;
        }
        setError('');
        setStep(2);
    };

    const handlePhotoCaptured = (imageData: string) => {
        if (cameraFor === 'selfie') setSelfie(imageData);
        else if (cameraFor === 'ineFront') setIneFront(imageData);
        else if (cameraFor === 'ineBack') setIneBack(imageData);
        else if (cameraFor === 'licenseFront') setLicenseFront(imageData);
        else if (cameraFor === 'licenseBack') setLicenseBack(imageData);
        else if (cameraFor === 'registrationCard') setRegistrationCard(imageData);
        else if (cameraFor === 'insurance') setInsurance(imageData);
        setCameraFor(null);
    };

    const handleVerification = async () => {
        if (!selfie || !ineFront || !ineBack || !licenseFront || !licenseBack || !registrationCard || !insurance) {
            setError("Por favor, proporciona todas las imágenes requeridas para la verificación.");
            return;
        }
        setError('');
        setIsLoading(true);
        setVerificationResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const prompt = `Eres un sistema avanzado de verificación de identidad y documentos para una app de renta de autos. Tu tarea es analizar un set de imágenes proporcionadas por un aspirante a arrendador y determinar si su perfil es legítimo y confiable. El usuario ha proporcionado el siguiente nombre: "${formData.name}". Las imágenes son: 1. Selfie del usuario. 2. Frente de una credencial de elector mexicana (INE). 3. Reverso de la misma credencial INE. 4. Frente de su licencia de conducir. 5. Reverso de su licencia de conducir. 6. Tarjeta de circulación del vehículo. 7. Póliza de seguro del vehículo. Realiza las siguientes verificaciones y responde ÚNICAMENTE con un objeto JSON: 1. Coincidencia Facial: Compara el rostro de la selfie con la foto del INE y la foto de la licencia de conducir. ¿Corresponden a la misma persona? 2. Coincidencia de Nombres: Extrae el nombre completo del INE y de la licencia de conducir. ¿Coinciden entre sí y con el nombre proporcionado por el usuario ("${formData.name}")? 3. Validez de Documentos: Analiza la apariencia de los documentos (INE, licencia, tarjeta de circulación, seguro). ¿Parecen ser documentos oficiales y válidos, sin signos evidentes de alteración digital o falsificación? 4. Consistencia de Vehículo: ¿Hay información consistente sobre el vehículo (como marca, modelo o placas) entre la tarjeta de circulación y la póliza de seguro? 5. Decisión Final: Basado en TODAS las verificaciones anteriores, determina si el proceso de verificación es exitoso. La verificación es exitosa SÓLO SI la coincidencia facial es positiva, los nombres coinciden, y los documentos parecen válidos. Responde con el siguiente formato JSON:`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: {
                    parts: [
                        { text: prompt },
                        { inlineData: { mimeType: 'image/jpeg', data: selfie } },
                        { inlineData: { mimeType: 'image/jpeg', data: ineFront } },
                        { inlineData: { mimeType: 'image/jpeg', data: ineBack } },
                        { inlineData: { mimeType: 'image/jpeg', data: licenseFront } },
                        { inlineData: { mimeType: 'image/jpeg', data: licenseBack } },
                        { inlineData: { mimeType: 'image/jpeg', data: registrationCard } },
                        { inlineData: { mimeType: 'image/jpeg', data: insurance } },
                    ]
                },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            faceMatch: { type: Type.BOOLEAN, description: '¿El rostro de la selfie coincide con los documentos?' },
                            nameMatch: { type: Type.BOOLEAN, description: '¿El nombre en los documentos coincide con el nombre proporcionado?' },
                            documentsLookValid: { type: Type.BOOLEAN, description: '¿Los documentos parecen auténticos y sin alteraciones?' },
                            vehicleInfoConsistent: { type: Type.BOOLEAN, description: '¿La información del vehículo es consistente entre los documentos?' },
                            isVerificationSuccessful: { type: Type.BOOLEAN, description: 'Decisión final basada en todas las verificaciones.' },
                            reason: { type: Type.STRING, description: 'Una explicación concisa de la decisión, especialmente si falló (ej. "El rostro no coincide con el INE").' },
                            extractedNameFromINE: { type: Type.STRING, description: 'Nombre completo extraído del INE.' },
                            extractedNameFromLicense: { type: Type.STRING, description: 'Nombre completo extraído de la licencia.' },
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
        <div className="space-y-4">
            <div className="text-center p-4 border rounded-lg">
                <h3 className="font-semibold text-lg flex items-center justify-center"><CameraIcon className="w-6 h-6 mr-2 text-secondary"/> 1. Tómate una Selfie</h3>
                <div className="my-2">
                    <button onClick={() => setCameraFor('selfie')} className="bg-slate-200 text-primary font-semibold py-2 px-4 rounded-md">Activar Cámara Frontal</button>
                </div>
                {selfie && <img src={`data:image/jpeg;base64,${selfie}`} alt="Selfie" className="w-24 h-24 object-cover rounded-full mx-auto border-4 border-green-500"/>}
            </div>
            
            <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg flex items-center justify-center mb-2"><IdIcon className="w-6 h-6 mr-2 text-secondary"/> 2. Fotografía tu INE</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center">
                        <button onClick={() => setCameraFor('ineFront')} className="bg-slate-200 text-primary font-semibold py-2 px-4 rounded-md w-full">Frente</button>
                        {ineFront && <img src={`data:image/jpeg;base64,${ineFront}`} alt="INE Frente" className="mt-2 h-20 rounded-lg border-2 border-green-500"/>}
                    </div>
                    <div className="flex flex-col items-center">
                        <button onClick={() => setCameraFor('ineBack')} className="bg-slate-200 text-primary font-semibold py-2 px-4 rounded-md w-full">Reverso</button>
                        {ineBack && <img src={`data:image/jpeg;base64,${ineBack}`} alt="INE Reverso" className="mt-2 h-20 rounded-lg border-2 border-green-500"/>}
                    </div>
                </div>
            </div>
            
             <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg flex items-center justify-center mb-2"><IdIcon className="w-6 h-6 mr-2 text-secondary"/> 3. Licencia de Conducir</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center">
                        <button onClick={() => setCameraFor('licenseFront')} className="bg-slate-200 text-primary font-semibold py-2 px-4 rounded-md w-full">Frente</button>
                        {licenseFront && <img src={`data:image/jpeg;base64,${licenseFront}`} alt="Licencia Frente" className="mt-2 h-20 rounded-lg border-2 border-green-500"/>}
                    </div>
                    <div className="flex flex-col items-center">
                        <button onClick={() => setCameraFor('licenseBack')} className="bg-slate-200 text-primary font-semibold py-2 px-4 rounded-md w-full">Reverso</button>
                        {licenseBack && <img src={`data:image/jpeg;base64,${licenseBack}`} alt="Licencia Reverso" className="mt-2 h-20 rounded-lg border-2 border-green-500"/>}
                    </div>
                </div>
            </div>

            <div className="p-4 border rounded-lg">
                <h3 className="font-semibold text-lg flex items-center justify-center mb-2"><CarIcon className="w-6 h-6 mr-2 text-secondary"/> 4. Documentos del Vehículo</h3>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center">
                        <button onClick={() => setCameraFor('registrationCard')} className="bg-slate-200 text-primary font-semibold py-2 px-4 rounded-md w-full">Tarjeta de Circulación</button>
                        {registrationCard && <img src={`data:image/jpeg;base64,${registrationCard}`} alt="Tarjeta de Circulación" className="mt-2 h-20 rounded-lg border-2 border-green-500"/>}
                    </div>
                    <div className="flex flex-col items-center">
                        <button onClick={() => setCameraFor('insurance')} className="bg-slate-200 text-primary font-semibold py-2 px-4 rounded-md w-full">Póliza de Seguro</button>
                        {insurance && <img src={`data:image/jpeg;base64,${insurance}`} alt="Póliza de Seguro" className="mt-2 h-20 rounded-lg border-2 border-green-500"/>}
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
            <p className="text-gray-600 mb-6">Ahora puedes iniciar sesión para agregar tus vehículos.</p>
            <button 
                onClick={() => onNavigate('home')}
                className="w-full bg-primary text-white font-bold py-3 px-6 rounded-md hover:bg-opacity-90 transition-all text-lg">
                Ir a Iniciar Sesión
            </button>
        </div>
    );
    
    return (
        <>
            {cameraFor && (
                <CameraModal 
                    facingMode={cameraFor === 'selfie' ? 'user' : 'environment'}
                    onCapture={handlePhotoCaptured}
                    onClose={() => setCameraFor(null)}
                />
            )}
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
        </>
    );
};

export default LessorOnboardingPage;