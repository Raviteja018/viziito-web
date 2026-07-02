import { useState, useEffect } from 'react';
import {
  Phone,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  LockKeyhole,
  Smartphone,
  Lock,
  KeyRound,
  Send,
  ChevronDown,
  ShieldCheck,
  Stethoscope,
  Pill,
  FlaskConical,
} from 'lucide-react';
import logoImg from '../assets/vizito_logo.png';

interface AuthModuleProps {
  onLoginSuccess: (user: any) => void;
  onRegisterClick: () => void;
}

type LoginType = 'mobile' | 'email';
type AuthMethod = 'otp' | 'password';
type AuthState =
  | 'login'
  | 'otp-verify'
  | 'forgot-select'
  | 'forgot-input'
  | 'forgot-otp'
  | 'forgot-reset'
  | 'forgot-success';

export default function AuthModule({ onLoginSuccess, onRegisterClick }: AuthModuleProps) {
  // Navigation & UI States
  const [loginType, setLoginType] = useState<LoginType>('mobile');
  const [authMethod, setAuthMethod] = useState<AuthMethod>('otp');
  const [authState, setAuthState] = useState<AuthState>('login');

  // Fields
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Recovery States
  const [recoveryMethod, setRecoveryMethod] = useState<LoginType>('mobile');
  const [recoveryMobile, setRecoveryMobile] = useState('');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryOtp, setRecoveryOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Security Simulation States
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0);
  const [otpCountdown, setOtpCountdown] = useState(300);
  const [otpSent, setOtpSent] = useState(false);

  // Error & Status Messages
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // OTP Countdown Effect
  useEffect(() => {
    let timer: any;
    if (otpSent && otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, otpCountdown]);

  // Account Lockout Countdown Effect
  useEffect(() => {
    let timer: any;
    if (isLocked && lockCountdown > 0) {
      timer = setInterval(() => {
        setLockCountdown((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setFailedAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockCountdown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Validations
  const validateMobile = (num: string) => /^\d{10}$/.test(num);
  const validateEmail = (mail: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
  const validatePassword = (pass: string) => pass.length >= 8;

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (loginType === 'mobile' && !validateMobile(mobile)) {
      setErrorMessage('Invalid Mobile Number');
      return;
    }
    if (loginType === 'email' && !validateEmail(email)) {
      setErrorMessage('Invalid Email Address');
      return;
    }

    if (loginType === 'mobile') {
      if (mobile === '9999999999') { setErrorMessage('Account Pending Verification'); return; }
      if (mobile === '8888888888') { setErrorMessage('Account Blocked'); return; }
      if (mobile === '7777777777') { setErrorMessage('Account Not Found'); return; }
    }
    if (loginType === 'email') {
      if (email === 'pending@vizito.com') { setErrorMessage('Account Pending Verification'); return; }
      if (email === 'blocked@vizito.com') { setErrorMessage('Account Blocked'); return; }
      if (email === 'missing@vizito.com') { setErrorMessage('Account Not Found'); return; }
    }

    setOtpSent(true);
    setOtpCountdown(300);
    setAuthState('otp-verify');
    setSuccessMessage(`OTP sent to ${loginType === 'mobile' ? '+91 ' + mobile : email}. Use mock code: 123456`);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (otp.length !== 6) { setErrorMessage('Invalid OTP (Must be 6 digits)'); return; }
    if (otpCountdown === 0) { setErrorMessage('Invalid OTP (Expired)'); return; }
    if (otp !== '123456') { setErrorMessage('Invalid OTP (Incorrect)'); return; }
    onLoginSuccess({
      email: loginType === 'email' ? email : 'john.doe@hospital.com',
      mobile: loginType === 'mobile' ? mobile : '9876543210',
      fullName: 'Dr. Johnathan Doe',
      role: 'doctor',
    });
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (isLocked) { setErrorMessage('Account Blocked for 15 Minutes.'); return; }
    if (loginType === 'mobile' && !validateMobile(mobile)) { setErrorMessage('Invalid Mobile Number'); return; }
    if (loginType === 'email' && !validateEmail(email)) { setErrorMessage('Invalid Email Address'); return; }
    if (!validatePassword(password)) { setErrorMessage('Incorrect Password'); return; }
    if (loginType === 'mobile' && mobile === '8888888888') { setErrorMessage('Account Blocked'); return; }
    if (loginType === 'mobile' && mobile === '9999999999') { setErrorMessage('Account Pending Verification'); return; }
    if (loginType === 'email' && email === 'blocked@vizito.com') { setErrorMessage('Account Blocked'); return; }

    if (password === 'password123') {
      onLoginSuccess({
        email: loginType === 'email' ? email : 'john.doe@hospital.com',
        mobile: loginType === 'mobile' ? mobile : '9876543210',
        fullName: 'Dr. Johnathan Doe',
        role: 'doctor',
      });
    } else {
      const attempts = failedAttempts + 1;
      setFailedAttempts(attempts);
      if (attempts >= 5) {
        setIsLocked(true);
        setLockCountdown(900);
        setErrorMessage('Account Blocked (Temporarily Locked for 15 Minutes)');
      } else {
        setErrorMessage(`Incorrect Password. Attempts remaining: ${5 - attempts}. (Use 'password123')`);
      }
    }
  };

  const handleForgotSelect = (method: LoginType) => {
    setRecoveryMethod(method);
    setAuthState('forgot-input');
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleRecoverySend = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (recoveryMethod === 'mobile') {
      if (!validateMobile(recoveryMobile)) { setErrorMessage('Invalid Mobile Number'); return; }
    } else {
      if (!validateEmail(recoveryEmail)) { setErrorMessage('Invalid Email Address'); return; }
    }
    setOtpSent(true);
    setOtpCountdown(300);
    setAuthState('forgot-otp');
    setSuccessMessage('Recovery OTP code sent! Use mock code: 123456');
  };

  const handleRecoveryVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (recoveryOtp !== '123456') { setErrorMessage('Invalid OTP'); return; }
    setAuthState('forgot-reset');
    setSuccessMessage('');
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const complexityRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!complexityRegex.test(newPassword)) { setErrorMessage('Password does not meet validation rules.'); return; }
    if (newPassword !== confirmPassword) { setErrorMessage('Passwords do not match'); return; }
    setAuthState('forgot-success');
    setSuccessMessage('');
  };

  const goBackToLogin = () => {
    setAuthState('login');
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <div className="flex-1 h-screen max-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white font-sans overflow-hidden relative">
      {/* Left Column - Desktop value props (Visible on large screens only) */}
      <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-teal-50/60 via-emerald-50/20 to-sky-50/40 p-10 flex-col justify-between border-r border-slate-100/60 relative overflow-hidden h-full max-h-screen">
        {/* SVG Dot grid decoration and abstract mesh elements */}
        <div className="absolute top-[10%] right-[10%] w-[350px] h-[350px] bg-teal-200/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[-10%] w-[350px] h-[350px] bg-emerald-200/20 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Grid pattern overlay */}
        <div className="absolute top-12 right-12 opacity-35 pointer-events-none">
          <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="4" cy="4" r="3" fill="#0D9488" />
            <circle cx="20" cy="4" r="3" fill="#0D9488" />
            <circle cx="36" cy="4" r="3" fill="#0D9488" />
            <circle cx="52" cy="4" r="3" fill="#0D9488" />
            <circle cx="68" cy="4" r="3" fill="#0D9488" />
            
            <circle cx="4" cy="20" r="3" fill="#0D9488" />
            <circle cx="20" cy="20" r="3" fill="#0D9488" />
            <circle cx="36" cy="20" r="3" fill="#0D9488" />
            <circle cx="52" cy="20" r="3" fill="#0D9488" />
            <circle cx="68" cy="20" r="3" fill="#0D9488" />
            
            <circle cx="4" cy="36" r="3" fill="#0D9488" />
            <circle cx="20" cy="36" r="3" fill="#0D9488" />
            <circle cx="36" cy="36" r="3" fill="#0D9488" />
            <circle cx="52" cy="36" r="3" fill="#0D9488" />
            <circle cx="68" cy="36" r="3" fill="#0D9488" />

            <circle cx="4" cy="52" r="3" fill="#0D9488" />
            <circle cx="20" cy="52" r="3" fill="#0D9488" />
            <circle cx="36" cy="52" r="3" fill="#0D9488" />
            <circle cx="52" cy="52" r="3" fill="#0D9488" />
            <circle cx="68" cy="52" r="3" fill="#0D9488" />
          </svg>
        </div>

        {/* Top brand header */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 overflow-hidden relative shrink-0">
              <img 
                src={logoImg} 
                alt="VIZITO Icon" 
                className="absolute top-0 left-0 w-full h-[180%] object-contain object-top" 
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-2xl tracking-tight text-slate-800 leading-none">VIZITO</span>
              <span className="text-[11px] text-teal-600 font-bold uppercase tracking-wider mt-1">Your Health. Connected.</span>
            </div>
          </div>
        </div>

        {/* Middle brand text and bullet list */}
        <div className="relative z-10 my-auto py-4 space-y-6 xl:space-y-8 flex-1 flex flex-col justify-center min-h-0">
          <div className="space-y-3">
            <h1 className="text-3xl xl:text-4xl font-black text-slate-800 tracking-tight leading-tight">
              Healthcare at <br />
              <span className="text-[#007A87]">Your</span> Fingertips
            </h1>
            <p className="text-slate-500 font-medium text-xs xl:text-sm max-w-md">
              VIZITO connects you with trusted doctors, clinics, and healthcare services anytime, anywhere.
            </p>
          </div>

          <div className="space-y-4 xl:space-y-5">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-teal-50 text-teal-600 rounded-xl border border-teal-100 shadow-sm shrink-0">
                <Stethoscope className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-xs xl:text-sm">Consult Trusted Doctors</h4>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Book online or in-clinic consultations with verified professionals.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 shadow-sm shrink-0">
                <Pill className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-xs xl:text-sm">Order Medicines</h4>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Upload prescriptions and get medicines delivered to your doorstep.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-sky-50 text-sky-600 rounded-xl border border-sky-100 shadow-sm shrink-0">
                <FlaskConical className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-xs xl:text-sm">Book Diagnostics</h4>
                <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Book lab tests and home sample collection with ease.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom illustration - Vector Mockup */}
        <div className="relative z-10 mt-auto pt-4 flex justify-center w-full max-h-[22vh] xl:max-h-[26vh] shrink-0 pointer-events-none select-none">
          <svg className="w-[85%] h-auto max-h-[180px] xl:max-h-[220px]" viewBox="0 0 400 240" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 1. Heartbeat ECG pulse line in background */}
            <path d="M 10 120 L 110 120 L 120 90 L 130 160 L 140 100 L 145 130 L 150 120 L 260 120 L 270 70 L 280 180 L 290 100 L 295 140 L 300 120 L 390 120" 
                  stroke="#0D9488" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.25" />
            
            {/* 2. Abstract circular gradient background behind laptop */}
            <circle cx="200" cy="120" r="80" fill="url(#bgCircleGrad)" opacity="0.3" />

            {/* 3. Plant in Pot (Left) */}
            <g transform="translate(10, 75)">
              {/* Leaves */}
              <path d="M45 45 C40 25, 20 20, 20 20 C20 20, 30 35, 45 45 Z" fill="#10B981" />
              <path d="M45 45 C35 15, 45 5, 45 5 C45 5, 55 15, 45 45 Z" fill="#059669" />
              <path d="M45 45 C50 25, 70 20, 70 20 C70 20, 60 35, 45 45 Z" fill="#34D399" />
              <path d="M45 45 C30 30, 15 40, 15 40 C15 40, 25 45, 45 45 Z" fill="#047857" />
              <path d="M45 45 C60 30, 75 40, 75 40 C75 40, 65 45, 45 45 Z" fill="#059669" />
              {/* Pot */}
              <path d="M30 45 H60 L55 80 H35 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
              <rect x="26" y="42" width="38" height="5" rx="2" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
            </g>

            {/* 4. Laptop (Center) */}
            <g transform="translate(90, 60)">
              {/* Screen shadow */}
              <rect x="10" y="5" width="200" height="125" rx="8" fill="#0F172A" opacity="0.1" filter="url(#shadow)" />
              {/* Outer screen frame */}
              <rect x="10" y="5" width="200" height="125" rx="8" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
              {/* Inner screen display */}
              <rect x="16" y="11" width="188" height="113" rx="4" fill="#020617" />
              {/* Camera */}
              <circle cx="110" cy="8" r="1.5" fill="#475569" />
              
              {/* Screen Content - Healthcare Dashboard */}
              <g transform="translate(16, 11)">
                {/* Header */}
                <rect x="0" y="0" width="188" height="14" fill="#0F172A" />
                <circle cx="6" cy="7" r="2" fill="#EF4444" />
                <circle cx="12" cy="7" r="2" fill="#F59E0B" />
                <circle cx="18" cy="7" r="2" fill="#10B981" />
                <text x="30" y="10" fill="#94A3B8" fontSize="6" fontFamily="sans-serif" fontWeight="bold">Vizito Clinic Hub</text>
                
                {/* Dashboard Grid */}
                {/* Sidebar */}
                <rect x="0" y="14" width="35" height="99" fill="#090D16" />
                <rect x="4" y="20" width="27" height="6" rx="2" fill="#0D9488" opacity="0.2" />
                <rect x="8" y="22" width="19" height="2" fill="#0D9488" />
                <rect x="8" y="32" width="19" height="2" fill="#475569" />
                <rect x="8" y="42" width="19" height="2" fill="#475569" />
                <rect x="8" y="52" width="19" height="2" fill="#475569" />

                {/* Main panel content */}
                {/* Top card 1 */}
                <rect x="41" y="20" width="42" height="26" rx="4" fill="#0F172A" />
                <text x="46" y="28" fill="#64748B" fontSize="4" fontFamily="sans-serif">Patients</text>
                <text x="46" y="38" fill="#10B981" fontSize="8" fontFamily="sans-serif" fontWeight="bold">1,284</text>
                <path d="M72 32 L76 28 L80 32" stroke="#10B981" strokeWidth="1" fill="none" strokeLinecap="round" />

                {/* Top card 2 */}
                <rect x="89" y="20" width="42" height="26" rx="4" fill="#0F172A" />
                <text x="94" y="28" fill="#64748B" fontSize="4" fontFamily="sans-serif">Appointments</text>
                <text x="94" y="38" fill="#38BDF8" fontSize="8" fontFamily="sans-serif" fontWeight="bold">428</text>
                
                {/* Top card 3 */}
                <rect x="137" y="20" width="42" height="26" rx="4" fill="#0F172A" />
                <text x="142" y="28" fill="#64748B" fontSize="4" fontFamily="sans-serif">Earnings</text>
                <text x="142" y="38" fill="#F59E0B" fontSize="8" fontFamily="sans-serif" fontWeight="bold">$14.2k</text>

                {/* Bottom line chart card */}
                <rect x="41" y="52" width="138" height="52" rx="4" fill="#0F172A" />
                <text x="46" y="60" fill="#94A3B8" fontSize="5" fontFamily="sans-serif" fontWeight="bold">Monthly Analytics</text>
                {/* Grid lines */}
                <line x1="46" y1="70" x2="173" y2="70" stroke="#1E293B" strokeWidth="0.5" />
                <line x1="46" y1="84" x2="173" y2="84" stroke="#1E293B" strokeWidth="0.5" />
                <line x1="46" y1="98" x2="173" y2="98" stroke="#1E293B" strokeWidth="0.5" />
                {/* Chart Line */}
                <path d="M46 92 Q60 80, 75 88 T105 74 T135 84 T165 64 T173 68" stroke="#0D9488" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                <path d="M46 92 Q60 80, 75 88 T105 74 T135 84 T165 64 T173 68 L173 98 L46 98 Z" fill="url(#chartGrad)" opacity="0.15" />
              </g>
              
              {/* Reflection gloss */}
              <path d="M 16 11 L 110 11 L 16 105 Z" fill="#FFFFFF" opacity="0.04" />
              
              {/* Keyboard base connection */}
              <rect x="75" y="128" width="70" height="4" fill="#0F172A" />
              {/* Lower keyboard plate */}
              <path d="M 0 132 L 220 132 L 210 139 L 10 139 Z" fill="#475569" stroke="#334155" strokeWidth="1" />
              <rect x="95" y="133" width="30" height="2" rx="1" fill="#334155" />
            </g>

            {/* 5. Smartphone (Overlapping bottom right of laptop) */}
            <g transform="translate(265, 110)">
              {/* Shadow */}
              <rect x="2" y="2" width="60" height="110" rx="8" fill="#000000" opacity="0.15" filter="url(#shadow)" />
              {/* Outer phone frame */}
              <rect x="0" y="0" width="60" height="110" rx="8" fill="#0F172A" stroke="#334155" strokeWidth="2.5" />
              {/* Inner screen */}
              <rect x="4" y="6" width="52" height="98" rx="5" fill="#020617" />
              {/* Notch */}
              <path d="M18 6 H42 V10 C42 12, 38 12, 38 12 H22 C22 12, 18 12, 18 10 Z" fill="#0F172A" />
              <circle cx="30" cy="8" r="1" fill="#475569" />

              {/* Screen Content */}
              <g transform="translate(4, 6)">
                {/* Header */}
                <rect x="0" y="8" width="52" height="12" fill="#0F172A" />
                <circle cx="8" cy="14" r="3" fill="#38BDF8" />
                <rect x="15" y="11" width="22" height="2" fill="#94A3B8" />
                <rect x="15" y="15" width="12" height="1.5" fill="#475569" />

                {/* Patient / doctor cards */}
                <g transform="translate(4, 25)">
                  {/* Card 1 */}
                  <rect x="0" y="0" width="44" height="16" rx="3" fill="#0F172A" stroke="#1E293B" strokeWidth="0.5" />
                  <circle cx="6" cy="8" r="4" fill="#34D399" />
                  <rect x="14" y="5" width="20" height="2" fill="#E2E8F0" />
                  <rect x="14" y="9" width="12" height="1.5" fill="#64748B" />

                  {/* Card 2 */}
                  <rect x="0" y="20" width="44" height="16" rx="3" fill="#0F172A" stroke="#1E293B" strokeWidth="0.5" />
                  <circle cx="6" cy="28" r="4" fill="#F59E0B" />
                  <rect x="14" y="25" width="24" height="2" fill="#E2E8F0" />
                  <rect x="14" y="29" width="10" height="1.5" fill="#64748B" />

                  {/* Card 3 */}
                  <rect x="0" y="40" width="44" height="16" rx="3" fill="#0F172A" stroke="#1E293B" strokeWidth="0.5" />
                  <circle cx="6" cy="48" r="4" fill="#EF4444" />
                  <rect x="14" y="45" width="22" height="2" fill="#E2E8F0" />
                  <rect x="14" y="49" width="14" height="1.5" fill="#64748B" />
                </g>
                
                {/* Bottom navigation bar */}
                <rect x="0" y="92" width="52" height="6" fill="#090D16" />
                <circle cx="10" cy="95" r="1.5" fill="#0D9488" />
                <circle cx="26" cy="95" r="1.5" fill="#475569" />
                <circle cx="42" cy="95" r="1.5" fill="#475569" />
              </g>
            </g>

            {/* 6. Medical Shield Icon (Floating Right) */}
            <g transform="translate(325, 75)">
              {/* Shield shadow */}
              <circle cx="20" cy="20" r="20" fill="#000000" opacity="0.1" filter="url(#shadow)" />
              {/* Outer Shield Circle */}
              <circle cx="20" cy="20" r="18" fill="#0D9488" stroke="#34D399" strokeWidth="1.5" />
              {/* Inner Shield fill */}
              <circle cx="20" cy="20" r="15" fill="url(#shieldGrad)" />
              {/* White Cross symbol */}
              <path d="M20 13 V27 M13 20 H27" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            </g>
            
            {/* Definitions for gradients and filters */}
            <defs>
              {/* Blur Shadow filter */}
              <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="6" stdDeviation="5" floodOpacity="0.3" />
              </filter>
              {/* Background abstract gradient */}
              <radialGradient id="bgCircleGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0D9488" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#0D9488" stopOpacity="0" />
              </radialGradient>
              {/* Chart gradient fill */}
              <linearGradient id="chartGrad" x1="109.5" y1="64" x2="109.5" y2="98" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#0D9488" stopOpacity="1" />
                <stop offset="100%" stopColor="#0D9488" stopOpacity="0" />
              </linearGradient>
              {/* Shield gradient */}
              <linearGradient id="shieldGrad" x1="13" y1="13" x2="27" y2="27" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#14B8A6" />
                <stop offset="100%" stopColor="#0F766E" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Right Column - Form area (Visible on all screens) */}
      <div className="col-span-12 lg:col-span-7 flex flex-col justify-between h-screen max-h-screen bg-slate-50/50 p-6 md:p-12 relative overflow-y-auto">
        {/* Top-right register link */}
        <div className="flex justify-end text-xs text-slate-500 font-semibold lg:absolute lg:top-8 lg:right-12 mb-6 lg:mb-0">
          <span>Don't have an account?</span>
          <button onClick={onRegisterClick} className="text-[#007A87] font-bold ml-1 hover:underline cursor-pointer">Register</button>
        </div>

        <div className="w-full max-w-[480px] mx-auto my-auto py-8">
          {/* Card Container */}
          <div className="bg-white rounded-[2rem] shadow-[0_15px_45px_-12px_rgba(0,0,0,0.04)] border border-slate-100/80 p-8 relative">
            
            {/* Show logo on mobile only at top of the card */}
            <div className="flex lg:hidden items-center gap-3 mb-6 justify-center">
              <div className="w-10 h-10 overflow-hidden relative shrink-0">
                <img 
                  src={logoImg} 
                  alt="VIZITO Icon" 
                  className="absolute top-0 left-0 w-full h-[180%] object-contain object-top" 
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-lg tracking-tight text-slate-800 leading-none">VIZITO</span>
                <span className="text-[9px] text-teal-650 font-bold uppercase tracking-wider mt-0.5">Your Health. Connected.</span>
              </div>
            </div>

            {/* Back button (Only for nested sub-flows: OTP verification, Recovery states) */}
            {authState !== 'login' && authState !== 'forgot-success' && (
              <button
                onClick={goBackToLogin}
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-[#007A87] text-xs font-bold uppercase transition-all mb-6 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </button>
            )}

            {/* Error Banner */}
            {errorMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-100/60 text-rose-700 text-xs font-bold flex items-center gap-2 animate-pulse">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Banner */}
            {successMessage && (
              <div className="mb-4 p-3.5 rounded-xl bg-teal-50 border border-teal-100/60 text-teal-700 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#007A87] shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* ── ACCOUNT LOCKED ── */}
            {isLocked && (
              <div className="text-center py-6 animate-fade">
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-200 shadow-inner">
                  <LockKeyhole className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Account Temporarily Locked</h3>
                <p className="text-slate-500 text-xs mt-2 max-w-sm mx-auto font-medium">
                  Too many failed login attempts. To protect patient healthcare records, this device access is temporarily disabled.
                </p>
                <div className="mt-4 text-2xl font-black text-rose-600 font-mono bg-rose-50 border border-rose-100 inline-block px-4 py-1.5 rounded-xl">
                  {formatTime(lockCountdown)}
                </div>
                <p className="text-[10px] text-slate-400 mt-3 font-bold uppercase tracking-wider">Please wait before trying again.</p>
              </div>
            )}

            {/* ── LOGIN SCREEN ── */}
            {!isLocked && authState === 'login' && (
              <div className="animate-fade">
                <div className="mb-8">
                  <h2 className="text-3xl font-black text-slate-800 tracking-tight leading-none">Welcome Back!</h2>
                  <p className="text-slate-500 text-sm mt-2 font-medium">Login to access your VIZITO account</p>
                </div>

                {/* Tabs selection header */}
                <div className="grid grid-cols-4 border-b border-slate-100 -mx-8 px-4 mb-6">
                  <button
                    type="button"
                    onClick={() => { setLoginType('mobile'); setAuthMethod('otp'); setErrorMessage(''); }}
                    className={`flex flex-col items-center pb-3 text-center border-b-2 transition-all gap-1.5 cursor-pointer ${
                      loginType === 'mobile' && authMethod === 'otp'
                        ? 'border-[#007A87] text-[#007A87]'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                    <span className="text-[10px] font-bold tracking-tight whitespace-nowrap">Mobile + OTP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setLoginType('mobile'); setAuthMethod('password'); setErrorMessage(''); }}
                    className={`flex flex-col items-center pb-3 text-center border-b-2 transition-all gap-1.5 cursor-pointer ${
                      loginType === 'mobile' && authMethod === 'password'
                        ? 'border-[#007A87] text-[#007A87]'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-center relative">
                      <Smartphone className="w-5 h-5" />
                      <span className="absolute bottom-0 right-0 bg-white rounded-full p-px"><Lock className="w-2.5 h-2.5" /></span>
                    </div>
                    <span className="text-[10px] font-bold tracking-tight whitespace-nowrap">Mobile + Password</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setLoginType('email'); setAuthMethod('otp'); setErrorMessage(''); }}
                    className={`flex flex-col items-center pb-3 text-center border-b-2 transition-all gap-1.5 cursor-pointer ${
                      loginType === 'email' && authMethod === 'otp'
                        ? 'border-[#007A87] text-[#007A87]'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <Mail className="w-5 h-5" />
                    <span className="text-[10px] font-bold tracking-tight whitespace-nowrap">Email + OTP</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setLoginType('email'); setAuthMethod('password'); setErrorMessage(''); }}
                    className={`flex flex-col items-center pb-3 text-center border-b-2 transition-all gap-1.5 cursor-pointer ${
                      loginType === 'email' && authMethod === 'password'
                        ? 'border-[#007A87] text-[#007A87]'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    <KeyRound className="w-5 h-5" />
                    <span className="text-[10px] font-bold tracking-tight whitespace-nowrap">Email + Password</span>
                  </button>
                </div>

                {/* Main Auth Form */}
                <form
                  onSubmit={authMethod === 'otp' ? handleSendOTP : handlePasswordLogin}
                  className="space-y-5"
                >
                  {/* Contact Fields (Mobile/Email) */}
                  {loginType === 'mobile' ? (
                    <div className="form-group mb-0">
                      <label className="form-label text-slate-600 font-bold text-xs">Mobile Number</label>
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden px-3 bg-white focus-within:border-[#007A87] focus-within:ring-4 focus-within:ring-teal-500/10 transition-all">
                        <div className="flex items-center gap-1.5 cursor-pointer select-none py-3 text-slate-700">
                          <span className="text-base">🇮🇳</span>
                          <span className="font-bold text-sm">+91</span>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                        <div className="w-px h-6 bg-slate-200 mx-3.5 shrink-0" />
                        <input
                          type="tel"
                          maxLength={10}
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                          placeholder="Enter your mobile number"
                          className="flex-1 py-3 text-sm font-semibold text-slate-800 bg-transparent outline-none placeholder:text-slate-400"
                          required
                        />
                      </div>
                      {authMethod === 'otp' && (
                        <p className="text-[11px] text-slate-400 font-semibold mt-2">
                          We will send you a 6-digit OTP to verify your number
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="form-group mb-0">
                      <label className="form-label text-slate-600 font-bold text-xs">Email Address</label>
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden px-3 bg-white focus-within:border-[#007A87] focus-within:ring-4 focus-within:ring-teal-500/10 transition-all">
                        <Mail className="w-4.5 h-4.5 text-slate-400 mr-2 shrink-0" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email address"
                          className="flex-1 py-3 text-sm font-semibold text-slate-800 bg-transparent outline-none placeholder:text-slate-400"
                          required
                        />
                      </div>
                      {authMethod === 'otp' && (
                        <p className="text-[11px] text-slate-400 font-semibold mt-2">
                          We will send you a 6-digit OTP to verify your email
                        </p>
                      )}
                    </div>
                  )}

                  {/* Password Field (Only for password auth) */}
                  {authMethod === 'password' && (
                    <div className="form-group mb-0">
                      <label className="form-label text-slate-600 font-bold text-xs">Password</label>
                      <div className="relative flex items-center border border-slate-200 rounded-xl overflow-hidden px-3 bg-white focus-within:border-[#007A87] focus-within:ring-4 focus-within:ring-teal-500/10 transition-all">
                        <Lock className="w-4.5 h-4.5 text-slate-400 mr-2 shrink-0" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="flex-1 py-3 text-sm font-semibold text-slate-800 bg-transparent outline-none placeholder:text-slate-400 pr-10"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-[#007A87] hover:bg-[#006670] text-white py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center relative shadow-md shadow-teal-600/10 cursor-pointer mt-6"
                  >
                    <span>{authMethod === 'otp' ? 'Send OTP' : 'Login'}</span>
                    <Send className="w-4 h-4 absolute right-4 text-white/90" />
                  </button>
                </form>

                {/* OR Divider */}
                <div className="flex items-center my-6">
                  <div className="flex-grow h-px bg-slate-100" />
                  <span className="px-4 text-[10px] font-extrabold text-slate-400 tracking-wider">OR</span>
                  <div className="flex-grow h-px bg-slate-100" />
                </div>

                {/* Social logins */}
                <div className="space-y-3">
                  <button
                    type="button"
                    className="w-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50 text-slate-700 py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span>Continue with Google</span>
                  </button>

                  <button
                    type="button"
                    className="w-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50 text-slate-700 py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-3 cursor-pointer shadow-sm"
                  >
                    <svg className="w-4 h-4 text-black fill-current shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.82M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.51-.64.74-1.2 1.88-1.05 3 .1.11 2.34.8 2.02-.15.02-.02.04-.03.04-.04z" />
                    </svg>
                    <span>Continue with Apple</span>
                  </button>
                </div>

                {/* Checkbox and Forgot Password footer */}
                <div className="flex items-center justify-between mt-6 pt-4 text-xs font-semibold text-slate-600">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#007A87] border-slate-300 focus:ring-[#007A87] cursor-pointer"
                    />
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setAuthState('forgot-select')}
                    className="text-[#007A87] font-bold hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
            )}

            {/* ── OTP VERIFY ── */}
            {!isLocked && authState === 'otp-verify' && (
              <div className="animate-fade">
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-slate-800">Enter OTP</h2>
                  <p className="text-slate-500 text-sm mt-1 font-medium leading-relaxed">
                    We've sent a 6-digit passcode to{' '}
                    <strong className="text-slate-700">{loginType === 'mobile' ? '+91 ' + mobile : email}</strong>.
                  </p>
                </div>

                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="form-group text-center">
                    <label className="form-label text-slate-600 font-bold text-xs text-left">6-Digit Verification Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter code"
                      className="form-control text-center text-2xl font-black tracking-widest font-mono"
                      required
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs py-1 font-semibold">
                    <span className="text-slate-400">
                      OTP expires in:{' '}
                      <strong className={otpCountdown < 60 ? 'text-rose-500' : 'text-slate-600'}>{formatTime(otpCountdown)}</strong>
                    </span>
                    <button
                      type="button"
                      disabled={otpCountdown > 0}
                      onClick={() => { setOtpCountdown(300); setSuccessMessage('New OTP code 123456 sent successfully!'); }}
                      className="text-[#007A87] font-bold hover:underline disabled:text-slate-350 disabled:no-underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Resend OTP
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#007A87] hover:bg-[#006670] text-white py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center cursor-pointer shadow-md shadow-teal-600/10 mt-2"
                  >
                    Verify &amp; Enter Dashboard
                  </button>
                </form>
              </div>
            )}

            {/* ── FORGOT: Select Method ── */}
            {authState === 'forgot-select' && (
              <div className="animate-fade">
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-slate-800">Forgot Password</h2>
                  <p className="text-slate-500 text-sm mt-1 font-medium">Choose how you want to reset your password.</p>
                </div>
                <div className="space-y-3">
                  <button type="button" onClick={() => handleForgotSelect('mobile')} className="w-full p-4 rounded-2xl border border-slate-200 hover:border-[#007A87]/30 bg-white hover:bg-slate-50 transition-all flex items-center gap-4 text-left cursor-pointer">
                    <span className="p-3 rounded-xl bg-teal-50 text-teal-600 shrink-0"><Phone className="w-5 h-5" /></span>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm">Recover via Mobile Number</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">Send standard 6-digit OTP verification code.</p>
                    </div>
                  </button>
                  <button type="button" onClick={() => handleForgotSelect('email')} className="w-full p-4 rounded-2xl border border-slate-200 hover:border-[#007A87]/30 bg-white hover:bg-slate-50 transition-all flex items-center gap-4 text-left cursor-pointer">
                    <span className="p-3 rounded-xl bg-sky-50 text-sky-600 shrink-0"><Mail className="w-5 h-5" /></span>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm">Recover via Email Address</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">Send custom recovery email link containing code.</p>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* ── FORGOT: Enter Contact ── */}
            {authState === 'forgot-input' && (
              <div className="animate-fade">
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-slate-800">Forgot Password</h2>
                  <p className="text-slate-500 text-sm mt-1 font-medium">
                    Enter your registered {recoveryMethod === 'mobile' ? 'mobile number' : 'email address'} to continue.
                  </p>
                </div>
                <form onSubmit={handleRecoverySend} className="space-y-4">
                  {recoveryMethod === 'mobile' ? (
                    <div className="form-group mb-0">
                      <label className="form-label text-slate-600 font-bold text-xs">Mobile Number</label>
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden px-3 bg-white focus-within:border-[#007A87] focus-within:ring-4 focus-within:ring-teal-500/10 transition-all">
                        <span className="pr-3 py-3 text-slate-500 font-bold text-sm whitespace-nowrap">+91</span>
                        <div className="w-px h-5 bg-slate-200 mr-3 shrink-0" />
                        <input type="tel" maxLength={10} value={recoveryMobile} onChange={(e) => setRecoveryMobile(e.target.value.replace(/\D/g, ''))} placeholder="Enter your mobile number" className="flex-1 py-3 text-sm font-semibold text-slate-800 bg-transparent outline-none placeholder:text-slate-400" required />
                      </div>
                    </div>
                  ) : (
                    <div className="form-group mb-0">
                      <label className="form-label text-slate-600 font-bold text-xs">Email Address</label>
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden px-3 bg-white focus-within:border-[#007A87] focus-within:ring-4 focus-within:ring-teal-500/10 transition-all">
                        <Mail className="w-4.5 h-4.5 text-slate-400 mr-2 shrink-0" />
                        <input type="email" value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} placeholder="doctor@vizito.com" className="flex-1 py-3 text-sm font-semibold text-slate-800 bg-transparent outline-none placeholder:text-slate-400" required />
                      </div>
                    </div>
                  )}
                  <button type="submit" className="w-full bg-[#007A87] hover:bg-[#006670] text-white py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center cursor-pointer shadow-md shadow-teal-600/10 mt-4">Continue</button>
                </form>
              </div>
            )}

            {/* ── FORGOT: OTP Verify ── */}
            {authState === 'forgot-otp' && (
              <div className="animate-fade">
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-slate-800">Verify Code</h2>
                  <p className="text-slate-500 text-sm mt-1 font-medium">Enter the 6-digit confirmation code we sent to your device.</p>
                </div>
                <form onSubmit={handleRecoveryVerify} className="space-y-4">
                  <div className="form-group">
                    <label className="form-label text-slate-600 font-bold text-xs">Verification Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={recoveryOtp}
                      onChange={(e) => setRecoveryOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter code"
                      className="form-control text-center text-xl font-bold tracking-widest font-mono"
                      required
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs py-1 font-semibold">
                    <span className="text-slate-400">Expires in: {formatTime(otpCountdown)}</span>
                    <button type="button" disabled={otpCountdown > 0} onClick={() => { setOtpCountdown(300); setSuccessMessage('Code 123456 resent!'); }} className="text-[#007A87] font-bold hover:underline disabled:text-slate-300 cursor-pointer">
                      Resend Code
                    </button>
                  </div>
                  <button type="submit" className="w-full bg-[#007A87] hover:bg-[#006670] text-white py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center cursor-pointer shadow-md shadow-teal-600/10">Verify OTP</button>
                </form>
              </div>
            )}

            {/* ── FORGOT: New Password ── */}
            {authState === 'forgot-reset' && (
              <div className="animate-fade">
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-slate-800">Create New Password</h2>
                  <p className="text-slate-500 text-sm mt-1 font-medium">Ensure it meets clinical password complexity guidelines.</p>
                </div>
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="form-group">
                    <label className="form-label text-slate-600 font-bold text-xs">New Password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 8 chars, 1 Upper, 1 Lower, 1 Num, 1 Spec" className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label text-slate-600 font-bold text-xs">Confirm Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" className="form-control" required />
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] text-slate-500 space-y-1 font-bold">
                    <div className="text-slate-700">Password Requirements:</div>
                    <div>• Minimum 8 characters long</div>
                    <div>• At least 1 uppercase &amp; 1 lowercase letter</div>
                    <div>• At least 1 numeric digit (0-9)</div>
                    <div>• At least 1 special symbol (e.g. @, $, !, %, *, ?, &amp;)</div>
                  </div>
                  <button type="submit" className="w-full bg-[#007A87] hover:bg-[#006670] text-white py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center cursor-pointer shadow-md shadow-teal-600/10">Update Password</button>
                </form>
              </div>
            )}

            {/* ── FORGOT: Success ── */}
            {authState === 'forgot-success' && (
              <div className="text-center py-6 animate-fade">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Password Updated Successfully</h3>
                <p className="text-slate-500 text-xs mt-2 max-w-xs mx-auto font-medium leading-relaxed">
                  Your password has been changed successfully.
                </p>
                <button
                  onClick={() => {
                    setAuthState('login');
                    setSuccessMessage('');
                    setErrorMessage('');
                    setPassword('');
                    setMobile('');
                    setEmail('');
                  }}
                  className="w-full bg-[#007A87] hover:bg-[#006670] text-white py-3.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center cursor-pointer shadow-md shadow-teal-600/10 mt-6"
                >
                  Login Now
                </button>
              </div>
            )}

          </div>

          {/* Protected statement */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-semibold">
            <ShieldCheck className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
            <span>Your data is protected with enterprise-grade security</span>
          </div>

        </div>

        {/* Empty bottom spacing div to push card layout to center vertically on tall viewports */}
        <div className="h-4" />
      </div>
    </div>
  );
}
