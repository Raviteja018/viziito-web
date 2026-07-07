# Viziito Web — Folder Structure & Component Clearance Guide

This document provides a complete architectural map of the **Viziito Web** codebase. It helps developers locate screens, dashboard engines, widgets, and API handlers, and explains how the multi-role system binds these files together.

---

## 🗺️ High-Level Project Directory Structure

```text
viziito-web/
├── public/                 # Static assets (favicons, browser configurations)
├── src/
│   ├── assets/             # Images, logos, and medical graphics
│   ├── components/         # Global authenticators, splash screen, onboarding
│   ├── layouts/            # Page frames (MainLayout, AuthLayout, DashboardLayout)
│   ├── engines/            # Dynamic layout wrappers and role dashboards
│   │   ├── DashboardEngine/# Role-specific dashboards (Doctor, Patient, Hospital, etc.)
│   │   └── SidebarEngine/  # Role-specific sidebar navigation
│   ├── screensModules/     # Business modules & screens grouped by function
│   ├── services/           # Data fetch APIs divided by domain
│   ├── store/              # Global React Contexts (RoleContext)
│   ├── mocks/              # Rich mock data payloads for simulation
│   ├── App.tsx             # Root React entry
│   ├── main.tsx            # DOM mounting and provider setups
│   └── tsconfig.json       # TypeScript compiler settings
```

---

## 🔄 The Multi-Role System Architecture

Viziito operates as a unified multi-role workspace. The active dashboard and menu navigation change dynamically depending on the current user type.

1. **Role State**: Controlled by the `RoleProvider` ([RoleContext.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/store/role/RoleContext.tsx)). The default role is `'doctor'`.
2. **Dynamic Switching**: For development and demonstration, the top header in [MainLayout.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/layouts/MainLayout.tsx) includes a role selector dropdown. Changing this dropdown updates `role` globally.
3. **Menu Filtering**: [SidebarEngine.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/engines/SidebarEngine/SidebarEngine.tsx) reads the role from context and filters the list of active menus from `allNavItems` using a `.filter(item => item.roles.includes(role))` block.
4. **Dashboard Router**: When users view the `/dashboard` route, `DashboardRouter` inside [AppNavigator.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/navigation/AppNavigator.tsx) mounts the matching sub-dashboard engine (e.g. `PatientDashboardEngine`, `HospitalDashboardEngine`, etc.).

---

## 🏛️ Application Shell & Layouts

Layouts reside in `src/layouts/` and act as nested route wraps.

### 1. [AuthLayout.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/layouts/AuthLayout.tsx)
* **Path**: `src/layouts/AuthLayout.tsx`
* **Route Scope**: `/auth/*` (Login, Register, Role Selection, Onboarding)
* **Aesthetics**: Abstract modern mesh gradients (`teal`/`sky`/`emerald`) and a clean container frame.

