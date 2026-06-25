import React from 'react';
import { UserPlus, MoreVertical, Activity } from 'lucide-react';
import { MOCK_FAMILY_MEMBERS } from '../../../mocks/patientFlowMocks';

const FamilyProfilesScreen = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Family Profiles</h2>
          <p className="text-slate-500 mt-1">Manage health records and appointments for your dependents.</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm transition-all active:scale-95">
          <UserPlus className="w-5 h-5" />
          Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_FAMILY_MEMBERS.map(member => (
          <div key={member.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center group hover:border-slate-300 transition-colors relative">
            <button className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
            
            <img 
              src={member.imageUrl} 
              alt={member.name} 
              className="w-20 h-20 rounded-full object-cover border-4 border-slate-50 mb-3 shadow-sm group-hover:scale-105 transition-transform" 
            />
            
            <h3 className="font-bold text-lg text-slate-800">{member.name}</h3>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold mt-1">
              {member.relationship}
            </span>

            <div className="w-full grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-slate-100">
              <div className="text-center">
                <p className="text-xs font-medium text-slate-400 mb-1">Age</p>
                <p className="font-bold text-slate-700">{member.age} yrs</p>
              </div>
              <div className="text-center">
                <p className="text-xs font-medium text-slate-400 mb-1">Blood Group</p>
                <p className="font-bold text-rose-600 flex items-center justify-center gap-1">
                  <Activity className="w-3.5 h-3.5" />
                  {member.bloodGroup}
                </p>
              </div>
            </div>

            <button className="w-full mt-6 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors">
              View Records
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FamilyProfilesScreen;
