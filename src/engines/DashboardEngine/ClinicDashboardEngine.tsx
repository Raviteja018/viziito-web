import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Users, Wallet, Stethoscope, ArrowRight,
  Clock, CheckCircle2, UserPlus, TrendingUp, Activity,
  Plus
} from 'lucide-react';
import { useClinicRole } from '../../store/clinic/ClinicRoleContext';

const ClinicDashboardEngine: React.FC = () => {
  const navigate = useNavigate();
  const { clinicProfile, connectedDoctors, partnerDoctors, appointments } = useClinicRole();

  const today = new Date().toISOString().split('T')[0];

  const todayAppointments = useMemo(
    () => appointments.filter(a => a.date === today),
    [appointments, today]
  );

  const upcomingAppointments = useMemo(
    () => appointments.filter(a => a.date > today && a.status === 'Scheduled').slice(0, 5),
    [appointments, today]
  );

  const completedToday = todayAppointments.filter(a => a.status === 'Completed').length;
  const scheduledToday = todayAppointments.filter(a => a.status === 'Scheduled').length;
  const totalPatients = new Set(appointments.map(a => a.patientName)).size;
  const monthRevenue = appointments
    .filter(a => a.status === 'Completed' && a.date.startsWith(today.slice(0, 7)))
    .reduce((sum, a) => sum + a.fee, 0);

  const incomingRequests = partnerDoctors.filter(d => d.status === 'Incoming').length;

  const statCards = [
    {
      label: "Today's Appointments",
      value: todayAppointments.length,
      sub: `${scheduledToday} scheduled · ${completedToday} done`,
      icon: Calendar,
      color: 'from-[#7C3AED] to-[#5C2494]',
      bg: 'bg-purple-50',
      textColor: 'text-purple-600',
      action: () => navigate('/appointments'),
    },
    {
      label: 'Partner Doctors',
      value: connectedDoctors.length,
      sub: incomingRequests > 0 ? `${incomingRequests} incoming request${incomingRequests > 1 ? 's' : ''}` : 'All active',
      icon: Stethoscope,
      color: 'from-teal-500 to-teal-700',
      bg: 'bg-teal-50',
      textColor: 'text-teal-600',
      action: () => navigate('/clinic-doctors'),
    },
    {
      label: 'Total Patients',
      value: totalPatients,
      sub: 'Unique patients served',
      icon: Users,
      color: 'from-blue-500 to-blue-700',
      bg: 'bg-blue-50',
      textColor: 'text-blue-600',
      action: () => navigate('/patients'),
    },
    {
      label: 'Revenue This Month',
      value: `₹${monthRevenue.toLocaleString('en-IN')}`,
      sub: 'From completed appointments',
      icon: Wallet,
      color: 'from-emerald-500 to-emerald-700',
      bg: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      action: () => navigate('/revenue'),
    },
  ];

  return (
    <div className="space-y-6 font-sans">

      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#5C2494] to-[#7C3AED] rounded-2xl p-5 text-white relative overflow-hidden shadow-lg">
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/5 rounded-full" />
        <div className="absolute -right-2 top-6 w-20 h-20 bg-white/5 rounded-full" />
        <div className="relative z-10">
          <p className="text-[11px] font-bold text-purple-200 uppercase tracking-widest">Clinic Dashboard</p>
          <h1 className="text-2xl font-extrabold mt-1">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {clinicProfile.ownerName.split(' ')[1]} 👋
          </h1>
          <p className="text-sm text-purple-200 mt-1 font-medium">{clinicProfile.clinicName} · {clinicProfile.specialisation.slice(0, 2).join(', ')}</p>
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => navigate('/appointments/create')}
              className="flex items-center gap-2 bg-white text-[#7C3AED] font-black text-xs px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Book Appointment
            </button>
            <button
              onClick={() => navigate('/clinic-doctors')}
              className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer border border-white/20"
            >
              <UserPlus className="w-4 h-4" /> Add Partner Doctor
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <button
            key={card.label}
            onClick={card.action}
            className="bg-white border border-slate-200 rounded-2xl p-4 text-left shadow-sm hover:shadow-md hover:border-purple-200 transition-all cursor-pointer group"
          >
            <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
              <card.icon className={`w-5 h-5 ${card.textColor}`} />
            </div>
            <p className="text-xl font-extrabold text-slate-900 leading-tight">{card.value}</p>
            <p className="text-[10px] font-black text-slate-500 mt-0.5">{card.label}</p>
            <p className="text-[9px] font-semibold text-slate-400 mt-1">{card.sub}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-500" /> Upcoming Appointments
            </h2>
            <button onClick={() => navigate('/appointments')} className="text-[10px] font-black text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer">
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2.5">
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs font-bold">No upcoming appointments scheduled.</div>
            ) : (
              upcomingAppointments.map(appt => (
                <div key={appt.id} className="flex items-center justify-between gap-3 border border-slate-100 rounded-xl p-3 hover:bg-slate-50/50 transition-all">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-purple-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black text-slate-800 truncate">{appt.patientName}</p>
                      <p className="text-[10px] font-bold text-slate-500 truncate">{appt.doctorName} · {appt.specialisation}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] font-black text-slate-700">{new Date(appt.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                    <p className="text-[9px] font-bold text-slate-400">{appt.timeSlot}</p>
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded mt-0.5 inline-block ${appt.type === 'Video Call' ? 'bg-blue-50 text-blue-600' : 'bg-teal-50 text-teal-600'}`}>
                      {appt.type}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Partner Doctors Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-teal-500" /> Partner Doctors
            </h2>
            <button onClick={() => navigate('/clinic-doctors')} className="text-[10px] font-black text-[#7C3AED] hover:underline flex items-center gap-1 cursor-pointer">
              Manage <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex-1 space-y-2.5 overflow-y-auto">
            {connectedDoctors.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs font-bold">No partner doctors yet.</div>
            ) : (
              connectedDoctors.map(doc => {
                const todayCount = appointments.filter(a => a.date === today && a.doctorName === doc.name).length;
                return (
                  <div key={doc.id} className="flex items-center gap-3 border border-slate-100 rounded-xl p-3 hover:bg-slate-50/50 transition-all">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shrink-0">
                      <span className="text-white text-[10px] font-black">
                        {doc.name.split(' ').slice(1).map((w: string) => w[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-black text-slate-800 truncate">{doc.name}</p>
                      <p className="text-[10px] font-bold text-slate-400">{doc.specialisation}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-base font-extrabold text-slate-700">{todayCount}</p>
                      <p className="text-[8px] font-bold text-slate-400">today</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {incomingRequests > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-100">
              <button
                onClick={() => navigate('/clinic-doctors')}
                className="w-full flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 py-2 rounded-xl text-xs font-black cursor-pointer hover:bg-amber-100 transition-all"
              >
                <Clock className="w-3.5 h-3.5" /> {incomingRequests} Pending Request{incomingRequests > 1 ? 's' : ''}
              </button>
            </div>
          )}
        </div>

      </div>

      {/* Today's Schedule */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-500" /> Today's Schedule
          </h2>
          <span className="text-[10px] font-bold text-slate-400">{new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</span>
        </div>
        {todayAppointments.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs font-bold">No appointments scheduled for today.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {todayAppointments.map(appt => (
              <div key={appt.id} className="border border-slate-150 rounded-xl p-3 flex items-center gap-3">
                <div className={`w-2 h-full min-h-[36px] rounded-full shrink-0 ${
                  appt.status === 'Completed' ? 'bg-emerald-400' :
                  appt.status === 'Cancelled' ? 'bg-rose-400' :
                  'bg-[#7C3AED]'
                }`} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-slate-800 truncate">{appt.patientName}</p>
                  <p className="text-[10px] font-bold text-slate-500 truncate">{appt.doctorName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[9px] font-bold text-slate-400">{appt.timeSlot}</span>
                    <span className={`text-[8px] font-black px-1 py-0.5 rounded ${
                      appt.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                      appt.status === 'Cancelled' ? 'bg-rose-50 text-rose-600' :
                      'bg-purple-50 text-purple-600'
                    }`}>{appt.status}</span>
                  </div>
                </div>
                <p className="text-xs font-black text-slate-700 shrink-0">₹{appt.fee}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default ClinicDashboardEngine;