### 2. [MainLayout.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/layouts/MainLayout.tsx)
* **Path**: `src/layouts/MainLayout.tsx`
* **Route Scope**: `/*` (All protected application screen sub-routes)
* **Aesthetics**: Global structure utilizing the `Plus Jakarta Sans` font, featuring:
  * **Sidebar**: Renders [SidebarEngine](file:///Users/paydiya/Desktop/Projects/viziito-web/src/engines/SidebarEngine/SidebarEngine.tsx).
  * **Header**: Contains the search input, notifications bell indicator, and the development role toggle.
  * **Main Content Area**: A scrollable viewport containing an `<Outlet />` wrapped in a maximum width container.

### 3. [DashboardLayout.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/layouts/DashboardLayout.tsx)
* **Path**: `src/layouts/DashboardLayout.tsx`
* **Route Scope**: `/dashboard`
* **Purpose**: Simple container wrapping the concrete role dashboard viewport.

---

## 🎛️ Dashboard & Sidebar Engines

Engines in `src/engines/` orchestrate layouts and control components dynamically.

### 1. Sidebar Nav Engines
* **Static Role Sidebar**: [SidebarEngine/SidebarEngine.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/engines/SidebarEngine/SidebarEngine.tsx) (266 lines)
  * Renders the primary role-based navigation utilizing Lucide icons and NavLinks, filtering items using `roles: UserRole[]` arrays.
* **Metadata-Driven Sidebar**: [SidebarEngine.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/engines/SidebarEngine.tsx) (52 lines)
  * Dynamic layout engine mapping menu structures from backend APIs or payload metadata.

### 2. Dashboard Engines
* **Metadata Dashboard Grid**: [DashboardEngine.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/engines/DashboardEngine.tsx) (30 lines)
  * Takes dynamic JSON arrays containing layout configuration metadata and instantiates widgets via `WidgetRegistry.tsx`.
* **Sub-dashboards Directory**: `src/engines/DashboardEngine/`
  * Contains concrete, hardcoded dashboard setups for each role:

| Dashboard File | Target User Role | Primary Widgets Rendered |
| :--- | :--- | :--- |
| [DoctorDashboardEngine.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/engines/DashboardEngine/DoctorDashboardEngine.tsx) | `doctor` / `clinic` | `ClinicSelector`, `AppointmentSummaryCards`, `TodayAppointmentsList`, `RevenueOverviewWidget`, `LatestReviewsWidget` |
| [PatientDashboardEngine.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/engines/DashboardEngine/PatientDashboardEngine.tsx) | `patient` | `PatientQuickActions`, `UpcomingAppointmentsWidget`, `RecentLabReportsWidget`, `HealthVitalsSummary` |
| [HospitalDashboardEngine.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/engines/DashboardEngine/HospitalDashboardEngine.tsx) | `hospital` | Bed stats metrics, active emergency cards list, bed availability breakdown bar charts |
| [PharmacyDashboardEngine.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/engines/DashboardEngine/PharmacyDashboardEngine.tsx) | `pharmacy` | Fulfillment rate stats, low inventory alert grid, pending prescription fulfillment cards |
| [DiagnosticDashboardEngine.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/engines/DashboardEngine/DiagnosticDashboardEngine.tsx) | `diagnostic` | Booking counts stats, upcoming lab samples collection queue list, urgent reports list |
| [HomecareDashboardEngine.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/engines/DashboardEngine/HomecareDashboardEngine.tsx) | `homecare` | Care bookings count stats, staff directories logs, dispatch cards for visiting caretakers |
| [AmbulanceDashboardEngine.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/engines/DashboardEngine/AmbulanceDashboardEngine.tsx) | `ambulance` | Active emergency counts, live dispatch feeds, available vehicles list, metrics cards |

*Note: In the code, empty placeholder files exist at `PermissionEngine/PermissionEngine.tsx` and `WidgetEngine/WidgetEngine.tsx`—the active logics are located directly inside `src/engines/PermissionEngine.tsx` and `src/engines/WidgetRegistry.tsx` respectively.*

---

## 📊 Modules & Screens Clearance Matrix

Here is how each screen module is mapped across the 8 user dashboards.

| Screen Name | File Path | Route Path | Associated User Roles |
| :--- | :--- | :--- | :--- |
| **Settings** | `settings/SettingsScreen.tsx` | `/settings` | **All Roles** |
| **Help & Support** | `support/HelpSupportScreen.tsx` | `/help` | **All Roles** |
| **Notifications** | `notifications/NotificationsScreen.tsx` | `/notifications` | **All Roles** |
| **Revenue & Settlement**| `revenue/RevenueScreen.tsx` | `/revenue` | `doctor`, `clinic`, `hospital`, `pharmacy`, `diagnostic`, `homecare`, `ambulance` |
| **Reviews & Ratings** | `reviews/ReviewsScreen.tsx` | `/reviews` | `doctor`, `clinic`, `hospital`, `pharmacy`, `diagnostic`, `homecare`, `ambulance` |
| **Profile & KYC** | `profile/ProfileLayout.tsx` | `/profile` | `doctor`, `clinic` |
| **Appointments List** | `appointments/AppointmentsScreen.tsx` | `/appointments` | `doctor`, `clinic` |
| **Create Appointment** | `appointments/CreateAppointmentScreen.tsx` | `/appointments/create` | `doctor`, `clinic` |
| **Consultation Room** | `appointments/ConsultationScreen.tsx` | `/appointments/:appointmentId/consultation` | `doctor` |
| **Prescriptions List** | `prescriptions/PrescriptionsScreen.tsx` | `/prescriptions` | `doctor` |
| **Patient List** | `patients/PatientsScreen.tsx` | `/patients` | `doctor`, `clinic`, `hospital` |
| **Patient Details** | `patients/PatientDetailScreen.tsx` | `/patients/:patientId` | `doctor`, `clinic`, `hospital` |
| **Availability Slots** | `availability/AvailabilityScreen.tsx` | `/availability` | `doctor` |
| **Find Doctors** | `patient/consultations/BookConsultationScreen.tsx` | `/find-doctors` | `patient` |
| **My Consultations** | `patient/consultations/MyConsultationsScreen.tsx` | `/my-consultations`| `patient` |
| **Records & Reports** | `patient/records/MyRecordsScreen.tsx` | `/my-records` | `patient` |
| **Pharmacy Orders** | `patient/pharmacy/PharmacyOrdersScreen.tsx` | `/pharmacy-orders` | `patient` |
| **Family Profiles** | `patient/family/FamilyProfilesScreen.tsx` | `/family-profiles` | `patient` |
| **Bed Availability** | `hospital/beds/BedsManagementScreen.tsx` | `/hospital-beds` | `hospital` |
| **Trauma Center** | `hospital/emergency/EmergencyScreen.tsx` | `/hospital-emergency`| `hospital` |
| **Departments & Staff**| `hospital/departments/DepartmentsScreen.tsx` | `/hospital-departments`| `hospital` |
| **Inventory & Stock** | `pharmacy/inventory/InventoryScreen.tsx` | `/pharmacy-inventory` | `pharmacy` |
| **Prescription Orders**| `pharmacy/fulfillment/PrescriptionFulfillmentScreen.tsx`| `/pharmacy-prescriptions`| `pharmacy` |
| **Test Catalog** | `diagnostic/tests/LabTestsScreen.tsx` | `/lab-tests` | `diagnostic` |
| **Lab Appointments** | `diagnostic/appointments/LabAppointmentsScreen.tsx`| `/lab-appointments`| `diagnostic` |
| **Reports & Results** | `diagnostic/reports/LabReportsScreen.tsx` | `/lab-reports` | `diagnostic` |
| **Home Services** | `homecare/services/ServicesScreen.tsx` | `/homecare-services` | `homecare` |
| **Staff Directory** | `homecare/staff/StaffDirectoryScreen.tsx` | `/homecare-staff` | `homecare` |
| **Care Bookings** | `homecare/bookings/CareBookingsScreen.tsx` | `/homecare-bookings` | `homecare` |
| **Emergency Dispatch** | `ambulance/dispatch/DispatchScreen.tsx` | `/ambulance-dispatch`| `ambulance` |
| **Fleet Management** | `ambulance/fleet/FleetManagementScreen.tsx` | `/ambulance-fleet` | `ambulance` |
| **Driver Roster** | `ambulance/roster/DriverRosterScreen.tsx` | `/ambulance-drivers`| `ambulance` |

---

## 🗂️ Detailed Modules Reference

### 📁 Settings Module (`settings/`)
* **[SettingsScreen.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/screensModules/settings/SettingsScreen.tsx)**
  * **Access**: All Roles
  * **Route**: `/settings`
  * **Features**: Configures account security details (change password, configure 2FA authentication modes), regional preferences, alert settings (SMS/Email notifications), and app aesthetics.

### 📁 Profile Module (`profile/`)
This module aggregates all doctor/clinic registration, onboarding details, and KYC status files.

* **[ProfileLayout.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/screensModules/profile/ProfileLayout.tsx)**
  * **Access**: `doctor`, `clinic`
  * **Route**: `/profile`
  * **Features**: Renders a tabbed layout panel hosting the following forms:
* **[PersonalInfoSection.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/screensModules/profile/sections/PersonalInfoSection.tsx)**: Name, email, mobile, and profile avatar.
* **[ProfessionalInfoSection.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/screensModules/profile/sections/ProfessionalInfoSection.tsx)**: Specialities list, medical registration details, years of experience, languages.
* **[KYCVerificationSection.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/screensModules/profile/sections/KYCVerificationSection.tsx)**: Upload inputs for government photo IDs and medical registration license PDFs.
* **[BankDetailsSection.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/screensModules/profile/sections/BankDetailsSection.tsx)**: Settlement banking coordinates (Bank Name, Account Number, IFSC code, Account Holder Name).
* **[WebsiteRequestSection.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/screensModules/profile/sections/WebsiteRequestSection.tsx)**: Form to request a custom medical practice domain/website.

---

## 🧩 Widgets Guide

Widgets are located in `src/widgets/` and represent self-contained UI blocks.

### 1. Provider Core Widgets (`src/widgets/`)

* **[ClinicSelector.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/widgets/ClinicSelector.tsx)**
  * **Imported in**: `DoctorDashboardEngine.tsx`
  * **Role**: `doctor`, `clinic`
  * **Description**: Allows a doctor managing multiple clinic spaces to select and toggle data feeds between different clinic sites.
* **[ProfileCompletionBanner.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/widgets/ProfileCompletionBanner.tsx)**
  * **Imported in**: `DoctorDashboardEngine.tsx`
  * **Role**: `doctor`, `clinic`
  * **Description**: Displays a warning alert banner pointing to profile forms if the KYC/Bank status is not yet 100% complete.
* **[AppointmentSummaryCards.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/widgets/AppointmentSummaryCards.tsx)**
  * **Imported in**: `DoctorDashboardEngine.tsx`
  * **Role**: `doctor`, `clinic`
  * **Description**: Renders grid cards with indicators (Total, Completed, Pending, Cancelled) for the current day's appointment volume.
* **[TodayAppointmentsList.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/widgets/TodayAppointmentsList.tsx)**
  * **Imported in**: `DoctorDashboardEngine.tsx`
  * **Role**: `doctor`, `clinic`
  * **Description**: Renders a vertical list showing appointment queue statuses (Waiting, In-consult, Completed) with patient info.
* **[RevenueOverviewWidget.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/widgets/RevenueOverviewWidget.tsx)**
  * **Imported in**: `DoctorDashboardEngine.tsx`
  * **Role**: `doctor`, `clinic`
  * **Description**: Displays comparative earning graphics comparing online consultation fees vs physical clinic payouts.
* **[LatestReviewsWidget.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/widgets/LatestReviewsWidget.tsx)**
  * **Imported in**: `DoctorDashboardEngine.tsx`
  * **Role**: `doctor`, `clinic`
  * **Description**: Lists recent reviews and feedback comments from patients, with quick reply buttons.

### 2. Patient Specific Widgets (`src/widgets/patient/`)

* **[PatientQuickActions.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/widgets/patient/PatientQuickActions.tsx)**
  * **Imported in**: `PatientDashboardEngine.tsx`
  * **Role**: `patient`
  * **Description**: Quick navigation shortcuts to book doctors, upload e-prescriptions for medicine orders, schedule home test slots, or fetch lab archives.
* **[UpcomingAppointmentsWidget.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/widgets/patient/UpcomingAppointmentsWidget.tsx)**
  * **Imported in**: `PatientDashboardEngine.tsx`
  * **Role**: `patient`
  * **Description**: High-contrast calendar card showing upcoming appointments with joint action buttons (e.g. Join Video Consult).
* **[RecentLabReportsWidget.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/widgets/patient/RecentLabReportsWidget.tsx)**
  * **Imported in**: `PatientDashboardEngine.tsx`, `MyRecordsScreen.tsx`
  * **Role**: `patient`
  * **Description**: Displays a table list of recent diagnostic laboratory test records with click-to-download controls.
* **[HealthVitalsSummary.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/widgets/patient/HealthVitalsSummary.tsx)**
  * **Imported in**: `PatientDashboardEngine.tsx`, `MyRecordsScreen.tsx`
  * **Role**: `patient`
  * **Description**: Renders health vital telemetry summaries (Blood Pressure, Heart Rate, Blood Sugar, SpO2) in clean grids.

### 3. Dynamic Registered Widgets
These widgets are registered in [WidgetRegistry.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/engines/WidgetRegistry.tsx) and are instantiated by `DashboardEngine.tsx` based on dynamic layout configurations:

* **`TodaysAppointments`** -> mapped to [TodaysAppointments.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/widgets/TodaysAppointments.tsx)
* **`RevenueSummary`** -> mapped to [RevenueSummary.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/widgets/RevenueSummary.tsx)
* **`BedOccupancy`** -> mapped to [BedOccupancy.tsx](file:///Users/paydiya/Desktop/Projects/viziito-web/src/widgets/BedOccupancy.tsx)

---

## 🗄️ Services & API Handlers

Services in `src/services/` house endpoints and Axios wrappers to retrieve backend data.

* **[auth.api.ts](file:///Users/paydiya/Desktop/Projects/viziito-web/src/services/auth.api.ts)**: Handles session logic (Login, Registration, OTP validations).
* **[profile.api.ts](file:///Users/paydiya/Desktop/Projects/viziito-web/src/services/profile.api.ts)**: Retrieves and modifies doctor profile files, KYC uploads.
* **[appointment.api.ts](file:///Users/paydiya/Desktop/Projects/viziito-web/src/services/appointment.api.ts)**: Schedules clinical slots, consultations lists.
* **[patient.api.ts](file:///Users/paydiya/Desktop/Projects/viziito-web/src/services/patient.api.ts)**: Queries individual medical files, queue stats.
* **[revenue.api.ts](file:///Users/paydiya/Desktop/Projects/viziito-web/src/services/revenue.api.ts)**: Fetches monthly earning reports, pending payouts, invoices.
* **[menu.api.ts](file:///Users/paydiya/Desktop/Projects/viziito-web/src/services/menu.api.ts)**: Retrieves dynamic menu navigation JSON arrays.
* **[widget.api.ts](file:///Users/paydiya/Desktop/Projects/viziito-web/src/services/widget.api.ts)**: Fetches layout configurations for dynamic dashboards.
