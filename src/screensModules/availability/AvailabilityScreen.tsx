import React, { useState } from 'react';
import { 
  Calendar, Clock, Ban, SlidersHorizontal, Download, 
  Building2, Monitor, Home, Eye, Edit2, ToggleRight, ToggleLeft, CalendarDays,
  X, ChevronDown, ChevronLeft, ChevronRight, Lock, Unlock
} from 'lucide-react';

const MOCK_AVAILABILITY = [
  {
    id: 1,
    location: 'Clinic 1',
    subLocation: 'Banjara Hills',
    locationIcon: Building2,
    locationColor: 'text-emerald-600',
    locationBg: 'bg-emerald-50',
    type: 'In-Clinic Consultation',
    days: 'Mon, Tue, Wed, Thu, Fri',
    time: '09:00 AM - 01:00 PM',
    duration: '15 mins',
    dateRange: '20 May 2025 - 20 Aug 2025',
    status: 'Active'
  },
  {
    id: 2,
    location: 'Clinic 1',
    subLocation: 'Banjara Hills',
    locationIcon: Building2,
    locationColor: 'text-emerald-600',
    locationBg: 'bg-emerald-50',
    type: 'In-Clinic Consultation',
    days: 'Mon, Tue, Wed, Thu, Fri',
    time: '04:00 PM - 08:00 PM',
    duration: '15 mins',
    dateRange: '20 May 2025 - 20 Aug 2025',
    status: 'Active'
  },
  {
    id: 3,
    location: 'Hospital 1',
    subLocation: 'Ameerpet',
    locationIcon: Building2,
    locationColor: 'text-blue-600',
    locationBg: 'bg-blue-50',
    type: 'In-Clinic Consultation',
    days: 'Mon, Wed, Fri',
    time: '10:00 AM - 02:00 PM',
    duration: '20 mins',
    dateRange: '18 May 2025 - 18 Aug 2025',
    status: 'Active'
  },
  {
    id: 4,
    location: 'Hospital 2',
    subLocation: 'Kukatpally',
    locationIcon: Building2,
    locationColor: 'text-blue-600',
    locationBg: 'bg-blue-50',
    type: 'In-Clinic Consultation',
    days: 'Tue, Thu, Sat',
    time: '11:00 AM - 03:00 PM',
    duration: '20 mins',
    dateRange: '18 May 2025 - 18 Aug 2025',
    status: 'Active'
  },
  {
    id: 5,
    location: 'Online Consultation',
    subLocation: '',
    locationIcon: Monitor,
    locationColor: 'text-purple-600',
    locationBg: 'bg-purple-50',
    type: 'Video Consultation',
    days: 'Mon, Tue, Wed, Thu, Fri',
    time: '05:00 PM - 09:00 PM',
    duration: '15 mins',
    dateRange: '20 May 2025 - 20 Aug 2025',
    status: 'Active'
  },
  {
    id: 6,
    location: 'Home Visit',
    subLocation: 'Hyderabad',
    locationIcon: Home,
    locationColor: 'text-orange-600',
    locationBg: 'bg-orange-50',
    type: 'Home Visit',
    days: 'Mon, Wed, Fri',
    time: '02:00 PM - 06:00 PM',
    duration: '30 mins',
    dateRange: '25 May 2025 - 25 Aug 2025',
    status: 'Inactive'
  }
];

const MOCK_SLOTS = [
  { id: 1, date: '24 May 2025', time: '09:00 AM - 09:15 AM', status: 'Available' },
  { id: 2, date: '24 May 2025', time: '09:15 AM - 09:30 AM', status: 'Booked' },
  { id: 3, date: '24 May 2025', time: '09:30 AM - 09:45 AM', status: 'Blocked' },
  { id: 4, date: '24 May 2025', time: '09:45 AM - 10:00 AM', status: 'Available' }
];

