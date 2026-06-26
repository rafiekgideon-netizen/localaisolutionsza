import { Menu, ArrowRight, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { SlidingTextButton } from "./ui/sliding-text-button";

interface NavbarProps {
  onOpenAudit?: () => void;
}

export function Navbar({ onOpenAudit }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleScroll();
    handleResize();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const topVal = scrolled ? (isMobile ? 12 : 16) : 24;
  const widthVal = scrolled ? "min(calc(100% - 2rem), 960px)" : "min(calc(100% - 2rem), 1200px)";
  const bgVal = scrolled ? "rgba(11, 11, 11, 0.9)" : "rgba(11, 11, 11, 0.2)";
  const borderVal = scrolled ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.02)";
  const shadowVal = scrolled ? "0px 10px 30px rgba(0, 0, 0, 0.8)" : "0px 0px 0px rgba(0, 0, 0, 0)";

  return (
    <>
      <motion.header
        animate={{
          top: topVal,
          width: widthVal,
          backgroundColor: bgVal,
          borderColor: borderVal,
          boxShadow: shadowVal,
        }}
        transition={{
          type: "spring",
          stiffness: 140,
          damping: 22,
          mass: 1,
        }}
        className="fixed left-1/2 -translate-x-1/2 z-50 flex items-center justify-between rounded-full py-3 px-6 backdrop-blur-2xl border"
      >
        <a href="#" id="navbar-logo-link" className="flex items-center text-white no-underline relative z-50">
          <motion.img 
            id="navbar-logo-img"
            src="/localai_logo_orange.svg" 
            alt="Local AI Solutions" 
            className="h-10 sm:h-12 w-auto object-contain"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          />
        </a>

        <nav className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 gap-10">
          <motion.a 
            href="#problems" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="font-body text-sm font-medium text-[var(--color-muted)] md:hover:text-white transition-colors duration-300"
          >
            Problems
          </motion.a>
          <motion.a 
            href="#solutions" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="font-body text-sm font-medium text-[var(--color-muted)] md:hover:text-white transition-colors duration-300"
          >
            Solutions
          </motion.a>
          <motion.a 
            href="#how-it-works" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="font-body text-sm font-medium text-[var(--color-muted)] md:hover:text-white transition-colors duration-300"
          >
            Process
          </motion.a>
        </nav>

        <div className="hidden md:flex items-center gap-4 relative z-50">
          <motion.a 
            href="https://wa.me/27682265793" 
            target="_blank" 
            rel="noreferrer" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full bg-[rgba(255,255,255,0.05)] md:hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.05)] flex items-center justify-center w-11 h-11 transition-all duration-300 group"
          >
            <WhatsAppIcon size={16} className="text-[var(--color-muted)] md:group-hover:text-[#25D366] transition-colors" />
          </motion.a>
          <SlidingTextButton 
            onClick={onOpenAudit}
          >
            Book Audit
          </SlidingTextButton>
        </div>

        <button
          className="md:hidden text-white relative z-50 w-12 h-12 flex flex-col justify-center items-center gap-[5px]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className={`w-5 h-[1.5px] bg-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileMenuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`}></span>
          <span className={`w-5 h-[1.5px] bg-white transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`w-5 h-[1.5px] bg-white transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileMenuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`}></span>
        </button>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-[rgba(5,5,5,0.95)] backdrop-blur-3xl transition-opacity duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-8 px-6">
          {["Problems", "Solutions", "How It Works", "Audit"].map((item, index) => {
            const id = item.toLowerCase().replace(/ /g, '-');
            return item === 'Audit' ? (
                  <button
                    key={item}
                    className={`font-display text-4xl text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] transform ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                    style={{ transitionDelay: `${index * 50 + 100}ms` }}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAudit?.();
                    }}
                  >
                    Book Audit
                  </button>
                ) : (
                  <a 
                    key={item}
                    href={`#${id}`}
                    className={`font-display text-4xl text-white transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] transform ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                    style={{ transitionDelay: `${index * 50 + 100}ms` }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                );
          })}
          
          <a 
            href="https://wa.me/27682265793"
            className={`mt-8 btn-whatsapp transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] transform ${mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'} flex items-center justify-center gap-2.5`}
            style={{ transitionDelay: '300ms' }}
          >
            <WhatsAppIcon size={20} className="text-black" /> Let's Chat
          </a>
        </div>
      </div>
    </>
  );
}
