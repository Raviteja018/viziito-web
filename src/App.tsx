import { useState, useEffect } from 'react';
import Splash from './components/Splash';
import WelcomeOnboarding from './components/WelcomeOnboarding';
import AuthModule from './components/AuthModule';
import UserTypeSelection from './components/UserTypeSelection';
import type { UserRole } from './components/UserTypeSelection';
import RegistrationModule, { RegistrationSuccess } from './components/RegistrationModule';
import Dashboard from './components/Dashboard';
import { ShieldCheck } from 'lucide-react';
import logoImg from './assets/vizito_logo.png';

type ScreenState = 
  | 'splash'
  | 'onboarding' 
  | 'login' 
  | 'role-selection' 
  | 'registration' 
  | 'registration-success' 
  | 'dashboard';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('splash');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [registeredData, setRegisteredData] = useState<any>(null);

  // Check user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('vizito_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setScreen('dashboard');
    }
  }, []);

  const handleSplashComplete = () => {
    // If user got logged in while splash was running, go to dashboard, else onboarding
    if (currentUser) {
      setScreen('dashboard');
    } else {
      setScreen('onboarding');
    }
  };

  const handleLoginSuccess = (user: any) => {
    setCurrentUser(user);
    localStorage.setItem('vizito_user', JSON.stringify(user));
    setScreen('dashboard');
  };

  const handleRegisterSuccess = (data: any) => {
    setRegisteredData(data);
    setScreen('registration-success');
  };

  const handleGoToDashboard = () => {
    const userSession = {
      email: registeredData.email,
      mobile: registeredData.mobile,
      fullName: registeredData.fullName || registeredData.orgName,
      orgName: registeredData.orgName || '',
      role: registeredData.role
    };
    setCurrentUser(userSession);
    localStorage.setItem('vizito_user', JSON.stringify(userSession));
    setScreen('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setRegisteredData(null);
    localStorage.removeItem('vizito_user');
    setScreen('login');
  };

  // Outer Header Nav for outer pages (onboarding, login, selection, registration)
  const renderOuterHeader = () => (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-sm animate-fade">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="VIZITO Logo" className="h-10 w-auto object-contain" />
          <div>
            <span className="text-xl font-black tracking-wider text-slate-800">VIZITO</span>
            <p className="text-[10px] text-teal-605 font-bold uppercase tracking-widest leading-none">Integrated Healthcare</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <a href="#" className="hover:text-teal-600 transition-colors">Emergency Ambulance</a>
          <a href="#" className="hover:text-teal-600 transition-colors">Verified Clinicians</a>
          <a href="#" className="hover:text-teal-600 transition-colors">Direct Pharmacy Orders</a>
        </div>

        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-700">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Secure Gateway
          </span>
        </div>
      </div>
    </header>
  );

  return (
    <div className="h-screen overflow-hidden flex flex-col font-sans bg-slate-50 text-slate-800 antialiased">
      {/* Outer Header is shown for auth/onboarding states */}
      {screen !== 'dashboard' && screen !== 'splash' && screen !== 'onboarding' && screen !== 'login' && screen !== 'role-selection' && screen !== 'registration' && screen !== 'registration-success' && renderOuterHeader()}

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {screen === 'splash' && (
          <Splash onComplete={handleSplashComplete} />
        )}

        {screen === 'onboarding' && (
          <WelcomeOnboarding onGetStarted={() => setScreen('login')} />
        )}

        {screen === 'login' && (
          <AuthModule 
            onLoginSuccess={handleLoginSuccess}
            onRegisterClick={() => setScreen('role-selection')}
          />
        )}

        {screen === 'role-selection' && (
          <UserTypeSelection 
            onSelectRole={(role) => {
              setSelectedRole(role);
              setScreen('registration');
            }}
            onBackToLogin={() => setScreen('login')}
          />
        )}

        {screen === 'registration' && selectedRole && (
          <RegistrationModule 
            role={selectedRole}
            onBackToRoles={() => setScreen('role-selection')}
            onRegisterSuccess={handleRegisterSuccess}
          />
        )}

        {screen === 'registration-success' && registeredData && (
          <RegistrationSuccess 
            role={registeredData.role}
            fullName={registeredData.fullName || registeredData.orgName}
            onGoToDashboard={handleGoToDashboard}
          />
        )}

        {screen === 'dashboard' && currentUser && (
          <Dashboard 
            user={currentUser}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
}
