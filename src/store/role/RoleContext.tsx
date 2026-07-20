import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { UserRole,  } from '../../components/UserTypeSelection';

interface RoleContextType {
  role: UserRole | 'doctor';
  setRole: (role: UserRole | 'doctor') => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [roleState, setRoleState] = useState<UserRole | 'doctor'>(() => {
    try {
      const storedUser = localStorage.getItem('vizito_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.role && parsed.role !== 'patient') return parsed.role;
      }
    } catch (e) {}
    return 'doctor';
  });

  const setRole = (newRole: UserRole | 'doctor') => {
    const validRole = (newRole as string) === 'patient' ? 'doctor' : newRole;
    setRoleState(validRole);
  };

  const role = (roleState as string) === 'patient' ? 'doctor' : roleState;

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
