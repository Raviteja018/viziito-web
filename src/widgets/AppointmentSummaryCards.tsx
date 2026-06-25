import React from 'react';
import { Calendar, Clock, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AppointmentSummaryCards = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Today's Appointments */}
      <div 
        onClick={() => navigate('/appointments?filter=today')}
        className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-teal-200 transition-all cursor-pointer group relative overflow-hidden"
      >
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-teal-50 rounded-full blur-2xl group-hover:bg-teal-100 transition-colors pointer-events-none" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center shrink-0">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Today's Appointments</p>
              <h4 className="text-3xl font-extrabold text-slate-800 mt-1">12</h4>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
          </div>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div 
        onClick={() => navigate('/appointments?filter=upcoming')}
        className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md hover:violet-200 transition-all cursor-pointer group relative overflow-hidden"
      >
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-violet-50 rounded-full blur-2xl group-hover:bg-violet-100 transition-colors pointer-events-none" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Upcoming Appointments</p>
              <h4 className="text-3xl font-extrabold text-slate-800 mt-1">45</h4>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-violet-600 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSummaryCards;
