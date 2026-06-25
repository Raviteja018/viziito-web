import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, ChevronRight, X } from 'lucide-react';

interface Props {
  completionPercentage: number;
}

const ProfileCompletionBanner: React.FC<Props> = ({ completionPercentage }) => {
  const navigate = useNavigate();

  if (completionPercentage >= 100) return null;

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-5 shadow-sm relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6 relative z-10">
        <div className="flex items-start sm:items-center gap-4 flex-1">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h3 className="text-amber-900 font-bold text-base pr-6 sm:pr-0">Complete your profile to enable settlements and verification.</h3>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-sm text-amber-700 font-medium hidden sm:inline">Profile Completion: {completionPercentage}%</span>
              <span className="text-sm text-amber-700 font-medium sm:hidden">Completion: {completionPercentage}%</span>
              <div className="w-24 sm:w-32 h-2 bg-amber-200/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end w-full sm:w-auto gap-3 shrink-0 mt-2 sm:mt-0">
          <button className="text-sm font-medium text-amber-700 hover:text-amber-900 hover:bg-amber-100/50 px-3 py-1.5 rounded-lg transition-colors hidden sm:block">
            Remind Me Later
          </button>
          <button 
            onClick={() => navigate('/profile')}
            className="flex items-center justify-center w-full sm:w-auto gap-1.5 text-sm font-semibold text-white bg-amber-600 hover:bg-amber-700 px-4 py-2.5 sm:py-2 rounded-xl shadow-sm shadow-amber-600/20 transition-all active:scale-95"
          >
            Complete Profile
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Mobile close button */}
      <button className="absolute top-3 right-3 text-amber-500 hover:text-amber-700 sm:hidden">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ProfileCompletionBanner;
