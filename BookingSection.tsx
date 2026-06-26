import { Calendar } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { InteractiveScheduleMatrix } from "./InteractiveScheduleMatrix";
import { motion } from "motion/react";

export function BookingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll('.reveal-up');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="audit" className="section-padding bg-[var(--color-primary)] relative" ref={sectionRef}>
      <div className="absolute inset-0 bg-ethereal-glow pointer-events-none opacity-20" />
      <div className="container max-w-6xl relative z-10 animate-in fade-in-50 duration-500">
        <div className="mb-16 reveal-up">
          <div className="eyebrow-pill mb-6">THE AUDIT</div>
          <h2 className="font-display text-display-lg text-white mb-4">Secure your free strategy session.</h2>
          <p className="font-body text-body-lg text-[var(--color-muted)] max-w-xl">30 minutes. No jargon. No pressure. Just clarity on your operations.</p>
        </div>

        <div className={`grid grid-cols-1 ${isInitialized ? 'lg:grid-cols-1' : 'lg:grid-cols-2'} gap-16 items-start transition-all duration-500`}>
          {!isInitialized && (
            <div className="reveal-up" style={{ transitionDelay: '100ms' }}>
              <h3 className="font-display text-3xl text-white mb-8 tracking-tight">Diagnostic Protocol:</h3>
              <ul className="space-y-8">
                <li className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center shrink-0 md:group-hover:bg-[rgba(249,115,22,0.1)] md:group-hover:border-[rgba(249,115,22,0.2)] transition-colors duration-500">
                    <span className="font-mono text-sm text-[var(--color-tertiary)]">01/</span>
                  </div>
                  <div className="pt-2">
                    <h4 className="font-display text-xl text-white mb-2">Metrics Review</h4>
                    <p className="font-body text-body-sm text-[var(--color-muted)]">We evaluate current response latency and identify primary revenue leaks.</p>
                  </div>
                </li>
                <li className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center shrink-0 md:group-hover:bg-[rgba(249,115,22,0.1)] md:group-hover:border-[rgba(249,115,22,0.2)] transition-colors duration-500">
                    <span className="font-mono text-sm text-[var(--color-tertiary)]">02/</span>
                  </div>
                  <div className="pt-2">
                    <h4 className="font-display text-xl text-white mb-2">Automation Surface</h4>
                    <p className="font-body text-body-sm text-[var(--color-muted)]">We target optimal integration vectors for instant ROI.</p>
                  </div>
                </li>
                <li className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center shrink-0 md:group-hover:bg-[rgba(249,115,22,0.1)] md:group-hover:border-[rgba(249,115,22,0.2)] transition-colors duration-500">
                    <span className="font-mono text-sm text-[var(--color-tertiary)]">03/</span>
                  </div>
                  <div className="pt-2">
                    <h4 className="font-display text-xl text-white mb-2">Recovery Blueprint</h4>
                    <p className="font-body text-body-sm text-[var(--color-muted)]">We deliver a deterministic, costed roadmap for your enterprise.</p>
                  </div>
                </li>
                <li className="flex items-start gap-6 group">
                  <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center shrink-0 md:group-hover:bg-[rgba(249,115,22,0.1)] md:group-hover:border-[rgba(249,115,22,0.2)] transition-colors duration-500">
                    <span className="font-mono text-sm text-[var(--color-tertiary)]">04/</span>
                  </div>
                  <div className="pt-2">
                    <h4 className="font-display text-xl text-white mb-2">Proceed Autonomously</h4>
                    <p className="font-body text-body-sm text-[var(--color-muted)]">Zero obligation matrix. Proceed only when the economics make sense.</p>
                  </div>
                </li>
              </ul>
            </div>
          )}

          <motion.div whileHover={{ scale: 1.02 }} className={`ethereal-card-shell reveal-up w-full ${isInitialized ? 'lg:col-span-1 border-[var(--color-border)]' : ''}`} style={{ transitionDelay: '300ms' }}>
            <div className={`ethereal-card-core flex items-center justify-center p-6 sm:p-8 md:p-12 !bg-[rgba(11,11,11,0.6)] backdrop-blur-md rounded-2xl ${isInitialized ? 'min-h-[600px]' : 'min-h-[500px]'}`}>
              {isInitialized ? (
                <InteractiveScheduleMatrix onCancel={() => setIsInitialized(false)} />
              ) : (
                <div className="text-center w-full max-w-sm">
                  <div className="w-20 h-20 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(255,255,255,0.02)]">
                    <Calendar className="w-8 h-8 text-[var(--color-tertiary)]" strokeWidth={1.5} />
                  </div>
                  <div className="eyebrow-pill mb-4">COMPLIMENTARY AI DIAGNOSTICS</div>
                  <h4 className="font-display text-2xl text-white mb-4">Interactive Strategy Scheduler</h4>
                  <p className="font-body text-body-sm text-[var(--color-muted)] mb-10 leading-relaxed">
                    Stop letting manual friction bleed your bottom line. Reserve a direct, 30-minute diagnostic session with our lead architects to detect bottlenecks, optimize latency, and map your complete conversion blueprint. 100% free. No commitments.
                  </p>
                  <button onClick={() => setIsInitialized(true)} className="btn-secondary w-full cursor-pointer">
                    Book Consultation
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
