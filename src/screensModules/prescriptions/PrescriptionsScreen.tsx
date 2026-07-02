import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Download,
  Eye,
  MoreVertical,
  Filter,
  Calendar,
  RefreshCw,
  Send,
  Clock,
  User,
  AlertCircle,
  Syringe,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Maximize2,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type PrescriptionStatus = 'Sent' | 'Draft' | 'Expired';

interface Prescription {
  id: string;
  patient: string;
  patientId: string;
  initials: string;
  age: number;
  gender: string;
  date: string;
  time: string;
  diagnosis: string;
  status: PrescriptionStatus;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_PRESCRIPTIONS: Prescription[] = [
  { id: 'RX-2025-0007', patient: 'Amit Sharma',  patientId: 'PAT123456', initials: 'AS', age: 32, gender: 'Male',   date: '28 May 2025', time: '11:30 AM', diagnosis: 'Acute Bronchitis',         status: 'Sent'    },
  { id: 'RX-2025-0006', patient: 'Priya Singh',   patientId: 'PAT123457', initials: 'PS', age: 28, gender: 'Female', date: '27 May 2025', time: '04:15 PM', diagnosis: 'Migraine without aura',    status: 'Draft'   },
  { id: 'RX-2025-0005', patient: 'Ramesh Kumar',  patientId: 'PAT123458', initials: 'RK', age: 45, gender: 'Male',   date: '27 May 2025', time: '10:20 AM', diagnosis: 'Essential Hypertension',   status: 'Sent'    },
  { id: 'RX-2025-0004', patient: 'Neha Devi',     patientId: 'PAT123459', initials: 'ND', age: 35, gender: 'Female', date: '26 May 2025', time: '03:40 PM', diagnosis: 'Type 2 Diabetes Mellitus', status: 'Sent'    },
  { id: 'RX-2025-0003', patient: 'Vikram Singh',  patientId: 'PAT123460', initials: 'VS', age: 50, gender: 'Male',   date: '26 May 2025', time: '11:05 AM', diagnosis: 'Gastroesophageal Reflux',  status: 'Expired' },
  { id: 'RX-2025-0002', patient: 'Anjali Patel',  patientId: 'PAT123461', initials: 'AP', age: 29, gender: 'Female', date: '25 May 2025', time: '02:10 PM', diagnosis: 'Iron Deficiency Anemia',   status: 'Draft'   },
  { id: 'RX-2025-0001', patient: 'Mohit Jain',    patientId: 'PAT123462', initials: 'MJ', age: 41, gender: 'Male',   date: '25 May 2025', time: '09:30 AM', diagnosis: 'Allergic Rhinitis',        status: 'Sent'    },
];

const HISTORY = [
  { id: 'RX-2025-0006', date: '27 May 2025', status: 'Draft' as PrescriptionStatus },
  { id: 'RX-2025-0005', date: '20 May 2025', status: 'Sent' as PrescriptionStatus },
  { id: 'RX-2025-0003', date: '15 May 2025', status: 'Expired' as PrescriptionStatus },
];

const AVATAR_COLORS: Record<string, string> = {
  AS: 'bg-teal-100 text-teal-700',
  PS: 'bg-pink-100 text-pink-700',
  RK: 'bg-orange-100 text-orange-700',
  ND: 'bg-indigo-100 text-indigo-700',
  VS: 'bg-violet-100 text-violet-700',
  AP: 'bg-amber-100 text-amber-700',
  MJ: 'bg-sky-100 text-sky-700',
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: PrescriptionStatus }) {
  const styles: Record<PrescriptionStatus, string> = {
    Sent:    'bg-emerald-50 text-emerald-700 border border-emerald-200',
    Draft:   'bg-sky-50    text-sky-700    border border-sky-200',
    Expired: 'bg-rose-50   text-rose-700   border border-rose-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${styles[status]}`}>
      {status}
    </span>
  );
}

