import React from 'react';
import { MOCK_APPOINTMENTS } from '../mocks/doctorFlowMocks';
import { Video, Building2, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const statusConfig: Record<string, { bg: string; text: string }> = {
  Confirmed: { bg: 'bg-teal-50', text: 'text-teal-700' },
  Upcoming: { bg: 'bg-blue-50', text: 'text-blue-700' },
  Pending: { bg: 'bg-amber-50', text: 'text-amber-700' },
  'In Progress': { bg: 'bg-sky-50', text: 'text-sky-700' },
  Completed: { bg: 'bg-slate-100', text: 'text-slate-600' },
};

const TodayAppointmentsList = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-800">Today's Appointments</h3>
        <button
          onClick={() => navigate('/appointments')}
          className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors"
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
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer group"
              onClick={() => navigate(`/appointments/${app.id}`)}
            >
              {/* Left: vertical bar */}
              <div className="w-0.5 h-10 bg-teal-500 rounded-full shrink-0" />

              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                <span className="text-xs font-bold text-slate-600">{app.initials}</span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-800 truncate">{app.patientName}</span>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md shrink-0 ${status.bg} ${status.text}`}>
                    {app.status}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[11px] text-slate-400 font-medium">{app.time}</span>
                  <span className="text-slate-200">•</span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                    {isVideo
                      ? <Video className="w-3 h-3 text-blue-500" />
                      : <Building2 className="w-3 h-3 text-teal-500" />
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
