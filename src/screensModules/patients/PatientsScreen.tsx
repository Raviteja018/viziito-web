import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
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
  Pencil,
  Trash2,
  CheckCircle,
  AlertCircle,
  FileText
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

// ─── Initial Mock data ────────────────────────────────────────────────────────
const INITIAL_PATIENTS: Patient[] = [
  { id: 'PAT123456', name: 'Amit Sharma', initials: 'AS', age: 32, gender: 'Male', phone: '+91 98765 43210', email: 'amit.sharma@email.com', lastVisit: '28 May 2025', lastVisitTime: '11:30 AM', status: 'Active', appointments: 8 },
  { id: 'PAT123457', name: 'Priya Singh', initials: 'PS', age: 28, gender: 'Female', phone: '+91 91234 56789', email: 'priya.singh@email.com', lastVisit: '27 May 2025', lastVisitTime: '04:15 PM', status: 'Active', appointments: 5 },
  { id: 'PAT123458', name: 'Ramesh Kumar', initials: 'RK', age: 45, gender: 'Male', phone: '+91 99876 54321', email: 'ramesh.kumar@email.com', lastVisit: '27 May 2025', lastVisitTime: '10:20 AM', status: 'Active', appointments: 12 },
  { id: 'PAT123459', name: 'Neha Devi', initials: 'ND', age: 35, gender: 'Female', phone: '+91 93456 78901', email: 'neha.devi@email.com', lastVisit: '26 May 2025', lastVisitTime: '03:40 PM', status: 'Active', appointments: 6 },
  { id: 'PAT123460', name: 'Vikram Singh', initials: 'VS', age: 50, gender: 'Male', phone: '+91 90000 11223', email: 'vikram.singh@email.com', lastVisit: '26 May 2025', lastVisitTime: '11:05 AM', status: 'Inactive', appointments: 3 },
  { id: 'PAT123461', name: 'Anjali Patel', initials: 'AP', age: 29, gender: 'Female', phone: '+91 95555 66778', email: 'anjali.patel@email.com', lastVisit: '25 May 2025', lastVisitTime: '02:10 PM', status: 'Active', appointments: 4 },
  { id: 'PAT123462', name: 'Mohit Jain', initials: 'MJ', age: 41, gender: 'Male', phone: '+91 97777 88990', email: 'mohit.jain@email.com', lastVisit: '25 May 2025', lastVisitTime: '09:30 AM', status: 'Active', appointments: 7 },
  { id: 'PAT123463', name: 'Sneha Sharma', initials: 'SS', age: 31, gender: 'Female', phone: '+91 98888 77665', email: 'sneha.sharma@email.com', lastVisit: '24 May 2025', lastVisitTime: '06:45 PM', status: 'Active', appointments: 3 },
];

const TOP_CONDITIONS = [
  { name: 'Hypertension', count: 245, icon: Heart, color: 'text-rose-500', dbQuery: 'hypertension' },
  { name: 'Diabetes', count: 198, icon: Zap, color: 'text-amber-500', dbQuery: 'diabetes' },
  { name: 'Asthma', count: 156, icon: Wind, color: 'text-sky-500', dbQuery: 'asthma' },
  { name: 'Thyroid Disorder', count: 112, icon: Activity, color: 'text-violet-500', dbQuery: 'thyroid' },
  { name: 'Cardiac Disease', count: 98, icon: Flame, color: 'text-rose-600', dbQuery: 'cardiac' },
];

const RECENT_NEW_PATIENTS = [
  { name: 'Karan Verma', initials: 'KV', date: '22 May 2025', color: 'bg-teal-100   text-teal-700' },
  { name: 'Pooja Nair', initials: 'PN', date: '21 May 2025', color: 'bg-pink-100   text-pink-700' },
  { name: 'Siddharth Rao', initials: 'SR', date: '20 May 2025', color: 'bg-orange-100 text-orange-700' },
  { name: 'Meera Iyer', initials: 'MI', date: '19 May 2025', color: 'bg-indigo-100 text-indigo-700' },
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
  KV: 'bg-teal-100   text-teal-700',
  PN: 'bg-pink-100   text-pink-700',
  SR: 'bg-orange-100 text-orange-700',
  MI: 'bg-indigo-100 text-indigo-700',
};

