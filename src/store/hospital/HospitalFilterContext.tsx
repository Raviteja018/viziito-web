import React, { createContext, useContext, useState, type ReactNode } from 'react';

export type DateFilterType = 'Today' | 'Yesterday' | 'Last 7 Days' | 'Last 30 Days' | 'Current Month' | 'Previous Month' | 'Custom';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface FilterContextType {
  dateFilter: DateFilterType;
  setDateFilter: (filter: DateFilterType) => void;
  customDateRange: DateRange;
  setCustomDateRange: (range: DateRange) => void;
  selectedBranches: string[]; // branch names
  setSelectedBranches: (branches: string[]) => void;
  appointmentType: string;
  setAppointmentType: (type: string) => void;
  selectedDoctor: string;
  setSelectedDoctor: (doctor: string) => void;
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  appointmentStatus: string;
  setAppointmentStatus: (status: string) => void;
  refreshKey: number;
  triggerRefresh: () => void;
  isRefreshing: boolean;
  setIsRefreshing: (refreshing: boolean) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const getTodayDateStr = () => new Date().toISOString().split('T')[0];

export const HospitalFilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dateFilter, setDateFilter] = useState<DateFilterType>('Today');
  const [customDateRange, setCustomDateRange] = useState<DateRange>({
    startDate: getTodayDateStr(),
    endDate: getTodayDateStr(),
  });
  const [selectedBranches, setSelectedBranches] = useState<string[]>(['Jubilee Hills Branch', 'Gachibowli Clinic', 'Kukatpally Center']);
  const [appointmentType, setAppointmentType] = useState<string>('All');
  const [selectedDoctor, setSelectedDoctor] = useState<string>('All');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('All');
  const [appointmentStatus, setAppointmentStatus] = useState<string>('All');
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setRefreshKey(prev => prev + 1);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <FilterContext.Provider value={{
      dateFilter, setDateFilter,
      customDateRange, setCustomDateRange,
      selectedBranches, setSelectedBranches,
      appointmentType, setAppointmentType,
      selectedDoctor, setSelectedDoctor,
      selectedDepartment, setSelectedDepartment,
      appointmentStatus, setAppointmentStatus,
      refreshKey, triggerRefresh,
      isRefreshing, setIsRefreshing
    }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useHospitalFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useHospitalFilters must be used within a HospitalFilterProvider');
  }
  return context;
};
