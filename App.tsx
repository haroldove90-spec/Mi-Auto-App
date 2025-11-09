import React, { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { BookingProvider } from './contexts/BookingContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { VehicleProvider } from './contexts/VehicleContext';
import { Page } from './types';
import { contentHowItWorks, contentSupport, contentTerms, contentPrivacyPolicy } from './content';

import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import NotificationContainer from './components/NotificationContainer';
import PWAInstallPrompt from './components/PWAInstallPrompt';

// --- Dynamic Imports for Code-Splitting ---
const HomePage = lazy(() => import('./pages/HomePage'));
const BookingsPage = lazy(() => import('./pages/BookingsPage'));
const MyCarsPage = lazy(() => import('./pages/MyCarsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const StaticPage = lazy(() => import('./pages/StaticPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const LessorOnboardingPage = lazy(() => import('./pages/LessorOnboardingPage'));
const VehicleDetailPage = lazy(() => import('./pages/VehicleDetailPage'));
const RegisterClientPage = lazy(() => import('./pages/RegisterClientPage'));

const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center flex-grow py-20">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const AppContent: React.FC = () => {
  const { user, role } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>(user ? 'home' : 'home');
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  const onNavigate = useCallback((page: Page) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  }, []);

  useEffect(() => {
    const handleNavigateEvent = (event: Event) => {
        const customEvent = event as CustomEvent<Page>;
        if (customEvent.detail) {
            onNavigate(customEvent.detail);
        }
    };
    window.addEventListener('navigate', handleNavigateEvent);
    return () => {
        window.removeEventListener('navigate', handleNavigateEvent);
    };
  }, [onNavigate]);

  useEffect(() => {
    // On login, redirect admin to their dashboard.
    // They are free to navigate elsewhere afterwards.
    if (user && role === 'admin' && currentPage === 'home') {
        onNavigate('admin');
    }
  }, [user, role, currentPage, onNavigate]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show prompt if not dismissed recently
      if (!sessionStorage.getItem('pwaInstallDismissed')) {
         setShowInstallPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
        // @ts-ignore
      deferredPrompt.prompt();
      // @ts-ignore
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };
  
  const handleDismissInstall = () => {
    sessionStorage.setItem('pwaInstallDismissed', 'true');
    setShowInstallPrompt(false);
  }

  
  if (!user) {
    // Wrap unauthenticated routes in Suspense as well
    return (
        <Suspense fallback={<LoadingSpinner />}>
            {(() => {
                switch (currentPage) {
                    case 'register-client':
                        return <RegisterClientPage onNavigate={onNavigate} />;
                    case 'lessor-onboarding':
                        return <LessorOnboardingPage onNavigate={onNavigate} />;
                    case 'how-it-works':
                        return <StaticPage title="Cómo Funciona" content={contentHowItWorks}/>;
                    case 'terms':
                        return <StaticPage title="Términos y Condiciones" content={contentTerms}/>;
                    case 'privacy-policy':
                        return <StaticPage title="Política de Privacidad" content={contentPrivacyPolicy}/>;
                    default:
                        return <LoginPage onNavigate={onNavigate} />;
                }
            })()}
        </Suspense>
    );
  }
  
  const renderPage = () => {
    // Role-based routing
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={onNavigate} />;
      case 'vehicle-detail':
        return <VehicleDetailPage onNavigate={onNavigate} />;
      case 'bookings':
        return role === 'cliente' ? <BookingsPage onNavigate={onNavigate} /> : <HomePage onNavigate={onNavigate} />;
      case 'my-cars':
        return role === 'arrendador' ? <MyCarsPage /> : <HomePage onNavigate={onNavigate} />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return role === 'admin' ? <AdminPage /> : <HomePage onNavigate={onNavigate} />;
      case 'how-it-works':
        return <StaticPage title="Cómo Funciona" content={contentHowItWorks}/>;
      case 'support':
        return <StaticPage title="Soporte" content={contentSupport}/>;
      case 'terms':
        return <StaticPage title="Términos y Condiciones" content={contentTerms}/>;
      case 'privacy-policy':
        return <StaticPage title="Política de Privacidad" content={contentPrivacyPolicy}/>;
      case 'contact':
        return role !== 'admin' ? <ContactPage /> : <HomePage onNavigate={onNavigate} />;
      case 'lessor-onboarding':
        // This allows an existing 'cliente' to become a 'arrendador'
        return <LessorOnboardingPage onNavigate={onNavigate} />;
      default:
        return <HomePage onNavigate={onNavigate} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-gray-800 pb-16 md:pb-0">
      <Header onNavigate={onNavigate} />
      <main className="flex-grow flex flex-col">
        <Suspense fallback={<LoadingSpinner />}>
          {renderPage()}
        </Suspense>
      </main>
      <Footer onNavigate={onNavigate} />
      <BottomNav activePage={currentPage} onNavigate={onNavigate} />
      <NotificationContainer />
      <PWAInstallPrompt 
        show={showInstallPrompt} 
        onInstall={handleInstall} 
        onDismiss={handleDismissInstall} 
      />
    </div>
  );
};


const App: React.FC = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <VehicleProvider>
          <BookingProvider>
            <AppContent />
          </BookingProvider>
        </VehicleProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;