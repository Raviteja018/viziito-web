import  { useState } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarEngine from '../engines/SidebarEngine/SidebarEngine';
import { Bell, Search, User, Menu } from 'lucide-react';
import { useRole } from '../store/role/RoleContext';
import type { UserRole } from '../components/UserTypeSelection';

const MainLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { role, setRole } = useRole();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans relative">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Engine manages the navigation items */}
      <SidebarEngine isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200/60 flex items-center justify-between px-4 sm:px-6 z-10 shrink-0">
          
          <div className="flex items-center gap-3 flex-1">
            {/* Hamburger Menu - Only visible on mobile/tablet */}
            <button 
              className="p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-xl lg:hidden transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Search Bar - Hidden on very small screens, visible on md and up */}
            <div className="relative max-w-md w-full hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search patients, doctors, or reports..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors hidden sm:block">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-3 sm:pl-2">
              <div className="text-right hidden sm:block">
                <select 
                  value={role} 
                  onChange={(e) => setRole(e.target.value as UserRole | 'doctor')}
                  className="text-sm font-semibold text-slate-700 bg-transparent border-none outline-none cursor-pointer appearance-none text-right"
                >
                  <option value="doctor">Dr. Sarah (Doctor)</option>
                  <option value="patient">Meera (Patient)</option>
                  <option value="clinic">City Care (Clinic)</option>
                  <option value="hospital">Apollo (Hospital)</option>
                  <option value="pharmacy">MediPlus (Pharmacy)</option>
                  <option value="diagnostic">Dr Lal (Diagnostic)</option>
                  <option value="homecare">Portea (Home Care)</option>
                  <option value="ambulance">RedCross (Ambulance)</option>
                </select>
                <p className="text-xs text-slate-500 mt-0.5">Role Switcher (Dev)</p>
              </div>
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 border border-teal-200 shrink-0">
                <User className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
