import { useEffect, useRef } from "react";

export function TrustBar() {
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
    <section className="bg-[var(--color-primary-surface)] py-16 relative" ref={sectionRef}>
      <div className="absolute inset-0 bg-ethereal-glow pointer-events-none opacity-20" />
      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-4 text-center">
          <div className="flex flex-col items-center reveal-up" style={{ transitionDelay: '100ms' }}>
            <span className="font-display text-5xl md:text-6xl text-[var(--color-tertiary)] tracking-tight mb-3">40+</span>
            <span className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-[0.2em] font-medium">Local Businesses Served</span>
          </div>
          <div className="flex flex-col items-center reveal-up" style={{ transitionDelay: '250ms' }}>
            <span className="font-display text-5xl md:text-6xl text-white tracking-tight mb-3">&lt; 60s</span>
            <span className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-[0.2em] font-medium">Average Response Time</span>
          </div>
          <div className="flex flex-col items-center reveal-up" style={{ transitionDelay: '400ms' }}>
            <span className="font-display text-5xl md:text-6xl text-white tracking-tight mb-3">R2.4M+</span>
            <span className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-[0.2em] font-medium">Revenue Recovered</span>
          </div>
        </div>
      </div>
    </section>
  );
}
