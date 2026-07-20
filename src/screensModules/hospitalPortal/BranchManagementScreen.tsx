import React, { useState, useEffect } from 'react';
import { useHospitalRole } from '../../store/hospital/HospitalRoleContext';
import { MOCK_BRANCHES } from '../../mocks/hospitalMocks';
import {
  Search, Filter, Plus, Edit2, Eye, Power, MapPin, Clock, Phone, Mail,
  Building2, User, Users, Check, ChevronRight, ChevronLeft, X, Briefcase,
  ShieldCheck, AlertCircle, Calendar, Coffee, ExternalLink, Layers
} from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
  contact: string;
  city: string;
  type?: 'Main Branch' | 'Sub Branch' | 'Clinic' | 'Consultation Center';
  alternateContact?: string;
  email?: string;
  emergencyContact?: string;
  addressLine1?: string;
  addressLine2?: string;
  country?: string;
  state?: string;
  district?: string;
  postalCode?: string;
  landmark?: string;
  latitude?: string;
  longitude?: string;
  workingHours?: Record<string, { open: string; close: string; closed: boolean; breakStart: string; breakEnd: string }>;
  services?: { online: boolean; inPerson: boolean };
  lastUpdated?: string;
}

// Helpers to load data from localStorage
const getLocalStorageList = <T,>(key: string, fallback: T[]): T[] => {
  const saved = localStorage.getItem(key);
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  return fallback;
};

const saveLocalStorageList = <T,>(key: string, list: T[]) => {
  localStorage.setItem(key, JSON.stringify(list));
};

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DEFAULT_WORKING_HOURS = DAYS_OF_WEEK.reduce((acc, day) => {
  acc[day] = {
    open: '09:00',
    close: '18:00',
    closed: day === 'Sunday',
    breakStart: '13:00',
    breakEnd: '14:00'
  };
  return acc;
}, {} as Record<string, { open: string; close: string; closed: boolean; breakStart: string; breakEnd: string }>);

