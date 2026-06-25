import React, { useState } from 'react';
import { Search, Star, CalendarPlus } from 'lucide-react';
import { MOCK_AVAILABLE_DOCTORS } from '../../../mocks/patientFlowMocks';

const BookConsultationScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDoctors = MOCK_AVAILABLE_DOCTORS.filter(doc => 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Find Doctors & Clinics</h2>
          <p className="text-slate-500 mt-1">Book an in-clinic or online video consultation.</p>
        </div>
      </div>

      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by doctor name, specialty, or clinic..." 
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map(doc => (
          <div key={doc.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col hover:border-teal-300 transition-colors group">
            <div className="flex items-start gap-4">
              <img src={doc.imageUrl} alt={doc.name} className="w-16 h-16 rounded-xl object-cover border border-slate-100" />
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 group-hover:text-teal-700 transition-colors">{doc.name}</h3>
                <p className="text-sm font-medium text-slate-500">{doc.specialty}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-bold text-slate-700">{doc.rating}</span>
                  <span className="text-xs text-slate-400">({doc.reviews} reviews)</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Consultation Fee</p>
                <p className="font-bold text-slate-800">₹{doc.fee}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-teal-600 font-bold">{doc.availability}</p>
              </div>
            </div>

            <button className="w-full mt-4 flex items-center justify-center gap-2 bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-700 border border-slate-200 hover:border-teal-200 px-4 py-2.5 rounded-xl font-semibold transition-all">
              <CalendarPlus className="w-4 h-4" />
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookConsultationScreen;
