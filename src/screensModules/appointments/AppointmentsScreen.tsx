import React, { useState } from 'react';
import {
  Plus, ChevronDown, Calendar, Video, Building2, Home,
  ChevronLeft, ChevronRight, MoreVertical, X,
  Phone, Clock, MapPin, CreditCard, MessageSquare,
  FileText, RotateCcw, Ban, Stethoscope, CheckCircle2,
  Filter, CalendarDays, ListFilter,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Appointment {
  id: string;
  patient: string;
  initials: string;
  avatarColor: string;
  gender: 'M' | 'F';
  age: number;
  patientId: string;
  phone: string;
  date: string;
  time: string;
  type: 'In-Clinic' | 'Video Consultation' | 'Home Visit';
  location: string;
  status: 'Confirmed' | 'Upcoming' | 'Pending' | 'Completed' | 'Cancelled';
  paymentStatus: 'Paid' | 'Pending' | 'Waived';
  amount: number;
  reason: string;
  notes: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const ALL_APPOINTMENTS: Appointment[] = [
  { id: 'APT-2025-0001', patient: 'Ramesh Kumar', initials: 'RK', avatarColor: 'bg-teal-100 text-teal-700', gender: 'M', age: 45, patientId: 'HYD12345', phone: '+91 98765 43210', date: '26 May 2025', time: '09:30 AM', type: 'In-Clinic', location: 'Banjara Hills Clinic', status: 'Confirmed', paymentStatus: 'Paid', amount: 800, reason: 'Chest pain and breathlessness', notes: 'Patient experiencing mild discomfort from last 3 days.' },
  { id: 'APT-2025-0002', patient: 'Priya Sharma', initials: 'PS', avatarColor: 'bg-pink-100 text-pink-700', gender: 'F', age: 32, patientId: 'HYD12346', phone: '+91 87654 32109', date: '26 May 2025', time: '10:30 AM', type: 'Video Consultation', location: 'Online', status: 'Upcoming', paymentStatus: 'Paid', amount: 600, reason: 'Follow-up consultation', notes: 'Post-medication review.' },
  { id: 'APT-2025-0003', patient: 'Suresh Babu', initials: 'SB', avatarColor: 'bg-blue-100 text-blue-700', gender: 'M', age: 50, patientId: 'HYD12347', phone: '+91 76543 21098', date: '26 May 2025', time: '11:30 AM', type: 'In-Clinic', location: 'Banjara Hills Clinic', status: 'Pending', paymentStatus: 'Pending', amount: 800, reason: 'Shortness of breath', notes: 'Referred by Dr. Mehta.' },
  { id: 'APT-2025-0004', patient: 'Anjali Mehta', initials: 'AM', avatarColor: 'bg-purple-100 text-purple-700', gender: 'F', age: 28, patientId: 'HYD12348', phone: '+91 65432 10987', date: '26 May 2025', time: '02:00 PM', type: 'Video Consultation', location: 'Online', status: 'Confirmed', paymentStatus: 'Paid', amount: 600, reason: 'Routine cardiac checkup', notes: '' },
  { id: 'APT-2025-0005', patient: 'Vikram Patel', initials: 'VP', avatarColor: 'bg-amber-100 text-amber-700', gender: 'M', age: 38, patientId: 'HYD12349', phone: '+91 54321 09876', date: '26 May 2025', time: '03:30 PM', type: 'In-Clinic', location: 'Kukatpally Clinic', status: 'Completed', paymentStatus: 'Paid', amount: 800, reason: 'Palpitations', notes: 'ECG done, report normal.' },
  { id: 'APT-2025-0006', patient: 'Neha Singh', initials: 'NS', avatarColor: 'bg-rose-100 text-rose-700', gender: 'F', age: 29, patientId: 'HYD12350', phone: '+91 43210 98765', date: '26 May 2025', time: '04:30 PM', type: 'Home Visit', location: 'Hyderabad', status: 'Confirmed', paymentStatus: 'Paid', amount: 1200, reason: 'Post-surgery follow-up', notes: 'Patient has mobility issues.' },
  { id: 'APT-2025-0007', patient: 'Rahul Joshi', initials: 'RJ', avatarColor: 'bg-green-100 text-green-700', gender: 'M', age: 41, patientId: 'HYD12351', phone: '+91 32109 87654', date: '27 May 2025', time: '09:00 AM', type: 'Video Consultation', location: 'Online', status: 'Upcoming', paymentStatus: 'Paid', amount: 600, reason: 'Lab report review', notes: '' },
  { id: 'APT-2025-0008', patient: 'Deepa Rao', initials: 'DR', avatarColor: 'bg-indigo-100 text-indigo-700', gender: 'F', age: 55, patientId: 'HYD12352', phone: '+91 21098 76543', date: '27 May 2025', time: '10:00 AM', type: 'In-Clinic', location: 'Banjara Hills Clinic', status: 'Cancelled', paymentStatus: 'Waived', amount: 800, reason: 'Hypertension management', notes: 'Patient cancelled due to travel.' },
];

// ─── Config ───────────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { bg: string; text: string }> = {
  Confirmed: { bg: 'bg-teal-50', text: 'text-teal-700' },
  Upcoming:  { bg: 'bg-blue-50', text: 'text-blue-700' },
  Pending:   { bg: 'bg-amber-50', text: 'text-amber-700' },
  Completed: { bg: 'bg-slate-100', text: 'text-slate-600' },
  Cancelled: { bg: 'bg-red-50', text: 'text-red-600' },
};

const PAYMENT_CONFIG: Record<string, { bg: string; text: string }> = {
  Paid:    { bg: 'bg-teal-50', text: 'text-teal-700' },
  Pending: { bg: 'bg-amber-50', text: 'text-amber-700' },
  Waived:  { bg: 'bg-slate-100', text: 'text-slate-500' },
};

const TYPE_TABS = ['All Appointments', 'Today', 'Upcoming', 'Completed', 'Cancelled'];

// ─── TypeIcon ─────────────────────────────────────────────────────────────────
const TypeIcon = ({ type }: { type: string }) => {
  if (type === 'Video Consultation') return <Video className="w-3.5 h-3.5 text-blue-500" />;
  if (type === 'Home Visit') return <Home className="w-3.5 h-3.5 text-purple-500" />;
  return <Building2 className="w-3.5 h-3.5 text-teal-500" />;
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, bg, iconColor, label, value }: {
  icon: React.ElementType; bg: string; iconColor: string; label: string; value: string | number;
}) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
    <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center shrink-0`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
    <div>
      <p className="text-xs font-medium text-slate-500 leading-tight">{label}</p>
      <h4 className="text-2xl font-extrabold text-slate-800 mt-0.5 leading-none">{value}</h4>
    </div>
  </div>
);

// ─── Detail Row ───────────────────────────────────────────────────────────────
const DetailRow = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-3 py-2 border-b border-slate-100 last:border-0">
    <span className="text-xs text-slate-400 font-medium shrink-0 w-28">{label}</span>
    <div className="text-right text-xs font-semibold text-slate-700 leading-relaxed">{children}</div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AppointmentsScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All Appointments');
  const [selectedApp, setSelectedApp] = useState<Appointment | null>(ALL_APPOINTMENTS[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [showClinicDropdown, setShowClinicDropdown] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState('All Clinics');

  // Filter
  const filtered = ALL_APPOINTMENTS.filter(a => {
    if (activeTab === 'All Appointments') return true;
    if (activeTab === 'Today') return a.date === '26 May 2025';
    if (activeTab === 'Upcoming') return a.status === 'Upcoming';
    if (activeTab === 'Completed') return a.status === 'Completed';
    if (activeTab === 'Cancelled') return a.status === 'Cancelled';
    return true;
  });

  const totalPages = Math.ceil(48 / perPage);

  return (
    <div className="flex flex-col lg:flex-row gap-5 items-start min-h-0 relative">
      {/* ── Main Panel ───────────────────────────────────────────────────── */}
      <div className={`flex-1 min-w-0 space-y-5 transition-all duration-300 w-full ${selectedApp ? 'hidden lg:block lg:max-w-[calc(100%-320px)]' : 'block'}`}>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Appointment Management</h1>
            <p className="text-sm text-slate-500 mt-0.5">View, manage and track all appointments</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {/* Clinic Selector */}
            <div className="relative">
              <button
                onClick={() => setShowClinicDropdown(!showClinicDropdown)}
                className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 shadow-sm hover:border-slate-300 transition-all"
              >
                <div className="w-7 h-7 bg-teal-50 rounded-lg flex items-center justify-center shrink-0">
                  <Building2 className="w-3.5 h-3.5 text-teal-600" />
                </div>
                <div className="text-left">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none">Clinic</p>
                  <p className="text-sm font-bold text-slate-700 leading-tight">{selectedClinic}</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              {showClinicDropdown && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setShowClinicDropdown(false)} />
                  <div className="absolute left-0 top-full mt-1.5 w-52 bg-white border border-slate-200 shadow-xl rounded-xl py-1.5 z-30">
                    {['All Clinics', 'Banjara Hills Clinic', 'Kukatpally Clinic', 'Secunderabad Clinic'].map(c => (
                      <button key={c} onClick={() => { setSelectedClinic(c); setShowClinicDropdown(false); }}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${selectedClinic === c ? 'text-teal-700 bg-teal-50 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Create Button */}
            <button
              onClick={() => navigate('/appointments/create')}
              className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              Create Appointment
              <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-70" />
            </button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard icon={Calendar} bg="bg-teal-50" iconColor="text-teal-600" label="Today's Appointments" value={12} />
          <StatCard icon={Clock} bg="bg-blue-50" iconColor="text-blue-600" label="Upcoming Appointments" value={28} />
          <StatCard icon={CheckCircle2} bg="bg-amber-50" iconColor="text-amber-600" label="Completed Appointments" value={156} />
          <StatCard icon={Ban} bg="bg-red-50" iconColor="text-red-500" label="Cancelled Appointments" value={18} />
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 pt-4 pb-0 border-b border-slate-100">
            {/* Tabs */}
            <div className="flex items-end gap-0 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {TYPE_TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setCurrentPage(1); setSelectedApp(null); }}
                  className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${
                    activeTab === tab
                      ? 'border-teal-600 text-teal-700'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Right filters */}
            <div className="flex items-center gap-2 pb-3 sm:pb-0">
              <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-100 whitespace-nowrap">
                <ListFilter className="w-3.5 h-3.5" />
                All Consultation Types
                <ChevronDown className="w-3 h-3" />
              </button>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-100 whitespace-nowrap">
                <CalendarDays className="w-3.5 h-3.5" />
                01 May – 31 May 2025
                <ChevronDown className="w-3 h-3" />
              </button>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-100">
                <Filter className="w-3.5 h-3.5" />
                Filters
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border-t border-slate-100">
            <div className="min-w-[800px]">
              {/* Table Header */}
          <div className="grid grid-cols-12 gap-3 px-5 py-3 bg-slate-50 border-b border-slate-100">
            <div className="col-span-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Appointment ID</div>
            <div className="col-span-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Patient Details</div>
            <div className="col-span-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Date & Time</div>
            <div className="col-span-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Consultation Type</div>
            <div className="col-span-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status</div>
            <div className="col-span-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-slate-100">
            {filtered.map(apt => {
              const isSelected = selectedApp?.id === apt.id;
              const status = STATUS_CONFIG[apt.status] ?? { bg: 'bg-slate-100', text: 'text-slate-600' };
              return (
                <div
                  key={apt.id}
                  onClick={() => setSelectedApp(isSelected ? null : apt)}
                  className={`grid grid-cols-12 gap-3 px-5 py-3.5 items-center cursor-pointer transition-all ${
                    isSelected ? 'bg-teal-50/60 border-l-2 border-teal-500' : 'hover:bg-slate-50 border-l-2 border-transparent'
                  }`}
                >
                  {/* ID */}
                  <div className="col-span-2">
                    <span className="text-xs font-semibold text-slate-600 font-mono">{apt.id}</span>
                  </div>

                  {/* Patient */}
                  <div className="col-span-3 flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${apt.avatarColor}`}>
                      {apt.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {apt.patient}
                        <span className="ml-1 text-slate-400 text-[10px]">{apt.gender === 'M' ? '♂' : '♀'}</span>
                      </p>
                      <p className="text-[11px] text-slate-400">{apt.age} Years • {apt.patientId}</p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-1 text-xs font-medium text-slate-700">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {apt.date}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {apt.time}
                    </div>
                  </div>

                  {/* Type */}
                  <div className="col-span-2">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                      <TypeIcon type={apt.type} />
                      {apt.type}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 pl-5">{apt.location}</p>
                  </div>

                  {/* Status */}
                  <div className="col-span-1">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${status.bg} ${status.text}`}>
                      {apt.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setSelectedApp(apt)}
                      className="text-xs font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      View
                    </button>
                    <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="px-5 py-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
            <p className="text-xs text-slate-400 font-medium">
              Showing 1 to {filtered.length} of 48 appointments
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[1, 2, 3, 4, 5].map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${
                    currentPage === page
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="ml-2 flex items-center gap-1.5">
                <select className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg px-2 py-1.5 focus:outline-none">
                  <option>10 / page</option>
                  <option>25 / page</option>
                  <option>50 / page</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Appointment Details Panel ─────────────────────────────────────── */}
      {selectedApp && (
        <div className={`w-full lg:w-[300px] shrink-0 lg:sticky lg:top-0 space-y-3 ${selectedApp ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Panel Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedApp(null)}
                  className="lg:hidden p-1.5 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="text-sm font-bold text-slate-800">Appointment Details</h3>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="hidden lg:block p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Patient Info */}
            <div className="px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${selectedApp.avatarColor}`}>
                  {selectedApp.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {selectedApp.patient}
                    <span className="ml-1 text-slate-400 text-[11px]">{selectedApp.gender === 'M' ? '♂' : '♀'}</span>
                  </p>
                  <p className="text-[11px] text-slate-400">{selectedApp.age} Years • {selectedApp.patientId}</p>
                  <button
                onClick={() => navigate(`/patients/${selectedApp.id.replace('APT-2025-', 'PAT12345')}`)}
                className="flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors mt-1"
              >
                View Patient Profile →
              </button>
                </div>
              </div>
            </div>

            {/* Detail Rows */}
            <div className="px-5 py-3">
              <DetailRow label="Appointment ID">
                <span className="font-mono text-teal-700">{selectedApp.id}</span>
              </DetailRow>
              <DetailRow label="Date & Time">
                {selectedApp.date}, {selectedApp.time}
              </DetailRow>
              <DetailRow label="Consultation Type">
                <div className="flex items-center gap-1.5 justify-end">
                  <TypeIcon type={selectedApp.type} />
                  {selectedApp.type}
                </div>
              </DetailRow>
              <DetailRow label="Location">
                <div className="flex items-center gap-1 justify-end">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {selectedApp.location}
                </div>
              </DetailRow>
              <DetailRow label="Status">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${STATUS_CONFIG[selectedApp.status]?.bg} ${STATUS_CONFIG[selectedApp.status]?.text}`}>
                  {selectedApp.status}
                </span>
              </DetailRow>
              <DetailRow label="Payment Status">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${PAYMENT_CONFIG[selectedApp.paymentStatus]?.bg} ${PAYMENT_CONFIG[selectedApp.paymentStatus]?.text}`}>
                  {selectedApp.paymentStatus}
                </span>
              </DetailRow>
              <DetailRow label="Amount">
                ₹{selectedApp.amount}
              </DetailRow>
              <DetailRow label="Reason for Visit">
                <span className="text-slate-600 leading-relaxed">{selectedApp.reason}</span>
              </DetailRow>
              {selectedApp.notes && (
                <DetailRow label="Notes">
                  <span className="text-slate-500 leading-relaxed">{selectedApp.notes}</span>
                </DetailRow>
              )}
            </div>

            {/* CTA */}
            <div className="px-5 py-4 border-t border-slate-100 space-y-2">
              {selectedApp.status !== 'Completed' && selectedApp.status !== 'Cancelled' && (
                <button className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white py-2.5 rounded-xl text-sm font-bold transition-all"
                onClick={() => navigate(`/appointments/${selectedApp.id}/consultation`)}
              >
                  <Stethoscope className="w-4 h-4" />
                  Start Consultation
                </button>
              )}
              {selectedApp.status === 'Completed' && (
                <button className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800 text-white py-2.5 rounded-xl text-sm font-bold transition-all">
                  <FileText className="w-4 h-4" />
                  View Consultation Notes
                </button>
              )}

              {/* Action Row */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button className="flex flex-col items-center gap-1 py-2.5 rounded-xl hover:bg-slate-50 border border-slate-200 transition-colors group">
                  <RotateCcw className="w-4 h-4 text-slate-500 group-hover:text-teal-600" />
                  <span className="text-[10px] font-semibold text-slate-500 group-hover:text-teal-600">Reschedule</span>
                </button>
                <button className="flex flex-col items-center gap-1 py-2.5 rounded-xl hover:bg-red-50 border border-slate-200 transition-colors group">
                  <Ban className="w-4 h-4 text-slate-500 group-hover:text-red-500" />
                  <span className="text-[10px] font-semibold text-slate-500 group-hover:text-red-500">Cancel</span>
                </button>
                <button className="flex flex-col items-center gap-1 py-2.5 rounded-xl hover:bg-slate-50 border border-slate-200 transition-colors group">
                  <MoreVertical className="w-4 h-4 text-slate-500" />
                  <span className="text-[10px] font-semibold text-slate-500">More</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
