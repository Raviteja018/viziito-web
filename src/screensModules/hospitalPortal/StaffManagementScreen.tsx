import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  FileText,
  Key,
  Plus,
  Edit2,
  Ban,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Activity,
  ClipboardList,
  Info,
  Clock,
  User,
  Unlock
} from 'lucide-react';
import { useHospitalRole } from '../../store/hospital/HospitalRoleContext';
import { MOCK_BRANCHES, type Staff, type StaffPermissions } from '../../mocks/hospitalMocks';

// ─── Preset Templates ────────────────────────────────────────────────────────
const TEMPLATE_PRESETS = [
  {
    name: 'Receptionist',
    description: 'Frontdesk staff handling appointments, patient registers, and doctor availability.',
    permissions: {
      dashboard: { view: true },
      appointmentManagement: { view: true, bookAppointment: true, reschedule: true, cancel: true, checkIn: true },
      patientManagement: { view: true, registerPatient: true },
      availabilityManagement: { view: true },
      doctorManagement: { view: true }
    }
  },
  {
    name: 'Branch Manager',
    description: 'Manages branch operations, staff members, profile configurations, and doctor schedules.',
    permissions: {
      dashboard: { view: true },
      appointmentManagement: { view: true, bookAppointment: true, reschedule: true, cancel: true, checkIn: true },
      patientManagement: { view: true, registerPatient: true },
      doctorManagement: { view: true, addDoctor: true, assignDoctor: true },
      departmentManagement: { view: true, add: true },
      availabilityManagement: { view: true, createRequest: true },
      staffManagement: { view: true, add: true, managePermissions: true },
      branchManagement: { view: true, edit: true }
    }
  },
  {
    name: 'Billing Executive',
    description: 'Financial auditor handling payouts, invoices, ledger transactions, and settlements.',
    permissions: {
      dashboard: { view: true },
      patientManagement: { view: true },
      revenue: { view: true },
      settlement: { view: true, process: true },
      transactions: { view: true }
    }
  }
];

const MODULES_SPEC = [
  { key: 'dashboard', label: 'Dashboard', actions: [{ field: 'view', label: 'View Dashboard' }] },
  { key: 'appointmentManagement', label: 'Appointments', actions: [{ field: 'view', label: 'View List' }, { field: 'bookAppointment', label: 'Book Appointment' }, { field: 'reschedule', label: 'Reschedule' }, { field: 'cancel', label: 'Cancel' }, { field: 'checkIn', label: 'Check-In' }] },
  { key: 'patientManagement', label: 'Patients', actions: [{ field: 'view', label: 'View List' }, { field: 'registerPatient', label: 'Register Patient' }] },
  { key: 'doctorManagement', label: 'Doctors', actions: [{ field: 'view', label: 'View List' }, { field: 'addDoctor', label: 'Add Doctor' }, { field: 'assignDoctor', label: 'Assign Branch' }] },
  { key: 'departmentManagement', label: 'Departments', actions: [{ field: 'view', label: 'View List' }, { field: 'add', label: 'Add/Edit' }] },
  { key: 'availabilityManagement', label: 'Availability', actions: [{ field: 'view', label: 'View List' }, { field: 'createRequest', label: 'Request' }] },
  { key: 'revenue', label: 'Revenue', actions: [{ field: 'view', label: 'View Earnings' }] },
  { key: 'settlement', label: 'Settlements', actions: [{ field: 'view', label: 'View Payouts' }, { field: 'process', label: 'Request/Approve Payout' }] },
  { key: 'transactions', label: 'Transactions', actions: [{ field: 'view', label: 'View History' }] },
  { key: 'staffManagement', label: 'Staff Management', actions: [{ field: 'view', label: 'View Accounts' }, { field: 'add', label: 'Create/Edit Staff' }, { field: 'managePermissions', label: 'Manage Permissions' }] }
];

