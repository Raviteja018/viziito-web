import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { type Staff, type StaffPermissions, MOCK_STAFF, DEFAULT_ADMIN_PERMISSIONS } from '../../mocks/hospitalMocks';

export type UserRole = 'admin' | 'receptionist';

const ALL_FALSE_PERMISSIONS: StaffPermissions = {
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
};

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  assignedBranch: string;
  setAssignedBranch: (branch: string) => void;
  activeStaffId: string | null;
  setActiveStaffId: (id: string | null) => void;
  staffList: Staff[];
  setStaffList: React.Dispatch<React.SetStateAction<Staff[]>>;
  permissions: StaffPermissions;
  addStaff: (staff: Staff) => void;
  updateStaff: (staff: Staff) => void;
  toggleStaffStatus: (id: string) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const HospitalRoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('admin');
  const [adminBranch, setAdminBranch] = useState<string>('Jubilee Hills Branch');
  const [activeStaffId, setActiveStaffId] = useState<string | null>('staff_1');
  const [staffList, setStaffList] = useState<Staff[]>(() => {
    const saved = localStorage.getItem('vizito_staff');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return MOCK_STAFF;
      }
    }
    return MOCK_STAFF;
  });

  const activeStaff = staffList.find(s => s.id === activeStaffId);

  // Receptionists are bound to their assigned branch. Admin can choose branch via selector.
  const assignedBranch = role === 'admin'
    ? adminBranch
    : (activeStaff ? activeStaff.assignedBranch : 'Jubilee Hills Branch');

  const setAssignedBranch = (branch: string) => {
    if (role === 'admin') {
      setAdminBranch(branch);
    } else if (activeStaffId) {
      setStaffList(prev => {
        const updated = prev.map(s => s.id === activeStaffId ? { ...s, assignedBranch: branch } : s);
        localStorage.setItem('vizito_staff', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const permissions = role === 'admin'
    ? DEFAULT_ADMIN_PERMISSIONS
    : (activeStaff && activeStaff.status === 'Active' ? activeStaff.permissions : ALL_FALSE_PERMISSIONS);

  const addStaff = (newStaff: Staff) => {
    setStaffList(prev => {
      const updated = [...prev, newStaff];
      localStorage.setItem('vizito_staff', JSON.stringify(updated));
      return updated;
    });
  };

  const updateStaff = (updatedStaff: Staff) => {
    setStaffList(prev => {
      const updated = prev.map(s => s.id === updatedStaff.id ? updatedStaff : s);
      localStorage.setItem('vizito_staff', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleStaffStatus = (id: string) => {
    setStaffList(prev => {
      const updated = prev.map(s => {
        if (s.id === id) {
          const nextStatus: 'Active' | 'Inactive' = s.status === 'Active' ? 'Inactive' : 'Active';
          return { ...s, status: nextStatus };
        }
        return s;
      });
      localStorage.setItem('vizito_staff', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <RoleContext.Provider value={{
      role,
      setRole,
      assignedBranch,
      setAssignedBranch,
      activeStaffId,
      setActiveStaffId,
      staffList,
      setStaffList,
      permissions,
      addStaff,
      updateStaff,
      toggleStaffStatus
    }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useHospitalRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useHospitalRole must be used within a HospitalRoleProvider');
  }
  return context;
};
