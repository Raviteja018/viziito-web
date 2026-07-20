export interface Branch {
  id: string;
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
  contact: string;
  city: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
  branches: string[]; // Branch IDs
  totalDoctors: number;
}

export interface AssociatedDoctor {
  id: string;
  name: string;
  specialization: string;
  departments: string[]; // Dept Names
  branches: string[]; // Branch Names
  consultationType: 'Online' | 'In-Person' | 'Both';
  consultationFee: number;
  availabilityStatus: 'Available Today' | 'On Leave' | 'No Availability' | 'Fully Booked';
  imageUrl: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  department: string;
  branchName: string;
  timeSlot: string;
  date: string; // YYYY-MM-DD
  type: 'Online' | 'In-Person';
  status: 'Upcoming' | 'Completed' | 'Cancelled' | 'Checked-In' | 'No Show' | 'Rescheduled';
}

export interface IntegrationRequest {
  id: string;
  providerName: string;
  type: 'Pharmacy' | 'Laboratory' | 'Ambulance';
  status: 'Pending' | 'Accepted' | 'Rejected';
  submittedDate: string;
}

export interface ActivityLog {
  id: string;
  text: string;
  time: string; // relative time (e.g. "5 mins ago")
  type: 'appointment' | 'doctor' | 'receptionist' | 'department' | 'integration' | 'availability';
}

export interface StaffPermissions {
  dashboard: {
    view: boolean;
  };
  hospitalProfile: {
    view: boolean;
    edit: boolean;
  };
  branchManagement: {
    view: boolean;
    add: boolean;
    edit: boolean;
    activate: boolean;
    deactivate: boolean;
  };
  doctorManagement: {
    view: boolean;
    addDoctor: boolean;
    requestDoctor: boolean;
    assignDoctor: boolean;
    removeDoctor: boolean;
    configureConsultation: boolean;
  };
  departmentManagement: {
    view: boolean;
    add: boolean;
    edit: boolean;
    activate: boolean;
    deactivate: boolean;
  };
  staffManagement: {
    view: boolean;
    add: boolean;
    edit: boolean;
    resetPassword: boolean;
    toggleStatus: boolean;
    managePermissions: boolean;
  };
  availabilityManagement: {
    view: boolean;
    createRequest: boolean;
    approve: boolean;
    reject: boolean;
    withdraw: boolean;
  };
  appointmentManagement: {
    view: boolean;
    bookAppointment: boolean;
    reschedule: boolean;
    cancel: boolean;
    checkIn: boolean;
  };
  patientManagement: {
    view: boolean;
    registerPatient: boolean;
  };
  revenue: {
    view: boolean;
  };
  settlement: {
    view: boolean;
    process: boolean;
  };
  transactions: {
    view: boolean;
  };
  integrations: {
    view: boolean;
    pharmacy: boolean;
    laboratory: boolean;
    ambulance: boolean;
  };
  settings: {
    view: boolean;
    edit: boolean;
  };
}

export interface Staff {
  id: string;
  name: string;
  employeeId: string;
  mobile: string;
  email: string;
  gender?: 'Male' | 'Female' | 'Other';
  avatarUrl?: string;
  assignedBranch: string;
  username: string;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  forcePasswordChange: boolean;
  permissions: StaffPermissions;
}

// MOCK DATA
// MOCK DATA DEFAULTS
const DEFAULT_BRANCHES: Branch[] = [
  { id: 'br_1', name: 'Jubilee Hills Branch', code: 'JHB01', status: 'Active', contact: '+91 98765 43210', city: 'Hyderabad' },
  { id: 'br_2', name: 'Gachibowli Clinic', code: 'GCB01', status: 'Active', contact: '+91 98765 43211', city: 'Hyderabad' },
  { id: 'br_3', name: 'Kukatpally Center', code: 'KPC01', status: 'Active', contact: '+91 98765 43212', city: 'Hyderabad' },
  { id: 'br_4', name: 'Begumpet Care', code: 'BPC01', status: 'Inactive', contact: '+91 98765 43213', city: 'Hyderabad' }
];

