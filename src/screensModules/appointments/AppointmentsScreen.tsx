import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Video, Building2, User, Filter, Plus, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';

const MOCK_APPOINTMENTS = [
  { id: 'APT-1029', patient: 'Rahul Sharma', time: '09:00 AM', date: 'Today', type: 'In-Clinic', status: 'Pending', gender: 'M', age: 34 },
  { id: 'APT-1030', patient: 'Anita Desai', time: '10:30 AM', date: 'Today', type: 'Online', status: 'Completed', gender: 'F', age: 28 },
  { id: 'APT-1031', patient: 'Vikram Singh', time: '11:15 AM', date: 'Today', type: 'In-Clinic', status: 'In Progress', gender: 'M', age: 52 },
  { id: 'APT-1032', patient: 'Priya Patel', time: '02:00 PM', date: 'Today', type: 'Online', status: 'Scheduled', gender: 'F', age: 41 },
  { id: 'APT-1033', patient: 'Suresh Kumar', time: '04:30 PM', date: 'Today', type: 'In-Clinic', status: 'Scheduled', gender: 'M', age: 60 },
  { id: 'APT-1034', patient: 'Neha Gupta', time: '09:00 AM', date: 'Tomorrow', type: 'Online', status: 'Scheduled', gender: 'F', age: 31 },
];

export default function AppointmentsScreen() {
  const [filter, setFilter] = useState('All');

  const filteredApps = filter === 'All' 
    ? MOCK_APPOINTMENTS 
    : MOCK_APPOINTMENTS.filter(a => a.status === filter || a.type === filter);

  return (
    <div className="w-full animate-fade space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-teal-600" />
            Appointment Management
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage your schedule, online consultations, and clinic visits.</p>
        </div>
        <button className="w-full md:w-auto btn btn-primary flex items-center justify-center gap-2 shadow-md shadow-teal-500/20 px-5 py-2.5">
          <Plus className="w-5 h-5" /> New Appointment
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between overflow-x-auto">
          <div className="flex items-center gap-2">
            {['All', 'Scheduled', 'Pending', 'In Progress', 'Completed', 'Online', 'In-Clinic'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  filter === f 
                    ? 'bg-teal-600 text-white shadow-md' 
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button className="p-2 text-slate-400 hover:bg-slate-200 rounded-lg transition-colors ml-4 shrink-0">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100">
          {filteredApps.map((apt) => (
            <div key={apt.id} className="p-5 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shadow-sm border ${
                  apt.gender === 'M' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-pink-50 text-pink-600 border-pink-100'
                }`}>
                  {apt.patient.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">{apt.patient}</h3>
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {apt.age} yrs, {apt.gender}</span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1 text-slate-400 font-mono">{apt.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-4 sm:gap-6 mt-4 sm:mt-0 sm:ml-auto">
                <div className="text-left sm:text-right">
                  <div className="flex items-center justify-end gap-1.5 font-bold text-slate-700 text-sm">
                    <Clock className="w-4 h-4 text-slate-400" /> {apt.date}, {apt.time}
                  </div>
                  <div className="flex items-center justify-end gap-1.5 text-xs font-bold mt-1">
                    {apt.type === 'Online' ? (
                      <span className="text-teal-600 flex items-center gap-1 bg-teal-50 px-2 py-0.5 rounded-md"><Video className="w-3 h-3" /> Online Consult</span>
                    ) : (
                      <span className="text-teal-600 flex items-center gap-1 bg-teal-50 px-2 py-0.5 rounded-md"><Building2 className="w-3 h-3" /> In-Clinic</span>
                    )}
                  </div>
                </div>

                <div className="w-28 text-right hidden md:block">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    apt.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                    apt.status === 'In Progress' ? 'bg-sky-100 text-sky-700' :
                    apt.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {apt.status}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
          
          {filteredApps.length === 0 && (
            <div className="p-12 text-center text-slate-500 font-medium">
              No appointments found for the selected filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
