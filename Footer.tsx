import { WhatsAppIcon } from "./WhatsAppIcon";

export function Footer() {
  return (
    <footer className="bg-[var(--color-primary)] py-20 relative border-t border-[rgba(255,255,255,0.06)]">
      <div className="absolute inset-0 bg-ethereal-glow pointer-events-none opacity-20" />
      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          <div className="md:col-span-1">
            <a href="#" className="flex items-center text-white no-underline mb-6">
              <img 
                src="/localai_logo_orange.svg" 
                alt="Local AI Solutions" 
                className="h-12 w-auto object-contain"
              />
            </a>
            <p className="font-body text-body-md text-[var(--color-muted)] max-w-sm leading-relaxed">
              We don't sell AI. We recover revenue. 
              Cape Town-based automation agency building 24/7 systems that work while you sleep.
            </p>
          </div>
          
          <div>
            <h4 className="font-mono text-xs text-[var(--color-muted-dark)] uppercase mb-6 tracking-widest">Connect</h4>
            <ul className="space-y-2">
              <li><a href="https://wa.me/27682265793" className="block font-body text-sm py-3 text-[var(--color-neutral-soft)] transition-colors md:hover:text-[var(--color-tertiary)]">0682265793</a></li>
              <li><a href="mailto:hello@localaisolutions.co.za" className="block font-body text-sm py-3 text-[var(--color-neutral-soft)] transition-colors md:hover:text-[var(--color-tertiary)]">hello@localaisolutions.co.za</a></li>
              <li className="font-body text-sm text-[var(--color-muted-dark)] py-3">Cape Town, Western Cape<br/>South Africa</li>
            </ul>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="font-mono text-xs text-[var(--color-muted-dark)] uppercase mb-6 tracking-widest">Navigation</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
              <ul className="space-y-1">
                <li><a href="#home" className="block font-body text-sm py-2 text-[var(--color-neutral-soft)] transition-colors md:hover:text-[var(--color-tertiary)] hover:translate-x-0.5 transition-transform duration-200">Home</a></li>
                <li><a href="#industries" className="block font-body text-sm py-2 text-[var(--color-neutral-soft)] transition-colors md:hover:text-[var(--color-tertiary)] hover:translate-x-0.5 transition-transform duration-200">Sector Focus</a></li>
                <li><a href="#problems" className="block font-body text-sm py-2 text-[var(--color-neutral-soft)] transition-colors md:hover:text-[var(--color-tertiary)] hover:translate-x-0.5 transition-transform duration-200">Revenue Leaks</a></li>
                <li><a href="#solutions" className="block font-body text-sm py-2 text-[var(--color-neutral-soft)] transition-colors md:hover:text-[var(--color-tertiary)] hover:translate-x-0.5 transition-transform duration-200">Our Systems</a></li>
                <li><a href="#comparison" className="block font-body text-sm py-2 text-[var(--color-neutral-soft)] transition-colors md:hover:text-[var(--color-tertiary)] hover:translate-x-0.5 transition-transform duration-200">The Old Way vs LAIS</a></li>
              </ul>
              <ul className="space-y-1">
                <li><a href="#how-it-works" className="block font-body text-sm py-2 text-[var(--color-neutral-soft)] transition-colors md:hover:text-[var(--color-tertiary)] hover:translate-x-0.5 transition-transform duration-200">Our Process</a></li>
                <li><a href="#calculator" className="block font-body text-sm py-2 text-[var(--color-neutral-soft)] transition-colors md:hover:text-[var(--color-tertiary)] hover:translate-x-0.5 transition-transform duration-200">ROI Calculator</a></li>
                <li><a href="#testimonials" className="block font-body text-sm py-2 text-[var(--color-neutral-soft)] transition-colors md:hover:text-[var(--color-tertiary)] hover:translate-x-0.5 transition-transform duration-200">Contractor Reviews</a></li>
                <li><a href="#faq" className="block font-body text-sm py-2 text-[var(--color-neutral-soft)] transition-colors md:hover:text-[var(--color-tertiary)] hover:translate-x-0.5 transition-transform duration-200 font-medium">Support FAQs</a></li>
                <li><a href="#audit" className="block font-body text-sm py-2 text-[var(--color-neutral-soft)] transition-colors md:hover:text-[var(--color-tertiary)] hover:translate-x-0.5 transition-transform duration-200 font-semibold text-[var(--color-tertiary)]">Book Free Audit</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-[rgba(255,255,255,0.06)] flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-mono text-xs text-[var(--color-muted-dark)] uppercase tracking-wider">
            &copy; {new Date().getFullYear()} Local AI Solutions.
          </p>
          <a href="https://wa.me/27682265793" className="btn-whatsapp !px-6 !py-3 !text-xs group flex items-center gap-1.5 font-sans font-semibold transition-all">
            <WhatsAppIcon size={14} className="text-black transition-all duration-300 ease-out md:group-hover:scale-125 md:group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.5)]" /> Connect on WhatsApp
          </a>
        </div>


      </div>
    </footer>
  );
}
