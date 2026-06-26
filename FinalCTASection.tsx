import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { SlidingTextButton } from "./ui/sliding-text-button";

interface FinalCTASectionProps {
  onOpenAudit?: () => void;
}

export function FinalCTASection({ onOpenAudit }: FinalCTASectionProps) {
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
    <section id="audit" className="section-padding bg-[var(--color-primary-surface)] relative overflow-hidden" ref={sectionRef}>
      <div className="absolute inset-0 bg-ethereal-glow pointer-events-none opacity-50" />
      <div className="absolute right-0 bottom-0 w-[800px] h-[800px] bg-[var(--color-tertiary)] opacity-[0.02] blur-[150px] rounded-full pointer-events-none" />

      <div className="container relative z-10 text-center reveal-up">
        <div className="max-w-4xl mx-auto">
          <div className="eyebrow-pill mb-8 mx-auto">INITIATE</div>
          <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] text-white mb-8 leading-tight">
            Book your free AI Strategy Audit.<br/>Identify the leaks. <span className="text-[var(--color-tertiary)]">Recover the revenue.</span>
          </h2>
          <p className="font-body text-body-lg text-[var(--color-muted)] mb-12 max-w-2xl mx-auto">
            30 minutes. No obligation. No jargon. Just a clear, costed plan to stop losing revenue and start recovering it.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <SlidingTextButton onClick={onOpenAudit} className="w-full sm:w-auto">
              Book Free Audit
              <div className="flex items-center justify-center bg-[rgba(0,0,0,0.1)] rounded-full w-8 h-8 ml-2">
                <ArrowRight strokeWidth={2.5} className="w-4 h-4 text-[#050505]" />
              </div>
            </SlidingTextButton>
            <a href="https://wa.me/27682265793" target="_blank" rel="noreferrer" className="btn-secondary w-full sm:w-auto group flex items-center justify-center gap-2.5">
              <WhatsAppIcon size={20} colored={true} className="md:group-hover:scale-110 transition-transform" /> 
              Connect via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
