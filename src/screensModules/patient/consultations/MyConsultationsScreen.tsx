import React, { useState } from 'react';
import { MapPin, Video, MoreVertical, Calendar } from 'lucide-react';
import { MOCK_PATIENT_APPOINTMENTS } from '../../../mocks/patientFlowMocks';

const MyConsultationsScreen = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">My Consultations</h2>
          <p className="text-slate-500 mt-1">View and manage your doctor appointments.</p>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'upcoming' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Upcoming
        </button>
        <button 
          onClick={() => setActiveTab('past')}
          className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'past' ? 'border-teal-600 text-teal-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Past Consultations
        </button>
      </div>

      <div className="space-y-4 max-w-3xl">
        {activeTab === 'upcoming' ? (
          MOCK_PATIENT_APPOINTMENTS.map((apt) => (
            <div key={apt.id} className="flex flex-col sm:flex-row gap-4 p-5 rounded-2xl border border-slate-200 bg-white hover:border-teal-300 transition-colors shadow-sm group">
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 min-w-[100px] group-hover:bg-teal-50 group-hover:border-teal-100 transition-colors">
                <span className="text-xs font-bold text-slate-500 uppercase">{apt.date === 'Today' ? 'Today' : apt.date.split(',')[0]}</span>
                <span className="text-xl font-black text-teal-600">{apt.time.split(' ')[0]}</span>
                <span className="text-xs font-bold text-slate-500">{apt.time.split(' ')[1]}</span>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-slate-800">{apt.doctorName}</h4>
                    <p className="text-sm text-slate-500 font-medium">{apt.specialty}</p>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                    {apt.type === 'Online' ? <Video className="w-4 h-4 text-teal-600" /> : <MapPin className="w-4 h-4 text-rose-600" />}
                    {apt.type === 'Online' ? 'Video Consult' : apt.clinicName}
                  </div>
                  <div className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-wider">
                    {apt.status}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center text-slate-500">
            <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="font-semibold">No past consultations found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyConsultationsScreen;