const DEFAULT_DEPARTMENTS: Department[] = [
  { id: 'dept_1', name: 'General Medicine', code: 'GEN', status: 'Active', branches: ['Jubilee Hills Branch', 'Gachibowli Clinic', 'Kukatpally Center'], totalDoctors: 3 },
  { id: 'dept_2', name: 'Cardiology', code: 'CAR', status: 'Active', branches: ['Jubilee Hills Branch', 'Gachibowli Clinic'], totalDoctors: 2 },
  { id: 'dept_3', name: 'Orthopedics', code: 'ORTHO', status: 'Active', branches: ['Jubilee Hills Branch', 'Kukatpally Center'], totalDoctors: 1 },
  { id: 'dept_4', name: 'Pediatrics', code: 'PEDS', status: 'Active', branches: ['Gachibowli Clinic', 'Kukatpally Center'], totalDoctors: 2 },
  { id: 'dept_5', name: 'Neurology', code: 'NEURO', status: 'Inactive', branches: ['Jubilee Hills Branch'], totalDoctors: 1 }
];

const isClient = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const getStoredBranches = (): Branch[] => {
  if (!isClient) return DEFAULT_BRANCHES;
  const saved = localStorage.getItem('vizito_branches');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  localStorage.setItem('vizito_branches', JSON.stringify(DEFAULT_BRANCHES));
  return DEFAULT_BRANCHES;
};

const getStoredDepartments = (): Department[] => {
  if (!isClient) return DEFAULT_DEPARTMENTS;
  const saved = localStorage.getItem('vizito_departments');
  if (saved) {
    try { return JSON.parse(saved); } catch (e) {}
  }
  localStorage.setItem('vizito_departments', JSON.stringify(DEFAULT_DEPARTMENTS));
  return DEFAULT_DEPARTMENTS;
};

// Create dynamic proxy objects
export const MOCK_BRANCHES: Branch[] = new Proxy([] as Branch[], {
  get(target, prop, receiver) {
    const list = getStoredBranches();
    if (prop === 'toJSON') {
      return () => list;
    }
    const val = Reflect.get(list, prop);
    return typeof val === 'function' ? val.bind(list) : val;
  },
  set(target, prop, value, receiver) {
    if (!isClient) return true;
    const list = getStoredBranches();
    const success = Reflect.set(list, prop, value);
    localStorage.setItem('vizito_branches', JSON.stringify(list));
    return success;
  },
  getOwnPropertyDescriptor(target, prop) {
    const list = getStoredBranches();
    return Reflect.getOwnPropertyDescriptor(list, prop);
  },
  ownKeys(target) {
    const list = getStoredBranches();
    return Reflect.ownKeys(list);
  },
  has(target, prop) {
    const list = getStoredBranches();
    return Reflect.has(list, prop);
  }
});

export const MOCK_DEPARTMENTS: Department[] = new Proxy([] as Department[], {
  get(target, prop, receiver) {
    const list = getStoredDepartments();
    if (prop === 'toJSON') {
      return () => list;
    }
    const val = Reflect.get(list, prop);
    return typeof val === 'function' ? val.bind(list) : val;
  },
  set(target, prop, value, receiver) {
    if (!isClient) return true;
    const list = getStoredDepartments();
    const success = Reflect.set(list, prop, value);
    localStorage.setItem('vizito_departments', JSON.stringify(list));
    return success;
  },
  getOwnPropertyDescriptor(target, prop) {
    const list = getStoredDepartments();
    return Reflect.getOwnPropertyDescriptor(list, prop);
  },
  ownKeys(target) {
    const list = getStoredDepartments();
    return Reflect.ownKeys(list);
  },
  has(target, prop) {
    const list = getStoredDepartments();
    return Reflect.has(list, prop);
  }
});