function Avatar({ initials, size = 'md' }: { initials: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClass = size === 'lg' ? 'w-12 h-12 text-sm' : size === 'sm' ? 'w-7 h-7 text-[11px]' : 'w-9 h-9 text-xs';
  const color = AVATAR_COLORS[initials] ?? 'bg-slate-100 text-slate-600';
  return (
    <div className={`${sizeClass} ${color} rounded-full flex items-center justify-center font-bold shrink-0`}>
      {initials}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
type Tab = 'All Prescriptions' | 'Drafts' | 'Sent' | 'Expired';

export default function PrescriptionsScreen() {
  const [activeTab, setActiveTab]       = useState<Tab>('All Prescriptions');
  const [searchTerm, setSearchTerm]     = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [selectedRx, setSelectedRx]     = useState<Prescription>(MOCK_PRESCRIPTIONS[0]);
  const [currentPage, setCurrentPage]   = useState(1);
  const pageSize = 10;

  const tabs: Tab[] = ['All Prescriptions', 'Drafts', 'Sent', 'Expired'];

  // Filtering
  const filtered = MOCK_PRESCRIPTIONS.filter(rx => {
    const matchTab =
      activeTab === 'All Prescriptions' ||
      rx.status === activeTab.replace('s', '');  // 'Drafts' → 'Draft', 'Sent', 'Expired'
    const matchSearch =
      rx.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus =
      statusFilter === 'All Status' || rx.status === statusFilter;
    return matchTab && matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated  = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const tabCounts: Record<Tab, number> = {
    'All Prescriptions': MOCK_PRESCRIPTIONS.length,
    'Drafts':  MOCK_PRESCRIPTIONS.filter(r => r.status === 'Draft').length,
    'Sent':    MOCK_PRESCRIPTIONS.filter(r => r.status === 'Sent').length,
    'Expired': MOCK_PRESCRIPTIONS.filter(r => r.status === 'Expired').length,
  };

  return (
    <div className="w-full animate-fade flex flex-col gap-0" style={{ minHeight: 0 }}>

      {/* ─── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Prescription Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Create, view and manage patient prescriptions</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all">
            <Download className="w-4 h-4" />
            Import Prescription
          </button>
          <button className="btn btn-primary flex items-center gap-2 px-5 py-2.5 shadow-md shadow-teal-500/20 text-sm">
            <Plus className="w-4 h-4" />
            New Prescription
          </button>
        </div>
      </div>

      {/* ─── Main Grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* ── Left: Table panel ──────────────────────────────────────────── */}
        <div className="lg:col-span-8">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

            {/* Tabs */}
            <div className="flex items-center border-b border-slate-100 px-4 pt-1">
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                  className={`relative px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap ${
                    activeTab === tab
                      ? 'text-teal-700'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-600 rounded-t-full" />
                  )}
                  {tabCounts[tab] > 0 && activeTab !== tab && (
                    <span className="ml-1.5 text-[10px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded-full">
                      {tabCounts[tab]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-slate-50/60 border-b border-slate-100">
              {/* Search */}
              <div className="flex-1 min-w-[180px] bg-white border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-2 focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-400 transition-all shadow-sm">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search prescriptions by patient name, ID..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent border-none focus:outline-none text-sm text-slate-700 placeholder:text-slate-400"
                />
              </div>

              {/* Date range chip */}
              <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 font-medium hover:border-slate-300 transition-all shadow-sm whitespace-nowrap">
                <Calendar className="w-4 h-4 text-slate-400" />
                01 May 2025 – 31 May 2025
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Status filter */}
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-sm text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 shadow-sm cursor-pointer"
                >
                  <option>All Status</option>
                  <option>Sent</option>
                  <option>Draft</option>
                  <option>Expired</option>
                </select>
                <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>

              {/* Filters button */}
              <button className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 font-medium hover:border-slate-300 transition-all shadow-sm">
                <Filter className="w-4 h-4 text-slate-400" />
                Filters
              </button>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-12 gap-2 px-5 py-2.5 bg-slate-50 border-b border-slate-100">
              {['Prescription ID', 'Patient Details', 'Date', 'Diagnosis', 'Status', 'Actions'].map((col, i) => (
                <div
                  key={col}
                  className={`text-[11px] font-bold text-slate-400 uppercase tracking-wider ${
                    i === 0 ? 'col-span-2' :
                    i === 1 ? 'col-span-3' :
                    i === 2 ? 'col-span-2' :
                    i === 3 ? 'col-span-3' :
                    i === 4 ? 'col-span-1' :
                    'col-span-1 text-right'
                  }`}
                >
                  {col}
                </div>
              ))}
            </div>

            {/* Table rows */}
            <div className="divide-y divide-slate-50">
              {paginated.length === 0 ? (
                <div className="py-16 flex flex-col items-center gap-3 text-slate-400">
                  <FileText className="w-10 h-10 opacity-40" />
                  <p className="font-medium text-sm">No prescriptions found</p>
                </div>
              ) : (
                paginated.map(rx => (
                  <div
                    key={rx.id}
                    onClick={() => setSelectedRx(rx)}
                    className={`grid grid-cols-12 gap-2 px-5 py-3.5 items-center cursor-pointer transition-colors group ${
                      selectedRx?.id === rx.id
                        ? 'bg-teal-50/60 border-l-2 border-l-teal-500'
                        : 'hover:bg-slate-50/80 border-l-2 border-l-transparent'
                    }`}
                  >
                    {/* ID */}
                    <div className="col-span-2">
                      <span className="text-xs font-mono font-semibold text-slate-600">{rx.id}</span>
                    </div>

                    {/* Patient */}
                    <div className="col-span-3 flex items-center gap-2.5 min-w-0">
                      <Avatar initials={rx.initials} size="sm" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{rx.patient}</p>
                        <p className="text-[11px] text-slate-400">{rx.age} Y · {rx.patientId}</p>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="col-span-2">
                      <p className="text-xs font-semibold text-slate-700">{rx.date}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{rx.time}</p>
                    </div>

                    {/* Diagnosis */}
                    <div className="col-span-3">
                      <p className="text-xs font-semibold text-slate-700 leading-snug">{rx.diagnosis}</p>
                    </div>

                    {/* Status */}
                    <div className="col-span-1">
                      <StatusBadge status={rx.status} />
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        title="View Prescription"
                        onClick={e => { e.stopPropagation(); setSelectedRx(rx); }}
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
                Showing {Math.min((currentPage - 1) * pageSize + 1, filtered.length)}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} prescriptions
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1).map(page => (
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
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || totalPages === 0}
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

        {/* ── Right: Detail sidebar ───────────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-5">

          {/* Patient Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">Patient Summary</h3>
              <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {selectedRx ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar initials={selectedRx.initials} size="lg" />
                  <div>
                    <h4 className="text-base font-bold text-slate-800">{selectedRx.patient}</h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <User className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-500">{selectedRx.age} Years, {selectedRx.gender}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <FileText className="w-3 h-3 text-slate-400" />
                      <span className="text-xs text-slate-500">{selectedRx.patientId}</span>
                    </div>
                  </div>
                </div>

                <button className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 mb-5 transition-colors">
                  View Profile <ExternalLink className="w-3 h-3" />
                </button>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-slate-100">
                  {[
                    { label: 'Last Visit', value: '28 May 2025' },
                    { label: 'Allergies', value: 'Penicillin' },
                    { label: 'Blood Group', value: 'B+' },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="text-[10px] text-slate-400 font-medium">{item.label}</p>
                      <p className="text-xs font-bold text-slate-700 mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-6 text-center text-slate-400 text-sm">
                Select a prescription to view patient details
              </div>
            )}
          </div>

          {/* Current Prescription */}
          {selectedRx && (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Current Prescription</h3>

              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-mono font-semibold text-slate-700">{selectedRx.id}</span>
                <StatusBadge status={selectedRx.status} />
              </div>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-400">Issued on</span>
                  <span className="ml-auto font-semibold text-slate-700">{selectedRx.date}, {selectedRx.time}</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-400 shrink-0">Diagnosis</span>
                  <span className="ml-auto font-semibold text-slate-700 text-right">{selectedRx.diagnosis}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Syringe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-slate-400">Consultation Type</span>
                  <span className="ml-auto font-semibold text-slate-700">In-Clinic</span>
                </div>
              </div>

              <div className="space-y-2.5 mt-4">
                <button className="w-full flex items-center justify-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 py-2.5 rounded-xl text-sm font-bold transition-all">
                  <Eye className="w-4 h-4" />
                  View Full Prescription
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-2.5 rounded-xl text-sm font-semibold transition-all">
                  <Send className="w-4 h-4" />
                  Send Again
                </button>
              </div>
            </div>
          )}

          {/* Prescription History */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800">Prescription History</h3>
              <button className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors">View All</button>
            </div>

            <div className="space-y-2">
              {HISTORY.map(h => (
                <div
                  key={h.id}
                  className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0"
                >
                  <div>
                    <p className="text-xs font-mono font-semibold text-slate-700">{h.id}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{h.date}</p>
                  </div>
                  <StatusBadge status={h.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
