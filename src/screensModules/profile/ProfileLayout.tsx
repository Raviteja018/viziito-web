import ProfileCompletionTracker from './components/ProfileCompletionTracker';
import PersonalInfoSection from './sections/PersonalInfoSection';
import ProfessionalInfoSection from './sections/ProfessionalInfoSection';
import KYCVerificationSection from './sections/KYCVerificationSection';
import BankDetailsSection from './sections/BankDetailsSection';
import WebsiteRequestSection from './sections/WebsiteRequestSection';
import { Building2, Save, Send } from 'lucide-react';

const ProfileLayout = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Doctor Profile Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your personal, professional, and operational details.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-colors">
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm shadow-teal-600/20 transition-all active:scale-95">
            <Send className="w-4 h-4" />
            Submit Profile
          </button>
        </div>
      </div>

      <ProfileCompletionTracker />
      
      <PersonalInfoSection />
      
      <ProfessionalInfoSection />

      {/* Clinic Management Placeholder */}
      <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start sm:items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Clinic Management</h3>
            <p className="text-sm text-slate-500 mt-1">Manage clinics associated with your practice.</p>
          </div>
          <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
            Manage Clinics
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-slate-200 rounded-xl p-4 flex items-start gap-4 hover:border-teal-300 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-teal-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800 group-hover:text-teal-600 transition-colors">Apollo Spectra</h4>
              <p className="text-xs text-slate-500 mt-0.5">In-Clinic • ₹800 Fee</p>
              <p className="text-xs text-slate-400 mt-2">Banjara Hills, Hyderabad</p>
            </div>
          </div>
        </div>
      </div>

      <KYCVerificationSection />
      
      <BankDetailsSection />

      <WebsiteRequestSection />
    </div>
  );
};

export default ProfileLayout;
