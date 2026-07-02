import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarEngine from '../engines/SidebarEngine/SidebarEngine';
import { Bell, Search, Menu, ChevronDown } from 'lucide-react';
import { useRole } from '../store/role/RoleContext';
import type { UserRole } from '../components/UserTypeSelection';

const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { role, setRole } = useRole();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <SidebarEngine isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">

          <div className="flex items-center gap-3 flex-1">
            {/* Hamburger - mobile only */}
            <button
              className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl lg:hidden transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search Bar */}
            <div className="relative max-w-sm w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search patients, appointments, prescriptions..."
                className="w-full pl-9 pr-14 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-400 transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-0.5">
                <kbd className="text-[10px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded px-1 py-0.5">⌘K</kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-teal-500 rounded-full border-2 border-white flex items-center justify-center">
                <span className="text-[8px] font-bold text-white leading-none">6</span>
              </span>
            </button>

            <div className="w-px h-6 bg-slate-200" />

            {/* Doctor Profile */}
            <div className="flex items-center gap-2.5 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0 ring-2 ring-white shadow-sm">
                <div className="w-full h-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">AR</span>
                </div>
              </div>
              <div className="hidden sm:block text-right">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole | 'doctor')}
                  className="block text-sm font-bold text-slate-800 bg-transparent border-none outline-none cursor-pointer appearance-none pr-4"
                  style={{ backgroundImage: 'none' }}
                >
                  <option value="doctor">Dr. Arjun Reddy</option>
                  <option value="patient">Meera (Patient)</option>
                  <option value="clinic">City Care (Clinic)</option>
                  <option value="hospital">Apollo (Hospital)</option>
                  <option value="pharmacy">MediPlus (Pharmacy)</option>
                  <option value="diagnostic">Dr Lal (Diagnostic)</option>
                  <option value="homecare">Portea (Home Care)</option>
                  <option value="ambulance">RedCross (Ambulance)</option>
                </select>
                <p className="text-[11px] text-slate-400 leading-none mt-0.5">Cardiologist</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-5 lg:p-6">
          <div className="mx-auto max-w-[1400px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
