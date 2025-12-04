# GACE - Global Asset Compliance Engine

[![CI Pipeline](https://github.com/dju78/Gaceapp/actions/workflows/ci.yml/badge.svg)](https://github.com/dju78/Gaceapp/actions/workflows/ci.yml)
[![Deploy to Netlify](https://github.com/dju78/Gaceapp/actions/workflows/deploy.yml/badge.svg)](https://github.com/dju78/Gaceapp/actions/workflows/deploy.yml)
[![Netlify Status](https://api.netlify.com/api/v1/badges/YOUR_NETLIFY_SITE_ID/deploy-status)](https://app.netlify.com/sites/YOUR_NETLIFY_SITE_NAME/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue)](https://www.typescriptlang.org/)

A RegTech platform for UK residents with overseas assets to manage tax compliance with HMRC. Built as an MVP demo for Innovator Founder endorsement presentations.

![GACE Platform](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=400&fit=crop)

## 🌟 Features

### Core Functionality
- **Multi-role Authentication** - End users, accountants, and admin support
- **Asset Management** - Full CRUD operations for overseas assets with portfolio analytics
- **Tax Calculator** - UK tax calculation engine with Double Taxation Agreement (DTA) relief
- **Document Upload & OCR** - Process bank statements, property deeds, and tax documents
- **Compliance Alerts** - Real-time notifications for deadlines and missing documents
- **Role-based Dashboards** - Tailored views for different user types

### Technical Highlights
- **Real Supabase Backend** - PostgreSQL database with Row-Level Security (RLS)
- **15+ API Endpoints** - RESTful server with Hono web framework
- **Motion Animations** - Smooth transitions and micro-interactions
- **Responsive Design** - Works on desktop and mobile devices
- **Glass Morphism UI** - Tech Dark Mode with neon accents (#00d9ff cyan, #a855f7 purple)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account (free tier works)
- Modern web browser

### 1. Clone the Repository
```bash
git clone https://github.com/dju78/gace.git
cd gace
npm install
```

### 2. Set Up Supabase

#### a. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your Project URL and API keys

#### b. Run Database Setup
1. Open Supabase SQL Editor: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql`
2. Copy the contents of `/supabase/setup.sql`
3. Paste and run the script
4. Verify tables are created (should see: `user_profiles`, `assets`, `documents`, `tax_calculations`, `compliance_alerts`)

#### c. Deploy Edge Functions
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_ID

# Deploy the server function
supabase functions deploy server
```

### 3. Configure Environment Variables

Update `/utils/supabase/info.tsx` with your Supabase credentials:

```typescript
export const projectId = "YOUR_PROJECT_ID";
export const publicAnonKey = "YOUR_ANON_KEY";
```

### 4. Run the Application

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📊 Database Schema

### User Profiles
- Multi-role support (end-user, accountant, admin)
- Onboarding completion tracking
- Email-based authentication

### Assets
- Property, investments, businesses, bank accounts
- Multi-currency support with GBP conversion
- Ownership percentage tracking
- Local tax paid tracking

### Documents
- Secure Supabase Storage integration
- OCR processing status
- Extracted data storage (JSONB)
- Asset linking

### Tax Calculations
- Historical calculation storage
- DTA relief calculations
- UK tax liability computation
- Detailed calculation data (JSONB)

### Compliance Alerts
- Multiple alert types (deadline, missing_document, tax_update, action_required)
- Severity levels (low, medium, high, critical)
- Read/resolved status tracking

## 🎨 Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS 4.0** - Styling with custom design tokens
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **Motion (Framer Motion)** - Animations
- **Lucide React** - Icons
- **Sonner** - Toast notifications

### Backend
- **Supabase** - Database, auth, storage, edge functions
- **PostgreSQL** - Relational database with RLS
- **Hono** - Fast web framework for edge functions
- **Deno** - Secure TypeScript runtime for edge functions

## 🔐 Security Features

- **Row-Level Security (RLS)** - Database-level access control
- **Service Role Key** - Backend-only for privileged operations
- **Protected Routes** - Frontend route guards
- **CORS Configuration** - Proper cross-origin security
- **Password Authentication** - Supabase Auth integration

## 📁 Project Structure

```
/
├── components/           # React components
│   ├── auth/            # Login, signup forms
│   ├── dashboard/       # Dashboard layouts
│   ├── onboarding/      # Multi-step onboarding
│   └── ...
├── contexts/            # React Context providers
│   └── AuthContext.tsx  # Authentication state
├── utils/               # Utility functions
│   └── supabase/        # Supabase client & services
├── supabase/
│   ├── setup.sql        # Database schema & policies
│   └── functions/
│       └── server/      # Edge function backend
├── styles/
│   └── globals.css      # Tailwind config & design tokens
└── App.tsx              # Main application router
```

## 🧪 Testing

### Demo Credentials
The login page displays demo credentials for testing (if seeded).

### Manual Testing
1. **Sign Up Flow**: Create account → Complete onboarding → Access dashboard
2. **Asset Management**: Add/edit/delete assets → View analytics
3. **Tax Calculator**: Input income → Calculate tax → View DTA relief
4. **Document Upload**: Upload file → Process OCR → View extracted data
5. **Compliance Alerts**: View notifications → Mark as read/resolved

## 🚢 Deployment

### Figma Make (Current Environment)
The application is currently running in Figma Make and is ready for testing.

### Deploy to Vercel (Production)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
```

### Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the application
npm run build

# Deploy
netlify deploy --prod
```

## 🐛 Troubleshooting

### "Table not found" error
**Solution**: Run the SQL setup script in Supabase SQL Editor (`/supabase/setup.sql`)

### "RLS policy violation" error
**Solution**: This should be fixed! The server uses service role key to bypass RLS for profile creation.

### "Profile already exists" error
**Solution**: This is now handled gracefully. If you see this, the email is already registered - please sign in instead.

### Edge Functions not working
**Solution**: Make sure to deploy the server function:
```bash
supabase functions deploy server
```

### Authentication issues
**Solution**: Check that your Supabase project credentials in `/utils/supabase/info.tsx` are correct.

## 📝 Recent Fixes

### ✅ Row-Level Security Error (Fixed)
- Moved profile creation to server-side using Service Role Key
- Added `/auth/create-profile` endpoint
- Profiles now created reliably during signup

### ✅ Duplicate Email Error (Fixed)
- Added email uniqueness validation
- Implemented idempotent profile creation
- Clear error messages for users
- Orphaned user cleanup

### ✅ Rate Limiting Error (Fixed)
- Added client-side rate limiting (5-second cooldown)
- Prevented duplicate signup requests
- User-friendly error messages with countdown
- Concurrent request prevention in auth service

## 🎯 Roadmap

### Phase 1 (Current)
- [x] Authentication & user management
- [x] Asset CRUD operations
- [x] Tax calculation engine
- [x] Document upload with OCR
- [x] Backend API integration

### Phase 2 (Next)
- [ ] AI-powered tax recommendations
- [ ] Country-specific DTA rules engine
- [ ] Advanced analytics dashboard
- [ ] Email notifications for compliance alerts
- [ ] Multi-currency real-time exchange rates

### Phase 3 (Future)
- [ ] Accountant client management
- [ ] HMRC API integration
- [ ] Automated report generation
- [ ] Mobile app (React Native)
- [ ] White-label solution for accounting firms

## 🤝 Contributing

This is an MVP demo project for Innovator Founder visa endorsement. If you'd like to contribute or have suggestions, please open an issue or submit a pull request.

## 📄 License

Private/Proprietary - All rights reserved

## 👤 Author

**David Ju**
- GitHub: [@dju78](https://github.com/dju78)
- Project: GACE - Global Asset Compliance Engine

## 🙏 Acknowledgments

- Built with [Figma Make](https://www.figma.com) AI-powered web builder
- Powered by [Supabase](https://supabase.com) backend infrastructure
- UI inspiration from modern FinTech and RegTech platforms

---

**Note**: This is a prototype/MVP for demonstration purposes. For production use, additional security audits, compliance reviews, and feature enhancements would be required.