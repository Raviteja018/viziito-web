import React, { useState } from 'react';
import {
  Download,
  Settings2,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  Percent,
  Wallet,
  CalendarCheck,
  TrendingUp,
  CheckCircle2,
  RotateCcw,
  XCircle,
  Eye,
  MoreVertical,
  Building2,
  HelpCircle,
  ArrowRight,
  AlertCircle,
  Info,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = 'Overview' | 'Transactions' | 'Settlements' | 'Payout History';
type TxnStatus = 'Completed' | 'Failed' | 'Refunded';
type SettlementStatus = 'Completed' | 'Pending';

// ─── Mock data ────────────────────────────────────────────────────────────────
const TRANSACTIONS = [
  { date: '28 May 2025', time: '11:30 AM', id: 'TXN-2025-001258', patient: 'Amit Sharma',  apptId: 'APT-2025-0001', type: 'Consultation Fee', method: 'UPI',       methodDetail: 'am****@upi',    amount: 800,  platform: 80,  earnings: 720,  status: 'Completed' as TxnStatus, invoice: 'INV-2568' },
  { date: '28 May 2025', time: '10:15 AM', id: 'TXN-2025-001255', patient: 'Priya Singh',   apptId: 'APT-2025-0002', type: 'Consultation Fee', method: 'Razorpay',  methodDetail: 'Card *** 4242', amount: 600,  platform: 60,  earnings: 540,  status: 'Completed' as TxnStatus, invoice: 'INV-2567' },
  { date: '27 May 2025', time: '04:15 PM', id: 'TXN-2025-001254', patient: 'Ramesh Kumar',  apptId: 'APT-2025-0003', type: 'Follow-up Fee',    method: 'Wallet',    methodDetail: 'VIZITO Wallet', amount: 400,  platform: 40,  earnings: 360,  status: 'Completed' as TxnStatus, invoice: 'INV-2566' },
  { date: '27 May 2025', time: '02:40 PM', id: 'TXN-2025-001253', patient: 'Neha Devi',     apptId: 'APT-2025-0004', type: 'Consultation Fee', method: 'Paytm',     methodDetail: '98XXXX7821',    amount: 800,  platform: 80,  earnings: 720,  status: 'Completed' as TxnStatus, invoice: 'INV-2565' },
  { date: '26 May 2025', time: '11:05 AM', id: 'TXN-2025-001252', patient: 'Vikram Singh',  apptId: 'APT-2025-0005', type: 'Consultation Fee', method: 'PhonePe',   methodDetail: '38XXXX1122',    amount: 600,  platform: 60,  earnings: 540,  status: 'Completed' as TxnStatus, invoice: 'INV-2564' },
  { date: '26 May 2025', time: '09:20 AM', id: 'TXN-2025-001251', patient: 'Anjali Patel',  apptId: 'APT-2025-0006', type: 'Lab Test Fee',     method: 'Card',      methodDetail: '**** 5678',     amount: 1200, platform: 120, earnings: 1080, status: 'Completed' as TxnStatus, invoice: 'INV-2563' },
  { date: '25 May 2025', time: '06:30 PM', id: 'TXN-2025-001250', patient: 'Mohit Jain',    apptId: 'APT-2025-0007', type: 'Consultation Fee', method: 'UPI',       methodDetail: 'mo****@okicici', amount: 800,  platform: 80,  earnings: 720,  status: 'Failed'    as TxnStatus, invoice: 'INV-2562' },
  { date: '25 May 2025', time: '03:10 PM', id: 'TXN-2025-001249', patient: 'Sneha Sharma',  apptId: 'APT-2025-0008', type: 'Consultation Fee', method: 'Refund',    methodDetail: 'To Bank **** 5678', amount: 800, platform: 0, earnings: -800, status: 'Refunded' as TxnStatus, invoice: 'INV-2561' },
];

const SETTLEMENTS = [
  { id: 'SET-2025-0012', date: '28 May 2025', period: '01 May – 27 May 2025', method: 'Bank Transfer', account: '**** **** 5678', amount: 187420, tds: -3748.40, net: 183671.60, status: 'Completed' as SettlementStatus },
  { id: 'SET-2025-0011', date: '21 May 2025', period: '24 Apr – 20 May 2025', method: 'Bank Transfer', account: '**** **** 5678', amount: 165230, tds: -3304.60, net: 161925.40, status: 'Completed' as SettlementStatus },
  { id: 'SET-2025-0010', date: '14 May 2025', period: '17 Apr – 13 May 2025', method: 'Bank Transfer', account: '**** **** 5678', amount: 152800, tds: -3056.00, net: 149744.00, status: 'Completed' as SettlementStatus },
  { id: 'SET-2025-0009', date: '07 May 2025', period: '10 Apr – 06 May 2025', method: 'Bank Transfer', account: '**** **** 5678', amount: 148500, tds: -2970.00, net: 145530.00, status: 'Completed' as SettlementStatus },
  { id: 'SET-2025-0008', date: '30 Apr 2025', period: '03 Apr – 29 Apr 2025', method: 'Bank Transfer', account: '**** **** 5678', amount: 138200, tds: -2764.00, net: 135436.00, status: 'Completed' as SettlementStatus },
  { id: 'SET-2025-0013', date: '—',           period: '28 May – 31 May 2025', method: 'Bank Transfer', account: '**** **** 5678', amount: 36365, tds: -727.30,  net: 35637.70, status: 'Pending'   as SettlementStatus },
];

const PAYOUTS = [
  { id: 'PAYOUT-2025-0012', date: '28 May 2025', period: '01 May – 27 May 2025', method: 'Bank Transfer', to: '**** **** 5678\nHDFC Bank', gross: 187423, deductions: -3748.40, net: 183671.60, status: 'Completed' as SettlementStatus },
  { id: 'PAYOUT-2025-0011', date: '21 May 2025', period: '24 Apr – 20 May 2025', method: 'Bank Transfer', to: '**** **** 5678\nHDFC Bank', gross: 165230, deductions: -3304.60, net: 161925.40, status: 'Completed' as SettlementStatus },
  { id: 'PAYOUT-2025-0010', date: '14 May 2025', period: '17 Apr – 13 May 2025', method: 'Bank Transfer', to: '**** **** 5678\nHDFC Bank', gross: 152800, deductions: -3056.00, net: 149744.00, status: 'Completed' as SettlementStatus },
  { id: 'PAYOUT-2025-0009', date: '07 May 2025', period: '10 Apr – 06 May 2025', method: 'Bank Transfer', to: '**** **** 5678\nHDFC Bank', gross: 148500, deductions: -2970.00, net: 145530.00, status: 'Completed' as SettlementStatus },
  { id: 'PAYOUT-2025-0008', date: '30 Apr 2025', period: '03 Apr – 29 Apr 2025', method: 'Bank Transfer', to: '**** **** 5678\nHDFC Bank', gross: 138200, deductions: -2764.00, net: 135436.00, status: 'Completed' as SettlementStatus },
  { id: 'PAYOUT-2025-0007', date: '23 Apr 2025', period: '27 Mar – 02 Apr 2025', method: 'Bank Transfer', to: '**** **** 5678\nHDFC Bank', gross: 122650, deductions: -2453.00, net: 120197.00, status: 'Completed' as SettlementStatus },
  { id: 'PAYOUT-2025-0006', date: '16 Apr 2025', period: '20 Mar – 26 Mar 2025', method: 'Bank Transfer', to: '**** **** 5678\nHDFC Bank', gross: 118900, deductions: -2378.00, net: 116522.00, status: 'Completed' as SettlementStatus },
  { id: 'PAYOUT-2025-0005', date: '09 Apr 2025', period: '13 Mar – 19 Mar 2025', method: 'Bank Transfer', to: '**** **** 5678\nHDFC Bank', gross: 105600, deductions: -2112.00, net: 103488.00, status: 'Completed' as SettlementStatus },
  { id: 'PAYOUT-2025-0004', date: '02 Apr 2025', period: '06 Mar – 12 Mar 2025', method: 'Bank Transfer', to: '**** **** 5678\nHDFC Bank', gross: 98750,  deductions: -1985.00, net: 96765.00,  status: 'Completed' as SettlementStatus },
];

const CHART_DATA = [
  { label: '01 May', revenue: 38000, earnings: 21000 },
  { label: '05 May', revenue: 52000, earnings: 30000 },
  { label: '09 May', revenue: 45000, earnings: 26000 },
  { label: '13 May', revenue: 68000, earnings: 42000 },
  { label: '17 May', revenue: 58000, earnings: 36000 },
  { label: '21 May', revenue: 85000, earnings: 54000 },
  { label: '25 May', revenue: 95000, earnings: 62000 },
  { label: '31 May', revenue: 88000, earnings: 58000 },
];

const TOP_EARNING_DAYS = [
  { date: '28 May 2025', amount: '₹18,650' },
  { date: '24 May 2025', amount: '₹16,480' },
  { date: '17 May 2025', amount: '₹15,230' },
  { date: '11 May 2025', amount: '₹14,100' },
  { date: '05 May 2025', amount: '₹12,850' },
];

const REVENUE_BREAKUP = [
  { label: 'Consultation Fees', amount: '₹2,00,000', pct: '80.4%', color: '#0d9488' },
  { label: 'In-Clinic Appointments', amount: '₹35,000', pct: '14.1%', color: '#0ea5e9' },
  { label: 'Follow-up Consultations', amount: '₹10,000', pct: '4.0%', color: '#8b5cf6' },
  { label: 'Other Services', amount: '₹3,650', pct: '1.5%', color: '#f59e0b' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n: number) => `₹${Math.abs(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: TxnStatus | SettlementStatus }) {
  const styles: Record<string, string> = {
    Completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    Success:   'bg-emerald-50 text-emerald-700 border border-emerald-200',
    Failed:    'bg-rose-50   text-rose-700   border border-rose-200',
    Refunded:  'bg-amber-50  text-amber-700  border border-amber-200',
    Pending:   'bg-amber-50  text-amber-700  border border-amber-200',
  };
  return <span className={`inline-flex text-[11px] font-bold px-2.5 py-0.5 rounded-full ${styles[status] ?? styles.Pending}`}>{status}</span>;
}

function TypeBadge({ label }: { label: string }) {
  const color =
    label.includes('Follow') ? 'bg-violet-50 text-violet-700' :
    label.includes('Lab')    ? 'bg-sky-50 text-sky-700' :
    'bg-teal-50 text-teal-700';
  return <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-md ${color}`}>{label}</span>;
}

