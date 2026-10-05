import React, { useState } from 'react';
import IOSStatusBar from './components/layout/IOSStatusBar';
import BottomNav from './components/layout/BottomNav';

// Onboarding Pages
import SplashScreen from './pages/onboarding/SplashScreen';
import LanguageSelection from './pages/onboarding/LanguageSelection';
import LoginScreen from './pages/onboarding/LoginScreen';

// Primary Modules
import HomeDashboard from './pages/home/HomeDashboard';
import ScholarshipsList from './pages/scholarships/ScholarshipsList';
import JagoChatbot from './pages/jago/JagoChatbot';
import DocumentWallet from './pages/documents/DocumentWallet';
import ProfileScreen from './pages/profile/ProfileScreen';

// Contextual Subpages
import ScholarshipDetails from './pages/scholarships/ScholarshipDetails';
import ApplicationTracker from './pages/applications/ApplicationTracker';
import ApplicationDetails from './pages/applications/ApplicationDetails';
import DocumentReuse from './pages/documents/DocumentReuse';
import PaymentsDbt from './pages/payments/PaymentsDbt';
import NotificationsScreen from './pages/notifications/NotificationsScreen';

const PRIMARY_TABS = ['home', 'scholarships', 'jago', 'documents', 'profile'];

export default function App() {
  const [screen, setScreen] = useState('splash');
  const [activeTab, setActiveTab] = useState('home');
  const [navParams, setNavParams] = useState({});
  const [history, setHistory] = useState([]);

  // Navigate to a new screen
  const navigate = (newScreen, params = {}) => {
    setHistory((prev) => [...prev, { screen, activeTab, navParams }]);
    setScreen(newScreen);
    setNavParams(params);

    if (PRIMARY_TABS.includes(newScreen)) {
      setActiveTab(newScreen);
    }
  };

  // Back navigation
  const goBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory((old) => old.slice(0, old.length - 1));
      setScreen(prev.screen);
      setActiveTab(prev.activeTab);
      setNavParams(prev.navParams);
    } else {
      setScreen('home');
      setActiveTab('home');
    }
  };

  // Bottom Navigation tab switch
  const handleTabChange = (tabId) => {
    setHistory([]);
    setActiveTab(tabId);
    setScreen(tabId);
    setNavParams({});
  };

  // Determine if bottom navigation should be visible (only for the 5 primary modules)
  const isPrimaryModule = PRIMARY_TABS.includes(screen);

  return (
    <main className="w-full max-w-[390px] h-[100dvh] sm:h-[min(844px,calc(100vh-1.5rem))] bg-[#fbfbf9] flex flex-col relative shadow-2xl sm:rounded-[40px] overflow-hidden border-0 sm:border-[6px] border-slate-900 select-none">
      {/* iOS Status Bar */}
      <IOSStatusBar dark={screen !== 'splash'} />

      {/* Screen Router */}
      <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden">
        {screen === 'splash' && (
          <SplashScreen onProceed={() => navigate('language-selection')} />
        )}

        {screen === 'language-selection' && (
          <LanguageSelection
            onSelectLanguage={(lang) => navigate('login', { lang })}
            onBack={goBack}
          />
        )}

        {screen === 'login' && (
          <LoginScreen
            onLoginSuccess={() => {
              setHistory([]);
              navigate('home');
            }}
            onBack={goBack}
          />
        )}

        {screen === 'home' && (
          <HomeDashboard onNavigate={navigate} />
        )}

        {screen === 'scholarships' && (
          <ScholarshipsList onNavigate={navigate} />
        )}

        {screen === 'scholarship-details' && (
          <ScholarshipDetails
            scholarshipId={navParams.scholarshipId || 'mota-post-matric'}
            onBack={goBack}
            onNavigate={navigate}
          />
        )}

        {screen === 'application-tracker' && (
          <ApplicationTracker
            applicationId={navParams.applicationId || 'MOTA-PMS-2026-00124'}
            onBack={goBack}
            onNavigate={navigate}
          />
        )}

        {screen === 'application-details' && (
          <ApplicationDetails
            applicationId={navParams.applicationId || 'MOTA-PMS-2026-00124'}
            onBack={goBack}
            onNavigate={navigate}
          />
        )}

        {screen === 'documents' && (
          <DocumentWallet onNavigate={navigate} />
        )}

        {screen === 'document-reuse' && (
          <DocumentReuse
            scholarshipId={navParams.scholarshipId || 'mota-post-matric'}
            onBack={goBack}
            onNavigate={navigate}
          />
        )}

        {screen === 'payments' && (
          <PaymentsDbt onBack={goBack} onNavigate={navigate} />
        )}

        {screen === 'notifications' && (
          <NotificationsScreen onBack={goBack} onNavigate={navigate} />
        )}

        {screen === 'jago' && (
          <JagoChatbot
            applicationId={navParams.applicationId || 'MOTA-PMS-2026-00124'}
            scholarshipId={navParams.scholarshipId || null}
            onNavigate={navigate}
          />
        )}

        {screen === 'profile' && (
          <ProfileScreen
            onNavigate={navigate}
            onLogout={() => {
              setHistory([]);
              setScreen('splash');
            }}
          />
        )}
      </div>

      {/* Persistent Bottom Navigation - Visible on the 5 primary modules */}
      {isPrimaryModule && (
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      )}

      {/* iOS Home Indicator Bar */}
      <div className="w-32 h-1 bg-slate-900 rounded-full mx-auto my-1 shrink-0 z-40" />
    </main>
  );
}