// Default template for details
const DEFAULT_PATIENT_DETAILS = {
  address: 'H.No. 45/A, Gachibowli, Hyderabad, Telangana - 500032',
  bloodGroup: 'O+',
  height: '170 cm',
  weight: '65 kg',
  allergies: 'None',
  maritalStatus: 'Single',
  chronicConditions: [],
  medications: [],
  notes: 'No clinical notes added yet.',
  emergency: { name: 'Emergency Contact', phone: '+91 XXXXX XXXXX' }
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, icon: Icon, iconColor, iconBg, onClick,
}: {
  label: string; value: string; sub: string;
  icon: React.ElementType; iconColor: string; iconBg: string;
  onClick?: () => void;
}) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-start gap-3 transition-all ${
        onClick ? 'cursor-pointer hover:bg-slate-50 active:scale-98' : ''
      }`}
    >
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
    <span className={`inline-flex items-center text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${status === 'Active'
        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
        : 'bg-slate-100 text-slate-500 border-slate-200'
      }`}>
      {status}
    </span>
  );
}

// ─── Donut chart (CSS-only) ───────────────────────────────────────────────────
function DonutChart({ total, active, inactive, newCount }: { total: number; active: number; inactive: number; newCount: number }) {
  const activePct = total > 0 ? (active / total) * 100 : 0;
  const inactivePct = total > 0 ? (inactive / total) * 100 : 0;
  const newPct = total > 0 ? (newCount / total) * 100 : 0;

  return (
    <div className="flex flex-col items-center">
      <div
        className="w-28 h-28 rounded-full relative flex items-center justify-center shadow-sm"
        style={{
          background: `conic-gradient(#0d9488 0% ${activePct}%, #e2e8f0 ${activePct}% ${activePct + inactivePct}%, #fbbf24 ${activePct + inactivePct}% 100%)`,
        }}
      >
        {/* Donut hole */}
        <div className="w-[68px] h-[68px] bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
          <span className="text-lg font-extrabold text-slate-800 leading-none">{total}</span>
          <span className="text-[10px] text-slate-400 font-medium">Total</span>
        </div>
      </div>
      <div className="mt-4 space-y-1.5 w-full">
        {[
          { label: 'Active', value: `${active} (${activePct.toFixed(1)}%)`, color: 'bg-teal-600' },
          { label: 'Inactive', value: `${inactive} (${inactivePct.toFixed(1)}%)`, color: 'bg-slate-300' },
          { label: 'New (This Month)', value: `${newCount} (${newPct.toFixed(1)}%)`, color: 'bg-amber-400' },
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
  const navigate = useNavigate();
  const pageSize = 10;

  // State initialized from localStorage
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateFilter, setDateFilter] = useState('All');
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  // Active items for actions
  const [activeMenuPatientId, setActiveMenuPatientId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [messagingRecipient, setMessagingRecipient] = useState<'All' | 'Single'>('All');

  // Forms state via Formik
  const patientFormik = useFormik({
    initialValues: {
      name: '', age: '', gender: 'Male', phone: '', email: '',
      bloodGroup: 'B+', height: '', weight: '', allergies: 'None',
      maritalStatus: 'Single', address: '', emergencyName: '', emergencyPhone: '', dob: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Full Name is required'),
      phone: Yup.string().required('Phone Number is required')
    }),
    onSubmit: (values) => {
      if (isAddModalOpen) {
        handleAddPatientSubmit(values);
      } else {
        handleEditPatientSubmit(values);
      }
    }
  });

  const messageFormik = useFormik({
    initialValues: { subject: '', message: '' },
    validationSchema: Yup.object({
      subject: Yup.string().required('Subject is required'),
      message: Yup.string().required('Message is required')
    }),
    onSubmit: () => {
      setIsMessageModalOpen(false);
      messageFormik.resetForm();

      if (messagingRecipient === 'All') {
        showToast('Broadcast message scheduled and sent to all active patients.', 'success');
      } else {
        showToast(`Notification message successfully sent to ${selectedPatient?.name}.`, 'success');
      }
    }
  });

  const importFormik = useFormik({
    initialValues: { file: null as File | null },
    onSubmit: (values) => {
      if (!values.file) {
        showToast('Please select a CSV/JSON file to upload.', 'error');
        return;
      }
      setIsImporting(true);
      setImportProgress(10);

      const interval = setInterval(() => {
        setImportProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              const imported: Patient[] = [
                { id: 'PAT781290', name: 'Tanya Sen', initials: 'TS', age: 34, gender: 'Female', phone: '+91 96521 88990', email: 'tanya.sen@email.com', lastVisit: 'Today', lastVisitTime: '10:00 AM', status: 'Active', appointments: 1 },
                { id: 'PAT781291', name: 'Rahul Gupta', initials: 'RG', age: 42, gender: 'Male', phone: '+91 88320 12345', email: 'rahul.gupta@email.com', lastVisit: 'Today', lastVisitTime: '11:15 AM', status: 'Active', appointments: 2 }
              ];

              const updatedList = [...imported, ...patients];
              syncPatients(updatedList);

              setIsImporting(false);
              setIsImportModalOpen(false);
              importFormik.resetForm();
              setImportProgress(0);
              showToast('2 patients successfully imported from CSV file.');
            }, 300);
            return 100;
          }
          return prev + 30;
        });
      }, 200);
    }
  });

  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  // Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Load data from LocalStorage
  useEffect(() => {
    const savedPatients = localStorage.getItem('viziito_patients');
    if (savedPatients) {
      try {
        const parsed = JSON.parse(savedPatients);
        // Verify if any loaded patient is missing basic fields like phone or status
        const isCorrupt = parsed.some((p: any) => !p.phone || !p.status);
        if (isCorrupt) {
          setPatients(INITIAL_PATIENTS);
          localStorage.setItem('viziito_patients', JSON.stringify(INITIAL_PATIENTS));
        } else {
          setPatients(parsed);
        }
      } catch (e) {
        setPatients(INITIAL_PATIENTS);
      }
    } else {
      setPatients(INITIAL_PATIENTS);
      localStorage.setItem('viziito_patients', JSON.stringify(INITIAL_PATIENTS));
    }
  }, []);

  // Sync to local storage helper
  const syncPatients = (updated: Patient[]) => {
    setPatients(updated);
    localStorage.setItem('viziito_patients', JSON.stringify(updated));
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Close menus on document click
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenuPatientId(null);
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Submit Add Patient
  const handleAddPatientSubmit = (values: any) => {
    const patientId = `PAT${Math.floor(100000 + Math.random() * 900000)}`;
    const names = values.name.trim().split(' ');
    const initials = names.length > 1 ? (names[0][0] + names[names.length - 1][0]).toUpperCase() : names[0][0].toUpperCase();

    const newPatient: Patient = {
      id: patientId,
      name: values.name,
      initials,
      age: parseInt(values.age) || 30,
      gender: values.gender,
      phone: values.phone,
      email: values.email || `${names[0].toLowerCase()}@email.com`,
      lastVisit: 'Today',
      lastVisitTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Active',
      appointments: 0
    };

    // Save Basic Patient list
    const updatedList = [newPatient, ...patients];
    syncPatients(updatedList);

    // Save Patient Detail record for PatientDetailScreen
    const newDetail = {
      id: patientId,
      name: values.name,
      initials,
      avatarColor: 'bg-teal-100 text-teal-700',
      gender: values.gender,
      age: parseInt(values.age) || 30,
      dob: values.dob || '01 Jan 1995',
      phone: values.phone,
      email: values.email || `${names[0].toLowerCase()}@email.com`,
      address: values.address || DEFAULT_PATIENT_DETAILS.address,
      bloodGroup: values.bloodGroup,
      height: values.height ? `${values.height} cm` : DEFAULT_PATIENT_DETAILS.height,
      weight: values.weight ? `${values.weight} kg` : DEFAULT_PATIENT_DETAILS.weight,
      allergies: values.allergies,
      maritalStatus: values.maritalStatus,
      totalAppointments: 0,
      totalPrescriptions: 0,
      ongoingTreatments: 0,
      lastVisit: 'Today',
      lastVisitType: 'In-Clinic Consultation',
      chronicConditions: [],
      medications: [],
      recentAppointment: {
        date: 'Today',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'In-Clinic Consultation',
        location: 'Clinic Suite A',
        status: 'Completed',
        reason: 'New Registration Checkup'
      },
      emergency: {
        name: values.emergencyName || 'None',
        phone: values.emergencyPhone || 'None'
      },
      notes: 'New patient registered.',
      notesDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      notesByDoctor: 'Dr. Arjun Reddy'
    };

    // Get current details dictionary
    const savedDetails = localStorage.getItem('viziito_patient_details');
    let detailsDict: Record<string, any> = {};
    if (savedDetails) {
      try { detailsDict = JSON.parse(savedDetails); } catch (err) { }
    }
    detailsDict[patientId] = newDetail;
    localStorage.setItem('viziito_patient_details', JSON.stringify(detailsDict));

    setIsAddModalOpen(false);
    resetForm();
    showToast(`Patient ${newPatient.name} successfully registered.`);
  };

  // Submit Edit Patient
  const handleEditPatientSubmit = (values: any) => {
    if (!selectedPatient) return;

    // Update Basic List
    const updatedList = patients.map(p => {
      if (p.id === selectedPatient.id) {
        return {
          ...p,
          name: values.name,
          age: parseInt(values.age) || p.age,
          gender: values.gender,
          phone: values.phone,
          email: values.email,
        };
      }
      return p;
    });
    syncPatients(updatedList);

    // Update Details
    const savedDetails = localStorage.getItem('viziito_patient_details');
    let detailsDict: Record<string, any> = {};
    if (savedDetails) {
      try { detailsDict = JSON.parse(savedDetails); } catch (err) { }
    }

    if (detailsDict[selectedPatient.id]) {
      detailsDict[selectedPatient.id] = {
        ...detailsDict[selectedPatient.id],
        name: values.name,
        age: parseInt(values.age) || selectedPatient.age,
        gender: values.gender,
        phone: values.phone,
        email: values.email,
        bloodGroup: values.bloodGroup,
        height: values.height.includes('cm') ? values.height : `${values.height} cm`,
        weight: values.weight.includes('kg') ? values.weight : `${values.weight} kg`,
        allergies: values.allergies,
        maritalStatus: values.maritalStatus,
        address: values.address,
        emergency: {
          name: values.emergencyName,
          phone: values.emergencyPhone
        }
      };
    } else {
      // Re-create details record if missing
      detailsDict[selectedPatient.id] = {
        ...selectedPatient,
        avatarColor: 'bg-teal-100 text-teal-700',
        dob: '01 Jan 1990',
        bloodGroup: values.bloodGroup,
        height: `${values.height} cm`,
        weight: `${values.weight} kg`,
        allergies: values.allergies,
        maritalStatus: values.maritalStatus,
        address: values.address,
        totalAppointments: selectedPatient.appointments,
        totalPrescriptions: 2,
        ongoingTreatments: 1,
        chronicConditions: [],
        medications: [],
        emergency: { name: values.emergencyName, phone: values.emergencyPhone },
        recentAppointment: { date: selectedPatient.lastVisit, time: selectedPatient.lastVisitTime, type: 'Consultation', location: 'Clinic', status: 'Completed', reason: 'Regular Followup' },
        notes: 'Updated.',
        notesDate: 'Today',
        notesByDoctor: 'Dr. Arjun Reddy'
      };
    }
    localStorage.setItem('viziito_patient_details', JSON.stringify(detailsDict));

    setIsEditModalOpen(false);
    resetForm();
    showToast(`Patient details for ${values.name} updated successfully.`);
  };

  // Toggle Active/Inactive Status
  const togglePatientStatus = (id: string) => {
    const updated = patients.map(p => {
      if (p.id === id) {
        const newStatus: PatientStatus = p.status === 'Active' ? 'Inactive' : 'Active';
        showToast(`Patient status changed to ${newStatus}.`, 'info');
        return { ...p, status: newStatus };
      }
      return p;
    });
    syncPatients(updated);
  };

  // Delete Patient
  const handleDeletePatientConfirm = () => {
    if (!selectedPatient) return;

    // Remove from basic list
    const updated = patients.filter(p => p.id !== selectedPatient.id);
    syncPatients(updated);

    // Remove from details
    const savedDetails = localStorage.getItem('viziito_patient_details');
    if (savedDetails) {
      try {
        const detailsDict = JSON.parse(savedDetails);
        delete detailsDict[selectedPatient.id];
        localStorage.setItem('viziito_patient_details', JSON.stringify(detailsDict));
      } catch (err) { }
    }

    setIsDeleteConfirmOpen(false);
    showToast(`Patient profile for ${selectedPatient.name} deleted successfully.`, 'error');
    setSelectedPatient(null);
  };

  // Pre-fill edit fields
  const openEditModal = (pt: Patient) => {
    setSelectedPatient(pt);

    // Try to get existing detailed values
    const savedDetails = localStorage.getItem('viziito_patient_details');
    let details: any = null;
    if (savedDetails) {
      try {
        const detailsDict = JSON.parse(savedDetails);
        details = detailsDict[pt.id];
      } catch (err) { }
    }

    patientFormik.setValues({
      name: pt.name,
      age: String(pt.age),
      gender: pt.gender,
      phone: pt.phone,
      email: pt.email || '',
      bloodGroup: details?.bloodGroup || 'B+',
      height: details?.height ? details.height.replace(' cm', '') : '',
      weight: details?.weight ? details.weight.replace(' kg', '') : '',
      allergies: details?.allergies || 'None',
      maritalStatus: details?.maritalStatus || 'Single',
      address: details?.address || '',
      emergencyName: details?.emergency?.name || '',
      emergencyPhone: details?.emergency?.phone || '',
      dob: details?.dob || ''
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    patientFormik.resetForm();
  };

  // Apply filters
  const filtered = patients.filter(pt => {
    const matchSearch =
      pt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pt.phone.includes(searchTerm);

    const matchStatus =
      statusFilter === 'All Status' || pt.status === statusFilter;

    // Condition filter simulation
    let matchCondition = true;
    if (selectedCondition) {
      const q = selectedCondition.toLowerCase();
      // Let's match specific patients for mock integration:
      if (q === 'hypertension') {
        matchCondition = ['PAT123456', 'PAT123458'].includes(pt.id);
      } else if (q === 'diabetes') {
        matchCondition = ['PAT123456', 'PAT123459'].includes(pt.id);
      } else if (q === 'asthma') {
        matchCondition = ['PAT123456', 'PAT123460'].includes(pt.id);
      } else {
        matchCondition = true; // default match
      }
    }

    const matchDate =
      dateFilter === 'All' || pt.lastVisit === dateFilter;

    return matchSearch && matchStatus && matchCondition && matchDate;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Statistics summaries
  const totalCount = patients.length;
  const activeCount = patients.filter(p => p.status === 'Active').length;
  const inactiveCount = patients.filter(p => p.status === 'Inactive').length;
  const newCount = 8 + (patients.length - INITIAL_PATIENTS.length); // Dynamic counter

  return (
    <div className="w-full animate-fade">

      {/* ─── Toast System ─────────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade flex items-center gap-3 bg-slate-900 border border-slate-800 text-white px-5 py-3.5 rounded-2xl shadow-xl max-w-sm">
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <Activity className="w-5 h-5 text-sky-400 shrink-0" />
          )}
          <span className="text-xs font-bold leading-normal">{toast.message}</span>
        </div>
      )}

      {/* ─── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Patient Management</h1>
          <p className="text-sm text-slate-500 mt-0.5">View, manage and track all your patients</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto shrink-0">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            Import Patients
          </button>
          <button
            onClick={() => { resetForm(); setIsAddModalOpen(true); }}
            className="flex-1 sm:flex-none btn btn-primary flex items-center justify-center gap-2 px-5 py-2.5 shadow-md shadow-teal-500/20 text-sm font-bold cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add New Patient
          </button>
          <button
            onClick={() => { setMessagingRecipient('All'); setIsMessageModalOpen(true); }}
            className="p-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl shadow-sm transition-all cursor-pointer shrink-0"
            title="Broadcast Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ─── Main Grid ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">

        {/* ── Left Panel ─────────────────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-8 space-y-4">

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
              {(searchTerm || selectedCondition) && (
                <button
                  onClick={() => { setSearchTerm(''); setSelectedCondition(null); }}
                  className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Date range chip */}
            <div className="relative">
              <button 
                onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
                className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-600 font-medium hover:border-slate-300 transition-all shadow-sm whitespace-nowrap cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-slate-400" />
                {dateFilter === 'All' ? 'All Time' : dateFilter}
              </button>
              {isDateFilterOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setIsDateFilterOpen(false)} />
                  <div className="absolute left-0 mt-1 w-44 bg-white border border-slate-200 shadow-xl rounded-xl py-1.5 z-30 animate-fade text-left">
                    {['All', '28 May 2025', '27 May 2025', '26 May 2025', '25 May 2025', '24 May 2025'].map(opt => (
                      <button
                        key={opt}
                        onClick={() => {
                          setDateFilter(opt);
                          setIsDateFilterOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                      >
                        {opt === 'All' ? 'All Time' : opt}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

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

            {(searchTerm || statusFilter !== 'All Status' || dateFilter !== 'All' || selectedCondition) && (
              <button
                onClick={() => { setSearchTerm(''); setStatusFilter('All Status'); setDateFilter('All'); setSelectedCondition(null); }}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors px-1 cursor-pointer"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Condition Filter indicator */}
          {selectedCondition && (
            <div className="flex items-center gap-2 bg-teal-50 text-teal-800 border border-teal-100 rounded-xl px-3.5 py-1.5 text-xs font-semibold w-fit">
              <span>Showing patients matching condition: <b className="capitalize">{selectedCondition}</b></span>
              <button onClick={() => setSelectedCondition(null)} className="hover:text-teal-900 cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard 
              label="Total Patients" 
              value={String(totalCount)} 
              sub="↑ 12% from last month" 
              icon={Users} 
              iconColor="text-teal-600" 
              iconBg="bg-teal-50" 
              onClick={() => { setStatusFilter('All Status'); setDateFilter('All'); setSelectedCondition(null); }}
            />
            <StatCard 
              label="New Patients" 
              value={String(newCount)} 
              sub="↑ 8% from last month" 
              icon={UserPlus} 
              iconColor="text-sky-600" 
              iconBg="bg-sky-50" 
              onClick={() => { setStatusFilter('Active'); setDateFilter('All'); setSelectedCondition(null); }}
            />
            <StatCard 
              label="Returning Patients" 
              value={String(activeCount)} 
              sub="↑ 10% from last month" 
              icon={RefreshCw} 
              iconColor="text-violet-600" 
              iconBg="bg-violet-50" 
              onClick={() => { setStatusFilter('Active'); setDateFilter('All'); setSelectedCondition(null); }}
            />
            <StatCard 
              label="Patients This Month" 
              value="86" 
              sub="↑ 5% from last month" 
              icon={Calendar} 
              iconColor="text-amber-600" 
              iconBg="bg-amber-50" 
              onClick={() => { setStatusFilter('All Status'); setDateFilter('28 May 2025'); setSelectedCondition(null); }}
            />
          </div>

          {/* Table Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-12 gap-2 px-5 py-2.5 bg-slate-50 border-b border-slate-100">
              {[
                { label: 'Patient Details', span: 'col-span-3' },
                { label: 'Contact', span: 'col-span-3' },
                { label: 'Last Visit', span: 'col-span-2' },
                { label: 'Status', span: 'col-span-1' },
                { label: 'Total Appointments', span: 'col-span-2' },
                { label: 'Actions', span: 'col-span-1 text-right' },
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
                    className="flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-2 px-5 py-4 md:py-3.5 items-start md:items-center cursor-pointer hover:bg-slate-50/80 transition-colors group"
                  >
                    {/* Patient Details */}
                    <div className="col-span-12 md:col-span-3 flex items-center justify-between md:justify-start w-full gap-2.5 min-w-0">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar initials={pt.initials} />
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-800 truncate">{pt.name}</p>
                          <p className="text-[11px] text-slate-400">{pt.age} Y, {pt.gender} · {pt.id}</p>
                        </div>
                      </div>
                      <div className="md:hidden">
                        <StatusBadge status={pt.status} />
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="col-span-12 md:col-span-3 flex items-center justify-between md:block w-full border-t border-slate-100 md:border-none pt-2.5 md:pt-0">
                      <span className="md:hidden text-[11px] font-bold text-slate-400 uppercase tracking-wider">Contact</span>
                      <div className="text-right md:text-left">
                        <p className="text-xs font-semibold text-slate-700">{pt.phone}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate max-w-[200px] md:max-w-none ml-auto md:ml-0">{pt.email}</p>
                      </div>
                    </div>

                    {/* Last Visit */}
                    <div className="col-span-12 md:col-span-2 flex items-center justify-between md:block w-full border-t border-slate-100 md:border-none pt-2.5 md:pt-0">
                      <span className="md:hidden text-[11px] font-bold text-slate-400 uppercase tracking-wider">Last Visit</span>
                      <div className="text-right md:text-left">
                        <p className="text-xs font-semibold text-slate-700">{pt.lastVisit}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{pt.lastVisitTime}</p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="hidden md:block md:col-span-1">
                      <StatusBadge status={pt.status} />
                    </div>

                    {/* Total Appointments */}
                    <div className="col-span-12 md:col-span-2 flex items-center justify-between md:block w-full border-t border-slate-100 md:border-none pt-2.5 md:pt-0">
                      <span className="md:hidden text-[11px] font-bold text-slate-400 uppercase tracking-wider">Appointments</span>
                      <span className="text-sm font-bold text-slate-700 text-right md:text-left">{pt.appointments}</span>
                    </div>

                    {/* Actions */}
                    <div className="col-span-12 md:col-span-1 flex items-center justify-end w-full md:w-auto gap-1 border-t border-slate-100 md:border-none pt-2.5 md:pt-0 mt-1 md:mt-0 relative">
                      <span className="md:hidden mr-auto text-[11px] font-bold text-slate-400 uppercase tracking-wider">Actions</span>
                      <button
                        onClick={e => { e.stopPropagation(); navigate(`/patients/${pt.id}`); }}
                        className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                        title="View patient"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setActiveMenuPatientId(activeMenuPatientId === pt.id ? null : pt.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="More actions"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuPatientId === pt.id && (
                        <div
                          className="absolute right-0 top-8 mt-1 w-44 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-40 animate-fade"
                          onClick={e => e.stopPropagation()}
                        >
                          <button
                            onClick={() => { setActiveMenuPatientId(null); openEditModal(pt); }}
                            className="w-full text-left px-4.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Pencil className="w-3.5 h-3.5 text-slate-400" /> Edit Details
                          </button>
                          <button
                            onClick={() => { setActiveMenuPatientId(null); togglePatientStatus(pt.id); }}
                            className="w-full text-left px-4.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-slate-400" /> Mark {pt.status === 'Active' ? 'Inactive' : 'Active'}
                          </button>
                          <button
                            onClick={() => {
                              setActiveMenuPatientId(null);
                              setSelectedPatient(pt);
                              setMessagingRecipient('Single');
                              setIsMessageModalOpen(true);
                            }}
                            className="w-full text-left px-4.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                          >
                            <Send className="w-3.5 h-3.5 text-slate-400" /> Send Message
                          </button>
                          <div className="border-t border-slate-100 my-1" />
                          <button
                            onClick={() => { setActiveMenuPatientId(null); setSelectedPatient(pt); setIsDeleteConfirmOpen(true); }}
                            className="w-full text-left px-4.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" /> Delete Profile
                          </button>
                        </div>
                      )}
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
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => setCurrentPage(idx + 1)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPage === idx + 1
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'border border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                  >
                    {idx + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Panel ────────────────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-4 space-y-4 lg:sticky lg:top-5">

          {/* Patient Summary Donut */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Patient Summary</h3>
            <DonutChart total={totalCount} active={activeCount} inactive={inactiveCount} newCount={newCount} />
          </div>

          {/* Top Conditions */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800">Top Conditions</h3>
              <button
                onClick={() => setSelectedCondition(null)}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
              >
                Clear
              </button>
            </div>
            <div className="space-y-2.5">
              {TOP_CONDITIONS.map(cond => (
                <div
                  key={cond.name}
                  onClick={() => setSelectedCondition(cond.dbQuery)}
                  className={`flex items-center gap-3 p-1.5 rounded-xl transition-all cursor-pointer ${selectedCondition === cond.dbQuery ? 'bg-teal-50/70 border border-teal-100' : 'hover:bg-slate-50'
                    }`}
                >
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
              <button
                onClick={() => {
                  setSelectedCondition(null);
                  setSearchTerm('');
                  showToast('Showing all patient records.');
                }}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
              >
                View All
              </button>
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
            <button
              onClick={() => { setMessagingRecipient('All'); setIsMessageModalOpen(true); }}
              className="w-full flex items-center justify-center gap-2 bg-white hover:bg-teal-50 text-teal-700 border border-teal-200 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Send Message
            </button>
          </div>
        </div>
      </div>

      {/* ─── MODALS ────────────────────────────────────────────────────────── */}

      {/* ADD / EDIT PATIENT MODAL */}
      {(isAddModalOpen || isEditModalOpen) && createPortal( <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-[95%] sm:w-full p-5 sm:p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto modal-scrollbar animate-fade"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                {isAddModalOpen ? 'Register New Patient' : `Edit Patient: ${selectedPatient?.name}`}
              </h3>
              <button
                onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                className="p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-lg transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

             <form onSubmit={patientFormik.handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={patientFormik.values.name}
                    onChange={patientFormik.handleChange}
                    placeholder="e.g. Amit Sharma"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="text"
                    name="phone"
                    value={patientFormik.values.phone}
                    onChange={patientFormik.handleChange}
                    placeholder="e.g. +91 98765 43210"
                    className="form-control"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={patientFormik.values.email}
                    onChange={patientFormik.handleChange}
                    placeholder="e.g. amit@example.com"
                    className="form-control"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={patientFormik.values.age}
                      onChange={patientFormik.handleChange}
                      placeholder="32"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select
                      name="gender"
                      value={patientFormik.values.gender}
                      onChange={patientFormik.handleChange}
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
                      value={patientFormik.values.bloodGroup}
                      onChange={patientFormik.handleChange}
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
                      value={patientFormik.values.height}
                      onChange={patientFormik.handleChange}
                      placeholder="175"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Weight (kg)</label>
                    <input
                      type="text"
                      name="weight"
                      value={patientFormik.values.weight}
                      onChange={patientFormik.handleChange}
                      placeholder="70"
                      className="form-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Marital Status</label>
                  <select
                    name="maritalStatus"
                    value={patientFormik.values.maritalStatus}
                    onChange={patientFormik.handleChange}
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
                  value={patientFormik.values.address}
                  onChange={patientFormik.handleChange}
                  placeholder="Street, City, Zipcode"
                  className="form-control"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Known Allergies</label>
                <input
                  type="text"
                  name="allergies"
                  value={patientFormik.values.allergies}
                  onChange={patientFormik.handleChange}
                  placeholder="e.g. Penicillin, Pollen, None"
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
                      value={patientFormik.values.emergencyName}
                      onChange={patientFormik.handleChange}
                      placeholder="e.g. Rahul Sharma (Brother)"
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact Phone</label>
                    <input
                      type="text"
                      name="emergencyPhone"
                      value={patientFormik.values.emergencyPhone}
                      onChange={patientFormik.handleChange}
                      placeholder="e.g. +91 XXXXX XXXXX"
                      className="form-control"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                  className="btn btn-secondary text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-sm cursor-pointer"
                >
                  {isAddModalOpen ? 'Register Patient' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteConfirmOpen && createPortal(
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setIsDeleteConfirmOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-[95%] sm:w-full p-5 sm:p-6 shadow-2xl border border-slate-100 animate-fade"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-extrabold">Confirm Deletion</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              Are you sure you want to permanently delete the patient profile of <b>{selectedPatient?.name}</b> ({selectedPatient?.id})? This action will erase all clinical records, appointments, and prescriptions history.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="btn btn-secondary text-xs cursor-pointer py-2 px-4"
              >
                No, Keep Profile
              </button>
              <button
                onClick={handleDeletePatientConfirm}
                className="btn bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Yes, Delete Profile
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* IMPORT PATIENTS MODAL */}
      {isImportModalOpen && createPortal(
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setIsImportModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-[95%] sm:w-full p-5 sm:p-6 shadow-2xl border border-slate-100 animate-fade"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-800">Import Patients</h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

             <form onSubmit={importFormik.handleSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-teal-400 transition-colors flex flex-col items-center gap-2">
                <FileText className="w-10 h-10 text-slate-400" />
                <p className="text-xs font-bold text-slate-700">Drag & drop CSV/JSON file here</p>
                <p className="text-[10px] text-slate-400">or click to browse local files</p>
                <input
                  type="file"
                  accept=".csv,.json"
                  onChange={e => importFormik.setFieldValue('file', e.target.files ? e.target.files[0] : null)}
                  className="hidden"
                  id="import-file-input"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('import-file-input')?.click()}
                  className="mt-2 text-xs font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  Browse File
                </button>
              </div>

              {importFormik.values.file && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 truncate max-w-[200px]">{importFormik.values.file.name}</span>
                  <button type="button" onClick={() => importFormik.setFieldValue('file', null)} className="text-rose-500 hover:text-rose-600 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {isImporting && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-slate-500">
                    <span>Uploading and Parsing data...</span>
                    <span>{importProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-teal-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${importProgress}%` }} />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  disabled={isImporting}
                  onClick={() => setIsImportModalOpen(false)}
                  className="btn btn-secondary text-xs cursor-pointer py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isImporting || !importFormik.values.file}
                  className="btn btn-primary text-xs cursor-pointer py-2 px-4"
                >
                  Import data
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* PATIENT COMMUNICATION MODAL */}
      {isMessageModalOpen && createPortal(
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setIsMessageModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-[95%] sm:w-full p-5 sm:p-6 shadow-2xl border border-slate-100 animate-fade"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-800">
                {messagingRecipient === 'All' ? 'Broadcast Message to Patients' : `Message to: ${selectedPatient?.name}`}
              </h3>
              <button
                onClick={() => setIsMessageModalOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={messageFormik.handleSubmit} className="space-y-4">
              {messagingRecipient === 'All' ? (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium rounded-xl p-3.5">
                  ⚠️ This message will be sent to all active patients in your database via SMS and registered email address.
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3 text-xs font-semibold text-slate-700">
                  <span>To: <b>{selectedPatient?.name}</b> ({selectedPatient?.phone})</span>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Subject / Purpose</label>
                <input
                  type="text"
                  name="subject"
                  value={messageFormik.values.subject}
                  onChange={messageFormik.handleChange}
                  placeholder="e.g. Clinic Timing Updates or Health Checkup Reminder"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Message Body</label>
                <textarea
                  name="message"
                  value={messageFormik.values.message}
                  onChange={messageFormik.handleChange}
                  placeholder="Type your message details here..."
                  className="form-control h-32"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setIsMessageModalOpen(false)}
                  className="btn btn-secondary text-xs cursor-pointer py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-xs cursor-pointer py-2 px-4"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
