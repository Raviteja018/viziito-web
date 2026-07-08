import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  ArrowLeft, Pencil, MoreVertical,
  Phone, Mail, MapPin, User, Calendar, Droplet,
  Ruler, Weight, Heart, Pill, Activity,
  ShieldAlert, HeartPulse, FileText, ClipboardList,
  RotateCcw, BookOpen, Users, ChevronRight,
  Building2, CheckCircle2, Clock, Plus,
  AlertCircle, X, Download, Eye, Send, Printer
} from 'lucide-react';

// ─── Patient initial mock data ────────────────────────────────────────────────
const INITIAL_PATIENT_DETAILS: Record<string, PatientData> = {
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
    name: 'Priya Singh',
    initials: 'PS',
    avatarColor: 'bg-pink-100 text-pink-700',
    gender: 'Female',
    age: 28,
    dob: '08 Mar 1998',
    phone: '+91 91234 56789',
    email: 'priya.singh@email.com',
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

interface Appointment {
  id: string;
  date: string;
  time: string;
  type: string;
  doctor: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  reason: string;
}

interface PrescriptionItem {
  id: string;
  date: string;
  diagnosis: string;
  medications: string[];
  status: 'Sent' | 'Draft' | 'Expired';
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
  <div className="rounded-2xl p-4 flex items-center gap-3 bg-white border border-slate-200">
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

const TABS = ['Overview', 'Appointments', 'Prescriptions', 'Medical History', 'Reports', 'Personal Details'];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PatientDetailScreen() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const activeId = patientId ?? 'PAT123456';

  const [activeTab, setActiveTab] = useState('Overview');
  const [patient, setPatient] = useState<PatientData | null>(null);

  // Lists
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([]);

  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isApptModalOpen, setIsApptModalOpen] = useState(false);
  const [isViewRxModalOpen, setIsViewRxModalOpen] = useState(false);
  const [selectedRx, setSelectedRx] = useState<any>(null);
  const [isCreateRxModalOpen, setIsCreateRxModalOpen] = useState(false);

  // Forms state via Formik
  const editFormik = useFormik({
    initialValues: {
      name: '', dob: '', gender: 'Male', phone: '', email: '',
      address: '', bloodGroup: 'B+', height: '', weight: '',
      allergies: 'None', maritalStatus: 'Single', emergencyName: '', emergencyPhone: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      phone: Yup.string().required('Phone is required')
    }),
    onSubmit: (values) => {
      handleEditSubmit(values);
    }
  });

  const apptFormik = useFormik({
    initialValues: {
      date: '', time: '', type: 'In-Clinic Consultation', reason: ''
    },
    validationSchema: Yup.object({
      date: Yup.string().required('Date is required'),
      time: Yup.string().required('Time is required')
    }),
    onSubmit: (values) => {
      handleApptSubmit(values);
    }
  });

  const rxFormik = useFormik({
    initialValues: {
      diagnosis: ''
    },
    validationSchema: Yup.object({
      diagnosis: Yup.string().required('Diagnosis is required')
    }),
    onSubmit: (values) => {
      handleCreateRxSubmit(values);
    }
  });
  const [rxMeds, setRxMeds] = useState<{ name: string; dosage: string; frequency: string; duration: string }[]>([]);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('');
  const [newMedDur, setNewMedDur] = useState('');

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Load Patient Detail records from LocalStorage
  useEffect(() => {
    // Details
    const savedDetails = localStorage.getItem('vizito_patient_details');
    let loadedDetail: PatientData | null = null;
    let detailsDict: Record<string, PatientData> = {};

    if (savedDetails) {
      try {
        detailsDict = JSON.parse(savedDetails);
        loadedDetail = detailsDict[activeId] || null;
      } catch (err) { }
    }

    if (!loadedDetail) {
      // Fallback
      loadedDetail = INITIAL_PATIENT_DETAILS[activeId] || {
        id: activeId,
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
          { name: 'Hypertension', since: '2021', color: 'bg-red-50 text-red-700 border-red-200' }
        ],
        medications: [
          { name: 'Telmisartan 40mg', frequency: 'Once daily' }
        ],
        recentAppointment: { date: '28 May 2025', time: '11:30 AM', type: 'In-Clinic', location: 'Clinic', status: 'Completed', reason: 'BP Check' },
        emergency: { name: 'Rahul Sharma', phone: '+91 91234 56789' },
        notes: 'Regular checkup.',
        notesDate: '28 May 2025',
        notesByDoctor: 'Dr. Arjun Reddy'
      };

      // Add to store
      detailsDict[activeId] = loadedDetail;
      localStorage.setItem('vizito_patient_details', JSON.stringify(detailsDict));
    }

    setPatient(loadedDetail);

    // Load local appointments or generate mock list
    const apptKey = `vizito_appts_${activeId}`;
    const savedAppts = localStorage.getItem(apptKey);
    if (savedAppts) {
      try { setAppointments(JSON.parse(savedAppts)); } catch (err) { }
    } else {
      const mockAppts: Appointment[] = [
        { id: 'APT-98210', date: '28 May 2025', time: '11:30 AM - 12:00 PM', type: 'In-Clinic Consultation', doctor: 'Dr. Arjun Reddy', status: 'Completed', reason: 'Chest pain and breathlessness' },
        { id: 'APT-97120', date: '10 May 2025', time: '02:00 PM - 02:30 PM', type: 'Video Consultation', doctor: 'Dr. Arjun Reddy', status: 'Completed', reason: 'Followup for hypertension control' },
        { id: 'APT-96301', date: '12 Apr 2025', time: '10:00 AM - 10:30 AM', type: 'In-Clinic Consultation', doctor: 'Dr. Arjun Reddy', status: 'Completed', reason: 'First intake checkup' }
      ];
      setAppointments(mockAppts);
      localStorage.setItem(apptKey, JSON.stringify(mockAppts));
    }

    // Load prescriptions for this patient
    const savedGlobalRx = localStorage.getItem('vizito_prescriptions');
    let matchingRx: PrescriptionItem[] = [];
    if (savedGlobalRx) {
      try {
        const allRx = JSON.parse(savedGlobalRx);
        matchingRx = allRx
          .filter((r: any) => r.patientId === activeId)
          .map((r: any) => ({
            id: r.id,
            date: r.date,
            diagnosis: r.diagnosis,
            medications: r.medications ? r.medications.map((m: any) => m.name) : ['Paracetamol 650mg'],
            status: r.status
          }));
      } catch (err) { }
    }

    if (matchingRx.length === 0) {
      // Setup mock patient-specific prescriptions
      matchingRx = [
        { id: 'RX-2025-0007', date: '28 May 2025', diagnosis: 'Acute Bronchitis', medications: ['Azithromycin 500mg', 'Paracetamol 650mg'], status: 'Sent' },
        { id: 'RX-2025-0005', date: '20 May 2025', diagnosis: 'Essential Hypertension', medications: ['Telmisartan 40mg'], status: 'Sent' },
        { id: 'RX-2025-0003', date: '15 May 2025', diagnosis: 'Gastroesophageal Reflux', medications: ['Pantoprazole 40mg'], status: 'Expired' }
      ];
    }
    setPrescriptions(matchingRx);
  }, [activeId]);

  // Handle opening edit profile modal
  const handleOpenEdit = () => {
    if (!patient) return;
    editFormik.setValues({
      name: patient.name,
      dob: patient.dob,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email,
      address: patient.address,
      bloodGroup: patient.bloodGroup,
      height: patient.height.replace(' cm', ''),
      weight: patient.weight.replace(' kg', ''),
      allergies: patient.allergies,
      maritalStatus: patient.maritalStatus,
      emergencyName: patient.emergency.name,
      emergencyPhone: patient.emergency.phone
    });
    setIsEditModalOpen(true);
  };

  // Submit edit profile
  const handleEditSubmit = (values: any) => {
    if (!patient) return;

    const names = values.name.trim().split(' ');
    const initials = names.length > 1 ? (names[0][0] + names[names.length - 1][0]).toUpperCase() : names[0][0].toUpperCase();

    const updatedPatient: PatientData = {
      ...patient,
      name: values.name,
      dob: values.dob,
      gender: values.gender,
      initials,
      phone: values.phone,
      email: values.email,
      address: values.address,
      bloodGroup: values.bloodGroup,
      height: `${values.height} cm`,
      weight: `${values.weight} kg`,
      allergies: values.allergies,
      maritalStatus: values.maritalStatus,
      emergency: {
        name: values.emergencyName,
        phone: values.emergencyPhone
      }
    };

    setPatient(updatedPatient);

    // Save back to details list in localStorage
    const savedDetails = localStorage.getItem('vizito_patient_details');
    if (savedDetails) {
      try {
        const detailsDict = JSON.parse(savedDetails);
        detailsDict[activeId] = updatedPatient;
        localStorage.setItem('vizito_patient_details', JSON.stringify(detailsDict));
      } catch (err) { }
    }

    // Sync back basic list in localStorage
    const savedBasic = localStorage.getItem('vizito_patients');
    if (savedBasic) {
      try {
        const basicList = JSON.parse(savedBasic);
        const updatedBasic = basicList.map((p: any) => {
          if (p.id === activeId) {
            return {
              ...p,
              name: values.name,
              initials,
              phone: values.phone,
              email: values.email,
              gender: values.gender
            };
          }
          return p;
        });
        localStorage.setItem('vizito_patients', JSON.stringify(updatedBasic));
      } catch (err) { }
    }

    setIsEditModalOpen(false);
    showToast('Patient details updated successfully.');
  };

  // Submit new appointment
  const handleApptSubmit = (values: any) => {
    const newAppt: Appointment = {
      id: `APT-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date(values.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: values.time,
      type: values.type,
      doctor: 'Dr. Arjun Reddy',
      status: 'Upcoming',
      reason: values.reason || 'Regular medical checkup'
    };

    const updated = [newAppt, ...appointments];
    setAppointments(updated);
    localStorage.setItem(`vizito_appts_${activeId}`, JSON.stringify(updated));

    // Update stats
    if (patient) {
      const updatedPat = {
        ...patient,
        totalAppointments: patient.totalAppointments + 1
      };
      setPatient(updatedPat);
      const savedDetails = localStorage.getItem('vizito_patient_details');
      if (savedDetails) {
        try {
          const dict = JSON.parse(savedDetails);
          dict[activeId] = updatedPat;
          localStorage.setItem('vizito_patient_details', JSON.stringify(dict));
        } catch (err) { }
      }
    }

    setIsApptModalOpen(false);
    apptFormik.resetForm();
    showToast('New appointment scheduled successfully.');
  };

  // View prescription in modal Rx pad
  const openViewRx = (rxId: string) => {
    // Try finding details in global prescriptions
    const savedGlobalRx = localStorage.getItem('vizito_prescriptions');
    let rxRecord: any = null;
    if (savedGlobalRx) {
      try {
        const list = JSON.parse(savedGlobalRx);
        rxRecord = list.find((r: any) => r.id === rxId);
      } catch (e) { }
    }

    if (!rxRecord) {
      // fallback mock prescription details
      const meds = rxId === 'RX-2025-0007' ? [
        { name: 'Azithromycin 500mg', dosage: '500mg', frequency: 'Once daily after food', duration: '5 Days' },
        { name: 'Paracetamol 650mg', dosage: '650mg', frequency: 'Thrice daily if fever', duration: '3 Days' },
      ] : [
        { name: 'Telmisartan 40mg', dosage: '40mg', frequency: 'Once daily after food', duration: 'Continuous' }
      ];

      rxRecord = {
        id: rxId,
        patient: patient?.name,
        patientId: activeId,
        age: patient?.age,
        gender: patient?.gender,
        date: '28 May 2025',
        time: '11:30 AM',
        diagnosis: rxId === 'RX-2025-0007' ? 'Acute Bronchitis' : 'Hypertension',
        medications: meds
      };
    }

    setSelectedRx(rxRecord);
    setIsViewRxModalOpen(true);
  };

  // Medication add/remove for builder
  const addRxMed = () => {
    if (!newMedName) return;
    setRxMeds(prev => [...prev, {
      name: newMedName,
      dosage: newMedDosage || '500mg',
      frequency: newMedFreq || 'Once daily',
      duration: newMedDur || '5 Days'
    }]);
    setNewMedName('');
    setNewMedDosage('');
    setNewMedFreq('');
    setNewMedDur('');
  };

  // Submit prescription modal
  const handleCreateRxSubmit = (values: any) => {
    const rxId = `RX-2025-${Math.floor(1000 + Math.random() * 9000)}`;
    const rxDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const rxTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Save to patient local page state
    const newRxItem: PrescriptionItem = {
      id: rxId,
      date: rxDate,
      diagnosis: values.diagnosis,
      medications: rxMeds.map(m => m.name),
      status: 'Sent'
    };
    setPrescriptions(prev => [newRxItem, ...prev]);

    // 2. Save to global vizito_prescriptions in localStorage
    const savedGlobal = localStorage.getItem('vizito_prescriptions');
    let allRxList: any[] = [];
    if (savedGlobal) {
      try { allRxList = JSON.parse(savedGlobal); } catch (err) { }
    }
    const fullRxRecord = {
      id: rxId,
      patient: patient?.name,
      patientId: activeId,
      initials: patient?.initials || 'AS',
      age: patient?.age || 30,
      gender: patient?.gender || 'Male',
      date: rxDate,
      time: rxTime,
      diagnosis: values.diagnosis,
      status: 'Sent',
      medications: rxMeds.length > 0 ? rxMeds : [{ name: 'Standard Antibiotics', dosage: '500mg', frequency: 'Once daily', duration: '5 Days' }]
    };
    allRxList.unshift(fullRxRecord);
    localStorage.setItem('vizito_prescriptions', JSON.stringify(allRxList));

    // 3. Update patient counts
    if (patient) {
      const updatedPat = {
        ...patient,
        totalPrescriptions: patient.totalPrescriptions + 1
      };
      setPatient(updatedPat);
      const savedDetails = localStorage.getItem('vizito_patient_details');
      if (savedDetails) {
        try {
          const dict = JSON.parse(savedDetails);
          dict[activeId] = updatedPat;
          localStorage.setItem('vizito_patient_details', JSON.stringify(dict));
        } catch (err) { }
      }
    }

    setIsCreateRxModalOpen(false);
    rxFormik.resetForm();
    setRxMeds([]);
    showToast(`Prescription ${rxId} generated successfully.`);
  };

  const handleDownloadReport = (reportName: string) => {
    showToast(`Downloading report: ${reportName}...`, 'info');
    setTimeout(() => {
      showToast(`${reportName} downloaded successfully.`);
    }, 1000);
  };

  if (!patient) {
    return (
      <div className="py-16 text-center text-slate-500 font-semibold animate-fade">
        Loading patient records...
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-10">

      {/* ─── Toast Alerts ──────────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade flex items-center gap-3 bg-slate-900 border border-slate-800 text-white px-5 py-3.5 rounded-2xl shadow-xl max-w-sm">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <Clock className="w-5 h-5 text-sky-400 shrink-0 animate-spin" />
          )}
          <span className="text-xs font-bold leading-normal">{toast.message}</span>
        </div>
      )}

      {/* ─── Top Bar ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={() => navigate('/patients')}
          className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-teal-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Patients List
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenEdit}
            className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all cursor-pointer"
          >
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
              className={`px-4 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all cursor-pointer ${activeTab === tab
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
      {activeTab === 'Overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

          {/* Left: Basic Information */}
          <div className="lg:col-span-4 space-y-5 animate-fade">
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
                {patient.medications.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No daily routine medications recorded.</p>
                ) : (
                  patient.medications.map((med, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0 mt-0.5" />
                      <div className="flex-1 flex items-center justify-between gap-3">
                        <span className="text-sm font-semibold text-slate-800">{med.name}</span>
                        <span className="text-xs text-slate-400 text-right">{med.frequency}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Middle: Health Summary */}
          <div className="lg:col-span-4 space-y-5 animate-fade">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-4">Health Summary</h3>
              <div className="grid grid-cols-2 gap-3">
                <HealthCard
                  icon={Heart} iconBg="bg-rose-50" iconColor="text-rose-500"
                  label="Total Appointments" value={String(appointments.length)} sub="With you"
                />
                <div className="bg-blue-50 border border-slate-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <ClipboardList className="w-4 h-4 text-blue-500" />
                    <span className="text-xs text-slate-500 font-medium">Last Visit</span>
                  </div>
                  <p className="text-base font-extrabold text-slate-800 leading-tight">
                    {appointments.length > 0 ? appointments[0].date : patient.lastVisit}
                  </p>
                  <p className="text-[11px] text-blue-600 font-semibold mt-0.5">
                    {appointments.length > 0 ? appointments[0].type : patient.lastVisitType}
                  </p>
                </div>
                <HealthCard
                  icon={FileText} iconBg="bg-purple-50" iconColor="text-purple-500"
                  label="Total Prescriptions" value={String(prescriptions.length)} sub="Issued"
                />
                <HealthCard
                  icon={Activity} iconBg="bg-amber-50" iconColor="text-amber-500"
                  label="Ongoing Treatments" value={String(patient.ongoingTreatments)} sub="Active"
                />
              </div>
            </div>
          </div>

          {/* Right: Recent Appointment + Emergency + Notes */}
          <div className="lg:col-span-4 space-y-4 animate-fade">
            {/* Recent Appointment */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 mb-3">Recent Appointment</h3>
              {appointments.length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-teal-600" />
                      <span className="text-sm font-bold text-slate-800">{appointments[0].date}</span>
                    </div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${appointments[0].status === 'Upcoming'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-teal-50 text-teal-700'
                      }`}>
                      {appointments[0].status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 pl-6">
                    <Clock className="w-3 h-3" />
                    {appointments[0].time}
                  </p>
                  <p className="text-xs text-slate-500 pl-6">{appointments[0].type}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1 pl-6">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    {appointments[0].doctor}
                  </p>
                  <div className="pl-6 pt-1">
                    <p className="text-[11px] text-slate-400 font-medium">Reason for Visit</p>
                    <p className="text-xs font-semibold text-slate-700">{appointments[0].reason}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No appointments registered.</p>
              )}
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
      )}

      {/* APPOINTMENTS TAB */}
      {activeTab === 'Appointments' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-fade">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800">Appointment History</h3>
            <button
              onClick={() => setIsApptModalOpen(true)}
              className="btn btn-primary py-2 px-4 text-xs flex items-center gap-1 cursor-pointer shadow-sm shadow-teal-500/20"
            >
              <Plus className="w-4 h-4" /> Book Appointment
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3">Appt ID</th>
                  <th className="py-3">Date & Time</th>
                  <th className="py-3">Type</th>
                  <th className="py-3">Doctor</th>
                  <th className="py-3">Reason</th>
                  <th className="py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {appointments.map(appt => (
                  <tr key={appt.id}>
                    <td className="py-3.5 font-mono text-slate-500">{appt.id}</td>
                    <td className="py-3.5">
                      <p className="font-bold text-slate-800">{appt.date}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{appt.time}</p>
                    </td>
                    <td className="py-3.5">{appt.type}</td>
                    <td className="py-3.5 text-slate-600">{appt.doctor}</td>
                    <td className="py-3.5 max-w-[200px] truncate" title={appt.reason}>{appt.reason}</td>
                    <td className="py-3.5">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${appt.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                          appt.status === 'Upcoming' ? 'bg-amber-50 text-amber-700' :
                            'bg-rose-50 text-rose-700'
                        }`}>
                        {appt.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PRESCRIPTIONS TAB */}
      {activeTab === 'Prescriptions' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-fade">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800">Issued Prescriptions</h3>
            <button
              onClick={() => setIsCreateRxModalOpen(true)}
              className="btn btn-primary py-2 px-4 text-xs flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Prescription
            </button>
          </div>

          {prescriptions.length === 0 ? (
            <p className="text-slate-400 text-xs italic text-center py-10">No prescriptions issued to this patient.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {prescriptions.map(rx => (
                <div key={rx.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800">{rx.id}</span>
                      <span className="text-[11px] text-slate-400 font-semibold">{rx.date}</span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 border text-slate-500`}>{rx.status}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-700 mt-1">Diagnosis: {rx.diagnosis}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                      Meds: {rx.medications.join(', ')}
                    </p>
                  </div>
                  <button
                    onClick={() => openViewRx(rx.id)}
                    className="btn btn-secondary py-1.5 px-3 text-xs flex items-center gap-1 bg-white hover:bg-slate-50 cursor-pointer shadow-xs border-slate-200 shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Rx
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MEDICAL HISTORY TAB */}
      {activeTab === 'Medical History' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-fade">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">Clinical Medical History</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                <HeartPulse className="w-5 h-5 text-rose-500" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-800">Cardiovascular History</h4>
                <p className="text-xs text-slate-500 mt-0.5">Diagnosed with Stage 1 Hypertension in 2021. Managed with Telmisartan 40mg daily. Complained of minor breathlessness during exertion.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                <Activity className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-800">Endocrine History</h4>
                <p className="text-xs text-slate-500 mt-0.5">Diagnosed with borderline Type 2 Diabetes in 2022. Stabilized with diet, exercise, and Metformin 500mg daily. Last HbA1c: 6.4%.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-800">Allergies & Drug Sensitivities</h4>
                <p className="text-xs text-slate-500 mt-0.5">Patient reports penicillin allergy, resulting in mild urticaria/rash. Avoid beta-lactam antibiotics; prefer macrolides (e.g. Azithromycin).</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORTS TAB */}
      {activeTab === 'Reports' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-fade">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">Diagnostic Reports</h3>
          <div className="divide-y divide-slate-100">
            {[
              { name: 'Lipid Profile (Cholesterol Panel)', date: '25 May 2025', size: '2.4 MB', lab: 'vizito Diagnostic Lab' },
              { name: 'Complete Blood Count (CBC) Panel', date: '10 May 2025', size: '1.8 MB', lab: 'vizito Diagnostic Lab' },
              { name: 'HbA1c & Fasting Blood Sugar Report', date: '12 Apr 2025', size: '1.2 MB', lab: 'City Labs Inc' },
              { name: 'Electrocardiogram (ECG) Report', date: '12 Apr 2025', size: '4.5 MB', lab: 'Banjara Hills Cardiac Center' }
            ].map((report, idx) => (
              <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800">{report.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{report.date} · {report.size} · Lab: {report.lab}</p>
                </div>
                <button
                  onClick={() => handleDownloadReport(report.name)}
                  className="btn btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 bg-white hover:bg-slate-50 cursor-pointer shadow-xs border-slate-200 shrink-0"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── MODALS ────────────────────────────────────────────────────────── */}

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto modal-scrollbar animate-fade"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800">Edit Patient Profile</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-lg transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editFormik.handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormik.values.name}
                    onChange={editFormik.handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    value={editFormik.values.phone}
                    onChange={editFormik.handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={editFormik.values.email}
                    onChange={editFormik.handleChange}
                    className="form-control"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input
                      type="text"
                      name="dob"
                      value={editFormik.values.dob}
                      onChange={editFormik.handleChange}
                      placeholder="e.g. 15 Jan 1993"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                      name="gender"
                      value={editFormik.values.gender}
                      onChange={editFormik.handleChange}
                      className="form-control cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="form-group">
                    <label className="form-label">Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={editFormik.values.bloodGroup}
                      onChange={editFormik.handleChange}
                      className="form-control cursor-pointer"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Height (cm)</label>
                    <input
                      type="text"
                      name="height"
                      value={editFormik.values.height}
                      onChange={editFormik.handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Weight (kg)</label>
                    <input
                      type="text"
                      name="weight"
                      value={editFormik.values.weight}
                      onChange={editFormik.handleChange}
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Marital Status</label>
                  <select
                    name="maritalStatus"
                    value={editFormik.values.maritalStatus}
                    onChange={editFormik.handleChange}
                    className="form-control cursor-pointer"
                  >
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={editFormik.values.address}
                  onChange={editFormik.handleChange}
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Known Allergies</label>
                <input
                  type="text"
                  name="allergies"
                  value={editFormik.values.allergies}
                  onChange={editFormik.handleChange}
                  className="form-control"
                />
              </div>

              <div className="border-t border-slate-100 pt-3">
                <h4 className="text-xs font-extrabold text-slate-500 uppercase tracking-wide mb-3">Emergency Contact Info</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Contact Name</label>
                    <input
                      type="text"
                      name="emergencyName"
                      value={editFormik.values.emergencyName}
                      onChange={editFormik.handleChange}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Phone</label>
                    <input
                      type="text"
                      name="emergencyPhone"
                      value={editFormik.values.emergencyPhone}
                      onChange={editFormik.handleChange}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="btn btn-secondary text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-sm cursor-pointer"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BOOK APPOINTMENT MODAL */}
      {isApptModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setIsApptModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-fade"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-800">Schedule Appointment</h3>
              <button onClick={() => setIsApptModalOpen(false)} className="p-1 text-slate-400 hover:bg-slate-55 rounded-lg cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={apptFormik.handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={apptFormik.values.date}
                  onChange={apptFormik.handleChange}
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Time Slot *</label>
                <input
                  type="text"
                  name="time"
                  value={apptFormik.values.time}
                  onChange={apptFormik.handleChange}
                  placeholder="e.g. 10:30 AM - 11:00 AM"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Consultation Type</label>
                <select
                  name="type"
                  value={apptFormik.values.type}
                  onChange={apptFormik.handleChange}
                  className="form-control cursor-pointer"
                >
                  <option value="In-Clinic Consultation">In-Clinic Consultation</option>
                  <option value="Video Consultation">Video Consultation</option>
                  <option value="Home visit">Home care visit</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Reason for Visit</label>
                <input
                  type="text"
                  name="reason"
                  value={apptFormik.values.reason}
                  onChange={apptFormik.handleChange}
                  placeholder="e.g. Regular medical follow-up"
                  className="form-control"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsApptModalOpen(false)}
                  className="btn btn-secondary text-xs cursor-pointer py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs cursor-pointer py-2 px-4"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE PRESCRIPTION MODAL */}
      {isCreateRxModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setIsCreateRxModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto modal-scrollbar animate-fade"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800">Generate Prescription</h3>
              <button onClick={() => setIsCreateRxModalOpen(false)} className="p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-lg transition-all cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={rxFormik.handleSubmit} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Diagnosis / Impression *</label>
                <input
                  type="text"
                  name="diagnosis"
                  value={rxFormik.values.diagnosis}
                  onChange={rxFormik.handleChange}
                  placeholder="e.g. Hypertension control"
                  className="form-control"
                  required
                />
              </div>

              {/* Med listing builder */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                <h4 className="text-xs font-extrabold text-slate-600 uppercase tracking-wide mb-3 flex items-center gap-1">
                  <Pill className="w-3.5 h-3.5 text-teal-600" /> Medications list
                </h4>

                {rxMeds.length > 0 ? (
                  <div className="bg-white border rounded-xl divide-y divide-slate-100 mb-4 overflow-hidden shadow-xs">
                    {rxMeds.map((med, index) => (
                      <div key={index} className="px-4 py-2 flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span className="font-bold text-slate-900">{med.name} ({med.dosage})</span>
                        <span className="text-slate-400">{med.frequency} · {med.duration}</span>
                        <button
                          type="button"
                          onClick={() => setRxMeds(prev => prev.filter((_, idx) => idx !== index))}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          <X className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic mb-4">No medications added yet.</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
                  <div className="sm:col-span-3">
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Drug Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Telmisartan 40mg"
                      value={newMedName}
                      onChange={e => setNewMedName(e.target.value)}
                      className="form-control py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Dosage</label>
                    <input
                      type="text"
                      placeholder="e.g. 40mg"
                      value={newMedDosage}
                      onChange={e => setNewMedDosage(e.target.value)}
                      className="form-control py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Frequency</label>
                    <input
                      type="text"
                      placeholder="e.g. Once daily"
                      value={newMedFreq}
                      onChange={e => setNewMedFreq(e.target.value)}
                      className="form-control py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 30 Days"
                      value={newMedDur}
                      onChange={e => setNewMedDur(e.target.value)}
                      className="form-control py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-3">
                  <button
                    type="button"
                    onClick={addRxMed}
                    className="btn btn-secondary text-xs py-1.5 px-3 flex items-center gap-1 bg-white cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Drug
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateRxModalOpen(false)}
                  className="btn btn-secondary text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-sm cursor-pointer"
                >
                  Save & Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RX PAD MODAL */}
      {isViewRxModalOpen && selectedRx && createPortal(
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 print:bg-transparent print:backdrop-blur-none print:p-0 print:relative print:block print:z-0"
          onClick={() => setIsViewRxModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-0 shadow-2xl border border-slate-150 overflow-hidden animate-fade print:max-w-full print:border-none print:shadow-none print:rounded-none print:m-0 print:p-0"
            onClick={e => e.stopPropagation()}
          >
            {/* Header controls */}
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between print:hidden">
              <span className="text-xs font-bold text-slate-600">Prescription View: {selectedRx.id}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="btn btn-secondary py-1 px-3 text-xs flex items-center gap-1.5 shadow-sm border border-slate-200 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button
                  onClick={() => setIsViewRxModalOpen(false)}
                  className="p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* The Rx Pad */}
            <div className="p-8 bg-white text-slate-800 print:p-6 print:pt-12" id="rx-pad-print-area">

              {/* Doctor details */}
              <div className="flex justify-between items-start border-b-2 border-slate-200 pb-4 mb-6">
                <div>
                  <h2 className="text-lg font-extrabold text-teal-800">Dr. Arjun Reddy, MD</h2>
                  <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Consultant Cardiologist & Physician</p>
                  <p className="text-[10px] text-slate-400">Reg. No: AP-2015-88329</p>
                </div>
                <div className="text-right">
                  <h3 className="text-xs font-extrabold text-slate-700">vizito CLINIC CENTER</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">H.No 12-3-45, Banjara Hills Rd 2</p>
                  <p className="text-[10px] text-slate-400">Hyderabad, TS - 500034</p>
                  <p className="text-[10px] text-slate-400">Ph: +91 40 2234 5678</p>
                </div>
              </div>

              {/* Patient Info Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs mb-6">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Patient</span>
                  <p className="font-extrabold text-slate-800 mt-0.5">{selectedRx.patient}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Details</span>
                  <p className="font-semibold text-slate-700 mt-0.5">{selectedRx.age} Y · {selectedRx.gender}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Date</span>
                  <p className="font-semibold text-slate-700 mt-0.5">{selectedRx.date}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Prescription ID</span>
                  <p className="font-mono font-bold text-slate-800 mt-0.5">{selectedRx.id}</p>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="mb-6 border-b border-slate-100 pb-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Diagnosis / Symptoms:</span>
                <p className="text-sm font-bold text-slate-800 mt-1 pl-1">{selectedRx.diagnosis}</p>
              </div>

              {/* Rx Symbol */}
              <div className="text-2xl font-serif font-extrabold text-teal-800 italic mb-4">Rx</div>

              {/* Medications Table */}
              <table className="w-full text-left text-xs mb-8 border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase">
                    <th className="py-2.5 pb-1">Medicine Name & strength</th>
                    <th className="py-2.5 pb-1">Dosage</th>
                    <th className="py-2.5 pb-1">Frequency</th>
                    <th className="py-2.5 pb-1 text-right">Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {selectedRx.medications && selectedRx.medications.length > 0 ? (
                    selectedRx.medications.map((med: any, index: number) => (
                      <tr key={index}>
                        <td className="py-3 font-bold text-slate-800">{med.name}</td>
                        <td className="py-3">{med.dosage}</td>
                        <td className="py-3">{med.frequency}</td>
                        <td className="py-3 text-right text-slate-600">{med.duration}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="py-3 font-bold text-slate-800">Paracetamol 650mg</td>
                      <td className="py-3">650mg</td>
                      <td className="py-3">As needed for fever</td>
                      <td className="py-3 text-right text-slate-600">5 Days</td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Instructions & Signature footer */}
              <div className="flex justify-between items-end pt-6 border-t border-slate-200 mt-10">
                <div>
                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">General Instructions:</h4>
                  <p className="text-[11px] text-slate-500 leading-normal mt-1 max-w-[320px]">
                    Drink plenty of lukewarm water. In case of persistent fever or allergy to antibiotics, consult the clinic immediately. Keep medications stored in cool place.
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-serif font-bold text-teal-800 italic text-lg leading-none select-none">Arjun Reddy</div>
                  <div className="w-32 border-b border-slate-300 my-1 ml-auto" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Authorized Signature</p>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
