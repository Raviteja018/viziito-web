import React, { useState } from 'react';
import { 
  Check, MoreVertical, CalendarClock, Calendar, Wallet, Star, Video, 
  FileText, ShieldCheck, Megaphone, User, Filter, ChevronLeft, ChevronRight,
  ChevronDown, Calendar as CalendarIcon, ArrowRight
} from 'lucide-react';

const NOTIFICATIONS = [
  {
    id: 1,
    title: 'New Appointment Booked',
    desc: 'A new appointment is booked with Amit Verma on 31 May 2025 at 10:30 AM.',
    time: '5 min ago',
    unread: true,
    icon: CalendarClock,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100'
  },
  {
    id: 2,
    title: 'Appointment Reminder',
    desc: 'You have an upcoming appointment with Priya Singh today at 04:15 PM.',
    time: '1 hour ago',
    unread: true,
    icon: Calendar,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    border: 'border-purple-100'
  },
  {
    id: 3,
    title: 'Payment Received',
    desc: 'Payment of ₹800 received for appointment with Rajesh Kumar.',
    time: '2 hours ago',
    unread: true,
    icon: Wallet,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    border: 'border-teal-100'
  },
  {
    id: 4,
    title: 'New Review Received',
    desc: 'Priya Singh left a 5-star review for your consultation.',
    time: '3 hours ago',
    unread: true,
    icon: Star,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100'
  },
  {
    id: 5,
    title: 'Video Consultation Starting Soon',
    desc: 'Your video consultation with Neha Patel will start in 10 minutes.',
    time: '4 hours ago',
    unread: false,
    icon: Video,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    border: 'border-blue-100'
  },
  {
    id: 6,
    title: 'New Prescription Added',
    desc: 'A prescription has been added for Amit Verma.',
    time: '5 hours ago',
    unread: false,
    icon: FileText,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    border: 'border-rose-100'
  },
  {
    id: 7,
    title: 'Payout Initiated',
    desc: 'Your payout of ₹15,600 has been initiated. Reference ID: PAYOUT_250528.',
    time: 'Yesterday, 08:30 PM',
    unread: false,
    icon: Wallet,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    border: 'border-orange-100'
  },
  {
    id: 8,
    title: 'System Update',
    desc: 'Scheduled maintenance on 2 Jun 2025 from 01:00 AM to 03:00 AM.',
    time: 'Yesterday, 06:15 PM',
    unread: false,
    icon: ShieldCheck,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50',
    border: 'border-indigo-100'
  },
  {
    id: 9,
    title: 'New Feature Released',
    desc: 'We\'ve launched a new feature "AI Prescription Assistant" to help you.',
    time: 'Yesterday, 02:45 PM',
    unread: false,
    icon: Megaphone,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100'
  },
  {
    id: 10,
    title: 'New Patient Registered',
    desc: 'Rohit Mehta has registered and booked an appointment with you.',
    time: 'Yesterday, 11:20 AM',
    unread: false,
    icon: User,
    color: 'text-fuchsia-500',
    bg: 'bg-fuchsia-50',
    border: 'border-fuchsia-100'
  }
];

const TABS = [
  { id: 'all', label: 'All', count: 32 },
  { id: 'appointments', label: 'Appointments', count: 12 },
  { id: 'patients', label: 'Patients', count: 6 },
  { id: 'payments', label: 'Payments', count: 5 },
  { id: 'system', label: 'System', count: 7 },
  { id: 'promotions', label: 'Promotions', count: 2 },
];

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="w-full animate-fade space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Notifications</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Stay updated with important alerts and updates.</p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 items-start">
        
        {/* Left Column: Main List */}
        <div className="flex-1 w-full space-y-4">
          
          {/* Top Actions Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0" style={{ scrollbarWidth: 'none' }}>
              {TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-teal-700 text-white shadow-sm'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button className="flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors">
                <Check className="w-3.5 h-3.5" /> Mark all as read
              </button>
              <button className="p-1.5 text-slate-400 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-lg transition-all">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List Container */}
          <div className="bg-white border border-slate-200 rounded-2xl flex flex-col">
            <div className="divide-y divide-slate-100 flex-1">
              {NOTIFICATIONS.map((notif) => {
                const Icon = notif.icon;
                return (
                  <div key={notif.id} className="p-4 sm:p-5 flex items-start gap-4 hover:bg-slate-50/50 transition-colors cursor-pointer group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${notif.bg} ${notif.border} ${notif.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-bold ${notif.unread ? 'text-slate-900' : 'text-slate-700'} mb-0.5`}>
                        {notif.title}
                      </h4>
                      <p className={`text-xs ${notif.unread ? 'text-slate-600 font-medium' : 'text-slate-500'} pr-2 leading-relaxed`}>
                        {notif.desc}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0 pt-0.5">
                      <span className="text-[11px] font-bold text-slate-400">{notif.time}</span>
                      {notif.unread && (
                        <div className="w-2 h-2 rounded-full bg-teal-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-500">Showing 1 to 10 of 32 notifications</span>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /></button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-teal-50 text-teal-700 font-bold">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 font-bold">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 font-bold">3</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600 font-bold">4</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar */}
        <div className="w-full xl:w-80 shrink-0 space-y-6">
          
          {/* Filter Notifications */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="w-4 h-4 text-slate-400" />
              <h3 className="text-sm font-bold text-slate-800">Filter Notifications</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date Range</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-teal-400">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                  </select>
                  <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Priority</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-teal-400">
                    <option>All Priority</option>
                    <option>High Priority</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-teal-400">
                    <option>All Status</option>
                    <option>Unread</option>
                    <option>Read</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button className="w-full bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold py-2.5 rounded-xl transition-colors shadow-sm">
                  Apply Filters
                </button>
                <button className="w-full bg-transparent hover:bg-slate-50 text-teal-700 text-xs font-bold py-2 rounded-xl transition-colors">
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Notification Summary */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-5">Notification Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Total Notifications</span>
                <span className="text-sm font-black text-slate-800">32</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Unread</span>
                <span className="text-sm font-black text-slate-800">6</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Today</span>
                <span className="text-sm font-black text-slate-800">8</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">This Week</span>
                <span className="text-sm font-black text-slate-800">22</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">This Month</span>
                <span className="text-sm font-black text-slate-800">32</span>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-2">Notification Preferences</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
              Manage how you receive notifications.
            </p>
            <button className="w-full flex items-center justify-between px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group">
              <span className="text-xs font-bold text-slate-700 group-hover:text-teal-700">Manage Preferences</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
