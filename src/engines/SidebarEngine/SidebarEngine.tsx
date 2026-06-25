import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Users,
    Wallet,
    Settings,
    ChevronRight,
    LogOut,
    FileText,
    Clock,
    Star,
    LifeBuoy,
    X,
    Search,
    Pill,
    HeartPulse,
    BedDouble,
    Ambulance,
    Building2,
    Package,
    ClipboardList,
    Microscope,
    TestTubes,
    FileCheck,
    HeartHandshake,
    UsersRound,
    CalendarClock,
    Siren,
    Contact
} from 'lucide-react';
import { useRole } from '../../store/role/RoleContext';

import logoImg from '../../assets/vizito_logo.png';

const allNavItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['doctor', 'clinic', 'patient', 'hospital', 'pharmacy', 'diagnostic', 'homecare', 'ambulance'] },
    // Doctor & Clinic Nav
    { name: 'Appointment Management', path: '/appointments', icon: Calendar, roles: ['doctor', 'clinic'] },
    { name: 'Prescription Management', path: '/prescriptions', icon: FileText, roles: ['doctor'] },
    { name: 'Patient Management', path: '/patients', icon: Users, roles: ['doctor', 'clinic', 'hospital'] },
    { name: 'Revenue & Settlement', path: '/revenue', icon: Wallet, roles: ['doctor', 'clinic', 'hospital', 'pharmacy', 'diagnostic', 'homecare', 'ambulance'] },
    { name: 'Availability Management', path: '/availability', icon: Clock, roles: ['doctor'] },
    { name: 'Reviews & Ratings', path: '/reviews', icon: Star, roles: ['doctor', 'clinic', 'hospital', 'pharmacy', 'diagnostic', 'homecare', 'ambulance'] },
    
    // Patient Nav
    { name: 'Find Doctors & Clinics', path: '/find-doctors', icon: Search, roles: ['patient'] },
    { name: 'My Consultations', path: '/my-consultations', icon: Calendar, roles: ['patient'] },
    { name: 'Records & Reports', path: '/my-records', icon: HeartPulse, roles: ['patient'] },
    { name: 'Pharmacy Orders', path: '/pharmacy-orders', icon: Pill, roles: ['patient'] },
    { name: 'Family Profiles', path: '/family-profiles', icon: Users, roles: ['patient'] },

    // Hospital Nav
    { name: 'Bed Availability', path: '/hospital-beds', icon: BedDouble, roles: ['hospital'] },
    { name: 'Emergency & Ambulance', path: '/hospital-emergency', icon: Ambulance, roles: ['hospital'] },
    { name: 'Departments & Staff', path: '/hospital-departments', icon: Building2, roles: ['hospital'] },

    // Pharmacy Nav
    { name: 'Inventory & Stock', path: '/pharmacy-inventory', icon: Package, roles: ['pharmacy'] },
    { name: 'Prescription Fulfillment', path: '/pharmacy-prescriptions', icon: ClipboardList, roles: ['pharmacy'] },

    // Diagnostic Nav
    { name: 'Test Catalog', path: '/lab-tests', icon: TestTubes, roles: ['diagnostic'] },
    { name: 'Lab Appointments', path: '/lab-appointments', icon: Microscope, roles: ['diagnostic'] },
    { name: 'Reports & Results', path: '/lab-reports', icon: FileCheck, roles: ['diagnostic'] },

    // Home Care Nav
    { name: 'Services Catalog', path: '/homecare-services', icon: HeartHandshake, roles: ['homecare'] },
    { name: 'Staff Directory', path: '/homecare-staff', icon: UsersRound, roles: ['homecare'] },
    { name: 'Care Bookings', path: '/homecare-bookings', icon: CalendarClock, roles: ['homecare'] },

    // Ambulance Nav
    { name: 'Emergency Dispatch', path: '/ambulance-dispatch', icon: Siren, roles: ['ambulance'] },
    { name: 'Fleet Management', path: '/ambulance-fleet', icon: Ambulance, roles: ['ambulance'] },
    { name: 'Driver & Staff Roster', path: '/ambulance-drivers', icon: Contact, roles: ['ambulance'] },
];

