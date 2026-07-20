import React, { createContext, useContext, useState, type ReactNode } from 'react';
import {
  type ClinicProfile,
  type PartnerDoctor,
  type ClinicAppointment,
  MOCK_CLINIC_PROFILE,
  MOCK_PARTNER_DOCTORS,
  MOCK_CLINIC_APPOINTMENTS,
} from '../../mocks/clinicMocks';

interface ClinicRoleContextType {
  clinicProfile: ClinicProfile;
  updateClinicProfile: (profile: Partial<ClinicProfile>) => void;
  partnerDoctors: PartnerDoctor[];
  addPartnerDoctor: (doctor: PartnerDoctor) => void;
  updatePartnerDoctor: (doctor: PartnerDoctor) => void;
  removePartnerDoctor: (id: string) => void;
  appointments: ClinicAppointment[];
  setAppointments: React.Dispatch<React.SetStateAction<ClinicAppointment[]>>;
  connectedDoctors: PartnerDoctor[];
}

const ClinicRoleContext = createContext<ClinicRoleContextType | undefined>(undefined);

const load = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const ClinicRoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [clinicProfile, setClinicProfile] = useState<ClinicProfile>(() =>
    load('vizito_clinic_profile', MOCK_CLINIC_PROFILE)
  );

  const [partnerDoctors, setPartnerDoctors] = useState<PartnerDoctor[]>(() =>
    load('vizito_clinic_partners', MOCK_PARTNER_DOCTORS)
  );

  const [appointments, setAppointments] = useState<ClinicAppointment[]>(() =>
    load('vizito_clinic_appointments', MOCK_CLINIC_APPOINTMENTS)
  );

  const updateClinicProfile = (partial: Partial<ClinicProfile>) => {
    setClinicProfile(prev => {
      const updated = { ...prev, ...partial };
      localStorage.setItem('vizito_clinic_profile', JSON.stringify(updated));
      return updated;
    });
  };

  const persist = (updated: PartnerDoctor[]) => {
    setPartnerDoctors(updated);
    localStorage.setItem('vizito_clinic_partners', JSON.stringify(updated));
  };

  const addPartnerDoctor = (doctor: PartnerDoctor) => persist([...partnerDoctors, doctor]);

  const updatePartnerDoctor = (doctor: PartnerDoctor) =>
    persist(partnerDoctors.map(d => (d.id === doctor.id ? doctor : d)));

  const removePartnerDoctor = (id: string) => persist(partnerDoctors.filter(d => d.id !== id));

  const connectedDoctors = partnerDoctors.filter(d => d.status === 'Connected');

  return (
    <ClinicRoleContext.Provider
      value={{
        clinicProfile,
        updateClinicProfile,
        partnerDoctors,
        addPartnerDoctor,
        updatePartnerDoctor,
        removePartnerDoctor,
        appointments,
        setAppointments,
        connectedDoctors,
      }}
    >
      {children}
    </ClinicRoleContext.Provider>
  );
};

export const useClinicRole = (): ClinicRoleContextType => {
  const ctx = useContext(ClinicRoleContext);
  if (!ctx) throw new Error('useClinicRole must be used within a ClinicRoleProvider');
  return ctx;
};