const DEFAULT_LOGS = [
  { id: 'log_1', timestamp: '2026-07-18 15:30', staffName: 'Kavitha Reddy', action: 'Appointment created', details: 'Created appointment APT2009 for Amit Sharma', ip: '192.168.1.104' },
  { id: 'log_2', timestamp: '2026-07-18 14:15', staffName: 'Kavitha Reddy', action: 'Patient registered', details: 'Registered new patient Vikram Singh', ip: '192.168.1.104' },
  { id: 'log_3', timestamp: '2026-07-18 12:00', staffName: 'Suresh Kumar', action: 'Login', details: 'Logged in successfully from Chrome/Windows', ip: '192.168.1.112' },
  { id: 'log_4', timestamp: '2026-07-18 10:30', staffName: 'System', action: 'Permission updated', details: 'Updated permissions template "Branch Manager"', ip: '127.0.0.1' },
  { id: 'log_5', timestamp: '2026-07-17 17:00', staffName: 'Amit Sharma', action: 'Password reset', details: 'Reset login password for Suresh Kumar', ip: '192.168.1.101' },
  { id: 'log_6', timestamp: '2026-07-17 16:45', staffName: 'Amit Sharma', action: 'Staff created', details: 'Added new staff account: Nisha Patel', ip: '192.168.1.101' }
];

const INITIAL_EMPTY_PERMS = (): StaffPermissions => ({
  dashboard: { view: false },
  hospitalProfile: { view: false, edit: false },
  branchManagement: { view: false, add: false, edit: false, activate: false, deactivate: false },
  doctorManagement: { view: false, addDoctor: false, requestDoctor: false, assignDoctor: false, removeDoctor: false, configureConsultation: false },
  departmentManagement: { view: false, add: false, edit: false, activate: false, deactivate: false },
  staffManagement: { view: false, add: false, edit: false, resetPassword: false, toggleStatus: false, managePermissions: false },
  availabilityManagement: { view: false, createRequest: false, approve: false, reject: false, withdraw: false },
  appointmentManagement: { view: false, bookAppointment: false, reschedule: false, cancel: false, checkIn: false },
  patientManagement: { view: false, registerPatient: false },
  revenue: { view: false },
  settlement: { view: false, process: false },
  transactions: { view: false },
  integrations: { view: false, pharmacy: false, laboratory: false, ambulance: false },
  settings: { view: false, edit: false }
});