export const MOCK_DOCTORS: AssociatedDoctor[] = [
  {
    id: 'doc_1',
    name: 'Dr. Arjun Reddy',
    specialization: 'Cardiologist',
    departments: ['Cardiology', 'General Medicine'],
    branches: ['Jubilee Hills Branch', 'Gachibowli Clinic'],
    consultationType: 'Both',
    consultationFee: 1200,
    availabilityStatus: 'Available Today',
    imageUrl: 'https://i.pravatar.cc/150?img=68'
  },
  {
    id: 'doc_2',
    name: 'Dr. Priya Sharma',
    specialization: 'Pediatrician',
    departments: ['Pediatrics'],
    branches: ['Gachibowli Clinic', 'Kukatpally Center'],
    consultationType: 'Online',
    consultationFee: 800,
    availabilityStatus: 'Available Today',
    imageUrl: 'https://i.pravatar.cc/150?img=49'
  },
  {
    id: 'doc_3',
    name: 'Dr. Vikram Seth',
    specialization: 'Orthopedic Surgeon',
    departments: ['Orthopedics'],
    branches: ['Jubilee Hills Branch', 'Kukatpally Center'],
    consultationType: 'In-Person',
    consultationFee: 1500,
    availabilityStatus: 'Fully Booked',
    imageUrl: 'https://i.pravatar.cc/150?img=12'
  },
  {
    id: 'doc_4',
    name: 'Dr. Sneha Patil',
    specialization: 'General Physician',
    departments: ['General Medicine'],
    branches: ['Jubilee Hills Branch', 'Gachibowli Clinic', 'Kukatpally Center'],
    consultationType: 'Both',
    consultationFee: 700,
    availabilityStatus: 'On Leave',
    imageUrl: 'https://i.pravatar.cc/150?img=32'
  },
  {
    id: 'doc_5',
    name: 'Dr. Rajesh Kumar',
    specialization: 'Neurologist',
    departments: ['Neurology'],
    branches: ['Jubilee Hills Branch'],
    consultationType: 'In-Person',
    consultationFee: 2000,
    availabilityStatus: 'No Availability',
    imageUrl: 'https://i.pravatar.cc/150?img=33'
  }
];

// Helper to generate dynamic appointment dates (e.g. today, yesterday, tomorrow)
const todayStr = new Date().toISOString().split('T')[0];
const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt_101',
    patientName: 'Ramesh Patel',
    patientId: 'PT-9923',
    doctorName: 'Dr. Arjun Reddy',
    department: 'Cardiology',
    branchName: 'Jubilee Hills Branch',
    timeSlot: '09:00 AM - 09:20 AM',
    date: todayStr,
    type: 'In-Person',
    status: 'Checked-In'
  },
  {
    id: 'apt_102',
    patientName: 'Sanjana Roy',
    patientId: 'PT-4821',
    doctorName: 'Dr. Priya Sharma',
    department: 'Pediatrics',
    branchName: 'Gachibowli Clinic',
    timeSlot: '10:00 AM - 10:15 AM',
    date: todayStr,
    type: 'Online',
    status: 'Completed'
  },
  {
    id: 'apt_103',
    patientName: 'Aditya Verma',
    patientId: 'PT-7119',
    doctorName: 'Dr. Vikram Seth',
    department: 'Orthopedics',
    branchName: 'Kukatpally Center',
    timeSlot: '11:30 AM - 11:50 AM',
    date: todayStr,
    type: 'In-Person',
    status: 'Upcoming'
  },
  {
    id: 'apt_104',
    patientName: 'Meera Deshmukh',
    patientId: 'PT-3091',
    doctorName: 'Dr. Sneha Patil',
    department: 'General Medicine',
    branchName: 'Jubilee Hills Branch',
    timeSlot: '02:00 PM - 02:20 PM',
    date: todayStr,
    type: 'Online',
    status: 'Rescheduled'
  },
  {
    id: 'apt_105',
    patientName: 'Vijay Kulkarni',
    patientId: 'PT-1248',
    doctorName: 'Dr. Arjun Reddy',
    department: 'Cardiology',
    branchName: 'Jubilee Hills Branch',
    timeSlot: '04:00 PM - 04:20 PM',
    date: todayStr,
    type: 'In-Person',
    status: 'Cancelled'
  },
  {
    id: 'apt_106',
    patientName: 'Kirti Sen',
    patientId: 'PT-8891',
    doctorName: 'Dr. Sneha Patil',
    department: 'General Medicine',
    branchName: 'Gachibowli Clinic',
    timeSlot: '11:00 AM - 11:20 AM',
    date: todayStr,
    type: 'In-Person',
    status: 'No Show'
  },
  {
    id: 'apt_107',
    patientName: 'Siddharth Shah',
    patientId: 'PT-6623',
    doctorName: 'Dr. Priya Sharma',
    department: 'Pediatrics',
    branchName: 'Kukatpally Center',
    timeSlot: '09:00 AM - 09:15 AM',
    date: tomorrowStr,
    type: 'Online',
    status: 'Upcoming'
  },
  {
    id: 'apt_108',
    patientName: 'Geetha Nair',
    patientId: 'PT-4122',
    doctorName: 'Dr. Vikram Seth',
    department: 'Orthopedics',
    branchName: 'Jubilee Hills Branch',
    timeSlot: '10:30 AM - 10:50 AM',
    date: tomorrowStr,
    type: 'In-Person',
    status: 'Upcoming'
  },
  {
    id: 'apt_109',
    patientName: 'Harish Rao',
    patientId: 'PT-2299',
    doctorName: 'Dr. Sneha Patil',
    department: 'General Medicine',
    branchName: 'Gachibowli Clinic',
    timeSlot: '03:30 PM - 03:50 PM',
    date: yesterdayStr,
    type: 'In-Person',
    status: 'Completed'
  }
];

