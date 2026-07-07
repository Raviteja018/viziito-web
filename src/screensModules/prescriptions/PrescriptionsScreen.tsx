import React, { useState, useEffect } from 'react';
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
  X,
  Trash2,
  Pencil,
  CheckCircle,
  Printer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────
type PrescriptionStatus = 'Sent' | 'Draft' | 'Expired';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

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
  medications?: Medication[];
}

interface Patient {
  id: string;
  name: string;
  initials: string;
  age: number;
  gender: string;
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

const MOCK_MEDS_MAP: Record<string, Medication[]> = {
  'RX-2025-0007': [
    { name: 'Azithromycin 500mg', dosage: '500mg', frequency: 'Once daily after food', duration: '5 Days' },
    { name: 'Paracetamol 650mg', dosage: '650mg', frequency: 'Thrice daily if fever', duration: '3 Days' },
  ],
  'RX-2025-0006': [
    { name: 'Sumatriptan 50mg', dosage: '50mg', frequency: 'Once at onset of headache', duration: 'As needed' },
    { name: 'Naproxen 500mg', dosage: '500mg', frequency: 'Twice daily after meals', duration: '5 Days' },
  ],
  'RX-2025-0005': [
    { name: 'Telmisartan 40mg', dosage: '40mg', frequency: 'Once daily in the morning', duration: 'Continuous' },
  ],
  'RX-2025-0004': [
    { name: 'Metformin 500mg', dosage: '500mg', frequency: 'Twice daily after meals', duration: 'Continuous' },
    { name: 'Glimepiride 1mg', dosage: '1mg', frequency: 'Once daily before breakfast', duration: 'Continuous' },
  ],
  'RX-2025-0003': [
    { name: 'Pantoprazole 40mg', dosage: '40mg', frequency: 'Once daily before food', duration: '14 Days' },
  ],
  'RX-2025-0002': [
    { name: 'Iron Supplement (Ferosig)', dosage: '150mg', frequency: 'Once daily with Vitamin C', duration: '30 Days' },
  ],
  'RX-2025-0001': [
    { name: 'Montelukast 10mg', dosage: '10mg', frequency: 'Once daily at night', duration: '10 Days' },
    { name: 'Fluticasone Nasal Spray', dosage: '50mcg', frequency: '2 sprays in each nostril daily', duration: '15 Days' },
  ]
};

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
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${styles[status]}`}>
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
  const navigate = useNavigate();
  const pageSize = 10;
  const tabs: Tab[] = ['All Prescriptions', 'Drafts', 'Sent', 'Expired'];

  // State arrays loaded from localStorage
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  // Filtering / search
  const [activeTab, setActiveTab] = useState<Tab>('All Prescriptions');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateFilter, setDateFilter] = useState('All');
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const [selectedRx, setSelectedRx] = useState<Prescription | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isViewRxModalOpen, setIsViewRxModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [activeMenuRxId, setActiveMenuRxId] = useState<string | null>(null);

  // Form states
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [rxStatus, setRxStatus] = useState<PrescriptionStatus>('Sent');
  const [medications, setMedications] = useState<Medication[]>([]);
  
  // Single Medication item builder state
  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medFreq, setMedFreq] = useState('');
  const [medDur, setMedDur] = useState('');

  // Import file details
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState(0);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Load state from localStorage on init
  useEffect(() => {
    // Prescriptions load
    const savedRx = localStorage.getItem('viziito_prescriptions');
    let loadedRx: Prescription[] = [];
    if (savedRx) {
      try {
        loadedRx = JSON.parse(savedRx);
      } catch (e) {
        loadedRx = MOCK_PRESCRIPTIONS;
      }
    } else {
      loadedRx = MOCK_PRESCRIPTIONS;
      localStorage.setItem('viziito_prescriptions', JSON.stringify(MOCK_PRESCRIPTIONS));
    }
    setPrescriptions(loadedRx);
    if (loadedRx.length > 0) {
      setSelectedRx(loadedRx[0]);
    }

    // Patients load (for select dropdown)
    const savedPatients = localStorage.getItem('viziito_patients');
    const fullDefaultPatients = [
      { id: 'PAT123456', name: 'Amit Sharma',  initials: 'AS', age: 32, gender: 'Male',   phone: '+91 98765 43210', email: 'amit.sharma@email.com',  lastVisit: '28 May 2025', lastVisitTime: '11:30 AM', status: 'Active' as const,   appointments: 8  },
      { id: 'PAT123457', name: 'Priya Singh',  initials: 'PS', age: 28, gender: 'Female', phone: '+91 91234 56789', email: 'priya.singh@email.com',   lastVisit: '27 May 2025', lastVisitTime: '04:15 PM', status: 'Active' as const,   appointments: 5  },
      { id: 'PAT123458', name: 'Ramesh Kumar', initials: 'RK', age: 45, gender: 'Male',   phone: '+91 99876 54321', email: 'ramesh.kumar@email.com',  lastVisit: '27 May 2025', lastVisitTime: '10:20 AM', status: 'Active' as const,   appointments: 12 },
      { id: 'PAT123459', name: 'Neha Devi',   initials: 'ND', age: 35, gender: 'Female', phone: '+91 93456 78901', email: 'neha.devi@email.com',     lastVisit: '26 May 2025', lastVisitTime: '03:40 PM', status: 'Active' as const,   appointments: 6  },
      { id: 'PAT123460', name: 'Vikram Singh', initials: 'VS', age: 50, gender: 'Male',   phone: '+91 90000 11223', email: 'vikram.singh@email.com',  lastVisit: '26 May 2025', lastVisitTime: '11:05 AM', status: 'Inactive' as const, appointments: 3  },
      { id: 'PAT123461', name: 'Anjali Patel', initials: 'AP', age: 29, gender: 'Female', phone: '+91 95555 66778', email: 'anjali.patel@email.com',  lastVisit: '25 May 2025', lastVisitTime: '02:10 PM', status: 'Active' as const,   appointments: 4  },
      { id: 'PAT123462', name: 'Mohit Jain',   initials: 'MJ', age: 41, gender: 'Male',   phone: '+91 97777 88990', email: 'mohit.jain@email.com',    lastVisit: '25 May 2025', lastVisitTime: '09:30 AM', status: 'Active' as const,   appointments: 7  },
      { id: 'PAT123463', name: 'Sneha Sharma', initials: 'SS', age: 31, gender: 'Female', phone: '+91 98888 77665', email: 'sneha.sharma@email.com',  lastVisit: '24 May 2025', lastVisitTime: '06:45 PM', status: 'Active' as const,   appointments: 3  },
    ];

    if (savedPatients) {
      try {
        const parsed = JSON.parse(savedPatients);
        const isCorrupt = parsed.some((p: any) => !p.phone || !p.status);
        if (isCorrupt) {
          setPatients(fullDefaultPatients);
          localStorage.setItem('viziito_patients', JSON.stringify(fullDefaultPatients));
        } else {
          setPatients(parsed);
        }
      } catch (err) {
        setPatients(fullDefaultPatients);
      }
    } else {
      setPatients(fullDefaultPatients);
      localStorage.setItem('viziito_patients', JSON.stringify(fullDefaultPatients));
    }
  }, []);

  // Sync back to localstorage
  const syncPrescriptions = (updated: Prescription[]) => {
    setPrescriptions(updated);
    localStorage.setItem('viziito_prescriptions', JSON.stringify(updated));
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Close menus on document click
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenuRxId(null);
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Filter logic
  const filtered = prescriptions.filter(rx => {
    const matchTab =
      activeTab === 'All Prescriptions' ||
      rx.status === activeTab.replace('s', ''); // Drafts -> Draft, Sent, Expired
      
    const matchSearch =
      rx.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rx.diagnosis.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchStatus =
      statusFilter === 'All Status' || rx.status === statusFilter;

    const matchDate =
      dateFilter === 'All' || rx.date === dateFilter;
      
    return matchTab && matchSearch && matchStatus && matchDate;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated  = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const tabCounts: Record<Tab, number> = {
    'All Prescriptions': prescriptions.length,
    'Drafts':  prescriptions.filter(r => r.status === 'Draft').length,
    'Sent':    prescriptions.filter(r => r.status === 'Sent').length,
    'Expired': prescriptions.filter(r => r.status === 'Expired').length,
  };

  // Medicine helper lists
  const addMedication = () => {
    if (!medName) {
      showToast('Medicine name is required.', 'error');
      return;
    }
    const newMed: Medication = {
      name: medName,
      dosage: medDosage || 'N/A',
      frequency: medFreq || 'Once daily',
      duration: medDur || 'As needed'
    };
    setMedications(prev => [...prev, newMed]);
    setMedName('');
    setMedDosage('');
    setMedFreq('');
    setMedDur('');
  };

  const removeMedication = (index: number) => {
    setMedications(prev => prev.filter((_, idx) => idx !== index));
  };

  // Submit new prescription
  const handleNewRxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId || !diagnosis) {
      showToast('Please select a patient and enter a diagnosis.', 'error');
      return;
    }

    const patient = patients.find(p => p.id === selectedPatientId);
    if (!patient) return;

    const rxId = `RX-2025-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRx: Prescription = {
      id: rxId,
      patient: patient.name,
      patientId: patient.id,
      initials: patient.initials,
      age: patient.age,
      gender: patient.gender,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      diagnosis,
      status: rxStatus,
      medications: medications.length > 0 ? medications : [
        { name: 'Standard Antibiotic', dosage: '500mg', frequency: 'Once daily after food', duration: '5 Days' }
      ]
    };

