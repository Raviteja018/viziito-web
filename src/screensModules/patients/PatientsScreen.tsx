import React, { useState } from 'react';
import {
  Search,
  Plus,
  Download,
  Filter,
  Eye,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Users,
  UserPlus,
  RefreshCw,
  Calendar,
  Heart,
  Activity,
  Flame,
  Wind,
  Zap,
  Send,
  X,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────
type PatientStatus = 'Active' | 'Inactive';

interface Patient {
  id: string;
  name: string;
  initials: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  lastVisit: string;
  lastVisitTime: string;
  status: PatientStatus;
  appointments: number;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_PATIENTS: Patient[] = [
  { id: 'PAT123456', name: 'Amit Sharma',  initials: 'AS', age: 32, gender: 'Male',   phone: '+91 98765 43210', email: 'amit.sharma@email.com',  lastVisit: '28 May 2025', lastVisitTime: '11:30 AM', status: 'Active',   appointments: 8  },
  { id: 'PAT123457', name: 'Priya Singh',  initials: 'PS', age: 28, gender: 'Female', phone: '+91 91234 56789', email: 'priya.singh@email.com',   lastVisit: '27 May 2025', lastVisitTime: '04:15 PM', status: 'Active',   appointments: 5  },
  { id: 'PAT123458', name: 'Ramesh Kumar', initials: 'RK', age: 45, gender: 'Male',   phone: '+91 99876 54321', email: 'ramesh.kumar@email.com',  lastVisit: '27 May 2025', lastVisitTime: '10:20 AM', status: 'Active',   appointments: 12 },
  { id: 'PAT123459', name: 'Neha Devi',   initials: 'ND', age: 35, gender: 'Female', phone: '+91 93456 78901', email: 'neha.devi@email.com',     lastVisit: '26 May 2025', lastVisitTime: '03:40 PM', status: 'Active',   appointments: 6  },
  { id: 'PAT123460', name: 'Vikram Singh', initials: 'VS', age: 50, gender: 'Male',   phone: '+91 90000 11223', email: 'vikram.singh@email.com',  lastVisit: '26 May 2025', lastVisitTime: '11:05 AM', status: 'Inactive', appointments: 3  },
  { id: 'PAT123461', name: 'Anjali Patel', initials: 'AP', age: 29, gender: 'Female', phone: '+91 95555 66778', email: 'anjali.patel@email.com',  lastVisit: '25 May 2025', lastVisitTime: '02:10 PM', status: 'Active',   appointments: 4  },
  { id: 'PAT123462', name: 'Mohit Jain',   initials: 'MJ', age: 41, gender: 'Male',   phone: '+91 97777 88990', email: 'mohit.jain@email.com',    lastVisit: '25 May 2025', lastVisitTime: '09:30 AM', status: 'Active',   appointments: 7  },
  { id: 'PAT123463', name: 'Sneha Sharma', initials: 'SS', age: 31, gender: 'Female', phone: '+91 98888 77665', email: 'sneha.sharma@email.com',  lastVisit: '24 May 2025', lastVisitTime: '06:45 PM', status: 'Active',   appointments: 3  },
];

const TOP_CONDITIONS = [
  { name: 'Hypertension',    count: 245, icon: Heart,    color: 'text-rose-500' },
  { name: 'Diabetes',        count: 198, icon: Zap,      color: 'text-amber-500' },
  { name: 'Asthma',          count: 156, icon: Wind,     color: 'text-sky-500'  },
  { name: 'Thyroid Disorder',count: 112, icon: Activity, color: 'text-violet-500'},
  { name: 'Cardiac Disease', count: 98,  icon: Flame,    color: 'text-rose-600' },
];

const RECENT_NEW_PATIENTS = [
  { name: 'Karan Verma',    initials: 'KV', date: '22 May 2025', color: 'bg-teal-100   text-teal-700'   },
  { name: 'Pooja Nair',     initials: 'PN', date: '21 May 2025', color: 'bg-pink-100   text-pink-700'   },
  { name: 'Siddharth Rao',  initials: 'SR', date: '20 May 2025', color: 'bg-orange-100 text-orange-700' },
  { name: 'Meera Iyer',     initials: 'MI', date: '19 May 2025', color: 'bg-indigo-100 text-indigo-700' },
];

const AVATAR_COLORS: Record<string, string> = {
  AS: 'bg-teal-100   text-teal-700',
  PS: 'bg-pink-100   text-pink-700',
  RK: 'bg-orange-100 text-orange-700',
  ND: 'bg-indigo-100 text-indigo-700',
  VS: 'bg-violet-100 text-violet-700',
  AP: 'bg-amber-100  text-amber-700',
  MJ: 'bg-sky-100    text-sky-700',
  SS: 'bg-rose-100   text-rose-700',
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, icon: Icon, iconColor, iconBg,
}: {
  label: string; value: string; sub: string;
  icon: React.ElementType; iconColor: string; iconBg: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-start gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">{label}</p>
        <p className="text-xl font-extrabold text-slate-800 leading-tight">{value}</p>
        <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ initials, size = 'md' }: { initials: string; size?: 'sm' | 'md' }) {
  const sizeClass = size === 'sm' ? 'w-7 h-7 text-[11px]' : 'w-9 h-9 text-xs';
  const color = AVATAR_COLORS[initials] ?? 'bg-slate-100 text-slate-600';
  return (
    <div className={`${sizeClass} ${color} rounded-full flex items-center justify-center font-bold shrink-0`}>
      {initials}
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: PatientStatus }) {
  return (
    <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
      status === 'Active'
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-slate-100 text-slate-500 border-slate-200'
    }`}>
      {status}
    </span>
  );
}

// ─── Donut chart (CSS-only) ───────────────────────────────────────────────────
function DonutChart() {
  // Active 87.8% | Inactive 7.9% | New 6.9% (approximate conic-gradient)
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-28 h-28 rounded-full relative flex items-center justify-center"
        style={{
          background: 'conic-gradient(#0d9488 0% 87.8%, #e2e8f0 87.8% 95.7%, #fbbf24 95.7% 100%)',
        }}
      >
        {/* Donut hole */}
        <div className="w-[68px] h-[68px] bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
          <span className="text-lg font-extrabold text-slate-800 leading-none">1,248</span>
          <span className="text-[10px] text-slate-400 font-medium">Total</span>
        </div>
      </div>
      <div className="mt-4 space-y-1.5 w-full">
        {[
          { label: 'Active',         value: '1,096 (87.8%)', color: 'bg-teal-600' },
          { label: 'Inactive',       value: '98 (7.9%)',     color: 'bg-slate-300' },
          { label: 'New (This Month)',value: '86 (6.9%)',     color: 'bg-amber-400' },
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-sm shrink-0 ${item.color}`} />
            <span className="text-[11px] text-slate-500 flex-1">{item.label}</span>
            <span className="text-[11px] font-bold text-slate-700">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PatientsScreen() {
  const [searchTerm, setSearchTerm]     = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currentPage, setCurrentPage]   = useState(1);
  const navigate = useNavigate();
  const pageSize = 10;

  const filtered = MOCK_PATIENTS.filter(pt => {
    const matchSearch =
      pt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pt.phone.includes(searchTerm);
    const matchStatus =
      statusFilter === 'All Status' || pt.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="w-full animate-fade">
      {/* ─── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Patient Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">View, manage and track all your patients</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all">
            <Download className="w-4 h-4" />
            Import Patients
          </button>
          <button className="btn btn-primary flex items-center gap-2 px-5 py-2.5 shadow-md shadow-teal-500/20 text-sm">
            <Plus className="w-4 h-4" />
            Add New Patient
          </button>
          <button className="p-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl shadow-sm transition-all">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── Main Grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* ── Left Panel ─────────────────────────────────────────────────── */}
        <div className="lg:col-span-8 space-y-4">

          {/* Search / Filter Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[200px] bg-white border border-slate-200 rounded-xl px-3 py-2.5 flex items-center gap-2 focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-400 transition-all shadow-sm">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search by name, mobile number or patient ID..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full bg-transparent border-none focus:outline-none text-sm text-slate-700 placeholder:text-slate-400"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Date chip */}
            <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-600 font-medium hover:border-slate-300 transition-all shadow-sm whitespace-nowrap">
              <Calendar className="w-4 h-4 text-slate-400" />
              All Time
            </button>

            {/* Status filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2.5 text-sm text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 shadow-sm cursor-pointer"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            </div>

            <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-600 font-medium hover:border-slate-300 transition-all shadow-sm">
              <Filter className="w-4 h-4 text-slate-400" />
              Filters
            </button>
            <button className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors px-1">
              Clear All
            </button>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Total Patients"      value="1,248" sub="↑ 12% from last month" icon={Users}     iconColor="text-teal-600"   iconBg="bg-teal-50"   />
            <StatCard label="New Patients"        value="152"   sub="↑ 8% from last month"  icon={UserPlus}  iconColor="text-sky-600"    iconBg="bg-sky-50"    />
            <StatCard label="Returning Patients"  value="1,096" sub="↑ 10% from last month" icon={RefreshCw} iconColor="text-violet-600" iconBg="bg-violet-50" />
            <StatCard label="Patients This Month" value="86"    sub="↑ 5% from last month"  icon={Calendar}  iconColor="text-amber-600"  iconBg="bg-amber-50"  />
          </div>

          {/* Table Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-2 px-5 py-2.5 bg-slate-50 border-b border-slate-100">
              {[
                { label: 'Patient Details',      span: 'col-span-3' },
                { label: 'Contact',              span: 'col-span-3' },
                { label: 'Last Visit',           span: 'col-span-2' },
                { label: 'Status',               span: 'col-span-1' },
                { label: 'Total Appointments',   span: 'col-span-2' },
                { label: 'Actions',              span: 'col-span-1 text-right' },
              ].map(col => (
                <div key={col.label} className={`text-[11px] font-bold text-slate-400 uppercase tracking-wider ${col.span}`}>
                  {col.label}
                </div>
              ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
                  <Users className="w-10 h-10 opacity-40" />
                  <p className="font-medium text-sm">No patients found</p>
                </div>
              ) : (
                paginated.map(pt => (
                  <div
                    key={pt.id}
                    onClick={() => navigate(`/patients/${pt.id}`)}
                    className="grid grid-cols-12 gap-2 px-5 py-3.5 items-center cursor-pointer hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Patient Details */}
                    <div className="col-span-3 flex items-center gap-2.5 min-w-0">
                      <Avatar initials={pt.initials} />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{pt.name}</p>
                        <p className="text-[11px] text-slate-400">{pt.age} Y, {pt.gender} · {pt.id}</p>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="col-span-3">
                      <p className="text-xs font-semibold text-slate-700">{pt.phone}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">{pt.email}</p>
                    </div>

                    {/* Last Visit */}
                    <div className="col-span-2">
                      <p className="text-xs font-semibold text-slate-700">{pt.lastVisit}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{pt.lastVisitTime}</p>
                    </div>

                    {/* Status */}
                    <div className="col-span-1">
                      <StatusBadge status={pt.status} />
                    </div>

                    {/* Total Appointments */}
                    <div className="col-span-2 text-center">
                      <span className="text-sm font-bold text-slate-700">{pt.appointments}</span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/patients/${pt.id}`); }}
                        className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        title="View patient"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="More actions"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 bg-slate-50/60">
              <p className="text-xs text-slate-500 font-medium">
                Showing {Math.min((currentPage - 1) * pageSize + 1, filtered.length)}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} patients
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {[1, 2, 3].map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      currentPage === page
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'border border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <span className="text-slate-400 text-sm">…</span>
                <button
                  onClick={() => setCurrentPage(156)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold border border-slate-200 text-slate-600 hover:border-slate-300 transition-all`}
                >
                  156
                </button>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <select className="ml-2 appearance-none bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-600 focus:outline-none">
                  <option>10 / page</option>
                  <option>25 / page</option>
                  <option>50 / page</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ───────────────────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-5">

          {/* Patient Summary Donut */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Patient Summary</h3>
            <DonutChart />
          </div>

          {/* Top Conditions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800">Top Conditions</h3>
              <button className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors">View All</button>
            </div>
            <div className="space-y-2.5">
              {TOP_CONDITIONS.map(cond => (
                <div key={cond.name} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center shrink-0`}>
                    <cond.icon className={`w-3.5 h-3.5 ${cond.color}`} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700 flex-1">{cond.name}</span>
                  <span className="text-xs font-bold text-slate-500">{cond.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent New Patients */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800">Recent New Patients</h3>
              <button className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors">View All</button>
            </div>
            <div className="space-y-2.5">
              {RECENT_NEW_PATIENTS.map(p => (
                <div key={p.name} className="flex items-center gap-3">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${p.color}`}>
                    {p.initials}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 flex-1">{p.name}</span>
                  <span className="text-[11px] text-slate-400">{p.date}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Patient Communication */}
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                <Send className="w-4 h-4 text-teal-700" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-teal-800">Patient Communication</h3>
                <p className="text-[11px] text-teal-600 mt-0.5 leading-relaxed">
                  Send health updates, reminders or announcements to your patients.
                </p>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-teal-50 text-teal-700 border border-teal-200 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm">
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