export const MOCK_INTEGRATION_REQUESTS: IntegrationRequest[] = [
  { id: 'int_1', providerName: 'Apollo Pharmacy', type: 'Pharmacy', status: 'Pending', submittedDate: yesterdayStr },
  { id: 'int_2', providerName: 'Dr. Lal PathLabs', type: 'Laboratory', status: 'Pending', submittedDate: todayStr },
  { id: 'int_3', providerName: 'Medikab Ambulance', type: 'Ambulance', status: 'Pending', submittedDate: todayStr }
];

export const MOCK_ACTIVITIES: ActivityLog[] = [
  { id: 'act_1', text: 'Dr. Priya Sharma updated availability for Gachibowli Clinic', time: '2 mins ago', type: 'availability' },
  { id: 'act_2', text: 'New Appointment booked: Sanjana Roy with Dr. Priya Sharma', time: '10 mins ago', type: 'appointment' },
  { id: 'act_3', text: 'Integration request accepted by Apollo Pharmacy', time: '45 mins ago', type: 'integration' },
  { id: 'act_4', text: 'New receptionist added: Kavitha Reddy assigned to Gachibowli Clinic', time: '1 hour ago', type: 'receptionist' },
  { id: 'act_5', text: 'Department created: Cardiology (CAR)', time: '3 hours ago', type: 'department' },
  { id: 'act_6', text: 'Doctor association request accepted by Dr. Arjun Reddy', time: '4 hours ago', type: 'doctor' },
  { id: 'act_7', text: 'Appointment cancelled: Vijay Kulkarni with Dr. Arjun Reddy', time: '5 hours ago', type: 'appointment' }
];

export const DEFAULT_ADMIN_PERMISSIONS: StaffPermissions = {
  dashboard: { view: true },
  hospitalProfile: { view: true, edit: true },
  branchManagement: { view: true, add: true, edit: true, activate: true, deactivate: true },
  doctorManagement: { view: true, addDoctor: true, requestDoctor: true, assignDoctor: true, removeDoctor: true, configureConsultation: true },
  departmentManagement: { view: true, add: true, edit: true, activate: true, deactivate: true },
  staffManagement: { view: true, add: true, edit: true, resetPassword: true, toggleStatus: true, managePermissions: true },
  availabilityManagement: { view: true, createRequest: true, approve: true, reject: true, withdraw: true },
  appointmentManagement: { view: true, bookAppointment: true, reschedule: true, cancel: true, checkIn: true },
  patientManagement: { view: true, registerPatient: true },
  revenue: { view: true },
  settlement: { view: true, process: true },
  transactions: { view: true },
  integrations: { view: true, pharmacy: true, laboratory: true, ambulance: true },
  settings: { view: true, edit: true }
};