function StatCard({ icon: Icon, iconBg, iconColor, label, value, sub, subColor = 'text-emerald-600', compact }: {
  icon: React.ElementType; iconBg: string; iconColor: string;
  label: string; value: string; sub: string; subColor?: string; compact?: boolean;
}) {
  if (compact) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>
            <Icon className={`w-3.5 h-3.5 ${iconColor}`} />
          </div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide leading-none">{label}</p>
        </div>
        <p className="text-base font-extrabold text-slate-800 leading-tight">{value}</p>
        <p className={`text-[11px] font-semibold mt-1 ${subColor}`}>{sub}</p>
      </div>
    );
  }
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-start gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide leading-none mb-1">{label}</p>
        <p className="text-xl font-extrabold text-slate-800 leading-tight">{value}</p>
        <p className={`text-[11px] font-semibold mt-0.5 ${subColor}`}>{sub}</p>
      </div>
    </div>
  );
}

function Pagination({ current, total, pages }: { current: number; total: number; pages: number }) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/60">
      <p className="text-xs text-slate-500 font-medium">Showing 1 to {current} of {total} {pages > 1 ? 'transactions' : 'settlements'}</p>
      <div className="flex items-center gap-2">
        <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 transition-all"><ChevronLeft className="w-4 h-4" /></button>
        {[1,2,3].map(p => (
          <button key={p} className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${p === 1 ? 'bg-teal-600 text-white shadow-sm' : 'border border-slate-200 text-slate-600 hover:border-slate-300'}`}>{p}</button>
        ))}
        <span className="text-slate-400 text-sm">…</span>
        <button className="w-8 h-8 rounded-lg text-xs font-bold border border-slate-200 text-slate-600 hover:border-slate-300 transition-all">{pages}</button>
        <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 transition-all"><ChevronRight className="w-4 h-4" /></button>
        <select className="ml-2 appearance-none bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-600 focus:outline-none">
          <option>10 / page</option><option>25 / page</option>
        </select>
      </div>
    </div>
  );
}

// ─── Toolbar (shared) ─────────────────────────────────────────────────────────
function Toolbar({ searchPlaceholder, extraFilters, hideBuiltins }: {
  searchPlaceholder: string;
  extraFilters?: React.ReactNode;
  hideBuiltins?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <div className="flex-1 min-w-[200px] bg-white border border-slate-200 rounded-xl px-3 py-2.5 flex items-center gap-2 focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-400 transition-all shadow-sm">
        <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input type="text" placeholder={searchPlaceholder} className="w-full bg-transparent border-none focus:outline-none text-sm text-slate-700 placeholder:text-slate-400" />
      </div>
      {extraFilters}
      {!hideBuiltins && (
        <>
          <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-600 font-medium hover:border-slate-300 transition-all shadow-sm whitespace-nowrap">
            <Calendar className="w-4 h-4 text-slate-400" />01 May 2025 – 31 May 2025
          </button>
          <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-600 font-medium hover:border-slate-300 transition-all shadow-sm">
            <Filter className="w-4 h-4 text-slate-400" />Filters
          </button>
        </>
      )}
    </div>
  );
}

// ─── Line Chart (SVG-based, no deps) ─────────────────────────────────────────
function RevenueChart() {
  const W = 680, H = 200, PAD = { t: 10, r: 20, b: 30, l: 55 };
  const maxY = 100000;
  const innerW = W - PAD.l - PAD.r;
  const innerH = H - PAD.t - PAD.b;
  const xStep = innerW / (CHART_DATA.length - 1);

  const toX = (i: number) => PAD.l + i * xStep;
  const toY = (v: number) => PAD.t + innerH - (v / maxY) * innerH;

  const rPts  = CHART_DATA.map((d, i) => `${toX(i)},${toY(d.revenue)}`).join(' ');
  const ePts  = CHART_DATA.map((d, i) => `${toX(i)},${toY(d.earnings)}`).join(' ');

  const rArea = `M${PAD.l},${PAD.t + innerH} ` + CHART_DATA.map((d, i) => `L${toX(i)},${toY(d.revenue)}`).join(' ') + ` L${W - PAD.r},${PAD.t + innerH} Z`;
  const eArea = `M${PAD.l},${PAD.t + innerH} ` + CHART_DATA.map((d, i) => `L${toX(i)},${toY(d.earnings)}`).join(' ') + ` L${W - PAD.r},${PAD.t + innerH} Z`;

  const yTicks = [0, 20000, 40000, 60000, 80000, 100000];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d9488" stopOpacity="0.15"/>
          <stop offset="100%" stopColor="#0d9488" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="eGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.12"/>
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0"/>
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTicks.map(v => (
        <g key={v}>
          <line x1={PAD.l} y1={toY(v)} x2={W - PAD.r} y2={toY(v)} stroke="#f1f5f9" strokeWidth="1"/>
          <text x={PAD.l - 6} y={toY(v) + 4} textAnchor="end" fontSize="9" fill="#94a3b8" fontFamily="sans-serif">
            {v === 0 ? '₹0' : `₹${v/1000}K`}
          </text>
        </g>
      ))}

      {/* X labels */}
      {CHART_DATA.map((d, i) => (
        <text key={i} x={toX(i)} y={H - 4} textAnchor="middle" fontSize="9" fill="#94a3b8" fontFamily="sans-serif">{d.label}</text>
      ))}

      {/* Area fills */}
      <path d={rArea} fill="url(#rGrad)"/>
      <path d={eArea} fill="url(#eGrad)"/>

      {/* Lines */}
      <polyline points={rPts} fill="none" stroke="#0d9488" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
      <polyline points={ePts} fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>

      {/* Dots */}
      {CHART_DATA.map((d, i) => (
        <g key={i}>
          <circle cx={toX(i)} cy={toY(d.revenue)} r="3" fill="white" stroke="#0d9488" strokeWidth="1.5"/>
          <circle cx={toX(i)} cy={toY(d.earnings)} r="3" fill="white" stroke="#0ea5e9" strokeWidth="1.5"/>
        </g>
      ))}
    </svg>
  );
}

// ─── Tab Views ────────────────────────────────────────────────────────────────

function OverviewTab({ transactions }: { transactions: any[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Left */}
      <div className="lg:col-span-8 space-y-5">
        {/* Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={IndianRupee} iconBg="bg-teal-50"   iconColor="text-teal-600"   label="Total Revenue"       value="₹2,48,650" sub="↑ 18.6% from Apr 2025" />
          <StatCard icon={Percent}     iconBg="bg-rose-50"   iconColor="text-rose-500"   label="Platform Fee"        value="₹24,865"   sub="10% of total revenue"   subColor="text-slate-500" />
          <StatCard icon={Wallet}      iconBg="bg-sky-50"    iconColor="text-sky-600"    label="Your Earnings"       value="₹2,23,785" sub="↑ 18.6% from Apr 2025" />
          <StatCard icon={CalendarCheck} iconBg="bg-violet-50" iconColor="text-violet-600" label="Total Appointments" value="156"       sub="↑ 12.4% from Apr 2025" />
        </div>

        {/* Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Revenue Overview</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-teal-600 inline-block rounded" />Revenue</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-sky-500 inline-block rounded" />Earnings</span>
              </div>
              <select className="appearance-none bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 focus:outline-none cursor-pointer">
                <option>Daily</option><option>Weekly</option><option>Monthly</option>
              </select>
            </div>
          </div>
          <RevenueChart />
        </div>

        {/* Recent Transactions */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Recent Transactions</h3>
            <button className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors">View All Transactions →</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {['Date & Time','Transaction ID','Patient','Type','Appointment Type','Amount','Platform Fee','Your Earnings','Status'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.slice(0, 5).map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <p className="text-xs font-semibold text-slate-700">{t.date}</p>
                      <p className="text-[11px] text-slate-400">{t.time}</p>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono font-semibold text-slate-600 whitespace-nowrap">{t.id}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-slate-700 whitespace-nowrap">{t.patient}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><TypeBadge label={t.type} /></td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{t.apptId.includes('0001') ? 'In-Clinic' : t.apptId.includes('0003') ? 'Follow-up' : 'Video Consultation'}</td>
                    <td className="px-4 py-3 text-xs font-semibold text-slate-700 whitespace-nowrap">₹{t.amount.toFixed(2)}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">₹{t.platform.toFixed(2)}</td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-800 whitespace-nowrap">₹{t.earnings.toFixed(2)}</td>
                    <td className="px-4 py-3 whitespace-nowrap"><StatusBadge status={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination current={5} total={25} pages={3} />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-5">
        {/* Settlement Summary */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Settlement Summary</h3>
            <button className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors">View All</button>
          </div>
          <div className="space-y-3 text-sm">
            {[
              { label: 'Total Payouts',    value: '₹1,87,420.00', bold: true },
              { label: 'Pending Payout',   value: '₹36,365.00',   color: 'text-amber-600 font-bold' },
              { label: 'Next Payout Date', value: '03 Jun 2025',   icon: Calendar },
              { label: 'Payout Method',    value: 'Bank Transfer' },
              { label: 'Account Number',   value: '**** **** 5678' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                <span className="text-xs text-slate-500">{item.label}</span>
                <span className={`text-xs font-semibold text-slate-800 ${item.color ?? ''}`}>{item.value}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full flex items-center justify-center gap-2 bg-white hover:bg-teal-50 text-teal-700 border border-teal-200 py-2.5 rounded-xl text-sm font-bold transition-all">
            View Payout History
          </button>
        </div>

        {/* Revenue Breakup */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Revenue Breakup</h3>
            <span className="text-[11px] text-slate-400 font-medium">This Month</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Mini donut */}
            <div className="relative w-24 h-24 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Segments: 80.4%, 14.1%, 4%, 1.5% */}
                {(() => {
                  const segs = [
                    { pct: 80.4, color: '#0d9488' },
                    { pct: 14.1, color: '#0ea5e9' },
                    { pct: 4.0,  color: '#8b5cf6' },
                    { pct: 1.5,  color: '#f59e0b' },
                  ];
                  let offset = 0;
                  return segs.map((s, i) => {
                    const el = (
                      <circle
                        key={i}
                        cx="50" cy="50" r="35"
                        fill="none"
                        stroke={s.color}
                        strokeWidth="12"
                        strokeDasharray={`${s.pct * 2.199} ${220 - s.pct * 2.199}`}
                        strokeDashoffset={-offset * 2.199}
                      />
                    );
                    offset += s.pct;
                    return el;
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[10px] font-bold text-slate-700 leading-none">₹2,48,650</span>
                <span className="text-[9px] text-slate-400">Total</span>
              </div>
            </div>
            {/* Legend */}
            <div className="flex-1 space-y-2">
              {REVENUE_BREAKUP.map(b => (
                <div key={b.label} className="flex items-start gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0 mt-0.5" style={{ background: b.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-slate-600 leading-tight">{b.label}</p>
                    <p className="text-[10px] font-bold text-slate-700">{b.amount} ({b.pct})</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Earning Days */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800">Top Earning Days</h3>
            <span className="text-[11px] text-slate-400 font-medium">This Month</span>
          </div>
          <div className="space-y-2.5">
            {TOP_EARNING_DAYS.map(d => (
              <div key={d.date} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">{d.date}</span>
                </div>
                <span className="text-xs font-bold text-slate-800">{d.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TransactionsTab({ 
  transactions, 
  onViewTxn, 
  onDownloadInvoice 
}: { 
  transactions: any[]; 
  onViewTxn: (t: any) => void; 
  onDownloadInvoice: (id: string) => void;
}) {

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      <div className="lg:col-span-12 space-y-4">
        <Toolbar
          searchPlaceholder="Search by Patient / Transaction ID / Appointment ID..."
          extraFilters={
            <>
              <div className="relative">
                <select className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2.5 text-sm text-slate-600 font-medium focus:outline-none shadow-sm cursor-pointer">
                  <option>All Payment Methods</option><option>UPI</option><option>Card</option><option>Wallet</option>
                </select>
                <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2.5 text-sm text-slate-600 font-medium focus:outline-none shadow-sm cursor-pointer">
                  <option>All Status</option><option>Completed</option><option>Failed</option><option>Refunded</option>
                </select>
                <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
            </>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={IndianRupee}   iconBg="bg-teal-50"   iconColor="text-teal-600"   label="Total Transactions" value="1,248"       sub="↑ 14.6% from Apr 2025" />
          <StatCard icon={Percent}       iconBg="bg-sky-50"    iconColor="text-sky-600"    label="Total Amount"       value="₹2,48,650"  sub="↑ 18.6% from Apr 2025" />
          <StatCard icon={CheckCircle2}  iconBg="bg-emerald-50" iconColor="text-emerald-600" label="Successful"        value="1,132"       sub="90.7% Success Rate" subColor="text-slate-500" />
          <div className="grid grid-cols-2 gap-3 col-span-2 sm:col-span-1" style={{display:'contents'}}>
            <StatCard icon={RotateCcw}   iconBg="bg-amber-50"  iconColor="text-amber-600"  label="Refunded"           value="28"          sub="₹6,450 Refunded"     subColor="text-slate-500" />
            <StatCard icon={XCircle}     iconBg="bg-rose-50"   iconColor="text-rose-500"   label="Failed"             value="88"          sub="₹12,350 Failed"      subColor="text-rose-600"  />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Date & Time','Transaction ID','Patient','Appointment ID','Type','Payment Method','Amount','Status','Invoice','Actions'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <p className="text-xs font-semibold text-slate-700">{t.date}</p>
                      <p className="text-[11px] text-slate-400">{t.time}</p>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-mono font-semibold text-slate-600 whitespace-nowrap">{t.id}</td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-slate-700 whitespace-nowrap">{t.patient}</td>
                    <td className="px-4 py-3.5 text-xs font-mono text-slate-500 whitespace-nowrap">{t.apptId}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap"><TypeBadge label={t.type} /></td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <p className="text-xs font-semibold text-slate-700">{t.method}</p>
                      <p className="text-[11px] text-slate-400">{t.methodDetail}</p>
                    </td>
                    <td className="px-4 py-3.5 text-xs font-bold text-slate-800 whitespace-nowrap">₹{t.amount.toFixed(2)}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap"><StatusBadge status={t.status} /></td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-teal-600 whitespace-nowrap">{t.invoice}</td>
                    <td className="px-4 py-3.5 relative" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => onViewTxn(t)}
                          className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => onDownloadInvoice(t.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Download Invoice"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination current={8} total={1248} pages={125} />
        </div>
      </div>
    </div>
  );
}

function SettlementsTab({ 
  settlements, 
  onViewSettlement,
  onRequestSettlement 
}: { 
  settlements: any[]; 
  onViewSettlement: (s: any) => void;
  onRequestSettlement: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Left */}
      <div className="lg:col-span-8 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={IndianRupee}  iconBg="bg-teal-50"   iconColor="text-teal-600"   label="Total Payouts"         value="₹1,87,420" sub="↑ 12.8% from Apr 2025" />
          <StatCard icon={RotateCcw}    iconBg="bg-amber-50"  iconColor="text-amber-600"  label="Pending Payout"         value="₹36,365"   sub="Will be paid on 03 Jun 2025" subColor="text-slate-500" />
          <StatCard icon={CheckCircle2} iconBg="bg-emerald-50" iconColor="text-emerald-600" label="Settlements Completed" value="12"        sub="This Month" subColor="text-slate-500" />
          <StatCard icon={CalendarCheck} iconBg="bg-violet-50" iconColor="text-violet-600" label="Next Payout Date"      value="03 Jun 2025" sub="Tuesday" subColor="text-slate-500" />
        </div>

        {/* Settlements List */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-3.5 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-800">Settlements List</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Settlement ID','Settlement Date','Payout For Period','Payout Method','Payout To','Amount','TDS / Deductions','Net Payout','Status','Actions'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {settlements.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-4 py-3.5 text-xs font-mono font-semibold text-slate-600 whitespace-nowrap">{s.id}</td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-slate-700 whitespace-nowrap">{s.date}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{s.period}</td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-slate-700 whitespace-nowrap">{s.method}</td>
                    <td className="px-4 py-3.5 text-xs font-mono text-slate-500 whitespace-nowrap">{s.account}</td>
                    <td className="px-4 py-3.5 text-xs font-bold text-slate-800 whitespace-nowrap">{fmt(s.amount)}</td>
                    <td className="px-4 py-3.5 text-xs text-rose-600 font-semibold whitespace-nowrap">- {fmt(Math.abs(s.tds))}</td>
                    <td className="px-4 py-3.5 text-xs font-bold text-slate-800 whitespace-nowrap">{fmt(s.net)}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => onViewSettlement(s)}
                          className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer" 
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" title="Download Statement"><Download className="w-4 h-4" /></button>
                        {s.status === 'Pending' && (
                          <button 
                            onClick={() => onRequestSettlement(s.id)}
                            className="bg-teal-700 hover:bg-teal-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl transition-all shadow-sm active:scale-95 whitespace-nowrap cursor-pointer ml-1"
                          >
                            Request Payout
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination current={6} total={6} pages={1} />
        </div>

        {/* Info cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { icon: Info, title: 'How Settlements Work?', body: 'Payouts are initiated every week for completed transactions after deducting applicable fees and taxes.' },
            { icon: Calendar, title: 'Settlement Schedule', body: (<><p className="text-xs text-slate-500 mb-1">Weekly Payouts</p><p className="text-sm font-bold text-slate-700">Every Wednesday</p><p className="text-xs text-slate-500 mt-2 mb-0.5">Cut-off Time</p><p className="text-sm font-bold text-slate-700">Tuesday, 11:59 PM</p></>) },
            { icon: AlertCircle, title: 'TDS Information', body: 'TDS is applicable as per government regulations. Download yearly TDS certificate from payout history.' },
          ].map((c, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <c.icon className="w-4 h-4 text-teal-600 shrink-0" />
                <h4 className="text-xs font-bold text-slate-700">{c.title}</h4>
              </div>
              {typeof c.body === 'string' ? <p className="text-[11px] text-slate-500 leading-relaxed">{c.body}</p> : c.body}
              <button className="mt-2 text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1">Know More <ArrowRight className="w-3 h-3" /></button>
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800">Settlement Summary</h3>
            <select className="appearance-none text-xs font-semibold text-teal-600 focus:outline-none cursor-pointer bg-transparent">
              <option>This Month</option><option>Last Month</option>
            </select>
          </div>
          {[
            { label: 'Gross Earnings',   value: '₹2,48,650.00',  color: '' },
            { label: 'Platform Fees',    value: '- ₹20,000.00',  color: 'text-rose-600' },
            { label: 'Taxes (TDS)',      value: '- ₹4,980.00',   color: 'text-rose-600' },
            { label: 'Other Deductions', value: '- ₹1,250.00',   color: 'text-rose-600' },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between py-2 border-b border-slate-50 text-xs">
              <span className="text-slate-500">{r.label}</span>
              <span className={`font-semibold ${r.color || 'text-slate-800'}`}>{r.value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-2.5 mt-1 text-sm font-bold text-slate-800 border-t-2 border-slate-200">
            <span>Total Payouts</span><span>₹1,87,420.00</span>
          </div>
          <button className="mt-3 w-full flex items-center justify-center gap-2 bg-white hover:bg-teal-50 text-teal-700 border border-teal-200 py-2.5 rounded-xl text-sm font-bold transition-all">
            View Payout History
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Payout Method</h3>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 text-slate-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-700">Bank Account</p>
              <p className="text-[11px] text-slate-400">**** **** 5678</p>
              <p className="text-[11px] text-slate-400">HDFC Bank</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">Verified</span>
            <button className="text-xs font-semibold text-teal-600 hover:text-teal-700 ml-1">Manage</button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Next Settlement</h3>
          <div className="flex items-center gap-3 p-3 bg-violet-50 rounded-xl border border-violet-100 mb-3">
            <CalendarCheck className="w-8 h-8 text-violet-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-violet-800">03 June 2025</p>
              <p className="text-[11px] text-violet-600">Tuesday</p>
              <p className="text-xs font-semibold text-violet-700 mt-1">Estimated Payout: <span className="font-extrabold">₹36,365</span></p>
              <p className="text-[10px] text-violet-500 mt-0.5">Payout for 28 May – 31 May 2025</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-800">Need Help?</h3>
          </div>
          <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">If you have any issues with settlements or payouts, our support team is here to help.</p>
          <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-2.5 rounded-xl text-sm font-semibold transition-all">
            Contact Support <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function PayoutHistoryTab({ onViewPayout }: { onViewPayout: (p: any) => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Left */}
      <div className="lg:col-span-8 space-y-5">
        <Toolbar
          searchPlaceholder="Search payouts..."
          hideBuiltins
          extraFilters={
            <>
              <div className="relative">
                <select className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2.5 text-sm text-slate-600 font-medium focus:outline-none shadow-sm cursor-pointer">
                  <option>All Payment Methods</option><option>Bank Transfer</option>
                </select>
                <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2.5 text-sm text-slate-600 font-medium focus:outline-none shadow-sm cursor-pointer">
                  <option>All Status</option><option>Completed</option><option>Pending</option>
                </select>
                <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
              <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-600 font-medium hover:border-slate-300 transition-all shadow-sm">
                <Filter className="w-4 h-4 text-slate-400" />Filters
              </button>
              <button className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors px-1">Clear All</button>
            </>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard compact icon={IndianRupee}  iconBg="bg-teal-50"    iconColor="text-teal-600"    label="Total Payouts"      value="₹1,87,420.00"    sub="↑ 12.8% from Apr 2025" />
          <StatCard compact icon={CheckCircle2} iconBg="bg-emerald-50" iconColor="text-emerald-600" label="Successful Payouts"  value="₹1,83,671.60"   sub="98.0% of total payouts" subColor="text-slate-500" />
          <StatCard compact icon={RotateCcw}    iconBg="bg-rose-50"    iconColor="text-rose-500"    label="Total Deductions"   value="₹3,748.40"       sub="2.0% of total payouts"  subColor="text-rose-600" />
          <StatCard compact icon={CalendarCheck} iconBg="bg-amber-50"  iconColor="text-amber-600"   label="Pending Payouts"    value="₹36,365.00"      sub="Paid on 03 Jun 2025"    subColor="text-slate-500" />
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Payout ID','Payout Date ↓','Payout For Period','Payout Method','Payout To','Gross Amount','Deductions','Net Payout','Status','Actions'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {PAYOUTS.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-4 py-3.5 text-xs font-mono font-semibold text-slate-600 whitespace-nowrap">{p.id}</td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-slate-700 whitespace-nowrap">{p.date}</td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 whitespace-nowrap">{p.period}</td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-slate-700 whitespace-nowrap">{p.method}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      {p.to.split('\n').map((line, i) => (
                        <p key={i} className={i === 0 ? 'text-xs font-mono text-slate-600' : 'text-[11px] text-slate-400'}>{line}</p>
                      ))}
                    </td>
                    <td className="px-4 py-3.5 text-xs font-bold text-slate-800 whitespace-nowrap">{fmt(p.gross)}</td>
                    <td className="px-4 py-3.5 text-xs text-rose-600 font-semibold whitespace-nowrap">- {fmt(Math.abs(p.deductions))}</td>
                    <td className="px-4 py-3.5 text-xs font-bold text-slate-800 whitespace-nowrap">{fmt(p.net)}</td>
                    <td className="px-4 py-3.5 whitespace-nowrap"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => onViewPayout(p)}
                          className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" title="Download Statement"><Download className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination current={9} total={12} pages={2} />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800">Payout Summary</h3>
            <select className="appearance-none text-xs font-semibold text-teal-600 focus:outline-none cursor-pointer bg-transparent">
              <option>This Month</option><option>Last Month</option>
            </select>
          </div>
          {[
            { label: 'Gross Earnings',   value: '₹2,48,650.00', color: '' },
            { label: 'Platform Fees',    value: '- ₹20,000.00', color: 'text-rose-600' },
            { label: 'Taxes (TDS)',      value: '- ₹4,980.00',  color: 'text-rose-600' },
            { label: 'Other Deductions', value: '- ₹1,250.00',  color: 'text-rose-600' },
          ].map(r => (
            <div key={r.label} className="flex items-center justify-between py-2 border-b border-slate-50 text-xs">
              <span className="text-slate-500">{r.label}</span>
              <span className={`font-semibold ${r.color || 'text-slate-800'}`}>{r.value}</span>
            </div>
          ))}
          <div className="flex items-center justify-between py-2.5 mt-1 text-sm font-bold text-slate-800 border-t-2 border-slate-200">
            <span>Total Payouts</span><span>₹1,87,420.00</span>
          </div>
          <button className="mt-3 w-full flex items-center justify-center gap-2 bg-white hover:bg-teal-50 text-teal-700 border border-teal-200 py-2.5 rounded-xl text-sm font-bold transition-all">
            View Settlements
          </button>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-3">Payout Method</h3>
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
            <div className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 text-slate-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-700">Bank Account</p>
              <p className="text-[11px] text-slate-400">**** **** 5678</p>
              <p className="text-[11px] text-slate-400">HDFC Bank</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">Verified</span>
            <button className="text-xs font-semibold text-teal-600 hover:text-teal-700 ml-1">Manage</button>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-teal-600" />
            <h3 className="text-sm font-bold text-slate-800">Need Help?</h3>
          </div>
          <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">If you have any issues with payouts, our support team is here to help.</p>
          <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-2.5 rounded-xl text-sm font-semibold transition-all">
            Contact Support <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <h3 className="text-xs font-bold text-amber-800">Important Note</h3>
          </div>
          <p className="text-[11px] text-amber-700 leading-relaxed">Payouts are processed every week for completed settlements after deducting applicable fees and taxes.</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
const TABS: Tab[] = ['Overview', 'Transactions', 'Settlements', 'Payout History'];

export default function RevenueScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [transactions, setTransactions] = useState<any[]>(TRANSACTIONS);
  const [settlements, setSettlements] = useState<any[]>(SETTLEMENTS);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Viewing detail modal states
  const [viewingTxn, setViewingTxn] = useState<any | null>(null);
  const [viewingSettlement, setViewingSettlement] = useState<any | null>(null);
  const [viewingPayout, setViewingPayout] = useState<any | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRequestSettlement = (id: string) => {
    const targetSettlement = settlements.find(s => s.id === id);
    if (!targetSettlement) return;

    const updated = settlements.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: 'Completed',
          date: new Date().toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' })
        };
      }
      return s;
    });
    setSettlements(updated);
    showToast(`Payout request of ${fmt(targetSettlement.net)} has been successfully initiated!`, 'success');
  };

  const handleRefundTransaction = (id: string) => {
    const targetTxn = transactions.find(t => t.id === id);
    if (!targetTxn) return;

    const updated = transactions.map(t => {
      if (t.id === id) {
        return {
          ...t,
          status: 'Refunded',
          earnings: -t.amount
        };
      }
      return t;
    });
    setTransactions(updated);
    showToast(`Transaction ${id} has been refunded.`, 'info');
  };

  const breadcrumb = activeTab !== 'Overview' ? activeTab : null;

  const headerActions: Record<Tab, React.ReactNode> = {
    'Overview': (
      <>
        <button className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all">
          <Download className="w-4 h-4" />Download Report
        </button>
        <button className="btn btn-primary flex items-center gap-2 px-5 py-2.5 shadow-md shadow-teal-500/20 text-sm">
          <Settings2 className="w-4 h-4" />Payout Settings
        </button>
      </>
    ),
    'Transactions': (
      <>
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all">
          <Download className="w-4 h-4" />Export Excel
        </button>
        <button className="flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all">
          <Download className="w-4 h-4" />Export PDF
        </button>
      </>
    ),
    'Settlements': (
      <>
        <button className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all">
          <Download className="w-4 h-4" />Download Statement
        </button>
        <button className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all">
          <Settings2 className="w-4 h-4" />Payout Settings
        </button>
      </>
    ),
    'Payout History': (
      <button className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all">
        <Download className="w-4 h-4" />Download Statement
      </button>
    ),
  };

  const titles: Record<Tab, { title: string; sub: string }> = {
    'Overview':      { title: 'Revenue & Settlement',  sub: 'Track your earnings, transactions and settlements' },
    'Transactions':  { title: 'Transactions',           sub: 'View all payment transactions and consultations.' },
    'Settlements':   { title: 'Settlements',            sub: 'Track your payouts and settlement history.' },
    'Payout History':{ title: 'Payout History',         sub: 'View your past payouts and settlement details.' },
  };

  return (
    <div className="w-full animate-fade space-y-5">
      {/* ─── Breadcrumb ─────────────────────────────────────────────────── */}
      {breadcrumb && (
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <button onClick={() => setActiveTab('Overview')} className="hover:text-teal-600 transition-colors font-medium">Revenue &amp; Settlement</button>
          <span>›</span>
          <span className="text-slate-600 font-medium">{breadcrumb}</span>
        </nav>
      )}

      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">{titles[activeTab].title}</h1>
          <p className="text-sm text-slate-500 mt-0.5">{titles[activeTab].sub}</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {headerActions[activeTab]}
        </div>
      </div>

      {/* ─── Tabs + Date filter ─────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 border-b border-slate-100">
          <div className="flex items-center">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap ${
                  activeTab === tab ? 'text-teal-700' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-t-full" />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 py-2">
            <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600 font-medium hover:border-slate-300 transition-all whitespace-nowrap">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />01 May 2025 – 31 May 2025
            </button>
            <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600 font-medium hover:border-slate-300 transition-all">
              <Filter className="w-3.5 h-3.5 text-slate-400" />Filters
            </button>
          </div>
        </div>
      </div>

      {/* ─── Tab Content ────────────────────────────────────────────────── */}
      {activeTab === 'Overview'       && <OverviewTab transactions={transactions} />}
      {activeTab === 'Transactions'   && <TransactionsTab transactions={transactions} onViewTxn={setViewingTxn} onDownloadInvoice={(id) => showToast(`Invoice for ${id} downloaded successfully.`, 'success')} />}
      {activeTab === 'Settlements'    && <SettlementsTab settlements={settlements} onViewSettlement={setViewingSettlement} onRequestSettlement={handleRequestSettlement} />}
      {activeTab === 'Payout History' && <PayoutHistoryTab onViewPayout={setViewingPayout} />}

      {/* TRANSACTION DETAILS MODAL */}
      {viewingTxn && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setViewingTxn(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-fade"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Transaction Details</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">{viewingTxn.id}</p>
              </div>
              <button 
                onClick={() => setViewingTxn(null)}
                className="p-1 text-slate-400 hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="py-4 space-y-3.5 text-xs text-left">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-semibold">Patient Name</span>
                <span className="font-bold text-slate-700">{viewingTxn.patient}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-semibold">Appointment ID</span>
                <span className="font-mono font-bold text-slate-700">{viewingTxn.apptId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-semibold">Payment Type</span>
                <span className="font-semibold text-slate-700">{viewingTxn.type}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-semibold">Payment Method</span>
                <span className="font-bold text-slate-700">{viewingTxn.method} ({viewingTxn.methodDetail})</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-semibold">Date & Time</span>
                <span className="font-semibold text-slate-700">{viewingTxn.date}, {viewingTxn.time}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-semibold">Gross Amount</span>
                <span className="font-bold text-slate-700">₹{viewingTxn.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-semibold">Platform Fee (10%)</span>
                <span className="font-semibold text-slate-500">- ₹{viewingTxn.platform.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2 bg-slate-50/50 p-2 rounded-xl">
                <span className="text-teal-700 font-bold">Your Net Earnings</span>
                <span className="font-extrabold text-teal-700">₹{viewingTxn.earnings.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-semibold">Status</span>
                <StatusBadge status={viewingTxn.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Invoice Number</span>
                <span className="font-semibold text-teal-600 font-mono">{viewingTxn.invoice}</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {viewingTxn.status === 'Completed' && (
                <button 
                  onClick={() => {
                    handleRefundTransaction(viewingTxn.id);
                    setViewingTxn(null);
                  }}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer transition-colors"
                >
                  Refund Transaction
                </button>
              )}
              <button 
                onClick={() => setViewingTxn(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SETTLEMENT DETAILS MODAL */}
      {viewingSettlement && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setViewingSettlement(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-fade"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Settlement Statement</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">{viewingSettlement.id}</p>
              </div>
              <button 
                onClick={() => setViewingSettlement(null)}
                className="p-1 text-slate-400 hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="py-4 space-y-3.5 text-xs text-left">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-semibold">Settlement Date</span>
                <span className="font-semibold text-slate-700">{viewingSettlement.date}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-semibold">Settlement Period</span>
                <span className="font-bold text-slate-700">{viewingSettlement.period}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-semibold">Payout Method</span>
                <span className="font-semibold text-slate-700">{viewingSettlement.method}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-semibold">Payout Destination</span>
                <span className="font-mono font-semibold text-slate-500">{viewingSettlement.account}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-semibold">Gross Amount</span>
                <span className="font-bold text-slate-700">{fmt(viewingSettlement.amount)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-semibold">TDS / Deductions (2%)</span>
                <span className="font-semibold text-rose-600">- {fmt(Math.abs(viewingSettlement.tds))}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2 bg-emerald-50/50 p-2 rounded-xl">
                <span className="text-emerald-700 font-bold">Net Payout Transferred</span>
                <span className="font-extrabold text-emerald-700">{fmt(viewingSettlement.net)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Status</span>
                <StatusBadge status={viewingSettlement.status} />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {viewingSettlement.status === 'Pending' && (
                <button 
                  onClick={() => {
                    handleRequestSettlement(viewingSettlement.id);
                    setViewingSettlement(null);
                  }}
                  className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer transition-colors"
                >
                  Request Payout
                </button>
              )}
              <button 
                onClick={() => setViewingSettlement(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PAYOUT DETAILS MODAL */}
      {viewingPayout && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setViewingPayout(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-fade"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Payout Details</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">{viewingPayout.id}</p>
              </div>
              <button 
                onClick={() => setViewingPayout(null)}
                className="p-1 text-slate-400 hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="py-4 space-y-3.5 text-xs text-left">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-semibold">Payout Date</span>
                <span className="font-semibold text-slate-700">{viewingPayout.date}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-semibold">Period</span>
                <span className="font-bold text-slate-700">{viewingPayout.period}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-semibold">Payout Method</span>
                <span className="font-semibold text-slate-700">{viewingPayout.method}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-semibold">Paid To</span>
                <span className="font-semibold text-slate-700 text-right whitespace-pre-line">{viewingPayout.to}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-semibold">Gross Amount</span>
                <span className="font-bold text-slate-700">{fmt(viewingPayout.gross)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-500 font-semibold">Deductions</span>
                <span className="font-semibold text-rose-600">{fmt(viewingPayout.deductions)}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2 bg-teal-50/50 p-2 rounded-xl">
                <span className="text-teal-700 font-bold">Net Payout</span>
                <span className="font-extrabold text-teal-700">{fmt(viewingPayout.net)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-semibold">Status</span>
                <StatusBadge status={viewingPayout.status} />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                onClick={() => setViewingPayout(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade flex items-center gap-3 bg-slate-900 border border-slate-800 text-white px-5 py-3.5 rounded-2xl shadow-xl max-w-sm">
          <div className={`w-2 h-2 rounded-full shrink-0 bg-teal-500`} />
          <p className="text-xs font-bold">{toast.message}</p>
        </div>
      )}
    </div>
  );
}
