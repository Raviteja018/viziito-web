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
    <div className="flex-1 min-h-0 overflow-y-auto flex flex-col px-4 bg-gradient-to-br from-slate-50 via-teal-50/30 to-sky-50/30 animate-fade">
      <div className="w-full max-w-md mx-auto my-auto py-8">

        {/* Logo Header */}
        
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100/80 p-6">
        <div className="flex flex-col items-center mb-2">
          <img src={logoImg} alt="VIZITO" className="h-20 w-auto object-contain" />
        </div>

          {/* Back button */}
          {authState !== 'login' && authState !== 'forgot-success' && (
            <button
              onClick={goBackToLogin}
              className="inline-flex items-center gap-1 text-slate-400 hover:text-teal-600 text-xs font-bold uppercase transition-all mb-5"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </button>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold flex items-center gap-2 animate-pulse">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
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

          {/* ── LOGIN ── */}
          {!isLocked && authState === 'login' && (
            <div className="animate-fade">
              <div className="mb-6">
                <h2 className="text-2xl font-black text-slate-800">Welcome Back</h2>
                <p className="text-slate-500 text-sm mt-1 font-medium">Login to access your healthcare ecosystem.</p>
              </div>

              {/* Login Type Tabs */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => { setLoginType('mobile'); setErrorMessage(''); }}
                  className={`py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${loginType === 'mobile' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <Phone className="w-3.5 h-3.5" /> Mobile Number
                </button>
                <button
                  type="button"
                  onClick={() => { setLoginType('email'); setErrorMessage(''); }}
                  className={`py-2 px-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${loginType === 'email' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  <Mail className="w-3.5 h-3.5" /> Email Address
                </button>
              </div>

              {/* Auth Method Tabs */}
              <div className="flex gap-6 mb-6 border-b border-slate-100 pb-3">
                <label className="flex items-center gap-2 text-xs font-extrabold text-slate-500 cursor-pointer">
                  <input type="radio" name="authMethod" checked={authMethod === 'otp'} onChange={() => setAuthMethod('otp')} className="accent-teal-600" />
                  <span>OTP SECURE LOGIN</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-extrabold text-slate-500 cursor-pointer">
                  <input type="radio" name="authMethod" checked={authMethod === 'password'} onChange={() => setAuthMethod('password')} className="accent-teal-600" />
                  <span>PASSWORD LOGIN</span>
                </label>
              </div>

              {/* OTP Form */}
              {authMethod === 'otp' && (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  {loginType === 'mobile' ? (
                    <div className="form-group">
                      <label className="form-label">Mobile Number</label>
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-500/10 transition-all">
                        <span className="px-3 py-3 bg-slate-50 border-r border-slate-200 text-slate-500 font-bold text-sm whitespace-nowrap">+91</span>
                        <input type="tel" maxLength={10} value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} placeholder="98765 43210" className="flex-1 px-3 py-3 text-sm font-semibold text-slate-800 bg-white outline-none placeholder:text-slate-400" required />
                      </div>
                    </div>
                  ) : (
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="doctor@vizito.com" className="form-control" required />
                    </div>
                  )}
                  <button type="submit" className="btn btn-primary w-full py-3.5 shadow-lg shadow-teal-600/15">Send Secure OTP</button>
                </form>
              )}

              {/* Password Form */}
              {authMethod === 'password' && (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  {loginType === 'mobile' ? (
                    <div className="form-group">
                      <label className="form-label">Mobile Number</label>
                      <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-500/10 transition-all">
                        <span className="px-3 py-3 bg-slate-50 border-r border-slate-200 text-slate-500 font-bold text-sm whitespace-nowrap">+91</span>
                        <input type="tel" maxLength={10} value={mobile} onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))} placeholder="98765 43210" className="flex-1 px-3 py-3 text-sm font-semibold text-slate-800 bg-white outline-none placeholder:text-slate-400" required />
                      </div>
                    </div>
                  ) : (
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="doctor@vizito.com" className="form-control" required />
                    </div>
                  )}

                  <div className="form-group">
                    <div className="flex justify-between items-center mb-1">
                      <label className="form-label mb-0">Password</label>
                      <button type="button" onClick={() => setAuthState('forgot-select')} className="text-xs text-teal-600 font-bold hover:underline">
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="form-control pr-10"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 py-1">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer">
                      <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="accent-teal-600 w-4 h-4 rounded" />
                      <span>Remember Me on this device</span>
                    </label>
                  </div>

                  <button type="submit" className="btn btn-primary w-full py-3.5 shadow-lg shadow-teal-600/15">Login</button>
                </form>
              )}

              {/* Register Link */}
              <div className="text-center text-xs text-slate-500 mt-6 pt-6 border-t border-slate-100 font-medium">
                Don't have an account?{' '}
                <button onClick={onRegisterClick} className="text-teal-600 font-bold hover:underline">Register Now</button>
              </div>
            </div>
          )}

          {/* ── OTP VERIFY ── */}
          {!isLocked && authState === 'otp-verify' && (
            <div className="animate-fade">
              <div className="mb-6">
                <h2 className="text-2xl font-black text-slate-800">Enter OTP</h2>
                <p className="text-slate-500 text-sm mt-1 font-medium">
                  We've sent a 6-digit passcode to{' '}
                  <strong className="text-slate-700">{loginType === 'mobile' ? '+91 ' + mobile : email}</strong>.
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="form-group text-center">
                  <label className="form-label text-left">6-Digit Verification Code</label>
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

                <div className="flex items-center justify-between text-xs py-1">
                  <span className="text-slate-400 font-semibold">
                    OTP expires in:{' '}
                    <strong className={otpCountdown < 60 ? 'text-rose-500' : 'text-slate-600'}>{formatTime(otpCountdown)}</strong>
                  </span>
                  <button
                    type="button"
                    disabled={otpCountdown > 0}
                    onClick={() => { setOtpCountdown(300); setSuccessMessage('New OTP code 123456 sent successfully!'); }}
                    className="text-teal-600 font-bold hover:underline disabled:text-slate-300 disabled:no-underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Resend OTP
                  </button>
                </div>

                <button type="submit" className="btn btn-primary w-full py-3.5 shadow-lg shadow-teal-600/15">Verify &amp; Enter Dashboard</button>
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
                <button type="button" onClick={() => handleForgotSelect('mobile')} className="w-full p-4 rounded-2xl border border-slate-200 hover:border-teal-500/30 bg-white hover:bg-slate-50 transition-all flex items-center gap-4 text-left cursor-pointer">
                  <span className="p-3 rounded-xl bg-teal-50 text-teal-600"><Phone className="w-5 h-5" /></span>
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">Recover via Mobile Number</h4>
                    <p className="text-[10px] text-slate-400 font-semibold">Send standard 6-digit OTP verification code.</p>
                  </div>
                </button>
                <button type="button" onClick={() => handleForgotSelect('email')} className="w-full p-4 rounded-2xl border border-slate-200 hover:border-teal-500/30 bg-white hover:bg-slate-50 transition-all flex items-center gap-4 text-left cursor-pointer">
                  <span className="p-3 rounded-xl bg-sky-50 text-sky-600"><Mail className="w-5 h-5" /></span>
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
                  <div className="form-group">
                    <label className="form-label">Mobile Number</label>
                    <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-500/10 transition-all">
                      <span className="px-3 py-3 bg-slate-50 border-r border-slate-200 text-slate-500 font-bold text-sm whitespace-nowrap">+91</span>
                      <input type="tel" maxLength={10} value={recoveryMobile} onChange={(e) => setRecoveryMobile(e.target.value.replace(/\D/g, ''))} placeholder="98765 43210" className="flex-1 px-3 py-3 text-sm font-semibold text-slate-800 bg-white outline-none placeholder:text-slate-400" required />
                    </div>
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input type="email" value={recoveryEmail} onChange={(e) => setRecoveryEmail(e.target.value)} placeholder="e.g. doctor@vizito.com" className="form-control" required />
                  </div>
                )}
                <button type="submit" className="btn btn-primary w-full py-3.5">Continue</button>
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
                  <label className="form-label">Verification Code</label>
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
                <div className="flex justify-between items-center text-xs py-1">
                  <span className="text-slate-400 font-semibold">Expires in: {formatTime(otpCountdown)}</span>
                  <button type="button" disabled={otpCountdown > 0} onClick={() => { setOtpCountdown(300); setSuccessMessage('Code 123456 resent!'); }} className="text-teal-600 font-bold hover:underline disabled:text-slate-300">
                    Resend Code
                  </button>
                </div>
                <button type="submit" className="btn btn-primary w-full py-3.5">Verify OTP</button>
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
                  <label className="form-label">New Password</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Min 8 chars, 1 Upper, 1 Lower, 1 Num, 1 Spec" className="form-control" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" className="form-control" required />
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] text-slate-500 space-y-1 font-bold">
                  <div className="text-slate-700">Password Requirements:</div>
                  <div>• Minimum 8 characters long</div>
                  <div>• At least 1 uppercase &amp; 1 lowercase letter</div>
                  <div>• At least 1 numeric digit (0-9)</div>
                  <div>• At least 1 special symbol (e.g. @, $, !, %, *, ?, &amp;)</div>
                </div>
                <button type="submit" className="btn btn-primary w-full py-3.5">Update Password</button>
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
                className="btn btn-primary w-full py-3.5 mt-6 shadow-lg shadow-teal-600/15"
              >
                Login Now
              </button>
            </div>
          )}

        </div>


      </div>
    </div>
  );
}
