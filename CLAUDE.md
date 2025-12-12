# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

GACE (Global Asset Compliance Engine) is a RegTech platform for UK residents with overseas assets to manage tax compliance with HMRC. Built as an MVP demo using React, TypeScript, Supabase, and Tailwind CSS.

## Development Commands

### Essential Commands
```bash
npm install              # Install dependencies
npm run dev             # Start dev server (http://localhost:3000)
npm run build           # Build for production
```

### Supabase Commands
```bash
supabase login                           # Login to Supabase CLI
supabase link --project-ref PROJECT_ID   # Link to Supabase project
supabase functions deploy server         # Deploy edge function backend
```

Run `src/supabase/setup.sql` in Supabase SQL Editor to initialize database schema.

## Architecture

### Authentication Flow
1. **AuthContext** (`src/contexts/AuthContext.tsx`) - Centralized auth state management
2. **Session Management** - Handled via `authService.getSession()` and `onAuthStateChange()`
3. **User Profiles** - Created server-side via `/auth/create-profile` endpoint using Service Role Key to bypass RLS
4. **Route Protection** - Three route guard components in `App.tsx`:
   - `AuthRoute` - Redirects authenticated users to dashboard
   - `OnboardingRoute` - Guards onboarding flow
   - `ProtectedRoute` - Requires auth + optional onboarding completion

### Key State Pattern
- Auth state lives in `AuthContext`
- Session and user profile loaded on mount and synced via `onAuthStateChange`
- Profile loading requires checking if profile exists; missing profiles trigger `ProfileMissingFix` component

### Database Schema
All tables use Row-Level Security (RLS) with user_id policies:
- `user_profiles` - User accounts with multi-role support (end-user/accountant/admin)
- `assets` - Overseas assets with multi-currency support
- `documents` - Document storage with OCR processing status
- `tax_calculations` - Historical tax calculations with DTA relief
- `compliance_alerts` - Notifications with severity levels

### Backend Architecture
- **Supabase Client** (`src/utils/supabase/client.tsx`) - Singleton pattern for Supabase connection
- **Auth Service** (`src/utils/supabase/auth.ts` and `auth.tsx`) - Handles signup/signin/signout
- **Edge Functions** (`src/supabase/functions/server/`) - Hono-based API with 15+ endpoints
- **Service Role Key** - Used server-side for privileged operations (profile creation, admin routes)

### Component Structure
- **Pages** (`src/pages/`) - Login, Signup entry points
- **Components** (`src/components/`) - Feature components (dashboards, onboarding, asset management, etc.)
- **UI Components** (`src/components/ui/`) - Radix UI-based primitives
- **Layouts** - `DashboardLayout` provides nested routing for authenticated dashboard pages

### Routing Pattern
React Router v6 with nested routes:
- Root redirects to `/login`
- Auth routes (`/login`, `/signup`) redirect authenticated users
- Onboarding routes (`/onboarding/end-user`, `/onboarding/accountant`)
- Dashboard routes nested under `/dashboard` with `DashboardLayout`
- 404 handled by `NotFoundPage`

## Configuration

### Environment Setup
Update `src/utils/supabase/info.tsx` with Supabase credentials:
```typescript
export const projectId = "YOUR_PROJECT_ID";
export const publicAnonKey = "YOUR_ANON_KEY";
```

### Vite Configuration
- Dev server runs on port 3000
- Path alias: `@/` maps to `src/`
- Build target: `esnext`
- Output directory: `build/`

## Important Patterns

### Error Handling in Auth
- Auth errors are enhanced with user-friendly messages in `AuthContext`
- Rate limiting handled with cooldown messages
- Duplicate email errors show clear "sign in instead" guidance
- Auto sign-in failures prompt manual sign-in

### RLS Bypass Pattern
Profile creation uses server-side endpoint with Service Role Key to bypass RLS policies, ensuring reliable profile creation during signup.

### Loading States
All protected routes show loading spinner while checking auth state to prevent flash of wrong content.

### Onboarding Flow
Users must complete onboarding before accessing dashboard. Onboarding type determined by `user_type` field. Completion sets `has_completed_onboarding = true`.

## Common Issues

### "Table not found"
Run `src/supabase/setup.sql` in Supabase SQL Editor.

### "RLS policy violation"
Profile creation now happens server-side with Service Role Key. If this error appears, check that the edge function is deployed.

### Auth state not updating
AuthContext subscribes to `onAuthStateChange`. Check that the subscription isn't being unsubscribed prematurely.

### Missing profile after signup
Profiles created via `/auth/create-profile` endpoint. Verify edge function is deployed and Service Role Key is configured.
