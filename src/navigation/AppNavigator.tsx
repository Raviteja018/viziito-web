import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import DashboardLayout from '../layouts/DashboardLayout';

// Legacy Auth Components
import Splash from '../components/Splash';
import WelcomeOnboarding from '../components/WelcomeOnboarding';
import AuthModule from '../components/AuthModule';
import UserTypeSelection from '../components/UserTypeSelection';
import RegistrationModule from '../components/RegistrationModule';
import type { UserRole } from '../components/UserTypeSelection';

// Engines/Modules
import DoctorDashboardEngine from '../engines/DashboardEngine/DoctorDashboardEngine';

import ProfileLayout from '../screensModules/profile/ProfileLayout';
import HelpSupportScreen from '../screensModules/support/HelpSupportScreen';
import SettingsScreen from '../screensModules/settings/SettingsScreen';
import AppointmentsScreen from '../screensModules/appointments/AppointmentsScreen';
import CreateAppointmentScreen from '../screensModules/appointments/CreateAppointmentScreen';
import ConsultationScreen from '../screensModules/appointments/ConsultationScreen';
import PrescriptionsScreen from '../screensModules/prescriptions/PrescriptionsScreen';
import PatientsScreen from '../screensModules/patients/PatientsScreen';
import PatientDetailScreen from '../screensModules/patients/PatientDetailScreen';
import RevenueScreen from '../screensModules/revenue/RevenueScreen';
import TransactionsScreen from '../screensModules/transactions/TransactionsScreen';
import AvailabilityScreen from '../screensModules/availability/AvailabilityScreen';
import ReviewsScreen from '../screensModules/reviews/ReviewsScreen';
import NotificationsScreen from '../screensModules/notifications/NotificationsScreen';



// Hospital Screens
import HospitalDashboardEngine from '../engines/DashboardEngine/HospitalDashboardEngine';
import BedsManagementScreen from '../screensModules/hospital/beds/BedsManagementScreen';
import EmergencyScreen from '../screensModules/hospital/emergency/EmergencyScreen';
import DepartmentsScreen from '../screensModules/hospital/departments/DepartmentsScreen';
import BranchManagementScreen from '../screensModules/hospitalPortal/BranchManagementScreen';
import DoctorManagementScreen from '../screensModules/hospitalPortal/DoctorManagementScreen';
import StaffManagementScreen from '../screensModules/hospitalPortal/StaffManagementScreen';
import IntegrationsScreen from '../screensModules/hospitalPortal/IntegrationsScreen';

// Clinic Screens
import ClinicDashboardEngine from '../engines/DashboardEngine/ClinicDashboardEngine';
import ClinicProfileScreen from '../screensModules/clinicPortal/ClinicProfileScreen';
import PartnerDoctorsScreen from '../screensModules/clinicPortal/PartnerDoctorsScreen';

// Pharmacy Screens
import PharmacyDashboardEngine from '../engines/DashboardEngine/PharmacyDashboardEngine';
import InventoryScreen from '../screensModules/pharmacy/inventory/InventoryScreen';
import PrescriptionFulfillmentScreen from '../screensModules/pharmacy/fulfillment/PrescriptionFulfillmentScreen';

// Diagnostic Screens
import DiagnosticDashboardEngine from '../engines/DashboardEngine/DiagnosticDashboardEngine';
import LabTestsScreen from '../screensModules/diagnostic/tests/LabTestsScreen';
import LabAppointmentsScreen from '../screensModules/diagnostic/appointments/LabAppointmentsScreen';
import LabReportsScreen from '../screensModules/diagnostic/reports/LabReportsScreen';

// Home Care Screens
import HomecareDashboardEngine from '../engines/DashboardEngine/HomecareDashboardEngine';
import ServicesScreen from '../screensModules/homecare/services/ServicesScreen';
import StaffDirectoryScreen from '../screensModules/homecare/staff/StaffDirectoryScreen';
import CareBookingsScreen from '../screensModules/homecare/bookings/CareBookingsScreen';

// Ambulance Screens
import AmbulanceDashboardEngine from '../engines/DashboardEngine/AmbulanceDashboardEngine';
import DispatchScreen from '../screensModules/ambulance/dispatch/DispatchScreen';
import FleetManagementScreen from '../screensModules/ambulance/fleet/FleetManagementScreen';
import DriverRosterScreen from '../screensModules/ambulance/roster/DriverRosterScreen';

import { useRole } from '../store/role/RoleContext';
import { DashboardPage as HospitalPortalDashboard } from '../screensModules/hospitalPortal/DashboardPage';

const DashboardRouter = () => {
  const { role } = useRole();
  if (role === 'hospital') return <HospitalPortalDashboard />;
  if (role === 'clinic') return <ClinicDashboardEngine />;
  if (role === 'pharmacy') return <PharmacyDashboardEngine />;
  if (role === 'diagnostic') return <DiagnosticDashboardEngine />;
  if (role === 'homecare') return <HomecareDashboardEngine />;
  if (role === 'ambulance') return <AmbulanceDashboardEngine />;
  return <DoctorDashboardEngine />;
};

