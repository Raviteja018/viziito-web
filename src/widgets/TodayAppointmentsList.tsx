import React from 'react';
import { MOCK_APPOINTMENTS } from '../mocks/doctorFlowMocks';
import { Video, Building2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const statusConfig: Record<string, { bg: string; text: string }> = {
  Confirmed: { bg: 'bg-[#FFFBEB] border border-[#F2C78D]/30', text: 'text-[#F2AC4A]' },
  Upcoming: { bg: 'bg-[#FFF5F2] border border-[#F8DDBC]/30', text: 'text-[#FF7F4D]' },
  Pending: { bg: 'bg-[#FFFBEB] border border-[#F8DDBC]/35', text: 'text-[#F2AC4A]' },
  'In Progress': { bg: 'bg-slate-50 border border-[#DEDFE0]', text: 'text-slate-600' },
  Completed: { bg: 'bg-slate-100', text: 'text-slate-600' },
};

const TodayAppointmentsList = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-[#DEDFE0] rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-base font-bold text-[#2B2B2B]">Today's Appointments</h3>
        <button
          onClick={() => navigate('/appointments')}
          className="text-xs font-bold text-[#FF7F4D] hover:text-[#F2AC4A] transition-colors"
        >
          View all
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {MOCK_APPOINTMENTS.map(app => {
          const status = statusConfig[app.status] ?? { bg: 'bg-slate-100', text: 'text-slate-600' };
          const isVideo = app.type.toLowerCase().includes('video');
          return (
            <div
              key={app.id}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50/50 transition-colors cursor-pointer group"
              onClick={() => navigate(`/appointments/${app.id}`)}
            >
              {/* Left: vertical bar */}
              <div className="w-0.5 h-10 bg-gradient-to-b from-[#FF7F4D] to-[#F2AC4A] rounded-full shrink-0" />

              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-[#FDF9F6] border border-[#DEDFE0] flex items-center justify-center shrink-0 overflow-hidden">
                <span className="text-xs font-bold text-[#5F6368]">{app.initials}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-[#2B2B2B] truncate">{app.patientName}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 ${status.bg} ${status.text}`}>
                    {app.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-[#737379] font-medium">{app.time}</span>
                  <span className="text-slate-200">•</span>
                  <span className="flex items-center gap-1 text-[11px] text-[#5F6368]">
                    {isVideo
                      ? <Video className="w-3 h-3 text-[#FF7F4D]" />
                      : <Building2 className="w-3 h-3 text-[#F2AC4A]" />
                    }
                    {app.type}
                  </span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodayAppointmentsList;
