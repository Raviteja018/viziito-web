import React, { useState, useEffect } from 'react';
import { useHospitalRole } from '../../store/hospital/HospitalRoleContext';
import {
  MOCK_DOCTORS,
  MOCK_BRANCHES,
  MOCK_DEPARTMENTS,
  MOCK_APPOINTMENTS,
  type AssociatedDoctor,
  type Branch,
  type Department
} from '../../mocks/hospitalMocks';
import {
  Search, Filter, Plus, FileText, ChevronDown, Check, X,
  User, CheckCircle2, AlertTriangle, ShieldCheck, Mail, Phone,
  Calendar, Layers, MapPin, DollarSign, Activity, Edit2, Trash2,
  Clock, RefreshCw, Star, Info, MoreHorizontal
} from 'lucide-react';

export interface LocalDoctor extends AssociatedDoctor {
  status: 'Active' | 'Inactive' | 'Pending Acceptance' | 'Rejected' | 'Suspended';
  experience: number; // years
  qualification: string;
  registrationNumber: string;
  languages: string[];
  biography: string;
  lastUpdated: string;
  onlineFee: number;
  inPersonFee: number;
  followUpDuration: number; // days
  slotDuration: number; // mins
  bookingWindow: number; // days
  appointmentBuffer: number; // mins
  email: string;
  mobile: string;
}

// Global Vizito Doctor Directory for Option 1 search mock
const VIZITO_GLOBAL_DIRECTORY = [
  {
    id: 'doc_global_1',
    name: 'Dr. Ramesh Kumar',
    specialization: 'Neurologist',
    qualification: 'MBBS, MD, DM (Neurology)',
    experience: 16,
    registrationNumber: 'MCI-10922',
    email: 'ramesh.kumar@vizito.com',
    mobile: '9988776655',
    languages: ['English', 'Hindi', 'Kannada'],
    imageUrl: 'https://i.pravatar.cc/150?img=53',
    biography: 'Expert in epilepsy treatment, stroke management, and general clinical neurology.'
  },
  {
    id: 'doc_global_2',
    name: 'Dr. Shalini Sen',
    specialization: 'Gynecologist',
    qualification: 'MBBS, MS (Obstetrics & Gynecology)',
    experience: 12,
    registrationNumber: 'MCI-44122',
    email: 'shalini.sen@vizito.com',
    mobile: '9988776656',
    languages: ['English', 'Bengali', 'Hindi'],
    imageUrl: 'https://i.pravatar.cc/150?img=45',
    biography: 'Specialized in laparoscopic surgeries, high-risk pregnancy care, and infertility treatments.'
  }
];

const initialLocalDoctors = (rawMocks: AssociatedDoctor[]): LocalDoctor[] => {
  return rawMocks.map((d, index) => {
    const statuses: LocalDoctor['status'][] = ['Active', 'Active', 'Active', 'Pending Acceptance', 'Inactive'];
    const qualifications = ['MBBS, MD (Cardiology)', 'MBBS, DNB (Pediatrics)', 'MBBS, MS (Orthopedics)', 'MBBS, MD (General Medicine)', 'MBBS, MD (Neurology)'];
    const experiences = [14, 8, 11, 6, 18];
    const regNumbers = ['TSMC-88120', 'APMC-45911', 'KMC-33921', 'MCI-77124', 'TSMC-55912'];
    const emails = ['arjun.reddy@vizito.com', 'priya.sharma@vizito.com', 'vikram.seth@vizito.com', 'sneha.patil@vizito.com', 'rajesh.kumar@vizito.com'];
    const mobiles = ['9876543210', '9876543211', '9876543212', '9876543213', '9876543214'];
    const bios = [
      'Senior consultant with over 14 years of experience in interventional cardiology and general cardiac care.',
      'Dedicated pediatrician focused on child healthcare development and pediatric emergency management.',
      'Specialist in joint replacements, sports injuries, and complex orthopedic trauma surgeries.',
      'General physician with extensive training in diagnosing and treating chronic illnesses.',
      'Expert neurologist dealing with neurological disorders, stroke prevention, and epilepsy care.'
    ];

    return {
      ...d,
      status: statuses[index % statuses.length],
      experience: experiences[index % experiences.length],
      qualification: qualifications[index % qualifications.length],
      registrationNumber: regNumbers[index % regNumbers.length],
      languages: ['English', 'Hindi', index % 2 === 0 ? 'Telugu' : 'Tamil'],
      biography: bios[index % bios.length],
      lastUpdated: new Date(Date.now() - index * 86400000 * 3).toISOString().split('T')[0],
      onlineFee: d.consultationType === 'In-Person' ? 0 : d.consultationFee - 100,
      inPersonFee: d.consultationType === 'Online' ? 0 : d.consultationFee,
      followUpDuration: 7,
      slotDuration: 15,
      bookingWindow: 30,
      appointmentBuffer: 5,
      email: emails[index % emails.length],
      mobile: mobiles[index % mobiles.length]
    };
  });
};

