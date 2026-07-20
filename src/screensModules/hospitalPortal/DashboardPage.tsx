import React, { useState, useEffect } from 'react';
import { useHospitalRole } from '../../store/hospital/HospitalRoleContext';
import { useHospitalFilters } from '../../store/hospital/HospitalFilterContext';
import { HospitalFiltersBar } from './HospitalFiltersBar';
import {
  MOCK_APPOINTMENTS,
  MOCK_DOCTORS,
  MOCK_DEPARTMENTS,
  MOCK_BRANCHES,
  MOCK_ACTIVITIES,
  MOCK_INTEGRATION_REQUESTS,
  type Appointment,
  type AssociatedDoctor
} from '../../mocks/hospitalMocks';
import {
  Calendar, Users, Building2, ClipboardList, Wallet,
  FileText, Clock, PlusCircle, RefreshCw, ChevronRight,
  Activity, ShieldCheck, UserPlus, CheckCircle2, ChevronDown
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { role, assignedBranch, staffList } = useHospitalRole();
  const filters = useHospitalFilters();

  const [loading, setLoading] = useState(true);
  const [chartInterval, setChartInterval] = useState<'Last 7 Days' | 'Last 30 Days' | 'Month' | 'Year'>('Last 7 Days');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; val: number; label: string } | null>(null);

  // Local storage lists
  const [appointmentsList] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('vizito_appointments');
    return saved ? JSON.parse(saved) : MOCK_APPOINTMENTS;
  });

  const [doctorsList] = useState<AssociatedDoctor[]>(() => {
    const saved = localStorage.getItem('vizito_doctors');
    return saved ? JSON.parse(saved) : MOCK_DOCTORS;
  });

  // Simulate loading state on refresh
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [filters.refreshKey]);

  const todayStr = new Date().toISOString().split('T')[0];

  // Filters logic
  const getFilteredAppointments = () => {
    return appointmentsList.filter(apt => {
      // 1. Branch filter: if receptionist, lock to assigned branch. Otherwise check selectedBranches
      if (role === 'receptionist') {
        if (apt.branchName !== assignedBranch) return false;
      } else {
        if (!filters.selectedBranches.includes(apt.branchName)) return false;
      }

      // 2. Date filter
      if (filters.dateFilter === 'Today') {
        if (apt.date !== todayStr) return false;
      } else if (filters.dateFilter === 'Yesterday') {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (apt.date !== yesterday) return false;
      } else if (filters.dateFilter === 'Last 7 Days') {
        const sevenDaysAgo = new Date(Date.now() - 7 * 86400000);
        if (new Date(apt.date) < sevenDaysAgo || new Date(apt.date) > new Date()) return false;
      } else if (filters.dateFilter === 'Last 30 Days') {
        const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
        if (new Date(apt.date) < thirtyDaysAgo || new Date(apt.date) > new Date()) return false;
      } else if (filters.dateFilter === 'Custom') {
        const start = new Date(filters.customDateRange.startDate);
        const end = new Date(filters.customDateRange.endDate);
        const aptDate = new Date(apt.date);
        if (aptDate < start || aptDate > end) return false;
      }

      // 3. Doctor filter
      if (filters.selectedDoctor !== 'All' && apt.doctorName !== filters.selectedDoctor) {
        return false;
      }

      // 4. Department filter
      if (filters.selectedDepartment !== 'All' && apt.department !== filters.selectedDepartment) {
        return false;
      }

      // 5. Appointment Type filter
      if (filters.appointmentType !== 'All' && apt.type !== filters.appointmentType) {
        return false;
      }

      // 6. Appointment Status filter
      if (filters.appointmentStatus !== 'All' && apt.status !== filters.appointmentStatus) {
        return false;
      }

      return true;
    });
  };

  const filteredAppts = getFilteredAppointments();

  // Metrics count
  const todayApptsCount = filteredAppts.filter(apt => apt.date === todayStr).length;
  const upcomingApptsCount = filteredAppts.filter(apt => apt.date > todayStr && apt.status !== 'Cancelled').length;

  const displayDoctorsCount = role === 'receptionist'
    ? doctorsList.filter(d => d.branches.includes(assignedBranch)).length
    : doctorsList.length;

  const displayDeptsCount = MOCK_DEPARTMENTS.filter(d => d.status === 'Active').length;
  const displayBranchesCount = MOCK_BRANCHES.filter(b => b.status === 'Active').length;
  const displayStaffCount = staffList.filter(s => s.status === 'Active').length;
  
  // Simulated requests counts
  const pendingRequestsCount = 2; 
  const pendingIntegrationsCount = MOCK_INTEGRATION_REQUESTS.filter(r => r.status === 'Pending').length;

  // SVG Trend Chart Data
  const chartData: Record<string, { labels: string[], values: number[] }> = {
    'Last 7 Days': { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], values: [18, 24, 15, 32, 28, 12, 8] },
    'Last 30 Days': { labels: ['W1', 'W2', 'W3', 'W4'], values: [112, 145, 122, 168] },
    'Month': { labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], values: [310, 340, 390, 350, 420, 410, 460, 430, 490, 480, 520, 580] },
    'Year': { labels: ['2023', '2024', '2025', '2026'], values: [3800, 4500, 5400, 6800] }
  };

  const activeChart = chartData[chartInterval];
  const chartHeight = 220;
  const chartWidth = 600;
  const maxChartValue = Math.max(...activeChart.values) || 10;

  const points = activeChart.values.map((val, idx) => {
    const x = (idx / (activeChart.values.length - 1)) * (chartWidth - 60) + 30;
    const y = chartHeight - (val / maxChartValue) * (chartHeight - 60) - 30;
    return { x, y, val, label: activeChart.labels[idx] };
  });

  const pathD = points.reduce((acc, p, idx) => {
    return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const fillD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - 30} L ${points[0].x} ${chartHeight - 30} Z`
    : '';

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 space-y-6">
      
      {/* Hospital Name Banner Card */}
      <div className="relative bg-gradient-to-r from-[#7C3AED] via-indigo-600 to-violet-600 rounded-3xl p-6 shadow-sm overflow-hidden text-white mb-6">
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-white/5 rounded-full blur-lg pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shrink-0">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight leading-tight">
                City Care Hospital
              </h1>
              <p className="text-xs font-semibold text-white/80 mt-1 flex items-center gap-1.5">
                <span>Hospital Portal Control Center</span>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-emerald-300 font-bold">Active System Session</span>
              </p>
            </div>
          </div>
          
          <div className="shrink-0 flex items-center gap-2">
            <span className="bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] font-black tracking-wider uppercase px-3.5 py-2 rounded-xl shadow-2xs">
              {role === 'admin' ? 'Hospital Admin' : `Receptionist (${assignedBranch})`}
            </span>
          </div>
        </div>
      </div>

      {/* Global Filter Bar (Hospital Name, Branch Selector, Date Filter, Refresh Button) */}
      <HospitalFiltersBar />

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="bg-white border border-slate-100 p-5 rounded-2xl animate-pulse space-y-3">
                <div className="w-8 h-8 bg-slate-100 rounded-lg" />
                <div className="h-4 bg-slate-100 w-1/2 rounded" />
                <div className="h-6 bg-slate-100 w-3/4 rounded" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5 h-80 animate-pulse" />
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Summary Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Today's Appointments */}
            <div
              onClick={() => {
                filters.setDateFilter('Today');
                filters.triggerRefresh();
              }}
              className="bg-white border border-slate-100 hover:border-[#7C3AED]/20 hover:shadow-sm cursor-pointer transition-all duration-350 rounded-2xl p-5"
            >
              <div className="w-9 h-9 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center mb-3">
                <Calendar className="w-4.5 h-4.5" />
              </div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Today's Appointments</span>
              <span className="block text-2xl font-black text-slate-900 mt-1">{todayApptsCount}</span>
              <span className="block text-[10px] text-slate-400 font-semibold mt-1.5">Scheduled today</span>
            </div>

            {/* Card 2: Upcoming Appointments */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5">
              <div className="w-9 h-9 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center mb-3">
                <Clock className="w-4.5 h-4.5" />
              </div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Upcoming Appointments</span>
              <span className="block text-2xl font-black text-slate-900 mt-1">{upcomingApptsCount}</span>
              <span className="block text-[10px] text-slate-400 font-semibold mt-1.5">Scheduled after today</span>
            </div>

            {/* Card 3: Doctors */}
            <div
              onClick={() => navigate('/doctors')}
              className="bg-white border border-slate-100 hover:border-[#7C3AED]/20 hover:shadow-sm cursor-pointer transition-all duration-350 rounded-2xl p-5"
            >
              <div className="w-9 h-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-3">
                <Users className="w-4.5 h-4.5" />
              </div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Doctors</span>
              <span className="block text-2xl font-black text-slate-900 mt-1">{displayDoctorsCount}</span>
              <span className="block text-[10px] text-slate-400 font-semibold mt-1.5">
                {role === 'admin' ? 'Total associated doctors' : 'Available in branch'}
              </span>
            </div>

            {/* Card 4: Departments */}
            <div
              onClick={() => navigate('/hospital-departments')}
              className="bg-white border border-slate-100 hover:border-[#7C3AED]/20 hover:shadow-sm cursor-pointer transition-all duration-350 rounded-2xl p-5"
            >
              <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-3">
                <ClipboardList className="w-4.5 h-4.5" />
              </div>
              <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Departments</span>
              <span className="block text-2xl font-black text-slate-900 mt-1">{displayDeptsCount}</span>
              <span className="block text-[10px] text-slate-400 font-semibold mt-1.5">Active organizational units</span>
            </div>

            {/* Admin-Only Metrics */}
            {role === 'admin' && (
              <>
                {/* Card 5: Branches */}
                <div
                  onClick={() => navigate('/branches')}
                  className="bg-white border border-slate-100 hover:border-[#7C3AED]/20 hover:shadow-sm cursor-pointer transition-all duration-350 rounded-2xl p-5"
                >
                  <div className="w-9 h-9 bg-pink-50 text-pink-600 rounded-xl flex items-center justify-center mb-3">
                    <Building2 className="w-4.5 h-4.5" />
                  </div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Branches</span>
                  <span className="block text-2xl font-black text-slate-900 mt-1">{displayBranchesCount}</span>
                  <span className="block text-[10px] text-slate-400 font-semibold mt-1.5">Active branch network</span>
                </div>

                {/* Card 6: Receptionists */}
                <div
                  onClick={() => navigate('/staff')}
                  className="bg-white border border-slate-100 hover:border-[#7C3AED]/20 hover:shadow-sm cursor-pointer transition-all duration-350 rounded-2xl p-5"
                >
                  <div className="w-9 h-9 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-3">
                    <Users className="w-4.5 h-4.5" />
                  </div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Receptionists</span>
                  <span className="block text-2xl font-black text-slate-900 mt-1">{displayStaffCount}</span>
                  <span className="block text-[10px] text-slate-400 font-semibold mt-1.5">Active front office users</span>
                </div>

                {/* Card 7: Pending Doctor Requests */}
                <div
                  onClick={() => navigate('/doctors')}
                  className="bg-white border border-slate-100 hover:border-[#7C3AED]/20 hover:shadow-sm cursor-pointer transition-all duration-350 rounded-2xl p-5"
                >
                  <div className="w-9 h-9 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-3">
                    <PlusCircle className="w-4.5 h-4.5" />
                  </div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Doctor Requests</span>
                  <span className="block text-2xl font-black text-rose-600 mt-1">{pendingRequestsCount}</span>
                  <span className="block text-[10px] text-rose-450 font-semibold mt-1.5">Click to review requests</span>
                </div>

                {/* Card 8: Pending Integration Requests */}
                <div
                  onClick={() => navigate('/integrations/pharmacy')}
                  className="bg-white border border-slate-100 hover:border-[#7C3AED]/20 hover:shadow-sm cursor-pointer transition-all duration-350 rounded-2xl p-5"
                >
                  <div className="w-9 h-9 bg-teal-50 text-teal-650 rounded-xl flex items-center justify-center mb-3">
                    <ShieldCheck className="w-4.5 h-4.5" />
                  </div>
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Integrations</span>
                  <span className="block text-2xl font-black text-slate-900 mt-1">{pendingIntegrationsCount}</span>
                  <span className="block text-[10px] text-slate-400 font-semibold mt-1.5">Pharmacy, Lab, and Ambulance</span>
                </div>
              </>
            )}

          </div>

          {/* Appointment Trend Chart Component */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Appointment Trend</h3>
                <p className="text-[11px] text-slate-400">Total appointments scheduled over time</p>
              </div>
              <div className="flex bg-slate-100 p-0.5 rounded-lg text-[10px] font-bold text-slate-400">
                {['Last 7 Days', 'Last 30 Days', 'Month', 'Year'].map(opt => (
                  <button
                    key={opt}
                    onClick={() => setChartInterval(opt as any)}
                    className={`px-3 py-1.5 rounded-md transition-all ${chartInterval === opt ? 'bg-white text-[#7C3AED] shadow-xs' : 'hover:text-slate-700'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto overflow-visible text-[#7C3AED]">
                <defs>
                  <linearGradient id="chartGradient2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y Axis Grid lines */}
                {[0, 1, 2, 3, 4].map(i => {
                  const y = chartHeight - 30 - (i / 4) * (chartHeight - 60);
                  const label = Math.round((i / 4) * maxChartValue);
                  return (
                    <g key={i} className="opacity-40">
                      <line x1="30" y1={y} x2={chartWidth - 30} y2={y} stroke="#E2E8F0" strokeDasharray="3 3" />
                      <text x="15" y={y + 4} textAnchor="end" className="text-[9px] fill-slate-400 font-bold">{label}</text>
                    </g>
                  );
                })}

                {/* Shaded Area */}
                {fillD && <path d={fillD} fill="url(#chartGradient2)" />}

                {/* Line Path */}
                {pathD && <path d={pathD} fill="none" stroke="currentColor" strokeWidth="2" />}

                {/* Point Circles */}
                {points.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    className="fill-white stroke-[#7C3AED] stroke-2 hover:r-6 hover:fill-[#7C3AED] cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHoveredPoint({ x: p.x, y: p.y - 12, val: p.val, label: p.label })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}

                {/* X Axis Labels */}
                {points.map((p, idx) => (
                  <text
                    key={idx}
                    x={p.x}
                    y={chartHeight - 10}
                    textAnchor="middle"
                    className="text-[9px] fill-slate-400 font-bold"
                  >
                    {p.label}
                  </text>
                ))}
              </svg>

              {hoveredPoint && (
                <div
                  className="absolute bg-slate-900 text-white rounded-lg px-2.5 py-1 text-[10px] font-bold shadow-md pointer-events-none transform -translate-x-1/2 -translate-y-full"
                  style={{
                    left: `${(hoveredPoint.x / chartWidth) * 100}%`,
                    top: `${(hoveredPoint.y / chartHeight) * 100}%`
                  }}
                >
                  <span className="block text-[8px] text-slate-300 tracking-wide uppercase font-semibold">{hoveredPoint.label}</span>
                  <span>{hoveredPoint.val} Appointments</span>
                </div>
              )}
            </div>
          </div>

          {/* Today's Schedule Table */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Today's Schedule</h3>
            <p className="text-[11px] text-slate-400 mb-4">Shifts and booking status of doctors assigned to branch locations.</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Doctor</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3">Branch</th>
                    <th className="pb-3">Available Time</th>
                    <th className="pb-3 text-center">Booked Slots</th>
                    <th className="pb-3 text-center">Remaining Slots</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-[13px] text-slate-700">
                  {doctorsList
                    .filter(d => {
                      if (role === 'receptionist') {
                        return d.branches.includes(assignedBranch);
                      }
                      return d.branches.some(b => filters.selectedBranches.includes(b));
                    })
                    .map(doc => {
                      const totalSlots = 12;
                      const bookedCount = appointmentsList.filter(a => a.doctorName === doc.name && a.date === todayStr).length;
                      const remaining = totalSlots - bookedCount;

                      return (
                        <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3 flex items-center gap-2">
                            <img src={doc.imageUrl || 'https://i.pravatar.cc/150'} alt={doc.name} className="w-7 h-7 rounded-full object-cover border border-slate-100" />
                            <span className="font-bold text-slate-800">{doc.name}</span>
                          </td>
                          <td className="py-3">
                            <span className="bg-slate-100 text-slate-600 text-[11px] font-bold px-2 py-0.5 rounded-md">
                              {doc.departments[0]}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className="text-slate-500 font-medium text-[12px]">{doc.branches[0]}</span>
                          </td>
                          <td className="py-3 font-semibold text-slate-500">
                            09:00 AM - 01:00 PM
                          </td>
                          <td className="py-3 text-center font-bold text-slate-600">
                            {bookedCount}
                          </td>
                          <td className="py-3 text-center font-bold text-slate-800">
                            {remaining}
                          </td>
                          <td className="py-3">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              doc.availabilityStatus === 'Available Today'
                                ? 'bg-emerald-50 text-emerald-600'
                                : doc.availabilityStatus === 'On Leave'
                                ? 'bg-amber-50 text-amber-600'
                                : 'bg-rose-50 text-rose-600'
                            }`}>
                              {doc.availabilityStatus}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activities (Audit Log) */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Recent Activities</h3>
            <p className="text-[11px] text-slate-400 mb-4">Latest operational events logged inside the hospital portal.</p>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {MOCK_ACTIVITIES.slice(0, 20).map(act => (
                <div key={act.id} className="flex gap-3 hover:bg-slate-50/50 p-2 rounded-xl transition-all">
                  <div className="mt-0.5">
                    <div className="w-7 h-7 bg-slate-50 text-slate-500 border border-slate-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-3.5 h-3.5" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[12.5px] font-semibold text-slate-700 leading-normal">{act.text}</p>
                    <span className="text-[10px] text-slate-400 font-bold block mt-0.5">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-1">Quick Actions</h3>
            <p className="text-[11px] text-slate-400 mb-6">Shortcuts to common tasks based on permission roles.</p>

            {role === 'admin' ? (
              /* Admin Quick Actions */
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                <button
                  onClick={() => navigate('/branches')}
                  className="p-3 bg-slate-50 hover:bg-[#FAF5FF] hover:text-[#7C3AED] border border-slate-200/50 hover:border-[#F3E8FF] rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
                >
                  <PlusCircle className="w-5 h-5 text-slate-400 group-hover:text-[#7C3AED] mb-1.5" />
                  <span className="text-[10px] font-black">Add Branch</span>
                </button>

                <button
                  onClick={() => navigate('/hospital-departments')}
                  className="p-3 bg-slate-50 hover:bg-[#FAF5FF] hover:text-[#7C3AED] border border-slate-200/50 hover:border-[#F3E8FF] rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
                >
                  <PlusCircle className="w-5 h-5 text-slate-400 group-hover:text-[#7C3AED] mb-1.5" />
                  <span className="text-[10px] font-black">Add Dept</span>
                </button>

                <button
                  onClick={() => navigate('/staff')}
                  className="p-3 bg-slate-50 hover:bg-[#FAF5FF] hover:text-[#7C3AED] border border-slate-200/50 hover:border-[#F3E8FF] rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
                >
                  <PlusCircle className="w-5 h-5 text-slate-400 group-hover:text-[#7C3AED] mb-1.5" />
                  <span className="text-[10px] font-black">Add Staff</span>
                </button>

                <button
                  onClick={() => navigate('/doctors')}
                  className="p-3 bg-slate-50 hover:bg-[#FAF5FF] hover:text-[#7C3AED] border border-slate-200/50 hover:border-[#F3E8FF] rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
                >
                  <UserPlus className="w-5 h-5 text-slate-400 group-hover:text-[#7C3AED] mb-1.5" />
                  <span className="text-[10px] font-black">Request Doctor</span>
                </button>

                <button
                  onClick={() => navigate('/availability')}
                  className="p-3 bg-slate-50 hover:bg-[#FAF5FF] hover:text-[#7C3AED] border border-slate-200/50 hover:border-[#F3E8FF] rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
                >
                  <Clock className="w-5 h-5 text-slate-400 group-hover:text-[#7C3AED] mb-1.5" />
                  <span className="text-[10px] font-black">Schedules</span>
                </button>

                <button
                  onClick={() => navigate('/integrations/pharmacy')}
                  className="p-3 bg-slate-50 hover:bg-[#FAF5FF] hover:text-[#7C3AED] border border-slate-200/50 hover:border-[#F3E8FF] rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
                >
                  <ShieldCheck className="w-5 h-5 text-slate-400 group-hover:text-[#7C3AED] mb-1.5" />
                  <span className="text-[10px] font-black">Connect Pharmacy</span>
                </button>

                <button
                  onClick={() => navigate('/integrations/laboratory')}
                  className="p-3 bg-slate-50 hover:bg-[#FAF5FF] hover:text-[#7C3AED] border border-slate-200/50 hover:border-[#F3E8FF] rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
                >
                  <ShieldCheck className="w-5 h-5 text-slate-400 group-hover:text-[#7C3AED] mb-1.5" />
                  <span className="text-[10px] font-black">Connect Lab</span>
                </button>

                <button
                  onClick={() => navigate('/integrations/ambulance')}
                  className="p-3 bg-slate-50 hover:bg-[#FAF5FF] hover:text-[#7C3AED] border border-slate-200/50 hover:border-[#F3E8FF] rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
                >
                  <ShieldCheck className="w-5 h-5 text-slate-400 group-hover:text-[#7C3AED] mb-1.5" />
                  <span className="text-[10px] font-black">Connect Ambulance</span>
                </button>
              </div>
            ) : (
              /* Receptionist Quick Actions */
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => navigate('/patients')}
                  className="p-3.5 bg-slate-50 hover:bg-[#FAF5FF] hover:text-[#7C3AED] border border-slate-200/50 hover:border-[#F3E8FF] rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
                >
                  <UserPlus className="w-5 h-5 text-slate-400 group-hover:text-[#7C3AED] mb-1.5" />
                  <span className="text-[11px] font-black">Register Patient</span>
                </button>

                <button
                  onClick={() => navigate('/appointments/create')}
                  className="p-3.5 bg-slate-50 hover:bg-[#FAF5FF] hover:text-[#7C3AED] border border-slate-200/50 hover:border-[#F3E8FF] rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
                >
                  <Calendar className="w-5 h-5 text-slate-400 group-hover:text-[#7C3AED] mb-1.5" />
                  <span className="text-[11px] font-black">Book Appointment</span>
                </button>

                <button
                  onClick={() => navigate('/patients')}
                  className="p-3.5 bg-slate-50 hover:bg-[#FAF5FF] hover:text-[#7C3AED] border border-slate-200/50 hover:border-[#F3E8FF] rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
                >
                  <Users className="w-5 h-5 text-slate-400 group-hover:text-[#7C3AED] mb-1.5" />
                  <span className="text-[11px] font-black">Search Patient</span>
                </button>

                <button
                  onClick={() => {
                    filters.setDateFilter('Today');
                    filters.triggerRefresh();
                  }}
                  className="p-3.5 bg-slate-50 hover:bg-[#FAF5FF] hover:text-[#7C3AED] border border-slate-200/50 hover:border-[#F3E8FF] rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
                >
                  <Calendar className="w-5 h-5 text-slate-400 group-hover:text-[#7C3AED] mb-1.5" />
                  <span className="text-[11px] font-black">View Today's Appts</span>
                </button>
              </div>
            )}
          </div>

          {/* Empty State Overlay if filters reduce appointments to zero */}
          {filteredAppts.length === 0 && (
            <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center shadow-xs">
              <Calendar className="w-12 h-12 text-slate-250 mx-auto mb-3" />
              <h4 className="text-sm font-bold text-slate-800 mb-1">No appointments scheduled.</h4>
              <button
                onClick={() => navigate('/appointments/create')}
                className="mt-2 px-4.5 py-2.5 bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#7C3AED] text-[12px] font-bold rounded-xl transition-all cursor-pointer"
              >
                Book Appointment
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
