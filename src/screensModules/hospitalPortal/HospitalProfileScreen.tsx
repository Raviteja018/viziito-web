import React, { useState, useEffect } from 'react';
import { useHospitalRole } from '../../store/hospital/HospitalRoleContext';
import {
  MOCK_BRANCHES,
  MOCK_DEPARTMENTS,
  MOCK_DOCTORS
} from '../../mocks/hospitalMocks';
import {
  User, Mail, Phone, Globe, Building2, ShieldCheck, CheckCircle2,
  Calendar, Layers, MapPin, Edit2, Info, Share2, Save, Camera, Eye, Lock
} from 'lucide-react';

const FBIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const IGIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const TWIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
  </svg>
);

const LNIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const YTIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
  </svg>
);

const AlertErrIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const DEFAULT_PROFILE = {
  name: 'City Care Hospital',
  displayName: 'City Care General Hospital',
  type: 'Multi-Speciality Hospital',
  yearEstablished: 2012,
  about: 'City Care Hospital is a leading provider of multi-speciality medical services, dedicated to delivering clinical excellence and patient-centric care across our state-of-the-art medical centers.',
  primaryContact: '9876543210',
  secondaryContact: '0402345678',
  email: 'admin@citycare.com',
  website: 'https://www.citycarehospital.com',
  emergencyContact: '1066',
  logoUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=200&auto=format&fit=crop',
  coverUrl: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?q=80&w=1000&auto=format&fit=crop',
  overview: 'Equipped with over 500 beds, advanced operating theaters, and a 24/7 critical care unit.',
  specialtiesSummary: 'Cardiology, Neurology, Orthopedics, Pediatrics, Oncology, Gynaecology, Gastroenterology.',
  facilitiesSummary: 'ICU, Pharmacy 24/7, Emergency Trauma Care, Diagnostic Lab, Blood Bank, Ventilator Support.',
  languagesSpoken: ['English', 'Hindi', 'Telugu', 'Kannada'],
  awards: 'Best Multi-Speciality Care Hospital 2024, National Hygiene Standard Grade A+.',
  consultationTypes: { online: true, inPerson: true },
  defaultDuration: 15,
  bookingWindow: 30,
  cancellationWindow: 2,
  followUpValidity: 7,
  socialLinks: {
    facebook: 'https://facebook.com/citycarehospital',
    instagram: 'https://instagram.com/citycarehospital',
    twitter: 'https://twitter.com/citycarehealth',
    linkedin: 'https://linkedin.com/company/citycarehospital',
    youtube: 'https://youtube.com/citycarehealth'
  }
};

