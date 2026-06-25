import React from 'react';
import ProfileCompletionBanner from '../../widgets/ProfileCompletionBanner';
import ClinicSelector from '../../widgets/ClinicSelector';
import AppointmentSummaryCards from '../../widgets/AppointmentSummaryCards';
import TodayAppointmentsList from '../../widgets/TodayAppointmentsList';
import RevenueOverviewWidget from '../../widgets/RevenueOverviewWidget';
import LatestReviewsWidget from '../../widgets/LatestReviewsWidget';
import { MOCK_PROFILE_COMPLETION } from '../../mocks/doctorFlowMocks';
import { Plus } from 'lucide-react';

const DashboardEngine = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Banner Section */}
      <ProfileCompletionBanner completionPercentage={MOCK_PROFILE_COMPLETION.percentage} />

      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <ClinicSelector />
        
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm shadow-teal-600/20 transition-all active:scale-95">
          <Plus className="w-5 h-5" />
          Create Appointment
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column - Appointments (Larger) */}
        <div className="lg:col-span-8 space-y-6 flex flex-col">
          <AppointmentSummaryCards />
          
          <div className="flex-1 min-h-[400px]">
            <TodayAppointmentsList />
          </div>
        </div>

        {/* Right Column - Revenue & Reviews */}
        <div className="lg:col-span-4 space-y-6 flex flex-col">
          <div className="h-[280px]">
            <RevenueOverviewWidget />
          </div>
          
          <div className="flex-1 min-h-[300px]">
            <LatestReviewsWidget />
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardEngine;
