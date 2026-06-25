import React, { useState } from 'react';
import { Clock, Calendar as CalendarIcon, Save, Settings2, AlertCircle } from 'lucide-react';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function AvailabilityScreen() {
  const [schedule, setSchedule] = useState(
    DAYS.reduce((acc, day) => {
      acc[day] = {
        enabled: day !== 'Sunday',
        slots: [{ start: '09:00', end: '13:00' }, { start: '15:00', end: '19:00' }]
      };
      return acc;
    }, {} as Record<string, any>)
  );

  const toggleDay = (day: string) => {
    setSchedule({
      ...schedule,
      [day]: { ...schedule[day], enabled: !schedule[day].enabled }
    });
  };

  return (
    <div className="w-full animate-fade space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <Clock className="w-8 h-8 text-teal-600" />
            Availability Management
          </h1>
          <p className="text-slate-500 font-medium mt-1">Set your standard working hours and manage exceptions/leaves.</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2 shadow-md shadow-teal-500/20 px-5 py-2.5">
          <Save className="w-5 h-5" /> Save Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Weekly Schedule</h2>
            <button className="text-teal-600 font-bold text-xs flex items-center gap-1 hover:underline">
              <Settings2 className="w-4 h-4" /> Copy to all days
            </button>
          </div>

          <div className="space-y-4">
            {DAYS.map(day => (
              <div key={day} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-colors ${schedule[day].enabled ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50'}`}>
                <div className="flex items-center gap-4 w-40 shrink-0">
                  <input 
                    type="checkbox" 
                    checked={schedule[day].enabled}
                    onChange={() => toggleDay(day)}
                    className="w-5 h-5 rounded text-teal-600 focus:ring-teal-500/20"
                  />
                  <span className={`font-bold ${schedule[day].enabled ? 'text-slate-800' : 'text-slate-400'}`}>{day}</span>
                </div>
                
                {schedule[day].enabled ? (
                  <div className="flex flex-wrap items-center gap-3 mt-4 sm:mt-0 flex-1 sm:justify-end">
                    {schedule[day].slots.map((slot: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input type="time" defaultValue={slot.start} className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-700 min-w-[120px]" />
                        <span className="text-slate-400 text-xs">to</span>
                        <input type="time" defaultValue={slot.end} className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-slate-700 min-w-[120px]" />
                        {idx === 0 && <span className="text-slate-200 mx-2 hidden lg:block">|</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-slate-400 font-medium text-sm italic mt-4 sm:mt-0 flex-1">
                    Marked as Unavailable / Day Off
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-teal-600" /> Leave & Exceptions
            </h2>
            <p className="text-sm text-slate-500 mb-4 font-medium leading-relaxed">
              Block out specific dates on your calendar. Patients will not be able to book appointments on these days.
            </p>
            <button className="w-full btn btn-outline border-slate-300 text-slate-700 font-bold shadow-sm flex justify-center py-2.5">
              Add Leave Exception
            </button>

            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-800">Upcoming Leave</h4>
                  <p className="text-[10px] text-amber-600 font-semibold mt-0.5">25 Jun 2026 - 28 Jun 2026</p>
                  <p className="text-[10px] text-amber-700 mt-1">Medical Conference</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
