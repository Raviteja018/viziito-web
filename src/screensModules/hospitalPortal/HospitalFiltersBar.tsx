import React, { useState, useEffect } from 'react';
import { RefreshCw, Calendar, ChevronDown, Check, X, AlertCircle } from 'lucide-react';
import { useHospitalFilters, type DateFilterType } from '../../store/hospital/HospitalFilterContext';
import { useHospitalRole } from '../../store/hospital/HospitalRoleContext';
import { MOCK_BRANCHES, MOCK_DEPARTMENTS, MOCK_DOCTORS } from '../../mocks/hospitalMocks';

export const HospitalFiltersBar: React.FC = () => {
  const { role } = useHospitalRole();
  const {
    dateFilter, setDateFilter,
    customDateRange, setCustomDateRange,
    selectedBranches, setSelectedBranches,
    appointmentType, setAppointmentType,
    selectedDoctor, setSelectedDoctor,
    selectedDepartment, setSelectedDepartment,
    appointmentStatus, setAppointmentStatus,
    refreshKey, triggerRefresh,
    isRefreshing
  } = useHospitalFilters();

  const [showCustomDate, setShowCustomDate] = useState(false);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [dateError, setDateError] = useState<string | null>(null);

  // Active branches, departments, and doctors
  const activeBranches = MOCK_BRANCHES.filter(b => b.status === 'Active');
  const activeDepartments = MOCK_DEPARTMENTS.filter(d => d.status === 'Active');
  const activeDoctors = MOCK_DOCTORS; // We filter out deleted if mock has status, but currently they are all active

  useEffect(() => {
    if (dateFilter === 'Custom') {
      setShowCustomDate(true);
    } else {
      setShowCustomDate(false);
      setDateError(null);
    }
  }, [dateFilter]);

  const handleDateFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value as DateFilterType;
    setDateFilter(val);
  };

  const handleCustomDateChange = (type: 'start' | 'end', val: string) => {
    const nextRange = { ...customDateRange };
    if (type === 'start') {
      nextRange.startDate = val;
    } else {
      nextRange.endDate = val;
    }
    setCustomDateRange(nextRange);

    // Validation
    const start = new Date(nextRange.startDate);
    const end = new Date(nextRange.endDate);

    if (start > end) {
      setDateError('Start Date must be before or equal to End Date.');
    } else {
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 365) {
        setDateError('Maximum date range is 365 days.');
      } else {
        setDateError(null);
      }
    }
  };

  const toggleBranchSelection = (branchName: string) => {
    if (selectedBranches.includes(branchName)) {
      if (selectedBranches.length > 1) {
        setSelectedBranches(selectedBranches.filter(b => b !== branchName));
      }
    } else {
      setSelectedBranches([...selectedBranches, branchName]);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-3 flex-1">
          
          {/* Date Selector */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Date Range</label>
            <div className="relative">
              <select
                value={dateFilter}
                onChange={handleDateFilterChange}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-medium rounded-xl py-2.5 pl-3 pr-8 appearance-none focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
              >
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Last 7 Days">Last 7 Days</option>
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Current Month">Current Month</option>
                <option value="Previous Month">Previous Month</option>
                <option value="Custom">Custom Range</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Branch Filter (Admin Only) */}
          {role === 'admin' ? (
            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Branch</label>
              <button
                type="button"
                onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-medium rounded-xl py-2.5 px-3 flex items-center justify-between hover:bg-slate-100 transition-all text-left focus:outline-none"
              >
                <span className="truncate">
                  {selectedBranches.length === activeBranches.length
                    ? 'All Branches'
                    : selectedBranches.length === 1
                    ? selectedBranches[0]
                    : `${selectedBranches.length} Branches`}
                </span>
                <ChevronDown className="w-4 h-4 text-slate-400 ml-1 shrink-0" />
              </button>
              
              {showBranchDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowBranchDropdown(false)} />
                  <div className="absolute left-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-20 py-2">
                    <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Select Branches</span>
                      <button
                        onClick={() => setSelectedBranches(activeBranches.map(b => b.name))}
                        className="text-[11px] text-[#7C3AED] font-bold hover:underline"
                      >
                        Reset All
                      </button>
                    </div>
                    <div className="max-h-48 overflow-y-auto py-1">
                      {activeBranches.map(branch => {
                        const isSelected = selectedBranches.includes(branch.name);
                        return (
                          <button
                            key={branch.id}
                            onClick={() => toggleBranchSelection(branch.name)}
                            className="w-full px-3 py-2 text-[13px] text-slate-700 flex items-center justify-between hover:bg-[#FAF5FF] transition-all text-left"
                          >
                            <span>{branch.name}</span>
                            {isSelected && <Check className="w-4 h-4 text-[#7C3AED]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Branch</label>
              <div className="w-full bg-slate-100 border border-slate-200 text-slate-500 text-[13px] font-semibold rounded-xl py-2.5 px-3 cursor-not-allowed truncate">
                {selectedBranches[0] || 'Assigned Branch'}
              </div>
            </div>
          )}

          {/* Department Filter */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Department</label>
            <div className="relative">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-medium rounded-xl py-2.5 pl-3 pr-8 appearance-none focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
              >
                <option value="All">All Departments</option>
                {activeDepartments.map(dept => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Doctor Filter (Admin/Staff dependant) */}
          {role === 'admin' ? (
            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Doctor</label>
              <div className="relative">
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-medium rounded-xl py-2.5 pl-3 pr-8 appearance-none focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
                >
                  <option value="All">All Doctors</option>
                  {activeDoctors.map(doc => (
                    <option key={doc.id} value={doc.name}>{doc.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Doctor</label>
              <div className="relative">
                <select
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-medium rounded-xl py-2.5 pl-3 pr-8 appearance-none focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
                >
                  <option value="All">All Doctors</option>
                  {activeDoctors.filter(d => d.branches.includes(selectedBranches[0])).map(doc => (
                    <option key={doc.id} value={doc.name}>{doc.name}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>
          )}

          {/* Appointment Type */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Appt Type</label>
            <div className="relative">
              <select
                value={appointmentType}
                onChange={(e) => setAppointmentType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-medium rounded-xl py-2.5 pl-3 pr-8 appearance-none focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
              >
                <option value="All">All Types</option>
                <option value="Online">Online</option>
                <option value="In-Person">In-Person</option>
                <option value="Hospital Visit">Hospital Visit</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Appointment Status */}
          <div className="relative">
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status</label>
            <div className="relative">
              <select
                value={appointmentStatus}
                onChange={(e) => setAppointmentStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-[13px] font-medium rounded-xl py-2.5 pl-3 pr-8 appearance-none focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED] transition-all"
              >
                <option value="All">All Statuses</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Checked-In">Checked-In</option>
                <option value="No Show">No Show</option>
                <option value="Rescheduled">Rescheduled</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

        </div>

        {/* Refresh Action */}
        <div className="flex items-end self-stretch lg:self-end">
          <button
            onClick={triggerRefresh}
            disabled={isRefreshing || !!dateError}
            className={`w-full lg:w-auto px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-[13px] font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm`}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Custom Date Inputs (when DateFilter is Custom) */}
      {showCustomDate && (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 flex flex-col md:flex-row md:items-center gap-4 transition-all duration-300">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4.5 h-4.5 text-[#7C3AED]" />
            <span className="text-[13px] font-semibold text-slate-700">Custom Range Selection:</span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 max-w-lg">
            <div className="w-full">
              <input
                type="date"
                value={customDateRange.startDate}
                onChange={(e) => handleCustomDateChange('start', e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-700 text-[13px] rounded-lg p-2 focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
            <span className="text-[13px] text-slate-400 font-bold shrink-0">to</span>
            <div className="w-full">
              <input
                type="date"
                value={customDateRange.endDate}
                onChange={(e) => handleCustomDateChange('end', e.target.value)}
                className="w-full bg-white border border-slate-200 text-slate-700 text-[13px] rounded-lg p-2 focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
          </div>
          {dateError && (
            <div className="flex items-center gap-1.5 text-rose-500 text-[12px] font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{dateError}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
