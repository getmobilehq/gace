import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../utils/supabase/auth";
import {
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Building,
  Users,
  FileText,
  Shield,
} from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

export const AccountantOnboarding: React.FC<OnboardingProps> = ({
  onComplete,
}) => {
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firmName: "",
    firmType: "",
    practiceLicense: "",
    professionalBody: "",
    numberOfClients: "",
    servicesOffered: [] as string[],
    primaryJurisdictions: [] as string[],
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Mark onboarding as complete
      await authService.completeOnboarding(user.id);
      
      // Refresh profile to get updated onboarding status
      await refreshProfile();
      
      // Call parent onComplete
      onComplete();
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleSelection = (
    field: "servicesOffered" | "primaryJurisdictions",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return true; // Email verification is handled by the auth context
      case 2:
        return formData.firmName && formData.firmType;
      case 3:
        return formData.practiceLicense && formData.professionalBody;
      case 4:
        return (
          formData.numberOfClients &&
          formData.servicesOffered.length > 0 &&
          formData.primaryJurisdictions.length > 0
        );
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4">
      <div className="mx-auto max-w-3xl py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4">
            <div className="text-3xl font-bold text-slate-100">GACE</div>
            <div className="mt-1 text-sm text-slate-400">Global Asset Compliance Engine</div>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">
            Professional Account Setup
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Set up your accountancy practice on GACE
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-all ${
                      s < step
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : s === step
                        ? "border-purple-500 bg-purple-500 text-white"
                        : "border-slate-700 bg-slate-900 text-slate-500"
                    }`}
                  >
                    {s < step ? <CheckCircle className="h-5 w-5" /> : s}
                  </div>
                  <div className="mt-2 text-xs text-slate-400">Step {s}</div>
                </div>
                {s < totalSteps && (
                  <div
                    className={`h-0.5 flex-1 transition-all ${
                      s < step ? "bg-emerald-500" : "bg-slate-800"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Content Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-8">
          {/* Step 1: Email Verification */}
          {step === 1 && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
                  <Mail className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">
                    Verify Professional Email
                  </h2>
                  <p className="text-sm text-slate-400">
                    Confirm your business email address
                  </p>
                </div>
              </div>

              {!emailVerified ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100">
                    <div className="font-semibold">
                      Verification email sent to: accountant@firm.com
                    </div>
                    <p className="mt-2 text-amber-100/80">
                      Please verify your business email to ensure secure access to
                      client data and compliance features.
                    </p>
                  </div>

                  <button
                    onClick={() => setEmailVerified(true)}
                    className="w-full rounded-lg bg-purple-600 py-3 font-medium text-white hover:bg-purple-700"
                  >
                    I've Verified My Email
                  </button>

                  <button className="w-full rounded-lg border border-slate-700 bg-slate-800 py-3 text-sm font-medium text-slate-300 hover:bg-slate-700">
                    Resend Verification Email
                  </button>
                </div>
              ) : (
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-6 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-emerald-400" />
                  <div className="mt-3 font-semibold text-emerald-300">
                    Email Verified Successfully!
                  </div>
                  <p className="mt-1 text-sm text-emerald-100/80">
                    Your professional email has been confirmed.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Firm Details */}
          {step === 2 && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
                  <Building className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">
                    Firm Information
                  </h2>
                  <p className="text-sm text-slate-400">
                    Tell us about your practice
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Firm/Practice Name
                  </label>
                  <input
                    type="text"
                    value={formData.firmName}
                    onChange={(e) =>
                      setFormData({ ...formData, firmName: e.target.value })
                    }
                    placeholder="Enter your firm name"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Firm Type
                  </label>
                  <div className="grid gap-3 md:grid-cols-2">
                    {[
                      "Sole Practitioner",
                      "Partnership",
                      "Limited Company",
                      "Chartered Accountancy Firm",
                    ].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, firmType: type })
                        }
                        className={`rounded-lg border p-3 text-left text-sm transition-all ${
                          formData.firmType === type
                            ? "border-purple-500 bg-purple-500/10 text-slate-100"
                            : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Business Address (Optional)
                  </label>
                  <textarea
                    placeholder="Enter your business address"
                    rows={3}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Professional Credentials */}
          {step === 3 && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
                  <FileCheck className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">
                    Professional Credentials
                  </h2>
                  <p className="text-sm text-slate-400">
                    Verify your professional qualifications
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Practice License/Registration Number
                  </label>
                  <input
                    type="text"
                    value={formData.practiceLicense}
                    onChange={(e) =>
                      setFormData({ ...formData, practiceLicense: e.target.value })
                    }
                    placeholder="e.g., ACCA 1234567"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Professional Body/Membership
                  </label>
                  <select
                    value={formData.professionalBody}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        professionalBody: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">Select professional body</option>
                    <option value="ICAEW">
                      ICAEW (Institute of Chartered Accountants in England and
                      Wales)
                    </option>
                    <option value="ACCA">
                      ACCA (Association of Chartered Certified Accountants)
                    </option>
                    <option value="CIMA">
                      CIMA (Chartered Institute of Management Accountants)
                    </option>
                    <option value="AAT">AAT (Association of Accounting Technicians)</option>
                    <option value="ICAS">
                      ICAS (Institute of Chartered Accountants of Scotland)
                    </option>
                    <option value="Other">Other Professional Body</option>
                  </select>
                </div>

                <div className="rounded-xl border border-sky-500/40 bg-sky-500/10 p-4 text-sm text-sky-100">
                  <div className="font-semibold">🔒 Credential Verification</div>
                  <p className="mt-2 text-sky-100/80">
                    Your credentials will be verified as part of our compliance
                    process. This ensures all accountants on GACE meet professional
                    standards.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Practice Details */}
          {step === 4 && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20">
                  <Users className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">
                    Practice Details
                  </h2>
                  <p className="text-sm text-slate-400">
                    Help us understand your client base
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Number of Clients with Overseas Assets
                  </label>
                  <select
                    value={formData.numberOfClients}
                    onChange={(e) =>
                      setFormData({ ...formData, numberOfClients: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="">Select range</option>
                    <option value="1-5">1-5 clients</option>
                    <option value="6-15">6-15 clients</option>
                    <option value="16-30">16-30 clients</option>
                    <option value="31-50">31-50 clients</option>
                    <option value="50+">50+ clients</option>
                  </select>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-300">
                    Services You Offer (select all that apply)
                  </label>
                  <div className="grid gap-2 md:grid-cols-2">
                    {[
                      "Tax Planning & Compliance",
                      "Self Assessment Filing",
                      "CGT Calculations",
                      "Foreign Income Reporting",
                      "DTA Advisory",
                      "HMRC Representation",
                      "Bookkeeping",
                      "General Accountancy",
                    ].map((service) => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => toggleSelection("servicesOffered", service)}
                        className={`rounded-lg border p-3 text-left text-sm transition-all ${
                          formData.servicesOffered.includes(service)
                            ? "border-purple-500 bg-purple-500/10 text-slate-100"
                            : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{service}</span>
                          {formData.servicesOffered.includes(service) && (
                            <CheckCircle className="h-4 w-4 text-purple-400" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-300">
                    Primary Client Jurisdictions (select all that apply)
                  </label>
                  <div className="grid gap-2 md:grid-cols-2">
                    {[
                      "United Kingdom",
                      "Nigeria",
                      "United Arab Emirates",
                      "India",
                      "Kenya",
                      "United States",
                      "Ghana",
                      "Other",
                    ].map((jurisdiction) => (
                      <button
                        key={jurisdiction}
                        type="button"
                        onClick={() =>
                          toggleSelection("primaryJurisdictions", jurisdiction)
                        }
                        className={`rounded-lg border p-3 text-left text-sm transition-all ${
                          formData.primaryJurisdictions.includes(jurisdiction)
                            ? "border-purple-500 bg-purple-500/10 text-slate-100"
                            : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{jurisdiction}</span>
                          {formData.primaryJurisdictions.includes(jurisdiction) && (
                            <CheckCircle className="h-4 w-4 text-purple-400" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-6 py-3 font-medium text-slate-300 hover:bg-slate-700"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="ml-auto flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 font-medium text-white hover:bg-purple-700 disabled:bg-slate-700 disabled:text-slate-500"
            >
              {step === totalSteps ? "Complete Setup" : "Next"}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Info Box */}
        {step === totalSteps && (
          <div className="mt-6 rounded-xl border border-purple-500/40 bg-purple-500/10 p-4 text-sm text-purple-100">
            <div className="font-semibold">🎉 Almost Ready!</div>
            <p className="mt-2 text-purple-100/80">
              After completing setup, you'll be able to invite clients, manage
              multi-client dashboards, and access advanced compliance tools designed
              for professional practices.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};