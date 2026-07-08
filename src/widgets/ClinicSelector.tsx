import React, { useState } from 'react';
import { Building2, ChevronDown, Check } from 'lucide-react';
import { MOCK_CLINICS } from '../mocks/doctorFlowMocks';

const ClinicSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<string | null>(null);

  const selectedName = selectedClinic 
    ? MOCK_CLINICS.find(c => c.id === selectedClinic)?.name 
    : 'All Clinics';

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white border border-slate-200/60 shadow-sm hover:border-teal-300 hover:ring-2 hover:ring-teal-100 transition-all rounded-xl px-4 py-2.5"
      >
        <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
          <Building2 className="w-4 h-4 text-teal-600" />
        </div>
        <div className="text-left">
          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Clinic</span>
          <span className="block text-sm font-bold text-slate-700 leading-none">{selectedName}</span>
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 ml-2 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-64 bg-white border border-slate-200 shadow-xl shadow-slate-200/50 rounded-xl p-2 z-40 animate-in fade-in slide-in-from-top-2 duration-200">
            <button
              onClick={() => { setSelectedClinic(null); setIsOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                selectedClinic === null ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              All Clinics
              {selectedClinic === null && <Check className="w-4 h-4 text-teal-600" />}
            </button>
            
            <div className="h-px bg-slate-100 my-1" />
            
            {MOCK_CLINICS.map(clinic => (
              <button
                key={clinic.id}
                onClick={() => { setSelectedClinic(clinic.id); setIsOpen(false); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedClinic === clinic.id ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex flex-col items-start">
                  <span>{clinic.name}</span>
                  <span className="text-[10px] text-slate-400 font-normal">{clinic.type}</span>
                </div>
                {selectedClinic === clinic.id && <Check className="w-4 h-4 text-teal-600" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ClinicSelector;