const AppNavigator = () => {
  return (
    <Routes>
      {/* Splash Route */}
      <Route path="/" element={
        <SplashWrapper />
      } />

      {/* Authentication Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="onboarding" element={<OnboardingWrapper />} />
        <Route path="login" element={<LoginWrapper />} />
        <Route path="role-selection" element={<RoleSelectionWrapper />} />
        <Route path="register" element={<RegisterWrapper />} />
        {/* Placeholder for other auth routes */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Route>

      {/* Protected Main Routes */}
      <Route element={<MainLayout />}>
        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardRouter />} />
        </Route>



        {/* Hospital Routes */}
        <Route path="/hospital-beds" element={<BedsManagementScreen />} />
        <Route path="/hospital-emergency" element={<EmergencyScreen />} />
        <Route path="/hospital-departments" element={<DepartmentsScreen />} />
        <Route path="/branches" element={<BranchManagementScreen />} />
        <Route path="/doctors" element={<DoctorManagementScreen />} />
        <Route path="/staff" element={<StaffManagementScreen />} />
        <Route path="/settlement" element={<RevenueScreen />} />
        <Route path="/integrations/pharmacy" element={<IntegrationsScreen />} />
        <Route path="/integrations/laboratory" element={<IntegrationsScreen />} />
        <Route path="/integrations/ambulance" element={<IntegrationsScreen />} />

        {/* Clinic Routes */}
        <Route path="/clinic-doctors" element={<PartnerDoctorsScreen />} />

        {/* Pharmacy Routes */}
        <Route path="/pharmacy-inventory" element={<InventoryScreen />} />
        <Route path="/pharmacy-prescriptions" element={<PrescriptionFulfillmentScreen />} />

        {/* Diagnostic Routes */}
        <Route path="/lab-tests" element={<LabTestsScreen />} />
        <Route path="/lab-appointments" element={<LabAppointmentsScreen />} />
        <Route path="/lab-reports" element={<LabReportsScreen />} />

        {/* Home Care Routes */}
        <Route path="/homecare-services" element={<ServicesScreen />} />
        <Route path="/homecare-staff" element={<StaffDirectoryScreen />} />
        <Route path="/homecare-bookings" element={<CareBookingsScreen />} />

        {/* Ambulance Routes */}
        <Route path="/ambulance-dispatch" element={<DispatchScreen />} />
        <Route path="/ambulance-fleet" element={<FleetManagementScreen />} />
        <Route path="/ambulance-drivers" element={<DriverRosterScreen />} />

        {/* Shared / Profile Routes (role-aware) */}
        <Route path="/profile" element={<ProfileLayoutRouter />} />
        <Route path="/appointments" element={<AppointmentsScreen />} />
        <Route path="/appointments/create" element={<CreateAppointmentScreen />} />
        <Route path="/appointments/:appointmentId/consultation" element={<ConsultationScreen />} />
        <Route path="/patients" element={<PatientsScreen />} />
        <Route path="/patients/:patientId" element={<PatientDetailScreen />} />
        <Route path="/prescriptions" element={<PrescriptionsScreen />} />
        <Route path="/revenue" element={<RevenueScreen />} />
        <Route path="/transactions" element={<TransactionsScreen />} />
        <Route path="/availability" element={<AvailabilityScreen />} />
        <Route path="/reviews" element={<ReviewsScreen />} />
        <Route path="/notifications" element={<NotificationsScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/help" element={<HelpSupportScreen />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppNavigator;

// ProfileLayoutRouter: routes clinic role to the dedicated ClinicProfileScreen
const ProfileLayoutRouter = () => {
  const { role } = useRole();
  if (role === 'clinic') return <ClinicProfileScreen />;
  return <ProfileLayout />;
};

// --- Wrappers to map props to React Router navigation ---

import { useNavigate, useSearchParams } from 'react-router-dom';

const SplashWrapper = () => {
  const navigate = useNavigate();
  return <Splash onComplete={() => navigate('/auth/onboarding')} />;
};

const OnboardingWrapper = () => {
  const navigate = useNavigate();
  return <WelcomeOnboarding onGetStarted={() => navigate('/auth/login')} />;
};

const LoginWrapper = () => {
  const navigate = useNavigate();
  const { setRole } = useRole();
  return (
    <AuthModule 
      onLoginSuccess={(userData) => {
        localStorage.setItem('vizito_user', JSON.stringify({
          email: userData.email,
          role: userData.role,
          fullName: userData.fullName,
          token: userData.token
        }));
        if (userData.token) {
          localStorage.setItem('vizito_token', userData.token);
        }
        setRole(userData.role);
        navigate('/dashboard');
      }}
      onRegisterClick={() => navigate('/auth/register')}
    />
  );
};

const RoleSelectionWrapper = () => {
  const navigate = useNavigate();
  return (
    <UserTypeSelection 
      onSelectRole={(role) => navigate(`/auth/register?role=${role}`)}
      onBackToLogin={() => navigate('/auth/login')}
    />
  );
};

const RegisterWrapper = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') as UserRole || undefined;
  const { setRole } = useRole();

  return (
    <RegistrationModule 
      role={role}
      onBackToLogin={() => navigate('/auth/login')}
      onRegisterSuccess={(userData) => {
        localStorage.setItem('vizito_user', JSON.stringify({
          email: userData.email,
          role: userData.role,
          fullName: userData.fullName,
          token: userData.token || ''
        }));
        setRole(userData.role);
        navigate('/dashboard');
      }}
    />
  );
};
