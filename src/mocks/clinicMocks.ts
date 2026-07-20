// ─── Clinic Mock Data ─────────────────────────────────────────────────────────

export interface ClinicProfile {
  clinicId: string;
  clinicName: string;
  ownerName: string;
  ownerTitle: string;
  specialisation: string[];
  contact: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  registrationNumber: string;
  operatingHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  establishedYear: number;
  description: string;
}

export interface PartnerDoctor {
  id: string;
  name: string;
  title: string;
  specialisation: string;
  contact: string;
  email: string;
  experience: string;
  vizitoDoctorId: string;
  status: 'Connected' | 'Pending Outgoing' | 'Incoming' | 'Invited';
  connectedDate?: string;
}

export interface ClinicAppointment {
  id: string;
  patientName: string;
  patientAge: number;
  doctorName: string;
  specialisation: string;
  date: string;
  timeSlot: string;
  type: 'In-Person' | 'Video Call';
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'No Show';
  fee: number;
}

// ─── Registered Doctor Directory (already on Vizito, not yet partners) ────────
export const DOCTOR_DIRECTORY: Omit<PartnerDoctor, 'status'>[] = [
  { id: 'dir_d1', name: 'Dr. Priya Sharma', title: 'Dr.', specialisation: 'Gynaecology', contact: '+91 98765 11201', email: 'priya.sharma@vizito.in', experience: '12 yrs', vizitoDoctorId: 'VIZ-D-2291' },
  { id: 'dir_d2', name: 'Dr. Karthik Rao', title: 'Dr.', specialisation: 'Orthopaedics', contact: '+91 98765 11202', email: 'karthik.rao@vizito.in', experience: '8 yrs', vizitoDoctorId: 'VIZ-D-4412' },
  { id: 'dir_d3', name: 'Dr. Ananya Menon', title: 'Dr.', specialisation: 'Dermatology', contact: '+91 98765 11203', email: 'ananya.menon@vizito.in', experience: '6 yrs', vizitoDoctorId: 'VIZ-D-3381' },
  { id: 'dir_d4', name: 'Dr. Ramesh Iyer', title: 'Dr.', specialisation: 'Neurology', contact: '+91 98765 11204', email: 'ramesh.iyer@vizito.in', experience: '15 yrs', vizitoDoctorId: 'VIZ-D-1092' },
  { id: 'dir_d5', name: 'Dr. Sunita Pillai', title: 'Dr.', specialisation: 'Paediatrics', contact: '+91 98765 11205', email: 'sunita.pillai@vizito.in', experience: '10 yrs', vizitoDoctorId: 'VIZ-D-5534' },
];

// ─── Mock Clinic Profile ──────────────────────────────────────────────────────
export const MOCK_CLINIC_PROFILE: ClinicProfile = {
  clinicId: 'CLN-HYD-2024-00142',
  clinicName: 'City Care Clinic',
  ownerName: 'Dr. Arjun Reddy',
  ownerTitle: 'MBBS, MD (Internal Medicine)',
  specialisation: ['Internal Medicine', 'General Practice', 'Diabetes Care'],
  contact: '+91 98765 00101',
  email: 'contact@citycareclinic.in',
  address: 'Plot 24, Road No. 5, Banjara Hills',
  city: 'Hyderabad',
  pincode: '500034',
  registrationNumber: 'TSMC-2018-10245',
  operatingHours: {
    weekdays: '9:00 AM – 8:00 PM',
    saturday: '9:00 AM – 2:00 PM',
    sunday: 'Closed',
  },
  establishedYear: 2018,
  description: 'City Care Clinic is a multi-speciality outpatient clinic offering comprehensive care in Internal Medicine, Diabetes Management, and General Practice. We partner with leading specialists to provide one-stop healthcare for families.',
};

