import React from 'react';
import RecentLabReportsWidget from '../../../widgets/patient/RecentLabReportsWidget';
import HealthVitalsSummary from '../../../widgets/patient/HealthVitalsSummary';
import { UploadCloud } from 'lucide-react';

const MyRecordsScreen = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Records & Reports</h2>
          <p className="text-slate-500 mt-1">Manage your lab reports, prescriptions, and vitals securely.</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm shadow-teal-600/20 transition-all active:scale-95">
          <UploadCloud className="w-5 h-5" />
          Upload Record
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <RecentLabReportsWidget />
        </div>
        <div className="space-y-6">
          <HealthVitalsSummary />
        </div>
      </div>
    </div>
  );
};

export default MyRecordsScreen;
