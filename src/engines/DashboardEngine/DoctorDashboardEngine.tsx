import React from 'react';
import ProfileCompletionBanner from '../../widgets/ProfileCompletionBanner';
import ClinicSelector from '../../widgets/ClinicSelector';
import AppointmentSummaryCards from '../../widgets/AppointmentSummaryCards';
import TodayAppointmentsList from '../../widgets/TodayAppointmentsList';
import RevenueOverviewWidget from '../../widgets/RevenueOverviewWidget';
import LatestReviewsWidget from '../../widgets/LatestReviewsWidget';
import { MOCK_PROFILE_COMPLETION, MOCK_UPCOMING_SCHEDULE } from '../../mocks/doctorFlowMocks';
import { Plus, UserPlus, FileText, CalendarX2, BarChart2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const quickActions = [
  { icon: UserPlus, label: 'Add Patient', color: 'bg-[#FFF5F2] text-[#FF7F4D]', onClick: '/patients' },
  { icon: FileText, label: 'Create Prescription', color: 'bg-[#FFFBEB] text-[#F2AC4A]', onClick: '/prescriptions' },
  { icon: CalendarX2, label: 'Block Slots', color: 'bg-[#FFF5F2] text-[#FF7F4D]', onClick: '/availability' },
  { icon: BarChart2, label: 'View Reports', color: 'bg-[#FFFBEB] text-[#F2AC4A]', onClick: '/revenue' },
];

const DoctorDashboardEngine = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-5">
      {/* Greeting Header + Clinic Selector + Create Appointment */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#2B2B2B]">Good Morning, Dr. Arjun 👋</h1>
          <p className="text-sm text-[#5F6368] mt-0.5">Here's what's happening with your practice today.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 shrink-0 w-full md:w-auto">
          <ClinicSelector />
          <button
            onClick={() => navigate('/appointments/create')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF7F4D] to-[#F2AC4A] hover:opacity-95 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm shadow-orange-500/10 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Create Appointment
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <AppointmentSummaryCards />

      {/* Profile Completion Banner */}
      <ProfileCompletionBanner completionPercentage={MOCK_PROFILE_COMPLETION.percentage} />

      {/* Main 3-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Today's Appointments — col 5 */}
        <div className="lg:col-span-5 min-h-[420px] w-full">
          <TodayAppointmentsList />
        </div>

        {/* Revenue Overview — col 4 */}
        <div className="lg:col-span-4 min-h-[420px] w-full">
          <RevenueOverviewWidget />
        </div>

        {/* Latest Reviews — col 3 */}
        <div className="lg:col-span-3 min-h-[420px] w-full">
          <LatestReviewsWidget />
        </div>
      </div>

      {/* Bottom row: Upcoming Schedule + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Upcoming Schedule */}
        <div className="lg:col-span-7 w-full">
          <div className="bg-white border border-[#DEDFE0] rounded-2xl shadow-sm p-5">
            <h3 className="text-base font-bold text-[#2B2B2B] mb-4">Upcoming Schedule</h3>
            <div className="flex overflow-x-auto lg:grid lg:grid-cols-7 gap-2 pb-2 lg:pb-0" style={{ scrollbarWidth: 'none' }}>
              {MOCK_UPCOMING_SCHEDULE.map((day) => (
                <button
                  key={day.day}
                  className={`flex flex-col items-center p-2.5 rounded-xl transition-all shrink-0 min-w-[56px] lg:min-w-0 ${
                    day.isToday
                      ? 'bg-gradient-to-br from-[#FF7F4D] to-[#F2AC4A] text-white shadow-sm'
                      : 'hover:bg-slate-50 text-slate-600 border border-transparent hover:border-slate-100'
                  }`}
                >
                  <span className={`text-[11px] font-semibold ${day.isToday ? 'text-[#F8DDBC]' : 'text-slate-400'}`}>
                    {day.day}
                  </span>
                  <span className={`text-sm font-bold mt-0.5 ${day.isToday ? 'text-white' : 'text-[#2B2B2B]'}`}>
                    {day.date}
                  </span>
                  {day.appointments > 0 && (
                    <span className={`text-[10px] font-bold mt-1.5 px-1.5 py-0.5 rounded-full ${
                      day.isToday ? 'bg-white/20 text-white' : 'bg-[#FFF5F2] text-[#FF7F4D]'
                    }`}>
                      {day.appointments}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-5">
            <h3 className="text-base font-bold text-slate-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.onClick)}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-600 text-center leading-tight">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboardEngine;
