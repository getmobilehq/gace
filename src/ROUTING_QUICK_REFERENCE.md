# GACE Routing - Quick Reference Guide

## 🎯 Common Tasks

### Adding a New Dashboard Section

1. **Create the component** (e.g., `/components/NewSection.tsx`)
2. **Import in App.tsx**:
   ```tsx
   import { NewSection } from "./components/NewSection";
   ```
3. **Add route**:
   ```tsx
   <Route path="new-section" element={<NewSection />} />
   ```
4. **Add to sidebar** in `/components/DashboardLayout.tsx`:
   ```tsx
   const navigationItems: NavItem[] = [
     // ... existing items
     {
       path: "/dashboard/new-section",
       label: "New Section",
       icon: YourIcon,
     },
   ];
   ```
5. **Update breadcrumb labels** in `/components/Breadcrumbs.tsx`:
   ```tsx
   const routeLabels: Record<string, string> = {
     // ... existing labels
     "new-section": "New Section",
   };
   ```

### Navigate Programmatically

```tsx
import { useNavigate } from "react-router-dom";

const MyComponent = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate("/dashboard/overview");
    // or with replace (no history entry)
    navigate("/login", { replace: true });
  };
};
```

### Check Current Route

```tsx
import { useLocation } from "react-router-dom";

const MyComponent = () => {
  const location = useLocation();
  
  if (location.pathname === "/dashboard/alerts") {
    // Do something specific for alerts page
  }
};
```

### Create a NavLink with Active Styling

```tsx
import { NavLink } from "react-router-dom";

<NavLink
  to="/dashboard/scanner"
  className={({ isActive }) =>
    isActive
      ? "text-cyan-300 border border-indigo-500/50 bg-indigo-500/20"
      : "text-slate-400 hover:text-slate-200"
  }
>
  Global Asset Scanner
</NavLink>
```

### Add Route Parameters

```tsx
// In App.tsx
<Route path="user/:userId" element={<UserProfile />} />

// In component
import { useParams } from "react-router-dom";

const UserProfile = () => {
  const { userId } = useParams();
  return <div>User ID: {userId}</div>;
};
```

### Add Query Parameters

```tsx
import { useSearchParams } from "react-router-dom";

const MyComponent = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Read: ?tab=overview
  const tab = searchParams.get("tab");
  
  // Set: navigate to ?tab=details
  setSearchParams({ tab: "details" });
};
```

### Protect a New Route

```tsx
<Route
  path="/special-section"
  element={
    <ProtectedRoute
      isAuthenticated={isAuthenticated}
      requiredRole="accountant"  // optional
      userRole={userType}
    >
      <SpecialSection />
    </ProtectedRoute>
  }
/>
```

## 🛠️ Common Patterns

### Redirect After Action

```tsx
const handleSubmit = async () => {
  await saveData();
  navigate("/dashboard/overview", { 
    state: { message: "Data saved successfully" } 
  });
};

// In target component
const { state } = useLocation();
if (state?.message) {
  toast.success(state.message);
}
```

### Nested Routes with Layout

```tsx
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<Navigate to="/dashboard/overview" replace />} />
  <Route path="overview" element={<Overview />} />
  <Route path="settings" element={<Settings />} />
</Route>

// In DashboardLayout.tsx
import { Outlet } from "react-router-dom";

<div>
  <Sidebar />
  <main>
    <Outlet /> {/* Child routes render here */}
  </main>
</div>
```

### Conditional Navigation

```tsx
const handleNavigation = () => {
  if (hasUnsavedChanges) {
    if (confirm("You have unsaved changes. Continue?")) {
      navigate("/dashboard/overview");
    }
  } else {
    navigate("/dashboard/overview");
  }
};
```

## 📦 File Structure

```
/src
  /components
    - ProtectedRoute.tsx      # Route guard component
    - DashboardLayout.tsx     # Layout with Outlet
    - Breadcrumbs.tsx         # Dynamic breadcrumbs
    - NotFoundPage.tsx        # 404 page
    - [SectionComponents].tsx # Individual sections
  - App.tsx                   # Router setup & routes
```

## 🔗 Hook Reference

| Hook | Purpose | Example |
|------|---------|---------|
| `useNavigate()` | Programmatic navigation | `navigate('/path')` |
| `useLocation()` | Current route info | `location.pathname` |
| `useParams()` | URL parameters | `const { id } = useParams()` |
| `useSearchParams()` | Query parameters | `const [params] = useSearchParams()` |
| `useMatch()` | Match route pattern | `const match = useMatch('/dashboard/*')` |

## 🎨 NavLink vs Link

### Link
Use for simple navigation without active states:
```tsx
<Link to="/dashboard/help">Help</Link>
```

### NavLink
Use for navigation with active state styling:
```tsx
<NavLink 
  to="/dashboard/overview"
  className={({ isActive }) => isActive ? "active" : ""}
>
  Overview
</NavLink>
```

## 🔐 Authentication Pattern

```tsx
// App.tsx pattern
const [isAuthenticated, setIsAuthenticated] = useState(false);
const [userType, setUserType] = useState<UserType>(null);

const handleLogin = (type: UserType) => {
  setIsAuthenticated(true);
  setUserType(type);
  // Save to localStorage for persistence
  localStorage.setItem("auth", "true");
  localStorage.setItem("userType", type);
};

const handleLogout = () => {
  setIsAuthenticated(false);
  setUserType(null);
  localStorage.clear();
  navigate("/login");
};

// On app load
useEffect(() => {
  const auth = localStorage.getItem("auth");
  const type = localStorage.getItem("userType");
  if (auth === "true" && type) {
    setIsAuthenticated(true);
    setUserType(type as UserType);
  }
}, []);
```

## 🚨 Common Pitfalls

### ❌ Don't use `<a href>`
```tsx
// Wrong
<a href="/dashboard/overview">Overview</a>

// Right
<Link to="/dashboard/overview">Overview</Link>
```

### ❌ Don't forget `replace` for redirects
```tsx
// Wrong - creates history entry
<Navigate to="/login" />

// Right - replaces history entry
<Navigate to="/login" replace />
```

### ❌ Don't use hooks outside Router context
```tsx
// Wrong - useNavigate outside Router
function App() {
  const navigate = useNavigate(); // Error!
  return <Router>...</Router>
}

// Right - hooks inside Router
function App() {
  return (
    <Router>
      <AppContent /> {/* useNavigate here */}
    </Router>
  );
}
```

## 📞 Need Help?

- Full documentation: `/ROUTING.md`
- Testing checklist: `/ROUTING_TESTING.md`
- Interactive guide component: `/components/RoutingGuide.tsx`
- Navigation test component: `/components/NavigationTest.tsx`
