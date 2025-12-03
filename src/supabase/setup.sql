-- ================================================
-- GACE - Supabase Database Setup Script
-- ================================================
-- Run this script in your Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste & Run
-- ================================================

-- ================================================
-- 1. USER PROFILES TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  user_type TEXT NOT NULL CHECK (user_type IN ('end-user', 'accountant', 'admin')),
  full_name TEXT NOT NULL,
  company_name TEXT,
  has_completed_onboarding BOOLEAN DEFAULT FALSE,
  admin_role TEXT CHECK (admin_role IN ('support', 'compliance', 'super')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- Policies: Users can only access their own profile
CREATE POLICY "Users can view own profile" 
  ON user_profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON user_profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON user_profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_type ON user_profiles(user_type);

-- ================================================
-- 2. ASSETS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  asset_type TEXT NOT NULL CHECK (asset_type IN ('property', 'investment', 'business', 'bank_account', 'other')),
  country TEXT NOT NULL,
  description TEXT,
  value_gbp NUMERIC(15, 2) NOT NULL,
  value_local NUMERIC(15, 2),
  local_currency TEXT,
  acquisition_date DATE,
  ownership_percentage NUMERIC(5, 2) DEFAULT 100 CHECK (ownership_percentage > 0 AND ownership_percentage <= 100),
  tax_paid_locally NUMERIC(15, 2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage own assets" ON assets;

-- Policies: Users can manage their own assets
CREATE POLICY "Users can manage own assets" 
  ON assets FOR ALL 
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_assets_user_id ON assets(user_id);
CREATE INDEX IF NOT EXISTS idx_assets_country ON assets(country);
CREATE INDEX IF NOT EXISTS idx_assets_type ON assets(asset_type);

-- ================================================
-- 3. DOCUMENTS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
  document_type TEXT NOT NULL CHECK (document_type IN ('bank_statement', 'property_deed', 'tax_return', 'contract', 'investment_report', 'other')),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  upload_date TIMESTAMPTZ DEFAULT NOW(),
  ocr_status TEXT DEFAULT 'pending' CHECK (ocr_status IN ('pending', 'processing', 'completed', 'failed')),
  extracted_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage own documents" ON documents;

-- Policies: Users can manage their own documents
CREATE POLICY "Users can manage own documents" 
  ON documents FOR ALL 
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_asset_id ON documents(asset_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(ocr_status);
CREATE INDEX IF NOT EXISTS idx_documents_upload_date ON documents(upload_date DESC);

-- ================================================
-- 4. TAX CALCULATIONS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS tax_calculations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  tax_year TEXT NOT NULL,
  total_foreign_income NUMERIC(15, 2) NOT NULL DEFAULT 0,
  total_uk_income NUMERIC(15, 2) NOT NULL DEFAULT 0,
  total_foreign_tax_paid NUMERIC(15, 2) NOT NULL DEFAULT 0,
  uk_tax_liability NUMERIC(15, 2) NOT NULL DEFAULT 0,
  dta_relief NUMERIC(15, 2) NOT NULL DEFAULT 0,
  net_tax_owed NUMERIC(15, 2) NOT NULL DEFAULT 0,
  calculation_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tax_calculations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage own calculations" ON tax_calculations;

-- Policies: Users can manage their own calculations
CREATE POLICY "Users can manage own calculations" 
  ON tax_calculations FOR ALL 
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_tax_calculations_user_id ON tax_calculations(user_id);
CREATE INDEX IF NOT EXISTS idx_tax_calculations_year ON tax_calculations(tax_year);
CREATE INDEX IF NOT EXISTS idx_tax_calculations_created ON tax_calculations(created_at DESC);

-- ================================================
-- 5. COMPLIANCE ALERTS TABLE
-- ================================================
CREATE TABLE IF NOT EXISTS compliance_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE NOT NULL,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('deadline', 'missing_document', 'tax_update', 'action_required')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  is_read BOOLEAN DEFAULT FALSE,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE compliance_alerts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can manage own alerts" ON compliance_alerts;

-- Policies: Users can manage their own alerts
CREATE POLICY "Users can manage own alerts" 
  ON compliance_alerts FOR ALL 
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON compliance_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON compliance_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_unread ON compliance_alerts(is_read) WHERE is_read = FALSE;
CREATE INDEX IF NOT EXISTS idx_alerts_due_date ON compliance_alerts(due_date) WHERE due_date IS NOT NULL;

-- ================================================
-- 6. UPDATED_AT TRIGGER FUNCTION
-- ================================================
-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to relevant tables
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_assets_updated_at ON assets;
CREATE TRIGGER update_assets_updated_at
  BEFORE UPDATE ON assets
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 7. SEED DATA (Optional - for testing)
-- ================================================
-- Uncomment below to create a test user profile
-- NOTE: Replace the UUID with an actual user ID from auth.users after signup

/*
-- Example: Insert test profile (replace UUID with real user ID)
INSERT INTO user_profiles (id, email, user_type, full_name, has_completed_onboarding)
VALUES (
  '00000000-0000-0000-0000-000000000000', -- Replace with real auth.users.id
  'test@example.com',
  'end-user',
  'Test User',
  false
)
ON CONFLICT (id) DO NOTHING;
*/

-- ================================================
-- 8. VERIFICATION QUERIES
-- ================================================
-- Run these to verify setup worked:

-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('user_profiles', 'assets', 'documents', 'tax_calculations', 'compliance_alerts')
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('user_profiles', 'assets', 'documents', 'tax_calculations', 'compliance_alerts')
ORDER BY tablename;

-- Check policies exist
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ================================================
-- SUCCESS! 🎉
-- ================================================
-- Your database is now set up and ready to use!
-- 
-- Next steps:
-- 1. Test authentication signup/login
-- 2. Verify user profiles are created automatically
-- 3. Test uploading documents
-- 4. Test creating assets
-- 
-- Storage bucket will be created automatically by the app
-- when you first upload a document.
-- ================================================
