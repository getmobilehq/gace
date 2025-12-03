import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { authService } from "../utils/supabase/auth";
import {
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Mail,
  User,
  MapPin,
  Globe,
  Briefcase,
} from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

export const EndUserOnboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const { user, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    ukResidencyStatus: "",
    selfAssessmentStatus: "",
    countries: [] as string[],
    assetTypes: [] as string[],
    estimatedPortfolioValue: "",
    hasAccountant: "",
  });

  const totalSteps = 5;

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

  const toggleSelection = (field: "countries" | "assetTypes", value: string) => {
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
        return emailVerified;
      case 2:
        return formData.fullName && formData.ukResidencyStatus;
      case 3:
        return formData.selfAssessmentStatus;
      case 4:
        return formData.countries.length > 0 && formData.assetTypes.length > 0;
      case 5:
        return formData.estimatedPortfolioValue && formData.hasAccountant;
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
            Welcome to GACE
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Let's set up your account in just a few steps
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
                        ? "border-indigo-500 bg-indigo-500 text-white"
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
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20">
                  <Mail className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">
                    Verify Your Email
                  </h2>
                  <p className="text-sm text-slate-400">
                    Confirm your email address to continue
                  </p>
                </div>
              </div>

              {!emailVerified ? (
                <div className="space-y-4">
                  <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-100">
                    <div className="font-semibold">
                      Verification email sent to: demo@example.com
                    </div>
                    <p className="mt-2 text-amber-100/80">
                      Please check your inbox and click the verification link. Don't
                      see it? Check your spam folder.
                    </p>
                  </div>

                  <button
                    onClick={() => setEmailVerified(true)}
                    className="w-full rounded-lg bg-indigo-600 py-3 font-medium text-white hover:bg-indigo-700"
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
                    Your email has been confirmed. Click Next to continue.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Basic Details */}
          {step === 2 && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20">
                  <User className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">
                    Basic Information
                  </h2>
                  <p className="text-sm text-slate-400">
                    Tell us a bit about yourself
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="Enter your full name"
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    UK Residency Status
                  </label>
                  <div className="grid gap-3 md:grid-cols-2">
                    {[
                      "UK Resident (for tax)",
                      "Non-UK Resident",
                      "Deemed Domiciled",
                      "Non-Domiciled (claiming remittance basis)",
                    ].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, ukResidencyStatus: status })
                        }
                        className={`rounded-lg border p-3 text-left text-sm transition-all ${
                          formData.ukResidencyStatus === status
                            ? "border-indigo-500 bg-indigo-500/10 text-slate-100"
                            : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    This determines your UK tax obligations on worldwide income and
                    gains
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Self Assessment Status */}
          {step === 3 && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20">
                  <Briefcase className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">
                    Self Assessment Status
                  </h2>
                  <p className="text-sm text-slate-400">
                    Do you file Self Assessment tax returns?
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  {
                    value: "registered",
                    label: "Already Registered for Self Assessment",
                    description: "I have a UTR and file annual returns",
                  },
                  {
                    value: "need-to-register",
                    label: "Need to Register",
                    description:
                      "I need to register for Self Assessment with HMRC",
                  },
                  {
                    value: "not-sure",
                    label: "Not Sure",
                    description: "I'm not certain if I need to register",
                  },
                  {
                    value: "not-required",
                    label: "Not Required",
                    description: "I don't need to file Self Assessment",
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        selfAssessmentStatus: option.value,
                      })
                    }
                    className={`w-full rounded-lg border p-4 text-left transition-all ${
                      formData.selfAssessmentStatus === option.value
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                    }`}
                  >
                    <div className="font-medium text-slate-100">
                      {option.label}
                    </div>
                    <div className="mt-1 text-xs text-slate-400">
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>

              {formData.selfAssessmentStatus === "not-sure" && (
                <div className="mt-4 rounded-xl border border-sky-500/40 bg-sky-500/10 p-4 text-sm text-sky-100">
                  <div className="font-semibold">💡 Need Help?</div>
                  <p className="mt-2 text-sky-100/80">
                    You generally need to file Self Assessment if you have income
                    from overseas assets, are self-employed, or earn over £100,000.
                    GACE can help determine your obligations.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Asset Countries & Types */}
          {step === 4 && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20">
                  <Globe className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">
                    Asset Information
                  </h2>
                  <p className="text-sm text-slate-400">
                    Where are your overseas assets located?
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-300">
                    Select Countries (select all that apply)
                  </label>
                  <div className="grid gap-2 md:grid-cols-2">
                    {[
                      "Nigeria",
                      "United Arab Emirates",
                      "India",
                      "Kenya",
                      "United States",
                      "Ghana",
                      "South Africa",
                      "Other",
                    ].map((country) => (
                      <button
                        key={country}
                        type="button"
                        onClick={() => toggleSelection("countries", country)}
                        className={`rounded-lg border p-3 text-left text-sm transition-all ${
                          formData.countries.includes(country)
                            ? "border-indigo-500 bg-indigo-500/10 text-slate-100"
                            : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{country}</span>
                          {formData.countries.includes(country) && (
                            <CheckCircle className="h-4 w-4 text-indigo-400" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-300">
                    Asset Types (select all that apply)
                  </label>
                  <div className="grid gap-2 md:grid-cols-2">
                    {[
                      "Equities/Stocks",
                      "Mutual Funds",
                      "ETFs",
                      "Real Estate/Property",
                      "Bank Accounts",
                      "Bonds",
                      "Cryptocurrency",
                      "Other Investments",
                    ].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleSelection("assetTypes", type)}
                        className={`rounded-lg border p-3 text-left text-sm transition-all ${
                          formData.assetTypes.includes(type)
                            ? "border-indigo-500 bg-indigo-500/10 text-slate-100"
                            : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{type}</span>
                          {formData.assetTypes.includes(type) && (
                            <CheckCircle className="h-4 w-4 text-indigo-400" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Portfolio & Accountant */}
          {step === 5 && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/20">
                  <MapPin className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-100">
                    Final Details
                  </h2>
                  <p className="text-sm text-slate-400">
                    Almost done! Just a few more questions
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Estimated Total Portfolio Value (Optional)
                  </label>
                  <select
                    value={formData.estimatedPortfolioValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estimatedPortfolioValue: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 text-slate-100 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="">Select a range</option>
                    <option value="under-50k">Under £50,000</option>
                    <option value="50k-100k">£50,000 - £100,000</option>
                    <option value="100k-250k">£100,000 - £250,000</option>
                    <option value="250k-500k">£250,000 - £500,000</option>
                    <option value="500k-1m">£500,000 - £1,000,000</option>
                    <option value="over-1m">Over £1,000,000</option>
                  </select>
                  <p className="mt-2 text-xs text-slate-500">
                    This helps us tailor recommendations to your situation
                  </p>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-300">
                    Do you work with an accountant or tax advisor?
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: "yes", label: "Yes, I have an accountant" },
                      { value: "no", label: "No, I manage my own taxes" },
                      {
                        value: "looking",
                        label: "No, but I'm looking for one",
                      },
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, hasAccountant: option.value })
                        }
                        className={`w-full rounded-lg border p-3 text-left text-sm transition-all ${
                          formData.hasAccountant === option.value
                            ? "border-indigo-500 bg-indigo-500/10 text-slate-100"
                            : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-slate-600"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {formData.hasAccountant === "yes" && (
                  <div className="rounded-xl border border-sky-500/40 bg-sky-500/10 p-4 text-sm text-sky-100">
                    <div className="font-semibold">
                      Accountant Collaboration Available
                    </div>
                    <p className="mt-2 text-sky-100/80">
                      You can invite your accountant to collaborate on your GACE
                      account after setup is complete.
                    </p>
                  </div>
                )}
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
              className="ml-auto flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white hover:bg-indigo-700 disabled:bg-slate-700 disabled:text-slate-500"
            >
              {step === totalSteps ? "Complete Setup" : "Next"}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};