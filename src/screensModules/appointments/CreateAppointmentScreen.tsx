import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronDown,
  Calendar,
  Clock,
  Building2,
  Video,
  User,
  Check,
  Search,
  X,
  Plus,
  Footprints,
  Home,
  MessageSquare,
  Mail,
  Smartphone,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  CreditCard,
  FileText,
  MapPin,
  Stethoscope,
  Lock,
  ExternalLink
} from 'lucide-react';

import { useRole } from '../../store/role/RoleContext';
import { useHospitalRole } from '../../store/hospital/HospitalRoleContext';
import { MOCK_BRANCHES } from '../../mocks/hospitalMocks';

// ─── Initial Mock Patients List ──────────────────────────────────────────────
interface PatientItem {
  id: string;
  name: string;
  phone: string;
  initials: string;
  color: string;
  age?: number;
  gender?: string;
}

const INITIAL_PATIENTS: PatientItem[] = [
  { id: 'PAT123456', name: 'Amit Sharma', phone: '+91 98765 43210', initials: 'AS', color: 'bg-purple-100 text-[#7C3AED]', age: 34, gender: 'Male' },
  { id: 'PAT123457', name: 'Neha Singh', phone: '+91 87654 32109', initials: 'NS', color: 'bg-rose-100 text-rose-700', age: 28, gender: 'Female' },
  { id: 'PAT123458', name: 'Vikram Patel', phone: '+91 76543 21098', initials: 'VP', color: 'bg-sky-100 text-sky-700', age: 42, gender: 'Male' },
  { id: 'PAT123459', name: 'Ananya Roy', phone: '+91 65432 10987', initials: 'AR', color: 'bg-amber-100 text-amber-700', age: 31, gender: 'Female' },
  { id: 'PAT123460', name: 'Suresh Kumar', phone: '+91 91234 56789', initials: 'SK', color: 'bg-indigo-100 text-indigo-700', age: 55, gender: 'Male' },
];

const CLINICS = ['Banjara Hills Clinic', 'Kukatpally Clinic', 'Secunderabad Clinic', 'Jubilee Hills Center'];
const DURATIONS = ['15 min', '30 min', '45 min', '60 min'];
const PAYMENT_MODES = ['Pay Online', 'Pay at Clinic', 'Insurance', 'Free'];
const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '02:00 PM',
  '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM'
];

