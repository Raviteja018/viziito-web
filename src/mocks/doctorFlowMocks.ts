export const MOCK_CLINICS = [
  { id: '1', name: 'Apollo Spectra', type: 'In-Clinic' },
  { id: '2', name: 'City Care Hospital', type: 'In-Clinic' },
  { id: '3', name: 'Dr. Sarah Virtual Clinic', type: 'Online Practice' },
];

export const MOCK_APPOINTMENTS = [
  { id: '1', time: '09:00 AM', patientName: 'Rahul Sharma', type: 'In-Clinic', status: 'Pending', clinicId: '1' },
  { id: '2', time: '10:30 AM', patientName: 'Anita Desai', type: 'Online', status: 'Completed', clinicId: '3' },
  { id: '3', time: '11:15 AM', patientName: 'Vikram Singh', type: 'In-Clinic', status: 'In Progress', clinicId: '2' },
  { id: '4', time: '02:00 PM', patientName: 'Meera Patel', type: 'In-Clinic', status: 'Pending', clinicId: '1' },
];

export const MOCK_REVIEWS = [
  { id: '1', patientName: 'Rahul Sharma', rating: 5, comment: 'Very patient and explained everything clearly. Highly recommended!', date: '2026-06-21' },
  { id: '2', patientName: 'Anita Desai', rating: 4, comment: 'Good consultation, but had to wait for 15 mins.', date: '2026-06-19' },
  { id: '3', patientName: 'Sanjay Kumar', rating: 5, comment: 'Excellent doctor. The prescribed medicines worked perfectly.', date: '2026-06-18' },
];

export const MOCK_REVENUE = {
  totalRevenue: 145000,
  netEarnings: 120500,
  pendingSettlements: 24500,
  trend: '+12.5%',
};

export const MOCK_PROFILE_COMPLETION = {
  percentage: 65,
  steps: [
    { name: 'Personal Information', completed: true },
    { name: 'Professional Information', completed: true },
    { name: 'Clinic Information', completed: true },
    { name: 'KYC Verification', completed: false },
    { name: 'Bank Details', completed: false },
  ]
};
