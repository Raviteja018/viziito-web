import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Key, 
  Smartphone, 
  Mail,
  ToggleLeft,
  ToggleRight,
  Monitor
} from 'lucide-react';

export default function SettingsScreen() {
  const [activeTab, setActiveTab] = useState('account');
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    weeklyReports: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="w-full animate-fade space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-800 flex items-center gap-3">
          <Settings className="w-8 h-8 text-teal-600" />
          Platform Settings
        </h1>
        <p className="text-slate-500 font-medium mt-2">
          Manage your account preferences, security, and notifications.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-2 space-y-1">
            <button 
              onClick={() => setActiveTab('account')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'account' 
                  ? 'bg-teal-50 text-teal-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <User className="w-5 h-5" /> Account Profile
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'security' 
                  ? 'bg-teal-50 text-teal-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Shield className="w-5 h-5" /> Security & Login
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'notifications' 
                  ? 'bg-teal-50 text-teal-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Bell className="w-5 h-5" /> Notifications
            </button>
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 sm:p-8 min-h-[500px]">
            
            {/* ACCOUNT TAB */}
            {activeTab === 'account' && (
              <div className="space-y-6 animate-fade">
                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Account Profile</h2>
                
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 text-3xl font-black border-4 border-white shadow-md">
                    Dr
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold rounded-xl text-sm transition-colors">
                      Change Avatar
                    </button>
                    <p className="text-xs text-slate-500 mt-2 font-medium">JPEG or PNG under 5MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Display Name</label>
                    <input type="text" defaultValue="Dr. Sarah Jenkins" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium text-slate-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                    <input type="email" defaultValue="sarah.jenkins@hospital.com" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium text-slate-800" disabled />
                    <p className="text-[10px] text-slate-400 mt-1">Contact support to change your primary email.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Primary Phone</label>
                    <input type="tel" defaultValue="+91 98765 43210" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium text-slate-800" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Timezone</label>
                    <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium text-slate-800 appearance-none">
                      <option>(GMT+05:30) India Standard Time</option>
                      <option>(GMT+00:00) London</option>
                      <option>(GMT-05:00) Eastern Time</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-sm transition-colors shadow-md shadow-teal-500/20">
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-fade">
                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Security & Login</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200/60 bg-slate-50/50">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-teal-100 text-teal-600 rounded-lg shrink-0">
                        <Key className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">Password</h3>
                        <p className="text-xs text-slate-500 mt-1">Last changed 3 months ago</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 border border-slate-300 hover:border-teal-400 hover:text-teal-600 font-bold rounded-xl text-xs transition-colors bg-white">
                      Update Password
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200/60 bg-slate-50/50">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg shrink-0">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">Two-Factor Authentication (2FA)</h3>
                        <p className="text-xs text-slate-500 mt-1">Protect your account with an extra layer of security using SMS or an Authenticator App.</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors whitespace-nowrap">
                      Enable 2FA
                    </button>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-800 mb-4 mt-8">Active Sessions</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border border-teal-100 bg-teal-50/30 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Monitor className="w-5 h-5 text-teal-500" />
                          <div>
                            <p className="text-sm font-bold text-slate-800">Mac OS • Chrome</p>
                            <p className="text-xs text-slate-500">Mumbai, India • Active Now</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-100 px-2 py-1 rounded-md">This Device</span>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl">
                        <div className="flex items-center gap-3">
                          <Smartphone className="w-5 h-5 text-slate-400" />
                          <div>
                            <p className="text-sm font-bold text-slate-800">iPhone 14 Pro • Safari</p>
                            <p className="text-xs text-slate-500">Pune, India • 2 days ago</p>
                          </div>
                        </div>
                        <button className="text-xs font-bold text-rose-500 hover:underline">Revoke</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <div className="space-y-6 animate-fade">
                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Notification Preferences</h2>
                
                <div className="space-y-4 max-w-2xl">
                  
                  {/* Toggle Item */}
                  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">Email Alerts</h3>
                        <p className="text-xs text-slate-500 mt-1">Receive daily summaries and critical account alerts via email.</p>
                      </div>
                    </div>
                    <button onClick={() => toggleNotification('emailAlerts')} className="text-teal-600 focus:outline-none">
                      {notifications.emailAlerts ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10 text-slate-300" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <Smartphone className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">SMS Alerts</h3>
                        <p className="text-xs text-slate-500 mt-1">Get instant text messages for new appointments or cancellations.</p>
                      </div>
                    </div>
                    <button onClick={() => toggleNotification('smsAlerts')} className="text-teal-600 focus:outline-none">
                      {notifications.smsAlerts ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10 text-slate-300" />}
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <Bell className="w-5 h-5 text-slate-400 mt-0.5" />
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">Push Notifications</h3>
                        <p className="text-xs text-slate-500 mt-1">Receive browser notifications when the portal is open.</p>
                      </div>
                    </div>
                    <button onClick={() => toggleNotification('pushNotifications')} className="text-teal-600 focus:outline-none">
                      {notifications.pushNotifications ? <ToggleRight className="w-10 h-10" /> : <ToggleLeft className="w-10 h-10 text-slate-300" />}
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