export default function AvailabilityScreen() {
  const [selectedDays, setSelectedDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  return (
    <div className="w-full animate-fade space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800">Availability Management</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Configure your availability across locations and consultation types.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-6 items-start">
        
        {/* Left Column: Main Content */}
        <div className="w-full min-w-0 space-y-6">
          
          {/* Filters & Add Button */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Location</label>
                <div className="relative border border-slate-200 rounded-xl bg-white flex items-center h-10 px-3 cursor-pointer min-w-[160px]">
                  <span className="text-sm font-bold text-slate-700 flex-1">All Locations</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Consultation Type</label>
                <div className="relative border border-slate-200 rounded-xl bg-white flex items-center h-10 px-3 cursor-pointer min-w-[160px]">
                  <span className="text-sm font-bold text-slate-700 flex-1">All Types</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>
              <button className="text-teal-600 font-bold text-sm hover:underline mt-4 sm:mt-0">Reset</button>
            </div>
            <button className="bg-teal-700 hover:bg-teal-800 text-white font-bold py-2.5 px-4 rounded-xl flex items-center gap-2 shadow-sm transition-colors shrink-0">
              <span className="text-lg leading-none">+</span> Add Availability
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
            {/* Total Availabilities */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
                <Calendar className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 mb-0.5">Total Availabilities</p>
                <p className="text-2xl font-black text-slate-800 leading-tight">12</p>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Across all locations</p>
              </div>
            </div>
            
            {/* Total Slot Duration */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 mb-0.5">Total Slot Duration</p>
                <p className="text-2xl font-black text-slate-800 leading-tight">24h 30m</p>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">This Week</p>
              </div>
            </div>

            {/* Consultation Types */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center shrink-0">
                <CalendarDays className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 mb-0.5">Consultation Types</p>
                <p className="text-2xl font-black text-slate-800 leading-tight">4</p>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">Configured</p>
              </div>
            </div>

            {/* Blocked Slots */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center shrink-0">
                <Ban className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 mb-0.5">Blocked Slots</p>
                <p className="text-2xl font-black text-slate-800 leading-tight">8</p>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">This Week</p>
              </div>
            </div>
          </div>

          {/* Actions Row */}
          <div className="flex justify-end gap-2">
            <button className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
              <Download className="w-4 h-4" />
            </button>
          </div>

          {/* Main Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[950px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50">
                    <th className="py-4 px-4 text-xs font-bold text-slate-700">Location</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-700">Consultation Type</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-700">Available Days</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-700">Time</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-700">Duration</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-700">Date Range</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-700">Status</th>
                    <th className="py-4 px-4 text-xs font-bold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_AVAILABILITY.map(row => {
                    const LocIcon = row.locationIcon;
                    return (
                      <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${row.locationBg} ${row.locationColor}`}>
                              <LocIcon className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-800">{row.location}</div>
                              {row.subLocation && <div className="text-[10px] text-slate-400 font-medium">{row.subLocation}</div>}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-xs font-medium text-slate-600 max-w-[120px] leading-tight">{row.type}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-xs font-medium text-slate-600 max-w-[120px] leading-tight">{row.days}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-xs font-medium text-slate-600 max-w-[100px] leading-tight">{row.time}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-xs font-medium text-slate-600">{row.duration}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-xs font-medium text-slate-600 max-w-[100px] leading-tight">{row.dateRange}</div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-1 rounded-md ${
                            row.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2 text-slate-400">
                            <button className="hover:text-teal-600 transition-colors"><Eye className="w-4 h-4" /></button>
                            <button className="hover:text-teal-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                            <button className="hover:text-teal-600 transition-colors">
                              {row.status === 'Active' ? <ToggleRight className="w-5 h-5 text-teal-600" /> : <ToggleLeft className="w-5 h-5" />}
                            </button>
                            <button className="hover:text-teal-600 transition-colors"><CalendarDays className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="p-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Showing 1 to 6 of 6 records</span>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /></button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-teal-50 text-teal-700 font-bold">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Forms */}
        <div className="w-full space-y-6">
          
          {/* Add Availability Form */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Add Availability</h3>
              <button className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1.5">Location <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400">
                      <option>Select Location</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1.5">Consultation Type <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400">
                      <option>Select Consultation Type</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1.5">Available Days <span className="text-red-500">*</span></label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                    <button 
                      key={day}
                      onClick={() => toggleDay(day)}
                      className={`flex-1 min-w-[32px] py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        selectedDays.includes(day) 
                          ? 'bg-teal-700 text-white' 
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1.5">Start Time <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type="text" defaultValue="09:00 AM" className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400" />
                    <Clock className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1.5">End Time <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type="text" defaultValue="01:00 PM" className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400" />
                    <Clock className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1.5">Start Date <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type="text" defaultValue="20 May 2025" className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400" />
                    <CalendarDays className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1.5">End Date <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <input type="text" defaultValue="20 Aug 2025" className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400" />
                    <CalendarDays className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1.5">Slot Duration <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400">
                      <option>15 mins</option>
                      <option>30 mins</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1.5">Status <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400">
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 rounded-xl transition-colors">
                  Cancel
                </button>
                <button className="flex-1 bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold py-2.5 rounded-xl transition-colors shadow-sm">
                  Save Availability
                </button>
              </div>

            </div>
          </div>

          {/* Manage Slots Form */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800">Manage Slots</h3>
              <button className="text-slate-400 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-5 space-y-4">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-700 mb-1.5">Date Selection</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400">
                      <option>Date Range</option>
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1.5">From Date</label>
                  <div className="relative">
                    <input type="text" defaultValue="24 May 2025" className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400" />
                    <CalendarDays className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 mb-1.5">To Date</label>
                  <div className="relative">
                    <input type="text" defaultValue="30 May 2025" className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400" />
                    <CalendarDays className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 items-end">
                <div className="col-span-3">
                  <label className="block text-[10px] font-bold text-slate-700 mb-1.5">Location</label>
                  <div className="relative">
                    <select className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-2 pr-6 py-2 text-[11px] font-semibold text-slate-700 focus:outline-none focus:border-teal-400">
                      <option>Clinic 1</option>
                    </select>
                    <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                <div className="col-span-4 flex items-end gap-2">
                  <div className="flex-1">
                    <label className="block text-[10px] font-bold text-slate-700 mb-1.5 whitespace-nowrap">Consultation Type</label>
                    <div className="relative">
                      <select className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-2 pr-6 py-2 text-[11px] font-semibold text-slate-700 focus:outline-none focus:border-teal-400">
                        <option>In-Clinic Consultation</option>
                      </select>
                      <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <button className="bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-bold h-[34px] px-3 rounded-xl transition-colors shrink-0">
                    Apply
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-800">24 May 2025 - 30 May 2025</span>
                <div className="flex flex-col sm:flex-row items-end gap-2">
                  <div className="relative hidden sm:block">
                    <select className="appearance-none bg-white text-[10px] font-bold text-slate-600 pr-4 pl-1 hover:text-slate-800 cursor-pointer focus:outline-none">
                      <option>Bulk Actions</option>
                    </select>
                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                  </div>
                  <button className="bg-teal-700 hover:bg-teal-800 text-white text-[10px] font-bold py-1.5 px-2.5 rounded-lg transition-colors shrink-0 flex items-center gap-1">
                    <span>+</span> Block / Unblock Slots
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto -mx-5 px-5">
                <table className="w-full text-left border-collapse min-w-[300px]">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="py-3 pr-2 text-[10px] font-bold text-slate-700">Slot Date</th>
                      <th className="py-3 px-2 text-[10px] font-bold text-slate-700">Slot Time</th>
                      <th className="py-3 px-2 text-[10px] font-bold text-slate-700">Status</th>
                      <th className="py-3 pl-2 text-[10px] font-bold text-slate-700 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {MOCK_SLOTS.map(slot => (
                      <tr key={slot.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-3 pr-2 text-[11px] font-semibold text-slate-600">{slot.date}</td>
                        <td className="py-3 px-2 text-[11px] font-semibold text-slate-600 whitespace-nowrap">{slot.time}</td>
                        <td className="py-3 px-2">
                          <span className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${
                            slot.status === 'Available' ? 'bg-emerald-50 text-emerald-600' :
                            slot.status === 'Booked' ? 'bg-blue-50 text-blue-600' :
                            'bg-red-50 text-red-600'
                          }`}>
                            {slot.status}
                          </span>
                        </td>
                        <td className="py-3 pl-2">
                          <div className="flex items-center justify-end gap-1.5 text-slate-400">
                            <button className="hover:text-slate-600 transition-colors">
                              {slot.status === 'Available' ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                            </button>
                            <button className="hover:text-slate-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mini Pagination */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] font-bold text-slate-500">Showing 1 to 4 of 28 slots</span>
                <div className="flex items-center gap-1">
                  <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50"><ChevronLeft className="w-3 h-3" /></button>
                  <button className="w-6 h-6 flex items-center justify-center rounded bg-teal-50 text-teal-700 text-[10px] font-bold">1</button>
                  <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-50 text-slate-600 text-[10px] font-bold">2</button>
                  <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-50 text-slate-600 text-[10px] font-bold">3</button>
                  <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-50 text-slate-600 text-[10px] font-bold">4</button>
                  <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-slate-50 text-slate-600 text-[10px] font-bold">5</button>
                  <button className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 text-slate-600 hover:bg-slate-50"><ChevronRight className="w-3 h-3" /></button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
