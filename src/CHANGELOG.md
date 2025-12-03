# Changelog

All notable changes to the GACE (Global Asset Compliance Engine) project.

---

## [1.0.2] - 2024-11-30

### 🔧 Fixed
- **Individual account creation now works correctly**
  - Profile creation moved to server-side endpoint with service role key
  - Fixes RLS policy blocking client-side profile inserts
  - Enhanced error logging for easier debugging

### ✨ Added
- **Test Helper component** - Visual backend status checker
  - Shows server health, project ID, and connectivity status
  - Quick links to Supabase dashboard
  - Located in bottom-right corner on signup page
  
- **Comprehensive testing documentation**
  - `/START_TESTING.md` - Quick 5-minute testing guide
  - `/TEST_SIGNUP.md` - Detailed testing checklist  
  - `/DEBUG_SIGNUP.md` - Complete debugging guide with all error patterns
  - `/SIGNUP_FIX_SUMMARY.md` - Technical overview of changes

### 🔄 Changed
- Updated `/utils/supabase/auth.tsx` - `signUp()` now calls server endpoint
- Enhanced `/pages/Signup.tsx` - Added detailed console logging
- Improved `/contexts/AuthContext.tsx` - Better profile loading with fallback
- Updated `/TROUBLESHOOTING.md` - Added signup debugging section

---

## [1.0.1] - 2024-11-30

### 🔒 Fixed - Rate Limiting Error

**Issue**: Users were getting "For security purposes, you can only request this after 4 seconds" error from Supabase Auth.

**Root Cause**:
- Supabase has built-in rate limiting on auth endpoints (4-second cooldown)
- Users clicking signup button multiple times
- Potential race conditions causing duplicate API calls

**Solutions Implemented**:

1. **Client-side Rate Limiting** (`/pages/Signup.tsx`)
   - Added 5-second cooldown between signup attempts
   - User-friendly countdown timer in error messages
   - Prevents submission if attempted too soon

2. **Duplicate Request Prevention** (`/utils/supabase/auth.tsx`)
   - Added `signUpInProgress` flag to AuthService
   - Blocks concurrent signup requests
   - Automatic reset after 2-second delay

3. **Enhanced Error Messages** (`/contexts/AuthContext.tsx`)
   - Detects rate limiting errors
   - Provides clear, actionable feedback
   - Guides users on how long to wait

4. **Button State Management** (`/pages/Signup.tsx`)
   - Button disabled during loading
   - Visual feedback (spinner + text)
   - Prevents accidental double-clicks

**Files Changed**:
- `/pages/Signup.tsx` - Rate limiting logic
- `/contexts/AuthContext.tsx` - Error message enhancement
- `/utils/supabase/auth.tsx` - Concurrent request prevention

**Testing**:
- [x] Single signup works correctly
- [x] Rapid clicking shows friendly error
- [x] Countdown timer displays correctly
- [x] Button state prevents double submission
- [x] Error messages are user-friendly

---

## [1.0.0] - 2024-11-29

### 🎉 Initial Release - MVP for Innovator Founder Endorsement

**Major Features**:

### 🔐 Authentication System
- Multi-role signup (end-user, accountant, admin)
- Email/password authentication with Supabase Auth
- Protected routes with role-based access
- Automatic session management
- Profile creation with user metadata

### 📊 Asset Management Dashboard
- Full CRUD operations for overseas assets
- Asset types: Property, Investments, Business, Bank Accounts
- Multi-currency support with GBP conversion
- Portfolio analytics with total value calculations
- Visual asset type distribution
- Income tracking and tax paid records

### 💰 UK Tax Calculator
- Annual income tax calculation
- Double Taxation Agreement (DTA) relief
- Country-specific relief percentages
- Historical calculation storage
- Detailed breakdown display

### 📄 Document Upload & OCR
- Drag-and-drop file upload
- Supported types: Bank statements, property deeds, tax documents
- OCR processing simulation
- Extracted data visualization
- Asset linking for organization

### 🔔 Compliance Alerts System
- Real-time compliance notifications
- Alert types: Deadlines, missing documents, tax updates, actions required
- Severity levels: Low, Medium, High, Critical
- Mark as read/resolved functionality
- Auto-dismiss feature

