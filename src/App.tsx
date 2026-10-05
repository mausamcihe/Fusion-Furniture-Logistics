import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DeliveryProvider, useDelivery } from './context/DeliveryContext';
import { Header } from './components/Header';
import { BottomNav, ScreenType } from './components/BottomNav';
import { NotificationToast } from './components/NotificationToast';
import { EncryptionInspectorModal } from './components/EncryptionInspectorModal';
import { DriverCustomerChatModal } from './components/DriverCustomerChatModal';

import { SplashScreen } from './screens/SplashScreen';
import { AuthScreen } from './screens/AuthScreen';
import { ManifestScreen } from './screens/ManifestScreen';
import { RouteMapScreen } from './screens/RouteMapScreen';
import { StopArrivalScreen } from './screens/StopArrivalScreen';
import { HandoverScreen } from './screens/HandoverScreen';
import { ManifestPlannerScreen } from './screens/ManifestPlannerScreen';
import { ReportIssueScreen } from './screens/ReportIssueScreen';
import { ShiftSummaryScreen } from './screens/ShiftSummaryScreen';
import { ShiftArchivesScreen } from './screens/ShiftArchivesScreen';
import { AccessDirectoryScreen } from './screens/AccessDirectoryScreen';
import { CustomerTrackingScreen } from './screens/CustomerTrackingScreen';
import { AdminFleetHubScreen } from './screens/AdminFleetHubScreen';

function MainApp() {
  const { isAuthenticated, user } = useAuth();
  const { inspectEncryption, telemetry, activeStop } = useDelivery();

  const [hasSeenSplash, setHasSeenSplash] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('MANIFEST');
  const [screenHistory, setScreenHistory] = useState<ScreenType[]>(['MANIFEST']);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const navigateTo = (screen: ScreenType) => {
    setScreenHistory(prev => [...prev, screen]);
    setCurrentScreen(screen);
  };

  const handleBack = () => {
    if (screenHistory.length > 1) {
      const nextHistory = [...screenHistory];
      nextHistory.pop();
      const prevScreen = nextHistory[nextHistory.length - 1];
      setScreenHistory(nextHistory);
      setCurrentScreen(prevScreen);
    } else {
      setCurrentScreen('MANIFEST');
    }
  };

  // 1. Initial Splash Screen
  if (!hasSeenSplash) {
    return <SplashScreen onFinish={() => setHasSeenSplash(true)} />;
  }

  // 2. Authentication Screen
  if (!isAuthenticated) {
    return <AuthScreen onSuccess={() => setCurrentScreen('MANIFEST')} />;
  }

  // Screen title determination
  const getScreenTitle = (): string => {
    switch (currentScreen) {
      case 'MANIFEST':
        return "Today's Run";
      case 'MAP':
        return 'Route Map';
      case 'ARRIVAL':
        return 'Stop Arrival';
      case 'HANDOVER':
        return 'Digital Handover';
      case 'PLANNER':
        return 'Manifest Planner';
      case 'ISSUE':
        return 'Report An Issue';
      case 'SUMMARY':
        return 'Shift Summary';
      case 'ARCHIVES':
        return 'Shift Archives';
      case 'DIRECTORY':
        return 'Access Directory';
      case 'CUSTOMER_TRACKING':
        return 'Live Package Tracking';
      case 'ADMIN_FLEET':
        return 'Fleet Console & APIs';
      default:
        return 'Fusion Furniture';
    }
  };

  const handleOpenEncryptionInspector = () => {
    inspectEncryption({
      protocol: 'TLS_1_3_GCM_SHA256',
      client: user?.name,
      vanId: user?.vehicleId || 'VAN-01',
      coordinates: telemetry.currentLocation,
      activeStop: activeStop?.orderId,
      depotToken: 'FL-AU-409-CANBERRA',
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-orange-500/20 antialiased">
      {/* Global Header */}
      <Header
        title={getScreenTitle()}
        onBack={handleBack}
        showBack={currentScreen !== 'MANIFEST'}
        onOpenEncryptionInspector={handleOpenEncryptionInspector}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Push Notifications Toast Banner */}
      <NotificationToast onNavigate={navigateTo} />

      {/* Main Screen Container */}
      <main className="flex-1 w-full flex flex-col">
        {currentScreen === 'MANIFEST' && <ManifestScreen onNavigate={navigateTo} />}
        {currentScreen === 'MAP' && (
          <RouteMapScreen onNavigate={navigateTo} onOpenChat={() => setIsChatOpen(true)} />
        )}
        {currentScreen === 'ARRIVAL' && <StopArrivalScreen onNavigate={navigateTo} />}
        {currentScreen === 'HANDOVER' && <HandoverScreen onNavigate={navigateTo} />}
        {currentScreen === 'PLANNER' && <ManifestPlannerScreen onNavigate={navigateTo} />}
        {currentScreen === 'ISSUE' && <ReportIssueScreen onNavigate={navigateTo} />}
        {currentScreen === 'SUMMARY' && <ShiftSummaryScreen onNavigate={navigateTo} />}
        {currentScreen === 'ARCHIVES' && <ShiftArchivesScreen onNavigate={navigateTo} />}
        {currentScreen === 'DIRECTORY' && <AccessDirectoryScreen onNavigate={navigateTo} />}
        {currentScreen === 'CUSTOMER_TRACKING' && (
          <CustomerTrackingScreen
            onNavigate={navigateTo}
            onOpenChat={() => setIsChatOpen(true)}
          />
        )}
        {currentScreen === 'ADMIN_FLEET' && <AdminFleetHubScreen />}
      </main>

      {/* Global Bottom Navigation */}
      <BottomNav currentScreen={currentScreen} onSelectScreen={navigateTo} />

      {/* Cryptographic Wire Inspector Modal */}
      <EncryptionInspectorModal />

      {/* Real-time Driver-Customer Chat Modal */}
      <DriverCustomerChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DeliveryProvider>
          <MainApp />
        </DeliveryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
