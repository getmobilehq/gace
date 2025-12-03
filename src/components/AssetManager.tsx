import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Building2,
  TrendingUp,
  DollarSign,
  Globe2,
  Edit,
  Trash2,
  X,
  Save,
  Loader2,
  PieChart,
  BarChart3,
  MapPin,
} from "lucide-react";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../contexts/AuthContext";
import { assetAPI, Asset, CreateAssetData } from "../utils/api/client";

const COLORS = {
  property: "#00d9ff",
  investment: "#a855f7",
  business: "#10b981",
  bank_account: "#f59e0b",
  other: "#6366f1",
};

const ASSET_TYPE_LABELS = {
  property: "Property",
  investment: "Investment",
  business: "Business",
  bank_account: "Bank Account",
  other: "Other",
};

const COUNTRIES = [
  "United Kingdom",
  "Nigeria",
  "United States",
  "United Arab Emirates",
  "India",
  "Kenya",
  "Ghana",
  "South Africa",
  "Singapore",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Other",
];

const CURRENCIES = [
  "GBP",
  "USD",
  "EUR",
  "NGN",
  "AED",
  "INR",
  "KES",
  "GHS",
  "ZAR",
  "SGD",
  "CAD",
  "AUD",
];

interface AssetManagerProps {
  userRole?: "end-user" | "accountant" | "admin";
}