export const MOCK_STAFF: Staff[] = [
  {
    id: 'staff_1',
    name: 'Kavitha Reddy',
    employeeId: 'EMP-2026-001',
    mobile: '+91 98765 00001',
    email: 'kavitha.reddy@aster.com',
    gender: 'Female',
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
    assignedBranch: 'Gachibowli Clinic',
    username: 'kavitha_reddy',
    status: 'Active',
    lastLogin: '10 mins ago',
    forcePasswordChange: false,
    permissions: {
      dashboard: { view: true },
      hospitalProfile: { view: true, edit: false },
      branchManagement: { view: false, add: false, edit: false, activate: false, deactivate: false },
      doctorManagement: { view: true, addDoctor: false, requestDoctor: false, assignDoctor: false, removeDoctor: false, configureConsultation: false },
      departmentManagement: { view: true, add: false, edit: false, activate: false, deactivate: false },
      staffManagement: { view: false, add: false, edit: false, resetPassword: false, toggleStatus: false, managePermissions: false },
      availabilityManagement: { view: true, createRequest: false, approve: false, reject: false, withdraw: false },
      appointmentManagement: { view: true, bookAppointment: true, reschedule: true, cancel: true, checkIn: true },
      patientManagement: { view: true, registerPatient: true },
      revenue: { view: false },
      settlement: { view: false, process: false },
      transactions: { view: false },
      integrations: { view: true, pharmacy: true, laboratory: false, ambulance: true },
      settings: { view: false, edit: false }
    }
  },
  {
    id: 'staff_2',
    name: 'Amit Sharma',
    employeeId: 'EMP-2026-002',
    mobile: '+91 98765 00002',
    email: 'amit.sharma@aster.com',
    gender: 'Male',
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    assignedBranch: 'Jubilee Hills Branch',
    username: 'amit_sharma',
    status: 'Active',
    lastLogin: '1 day ago',
    forcePasswordChange: true,
    permissions: {
      dashboard: { view: true },
      hospitalProfile: { view: true, edit: true },
      branchManagement: { view: true, add: false, edit: false, activate: false, deactivate: false },
      doctorManagement: { view: true, addDoctor: true, requestDoctor: true, assignDoctor: true, removeDoctor: true, configureConsultation: true },
      departmentManagement: { view: true, add: true, edit: true, activate: true, deactivate: true },
      staffManagement: { view: true, add: false, edit: false, resetPassword: false, toggleStatus: false, managePermissions: false },
      availabilityManagement: { view: true, createRequest: true, approve: true, reject: true, withdraw: true },
      appointmentManagement: { view: true, bookAppointment: false, reschedule: false, cancel: false, checkIn: false },
      patientManagement: { view: true, registerPatient: false },
      revenue: { view: true },
      settlement: { view: true, process: false },
      transactions: { view: true },
      integrations: { view: true, pharmacy: true, laboratory: true, ambulance: true },
      settings: { view: true, edit: false }
    }
  },
  {
    id: 'staff_3',
    name: 'Suresh Kumar',
    employeeId: 'EMP-2026-003',
    mobile: '+91 98765 00003',
    email: 'suresh.kumar@aster.com',
    gender: 'Male',
    avatarUrl: 'https://i.pravatar.cc/150?img=13',
    assignedBranch: 'Kukatpally Center',
    username: 'suresh_kumar',
    status: 'Active',
    lastLogin: '4 hours ago',
    forcePasswordChange: false,
    permissions: {
      dashboard: { view: true },
      hospitalProfile: { view: true, edit: false },
      branchManagement: { view: true, add: false, edit: false, activate: false, deactivate: false },
      doctorManagement: { view: true, addDoctor: false, requestDoctor: false, assignDoctor: true, removeDoctor: false, configureConsultation: true },
      departmentManagement: { view: true, add: false, edit: false, activate: false, deactivate: false },
      staffManagement: { view: true, add: false, edit: false, resetPassword: false, toggleStatus: false, managePermissions: false },
      availabilityManagement: { view: true, createRequest: true, approve: true, reject: false, withdraw: true },
      appointmentManagement: { view: true, bookAppointment: true, reschedule: true, cancel: true, checkIn: true },
      patientManagement: { view: true, registerPatient: true },
      revenue: { view: false },
      settlement: { view: false, process: false },
      transactions: { view: false },
      integrations: { view: true, pharmacy: true, laboratory: true, ambulance: false },
      settings: { view: false, edit: false }
    }
  },
  {
    id: 'staff_4',
    name: 'Nisha Patel',
    employeeId: 'EMP-2026-004',
    mobile: '+91 98765 00004',
    email: 'nisha.patel@aster.com',
    gender: 'Female',
    avatarUrl: 'https://i.pravatar.cc/150?img=35',
    assignedBranch: 'Begumpet Care',
    username: 'nisha_patel',
    status: 'Inactive',
    lastLogin: 'Never',
    forcePasswordChange: false,
    permissions: {
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
    }
  }
];
