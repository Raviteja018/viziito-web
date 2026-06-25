import React, { useState } from 'react';
import { FileText, Search, Plus, Download, Printer, Share2, Clock } from 'lucide-react';

const MOCK_PRESCRIPTIONS = [
  { id: 'RX-8821', patient: 'Rahul Sharma', date: 'Today, 10:45 AM', diagnosis: 'Viral Pharyngitis', medicines: 3, status: 'Active' },
  { id: 'RX-8820', patient: 'Anita Desai', date: 'Yesterday', diagnosis: 'Migraine', medicines: 2, status: 'Active' },
  { id: 'RX-8819', patient: 'Vikram Singh', date: '20 Jun 2026', diagnosis: 'Type 2 Diabetes', medicines: 4, status: 'Chronic' },
  { id: 'RX-8818', patient: 'Priya Patel', date: '18 Jun 2026', diagnosis: 'Seasonal Allergies', medicines: 1, status: 'Completed' },
];

export default function PrescriptionsScreen() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRx = MOCK_PRESCRIPTIONS.filter(rx => 
    rx.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
    rx.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full animate-fade space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <FileText className="w-8 h-8 text-teal-600" />
            Digital Prescriptions
          </h1>
          <p className="text-slate-500 font-medium mt-1">Write, sign, and manage electronic prescriptions securely.</p>
        </div>
        <button className="w-full md:w-auto btn btn-primary flex items-center justify-center gap-2 shadow-md shadow-teal-500/20 px-5 py-2.5">
          <Plus className="w-5 h-5" /> Write New e-Rx
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden flex flex-col">
        {/* Search Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
          <div className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-3 focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-400 transition-all shadow-sm">
            <Search className="w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by patient name or diagnosis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-none focus:outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100">
          {filteredRx.map((rx) => (
            <div key={rx.id} className="p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group">
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-bold text-slate-800 text-base">{rx.patient}</h3>
                  <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    rx.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                    rx.status === 'Chronic' ? 'bg-teal-100 text-teal-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {rx.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-semibold text-slate-500 mt-2">
                  <span className="font-mono text-slate-400">{rx.id}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {rx.date}</span>
                  <span className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> {rx.diagnosis}</span>
                  <span>• {rx.medicines} Medicines</span>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity mt-4 md:mt-0">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors tooltip-trigger" title="Download PDF">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors tooltip-trigger" title="Print">
                    <Printer className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-colors tooltip-trigger" title="Share with Patient">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
                <button className="flex-1 md:flex-none px-4 py-2 bg-slate-900 text-white font-bold rounded-xl text-sm hover:bg-slate-800 transition-colors ml-2 shadow-sm text-center">
                  View / Edit
                </button>
              </div>

            </div>
          ))}

          {filteredRx.length === 0 && (
            <div className="p-12 text-center text-slate-500 font-medium">
              No prescriptions found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
