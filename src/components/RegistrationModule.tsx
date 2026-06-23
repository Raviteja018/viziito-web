import React, { useState } from 'react';
import type { UserRole } from './UserTypeSelection';
import { ArrowLeft, User, Briefcase, CheckCircle2, ShieldAlert } from 'lucide-react';

interface RegistrationModuleProps {
  role: UserRole;
  onBackToRoles: () => void;
  onRegisterSuccess: (userData: any) => void;
}

export default function RegistrationModule({ role, onBackToRoles, onRegisterSuccess }: RegistrationModuleProps) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Step 1 Fields
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');

  // Step 2 Fields
  const [medicalRegNo, setMedicalRegNo] = useState('');
  const [qualification, setQualification] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [experience, setExperience] = useState('');
  const [languagesKnown, setLanguagesKnown] = useState('');
  const [consultationType, setConsultationType] = useState('Both');

  // Org Specific Step 1 Fields
  const [orgName, setOrgName] = useState('');
  const [authorizedPerson, setAuthorizedPerson] = useState('');
  
  // Org Specific Step 2 Fields
  const [hospitalRegNo, setHospitalRegNo] = useState('');
  const [numBeds, setNumBeds] = useState('');
  const [departments, setDepartments] = useState('');
  const [clinicRegNo, setClinicRegNo] = useState('');
  const [clinicType, setClinicType] = useState('');
  const [drugLicenseNo, setDrugLicenseNo] = useState('');
  const [diagRegNo, setDiagRegNo] = useState('');
  const [servicesOffered, setServicesOffered] = useState('');
  const [fleetSize, setFleetSize] = useState('');

  const isDoctor = role === 'doctor';
  const isPatient = role === 'patient';

  // Format header title
  const getRoleTitle = () => {
    switch (role) {
      case 'doctor': return "Doctor Registration";
      case 'hospital': return "Hospital Registration";
      case 'clinic': return "Clinic Registration";
      case 'pharmacy': return "Pharmacy Registration";
      case 'diagnostic': return "Diagnostic Center Registration";
      case 'homecare': return "Home Care Provider Registration";
      case 'ambulance': return "Ambulance Provider Registration";
      case 'patient': return "Patient Registration";
      default: return "Registration";
    }
  };

  // Validation routines
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (isDoctor || isPatient) {
      if (!fullName.trim()) errs.fullName = "Full Name is required";
      if (!dob) errs.dob = "Date of Birth is required";
      if (!gender) errs.gender = "Gender is required";
    } else {
      if (!orgName.trim()) errs.orgName = "Organization Name is required";
      if (!authorizedPerson.trim()) errs.authorizedPerson = "Authorized Person Name is required";
    }

    if (!mobileNumber.trim()) {
      errs.mobileNumber = "Mobile Number is required";
    } else if (mobileNumber.trim().length !== 10) {
      errs.mobileNumber = "Mobile Number must be exactly 10 digits";
    }

    if (!emailAddress.trim()) {
      errs.emailAddress = "Email Address is required";
    } else if (!emailRegex.test(emailAddress.trim())) {
      errs.emailAddress = "Please enter a valid email address";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};

    if (isDoctor) {
      if (!medicalRegNo.trim()) errs.medicalRegNo = "Medical Registration Number is required";
      if (!qualification.trim()) errs.qualification = "Qualification is required";
      if (!specialization.trim()) errs.specialization = "Specialization is required";
      if (!experience.trim()) errs.experience = "Experience in years is required";
    } else if (role === 'hospital') {
      if (!hospitalRegNo.trim()) errs.hospitalRegNo = "Hospital Registration Number is required";
    } else if (role === 'clinic') {
      if (!clinicRegNo.trim()) errs.clinicRegNo = "Clinic Registration Number is required";
    } else if (role === 'pharmacy') {
      if (!drugLicenseNo.trim()) errs.drugLicenseNo = "Drug License Number is required";
    } else if (role === 'diagnostic') {
      if (!diagRegNo.trim()) errs.diagRegNo = "Diagnostic Registration Number is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleStep1Continue = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      if (isPatient) {
        // Patient doesn't need step 2 info, register directly
        handleSubmit(e);
      } else {
        setStep(2);
        setErrors({});
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPatient || validateStep2()) {
      const data = {
        role,
        fullName: isDoctor || isPatient ? fullName : authorizedPerson,
        orgName: !isDoctor && !isPatient ? orgName : '',
        email: emailAddress,
        mobile: mobileNumber,
        dob,
        gender,
        professionalInfo: isDoctor ? {
          medicalRegNo,
          qualification,
          specialization,
          experience,
          languagesKnown,
          consultationType
        } : {
          hospitalRegNo,
          numBeds,
          departments,
          clinicRegNo,
          clinicType,
          drugLicenseNo,
          diagRegNo,
          servicesOffered,
          fleetSize
        }
      };
      
      onRegisterSuccess(data);
    }
  };

  return (
    <div className="flex-1 min-h-0 overflow-y-auto animate-fade">
      <div className="flex flex-col items-center py-8 px-6 max-w-3xl mx-auto w-full">
      {/* Back Button */}
      <div className="w-full flex justify-start mb-6">
        <button 
          onClick={step === 2 ? () => setStep(1) : onBackToRoles}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 text-xs font-bold uppercase transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> {step === 2 ? "Back to Step 1" : "Change User Type"}
        </button>
      </div>

      <div className="glass-panel w-full bg-white p-8 md:p-10 border border-slate-100 shadow-xl rounded-3xl relative overflow-hidden">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-500 to-sky-500"></div>

        {/* Stepper Headers */}
        {!isPatient && (
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step === 1 ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' : 'bg-teal-100 text-teal-700'
              }`}>
                1
              </span>
              <span className={`text-xs font-extrabold ${step === 1 ? 'text-slate-800' : 'text-slate-400'}`}>
                {isDoctor ? "Personal Info" : "Organization Info"}
              </span>
            </div>
            <div className="h-0.5 w-12 bg-slate-100"></div>
            <div className="flex items-center gap-2">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                step === 2 ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20' : 'bg-slate-100 text-slate-400'
              }`}>
                2
              </span>
              <span className={`text-xs font-extrabold ${step === 2 ? 'text-slate-800' : 'text-slate-400'}`}>
                Professional Details
              </span>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            {step === 1 ? <User className="w-6 h-6 text-teal-600" /> : <Briefcase className="w-6 h-6 text-teal-600" />}
            {getRoleTitle()}
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            {step === 1 
              ? "Please provide your primary details to initialize your VIZITO account." 
              : "Enter your verified clinical and professional details below."}
          </p>
        </div>

        {step === 1 ? (
          <form onSubmit={handleStep1Continue} className="space-y-5">
            {/* Conditional Doctor / Patient Personal Info */}
            {(isDoctor || isPatient) ? (
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input 
                  type="text" 
                  className={`form-control ${errors.fullName ? 'border-rose-400' : ''}`}
                  placeholder="Dr. John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                {errors.fullName && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.fullName}</p>}
              </div>
            ) : (
              // Organization Specific Info
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group mb-0">
                  <label className="form-label">Organization Name *</label>
                  <input 
                    type="text" 
                    className={`form-control ${errors.orgName ? 'border-rose-400' : ''}`}
                    placeholder="e.g. City Care Hospital"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    required
                  />
                  {errors.orgName && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.orgName}</p>}
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Authorized Person Name *</label>
                  <input 
                    type="text" 
                    className={`form-control ${errors.authorizedPerson ? 'border-rose-400' : ''}`}
                    placeholder="e.g. Jane Smith (Administrator)"
                    value={authorizedPerson}
                    onChange={(e) => setAuthorizedPerson(e.target.value)}
                    required
                  />
                  {errors.authorizedPerson && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.authorizedPerson}</p>}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group mb-0">
                <label className="form-label">Mobile Number *</label>
                <div className={`flex items-center border rounded-xl overflow-hidden focus-within:border-teal-500 focus-within:ring-4 focus-within:ring-teal-500/10 transition-all ${errors.mobileNumber ? 'border-rose-450' : 'border-slate-200'}`}>
                  <span className="px-3.5 py-3 bg-slate-50 border-r border-slate-200 text-slate-500 font-bold text-sm whitespace-nowrap">
                    +91
                  </span>
                  <input 
                    type="tel" 
                    maxLength={10}
                    className="flex-1 px-4 py-3 text-sm font-semibold text-slate-800 bg-white outline-none placeholder:text-slate-400"
                    placeholder="98765 43210"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    required
                  />
                </div>
                {errors.mobileNumber && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.mobileNumber}</p>}
              </div>

              <div className="form-group mb-0">
                <label className="form-label">Email Address *</label>
                <input 
                  type="email" 
                  className={`form-control ${errors.emailAddress ? 'border-rose-400' : ''}`}
                  placeholder="name@healthcare.com"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  required
                />
                {errors.emailAddress && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.emailAddress}</p>}
              </div>
            </div>

            {(isDoctor || isPatient) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group mb-0">
                  <label className="form-label">Date of Birth *</label>
                  <input 
                    type="date" 
                    className={`form-control ${errors.dob ? 'border-rose-400' : ''}`}
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    required
                  />
                  {errors.dob && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.dob}</p>}
                </div>

                <div className="form-group mb-0">
                  <label className="form-label">Gender *</label>
                  <select 
                    className={`form-control ${errors.gender ? 'border-rose-400' : ''}`}
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.gender && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.gender}</p>}
                </div>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary w-full py-3.5 mt-4"
            >
              {isPatient ? "Submit Registration" : "Continue to Professional Info"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Step 2: Doctor Specific Fields */}
            {isDoctor && (
              <>
                <div className="form-group mb-0">
                  <label className="form-label">Medical Registration Number *</label>
                  <input 
                    type="text" 
                    className={`form-control ${errors.medicalRegNo ? 'border-rose-400' : ''}`}
                    placeholder="e.g. MCI-12345"
                    value={medicalRegNo}
                    onChange={(e) => setMedicalRegNo(e.target.value)}
                    required
                  />
                  {errors.medicalRegNo && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.medicalRegNo}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group mb-0">
                    <label className="form-label">Qualification *</label>
                    <input 
                      type="text" 
                      className={`form-control ${errors.qualification ? 'border-rose-400' : ''}`}
                      placeholder="e.g. MBBS, MD"
                      value={qualification}
                      onChange={(e) => setQualification(e.target.value)}
                      required
                    />
                    {errors.qualification && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.qualification}</p>}
                  </div>

                  <div className="form-group mb-0">
                    <label className="form-label">Specialization *</label>
                    <input 
                      type="text" 
                      className={`form-control ${errors.specialization ? 'border-rose-400' : ''}`}
                      placeholder="e.g. Cardiologist"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      required
                    />
                    {errors.specialization && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.specialization}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group mb-0">
                    <label className="form-label">Experience (Years) *</label>
                    <input 
                      type="number" 
                      min={0}
                      className={`form-control ${errors.experience ? 'border-rose-400' : ''}`}
                      placeholder="e.g. 10"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      required
                    />
                    {errors.experience && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.experience}</p>}
                  </div>

                  <div className="form-group mb-0">
                    <label className="form-label">Languages Known (Optional)</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="e.g. English, Hindi, Spanish"
                      value={languagesKnown}
                      onChange={(e) => setLanguagesKnown(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Consultation Type</label>
                  <select 
                    className="form-control"
                    value={consultationType}
                    onChange={(e) => setConsultationType(e.target.value)}
                  >
                    <option value="Online">Online Consultation</option>
                    <option value="In-Clinic">In-Clinic Consultation</option>
                    <option value="Both">Both (Online & In-Clinic)</option>
                  </select>
                </div>
              </>
            )}

            {/* Dynamic Org Types */}
            {role === 'hospital' && (
              <>
                <div className="form-group mb-0">
                  <label className="form-label">Hospital Registration Number *</label>
                  <input 
                    type="text" 
                    className={`form-control ${errors.hospitalRegNo ? 'border-rose-400' : ''}`}
                    placeholder="e.g. HOSP-9876"
                    value={hospitalRegNo}
                    onChange={(e) => setHospitalRegNo(e.target.value)}
                    required
                  />
                  {errors.hospitalRegNo && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.hospitalRegNo}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group mb-0">
                    <label className="form-label">Number of Beds</label>
                    <input 
                      type="number" 
                      className="form-control"
                      placeholder="e.g. 150"
                      value={numBeds}
                      onChange={(e) => setNumBeds(e.target.value)}
                    />
                  </div>
                  <div className="form-group mb-0">
                    <label className="form-label">Departments</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="e.g. ICU, Cardiology, ER, Paediatrics"
                      value={departments}
                      onChange={(e) => setDepartments(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            {role === 'clinic' && (
              <>
                <div className="form-group mb-0">
                  <label className="form-label">Clinic Registration Number *</label>
                  <input 
                    type="text" 
                    className={`form-control ${errors.clinicRegNo ? 'border-rose-400' : ''}`}
                    placeholder="e.g. CLN-8822"
                    value={clinicRegNo}
                    onChange={(e) => setClinicRegNo(e.target.value)}
                    required
                  />
                  {errors.clinicRegNo && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.clinicRegNo}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label">Clinic Type</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="e.g. Dental, Paediatric, General Checkup"
                    value={clinicType}
                    onChange={(e) => setClinicType(e.target.value)}
                  />
                </div>
              </>
            )}

            {role === 'pharmacy' && (
              <div className="form-group mb-0">
                <label className="form-label">Drug License Number *</label>
                <input 
                  type="text" 
                  className={`form-control ${errors.drugLicenseNo ? 'border-rose-400' : ''}`}
                  placeholder="e.g. DL-66778"
                  value={drugLicenseNo}
                  onChange={(e) => setDrugLicenseNo(e.target.value)}
                  required
                />
                {errors.drugLicenseNo && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.drugLicenseNo}</p>}
              </div>
            )}

            {role === 'diagnostic' && (
              <div className="form-group mb-0">
                <label className="form-label">Diagnostic Center Registration Number *</label>
                <input 
                  type="text" 
                  className={`form-control ${errors.diagRegNo ? 'border-rose-400' : ''}`}
                  placeholder="e.g. DIAG-2234"
                  value={diagRegNo}
                  onChange={(e) => setDiagRegNo(e.target.value)}
                  required
                />
                {errors.diagRegNo && <p className="text-rose-500 text-xs mt-1 font-bold">{errors.diagRegNo}</p>}
              </div>
            )}

            {role === 'homecare' && (
              <div className="form-group">
                <label className="form-label">Services Offered</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="e.g. Geriatric Care, Post-Stroke Rehab, Physiotherapy"
                  value={servicesOffered}
                  onChange={(e) => setServicesOffered(e.target.value)}
                />
              </div>
            )}

            {role === 'ambulance' && (
              <div className="form-group">
                <label className="form-label">Fleet Size (Number of Emergency Vehicles)</label>
                <input 
                  type="number" 
                  className="form-control"
                  placeholder="e.g. 15"
                  value={fleetSize}
                  onChange={(e) => setFleetSize(e.target.value)}
                />
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary w-full py-3.5 mt-4 animate-pulse"
            >
              Submit Registration
            </button>
          </form>
        )}
      </div>
      </div>
    </div>
  );
}

// Sub-component for Successful registration screen
interface RegistrationSuccessProps {
  role: UserRole;
  fullName: string;
  onGoToDashboard: () => void;
}

export function RegistrationSuccess({ role, fullName, onGoToDashboard }: RegistrationSuccessProps) {
  return (
    <div className="flex-1 min-h-0 overflow-y-auto flex flex-col px-6 w-full animate-fade">
      <div className="flex flex-col items-center max-w-xl mx-auto w-full my-auto py-8">
        <div className="glass-panel w-full bg-white p-10 border border-slate-100 shadow-xl rounded-3xl text-center relative overflow-hidden">
        {/* Pulsing visual circles */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>

        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping"></div>
            <span className="relative block p-4 rounded-full bg-emerald-50 border border-emerald-100 shadow-sm">
              <CheckCircle2 className="w-16 h-16 text-emerald-500" />
            </span>
          </div>
        </div>

        <h2 className="text-3xl font-black text-slate-800">
          Registration Successful!
        </h2>
        <p className="text-teal-600 font-bold text-lg mt-2">
          Welcome to VIZITO, {fullName}.
        </p>
        <span className="inline-block bg-teal-50 text-teal-800 text-xs font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider mt-1.5 mb-2.5">
          Role: {role}
        </span>

        <p className="text-slate-500 mt-4 leading-relaxed text-sm font-medium">
          Your provider account has been initialized successfully. You can begin exploring the platform and utilizing appointment management modules immediately.
        </p>

        <div className="my-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs font-bold leading-relaxed flex items-start gap-2 text-left">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>Complete your Address details, verification documents upload, and Bank KYC inside the dashboard settings to activate settlement transfers and withdrawals.</span>
        </div>

        <button 
          onClick={onGoToDashboard}
          className="btn btn-primary w-full py-4 shadow-lg shadow-teal-600/25 mt-2"
        >
          Go to Dashboard
        </button>
      </div>
      </div>
    </div>
  );
}
