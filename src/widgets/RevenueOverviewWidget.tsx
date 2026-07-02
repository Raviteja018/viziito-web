import React, { useState } from 'react';
import { MOCK_REVENUE } from '../mocks/doctorFlowMocks';
import { TrendingUp, Users, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RevenueOverviewWidget = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('This Month');
  const [isOpen, setIsOpen] = useState(false);

  // Build SVG line chart from chartData
  const data = MOCK_REVENUE.chartData;
  const maxVal = Math.max(...data.map(d => d.value));
  const minVal = 0;
  const W = 240;
  const H = 80;
  const pad = { top: 8, bottom: 8, left: 0, right: 0 };

  const points = data.map((d, i) => {
    const x = pad.left + (i / (data.length - 1)) * (W - pad.left - pad.right);
    const y = pad.top + (1 - (d.value - minVal) / (maxVal - minVal)) * (H - pad.top - pad.bottom);
    return { x, y, ...d };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${H} L ${points[0].x} ${H} Z`;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-800">Revenue Overview</h3>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 hover:bg-slate-100 transition-colors"
          >
            {filter}
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
          {isOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
              <div className="absolute right-0 top-full mt-1 w-28 bg-white border border-slate-200 shadow-lg rounded-xl py-1 z-40">
                {['Today', 'This Week', 'This Month'].map(f => (
                  <button
                    key={f}
                    onClick={() => { setFilter(f); setIsOpen(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-teal-50 hover:text-teal-700"
                  >
                    {f}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="px-5 pt-4 flex-1 flex flex-col">
        {/* Revenue Amount */}
        <div className="mb-1">
          <p className="text-xs text-slate-500 font-medium">Total Revenue</p>
          <div className="flex items-end gap-2 mt-1">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              ₹{MOCK_REVENUE.totalRevenue.toLocaleString('en-IN')}
            </h2>
            <div className="flex items-center gap-1 mb-1 text-emerald-600 text-[11px] font-bold">
              <TrendingUp className="w-3 h-3" />
              <span>{MOCK_REVENUE.trend} vs last month</span>
            </div>
          </div>
        </div>

        {/* SVG Line Chart */}
        <div className="flex-1 flex flex-col justify-center">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 80 }} preserveAspectRatio="none">
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0d9488" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#0d9488" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* Area fill */}
            <path d={areaD} fill="url(#revenueGradient)" />
            {/* Line */}
            <path d={pathD} fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Last point dot */}
            <circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="3.5" fill="#0d9488" />
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between mt-1 mb-3">
            {data.map(d => (
              <span key={d.label} className="text-[9px] text-slate-400 font-medium">{d.label}</span>
            ))}
          </div>
        </div>

        {/* Bottom Stats */}
        <div className="flex items-center gap-3 pb-4">
          <div className="flex items-center gap-2 bg-teal-50 rounded-xl px-3 py-2 flex-1">
            <div className="w-6 h-6 bg-teal-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium">Net Earnings</p>
              <p className="text-sm font-extrabold text-slate-800">₹{MOCK_REVENUE.netEarnings.toLocaleString('en-IN')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2 flex-1">
            <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium">Consultations</p>
              <p className="text-sm font-extrabold text-slate-800">{MOCK_REVENUE.consultations}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Button */}
      <button
        onClick={() => navigate('/revenue')}
        className="w-full border-t border-slate-100 py-3 text-sm font-semibold text-teal-600 hover:bg-teal-50 transition-colors"
      >
        View Revenue Details
      </button>
    </div>
  );
};

export default RevenueOverviewWidget;
