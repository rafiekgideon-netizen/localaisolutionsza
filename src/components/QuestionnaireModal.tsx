import { useState, type FormEvent, useEffect, useCallback } from "react";
import { ArrowRight, ArrowLeft, Check, CheckCircle2, AlertCircle, X, Loader2, Save, CornerDownLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { SlidingTextButton } from "./ui/sliding-text-button";
import { fireAuditCelebrationConfetti } from "../utils/confetti";
import {
  AuditFormData,
  INITIAL_FORM_DATA,
  fieldValidators,
  stepFields,
  QUESTIONNAIRE_STEPS,
  BUSINESS_TYPES,
  STAFF_OPTIONS,
  CHALLENGE_OPTIONS,
  LEAD_SOURCE_OPTIONS,
  RESPONSE_METHOD_OPTIONS,
  MISSED_CALLS_OPTIONS,
  DESIRED_OUTCOME_OPTIONS,
  PREFERRED_TIME_OPTIONS
} from "../data/questionnaireData";
import { QuestionnaireSuccessView } from "./QuestionnaireSuccessView";
import { FormFieldInput, FormFieldSelect } from "./QuestionnaireFields";

interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuestionnaireModal({ isOpen, onClose }: QuestionnaireModalProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form State initialized from localStorage
  const [formData, setFormData] = useState<AuditFormData>(() => {
    const saved = localStorage.getItem("auditFormData");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_e) {
        // ignore parse error
      }
    }
    return INITIAL_FORM_DATA;
  });

  // Track which fields have been interacted with (touched)
  const [touched, setTouched] = useState<Record<string, boolean>>(() => {
    const initialTouched: Record<string, boolean> = {};
    const saved = localStorage.getItem("auditFormData");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.entries(parsed).forEach(([k, v]) => {
          if (typeof v === "string" && v.trim() !== "") {
            initialTouched[k] = true;
          }
        });
      } catch {
        // ignore
      }
    }
    return initialTouched;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [shake, setShake] = useState(false);

  // Autosave to localStorage
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("auditFormData", JSON.stringify(formData));
      
      if (Object.values(formData).some(val => val !== "")) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [formData]);

  // Manage body scroll locking when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleClose = () => {
    setServerError(null);
    onClose();
  };

  const updateForm = (key: keyof AuditFormData, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setTouched(prev => ({ ...prev, [key]: true }));
    if (serverError) setServerError(null);
  };

  const getFieldError = (key: keyof AuditFormData): string => {
    if (!touched[key]) return "";
    const validator = fieldValidators[key];
    return validator ? validator(formData[key] || "") : "";
  };

  const isFieldValid = (key: keyof AuditFormData): boolean => {
    const val = formData[key] || "";
    const validator = fieldValidators[key];
    if (!validator) return true;
    return val.trim() !== "" && validator(val) === "";
  };

  const handleBlur = (key: keyof AuditFormData) => {
    setTouched(prev => ({ ...prev, [key]: true }));
  };

  // Real-time step progress calculation
  const currentStepRequiredFields = stepFields[step] || [];
  const completedFieldsCount = currentStepRequiredFields.filter(f => isFieldValid(f)).length;
  const totalFieldsCount = currentStepRequiredFields.length;
  const isStepComplete = completedFieldsCount === totalFieldsCount;

  const validateCurrentStep = (): boolean => {
    const fields = stepFields[step] || [];
    const newlyTouched: Record<string, boolean> = {};
    let firstInvalidKey: string | null = null;
    let hasError = false;

    fields.forEach(field => {
      newlyTouched[field] = true;
      const validator = fieldValidators[field];
      const val = formData[field] || "";
      if (validator && validator(val) !== "") {
        hasError = true;
        if (!firstInvalidKey) {
          firstInvalidKey = field;
        }
      }
    });

    setTouched(prev => ({ ...prev, ...newlyTouched }));

    if (hasError) {
      setShake(true);
      setTimeout(() => setShake(false), 500);

      if (firstInvalidKey) {
        const el = document.getElementById(firstInvalidKey);
        if (el) {
          el.focus();
          el.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      return false;
    }
    return true;
  };

  const proceedToNextStep = useCallback(() => {
    if (validateCurrentStep()) {
      setStep(s => Math.min(s + 1, totalSteps));
    }
  }, [totalSteps, step, formData]);

  const prevStep = useCallback(() => setStep(s => Math.max(s - 1, 1)), []);

  const getWhatsAppAuditLink = () => {
    const text = `Hi Local AI Solutions! Here are my audit questionnaire details for a free strategy session:\n\n` +
      `• Business Name: ${formData.businessName || "N/A"}\n` +
      `• Business Type: ${formData.businessType || "N/A"}\n` +
      `• Location: ${formData.location || "N/A"}\n` +
      `• Staff Size: ${formData.staff || "N/A"}\n` +
      `• Primary Operational Challenge: ${formData.challenge || "N/A"}\n` +
      `• Lead Acquisition Source: ${formData.leadSource || "N/A"}\n` +
      `• Current Response Handling: ${formData.responseMethod || "N/A"}\n` +
      `• Missed Inbound Calls: ${formData.missedCalls || "N/A"}\n` +
      `• Contact Details: ${formData.phone || "N/A"} / ${formData.email || "N/A"}\n` +
      `• Desired Strategic Outcome: ${formData.desiredOutcome || "N/A"}\n` +
      `• Preferred Consultation Window: ${formData.preferredTime || "N/A"}`;
    return `https://wa.me/27682265793?text=${encodeURIComponent(text)}`;
  };

  const submitForm = useCallback(async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!validateCurrentStep()) return;
    
    setIsSubmitting(true);
    setServerError(null);

    let serverSaved = false;

    // 1. Primary submission via server API endpoint (/api/questionnaire)
    try {
      const response = await fetch("/api/questionnaire", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          submittedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        serverSaved = true;
      } else {
        const errJson = await response.json().catch(() => ({}));
        console.warn("Server questionnaire endpoint returned error:", errJson);
      }
    } catch (apiErr) {
      console.warn("Unable to contact /api/questionnaire directly:", apiErr);
    }

    // 2. Best-effort secondary sync to Firebase Firestore
    let firestoreSaved = false;
    try {
      await addDoc(collection(db, "leads"), {
        ...formData,
        createdAt: serverTimestamp()
      });
      firestoreSaved = true;
    } catch (firestoreErr) {
      console.warn("Firestore client write notice:", firestoreErr);
    }

    // 3. If either server storage or firestore succeeded:
    if (serverSaved || firestoreSaved) {
      setIsSubmitted(true);
      fireAuditCelebrationConfetti();
      localStorage.removeItem("auditFormData");
      setFormData(INITIAL_FORM_DATA);
      setTouched({});
      setIsSubmitting(false);
      return;
    }

    // 4. Fallback if completely offline / network failure:
    try {
      const offlineQueue = JSON.parse(localStorage.getItem("offlineAuditLeads") || "[]");
      offlineQueue.push({ ...formData, savedAt: new Date().toISOString() });
      localStorage.setItem("offlineAuditLeads", JSON.stringify(offlineQueue));
      // Even in fallback queue, show celebration since work is safely stored
      setIsSubmitted(true);
      fireAuditCelebrationConfetti();
      localStorage.removeItem("auditFormData");
      setFormData(INITIAL_FORM_DATA);
      setTouched({});
      setIsSubmitting(false);
      return;
    } catch {
      // ignore
    }

    setServerError("We experienced a transmission delay reaching the diagnostic server. Your responses are securely preserved. You can retry transmission or send them instantly via WhatsApp.");
    setIsSubmitting(false);
  }, [formData, validateCurrentStep]);

  // Accessibility: Keyboard handlers ('Esc' to close, 'Enter' to advance steps or submit)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. 'Esc' closes the modal from any screen or step
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        handleClose();
        return;
      }

      // 2. 'Enter' advances to the next step or submits on the final step
      if (e.key === "Enter") {
        // If already on the success screen, Enter navigates to scheduling
        if (isSubmitted) {
          e.preventDefault();
          handleClose();
          const auditEl = document.getElementById("audit");
          if (auditEl) {
            auditEl.scrollIntoView({ behavior: "smooth" });
          } else {
            window.location.hash = "audit";
          }
          return;
        }

        const target = e.target as HTMLElement | null;

        // In multiline textareas, permit default newline behavior
        if (target && target.tagName === "TEXTAREA") {
          return;
        }

        // In secondary buttons (Back, Clear, WhatsApp), let normal click execute
        if (target && target.tagName === "BUTTON") {
          const btn = target as HTMLButtonElement;
          if (btn.type === "button") {
            return;
          }
        }

        // Links handle themselves
        if (target && target.tagName === "A") {
          return;
        }

        // Prevent default submission to orchestrate step advancement
        e.preventDefault();
        if (step < totalSteps) {
          proceedToNextStep();
        } else {
          submitForm();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isSubmitted, step, totalSteps, proceedToNextStep, submitForm, handleClose]);

  const handleClearRestart = () => {
    localStorage.removeItem("auditFormData");
    setFormData(INITIAL_FORM_DATA);
    setTouched({});
    setStep(1);
    setServerError(null);
  };

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#1a1a1a] border border-[rgba(255,255,255,0.1)] rounded-full px-5 py-2.5 flex items-center gap-3 z-[110] shadow-2xl backdrop-blur-md"
        >
          <CheckCircle2 strokeWidth={2} className="w-4 h-4 text-[var(--color-success)]" />
          <span className="font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-widest">Progress Saved Locally</span>
        </motion.div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Subtle blur background overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
            className="absolute inset-0 bg-[rgba(5,5,5,0.7)] backdrop-blur-md cursor-pointer"
            aria-hidden="true"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="audit-modal-title"
            aria-describedby="audit-modal-desc"
            className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-[var(--color-primary-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl"
          >
            <div className="absolute inset-0 bg-ethereal-glow pointer-events-none opacity-20" />
            
            {/* Top accessibility bar */}
            <div className="absolute top-4 left-6 sm:top-6 sm:left-8 z-20 hidden sm:flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] font-mono text-[var(--color-muted)]">
                <CornerDownLeft className="w-3 h-3 text-[var(--color-tertiary)]" />
                <kbd className="font-semibold text-white/90">Enter</kbd> to {step < totalSteps ? "next step" : "submit"}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] font-mono text-[var(--color-muted)]">
                <kbd className="font-semibold text-white/90">Esc</kbd> to close
              </span>
            </div>

            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-[var(--color-muted)] hover:bg-[rgba(255,255,255,0.1)] hover:text-white transition-colors cursor-pointer"
              aria-label="Close modal"
              title="Close modal (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="relative z-10 !p-6 sm:!p-10 md:!p-12">
              {isSubmitted ? (
                <QuestionnaireSuccessView onClose={handleClose} />
              ) : (
                <>
                  <div className="text-center mb-8 pt-4 sm:pt-0">
                    <div className="eyebrow-pill mb-4 mx-auto">Step {step} of {totalSteps}</div>
                    <h2 id="audit-modal-title" className="font-display text-3xl sm:text-4xl text-white mb-4">
                      {step === 1 && "Find Your Revenue Leaks"}
                      {step === 2 && "Where Are You Losing Money?"}
                      {step === 3 && "How Do We Reach You?"}
                      {step === 4 && "What Does Success Look Like?"}
                    </h2>
                    <p id="audit-modal-desc" className="font-body text-body-md text-[var(--color-muted)] max-w-xl mx-auto">
                      {step === 1 && "Answer a few questions so we can tailor the audit to your business. Takes 3 minutes."}
                      {step === 2 && "Help us understand your current workflow and lead bottlenecks."}
                      {step === 3 && "We need this to confirm your audit slot and send recommendations."}
                      {step === 4 && "Let's align on what victory looks like for your revenue growth."}
                    </p>
                  </div>

                  {/* Multi-step Header */}
                  <div className="flex items-center justify-between mb-8 max-w-xl mx-auto relative hidden sm:flex">
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[rgba(255,255,255,0.06)] -translate-y-1/2 z-0" />
                    <div 
                      className="absolute top-1/2 left-0 h-[2px] bg-[var(--color-tertiary)] -translate-y-1/2 z-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" 
                      style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }} 
                    />
                    
                    {QUESTIONNAIRE_STEPS.map((s) => (
                      <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                        <div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                            step === s.id 
                              ? 'bg-[var(--color-tertiary)] text-black shadow-[0_0_15px_rgba(249,115,22,0.4)] scale-110 font-bold' 
                              : s.id < step 
                                ? 'bg-[var(--color-success)] text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]' 
                                : 'bg-[#1a1a1a] text-[var(--color-muted)] border border-[rgba(255,255,255,0.1)]'
                          }`}
                        >
                          {s.id < step ? <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} /> : s.id}
                        </div>
                        <span className={`font-mono text-[10px] uppercase tracking-widest ${step >= s.id ? 'text-white' : 'text-[var(--color-muted-dark)]'}`}>
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Real-time Step Completion Status Banner */}
                  <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] mb-8">
                    <span className="font-mono text-xs uppercase tracking-wider text-[var(--color-muted)] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[var(--color-tertiary)]" />
                      Step {step} Required Fields
                    </span>
                    <div 
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono transition-all duration-300 ${
                        isStepComplete 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30" 
                          : "bg-[rgba(255,255,255,0.04)] text-[var(--color-muted)] border border-[rgba(255,255,255,0.08)]"
                      }`}
                    >
                      {isStepComplete ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Ready to proceed</span>
                        </>
                      ) : (
                        <span>{completedFieldsCount} of {totalFieldsCount} completed</span>
                      )}
                    </div>
                  </div>

                  <form 
                    noValidate 
                    onSubmit={(e) => { 
                      e.preventDefault(); 
                      if (step === totalSteps) submitForm(e); 
                      else proceedToNextStep(); 
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {step === 1 && (
                        <motion.div 
                          key="step1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className="space-y-6"
                        >
                          <FormFieldInput
                            id="businessName"
                            label="Business Name *"
                            placeholder="e.g. Cape Plumbing Solutions"
                            value={formData.businessName}
                            onChange={(val) => updateForm("businessName", val)}
                            onBlur={() => handleBlur("businessName")}
                            error={getFieldError("businessName")}
                            isValid={isFieldValid("businessName")}
                          />
                          
                          <FormFieldSelect
                            id="businessType"
                            label="Business Type *"
                            placeholder="Select your business type..."
                            value={formData.businessType}
                            options={BUSINESS_TYPES}
                            onChange={(val) => updateForm("businessType", val)}
                            onBlur={() => handleBlur("businessType")}
                            error={getFieldError("businessType")}
                            isValid={isFieldValid("businessType")}
                          />
                          
                          <FormFieldInput
                            id="location"
                            label="Location *"
                            placeholder="e.g. Cape Town, Bellville, Durban..."
                            value={formData.location}
                            onChange={(val) => updateForm("location", val)}
                            onBlur={() => handleBlur("location")}
                            error={getFieldError("location")}
                            isValid={isFieldValid("location")}
                          />
                          
                          <div>
                            <span className="block font-mono text-xs text-[var(--color-muted)] uppercase tracking-wider mb-2">
                              Number of Staff (Optional)
                            </span>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {STAFF_OPTIONS.map((opt) => (
                                <label 
                                  key={opt} 
                                  className={`relative flex items-center justify-center p-3 sm:py-3.5 rounded-xl bg-[#161616] border transition-all duration-300 cursor-pointer min-h-[44px] ${
                                    formData.staff === opt 
                                      ? 'border-[var(--color-tertiary)] text-[var(--color-tertiary)] bg-[rgba(249,115,22,0.05)] shadow-[0_0_10px_rgba(249,115,22,0.15)]' 
                                      : 'border-[rgba(255,255,255,0.05)] text-[var(--color-muted)] hover:border-[rgba(255,255,255,0.15)] hover:bg-[#1a1a1a]'
                                  }`}
                                >
                                  <input 
                                    type="radio" 
                                    value={opt} 
                                    checked={formData.staff === opt} 
                                    onChange={(e) => updateForm('staff', e.target.value)} 
                                    className="sr-only" 
                                  />
                                  <span className="font-body text-sm font-medium">{opt}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {step === 2 && (
                        <motion.div 
                          key="step2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className="space-y-6"
                        >
                          <FormFieldSelect
                            id="challenge"
                            label="Biggest Challenge Right Now *"
                            value={formData.challenge}
                            options={CHALLENGE_OPTIONS}
                            onChange={(val) => updateForm("challenge", val)}
                            onBlur={() => handleBlur("challenge")}
                            error={getFieldError("challenge")}
                            isValid={isFieldValid("challenge")}
                          />

                          <FormFieldSelect
                            id="leadSource"
                            label="Biggest Source of New Leads *"
                            value={formData.leadSource}
                            options={LEAD_SOURCE_OPTIONS}
                            onChange={(val) => updateForm("leadSource", val)}
                            onBlur={() => handleBlur("leadSource")}
                            error={getFieldError("leadSource")}
                            isValid={isFieldValid("leadSource")}
                            tooltipText="e.g. word of mouth, local community groups (Facebook groups), Google My Business, or paid ads."
                          />

                          <FormFieldSelect
                            id="responseMethod"
                            label="How Do You Currently Handle Enquiries? *"
                            value={formData.responseMethod}
                            options={RESPONSE_METHOD_OPTIONS}
                            onChange={(val) => updateForm("responseMethod", val)}
                            onBlur={() => handleBlur("responseMethod")}
                            error={getFieldError("responseMethod")}
                            isValid={isFieldValid("responseMethod")}
                          />

                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="block font-mono text-xs text-[var(--color-muted)] uppercase tracking-wider">
                                Do You Miss Calls or WhatsApp Leads? *
                              </span>
                              {isFieldValid("missedCalls") && (
                                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                                  <Check className="w-3 h-3" /> completed
                                </span>
                              )}
                            </div>
                            <div 
                              className={`grid grid-cols-1 md:grid-cols-3 gap-3 p-1 rounded-2xl transition-all duration-200 ${
                                getFieldError("missedCalls") ? "border border-red-500/60 bg-red-500/[0.02]" : ""
                              }`}
                            >
                              {MISSED_CALLS_OPTIONS.map((opt) => (
                                <label 
                                  key={opt} 
                                  className={`relative flex items-center justify-center p-3 sm:py-3.5 rounded-xl bg-[#161616] border transition-all duration-300 cursor-pointer min-h-[44px] ${
                                    formData.missedCalls === opt 
                                      ? 'border-[var(--color-tertiary)] text-[var(--color-tertiary)] bg-[rgba(249,115,22,0.05)] shadow-[0_0_10px_rgba(249,115,22,0.15)]' 
                                      : 'border-[rgba(255,255,255,0.05)] text-[var(--color-muted)] hover:border-[rgba(255,255,255,0.15)] hover:bg-[#1a1a1a]'
                                  }`}
                                >
                                  <input 
                                    type="radio" 
                                    value={opt} 
                                    checked={formData.missedCalls === opt} 
                                    onChange={(e) => updateForm('missedCalls', e.target.value)} 
                                    onBlur={() => handleBlur('missedCalls')}
                                    className="sr-only" 
                                  />
                                  <span className="font-body text-sm font-medium text-center">{opt}</span>
                                </label>
                              ))}
                            </div>
                            {getFieldError("missedCalls") && (
                              <p id="missedCalls-error" role="alert" className="mt-2 text-xs text-red-400 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                {getFieldError("missedCalls")}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {step === 3 && (
                        <motion.div 
                          key="step3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className="space-y-6"
                        >
                          <FormFieldInput
                            id="phone"
                            label="WhatsApp / Mobile Number *"
                            type="tel"
                            placeholder="e.g. 082 555 1234 or +27 82 555 1234"
                            value={formData.phone}
                            onChange={(val) => updateForm("phone", val)}
                            onBlur={() => handleBlur("phone")}
                            error={getFieldError("phone")}
                            isValid={isFieldValid("phone")}
                            validHelperText="Valid contact number format"
                            helperText="We'll use this to confirm your audit slot via WhatsApp."
                          />

                          <div>
                            <FormFieldInput
                              id="email"
                              label="Email Address *"
                              type="email"
                              placeholder="your@company.co.za"
                              value={formData.email}
                              onChange={(val) => updateForm("email", val)}
                              onBlur={() => handleBlur("email")}
                              error={getFieldError("email")}
                              isValid={isFieldValid("email")}
                              validHelperText="Valid email address format"
                            />
                            <p className="mt-3 text-[11px] leading-relaxed text-[var(--color-muted-dark)] font-body">
                              Your details stay private. We use this only to prepare your audit and confirm via WhatsApp. No spam. No selling your info. We're a small Cape Town business — we know how frustrating spam is.
                            </p>
                          </div>
                        </motion.div>
                      )}

                      {step === 4 && (
                        <motion.div 
                          key="step4"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          className="space-y-6"
                        >
                          <FormFieldSelect
                            id="desiredOutcome"
                            label="What's Your Desired Outcome? *"
                            value={formData.desiredOutcome}
                            options={DESIRED_OUTCOME_OPTIONS}
                            onChange={(val) => updateForm("desiredOutcome", val)}
                            onBlur={() => handleBlur("desiredOutcome")}
                            error={getFieldError("desiredOutcome")}
                            isValid={isFieldValid("desiredOutcome")}
                          />

                          <FormFieldSelect
                            id="preferredTime"
                            label="Preferred Consultation Time *"
                            value={formData.preferredTime}
                            options={PREFERRED_TIME_OPTIONS}
                            onChange={(val) => updateForm("preferredTime", val)}
                            onBlur={() => handleBlur("preferredTime")}
                            error={getFieldError("preferredTime")}
                            isValid={isFieldValid("preferredTime")}
                            tooltipText="We will confirm the exact time over WhatsApp shortly after you submit."
                          />
                          
                          {/* Live Audit Summary preview */}
                          <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded-2xl p-6 mt-8">
                            <h4 className="font-mono text-xs text-white uppercase tracking-wider mb-4 pb-4 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                              <span>Your Audit Diagnostic Summary</span>
                              <span className="text-[10px] text-[var(--color-tertiary)] lowercase font-mono">live preview</span>
                            </h4>
                            <div className="space-y-3 font-body text-sm text-[var(--color-muted)]">
                              <div className="flex justify-between">
                                <span className="text-[var(--color-muted-dark)] pr-4">Business:</span>
                                <span className="text-white text-right max-w-[200px] sm:max-w-[300px] truncate font-medium">
                                  {formData.businessName || "—"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[var(--color-muted-dark)] pr-4">Type:</span>
                                <span className="text-white text-right max-w-[200px] sm:max-w-[300px] truncate font-medium">
                                  {formData.businessType || "—"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[var(--color-muted-dark)] pr-4">Location:</span>
                                <span className="text-white text-right max-w-[200px] sm:max-w-[300px] truncate font-medium">
                                  {formData.location || "—"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[var(--color-muted-dark)] pr-4">Challenge:</span>
                                <span className="text-white text-right max-w-[200px] sm:max-w-[300px] truncate font-medium" title={formData.challenge}>
                                  {formData.challenge || "—"}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-[var(--color-muted-dark)] pr-4">Contact Phone:</span>
                                <span className="text-white text-right max-w-[200px] sm:max-w-[300px] truncate font-medium">
                                  {formData.phone || "—"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-10 pt-8 border-t border-[rgba(255,255,255,0.06)]">
                      {step > 1 && (
                        <button 
                          type="button" 
                          onClick={prevStep} 
                          className="btn-secondary !w-full sm:!w-auto px-6 group order-2 sm:order-1 cursor-pointer"
                        >
                          <ArrowLeft strokeWidth={2} className="w-4 h-4 mr-2 md:group-hover:-translate-x-1 transition-transform" />
                          Back
                        </button>
                      )}
                      
                      <SlidingTextButton 
                        type="submit" 
                        disabled={isSubmitting} 
                        animate={shake ? { x: [-8, 8, -6, 6, -3, 3, 0] } : undefined}
                        transition={{ duration: 0.4 }}
                        className="!w-full sm:flex-1 px-6 group order-1 sm:order-2 cursor-pointer"
                      >
                        <span>
                          {isSubmitting ? "Submitting Diagnostic..." : step === totalSteps ? "Submit & Book Free Audit" : "Continue"}
                        </span>
                        <div className="flex items-center justify-center bg-[rgba(0,0,0,0.1)] rounded-full w-8 h-8 ml-2">
                          {isSubmitting ? (
                            <Loader2 className="w-4 h-4 text-[#050505] animate-spin" />
                          ) : step < totalSteps ? (
                            <ArrowRight strokeWidth={2.5} className="w-4 h-4 text-[#050505] md:group-hover:translate-x-1 transition-transform" />
                          ) : (
                            <CheckCircle2 strokeWidth={2.5} className="w-4 h-4 text-[#050505]" />
                          )}
                        </div>
                      </SlidingTextButton>
                    </div>

                    {/* Server error message if any */}
                    {serverError && (
                      <motion.div 
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 rounded-xl bg-[rgba(239,68,68,0.08)] border border-red-500/20 text-left"
                      >
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                          <div className="space-y-2 flex-1">
                            <h5 className="text-xs font-mono font-medium text-red-300 uppercase tracking-wider">
                              Transmission Notice
                            </h5>
                            <p className="text-xs text-red-200/80 leading-relaxed font-body">
                              {serverError}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                              <button
                                type="button"
                                onClick={submitForm}
                                disabled={isSubmitting}
                                className="px-3 py-1.5 rounded-lg bg-[rgba(255,255,255,0.08)] hover:bg-[rgba(255,255,255,0.15)] text-white text-xs font-mono transition-colors border border-[rgba(255,255,255,0.1)] cursor-pointer"
                              >
                                {isSubmitting ? "Retrying..." : "Retry Transmission"}
                              </button>
                              <a
                                href={getWhatsAppAuditLink()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1.5 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] text-xs font-mono transition-colors border border-[#25D366]/30 flex items-center gap-1.5"
                              >
                                <span>Send via WhatsApp (+27 68 226 5793)</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {Object.values(formData).some((v) => v !== "") && (
                      <div className="mt-6 flex flex-col gap-4 items-center justify-center">
                        <div className="flex items-center justify-center gap-6">
                          <button 
                            type="button" 
                            onClick={() => {
                              setShowToast(true);
                              setTimeout(() => {
                                setShowToast(false);
                                onClose();
                              }, 1500);
                            }} 
                            className="text-[10px] flex items-center gap-1.5 font-mono text-[var(--color-muted-dark)] hover:text-white transition-colors uppercase tracking-widest underline decoration-[rgba(255,255,255,0.1)] hover:decoration-white underline-offset-4 cursor-pointer"
                          >
                            <Save className="w-3 h-3" />
                            Save & Finish Later
                          </button>
                          <button 
                            type="button" 
                            onClick={handleClearRestart} 
                            className="text-[10px] font-mono text-[var(--color-muted-dark)] hover:text-white transition-colors uppercase tracking-widest underline decoration-[rgba(255,255,255,0.1)] hover:decoration-white underline-offset-4 cursor-pointer"
                          >
                            Clear Form & Restart
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