const HospitalProfileScreen: React.FC = () => {
  const { role } = useHospitalRole();
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('vizito_hospital_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_PROFILE;
  });

  const [activeTab, setActiveTab] = useState<'basic' | 'contact' | 'branding' | 'description' | 'consultation' | 'social' | 'preview'>('basic');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (role === 'receptionist') return;
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Logo file size must not exceed 5 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const nextProfile = { ...profile, logoUrl: reader.result as string };
        setProfile(nextProfile);
        localStorage.setItem('vizito_hospital_profile', JSON.stringify(nextProfile));
        showToast('Hospital logo updated successfully.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (role === 'receptionist') return;
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('Cover Image file size must not exceed 10 MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const nextProfile = { ...profile, coverUrl: reader.result as string };
        setProfile(nextProfile);
        localStorage.setItem('vizito_hospital_profile', JSON.stringify(nextProfile));
        showToast('Cover image updated successfully.');
      };
      reader.readAsDataURL(file);
    }
  };

  const validateField = (field: string, val: any): string => {
    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]+$/;

    if (field === 'name') {
      const v = String(val).trim();
      if (!v) return 'Hospital Name is required.';
      if (v.length < 3 || v.length > 150) return 'Hospital Name must be 3–150 characters.';
    }
    if (field === 'primaryContact') {
      const v = String(val).trim();
      if (!v) return 'Primary Contact Number is required.';
      if (!phoneRegex.test(v)) return 'Contact number must contain only numeric characters.';
    }
    if (field === 'email') {
      const v = String(val).trim();
      if (!v) return 'Email Address is required.';
      if (!emailRegex.test(v)) return 'Please enter a valid email address.';
    }
    if (field === 'website') {
      const v = String(val).trim();
      if (v && !urlRegex.test(v)) return 'Please enter a valid website URL.';
    }
    if (field === 'yearEstablished') {
      const v = Number(val);
      const currentYear = new Date().getFullYear();
      if (v && (v < 1800 || v > currentYear)) return `Year Established must be between 1800 and ${currentYear}.`;
    }
    if (field === 'bookingWindow') {
      const v = Number(val);
      if (v < 1 || v > 365) return 'Booking window must be between 1 and 365 Days.';
    }
    if (field === 'cancellationWindow') {
      const v = Number(val);
      if (v < 0 || v > profile.bookingWindow * 24) return 'Cancellation window must be valid and less than booking window.';
    }
    if (field.startsWith('social_')) {
      const v = String(val).trim();
      if (v && !urlRegex.test(v)) return 'Please enter a valid social URL.';
    }
    return '';
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'receptionist') return;

    const nextErrors: Record<string, string> = {};

    // Validate Basic
    const nameErr = validateField('name', profile.name);
    if (nameErr) nextErrors.name = nameErr;

    const yearErr = validateField('yearEstablished', profile.yearEstablished);
    if (yearErr) nextErrors.yearEstablished = yearErr;

    // Validate Contact
    const contactErr = validateField('primaryContact', profile.primaryContact);
    if (contactErr) nextErrors.primaryContact = contactErr;

    const emailErr = validateField('email', profile.email);
    if (emailErr) nextErrors.email = emailErr;

    const webErr = validateField('website', profile.website);
    if (webErr) nextErrors.website = webErr;

    // Validate Booking Windows
    const bookErr = validateField('bookingWindow', profile.bookingWindow);
    if (bookErr) nextErrors.bookingWindow = bookErr;

    const cancelErr = validateField('cancellationWindow', profile.cancellationWindow);
    if (cancelErr) nextErrors.cancellationWindow = cancelErr;

    // Validate Socials
    Object.keys(profile.socialLinks).forEach((key) => {
      const err = validateField(`social_${key}`, (profile.socialLinks as any)[key]);
      if (err) nextErrors[`social_${key}`] = err;
    });

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      showToast('Please correct validation errors before saving.');
      return;
    }

    localStorage.setItem('vizito_hospital_profile', JSON.stringify(profile));
    showToast('Hospital profile updated successfully.');
  };

  // Tabs Mapping
  const tabList = [
    { id: 'basic', label: 'Basic Information' },
    { id: 'contact', label: 'Contact Information' },
    { id: 'branding', label: 'Branding' },
    { id: 'description', label: 'Public Description' },
    { id: 'consultation', label: 'Consultation Preferences' },
    { id: 'social', label: 'Social Networks' },
    { id: 'preview', label: 'Preview Profile' }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12 space-y-6">
      
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 bg-slate-900 text-white text-xs font-bold rounded-xl px-4 py-3 shadow-lg z-50 flex items-center gap-2 animate-fade border border-slate-800">
          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hospital Identity Header Card */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-3xs flex flex-col md:flex-row items-center md:justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-10 -mt-10 blur-xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
          {/* Logo Frame */}
          <div className="relative group w-20 h-20 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shrink-0 shadow-sm flex items-center justify-center">
            {profile.logoUrl ? (
              <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-10 h-10 text-slate-400" />
            )}
            {role !== 'receptionist' && (
              <label className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all">
                <Camera className="w-5 h-5 text-white" />
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
            )}
          </div>

          <div className="text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-black text-slate-900">{profile.name || 'Unnamed Hospital'}</h2>
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-emerald-100">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 font-mono mt-1">Hospital ID : HSP-CITY-0125</p>
            <p className="text-xs font-semibold text-slate-400 mt-1 capitalize">Identity Scope: {profile.type}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer border ${
              activeTab === 'preview' ? 'bg-[#F3E8FF] text-[#7C3AED] border-transparent' : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/50'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Preview Profile</span>
          </button>
          {role !== 'receptionist' && (
            <button
              onClick={handleSave}
              className="bg-[#7C3AED] hover:bg-purple-800 text-white text-xs font-bold py-2.5 px-4.5 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Side Tab buttons */}
        <div className="w-full lg:w-64 shrink-0 bg-white border border-slate-100 rounded-3xl p-3.5 shadow-2xs space-y-1">
          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider px-3 mb-2">Profile Sections</span>
          {tabList.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#FAF5FF] text-[#7C3AED]'
                  : 'text-slate-550 hover:text-slate-800 hover:bg-slate-50/60'
              }`}
            >
              <span>{tab.label}</span>
              {errors[tab.id] || Object.keys(errors).some(k => k.startsWith(`social_`) && tab.id === 'social') ? (
                <AlertErrIcon className="w-4 h-4 text-rose-500" />
              ) : null}
            </button>
          ))}

          {role === 'receptionist' && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-150 rounded-2xl flex items-start gap-2 text-amber-700">
              <Lock className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-[10px] font-semibold leading-normal">
                Logged in as Receptionist. Profile edits are locked.
              </p>
            </div>
          )}
        </div>

        {/* Right Side Main Form Fields */}
        <div className="flex-1 bg-white border border-slate-100 rounded-3xl p-6 shadow-2xs w-full">
          
          <form onSubmit={handleSave} className="space-y-6">

            {/* TAB 1: Basic Info */}
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3 mb-2">
                  <h3 className="text-sm font-black text-slate-800">Basic Information</h3>
                  <p className="text-[11px] text-slate-400">Legal name and core categorization of the hospital group.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Hospital Name *</label>
                    <input
                      type="text"
                      disabled={role === 'receptionist'}
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none focus:border-[#7C3AED] disabled:bg-slate-100 disabled:text-slate-400"
                    />
                    {errors.name && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Display Name (Patient Facing)</label>
                    <input
                      type="text"
                      disabled={role === 'receptionist'}
                      value={profile.displayName}
                      onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none focus:border-[#7C3AED] disabled:bg-slate-100 disabled:text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Hospital Type * (Locked after verification)</label>
                    <select
                      disabled
                      value={profile.type}
                      className="w-full bg-slate-100 border border-slate-200 text-slate-500 text-xs rounded-xl p-2.5 cursor-not-allowed"
                    >
                      <option value="Multi-Speciality Hospital">Multi-Speciality Hospital</option>
                      <option value="General Hospital">General Hospital</option>
                      <option value="Clinic">Clinic</option>
                      <option value="Diagnostic Center">Diagnostic Center</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Year Established</label>
                    <input
                      type="number"
                      disabled={role === 'receptionist'}
                      value={profile.yearEstablished}
                      onChange={(e) => setProfile({ ...profile, yearEstablished: Number(e.target.value) })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none focus:border-[#7C3AED] disabled:bg-slate-100 disabled:text-slate-400"
                    />
                    {errors.yearEstablished && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.yearEstablished}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">About Hospital (Brief Biography, Max 2000 characters)</label>
                  <textarea
                    rows={4}
                    maxLength={2000}
                    disabled={role === 'receptionist'}
                    value={profile.about}
                    onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none focus:border-[#7C3AED] disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Contact Info */}
            {activeTab === 'contact' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3 mb-2">
                  <h3 className="text-sm font-black text-slate-800">Contact Information</h3>
                  <p className="text-[11px] text-slate-400">Official contact addresses, support numbers, and website links.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Primary Contact Number *</label>
                    <input
                      type="text"
                      disabled={role === 'receptionist'}
                      value={profile.primaryContact}
                      onChange={(e) => setProfile({ ...profile, primaryContact: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
                    />
                    {errors.primaryContact && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.primaryContact}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Secondary Contact Number</label>
                    <input
                      type="text"
                      disabled={role === 'receptionist'}
                      value={profile.secondaryContact}
                      onChange={(e) => setProfile({ ...profile, secondaryContact: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Official Email Address *</label>
                    <input
                      type="email"
                      disabled={role === 'receptionist'}
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
                    />
                    {errors.email && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Official Website URL</label>
                    <input
                      type="text"
                      disabled={role === 'receptionist'}
                      value={profile.website}
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
                    />
                    {errors.website && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.website}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">Emergency Helpline Number</label>
                  <input
                    type="text"
                    disabled={role === 'receptionist'}
                    value={profile.emergencyContact}
                    onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none disabled:bg-slate-100 disabled:text-slate-400"
                  />
                </div>
              </div>
            )}

            {/* TAB 3: Branding */}
            {activeTab === 'branding' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3 mb-2">
                  <h3 className="text-sm font-black text-slate-800">Branding & Logo</h3>
                  <p className="text-[11px] text-slate-400">Assets and covers displaying public facing cards and maps.</p>
                </div>

                <div className="space-y-6">
                  {/* Logo Upload Card */}
                  <div className="border border-slate-100 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Hospital Brand Logo</h4>
                      <p className="text-[10px] text-slate-450 mt-1">PNG, JPG formats supported. Maximum size 5 MB. Recommended 512x512px.</p>
                    </div>
                    {role !== 'receptionist' ? (
                      <label className="bg-[#FAF5FF] hover:bg-[#F3E8FF] text-[#7C3AED] text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer">
                        Upload Logo
                        <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                      </label>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Upload disabled</span>
                    )}
                  </div>

                  {/* Cover Image Frame */}
                  <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-3xs">
                    <div className="h-40 bg-slate-100 relative">
                      {profile.coverUrl ? (
                        <img src={profile.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">
                          No cover image uploaded
                        </div>
                      )}
                      {role !== 'receptionist' && (
                        <label className="absolute bottom-3 right-3 bg-slate-900/60 backdrop-blur-md hover:bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1">
                          <Camera className="w-3.5 h-3.5" />
                          Upload Cover Image
                          <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                        </label>
                      )}
                    </div>
                    <div className="p-4 bg-slate-50 border-t border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Cover requirements: Max 10 MB, recommended aspect ratio 16:9.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Public Description */}
            {activeTab === 'description' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3 mb-2">
                  <h3 className="text-sm font-black text-slate-800">Public Descriptions</h3>
                  <p className="text-[11px] text-slate-400">Rich details published on the patient booking app.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Overview Summary</label>
                    <textarea
                      rows={3}
                      disabled={role === 'receptionist'}
                      value={profile.overview}
                      onChange={(e) => setProfile({ ...profile, overview: e.target.value })}
                      placeholder="e.g. Equipped with 24/7 cardiac ICU..."
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Specialties & Operations Summary</label>
                    <textarea
                      rows={3}
                      disabled={role === 'receptionist'}
                      value={profile.specialtiesSummary}
                      onChange={(e) => setProfile({ ...profile, specialtiesSummary: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Facilities & Equipment Summary</label>
                    <textarea
                      rows={3}
                      disabled={role === 'receptionist'}
                      value={profile.facilitiesSummary}
                      onChange={(e) => setProfile({ ...profile, facilitiesSummary: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none disabled:bg-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Awards, Accreditations & Recognitions</label>
                    <textarea
                      rows={2}
                      disabled={role === 'receptionist'}
                      value={profile.awards}
                      onChange={(e) => setProfile({ ...profile, awards: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none disabled:bg-slate-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: Consultation settings */}
            {activeTab === 'consultation' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3 mb-2">
                  <h3 className="text-sm font-black text-slate-800">Consultation Preferences (Defaults)</h3>
                  <p className="text-[11px] text-slate-400">Hospital defaults utilized for scheduling (can be overridden by doctors).</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1.5">Default Consultation Types</label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          disabled={role === 'receptionist'}
                          checked={profile.consultationTypes.online}
                          onChange={(e) => setProfile({
                            ...profile,
                            consultationTypes: { ...profile.consultationTypes, online: e.target.checked }
                          })}
                          className="rounded text-[#7C3AED] focus:ring-[#7C3AED] w-4.5 h-4.5"
                        />
                        <span>Online Consultation</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          disabled={role === 'receptionist'}
                          checked={profile.consultationTypes.inPerson}
                          onChange={(e) => setProfile({
                            ...profile,
                            consultationTypes: { ...profile.consultationTypes, inPerson: e.target.checked }
                          })}
                          className="rounded text-[#7C3AED] focus:ring-[#7C3AED] w-4.5 h-4.5"
                        />
                        <span>In-Person Consultation</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">Default Slot Duration</label>
                      <select
                        disabled={role === 'receptionist'}
                        value={profile.defaultDuration}
                        onChange={(e) => setProfile({ ...profile, defaultDuration: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none disabled:bg-slate-100"
                      >
                        <option value={10}>10 Minutes</option>
                        <option value={15}>15 Minutes</option>
                        <option value={20}>20 Minutes</option>
                        <option value={30}>30 Minutes</option>
                        <option value={45}>45 Minutes</option>
                        <option value={60}>60 Minutes</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">Booking Window (Days into future)</label>
                      <input
                        type="number"
                        disabled={role === 'receptionist'}
                        value={profile.bookingWindow}
                        onChange={(e) => setProfile({ ...profile, bookingWindow: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none disabled:bg-slate-100"
                      />
                      {errors.bookingWindow && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.bookingWindow}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">Cancellation Window (Hours before appointment)</label>
                      <input
                        type="number"
                        disabled={role === 'receptionist'}
                        value={profile.cancellationWindow}
                        onChange={(e) => setProfile({ ...profile, cancellationWindow: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none disabled:bg-slate-100"
                      />
                      {errors.cancellationWindow && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.cancellationWindow}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">Follow-up Validity Period (Days)</label>
                      <input
                        type="number"
                        disabled={role === 'receptionist'}
                        value={profile.followUpValidity}
                        onChange={(e) => setProfile({ ...profile, followUpValidity: Number(e.target.value) })}
                        className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none disabled:bg-slate-100"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: Social links */}
            {activeTab === 'social' && (
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-3 mb-2">
                  <h3 className="text-sm font-black text-slate-800">Social Media & Websites</h3>
                  <p className="text-[11px] text-slate-400">Social links displayed on the public patient portal directory.</p>
                </div>

                <div className="space-y-4">
                  {/* Facebook */}
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold text-slate-500 mb-1.5">
                      <FBIcon className="w-4 h-4 text-blue-600" />
                      <span>Facebook URL</span>
                    </label>
                    <input
                      type="text"
                      disabled={role === 'receptionist'}
                      value={profile.socialLinks.facebook}
                      onChange={(e) => setProfile({
                        ...profile,
                        socialLinks: { ...profile.socialLinks, facebook: e.target.value }
                      })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none disabled:bg-slate-100"
                    />
                    {errors.social_facebook && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.social_facebook}</p>}
                  </div>

                  {/* Instagram */}
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold text-slate-500 mb-1.5">
                      <IGIcon className="w-4 h-4 text-pink-600" />
                      <span>Instagram URL</span>
                    </label>
                    <input
                      type="text"
                      disabled={role === 'receptionist'}
                      value={profile.socialLinks.instagram}
                      onChange={(e) => setProfile({
                        ...profile,
                        socialLinks: { ...profile.socialLinks, instagram: e.target.value }
                      })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none disabled:bg-slate-100"
                    />
                    {errors.social_instagram && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.social_instagram}</p>}
                  </div>

                  {/* Twitter */}
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold text-slate-500 mb-1.5">
                      <TWIcon className="w-4 h-4 text-sky-500" />
                      <span>Twitter / X URL</span>
                    </label>
                    <input
                      type="text"
                      disabled={role === 'receptionist'}
                      value={profile.socialLinks.twitter}
                      onChange={(e) => setProfile({
                        ...profile,
                        socialLinks: { ...profile.socialLinks, twitter: e.target.value }
                      })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none disabled:bg-slate-100"
                    />
                    {errors.social_twitter && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.social_twitter}</p>}
                  </div>

                  {/* Linkedin */}
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold text-slate-500 mb-1.5">
                      <LNIcon className="w-4 h-4 text-blue-700" />
                      <span>LinkedIn Company Page URL</span>
                    </label>
                    <input
                      type="text"
                      disabled={role === 'receptionist'}
                      value={profile.socialLinks.linkedin}
                      onChange={(e) => setProfile({
                        ...profile,
                        socialLinks: { ...profile.socialLinks, linkedin: e.target.value }
                      })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none disabled:bg-slate-100"
                    />
                    {errors.social_linkedin && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.social_linkedin}</p>}
                  </div>

                  {/* Youtube */}
                  <div>
                    <label className="flex items-center gap-1 text-xs font-bold text-slate-500 mb-1.5">
                      <YTIcon className="w-4 h-4 text-rose-600" />
                      <span>YouTube Channel URL</span>
                    </label>
                    <input
                      type="text"
                      disabled={role === 'receptionist'}
                      value={profile.socialLinks.youtube}
                      onChange={(e) => setProfile({
                        ...profile,
                        socialLinks: { ...profile.socialLinks, youtube: e.target.value }
                      })}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-xl p-2.5 focus:outline-none disabled:bg-slate-100"
                    />
                    {errors.social_youtube && <p className="text-[10px] text-rose-500 font-bold mt-1">{errors.social_youtube}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: Preview Public Profile (Patient App Render Layout mockup!) */}
            {activeTab === 'preview' && (
              <div className="space-y-6 text-slate-700 text-[13px]">
                
                {/* Visual Preview Header Card */}
                <div className="border border-slate-100 rounded-3xl overflow-hidden shadow-sm bg-white">
                  
                  {/* Cover */}
                  <div className="h-44 bg-slate-200 relative">
                    {profile.coverUrl ? (
                      <img src={profile.coverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        No cover background
                      </div>
                    )}
                    <div className="absolute top-3 right-3 bg-slate-900/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg shadow-sm">
                      Patient App Directory Preview
                    </div>
                  </div>

                  {/* Logo overlay / Name panel */}
                  <div className="px-6 pb-6 relative">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end -mt-10 mb-4">
                      <div className="w-20 h-20 bg-white border-4 border-white shadow-md rounded-2xl overflow-hidden flex items-center justify-center shrink-0">
                        {profile.logoUrl ? (
                          <img src={profile.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <Building2 className="w-10 h-10 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-black text-slate-900 leading-tight">{profile.displayName || profile.name}</h4>
                        <span className="text-[10.5px] font-bold text-slate-450 uppercase mt-1 block tracking-wide">{profile.type} • Est. {profile.yearEstablished || 'N/A'}</span>
                      </div>
                      <button className="bg-[#7C3AED] hover:bg-purple-800 text-white font-black text-xs py-2.5 px-6 rounded-xl shadow-md transition-all shrink-0">
                        Book Appointment
                      </button>
                    </div>

                    {/* Quick Specs grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-b border-slate-100 py-4 mb-4">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Branches Count</span>
                        <span className="text-[13.5px] font-black text-[#7C3AED] block mt-0.5">{MOCK_BRANCHES.length} Active Branches</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Available Care Types</span>
                        <span className="text-[13.5px] font-black text-slate-800 block mt-0.5">
                          {profile.consultationTypes.online && profile.consultationTypes.inPerson ? 'Online + In-Person' :
                           profile.consultationTypes.online ? 'Online Only' : 'In-Person Only'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Phone</span>
                        <span className="text-[13.5px] font-semibold text-slate-800 block mt-0.5">{profile.primaryContact}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Helpline</span>
                        <span className="text-[13.5px] font-semibold text-rose-600 block mt-0.5">{profile.emergencyContact || '1066'}</span>
                      </div>
                    </div>

                    {/* About */}
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-1.5">About Hospital</h5>
                        <p className="text-xs text-slate-550 leading-relaxed">{profile.about || 'No details provided.'}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-1.5">Specialties Offered</h5>
                          <p className="text-xs text-slate-500 leading-normal">{profile.specialtiesSummary}</p>
                        </div>
                        <div>
                          <h5 className="text-xs font-black text-slate-800 uppercase tracking-wide mb-1.5">Facilities Available</h5>
                          <p className="text-xs text-slate-500 leading-normal">{profile.facilitiesSummary}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 pt-2">
                        {profile.socialLinks.facebook && (
                          <a href={profile.socialLinks.facebook} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl transition-all"><FBIcon className="w-4 h-4 text-blue-600" /></a>
                        )}
                        {profile.socialLinks.instagram && (
                          <a href={profile.socialLinks.instagram} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl transition-all"><IGIcon className="w-4 h-4 text-pink-600" /></a>
                        )}
                        {profile.socialLinks.twitter && (
                          <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl transition-all"><TWIcon className="w-4 h-4 text-sky-500" /></a>
                        )}
                        {profile.socialLinks.linkedin && (
                          <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl transition-all"><LNIcon className="w-4 h-4 text-blue-700" /></a>
                        )}
                        {profile.socialLinks.youtube && (
                          <a href={profile.socialLinks.youtube} target="_blank" rel="noreferrer" className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl transition-all"><YTIcon className="w-4 h-4 text-rose-600" /></a>
                        )}
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}

            {/* Bottom Actions Row */}
            {role !== 'receptionist' && activeTab !== 'preview' && (
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="bg-[#7C3AED] hover:bg-purple-800 text-white text-xs font-bold py-2.5 px-6 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm transition-colors"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>
            )}

          </form>

        </div>

      </div>

    </div>
  );
};

export default HospitalProfileScreen;