export const AssetManager: React.FC<AssetManagerProps> = ({ userRole = "end-user" }) => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  const [formData, setFormData] = useState<CreateAssetData>({
    asset_type: "property",
    country: "",
    description: "",
    value_gbp: 0,
    value_local: undefined,
    local_currency: undefined,
    acquisition_date: undefined,
    ownership_percentage: 100,
    tax_paid_locally: 0,
  });

  useEffect(() => {
    // Only load assets if user is authenticated
    if (user) {
      loadAssets();
      loadAnalytics();
    } else {
      console.log("[AssetManager] No user session, skipping asset load");
      setLoading(false);
    }
  }, [user]);

  const loadAssets = async () => {
    setLoading(true);
    const { data, error } = await assetAPI.getAll();
    if (data && !error) {
      setAssets(data.assets);
    } else {
      console.error("Failed to load assets:", error);
    }
    setLoading(false);
  };

  const loadAnalytics = async () => {
    const { data, error } = await assetAPI.getAnalytics();
    if (data && !error) {
      setAnalytics(data);
    }
  };

  const handleCreate = async () => {
    const { data, error } = await assetAPI.create(formData);
    if (data && !error) {
      setAssets([data.asset, ...assets]);
      setIsModalOpen(false);
      resetForm();
      loadAnalytics();
    } else {
      console.error("Failed to create asset:", error);
      alert(`Error: ${error}`);
    }
  };

  const handleUpdate = async () => {
    if (!editingAsset) return;

    const { data, error } = await assetAPI.update(editingAsset.id, formData);
    if (data && !error) {
      setAssets(assets.map((a) => (a.id === editingAsset.id ? data.asset : a)));
      setIsModalOpen(false);
      setEditingAsset(null);
      resetForm();
      loadAnalytics();
    } else {
      console.error("Failed to update asset:", error);
      alert(`Error: ${error}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this asset?")) return;

    const { error } = await assetAPI.delete(id);
    if (!error) {
      setAssets(assets.filter((a) => a.id !== id));
      loadAnalytics();
    } else {
      console.error("Failed to delete asset:", error);
      alert(`Error: ${error}`);
    }
  };

  const openEditModal = (asset: Asset) => {
    setEditingAsset(asset);
    setFormData({
      asset_type: asset.asset_type,
      country: asset.country,
      description: asset.description,
      value_gbp: asset.value_gbp,
      value_local: asset.value_local,
      local_currency: asset.local_currency,
      acquisition_date: asset.acquisition_date,
      ownership_percentage: asset.ownership_percentage,
      tax_paid_locally: asset.tax_paid_locally,
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingAsset(null);
    resetForm();
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      asset_type: "property",
      country: "",
      description: "",
      value_gbp: 0,
      value_local: undefined,
      local_currency: undefined,
      acquisition_date: undefined,
      ownership_percentage: 100,
      tax_paid_locally: 0,
    });
  };

  const formatCurrency = (amount: number, currency: string = "GBP") => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Prepare chart data
  const typeChartData = analytics?.byType
    ? Object.entries(analytics.byType).map(([type, data]: [string, any]) => ({
        name: ASSET_TYPE_LABELS[type as keyof typeof ASSET_TYPE_LABELS] || type,
        value: data.totalValue,
        count: data.count,
      }))
    : [];

  const countryChartData = analytics?.byCountry
    ? Object.entries(analytics.byCountry).map(([country, data]: [string, any]) => ({
        name: country,
        value: data.totalValue,
        count: data.count,
      }))
    : [];

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-100">Asset Manager</h1>
          <p className="mt-1 text-sm text-slate-400">
            Track and manage your global assets
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openCreateModal}
          className="glow-cyan flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 font-medium text-white shadow-lg"
        >
          <Plus className="h-5 w-5" />
          Add Asset
        </motion.button>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid gap-4 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl border border-cyan-500/30 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Portfolio Value</p>
                <p className="mt-2 text-2xl font-bold text-cyan-400">
                  {formatCurrency(analytics.totalValueGBP)}
                </p>
              </div>
              <div className="rounded-xl bg-cyan-500/20 p-3">
                <DollarSign className="h-6 w-6 text-cyan-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-xl border border-purple-500/30 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Total Assets</p>
                <p className="mt-2 text-2xl font-bold text-purple-400">
                  {analytics.assetCount}
                </p>
              </div>
              <div className="rounded-xl bg-purple-500/20 p-3">
                <Building2 className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-xl border border-emerald-500/30 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Countries</p>
                <p className="mt-2 text-2xl font-bold text-emerald-400">
                  {Object.keys(analytics.byCountry || {}).length}
                </p>
              </div>
              <div className="rounded-xl bg-emerald-500/20 p-3">
                <Globe2 className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Charts */}
      {analytics && typeChartData.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Asset Type Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-xl border border-slate-700 p-6"
          >
            <div className="mb-4 flex items-center gap-2">
              <PieChart className="h-5 w-5 text-cyan-400" />
              <h3 className="font-semibold text-slate-100">Asset Distribution by Type</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={typeChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeChartData.map((entry, index) => {
                    const type = Object.keys(ASSET_TYPE_LABELS).find(
                      (key) => ASSET_TYPE_LABELS[key as keyof typeof ASSET_TYPE_LABELS] === entry.name
                    );
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[type as keyof typeof COLORS] || COLORS.other}
                      />
                    );
                  })}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                  }}
                  formatter={(value: any) => formatCurrency(value)}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </motion.div>

          {/* Country Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-xl border border-slate-700 p-6"
          >
            <div className="mb-4 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-400" />
              <h3 className="font-semibold text-slate-100">Asset Value by Country</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={countryChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(value) => `£${value / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                  }}
                  formatter={(value: any) => formatCurrency(value)}
                />
                <Bar dataKey="value" fill="#a855f7" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      {/* Asset List */}
      <div className="glass rounded-xl border border-slate-700">
        <div className="border-b border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-slate-100">All Assets</h2>
          <p className="mt-1 text-sm text-slate-400">{assets.length} assets in total</p>
        </div>

        {assets.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="mx-auto h-12 w-12 text-slate-600" />
            <p className="mt-4 text-slate-400">No assets yet</p>
            <button
              onClick={openCreateModal}
              className="mt-4 text-cyan-400 hover:text-cyan-300"
            >
              Add your first asset
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {assets.map((asset, index) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 transition-colors hover:bg-slate-800/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div
                        className="rounded-lg p-2"
                        style={{
                          backgroundColor: `${COLORS[asset.asset_type]}20`,
                        }}
                      >
                        <Building2
                          className="h-5 w-5"
                          style={{ color: COLORS[asset.asset_type] }}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-100">
                          {asset.description || "Untitled Asset"}
                        </h3>
                        <div className="mt-1 flex items-center gap-3 text-sm text-slate-400">
                          <span className="capitalize">{ASSET_TYPE_LABELS[asset.asset_type]}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {asset.country}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-4">
                      <div>
                        <p className="text-xs text-slate-500">GBP Value</p>
                        <p className="mt-1 font-semibold text-slate-200">
                          {formatCurrency(asset.value_gbp)}
                        </p>
                      </div>
                      {asset.value_local && asset.local_currency && (
                        <div>
                          <p className="text-xs text-slate-500">Local Value</p>
                          <p className="mt-1 font-semibold text-slate-200">
                            {formatCurrency(asset.value_local, asset.local_currency)}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-slate-500">Ownership</p>
                        <p className="mt-1 font-semibold text-slate-200">
                          {asset.ownership_percentage}%
                        </p>
                      </div>
                      {asset.tax_paid_locally > 0 && (
                        <div>
                          <p className="text-xs text-slate-500">Local Tax Paid</p>
                          <p className="mt-1 font-semibold text-slate-200">
                            {formatCurrency(asset.tax_paid_locally)}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(asset)}
                      className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-400 transition-colors hover:border-cyan-500 hover:text-cyan-400"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(asset.id)}
                      className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-400 transition-colors hover:border-red-500 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="glass w-full max-w-2xl rounded-2xl border border-slate-700 p-6"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-100">
                  {editingAsset ? "Edit Asset" : "Add New Asset"}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Asset Type *
                    </label>
                    <select
                      value={formData.asset_type}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          asset_type: e.target.value as any,
                        })
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
                    >
                      {Object.entries(ASSET_TYPE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Country *
                    </label>
                    <select
                      value={formData.country}
                      onChange={(e) =>
                        setFormData({ ...formData, country: e.target.value })
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="">Select country</option>
                      {COUNTRIES.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Description *
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="e.g., Rental property in Lagos"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Value (GBP) *
                    </label>
                    <input
                      type="number"
                      value={formData.value_gbp}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          value_gbp: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Ownership %
                    </label>
                    <input
                      type="number"
                      value={formData.ownership_percentage}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ownership_percentage: parseFloat(e.target.value) || 100,
                        })
                      }
                      min="0"
                      max="100"
                      placeholder="100"
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Local Value (Optional)
                    </label>
                    <input
                      type="number"
                      value={formData.value_local || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          value_local: parseFloat(e.target.value) || undefined,
                        })
                      }
                      placeholder="0"
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Local Currency
                    </label>
                    <select
                      value={formData.local_currency || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          local_currency: e.target.value || undefined,
                        })
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="">Select currency</option>
                      {CURRENCIES.map((currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Acquisition Date
                    </label>
                    <input
                      type="date"
                      value={formData.acquisition_date || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          acquisition_date: e.target.value || undefined,
                        })
                      }
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-300">
                      Tax Paid Locally (GBP)
                    </label>
                    <input
                      type="number"
                      value={formData.tax_paid_locally}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tax_paid_locally: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                      className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 font-medium text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={editingAsset ? handleUpdate : handleCreate}
                  disabled={
                    !formData.description || !formData.country || formData.value_gbp <= 0
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2.5 font-medium text-white hover:shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4" />
                  {editingAsset ? "Update Asset" : "Create Asset"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};