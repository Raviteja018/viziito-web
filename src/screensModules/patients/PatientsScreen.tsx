import React, { useState } from 'react';
import { Users, Search, Plus, Phone, Mail, FileText, Activity, MoreVertical } from 'lucide-react';

const MOCK_PATIENTS = [
  { id: 'PT-880', name: 'Emily Watson', age: 34, gender: 'Female', phone: '+91 98888 77771', email: 'emily.w@example.com', lastVisit: '12 Jun 2026', status: 'Active' },
  { id: 'PT-881', name: 'Marcus Aurelius', age: 52, gender: 'Male', phone: '+91 97777 66662', email: 'marcus.a@example.com', lastVisit: '05 Jun 2026', status: 'Active' },
  { id: 'PT-882', name: 'Diana Prince', age: 29, gender: 'Female', phone: '+91 96666 55553', email: 'diana.p@example.com', lastVisit: '28 May 2026', status: 'Active' },
  { id: 'PT-883', name: 'Bruce Wayne', age: 41, gender: 'Male', phone: '+91 95555 44444', email: 'bruce.w@example.com', lastVisit: '10 Jan 2026', status: 'Inactive' },
  { id: 'PT-884', name: 'Clark Kent', age: 35, gender: 'Male', phone: '+91 94444 33335', email: 'clark.k@example.com', lastVisit: '02 Mar 2026', status: 'Active' },
];

export default function PatientsScreen() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = MOCK_PATIENTS.filter(pt => 
    pt.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    pt.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full animate-fade space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <Users className="w-8 h-8 text-teal-600" />
            Patient Management
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage your patient roster, clinical history, and demographics.</p>
        </div>
        <button className="w-full md:w-auto btn btn-primary flex items-center justify-center gap-2 shadow-md shadow-teal-500/20 px-5 py-2.5">
          <Plus className="w-5 h-5" /> Add New Patient
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
          <div className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-3 focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-400 transition-all shadow-sm max-w-md">
            <Search className="w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Patient ID or Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none focus:outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400"
            />
          </div>
          <div className="text-xs font-bold text-slate-500 ml-auto hidden sm:block">
            Showing {filteredPatients.length} Patients
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Patient Info</th>
                <th className="p-4">Contact Details</th>
                <th className="p-4">Last Visit</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredPatients.map(pt => (
                <tr key={pt.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm border ${
                        pt.gender === 'Male' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-pink-50 text-pink-600 border-pink-100'
                      }`}>
                        {pt.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{pt.name}</p>
                        <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400 mt-0.5">
                          <span className="font-mono text-teal-500">{pt.id}</span>
                          <span>•</span>
                          <span>{pt.age}y, {pt.gender.charAt(0)}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-slate-600 font-medium text-xs">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> {pt.phone}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 font-medium text-xs">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> {pt.email}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">
                    {pt.lastVisit}
                  </td>
                  <td className="p-4 text-center">
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      pt.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {pt.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors tooltip-trigger" title="View History">
                        <Activity className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors tooltip-trigger" title="E-Prescriptions">
                        <FileText className="w-4 h-4" />
                      </button>
                      <button className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors ml-1">
                        View Profile
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500 font-medium border-b-0">
                    No patients found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
