import React, { useState } from 'react';
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

import HomePage from './pages/HomePage';
import BookingsPage from './pages/BookingsPage';
import MyCarsPage from './pages/MyCarsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import StaticPage from './pages/StaticPage';
import ContactPage from './pages/ContactPage';
import LessorOnboardingPage from './pages/LessorOnboardingPage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import RegisterClientPage from './pages/RegisterClientPage';

const AppContent: React.FC = () => {
  const { user, role } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>(user ? 'home' : 'home'); // Default to home, which login page will catch if not logged in

  const onNavigate = (page: Page) => {
    window.scrollTo(0, 0);
    setCurrentPage(page);
  };
  
  if (!user) {
    switch (currentPage) {
      case 'register-client':
        return <RegisterClientPage onNavigate={onNavigate} />;
      case 'lessor-onboarding':
        return <LessorOnboardingPage onNavigate={onNavigate} />;
      // Allow access to some static pages even when not logged in
      case 'how-it-works':
        return <StaticPage title="Cómo Funciona" content={contentHowItWorks}/>;
      case 'terms':
        return <StaticPage title="Términos y Condiciones" content={contentTerms}/>;
       case 'privacy-policy':
        return <StaticPage title="Política de Privacidad" content={contentPrivacyPolicy}/>;
      default:
        // Any other page will default to the login screen
        return <LoginPage onNavigate={onNavigate} />;
    }
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
        return <ContactPage />;
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
      <main className="flex-grow">
        {renderPage()}
      </main>
      <Footer onNavigate={onNavigate} />
      <BottomNav activePage={currentPage} onNavigate={onNavigate} />
      <NotificationContainer />
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