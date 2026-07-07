import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, User, Lock, Bell, Globe, 
  LogOut, ShieldCheck, Check, Eye, ChevronDown, CheckCircle2,
  Calendar, MessageSquare, FileText, CreditCard, Star, AlertCircle, AlertTriangle, Moon
} from 'lucide-react';
import { useLanguage, type Language } from '../../store/language/LanguageContext';

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
  { id: 'kn', label: 'Kannada', native: 'కನ್ನಡ' },
  { id: 'mr', label: 'Marathi', native: 'మరాठी' },
  { id: 'bn', label: 'Bengali', native: 'বাংলা' },
  { id: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
];

// Reusable Toggle Component
const Toggle = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
  <button 
    type="button"
    onClick={onChange}
    className={`w-11 h-6 rounded-full flex items-center transition-colors px-0.5 cursor-pointer ${enabled ? 'bg-teal-650' : 'bg-slate-300'}`}
  >
    <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

// Reusable Checkbox Component
const Checkbox = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button 
    type="button"
    onClick={onChange}
    className={`w-5 h-5 rounded flex items-center justify-center border transition-colors cursor-pointer ${
      checked ? 'bg-teal-650 border-teal-650' : 'bg-white border-slate-300 hover:border-teal-400'
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
  
  const { language, setLanguage, t } = useLanguage();
  const [lang, setLang] = useState<Language>(language);
  const [twoFa, setTwoFa] = useState(true);
  const [quietHours, setQuietHours] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveLanguage = () => {
    setLanguage(lang);
    const selectedLangName = LANGUAGES.find(l => l.id === lang)?.label || lang;
    showToast(`Language updated to "${selectedLangName}" successfully!`, 'success');
  };

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
    <div className="animate-fade relative">
      {/* Toast Alert popup */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-fade flex items-center gap-3 bg-slate-900 border border-slate-800 text-white px-5 py-3.5 rounded-2xl shadow-xl max-w-sm text-left">
          <div className="w-2 h-2 rounded-full shrink-0 bg-teal-500" />
          <p className="text-xs font-bold text-white">{toast.message}</p>
        </div>
      )}

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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
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

        {/* Right Content Area */}
        <div className="flex-1 w-full min-w-0">
          
          {/* ──────────────────────────────────────────────────────────── */}
          {/* GENERAL TAB */}
          {/* ──────────────────────────────────────────────────────────── */}
          {activeTab === 'general' && (
            <div className="space-y-6 animate-fade">
              {/* General Settings */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-base font-bold text-slate-800">General Settings</h2>
                    <p className="text-sm text-slate-500 mt-0.5">Manage your basic application preferences.</p>
                  </div>
                  <button 
                    onClick={() => showToast('General settings saved successfully!', 'success')}
                    className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Start of the Week</label>
                  <div className="relative max-w-xs">
                    <select className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 cursor-pointer">
                      <option>Monday</option>
                      <option>Sunday</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Notification Toggles */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <div className="mb-6">
                  <h2 className="text-base font-bold text-slate-800">In-App Quick Updates</h2>
                  <p className="text-sm text-slate-500 mt-0.5">Control which real-time notifications show up on your screen header badge.</p>
                </div>
                <div className="divide-y divide-slate-100">
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <span className="text-sm font-bold text-slate-700">Appointment Updates</span>
                      <p className="text-xs text-slate-400 mt-0.5">Get notified when patients book or reschedule.</p>
                    </div>
                    <Toggle enabled={genToggles.appointments} onChange={() => setGenToggles({...genToggles, appointments: !genToggles.appointments})} />
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <span className="text-sm font-bold text-slate-700">Patient Messages</span>
                      <p className="text-xs text-slate-400 mt-0.5">Alerts for new chat consults and messages.</p>
                    </div>
                    <Toggle enabled={genToggles.messages} onChange={() => setGenToggles({...genToggles, messages: !genToggles.messages})} />
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <span className="text-sm font-bold text-slate-700">Settlements &amp; Payments</span>
                      <p className="text-xs text-slate-400 mt-0.5">Get updates when payouts are processed.</p>
                    </div>
                    <Toggle enabled={genToggles.payments} onChange={() => setGenToggles({...genToggles, payments: !genToggles.payments})} />
                  </div>
                  <div className="flex items-center justify-between py-4">
                    <div>
                      <span className="text-sm font-bold text-slate-700">System News</span>
                      <p className="text-xs text-slate-400 mt-0.5">Broadcast and version update notes.</p>
                    </div>
                    <Toggle enabled={genToggles.system} onChange={() => setGenToggles({...genToggles, system: !genToggles.system})} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────── */}
          {/* PROFILE TAB */}
          {/* ──────────────────────────────────────────────────────────── */}
          {activeTab === 'profile' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm animate-fade">
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 font-extrabold">Public Profile Details</h2>
                  <p className="text-sm text-slate-500 mt-0.5">This information will be displayed on the platform search for patients.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">First Name *</label>
                    <input type="text" defaultValue="Arjun" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-teal-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Last Name *</label>
                    <input type="text" defaultValue="Reddy" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-teal-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Email Address *</label>
                    <input type="email" defaultValue="dr.arjun@viziito.com" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-teal-400" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Contact Number *</label>
                    <input type="text" defaultValue="+91 98765 43210" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-teal-400" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">Bio / Medical Statement</label>
                    <textarea defaultValue="Senior cardiologist with over 12 years of clinical experience in interventional cardiology and vascular management." className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:border-teal-400 min-h-[90px]" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <button 
                  onClick={() => showToast('Profile updates cancelled.', 'info')}
                  className="px-6 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => showToast('Profile details updated successfully!', 'success')}
                  className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-sm font-bold transition-colors cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────── */}
          {/* PASSWORD & SECURITY TAB */}
          {/* ──────────────────────────────────────────────────────────── */}
          {activeTab === 'security' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm space-y-10 animate-fade">
              
              {/* Header */}
              <div>
                <h2 className="text-lg font-bold text-slate-800">Password &amp; Security</h2>
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

                <button 
                  onClick={() => showToast('Password updated successfully!', 'success')}
                  className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2 rounded-xl text-sm font-bold transition-colors mt-2 cursor-pointer animate-fade"
                >
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
                  <Toggle enabled={twoFa} onChange={() => {
                    const next = !twoFa;
                    setTwoFa(next);
                    showToast(next ? 'Two-Factor Authentication enabled!' : 'Two-Factor Authentication disabled!', 'info');
                  }} />
                </div>
                <div className="flex justify-end">
                  <button 
                    onClick={() => showToast('2FA Setup Wizard launched.', 'info')}
                    className="border border-teal-650 text-teal-700 hover:bg-teal-50 px-5 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer"
                  >
                    Set Up 2FA
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────── */}
          {/* NOTIFICATIONS TAB */}
          {/* ──────────────────────────────────────────────────────────── */}
          {activeTab === 'notifications' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm space-y-8 animate-fade">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Notifications</h2>
                <p className="text-sm text-slate-500 mt-0.5">Customize your notification delivery preferences.</p>
              </div>

              {/* Matrix Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="pb-3 text-xs font-bold text-slate-700 uppercase">Notification Type</th>
                      <th className="pb-3 text-xs font-bold text-slate-700 uppercase text-center">In-App</th>
                      <th className="pb-3 text-xs font-bold text-slate-700 uppercase text-center">Email</th>
                      <th className="pb-3 text-xs font-bold text-slate-700 uppercase text-center">SMS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { id: 'appointments', label: 'Appointment Status', desc: 'Alerts when updates occur on slots' },
                      { id: 'messages', label: 'Consultation Chat Messages', desc: 'Direct messages from patient profiles' },
                      { id: 'prescriptions', label: 'Prescriptions Alerts', desc: 'Notifications on generated medicine cards' },
                      { id: 'payments', label: 'Revenue & Payouts Updates', desc: 'When platform transfers complete' },
                      { id: 'reviews', label: 'Patient Reviews & Ratings', desc: 'New feedback postings from patients' },
                      { id: 'system', label: 'Viziito Broadcasts', desc: 'Periodic platform feature reports' },
                      { id: 'alerts', label: 'Security & Auth Warnings', desc: 'Login alerts or credential adjustments' },
                    ].map(row => (
                      <tr key={row.id}>
                        <td className="py-4 pr-4">
                          <span className="text-sm font-bold text-slate-800 block">{row.label}</span>
                          <span className="text-xs text-slate-400">{row.desc}</span>
                        </td>
                        <td className="py-4 text-center">
                          <div className="inline-block">
                            <Checkbox checked={notifMatrix[row.id].inApp} onChange={() => toggleMatrix(row.id, 'inApp')} />
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <div className="inline-block">
                            <Checkbox checked={notifMatrix[row.id].email} onChange={() => toggleMatrix(row.id, 'email')} />
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <div className="inline-block">
                            <Checkbox checked={notifMatrix[row.id].sms} onChange={() => toggleMatrix(row.id, 'sms')} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Quiet Hours */}
              <div className="pt-8 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Quiet Hours</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Mute specific notification alerts during select intervals.</p>
                  </div>
                  <Toggle enabled={quietHours} onChange={() => setQuietHours(!quietHours)} />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                  <div className="flex items-center gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">From</label>
                      <div className="relative">
                        <select className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-teal-400 w-full sm:w-40 cursor-pointer" disabled={!quietHours}>
                          <option>10:00 PM</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1.5">To</label>
                      <div className="relative">
                        <select className="appearance-none bg-white border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold text-slate-700 focus:outline-none focus:border-teal-400 w-full sm:w-40 cursor-pointer" disabled={!quietHours}>
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
            <div className="bg-white border border-slate-200 rounded-2xl p-6 lg:p-8 shadow-sm space-y-6 animate-fade">
              <div>
                <h2 className="text-lg font-bold text-slate-800 font-extrabold">Language Preferences</h2>
                <p className="text-sm text-slate-500 mt-0.5">Choose your preferred language for the application.</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-4">Select Language</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {LANGUAGES.map(l => {
                    const isSelected = lang === l.id;
                    return (
                      <button
                        type="button"
                        key={l.id}
                        onClick={() => setLang(l.id)}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer text-left ${
                          isSelected 
                            ? 'bg-emerald-50/50 border-emerald-350 shadow-xs' 
                            : 'bg-white border-slate-200 hover:border-slate-350'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-6 bg-slate-100 flex overflow-hidden rounded shadow-sm border border-slate-200/50 shrink-0">
                            {/* Simple Indian Flag Representation */}
                            <div className="w-full h-1/3 bg-orange-500" />
                            <div className="w-full h-1/3 bg-white relative flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full border border-blue-800" />
                            </div>
                            <div className="w-full h-1/3 bg-green-600" />
                          </div>
                          <div className="flex flex-col">
                            <span className={`text-sm font-bold ${isSelected ? 'text-slate-800' : 'text-slate-700'}`}>
                              {l.label}
                            </span>
                            {l.native && <span className="text-[10px] text-slate-400 font-medium">{l.native}</span>}
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
                  <p className="text-xs text-slate-650 font-medium">The language setting will be applied across the application.</p>
                </div>
                <button 
                  type="button"
                  onClick={handleSaveLanguage}
                  className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-colors cursor-pointer shrink-0"
                >
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
