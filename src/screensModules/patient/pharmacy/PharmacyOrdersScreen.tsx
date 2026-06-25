import React from 'react';
import { Pill, UploadCloud, Truck, ChevronRight } from 'lucide-react';
import { MOCK_PHARMACY_ORDERS } from '../../../mocks/patientFlowMocks';

const PharmacyOrdersScreen = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Pharmacy Orders</h2>
          <p className="text-slate-500 mt-1">Track your medicine deliveries and upload prescriptions.</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm shadow-indigo-600/20 transition-all active:scale-95">
          <UploadCloud className="w-5 h-5" />
          Upload Prescription
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MOCK_PHARMACY_ORDERS.map(order => (
          <div key={order.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-indigo-300 transition-colors group">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 group-hover:scale-105 transition-transform">
                  <Pill className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{order.pharmacyName}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Order #{order.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-400 mb-1">{order.date}</p>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  order.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                  {item}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <p className="font-black text-slate-800">₹{order.totalCost}</p>
              <button className="flex items-center gap-1 text-indigo-600 text-sm font-bold hover:text-indigo-700 transition-colors">
                <Truck className="w-4 h-4" />
                Track Order
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PharmacyOrdersScreen;