const BranchManagementScreen: React.FC = () => {
  const { role, assignedBranch } = useHospitalRole();

  // Load state from localStorage
  const [branches, setBranches] = useState<Branch[]>(() => MOCK_BRANCHES);
  const [doctorsList, setDoctorsList] = useState<any[]>(() => getLocalStorageList('vizito_associated_doctors', []));
  const [departmentsList, setDepartmentsList] = useState<any[]>(() => getLocalStorageList('vizito_departments', []));
  const [staffList, setStaffList] = useState<any[]>(() => getLocalStorageList('vizito_staff', []));

  // Sync state whenever proxies write to localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setBranches([...MOCK_BRANCHES]);
      setDoctorsList(getLocalStorageList('vizito_associated_doctors', []));
      setDepartmentsList(getLocalStorageList('vizito_departments', []));
      setStaffList(getLocalStorageList('vizito_staff', []));
    };

    window.addEventListener('storage', handleStorageChange);
    // Poll occasionally in case it's in-process
    const interval = setInterval(handleStorageChange, 1000);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [cityFilter, setCityFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'recent' | 'doctors' | 'appointments'>('name');

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);
  const [formStep, setFormStep] = useState(1);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Detailed View state
  const [viewingBranch, setViewingBranch] = useState<Branch | null>(null);

  // Form Fields State
  const [formFields, setFormFields] = useState<Partial<Branch>>({
    name: '',
    code: '',
    type: 'Sub Branch',
    status: 'Active',
    contact: '',
    alternateContact: '',
    email: '',
    emergencyContact: '',
    addressLine1: '',
    addressLine2: '',
    country: 'India',
    state: 'Telangana',
    district: '',
    city: '',
    postalCode: '',
    landmark: '',
    latitude: '17.4239',
    longitude: '78.4738',
    workingHours: JSON.parse(JSON.stringify(DEFAULT_WORKING_HOURS)),
    services: { online: true, inPerson: true }
  });

  // Assigned items during form session
  const [assignedDeptIds, setAssignedDeptIds] = useState<string[]>([]);
  const [assignedDocIds, setAssignedDocIds] = useState<string[]>([]);
  const [assignedStaffIds, setAssignedStaffIds] = useState<string[]>([]);

  // Populate helper counts
  const getBranchDocCount = (branchName: string) => doctorsList.filter(d => d.branches?.includes(branchName)).length;
  const getBranchDeptCount = (branchName: string) => departmentsList.filter(d => d.branches?.includes(branchName)).length;
  const getBranchStaffCount = (branchName: string) => staffList.filter(s => s.assignedBranch === branchName).length;

  // Unique lists for filters
  const cities = Array.from(new Set(branches.map(b => b.city).filter(Boolean)));
  const states = Array.from(new Set(branches.map(b => b.state || 'Telangana')));

  // Filtered branches
  const filteredBranches = branches.filter(b => {
    // Receptionist Restriction: strictly only assigned branch
    if (role === 'receptionist') {
      return b.name.toLowerCase() === assignedBranch.toLowerCase();
    }

    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.contact.includes(searchTerm) ||
      b.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    const matchesCity = cityFilter === 'All' || b.city === cityFilter;
    const matchesState = stateFilter === 'All' || (b.state || 'Telangana') === stateFilter;

    return matchesSearch && matchesStatus && matchesCity && matchesState;
  });

  // Sorted branches
  const sortedBranches = [...filteredBranches].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    if (sortBy === 'recent') {
      // Mock recently added using ID sorting
      return b.id.localeCompare(a.id);
    }
    if (sortBy === 'doctors') {
      return getBranchDocCount(b.name) - getBranchDocCount(a.name);
    }
    if (sortBy === 'appointments') {
      // Sort dummy appointments counts based on branch name hash
      const apptsA = a.name.length * 7;
      const apptsB = b.name.length * 7;
      return apptsB - apptsA;
    }
    return 0;
  });

  // Automatically lock receptionist view to their assigned branch details
  useEffect(() => {
    if (role === 'receptionist') {
      const match = branches.find(b => b.name.toLowerCase() === assignedBranch.toLowerCase());
      if (match) {
        setViewingBranch(match);
      }
    }
  }, [role, assignedBranch, branches]);

  // Open Form modal
  const handleOpenForm = (mode: 'add' | 'edit', branch?: Branch) => {
    setFormMode(mode);
    setValidationErrors([]);
    setFormStep(1);

    if (mode === 'edit' && branch) {
      setEditingBranchId(branch.id);
      setFormFields({
        ...branch,
        workingHours: branch.workingHours ? JSON.parse(JSON.stringify(branch.workingHours)) : JSON.parse(JSON.stringify(DEFAULT_WORKING_HOURS)),
        services: branch.services || { online: true, inPerson: true }
      });
      // Load current assignments
      setAssignedDeptIds(departmentsList.filter(d => d.branches?.includes(branch.name)).map(d => d.id));
      setAssignedDocIds(doctorsList.filter(d => d.branches?.includes(branch.name)).map(d => d.id));
      setAssignedStaffIds(staffList.filter(s => s.assignedBranch === branch.name).map(s => s.id));
    } else {
      setEditingBranchId(null);
      setFormFields({
        name: '',
        code: '',
        type: 'Sub Branch',
        status: 'Active',
        contact: '',
        alternateContact: '',
        email: '',
        emergencyContact: '',
        addressLine1: '',
        addressLine2: '',
        country: 'India',
        state: 'Telangana',
        district: '',
        city: '',
        postalCode: '',
        landmark: '',
        latitude: '17.4239',
        longitude: '78.4738',
        workingHours: JSON.parse(JSON.stringify(DEFAULT_WORKING_HOURS)),
        services: { online: true, inPerson: true }
      });
      setAssignedDeptIds([]);
      setAssignedDocIds([]);
      setAssignedStaffIds([]);
    }
    setIsFormOpen(true);
  };

  // Close Form modal
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingBranchId(null);
  };

  // Toggle Active/Inactive Status
  const handleToggleStatus = (branch: Branch) => {
    const nextStatus: 'Active' | 'Inactive' = branch.status === 'Active' ? 'Inactive' : 'Active';

    const updatedBranches: Branch[] = branches.map(b =>
      b.id === branch.id ? { ...b, status: nextStatus, lastUpdated: new Date().toLocaleDateString() } : b
    );
    MOCK_BRANCHES.length = 0;
    MOCK_BRANCHES.push(...updatedBranches);
    setBranches(updatedBranches);
  };

  // Form Fields Update Helper
  const updateField = (key: keyof Branch, value: any) => {
    setFormFields(prev => ({ ...prev, [key]: value }));
  };

  // Working Hours Helper
  const updateWorkingHours = (day: string, field: string, value: any) => {
    setFormFields(prev => {
      const wh = prev.workingHours ? { ...prev.workingHours } : {};
      wh[day] = { ...wh[day], [field]: value };
      return { ...prev, workingHours: wh };
    });
  };

  // Validation before step change / submit
  const validateStep = (step: number): boolean => {
    const errors: string[] = [];

    if (step === 1) {
      if (!formFields.name || formFields.name.trim().length < 3) {
        errors.push("Branch Name must be at least 3 characters long.");
      }
      // Unique Name Check
      const nameExists = branches.some(b =>
        b.name.toLowerCase() === formFields.name?.trim().toLowerCase() && b.id !== editingBranchId
      );
      if (nameExists) {
        errors.push("A branch with this Name already exists.");
      }

      if (!formFields.code || formFields.code.trim().length < 2) {
        errors.push("Branch Code must be at least 2 characters long.");
      }
      // Unique Code Check
      const codeExists = branches.some(b =>
        b.code.toLowerCase() === formFields.code?.trim().toLowerCase() && b.id !== editingBranchId
      );
      if (codeExists) {
        errors.push("A branch with this Code already exists.");
      }
    }

    if (step === 2) {
      if (!formFields.contact || !/^\+?[0-9\s-]{10,15}$/.test(formFields.contact)) {
        errors.push("Please provide a valid primary Contact Number.");
      }
      if (formFields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formFields.email)) {
        errors.push("Please provide a valid Email address.");
      }
    }

    if (step === 3) {
      if (!formFields.addressLine1 || formFields.addressLine1.trim() === '') {
        errors.push("Address Line 1 is required.");
      }
      if (!formFields.city || formFields.city.trim() === '') {
        errors.push("City is required.");
      }
      if (!formFields.state || formFields.state.trim() === '') {
        errors.push("State is required.");
      }
      if (!formFields.country || formFields.country.trim() === '') {
        errors.push("Country is required.");
      }
      if (!formFields.postalCode || !/^[0-9a-zA-Z\s-]{4,10}$/.test(formFields.postalCode)) {
        errors.push("Please provide a valid Postal/ZIP Code.");
      }
    }

    if (step === 4) {
      // Validate working hours
      DAYS_OF_WEEK.forEach(day => {
        const wh = formFields.workingHours?.[day];
        if (wh && !wh.closed) {
          // Open < Close check
          if (wh.open >= wh.close) {
            errors.push(`On ${day}, Opening time (${wh.open}) must be earlier than Closing time (${wh.close}).`);
          }
          // Lunch break checks
          if (wh.breakStart && wh.breakEnd) {
            if (wh.breakStart >= wh.breakEnd) {
              errors.push(`On ${day}, Lunch Break start must be earlier than break end.`);
            }
            if (wh.breakStart < wh.open || wh.breakEnd > wh.close) {
              errors.push(`On ${day}, Lunch Break must fall entirely within working hours (${wh.open} - ${wh.close}).`);
            }
          }
        }
      });
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(formStep)) {
      setFormStep(prev => prev + 1);
      setValidationErrors([]);
    }
  };

  const handlePrevStep = () => {
    setFormStep(prev => prev - 1);
    setValidationErrors([]);
  };

  // Submit Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(formStep)) return;

    const finalBranch: Branch = {
      id: formMode === 'add' ? `br_${Date.now()}` : editingBranchId!,
      name: formFields.name!.trim(),
      code: formFields.code!.toUpperCase().trim(),
      status: formFields.status || 'Active',
      contact: formFields.contact!.trim(),
      city: formFields.city!.trim(),
      type: formFields.type,
      alternateContact: formFields.alternateContact?.trim(),
      email: formFields.email?.trim(),
      emergencyContact: formFields.emergencyContact?.trim(),
      addressLine1: formFields.addressLine1?.trim(),
      addressLine2: formFields.addressLine2?.trim(),
      country: formFields.country?.trim(),
      state: formFields.state?.trim(),
      district: formFields.district?.trim(),
      postalCode: formFields.postalCode?.trim(),
      landmark: formFields.landmark?.trim(),
      latitude: formFields.latitude?.trim(),
      longitude: formFields.longitude?.trim(),
      workingHours: formFields.workingHours,
      services: formFields.services,
      lastUpdated: new Date().toLocaleDateString()
    };

    let updatedBranches = [...branches];
    if (formMode === 'add') {
      updatedBranches.push(finalBranch);
    } else {
      updatedBranches = updatedBranches.map(b => b.id === finalBranch.id ? finalBranch : b);
    }

    // Bidirectional State Synchronization

    // 1. Update Departments assignment
    const updatedDepts = departmentsList.map(dept => {
      let deptBranches = dept.branches ? [...dept.branches] : [];

      // If department is assigned in form, make sure branch name is in its branches array
      if (assignedDeptIds.includes(dept.id)) {
        if (!deptBranches.includes(finalBranch.name)) {
          deptBranches.push(finalBranch.name);
        }
      } else {
        // Remove branch name if it was unassigned
        deptBranches = deptBranches.filter(bName => bName !== finalBranch.name);
      }
      return { ...dept, branches: deptBranches };
    });

    // 2. Update Doctors assignment
    const updatedDocs = doctorsList.map(doc => {
      let docBranches = doc.branches ? [...doc.branches] : [];
      if (assignedDocIds.includes(doc.id)) {
        if (!docBranches.includes(finalBranch.name)) {
          docBranches.push(finalBranch.name);
        }
      } else {
        docBranches = docBranches.filter(bName => bName !== finalBranch.name);
      }
      return { ...doc, branches: docBranches };
    });

    // 3. Update Staff assignment
    const updatedStaff = staffList.map(staff => {
      if (assignedStaffIds.includes(staff.id)) {
        return { ...staff, assignedBranch: finalBranch.name };
      } else if (staff.assignedBranch === finalBranch.name) {
        // Clear assignment if unassigned
        return { ...staff, assignedBranch: '' };
      }
      return staff;
    });

    // Write all back to localStorage via proxies and local states
    MOCK_BRANCHES.length = 0;
    MOCK_BRANCHES.push(...updatedBranches);
    setBranches(updatedBranches);

    saveLocalStorageList('vizito_departments', updatedDepts);
    saveLocalStorageList('vizito_associated_doctors', updatedDocs);
    saveLocalStorageList('vizito_staff', updatedStaff);

    // Save doctors to 'vizito_doctors' to keep Dashboard Page synchronized as well
    saveLocalStorageList('vizito_doctors', updatedDocs);

    handleCloseForm();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 font-sans">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Branch Management</h1>
          <p className="text-slate-500 text-sm mt-0.5">Configure and monitor your hospital's physical branch locations.</p>
        </div>

        {role === 'admin' && (
          <button
            onClick={() => handleOpenForm('add')}
            className="bg-[#7C3AED] hover:bg-purple-800 text-white font-bold text-xs py-2.5 px-5 rounded-xl flex items-center gap-1.5 shadow-sm transition-all hover:scale-[1.02] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Branch</span>
          </button>
        )}
      </div>

      {role === 'admin' ? (
        <>
          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-2xl border border-slate-100/80 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-xl text-[#7C3AED]">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Branches</span>
                <span className="text-xl font-black text-slate-800">{branches.length}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100/80 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-500">
                <Check className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Locations</span>
                <span className="text-xl font-black text-slate-800">{branches.filter(b => b.status === 'Active').length}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-100/80 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-rose-50 rounded-xl text-rose-500">
                <X className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Inactive Locations</span>
                <span className="text-xl font-black text-slate-800">{branches.filter(b => b.status === 'Inactive').length}</span>
              </div>
            </div>
          </div>

          {/* SEARCH & FILTERS BAR */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-slate-400 focus-within:border-[#7C3AED]/40 transition-colors">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search branches by name, code, contact or city..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="bg-transparent border-none text-xs text-slate-700 outline-none w-full placeholder-slate-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status:</span>
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 text-xs text-slate-600 px-2.5 py-1.5 rounded-lg outline-none cursor-pointer focus:border-[#7C3AED]"
                >
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* City Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">City:</span>
                <select
                  value={cityFilter}
                  onChange={e => setCityFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-xs text-slate-600 px-2.5 py-1.5 rounded-lg outline-none cursor-pointer focus:border-[#7C3AED]"
                >
                  <option value="All">All Cities</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sort:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 text-xs text-slate-600 px-2.5 py-1.5 rounded-lg outline-none cursor-pointer focus:border-[#7C3AED]"
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="recent">Recently Added</option>
                  <option value="doctors">Most Doctors</option>
                  <option value="appointments">Most Appointments</option>
                </select>
              </div>
            </div>
          </div>

          {/* BRANCH CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sortedBranches.length > 0 ? (
              sortedBranches.map(branch => {
                const docCount = getBranchDocCount(branch.name);
                const deptCount = getBranchDeptCount(branch.name);
                const staffCount = getBranchStaffCount(branch.name);

                return (
                  <div
                    key={branch.id}
                    className="bg-white rounded-2xl border border-slate-100/90 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col group hover:border-[#7C3AED]/30"
                  >
                    {/* Upper Header Card Area */}
                    <div className="p-5 flex-1">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <span className="inline-block text-[9px] font-bold bg-purple-50 text-[#7C3AED] px-2 py-0.5 rounded-full mb-1">
                            {branch.type || 'Sub Branch'}
                          </span>
                          <h3 className="text-base font-bold text-slate-800 group-hover:text-[#7C3AED] transition-colors">
                            {branch.name}
                          </h3>
                          <span className="text-[10px] font-bold text-slate-400 block mt-0.5">Code: {branch.code}</span>
                        </div>

                        {/* Status Badge */}
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          branch.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-rose-50 text-rose-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            branch.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`} />
                          {branch.status}
                        </span>
                      </div>

                      {/* Details row */}
                      <div className="space-y-2 mt-4 text-xs text-slate-500 border-b border-slate-100 pb-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{branch.city || 'Hyderabad'}{branch.state ? `, ${branch.state}` : ''}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{branch.contact}</span>
                        </div>
                      </div>

                      {/* Stat Counters Row */}
                      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                        <div className="bg-slate-50/65 py-2 rounded-xl border border-slate-100">
                          <span className="block text-lg font-black text-slate-700">{docCount}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Doctors</span>
                        </div>
                        <div className="bg-slate-50/65 py-2 rounded-xl border border-slate-100">
                          <span className="block text-lg font-black text-slate-700">{deptCount}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Departments</span>
                        </div>
                        <div className="bg-slate-50/65 py-2 rounded-xl border border-slate-100">
                          <span className="block text-lg font-black text-slate-700">{staffCount}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">Staff</span>
                        </div>
                      </div>
                    </div>

                    {/* Lower Actions Bar */}
                    <div className="px-5 py-3.5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-4">
                      <span className="text-[10px] font-medium text-slate-400">
                        Updated: {branch.lastUpdated || 'Initial setup'}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewingBranch(branch)}
                          title="View Details"
                          className="p-1.5 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors cursor-pointer animate-hover"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenForm('edit', branch)}
                          title="Edit Branch"
                          className="p-1.5 hover:bg-slate-200 text-[#7C3AED] rounded-lg transition-colors cursor-pointer animate-hover"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(branch)}
                          title={branch.status === 'Active' ? 'Deactivate Location' : 'Activate Location'}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer animate-hover ${
                            branch.status === 'Active'
                              ? 'hover:bg-rose-50 text-rose-600'
                              : 'hover:bg-emerald-50 text-emerald-600'
                          }`}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full bg-white border border-slate-100 p-12 text-center rounded-2xl shadow-sm">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-slate-700">No branches found</h4>
                <p className="text-xs text-slate-400 mt-1">Try tweaking your search keywords or filter settings.</p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* Receptionist View Placeholder (handled below as Details View fallback) */
        null
      )}

      {/* BRANCH DETAILS DRAWER/VIEW */}
      {viewingBranch && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Overlay */}
          <div
            onClick={() => role === 'admin' && setViewingBranch(null)}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity cursor-default"
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-2xl bg-white shadow-2xl h-full flex flex-col z-10 transition-all duration-300">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[9px] font-bold bg-purple-50 text-[#7C3AED] px-2.5 py-0.5 rounded-full uppercase">
                  {viewingBranch.type || 'Sub Branch'}
                </span>
                <h2 className="text-lg font-black text-slate-800 mt-1">{viewingBranch.name}</h2>
                <p className="text-[10px] font-bold text-slate-400">Branch Code: {viewingBranch.code}</p>
              </div>

              {role === 'admin' && (
                <button
                  onClick={() => setViewingBranch(null)}
                  className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Emergency / Status Alert */}
              <div className="flex items-center justify-between p-4 bg-purple-50/50 rounded-2xl border border-purple-100/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100/50 text-[#7C3AED] rounded-xl">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-700 block">Operational Status</span>
                    <span className="text-[10px] text-slate-400">Operational status for booking appointments</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                  viewingBranch.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {viewingBranch.status}
                </span>
              </div>

              {/* Grid 2 Columns Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="bg-slate-50/50 border border-slate-100 p-5 rounded-2xl">
                  <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>Contact Info</span>
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-600">
                    <li className="flex justify-between"><span className="text-slate-400">Primary Phone:</span> <strong className="text-slate-700">{viewingBranch.contact}</strong></li>
                    {viewingBranch.alternateContact && <li className="flex justify-between"><span className="text-slate-400">Alt Phone:</span> <strong className="text-slate-700">{viewingBranch.alternateContact}</strong></li>}
                    {viewingBranch.emergencyContact && <li className="flex justify-between"><span className="text-slate-400">Emergency:</span> <strong className="text-rose-600">{viewingBranch.emergencyContact}</strong></li>}
                    {viewingBranch.email && <li className="flex justify-between"><span className="text-slate-400">Email:</span> <strong className="text-slate-700 break-all">{viewingBranch.email}</strong></li>}
                  </ul>
                </div>

                {/* Address Information */}
                <div className="bg-slate-50/50 border border-slate-100 p-5 rounded-2xl">
                  <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#7C3AED]" />
                    <span>Address & Map Location</span>
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {viewingBranch.addressLine1}
                    {viewingBranch.addressLine2 ? `, ${viewingBranch.addressLine2}` : ''}
                    <br />
                    {viewingBranch.landmark ? `Near ${viewingBranch.landmark}, ` : ''}
                    {viewingBranch.city}, {viewingBranch.state || 'Telangana'} - {viewingBranch.postalCode}
                  </p>
                  <div className="mt-3 pt-3 border-t border-slate-200/50 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Coordinates: {viewingBranch.latitude || '17.4239'}, {viewingBranch.longitude || '78.4738'}</span>
                    <a
                      href={`https://maps.google.com/?q=${viewingBranch.latitude || '17.4239'},${viewingBranch.longitude || '78.4738'}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#7C3AED] hover:underline flex items-center gap-0.5 font-bold"
                    >
                      <span>Show Map</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Working Hours Timeline */}
              <div className="bg-white border border-slate-150 p-5 rounded-2xl shadow-xs">
                <h4 className="text-xs font-bold text-slate-700 mb-4 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <span>Working Hours & Break Schedule</span>
                </h4>
                <div className="space-y-3">
                  {DAYS_OF_WEEK.map(day => {
                    const hrs = viewingBranch.workingHours?.[day] || DEFAULT_WORKING_HOURS[day];
                    return (
                      <div key={day} className="flex items-center justify-between text-xs py-1.5 border-b border-slate-50 last:border-0">
                        <span className="font-bold text-slate-600 w-24">{day}</span>
                        {hrs.closed ? (
                          <span className="text-slate-400 font-medium italic">Closed</span>
                        ) : (
                          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-4 text-slate-700">
                            <span>{hrs.open} - {hrs.close}</span>
                            {hrs.breakStart && hrs.breakEnd && (
                              <span className="inline-flex items-center gap-1 text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md font-bold">
                                <Coffee className="w-3 h-3 text-amber-500" />
                                <span>Lunch: {hrs.breakStart} - {hrs.breakEnd}</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Services Offered */}
              <div className="bg-slate-50/50 border border-slate-100 p-5 rounded-2xl">
                <h4 className="text-xs font-bold text-slate-700 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <span>Consultation Services Available</span>
                </h4>
                <div className="flex gap-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border ${
                    viewingBranch.services?.online ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}>
                    <Check className="w-4 h-4" /> Online Consultation
                  </span>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border ${
                    viewingBranch.services?.inPerson ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'
                  }`}>
                    <Check className="w-4 h-4" /> In-Person Consultation
                  </span>
                </div>
              </div>

              {/* Assigned Lists (Depts, Docs, Staff) */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#7C3AED]" />
                  <span>Assigned Resources</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Assigned Depts */}
                  <div className="bg-white border border-slate-100 p-4 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Departments</span>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {departmentsList.filter(d => d.branches?.includes(viewingBranch.name)).length > 0 ? (
                        departmentsList.filter(d => d.branches?.includes(viewingBranch.name)).map(d => (
                          <span key={d.id} className="block text-xs font-bold text-slate-700 py-1 border-b border-slate-50 last:border-none">
                            • {d.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">None assigned</span>
                      )}
                    </div>
                  </div>

                  {/* Assigned Doctors */}
                  <div className="bg-white border border-slate-100 p-4 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Doctors</span>
                    <div className="space-y-2.5 max-h-40 overflow-y-auto">
                      {doctorsList.filter(d => d.branches?.includes(viewingBranch.name)).length > 0 ? (
                        doctorsList.filter(d => d.branches?.includes(viewingBranch.name)).map(d => (
                          <div key={d.id} className="flex items-center gap-2">
                            <img src={d.imageUrl || 'https://i.pravatar.cc/100'} className="w-6 h-6 rounded-full border border-slate-100" alt={d.name} />
                            <div>
                              <span className="block text-xs font-bold text-slate-700 leading-none">{d.name}</span>
                              <span className="text-[9px] text-slate-400">{d.specialization}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">None assigned</span>
                      )}
                    </div>
                  </div>

                  {/* Assigned Receptionists / Staff */}
                  <div className="bg-white border border-slate-100 p-4 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Receptionists</span>
                    <div className="space-y-2.5 max-h-40 overflow-y-auto">
                      {staffList.filter(s => s.assignedBranch === viewingBranch.name).length > 0 ? (
                        staffList.filter(s => s.assignedBranch === viewingBranch.name).map(s => (
                          <div key={s.id} className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-purple-50 text-[#7C3AED] flex items-center justify-center font-bold text-[10px]">
                              {s.name.charAt(0)}
                            </div>
                            <div>
                              <span className="block text-xs font-bold text-slate-700 leading-none">{s.name}</span>
                              <span className="text-[9px] text-slate-400">{s.employeeId}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">None assigned</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ADD/EDIT BRANCH MULTI-STEP FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          {/* Modal Container */}
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full relative z-10 flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-800">
                  {formMode === 'add' ? 'Add New Branch Location' : 'Edit Branch Configuration'}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">
                  Section {formStep} of 7: {
                    formStep === 1 ? 'Basic Details' :
                    formStep === 2 ? 'Contact Info' :
                    formStep === 3 ? 'Physical Location' :
                    formStep === 4 ? 'Business Hours' :
                    formStep === 5 ? 'Consultation Services' :
                    formStep === 6 ? 'Assign Departments' : 'Personnel Bindings'
                  }
                </p>
              </div>

              <button
                onClick={handleCloseForm}
                className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-600 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Validation Errors Header Alert */}
            {validationErrors.length > 0 && (
              <div className="bg-rose-50 border-b border-rose-100 p-4 text-xs text-rose-700 space-y-1">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                  <span>Please resolve the following errors:</span>
                </div>
                {validationErrors.map((err, idx) => <p key={idx}>• {err}</p>)}
              </div>
            )}

            {/* Step Indicators Tracker */}
            <div className="px-5 py-3 border-b border-slate-55 flex items-center justify-between text-[10px] font-bold text-slate-400 overflow-x-auto whitespace-nowrap gap-4">
              {[1, 2, 3, 4, 5, 6, 7].map(step => (
                <div
                  key={step}
                  onClick={() => validateStep(formStep) && setFormStep(step)}
                  className={`cursor-pointer px-2.5 py-1 rounded-md transition-colors ${
                    formStep === step
                      ? 'bg-[#7C3AED] text-white'
                      : step < formStep
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'hover:bg-slate-100 hover:text-slate-600'
                  }`}
                >
                  Step {step}
                </div>
              ))}
            </div>

            {/* Scrollable Form Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* STEP 1: BASIC INFORMATION */}
              {formStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1.5">
                      Branch Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Jubilee Hills Branch"
                      value={formFields.name || ''}
                      onChange={e => updateField('name', e.target.value)}
                      className="w-full text-xs text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#7C3AED]/50"
                      required
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Must be unique within the hospital organization.</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1.5">
                        Branch Code *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. JHB01"
                        value={formFields.code || ''}
                        onChange={e => updateField('code', e.target.value)}
                        className="w-full text-xs text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#7C3AED]/50 uppercase"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1.5">
                        Branch Type *
                      </label>
                      <select
                        value={formFields.type || 'Sub Branch'}
                        onChange={e => updateField('type', e.target.value)}
                        className="w-full text-xs text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#7C3AED]/50 cursor-pointer"
                      >
                        <option value="Main Branch">Main Branch</option>
                        <option value="Sub Branch">Sub Branch</option>
                        <option value="Clinic">Clinic</option>
                        <option value="Consultation Center">Consultation Center</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1.5">
                      Status
                    </label>
                    <select
                      value={formFields.status || 'Active'}
                      onChange={e => updateField('status', e.target.value)}
                      className="w-full text-xs text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#7C3AED]/50 cursor-pointer"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              )}

              {/* STEP 2: CONTACT INFORMATION */}
              {formStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1.5">
                        Contact Number *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. +91 98765 43210"
                        value={formFields.contact || ''}
                        onChange={e => updateField('contact', e.target.value)}
                        className="w-full text-xs text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#7C3AED]/50"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1.5">
                        Alternate Contact Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. +91 98765 43211"
                        value={formFields.alternateContact || ''}
                        onChange={e => updateField('alternateContact', e.target.value)}
                        className="w-full text-xs text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#7C3AED]/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. jubilee@hospital.com"
                        value={formFields.email || ''}
                        onChange={e => updateField('email', e.target.value)}
                        className="w-full text-xs text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#7C3AED]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1.5">
                        Emergency Contact Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 1066"
                        value={formFields.emergencyContact || ''}
                        onChange={e => updateField('emergencyContact', e.target.value)}
                        className="w-full text-xs text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#7C3AED]/50"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: PHYSICAL ADDRESS */}
              {formStep === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1.5">
                        Address Line 1 *
                      </label>
                      <input
                        type="text"
                        placeholder="Street address, P.O. box, clinic name"
                        value={formFields.addressLine1 || ''}
                        onChange={e => updateField('addressLine1', e.target.value)}
                        className="w-full text-xs text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#7C3AED]/50"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1.5">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        placeholder="Apartment, suite, unit, building, floor"
                        value={formFields.addressLine2 || ''}
                        onChange={e => updateField('addressLine2', e.target.value)}
                        className="w-full text-xs text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#7C3AED]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1.5">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formFields.city || ''}
                        onChange={e => updateField('city', e.target.value)}
                        className="w-full text-xs text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#7C3AED]/50"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1.5">
                        District
                      </label>
                      <input
                        type="text"
                        value={formFields.district || ''}
                        onChange={e => updateField('district', e.target.value)}
                        className="w-full text-xs text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#7C3AED]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1.5">
                        State *
                      </label>
                      <input
                        type="text"
                        value={formFields.state || 'Telangana'}
                        onChange={e => updateField('state', e.target.value)}
                        className="w-full text-xs text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#7C3AED]/50"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1.5">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        value={formFields.postalCode || ''}
                        onChange={e => updateField('postalCode', e.target.value)}
                        className="w-full text-xs text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#7C3AED]/50"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1.5">
                        Country *
                      </label>
                      <input
                        type="text"
                        value={formFields.country || 'India'}
                        onChange={e => updateField('country', e.target.value)}
                        className="w-full text-xs text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#7C3AED]/50"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wide mb-1.5">
                        Landmark
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Beside Metro Station"
                        value={formFields.landmark || ''}
                        onChange={e => updateField('landmark', e.target.value)}
                        className="w-full text-xs text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:border-[#7C3AED]/50"
                      />
                    </div>
                  </div>

                  {/* Google Maps Coordinates Card */}
                  <div className="border border-slate-200/80 bg-slate-50/50 p-4 rounded-xl">
                    <span className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Simulated Google Map Coordinates</span>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Latitude</label>
                        <input
                          type="text"
                          value={formFields.latitude || ''}
                          onChange={e => updateField('latitude', e.target.value)}
                          className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-purple-300"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Longitude</label>
                        <input
                          type="text"
                          value={formFields.longitude || ''}
                          onChange={e => updateField('longitude', e.target.value)}
                          className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-purple-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: WORKING HOURS */}
              {formStep === 4 && (
                <div className="space-y-4">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Set Daily Timing & Lunch Breaks</span>
                  <div className="space-y-3 bg-slate-50/50 border border-slate-100 p-4 rounded-2xl">
                    {DAYS_OF_WEEK.map(day => {
                      const dayHrs = formFields.workingHours?.[day] || { open: '09:00', close: '18:00', closed: false, breakStart: '', breakEnd: '' };

                      return (
                        <div key={day} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-2 border-b border-slate-200/40 last:border-0">
                          <div className="flex items-center gap-2 w-28">
                            <input
                              type="checkbox"
                              checked={!dayHrs.closed}
                              onChange={e => updateWorkingHours(day, 'closed', !e.target.checked)}
                              className="accent-[#7C3AED] cursor-pointer"
                              id={`check-${day}`}
                            />
                            <label htmlFor={`check-${day}`} className="text-xs font-bold text-slate-700 cursor-pointer">{day}</label>
                          </div>

                          {!dayHrs.closed ? (
                            <div className="flex-1 flex flex-wrap items-center gap-3">
                              {/* Open/Close Hours */}
                              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <span>Open:</span>
                                <input
                                  type="time"
                                  value={dayHrs.open}
                                  onChange={e => updateWorkingHours(day, 'open', e.target.value)}
                                  className="bg-white border border-slate-200 text-xs px-2 py-1 rounded-md outline-none"
                                />
                                <span>Close:</span>
                                <input
                                  type="time"
                                  value={dayHrs.close}
                                  onChange={e => updateWorkingHours(day, 'close', e.target.value)}
                                  className="bg-white border border-slate-200 text-xs px-2 py-1 rounded-md outline-none"
                                />
                              </div>

                              {/* Break Hours */}
                              <div className="flex items-center gap-1.5 text-[10px] text-amber-600 bg-amber-50 px-2 py-1.5 rounded-lg border border-amber-100/50">
                                <span>Break:</span>
                                <input
                                  type="time"
                                  value={dayHrs.breakStart || '13:00'}
                                  onChange={e => updateWorkingHours(day, 'breakStart', e.target.value)}
                                  className="bg-white border border-amber-200 text-xs px-1 rounded-md outline-none w-[55px]"
                                />
                                <span>-</span>
                                <input
                                  type="time"
                                  value={dayHrs.breakEnd || '14:00'}
                                  onChange={e => updateWorkingHours(day, 'breakEnd', e.target.value)}
                                  className="bg-white border border-amber-200 text-xs px-1 rounded-md outline-none w-[55px]"
                                />
                              </div>
                            </div>
                          ) : (
                            <span className="text-slate-400 text-xs italic">Closed on this day</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 5: SERVICES */}
              {formStep === 5 && (
                <div className="space-y-4">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Consultation Modes Enabled</span>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:border-purple-200">
                      <input
                        type="checkbox"
                        checked={formFields.services?.online || false}
                        onChange={e => {
                          const s = formFields.services ? { ...formFields.services } : { online: false, inPerson: false };
                          s.online = e.target.checked;
                          updateField('services', s);
                        }}
                        className="accent-[#7C3AED] w-4 h-4"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-700 block">Online Consultation</span>
                        <span className="text-[10px] text-slate-400">Allows booking virtual/video consultations via the provider portal.</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl cursor-pointer hover:border-purple-200">
                      <input
                        type="checkbox"
                        checked={formFields.services?.inPerson || false}
                        onChange={e => {
                          const s = formFields.services ? { ...formFields.services } : { online: false, inPerson: false };
                          s.inPerson = e.target.checked;
                          updateField('services', s);
                        }}
                        className="accent-[#7C3AED] w-4 h-4"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-700 block">In-Person Consultation</span>
                        <span className="text-[10px] text-slate-400">Allows booking physical OPD clinic appointments at this location.</span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* STEP 6: ASSIGN DEPARTMENTS */}
              {formStep === 6 && (
                <div className="space-y-4">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase">Select Active Departments for this Branch</span>
                  <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                    {departmentsList.filter(d => d.status === 'Active').map(dept => {
                      const isAssigned = assignedDeptIds.includes(dept.id);
                      return (
                        <div
                          key={dept.id}
                          onClick={() => {
                            if (isAssigned) {
                              setAssignedDeptIds(prev => prev.filter(id => id !== dept.id));
                            } else {
                              setAssignedDeptIds(prev => [...prev, dept.id]);
                            }
                          }}
                          className={`p-3 border rounded-xl cursor-pointer transition-colors flex items-center justify-between text-xs font-bold ${
                            isAssigned
                              ? 'border-[#7C3AED] bg-purple-50/20 text-[#7C3AED]'
                              : 'border-slate-200 bg-slate-50/30 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>{dept.name}</span>
                          {isAssigned && <Check className="w-4 h-4" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 7: ASSIGN DOCTORS & STAFF */}
              {formStep === 7 && (
                <div className="space-y-6">
                  {/* Doctors selection */}
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase mb-3">Assign Doctors</span>
                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {doctorsList.map(doc => {
                        const isAssigned = assignedDocIds.includes(doc.id);
                        return (
                          <div
                            key={doc.id}
                            onClick={() => {
                              if (isAssigned) {
                                setAssignedDocIds(prev => prev.filter(id => id !== doc.id));
                              } else {
                                setAssignedDocIds(prev => [...prev, doc.id]);
                              }
                            }}
                            className={`p-3 border rounded-xl cursor-pointer transition-colors flex items-center justify-between ${
                              isAssigned
                                ? 'border-[#7C3AED] bg-purple-50/20 text-[#7C3AED]'
                                : 'border-slate-200 bg-slate-50/30 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <img src={doc.imageUrl || 'https://i.pravatar.cc/100'} className="w-7 h-7 rounded-full border border-slate-100" alt={doc.name} />
                              <div>
                                <span className="block text-xs font-bold text-slate-700 leading-tight">{doc.name}</span>
                                <span className="text-[10px] text-slate-400">{doc.specialization}</span>
                              </div>
                            </div>
                            {isAssigned && <Check className="w-4 h-4" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Staff selection */}
                  <div>
                    <span className="block text-[10px] font-bold text-slate-400 uppercase mb-3">Assign Staff / Receptionists</span>
                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {staffList.filter(s => s.status === 'Active').map(staff => {
                        const isAssigned = assignedStaffIds.includes(staff.id);
                        return (
                          <div
                            key={staff.id}
                            onClick={() => {
                              if (isAssigned) {
                                setAssignedStaffIds(prev => prev.filter(id => id !== staff.id));
                              } else {
                                setAssignedStaffIds(prev => [...prev, staff.id]);
                              }
                            }}
                            className={`p-3 border rounded-xl cursor-pointer transition-colors flex items-center justify-between ${
                              isAssigned
                                ? 'border-[#7C3AED] bg-purple-50/20 text-[#7C3AED]'
                                : 'border-slate-200 bg-slate-50/30 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-full bg-purple-50 text-[#7C3AED] flex items-center justify-center font-black text-xs">
                                {staff.name.charAt(0)}
                              </div>
                              <div>
                                <span className="block text-xs font-bold text-slate-700 leading-tight">{staff.name}</span>
                                <span className="text-[10px] text-slate-400">{staff.username} • {staff.assignedBranch || 'Unassigned'}</span>
                              </div>
                            </div>
                            {isAssigned && <Check className="w-4 h-4" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </form>

            {/* Modal Footer Controls */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              {formStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="bg-white hover:bg-slate-100 text-slate-600 font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1 border border-slate-200 cursor-pointer transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              {formStep < 7 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-[#7C3AED] hover:bg-purple-800 text-white font-bold text-xs py-2 px-5 rounded-xl flex items-center gap-1 cursor-pointer transition-all"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-6 rounded-xl flex items-center gap-1 cursor-pointer shadow-sm transition-all"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Configuration</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default BranchManagementScreen;
