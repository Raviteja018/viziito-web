# Universal Provider Registration Specification

This document details the navigation, steps, forms, validation rules, and business logic for the **Universal Provider Registration** flow in the Vizito platform.

---

## 1. Overview
The Universal Provider Registration module is a public, unauthenticated wizard designed to create the provider identity. To ensure low friction, detailed setup (KYC, banking, document uploads, branch structure, and physical addresses) is deferred to the post-login phase.

---

## 2. Navigation Flow
```
Login
  ↓
Register
  ↓
Step 1: Personal Info
  ↓
Step 2: Provider Type (Category)
  ↓
Step 3: Professional Info (Dynamic Form)
  ↓
Step 4: Review Details
  ↓
Step 5: OTP Verification (Mobile & Email)
  ↓
Step 6: Account Created / Welcome
  ↓
Login / Go to Workspace
```

---

## 3. Detailed Steps and Specifications

### Step 1 – Personal Information
Captures basic representative details.
* **Fields**:
  | Field | Mandatory | Validation |
  | :--- | :---: | :--- |
  | **Full Name** | Yes | 2–100 characters. Letters, spaces, and dots only. |
  | **Mobile Number** | Yes | Exactly 10 digits. Must be unique. |
  | **Email Address** | Yes | Valid email format. Must be unique. |
  | **Date of Birth** | Yes | Must be a valid date. Cannot be in the future. |
  | **Gender** | Yes | Selection: `Male` / `Female` / `Other`. |
* **Validation Behavior**: User cannot continue until all mandatory fields pass Yup verification. Mobile number and email address uniqueness checks are validated at submission.
* **Actions**: `Continue`

### Step 2 – Provider Category
Identifies what type of healthcare provider they are. Only **one** provider category can be selected.
* **Options**:
  - Doctor
  - Hospital
  - Clinic
  - Pharmacy
  - Laboratory / Diagnostic Center
  - Home Care Provider
  - Ambulance Provider
  - Equipment Rental Provider
* **Actions**: `Back`, `Continue`

### Step 3 – Professional Information (Dynamic)
The form fields render dynamically based on the provider category selected in Step 2.
* **Doctor**:
  - **Medical Registration Number** (Mandatory)
  - **Qualification** (Mandatory)
  - **Specialization** (Mandatory)
  - **Years of Experience** (Mandatory, positive number)
  - **Super Specialization** (Optional)
  - **Languages Known** (Optional)
* **Hospital**:
  - **Hospital Name** (Mandatory)
  - **Hospital Registration Number** (Mandatory)
  - **Authorized Person Name** (Mandatory)
* **Clinic**:
  - **Clinic Name** (Mandatory)
  - **Clinic Registration Number** (Mandatory)
  - **Authorized Person Name** (Mandatory)
* **Pharmacy**:
  - **Pharmacy Name** (Mandatory)
  - **Drug License Number** (Mandatory)
  - **Authorized Person Name** (Mandatory)
* **Laboratory / Diagnostic Center**:
  - **Laboratory Name** (Mandatory)
  - **Laboratory Registration Number** (Mandatory)
  - **Authorized Person Name** (Mandatory)
* **Home Care Provider** / **Ambulance Provider** / **Equipment Rental Provider**:
  - **Organization Name** (Mandatory)
  - **Authorized Person Name** (Mandatory)
* **Actions**: `Back`, `Continue`

### Step 4 – Review
A read-only summary displaying all entered details grouped by section.
* **Sections**:
  1. **Personal Information**
  2. **Provider Category**
  3. **Professional Details**
* **Interactions**:
  - Clicking **Edit** next to any section directs the user back to the corresponding step to modify their entries.
* **Actions**: `Back`, `Submit Registration`

### Step 5 – OTP Verification
Sends verification codes to the email address and mobile number captured in Step 1.
* **Fields**:
  - **Mobile OTP** (Mandatory, 6-digit code)
  - **Email OTP** (Mandatory, 6-digit code)
* **Validation Rules**: Both verifications must succeed before the provider account is initialized.
* **Actions**: 
  - `Verify`: Submits the input codes.
  - `Resend OTP`: Becomes available after a 30-second countdown timer.

### Step 6 – Registration Success
Confirmation screen once the registration succeeds.
* **Message**:
  > Welcome to Vizito!
  > Your provider account has been created successfully. You can now log in and complete your organization profile, verification documents, KYC, bank details, and other information from your Provider Workspace.
* **Actions**: `Login to Workspace` (redirects to Login page or dashboard)

---

## 4. Business Rules
1. **Provider Identity Only**: Registration is strictly for initializing the credentials and profile metadata.
2. **Post-Onboarding KYC**: No KYC, tax documents (GST), bank details, physical address, or branch configurations are requested during registration.
3. **Instant Sign-In**: The provider can log in immediately after successful email & mobile OTP validation.
4. **Gradual Profile Completion**: Verification documents, bank details, and other workspace settings can be configured at any time post-login.
5. **Payout Holds**: Settlements and withdrawal payouts remain disabled until the mandatory KYC verification is fully approved by administrators.
