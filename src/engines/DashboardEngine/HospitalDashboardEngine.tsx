import React from 'react';
import { BedDouble, Ambulance, Users, Activity, ChevronRight } from 'lucide-react';
import { MOCK_BEDS, MOCK_EMERGENCIES, MOCK_DEPARTMENTS } from './../../mocks/hospitalFlowMocks';
import { useNavigate } from 'react-router-dom';

const HospitalDashboardEngine = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Command Center</h2>
        <p className="text-slate-500 mt-1">Real-time hospital operations overview.</p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-slate-500">Total Beds Occupied</p>
              <h3 className="text-3xl font-black text-slate-800 mt-2">{MOCK_BEDS.occupied} <span className="text-lg text-slate-400 font-medium">/ {MOCK_BEDS.total}</span></h3>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <BedDouble className="w-6 h-6" />
            </div>
          </div>
          <div className="mt-4 w-full bg-slate-100 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(MOCK_BEDS.occupied / MOCK_BEDS.total) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-slate-500">Active Emergencies</p>
              <h3 className="text-3xl font-black text-rose-600 mt-2">{MOCK_EMERGENCIES.length}</h3>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 text-rose-600">
              <Ambulance className="w-6 h-6" />
            </div>
          </div>
          <button onClick={() => navigate('/hospital-emergency')} className="mt-4 text-xs font-bold text-rose-600 flex items-center hover:underline">View Queue <ChevronRight className="w-3 h-3 ml-1" /></button>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-slate-500">On-Duty Doctors</p>
              <h3 className="text-3xl font-black text-teal-600 mt-2">45</h3>
            </div>
            <div className="p-3 rounded-xl bg-teal-50 text-teal-600">
              <Users className="w-6 h-6" />
            </div>
          </div>
          <button onClick={() => navigate('/hospital-departments')} className="mt-4 text-xs font-bold text-teal-600 flex items-center hover:underline">View Departments <ChevronRight className="w-3 h-3 ml-1" /></button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-slate-500">OPD Queue</p>
              <h3 className="text-3xl font-black text-indigo-600 mt-2">128</h3>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          <button onClick={() => navigate('/patients')} className="mt-4 text-xs font-bold text-indigo-600 flex items-center hover:underline">Manage Queue <ChevronRight className="w-3 h-3 ml-1" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emergency Alert Widget */}
        <div className="bg-white rounded-2xl border border-rose-200 shadow-sm p-6 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              Emergency Alerts
            </h3>
            <button onClick={() => navigate('/hospital-emergency')} className="text-sm font-semibold text-rose-600 hover:text-rose-700">View All</button>
          </div>
          <div className="space-y-3">
            {MOCK_EMERGENCIES.slice(0, 3).map(em => (
              <div key={em.id} className="p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{em.type}</h4>
                  <p className="text-xs text-slate-600 font-medium">{em.details}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${em.severity === 'Critical' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-white'}`}>
                    {em.severity}
                  </span>
                  <p className="text-[10px] font-bold text-slate-500 mt-1">{em.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Bed Status Widget */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">Bed Availability</h3>
            <button onClick={() => navigate('/hospital-beds')} className="text-sm font-semibold text-teal-600 hover:text-teal-700">Manage Beds</button>
          </div>
          <div className="space-y-4">
            {MOCK_BEDS.breakdown.map((ward, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="font-bold text-slate-700 text-sm">{ward.type}</span>
                <div className="flex-1 mx-4 bg-slate-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${ward.available < 10 ? 'bg-rose-500' : 'bg-teal-500'}`} style={{ width: `${(ward.occupied / ward.total) * 100}%` }}></div>
                </div>
                <span className="text-xs font-black text-slate-800 w-12 text-right">{ward.available} left</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboardEngine;
