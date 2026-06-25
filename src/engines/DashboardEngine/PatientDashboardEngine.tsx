import PatientQuickActions from '../../widgets/patient/PatientQuickActions';
import UpcomingAppointmentsWidget from '../../widgets/patient/UpcomingAppointmentsWidget';
import RecentLabReportsWidget from '../../widgets/patient/RecentLabReportsWidget';
import HealthVitalsSummary from '../../widgets/patient/HealthVitalsSummary';
import { MOCK_PATIENT_PROFILE } from '../../mocks/patientFlowMocks';

const PatientDashboardEngine = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 rounded-2xl p-6 text-white shadow-lg shadow-teal-500/20">
        <h2 className="text-2xl font-bold">Good morning, {MOCK_PATIENT_PROFILE.name}!</h2>
        <p className="text-teal-50 mt-1">Here is your health overview for today.</p>
      </div>

      {/* Quick Actions */}
      <PatientQuickActions />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6 flex flex-col">
          <UpcomingAppointmentsWidget />
          <RecentLabReportsWidget />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          <HealthVitalsSummary />
        </div>
      </div>
    </div>
  );
};

export default PatientDashboardEngine;
