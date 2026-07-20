import React, { useState, useEffect } from 'react';
import { useHospitalRole } from '../../../store/hospital/HospitalRoleContext';
import {
  MOCK_DEPARTMENTS,
  MOCK_BRANCHES,
  MOCK_APPOINTMENTS,
  type Department,
  type Branch
} from '../../../mocks/hospitalMocks';
import {
  Search, Filter, Plus, FileText, ChevronDown, Check, X,
  Building2, CheckCircle2, AlertTriangle, ShieldCheck,
  Calendar, Layers, MapPin, Edit2, Trash2, Info, Users, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { type LocalDoctor } from '../../hospitalPortal/DoctorManagementScreen';

interface LocalDepartment extends Department {
  description: string;
  lastUpdated: string;
}

const initialLocalDepartments = (rawMocks: Department[]): LocalDepartment[] => {
  const descriptions = [
    'Primary medical care, diagnosis, and treatment of common adult health issues.',
    'Advanced heart care, diagnostics, bypass surgeries, and vascular health.',
    'Treatment of bone, joint, ligament, tendon, and muscle disorders.',
    'Comprehensive medical care for infants, children, and adolescents.',
    'Diagnosis and treatment of neurological disorders and nervous system conditions.'
  ];
  return rawMocks.map((d, index) => ({
    ...d,
    description: descriptions[index % descriptions.length],
    lastUpdated: new Date(Date.now() - index * 86400000 * 2).toISOString().split('T')[0]
  }));
};

const DepartmentsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { role, assignedBranch } = useHospitalRole();
  const [departments, setDepartments] = useState<LocalDepartment[]>(() => {
    const saved = localStorage.getItem('vizito_departments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    const initialized = initialLocalDepartments(MOCK_DEPARTMENTS);
    localStorage.setItem('vizito_departments', JSON.stringify(initialized));
    return initialized;
  });

  // Load doctors from localStorage to count dynamically
  const [doctorsList, setDoctorsList] = useState<LocalDoctor[]>([]);

  useEffect(() => {
    const savedDocs = localStorage.getItem('vizito_associated_doctors');
    if (savedDocs) {
      try {
        setDoctorsList(JSON.parse(savedDocs));
      } catch (e) {}
    }
  }, []);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDocAvail, setSelectedDocAvail] = useState('All'); // Has Doctors, No Doctors
  const [sortOption, setSortOption] = useState('Department Name (A–Z)');

  // Modals States
  const [activeModal, setActiveModal] = useState<'view' | 'add' | 'edit' | 'branch' | null>(null);
  const [selectedDept, setSelectedDept] = useState<LocalDepartment | null>(null);

  // Add/Edit Forms State
  const [deptForm, setDeptForm] = useState({
    name: '',
    code: '',
    description: '',
    branches: [] as string[],
    status: 'Active' as 'Active' | 'Inactive'
  });
  const [formError, setFormError] = useState<string | null>(null);

  // Branch Checklist working state
  const [branchCheckboxes, setBranchCheckboxes] = useState<Record<string, boolean>>({});

  const saveDepartments = (list: LocalDepartment[]) => {
    setDepartments(list);
    localStorage.setItem('vizito_departments', JSON.stringify(list));
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Add Department Modal
  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    const name = deptForm.name.trim();
    const code = deptForm.code.trim().toUpperCase();

    if (!name || name.length < 3 || name.length > 100) {
      setFormError('Department Name must be between 3 and 100 characters.');
      return;
    }
    if (!code || code.length < 2 || code.length > 10 || !/^[A-Z0-9]+$/.test(code)) {
      setFormError('Department Code must be alphanumeric, 2-10 characters.');
      return;
    }
    if (deptForm.branches.length === 0) {
      setFormError('Please select at least one active branch.');
      return;
    }

    // Uniqueness
    const nameExists = departments.some(d => d.name.toLowerCase() === name.toLowerCase());
    const codeExists = departments.some(d => d.code.toUpperCase() === code);

    if (nameExists) {
      setFormError('A department with this name already exists in the hospital.');
      return;
    }
    if (codeExists) {
      setFormError('A department with this code already exists in the hospital.');
      return;
    }

    const newDept: LocalDepartment = {
      id: `dept_${Date.now()}`,
      name,
      code,
      description: deptForm.description,
      status: deptForm.status,
      branches: deptForm.branches,
      totalDoctors: 0,
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    saveDepartments([...departments, newDept]);
    triggerToast(`Department "${name}" created successfully.`);
    setActiveModal(null);
    resetForm();
  };

  // Edit Department
  const handleEditDept = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedDept) return;
    const name = deptForm.name.trim();

    if (!name || name.length < 3 || name.length > 100) {
      setFormError('Department Name must be between 3 and 100 characters.');
      return;
    }
    if (deptForm.branches.length === 0) {
      setFormError('Please select at least one active branch.');
      return;
    }

    // Uniqueness (excluding current)
    const nameExists = departments.some(d => d.name.toLowerCase() === name.toLowerCase() && d.id !== selectedDept.id);
    if (nameExists) {
      setFormError('A department with this name already exists.');
      return;
    }

    // Warning if deactivating or removing branches with active appointments
    if (deptForm.status === 'Inactive' || deptForm.branches.length < selectedDept.branches.length) {
      const todayStr = new Date().toISOString().split('T')[0];
      const hasFutureAppointments = MOCK_APPOINTMENTS.some(a =>
        a.department === selectedDept.name &&
        a.date >= todayStr &&
        a.status !== 'Cancelled'
      );
      if (hasFutureAppointments) {
        if (!window.confirm('Warning: This department has active future appointments. Changing its status or branch availability may disrupt bookings. Do you want to proceed?')) {
          return;
        }
      }
    }

    const updated = departments.map(d =>
      d.id === selectedDept.id
        ? {
            ...d,
            name,
            description: deptForm.description,
            branches: deptForm.branches,
            status: deptForm.status,
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        : d
    );

    saveDepartments(updated);
    triggerToast(`Department "${name}" updated successfully.`);
    setActiveModal(null);
    resetForm();
  };

  // Helper to open edit
  const openEditModal = (dept: LocalDepartment) => {
    setSelectedDept(dept);
    setDeptForm({
      name: dept.name,
      code: dept.code,
      description: dept.description,
      branches: dept.branches,
      status: dept.status
    });
    setFormError(null);
    setActiveModal('edit');
  };

  // Helper to open Branch checklist modal
  const openBranchModal = (dept: LocalDepartment) => {
    setSelectedDept(dept);
    const checks: Record<string, boolean> = {};
    MOCK_BRANCHES.filter(b => b.status === 'Active').forEach(b => {
      checks[b.name] = dept.branches.includes(b.name);
    });
    setBranchCheckboxes(checks);
    setActiveModal('branch');
  };

  const handleSaveBranches = () => {
    if (!selectedDept) return;
    const nextBranches = Object.keys(branchCheckboxes).filter(name => branchCheckboxes[name]);

    if (nextBranches.length === 0) {
      setFormError('Please select at least one active branch.');
      return;
    }

    // Warning for branch removal
    const todayStr = new Date().toISOString().split('T')[0];
    const removedBranches = selectedDept.branches.filter(b => !nextBranches.includes(b));
    if (removedBranches.length > 0) {
      const hasFutureAppointments = MOCK_APPOINTMENTS.some(a =>
        a.department === selectedDept.name &&
        removedBranches.includes(a.branchName) &&
        a.date >= todayStr &&
        a.status !== 'Cancelled'
      );
      if (hasFutureAppointments) {
        if (!window.confirm('Warning: Active future appointments exist in the branches you are removing. Do you want to proceed?')) {
          return;
        }
      }
    }

    const updated = departments.map(d =>
      d.id === selectedDept.id
        ? {
            ...d,
            branches: nextBranches,
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        : d
    );

    saveDepartments(updated);
    triggerToast(`Branches updated for department "${selectedDept.name}".`);
    setActiveModal(null);
  };

  // Toggle status shortcut
  const handleToggleStatus = (dept: LocalDepartment) => {
    const nextStatus = dept.status === 'Active' ? 'Inactive' : 'Active';

    // Verify bookings before deactivating
    if (nextStatus === 'Inactive') {
      const todayStr = new Date().toISOString().split('T')[0];
      const hasFutureAppointments = MOCK_APPOINTMENTS.some(a =>
        a.department === dept.name &&
        a.date >= todayStr &&
        a.status !== 'Cancelled'
      );
      if (hasFutureAppointments) {
        if (!window.confirm('Warning: This department has active future appointments. Deactivating it will hide it from new bookings. Do you want to proceed?')) {
          return;
        }
      }
    }

    const updated = departments.map(d =>
      d.id === dept.id
        ? {
            ...d,
            status: nextStatus as 'Active' | 'Inactive',
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        : d
    );
    saveDepartments(updated);
    triggerToast(`Department "${dept.name}" status updated to ${nextStatus}.`);
  };

  const resetForm = () => {
    setDeptForm({
      name: '',
      code: '',
      description: '',
      branches: [],
      status: 'Active'
    });
    setFormError(null);
    setSelectedDept(null);
  };

  const handleExport = () => {
    triggerToast('Department list exported successfully as CSV.');
  };

  // Branch Checklist toggle helper
  const toggleFormBranch = (branchName: string) => {
    if (deptForm.branches.includes(branchName)) {
      setDeptForm({
        ...deptForm,
        branches: deptForm.branches.filter(b => b !== branchName)
      });
    } else {
      setDeptForm({
        ...deptForm,
        branches: [...deptForm.branches, branchName]
      });
    }
  };

  // Filter application
  const activeBranches = MOCK_BRANCHES.filter(b => b.status === 'Active');

  const getFilteredDepartments = () => {
    return departments.filter(dept => {
      // 1. Search Query (Name or Code)
      const query = searchQuery.trim().toLowerCase();
      if (query) {
        const matchesName = dept.name.toLowerCase().includes(query);
        const matchesCode = dept.code.toLowerCase().includes(query);
        if (!matchesName && !matchesCode) return false;
      }

      // 2. Branch Filter (Receptionists locked)
      if (role === 'receptionist') {
        if (!dept.branches.includes(assignedBranch)) return false;
      } else if (selectedBranches.length > 0) {
        const branchMatch = dept.branches.some(b => selectedBranches.includes(b));
        if (!branchMatch) return false;
      }

      // 3. Status Filter
      if (selectedStatus !== 'All' && dept.status !== selectedStatus) return false;

      // 4. Doctor Availability Filter (Has Doctors vs No Doctors)
      const docCount = doctorsList.filter(d => d.departments.includes(dept.name) && d.status === 'Active').length;
      if (selectedDocAvail === 'Has Doctors' && docCount === 0) return false;
      if (selectedDocAvail === 'No Doctors' && docCount > 0) return false;

      return true;
    }).sort((a, b) => {
      const aDocs = doctorsList.filter(d => d.departments.includes(a.name) && d.status === 'Active').length;
      const bDocs = doctorsList.filter(d => d.departments.includes(b.name) && d.status === 'Active').length;

      if (sortOption === 'Department Name (A–Z)') return a.name.localeCompare(b.name);
      if (sortOption === 'Recently Created') return b.lastUpdated.localeCompare(a.lastUpdated);
      if (sortOption === 'Most Doctors') return bDocs - aDocs;
      if (sortOption === 'Least Doctors') return aDocs - bDocs;
      return 0;
    });
  };

  const filteredDepts = getFilteredDepartments();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 space-y-6">
      
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white text-xs font-bold rounded-xl px-4 py-3 shadow-lg z-50 flex items-center gap-2 animate-fade border border-slate-800">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs">
        <div>
          <h1 className="text-2xl font-black text-slate-900 leading-tight">Department Management</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Organize clinical medical specialties, map services across active branches, and audit associated doctors rosters.
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
                resetForm();
                setActiveModal('add');
              }}
              className="bg-[#7C3AED] hover:bg-purple-800 text-white text-xs font-bold py-2.5 px-4.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
            >
              <Plus className="w-4.5 h-4.5" />
              <span>Add Department</span>
            </button>
          </div>
        )}
      </div>

      {/* Filters Card */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-2xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          
          {/* Search by Name/Code */}
          <div className="relative col-span-1 sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Search Department</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Department Name or Code (e.g. CAR)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-medium rounded-xl py-2.5 pl-9 pr-3 focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
              />
            </div>
          </div>

          {/* Branch filter (locked for receptionist) */}
          {role === 'admin' ? (
            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Branch Filter</label>
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

          {/* Status filter */}
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
            </select>
          </div>

          {/* Doctor Availability Filter */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Doctor Association</label>
            <select
              value={selectedDocAvail}
              onChange={(e) => setSelectedDocAvail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-medium rounded-xl py-2.5 px-3 focus:outline-none"
            >
              <option value="All">All Settings</option>
              <option value="Has Doctors">Has Associated Doctors</option>
              <option value="No Doctors">No Associated Doctors</option>
            </select>
          </div>

        </div>

        {/* Sort and Reset options */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg px-2.5 py-1.5 focus:outline-none"
            >
              <option value="Department Name (A–Z)">Name (A–Z)</option>
              <option value="Recently Created">Recently Updated</option>
              <option value="Most Doctors">Most Associated Doctors</option>
              <option value="Least Doctors">Least Associated Doctors</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedBranches([]);
              setSelectedStatus('All');
              setSelectedDocAvail('All');
              setSortOption('Department Name (A–Z)');
            }}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors uppercase tracking-wider"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Departments Listing Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-black text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="py-4 px-5">Department Name</th>
                <th className="py-4 px-4">Code</th>
                <th className="py-4 px-4">Assigned Branches</th>
                <th className="py-4 px-4 text-center">Total Doctors</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Last Updated</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[13px] text-slate-700">
              {filteredDepts.map((dept) => {
                // Dynamically fetch doctor associations
                const associatedDoctors = doctorsList.filter(doc => doc.departments.includes(dept.name) && doc.status === 'Active');
                const doctorCount = associatedDoctors.length;

                return (
                  <tr key={dept.id} className="hover:bg-slate-50/40 transition-colors">
                    
                    {/* Name */}
                    <td className="py-4 px-5 font-black text-slate-800">
                      {dept.name}
                    </td>

                    {/* Code */}
                    <td className="py-4 px-4 font-mono text-[11.5px] font-bold text-slate-500">
                      {dept.code}
                    </td>

                    {/* Assigned Branches */}
                    <td className="py-4 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {dept.branches.map((b, i) => (
                          <span key={i} className="bg-purple-50 text-[#7C3AED] text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                            <MapPin className="w-2.5 h-2.5" />
                            <span>{b.split(' ')[0]}</span>
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Total Doctors */}
                    <td className="py-4 px-4 text-center">
                      <span className="font-bold text-slate-900 bg-slate-50 border border-slate-200/50 px-2.5 py-1 rounded-lg text-xs">
                        {doctorCount}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                        dept.status === 'Active'
                          ? 'text-emerald-600 bg-emerald-50'
                          : 'text-slate-450 bg-slate-100'
                      }`}>
                        {dept.status}
                      </span>
                    </td>

                    {/* Last Updated */}
                    <td className="py-4 px-4 text-slate-450 font-medium text-[12px]">
                      {dept.lastUpdated}
                    </td>

                    {/* Action Items */}
                    <td className="py-4 px-5 text-right">
                      {role === 'admin' ? (
                        /* Admin Actions */
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => { setSelectedDept(dept); setActiveModal('view'); }}
                            className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200/55 transition-colors cursor-pointer"
                          >
                            View
                          </button>
                          <button
                            onClick={() => openEditModal(dept)}
                            className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openBranchModal(dept)}
                            className="px-2 py-1 bg-slate-50 hover:bg-purple-50 text-slate-650 hover:text-[#7C3AED] text-[11px] font-bold rounded-lg border border-slate-200/50 transition-all cursor-pointer"
                          >
                            Branches
                          </button>
                          <button
                            onClick={() => handleToggleStatus(dept)}
                            className={`px-2 py-1 text-[11px] font-black rounded-lg transition-all cursor-pointer ${
                              dept.status === 'Active'
                                ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            }`}
                          >
                            {dept.status === 'Active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </div>
                      ) : (
                        /* Receptionist Actions */
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => { setSelectedDept(dept); setActiveModal('view'); }}
                            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-200/55 transition-colors cursor-pointer"
                          >
                            View Details
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredDepts.length === 0 && (
          <div className="text-center py-12 px-6">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-850 mb-1">No departments found</h4>
            <p className="text-[11px] text-slate-400">No departments match your filters. Create new ones to get started.</p>
          </div>
        )}
      </div>

      {/* ================= MODAL DIALOGS ================= */}

      {activeModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto z-50">
            
            {/* Header */}
            <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">
                {activeModal === 'view' && 'Department Details'}
                {activeModal === 'add' && 'Create Department'}
                {activeModal === 'edit' && 'Edit Department'}
                {activeModal === 'branch' && 'Assign Branches'}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-650 transition-all cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              
              {/* Add / Edit Form */}
              {(activeModal === 'add' || activeModal === 'edit') && (
                <form onSubmit={activeModal === 'add' ? handleAddDept : handleEditDept} className="space-y-4">
                  
                  {formError && (
                    <p className="text-xs font-bold text-rose-500 bg-rose-50 border border-rose-100 p-3 rounded-xl flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{formError}</span>
                    </p>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Department Name</label>
                    <input
                      type="text"
                      required
                      value={deptForm.name}
                      onChange={(e) => setDeptForm({ ...deptForm, name: e.target.value })}
                      placeholder="e.g. Cardiology, Orthopedics"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Department Code</label>
                    <input
                      type="text"
                      required
                      disabled={activeModal === 'edit'}
                      value={deptForm.code}
                      onChange={(e) => setDeptForm({ ...deptForm, code: e.target.value.toUpperCase() })}
                      placeholder="e.g. CAR, ORTHO"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
                    />
                    {activeModal === 'add' && (
                      <span className="text-[10px] text-slate-400 font-bold block mt-1">Codes cannot be changed after creation.</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Description (Max 500 characters)</label>
                    <textarea
                      maxLength={500}
                      rows={3}
                      value={deptForm.description}
                      onChange={(e) => setDeptForm({ ...deptForm, description: e.target.value })}
                      placeholder="Enter description explaining department's primary focus..."
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">Branch Authorization</label>
                    <div className="space-y-2 border border-slate-100 rounded-xl p-3 max-h-32 overflow-y-auto">
                      {MOCK_BRANCHES.filter(b => b.status === 'Active').map(br => {
                        const isChecked = deptForm.branches.includes(br.name);
                        return (
                          <label key={br.id} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleFormBranch(br.name)}
                              className="rounded text-[#7C3AED] focus:ring-[#7C3AED] w-4 h-4"
                            />
                            <span>{br.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {activeModal === 'edit' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">Department Status</label>
                      <select
                        value={deptForm.status}
                        onChange={(e) => setDeptForm({ ...deptForm, status: e.target.value as any })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4.5 py-2 bg-[#7C3AED] hover:bg-purple-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      {activeModal === 'add' ? 'Create Specialty' : 'Save Details'}
                    </button>
                  </div>

                </form>
              )}

              {/* View Detail Modal */}
              {activeModal === 'view' && selectedDept && (
                <div className="space-y-5 text-[13px] text-slate-700">
                  
                  {/* Basic Info */}
                  <div>
                    <h4 className="text-base font-black text-slate-800 leading-tight">{selectedDept.name}</h4>
                    <span className="text-[10px] font-mono font-bold text-slate-400 mt-1 block uppercase">Code: {selectedDept.code} | Status: {selectedDept.status}</span>
                    <p className="text-slate-500 text-xs mt-2 leading-relaxed">{selectedDept.description || 'No description provided.'}</p>
                  </div>

                  {/* Assigned Branches Table */}
                  <div className="border-t border-slate-100 pt-4 space-y-2">
                    <h5 className="text-xs font-black text-slate-800 uppercase tracking-wide">Assigned Branches</h5>
                    <div className="border border-slate-100 rounded-xl overflow-hidden text-xs">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-150">
                            <th className="py-2 px-3">Branch Name</th>
                            <th className="py-2 px-3 text-center">Total Doctors</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {selectedDept.branches.map((branchName, idx) => {
                            const totalBranchDocs = doctorsList.filter(d => d.branches.includes(branchName) && d.departments.includes(selectedDept.name) && d.status === 'Active').length;
                            return (
                              <tr key={idx} className="hover:bg-slate-50/50">
                                <td className="py-2 px-3 font-semibold text-slate-700">{branchName}</td>
                                <td className="py-2 px-3 text-center font-bold">{totalBranchDocs}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Associated Doctors Table */}
                  <div className="border-t border-slate-100 pt-4 space-y-2">
                    <h5 className="text-xs font-black text-slate-800 uppercase tracking-wide">Associated Doctors</h5>
                    <div className="border border-slate-100 rounded-xl overflow-hidden text-xs max-h-48 overflow-y-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-50 text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-150">
                            <th className="py-2 px-3">Doctor</th>
                            <th className="py-2 px-3">Specialty</th>
                            <th className="py-2 px-3">Type</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {doctorsList
                            .filter(d => d.departments.includes(selectedDept.name) && d.status === 'Active')
                            .map((doc, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/50">
                                <td className="py-2 px-3 font-black text-slate-800">{doc.name}</td>
                                <td className="py-2 px-3 font-semibold text-slate-400">{doc.specialization}</td>
                                <td className="py-2 px-3 text-slate-500 font-bold">{doc.consultationType}</td>
                              </tr>
                            ))}
                          {doctorsList.filter(d => d.departments.includes(selectedDept.name) && d.status === 'Active').length === 0 && (
                            <tr>
                              <td colSpan={3} className="py-4 text-center text-[11px] font-bold text-slate-400">
                                No active associated doctors in this department.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              )}

              {/* Assign Branches Modal */}
              {activeModal === 'branch' && selectedDept && (
                <div className="space-y-4">
                  <p className="text-xs font-medium text-slate-500">
                    Assign branch authorization for department "{selectedDept.name}".
                  </p>

                  <div className="space-y-2 border border-slate-100 rounded-2xl p-4">
                    {MOCK_BRANCHES.filter(b => b.status === 'Active').map(br => {
                      const isChecked = !!branchCheckboxes[br.name];
                      return (
                        <label key={br.id} className="flex items-center gap-3 py-2 px-1 hover:bg-slate-50 rounded-lg cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => setBranchCheckboxes({ ...branchCheckboxes, [br.name]: e.target.checked })}
                            className="rounded text-[#7C3AED] focus:ring-[#7C3AED] w-4.5 h-4.5 border-slate-300"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">{br.name}</span>
                            <span className="text-[10px] text-slate-400 font-bold block">{br.city}</span>
                          </div>
                        </label>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      onClick={() => setActiveModal(null)}
                      className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-650 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveBranches}
                      className="px-4.5 py-2 bg-[#7C3AED] hover:bg-purple-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Save Changes
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

export default DepartmentsScreen;
