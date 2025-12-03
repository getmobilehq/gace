import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "./info";

// Singleton Supabase client
let supabaseClient: ReturnType<typeof createClient> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    // Use environment variable if available, otherwise construct from projectId
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || `https://${projectId}.supabase.co`;
    supabaseClient = createClient(supabaseUrl, publicAnonKey);
  }
  return supabaseClient;
};

// Database types
export interface UserProfile {
  id: string;
  email: string;
  user_type: "end-user" | "accountant" | "admin";
  full_name: string;
  company_name?: string;
  has_completed_onboarding: boolean;
  admin_role?: "support" | "compliance" | "super";
  created_at: string;
  updated_at: string;
}

export interface Asset {
  id: string;
  user_id: string;
  asset_type: "property" | "investment" | "business" | "bank_account" | "other";
  country: string;
  description: string;
  value_gbp: number;
  value_local: number;
  local_currency: string;
  acquisition_date: string;
  ownership_percentage: number;
  tax_paid_locally: number;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  asset_id?: string;
  document_type:
    | "bank_statement"
    | "property_deed"
    | "tax_return"
    | "contract"
    | "other";
  file_name: string;
  file_path: string;
  file_size: number;
  upload_date: string;
  ocr_status: "pending" | "processing" | "completed" | "failed";
  extracted_data?: Record<string, any>;
  created_at: string;
}

export interface TaxCalculation {
  id: string;
  user_id: string;
  tax_year: string;
  total_foreign_income: number;
  total_uk_income: number;
  total_foreign_tax_paid: number;
  uk_tax_liability: number;
  dta_relief: number;
  net_tax_owed: number;
  calculation_data: Record<string, any>;
  created_at: string;
}

export interface ComplianceAlert {
  id: string;
  user_id: string;
  alert_type: "deadline" | "missing_document" | "tax_update" | "action_required";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  due_date?: string;
  is_read: boolean;
  is_resolved: boolean;
  created_at: string;
}