// ─── Mock Partner Doctors ─────────────────────────────────────────────────────
export const MOCK_PARTNER_DOCTORS: PartnerDoctor[] = [
  {
    id: 'pd_1',
    name: 'Dr. Sneha Kapoor',
    title: 'Dr.',
    specialisation: 'Cardiology',
    contact: '+91 98765 22101',
    email: 'sneha.kapoor@vizito.in',
    experience: '14 yrs',
    vizitoDoctorId: 'VIZ-D-0882',
    status: 'Connected',
    connectedDate: '10 Feb 2026',
  },
  {
    id: 'pd_2',
    name: 'Dr. Vijay Nair',
    title: 'Dr.',
    specialisation: 'Pulmonology',
    contact: '+91 98765 22102',
    email: 'vijay.nair@vizito.in',
    experience: '9 yrs',
    vizitoDoctorId: 'VIZ-D-1773',
    status: 'Connected',
    connectedDate: '22 Mar 2026',
  },
  {
    id: 'pd_3',
    name: 'Dr. Meena Krishnan',
    title: 'Dr.',
    specialisation: 'Endocrinology',
    contact: '+91 98765 22103',
    email: 'meena.krishnan@vizito.in',
    experience: '11 yrs',
    vizitoDoctorId: 'VIZ-D-2664',
    status: 'Pending Outgoing',
  },
  {
    id: 'pd_4',
    name: 'Dr. Aakash Verma',
    title: 'Dr.',
    specialisation: 'Gastroenterology',
    contact: '+91 98765 22104',
    email: 'aakash.verma@vizito.in',
    experience: '7 yrs',
    vizitoDoctorId: 'VIZ-D-3991',
    status: 'Incoming',
  },
];

// ─── Mock Clinic Appointments ────────────────────────────────────────────────
export const MOCK_CLINIC_APPOINTMENTS: ClinicAppointment[] = [
  { id: 'ca_1', patientName: 'Ravi Kumar', patientAge: 45, doctorName: 'Dr. Arjun Reddy', specialisation: 'Internal Medicine', date: '2026-07-18', timeSlot: '09:30 AM', type: 'In-Person', status: 'Scheduled', fee: 600 },
  { id: 'ca_2', patientName: 'Sonia Mehta', patientAge: 38, doctorName: 'Dr. Sneha Kapoor', specialisation: 'Cardiology', date: '2026-07-18', timeSlot: '10:00 AM', type: 'In-Person', status: 'Completed', fee: 1200 },
  { id: 'ca_3', patientName: 'Prakash Goud', patientAge: 52, doctorName: 'Dr. Vijay Nair', specialisation: 'Pulmonology', date: '2026-07-18', timeSlot: '11:15 AM', type: 'Video Call', status: 'Scheduled', fee: 800 },
  { id: 'ca_4', patientName: 'Lakshmi Devi', patientAge: 62, doctorName: 'Dr. Arjun Reddy', specialisation: 'Internal Medicine', date: '2026-07-18', timeSlot: '12:00 PM', type: 'In-Person', status: 'Completed', fee: 600 },
  { id: 'ca_5', patientName: 'Harish Babu', patientAge: 29, doctorName: 'Dr. Sneha Kapoor', specialisation: 'Cardiology', date: '2026-07-19', timeSlot: '09:00 AM', type: 'In-Person', status: 'Scheduled', fee: 1200 },
  { id: 'ca_6', patientName: 'Pooja Reddy', patientAge: 34, doctorName: 'Dr. Vijay Nair', specialisation: 'Pulmonology', date: '2026-07-19', timeSlot: '10:30 AM', type: 'Video Call', status: 'Scheduled', fee: 800 },
  { id: 'ca_7', patientName: 'Venkat Rao', patientAge: 58, doctorName: 'Dr. Arjun Reddy', specialisation: 'Internal Medicine', date: '2026-07-19', timeSlot: '11:00 AM', type: 'In-Person', status: 'Cancelled', fee: 600 },
  { id: 'ca_8', patientName: 'Anita Singh', patientAge: 41, doctorName: 'Dr. Sneha Kapoor', specialisation: 'Cardiology', date: '2026-07-20', timeSlot: '02:00 PM', type: 'In-Person', status: 'Scheduled', fee: 1200 },
  { id: 'ca_9', patientName: 'Suresh Patil', patientAge: 66, doctorName: 'Dr. Vijay Nair', specialisation: 'Pulmonology', date: '2026-07-20', timeSlot: '03:30 PM', type: 'In-Person', status: 'Scheduled', fee: 800 },
  { id: 'ca_10', patientName: 'Deepa Nambiar', patientAge: 27, doctorName: 'Dr. Arjun Reddy', specialisation: 'Internal Medicine', date: '2026-07-21', timeSlot: '09:30 AM', type: 'Video Call', status: 'Scheduled', fee: 600 },
];
