# GACE Application Routing Structure

## Overview
The GACE platform uses React Router v6 for URL-based navigation with protected routes and role-based access control.

## Route Structure

### Public Routes
- `/login` - Authentication page for all user types

### Onboarding Routes (Protected)
- `/onboarding/end-user` - End user onboarding flow
- `/onboarding/accountant` - Accountant onboarding flow

### Dashboard Routes (Protected, Requires Onboarding Complete)
- `/dashboard/overview` - Compliance Overview
- `/dashboard/documents` - Document Ingestion
- `/dashboard/scanner` - Global Asset Scanner
- `/dashboard/tax-engine` - ML Tax Engine
- `/dashboard/alerts` - Compliance Alerts
- `/dashboard/reports` - HMRC Reports
- `/dashboard/help` - Help & Documentation

### Admin Routes (Protected, Admin Only)
- `/admin` - Admin Dashboard with role-specific views
  - Support Admin
  - Compliance Admin
  - Super Admin

### Special Routes
- `/` - Root redirect based on authentication state
- `*` - 404 page for undefined routes

## Authentication Flow

1. **Unauthenticated User**
   - Lands on `/login`
   - Selects user type (End User, Accountant, or Admin)
   - Authenticates

2. **End User / Accountant**
   - Redirected to `/onboarding/{type}`
   - Completes onboarding flow
   - Redirected to `/dashboard/overview`
   - Full access to all dashboard sections

3. **Admin User**
   - Redirected directly to `/admin`
   - No onboarding required
   - Access to admin-specific features

## Protected Route Logic

### ProtectedRoute Component
- Checks authentication status
- Validates role-based access
- Redirects to `/login` if unauthenticated
- Redirects to appropriate dashboard based on role

### Route Guards
- Onboarding routes check for specific user role
- Dashboard routes require both authentication and completed onboarding
- Admin routes require admin role

## Deep Linking Support

All routes support direct URL access:
- Unauthenticated users are redirected to `/login` with return path
- Authenticated users can navigate directly to any allowed section
- Browser back/forward buttons work as expected
- URLs are shareable (authentication still required)

## Navigation Components

### Sidebar Navigation (Dashboard)
- Uses `NavLink` for active state styling
- Automatically highlights current route
- Supports `aria-current="page"` for accessibility

### Programmatic Navigation
- `useNavigate()` hook for logout, onboarding completion, etc.
- Redirect components for authentication flows
- Replace flag used to prevent back-button loops

## Usage Examples

### Direct URL Access
```
https://yourapp.com/dashboard/alerts
https://yourapp.com/admin
https://yourapp.com/onboarding/end-user
```

### Programmatic Navigation
```tsx
const navigate = useNavigate();
navigate('/dashboard/overview');
navigate('/login');
```

### Protected Navigation
```tsx
<NavLink to="/dashboard/scanner">
  Global Asset Scanner
</NavLink>
```

## Development Notes

- All routes are defined in `/App.tsx`
- Layout component in `/components/DashboardLayout.tsx`
- Protected route logic in `/components/ProtectedRoute.tsx`
- Authentication state managed in App component
- For production, consider adding persistent storage (localStorage/sessionStorage)
