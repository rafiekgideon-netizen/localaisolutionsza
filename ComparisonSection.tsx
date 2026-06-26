import { XCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

export function ComparisonSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const items = [
    { old: "Missed calls after 5pm", new: "24/7 AI agent answers every call" },
    { old: "Reply to WhatsApp 4 hours later", new: "Instant automated response in < 60 seconds" },
    { old: "Manual quoting takes 2 hours", new: "Automated quote sent in 3 minutes" },
    { old: "Leads in a notebook", new: "Every lead tracked, scored, and followed up" },
    { old: "Admin eats your weekends", new: "Workflows handle admin while you work" },
    { old: "Hope-based follow-up", new: "Automated 3-touch follow-up sequence" }
  ];

  return (
    <section id="comparison" className="section-padding bg-[var(--color-primary)] relative" ref={sectionRef}>
      <div className="container relative z-10">
        
        <div className={`text-center mb-20 transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] ${isVisible ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-12 opacity-0 blur-md'}`}>
          <div className="eyebrow-pill mb-6">THE DIFFERENCE</div>
          <h2 className="font-display text-display-lg text-white">
            The old way costs you.<br/> The LAIS way <span className="text-[var(--color-tertiary)]">recovers it.</span>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0 max-w-6xl mx-auto">
          {/* Old Way */}
          <motion.div whileHover={{ scale: 1.02 }} className={`ethereal-card-shell w-full md:w-1/2 md:translate-x-4 md:rotate-[-1deg] transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] z-10 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'} md:hover:z-30 md:hover:rotate-0 md:hover:-translate-y-2`}>
            <div className="ethereal-card-core !bg-[rgba(11,11,11,0.9)] !p-8 md:!p-12 min-h-[500px]">
              <div className="flex items-center gap-4 border-b border-[rgba(255,255,255,0.06)] pb-6 mb-8">
                <div className="w-12 h-12 rounded-full bg-[rgba(211,47,47,0.1)] flex items-center justify-center">
                  <XCircle strokeWidth={1} className="w-6 h-6 text-[var(--color-error)]" />
                </div>
                <h3 className="font-display text-3xl text-white">The Old Way</h3>
              </div>
              <ul className="space-y-6">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-error)] shrink-0 mt-2 opacity-50" />
                    <span className="text-body-md text-[var(--color-muted)]">{item.old}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
          
          {/* LAIS Way */}
          <motion.div whileHover={{ scale: 1.02 }} className={`ethereal-card-shell w-full md:w-1/2 md:-translate-x-4 md:rotate-[2deg] transition-all duration-1000 delay-150 ease-[cubic-bezier(0.32,0.72,0,1)] z-20 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'} md:hover:z-30 md:hover:rotate-0 md:hover:-translate-y-2`}>
            <div className="ethereal-card-core !bg-gradient-to-br from-[rgba(11,11,11,0.95)] to-[rgba(249,115,22,0.1)] backdrop-blur-2xl !p-8 md:!p-12 min-h-[500px] shadow-2xl">
              <div className="flex items-center gap-4 border-b border-[rgba(255,255,255,0.1)] pb-6 mb-8">
                <div className="w-12 h-12 rounded-full bg-[rgba(34,197,94,0.1)] flex items-center justify-center">
                  <CheckCircle2 strokeWidth={1} className="w-6 h-6 text-[var(--color-success)]" />
                </div>
                <h3 className="font-display text-3xl text-white">The LAIS Way</h3>
              </div>
              <ul className="space-y-6">
                {items.map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <CheckCircle2 strokeWidth={1.5} className="w-5 h-5 text-[var(--color-tertiary)] shrink-0 mt-0.5" />
                    <span className="text-body-md text-white font-medium">{item.new}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
