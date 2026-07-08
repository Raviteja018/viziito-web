import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createPortal } from 'react-dom';
import { 
  Calendar, Clock, Ban, SlidersHorizontal, Download, 
  Building2, Monitor, Home, Eye, Edit2, ToggleRight, ToggleLeft, CalendarDays,
  X, ChevronDown, ChevronLeft, ChevronRight, Lock, Unlock,
  Plus, Trash2, Check, CheckCircle2, Info, HelpCircle, ArrowRight, AlertCircle, MapPin,
  MoreVertical
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
  // Main state
  const [availabilities, setAvailabilities] = useState(MOCK_AVAILABILITY);
  const [isAdding, setIsAdding] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Form State
  const [locationType, setLocationType] = useState<'Clinic' | 'Hospital'>('Hospital');
  const [hospitalClinic, setHospitalClinic] = useState('');
  const [consultationType, setConsultationType] = useState('');
  const [modeOfConsultation, setModeOfConsultation] = useState('');
  const [selectedDays, setSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [startDate, setStartDate] = useState('20 May 2025');
  const [endDate, setEndDate] = useState('20 Aug 2025');
  const [slotDuration, setSlotDuration] = useState('15 mins');
  const [bufferTime, setBufferTime] = useState('10 mins');
  const [maxPatients, setMaxPatients] = useState('1 Patient');
  const [status, setStatus] = useState('Active');
  const [notes, setNotes] = useState('');

  // Step 2 Time Intervals
  const [applySameToAll, setApplySameToAll] = useState(true);
  const [commonSlots, setCommonSlots] = useState<{ start: string; end: string }[]>([
    { start: '09:00 AM', end: '01:00 PM' },
    { start: '04:00 PM', end: '08:00 PM' }
  ]);
  const [daySlots, setDaySlots] = useState<Record<string, { start: string; end: string }[]>>({
    'Mon': [{ start: '09:00 AM', end: '01:00 PM' }, { start: '04:00 PM', end: '08:00 PM' }],
    'Tue': [{ start: '09:00 AM', end: '01:00 PM' }, { start: '04:00 PM', end: '08:00 PM' }],
    'Wed': [{ start: '09:00 AM', end: '01:00 PM' }, { start: '04:00 PM', end: '08:00 PM' }],
    'Thu': [{ start: '09:00 AM', end: '01:00 PM' }, { start: '04:00 PM', end: '08:00 PM' }],
    'Fri': [{ start: '09:00 AM', end: '01:00 PM' }, { start: '04:00 PM', end: '08:00 PM' }],
    'Sat': [{ start: '10:00 AM', end: '02:00 PM' }],
    'Sun': [{ start: '10:00 AM', end: '02:00 PM' }]
  });

  // Step 4 Request States (Doctor requesting hospital portal access for newly created schedule)
  const [isRequestSubmitted, setIsRequestSubmitted] = useState(false);
  const [requestNotes, setRequestNotes] = useState('');

  // Modal State for hospital request (can't find hospital)
  const [isHospitalRequestOpen, setIsHospitalRequestOpen] = useState(false);

  const hospitalFormik = useFormik({
    initialValues: { name: '', location: '' },
    validationSchema: Yup.object({
      name: Yup.string().required('Hospital name is required'),
      location: Yup.string().required('Location is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      setIsHospitalRequestOpen(false);
      showToast(`Request to register "${values.name}" has been sent to admin!`, 'success');
      setHospitalClinic(values.name);
      resetForm();
    }
  });

  // Exemption request state for existing availability (from dashboard table dropdown actions)
  const [exemptionTargetAv, setExemptionTargetAv] = useState<any | null>(null);
  const [exemptionSlots, setExemptionSlots] = useState<string[]>([]);

  const exemptionFormik = useFormik({
    initialValues: { date: '25 May 2025', reason: '' },
    validationSchema: Yup.object({
      date: Yup.string().required('Date is required'),
      reason: Yup.string().required('Reason is required'),
    }),
    onSubmit: (values, { resetForm }) => {
      if (!exemptionTargetAv || exemptionSlots.length === 0) return;
      setExemptionTargetAv(null);
      showToast(`Exemption request for ${exemptionSlots.length} slots sent to ${exemptionTargetAv.location} admin!`, 'success');
      setExemptionSlots([]);
      resetForm();
    }
  });

  const [activeRowMenuId, setActiveRowMenuId] = useState<number | null>(null);
  const [selectedAvForSlots, setSelectedAvForSlots] = useState<any>(MOCK_AVAILABILITY[0]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [viewDetailsTargetAv, setViewDetailsTargetAv] = useState<any | null>(null);
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('All');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('All');

  const handleResetFilters = () => {
    if (selectedLocationFilter === 'All' && selectedTypeFilter === 'All') {
      showToast('Filters are already cleared.', 'info');
    } else {
      setSelectedLocationFilter('All');
      setSelectedTypeFilter('All');
      showToast('Filters reset successfully!', 'success');
    }
  };

  const handleDownloadCSV = () => {
    if (availabilities.length === 0) {
      showToast('No availability data to export.', 'info');
      return;
    }
    
    // Create CSV content
    const headers = ['Location', 'Sub Location', 'Consultation Type', 'Available Days', 'Time Slots', 'Duration', 'Date Range', 'Status'];
    const rows = availabilities.map(av => [
      `"${av.location}"`,
      `"${av.subLocation || ''}"`,
      `"${av.type}"`,
      `"${av.days}"`,
      `"${av.time}"`,
      `"${av.duration || '15 mins'}"`,
      `"${av.dateRange}"`,
      `"${av.status}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `availability_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Exported availability schedule as CSV!', 'success');
  };

  // Unique lists for filters
  const uniqueLocations = Array.from(new Set(availabilities.map(av => av.location)));
  const uniqueTypes = Array.from(new Set(availabilities.map(av => av.type)));

  const filteredAvailabilities = availabilities.filter(av => {
    const matchesLocation = selectedLocationFilter === 'All' || av.location === selectedLocationFilter;
    const matchesType = selectedTypeFilter === 'All' || av.type === selectedTypeFilter;
    return matchesLocation && matchesType;
  });

  const handleEditAvailability = (av: any) => {
    setEditingId(av.id);
    setLocationType(av.subLocation === 'Hospital' || av.location.toLowerCase().includes('hospital') ? 'Hospital' : 'Clinic');
    setHospitalClinic(av.location);
    setConsultationType(av.type);
    setModeOfConsultation(av.type.toLowerCase().includes('video') ? 'Online/Video' : 'In-Person');
    
    if (av.days) {
      setSelectedDays(av.days.split(', '));
    }
    if (av.dateRange) {
      const dates = av.dateRange.split(' - ');
      setStartDate(dates[0] || '20 May 2025');
      setEndDate(dates[1] || '20 Aug 2025');
    }
    setSlotDuration(av.duration || '15 mins');
    setStatus(av.status || 'Active');
    
    if (av.time) {
      const slotsList = av.time.split(', ').map((t: string) => {
        const parts = t.split(' - ');
        return {
          start: parts[0] || '09:00 AM',
          end: parts[1] || '01:00 PM'
        };
      });
      setCommonSlots(slotsList);
      setApplySameToAll(true);
    }
    
    setIsAdding(true);
    setCurrentStep(1);
  };

  const handleDeleteAvailability = (id: number) => {
    if (window.confirm("Are you sure you want to delete this availability schedule?")) {
      const filtered = availabilities.filter(av => av.id !== id);
      setAvailabilities(filtered);
      if (selectedAvForSlots && selectedAvForSlots.id === id) {
        setSelectedAvForSlots(filtered[0] || null);
      }
      showToast('Availability deleted successfully!', 'success');
    }
  };

  const getSlotsForOverview = (av: any) => {
    if (!av) return [];
    const datePart = av.dateRange ? av.dateRange.split(' - ')[0] : '24 May 2025';
    const times = av.time ? av.time.split(', ') : ['09:00 AM - 01:00 PM'];
    const list: any[] = [];
    let idCounter = 1;
    times.forEach((t: string) => {
      const parts = t.split(' - ');
      const start = parts[0] || '09:00 AM';
      const end = parts[1] || '10:00 AM';
      list.push({ id: idCounter++, date: datePart, time: `${start} - ${start.replace('00', '15').replace('30', '45')}`, status: 'Available' });
      list.push({ id: idCounter++, date: datePart, time: `${start.replace('00', '15').replace('30', '45')} - ${start.replace('00', '30').replace('30', '00')}`, status: 'Booked' });
      list.push({ id: idCounter++, date: datePart, time: `${start.replace('00', '30').replace('30', '00')} - ${end}`, status: 'Blocked' });
    });
    return list.slice(0, 6);
  };

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleAddCommonSlot = () => {
    setCommonSlots([...commonSlots, { start: '09:00 AM', end: '05:00 PM' }]);
  };

  const handleRemoveCommonSlot = (index: number) => {
    setCommonSlots(commonSlots.filter((_, i) => i !== index));
  };

  const handleUpdateCommonSlot = (index: number, field: 'start' | 'end', val: string) => {
    const updated = [...commonSlots];
    updated[index][field] = val;
    setCommonSlots(updated);
  };

  const handleAddDaySlot = (day: string) => {
    const dayIntervals = daySlots[day] || [];
    setDaySlots({
      ...daySlots,
      [day]: [...dayIntervals, { start: '09:00 AM', end: '05:00 PM' }]
    });
  };

  const handleRemoveDaySlot = (day: string, index: number) => {
    const dayIntervals = daySlots[day] || [];
    setDaySlots({
      ...daySlots,
      [day]: dayIntervals.filter((_, i) => i !== index)
    });
  };

  const handleUpdateDaySlot = (day: string, index: number, field: 'start' | 'end', val: string) => {
    const dayIntervals = [...(daySlots[day] || [])];
    dayIntervals[index][field] = val;
    setDaySlots({
      ...daySlots,
      [day]: dayIntervals
    });
  };


  const handleToggleStatus = (id: number) => {
    const updated = availabilities.map(av => {
      if (av.id === id) {
        return { ...av, status: av.status === 'Active' ? 'Inactive' : 'Active' };
      }
      return av;
    });
    setAvailabilities(updated);
    showToast('Availability status updated successfully!', 'success');
  };

  const getCompiledSlotsList = () => {
    const list: string[] = [];
    if (applySameToAll) {
      selectedDays.forEach(day => {
        commonSlots.forEach(s => {
          list.push(`${day}: ${s.start} - ${s.end}`);
        });
      });
    } else {
      selectedDays.forEach(day => {
        (daySlots[day] || []).forEach(s => {
          list.push(`${day}: ${s.start} - ${s.end}`);
        });
      });
    }
    return list;
  };

  // Compile slots list for any existing availability row
  const getSlotsForTarget = (av: any) => {
    if (!av) return [];
    const daysList = av.days.split(', ');
    const timesList = av.time.split(', ');
    const list: string[] = [];
    daysList.forEach((d: string) => {
      timesList.forEach((t: string) => {
        list.push(`${d}: ${t}`);
      });
    });
    return list;
  };

  const handleSaveAvailability = () => {
    // Generate description of times
    let timeStr = '';
    if (applySameToAll) {
      timeStr = commonSlots.map(s => `${s.start} - ${s.end}`).join(', ');
    } else {
      const activeDays = selectedDays.filter(d => daySlots[d] && daySlots[d].length > 0);
      if (activeDays.length > 0) {
        const firstDay = activeDays[0];
        timeStr = `${firstDay}: ${daySlots[firstDay].map(s => `${s.start} - ${s.end}`).join(', ')}...`;
      } else {
        timeStr = 'No time configured';
      }
    }

    const newAv = {
      id: editingId || Date.now(),
      location: locationType === 'Hospital' ? (hospitalClinic || 'Apollo Hospitals') : (hospitalClinic || 'My Clinic'),
      subLocation: locationType === 'Hospital' ? 'Hospital' : 'Clinic Chamber',
      locationIcon: locationType === 'Hospital' ? Building2 : Home,
      locationColor: locationType === 'Hospital' ? 'text-blue-600' : 'text-emerald-600',
      locationBg: locationType === 'Hospital' ? 'bg-blue-50' : 'bg-emerald-50',
      type: consultationType || 'In-Clinic Consultation',
      days: selectedDays.join(', '),
      time: timeStr,
      duration: slotDuration,
      dateRange: `${startDate} - ${endDate}`,
      status: status
    };

    if (editingId) {
      const updated = availabilities.map(av => av.id === editingId ? newAv : av);
      setAvailabilities(updated);
      if (selectedAvForSlots && selectedAvForSlots.id === editingId) {
        setSelectedAvForSlots(newAv);
      }
      showToast('Availability updated successfully!', 'success');
      resetForm();
    } else {
      setAvailabilities([newAv, ...availabilities]);
      showToast('Availability created successfully!', 'success');
      // Proceed immediately to Step 4 "Request Access" to finalize hospital request
      setCurrentStep(4);
      setIsRequestSubmitted(false);
    }
  };

  const handleSubmitAccessRequestToHospital = () => {
    setIsRequestSubmitted(true);
    showToast(`Access request submitted successfully to hospital admin.`, 'success');
  };


  const resetForm = () => {
    setLocationType('Hospital');
    setHospitalClinic('');
    setConsultationType('');
    setModeOfConsultation('');
    setSelectedDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    setStartDate('20 May 2025');
    setEndDate('20 Aug 2025');
    setSlotDuration('15 mins');
    setBufferTime('10 mins');
    setMaxPatients('1 Patient');
    setStatus('Active');
    setNotes('');
    setIsAdding(false);
    setCurrentStep(1);
    setIsRequestSubmitted(false);
    setRequestNotes('');
    setEditingId(null);
  };

  return (
    <div className="w-full animate-fade space-y-6">
      {/* Toast Overlay */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade flex items-center gap-3 bg-slate-900 border border-slate-800 text-white px-5 py-3.5 rounded-2xl shadow-xl max-w-sm">
          <div className="w-2 h-2 rounded-full shrink-0 bg-teal-500" />
          <p className="text-xs font-bold">{toast.message}</p>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewDetailsTargetAv && createPortal(
        (() => {
          const LocIcon = viewDetailsTargetAv.locationIcon || Building2;
          return (
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4"
              onClick={() => setViewDetailsTargetAv(null)}
            >
              <div 
                className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto modal-scrollbar animate-fade text-left"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Availability Schedule Details</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Schedule ID: #{viewDetailsTargetAv.id}</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setViewDetailsTargetAv(null)}
                    className="p-1.5 text-slate-400 hover:bg-slate-50 hover:text-slate-650 rounded-lg transition-all cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Core Information Card */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex gap-4 items-start">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${viewDetailsTargetAv.locationBg} ${viewDetailsTargetAv.locationColor}`}>
                      <LocIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-800 leading-tight">{viewDetailsTargetAv.location}</h4>
                      <p className="text-xs text-slate-500 font-semibold mt-0.5">{viewDetailsTargetAv.subLocation || 'Clinic Chamber'}</p>
                      <span className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md mt-2 ${
                        viewDetailsTargetAv.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-orange-50 text-orange-600 border border-orange-100'
                      }`}>
                        {viewDetailsTargetAv.status}
                      </span>
                    </div>
                  </div>

                  {/* Detail Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[10px] text-slate-450 font-bold uppercase block mb-1">Consultation Type</span>
                      <span className="font-bold text-slate-700">{viewDetailsTargetAv.type}</span>
                    </div>

                    <div className="p-3 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[10px] text-slate-450 font-bold uppercase block mb-1">Date Range</span>
                      <span className="font-bold text-slate-700">{viewDetailsTargetAv.dateRange}</span>
                    </div>

                    <div className="p-3 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[10px] text-slate-450 font-bold uppercase block mb-1">Available Days</span>
                      <span className="font-bold text-slate-700 leading-relaxed">{viewDetailsTargetAv.days}</span>
                    </div>

                    <div className="p-3 bg-white border border-slate-150 rounded-xl">
                      <span className="text-[10px] text-slate-450 font-bold uppercase block mb-1">Slot Duration</span>
                      <span className="font-bold text-slate-700">{viewDetailsTargetAv.duration || '15 mins'}</span>
                    </div>

                    <div className="p-3 bg-white border border-slate-150 rounded-xl sm:col-span-2">
                      <span className="text-[10px] text-slate-450 font-bold uppercase block mb-1">Schedule Time</span>
                      <span className="font-bold text-slate-700">{viewDetailsTargetAv.time}</span>
                    </div>
                  </div>

                  {/* Slots Preview Section */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-800">Generated Slots Preview</h4>
                    <div className="overflow-hidden border border-slate-200 rounded-xl">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="py-2.5 px-3 text-[10px] font-bold text-slate-500 uppercase">Date</th>
                            <th className="py-2.5 px-3 text-[10px] font-bold text-slate-500 uppercase">Slot Time</th>
                            <th className="py-2.5 px-3 text-[10px] font-bold text-slate-500 uppercase text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {getSlotsForOverview(viewDetailsTargetAv).map((slot: any) => (
                            <tr key={slot.id} className="hover:bg-slate-50/30 transition-colors">
                              <td className="py-2.5 px-3 font-semibold text-slate-600">{slot.date}</td>
                              <td className="py-2.5 px-3 font-semibold text-slate-600">{slot.time}</td>
                              <td className="py-2.5 px-3 text-right">
                                <span className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${
                                  slot.status === 'Available' ? 'bg-emerald-50 text-emerald-600' :
                                  slot.status === 'Booked' ? 'bg-blue-50 text-blue-600' :
                                  'bg-rose-50 text-rose-600'
                                }`}>
                                  {slot.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                  <button 
                    type="button" 
                    onClick={() => setViewDetailsTargetAv(null)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-5 rounded-xl cursor-pointer transition-colors"
                  >
                    Close
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      const target = viewDetailsTargetAv;
                      setViewDetailsTargetAv(null);
                      handleEditAvailability(target);
                    }}
                    className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold py-2.5 px-5 rounded-xl cursor-pointer transition-colors shadow-sm flex items-center gap-1.5"
                  >
                    <Edit2 className="w-3.5 h-3.5" /> Edit Schedule
                  </button>
                </div>
              </div>
            </div>
          );
        })(),
        document.body
      )}

      {/* Hospital Request modal */}
      {isHospitalRequestOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form 
            onSubmit={hospitalFormik.handleSubmit}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-fade"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-800">Request New Hospital</h3>
              <button 
                type="button"
                onClick={() => setIsHospitalRequestOpen(false)}
                className="p-1 text-slate-400 hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="py-4 space-y-4 text-xs text-left">
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1.5">Hospital Name *</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={hospitalFormik.values.name}
                  onChange={hospitalFormik.handleChange}
                  placeholder="e.g. Apollo Hospitals, Jubilee Hills" 
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-700 mb-1.5">Location / City *</label>
                <input 
                  type="text" 
                  name="location"
                  required
                  value={hospitalFormik.values.location}
                  onChange={hospitalFormik.handleChange}
                  placeholder="e.g. Hyderabad" 
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400"
                />
              </div>
              <p className="text-[10px] text-slate-400 leading-relaxed">Admin will verify and register the hospital shortly. Once approved, it will appear in your clinic selection list.</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button"
                onClick={() => setIsHospitalRequestOpen(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer"
              >
                Send Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* DASHBOARD LEVEL EXEMPTION REQUEST MODAL (WHEN DOCTOR WANTS TO CANCEL / REQUEST EXEMPTION FOR EXISTING ACTIVE SLOTS) */}
      {exemptionTargetAv && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form 
            onSubmit={exemptionFormik.handleSubmit}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-fade text-left"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Request Exemption / Cancel Slot</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">{exemptionTargetAv.location} ({exemptionTargetAv.type})</p>
              </div>
              <button 
                type="button"
                onClick={() => setExemptionTargetAv(null)}
                className="p-1 text-slate-400 hover:bg-slate-50 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="py-4 space-y-4 text-xs">
              {/* Date selection */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Date of Exemption *</label>
                <div className="relative max-w-xs">
                  <input 
                    type="text" 
                    name="date"
                    required
                    value={exemptionFormik.values.date}
                    onChange={exemptionFormik.handleChange}
                    placeholder="e.g. 25 May 2025" 
                    className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-9 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400"
                  />
                  <CalendarDays className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">Specify the day you are unable to fulfill slots</span>
              </div>

              {/* Slots select checklist */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-2">Select Slots to Cancel / Exempt *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[160px] overflow-y-auto border border-slate-200 rounded-xl bg-white p-3">
                  {getSlotsForTarget(exemptionTargetAv).map((slotLabel: string) => (
                    <label key={slotLabel} className="flex items-center gap-2 py-1.5 px-2 hover:bg-slate-50 rounded-lg cursor-pointer select-none">
                      <input 
                        type="checkbox"
                        checked={exemptionSlots.includes(slotLabel)}
                        onChange={() => {
                          if (exemptionSlots.includes(slotLabel)) {
                            setExemptionSlots(exemptionSlots.filter(s => s !== slotLabel));
                          } else {
                            setExemptionSlots([...exemptionSlots, slotLabel]);
                          }
                        }}
                        className="accent-teal-750 w-3.5 h-3.5 cursor-pointer"
                      />
                      <span className="text-xs font-medium text-slate-700">{slotLabel}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Reason for exemption */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-2">Reason for Unavailability / Cancellation *</label>
                <textarea 
                  name="reason"
                  required
                  value={exemptionFormik.values.reason}
                  onChange={exemptionFormik.handleChange}
                  placeholder="e.g. Surgery schedule conflicts, medical emergency, out of city..."
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400 min-h-[80px]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button" 
                onClick={() => setExemptionTargetAv(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={exemptionSlots.length === 0 || !exemptionFormik.values.reason.trim()}
                className={`text-xs font-bold py-2.5 px-4 rounded-xl cursor-pointer transition-colors ${
                  (exemptionSlots.length === 0 || !exemptionFormik.values.reason.trim())
                    ? 'bg-teal-700/50 text-teal-100 cursor-not-allowed'
                    : 'bg-teal-700 hover:bg-teal-800 text-white'
                }`}
              >
                Submit Exemption Request
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CONDITIONAL RENDERING: LIST VS. ADD WIZARD */}
      {!isAdding ? (
        <>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h1 className="text-2xl font-black text-slate-800">Availability Management</h1>
              <p className="text-sm font-medium text-slate-500 mt-1">Configure your availability across locations and consultation types.</p>
            </div>
            <button 
              onClick={() => {
                setIsAdding(true);
                setCurrentStep(1);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm transition-colors cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" /> Add Availability
            </button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_350px] gap-6 items-start animate-fade">
            {/* Left Column: Main Table */}
            <div className="w-full min-w-0 space-y-6">
              
              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 shadow-sm">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
                    <Calendar className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-emerald-600" />
                  </div>
                  <div className="min-w-0 w-full">
                    <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 mb-0.5 truncate">Total Availabilities</p>
                    <p className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">{availabilities.length}</p>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 mt-0.5 truncate">Across all locations</p>
                  </div>
                </div>
                
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 shadow-sm">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-blue-50 rounded-full flex items-center justify-center shrink-0">
                    <Clock className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div className="min-w-0 w-full">
                    <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 mb-0.5 truncate">Total Slot Duration</p>
                    <p className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">24h 30m</p>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 mt-0.5 truncate">This Week</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 shadow-sm">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-purple-50 rounded-full flex items-center justify-center shrink-0">
                    <CalendarDays className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <div className="min-w-0 w-full">
                    <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 mb-0.5 truncate">Consultation Types</p>
                    <p className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">4</p>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 mt-0.5 truncate">Configured</p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 shadow-sm">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-orange-50 rounded-full flex items-center justify-center shrink-0">
                    <Ban className="w-5.5 h-5.5 sm:w-6 sm:h-6 text-orange-600" />
                  </div>
                  <div className="min-w-0 w-full">
                    <p className="text-[10px] sm:text-[11px] font-bold text-slate-500 mb-0.5 truncate">Blocked Slots</p>
                    <p className="text-xl sm:text-2xl font-black text-slate-800 leading-tight">8</p>
                    <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 mt-0.5 truncate">This Week</p>
                  </div>
                </div>
              </div>

              {/* Toolbar */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <select 
                      value={selectedLocationFilter}
                      onChange={e => setSelectedLocationFilter(e.target.value)}
                      className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-600 focus:outline-none shadow-sm cursor-pointer h-9"
                    >
                      <option value="All">All Locations</option>
                      {uniqueLocations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select 
                      value={selectedTypeFilter}
                      onChange={e => setSelectedTypeFilter(e.target.value)}
                      className="appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-600 focus:outline-none shadow-sm cursor-pointer h-9"
                    >
                      <option value="All">All Consultation Types</option>
                      {uniqueTypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={handleResetFilters}
                    className={`w-9 h-9 flex items-center justify-center border rounded-xl transition-colors shadow-sm cursor-pointer ${
                      (selectedLocationFilter !== 'All' || selectedTypeFilter !== 'All')
                        ? 'bg-teal-50 border-teal-200 text-teal-600 hover:bg-teal-100/70'
                        : 'bg-white border-slate-200 text-slate-400 hover:text-slate-650 hover:bg-slate-50'
                    }`}
                    title="Reset filters"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={handleDownloadCSV}
                    className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-650 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer"
                    title="Export to CSV"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
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
                      {filteredAvailabilities.map(row => {
                        const LocIcon = row.locationIcon || Building2;
                        return (
                          <tr key={row.id} className={`hover:bg-slate-50/50 transition-colors ${selectedAvForSlots?.id === row.id ? 'bg-teal-50/20' : ''}`}>
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
                            <td className="py-4 px-4 relative" onClick={e => e.stopPropagation()}>
                              <div className="flex items-center gap-2 text-slate-400">
                                <button 
                                  onClick={() => {
                                    setViewDetailsTargetAv(row);
                                  }}
                                  className="hover:text-teal-600 hover:bg-teal-50 p-1 rounded transition-colors cursor-pointer animate-fade" 
                                  title="View details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => setActiveRowMenuId(activeRowMenuId === row.id ? null : row.id)}
                                  className="hover:text-slate-700 hover:bg-slate-100 p-1 rounded transition-colors cursor-pointer" 
                                  title="More Actions"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                
                                {activeRowMenuId === row.id && (
                                  <>
                                    <div className="fixed inset-0 z-30" onClick={() => setActiveRowMenuId(null)} />
                                    <div className="absolute right-4 top-full mt-1 w-48 bg-white border border-slate-200 shadow-xl rounded-xl py-1.5 z-40 text-left">
                                      <button
                                        onClick={() => {
                                          setActiveRowMenuId(null);
                                          setViewDetailsTargetAv(row);
                                        }}
                                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors"
                                      >
                                        <Eye className="w-3.5 h-3.5 text-slate-400" /> View Details
                                      </button>

                                      <button
                                        onClick={() => {
                                          setActiveRowMenuId(null);
                                          handleEditAvailability(row);
                                        }}
                                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors border-t border-slate-100 mt-1"
                                      >
                                        <Edit2 className="w-3.5 h-3.5 text-slate-400" /> Edit Availability
                                      </button>
                                      
                                      <button
                                        onClick={() => {
                                          setActiveRowMenuId(null);
                                          handleToggleStatus(row.id);
                                        }}
                                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors border-t border-slate-100 mt-1"
                                      >
                                        {row.status === 'Active' ? (
                                          <>
                                            <ToggleLeft className="w-3.5 h-3.5 text-rose-500" /> Make Inactive
                                          </>
                                        ) : (
                                          <>
                                            <ToggleRight className="w-3.5 h-3.5 text-emerald-500" /> Make Active
                                          </>
                                        )}
                                      </button>

                                      {/* ACTION OPTION TO CANCEL / REQUEST EXEMPTION FOR ACTIVE SLOTS */}
                                      <button
                                        onClick={() => {
                                          setActiveRowMenuId(null);
                                          setExemptionTargetAv(row);
                                          setExemptionSlots([]);
                                          exemptionFormik.setFieldValue('date', '25 May 2025');
                                          exemptionFormik.setFieldValue('reason', '');
                                        }}
                                        className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer transition-colors border-t border-slate-100 mt-1"
                                      >
                                        <Ban className="w-3.5 h-3.5" /> Request Slot Exemption
                                      </button>
                                      
                                      <button
                                        onClick={() => {
                                          setActiveRowMenuId(null);
                                          setSelectedAvForSlots(row);
                                          showToast(`Showing slots for ${row.location}`, 'info');
                                        }}
                                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer transition-colors border-t border-slate-100 mt-1"
                                      >
                                        <CalendarDays className="w-3.5 h-3.5 text-teal-600" /> View Days
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {filteredAvailabilities.length === 0 && (
                        <tr>
                          <td colSpan={8} className="py-12 text-center text-xs font-semibold text-slate-400">
                            No availabilities match the selected filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Showing 1 to {filteredAvailabilities.length} of {filteredAvailabilities.length} records</span>
                  <div className="flex items-center gap-1">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /></button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-teal-50 text-teal-700 font-bold">1</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-655 hover:bg-slate-50"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Manage Slots Card */}
            <div className="w-full space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800">
                    Quick Slots: {selectedAvForSlots ? selectedAvForSlots.location : 'Overview'}
                  </h3>
                </div>
                
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-[10px] font-bold text-slate-755 mb-1.5">Date Range Selection</label>
                      <div className="relative">
                        <select className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400 h-9">
                          <option>Next 7 Days</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-150">
                          <th className="py-2.5 text-[10px] font-bold text-slate-500 uppercase">Date</th>
                          <th className="py-2.5 px-2 text-[10px] font-bold text-slate-500 uppercase">Slot</th>
                          <th className="py-2.5 text-[10px] font-bold text-slate-500 uppercase text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {getSlotsForOverview(selectedAvForSlots).map((slot: any) => (
                          <tr key={slot.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-3 text-[11px] font-semibold text-slate-600">{slot.date}</td>
                            <td className="py-3 px-2 text-[11px] font-semibold text-slate-600 whitespace-nowrap">{slot.time}</td>
                            <td className="py-3 text-right">
                              <span className={`text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${
                                slot.status === 'Available' ? 'bg-emerald-50 text-emerald-600' :
                                slot.status === 'Booked' ? 'bg-blue-50 text-blue-600' :
                                'bg-rose-50 text-rose-600'
                              }`}>
                                {slot.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {getSlotsForOverview(selectedAvForSlots).length === 0 && (
                          <tr>
                            <td colSpan={3} className="py-6 text-center text-xs font-semibold text-slate-400">
                              No slots configured for this availability.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* ADD AVAILABILITY STEP-BY-STEP WIZARD */
        <div className="space-y-6 animate-fade">
          {/* Header */}
          <div className="flex items-center gap-4">
            <button 
              onClick={resetForm}
              className="p-2 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-655 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
             <div>
              <h1 className="text-2xl font-black text-slate-800">{editingId ? 'Edit Availability' : 'Add Availability'}</h1>
              <p className="text-sm font-medium text-slate-500 mt-1">
                {editingId ? 'Update your availability schedule details.' : 'Create your availability schedule and request to a hospital (if required).'}
              </p>
            </div>
          </div>

          {/* Progress Stepper */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm max-w-3xl">
            <div className="flex items-center justify-between">
              {[
                { number: 1, label: 'Availability Details' },
                { number: 2, label: 'Time & Schedule' },
                { number: 3, label: 'Review & Confirm' },
                { number: 4, label: 'Request Access' }
              ].map((step, idx) => (
                <React.Fragment key={step.number}>
                  {idx > 0 && (
                    <div className={`flex-1 h-0.5 mx-4 ${
                      currentStep >= step.number ? 'bg-teal-600' : 'bg-slate-200'
                    }`} />
                  )}
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      currentStep > step.number ? 'bg-teal-600 text-white' :
                      currentStep === step.number ? 'bg-teal-700 text-white ring-4 ring-teal-50' :
                      'bg-slate-100 text-slate-400'
                    }`}>
                      {currentStep > step.number ? <Check className="w-4 h-4" /> : step.number}
                    </div>
                    <span className={`text-xs font-bold hidden md:inline whitespace-nowrap ${
                      currentStep === step.number ? 'text-slate-800 font-extrabold' : 'text-slate-400'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Two Column Form & Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Form Area */}
            <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-fade">
              
              {/* STEP 1: AVAILABILITY DETAILS */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-fade">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800">Availability Details</h3>
                    <p className="text-xs font-medium text-slate-400 mt-1">Add basic information about your availability.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Location Type */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-wide">Location Type *</label>
                      <div className="flex items-center gap-4 bg-slate-50/50 p-2 border border-slate-150 rounded-xl">
                        <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-200 cursor-pointer shadow-xs select-none">
                          <input 
                            type="radio" 
                            name="locationType"
                            checked={locationType === 'Clinic'}
                            onChange={() => {
                              setLocationType('Clinic');
                              setHospitalClinic('My Clinic');
                            }}
                            className="accent-teal-750"
                          />
                          <span className="text-xs font-bold text-slate-700">My Clinic / Chamber</span>
                        </label>
                        
                        <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white rounded-lg border border-slate-200 cursor-pointer shadow-xs select-none">
                          <input 
                            type="radio" 
                            name="locationType"
                            checked={locationType === 'Hospital'}
                            onChange={() => {
                              setLocationType('Hospital');
                              setHospitalClinic('');
                            }}
                            className="accent-teal-750"
                          />
                          <span className="text-xs font-bold text-slate-700">Hospital</span>
                        </label>
                      </div>
                    </div>

                    {/* Hospital / Clinic Selection */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">Hospital / Clinic *</label>
                        {locationType === 'Hospital' && (
                          <button 
                            type="button"
                            onClick={() => setIsHospitalRequestOpen(true)}
                            className="text-[10px] font-bold text-teal-700 hover:text-teal-800 cursor-pointer"
                          >
                            Can't find your hospital?
                          </button>
                        )}
                      </div>
                      <div className="relative">
                        <select 
                          value={hospitalClinic}
                          onChange={e => setHospitalClinic(e.target.value)}
                          className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400 h-10 cursor-pointer"
                        >
                          {locationType === 'Hospital' ? (
                            <>
                              <option value="">Select Hospital / Clinic</option>
                              <option value="Apollo Hospitals, Banjara Hills">Apollo Hospitals, Banjara Hills</option>
                              <option value="Care Hospitals, Gachibowli">Care Hospitals, Gachibowli</option>
                              <option value="Continental Hospitals, Nanakramguda">Continental Hospitals, Nanakramguda</option>
                              <option value="KIMS Hospitals, Secunderabad">KIMS Hospitals, Secunderabad</option>
                            </>
                          ) : (
                            <>
                              <option value="My Clinic">My Clinic / Chamber</option>
                              <option value="Banjara Hills Clinic">Banjara Hills Clinic</option>
                              <option value="Kondapur Consultation Room">Kondapur Consultation Room</option>
                            </>
                          )}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Consultation Type */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-wide">Consultation Type *</label>
                      <div className="relative">
                        <select 
                          value={consultationType}
                          onChange={e => setConsultationType(e.target.value)}
                          className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400 h-10 cursor-pointer"
                        >
                          <option value="">Select Consultation Type</option>
                          <option value="In-Clinic Consultation">In-Clinic Consultation</option>
                          <option value="Video Consultation">Video Consultation</option>
                          <option value="Home Visit">Home Visit</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Mode of Consultation */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-wide">Mode of Consultation *</label>
                      <div className="relative">
                        <select 
                          value={modeOfConsultation}
                          onChange={e => setModeOfConsultation(e.target.value)}
                          className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400 h-10 cursor-pointer"
                        >
                          <option value="">Select Mode</option>
                          <option value="Audio & Video">Audio &amp; Video</option>
                          <option value="Video Only">Video Only</option>
                          <option value="Audio Only">Audio Only</option>
                          <option value="In-Person">In-Person</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Available Days */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-2.5 uppercase tracking-wide">Available Days *</label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <button 
                          type="button"
                          key={day}
                          onClick={() => toggleDay(day)}
                          className={`w-14 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            selectedDays.includes(day) 
                              ? 'bg-teal-700 border-teal-700 text-white shadow-sm' 
                              : 'bg-white border-slate-200 text-slate-655 hover:bg-slate-50'
                          }`}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Start Date */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-wide">Start Date *</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={startDate}
                          onChange={e => setStartDate(e.target.value)}
                          placeholder="e.g. 20 May 2025" 
                          className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-9 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400 h-10"
                        />
                        <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* End Date */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-wide">End Date *</label>
                      <div className="relative">
                        <input 
                          type="text" 
                          value={endDate}
                          onChange={e => setEndDate(e.target.value)}
                          placeholder="e.g. 20 Aug 2025" 
                          className="w-full bg-white border border-slate-200 rounded-xl pl-3 pr-9 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400 h-10"
                        />
                        <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Slot Duration */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-wide">Slot Duration *</label>
                      <div className="relative">
                        <select 
                          value={slotDuration}
                          onChange={e => setSlotDuration(e.target.value)}
                          className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400 h-10 cursor-pointer"
                        >
                          <option value="10 mins">10 mins</option>
                          <option value="15 mins">15 mins</option>
                          <option value="20 mins">20 mins</option>
                          <option value="30 mins">30 mins</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Buffer Time */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-wide">Buffer Time (Between Slots) *</label>
                      <div className="relative">
                        <select 
                          value={bufferTime}
                          onChange={e => setBufferTime(e.target.value)}
                          className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400 h-10 cursor-pointer"
                        >
                          <option value="None">None</option>
                          <option value="5 mins">5 mins</option>
                          <option value="10 mins">10 mins</option>
                          <option value="15 mins">15 mins</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Max Patients */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-wide">Maximum Patients Per Slot *</label>
                      <div className="relative">
                        <select 
                          value={maxPatients}
                          onChange={e => setMaxPatients(e.target.value)}
                          className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400 h-10 cursor-pointer"
                        >
                          <option value="1 Patient">1 Patient</option>
                          <option value="2 Patients">2 Patients</option>
                          <option value="3 Patients">3 Patients</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-wide">Status *</label>
                      <div className="relative">
                        <select 
                          value={status}
                          onChange={e => setStatus(e.target.value)}
                          className="w-full appearance-none bg-white border border-slate-200 rounded-xl pl-3 pr-8 py-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400 h-10 cursor-pointer"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-wide">Notes (Optional)</label>
                    <textarea 
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="Add any special instructions or notes for your availability..."
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400 min-h-[90px]"
                    />
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <button 
                      type="button" 
                      onClick={resetForm}
                      className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 px-5 rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      disabled={!hospitalClinic || !consultationType || !modeOfConsultation || selectedDays.length === 0}
                      onClick={() => setCurrentStep(2)}
                      className={`font-bold text-xs py-2.5 px-5 rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-sm ${
                        (!hospitalClinic || !consultationType || !modeOfConsultation || selectedDays.length === 0)
                          ? 'bg-teal-700/50 text-teal-100 cursor-not-allowed'
                          : 'bg-teal-700 hover:bg-teal-800 text-white'
                      }`}
                    >
                      Next: Time &amp; Schedule <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: TIME & SCHEDULE */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-fade">
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800">Time &amp; Schedule</h3>
                    <p className="text-xs font-medium text-slate-400 mt-1">Configure available hours and slots for consultations.</p>
                  </div>

                  {/* Common schedule checkbox toggle */}
                  <label className="flex items-center gap-2.5 p-3.5 bg-slate-50 border border-slate-150 rounded-xl cursor-pointer select-none">
                    <input 
                      type="checkbox"
                      checked={applySameToAll}
                      onChange={e => setApplySameToAll(e.target.checked)}
                      className="accent-teal-750 w-4 h-4 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-850">Apply same time slots to all selected days</span>
                      <p className="text-[10px] text-slate-400 mt-0.5">Check this to copy schedule to: {selectedDays.join(', ')}</p>
                    </div>
                  </label>

                  {/* Intervals Setup */}
                  {applySameToAll ? (
                    <div className="space-y-3.5 animate-fade">
                      <div className="flex justify-between items-center">
                        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">Available Hours</label>
                        <button 
                          type="button" 
                          onClick={handleAddCommonSlot}
                          className="text-[10px] font-bold text-teal-700 hover:text-teal-850 cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Interval
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {commonSlots.map((slot, index) => (
                          <div key={index} className="flex items-center gap-3 bg-slate-50/50 p-2.5 border border-slate-200 rounded-xl">
                            <span className="text-[10px] font-bold text-slate-400">Slot {index + 1}</span>
                            
                            <div className="flex-1 grid grid-cols-2 gap-3">
                              <div className="relative">
                                <input 
                                  type="text" 
                                  value={slot.start} 
                                  onChange={e => handleUpdateCommonSlot(index, 'start', e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                                />
                                <Clock className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                              </div>
                              <div className="relative">
                                <input 
                                  type="text" 
                                  value={slot.end} 
                                  onChange={e => handleUpdateCommonSlot(index, 'end', e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                                />
                                <Clock className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                              </div>
                            </div>

                            {commonSlots.length > 1 && (
                              <button 
                                type="button" 
                                onClick={() => handleRemoveCommonSlot(index)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Day-specific intervals setup */
                    <div className="space-y-5 animate-fade">
                      {selectedDays.map(day => (
                        <div key={day} className="border border-slate-200 rounded-2xl p-4 space-y-3">
                          <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                            <span className="text-xs font-bold text-teal-700">{day} Schedule</span>
                            <button 
                              type="button" 
                              onClick={() => handleAddDaySlot(day)}
                              className="text-[10px] font-bold text-teal-700 hover:text-teal-850 cursor-pointer flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" /> Add Interval
                            </button>
                          </div>

                          <div className="space-y-2">
                            {(daySlots[day] || []).length === 0 ? (
                              <p className="text-[10px] text-slate-400 py-1.5 italic">No slots set. Availability will be blocked for this day.</p>
                            ) : (
                              daySlots[day].map((slot, index) => (
                                <div key={index} className="flex items-center gap-3 bg-slate-50/50 p-2 border border-slate-100 rounded-xl">
                                  <div className="flex-1 grid grid-cols-2 gap-3">
                                    <div className="relative">
                                      <input 
                                        type="text" 
                                        value={slot.start} 
                                        onChange={e => handleUpdateDaySlot(day, index, 'start', e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-none"
                                      />
                                      <Clock className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                                    </div>
                                    <div className="relative">
                                      <input 
                                        type="text" 
                                        value={slot.end} 
                                        onChange={e => handleUpdateDaySlot(day, index, 'end', e.target.value)}
                                        className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-700 focus:outline-none"
                                      />
                                      <Clock className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                                    </div>
                                  </div>

                                  <button 
                                    type="button" 
                                    onClick={() => handleRemoveDaySlot(day, index)}
                                    className="p-1 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <button 
                      type="button" 
                      onClick={() => setCurrentStep(1)}
                      className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 px-5 rounded-xl cursor-pointer"
                    >
                      Back
                    </button>
                    <button 
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
                    >
                      Next: Review &amp; Confirm <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: REVIEW & CONFIRM */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-fade">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-800">Review &amp; Confirm</h3>
                      <p className="text-xs font-medium text-slate-400 mt-1">Review all your settings before activation.</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-150 rounded-2xl p-5 space-y-4 text-xs">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Location Details</span>
                          <p className="font-bold text-slate-700">{locationType} Location</p>
                          <p className="text-slate-500 mt-0.5">{hospitalClinic}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Consultation Setup</span>
                          <p className="font-bold text-slate-700">{consultationType}</p>
                          <p className="text-slate-500 mt-0.5">Mode: {modeOfConsultation}</p>
                        </div>
                      </div>

                      <div className="border-t border-slate-200/60 pt-3 grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Schedule Info</span>
                          <p className="text-slate-700 font-semibold">Date Range: {startDate} – {endDate}</p>
                          <p className="text-slate-500 mt-0.5">Days: {selectedDays.join(', ')}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Slot Settings</span>
                          <p className="text-slate-700 font-semibold">Duration: {slotDuration} (Buffer: {bufferTime})</p>
                          <p className="text-slate-500 mt-0.5">Status: <span className="font-bold text-emerald-600">{status}</span></p>
                        </div>
                      </div>

                      <div className="border-t border-slate-200/60 pt-3">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block mb-2">Configured Time Intervals</span>
                        {applySameToAll ? (
                          <div className="flex gap-2.5 flex-wrap">
                            {commonSlots.map((s, idx) => (
                              <span key={idx} className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg font-bold text-slate-700">
                                {s.start} - {s.end}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {selectedDays.map(day => (
                              <div key={day} className="flex gap-2 items-center">
                                <span className="w-10 font-bold text-slate-400">{day}:</span>
                                <div className="flex gap-2 flex-wrap">
                                  {(daySlots[day] || []).map((s, idx) => (
                                    <span key={idx} className="bg-white border border-slate-200 px-2 py-1 rounded-md text-[11px] font-semibold text-slate-700">
                                      {s.start} - {s.end}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {notes && (
                        <div className="border-t border-slate-200/60 pt-3">
                          <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Notes</span>
                          <p className="text-slate-600 font-medium italic">"{notes}"</p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <button 
                        type="button" 
                        onClick={() => setCurrentStep(2)}
                        className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 px-5 rounded-xl cursor-pointer"
                      >
                        Back
                      </button>
                      <button 
                        type="button"
                        onClick={handleSaveAvailability}
                        className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
                      >
                        {editingId ? 'Save Changes' : (
                          <>
                            Confirm &amp; Proceed to Request <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: REQUEST ACCESS (WIZARD CONCLUDING FLOW) */}
              {currentStep === 4 && (
                <div className="space-y-6 animate-fade">
                  {!isRequestSubmitted ? (
                    /* Step 4 Form: General schedule verification access request */
                    <div className="space-y-6 animate-fade">
                      <div>
                        <h3 className="text-sm font-extrabold text-slate-800">Hospital Portal Access Request</h3>
                        <p className="text-xs font-medium text-slate-400 mt-1">
                          Submit this confirmed availability schedule to the hospital portal. The hospital admin will verify and activate these slots for patient booking.
                        </p>
                      </div>

                      <div className="space-y-4">
                        {/* Selected Hospital Display */}
                        <div className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-150 rounded-xl">
                          <Building2 className="w-5 h-5 text-teal-600" />
                          <div>
                            <span className="text-[10px] text-slate-400 font-bold uppercase block">Recipient Hospital / Clinic</span>
                            <span className="text-xs font-bold text-slate-700">{hospitalClinic || 'Apollo Hospitals, Banjara Hills'}</span>
                          </div>
                        </div>

                        {/* Request Summary details */}
                        <div className="bg-slate-50/50 p-4 border border-slate-200 rounded-2xl text-xs space-y-2 text-left">
                          <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wide block mb-1">Schedule Summary</span>
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-450 font-medium">Days &amp; Time</span>
                            <span className="font-semibold text-slate-850">
                              {selectedDays.join(', ')} ({commonSlots.map(s => `${s.start}-${s.end}`).join(', ')})
                            </span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-100">
                            <span className="text-slate-455 font-medium">Consultation Category</span>
                            <span className="font-semibold text-slate-850">{consultationType}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-455 font-medium">Validation Period</span>
                            <span className="font-semibold text-slate-850">{startDate} – {endDate}</span>
                          </div>
                        </div>

                        {/* Message Notes */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-2 uppercase tracking-wide">
                            Message / Notes for Administrator
                          </label>
                          <textarea 
                            value={requestNotes}
                            onChange={e => setRequestNotes(e.target.value)}
                            placeholder="e.g. Please approve my schedule. I will be attending the clinic regularly from next Tuesday..." 
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-700 focus:outline-none focus:border-teal-400 min-h-[90px]"
                          />
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                        <button 
                          type="button" 
                          onClick={resetForm}
                          className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold py-2.5 px-5 rounded-xl cursor-pointer"
                        >
                          Skip &amp; Finish
                        </button>
                        <button 
                          type="button"
                          onClick={handleSubmitAccessRequestToHospital}
                          className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
                        >
                          Send Access Request <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Final Success state block */
                    <div className="py-8 text-center space-y-6 animate-fade">
                      <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto shadow-xs border border-emerald-250 animate-bounce">
                        <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                      </div>
                      
                      <div className="max-w-md mx-auto space-y-2">
                        <h3 className="text-lg font-black text-slate-800">Access Request Sent!</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Your schedule activation request has been dispatched to <span className="font-bold">{hospitalClinic}</span>. 
                          The administrator will review and publish your availability slots shortly.
                        </p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left max-w-sm mx-auto text-xs space-y-2.5 shadow-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-semibold">Request ID</span>
                          <span className="font-mono font-bold text-slate-700">REQ-89021</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-semibold">Target Hospital</span>
                          <span className="font-bold text-slate-700">{hospitalClinic}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400 font-semibold">Status</span>
                          <span className="bg-amber-50 border border-amber-200 text-amber-700 font-extrabold uppercase text-[9px] px-2 py-0.5 rounded-full shadow-xs">
                            Awaiting Hospital Approval
                          </span>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button 
                          type="button" 
                          onClick={resetForm}
                          className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold py-2.5 px-6 rounded-xl cursor-pointer transition-colors shadow-sm"
                        >
                          Return to Availability Dashboard
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Widgets Panel */}
            <div className="col-span-12 lg:col-span-4 space-y-6 animate-fade">
              {/* Request to Hospital Widget */}
              {locationType === 'Hospital' && currentStep < 4 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3.5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 border border-teal-200 rounded-xl flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Request to Hospital</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">If your hospital is not listed, request admin to add.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsHospitalRequestOpen(true)}
                    className="w-full bg-teal-750 hover:bg-teal-800 text-white font-bold py-2.5 rounded-xl text-xs transition-colors shadow-xs cursor-pointer text-center"
                  >
                    Request Hospital Access
                  </button>
                </div>
              )}

              {/* How It Works Widget */}
              {currentStep < 4 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3.5 text-xs">
                  <div className="flex items-center gap-2 text-slate-755">
                    <HelpCircle className="w-4 h-4 text-teal-600" />
                    <span className="font-extrabold">How it works?</span>
                  </div>
                  <ul className="space-y-3">
                    {[
                      'Send a request to the hospital admin.',
                      'Once approved, you can add availability for that hospital.',
                      'You will be notified via email / app notification.'
                    ].map((text, idx) => (
                      <li key={idx} className="flex gap-2 items-start">
                        <span className="w-4 h-4 rounded-full bg-teal-50 border border-teal-250 flex items-center justify-center text-[9px] font-bold text-teal-700 shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span className="text-slate-500 leading-normal font-medium">{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Summary Widget */}
              {currentStep < 4 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <h4 className="text-xs font-bold text-slate-800">Availability Summary</h4>
                  <div className="space-y-2.5 text-xs text-left">
                    {[
                      { label: 'Location Type', value: locationType },
                      { label: 'Hospital / Clinic', value: hospitalClinic || '-' },
                      { label: 'Consultation Type', value: consultationType || '-' },
                      { label: 'Mode of Consultation', value: modeOfConsultation || '-' },
                      { label: 'Available Days', value: selectedDays.length > 0 ? selectedDays.join(', ') : '-' },
                      { label: 'Date Range', value: `${startDate} - ${endDate}` },
                      { label: 'Slot Duration', value: slotDuration },
                      { label: 'Status', value: status, badge: true }
                    ].map(item => (
                      <div key={item.label} className="flex justify-between items-center py-1.5 border-b border-slate-50">
                        <span className="text-slate-450 font-semibold">{item.label}</span>
                        {item.badge ? (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.value === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'
                          }`}>
                            {item.value}
                          </span>
                        ) : (
                          <span className="font-bold text-slate-700 text-right truncate max-w-[150px]">{item.value}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2.5 items-start">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <p className="text-[10px] text-blue-700 leading-normal font-medium">
                      {currentStep === 1 ? 'Please review all details before proceeding to set your time slots.' : 'Configure slot start and end boundaries.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