### 🎨 UI/UX Design
- Tech Dark Mode theme
- Neon accent colors (#00d9ff cyan, #a855f7 purple)
- Glass morphism effects
- Motion animations for smooth transitions
- Responsive design (desktop + mobile)
- Professional RegTech/FinTech aesthetic

### 🔧 Backend Infrastructure
- Supabase PostgreSQL database
- Row-Level Security (RLS) policies
- 15+ RESTful API endpoints
- Hono web framework for edge functions
- Secure authentication with service role keys

---

## [0.9.0] - 2024-11-28

### ✅ Fixed - Row-Level Security Policy Violations

**Issue**: Users couldn't create profiles due to RLS policies blocking inserts.

**Solution**:
- Moved profile creation to server-side
- Created `/auth/create-profile` endpoint
- Uses service role key to bypass RLS
- Maintains security through server validation

**Files Changed**:
- `/supabase/functions/server/index.tsx` - New endpoint
- `/utils/supabase/auth.tsx` - Updated signup flow

---

## [0.8.0] - 2024-11-27

### ✅ Fixed - Duplicate Email Registration Error

**Issue**: Better handling of duplicate email registrations.

**Solutions**:
1. Email uniqueness validation before auth creation
2. Idempotent profile creation (upsert)
3. Orphaned user cleanup if profile creation fails
4. Clear error messages for users

**Features Added**:
- Profile recovery from auth metadata
- Automatic profile creation for orphaned auth users
- User-friendly error messages

**Files Changed**:
- `/contexts/AuthContext.tsx` - Profile recovery logic
- `/utils/supabase/auth.tsx` - Upsert method
- `/pages/Signup.tsx` - Error handling

---

## [0.7.0] - 2024-11-26

### 🎯 Completed - Full Backend Integration

**Features**:
- 15+ server endpoints for CRUD operations
- Asset management API
- Document upload/processing API
- Tax calculation API
- Compliance alerts API
- User profile management

**Files Added**:
- `/supabase/functions/server/index.tsx` - Main server
- `/supabase/functions/server/routes/*` - API routes
- `/utils/api/*` - Frontend API clients

---

## [0.6.0] - 2024-11-25

### ✨ Added - Asset Manager Dashboard

**Features**:
- Asset CRUD operations
- Portfolio analytics
- Asset type filtering
- Value calculations
- Responsive card grid layout

**Components Created**:
- `/pages/AssetManager.tsx`
- `/components/AssetCard.tsx`
- `/components/AssetForm.tsx`
- `/components/AssetStats.tsx`

---

## [0.5.0] - 2024-11-24

### ✨ Added - Document Upload System

**Features**:
- Drag-and-drop interface
- File type validation
- OCR processing simulation
- Document categorization
- Asset linking

**Components Created**:
- `/pages/Documents.tsx`
- `/components/DocumentUpload.tsx`
- `/components/DocumentList.tsx`

---

## [0.4.0] - 2024-11-23

### ✨ Added - Tax Calculator

**Features**:
- UK income tax calculation
- DTA relief computation
- Country selection
- Tax year selection
- Historical calculations

**Components Created**:
- `/pages/TaxCalculator.tsx`
- `/utils/taxCalculations.ts`

---

## [0.3.0] - 2024-11-22

### ✨ Added - Onboarding Flows

**Features**:
- Multi-step onboarding for end users
- Accountant-specific onboarding
- Admin dashboard
- Personal info collection
- Asset discovery
- Tax residency setup

**Components Created**:
- `/components/EndUserOnboarding.tsx`
- `/components/AccountantOnboarding.tsx`
- `/pages/AdminDashboard.tsx`

---

## [0.2.0] - 2024-11-21

### ✨ Added - Authentication System

**Features**:
- Signup with role selection
- Login with email/password
- Session management
- Protected routes
- Auth context provider

**Components Created**:
- `/pages/Signup.tsx`
- `/pages/Login.tsx`
- `/contexts/AuthContext.tsx`
- `/utils/supabase/auth.tsx`

---

## [0.1.0] - 2024-11-20

### 🎬 Project Initialization

**Setup**:
- React + TypeScript + Vite
- Tailwind CSS 4.0 with custom design system
- React Router for navigation
- Supabase integration
- Initial project structure

**Design System**:
- Tech Dark Mode colors
- Neon accent palette
- Glass morphism utilities
- Typography scale
- Animation utilities

---

## Upcoming Features

### v1.1.0 (Planned)
- [ ] AI-powered tax recommendations
- [ ] Email notifications
- [ ] Password reset flow
- [ ] Account settings page
- [ ] Multi-factor authentication

### v1.2.0 (Planned)
- [ ] Accountant client management
- [ ] Client invitation system
- [ ] Shared asset visibility
- [ ] Client reporting dashboard

### v1.3.0 (Planned)
- [ ] Advanced analytics
- [ ] Custom report builder
- [ ] Export to PDF/Excel
- [ ] API integrations (HMRC, banks)

### v2.0.0 (Future)
- [ ] Mobile app (React Native)
- [ ] Real-time collaboration
- [ ] White-label solution
- [ ] Multi-language support

---

## Version Format

We follow [Semantic Versioning](https://semver.org/):
- **MAJOR**: Breaking changes
- **MINOR**: New features (backwards compatible)
- **PATCH**: Bug fixes (backwards compatible)

**Example**: v1.2.3
- 1 = Major version
- 2 = Minor version  
- 3 = Patch version

---

**Maintained by**: David Ju ([@dju78](https://github.com/dju78))  
**Repository**: https://github.com/dju78/gace  
**Last Updated**: 2024-11-30