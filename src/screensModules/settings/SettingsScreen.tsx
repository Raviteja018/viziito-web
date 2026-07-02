import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, User, Lock, Bell, Globe, 
  LogOut, ShieldCheck, Check, Eye, ChevronDown, CheckCircle2,
  Calendar, MessageSquare, FileText, CreditCard, Star, AlertCircle, AlertTriangle, Moon
} from 'lucide-react';

const TABS = [
  { id: 'general', label: 'General', icon: SettingsIcon },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Password & Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'language', label: 'Language', icon: Globe },
];

const LANGUAGES = [
  { id: 'en', label: 'English', isDefault: true },
  { id: 'hi', label: 'Hindi', native: 'हिंदी' },
  { id: 'te', label: 'Telugu', native: 'తెలుగు' },
  { id: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { id: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { id: 'mr', label: 'Marathi', native: 'मराठी' },
  { id: 'bn', label: 'Bengali', native: 'বাংলা' },
  { id: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
];

// Reusable Toggle Component
const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
  <button 
    onClick={onChange}
    className={`w-11 h-6 rounded-full flex items-center transition-colors px-0.5 ${enabled ? 'bg-teal-600' : 'bg-slate-300'}`}
  >
    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

// Reusable Checkbox Component
const Checkbox = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button 
    onClick={onChange}
    className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
      checked ? 'bg-teal-600 border-teal-600' : 'bg-white border-slate-300 hover:border-teal-400'
    }`}
  >
    {checked && <Check className="w-3.5 h-3.5 text-white" />}
  </button>
);

export default function SettingsScreen() {
  const [activeTab, setActiveTab] = useState('general');
  const [genToggles, setGenToggles] = useState({
    appointments: true,
    messages: true,
    payments: true,
    system: true,
  });
  const [lang, setLang] = useState('en');
  const [twoFa, setTwoFa] = useState(true);
  const [quietHours, setQuietHours] = useState(false);

  // Notification Matrix State
  const [notifMatrix, setNotifMatrix] = useState<Record<string, { inApp: boolean, email: boolean, sms: boolean }>>({
    appointments: { inApp: true, email: true, sms: false },
    messages: { inApp: true, email: true, sms: false },
    prescriptions: { inApp: true, email: false, sms: false },
    payments: { inApp: true, email: true, sms: false },
    reviews: { inApp: true, email: true, sms: false },
    system: { inApp: true, email: true, sms: false },
    alerts: { inApp: true, email: true, sms: true },
  });

  const toggleMatrix = (row: string, col: 'inApp' | 'email' | 'sms') => {
    setNotifMatrix(prev => ({
      ...prev,
      [row]: { ...prev[row], [col]: !prev[row][col] }
    }));
  };

  return (
    <div className="animate-fade">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account and application preferences.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Sidebar */}
        <div className="w-full lg:w-64 shrink-0 space-y-2">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                  isActive 
                    ? 'bg-teal-50 text-teal-700' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 w-full">
          {/* ──────────────────────────────────────────────────────────── */}
          {/* GENERAL TAB */}
          {/* ──────────────────────────────────────────────────────────── */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              {/* General Settings */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-base font-bold text-slate-800">General Settings</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Manage your basic application preferences.</p>
                  </div>
                  <button className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors">
                    Save Changes
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Start of the Week</label>
                  <div className="relative max-w-xs">
                    <select className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400">
                      <option>Monday</option>
                      <option>Sunday</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h2 className="text-base font-bold text-slate-800">Notification Preferences</h2>
                <p className="text-sm text-slate-500 mt-0.5 mb-6">Choose what you want to be notified about.</p>
                <div className="space-y-0 divide-y divide-slate-100">
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Appointment reminders</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Receive alerts for upcoming appointments</p>
                    </div>
                    <Toggle enabled={genToggles.appointments} onChange={() => setGenToggles(p => ({...p, appointments: !p.appointments}))} />
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Patient messages</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Receive notifications for new messages from patients</p>
                    </div>
                    <Toggle enabled={genToggles.messages} onChange={() => setGenToggles(p => ({...p, messages: !p.messages}))} />
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Payments and settlements</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Receive alerts for payments and settlements</p>
                    </div>
                    <Toggle enabled={genToggles.payments} onChange={() => setGenToggles(p => ({...p, payments: !p.payments}))} />
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">System updates</h3>
                      <p className="text-xs text-slate-500 mt-0.5">Receive important updates and announcements</p>
                    </div>
                    <Toggle enabled={genToggles.system} onChange={() => setGenToggles(p => ({...p, system: !p.system}))} />
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-base font-bold text-slate-800">Account Actions</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Manage your account related settings.</p>
                </div>
                <button className="flex items-center justify-center gap-2 border border-rose-200 text-rose-600 hover:bg-rose-50 px-6 py-2.5 rounded-xl text-sm font-bold transition-colors">
                  <LogOut className="w-4 h-4" />
                  Log Out
                </button>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────── */}
          {/* PROFILE TAB */}
          {/* ──────────────────────────────────────────────────────────── */}
          {activeTab === 'profile' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Profile</h2>
                  <p className="text-sm text-slate-500 mt-0.5">View and update your personal information.</p>
                </div>
                <button className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors">
                  <User className="w-4 h-4" /> Edit Profile
                </button>
              </div>

              {/* Avatar Section */}
              <div className="flex items-center gap-5 mb-8">
                <div className="relative">
                  <img src="https://i.pravatar.cc/150?u=dr_rahul" alt="Doctor" className="w-20 h-20 rounded-full border-2 border-slate-100 object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-slate-800">Dr. Rahul Sharma</h3>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-600 mt-0.5">Cardiologist</p>
                  <p className="text-xs text-slate-500 mt-0.5">MD, DM - Cardiology</p>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Reg. No. CARD/2010/45872
                  </p>
                </div>
              </div>

              {/* Form Grid */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Full Name</label>
                      <input type="text" defaultValue="Dr. Rahul Sharma" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-teal-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Email Address</label>
                      <input type="email" defaultValue="rahul.sharma@vizito.com" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-teal-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Phone Number</label>
                      <input type="tel" defaultValue="+91 98765 43210" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-teal-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Date of Birth</label>
                      <input type="text" defaultValue="15 Aug 1985" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-teal-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Gender</label>
                      <div className="relative">
                        <select className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-700 focus:outline-none focus:border-teal-400">
                          <option>Male</option>
                          <option>Female</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Specialization</label>
                      <div className="relative">
                        <select className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-700 focus:outline-none focus:border-teal-400">
                          <option>Cardiologist</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Professional Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Qualification</label>
                      <input type="text" defaultValue="MD, DM - Cardiology" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-teal-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Experience</label>
                      <input type="text" defaultValue="12 Years" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-teal-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Registration Number</label>
                      <input type="text" defaultValue="CARD/2010/45872" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-teal-400" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Consultation Type</label>
                      <div className="relative">
                        <select className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-700 focus:outline-none focus:border-teal-400">
                          <option>In-Clinic & Video Consultation</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">Clinic / Hospital</label>
                      <div className="relative">
                        <select className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-700 focus:outline-none focus:border-teal-400">
                          <option>VIZITO Health Clinic</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">About Me</label>
                      <div className="relative">
                        <textarea rows={3} defaultValue="Experienced Cardiologist with over 12 years of expertise in diagnosing and treating heart conditions. Dedicated to providing patient-centric care with a focus on preventive cardiology." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-teal-400 resize-none" />
                        <span className="absolute bottom-3 right-3 text-[10px] text-slate-400">160/250</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <button className="px-6 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-bold transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────── */}
          {/* PASSWORD & SECURITY TAB */}
          {/* ──────────────────────────────────────────────────────────── */}
          {activeTab === 'security' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm space-y-10">
              
              {/* Header */}
              <div>
                <h2 className="text-lg font-bold text-slate-800">Password & Security</h2>
                <p className="text-sm text-slate-500 mt-0.5">Update your password and manage account security.</p>
              </div>

              {/* Change Password */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-800">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Current Password</label>
                    <div className="relative">
                      <input type="password" defaultValue="••••••••••" className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-teal-400 tracking-widest" />
                      <Eye className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 cursor-pointer" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">New Password</label>
                    <div className="relative">
                      <input type="password" defaultValue="••••••••••••" className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-teal-400 tracking-widest" />
                      <Eye className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 cursor-pointer" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Confirm New Password</label>
                    <div className="relative">
                      <input type="password" defaultValue="••••••••••••" className="w-full pl-4 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-teal-400 tracking-widest" />
                      <Eye className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 cursor-pointer" />
                    </div>
                  </div>
                </div>

                {/* Password Rules */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-start gap-4 mt-2">
                  <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-slate-700 mb-2">Password must contain:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                      <div className="flex items-center gap-2 text-[11px] text-slate-600"><Check className="w-3.5 h-3.5 text-teal-500" /> At least 8 characters</div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-600"><Check className="w-3.5 h-3.5 text-teal-500" /> One number (0-9)</div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-600"><Check className="w-3.5 h-3.5 text-teal-500" /> One uppercase letter (A-Z)</div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-600"><Check className="w-3.5 h-3.5 text-teal-500" /> One special character (!@#$%^&*)</div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-600"><Check className="w-3.5 h-3.5 text-teal-500" /> One lowercase letter (a-z)</div>
                    </div>
                  </div>
                </div>

                <button className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors mt-2">
                  Update Password
                </button>
              </div>

              {/* 2FA */}
              <div className="pt-8 border-t border-slate-100 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Two-Factor Authentication (2FA)</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Add an extra layer of security to your account.</p>
                </div>
                <div className="flex items-center justify-between bg-teal-50/50 border border-teal-100 rounded-xl p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0">
                      <ShieldCheck className="w-5 h-5 text-teal-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Two-Factor Authentication</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Protect your account by enabling 2FA.</p>
                    </div>
                  </div>
                  <Toggle enabled={twoFa} onChange={() => setTwoFa(!twoFa)} />
                </div>
                <div className="flex justify-end">
                  <button className="border border-teal-600 text-teal-700 hover:bg-teal-50 px-5 py-2 rounded-xl text-sm font-bold transition-colors">
                    Set Up 2FA
                  </button>
                </div>
              </div>

              {/* Active Sessions */}
              <div className="pt-8 border-t border-slate-100 space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">Active Sessions</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Manage your active sessions on other devices.</p>
                </div>
                <div className="space-y-3">
                  {/* Current */}
                  <div className="flex items-center justify-between p-4 border border-teal-100 bg-teal-50/30 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm shrink-0">
                        <Lock className="w-5 h-5 text-teal-500" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Current Session</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Windows • Chrome • Hyderabad, India</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-teal-700">This Device</span>
                  </div>
                  {/* Mobile */}
                  <div className="flex items-center justify-between p-4 border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center border border-slate-200 shrink-0">
                        <Lock className="w-5 h-5 text-slate-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">Mobile App</h4>
                        <p className="text-xs text-slate-500 mt-0.5">iPhone 14 • VIZITO App • Hyderabad, India</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] text-slate-400">Last active: 2 hours ago</span>
                      <button className="border border-rose-200 text-rose-600 hover:bg-rose-50 px-4 py-1.5 rounded-lg text-xs font-bold transition-colors">
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
                <button className="border border-rose-200 text-rose-600 hover:bg-rose-50 px-5 py-2 rounded-xl text-sm font-bold transition-colors mt-2">
                  Sign Out All Other Sessions
                </button>
              </div>

            </div>
          )}

          {/* ──────────────────────────────────────────────────────────── */}
          {/* NOTIFICATIONS TAB */}
          {/* ──────────────────────────────────────────────────────────── */}
          {activeTab === 'notifications' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm space-y-8">
              
              <div>
                <h2 className="text-lg font-bold text-slate-800">Notification Settings</h2>
                <p className="text-sm text-slate-500 mt-0.5">Choose what you want to be notified about and how.</p>
              </div>

              {/* Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-100 bg-slate-50">
                  <div className="col-span-6 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Notification Preferences</div>
                  <div className="col-span-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">In-App</div>
                  <div className="col-span-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">Email</div>
                  <div className="col-span-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider text-center">SMS</div>
                </div>
                <div className="divide-y divide-slate-100">
                  {[
                    { id: 'appointments', icon: Calendar, title: 'Appointment Reminders', desc: 'Alerts for upcoming appointments and schedule updates.' },
                    { id: 'messages', icon: MessageSquare, title: 'Patient Messages', desc: 'Notifications for new messages from patients.' },
                    { id: 'prescriptions', icon: FileText, title: 'Prescription Updates', desc: 'Alerts when prescriptions are created or updated.' },
                    { id: 'payments', icon: CreditCard, title: 'Payments & Settlements', desc: 'Updates about payments, payouts and settlements.' },
                    { id: 'reviews', icon: Star, title: 'Reviews & Ratings', desc: 'Get notified when you receive a new review or rating.' },
                    { id: 'system', icon: Bell, title: 'System Updates & Announcements', desc: 'Important updates and announcements from VIZITO.' },
                    { id: 'alerts', icon: AlertCircle, title: 'Account Alerts', desc: 'Security alerts and important account notifications.' },
                  ].map((row, idx) => {
                    const Icon = row.icon;
                    const state = notifMatrix[row.id];
                    return (
                      <div key={row.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-50 transition-colors">
                        <div className="col-span-6 flex items-start gap-3">
                          <div className="mt-0.5 w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-teal-600" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800">{row.title}</h4>
                            <p className="text-xs text-slate-500 mt-0.5">{row.desc}</p>
                          </div>
                        </div>
                        <div className="col-span-2 flex justify-center">
                          <Checkbox checked={state.inApp} onChange={() => toggleMatrix(row.id, 'inApp')} />
                        </div>
                        <div className="col-span-2 flex justify-center">
                          <Checkbox checked={state.email} onChange={() => toggleMatrix(row.id, 'email')} />
                        </div>
                        <div className="col-span-2 flex justify-center">
                          <Checkbox checked={state.sms} onChange={() => toggleMatrix(row.id, 'sms')} />
                          <ChevronDown className="w-4 h-4 text-slate-400 ml-3" />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Quiet Hours */}
              <div className="border border-slate-200 rounded-2xl p-6 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Moon className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-base font-bold text-slate-800">Quiet Hours</h3>
                  </div>
                  <Toggle enabled={quietHours} onChange={() => setQuietHours(!quietHours)} />
                </div>
                <p className="text-sm text-slate-500 mb-6">Pause non-urgent notifications during these hours.</p>
                
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="flex gap-4 w-full sm:w-auto">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">From</label>
                      <div className="relative">
                        <select className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-teal-400 w-full sm:w-40" disabled={!quietHours}>
                          <option>10:00 PM</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">To</label>
                      <div className="relative">
                        <select className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-teal-400 w-full sm:w-40" disabled={!quietHours}>
                          <option>07:00 AM</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 flex items-start gap-3 flex-1">
                    <AlertCircle className="w-5 h-5 text-teal-600 shrink-0" />
                    <p className="text-xs font-medium text-teal-800 leading-relaxed">
                      You will still receive important alerts related to bookings and account security.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                  <p className="text-[11px] text-slate-400">Changes are saved automatically.</p>
                </div>
              </div>

            </div>
          )}

          {/* ──────────────────────────────────────────────────────────── */}
          {/* LANGUAGE TAB */}
          {/* ──────────────────────────────────────────────────────────── */}
          {activeTab === 'language' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Language</h2>
                <p className="text-sm text-slate-500 mt-0.5">Choose your preferred language for the application.</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4">Select Language</h3>
                <div className="space-y-3">
                  {LANGUAGES.map(l => {
                    const isSelected = lang === l.id;
                    return (
                      <button
                        key={l.id}
                        onClick={() => setLang(l.id)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                          isSelected 
                            ? 'bg-emerald-50/50 border-emerald-200' 
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-6 bg-orange-100 flex overflow-hidden rounded shadow-sm border border-slate-200/50 shrink-0">
                            {/* Simple Indian Flag Representation */}
                            <div className="w-full h-1/3 bg-orange-500" />
                            <div className="w-full h-1/3 bg-white relative flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full border border-blue-800" />
                            </div>
                            <div className="w-full h-1/3 bg-green-600" />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold ${isSelected ? 'text-slate-800' : 'text-slate-700'}`}>
                              {l.label}
                            </span>
                            {l.native && <span className="text-sm text-slate-500 ml-1">{l.native}</span>}
                            {l.isDefault && (
                              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md ml-2">
                                Default
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Radio indicator */}
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          isSelected ? 'border-emerald-600' : 'border-slate-300'
                        }`}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
                  <AlertCircle className="w-4 h-4 text-blue-500" />
                  <p className="text-xs text-slate-600">The language setting will be applied across the application.</p>
                </div>
                <button className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors">
                  Save Changes
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
