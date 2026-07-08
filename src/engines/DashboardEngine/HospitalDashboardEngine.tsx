import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, Users, Clock, DollarSign, TrendingUp, ChevronDown, 
  MapPin, AlertCircle, CheckCircle2, FileText, Ban, UserPlus, 
  ChevronRight, CalendarDays
} from 'lucide-react';

export const HospitalDashboardEngine = () => {
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState('Today, 14 May 2025');
  const [locationFilter, setLocationFilter] = useState('All Locations');
  
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showLocDropdown, setShowLocDropdown] = useState(false);

  // Sparkline data coordinates
  const sparklineData1 = "M0 18 Q10 8 20 14 T40 4 T60 16 T80 10 T100 2";
  const sparklineData2 = "M0 16 Q10 12 20 18 T40 10 T60 6 T80 14 T100 4";
  const sparklineData3 = "M0 14 Q10 16 20 10 T40 12 T60 4 T80 18 T100 8";
  const sparklineData4 = "M0 18 Q10 6 20 12 T40 14 T60 8 T80 10 T100 2";

  // Data matching the mockup
  const upcomingAppointments = [
    { time: '09:00 AM', patient: 'Rahul Verma', doctor: 'Dr. Priya Sharma', dept: 'Cardiology', type: 'In-Person', status: 'Scheduled' },
    { time: '09:30 AM', patient: 'Sneha Patel', doctor: 'Dr. Amit Singh', dept: 'Dermatology', type: 'In-Person', status: 'Scheduled' },
    { time: '10:00 AM', patient: 'Karan Mehta', doctor: 'Dr. Neha Gupta', dept: 'Orthopedics', type: 'In-Person', status: 'Scheduled' },
    { time: '10:30 AM', patient: 'Anjali Desai', doctor: 'Dr. Priya Sharma', dept: 'Cardiology', type: 'Online', status: 'Scheduled' },
    { time: '11:00 AM', patient: 'Vivek Joshi', doctor: 'Dr. Amit Singh', dept: 'Dermatology', type: 'In-Person', status: 'Scheduled' },
  ];

  const doctorAvailability = [
    { name: 'Dr. Priya Sharma', dept: 'Cardiology', type: 'In-Person', status: 'Available' },
    { name: 'Dr. Amit Singh', dept: 'Dermatology', type: 'In-Person', status: 'Available' },
    { name: 'Dr. Neha Gupta', dept: 'Orthopedics', type: 'In-Person', status: 'Available' },
    { name: 'Dr. Rohit Verma', dept: 'Pediatrics', type: 'In-Person', status: 'On Leave' },
    { name: 'Dr. Seema Iyer', dept: 'Gynecology', type: 'In-Person', status: 'Available' },
  ];

  const recentActivities = [
    { text: 'New appointment booked', detail: 'Rahul Verma with Dr. Priya Sharma', time: '5 mins ago', icon: Calendar, color: 'text-blue-500 bg-blue-50' },
    { text: 'Doctor accepted availability', detail: 'Dr. Amit Singh accepted availability', time: '20 mins ago', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50' },
    { text: 'New staff added', detail: 'Nurse Pooja Sharma has been added', time: '1 hr ago', icon: UserPlus, color: 'text-orange-500 bg-orange-50' },
    { text: 'Payment received', detail: '₹2,500 received from Rahul Verma', time: '2 hrs ago', icon: DollarSign, color: 'text-emerald-500 bg-emerald-50' },
    { text: 'Appointment cancelled', detail: 'Anjali Desai cancelled appointment', time: '3 hrs ago', icon: Ban, color: 'text-rose-500 bg-rose-50' },
  ];

  const topDepartments = [
    { name: 'Cardiology', appointments: 325, revenue: '₹4,25,000' },
    { name: 'Dermatology', appointments: 280, revenue: '₹2,85,000' },
    { name: 'Orthopedics', appointments: 210, revenue: '₹2,15,000' },
    { name: 'Pediatrics', appointments: 190, revenue: '₹1,65,000' },
    { name: 'Gynecology', appointments: 175, revenue: '₹1,25,000' },
  ];

  return (
    <div className="space-y-6 animate-fade pb-10">
      
      {/* ─── GREETING HEADER ROW ───────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-sm">
        
        {/* Abstract shapes behind */}
        <div className="absolute top-0 right-0 w-80 h-full opacity-5 pointer-events-none bg-gradient-to-l from-orange-400 to-transparent" />

        <div className="space-y-4 z-10">
          <div>
            <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              Good Morning, Hospital Admin! 👋
            </h1>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              Here's what's happening at City Care Hospital today.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Date filter dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowDateDropdown(!showDateDropdown)}
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 transition-colors"
              >
                <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                {dateFilter}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>
              {showDateDropdown && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setShowDateDropdown(false)} />
                  <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-200 shadow-xl rounded-xl py-1 z-30 animate-fade">
                    {['Today, 14 May 2025', 'Tomorrow, 15 May 2025', 'Yesterday, 13 May 2025'].map(d => (
                      <button 
                        key={d} 
                        onClick={() => { setDateFilter(d); setShowDateDropdown(false); }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-[#FFF2ED] hover:text-[#FF7F4D] transition-colors"
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Location filter dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowLocDropdown(!showLocDropdown)}
                className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {locationFilter}
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>
              {showLocDropdown && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setShowLocDropdown(false)} />
                  <div className="absolute left-0 mt-1.5 w-48 bg-white border border-slate-200 shadow-xl rounded-xl py-1 z-30 animate-fade">
                    {['All Locations', 'Block A - OPD', 'Block B - ICU', 'Block C - Emergency'].map(l => (
                      <button 
                        key={l} 
                        onClick={() => { setLocationFilter(l); setShowLocDropdown(false); }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-[#FFF2ED] hover:text-[#FF7F4D] transition-colors"
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Hospital Vector Illustration matching mockup */}
        <div className="relative w-72 h-32 md:h-36 shrink-0 z-10 flex items-end justify-center select-none">
          <svg viewBox="0 0 280 140" className="w-full h-full">
            {/* Sun/Light Glow */}
            <circle cx="210" cy="40" r="28" fill="#FFF2ED" opacity="0.8" />
            <circle cx="210" cy="40" r="16" fill="#FFE5DB" opacity="0.5" />
            
            {/* Background Clouds */}
            <path d="M40 70 a10 10 0 0 1 18 -4 a15 15 0 0 1 26 4 z" fill="#F1F5F9" opacity="0.7" />
            <path d="M230 65 a8 8 0 0 1 14 -3 a12 12 0 0 1 20 3 z" fill="#F1F5F9" opacity="0.6" />

            {/* Background Trees */}
            <path d="M30 115 C30 100, 42 100, 42 115 Z" fill="#E2E8F0" />
            <circle cx="230" cy="98" r="16" fill="#FCE7F3" opacity="0.4" />
            <circle cx="230" cy="98" r="12" fill="#FFE4E6" opacity="0.3" />
            <circle cx="48" cy="106" r="10" fill="#FEF3C7" opacity="0.4" />

            {/* Hospital Building Base structure */}
            <rect x="70" y="50" width="130" height="65" rx="6" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            <rect x="95" y="32" width="80" height="83" rx="8" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1.5" />
            
            {/* Hospital Red Cross Logo */}
            <circle cx="135" cy="50" r="10" fill="#FF7F4D" />
            <rect x="132" y="45" width="6" height="10" rx="1" fill="#FFFFFF" />
            <rect x="130" y="47" width="10" height="6" rx="1" fill="#FFFFFF" />

            {/* Windows grids */}
            <rect x="80" y="65" width="10" height="10" rx="2" fill="#FFE5DB" />
            <rect x="180" y="65" width="10" height="10" rx="2" fill="#FFE5DB" />
            <rect x="80" y="85" width="10" height="10" rx="2" fill="#FFF2ED" />
            <rect x="180" y="85" width="10" height="10" rx="2" fill="#FFF2ED" />

            <rect x="110" y="70" width="14" height="12" rx="2" fill="#F8FAFC" stroke="#E2E8F0" />
            <rect x="150" y="70" width="14" height="12" rx="2" fill="#F8FAFC" stroke="#E2E8F0" />
            
            {/* Entry Glass Doors */}
            <path d="M125 115 L125 102 C125 99, 145 99, 145 102 L145 115 Z" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />

            {/* Ground / Street */}
            <line x1="10" y1="115" x2="270" y2="115" stroke="#E2E8F0" strokeWidth="2.5" strokeLinecap="round" />

            {/* Ambulance Van */}
            <g transform="translate(15, 0)">
              {/* Wheels */}
              <circle cx="160" cy="115" r="5" fill="#475569" />
              <circle cx="180" cy="115" r="5" fill="#475569" />
              {/* Body */}
              <rect x="145" y="93" width="45" height="20" rx="3" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" />
              <path d="M172 93 L188 93 C189 93, 190 94, 190 96 L188 105 L172 105 Z" fill="#FFE5DB" />
              {/* Details */}
              <rect x="155" y="99" width="10" height="8" rx="1" fill="#FF7F4D" opacity="0.9" />
              {/* Siren */}
              <circle cx="150" cy="91" r="2.5" fill="#EF4444" />
            </g>

            {/* Decorative Minimal Plants */}
            <circle cx="215" cy="113" r="5" fill="#FED7AA" />
            <circle cx="222" cy="114" r="4" fill="#FDBA74" />
            <circle cx="55" cy="113" r="5" fill="#CBD5E1" />
          </svg>
        </div>
      </div>

      {/* ─── STAT CARDS ROW ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Today's Appointments */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Today's Appointments</span>
              <h3 className="text-3xl font-black text-slate-800">48</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FFF2ED] flex items-center justify-center text-[#FF7F4D] shrink-0 shadow-sm border border-orange-100">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 z-10">
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> ↑ 18% <span className="text-slate-400 font-semibold">from yesterday</span>
            </span>
            {/* Sparkline */}
            <svg className="w-20 h-8 text-[#FF7F4D]" viewBox="0 0 100 20" fill="none">
              <path d={sparklineData1} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 2: Doctors Available */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Doctors Available</span>
              <h3 className="text-3xl font-black text-slate-800">16</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] flex items-center justify-center text-amber-500 shrink-0 shadow-sm border border-amber-100">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 z-10">
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> ↑ 14% <span className="text-slate-400 font-semibold">from yesterday</span>
            </span>
            {/* Sparkline */}
            <svg className="w-20 h-8 text-[#FF7F4D]" viewBox="0 0 100 20" fill="none">
              <path d={sparklineData2} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 3: Staff Available */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Staff Available</span>
              <h3 className="text-3xl font-black text-slate-800">38</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FFF2ED] flex items-center justify-center text-[#FF7F4D] shrink-0 shadow-sm border border-orange-100">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 z-10">
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> ↑ 8% <span className="text-slate-400 font-semibold">from yesterday</span>
            </span>
            {/* Sparkline */}
            <svg className="w-20 h-8 text-[#FF7F4D]" viewBox="0 0 100 20" fill="none">
              <path d={sparklineData3} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

        {/* Card 4: Today's Revenue */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between min-h-[140px] relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Today's Revenue</span>
              <h3 className="text-3xl font-black text-slate-800">₹1,85,450</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#FFFBEB] flex items-center justify-center text-amber-500 shrink-0 shadow-sm border border-amber-100">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4 z-10">
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> ↑ 22% <span className="text-slate-400 font-semibold">from yesterday</span>
            </span>
            {/* Sparkline */}
            <svg className="w-20 h-8 text-[#FF7F4D]" viewBox="0 0 100 20" fill="none">
              <path d={sparklineData4} stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>

      </div>

      {/* ─── MIDDLE CONTENT GRID ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Upcoming Appointments (Spans 5 Cols) */}
        <div className="col-span-12 lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">Upcoming Appointments</h3>
              <button onClick={() => navigate('/appointments')} className="text-xs font-bold text-[#FF7F4D] hover:underline flex items-center gap-0.5">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-550 font-semibold">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase text-[9px] tracking-wider font-extrabold">
                    <th className="pb-2">Time</th>
                    <th className="pb-2">Patient</th>
                    <th className="pb-2">Doctor</th>
                    <th className="pb-2">Department</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {upcomingAppointments.map((app, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 font-bold text-slate-700">{app.time}</td>
                      <td className="py-2.5 font-bold text-slate-800">{app.patient}</td>
                      <td className="py-2.5">{app.doctor}</td>
                      <td className="py-2.5 text-slate-400">{app.dept}</td>
                      <td className="py-2.5">{app.type}</td>
                      <td className="py-2.5 text-right">
                        <span className="bg-blue-50 text-blue-600 rounded-full px-2.5 py-0.5 font-bold text-[10px]">
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-center pt-3 border-t border-slate-100 mt-2">
            <button onClick={() => navigate('/appointments')} className="text-xs font-bold text-[#FF7F4D] hover:underline inline-flex items-center gap-1">
              View all appointments →
            </button>
          </div>
        </div>

        {/* Doctor Availability (Spans 4 Cols) */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">Doctor Availability</h3>
              <button onClick={() => navigate('/availability')} className="text-xs font-bold text-[#FF7F4D] hover:underline flex items-center gap-0.5">
                View all <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-550 font-semibold">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 uppercase text-[9px] tracking-wider font-extrabold">
                    <th className="pb-2">Doctor</th>
                    <th className="pb-2">Department</th>
                    <th className="pb-2">Type</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {doctorAvailability.map((doc, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 font-bold text-slate-800">{doc.name}</td>
                      <td className="py-2.5 text-slate-400">{doc.dept}</td>
                      <td className="py-2.5">{doc.type}</td>
                      <td className="py-2.5 text-right">
                        <span className={`rounded-full px-2.5 py-0.5 font-bold text-[10px] ${
                          doc.status === 'Available' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {doc.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-center pt-3 border-t border-slate-100 mt-2">
            <button onClick={() => navigate('/availability')} className="text-xs font-bold text-[#FF7F4D] hover:underline inline-flex items-center gap-1">
              View all doctors →
            </button>
          </div>
        </div>

        {/* Recent Activities (Spans 3 Cols) */}
        <div className="col-span-12 lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">Recent Activities</h3>
            </div>
            <div className="space-y-4">
              {recentActivities.map((act, idx) => {
                const Icon = act.icon;
                return (
                  <div key={idx} className="flex gap-3">
                    <div className={`w-8 h-8 rounded-lg ${act.color} flex items-center justify-center shrink-0 shadow-xs`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-extrabold text-slate-700 leading-tight">{act.text}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">{act.detail}</p>
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 shrink-0 text-right">{act.time}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="text-center pt-3 border-t border-slate-100 mt-4">
            <button onClick={() => navigate('/notifications')} className="text-xs font-bold text-[#FF7F4D] hover:underline inline-flex items-center gap-1">
              View all activities →
            </button>
          </div>
        </div>

      </div>

      {/* ─── BOTTOM CHARTS GRID ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Revenue Overview Line Chart (Spans 5 Cols) */}
        <div className="col-span-12 lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-base font-bold text-slate-800">Revenue Overview</h3>
            <button className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
              This Month <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
          
          <div className="space-y-1 mb-4">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <div className="flex items-end gap-2">
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">₹12,65,430</h2>
              <span className="text-[11px] font-bold text-emerald-600 flex items-center mb-1 gap-0.5">
                <TrendingUp className="w-3 h-3" /> ↑ 16% <span className="text-slate-400 font-semibold">from last month</span>
              </span>
            </div>
          </div>

          {/* SVG line chart */}
          <div className="w-full relative pt-2">
            <svg viewBox="0 0 240 80" className="w-full h-24" preserveAspectRatio="none">
              <defs>
                <linearGradient id="dashboardRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF7F4D" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#FF7F4D" stopOpacity="0.00" />
                </linearGradient>
              </defs>
              {/* Fill */}
              <path d="M0 68 L10 65 L30 55 L60 62 L90 48 L120 54 L150 42 L180 50 L210 32 L240 20 L240 80 L0 80 Z" fill="url(#dashboardRevenueGrad)" />
              {/* Line */}
              <path d="M0 68 L10 65 L30 55 L60 62 L90 48 L120 54 L150 42 L180 50 L210 32 L240 20" fill="none" stroke="#FF7F4D" strokeWidth="2.5" strokeLinecap="round" />
              {/* Dots at pivots */}
              <circle cx="240" cy="20" r="3.5" fill="#FF7F4D" />
            </svg>
            <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 px-0.5">
              <span>1 May</span>
              <span>5 May</span>
              <span>9 May</span>
              <span>13 May</span>
              <span>17 May</span>
              <span>21 May</span>
              <span>25 May</span>
              <span>31 May</span>
            </div>
          </div>
        </div>

        {/* Appointments Overview Donut (Spans 4 Cols) */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-base font-bold text-slate-800">Appointments Overview</h3>
            <button className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
              This Month <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-6 py-2">
            
            {/* SVG Donut Chart */}
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {/* Background base slice */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F1F5F9" strokeWidth="4.2" />
                {/* Completed - Green: 49% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#34D399" strokeWidth="4.2" strokeDasharray="49 51" strokeDashoffset="0" />
                {/* Scheduled - Yellow: 34% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#FBBF24" strokeWidth="4.2" strokeDasharray="34 66" strokeDashoffset="-49" />
                {/* Cancelled - Rose: 10% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#FB7185" strokeWidth="4.2" strokeDasharray="10 90" strokeDashoffset="-83" />
                {/* No Show - Slate: 7% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#94A3B8" strokeWidth="4.2" strokeDasharray="7 93" strokeDashoffset="-93" />
              </svg>
              {/* Central counter */}
              <div className="absolute text-center">
                <span className="block text-lg font-black text-slate-800 leading-none">1,248</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mt-1 block">Total</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="flex-1 space-y-2 text-xs font-semibold text-slate-550">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#34D399] shrink-0" /> Completed</span>
                <span className="font-bold text-slate-700 text-[11px]">612 (49%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24] shrink-0" /> Scheduled</span>
                <span className="font-bold text-slate-700 text-[11px]">420 (34%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#FB7185] shrink-0" /> Cancelled</span>
                <span className="font-bold text-slate-700 text-[11px]">128 (10%)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#94A3B8] shrink-0" /> No Show</span>
                <span className="font-bold text-slate-700 text-[11px]">88 (7%)</span>
              </div>
            </div>

          </div>
        </div>

        {/* Top Departments Table (Spans 3 Cols) */}
        <div className="col-span-12 lg:col-span-3 bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <h3 className="text-base font-bold text-slate-800">Top Departments</h3>
            <button className="text-xs font-bold text-[#FF7F4D] hover:underline flex items-center gap-0.5">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          
          <table className="w-full text-left text-xs text-slate-550 font-semibold">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase text-[9px] tracking-wider font-extrabold">
                <th className="pb-2">Department</th>
                <th className="pb-2">Appointments</th>
                <th className="pb-2 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {topDepartments.map((dept, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 font-bold text-slate-800">{dept.name}</td>
                  <td className="py-2.5 text-slate-700 font-bold">{dept.appointments}</td>
                  <td className="py-2.5 text-right font-bold text-slate-700">{dept.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};

export default HospitalDashboardEngine;
