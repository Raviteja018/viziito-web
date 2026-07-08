import React, { useState, useEffect } from 'react';
import { 
  Check, MoreVertical, CalendarClock, Calendar, Wallet, Star, Video, 
  FileText, ShieldCheck, Megaphone, User, Filter, ChevronLeft, ChevronRight,
  ChevronDown, Calendar as CalendarIcon, ArrowRight, BellRing
} from 'lucide-react';

const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'New Appointment Booked',
    desc: 'A new appointment is booked with Amit Verma on 31 May 2025 at 10:30 AM.',
    time: '5 min ago',
    unread: true,
    icon: CalendarClock,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    category: 'appointments',
    priority: 'high',
    daysAgo: 0
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
    border: 'border-purple-100',
    category: 'appointments',
    priority: 'high',
    daysAgo: 0
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
    border: 'border-teal-100',
    category: 'payments',
    priority: 'normal',
    daysAgo: 0
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
    border: 'border-amber-100',
    category: 'patients',
    priority: 'normal',
    daysAgo: 0
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
    border: 'border-blue-100',
    category: 'appointments',
    priority: 'high',
    daysAgo: 0
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
    border: 'border-rose-100',
    category: 'patients',
    priority: 'normal',
    daysAgo: 0
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
    border: 'border-orange-100',
    category: 'payments',
    priority: 'high',
    daysAgo: 1
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
    border: 'border-indigo-100',
    category: 'system',
    priority: 'high',
    daysAgo: 1
  },
  {
    id: 9,
    title: 'New Feature Released',
    desc: "We've launched a new feature \"AI Prescription Assistant\" to help you.",
    time: 'Yesterday, 02:45 PM',
    unread: false,
    icon: Megaphone,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    category: 'promotions',
    priority: 'normal',
    daysAgo: 1
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
    border: 'border-fuchsia-100',
    category: 'patients',
    priority: 'normal',
    daysAgo: 1
  },
  {
    id: 11,
    title: 'System Alert Notice',
    desc: 'Please update your professional certification before 15 Jun 2025.',
    time: '12 days ago',
    unread: false,
    icon: ShieldCheck,
    color: 'text-rose-500',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    category: 'system',
    priority: 'high',
    daysAgo: 12
  },
  {
    id: 12,
    title: 'Promotional Campaign Update',
    desc: 'Refer another doctor and earn bonus points for premium clinic features.',
    time: '18 days ago',
    unread: false,
    icon: Megaphone,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    category: 'promotions',
    priority: 'normal',
    daysAgo: 18
  }
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter settings
  const [selectedDateRange, setSelectedDateRange] = useState('30days');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // Applied filters state (to filter on Apply Filters button click)
  const [appliedFilters, setAppliedFilters] = useState({
    dateRange: '30days',
    priority: 'all',
    status: 'all'
  });

  // UI state
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Close menus on outside document clicks
  useEffect(() => {
    const handleOutsideClick = () => setActiveMenuId(null);
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  // Action methods
  const handleMarkAllAsRead = () => {
    const unreadExist = notifications.some(n => n.unread);
    if (!unreadExist) {
      showToast('All notifications are already marked as read.', 'info');
      return;
    }
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    showToast('All notifications marked as read successfully.', 'success');
  };

  const handleNotificationClick = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));
  };

  const toggleReadStatus = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: !n.unread } : n));
    const target = notifications.find(n => n.id === id);
    if (target) {
      showToast(`Notification marked as ${target.unread ? 'read' : 'unread'}.`, 'success');
    }
  };

  const handleDeleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast('Notification deleted successfully.', 'info');
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      dateRange: selectedDateRange,
      priority: selectedPriority,
      status: selectedStatus
    });
    setCurrentPage(1);
    showToast('Filters applied successfully.', 'success');
  };

  const handleResetFilters = () => {
    setSelectedDateRange('30days');
    setSelectedPriority('all');
    setSelectedStatus('all');
    setAppliedFilters({
      dateRange: '30days',
      priority: 'all',
      status: 'all'
    });
    setCurrentPage(1);
    showToast('Filters reset to default.', 'info');
  };

  // Filtered list
  const filtered = notifications.filter(n => {
    // 1. Tab filter
    if (activeTab !== 'all' && n.category !== activeTab) return false;

    // 2. Priority filter
    if (appliedFilters.priority !== 'all' && n.priority !== appliedFilters.priority) return false;

    // 3. Status filter
    if (appliedFilters.status === 'unread' && !n.unread) return false;
    if (appliedFilters.status === 'read' && n.unread) return false;

    // 4. Date Range filter
    if (appliedFilters.dateRange === '7days' && n.daysAgo > 7) return false;
    if (appliedFilters.dateRange === '30days' && n.daysAgo > 30) return false;

    return true;
  });

  // Paginated list
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedNotifications = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Dynamic Summary Metrics
  const totalCount = notifications.length;
  const unreadCount = notifications.filter(n => n.unread).length;
  const todayCount = notifications.filter(n => n.daysAgo === 0).length;
  const weekCount = notifications.filter(n => n.daysAgo <= 7).length;
  const monthCount = notifications.filter(n => n.daysAgo <= 30).length;

  const TABS = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'appointments', label: 'Appointments', count: notifications.filter(n => n.category === 'appointments').length },
    { id: 'patients', label: 'Patients', count: notifications.filter(n => n.category === 'patients').length },
    { id: 'payments', label: 'Payments', count: notifications.filter(n => n.category === 'payments').length },
    { id: 'system', label: 'System', count: notifications.filter(n => n.category === 'system').length },
    { id: 'promotions', label: 'Promotions', count: notifications.filter(n => n.category === 'promotions').length },
  ];

  return (
    <div className="w-full animate-fade space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800">Notifications</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Stay updated with important alerts and updates.</p>
        </div>
        {unreadCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-teal-50 border border-teal-100 rounded-xl text-teal-700 text-xs font-bold shrink-0">
            <BellRing className="w-3.5 h-3.5 animate-bounce" />
            <span>{unreadCount} Unread Alerts</span>
          </div>
        )}
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
                  onClick={() => {
                    setActiveTab(tab.id);
                    setCurrentPage(1);
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
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
              <button 
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1.5 text-xs font-bold text-teal-600 hover:text-teal-700 transition-colors cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" /> Mark all as read
              </button>
            </div>
          </div>

          {/* List Container */}
          <div className="bg-white border border-slate-200 rounded-2xl flex flex-col">
            <div className="divide-y divide-slate-100 flex-1">
              {paginatedNotifications.map((notif) => {
                const Icon = notif.icon;
                return (
                  <div 
                    key={notif.id} 
                    onClick={() => handleNotificationClick(notif.id)}
                    className="p-4 sm:p-5 flex items-start gap-4 hover:bg-slate-50/50 transition-colors cursor-pointer group relative"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border shadow-sm ${notif.bg} ${notif.border} ${notif.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-bold ${notif.unread ? 'text-slate-900' : 'text-slate-700'} mb-0.5`}>
                        {notif.title}
                      </h4>
                      <p className={`text-xs ${notif.unread ? 'text-slate-600 font-medium' : 'text-slate-500'} pr-6 leading-relaxed`}>
                        {notif.desc}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0 pt-0.5 relative">
                      <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">{notif.time}</span>
                      
                      <div className="flex items-center gap-2">
                        {notif.unread && (
                          <div className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                        )}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(activeMenuId === notif.id ? null : notif.id);
                          }}
                          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Dropdown Menu */}
                      {activeMenuId === notif.id && (
                        <div 
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 top-7 w-36 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-10 text-left animate-fade border-slate-100"
                        >
                          <button
                            onClick={() => {
                              toggleReadStatus(notif.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                          >
                            Mark as {notif.unread ? 'Read' : 'Unread'}
                          </button>
                          <button
                            onClick={() => {
                              handleDeleteNotification(notif.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors border-t border-slate-100 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {filtered.length === 0 && (
                <div className="p-12 text-center text-sm font-semibold text-slate-400">
                  No notifications match the active filter criteria.
                </div>
              )}
            </div>

            {/* Pagination */}
            {filtered.length > 0 && (
              <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-bold text-slate-500">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} notifications
                </span>
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg font-bold text-xs transition-all cursor-pointer ${
                          currentPage === pageNum
                            ? 'bg-teal-50 text-teal-700'
                            : 'hover:bg-slate-50 text-slate-655'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-655 hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
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
                  <select 
                    value={selectedDateRange}
                    onChange={e => setSelectedDateRange(e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-teal-400 cursor-pointer"
                  >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="all">All Time</option>
                  </select>
                  <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Priority</label>
                <div className="relative">
                  <select 
                    value={selectedPriority}
                    onChange={e => setSelectedPriority(e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-teal-400 cursor-pointer"
                  >
                    <option value="all">All Priority</option>
                    <option value="high">High Priority</option>
                    <option value="normal">Normal Priority</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                <div className="relative">
                  <select 
                    value={selectedStatus}
                    onChange={e => setSelectedStatus(e.target.value)}
                    className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-teal-400 cursor-pointer"
                  >
                    <option value="all">All Status</option>
                    <option value="unread">Unread Only</option>
                    <option value="read">Read Only</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <button 
                  onClick={handleApplyFilters}
                  className="w-full bg-teal-700 hover:bg-teal-800 text-white text-sm font-bold py-2.5 rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  Apply Filters
                </button>
                <button 
                  onClick={handleResetFilters}
                  className="w-full bg-transparent hover:bg-slate-50 text-teal-700 text-xs font-bold py-2 rounded-xl transition-colors cursor-pointer"
                >
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
                <span className="text-sm font-black text-slate-800">{totalCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Unread</span>
                <span className="text-sm font-black text-slate-800 text-teal-600">{unreadCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">Today</span>
                <span className="text-sm font-black text-slate-800">{todayCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">This Week</span>
                <span className="text-sm font-black text-slate-800">{weekCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">This Month</span>
                <span className="text-sm font-black text-slate-800">{monthCount}</span>
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-2">Notification Preferences</h3>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
              Manage how you receive notifications.
            </p>
            <button className="w-full flex items-center justify-between px-4 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer">
              <span className="text-xs font-bold text-slate-700 group-hover:text-teal-700">Manage Preferences</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
            </button>
          </div>

        </div>
      </div>

      {/* Dynamic Toast Notifications */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl animate-fade text-xs font-bold">
          {toast.type === 'success' && <Check className="w-4 h-4 text-teal-400" />}
          <span>{toast.message}</span>
        </div>
      )}

    </div>
  );
}
