import React, { useState } from 'react';
import {
  Building2, Phone, Mail, MapPin, Clock, Edit2, Save, X,
  BadgeCheck, Stethoscope, Calendar, Hash, FileText
} from 'lucide-react';
import { useClinicRole } from '../../store/clinic/ClinicRoleContext';

const SPECIALISATION_OPTIONS = [
  'Internal Medicine', 'General Practice', 'Cardiology', 'Dermatology',
  'Gynaecology', 'Orthopaedics', 'Paediatrics', 'Neurology', 'Pulmonology',
  'Gastroenterology', 'Endocrinology', 'Psychiatry', 'Ophthalmology', 'ENT',
  'Urology', 'Nephrology', 'Oncology', 'Diabetes Care', 'Dental', 'Physiotherapy'
];

const ClinicProfileScreen: React.FC = () => {
  const { clinicProfile, updateClinicProfile, connectedDoctors, appointments } = useClinicRole();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ ...clinicProfile });
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = () => {
    updateClinicProfile(form);
    setIsEditing(false);
    showToast('Clinic profile updated successfully.');
  };

  const handleCancel = () => {
    setForm({ ...clinicProfile });
    setIsEditing(false);
  };

  const toggleSpecialisation = (spec: string) => {
    setForm(prev => ({
      ...prev,
      specialisation: prev.specialisation.includes(spec)
        ? prev.specialisation.filter(s => s !== spec)
        : [...prev.specialisation, spec]
    }));
  };

  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(a => a.status === 'Completed').length;
  const totalRevenue = appointments.filter(a => a.status === 'Completed').reduce((sum, a) => sum + a.fee, 0);

  const InputField = ({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) => (
    <div>
      <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-1">{label}</label>
      {isEditing ? (
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:ring-2 focus:ring-purple-600/10 focus:border-[#7C3AED]/40 transition"
        />
      ) : (
        <p className="text-xs font-bold text-slate-800">{value || '—'}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6 font-sans">

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl max-w-sm animate-fade">
          <BadgeCheck className="w-4 h-4 text-teal-400 shrink-0" />
          <p className="text-xs font-bold">{toast}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#5C2494] flex items-center justify-center shadow-lg shrink-0">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#2B2B2B] tracking-tight">{clinicProfile.clinicName}</h1>
            <p className="text-xs font-bold text-slate-500 mt-0.5">{clinicProfile.ownerTitle}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[9px] font-black uppercase bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full">Verified</span>
              <span className="text-[9px] font-bold text-slate-400">{clinicProfile.clinicId}</span>
            </div>
          </div>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 bg-white border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-[#7C3AED] px-3.5 py-2 rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Edit2 className="w-3.5 h-3.5" /> Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCancel}
              className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-xl text-xs font-bold cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#5C2494] to-[#7C3AED] text-white px-3.5 py-2 rounded-xl text-xs font-black shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Partner Doctors', value: connectedDoctors.length, icon: Stethoscope, color: 'text-purple-600 bg-purple-50' },
          { label: 'Total Appointments', value: totalAppointments, icon: Calendar, color: 'text-blue-600 bg-blue-50' },
          { label: 'Revenue Earned', value: `₹${(totalRevenue).toLocaleString('en-IN')}`, icon: BadgeCheck, color: 'text-emerald-600 bg-emerald-50' },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-lg font-extrabold text-slate-900 leading-tight">{stat.value}</p>
              <p className="text-[10px] font-bold text-slate-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ─── Left: Identity & Registration ──────────────────────────────── */}
        <div className="space-y-5">

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-black text-slate-800 flex items-center gap-2">
              <Hash className="w-4 h-4 text-purple-500" /> Registration Details
            </h2>
            <div className="space-y-3">
              <InputField label="Clinic ID" value={form.clinicId} onChange={v => setForm(p => ({ ...p, clinicId: v }))} />
              <InputField label="Registration Number" value={form.registrationNumber} onChange={v => setForm(p => ({ ...p, registrationNumber: v }))} />
              <InputField label="Established Year" value={String(form.establishedYear)} onChange={v => setForm(p => ({ ...p, establishedYear: Number(v) }))} />
              <InputField label="Owner / Doctor Name" value={form.ownerName} onChange={v => setForm(p => ({ ...p, ownerName: v }))} />
              <InputField label="Qualification & Title" value={form.ownerTitle} onChange={v => setForm(p => ({ ...p, ownerTitle: v }))} />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-black text-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" /> Operating Hours
            </h2>
            <div className="space-y-3">
              <InputField label="Weekdays (Mon–Fri)" value={form.operatingHours.weekdays} onChange={v => setForm(p => ({ ...p, operatingHours: { ...p.operatingHours, weekdays: v } }))} placeholder="9:00 AM – 8:00 PM" />
              <InputField label="Saturday" value={form.operatingHours.saturday} onChange={v => setForm(p => ({ ...p, operatingHours: { ...p.operatingHours, saturday: v } }))} placeholder="9:00 AM – 2:00 PM" />
              <InputField label="Sunday" value={form.operatingHours.sunday} onChange={v => setForm(p => ({ ...p, operatingHours: { ...p.operatingHours, sunday: v } }))} placeholder="Closed" />
            </div>
          </div>

        </div>

        {/* ─── Centre: Contact & Address ───────────────────────────────────── */}
        <div className="space-y-5">

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-black text-slate-800 flex items-center gap-2">
              <Phone className="w-4 h-4 text-teal-500" /> Contact Information
            </h2>
            <div className="space-y-3">
              <InputField label="Clinic Name" value={form.clinicName} onChange={v => setForm(p => ({ ...p, clinicName: v }))} />
              <InputField label="Contact Number" value={form.contact} onChange={v => setForm(p => ({ ...p, contact: v }))} />
              <InputField label="Email Address" value={form.email} onChange={v => setForm(p => ({ ...p, email: v }))} />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-black text-slate-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-500" /> Clinic Address
            </h2>
            <div className="space-y-3">
              <InputField label="Street Address" value={form.address} onChange={v => setForm(p => ({ ...p, address: v }))} />
              <InputField label="City" value={form.city} onChange={v => setForm(p => ({ ...p, city: v }))} />
              <InputField label="PIN Code" value={form.pincode} onChange={v => setForm(p => ({ ...p, pincode: v }))} />
            </div>
          </div>

        </div>

        {/* ─── Right: Specialisations & Description ────────────────────────── */}
        <div className="space-y-5">

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-black text-slate-800 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-purple-500" /> Specialisations
            </h2>
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                {SPECIALISATION_OPTIONS.map(spec => {
                  const active = form.specialisation.includes(spec);
                  return (
                    <button
                      key={spec}
                      onClick={() => toggleSpecialisation(spec)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border cursor-pointer transition-all ${active ? 'bg-purple-600 text-white border-purple-600' : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-purple-300'}`}
                    >
                      {spec}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {clinicProfile.specialisation.map(spec => (
                  <span key={spec} className="px-2.5 py-1 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg text-[10px] font-bold">{spec}</span>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <h2 className="text-xs font-black text-slate-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-slate-400" /> Clinic Description
            </h2>
            {isEditing ? (
              <textarea
                value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                rows={6}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold outline-none focus:border-purple-400 resize-none"
              />
            ) : (
              <p className="text-xs font-semibold text-slate-600 leading-relaxed">{clinicProfile.description}</p>
            )}
          </div>

          {/* Partner Doctors preview */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h2 className="text-xs font-black text-slate-800 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-blue-500" /> Partner Doctors ({connectedDoctors.length})
            </h2>
            <div className="space-y-2">
              {connectedDoctors.slice(0, 3).map(d => (
                <div key={d.id} className="flex items-center gap-2.5 border border-slate-100 rounded-xl p-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shrink-0">
                    <span className="text-white text-[10px] font-black">{d.name.split(' ').slice(1).map(w => w[0]).join('').slice(0, 2)}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-black text-slate-800 truncate">{d.name}</p>
                    <p className="text-[9px] font-bold text-slate-400">{d.specialisation}</p>
                  </div>
                </div>
              ))}
              {connectedDoctors.length === 0 && (
                <p className="text-xs text-slate-400 font-bold text-center py-3">No partner doctors connected yet.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ClinicProfileScreen;
