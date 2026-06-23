import { useState } from 'react';
import type { UserRole } from './UserTypeSelection';
import { 
  ShieldCheck, 
  MapPin, 
  UploadCloud, 
  CreditCard, 
  Calendar, 
  Users, 
  Key, 
  Laptop, 
  Smartphone, 
  LogOut, 
  Info,
  Clock,
  Unlock,
  Plus,
  Trash2,
  Lock
} from 'lucide-react';

interface DashboardProps {
  user: any;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'profile-kyc' | 'appointments' | 'patients' | 'security'>('overview');
  
  // Registration data fallback
  const userRole: UserRole = user?.role || 'doctor';
  const userName = user?.fullName || 'Dr. Johnathan Doe';
  const userOrg = user?.orgName || '';

  // Profile completion checklist states
  const [addressCompleted, setAddressCompleted] = useState(false);
  const [docsCompleted, setDocsCompleted] = useState(false);
  const [kycCompleted, setKycCompleted] = useState(false);
  const [bankCompleted, setBankCompleted] = useState(false);
  const [profDetailsVerified, setProfDetailsVerified] = useState(false);

  // Address Fields
  const [country, setCountry] = useState('');
  const [stateName, setStateName] = useState('');
  const [district, setDistrict] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');

  // Documents
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});

  // Bank details
  const [bankHolder, setBankHolder] = useState('');
  const [bankNumber, setBankNumber] = useState('');
  const [bankIfsc, setBankIfsc] = useState('');
  const [bankNameField, setBankNameField] = useState('');

  // Verification Status Flow
  // 'pending' -> 'under_review' -> 'approved'
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'under_review' | 'approved'>('pending');

  // Security Simulation States
  const [twoFactorMobile, setTwoFactorMobile] = useState(false);
  const [twoFactorEmail, setTwoFactorEmail] = useState(false);
  const [sessions, setSessions] = useState([
    { id: '1', device: 'Chrome on Windows Web (This Device)', ip: '192.168.1.45', lastActive: 'Active now' },
    { id: '2', device: 'Safari on iPhone 16 Pro', ip: '192.168.1.102', lastActive: '2 hours ago' },
    { id: '3', device: 'Firefox on macOS Desktop', ip: '10.0.0.12', lastActive: '3 days ago' }
  ]);

  // Appointment Simulator States
  const [appointments, setAppointments] = useState([
    { id: 'APT-101', patientName: 'Emily Watson', date: '2026-06-24', time: '10:00 AM', type: 'Online Consult', status: 'Scheduled' },
    { id: 'APT-102', patientName: 'Marcus Aurelius', date: '2026-06-24', time: '02:30 PM', type: 'In-Clinic Visit', status: 'Confirmed' },
    { id: 'APT-103', patientName: 'Diana Prince', date: '2026-06-25', time: '11:15 AM', type: 'Home Sample Collection', status: 'Pending Approval' }
  ]);
  const [showAptModal, setShowAptModal] = useState(false);
  const [newAptName, setNewAptName] = useState('');
  const [newAptDate, setNewAptDate] = useState('');
  const [newAptTime, setNewAptTime] = useState('');
  const [newAptType, setNewAptType] = useState('Online Consult');

  // Patients Roster Simulator
  const [patients, setPatients] = useState([
    { id: 'PT-880', name: 'Emily Watson', age: 34, gender: 'Female', phone: '98888 77771' },
    { id: 'PT-881', name: 'Marcus Aurelius', age: 52, gender: 'Male', phone: '97777 66662' },
    { id: 'PT-882', name: 'Diana Prince', age: 29, gender: 'Female', phone: '96666 55553' }
  ]);

  // Calculate profile completion score (starts at 35% base registration)
  const calculateProgress = () => {
    let score = 35;
    if (addressCompleted) score += 15;
    if (docsCompleted) score += 15;
    if (kycCompleted) score += 15;
    if (bankCompleted) score += 20;
    return score;
  };

  // Determine allowed vs restricted actions based on status and completion
  const isSettlementEligible = addressCompleted && docsCompleted && bankCompleted && verificationStatus === 'approved';

  // Toggle checklist items
  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (country && stateName && city && pincode && streetAddress) {
      setAddressCompleted(true);
      setActiveTab('overview');
    }
  };

  const handleBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bankHolder && bankNumber && bankIfsc && bankNameField) {
      setBankCompleted(true);
      setKycCompleted(true); // Complete Bank KYC
      setActiveTab('overview');
    }
  };

  const handleFileUpload = (docName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      const nextUploads = { ...uploadedFiles, [docName]: fileName };
      setUploadedFiles(nextUploads);
      
      const required = getRequiredDocs();
      const allUploaded = required.every(d => nextUploads[d]);
      if (allUploaded) {
        setDocsCompleted(true);
      }
    }
  };

  const getRequiredDocs = () => {
    switch (userRole) {
      case 'doctor': return ['Medical Registration Certificate', 'Aadhaar Card', 'PAN Card'];
      case 'hospital': return ['Hospital Registration Certificate', 'GST Certificate', 'PAN Card'];
      case 'clinic': return ['Clinic Registration Certificate', 'GST Certificate', 'PAN Card'];
      case 'pharmacy': return ['Drug License Certificate', 'GST Certificate', 'PAN Card'];
      case 'diagnostic': return ['Diagnostic Center Registration', 'GST Certificate', 'PAN Card'];
      case 'homecare': return ['Home Care Provider Registration', 'PAN Card'];
      case 'ambulance': return ['Ambulance Operator Registration', 'Vehicle Transport Permits'];
      default: return ['Identity Verification Document', 'PAN Card'];
    }
  };

  const triggerVerificationReview = () => {
    if (calculateProgress() < 100) {
      alert("Please complete all checklist items (100% completion) before requesting verification review.");
      return;
    }
    setVerificationStatus('under_review');
  };

  const simulateAdminApproval = () => {
    setVerificationStatus('approved');
    setProfDetailsVerified(true);
  };

  // Logouts other devices
  const handleLogoutOthers = () => {
    setSessions([
      { id: '1', device: 'Chrome on Windows Web (This Device)', ip: '192.168.1.45', lastActive: 'Active now' }
    ]);
  };

  // Add Appointment
  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAptName && newAptDate && newAptTime) {
      const newApt = {
        id: `APT-${Math.floor(104 + Math.random() * 900)}`,
        patientName: newAptName,
        date: newAptDate,
        time: newAptTime,
        type: newAptType,
        status: 'Scheduled'
      };
      setAppointments([newApt, ...appointments]);
      
      // If patient does not exist, add to roster
      if (!patients.some(p => p.name.toLowerCase() === newAptName.toLowerCase())) {
        setPatients([
          ...patients,
          {
            id: `PT-${Math.floor(883 + Math.random() * 200)}`,
            name: newAptName,
            age: Math.floor(22 + Math.random() * 45),
            gender: Math.random() > 0.5 ? 'Female' : 'Male',
            phone: '98888 ' + Math.floor(10000 + Math.random() * 90000)
          }
        ]);
      }
      
      setShowAptModal(false);
      setNewAptName('');
      setNewAptDate('');
      setNewAptTime('');
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row w-full bg-slate-50 min-h-0 overflow-hidden">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-150 flex flex-col justify-between shrink-0 shadow-xl border-r border-slate-950 md:overflow-y-auto">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-slate-800/60 flex items-center gap-2">
            <span className="p-2.5 rounded-xl bg-teal-600 text-white font-extrabold flex items-center justify-center">
              ✚
            </span>
            <div>
              <span className="text-xl font-black tracking-wider text-teal-400">VIZITO</span>
              <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest leading-none">Web Ecosystem</p>
            </div>
          </div>

          {/* User Info Block */}
          <div className="p-6 border-b border-slate-800/60 bg-slate-950/40">
            <h4 className="font-extrabold text-sm text-teal-350 truncate">
              {userOrg ? userOrg : userName}
            </h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{userRole} profile</p>
            
            {/* Dynamic Status Badge */}
            <div className="mt-3">
              {verificationStatus === 'pending' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-bold text-amber-400">
                  <Clock className="w-3 h-3" /> Incomplete Details
                </span>
              )}
              {verificationStatus === 'under_review' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400">
                  <Clock className="w-3 h-3" /> Under Review
                </span>
              )}
              {verificationStatus === 'approved' && isSettlementEligible && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
                  <ShieldCheck className="w-3 h-3" /> Approved Provider
                </span>
              )}
              {verificationStatus === 'approved' && !isSettlementEligible && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-[10px] font-bold text-rose-450">
                  <Unlock className="w-3 h-3 text-rose-400" /> Pending KYC Setup
                </span>
              )}
            </div>
          </div>

          {/* Tab Navigation Links */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === 'overview' ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/10' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <Info className="w-4.5 h-4.5" /> Overview Dashboard
            </button>
            
            <button
              onClick={() => setActiveTab('profile-kyc')}
              className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                activeTab === 'profile-kyc' ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/10' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-4.5 h-4.5" /> Profile & KYC Setup
              </div>
              <span className="text-[9px] bg-slate-800 px-2 py-0.5 rounded-full font-extrabold text-teal-300 font-mono">
                {calculateProgress()}%
              </span>
            </button>

            <button
              onClick={() => setActiveTab('appointments')}
              className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === 'appointments' ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/10' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <Calendar className="w-4.5 h-4.5" /> Appointments Roster
            </button>

            <button
              onClick={() => setActiveTab('patients')}
              className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === 'patients' ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/10' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <Users className="w-4.5 h-4.5" /> Patients Database
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full text-left py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === 'security' ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/10' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
              }`}
            >
              <Key className="w-4.5 h-4.5" /> Security & 2FA
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-slate-800/60">
          <button 
            onClick={onLogout}
            className="w-full py-3 px-4 rounded-xl border border-slate-850 hover:border-rose-500/30 text-xs font-bold text-slate-400 hover:text-rose-455 transition-all flex items-center gap-3 justify-center cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
        
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200/80 px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-800 leading-tight">
              Clinical Workspace
            </h1>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">Welcome Back, {userName}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-teal-600 font-extrabold bg-teal-50 px-3.5 py-1.5 rounded-xl border border-teal-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-500" />
              HIPAA Enforced Session
            </span>
          </div>
        </header>

        {/* Dynamic Inner Panels */}
        <div className="flex-1 min-h-0 overflow-y-auto p-6 md:p-8 max-w-6xl w-full mx-auto space-y-6">

          {/* OVERVIEW PANEL */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-fade">
              
              {/* Stepper Card */}
              <div className="glass-panel bg-white p-6 border border-slate-100 shadow-md rounded-2xl">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-black text-slate-800">Profile Completion Progress</h3>
                    <p className="text-slate-500 text-xs font-semibold mt-0.5">Initialize all requirements to activate bank transfers & withdrawals.</p>
                  </div>
                  
                  {/* Progress Indicator */}
                  <div className="flex items-center gap-4">
                    <div className="w-36 bg-slate-100 rounded-full h-3 overflow-hidden shadow-inner">
                      <div 
                        className="bg-teal-600 h-full transition-all duration-500 rounded-full" 
                        style={{ width: `${calculateProgress()}%` }}
                      ></div>
                    </div>
                    <span className="font-extrabold text-teal-600 text-xl font-mono">{calculateProgress()}%</span>
                  </div>
                </div>

                {/* Checklist steps */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className={`p-4 rounded-xl border flex flex-col justify-between min-h-[110px] ${
                    addressCompleted ? 'bg-teal-500/5 border-teal-200' : 'bg-slate-50 border-slate-200/60'
                  }`}>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Step 1</span>
                    <h4 className={`font-bold text-xs mt-2 ${addressCompleted ? 'text-teal-700' : 'text-slate-600'}`}>Address Info</h4>
                    <button 
                      onClick={() => setActiveTab('profile-kyc')}
                      className={`text-[10px] font-extrabold mt-2 text-left transition-all ${addressCompleted ? 'text-teal-600' : 'text-teal-600 hover:underline cursor-pointer'}`}
                    >
                      {addressCompleted ? '✓ Completed' : 'Add Address →'}
                    </button>
                  </div>

                  <div className={`p-4 rounded-xl border flex flex-col justify-between min-h-[110px] ${
                    docsCompleted ? 'bg-teal-500/5 border-teal-200' : 'bg-slate-50 border-slate-200/60'
                  }`}>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Step 2</span>
                    <h4 className={`font-bold text-xs mt-2 ${docsCompleted ? 'text-teal-700' : 'text-slate-600'}`}>Upload Docs</h4>
                    <button 
                      onClick={() => setActiveTab('profile-kyc')}
                      className={`text-[10px] font-extrabold mt-2 text-left transition-all ${docsCompleted ? 'text-teal-600' : 'text-teal-600 hover:underline cursor-pointer'}`}
                    >
                      {docsCompleted ? '✓ Uploaded' : 'Upload Docs →'}
                    </button>
                  </div>

                  <div className={`p-4 rounded-xl border flex flex-col justify-between min-h-[110px] ${
                    kycCompleted ? 'bg-teal-500/5 border-teal-200' : 'bg-slate-50 border-slate-200/60'
                  }`}>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Step 3</span>
                    <h4 className={`font-bold text-xs mt-2 ${kycCompleted ? 'text-teal-700' : 'text-slate-600'}`}>Complete KYC</h4>
                    <button 
                      onClick={() => setActiveTab('profile-kyc')}
                      className={`text-[10px] font-extrabold mt-2 text-left transition-all ${kycCompleted ? 'text-teal-600' : 'text-teal-600 hover:underline cursor-pointer'}`}
                    >
                      {kycCompleted ? '✓ Complete' : 'Do KYC →'}
                    </button>
                  </div>

                  <div className={`p-4 rounded-xl border flex flex-col justify-between min-h-[110px] ${
                    bankCompleted ? 'bg-teal-500/5 border-teal-200' : 'bg-slate-50 border-slate-200/60'
                  }`}>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Step 4</span>
                    <h4 className={`font-bold text-xs mt-2 ${bankCompleted ? 'text-teal-700' : 'text-slate-600'}`}>Bank Account</h4>
                    <button 
                      onClick={() => setActiveTab('profile-kyc')}
                      className={`text-[10px] font-extrabold mt-2 text-left transition-all ${bankCompleted ? 'text-teal-600' : 'text-teal-600 hover:underline cursor-pointer'}`}
                    >
                      {bankCompleted ? '✓ Linked' : 'Add Bank →'}
                    </button>
                  </div>

                  <div className={`p-4 rounded-xl border flex flex-col justify-between min-h-[110px] ${
                    profDetailsVerified ? 'bg-teal-500/5 border-teal-200' : 'bg-slate-50 border-slate-200/60'
                  }`}>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Step 5</span>
                    <h4 className={`font-bold text-xs mt-2 ${profDetailsVerified ? 'text-teal-700' : 'text-slate-600'}`}>Professional Verification</h4>
                    <span className={`text-[10px] font-extrabold mt-2 ${profDetailsVerified ? 'text-teal-600' : 'text-amber-600'}`}>
                      {profDetailsVerified ? '✓ Verified' : 'Awaiting Review'}
                    </span>
                  </div>
                </div>

                {/* Review status actions */}
                <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-slate-400" />
                    <span>Access all dashboard features immediately. KYC and details verification are only required for financial settlement settlements.</span>
                  </div>
                  <div className="flex gap-2.5">
                    {verificationStatus === 'pending' && (
                      <button 
                        onClick={triggerVerificationReview}
                        className="btn btn-primary text-xs py-2 px-4 shadow-md cursor-pointer"
                      >
                        Submit Profile for Verification
                      </button>
                    )}
                    {verificationStatus === 'under_review' && (
                      <>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 text-xs font-bold">
                          ⏳ Under Verification Review
                        </span>
                        <button 
                          onClick={simulateAdminApproval}
                          className="btn btn-outline text-xs py-1.5 px-3 border-amber-600 text-amber-655 hover:bg-amber-50 cursor-pointer"
                        >
                          Simulate Admin Approval (Demo)
                        </button>
                      </>
                    )}
                    {verificationStatus === 'approved' && (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-700 text-xs font-bold border border-emerald-100">
                        🎉 Profile Approved
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Grid: Allowed vs Restricted Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Allowed Actions Container */}
                <div className="glass-panel bg-white p-6 border border-slate-100 shadow-sm rounded-2xl">
                  <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wider">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Allowed Activities (Active Now)
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100/80">
                      <div>
                        <h4 className="font-bold text-xs text-slate-800">Access Overview Dashboard</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Read analytics, overview summaries, and profiles.</p>
                      </div>
                      <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase">Active</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100/80">
                      <div>
                        <h4 className="font-bold text-xs text-slate-800">Edit Profile & Details</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Amend address coordinates and clinical configurations.</p>
                      </div>
                      <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase">Active</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100/80">
                      <div>
                        <h4 className="font-bold text-xs text-slate-800">Manage Patient Schedules</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Add, approve, reschedule or delete appointments.</p>
                      </div>
                      <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase">Active</span>
                    </div>
                  </div>
                </div>

                {/* Restricted Actions Container */}
                <div className="glass-panel bg-white p-6 border border-slate-100 shadow-sm rounded-2xl">
                  <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2 uppercase tracking-wider">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    Restricted Financial Settlements
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100/80">
                      <div>
                        <h4 className="font-bold text-xs text-slate-800">Receive Customer Settlements</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Clear outstanding consultant balances.</p>
                      </div>
                      {isSettlementEligible ? (
                        <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase">Unlocked</span>
                      ) : (
                        <button 
                          onClick={() => alert("Verification Required: Please complete 100% of the profile details and wait for Approval.")}
                          className="text-[9px] font-extrabold text-rose-600 hover:bg-rose-50 bg-rose-50 border border-rose-100 px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer uppercase"
                        >
                          <Lock className="w-3 h-3" /> Restricted
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100/80">
                      <div>
                        <h4 className="font-bold text-xs text-slate-800">Withdraw Account Payments</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Request manual payout orders on user demand.</p>
                      </div>
                      {isSettlementEligible ? (
                        <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase">Unlocked</span>
                      ) : (
                        <button 
                          onClick={() => alert("Verification Required: Please complete 100% of the profile details and wait for Approval.")}
                          className="text-[9px] font-extrabold text-rose-600 hover:bg-rose-50 bg-rose-50 border border-rose-100 px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer uppercase"
                        >
                          <Lock className="w-3 h-3" /> Restricted
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100/80">
                      <div>
                        <h4 className="font-bold text-xs text-slate-800">Transfer Earnings to Bank</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5">Initiate automated daily settlements to bank route.</p>
                      </div>
                      {isSettlementEligible ? (
                        <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded uppercase">Unlocked</span>
                      ) : (
                        <button 
                          onClick={() => alert("Verification Required: Please complete 100% of the profile details and wait for Approval.")}
                          className="text-[9px] font-extrabold text-rose-600 hover:bg-rose-50 bg-rose-50 border border-rose-100 px-2 py-1 rounded transition-colors flex items-center gap-1 cursor-pointer uppercase"
                        >
                          <Lock className="w-3 h-3" /> Restricted
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* PROFILE & KYC SECTION */}
          {activeTab === 'profile-kyc' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-fade">
              
              {/* Stepper info sidebar */}
              <div className="lg:col-span-4 space-y-6">
                <div className="glass-panel bg-white p-6 border border-slate-100 rounded-2xl">
                  <h3 className="text-sm font-extrabold text-slate-800 mb-2 uppercase tracking-wider">KYC Settlement Rules</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                    To activate settlements and unlock transfers, please complete:
                  </p>
                  
                  <ul className="mt-4 space-y-3">
                    <li className="flex items-center gap-2.5 text-xs text-slate-655 font-bold">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${addressCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                        {addressCompleted ? '✓' : '1'}
                      </span>
                      Address Information
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-slate-655 font-bold">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${docsCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                        {docsCompleted ? '✓' : '2'}
                      </span>
                      Verification Documents
                    </li>
                    <li className="flex items-center gap-2.5 text-xs text-slate-655 font-bold">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${bankCompleted ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                        {bankCompleted ? '✓' : '3'}
                      </span>
                      Verified Bank details
                    </li>
                  </ul>

                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">Review Status</span>
                    {verificationStatus === 'pending' && (
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded">Pending Completion</span>
                    )}
                    {verificationStatus === 'under_review' && (
                      <span className="text-[10px] font-bold text-indigo-650 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded">Awaiting Review</span>
                    )}
                    {verificationStatus === 'approved' && (
                      <span className="text-[10px] font-bold text-emerald-650 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded">Approved & Verified</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Forms main container */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* SECTION 1: Address */}
                <div className="glass-panel bg-white p-6 border border-slate-100 rounded-2xl shadow-sm">
                  <h3 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-teal-600" />
                    Section 1: Address Information
                  </h3>

                  <form onSubmit={handleAddressSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-group mb-0">
                        <label className="form-label">Country</label>
                        <input 
                          type="text" 
                          required
                          className="form-control" 
                          value={country} 
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="e.g. India"
                          disabled={addressCompleted}
                        />
                      </div>
                      <div className="form-group mb-0">
                        <label className="form-label">State</label>
                        <input 
                          type="text" 
                          required
                          className="form-control" 
                          value={stateName} 
                          onChange={(e) => setStateName(e.target.value)}
                          placeholder="e.g. Maharashtra"
                          disabled={addressCompleted}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="form-group mb-0 col-span-1">
                        <label className="form-label">District</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={district} 
                          onChange={(e) => setDistrict(e.target.value)}
                          placeholder="e.g. Pune"
                          disabled={addressCompleted}
                        />
                      </div>
                      <div className="form-group mb-0 col-span-1">
                        <label className="form-label">City</label>
                        <input 
                          type="text" 
                          required
                          className="form-control" 
                          value={city} 
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. Pune"
                          disabled={addressCompleted}
                        />
                      </div>
                      <div className="form-group mb-0 col-span-1">
                        <label className="form-label">Pincode</label>
                        <input 
                          type="text" 
                          required
                          maxLength={6}
                          className="form-control font-mono" 
                          value={pincode} 
                          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                          placeholder="411001"
                          disabled={addressCompleted}
                        />
                      </div>
                    </div>

                    <div className="form-group mb-0">
                      <label className="form-label">Street Address</label>
                      <input 
                        type="text" 
                        required
                        className="form-control" 
                        value={streetAddress} 
                        onChange={(e) => setStreetAddress(e.target.value)}
                        placeholder="Plot No. 45, Residency Heights, Sector 2"
                        disabled={addressCompleted}
                      />
                    </div>

                    {!addressCompleted ? (
                      <button type="submit" className="btn btn-primary text-xs py-2 px-4 shadow-sm cursor-pointer">
                        Save Address
                      </button>
                    ) : (
                      <div className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                        ✓ Address recorded. <button type="button" onClick={() => setAddressCompleted(false)} className="text-teal-600 underline font-semibold ml-1 cursor-pointer">Edit</button>
                      </div>
                    )}
                  </form>
                </div>

                {/* SECTION 2: Documents */}
                <div className="glass-panel bg-white p-6 border border-slate-100 rounded-2xl shadow-sm">
                  <h3 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-teal-600" />
                    Section 2: Verification Documents Upload
                  </h3>

                  <p className="text-xs text-slate-500 mb-4 font-semibold">
                    Upload clinical registration certificates as required for a <strong className="uppercase text-slate-700">{userRole}</strong>.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getRequiredDocs().map((docName) => (
                      <div key={docName} className="p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 flex flex-col justify-between min-h-[140px]">
                        <div>
                          <h4 className="font-bold text-xs text-slate-700">{docName} *</h4>
                          <p className="text-[10px] text-slate-400 mt-1 font-semibold">Upload verified PDF or JPEG files below 5MB.</p>
                        </div>

                        <div className="mt-4">
                          {uploadedFiles[docName] ? (
                            <div className="flex items-center justify-between text-xs text-teal-700 font-bold bg-teal-500/5 border border-teal-100 p-2 rounded-lg">
                              <span className="truncate max-w-[150px] font-mono">{uploadedFiles[docName]}</span>
                              <button 
                                type="button"
                                onClick={() => {
                                  const nextUploads = { ...uploadedFiles };
                                  delete nextUploads[docName];
                                  setUploadedFiles(nextUploads);
                                  setDocsCompleted(false);
                                }}
                                className="text-rose-500 hover:underline cursor-pointer"
                              >
                                Delete
                              </button>
                            </div>
                          ) : (
                            <label className="btn btn-secondary text-xs py-1.5 px-3 block text-center cursor-pointer border border-slate-200 bg-white shadow-sm hover:bg-slate-50">
                              Choose File
                              <input 
                                type="file" 
                                className="hidden" 
                                onChange={(e) => handleFileUpload(docName, e)}
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {docsCompleted && (
                    <div className="mt-4 text-emerald-600 text-xs font-bold">
                      ✓ All required documents uploaded successfully.
                    </div>
                  )}
                </div>

                {/* SECTION 3: Bank Details */}
                <div className="glass-panel bg-white p-6 border border-slate-100 rounded-2xl shadow-sm">
                  <h3 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-teal-600" />
                    Section 3: Bank Account Information
                  </h3>

                  <form onSubmit={handleBankSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-group mb-0">
                        <label className="form-label">Account Holder Name</label>
                        <input 
                          type="text" 
                          required
                          className="form-control" 
                          value={bankHolder} 
                          onChange={(e) => setBankHolder(e.target.value)}
                          placeholder="e.g. Johnathan Doe"
                          disabled={bankCompleted}
                        />
                      </div>
                      <div className="form-group mb-0">
                        <label className="form-label">Bank Name</label>
                        <input 
                          type="text" 
                          required
                          className="form-control" 
                          value={bankNameField} 
                          onChange={(e) => setBankNameField(e.target.value)}
                          placeholder="e.g. HDFC Bank"
                          disabled={bankCompleted}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="form-group mb-0">
                        <label className="form-label">Account Number</label>
                        <input 
                          type="password" 
                          required
                          className="form-control font-mono" 
                          value={bankNumber} 
                          onChange={(e) => setBankNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="Re-enter details for safety"
                          disabled={bankCompleted}
                        />
                      </div>
                      <div className="form-group mb-0">
                        <label className="form-label">IFSC Code</label>
                        <input 
                          type="text" 
                          required
                          maxLength={11}
                          className="form-control font-mono" 
                          value={bankIfsc} 
                          onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                          placeholder="e.g. HDFC0001234"
                          disabled={bankCompleted}
                        />
                      </div>
                    </div>

                    {!bankCompleted ? (
                      <button type="submit" className="btn btn-primary text-xs py-2 px-4 shadow-sm cursor-pointer">
                        Save Bank Details
                      </button>
                    ) : (
                      <div className="text-emerald-600 text-xs font-bold flex items-center gap-1">
                        ✓ Bank account linked. <button type="button" onClick={() => setBankCompleted(false)} className="text-teal-600 underline font-semibold ml-1 cursor-pointer">Edit</button>
                      </div>
                    )}
                  </form>
                </div>

              </div>
            </div>
          )}

          {/* APPOINTMENTS SIMULATOR PANEL */}
          {activeTab === 'appointments' && (
            <div className="glass-panel bg-white p-6 border border-slate-100 shadow-sm rounded-2xl space-y-6 animate-fade">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h3 className="text-lg font-black text-slate-800">Clinic Appointment Register</h3>
                  <p className="text-slate-500 text-xs font-semibold mt-0.5 font-sans">Manage patient queues and check consult methods.</p>
                </div>

                <button 
                  onClick={() => setShowAptModal(true)}
                  className="btn btn-primary text-xs py-2 px-4 flex items-center gap-1.5 self-start cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Book Appointment
                </button>
              </div>

              {/* Appointment Card Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {appointments.map((apt) => (
                  <div key={apt.id} className="p-5 rounded-2xl border border-slate-100 shadow-sm bg-slate-55/40 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-black text-teal-655 bg-teal-50 border border-teal-100 px-2 py-0.5 rounded uppercase">
                          {apt.id}
                        </span>
                        <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wide">
                          {apt.type}
                        </span>
                      </div>
                      
                      <h4 className="font-extrabold text-sm text-slate-800 mt-3">{apt.patientName}</h4>
                      
                      <div className="mt-2.5 text-xs text-slate-400 font-bold space-y-0.5 font-mono">
                        <div>📅 {apt.date}</div>
                        <div>🕒 {apt.time}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100/80 pt-4 mt-4 text-xs font-bold">
                      <span className={`px-2 py-0.5 rounded text-[9px] uppercase border ${
                        apt.status === 'Scheduled' || apt.status === 'Confirmed' 
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-100' 
                          : 'text-amber-700 bg-amber-50 border-amber-100'
                      }`}>
                        {apt.status}
                      </span>
                      
                      <button 
                        onClick={() => {
                          setAppointments(prev => prev.filter(a => a.id !== apt.id));
                        }}
                        className="text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* BOOK APPOINTMENT MODAL */}
              {showAptModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 z-50 animate-fade">
                  <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-slate-100">
                    <h3 className="text-xl font-black text-slate-800 mb-1">Book New Appointment</h3>
                    <p className="text-slate-500 text-xs font-semibold mb-6">Schedule patient details in VIZITO queue.</p>

                    <form onSubmit={handleCreateAppointment} className="space-y-4">
                      <div className="form-group">
                        <label className="form-label">Patient Full Name</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Peter Parker"
                          className="form-control" 
                          value={newAptName} 
                          onChange={(e) => setNewAptName(e.target.value)}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="form-group">
                          <label className="form-label">Consult Date</label>
                          <input 
                            type="date" 
                            required
                            className="form-control" 
                            value={newAptDate} 
                            onChange={(e) => setNewAptDate(e.target.value)}
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Consult Time</label>
                          <input 
                            type="time" 
                            required
                            className="form-control" 
                            value={newAptTime} 
                            onChange={(e) => setNewAptTime(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Consult Type</label>
                        <select 
                          className="form-control" 
                          value={newAptType}
                          onChange={(e) => setNewAptType(e.target.value)}
                        >
                          <option value="Online Consult">Online Consult</option>
                          <option value="In-Clinic Visit">In-Clinic Visit</option>
                          <option value="Home Sample Collection">Home Sample Collection</option>
                        </select>
                      </div>

                      <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
                        <button 
                          type="button" 
                          onClick={() => setShowAptModal(false)}
                          className="btn btn-secondary flex-1 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          className="btn btn-primary flex-1 cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* PATIENTS DATABASE PANEL */}
          {activeTab === 'patients' && (
            <div className="glass-panel bg-white p-6 border border-slate-100 shadow-sm rounded-2xl animate-fade">
              <div className="mb-6">
                <h3 className="text-lg font-black text-slate-800">Patients Register</h3>
                <p className="text-slate-500 text-xs font-semibold mt-0.5">Database of patients scheduled with your clinic.</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-extrabold uppercase tracking-wider">
                      <th className="py-3 px-4">Patient ID</th>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Age</th>
                      <th className="py-3 px-4">Gender</th>
                      <th className="py-3 px-4">Phone Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((pat) => (
                      <tr key={pat.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors font-semibold text-slate-700">
                        <td className="py-3.5 px-4 font-bold text-teal-650 font-mono">{pat.id}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-800">{pat.name}</td>
                        <td className="py-3.5 px-4">{pat.age} years</td>
                        <td className="py-3.5 px-4">{pat.gender}</td>
                        <td className="py-3.5 px-4 font-mono">{pat.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SECURITY SETTINGS PANEL */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-fade">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 2FA Configuration */}
                <div className="glass-panel bg-white p-6 border border-slate-100 shadow-sm rounded-2xl space-y-4">
                  <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Two-Factor Authentication (2FA)</h3>
                  <p className="text-xs text-slate-505 leading-relaxed font-semibold">
                    Improve protection on your HIPAA medical records by requiring secondary passcode validation during device login.
                  </p>

                  <div className="space-y-3 pt-3">
                    <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                      <div>
                        <h4 className="font-bold text-xs text-slate-800">2FA via Mobile OTP</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Send verification codes to your mobile phone number.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={twoFactorMobile}
                        onChange={(e) => setTwoFactorMobile(e.target.checked)}
                        className="accent-teal-600 w-4.5 h-4.5 rounded"
                      />
                    </label>

                    <label className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
                      <div>
                        <h4 className="font-bold text-xs text-slate-800">2FA via Email OTP</h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-medium">Send verification codes to your email address.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={twoFactorEmail}
                        onChange={(e) => setTwoFactorEmail(e.target.checked)}
                        className="accent-teal-600 w-4.5 h-4.5 rounded"
                      />
                    </label>
                  </div>
                </div>

                {/* Session control */}
                <div className="glass-panel bg-white p-6 border border-slate-100 shadow-sm rounded-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Active Device Sessions</h3>
                    <button 
                      onClick={handleLogoutOthers}
                      className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                    >
                      Logout Other Devices
                    </button>
                  </div>

                  <p className="text-xs text-slate-505 leading-relaxed font-semibold">
                    Review and terminate other devices currently logged into your VIZITO account profile.
                  </p>

                  <div className="space-y-2.5 pt-2">
                    {sessions.map((ses) => (
                      <div key={ses.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                        <div className="flex items-center gap-3">
                          {ses.device.includes('iPhone') ? (
                            <span className="p-2 rounded bg-slate-100 border border-slate-200 text-slate-600"><Smartphone className="w-4 h-4" /></span>
                          ) : (
                            <span className="p-2 rounded bg-slate-100 border border-slate-200 text-slate-600"><Laptop className="w-4 h-4" /></span>
                          )}
                          <div>
                            <h4 className="font-bold text-slate-800 text-xs leading-none">{ses.device}</h4>
                            <span className="text-[9px] text-slate-400 font-mono mt-1 inline-block">{ses.ip}</span>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold text-slate-400">{ses.lastActive}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
