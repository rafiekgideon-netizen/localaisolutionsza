import { useEffect, useRef } from "react";
import { motion } from "motion/react";

export function ExpandedProofSection() {
  const cases = [
    { name: "Cape Town Plumber", before: "12 missed calls/week", after: "0 missed calls — AI answers 24/7" },
    { name: "Salon in Claremont", before: "4-hour WhatsApp response", after: "< 90s automated response" },
    { name: "Auto Dealership", before: "R0 after-hours capability", after: "R18k/month after-hours revenue" }
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
    <section className="section-padding bg-[var(--color-primary)] border-y border-[var(--color-border)] relative" ref={sectionRef}>
      <div className="absolute inset-0 bg-ethereal-glow pointer-events-none opacity-20" />
      <div className="container relative z-10">
        
        <div className="text-center mb-20 reveal-up">
          <div className="eyebrow-pill mb-6 mx-auto">IMPACT</div>
          <h2 className="font-display text-display-lg text-white">The Impact Is <span className="text-[var(--color-tertiary)]">Operational</span>.</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-24">
          {cases.map((c, i) => (
            <motion.div whileHover={{ scale: 1.02 }} key={i} className="ethereal-card-shell reveal-up" style={{ transitionDelay: `${i * 150}ms` }}>
              <div className="ethereal-card-core flex flex-col justify-center min-h-[260px] !bg-[rgba(11,11,11,0.5)] backdrop-blur-md">
                <h3 className="font-display text-2xl text-white mb-8 pb-6 border-b border-[rgba(255,255,255,0.06)]">{c.name}</h3>
                
                <div className="space-y-6">
                  <div className="group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-error)] opacity-50" />
                      <span className="font-mono text-xs text-[var(--color-muted-dark)] uppercase tracking-wider">Before LAIS</span>
                    </div>
                    <p className="font-body text-body-md text-[var(--color-muted)] md:group-hover:text-[var(--color-error)] transition-colors duration-300">{c.before}</p>
                  </div>
                  
                  <div className="group">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
                      <span className="font-mono text-xs text-[var(--color-neutral-soft)] uppercase tracking-wider">With LAIS</span>
                    </div>
                    <p className="font-body text-body-md text-[var(--color-success)] font-medium md:group-hover:text-[var(--color-tertiary)] transition-colors duration-300">{c.after}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          <div className="reveal-up" style={{ transitionDelay: '300ms' }}>
            <div className="flex items-start gap-4 mb-6">
              <span className="font-display text-6xl text-[rgba(249,115,22,0.2)] leading-none -mt-4">"</span>
              <p className="font-body text-body-lg text-[var(--color-neutral-soft)] italic leading-relaxed">We were losing 3 to 4 calls a day without even realising. LAIS set up an AI agent that captures every lead. Our bookings went up 40% in the first month.</p>
            </div>
            <div className="flex items-center gap-4 pl-12">
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=96&h=96" alt="Michael T." className="w-10 h-10 rounded-full object-cover border border-[rgba(255,255,255,0.1)] shrink-0" referrerPolicy="no-referrer" />
              <div>
                <div className="font-display text-lg text-white">Michael T.</div>
                <div className="font-body text-body-sm text-[var(--color-muted)]">Plumbing Business</div>
              </div>
            </div>
          </div>

          <div className="reveal-up" style={{ transitionDelay: '450ms' }}>
            <div className="flex items-start gap-4 mb-6">
              <span className="font-display text-6xl text-[rgba(249,115,22,0.2)] leading-none -mt-4">"</span>
              <p className="font-body text-body-lg text-[var(--color-neutral-soft)] italic leading-relaxed">The automated WhatsApp response changed everything. Clients get a reply in seconds, even on weekends. I have my life back.</p>
            </div>
            <div className="flex items-center gap-4 pl-12">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=96&h=96" alt="Sarah L." className="w-10 h-10 rounded-full object-cover border border-[rgba(255,255,255,0.1)] shrink-0" referrerPolicy="no-referrer" />
              <div>
                <div className="font-display text-lg text-white">Sarah L.</div>
                <div className="font-body text-body-sm text-[var(--color-muted)]">Salon Owner</div>
              </div>
            </div>
          </div>

          <div className="reveal-up" style={{ transitionDelay: '600ms' }}>
            <div className="flex items-start gap-4 mb-6">
              <span className="font-display text-6xl text-[rgba(249,115,22,0.2)] leading-none -mt-4">"</span>
              <p className="font-body text-body-lg text-[var(--color-neutral-soft)] italic leading-relaxed">I was spending 12 hours a week on admin. LAIS automated my quoting and scheduling. Now I spend that time on paying work.</p>
            </div>
            <div className="flex items-center gap-4 pl-12">
              <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=96&h=96" alt="David V." className="w-10 h-10 rounded-full object-cover border border-[rgba(255,255,255,0.1)] shrink-0" referrerPolicy="no-referrer" />
              <div>
                <div className="font-display text-lg text-white">David V.</div>
                <div className="font-body text-body-sm text-[var(--color-muted)]">Electrical Contractor</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
