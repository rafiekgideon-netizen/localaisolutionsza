import { useEffect, useRef } from "react";
import { motion } from "motion/react";

interface HowItWorksSectionProps {
  onOpenAudit?: () => void;
}

export function HowItWorksSection({ onOpenAudit }: HowItWorksSectionProps) {
  const steps = [
    { num: "01", label: "Provide Context", desc: "Complete a 2-minute diagnostic questionnaire about your operations." },
    { num: "02", label: "Schedule Audit", desc: "Secure a 30-minute strategic consultation. Zero obligation." },
    { num: "03", label: "WhatsApp Connect", desc: "We confirm logistics instantly on your preferred channel." },
    { num: "04", label: "Recovery Plan", desc: "Receive your tailored, executable revenue recovery roadmap." }
  ];

  const sectionRef = useRef<HTMLDivElement>(null);

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
    <section id="how-it-works" className="section-padding bg-[var(--color-primary-surface)] border-y border-[var(--color-border)] relative" ref={sectionRef}>
      <div className="absolute inset-0 bg-ethereal-glow pointer-events-none opacity-30" />
      <div className="container relative z-10">
        
        <div className="text-center mb-20 reveal-up">
          <div className="eyebrow-pill mb-6 mx-auto">THE PROCESS</div>
          <h2 className="font-display text-display-lg text-white">How to <span className="text-[var(--color-tertiary)]">recover your revenue</span>.</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div whileHover={{ scale: 1.02 }} key={i} className="ethereal-card-shell reveal-up" style={{ transitionDelay: `${i * 150}ms` }}>
              <div className="ethereal-card-core flex flex-col items-center text-center !p-10">
                <div className="w-16 h-16 rounded-full bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] flex items-center justify-center shrink-0 mb-8">
                  <span className="font-mono text-xl text-[var(--color-tertiary)]">{step.num}</span>
                </div>
                <div>
                  <h3 className="font-display text-2xl text-white mb-3 tracking-tight">{step.label}</h3>
                  <p className="font-body text-body-sm text-[var(--color-muted)]">{step.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-16 reveal-up" style={{ transitionDelay: '600ms' }}>
          <button onClick={onOpenAudit} className="btn-secondary group">
            Commence Diagnostic
          </button>
        </div>
      </div>
    </section>
  );
}