    const updated = [newRx, ...prescriptions];
    syncPrescriptions(updated);
    setSelectedRx(newRx);
    
    // Increment patient prescription counts in localStorage if detail exists
    const savedDetails = localStorage.getItem('viziito_patient_details');
    if (savedDetails) {
      try {
        const detailsDict = JSON.parse(savedDetails);
        if (detailsDict[patient.id]) {
          detailsDict[patient.id].totalPrescriptions += 1;
          localStorage.setItem('viziito_patient_details', JSON.stringify(detailsDict));
        }
      } catch (err) {}
    }

    setIsNewModalOpen(false);
    resetNewForm();
    showToast(`Prescription ${rxId} created successfully.`);
  };

  const resetNewForm = () => {
    setSelectedPatientId('');
    setDiagnosis('');
    setRxStatus('Sent');
    setMedications([]);
    setMedName('');
    setMedDosage('');
    setMedFreq('');
    setMedDur('');
  };

  // Delete Prescription
  const handleDeleteRxConfirm = () => {
    if (!selectedRx) return;
    const updated = prescriptions.filter(r => r.id !== selectedRx.id);
    syncPrescriptions(updated);
    setIsDeleteConfirmOpen(false);
    showToast(`Prescription ${selectedRx.id} has been deleted.`, 'error');
    setSelectedRx(updated.length > 0 ? updated[0] : null);
  };

  // Send Again action
  const handleSendAgain = (rx: Prescription) => {
    showToast(`Prescription ${rx.id} successfully sent to ${rx.patient} via SMS & Email.`, 'success');
  };

  // Mock Upload parsing
  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile) {
      showToast('Please select a file to import.', 'error');
      return;
    }

    setIsImporting(true);
    setImportProgress(20);

    const interval = setInterval(() => {
      setImportProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const parsedRx: Prescription = {
              id: `RX-2025-${Math.floor(1000 + Math.random() * 9000)}`,
              patient: 'Neha Devi',
              patientId: 'PAT123459',
              initials: 'ND',
              age: 35,
              gender: 'Female',
              date: '26 May 2025',
              time: '03:40 PM',
              diagnosis: 'Gastritis / Reflux',
              status: 'Sent',
              medications: [
                { name: 'Pantoprazole 40mg', dosage: '40mg', frequency: 'Once daily before breakfast', duration: '14 Days' },
                { name: 'Antacid Gel', dosage: '10ml', frequency: 'Three times daily after food', duration: '7 Days' }
              ]
            };

            const updated = [parsedRx, ...prescriptions];
            syncPrescriptions(updated);
            setSelectedRx(parsedRx);

            setIsImporting(false);
            setIsImportModalOpen(false);
            setImportFile(null);
            setImportProgress(0);
            showToast('Prescription imported and parsed successfully.');
          }, 300);
          return 100;
        }
        return p + 20;
      });
    }, 250);
  };

  // Retrieve current active medications for display in sidebar/modal
  const getActiveMeds = (rx: Prescription): Medication[] => {
    if (rx.medications && rx.medications.length > 0) return rx.medications;
    return MOCK_MEDS_MAP[rx.id] || [{ name: 'Paracetamol 650mg', dosage: '650mg', frequency: 'As needed for fever', duration: '5 Days' }];
  };

  return (
    <div className="w-full animate-fade flex flex-col gap-0" style={{ minHeight: 0 }}>
      
      {/* ─── Toast Alerts ──────────────────────────────────────────────────── */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade flex items-center gap-3 bg-slate-900 border border-slate-800 text-white px-5 py-3.5 rounded-2xl shadow-xl max-w-sm">
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          ) : (
            <RefreshCw className="w-5 h-5 text-sky-400 shrink-0 animate-spin" />
          )}
          <span className="text-xs font-bold leading-normal">{toast.message}</span>
        </div>
      )}

      {/* ─── Page Header ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Prescription Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Create, view and manage patient prescriptions</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Import Prescription
          </button>
          <button 
            onClick={() => { resetNewForm(); setIsNewModalOpen(true); }}
            className="btn btn-primary flex items-center gap-2 px-5 py-2.5 shadow-md shadow-teal-500/20 text-sm cursor-pointer"
          >
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
                  className={`relative px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer ${
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
              <div className="relative">
                <button 
                  onClick={() => setIsDateFilterOpen(!isDateFilterOpen)}
                  className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-600 font-medium hover:border-slate-300 transition-all shadow-sm whitespace-nowrap cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {dateFilter === 'All' ? 'All Dates' : dateFilter}
                </button>
                {isDateFilterOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setIsDateFilterOpen(false)} />
                    <div className="absolute left-0 mt-1 w-44 bg-white border border-slate-200 shadow-xl rounded-xl py-1.5 z-30 animate-fade text-left">
                      {['All', '28 May 2025', '27 May 2025', '26 May 2025', '25 May 2025'].map(opt => (
                        <button
                          key={opt}
                          onClick={() => {
                            setDateFilter(opt);
                            setIsDateFilterOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
                        >
                          {opt === 'All' ? 'All Dates' : opt}
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

              {(searchTerm || dateFilter !== 'All' || statusFilter !== 'All Status') && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setDateFilter('All');
                    setStatusFilter('All Status');
                  }}
                  className="text-xs font-bold text-teal-600 hover:text-teal-700 cursor-pointer pl-1.5"
                >
                  Reset Filters
                </button>
              )}
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
                    i === 3 ? 'col-span-2' :
                    i === 4 ? 'col-span-2' :
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
                    className={`grid grid-cols-12 gap-2 px-5 py-3.5 items-center cursor-pointer transition-colors group relative ${
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
                    <div className="col-span-2">
                      <p className="text-xs font-semibold text-slate-700 leading-snug truncate">{rx.diagnosis}</p>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <StatusBadge status={rx.status} />
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 flex items-center justify-end gap-1 relative">
                      <button
                        className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors cursor-pointer"
                        title="View Prescription"
                        onClick={e => { e.stopPropagation(); setSelectedRx(rx); setIsViewRxModalOpen(true); }}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        title="More actions"
                        onClick={e => {
                          e.stopPropagation();
                          setActiveMenuRxId(activeMenuRxId === rx.id ? null : rx.id);
                        }}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuRxId === rx.id && (
                        <div 
                          className="absolute right-0 top-8 mt-1 w-40 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 animate-fade"
                          onClick={e => e.stopPropagation()}
                        >
                          <button 
                            onClick={() => { setActiveMenuRxId(null); setSelectedRx(rx); setIsViewRxModalOpen(true); }}
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400" /> View / Print
                          </button>
                          <button 
                            onClick={() => { setActiveMenuRxId(null); handleSendAgain(rx); }}
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5 text-slate-400" /> Send SMS
                          </button>
                          <div className="border-t border-slate-100 my-1" />
                          <button 
                            onClick={() => { setActiveMenuRxId(null); setSelectedRx(rx); setIsDeleteConfirmOpen(true); }}
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-400" /> Delete
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
                Showing {Math.min((currentPage - 1) * pageSize + 1, filtered.length)}–{Math.min(currentPage * pageSize, filtered.length)} of {filtered.length} prescriptions
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
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      currentPage === idx + 1
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

        {/* ── Right: Detail sidebar ───────────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-5">

          {/* Patient Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-800">Patient Summary</h3>
              <button 
                onClick={() => {
                  if (selectedRx) {
                    navigate(`/patients/${selectedRx.patientId}`);
                  }
                }}
                className="p-1 text-slate-400 hover:text-teal-600 transition-colors cursor-pointer"
                title="View Full Profile"
              >
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

                <button 
                  onClick={() => navigate(`/patients/${selectedRx.patientId}`)}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 mb-5 transition-colors cursor-pointer"
                >
                  View Profile <ExternalLink className="w-3 h-3" />
                </button>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-slate-100">
                  {[
                    { label: 'Last Visit', value: selectedRx.date },
                    { label: 'Allergies', value: 'Penicillin' },
                    { label: 'Blood Group', value: 'B+' },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="text-[10px] text-slate-400 font-medium">{item.label}</p>
                      <p className="text-xs font-bold text-slate-700 mt-0.5 truncate">{item.value}</p>
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
                <button 
                  onClick={() => setIsViewRxModalOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-teal-50 hover:bg-teal-100 text-teal-700 border border-teal-200 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  View Full Prescription
                </button>
                <button 
                  onClick={() => handleSendAgain(selectedRx)}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                >
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
              <button 
                onClick={() => {
                  setActiveTab('All Prescriptions');
                  showToast('Showing all historical prescriptions.');
                }}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
              >
                View All
              </button>
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

      {/* ─── MODALS ────────────────────────────────────────────────────────── */}

      {/* NEW PRESCRIPTION MODAL */}
      {isNewModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto"
          onClick={() => setIsNewModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto animate-fade"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-lg font-bold text-slate-800">Create Prescription</h3>
              <button 
                onClick={() => setIsNewModalOpen(false)} 
                className="p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-lg transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleNewRxSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Select Patient *</label>
                  <select
                    value={selectedPatientId}
                    onChange={e => setSelectedPatientId(e.target.value)}
                    className="form-control cursor-pointer"
                    required
                  >
                    <option value="">-- Choose Patient --</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Diagnosis *</label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={e => setDiagnosis(e.target.value)}
                    placeholder="e.g. Acute Bronchitis"
                    className="form-control"
                    required
                  />
                </div>
              </div>

              {/* Medication Builder */}
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
                <h4 className="text-xs font-extrabold text-slate-600 uppercase tracking-wide mb-3 flex items-center gap-1">
                  <Syringe className="w-3.5 h-3.5 text-teal-600" /> Medication List Builder
                </h4>

                {/* Entered Meds list */}
                {medications.length > 0 ? (
                  <div className="bg-white border border-slate-150 rounded-xl divide-y divide-slate-100 overflow-hidden mb-4 shadow-xs">
                    {medications.map((med, index) => (
                      <div key={index} className="px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-700">
                        <div className="grid grid-cols-4 gap-2 flex-1 items-center">
                          <span className="font-bold text-slate-900 col-span-2">{med.name}</span>
                          <span className="text-slate-500">{med.dosage} · {med.frequency}</span>
                          <span className="text-slate-400 text-right">{med.duration}</span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => removeMedication(index)}
                          className="p-1 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer ml-3 shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic mb-4">No medications added yet. Use the fields below to add drugs.</p>
                )}

                {/* Entry Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-end">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Drug Name & strength</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Amoxicillin 500mg" 
                      value={medName}
                      onChange={e => setMedName(e.target.value)}
                      className="form-control py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Dosage</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 500mg" 
                      value={medDosage}
                      onChange={e => setMedDosage(e.target.value)}
                      className="form-control py-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Frequency</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Twice daily" 
                      value={medFreq}
                      onChange={e => setMedFreq(e.target.value)}
                      className="form-control py-2 text-xs"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 items-end mt-2">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Duration</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 5 Days or Continuous" 
                      value={medDur}
                      onChange={e => setMedDur(e.target.value)}
                      className="form-control py-2 text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      type="button"
                      onClick={addMedication}
                      className="btn btn-secondary py-1.5 text-xs px-4 flex items-center gap-1 bg-white cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Drug
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Initial Status</label>
                  <div className="flex gap-4 mt-2">
                    <label className="inline-flex items-center text-xs font-semibold text-slate-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="rxStatus" 
                        checked={rxStatus === 'Sent'} 
                        onChange={() => setRxStatus('Sent')}
                        className="mr-1.5 text-teal-600 focus:ring-teal-500" 
                      />
                      Sent (Active)
                    </label>
                    <label className="inline-flex items-center text-xs font-semibold text-slate-700 cursor-pointer">
                      <input 
                        type="radio" 
                        name="rxStatus" 
                        checked={rxStatus === 'Draft'} 
                        onChange={() => setRxStatus('Draft')}
                        className="mr-1.5 text-teal-600 focus:ring-teal-500" 
                      />
                      Draft
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="btn btn-secondary text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary text-sm cursor-pointer"
                >
                  Create & Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW PRESCRIPTION RX PAD MODAL */}
      {isViewRxModalOpen && selectedRx && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setIsViewRxModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full p-0 shadow-2xl border border-slate-150 overflow-hidden animate-fade"
            onClick={e => e.stopPropagation()}
          >
            {/* Header controls */}
            <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
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
            <div className="p-8 bg-white text-slate-800 print:p-0" id="rx-pad-print-area">
              
              {/* Doctor details */}
              <div className="flex justify-between items-start border-b-2 border-slate-200 pb-4 mb-6">
                <div>
                  <h2 className="text-lg font-extrabold text-teal-800">Dr. Arjun Reddy, MD</h2>
                  <p className="text-[11px] text-slate-500 font-semibold mt-0.5">Consultant Cardiologist & Physician</p>
                  <p className="text-[10px] text-slate-400">Reg. No: AP-2015-88329</p>
                </div>
                <div className="text-right">
                  <h3 className="text-xs font-extrabold text-slate-700">VIZIITO CLINIC CENTER</h3>
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
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Date / Time</span>
                  <p className="font-semibold text-slate-700 mt-0.5">{selectedRx.date} · {selectedRx.time}</p>
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
                  {getActiveMeds(selectedRx).map((med, index) => (
                    <tr key={index}>
                      <td className="py-3 font-bold text-slate-800">{med.name}</td>
                      <td className="py-3">{med.dosage}</td>
                      <td className="py-3">{med.frequency}</td>
                      <td className="py-3 text-right text-slate-600">{med.duration}</td>
                    </tr>
                  ))}
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
        </div>
      )}

      {/* DELETE RX CONFIRMATION */}
      {isDeleteConfirmOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setIsDeleteConfirmOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-fade"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-extrabold">Delete Prescription</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-5">
              Are you sure you want to permanently delete prescription <b>{selectedRx?.id}</b> for <b>{selectedRx?.patient}</b>? This record will be erased from patient records database.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsDeleteConfirmOpen(false)} 
                className="btn btn-secondary text-xs cursor-pointer py-2 px-4"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteRxConfirm} 
                className="btn bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-2 px-4 rounded-xl cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT PRESCRIPTION MODAL */}
      {isImportModalOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
          onClick={() => setIsImportModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-fade"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-sm font-bold text-slate-800">Import Prescription</h3>
              <button 
                onClick={() => setIsImportModalOpen(false)} 
                className="p-1 text-slate-400 hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleImportSubmit} className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-teal-400 transition-colors flex flex-col items-center gap-2">
                <FileText className="w-10 h-10 text-slate-400" />
                <p className="text-xs font-bold text-slate-700">Drag & drop scanned Rx file here</p>
                <p className="text-[10px] text-slate-400">or upload pdf / image prescription</p>
                <input 
                  type="file" 
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={e => setImportFile(e.target.files ? e.target.files[0] : null)}
                  className="hidden" 
                  id="rx-import-input"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('rx-import-input')?.click()}
                  className="mt-2 text-xs font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg cursor-pointer"
                >
                  Browse File
                </button>
              </div>

              {importFile && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 truncate max-w-[200px]">{importFile.name}</span>
                  <button type="button" onClick={() => setImportFile(null)} className="text-rose-500 hover:text-rose-600 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {isImporting && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-slate-500">
                    <span>Extracting medical prescriptions via OCR...</span>
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
                  disabled={isImporting || !importFile}
                  className="btn btn-primary text-xs cursor-pointer py-2 px-4"
                >
                  Upload & Parse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
