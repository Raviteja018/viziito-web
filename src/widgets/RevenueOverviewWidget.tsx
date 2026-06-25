import React, { useState } from 'react';
import { MOCK_REVENUE } from '../mocks/doctorFlowMocks';
import { Wallet, TrendingUp, ChevronDown, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RevenueOverviewWidget = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('This Month');
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-lg overflow-hidden flex flex-col h-full relative">
      {/* Decorative patterns */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-teal-500/20 rounded-full blur-2xl pointer-events-none" />

      <div className="p-6 relative z-10 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Wallet className="w-5 h-5 text-teal-300" />
            </div>
            <h3 className="text-white font-bold text-lg">Revenue</h3>
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-1.5 transition-colors"
            >
              <span className="text-xs font-semibold text-slate-200">{filter}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {isOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-32 bg-slate-800 border border-slate-700 shadow-xl rounded-lg py-1 z-40">
                  {['Today', 'This Week', 'This Month'].map(f => (
                    <button 
                      key={f}
                      onClick={() => { setFilter(f); setIsOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-6">
            <p className="text-sm font-medium text-slate-400 mb-1">Total Revenue</p>
            <div className="flex items-end gap-3">
              <h2 className="text-4xl font-extrabold text-white tracking-tight">₹{MOCK_REVENUE.totalRevenue.toLocaleString()}</h2>
              <div className="flex items-center gap-1 mb-1.5 px-2 py-1 bg-emerald-500/20 rounded text-emerald-400 text-xs font-bold">
                <TrendingUp className="w-3 h-3" />
                {MOCK_REVENUE.trend}
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4 border border-white/5 backdrop-blur-sm">
            <p className="text-xs font-medium text-slate-400 mb-1">Net Earnings (After Comm.)</p>
            <h4 className="text-xl font-bold text-slate-100">₹{MOCK_REVENUE.netEarnings.toLocaleString()}</h4>
          </div>
        </div>
      </div>

      <button 
        onClick={() => navigate('/revenue')}
        className="relative z-10 w-full bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold py-4 px-6 flex items-center justify-between transition-colors group"
      >
        View Full Revenue Report
        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default RevenueOverviewWidget;
