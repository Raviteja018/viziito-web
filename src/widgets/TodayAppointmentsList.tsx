import React, { useState } from 'react';
import { MOCK_APPOINTMENTS } from '../mocks/doctorFlowMocks';
import { Video, Building2, ChevronRight, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const filters = ['All', 'Online', 'In-Clinic', 'Pending'];

const TodayAppointmentsList = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredAppointments = MOCK_APPOINTMENTS.filter(app => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Online') return app.type === 'Online';
    if (activeFilter === 'In-Clinic') return app.type === 'In-Clinic';
    if (activeFilter === 'Pending') return app.status === 'Pending';
    return true;
  });

  return (
    <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-slate-800">Today's Appointments</h3>
        
        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === filter
                  ? 'bg-teal-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filteredAppointments.length === 0 ? (
          <div className="h-40 flex items-center justify-center text-slate-500 text-sm">
            No appointments found for this filter.
          </div>
        ) : (
          <div className="space-y-2">
            {filteredAppointments.map(app => (
              <div key={app.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex flex-col items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-slate-700">{app.time.split(' ')[0]}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">{app.time.split(' ')[1]}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{app.patientName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                        {app.type === 'Online' ? <Video className="w-3 h-3 text-sky-500" /> : <Building2 className="w-3 h-3 text-teal-500" />}
                        {app.type}
                      </span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        app.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                        app.status === 'In Progress' ? 'bg-sky-100 text-sky-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {app.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                  <button className="text-[11px] font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors">
                    {app.status === 'Pending' ? 'Start' : 'View'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-100 bg-slate-50">
        <button 
          onClick={() => navigate('/appointments')}
          className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors py-2"
        >
          View All Appointments
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TodayAppointmentsList;