interface SidebarEngineProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const SidebarEngine: React.FC<SidebarEngineProps> = ({ isOpen = false, onClose }) => {
    const { role } = useRole();
    const visibleNavItems = allNavItems.filter(item => item.roles.includes(role));
    
    const panelTitle = role === 'patient' ? 'Patient Portal' : role === 'hospital' ? 'Command Center' : role === 'pharmacy' ? 'Pharmacy Panel' : role === 'diagnostic' ? 'Lab Portal' : role === 'homecare' ? 'Homecare Admin' : role === 'ambulance' ? 'Dispatch Control' : role === 'clinic' ? 'Clinic Panel' : 'Doctor Panel';

    return (
        <div className={`
      fixed inset-y-0 left-0 z-50 w-72 bg-slate-50 flex flex-col border-r border-slate-200/60 shadow-xl lg:shadow-none
      transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>

            {/* Brand Header */}
            <div className="h-16 lg:h-20 flex items-center justify-between px-6 mb-2 shrink-0 border-b border-slate-200/60 lg:border-none">

                <div className="flex items-center gap-3">
                    <img src={logoImg} alt="VIZITO Logo" className="h-12 w-auto object-contain" />
                    <div>
                        <span className="text-lg lg:text-xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent tracking-tight">Viziito</span>
                        <span className="block text-[9px] lg:text-[10px] font-bold text-teal-600 uppercase tracking-widest mt-0.5">{panelTitle}</span>
                    </div>
                </div>
                {/* Close Button on Mobile */}
                <button
                    onClick={onClose}
                    className="lg:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-4 custom-scrollbar pb-6 mt-2 lg:mt-0">
                <div className="space-y-1.5">
                    <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 lg:mt-4">
                        Core Modules
                    </p>
                    {visibleNavItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                onClick={onClose} // Close sidebar on mobile when navigating
                                className={({ isActive }) =>
                                    `flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${isActive
                                        ? 'bg-teal-600 text-white font-bold shadow-md shadow-teal-500/20'
                                        : 'text-slate-500 hover:bg-white hover:shadow-sm hover:text-slate-900 font-medium'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {/* Active Indicator Line */}
                                        {isActive && (
                                            <div className="absolute left-0 top-0 w-1 h-full bg-teal-400 rounded-r-full" />
                                        )}

                                        <div className="flex items-center gap-3 relative z-10">
                                            <Icon className={`w-5 h-5 transition-colors duration-200 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-600'}`} />
                                            <span className="text-sm">{item.name}</span>
                                        </div>
                                        {isActive && (
                                            <ChevronRight className={`w-4 h-4 relative z-10 ${isActive ? 'text-teal-200' : 'text-transparent group-hover:text-slate-300'}`} />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </div>
            </div>

            {/* Footer Support & Settings */}
            <div className="p-4 border-t border-slate-200/60 bg-slate-100/50 mt-auto shrink-0">
                <div className="space-y-1">
                    <NavLink
                        to="/help"
                        onClick={onClose}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm font-medium transition-all group"
                    >
                        <LifeBuoy className="w-5 h-5 text-slate-400 group-hover:text-teal-600 transition-colors" />
                        <span className="text-sm">Help & Support</span>
                    </NavLink>

                    <NavLink
                        to="/settings"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${isActive
                                ? 'bg-teal-600 text-white font-bold shadow-md'
                                : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm font-medium'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Settings className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}`} />
                                <span className="text-sm">Settings</span>
                            </>
                        )}
                    </NavLink>

                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:bg-rose-50 hover:text-rose-600 font-medium transition-all group mt-2">
                        <LogOut className="w-5 h-5 text-slate-400 group-hover:text-rose-500 transition-colors" />
                        <span className="text-sm">Sign Out</span>
                    </button>
                </div>
            </div>

        </div>
    );
};

export default SidebarEngine;
