import { Copy, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { WhatsAppIcon } from "./WhatsAppIcon";

export function WhatsAppSection() {
  const message = encodeURIComponent("Hi, I'm interested in the Free AI Strategy Audit. Can you help me get started?");
  const waLink = `https://wa.me/27682265793?text=${message}`;
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(waLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch((err) => {
      console.error("Clipboard copy failed: ", err);
    });
  };

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
    <section className="section-padding bg-[var(--color-primary-surface)] border-y border-[var(--color-border)] relative" ref={sectionRef}>
      <div className="absolute inset-0 bg-ethereal-glow pointer-events-none opacity-20" />
      <div className="absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-[600px] h-[600px] bg-[rgba(34,197,94,0.03)] blur-[100px] rounded-full pointer-events-none" />
      
      <div className="container max-w-3xl text-center relative z-10 reveal-up">
        <div className="w-20 h-20 rounded-full bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.2)] flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
          <WhatsAppIcon colored={true} size={50} />
        </div>
        <h2 className="font-display text-display-lg text-white mb-6">Prefer WhatsApp? So do we.</h2>
        <p className="font-body text-body-lg text-[var(--color-muted)] mb-10 max-w-2xl mx-auto">
          Most modern businesses run on WhatsApp. So does our support matrix. Skip the async emails and speak with our integration team instantly.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={waLink} target="_blank" rel="noreferrer" className="btn-whatsapp group inline-flex items-center gap-2.5 justify-center w-full sm:w-auto">
            <WhatsAppIcon size={18} className="text-black md:group-hover:scale-110 transition-transform" />
            Chat on WhatsApp
          </a>
          <button 
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] hover:border-[var(--color-tertiary)] text-white text-sm font-semibold rounded-full cursor-pointer transition-all duration-300 md:hover:scale-[1.03] active:scale-[0.97] focus:outline-none focus:ring-2 focus:ring-[var(--color-tertiary)]/50 font-sans w-full sm:w-auto"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-[var(--color-success)] animate-pulse" strokeWidth={2.5} />
                <span className="text-[var(--color-success)] font-medium">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[var(--color-muted)]" strokeWidth={2} />
                <span>Copy WhatsApp Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
