import { projectId, publicAnonKey } from "../supabase/info";
import { getSupabaseClient } from "../supabase/client";

// Base URL for the server
const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-b5fd51b8`;

// Get the current user's access token
async function getAccessToken(): Promise<string> {
  const supabase = getSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  // If user is logged in, use their access token
  // Otherwise, fall back to anon key
  return session?.access_token || publicAnonKey;
}

// Generic fetch wrapper with auth
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: any }> {
  try {
    const accessToken = await getAccessToken();
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    };

    const response = await fetch(`${SERVER_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const json = await response.json();

    if (!response.ok) {
      return { data: null, error: json.error || "Request failed" };
    }

    return { data: json, error: null };
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error);
    return { data: null, error: error.message || "Network error" };
  }
}

// ==============================================
// ASSET API
// ==============================================

export interface Asset {
  id: string;
  user_id: string;
  asset_type: "property" | "investment" | "business" | "bank_account" | "other";
  country: string;
  description: string;
  value_gbp: number;
  value_local?: number;
  local_currency?: string;
  acquisition_date?: string;
  ownership_percentage: number;
  tax_paid_locally: number;
  created_at: string;
  updated_at: string;
}

export interface CreateAssetData {
  asset_type: Asset["asset_type"];
  country: string;
  description: string;
  value_gbp: number;
  value_local?: number;
  local_currency?: string;
  acquisition_date?: string;
  ownership_percentage?: number;
  tax_paid_locally?: number;
}

export interface AssetAnalytics {
  totalValueGBP: number;
  assetCount: number;
  byCountry: Record<string, { count: number; totalValue: number }>;
  byType: Record<string, { count: number; totalValue: number }>;
}

export const assetAPI = {
  getAll: () => apiFetch<{ assets: Asset[] }>("/assets"),

  getById: (id: string) => apiFetch<{ asset: Asset }>(`/assets/${id}`),

  create: (data: CreateAssetData) =>
    apiFetch<{ asset: Asset }>("/assets", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<CreateAssetData>) =>
    apiFetch<{ asset: Asset }>(`/assets/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/assets/${id}`, {
      method: "DELETE",
    }),

  getAnalytics: () =>
    apiFetch<AssetAnalytics>("/assets/analytics/summary"),
};

// ==============================================
// TAX CALCULATION API
// ==============================================

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
  calculation_data?: any;
  created_at: string;
}

export interface CreateTaxCalculationData {
  tax_year: string;
  total_foreign_income: number;
  total_uk_income: number;
  total_foreign_tax_paid: number;
  uk_tax_liability: number;
  dta_relief: number;
  net_tax_owed: number;
  calculation_data?: any;
}

export const taxAPI = {
  saveCalculation: (data: CreateTaxCalculationData) =>
    apiFetch<{ calculation: TaxCalculation }>("/tax/calculate", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getHistory: () =>
    apiFetch<{ calculations: TaxCalculation[] }>("/tax/history"),
};

// ==============================================
// DOCUMENT API
// ==============================================

export interface Document {
  id: string;
  user_id: string;
  asset_id?: string;
  document_type: "bank_statement" | "property_deed" | "tax_return" | "contract" | "investment_report" | "other";
  file_name: string;
  file_path: string;
  file_size: number;
  upload_date: string;
  ocr_status: "pending" | "processing" | "completed" | "failed";
  extracted_data?: any;
  created_at: string;
}

export const documentAPI = {
  getAll: () => apiFetch<{ documents: Document[] }>("/documents"),

  update: (id: string, data: { ocr_status?: string; extracted_data?: any }) =>
    apiFetch<{ document: Document }>(`/documents/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  process: (id: string) =>
    apiFetch<{ document: Document }>(`/documents/${id}/process`, {
      method: "POST",
    }),
};

// ==============================================
// COMPLIANCE ALERTS API
// ==============================================

export interface ComplianceAlert {
  id: string;
  user_id: string;
  alert_type: "deadline" | "missing_document" | "tax_update" | "action_required";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description?: string;
  due_date?: string;
  is_read: boolean;
  is_resolved: boolean;
  created_at: string;
}

export const alertAPI = {
  getAll: () => apiFetch<{ alerts: ComplianceAlert[] }>("/alerts"),

  markAsRead: (id: string) =>
    apiFetch<{ alert: ComplianceAlert }>(`/alerts/${id}/read`, {
      method: "PUT",
    }),

  markAsResolved: (id: string) =>
    apiFetch<{ alert: ComplianceAlert }>(`/alerts/${id}/resolve`, {
      method: "PUT",
    }),
};

// ==============================================
// HEALTH CHECK
// ==============================================

export const healthCheck = () => apiFetch<{ status: string; timestamp: string }>("/health");