import { useEffect } from "react";
import { ArrowRight, CheckCircle2, Sparkles, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { SlidingTextButton } from "./ui/sliding-text-button";
import { fireAuditCelebrationConfetti } from "../utils/confetti";

interface QuestionnaireSuccessViewProps {
  onClose: () => void;
}

export function QuestionnaireSuccessView({ onClose }: QuestionnaireSuccessViewProps) {
  useEffect(() => {
    // Fire celebratory confetti upon mounting the success view
    fireAuditCelebrationConfetti();
  }, []);

  const handleProceed = () => {
    onClose();
    const auditEl = document.getElementById("audit");
    if (auditEl) {
      auditEl.scrollIntoView({ behavior: "smooth" });
    } else {
      window.location.hash = "audit";
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.94 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="text-center items-center flex flex-col py-8 sm:py-12 relative overflow-hidden"
    >
      {/* Ambient celebration glow ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Success Badge & Animated Rings */}
      <div className="relative mb-8">
        <motion.div 
          animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.05, 0.3] }} 
          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-emerald-500/20 blur-md pointer-events-none"
        />
        <motion.div 
          initial={{ scale: 0.5, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 350, damping: 20 }}
          className="relative w-24 h-24 rounded-full bg-[rgba(16,185,129,0.12)] border border-[rgba(16,185,129,0.3)] flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.2)]"
        >
          <CheckCircle2 strokeWidth={1.75} className="w-12 h-12 text-[var(--color-success)]" />
        </motion.div>

        {/* Little decorative celebratory sparkle */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-[var(--color-tertiary)] flex items-center justify-center text-black shadow-md"
        >
          <Sparkles className="w-4 h-4" />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs uppercase tracking-wider mb-4">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          Transmission Successful & Verified
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl text-white mb-4 tracking-tight">
          Signals Received.
        </h2>
        <p className="font-body text-base sm:text-lg text-[var(--color-muted)] mb-8 max-w-lg mx-auto leading-relaxed">
          Your diagnostic parameters have been securely stored. Our team is generating your tailored revenue recovery architecture for your strategy call.
        </p>
      </motion.div>

      {/* Next steps informational pill */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="w-full max-w-md bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-2xl p-5 mb-8 text-left"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-[var(--color-tertiary)]/10 border border-[var(--color-tertiary)]/20 flex items-center justify-center shrink-0 mt-0.5">
            <Calendar className="w-5 h-5 text-[var(--color-tertiary)]" />
          </div>
          <div>
            <h4 className="font-mono text-xs text-white uppercase tracking-wider font-semibold mb-1">
              Next Step: Select Your Time Window
            </h4>
            <p className="text-xs text-[var(--color-muted)] font-body leading-relaxed">
              Lock in your exact 30-minute diagnostic slot on our interactive schedule matrix to review your personalized leak audit.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
        <SlidingTextButton 
          onClick={handleProceed}
          className="w-full sm:flex-1 !justify-between cursor-pointer"
        >
          Proceed to Scheduling
          <div className="flex items-center justify-center bg-[rgba(0,0,0,0.1)] rounded-full w-8 h-8 ml-2">
            <ArrowRight strokeWidth={2.5} className="w-4 h-4 text-[#050505]" />
          </div>
        </SlidingTextButton>

        <button
          type="button"
          onClick={() => fireAuditCelebrationConfetti()}
          className="text-xs font-mono text-[var(--color-muted)] hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/5 cursor-pointer flex items-center gap-1.5"
          title="Trigger celebratory confetti burst"
        >
          <Sparkles className="w-3.5 h-3.5 text-[var(--color-tertiary)]" />
          <span>Replay Confetti</span>
        </button>
      </div>

      <div className="mt-6 flex items-center gap-3 text-[10px] font-mono text-[var(--color-muted-dark)] uppercase tracking-wider">
        <span>Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">Enter</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-white">Esc</kbd> to proceed</span>
      </div>
    </motion.div>
  );
}

