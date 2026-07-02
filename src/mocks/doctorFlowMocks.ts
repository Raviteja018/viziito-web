export const MOCK_CLINICS = [
  { id: '1', name: 'Banjarahills Clinic', type: 'In-Clinic' },
  { id: '2', name: 'City Care Hospital', type: 'In-Clinic' },
  { id: '3', name: 'Dr. Arjun Virtual Clinic', type: 'Online Practice' },
];

export const MOCK_APPOINTMENTS = [
  { id: '1', time: '09:30 AM', patientName: 'Ramesh Kumar', type: 'In-Clinic', status: 'Confirmed', clinicId: '1', initials: 'RK' },
  { id: '2', time: '10:30 AM', patientName: 'Priya Sharma', type: 'Video Consultation', status: 'Upcoming', clinicId: '3', initials: 'PS' },
  { id: '3', time: '11:30 AM', patientName: 'Suresh Babu', type: 'In-Clinic', status: 'Pending', clinicId: '1', initials: 'SB' },
  { id: '4', time: '05:00 PM', patientName: 'Anjali Mehta', type: 'Video Consultation', status: 'Confirmed', clinicId: '3', initials: 'AM' },
];

export const MOCK_REVIEWS = [
  { id: '1', patientName: 'Neha Singh', rating: 5, comment: 'Very good experience. Doctor was very patient and explained everything clearly.', date: '2 May 2025', initials: 'NS', color: 'bg-pink-100 text-pink-700' },
  { id: '2', patientName: 'Vikram Patel', rating: 4.5, comment: 'Excellent consultation and proper guidance.', date: '1 May 2025', initials: 'VP', color: 'bg-blue-100 text-blue-700' },
  { id: '3', patientName: 'Sunita Verma', rating: 5, comment: 'Highly recommended!', date: '30 Apr 2025', initials: 'SV', color: 'bg-orange-100 text-orange-700' },
  { id: '4', patientName: 'Rahul Joshi', rating: 4, comment: 'Good experience.', date: '28 Apr 2025', initials: 'RJ', color: 'bg-green-100 text-green-700' },
];

export const MOCK_REVENUE = {
  totalRevenue: 124850,
  netEarnings: 108650,
  pendingSettlements: 16200,
  consultations: 156,
  trend: '+18.6%',
  chartData: [
    { label: '01 May', value: 40000 },
    { label: '08 May', value: 55000 },
    { label: '15 May', value: 48000 },
    { label: '22 May', value: 70000 },
    { label: '31 May', value: 124850 },
  ],
};

export const MOCK_PROFILE_COMPLETION = {
  percentage: 65,
  steps: [
    { name: 'Personal Information', completed: true },
    { name: 'Professional Information', completed: true },
    { name: 'Clinic Information', completed: true },
    { name: 'KYC Verification', completed: false },
    { name: 'Bank Details', completed: false },
    { name: 'Website Request', completed: false },
  ]
};

export const MOCK_UPCOMING_SCHEDULE = [
  { day: 'Mon', date: '26 May', isToday: true, appointments: 4 },
  { day: 'Tue', date: '27 May', isToday: false, appointments: 3 },
  { day: 'Wed', date: '28 May', isToday: false, appointments: 5 },
  { day: 'Thu', date: '29 May', isToday: false, appointments: 2 },
  { day: 'Fri', date: '30 May', isToday: false, appointments: 6 },
  { day: 'Sat', date: '31 May', isToday: false, appointments: 1 },
  { day: 'Sun', date: '01 Jun', isToday: false, appointments: 0 },
];
