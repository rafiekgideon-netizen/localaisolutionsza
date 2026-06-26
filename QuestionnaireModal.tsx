import { useState, type FormEvent, useEffect } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2, X, Loader2, HelpCircle, Save } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { SlidingTextButton } from "./ui/sliding-text-button";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface QuestionnaireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QuestionnaireModal({ isOpen, onClose }: QuestionnaireModalProps) {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('auditFormData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore JSON parse error
      }
    }
    return {
      businessName: "",
      businessType: "",
      location: "",
      staff: "",
      challenge: "",
      leadSource: "",
      responseMethod: "",
      missedCalls: "",
      phone: "",
      email: "",
      desiredOutcome: "",
      preferredTime: ""
    };
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem('auditFormData', JSON.stringify(formData));
      
      // Only show toast if some fields have actual data
      if (Object.values(formData).some(val => val !== "")) {
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
      }
    }, 1500); // Debounce to not flash repeatedly
    return () => clearTimeout(timer);
  }, [formData]);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setIsSubmitted(false);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const updateForm = (key: string, val: string) => {
    setFormData(prev => ({ ...prev, [key]: val }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: "" }));
    }
    
    if (key === 'email') {
      if (val.trim() && !/\S+@\S+\.\S+/.test(val)) {
        setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
      } else {
        setErrors(prev => ({ ...prev, email: "" }));
      }
    }
  };

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.businessName.trim()) newErrors.businessName = "Business name is required";
      if (!formData.businessType) newErrors.businessType = "Please select a true business type";
      if (!formData.location.trim()) newErrors.location = "Location is required";
    } else if (currentStep === 2) {
      if (!formData.challenge) newErrors.challenge = "Please select your biggest challenge";
      if (!formData.leadSource) newErrors.leadSource = "Please select a lead source";
      if (!formData.responseMethod) newErrors.responseMethod = "Please select a response method";
      if (!formData.missedCalls) newErrors.missedCalls = "Please select an option";
    } else if (currentStep === 3) {
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      if (!formData.email.trim()) newErrors.email = "Email address is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Please enter a valid email address";
    } else if (currentStep === 4) {
      if (!formData.desiredOutcome) newErrors.desiredOutcome = "Please select your desired outcome";
      if (!formData.preferredTime) newErrors.preferredTime = "Please select a preferred time";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const proceedToNextStep = () => {
    if (validateStep(step)) {
      setStep(s => Math.min(s + 1, totalSteps));
    }
  };

  const nextStep = () => proceedToNextStep();
  const prevStep = () => setStep(s => Math.max(s - 1, 1));
  const submitForm = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'leads'), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setIsSubmitted(true);
      // Clear data after successful submission
      localStorage.removeItem('auditFormData');
      setFormData({
        businessName: "",
        businessType: "",
        location: "",
        staff: "",
        challenge: "",
        leadSource: "",
        responseMethod: "",
        missedCalls: "",
        phone: "",
        email: "",
        desiredOutcome: "",
        preferredTime: ""
      });
      setErrors({});
    } catch (error) {
      try {
        handleFirestoreError(error, OperationType.CREATE, 'leads');
      } catch (err) {
        setErrors({ form: "Error submitting form. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearRestart = () => {
    localStorage.removeItem('auditFormData');
    setFormData({
      businessName: "",
      businessType: "",
      location: "",
      staff: "",
      challenge: "",
      leadSource: "",
      responseMethod: "",
      missedCalls: "",
      phone: "",
      email: "",
      desiredOutcome: "",
      preferredTime: ""
    });
    setStep(1);
    setErrors({});
  };

  const steps = [
    { id: 1, label: "Business" },
    { id: 2, label: "Challenges" },
    { id: 3, label: "Contact" },
    { id: 4, label: "Goals" }
  ];

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
          <span className="font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-widest">Progress Saved locally</span>
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
            onClick={onClose}
            className="absolute inset-0 bg-[rgba(5,5,5,0.7)] backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-[var(--color-primary-surface)] border border-[var(--color-border)] rounded-3xl shadow-2xl"
          >
            <div className="absolute inset-0 bg-ethereal-glow pointer-events-none opacity-20" />
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 w-10 h-10 flex items-center justify-center rounded-full bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-[var(--color-muted)] hover:bg-[rgba(255,255,255,0.1)] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="relative z-10 !p-6 sm:!p-10 md:!p-12">
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  className="text-center items-center flex flex-col py-12"
                >
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }} 
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="w-24 h-24 rounded-full bg-[rgba(34,197,94,0.1)] flex items-center justify-center mb-8"
                  >
                    <CheckCircle2 strokeWidth={1.5} className="w-12 h-12 text-[var(--color-success)]" />
                  </motion.div>
                  <h2 className="font-display text-display-lg text-white mb-6">Signals Received.</h2>
                  <p className="font-body text-body-lg text-[var(--color-muted)] mb-12">Diagnostic data safely stored. Let's schedule your strategic audit to review the recovery protocols.</p>
                  <SlidingTextButton onClick={onClose} className="mx-auto" asChild>
                    <a href="#audit">
                      Proceed to Scheduling
                      <div className="flex items-center justify-center bg-[rgba(0,0,0,0.1)] rounded-full w-8 h-8 ml-2">
                        <ArrowRight strokeWidth={2.5} className="w-4 h-4 text-[#050505]" />
                      </div>
                    </a>
                  </SlidingTextButton>
                </motion.div>
              ) : (
                <>
                  <div className="mb-12 text-center">
                    <div className="eyebrow-pill mb-4 mx-auto">Step {step} of {totalSteps}</div>
                    <h2 className="font-display text-3xl sm:text-4xl text-white mb-4">
                      {step === 1 && "Find Your Revenue Leaks"}
                      {step === 2 && "Where Are You Losing Money?"}
                      {step === 3 && "How Do We Reach You?"}
                      {step === 4 && "What Does Success Look Like?"}
                    </h2>
                    <p className="font-body text-body-md text-[var(--color-muted)] max-w-xl mx-auto">
                      {step === 1 && "Answer a few questions so we can tailor the audit to your business. Takes 3 minutes."}
                      {step === 2 && "Help us understand your current workflow."}
                      {step === 3 && "We need this to send your audit details."}
                      {step === 4 && "Let's align on what victory looks like."}
                    </p>
                  </div>

                  {/* Custom Multi-step Header */}
                  <div className="flex items-center justify-between mb-12 max-w-xl mx-auto relative hidden sm:flex">
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-[rgba(255,255,255,0.06)] -translate-y-1/2 z-0" />
                    <div 
                      className="absolute top-1/2 left-0 h-[2px] bg-[var(--color-tertiary)] -translate-y-1/2 z-0 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]" 
                      style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }} 
                    />
                    
                    {steps.map((s) => (
                      <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                        <div 
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                            step === s.id 
                              ? 'bg-[var(--color-tertiary)] text-black shadow-[0_0_15px_rgba(249,115,22,0.4)] scale-110' 
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

                  <form noValidate onSubmit={(e) => { e.preventDefault(); if (step === totalSteps) submitForm(e); else nextStep(); }}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="space-y-8"
                >
                  <h3 className="font-display text-3xl text-white">Tell Us About Your Business</h3>
                  
                  <div>
                    <label htmlFor="businessName" className="block font-mono text-xs text-[var(--color-muted)] uppercase tracking-wider mb-3">Business Name *</label>
                    <input id="businessName" aria-required="true" aria-describedby={errors.businessName ? "businessName-error" : undefined} type="text" placeholder="e.g. Cape Plumbing Solutions" className={`input-field min-h-[44px] ${errors.businessName ? 'border-red-500/50 shadow-[0_0_0_1px_rgba(239,68,68,0.5)]' : ''}`} value={formData.businessName} onChange={(e) => updateForm('businessName', e.target.value)} />
                    {errors.businessName && <p id="businessName-error" className="mt-2 text-xs text-red-400 animate-in fade-in slide-in-from-top-1">{errors.businessName}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="businessType" className="block font-mono text-xs text-[var(--color-muted)] uppercase tracking-wider mb-3">Business Type *</label>
                    <select id="businessType" aria-required="true" aria-describedby={errors.businessType ? "businessType-error" : undefined} className={`input-field min-h-[44px] appearance-none bg-no-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5YzlhOWEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSIvPjwvc3ZnPg==')] bg-[position:right_1rem_center] ${errors.businessType ? 'border-red-500/50 shadow-[0_0_0_1px_rgba(239,68,68,0.5)]' : ''}`} value={formData.businessType} onChange={(e) => updateForm('businessType', e.target.value)}>
                      <option value="" disabled className="text-black">Select your business type...</option>
                      <option value="Trades" className="text-black">Trades (Electrician, Plumber, etc.)</option>
                      <option value="Automotive" className="text-black">Automotive (Dealership, Detailing, etc.)</option>
                      <option value="Health & Beauty" className="text-black">Health & Beauty</option>
                      <option value="Home Services" className="text-black">Home Services</option>
                      <option value="Retail & F&B" className="text-black">Retail & F&B</option>
                      <option value="Other" className="text-black">Other</option>
                    </select>
                    {errors.businessType && <p id="businessType-error" className="mt-2 text-xs text-red-400 animate-in fade-in slide-in-from-top-1">{errors.businessType}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="location" className="block font-mono text-xs text-[var(--color-muted)] uppercase tracking-wider mb-3">Location *</label>
                    <input id="location" aria-required="true" aria-describedby={errors.location ? "location-error" : undefined} type="text" placeholder="e.g. Cape Town, Bellville, Durban..." className={`input-field min-h-[44px] ${errors.location ? 'border-red-500/50 shadow-[0_0_0_1px_rgba(239,68,68,0.5)]' : ''}`} value={formData.location} onChange={(e) => updateForm('location', e.target.value)} />
                    {errors.location && <p id="location-error" className="mt-2 text-xs text-red-400 animate-in fade-in slide-in-from-top-1">{errors.location}</p>}
                  </div>
                  
                  <div>
                    <label className="block font-mono text-xs text-[var(--color-muted)] uppercase tracking-wider mb-3">Number of Staff</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['Just me', '2–5', '6–15', '15+'].map((opt) => (
                        <label key={opt} className={`relative flex items-center justify-center p-3 sm:py-4 rounded bg-[#161616] border transition-all duration-300 cursor-pointer min-h-[44px] ${formData.staff === opt ? 'border-[var(--color-tertiary)] text-[var(--color-tertiary)] bg-[rgba(249,115,22,0.05)]' : 'border-[rgba(255,255,255,0.05)] text-[var(--color-muted)] hover:border-[rgba(255,255,255,0.15)] hover:bg-[#1a1a1a]'}`}>
                          <input type="radio" value={opt} checked={formData.staff === opt} onChange={(e) => updateForm('staff', e.target.value)} className="sr-only" />
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
                  className="space-y-8"
                >
                  <div>
                    <label htmlFor="challenge" className="block font-mono text-xs text-[var(--color-muted)] uppercase tracking-wider mb-3">Biggest Challenge Right Now *</label>
                    <select id="challenge" aria-required="true" aria-describedby={errors.challenge ? "challenge-error" : undefined} className={`input-field min-h-[44px] appearance-none bg-no-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5YzlhOWEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSIvPjwvc3ZnPg==')] bg-[position:right_1rem_center] ${errors.challenge ? 'border-red-500/50 shadow-[0_0_0_1px_rgba(239,68,68,0.5)]' : ''}`} value={formData.challenge} onChange={(e) => updateForm('challenge', e.target.value)}>
                      <option value="" disabled className="text-black">Select an option...</option>
                      <option value="Missing too many calls" className="text-black">Missing too many calls</option>
                      <option value="Slow WhatsApp response" className="text-black">Slow WhatsApp response</option>
                      <option value="After-hours enquiries going cold" className="text-black">After-hours enquiries going cold</option>
                      <option value="Too much manual admin" className="text-black">Too much manual admin</option>
                      <option value="Poor lead follow-up" className="text-black">Poor lead follow-up</option>
                      <option value="Not enough new leads" className="text-black">Not enough new leads</option>
                      <option value="No system — doing it all manually" className="text-black">No system — doing it all manually</option>
                      <option value="Hard to track where leads come from" className="text-black">Hard to track where leads come from</option>
                    </select>
                    {errors.challenge && <p id="challenge-error" className="mt-2 text-xs text-red-400 animate-in fade-in slide-in-from-top-1">{errors.challenge}</p>}
                  </div>
                  <div>
                    <label htmlFor="leadSource" className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-wider mb-3 flex items-center gap-2 relative">
                      Biggest Source of New Leads *
                      <div className="group flex items-center">
                        <HelpCircle className="w-3.5 h-3.5 text-[var(--color-muted-dark)] hover:text-white transition-colors cursor-help" />
                        <div className="absolute bottom-full left-0 mb-2 w-48 sm:w-64 p-3 bg-[#222] text-[11px] leading-relaxed text-[var(--color-muted)] font-body normal-case tracking-normal rounded border border-[rgba(255,255,255,0.1)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                          e.g. word of mouth, local community groups (like Facebook community pages), Google My Business, or paid ads.
                        </div>
                      </div>
                    </label>
                    <select id="leadSource" aria-required="true" aria-describedby={errors.leadSource ? "leadSource-error" : undefined} className={`input-field min-h-[44px] appearance-none bg-no-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5YzlhOWEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSIvPjwvc3ZnPg==')] bg-[position:right_1rem_center] ${errors.leadSource ? 'border-red-500/50 shadow-[0_0_0_1px_rgba(239,68,68,0.5)]' : ''}`} value={formData.leadSource} onChange={(e) => updateForm('leadSource', e.target.value)}>
                      <option value="" disabled className="text-black">Select an option...</option>
                      <option value="Word of mouth / referrals" className="text-black">Word of mouth / referrals</option>
                      <option value="Google / website" className="text-black">Google / website</option>
                      <option value="Facebook / Instagram" className="text-black">Facebook / Instagram</option>
                      <option value="WhatsApp groups" className="text-black">WhatsApp groups</option>
                      <option value="Walk-ins / signage" className="text-black">Walk-ins / signage</option>
                      <option value="Gumtree / Marketplace" className="text-black">Gumtree / Marketplace</option>
                    </select>
                    {errors.leadSource && <p id="leadSource-error" className="mt-2 text-xs text-red-400 animate-in fade-in slide-in-from-top-1">{errors.leadSource}</p>}
                  </div>
                  <div>
                    <label htmlFor="responseMethod" className="block font-mono text-xs text-[var(--color-muted)] uppercase tracking-wider mb-3">How Do You Currently Handle Enquiries? *</label>
                    <select id="responseMethod" aria-required="true" aria-describedby={errors.responseMethod ? "responseMethod-error" : undefined} className={`input-field min-h-[44px] appearance-none bg-no-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5YzlhOWEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSIvPjwvc3ZnPg==')] bg-[position:right_1rem_center] ${errors.responseMethod ? 'border-red-500/50 shadow-[0_0_0_1px_rgba(239,68,68,0.5)]' : ''}`} value={formData.responseMethod} onChange={(e) => updateForm('responseMethod', e.target.value)}>
                      <option value="" disabled className="text-black">Select an option...</option>
                      <option value="Answer calls manually" className="text-black">Answer calls manually</option>
                      <option value="Reply to WhatsApp when I can" className="text-black">Reply to WhatsApp when I can</option>
                      <option value="Email when I remember" className="text-black">Email when I remember</option>
                      <option value="No system — I just wing it" className="text-black">No system — I just wing it</option>
                      <option value="I have someone who handles it" className="text-black">I have someone who handles it</option>
                      <option value="Mix of all of the above" className="text-black">Mix of all of the above</option>
                    </select>
                    {errors.responseMethod && <p id="responseMethod-error" className="mt-2 text-xs text-red-400 animate-in fade-in slide-in-from-top-1">{errors.responseMethod}</p>}
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-[var(--color-muted)] uppercase tracking-wider mb-3">Do You Miss Calls or WhatsApp Leads? *</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {['Yes — regularly', 'Sometimes', 'Rarely'].map((opt) => (
                        <label key={opt} className={`relative flex items-center justify-center p-3 sm:py-4 rounded bg-[#161616] border transition-all duration-300 cursor-pointer min-h-[44px] ${formData.missedCalls === opt ? 'border-[var(--color-tertiary)] text-[var(--color-tertiary)] bg-[rgba(249,115,22,0.05)]' : errors.missedCalls ? 'border-red-500/50' : 'border-[rgba(255,255,255,0.05)] text-[var(--color-muted)] hover:border-[rgba(255,255,255,0.15)] hover:bg-[#1a1a1a]'}`}>
                          <input type="radio" value={opt} checked={formData.missedCalls === opt} onChange={(e) => updateForm('missedCalls', e.target.value)} className="sr-only" />
                          <span className="font-body text-sm font-medium text-center">{opt}</span>
                        </label>
                      ))}
                    </div>
                    {errors.missedCalls && <p className="mt-2 text-xs text-red-400 animate-in fade-in slide-in-from-top-1">{errors.missedCalls}</p>}
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
                  className="space-y-8"
                >
                  <div>
                    <label htmlFor="phone" className="block font-mono text-xs text-[var(--color-muted)] uppercase tracking-wider mb-3">WhatsApp / Mobile Number *</label>
                    <input id="phone" aria-required="true" aria-describedby={errors.phone ? "phone-error" : undefined} type="tel" placeholder="e.g. 082 555 1234" className={`input-field min-h-[44px] ${errors.phone ? 'border-red-500/50 shadow-[0_0_0_1px_rgba(239,68,68,0.5)]' : ''}`} value={formData.phone} onChange={(e) => updateForm('phone', e.target.value)} />
                    {errors.phone && <p id="phone-error" className="mt-2 text-xs text-red-400 animate-in fade-in slide-in-from-top-1">{errors.phone}</p>}
                    {!errors.phone && <p className="mt-2 text-xs text-[var(--color-muted-dark)] font-body">We'll use this to confirm your audit slot via WhatsApp.</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-mono text-xs text-[var(--color-muted)] uppercase tracking-wider mb-3">Email Address *</label>
                    <input id="email" aria-required="true" aria-describedby={errors.email ? "email-error" : undefined} type="email" placeholder="your@email.co.za" className={`input-field min-h-[44px] ${errors.email ? 'border-red-500/50 shadow-[0_0_0_1px_rgba(239,68,68,0.5)]' : ''}`} value={formData.email} onChange={(e) => updateForm('email', e.target.value)} />
                    {errors.email && <p id="email-error" className="mt-2 text-xs text-red-400 animate-in fade-in slide-in-from-top-1">{errors.email}</p>}
                    <p className="mt-3 text-[11px] leading-relaxed text-[var(--color-muted-dark)] font-body">Your details stay private. We use this only to prepare your audit and confirm via WhatsApp. No spam. No selling your info. We're a small Cape Town business — we know how frustrating spam is.</p>
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
                  className="space-y-8"
                >
                  <div>
                    <label htmlFor="desiredOutcome" className="block font-mono text-xs text-[var(--color-muted)] uppercase tracking-wider mb-3">What's Your Desired Outcome? *</label>
                    <select id="desiredOutcome" aria-required="true" aria-describedby={errors.desiredOutcome ? "desiredOutcome-error" : undefined} className={`input-field min-h-[44px] appearance-none bg-no-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5YzlhOWEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSIvPjwvc3ZnPg==')] bg-[position:right_1rem_center] ${errors.desiredOutcome ? 'border-red-500/50 shadow-[0_0_0_1px_rgba(239,68,68,0.5)]' : ''}`} value={formData.desiredOutcome} onChange={(e) => updateForm('desiredOutcome', e.target.value)}>
                      <option value="" disabled className="text-black">Select an option...</option>
                      <option value="More leads per month" className="text-black">More leads per month</option>
                      <option value="Faster response to enquiries" className="text-black">Faster response to enquiries</option>
                      <option value="Less manual admin" className="text-black">Less manual admin</option>
                      <option value="Never miss a call again" className="text-black">Never miss a call again</option>
                      <option value="Work less, earn more" className="text-black">Work less, earn more</option>
                      <option value="Scale without hiring more staff" className="text-black">Scale without hiring more staff</option>
                      <option value="Understand where my leads come from" className="text-black">Understand where my leads come from</option>
                      <option value="All of the above" className="text-black">All of the above</option>
                    </select>
                    {errors.desiredOutcome && <p id="desiredOutcome-error" className="mt-2 text-xs text-red-400 animate-in fade-in slide-in-from-top-1">{errors.desiredOutcome}</p>}
                  </div>
                  <div>
                    <label htmlFor="preferredTime" className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-wider mb-3 flex items-center gap-2 relative">
                      Preferred Consultation Time *
                      <div className="group flex items-center">
                        <HelpCircle className="w-3.5 h-3.5 text-[var(--color-muted-dark)] hover:text-white transition-colors cursor-help" />
                        <div className="absolute bottom-full left-0 mb-2 w-48 sm:w-64 p-3 bg-[#222] text-[11px] leading-relaxed text-[var(--color-muted)] font-body normal-case tracking-normal rounded border border-[rgba(255,255,255,0.1)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                          We will confirm the exact time over WhatsApp shortly after you submit.
                        </div>
                      </div>
                    </label>
                    <select id="preferredTime" aria-required="true" aria-describedby={errors.preferredTime ? "preferredTime-error" : undefined} className={`input-field min-h-[44px] appearance-none bg-no-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5YzlhOWEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSIvPjwvc3ZnPg==')] bg-[position:right_1rem_center] ${errors.preferredTime ? 'border-red-500/50 shadow-[0_0_0_1px_rgba(239,68,68,0.5)]' : ''}`} value={formData.preferredTime} onChange={(e) => updateForm('preferredTime', e.target.value)}>
                      <option value="" disabled className="text-black">Select an option...</option>
                      <option value="Weekday morning (8am–12pm)" className="text-black">Weekday morning (8am–12pm)</option>
                      <option value="Weekday afternoon (1pm–5pm)" className="text-black">Weekday afternoon (1pm–5pm)</option>
                      <option value="Weekday evening (5pm–7pm)" className="text-black">Weekday evening (5pm–7pm)</option>
                      <option value="Saturday morning" className="text-black">Saturday morning</option>
                    </select>
                    {errors.preferredTime && <p id="preferredTime-error" className="mt-2 text-xs text-red-400 animate-in fade-in slide-in-from-top-1">{errors.preferredTime}</p>}
                  </div>
                  
                  {/* Your Audit Summary */}
                  <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] rounded p-6 mt-8">
                    <h4 className="font-mono text-xs text-white uppercase tracking-wider mb-4 pb-4 border-b border-[rgba(255,255,255,0.06)]">Your Audit Summary</h4>
                    <div className="space-y-3 font-body text-sm text-[var(--color-muted)]">
                      <div className="flex justify-between">
                        <span className="text-[var(--color-muted-dark)] pr-4">Business:</span>
                        <span className="text-white text-right max-w-[200px] sm:max-w-[300px] truncate">{formData.businessName || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-muted-dark)] pr-4">Type:</span>
                        <span className="text-white text-right max-w-[200px] sm:max-w-[300px] truncate">{formData.businessType || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-muted-dark)] pr-4">Location:</span>
                        <span className="text-white text-right max-w-[200px] sm:max-w-[300px] truncate">{formData.location || '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--color-muted-dark)] pr-4">Challenge:</span>
                        <span className="text-white text-right max-w-[200px] sm:max-w-[300px] truncate" title={formData.challenge}>{formData.challenge || '—'}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

              <div className="flex flex-col sm:flex-row gap-4 mt-12 pt-8 border-t border-[rgba(255,255,255,0.06)]">
                {step > 1 && (
                  <button type="button" onClick={prevStep} className="btn-secondary !w-full sm:!w-auto px-6 group order-2 sm:order-1">
                    <ArrowLeft strokeWidth={2} className="w-4 h-4 mr-2 md:group-hover:-translate-x-1 transition-transform" />
                    Back
                  </button>
                )}
                <SlidingTextButton type="submit" disabled={isSubmitting} className="!w-full sm:flex-1 px-6 group order-1 sm:order-2">
                  <span>
                    {isSubmitting ? "Processing..." : step === totalSteps ? "Submit & Book Audit" : "Next"}
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

              {Object.values(formData).some((v) => v !== "") && (
                <div className="mt-6 flex flex-col gap-4 items-center justify-center">
                  {errors.form && <p className="text-xs text-red-500">{errors.form}</p>}
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
                      className="text-[10px] flex items-center gap-1.5 font-mono text-[var(--color-muted-dark)] hover:text-white transition-colors uppercase tracking-widest underline decoration-[rgba(255,255,255,0.1)] hover:decoration-white underline-offset-4"
                    >
                      <Save className="w-3 h-3" />
                      Save & Finish Later
                    </button>
                    <button 
                      type="button" 
                      onClick={handleClearRestart} 
                      className="text-[10px] font-mono text-[var(--color-muted-dark)] hover:text-white transition-colors uppercase tracking-widest underline decoration-[rgba(255,255,255,0.1)] hover:decoration-white underline-offset-4"
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