const StaffManagementScreen: React.FC = () => {
  const { staffList, addStaff, updateStaff, toggleStaffStatus } = useHospitalRole();

  // Active View Tab: Staff List, Permission Presets, Activity Log
  const [activeTab, setActiveTab] = useState<'list' | 'templates' | 'logs'>('list');

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [branchFilter, setBranchFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal / Detail States
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [viewingStaffPermissions, setViewingStaffPermissions] = useState<Staff | null>(null);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);
  const [isPasswordResetModalOpen, setIsPasswordResetModalOpen] = useState(false);
  const [resetStaff, setResetStaff] = useState<Staff | null>(null);
  const [newPassword, setNewPassword] = useState('');

  // Add / Edit Form State
  const [formName, setFormName] = useState('');
  const [formEmpId, setFormEmpId] = useState('');
  const [formMobile, setFormMobile] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formBranch, setFormBranch] = useState('Jubilee Hills Branch');
  const [selectedPreset, setSelectedPreset] = useState('Custom');
  const [formPermissions, setFormPermissions] = useState<StaffPermissions>(INITIAL_EMPTY_PERMS());

  // Activity Logs Database state
  const [activityLogs, setActivityLogs] = useState<typeof DEFAULT_LOGS>(() => {
    const saved = localStorage.getItem('vizito_staff_activity_logs');
    return saved ? JSON.parse(saved) : DEFAULT_LOGS;
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const addLogEntry = (action: string, details: string) => {
    const newLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      staffName: 'Hospital Admin',
      action,
      details,
      ip: '192.168.1.100'
    };
    setActivityLogs(prev => {
      const updated = [newLog, ...prev];
      localStorage.setItem('vizito_staff_activity_logs', JSON.stringify(updated));
      return updated;
    });
  };

  // Reset Add/Edit Form
  const resetForm = () => {
    setFormName('');
    setFormEmpId('');
    setFormMobile('');
    setFormEmail('');
    setFormUsername('');
    setFormPassword('');
    setFormBranch(MOCK_BRANCHES[0]?.name || 'Jubilee Hills Branch');
    setSelectedPreset('Custom');
    setFormPermissions(INITIAL_EMPTY_PERMS());
    setEditingStaffId(null);
  };

  // Open Edit Dialog
  const handleOpenEdit = (staff: Staff) => {
    setEditingStaffId(staff.id);
    setFormName(staff.name);
    setFormEmpId(staff.employeeId);
    setFormMobile(staff.mobile);
    setFormEmail(staff.email);
    setFormUsername(staff.username);
    setFormPassword('••••••••'); // hidden password placeholder
    setFormBranch(staff.assignedBranch);
    setSelectedPreset('Custom');
    setFormPermissions(staff.permissions);
    setIsAddEditModalOpen(true);
  };

  // Open Add Dialog
  const handleOpenAdd = () => {
    resetForm();
    setIsAddEditModalOpen(true);
  };

  // Select Preset Template values
  const handlePresetSelect = (presetName: string) => {
    setSelectedPreset(presetName);
    if (presetName === 'Custom') return;

    const matched = TEMPLATE_PRESETS.find(p => p.name === presetName);
    if (matched) {
      const fullPerms = INITIAL_EMPTY_PERMS();
      Object.keys(matched.permissions).forEach(k => {
        (fullPerms as any)[k] = { ...(fullPerms as any)[k], ...(matched.permissions as any)[k] };
      });
      setFormPermissions(fullPerms);
    }
  };

  // Toggle Matrix checkbox value
  const handlePermissionToggle = (moduleKey: string, fieldKey: string) => {
    setSelectedPreset('Custom');
    setFormPermissions(prev => {
      const moduleData = (prev as any)[moduleKey] || {};
      const nextVal = !moduleData[fieldKey];
      
      let updatedModule = { ...moduleData, [fieldKey]: nextVal };
      
      // Auto enable view check if toggling checkmarks on list actions
      if (fieldKey !== 'view' && nextVal === true) {
        updatedModule.view = true;
      }
      
      return {
        ...prev,
        [moduleKey]: updatedModule
      };
    });
  };

  // Save staff member
  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName || !formEmpId || !formMobile || !formEmail || !formUsername) {
      showToast('Please fill out all mandatory fields.', 'info');
      return;
    }

    if (editingStaffId) {
      const original = staffList.find(s => s.id === editingStaffId);
      if (!original) return;

      const updated: Staff = {
        ...original,
        name: formName,
        employeeId: formEmpId,
        mobile: formMobile,
        email: formEmail,
        username: formUsername,
        assignedBranch: formBranch,
        permissions: formPermissions
      };

      updateStaff(updated);
      addLogEntry('Staff updated', `Updated details and permissions matrix for ${formName} (${formEmpId})`);
      showToast(`Successfully updated staff member ${formName}.`, 'success');
    } else {
      if (!formPassword) {
        showToast('Please specify a secure login password.', 'info');
        return;
      }

      const isDuplicate = staffList.some(s => s.username === formUsername || s.employeeId === formEmpId);
      if (isDuplicate) {
        showToast('Staff username or Employee ID already exists.', 'info');
        return;
      }

      const newStaffItem: Staff = {
        id: `staff_${Date.now()}`,
        name: formName,
        employeeId: formEmpId,
        mobile: formMobile,
        email: formEmail,
        username: formUsername,
        assignedBranch: formBranch,
        status: 'Active',
        lastLogin: 'Never',
        forcePasswordChange: false,
        permissions: formPermissions,
        avatarUrl: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 50) + 1}`
      };

      addStaff(newStaffItem);
      addLogEntry('Staff created', `Added new staff account: ${formName} (${formEmpId})`);
      showToast(`Successfully registered staff member ${formName}.`, 'success');
    }

    setIsAddEditModalOpen(false);
    resetForm();
  };

  // Toggle Account status
  const handleToggleStatus = (staff: Staff) => {
    toggleStaffStatus(staff.id);
    const nextStatus = staff.status === 'Active' ? 'Inactive' : 'Active';
    addLogEntry('Status changed', `Account status for ${staff.name} changed to ${nextStatus}`);
    showToast(`Staff member is now ${nextStatus}.`, 'success');
  };

  // Password reset submit
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.trim().length < 6) {
      showToast('Password must be at least 6 characters.', 'info');
      return;
    }

    if (resetStaff) {
      const updated = {
        ...resetStaff,
        forcePasswordChange: true
      };
      updateStaff(updated);
      addLogEntry('Password reset', `Password reset request triggered for ${resetStaff.name}`);
      showToast(`Password successfully reset for ${resetStaff.name}. Force password change enabled.`, 'success');
    }

    setIsPasswordResetModalOpen(false);
    setResetStaff(null);
    setNewPassword('');
  };

  // Filters calculation
  const filteredStaff = useMemo(() => {
    return staffList.filter(s => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.employeeId.toLowerCase().includes(q) ||
        s.username.toLowerCase().includes(q);

      const matchesBranch = branchFilter === 'All' || s.assignedBranch === branchFilter;
      const matchesStatus = statusFilter === 'All' || s.status === statusFilter;

      return matchesSearch && matchesBranch && matchesStatus;
    });
  }, [staffList, searchQuery, branchFilter, statusFilter]);

  // Logs filters calculation
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const filteredLogs = useMemo(() => {
    return activityLogs.filter(log => {
      const q = logSearchQuery.toLowerCase();
      return log.staffName.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q);
    });
  }, [activityLogs, logSearchQuery]);

  // Preset Template counters
  const getPresetCount = (presetPerms: any) => {
    return staffList.filter(s => {
      // rough matching logic
      return Object.keys(presetPerms).every(moduleKey => {
        const presetModule = presetPerms[moduleKey];
        const staffModule = s.permissions[moduleKey as keyof StaffPermissions] || {};
        return Object.keys(presetModule).every(fieldKey => {
          return (staffModule as any)[fieldKey] === presetModule[fieldKey];
        });
      });
    }).length;
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade flex items-center gap-3 bg-slate-900 border border-slate-800 text-white px-5 py-3.5 rounded-2xl shadow-xl max-w-sm">
          <CheckCircle2 className={`w-5 h-5 shrink-0 ${toast.type === 'info' ? 'text-rose-500' : 'text-teal-400'}`} />
          <p className="text-xs font-bold leading-normal text-white">{toast.message}</p>
        </div>
      )}

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2B2B2B] tracking-tight">Staff Management</h1>
          <p className="text-xs font-semibold text-slate-500 mt-1">Configure staff user accounts, assign branch listings, and control granular permission templates (PBAC)</p>
        </div>
        
        {/* Tab Links Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl self-start md:self-auto shrink-0">
          {[
            { id: 'list', label: 'Staff List', icon: User },
            { id: 'templates', label: 'Permission Templates', icon: ShieldCheck },
            { id: 'logs', label: 'Activity Audit Log', icon: Activity }
          ].map(tab => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-150 cursor-pointer ${activeTab === tab.id ? 'bg-white text-[#7C3AED] shadow-sm font-black' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── TAB 1: STAFF LIST ─────────────────────────────────────────────────── */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          
          {/* Card Summary Dashboard */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Personnel', val: staffList.length, color: 'text-purple-600 bg-purple-50' },
              { label: 'Active Logins', val: staffList.filter(s => s.status === 'Active').length, color: 'text-emerald-700 bg-emerald-50' },
              { label: 'Blocked Accounts', val: staffList.filter(s => s.status === 'Inactive').length, color: 'text-rose-600 bg-rose-50' },
              { label: 'Unassigned Branch', val: staffList.filter(s => !s.assignedBranch).length, color: 'text-slate-600 bg-slate-100' }
            ].map((stat, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                <div className="flex items-center justify-between mt-2">
                  <h4 className="text-xl font-black text-slate-800">{stat.val}</h4>
                  <span className={`text-[9px] font-black ${stat.color} px-1.5 py-0.5 rounded uppercase`}>Live</span>
                </div>
              </div>
            ))}
          </div>

          {/* Filtering and Actions Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              
              {/* Search */}
              <div className="relative min-w-[200px] flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search staff Name or ID..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-purple-600/10 focus:border-[#5C2494]/30"
                />
              </div>

              {/* Branch select */}
              <select
                value={branchFilter}
                onChange={e => setBranchFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer text-slate-650"
              >
                <option value="All">All Branches</option>
                {MOCK_BRANCHES.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>

              {/* Status Select */}
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer text-slate-655"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active Only</option>
                <option value="Inactive">Inactive/Blocked</option>
              </select>
            </div>

            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 bg-gradient-to-r from-[#5C2494] to-[#7C3AED] hover:opacity-95 text-white px-4 py-2.5 rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer shrink-0 self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              Add Staff Member
            </button>
          </div>

          {/* Table list */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto min-w-[900px]">
              <table className="w-full text-left text-xs font-semibold text-slate-600">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-4">Staff Details</th>
                    <th className="p-4">Employee ID</th>
                    <th className="p-4">Assigned Branch</th>
                    <th className="p-4">Username</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Last Login</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {filteredStaff.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-slate-400 font-bold">No staff members found matching parameters.</td>
                    </tr>
                  ) : (
                    filteredStaff.map(staff => (
                      <tr key={staff.id} className="hover:bg-slate-50/30">
                        
                        {/* Detail name & contact */}
                        <td className="p-4 flex items-center gap-3">
                          <img
                            src={staff.avatarUrl || 'https://i.pravatar.cc/150'}
                            alt={staff.name}
                            className="w-9 h-9 rounded-full border border-slate-200 object-cover shrink-0"
                          />
                          <div>
                            <div className="font-black text-slate-800">{staff.name}</div>
                            <div className="text-[10px] text-slate-400 font-bold mt-0.5">{staff.email} • {staff.mobile}</div>
                          </div>
                        </td>

                        <td className="p-4 font-mono font-bold text-slate-800">{staff.employeeId}</td>
                        <td className="p-4 font-bold text-[#5C2494]">{staff.assignedBranch || 'Unassigned'}</td>
                        <td className="p-4 text-slate-500 font-bold">{staff.username}</td>

                        <td className="p-4">
                          <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wider ${
                            staff.status === 'Active' 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-250' 
                              : 'bg-rose-50 text-rose-500 border-rose-250'
                          }`}>
                            {staff.status}
                          </span>
                        </td>

                        <td className="p-4 text-slate-500 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {staff.lastLogin}
                        </td>

                        <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => { setSelectedStaff(staff); setViewingStaffPermissions(staff); }}
                              className="p-1.5 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all"
                              title="View Profile & Permissions"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(staff)}
                              className="p-1.5 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-all"
                              title="Edit Staff"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => { setResetStaff(staff); setIsPasswordResetModalOpen(true); }}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                              title="Reset Password"
                            >
                              <Key className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(staff)}
                              className={`p-1.5 rounded-lg transition-all ${staff.status === 'Active' ? 'text-slate-400 hover:text-rose-500 hover:bg-rose-50' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                              title={staff.status === 'Active' ? 'Deactivate Account' : 'Activate Account'}
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── TAB 2: PERMISSION PRESETS / TEMPLATES ─────────────────────────────────── */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-xs font-semibold text-amber-800">
            <Info className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-bold text-amber-900 mb-0.5">Understanding Permissions Presets</p>
              Permission templates map modules and individual operations to preconfigured roles. Changing staff member settings or picking presets overrides their default role matrices.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEMPLATE_PRESETS.map((preset, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 hover:border-purple-600/30 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <span className="flex items-center justify-center bg-purple-50 text-[#7C3AED] w-10 h-10 rounded-xl">
                    <ShieldCheck className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full uppercase">
                    {getPresetCount(preset.permissions)} assigned
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-black text-slate-800 leading-snug">{preset.name} Preset</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1.5 min-h-[40px] leading-relaxed">{preset.description}</p>
                </div>

                <div className="border-t border-slate-100 pt-3">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Access Scope:</span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {Object.keys(preset.permissions).map(k => (
                      <span key={k} className="text-[9px] font-bold bg-purple-50 text-[#7C3AED] px-2 py-0.5 rounded border border-purple-100/50">
                        {k.replace('Management', '')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── TAB 3: ACTIVITY AUDIT LOG ─────────────────────────────────────────── */}
      {activeTab === 'logs' && (
        <div className="space-y-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-sm font-black text-slate-800">Immutable Audit Logging</h2>
              <p className="text-[11px] font-bold text-slate-400 mt-0.5">Logs of administrative operations, staff activity, and security changes</p>
            </div>
            
            <div className="relative min-w-[240px] max-w-xs self-start sm:self-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search logs by staff or action..."
                value={logSearchQuery}
                onChange={e => setLogSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-purple-600/10 focus:border-[#5C2494]/30"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-slate-600">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User (Performed By)</th>
                  <th className="p-3">Action performed</th>
                  <th className="p-3">Audit Details</th>
                  <th className="p-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400">No matching audit logs found.</td>
                  </tr>
                ) : (
                  filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="p-3 text-slate-500 font-mono text-[10.5px]">{log.timestamp}</td>
                      <td className="p-3 font-bold text-slate-800">{log.staffName}</td>
                      <td className="p-3">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          log.action.includes('created') ? 'bg-emerald-50 text-emerald-600' :
                          log.action.includes('reset') ? 'bg-amber-50 text-amber-600' :
                          log.action.includes('updated') ? 'bg-purple-50 text-[#7C3AED]' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="p-3 text-slate-600">{log.details}</td>
                      <td className="p-3 text-slate-400 font-mono text-[10px]">{log.ip}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── MODAL: ADD / EDIT STAFF MEMBER ────────────────────────────────────── */}
      {isAddEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-fade">
            
            {/* Modal Head */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4.5 bg-slate-50">
              <div>
                <h3 className="text-base font-black text-slate-800">{editingStaffId ? 'Modify Staff Account' : 'Register New Personnel'}</h3>
                <p className="text-[10.5px] font-semibold text-slate-400 mt-0.5">Assign branch location boundaries and configure fine permissions matrix</p>
              </div>
              <button
                onClick={() => { setIsAddEditModalOpen(false); resetForm(); }}
                className="text-slate-400 hover:text-slate-655 p-1.5 rounded-lg hover:bg-slate-200"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Body (Scrollable form) */}
            <form onSubmit={handleSaveStaff} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Fields Group 1: Basic Bio details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="e.g. Kavitha Reddy"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">Employee ID *</label>
                  <input
                    type="text"
                    required
                    value={formEmpId}
                    onChange={e => setFormEmpId(e.target.value)}
                    placeholder="e.g. EMP-2026-005"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-450 uppercase mb-1.5">Mobile Number *</label>
                  <input
                    type="text"
                    required
                    value={formMobile}
                    onChange={e => setFormMobile(e.target.value)}
                    placeholder="e.g. +91 98765 00005"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-purple-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    placeholder="e.g. kavitha@aster.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1.5">Login Username *</label>
                  <input
                    type="text"
                    required
                    value={formUsername}
                    onChange={e => setFormUsername(e.target.value)}
                    placeholder="e.g. kavitha_r"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1.5">Login Password *</label>
                  <input
                    type="password"
                    required={!editingStaffId}
                    disabled={!!editingStaffId}
                    value={formPassword}
                    onChange={e => setFormPassword(e.target.value)}
                    placeholder={editingStaffId ? '••••••••' : 'Enter password'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-purple-500 disabled:opacity-60"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1.5">Assigned Location Branch *</label>
                  <select
                    value={formBranch}
                    onChange={e => setFormBranch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer"
                  >
                    {MOCK_BRANCHES.map(b => (
                      <option key={b.id} value={b.name}>{b.name}</option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-455 uppercase mb-1.5">Permission Role Presets</label>
                  <select
                    value={selectedPreset}
                    onChange={e => handlePresetSelect(e.target.value)}
                    className="w-full bg-purple-50/70 border border-purple-200 rounded-xl px-3 py-2 text-xs font-bold outline-none cursor-pointer text-[#7C3AED]"
                  >
                    <option value="Custom">Custom / Modified matrix</option>
                    <option value="Receptionist">Receptionist Preset Role</option>
                    <option value="Branch Manager">Branch Manager Preset Role</option>
                    <option value="Billing Executive">Billing Executive Preset Role</option>
                  </select>
                </div>
              </div>

              {/* Matrix Layout Section */}
              <div className="border-t border-slate-100 pt-5 space-y-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-purple-600" />
                  <h4 className="text-sm font-black text-slate-800">PBAC Permission Access Matrix</h4>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs font-semibold text-slate-600">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-100/50 text-[10px] font-bold text-slate-450 uppercase">
                        <th className="p-3">Module Name</th>
                        <th className="p-3">Granted Sub-Permissions & Switches</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-250">
                      {MODULES_SPEC.map(module => (
                        <tr key={module.key} className="hover:bg-slate-100/20">
                          <td className="p-3 font-bold text-slate-800 w-44">{module.label}</td>
                          <td className="p-3 flex flex-wrap gap-4">
                            {module.actions.map(action => {
                              const isChecked = !!(formPermissions as any)[module.key]?.[action.field];
                              return (
                                <label key={action.field} className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handlePermissionToggle(module.key, action.field)}
                                    className="accent-purple-650 w-4 h-4"
                                  />
                                  <span>{action.label}</span>
                                </label>
                              );
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-5 bg-white">
                <button
                  type="button"
                  onClick={() => { setIsAddEditModalOpen(false); resetForm(); }}
                  className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#5C2494] to-[#7C3AED] hover:opacity-95 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-md cursor-pointer"
                >
                  {editingStaffId ? 'Apply Profile Changes' : 'Register Staff Account'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: VIEW DETAILS & PERMISSIONS GRID ─────────────────────────────── */}
      {selectedStaff && viewingStaffPermissions && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-fade">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4.5 bg-slate-50">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStaff.avatarUrl || 'https://i.pravatar.cc/150'}
                  alt={selectedStaff.name}
                  className="w-10 h-10 rounded-full border object-cover"
                />
                <div>
                  <h3 className="text-base font-black text-slate-800">{selectedStaff.name} Profile</h3>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">{selectedStaff.employeeId} • {selectedStaff.assignedBranch}</p>
                </div>
              </div>
              <button
                onClick={() => { setSelectedStaff(null); setViewingStaffPermissions(null); }}
                className="text-slate-400 hover:text-slate-650 p-1.5 rounded-lg hover:bg-slate-200"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-5">
              
              {/* Bio Grid */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-150">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Email Address</span>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">{selectedStaff.email}</div>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Mobile Number</span>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">{selectedStaff.mobile}</div>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Username</span>
                  <div className="text-xs font-bold text-slate-800 mt-0.5">{selectedStaff.username}</div>
                </div>
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Status</span>
                  <div className="mt-0.5">
                    <span className={`text-[8.5px] font-bold px-1.5 py-0.5 rounded-full border uppercase ${selectedStaff.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-500 border-rose-200'}`}>{selectedStaff.status}</span>
                  </div>
                </div>
              </div>

              {/* Permissions list */}
              <div className="space-y-3">
                <span className="text-xs font-black text-slate-800 block">Granted Application Access:</span>
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs font-semibold text-slate-600">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase">
                        <th className="p-2.5 pl-4">Module</th>
                        <th className="p-2.5">Permissions Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                      {MODULES_SPEC.map(mod => {
                        const permissions = (selectedStaff.permissions as any)[mod.key] || {};
                        const grantedActions = mod.actions.filter(act => !!permissions[act.field]);
                        return (
                          <tr key={mod.key}>
                            <td className="p-2.5 pl-4 font-bold text-slate-800">{mod.label}</td>
                            <td className="p-2.5">
                              {grantedActions.length === 0 ? (
                                <span className="text-[9px] font-bold text-slate-400 uppercase">No Access</span>
                              ) : (
                                <div className="flex flex-wrap gap-1">
                                  {grantedActions.map(act => (
                                    <span key={act.field} className="text-[9px] font-black bg-purple-50 text-[#7C3AED] px-1.5 py-0.5 rounded border border-purple-100">
                                      {act.label}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL: RESET PASSWORD ──────────────────────────────────────────────── */}
      {isPasswordResetModalOpen && resetStaff && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden flex flex-col shadow-2xl animate-fade">
            
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-slate-50">
              <h3 className="text-sm font-black text-slate-800">Reset Password</h3>
              <button
                onClick={() => { setIsPasswordResetModalOpen(false); setResetStaff(null); }}
                className="text-slate-400 hover:text-slate-650 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleResetPasswordSubmit} className="p-5 space-y-4">
              <div className="text-xs font-semibold text-slate-500 leading-relaxed">
                Provide a temporary password for <span className="font-bold text-slate-800">{resetStaff.name}</span>. The user will be required to configure a new password upon their next login.
              </div>

              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1.5">New Password *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-semibold outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => { setIsPasswordResetModalOpen(false); setResetStaff(null); }}
                  className="bg-white border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:opacity-95 text-white px-4 py-2 rounded-xl text-xs font-black shadow-sm"
                >
                  Confirm Reset
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};

export default StaffManagementScreen;
