import { Check, MapPin, Video, ShieldAlert } from "lucide-react";
import { motion } from "motion/react";
import { ScheduleSuccessInfo } from "../data/scheduleData";

interface ScheduleSuccessViewProps {
  successInfo: ScheduleSuccessInfo;
  onRestart: () => void;
  onCancel?: () => void;
}

export function ScheduleSuccessView({
  successInfo,
  onRestart,
  onCancel,
}: ScheduleSuccessViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-[#0a0a0a] border border-[rgba(255,255,255,0.06)] p-8 sm:p-12 rounded-3xl relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-ethereal-glow pointer-events-none opacity-20" />
      
      <div className="relative z-10 text-center max-w-2xl mx-auto flex flex-col items-center">
        
        <div className="w-20 h-20 rounded-full bg-[rgba(34,197,94,0.08)] border border-[rgba(34,197,94,0.25)] flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
          <Check className="w-10 h-10 text-[var(--color-success)]" strokeWidth={2.5} />
        </div>

        <span className="font-mono text-[10px] text-[var(--color-tertiary)] uppercase tracking-widest font-bold mb-2">Audit Transmission Secured</span>
        <h2 className="font-display text-3xl sm:text-4xl text-white mb-4">Consultation Registered.</h2>
        <p className="font-body text-sm text-[var(--color-muted)] mb-8 leading-relaxed">
          Strategic Revenue pre-audit sequence has successfully initialized and synchronized to active enterprise registries. Here are your diagnostic booking records:
        </p>

        {/* Data Summary Dashboard */}
        <div className="w-full bg-[#111] border border-[rgba(255,255,255,0.04)] rounded-2xl p-6 mb-8 text-left space-y-4">
          <h4 className="font-mono text-[10px] uppercase tracking-widest text-white border-b border-[rgba(255,255,255,0.05)] pb-3">Session Specification Grid</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-body">
            <div className="flex flex-col gap-1">
              <span className="text-[var(--color-muted-dark)] font-mono text-[10px] uppercase tracking-wider">Appointment Type</span>
              <span className="text-white font-medium">Strategic Revenue Consultation</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[var(--color-muted-dark)] font-mono text-[10px] uppercase tracking-wider">Date & Duration</span>
              <span className="text-white font-medium">{successInfo.formattedDate} (30 mins)</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[var(--color-muted-dark)] font-mono text-[10px] uppercase tracking-wider">Exact Start Time (SAST)</span>
              <span className="text-[var(--color-tertiary)] font-bold">{successInfo.formattedTime}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[var(--color-muted-dark)] font-mono text-[10px] uppercase tracking-wider">Integration Status</span>
              <span className={`inline-flex items-center gap-1.5 ${successInfo.status === 'booked' ? 'text-[var(--color-success)]' : 'text-orange-400'}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${successInfo.status === 'booked' ? 'bg-[var(--color-success)]' : 'bg-orange-400'}`} />
                {successInfo.status === 'booked' ? 'Google Calendar Confirmed' : 'Offline Simulated Slot Enqueued'}
              </span>
            </div>

            {successInfo.locationType === 'Meet' ? (
              <div className="flex flex-col gap-1 sm:col-span-2 pt-2 border-t border-[rgba(255,255,255,0.03)]">
                <span className="text-[var(--color-muted-dark)] font-mono text-[10px] uppercase tracking-wider">Google Meet Link (Secure Space)</span>
                <a 
                  href={successInfo.meetUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-[var(--color-tertiary)] hover:underline flex items-center gap-1 font-mono break-all text-[11px] mt-0.5"
                >
                  <Video className="w-3.5 h-3.5 shrink-0" />
                  <span>{successInfo.meetUrl}</span>
                </a>
              </div>
            ) : (
              <div className="flex flex-col gap-1 sm:col-span-2 pt-2 border-t border-[rgba(255,255,255,0.03)]">
                <span className="text-[var(--color-muted-dark)] font-mono text-[10px] uppercase tracking-wider">Dispatch Site Address</span>
                <span className="text-white flex items-center gap-1.5 mt-0.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[var(--color-tertiary)] shrink-0" />
                  <span>{successInfo.physicalAddress}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Protocol info */}
        <div className="p-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.04)] rounded-xl text-left text-xs text-[var(--color-muted)] mb-8 leading-relaxed flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-[var(--color-tertiary)] shrink-0 mt-0.5" />
          <div>
            <span className="block text-white font-semibold mb-1">WhatsApp confirmation queued (T+0s Flow):</span>
            Our automated outreach protocol triggers instant status signals to <span className="text-white font-bold">{successInfo.phone}</span>. Please verify your messaging app is active to receive pre-audit guidelines.
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            type="button"
            onClick={onRestart}
            className="flex items-center gap-2 px-6 py-3 bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] hover:border-white text-white text-xs font-mono uppercase tracking-widest transition-all duration-300 pointer-events-auto cursor-pointer"
          >
            <span>Book Another Audit</span>
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex items-center gap-2 px-6 py-3 bg-[rgba(249,115,22,0.1)] hover:bg-[rgba(249,115,22,0.18)] border border-[rgba(249,115,22,0.25)] hover:border-[var(--color-tertiary)] text-[var(--color-tertiary)] hover:text-white text-xs font-mono uppercase tracking-widest transition-all duration-300 pointer-events-auto cursor-pointer"
            >
              <span>Return to Dashboard</span>
            </button>
          )}
        </div>

      </div>
    </motion.div>
  );
}
