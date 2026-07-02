import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Pencil, MoreVertical,
  Phone, Mail, MapPin, User, Calendar, Droplet,
  Ruler, Weight, Heart, Pill, Activity,
  ShieldAlert, HeartPulse, FileText, ClipboardList,
  RotateCcw, BookOpen, Users, ChevronRight,
  Building2, CheckCircle2, Clock, Plus,
  AlertCircle,
} from 'lucide-react';

// ─── Patient mock data ────────────────────────────────────────────────────────
const PATIENTS: Record<string, PatientData> = {
  'PAT123456': {
    id: 'PAT123456',
    name: 'Amit Sharma',
    initials: 'AS',
    avatarColor: 'bg-teal-100 text-teal-700',
    gender: 'Male',
    age: 32,
    dob: '15 Jan 1993',
    phone: '+91 98765 43210',
    email: 'amit.sharma@email.com',
    address: 'H.No. 12-3-45, Banjara Hills, Hyderabad, Telangana - 500034',
    bloodGroup: 'B+',
    height: '175 cm',
    weight: '72 kg',
    allergies: 'Penicillin',
    maritalStatus: 'Married',
    totalAppointments: 18,
    totalPrescriptions: 12,
    ongoingTreatments: 2,
    lastVisit: '28 May 2025',
    lastVisitType: 'In-Clinic Consultation',
    chronicConditions: [
      { name: 'Hypertension', since: '2021', color: 'bg-red-50 text-red-700 border-red-200' },
      { name: 'Type 2 Diabetes', since: '2022', color: 'bg-amber-50 text-amber-700 border-amber-200' },
      { name: 'Asthma', since: '2018', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    ],
    medications: [
      { name: 'Telmisartan 40mg', frequency: 'Once daily' },
      { name: 'Metformin 500mg', frequency: 'Twice daily after meals' },
      { name: 'Montelukast 10mg', frequency: 'Once daily at night' },
    ],
    recentAppointment: {
      date: '28 May 2025',
      time: '11:30 AM - 12:00 PM (30 mins)',
      type: 'In-Clinic Consultation',
      location: 'Banjara Hills Clinic',
      status: 'Completed',
      reason: 'Chest pain and breathlessness',
    },
    emergency: {
      name: 'Rahul Sharma (Brother)',
      phone: '+91 91234 56789',
    },
    notes: 'Patient is responding well to treatment. Monitor BP and sugar levels regularly.',
    notesDate: '10 May 2025',
    notesByDoctor: 'Dr. Arjun Reddy',
  },
  'PAT123457': {
    id: 'PAT123457',
    name: 'Neha Singh',
    initials: 'NS',
    avatarColor: 'bg-pink-100 text-pink-700',
    gender: 'Female',
    age: 27,
    dob: '08 Mar 1998',
    phone: '+91 87654 32109',
    email: 'neha.singh@email.com',
    address: 'Flat 4B, Jubilee Hills, Hyderabad, Telangana - 500033',
    bloodGroup: 'O+',
    height: '162 cm',
    weight: '58 kg',
    allergies: 'None',
    maritalStatus: 'Single',
    totalAppointments: 12,
    totalPrescriptions: 8,
    ongoingTreatments: 1,
    lastVisit: '25 May 2025',
    lastVisitType: 'Video Consultation',
    chronicConditions: [],
    medications: [
      { name: 'Atorvastatin 10mg', frequency: 'Once daily at night' },
    ],
    recentAppointment: {
      date: '25 May 2025',
      time: '10:00 AM - 10:30 AM (30 mins)',
      type: 'Video Consultation',
      location: 'Online',
      status: 'Completed',
      reason: 'Routine cardiac checkup',
    },
    emergency: {
      name: 'Kavita Singh (Mother)',
      phone: '+91 98765 11111',
    },
    notes: 'Lipid levels improving. Continue current medication.',
    notesDate: '25 May 2025',
    notesByDoctor: 'Dr. Arjun Reddy',
  },
};

interface PatientData {
  id: string; name: string; initials: string; avatarColor: string;
  gender: string; age: number; dob: string; phone: string; email: string;
  address: string; bloodGroup: string; height: string; weight: string;
  allergies: string; maritalStatus: string; totalAppointments: number;
  totalPrescriptions: number; ongoingTreatments: number; lastVisit: string;
  lastVisitType: string;
  chronicConditions: { name: string; since: string; color: string }[];
  medications: { name: string; frequency: string }[];
  recentAppointment: { date: string; time: string; type: string; location: string; status: string; reason: string };
  emergency: { name: string; phone: string };
  notes: string; notesDate: string; notesByDoctor: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) => (
  <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
    <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
    <div className="flex items-start gap-2 flex-1 min-w-0">
      <span className="text-xs text-slate-400 font-medium shrink-0 w-28">{label}</span>
      <span className="text-sm font-semibold text-slate-800 break-words min-w-0 flex-1">{value}</span>
    </div>
  </div>
);

const HealthCard = ({ icon: Icon, iconBg, iconColor, label, value, sub }: {
  icon: React.ElementType; iconBg: string; iconColor: string; label: string; value: string; sub: string;
}) => (
  <div className={`rounded-2xl p-4 flex items-center gap-3 ${iconBg} bg-opacity-30`} style={{ background: 'white', border: '1px solid #e2e8f0' }}>
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
      <Icon className={`w-5 h-5 ${iconColor}`} />
    </div>
    <div>
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <p className="text-xl font-extrabold text-slate-800 leading-tight">{value}</p>
      <p className="text-[11px] text-slate-400">{sub}</p>
    </div>
  </div>
);

const TABS = ['Overview', 'Appointments', 'Prescriptions', 'Medical History', 'Reports', 'Follow-Ups', 'Personal Details'];

// ─── Overview Tab ─────────────────────────────────────────────────────────────
const OverviewTab = ({ patient, navigate }: { patient: PatientData; navigate: ReturnType<typeof useNavigate> }) => (
  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

    {/* Left: Basic Information */}
    <div className="lg:col-span-4 space-y-5">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-3">Basic Information</h3>
        <div>
          <InfoRow icon={User} label="Full Name" value={patient.name} />
          <InfoRow icon={Calendar} label="Date of Birth" value={patient.dob} />
          <InfoRow icon={Clock} label="Age" value={`${patient.age} Years`} />
          <InfoRow icon={User} label="Gender" value={patient.gender} />
          <InfoRow icon={Phone} label="Mobile Number" value={patient.phone} />
          <InfoRow icon={Mail} label="Email Address" value={patient.email} />
          <InfoRow icon={MapPin} label="Address" value={patient.address} />
          <InfoRow icon={Droplet} label="Blood Group" value={patient.bloodGroup} />
          <InfoRow icon={Ruler} label="Height" value={patient.height} />
          <InfoRow icon={Weight} label="Weight" value={patient.weight} />
        </div>
      </div>

      {/* Chronic Conditions */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-3">Chronic Conditions</h3>
        {patient.chronicConditions.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No chronic conditions recorded.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {patient.chronicConditions.map(c => (
              <div key={c.name} className={`flex items-center gap-2 border rounded-xl px-3 py-1.5 ${c.color}`}>
                <span className="text-xs font-bold">{c.name}</span>
                <span className="text-[10px] font-medium opacity-70">Since {c.since}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Current Medications */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-3">Current Medications</h3>
        <div className="space-y-3">
          {patient.medications.map((med, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-0.5" />
              <div className="flex-1 flex items-center justify-between gap-3">
                <span className="text-sm font-semibold text-slate-800">{med.name}</span>
                <span className="text-xs text-slate-400 text-right">{med.frequency}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Middle: Health Summary */}
    <div className="lg:col-span-4 space-y-5">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4">Health Summary</h3>
        <div className="grid grid-cols-2 gap-3">
          <HealthCard
            icon={Heart} iconBg="bg-rose-50" iconColor="text-rose-500"
            label="Total Appointments" value={String(patient.totalAppointments)} sub="With you"
          />
          <div className="bg-blue-50 border border-slate-200 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <ClipboardList className="w-4 h-4 text-blue-500" />
              <span className="text-xs text-slate-500 font-medium">Last Visit</span>
            </div>
            <p className="text-base font-extrabold text-slate-800 leading-tight">{patient.lastVisit}</p>
            <p className="text-[11px] text-blue-600 font-semibold mt-0.5">{patient.lastVisitType}</p>
          </div>
          <HealthCard
            icon={FileText} iconBg="bg-purple-50" iconColor="text-purple-500"
            label="Total Prescriptions" value={String(patient.totalPrescriptions)} sub="With you"
          />
          <HealthCard
            icon={Activity} iconBg="bg-amber-50" iconColor="text-amber-500"
            label="Ongoing Treatments" value={String(patient.ongoingTreatments)} sub="Active"
          />
        </div>
      </div>
    </div>

    {/* Right: Recent Appointment + Emergency + Notes */}
    <div className="lg:col-span-4 space-y-4">
      {/* Recent Appointment */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-3">Recent Appointment</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-bold text-slate-800">{patient.recentAppointment.date}</span>
            </div>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${
              patient.recentAppointment.status === 'Completed'
                ? 'bg-teal-50 text-teal-700'
                : 'bg-amber-50 text-amber-700'
            }`}>
              {patient.recentAppointment.status}
            </span>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1.5 pl-6">
            <Clock className="w-3 h-3" />
            {patient.recentAppointment.time}
          </p>
          <p className="text-xs text-slate-500 pl-6">{patient.recentAppointment.type}</p>
          <p className="text-xs text-slate-500 flex items-center gap-1 pl-6">
            <Building2 className="w-3 h-3 text-slate-400" />
            {patient.recentAppointment.location}
          </p>
          <div className="pl-6 pt-1">
            <p className="text-[11px] text-slate-400 font-medium">Reason for Visit</p>
            <p className="text-xs font-semibold text-slate-700">{patient.recentAppointment.reason}</p>
          </div>
        </div>
        <button className="mt-4 w-full border border-teal-200 text-teal-700 hover:bg-teal-50 text-xs font-bold py-2.5 rounded-xl transition-colors">
          View Appointment Details
        </button>
      </div>

      {/* Emergency Contact */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-3">Emergency Contact</h3>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-slate-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">{patient.emergency.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">{patient.emergency.phone}</p>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-bold text-slate-800">Notes (Internal)</h3>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">{patient.notes}</p>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <p className="text-[10px] text-slate-400">Last updated on {patient.notesDate}</p>
          <p className="text-[10px] text-slate-400">By {patient.notesByDoctor}</p>
        </div>
      </div>
    </div>
  </div>
);

// ─── Placeholder Tab ──────────────────────────────────────────────────────────
const PlaceholderTab = ({ label }: { label: string }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-16 shadow-sm text-center">
    <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <ClipboardList className="w-8 h-8 text-teal-400" />
    </div>
    <h3 className="text-base font-bold text-slate-700">{label}</h3>
    <p className="text-sm text-slate-400 mt-1">This section is coming soon.</p>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PatientDetailScreen() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');

  const patient = PATIENTS[patientId ?? 'PAT123456'] ?? PATIENTS['PAT123456'];

  return (
    <div className="space-y-5 pb-10">
      {/* ─── Top Bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Appointments
        </button>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all">
            <Pencil className="w-3.5 h-3.5" />
            Edit Profile
          </button>
          <button className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors shadow-sm">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── Patient Header Card ──────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          {/* Avatar + Info */}
          <div className="flex items-start gap-5 flex-1">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-extrabold shrink-0 ${patient.avatarColor}`}>
              {patient.initials}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-extrabold text-slate-800">{patient.name}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-slate-500">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {patient.gender}
                </span>
                <span className="text-slate-300">•</span>
                <span>{patient.age} Years</span>
                <span className="text-slate-300">•</span>
                <span>{patient.dob}</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-2.5">
                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{patient.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <ClipboardList className="w-3.5 h-3.5 text-slate-400" />
                  <span>{patient.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center gap-6 sm:gap-8 shrink-0 py-2 sm:border-l sm:border-slate-100 sm:pl-6">
            <div className="text-center">
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Blood Group</p>
              <p className="text-lg font-extrabold text-slate-800 mt-0.5">{patient.bloodGroup}</p>
            </div>
            <div className="text-center">
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Allergies</p>
              <p className="text-base font-bold text-rose-600 mt-0.5">{patient.allergies}</p>
            </div>
            <div className="text-center">
              <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wide">Marital Status</p>
              <p className="text-base font-bold text-slate-800 mt-0.5">{patient.maritalStatus}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Tab Navigation ───────────────────────────────────────────────── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-end gap-0 px-2 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab
                  ? 'border-teal-600 text-teal-700'
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Tab Content ──────────────────────────────────────────────────── */}
      {activeTab === 'Overview' && <OverviewTab patient={patient} navigate={navigate} />}
      {activeTab === 'Appointments' && <PlaceholderTab label="Appointment History" />}
      {activeTab === 'Prescriptions' && <PlaceholderTab label="Prescriptions" />}
      {activeTab === 'Medical History' && <PlaceholderTab label="Medical History" />}
      {activeTab === 'Reports' && <PlaceholderTab label="Reports & Lab Results" />}
      {activeTab === 'Follow-Ups' && <PlaceholderTab label="Follow-Up Schedule" />}
      {activeTab === 'Personal Details' && <PlaceholderTab label="Personal Details" />}
    </div>
  );
}
