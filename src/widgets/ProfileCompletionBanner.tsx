import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

interface Props {
  completionPercentage: number;
}

const ProfileCompletionBanner: React.FC<Props> = ({ completionPercentage }) => {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  if (completionPercentage >= 100 || dismissed) return null;

  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm relative overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Progress + Text */}
        <div className="flex items-center gap-4 flex-1">
          {/* Circular Progress */}
          <div className="relative w-12 h-12 shrink-0">
            <svg viewBox="0 0 40 40" className="w-12 h-12 -rotate-90">
              <circle cx="20" cy="20" r={radius} fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
              <circle
                cx="20" cy="20" r={radius} fill="none"
                stroke="#0d9488" strokeWidth="3.5"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={offset}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-extrabold text-teal-700">
              {completionPercentage}%
            </span>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-800">
              Complete your profile to enable settlements and verification.
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Profile completion is required before receiving payments.
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/profile')}
            className="bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors"
          >
            Complete Profile
          </button>
          <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
            Remind Me Later
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletionBanner;