const DoctorManagementScreen: React.FC = () => {
  const { role, assignedBranch } = useHospitalRole();
  const todayStr = new Date().toISOString().split('T')[0];
  const [doctors, setDoctors] = useState<LocalDoctor[]>(() => {
    const saved = localStorage.getItem('vizito_associated_doctors');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const initialized = initialLocalDoctors(MOCK_DOCTORS);
    localStorage.setItem('vizito_associated_doctors', JSON.stringify(initialized));
    return initialized;
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedAvail, setSelectedAvail] = useState('All');
  const [sortOption, setSortOption] = useState('Doctor Name');

  // Modals States
  const [activeModal, setActiveModal] = useState<'view' | 'add' | 'branch' | 'dept' | 'consult' | 'remove' | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<LocalDoctor | null>(null);

  // Add Doctor Sub-Tab (existing vs invite)
  const [addMode, setAddMode] = useState<'existing' | 'invite'>('existing');
  const [searchExistingQuery, setSearchExistingQuery] = useState('');
  const [searchedExistingDoctor, setSearchedExistingDoctor] = useState<any | null>(null);
  const [searchExistingError, setSearchExistingError] = useState<string | null>(null);

  // Invite Form State
  const [inviteForm, setInviteForm] = useState({
    name: '',
    mobile: '',
    email: '',
    department: 'General Medicine',
    branch: 'Jubilee Hills Branch',
    consultationType: 'Both' as 'Online' | 'In-Person' | 'Both'
  });
  const [inviteFormError, setInviteFormError] = useState<string | null>(null);

  // Modals Working States
  const [branchCheckboxes, setBranchCheckboxes] = useState<Record<string, boolean>>({});
  const [deptCheckboxes, setDeptCheckboxes] = useState<Record<string, boolean>>({});
  const [consultForm, setConsultForm] = useState({
    onlineFee: 0,
    inPersonFee: 0,
    followUpDuration: 7,
    slotDuration: 15,
    bookingWindow: 30,
    appointmentBuffer: 5,
    consultationType: 'Both' as 'Online' | 'In-Person' | 'Both'
  });
  const [consultError, setConsultError] = useState<string | null>(null);

  // Save changes helper
  const saveDoctors = (list: LocalDoctor[]) => {
    setDoctors(list);
    localStorage.setItem('vizito_associated_doctors', JSON.stringify(list));
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Search vizito global directory
  const handleSearchExisting = () => {
    setSearchExistingError(null);
    setSearchedExistingDoctor(null);

    const query = searchExistingQuery.trim().toLowerCase();
    if (!query) return;

    // Check if duplicate pending or associated
    const alreadyExists = doctors.some(d =>
      d.id.toLowerCase() === query ||
      d.email.toLowerCase() === query ||
      d.mobile === query ||
      d.registrationNumber.toLowerCase() === query
    );

    if (alreadyExists) {
      setSearchExistingError('This doctor is already associated or pending invitation with your hospital.');
      return;
    }

    const matched = VIZITO_GLOBAL_DIRECTORY.find(doc =>
      doc.id.toLowerCase() === query ||
      doc.email.toLowerCase() === query ||
      doc.mobile === query ||
      doc.registrationNumber.toLowerCase() === query
    );

    if (matched) {
      setSearchedExistingDoctor(matched);
    } else {
      setSearchExistingError('No doctor found on Vizito platform matching this criteria.');
    }
  };

  // 2. Add existing request
  const handleSendRequest = () => {
    if (!searchedExistingDoctor) return;

    const newDoc: LocalDoctor = {
      id: searchedExistingDoctor.id,
      name: searchedExistingDoctor.name,
      specialization: searchedExistingDoctor.specialization,
      departments: ['General Medicine'],
      branches: [role === 'receptionist' ? assignedBranch : 'Jubilee Hills Branch'],
      consultationType: 'Both',
      consultationFee: 1000,
      availabilityStatus: 'Available Today',
      imageUrl: searchedExistingDoctor.imageUrl,
      status: 'Pending Acceptance',
      experience: searchedExistingDoctor.experience,
      qualification: searchedExistingDoctor.qualification,
      registrationNumber: searchedExistingDoctor.registrationNumber,
      languages: searchedExistingDoctor.languages,
      biography: searchedExistingDoctor.biography,
      lastUpdated: new Date().toISOString().split('T')[0],
      onlineFee: 800,
      inPersonFee: 1000,
      followUpDuration: 7,
      slotDuration: 15,
      bookingWindow: 30,
      appointmentBuffer: 5,
      email: searchedExistingDoctor.email,
      mobile: searchedExistingDoctor.mobile
    };

    saveDoctors([...doctors, newDoc]);
    triggerToast(`Association request sent to ${searchedExistingDoctor.name}.`);
    setActiveModal(null);
    setSearchExistingQuery('');
    setSearchedExistingDoctor(null);
  };

  // 3. Invite new doctor
  const handleInviteDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    setInviteFormError(null);

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!inviteForm.name.trim()) {
      setInviteFormError('Doctor Name is required.');
      return;
    }
    if (!phoneRegex.test(inviteForm.mobile)) {
      setInviteFormError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!emailRegex.test(inviteForm.email)) {
      setInviteFormError('Please enter a valid email address.');
      return;
    }

    // Check duplicate
    const alreadyExists = doctors.some(d =>
      d.email.toLowerCase() === inviteForm.email.toLowerCase() ||
      d.mobile === inviteForm.mobile
    );

    if (alreadyExists) {
      setInviteFormError('A doctor with this email or mobile is already associated/invited.');
      return;
    }

    const newDocId = `doc_invited_${Date.now()}`;
    const newDoc: LocalDoctor = {
      id: newDocId,
      name: inviteForm.name,
      specialization: 'General Practitioner',
      departments: [inviteForm.department],
      branches: [inviteForm.branch],
      consultationType: inviteForm.consultationType,
      consultationFee: 500,
      availabilityStatus: 'No Availability',
      imageUrl: '',
      status: 'Pending Acceptance',
      experience: 1,
      qualification: 'MBBS (Pending Registration)',
      registrationNumber: 'PENDING-REG',
      languages: ['English'],
      biography: 'Newly invited general practitioner. Vizito profile setup pending.',
      lastUpdated: new Date().toISOString().split('T')[0],
      onlineFee: inviteForm.consultationType === 'In-Person' ? 0 : 500,
      inPersonFee: inviteForm.consultationType === 'Online' ? 0 : 500,
      followUpDuration: 5,
      slotDuration: 15,
      bookingWindow: 30,
      appointmentBuffer: 5,
      email: inviteForm.email,
      mobile: inviteForm.mobile
    };

    saveDoctors([...doctors, newDoc]);
    triggerToast(`Invitation successfully sent to ${inviteForm.name}.`);
    setActiveModal(null);
    setInviteForm({
      name: '',
      mobile: '',
      email: '',
      department: 'General Medicine',
      branch: 'Jubilee Hills Branch',
      consultationType: 'Both'
    });
  };

  // 4. Update branch checkboxes state when opening modal
  const openBranchModal = (doc: LocalDoctor) => {
    setSelectedDoctor(doc);
    const checks: Record<string, boolean> = {};
    MOCK_BRANCHES.filter(b => b.status === 'Active').forEach(b => {
      checks[b.name] = doc.branches.includes(b.name);
    });
    setBranchCheckboxes(checks);
    setActiveModal('branch');
  };

  const handleSaveBranches = () => {
    if (!selectedDoctor) return;
    const nextBranches = Object.keys(branchCheckboxes).filter(name => branchCheckboxes[name]);
    
    if (nextBranches.length === 0) {
      triggerToast('A doctor must be assigned to at least one active branch.');
      return;
    }

    const updated = doctors.map(d =>
      d.id === selectedDoctor.id ? { ...d, branches: nextBranches, lastUpdated: new Date().toISOString().split('T')[0] } : d
    );
    saveDoctors(updated);
    triggerToast(`Updated branch assignments for ${selectedDoctor.name}.`);
    setActiveModal(null);
  };

  // 5. Update department checkboxes state when opening modal
  const openDeptModal = (doc: LocalDoctor) => {
    setSelectedDoctor(doc);
    const checks: Record<string, boolean> = {};
    MOCK_DEPARTMENTS.filter(d => d.status === 'Active').forEach(d => {
      checks[d.name] = doc.departments.includes(d.name);
    });
    setDeptCheckboxes(checks);
    setActiveModal('dept');
  };

  const handleSaveDepts = () => {
    if (!selectedDoctor) return;
    const nextDepts = Object.keys(deptCheckboxes).filter(name => deptCheckboxes[name]);

    if (nextDepts.length === 0) {
      triggerToast('A doctor must be assigned to at least one active department.');
      return;
    }

    const updated = doctors.map(d =>
      d.id === selectedDoctor.id ? { ...d, departments: nextDepts, lastUpdated: new Date().toISOString().split('T')[0] } : d
    );
    saveDoctors(updated);
    triggerToast(`Updated department assignments for ${selectedDoctor.name}.`);
    setActiveModal(null);
  };

  // 6. Manage Consultation Modal
  const openConsultModal = (doc: LocalDoctor) => {
    setSelectedDoctor(doc);
    setConsultForm({
      onlineFee: doc.onlineFee,
      inPersonFee: doc.inPersonFee,
      followUpDuration: doc.followUpDuration,
      slotDuration: doc.slotDuration,
      bookingWindow: doc.bookingWindow,
      appointmentBuffer: doc.appointmentBuffer,
      consultationType: doc.consultationType
    });
    setConsultError(null);
    setActiveModal('consult');
  };

  const handleSaveConsultSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setConsultError(null);

    if (consultForm.onlineFee < 0 || consultForm.inPersonFee < 0) {
      setConsultError('Consultation fees cannot be negative values.');
      return;
    }
    if (consultForm.followUpDuration < 0) {
      setConsultError('Follow-up duration days cannot be negative.');
      return;
    }

    if (!selectedDoctor) return;

    const updatedFee = consultForm.consultationType === 'Online'
      ? consultForm.onlineFee
      : consultForm.inPersonFee;

    const updated = doctors.map(d =>
      d.id === selectedDoctor.id
        ? {
            ...d,
            ...consultForm,
            consultationFee: updatedFee,
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        : d
    );

    saveDoctors(updated);
    triggerToast(`Consultation settings configured for ${selectedDoctor.name}.`);
    setActiveModal(null);
  };

  // 7. Remove Association workflow
  const openRemoveModal = (doc: LocalDoctor) => {
    setSelectedDoctor(doc);
    setActiveModal('remove');
  };

  const handleConfirmRemove = () => {
    if (!selectedDoctor) return;

    // Filter out doctor
    const updated = doctors.filter(d => d.id !== selectedDoctor.id);
    saveDoctors(updated);
    triggerToast(`Successfully removed association with ${selectedDoctor.name}.`);
    setActiveModal(null);
  };

  // 8. Toggle active/inactive status
  const handleToggleActive = (doc: LocalDoctor) => {
    const nextStatus: LocalDoctor['status'] = doc.status === 'Active' ? 'Inactive' : 'Active';
    const updated = doctors.map(d =>
      d.id === doc.id ? { ...d, status: nextStatus, lastUpdated: new Date().toISOString().split('T')[0] } : d
    );
    saveDoctors(updated);
    triggerToast(`${doc.name} status updated to ${nextStatus}.`);
  };

  // 9. Export logic mock
  const handleExport = () => {
    triggerToast('Doctor list exported successfully as CSV.');
  };

  // Get active branches for filters mapping
  const activeBranches = MOCK_BRANCHES.filter(b => b.status === 'Active');
  const activeDepartments = MOCK_DEPARTMENTS.filter(d => d.status === 'Active');

  // Filter application
  const getFilteredDoctors = () => {
    return doctors.filter(doc => {
      // 1. Search Query
      const query = searchQuery.trim().toLowerCase();
      if (query && query.length >= 3) {
        const matchesName = doc.name.toLowerCase().includes(query);
        const matchesEmail = doc.email.toLowerCase().includes(query);
        const matchesMobile = doc.mobile.includes(query);
        const matchesId = doc.id.toLowerCase().includes(query);
        const matchesReg = doc.registrationNumber.toLowerCase().includes(query);

        if (!matchesName && !matchesEmail && !matchesMobile && !matchesId && !matchesReg) {
          return false;
        }
      }

      // 2. Branch Filter (Admins check selected filter, Receptionists locked)
      if (role === 'receptionist') {
        if (!doc.branches.includes(assignedBranch)) return false;
      } else if (selectedBranches.length > 0) {
        const branchMatch = doc.branches.some(b => selectedBranches.includes(b));
        if (!branchMatch) return false;
      }

      // 3. Department Filter
      if (selectedDept !== 'All' && !doc.departments.includes(selectedDept)) return false;

      // 4. Consultation Type Filter
      if (selectedType !== 'All' && doc.consultationType !== selectedType && doc.consultationType !== 'Both') return false;

      // 5. Status Filter
      if (selectedStatus !== 'All' && doc.status !== selectedStatus) return false;

      // 6. Availability Filter
      if (selectedAvail !== 'All' && doc.availabilityStatus !== selectedAvail) return false;

      return true;
    }).sort((a, b) => {
      if (sortOption === 'Doctor Name') return a.name.localeCompare(b.name);
      if (sortOption === 'Alphabetical') return a.name.localeCompare(b.name);
      if (sortOption === 'Experience') return b.experience - a.experience;
      if (sortOption === 'Recently Added') return b.lastUpdated.localeCompare(a.lastUpdated);
      return 0;
    });
  };

  const filteredDoctors = getFilteredDoctors();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 space-y-6">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white text-xs font-bold rounded-xl px-4 py-3 shadow-lg z-50 flex items-center gap-2 animate-fade border border-slate-800">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 leading-tight">Doctor Association Management</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Establish doctor profiles linkages, departments assignment, and configure consultation booking slots fees.
          </p>
        </div>
        {role === 'admin' && (
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExport}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors border border-slate-200/50"
            >
              <FileText className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => {
                setAddMode('existing');
                setSearchExistingQuery('');
                setSearchedExistingDoctor(null);
                setSearchExistingError(null);
                setActiveModal('add');
              }}
              className="bg-[#7C3AED] hover:bg-purple-800 text-white text-xs font-bold py-2.5 px-4.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>Associate / Invite Doctor</span>
            </button>
          </div>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          
          {/* Search bar */}
          <div className="relative col-span-1 sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Search Directory</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Name, ID, email, registration..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-medium rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
              />
            </div>
          </div>

          {/* Branch filter (Admin multi-select, locked for receptionist) */}
          {role === 'admin' ? (
            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Assigned Branch</label>
              <select
                multiple
                value={selectedBranches}
                onChange={(e) => {
                  const options = Array.from(e.target.selectedOptions, option => option.value);
                  setSelectedBranches(options);
                }}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-medium rounded-xl py-2 px-3 focus:outline-none focus:border-[#7C3AED] h-[40px]"
              >
                {activeBranches.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Branch</label>
              <div className="w-full bg-slate-100 border border-slate-200 text-slate-500 text-[13px] font-semibold rounded-xl py-2.5 px-3 cursor-not-allowed truncate">
                {assignedBranch}
              </div>
            </div>
          )}

          {/* Department Filter */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Department</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-medium rounded-xl py-2.5 px-3 focus:outline-none focus:border-[#7C3AED]"
            >
              <option value="All">All Departments</option>
              {activeDepartments.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Consultation Type */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Consult Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-medium rounded-xl py-2.5 px-3 focus:outline-none focus:border-[#7C3AED]"
            >
              <option value="All">All Types</option>
              <option value="Online">Online</option>
              <option value="In-Person">In-Person</option>
              <option value="Both">Both</option>
            </select>
          </div>

          {/* Status */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-medium rounded-xl py-2.5 px-3 focus:outline-none focus:border-[#7C3AED]"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending Acceptance">Pending Acceptance</option>
              <option value="Rejected">Rejected</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

        </div>

        {/* Second filters row: Availability, sorting, reset */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Availability:</span>
              <select
                value={selectedAvail}
                onChange={(e) => setSelectedAvail(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="All">All Availabilities</option>
                <option value="Available Today">Available Today</option>
                <option value="On Leave">On Leave</option>
                <option value="No Availability">No Availability</option>
                <option value="Fully Booked">Fully Booked</option>
              </select>
            </div>
            
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort by:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                <option value="Doctor Name">Doctor Name</option>
                <option value="Experience">Years of Experience</option>
                <option value="Recently Added">Recently Updated</option>
                <option value="Alphabetical">Alphabetical</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedBranches([]);
              setSelectedDept('All');
              setSelectedType('All');
              setSelectedStatus('All');
              setSelectedAvail('All');
              setSortOption('Doctor Name');
            }}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wider self-end sm:self-center"
          >
            Reset Filters
          </button>
        </div>

        {searchQuery.trim().length > 0 && searchQuery.trim().length < 3 && (
          <p className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" />
            <span>Please type at least 3 characters to search.</span>
          </p>
        )}
      </div>

      {/* Doctors Table Listing */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-4 px-5">Doctor</th>
                <th className="py-4 px-4">Doctor ID</th>
                <th className="py-4 px-4">Department</th>
                <th className="py-4 px-4">Assigned Branches</th>
                <th className="py-4 px-4">Consultation</th>
                <th className="py-4 px-4">Availability</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Last Updated</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700">
              {filteredDoctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/40 transition-colors">
                  
                  {/* Photo & Name */}
                  <td className="py-3.5 px-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                      {doc.imageUrl ? (
                        <img src={doc.imageUrl} alt={doc.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-purple-50 text-[#7C3AED]">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="font-black text-slate-800 block leading-tight">{doc.name}</span>
                      <span className="text-[10px] font-bold text-slate-400 block mt-0.5">{doc.specialization}</span>
                    </div>
                  </td>

                  {/* Doctor ID */}
                  <td className="py-3.5 px-4 font-mono text-[11.5px] font-bold text-slate-500">
                    {doc.id}
                  </td>

                  {/* Departments */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1">
                      {doc.departments.map((dept, i) => (
                        <span key={i} className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                          {dept}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Branches */}
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                      {doc.branches.map((b, i) => (
                        <span key={i} className="bg-purple-50 text-[#7C3AED] text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5" />
                          <span>{b.split(' ')[0]}</span>
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Consultation */}
                  <td className="py-3.5 px-4">
                    <div>
                      <span className="font-bold text-slate-850 block">{doc.consultationType}</span>
                      <span className="text-[10.5px] font-bold text-slate-400 block mt-0.5">₹{doc.consultationFee} fee</span>
                    </div>
                  </td>

                  {/* Availability */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      doc.availabilityStatus === 'Available Today'
                        ? 'bg-emerald-50 text-emerald-600'
                        : doc.availabilityStatus === 'On Leave'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-rose-50 text-rose-600'
                    }`}>
                      {doc.availabilityStatus}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                      doc.status === 'Active'
                        ? 'text-emerald-600 bg-emerald-50'
                        : doc.status === 'Pending Acceptance'
                        ? 'text-amber-600 bg-amber-50'
                        : 'text-slate-400 bg-slate-100'
                    }`}>
                      {doc.status}
                    </span>
                  </td>

                  {/* Last Updated */}
                  <td className="py-3.5 px-4 text-slate-450 font-medium text-[12px]">
                    {doc.lastUpdated}
                  </td>

                  {/* Actions column */}
                  <td className="py-3.5 px-5 text-right">
                    {role === 'admin' ? (
                      /* Admin Actions */
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => { setSelectedDoctor(doc); setActiveModal('view'); }}
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors cursor-pointer"
                          title="View Profile"
                        >
                          <Info className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openBranchModal(doc)}
                          className="px-2 py-1 bg-slate-50 hover:bg-purple-50 text-slate-650 hover:text-[#7C3AED] text-[11px] font-bold rounded-lg border border-slate-200/50 transition-all cursor-pointer"
                        >
                          Branch
                        </button>
                        <button
                          onClick={() => openDeptModal(doc)}
                          className="px-2 py-1 bg-slate-50 hover:bg-purple-50 text-slate-650 hover:text-[#7C3AED] text-[11px] font-bold rounded-lg border border-slate-200/50 transition-all cursor-pointer"
                        >
                          Dept
                        </button>
                        <button
                          onClick={() => openConsultModal(doc)}
                          className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors cursor-pointer"
                          title="Config Consultation"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(doc)}
                          className={`px-2 py-1 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                            doc.status === 'Active'
                              ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          }`}
                        >
                          {doc.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => openRemoveModal(doc)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                          title="Remove Association"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      /* Receptionist View Only Actions */
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => { setSelectedDoctor(doc); setActiveModal('view'); }}
                          className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-slate-200/50"
                        >
                          <Info className="w-3.5 h-3.5 text-slate-400" />
                          <span>View Profile</span>
                        </button>
                        <button
                          onClick={() => alert(`Redirecting to Appointment module to book with ${doc.name}`)}
                          className="px-2.5 py-1.5 bg-[#F3E8FF] hover:bg-[#E9D5FF] text-[#7C3AED] text-[11px] font-black rounded-lg transition-all cursor-pointer"
                        >
                          Book Slot
                        </button>
                      </div>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredDoctors.length === 0 && (
          <div className="text-center py-12 px-6">
            <Info className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800 mb-1">No doctor associations found</h4>
            <p className="text-[11px] text-slate-400">Try matching different query criteria or reset filter parameters.</p>
          </div>
        )}
      </div>

      {/* ================= MODAL DIALOGS ================= */}

      {/* 1. Modal Dialog Overlay Backdrop */}
      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto z-50">
            
            {/* Modal Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">
                {activeModal === 'view' && 'Read-Only Doctor Profile'}
                {activeModal === 'add' && 'Associate or Invite Doctor'}
                {activeModal === 'branch' && 'Assign Branches'}
                {activeModal === 'dept' && 'Assign Departments'}
                {activeModal === 'consult' && 'Configure Consultation'}
                {activeModal === 'remove' && 'Remove Doctor Association'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition-all cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              
              {/* Profile View Modal */}
              {activeModal === 'view' && selectedDoctor && (
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                      {selectedDoctor.imageUrl ? (
                        <img src={selectedDoctor.imageUrl} alt={selectedDoctor.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-purple-50 text-[#7C3AED]">
                          <User className="w-7 h-7" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900">{selectedDoctor.name}</h4>
                      <p className="text-xs font-bold text-slate-400 uppercase mt-0.5">{selectedDoctor.specialization}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 py-4">
                    <div>
                      <span className="text-[10px] font-bold text-slate-450 uppercase block">Qualification</span>
                      <span className="text-[12.5px] font-bold text-slate-700 block mt-0.5">{selectedDoctor.qualification}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-450 uppercase block">Experience</span>
                      <span className="text-[12.5px] font-bold text-slate-700 block mt-0.5">{selectedDoctor.experience} Years</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-450 uppercase block">Registration No</span>
                      <span className="text-[12.5px] font-bold text-slate-700 block mt-0.5">{selectedDoctor.registrationNumber}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-450 uppercase block">Preferred Languages</span>
                      <span className="text-[12.5px] font-bold text-slate-700 block mt-0.5">{selectedDoctor.languages.join(', ')}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-450 uppercase block">Professional Biography</span>
                    <p className="text-[12.5px] text-slate-500 leading-relaxed mt-1">{selectedDoctor.biography}</p>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-2">
                    <span className="text-[10px] font-bold text-slate-450 uppercase block">Hospital Association Settings</span>
                    <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-600">
                      <span>Departments: <strong>{selectedDoctor.departments.join(', ')}</strong></span>
                      <span>Branches: <strong>{selectedDoctor.branches.join(', ')}</strong></span>
                      <span>Consultation Types: <strong>{selectedDoctor.consultationType}</strong></span>
                      <span>Consultation Fee: <strong>₹{selectedDoctor.consultationFee}</strong></span>
                    </div>
                  </div>
                </div>
              )}

              {/* Add / Invite Doctor Modal */}
              {activeModal === 'add' && (
                <div className="space-y-5">
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => setAddMode('existing')}
                      className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${addMode === 'existing' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
                    >
                      Search Existing Vizito Doctor
                    </button>
                    <button
                      onClick={() => setAddMode('invite')}
                      className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${addMode === 'invite' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-700'}`}
                    >
                      Invite New Doctor
                    </button>
                  </div>

                  {addMode === 'existing' ? (
                    /* Search flow */
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5">Search credentials (ID, Email, Mobile or Registration No)</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="e.g. 9988776655, doc_global_1"
                            value={searchExistingQuery}
                            onChange={(e) => setSearchExistingQuery(e.target.value)}
                            className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none"
                          />
                          <button
                            onClick={handleSearchExisting}
                            className="bg-[#7C3AED] hover:bg-purple-800 text-white text-xs font-bold rounded-xl px-4 cursor-pointer"
                          >
                            Search
                          </button>
                        </div>
                      </div>

                      {searchExistingError && (
                        <p className="text-xs font-bold text-rose-500 bg-rose-50 border border-rose-100 p-3 rounded-xl flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>{searchExistingError}</span>
                        </p>
                      )}

                      {searchedExistingDoctor && (
                        <div className="bg-slate-50 border border-slate-200/65 rounded-2xl p-4 space-y-4">
                          <div className="flex items-center gap-3">
                            <img src={searchedExistingDoctor.imageUrl} alt={searchedExistingDoctor.name} className="w-12 h-12 rounded-full object-cover border border-slate-200" />
                            <div>
                              <h5 className="font-black text-slate-850 text-[14px]">{searchedExistingDoctor.name}</h5>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{searchedExistingDoctor.specialization}</span>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-650 border-t border-slate-200/50 pt-2.5">
                            <span>Experience: <strong>{searchedExistingDoctor.experience} Yrs</strong></span>
                            <span>Registration: <strong>{searchedExistingDoctor.registrationNumber}</strong></span>
                            <span>Qualification: <strong>{searchedExistingDoctor.qualification}</strong></span>
                          </div>

                          <button
                            onClick={handleSendRequest}
                            className="w-full bg-[#7C3AED] hover:bg-purple-800 text-white text-xs font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
                          >
                            Send Association Request
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Invite Form */
                    <form onSubmit={handleInviteDoctor} className="space-y-4">
                      {inviteFormError && (
                        <p className="text-xs font-bold text-rose-500 bg-rose-50 border border-rose-100 p-3 rounded-xl flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>{inviteFormError}</span>
                        </p>
                      )}

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Doctor Name</label>
                        <input
                          type="text"
                          required
                          value={inviteForm.name}
                          onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none"
                          placeholder="Dr. Full Name"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Mobile Number (10 digits)</label>
                          <input
                            type="text"
                            required
                            value={inviteForm.mobile}
                            onChange={(e) => setInviteForm({ ...inviteForm, mobile: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none"
                            placeholder="9876543210"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Email Address</label>
                          <input
                            type="email"
                            required
                            value={inviteForm.email}
                            onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none"
                            placeholder="doctor@example.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Initial Department</label>
                          <select
                            value={inviteForm.department}
                            onChange={(e) => setInviteForm({ ...inviteForm, department: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none"
                          >
                            {MOCK_DEPARTMENTS.map(d => (
                              <option key={d.id} value={d.name}>{d.name}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1">Initial Branch</label>
                          <select
                            value={inviteForm.branch}
                            onChange={(e) => setInviteForm({ ...inviteForm, branch: e.target.value })}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none"
                          >
                            {MOCK_BRANCHES.map(b => (
                              <option key={b.id} value={b.name}>{b.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">Consultation Type</label>
                        <select
                          value={inviteForm.consultationType}
                          onChange={(e) => setInviteForm({ ...inviteForm, consultationType: e.target.value as any })}
                          className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none"
                        >
                          <option value="Both">Online & In-Person</option>
                          <option value="Online">Online Only</option>
                          <option value="In-Person">In-Person Only</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#7C3AED] hover:bg-purple-800 text-white text-xs font-bold py-2.5 rounded-xl transition-colors cursor-pointer mt-2"
                      >
                        Send Platform Invitation Link
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Assign Branch Modal */}
              {activeModal === 'branch' && selectedDoctor && (
                <div className="space-y-4">
                  <p className="text-xs font-medium text-slate-500">
                    Select branches where {selectedDoctor.name} is authorized to consult patients.
                  </p>

                  <div className="space-y-2 border border-slate-100 rounded-2xl p-4">
                    {MOCK_BRANCHES.filter(b => b.status === 'Active').map(branch => {
                      const isChecked = !!branchCheckboxes[branch.name];
                      return (
                        <label key={branch.id} className="flex items-center gap-3 py-2 px-1 hover:bg-slate-50 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => setBranchCheckboxes({ ...branchCheckboxes, [branch.name]: e.target.checked })}
                            className="rounded text-[#7C3AED] focus:ring-[#7C3AED] w-4.5 h-4.5 border-slate-300"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">{branch.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold block">{branch.city} - {branch.code}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveBranches}
                      className="px-4.5 py-2 bg-[#7C3AED] hover:bg-purple-800 text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Assign Department Modal */}
              {activeModal === 'dept' && selectedDoctor && (
                <div className="space-y-4">
                  <p className="text-xs font-medium text-slate-500">
                    Assign clinical departments for {selectedDoctor.name}.
                  </p>

                  <div className="space-y-2 border border-slate-100 rounded-2xl p-4">
                    {MOCK_DEPARTMENTS.filter(d => d.status === 'Active').map(dept => {
                      const isChecked = !!deptCheckboxes[dept.name];
                      return (
                        <label key={dept.id} className="flex items-center gap-3 py-2 px-1 hover:bg-slate-50 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => setDeptCheckboxes({ ...deptCheckboxes, [dept.name]: e.target.checked })}
                            className="rounded text-[#7C3AED] focus:ring-[#7C3AED] w-4.5 h-4.5 border-slate-300"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">{dept.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold block">{dept.code} Department</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveDepts}
                      className="px-4.5 py-2 bg-[#7C3AED] hover:bg-purple-800 text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Configure Consultation Modal */}
              {activeModal === 'consult' && selectedDoctor && (
                <form onSubmit={handleSaveConsultSettings} className="space-y-4">
                  
                  {consultError && (
                    <p className="text-xs font-bold text-rose-500 bg-rose-50 border border-rose-100 p-3 rounded-xl flex items-center gap-1.5 animate-fade">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{consultError}</span>
                    </p>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Supported Consultation Types</label>
                    <select
                      value={consultForm.consultationType}
                      onChange={(e) => setConsultForm({ ...consultForm, consultationType: e.target.value as any })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none"
                    >
                      <option value="Both">Online & In-Person</option>
                      <option value="Online">Online Only</option>
                      <option value="In-Person">In-Person Only</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Online Fee (₹)</label>
                      <input
                        type="number"
                        disabled={consultForm.consultationType === 'In-Person'}
                        value={consultForm.onlineFee}
                        onChange={(e) => setConsultForm({ ...consultForm, onlineFee: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
                        placeholder="Online Fees"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">In-Person Fee (₹)</label>
                      <input
                        type="number"
                        disabled={consultForm.consultationType === 'Online'}
                        value={consultForm.inPersonFee}
                        onChange={(e) => setConsultForm({ ...consultForm, inPersonFee: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
                        placeholder="OPD Fees"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Slot Duration (Mins)</label>
                      <select
                        value={consultForm.slotDuration}
                        onChange={(e) => setConsultForm({ ...consultForm, slotDuration: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none"
                      >
                        <option value={10}>10 Mins</option>
                        <option value={15}>15 Mins</option>
                        <option value={20}>20 Mins</option>
                        <option value={30}>30 Mins</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Booking Window (Days)</label>
                      <input
                        type="number"
                        value={consultForm.bookingWindow}
                        onChange={(e) => setConsultForm({ ...consultForm, bookingWindow: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Appointment Buffer (Mins)</label>
                      <input
                        type="number"
                        value={consultForm.appointmentBuffer}
                        onChange={(e) => setConsultForm({ ...consultForm, appointmentBuffer: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Follow-up Window (Days)</label>
                      <input
                        type="number"
                        value={consultForm.followUpDuration}
                        onChange={(e) => setConsultForm({ ...consultForm, followUpDuration: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-650 text-xs font-bold rounded-xl transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4.5 py-2 bg-[#7C3AED] hover:bg-purple-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Save Configuration
                    </button>
                  </div>

                </form>
              )}

              {/* Remove Association Modal */}
              {activeModal === 'remove' && selectedDoctor && (
                <div className="space-y-4">
                  <div className="flex items-start gap-3 bg-amber-50 border border-amber-150 p-4.5 rounded-2xl text-amber-850">
                    <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider">Warning Association Removal</h4>
                      <p className="text-xs font-medium mt-1 leading-relaxed text-amber-700">
                        Removing the doctor association will stop any new appointment bookings under this hospital workspace. 
                        However, existing appointments will remain unchanged in the system registry.
                      </p>
                    </div>
                  </div>

                  {/* Validate active bookings */}
                  {MOCK_APPOINTMENTS.filter(a => a.doctorName === selectedDoctor.name && a.date >= todayStr && a.status !== 'Cancelled').length > 0 && (
                    <p className="text-[12px] font-bold text-rose-500 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Note: This doctor has active future appointments booked.</span>
                    </p>
                  )}

                  <p className="text-xs font-medium text-slate-500">
                    Are you sure you want to remove the association linkage with <strong className="text-slate-800">{selectedDoctor.name}</strong>?
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmRemove}
                      className="px-4.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Confirm Removal
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default DoctorManagementScreen;
