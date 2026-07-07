import React, { useState, useEffect } from 'react';
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
  Upcoming: { bg: 'bg-blue-50', text: 'text-blue-700' },
  Pending: { bg: 'bg-amber-50', text: 'text-amber-700' },
  Completed: { bg: 'bg-slate-100', text: 'text-slate-600' },
  Cancelled: { bg: 'bg-red-50', text: 'text-red-600' },
};

const PAYMENT_CONFIG: Record<string, { bg: string; text: string }> = {
  Paid: { bg: 'bg-teal-50', text: 'text-teal-700' },
  Pending: { bg: 'bg-amber-50', text: 'text-amber-700' },
  Waived: { bg: 'bg-slate-100', text: 'text-slate-500' },
};

const TYPE_TABS = ['All Appointments', 'Today', 'Upcoming', 'Completed', 'Cancelled'];

// ─── TypeIcon ─────────────────────────────────────────────────────────────────
const TypeIcon = ({ type }: { type: string }) => {
  if (type === 'Video Consultation') return <Video className="w-3.5 h-3.5 text-blue-500" />;
  if (type === 'Home Visit') return <Home className="w-3.5 h-3.5 text-purple-500" />;
  return <Building2 className="w-3.5 h-3.5 text-teal-500" />;
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, bg, iconColor, label, value, onClick }: {
  icon: React.ElementType; bg: string; iconColor: string; label: string; value: string | number; onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={`bg-white border border-slate-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm transition-all duration-205 ${onClick ? 'cursor-pointer hover:border-teal-500/40 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 select-none' : ''}`}
  >
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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedApp, setSelectedApp] = useState<Appointment | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  // Dropdown visibility states
  const [showClinicDropdown, setShowClinicDropdown] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState('All Clinics');

  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [selectedType, setSelectedType] = useState('All Consultation Types');

  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [selectedDateFilter, setSelectedDateFilter] = useState('All Dates');

  const [activeRowMenuId, setActiveRowMenuId] = useState<string | null>(null);

  // Modals
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('26 May 2025');
  const [rescheduleTime, setRescheduleTime] = useState('09:30 AM');

  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [isStartConsultationOpen, setIsStartConsultationOpen] = useState(false);
  const [consultationNotes, setConsultationNotes] = useState('');

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('vizito_appointments');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAppointments(parsed);
        if (parsed.length > 0) {
          setSelectedApp(parsed[0]);
        }
      } catch (e) {
        setAppointments(ALL_APPOINTMENTS);
        setSelectedApp(ALL_APPOINTMENTS[0]);
      }
    } else {
      setAppointments(ALL_APPOINTMENTS);
      localStorage.setItem('vizito_appointments', JSON.stringify(ALL_APPOINTMENTS));
      setSelectedApp(ALL_APPOINTMENTS[0]);
    }
  }, []);

  // Sync to local storage
  const syncAppointments = (updated: Appointment[]) => {
    setAppointments(updated);
    localStorage.setItem('vizito_appointments', JSON.stringify(updated));
  };

  // Close menus on document click
  useEffect(() => {
    const handleOutsideClick = () => setActiveRowMenuId(null);
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Filter
  const filtered = appointments.filter(a => {
    // Tab filter
    const matchTab =
      activeTab === 'All Appointments' ||
      (activeTab === 'Today' && a.date === '26 May 2025') ||
      (activeTab === 'Upcoming' && a.status === 'Upcoming') ||
      (activeTab === 'Completed' && a.status === 'Completed') ||
      (activeTab === 'Cancelled' && a.status === 'Cancelled');

    // Clinic filter
    const matchClinic =
      selectedClinic === 'All Clinics' ||
      a.location === selectedClinic ||
      (selectedClinic === 'Banjara Hills Clinic' && a.location.includes('Banjara Hills')) ||
      (selectedClinic === 'Kukatpally Clinic' && a.location.includes('Kukatpally')) ||
      (selectedClinic === 'Secunderabad Clinic' && a.location.includes('Secunderabad'));

    // Type filter
    const matchType =
      selectedType === 'All Consultation Types' ||
      a.type === selectedType;

    // Date filter
    const matchDate =
      selectedDateFilter === 'All Dates' ||
      (selectedDateFilter === 'Today' && a.date === '26 May 2025') ||
      (selectedDateFilter === 'Tomorrow' && a.date === '27 May 2025');

    return matchTab && matchClinic && matchType && matchDate;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));

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
          <StatCard
            icon={Calendar}
            bg="bg-teal-50"
            iconColor="text-teal-600"
            label="Today's Appointments"
            value={appointments.filter(a => a.date === '26 May 2025').length}
            onClick={() => setActiveTab('Today')}
          />
          <StatCard
            icon={Clock}
            bg="bg-blue-50"
            iconColor="text-blue-600"
            label="Upcoming Appointments"
            value={appointments.filter(a => a.status === 'Upcoming').length}
            onClick={() => setActiveTab('Upcoming')}
          />
          <StatCard
            icon={CheckCircle2}
            bg="bg-amber-50"
            iconColor="text-amber-600"
            label="Completed Appointments"
            value={appointments.filter(a => a.status === 'Completed').length}
            onClick={() => setActiveTab('Completed')}
          />
          <StatCard
            icon={Ban}
            bg="bg-red-50"
            iconColor="text-red-500"
            label="Cancelled Appointments"
            value={appointments.filter(a => a.status === 'Cancelled').length}
            onClick={() => setActiveTab('Cancelled')}
          />
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
                  className={`px-4 py-3 text-sm font-semibold border-b-2 whitespace-nowrap transition-all ${activeTab === tab
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
              {/* Type filter */}
              <div className="relative">
                <button
                  onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-100 whitespace-nowrap cursor-pointer"
                >
                  <ListFilter className="w-3.5 h-3.5" />
                  {selectedType}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showTypeDropdown && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowTypeDropdown(false)} />
                    <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-slate-200 shadow-xl rounded-xl py-1.5 z-30">
                      {['All Consultation Types', 'In-Clinic', 'Video Consultation', 'Home Visit'].map(t => (
                        <button
                          key={t}
                          onClick={() => { setSelectedType(t); setShowTypeDropdown(false); }}
                          className={`w-full text-left px-4 py-2 text-xs transition-colors cursor-pointer ${selectedType === t ? 'text-teal-700 bg-teal-50 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Date Range filter */}
              <div className="relative">
                <button
                  onClick={() => setShowDateDropdown(!showDateDropdown)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 hover:bg-slate-100 whitespace-nowrap cursor-pointer"
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  {selectedDateFilter === 'All Dates' ? 'All Dates' : selectedDateFilter}
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showDateDropdown && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setShowDateDropdown(false)} />
                    <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-slate-200 shadow-xl rounded-xl py-1.5 z-30">
                      {['All Dates', 'Today', 'Tomorrow'].map(d => (
                        <button
                          key={d}
                          onClick={() => { setSelectedDateFilter(d); setShowDateDropdown(false); }}
                          className={`w-full text-left px-4 py-2 text-xs transition-colors cursor-pointer ${selectedDateFilter === d ? 'text-teal-700 bg-teal-50 font-semibold' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Reset Filters button if any active */}
              {(selectedClinic !== 'All Clinics' || selectedType !== 'All Consultation Types' || selectedDateFilter !== 'All Dates') && (
                <button
                  onClick={() => {
                    setSelectedClinic('All Clinics');
                    setSelectedType('All Consultation Types');
                    setSelectedDateFilter('All Dates');
                  }}
                  className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg px-3 py-1.5 cursor-pointer transition-colors"
                >
                  Reset
                </button>
              )}
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
                      className={`grid grid-cols-12 gap-3 px-5 py-3.5 items-center cursor-pointer transition-all ${isSelected ? 'bg-teal-50/60 border-l-2 border-teal-500' : 'hover:bg-slate-50 border-l-2 border-transparent'
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
                      <div className={`col-span-2 flex items-center justify-end gap-2 relative animate-fade ${activeRowMenuId === apt.id ? 'z-50' : 'z-10'}`} onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedApp(apt)}
                          className="text-xs font-semibold text-teal-600 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setActiveRowMenuId(activeRowMenuId === apt.id ? null : apt.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {activeRowMenuId === apt.id && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setActiveRowMenuId(null)} />
                            <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-slate-200 shadow-xl rounded-xl py-1.5 z-40 text-left">
                              {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                                <button
                                  onClick={() => {
                                    setActiveRowMenuId(null);
                                    setSelectedApp(apt);
                                    setConsultationNotes(apt.notes || '');
                                    setIsStartConsultationOpen(true);
                                  }}
                                  className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors"
                                >
                                  <Stethoscope className="w-3.5 h-3.5 text-teal-600" /> Start Consultation
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setActiveRowMenuId(null);
                                  setSelectedApp(apt);
                                  setRescheduleDate(apt.date);
                                  setRescheduleTime(apt.time);
                                  setIsRescheduleOpen(true);
                                }}
                                className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors"
                              >
                                <RotateCcw className="w-3.5 h-3.5 text-slate-500" /> Reschedule
                              </button>
                              {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                                <button
                                  onClick={() => {
                                    setActiveRowMenuId(null);
                                    setSelectedApp(apt);
                                    setIsCancelConfirmOpen(true);
                                  }}
                                  className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer border-t border-slate-100 mt-1 transition-colors"
                                >
                                  <Ban className="w-3.5 h-3.5" /> Cancel Appointment
                                </button>
                              )}
                            </div>
                          </>
                        )}
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
              Showing 1 to {filtered.length} of {appointments.length} appointments
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
                  className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors ${currentPage === page
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
                <button
                  onClick={() => {
                    setConsultationNotes(selectedApp.notes || '');
                    setIsStartConsultationOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer"
                >
                  <Stethoscope className="w-4 h-4" />
                  Start Consultation
                </button>
              )}
              {selectedApp.status === 'Completed' && (
                <button
                  onClick={() => {
                    setConsultationNotes(selectedApp.notes || '');
                    setIsStartConsultationOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800 text-white py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  View Consultation Notes
                </button>
              )}

              {/* Action Row */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  onClick={() => {
                    setRescheduleDate(selectedApp.date);
                    setRescheduleTime(selectedApp.time);
                    setIsRescheduleOpen(true);
                  }}
                  className="flex flex-col items-center gap-1 py-2.5 rounded-xl hover:bg-slate-50 border border-slate-200 transition-colors group cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4 text-slate-500 group-hover:text-teal-600" />
                  <span className="text-[10px] font-semibold text-slate-500 group-hover:text-teal-600">Reschedule</span>
                </button>
                <button
                  onClick={() => {
                    if (selectedApp.status === 'Completed' || selectedApp.status === 'Cancelled') return;
                    setIsCancelConfirmOpen(true);
                  }}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl border border-slate-200 transition-colors group ${(selectedApp.status === 'Completed' || selectedApp.status === 'Cancelled')
                      ? 'opacity-40 cursor-not-allowed'
                      : 'hover:bg-red-50 cursor-pointer'
                    }`}
                  disabled={selectedApp.status === 'Completed' || selectedApp.status === 'Cancelled'}
                >
                  <Ban className="w-4 h-4 text-slate-500 group-hover:text-red-500" />
                  <span className="text-[10px] font-semibold text-slate-500 group-hover:text-red-500">Cancel</span>
                </button>
                <button
                  onClick={() => {
                    const nextPaymentStatus = selectedApp.paymentStatus === 'Paid' ? 'Pending' : selectedApp.paymentStatus === 'Pending' ? 'Waived' : 'Paid';
                    const updated = appointments.map(a => a.id === selectedApp.id ? { ...a, paymentStatus: nextPaymentStatus as any } : a);
                    syncAppointments(updated);
                    setSelectedApp({ ...selectedApp, paymentStatus: nextPaymentStatus as any });
                    showToast(`Payment status updated to ${nextPaymentStatus}.`, 'success');
                  }}
                  className="flex flex-col items-center gap-1 py-2.5 rounded-xl hover:bg-slate-50 border border-slate-200 transition-colors group cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-slate-500 group-hover:text-teal-600" />
                  <span className="text-[10px] font-semibold text-slate-500 group-hover:text-teal-600">Payment</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade flex items-center gap-3 bg-slate-900 border border-slate-800 text-white px-5 py-3.5 rounded-2xl shadow-xl max-w-sm">
          <div className={`w-2 h-2 rounded-full shrink-0 ${toast.type === 'error' ? 'bg-red-500' : toast.type === 'info' ? 'bg-blue-500' : 'bg-teal-500'}`} />
          <p className="text-xs font-bold">{toast.message}</p>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {isRescheduleOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setIsRescheduleOpen(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!selectedApp) return;
              const updated = appointments.map(a => a.id === selectedApp.id ? { ...a, date: rescheduleDate, time: rescheduleTime } : a);
              syncAppointments(updated);
              setSelectedApp({ ...selectedApp, date: rescheduleDate, time: rescheduleTime });
              setIsRescheduleOpen(false);
              showToast('Appointment rescheduled successfully.', 'success');
            }}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-fade"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Reschedule Appointment</h3>
              <button
                type="button"
                onClick={() => setIsRescheduleOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Select New Date</label>
                <input
                  type="text"
                  value={rescheduleDate}
                  onChange={e => setRescheduleDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-teal-400"
                  placeholder="e.g. 28 May 2025"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Select New Time</label>
                <input
                  type="text"
                  value={rescheduleTime}
                  onChange={e => setRescheduleTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-teal-400"
                  placeholder="e.g. 10:30 AM"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setIsRescheduleOpen(false)}
                className="btn btn-secondary text-xs cursor-pointer py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary text-xs cursor-pointer py-2 px-4"
              >
                Confirm Reschedule
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CANCEL APPOINTMENT CONFIRMATION MODAL */}
      {isCancelConfirmOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setIsCancelConfirmOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 animate-fade"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-slate-800">Cancel Appointment</h3>
            <p className="text-xs text-slate-500 my-4 leading-relaxed">
              Are you sure you want to cancel the appointment for <b>{selectedApp?.patient}</b> on {selectedApp?.date}? This will change the status to cancelled.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsCancelConfirmOpen(false)}
                className="btn btn-secondary text-xs cursor-pointer py-2 px-4"
              >
                No, Keep
              </button>
              <button
                onClick={() => {
                  if (!selectedApp) return;
                  const updated = appointments.map(a => a.id === selectedApp.id ? { ...a, status: 'Cancelled' as const } : a);
                  syncAppointments(updated);
                  setSelectedApp({ ...selectedApp, status: 'Cancelled' });
                  setIsCancelConfirmOpen(false);
                  showToast('Appointment has been cancelled.', 'info');
                }}
                className="btn bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* START CONSULTATION / NOTES MODAL */}
      {isStartConsultationOpen && selectedApp && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setIsStartConsultationOpen(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const updated = appointments.map(a => a.id === selectedApp.id ? { ...a, status: 'Completed' as const, notes: consultationNotes } : a);
              syncAppointments(updated);
              setSelectedApp({ ...selectedApp, status: 'Completed', notes: consultationNotes });
              setIsStartConsultationOpen(false);
              showToast('Consultation notes saved and appointment marked as Completed.', 'success');
            }}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 animate-fade"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Consultation Notes</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Patient: {selectedApp.patient} ({selectedApp.patientId})</p>
              </div>
              <button
                type="button"
                onClick={() => setIsStartConsultationOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="py-4 space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Reason for Visit</label>
                <input
                  type="text"
                  value={selectedApp.reason}
                  disabled
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3.5 py-2.5 text-xs text-slate-500 font-medium"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Clinical / Consultation Notes</label>
                <textarea
                  value={consultationNotes}
                  onChange={e => setConsultationNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-700 outline-none focus:border-teal-400 min-h-[120px]"
                  placeholder="Enter medical observations, prescription details, diagnostic recommendations..."
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => setIsStartConsultationOpen(false)}
                className="btn btn-secondary text-xs cursor-pointer py-2 px-4"
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary text-xs cursor-pointer py-2 px-4"
              >
                Complete Consultation
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