export default function CreateAppointmentScreen() {
  const navigate = useNavigate();
  const { role } = useRole();
  const hospitalContext = useHospitalRole();
  const isHospital = role === 'hospital';
  const activeBranches = MOCK_BRANCHES.filter(b => b.status === 'Active');

  const defaultLocation = isHospital
    ? (hospitalContext?.assignedBranch || activeBranches[0]?.name || 'Jubilee Hills Branch')
    : 'Banjara Hills Clinic';

  // ─── Patient Selection State ───
  const [patientsList, setPatientsList] = useState<PatientItem[]>(INITIAL_PATIENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientItem | null>(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  // New Patient Form state
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState('');
  const [newGender, setNewGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [newMobile, setNewMobile] = useState('');
  const [regError, setRegError] = useState('');

  // ─── Appointment Details State ───
  const [clinic, setClinic] = useState(defaultLocation);
  const [consultationType, setConsultationType] = useState<'Walk-In' | 'In-Clinic' | 'Video Consultation' | 'Home Visit'>('In-Clinic');
  
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });
  const [appointmentTime, setAppointmentTime] = useState('10:30 AM');
  const [duration, setDuration] = useState('30 min');
  const [reason, setReason] = useState('');

  // ─── Billing & Notes State ───
  const [fee, setFee] = useState('800');
  const [paymentMode, setPaymentMode] = useState('Pay at Clinic');
  const [notes, setNotes] = useState('');
  const [sendSMS, setSendSMS] = useState(true);
  const [sendEmail, setSendEmail] = useState(true);
  const [sendWhatsApp, setSendWhatsApp] = useState(true);

  // Filter patients by query
  const filteredPatients = patientsList.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle Register New Patient
  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (!newName.trim()) { setRegError('Please enter full name'); return; }
    if (!newMobile.trim() || newMobile.length < 10) { setRegError('Please enter a valid 10-digit mobile number'); return; }

    const nameParts = newName.trim().split(' ');
    const initials = nameParts.length >= 2 
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : nameParts[0].substring(0, 2).toUpperCase();

    const newId = `PAT${Math.floor(100000 + Math.random() * 900000)}`;
    const createdPatient: PatientItem = {
      id: newId,
      name: newName.trim(),
      phone: `+91 ${newMobile.trim()}`,
      initials,
      color: 'bg-purple-100 text-[#7C3AED]',
      age: newAge ? parseInt(newAge, 10) : undefined,
      gender: newGender,
    };

    setPatientsList(prev => [createdPatient, ...prev]);
    setSelectedPatient(createdPatient);
    setIsRegisterMode(false);
    setNewName('');
    setNewAge('');
    setNewMobile('');
  };

  // Handle Final Create Appointment Submission
  const handleCreateAppointment = () => {
    if (!selectedPatient) return;

    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const dParts = appointmentDate.split('-');
    const displayDate = dParts.length === 3
      ? `${parseInt(dParts[2], 10)} ${MONTHS[parseInt(dParts[1], 10) - 1]} ${dParts[0]}`
      : appointmentDate;

    const existing: any[] = (() => {
      try { return JSON.parse(localStorage.getItem('vizito_appointments') ?? '[]'); }
      catch { return []; }
    })();

    const maxId = existing.reduce((max: number, a: any) => {
      const num = parseInt((a.id ?? '').replace(/\D/g, ''), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 0);

    const newApptId = `APT-${new Date().getFullYear()}-${String(maxId + 1).padStart(4, '0')}`;

    const newAppointment = {
      id: newApptId,
      patient: selectedPatient.name,
      patientName: selectedPatient.name,
      initials: selectedPatient.initials,
      avatarColor: selectedPatient.color,
      gender: selectedPatient.gender === 'Female' ? 'F' : 'M',
      age: selectedPatient.age || 35,
      patientId: selectedPatient.id,
      phone: selectedPatient.phone,
      date: displayDate,
      time: appointmentTime,
      timeSlot: appointmentTime,
      type: consultationType,
      location: clinic,
      branchName: clinic,
      status: 'Confirmed',
      paymentStatus: paymentMode === 'Free' ? 'Waived' : 'Pending',
      amount: parseInt(fee, 10) || 0,
      reason: reason || 'General Checkup',
      notes,
      timeline: [
        { label: 'Appointment Created', time: new Date().toLocaleString() }
      ],
      documents: [],
    };

    localStorage.setItem('vizito_appointments', JSON.stringify([...existing, newAppointment]));
    navigate('/appointments');
  };

  const formattedDate = appointmentDate
    ? new Date(appointmentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-fade">

      {/* ─── Header Navigation ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">New Appointment</h1>
          <nav className="flex items-center gap-1.5 mt-1 text-xs text-slate-400 font-semibold">
            <button onClick={() => navigate('/appointments')} className="hover:text-primary transition-colors">
              Appointment Management
            </button>
            <span>›</span>
            <span className="text-slate-600 font-bold">New Appointment</span>
          </nav>
        </div>
        <button
          onClick={() => navigate('/appointments')}
          className="inline-flex items-center gap-2 bg-white border border-slate-200/80 hover:border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Appointments</span>
        </button>
      </div>

      {/* ─── Responsive Grid Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* ── Left / Main Form Column ── */}
        <div className={`space-y-6 ${selectedPatient ? 'lg:col-span-8' : 'lg:col-span-12 max-w-4xl mx-auto w-full'}`}>

          {/* ─── CARD 1: Patient Information ─── */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 sm:p-7 transition-all">
            
            {/* Card Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#7C3AED] text-white text-xs font-black flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20">
                1
              </div>
              <div>
                <h2 className="text-base font-extrabold text-slate-800">Patient Information</h2>
                <p className="text-xs text-slate-500 font-medium">Select or register a patient for this consultation</p>
              </div>
            </div>

            {/* ── STATE A: Patient Selected ── */}
            {selectedPatient ? (
              <div className="bg-purple-50/80 border border-purple-200/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between animate-fade">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-sm shrink-0 shadow-xs ${selectedPatient.color}`}>
                    {selectedPatient.initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-extrabold text-slate-900 text-base">{selectedPatient.name}</h3>
                      <span className="text-[10px] font-black bg-[#7C3AED] text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        Selected Patient
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 mt-1">
                      {selectedPatient.phone} • <span className="font-mono text-[#7C3AED] font-bold">{selectedPatient.id}</span>
                      {selectedPatient.age ? ` • ${selectedPatient.age} yrs, ${selectedPatient.gender}` : ''}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedPatient(null); setSearchQuery(''); }}
                  className="bg-white hover:bg-purple-100/50 border border-purple-200 text-[#7C3AED] px-4 py-2 rounded-xl text-xs font-extrabold shadow-xs transition-all cursor-pointer shrink-0"
                >
                  Change Patient
                </button>
              </div>
            ) : isRegisterMode ? (
              /* ── STATE B: Register New Patient Form ── */
              <form onSubmit={handleRegisterPatient} className="space-y-4 animate-fade">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                  <h3 className="text-sm font-extrabold text-[#7C3AED] flex items-center gap-2">
                    <UserPlus className="w-4.5 h-4.5 text-[#7C3AED]" /> Register New Patient
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsRegisterMode(false)}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                {regError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{regError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="Enter patient full name"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-500/10 transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-1.5">Age</label>
                    <input
                      type="number"
                      value={newAge}
                      onChange={e => setNewAge(e.target.value)}
                      placeholder="e.g. 32"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-500/10 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-1.5">Gender</label>
                    <div className="flex bg-slate-100 p-1 rounded-xl gap-1 border border-slate-200/60">
                      {(['Male', 'Female', 'Other'] as const).map(g => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setNewGender(g)}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            newGender === g ? 'bg-[#7C3AED] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-1.5">Mobile Number *</label>
                  <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 focus-within:bg-white focus-within:border-[#7C3AED] focus-within:ring-4 focus-within:ring-purple-500/10 transition-all">
                    <span className="text-xs font-bold text-slate-500 mr-2.5">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      value={newMobile}
                      onChange={e => setNewMobile(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 10-digit mobile number"
                      className="w-full py-3 bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-3.5 rounded-xl font-extrabold text-xs shadow-md shadow-purple-500/20 transition-all cursor-pointer mt-2"
                >
                  Save & Select Patient
                </button>
              </form>
            ) : (
              /* ── STATE C: Search Patient Mode (Default) ── */
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search name, mobile or UHID..."
                    className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-500/10 transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Patient List Container */}
                {filteredPatients.length > 0 ? (
                  <div className="border border-slate-200/80 rounded-2xl overflow-hidden bg-white shadow-xs">
                    {/* Scrollable list (max-h 320px) */}
                    <div className="max-h-[320px] overflow-y-auto divide-y divide-slate-100">
                      {filteredPatients.map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => setSelectedPatient(p)}
                          className="w-full flex items-center justify-between p-4 hover:bg-purple-50/50 transition-colors text-left group cursor-pointer"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${p.color}`}>
                              {p.initials}
                            </div>
                            <div>
                              <p className="text-sm font-extrabold text-slate-800 group-hover:text-[#7C3AED] transition-colors">
                                {p.name}
                              </p>
                              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                                {p.phone} • <span className="font-mono text-xs">{p.id}</span>
                              </p>
                            </div>
                          </div>
                          <span className="text-xs font-extrabold text-[#7C3AED] bg-purple-50 group-hover:bg-[#7C3AED] group-hover:text-white px-3 py-1.5 rounded-lg transition-all">
                            Select
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Sticky Button: + Register New Patient */}
                    <div className="p-3 bg-slate-50 border-t border-slate-200/80">
                      <button
                        type="button"
                        onClick={() => setIsRegisterMode(true)}
                        className="w-full py-3 rounded-xl border-2 border-dashed border-[#7C3AED] text-[#7C3AED] hover:bg-purple-50 font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Register New Patient</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* "Not Found" State */
                  <div className="p-6 text-center bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-200/80 text-slate-500 flex items-center justify-center mx-auto">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-slate-800">Patient Not Found</p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">No existing record matches "{searchQuery}"</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setIsRegisterMode(true); setNewName(searchQuery); }}
                      className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-5 py-2.5 rounded-xl text-xs font-extrabold shadow-md shadow-purple-500/20 transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      Create New Patient
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ─── CONDITIONAL SECTIONS 2 & 3 (Visible ONLY when patient is selected) ─── */}
          {selectedPatient && (
            <>
              {/* ─── CARD 2: Appointment Details ─── */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 sm:p-7 space-y-6 animate-fade">
                {/* Card Header */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#7C3AED] text-white text-xs font-black flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20">
                    2
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-800">Appointment Details</h2>
                    <p className="text-xs text-slate-500 font-medium">Configure date, time, and consultation type</p>
                  </div>
                </div>

                {/* Clinic Dropdown */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-1.5">Clinic / Location</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#7C3AED] pointer-events-none" />
                    <select
                      value={clinic}
                      onChange={e => setClinic(e.target.value)}
                      className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-10 py-3 text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-500/10 cursor-pointer transition-all"
                    >
                      {isHospital
                        ? activeBranches.map(b => <option key={b.id} value={b.name}>{b.name}</option>)
                        : CLINICS.map(c => <option key={c} value={c}>{c}</option>)
                      }
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                {/* Consultation Type Selector */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-2">Consultation Type</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { id: 'Walk-In', label: 'Walk-In', icon: Footprints },
                      { id: 'In-Clinic', label: 'In-Clinic', icon: Building2 },
                      { id: 'Video Consultation', label: 'Video Call', icon: Video },
                      { id: 'Home Visit', label: 'Home Visit', icon: Home },
                    ].map(item => {
                      const IconComp = item.icon;
                      const isSelected = consultationType === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setConsultationType(item.id as any)}
                          className={`flex flex-col items-center justify-center p-3.5 rounded-xl border-2 transition-all cursor-pointer text-center gap-2 ${
                            isSelected
                              ? 'border-[#7C3AED] bg-purple-50 text-[#7C3AED] shadow-xs'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          <IconComp className={`w-5 h-5 ${isSelected ? 'text-[#7C3AED]' : 'text-slate-400'}`} />
                          <span className="text-xs font-bold">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Date & Time Pickers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-1.5">Appointment Date *</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input
                        type="date"
                        value={appointmentDate}
                        onChange={e => setAppointmentDate(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-500/10 cursor-pointer transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-1.5">Time Slot *</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <select
                        value={appointmentTime}
                        onChange={e => setAppointmentTime(e.target.value)}
                        className="w-full appearance-none pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 outline-none focus:bg-white focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-500/10 cursor-pointer transition-all"
                      >
                        {TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Duration Picker */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-2">Duration</label>
                  <div className="flex bg-slate-100 p-1 rounded-xl gap-1 border border-slate-200/60">
                    {DURATIONS.map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDuration(d)}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          duration === d ? 'bg-[#7C3AED] text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reason for Visit */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-1.5">Reason for Visit</label>
                  <textarea
                    rows={2}
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="Brief reason (optional)"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-500/10 resize-none transition-all"
                  />
                </div>
              </div>

              {/* ─── CARD 3: Billing & Notes ─── */}
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm p-6 sm:p-7 space-y-6 animate-fade">
                {/* Card Header */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#7C3AED] text-white text-xs font-black flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20">
                    3
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-slate-800">Billing & Notes</h2>
                    <p className="text-xs text-slate-500 font-medium">Fee, payment mode, and notifications</p>
                  </div>
                </div>

                {/* Consultation Fee Card */}
                <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 sm:p-5 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <p className="text-xs font-extrabold text-[#7C3AED] uppercase tracking-wider">Consultation Fee</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-2xl font-black text-slate-900">₹</span>
                      <input
                        type="number"
                        value={fee}
                        onChange={e => setFee(e.target.value)}
                        className="w-28 text-2xl font-black text-slate-900 bg-transparent outline-none border-b-2 border-purple-300 focus:border-[#7C3AED]"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white border border-purple-200 text-[#7C3AED] px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>Auto Loaded (From Profile)</span>
                  </div>
                </div>

                {/* Payment Mode */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-2">Payment Mode</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {PAYMENT_MODES.map(pm => (
                      <button
                        key={pm}
                        type="button"
                        onClick={() => setPaymentMode(pm)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          paymentMode === pm
                            ? 'bg-[#7C3AED] border-[#7C3AED] text-white shadow-xs'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                        }`}
                      >
                        {pm}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Internal Notes */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-1.5">Internal Notes</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Doctor or clinical staff notes (optional)"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#7C3AED] focus:ring-4 focus:ring-purple-500/10 resize-none transition-all"
                  />
                </div>

                {/* Notifications Checkboxes */}
                <div>
                  <label className="block text-xs font-extrabold text-slate-600 uppercase tracking-wider mb-2">Patient Notifications</label>
                  <div className="flex items-center gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex-wrap">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={sendSMS}
                        onChange={e => setSendSMS(e.target.checked)}
                        className="w-4 h-4 rounded text-[#7C3AED] border-slate-300 focus:ring-[#7C3AED] cursor-pointer"
                      />
                      <Smartphone className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-bold text-slate-800">SMS</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={sendEmail}
                        onChange={e => setSendEmail(e.target.checked)}
                        className="w-4 h-4 rounded text-[#7C3AED] border-slate-300 focus:ring-[#7C3AED] cursor-pointer"
                      />
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span className="text-xs font-bold text-slate-800">Email</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={sendWhatsApp}
                        onChange={e => setSendWhatsApp(e.target.checked)}
                        className="w-4 h-4 rounded text-[#7C3AED] border-slate-300 focus:ring-[#7C3AED] cursor-pointer"
                      />
                      <MessageSquare className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-slate-800">WhatsApp</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* ─── BOTTOM ACTION FOOTER ─── */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200/80">
                <button
                  type="button"
                  onClick={() => navigate('/appointments')}
                  className="px-5 py-3 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleCreateAppointment}
                  className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-7 py-3.5 rounded-xl font-extrabold text-xs flex items-center gap-2.5 shadow-lg shadow-purple-500/25 active:scale-95 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4.5 h-4.5 text-white" />
                  <span>Create Appointment</span>
                </button>
              </div>
            </>
          )}

        </div>

        {/* ── Right Column: Live Summary Sidebar (Visible when patient selected) ── */}
        {selectedPatient && (
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-6 animate-fade">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-extrabold text-slate-800 border-b border-slate-100 pb-3">
                Live Appointment Summary
              </h3>

              {/* Patient Badge */}
              <div className="flex items-center gap-3 bg-purple-50/60 p-3 rounded-xl border border-purple-100">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${selectedPatient.color}`}>
                  {selectedPatient.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-extrabold text-slate-900 truncate">{selectedPatient.name}</p>
                  <p className="text-[11px] font-semibold text-slate-500 truncate">{selectedPatient.phone}</p>
                </div>
              </div>

              {/* Summary Items */}
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinic Location</span>
                    <span className="font-bold text-slate-800">{clinic}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Stethoscope className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Consultation Type</span>
                    <span className="font-bold text-slate-800">{consultationType}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date & Time</span>
                    <span className="font-bold text-slate-800">{formattedDate} at {appointmentTime}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration</span>
                    <span className="font-bold text-slate-800">{duration}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-2 border-t border-slate-100">
                  <CreditCard className="w-4 h-4 text-[#7C3AED] mt-0.5 shrink-0" />
                  <div className="flex-1 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fee ({paymentMode})</span>
                      <span className="font-extrabold text-slate-900 text-sm">₹{fee || '0'}</span>
                    </div>
                    <span className="text-[10px] font-bold bg-purple-100 text-[#7C3AED] px-2 py-0.5 rounded-md">
                      Auto-Calc
                    </span>
                  </div>
                </div>
              </div>

              {/* Instant Action */}
              <button
                type="button"
                onClick={handleCreateAppointment}
                className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-purple-500/20 active:scale-95 transition-all cursor-pointer mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Create</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
