import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    Users,
    Wallet,
    Settings,
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
    Contact,
    Bell,
    ShieldCheck,
    MessageCircle,
    CalendarCheck
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
    { name: 'Notifications', path: '/notifications', icon: Bell, roles: ['doctor', 'clinic', 'hospital', 'pharmacy', 'diagnostic', 'homecare', 'ambulance'], badge: 8 },
    { name: 'Profile', path: '/profile', icon: Users, roles: ['doctor', 'clinic'] },

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
    const location = useLocation();
    const visibleNavItems = allNavItems.filter(item => item.roles.includes(role));
    
    const isReviewsPage = location.pathname.includes('/reviews');
    const isNotificationsPage = location.pathname.includes('/notifications');
    const isAvailabilityPage = location.pathname.includes('/availability');

    return (
        <div className={`
      fixed inset-y-0 left-0 z-50 w-60 bg-white flex flex-col border-r border-slate-200
      transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>

            {/* Brand Header */}
            <div className="h-16 flex items-center justify-between px-5 shrink-0 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                    <img src={logoImg} alt="VIZITO Logo" className="h-9 w-auto object-contain" />
                    <div>
                        <span className="block text-base font-extrabold text-slate-900 leading-tight">Viziito</span>
                        <span className="block text-[9px] font-medium text-slate-400 leading-tight">Your Health. Connected.</span>
                    </div>
                </div>
                {/* Close Button on Mobile */}
                <button
                    onClick={onClose}
                    className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5" style={{ scrollbarWidth: 'none' }}>
                {visibleNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 group ${isActive
                                    ? 'bg-teal-600 text-white font-semibold'
                                    : 'text-slate-600 hover:bg-slate-50 font-medium'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <div className="flex items-center gap-3">
                                        <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-600'} transition-colors`} />
                                        <span className="text-[13px]">{item.name}</span>
                                    </div>
                                    {'badge' in item && item.badge && !isActive && (
                                        <span className="text-[10px] font-bold bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                            {item.badge}
                                        </span>
                                    )}
                                </>
                            )}
                        </NavLink>
                    );
                })}

                {/* Settings & Help */}
                <div className="pt-2 mt-2 border-t border-slate-100 space-y-0.5">
                    <NavLink
                        to="/settings"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${isActive
                                ? 'bg-teal-600 text-white font-semibold'
                                : 'text-slate-600 hover:bg-slate-50 font-medium'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Settings className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-600'} transition-colors`} />
                                <span className="text-[13px]">Settings</span>
                            </>
                        )}
                    </NavLink>
                    <NavLink
                        to="/help"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${isActive
                                ? 'bg-teal-600 text-white font-semibold'
                                : 'text-slate-600 hover:bg-slate-50 font-medium'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <LifeBuoy className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-600'} transition-colors`} />
                                <span className="text-[13px]">Help & Support</span>
                            </>
                        )}
                    </NavLink>
                </div>
            </div>

            {/* Dynamic Footer Card */}
            <div className="m-3 mt-0 shrink-0 hidden lg:block">
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col items-center text-center">
                    {isReviewsPage ? (
                        <>
                            <div className="relative mb-3 flex items-center justify-center">
                                <MessageCircle className="w-12 h-12 text-teal-600 stroke-[1.5]" />
                                <div className="absolute inset-0 flex items-center justify-center -mt-1 gap-0.5">
                                    {[1, 2, 3].map(i => <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" key={i} />)}
                                </div>
                            </div>
                            <h4 className="text-sm font-extrabold text-slate-800 mb-1">Build your reputation</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                                Respond to reviews and build<br />trust with your patients.
                            </p>
                            <button className="w-full bg-teal-700 hover:bg-teal-800 text-white text-[12px] font-bold py-2.5 px-3 rounded-xl transition-colors">
                                Learn More
                            </button>
                        </>
                    ) : isNotificationsPage ? (
                        <>
                            <div className="mb-3 relative">
                                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center">
                                    <Bell className="w-6 h-6 text-teal-500 fill-teal-500" />
                                </div>
                                {/* Sparkles */}
                                <Star className="absolute top-0 right-0 w-3 h-3 text-amber-400 fill-amber-400" />
                                <Star className="absolute bottom-2 left-0 w-2 h-2 text-amber-400 fill-amber-400" />
                            </div>
                            <h4 className="text-sm font-extrabold text-slate-800 mb-1">Stay Updated</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                                Enable push notifications<br />to never miss important<br />updates.
                            </p>
                            <button className="w-full bg-teal-700 hover:bg-teal-800 text-white text-[12px] font-bold py-2.5 px-3 rounded-xl transition-colors">
                                Enable Notifications
                            </button>
                        </>
                    ) : isAvailabilityPage ? (
                        <>
                            <div className="mb-3">
                                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center">
                                    <CalendarCheck className="w-6 h-6 text-teal-600" />
                                </div>
                            </div>
                            <h4 className="text-sm font-extrabold text-slate-800 mb-1">Smart Scheduling</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                                Manage your availability and<br />reduce no-shows.
                            </p>
                            <button className="w-full bg-teal-700 hover:bg-teal-800 text-white text-[12px] font-bold py-2.5 px-3 rounded-xl transition-colors">
                                Learn More
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="mb-3">
                                <ShieldCheck className="w-10 h-10 text-teal-600" />
                            </div>
                            <h4 className="text-sm font-extrabold text-slate-800 mb-1">Your Account is Secure</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                                We keep your data safe<br />and protected.
                            </p>
                            <button className="w-full bg-teal-700 hover:bg-teal-800 text-white text-[12px] font-bold py-2.5 px-3 rounded-xl transition-colors">
                                Learn More
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SidebarEngine;
