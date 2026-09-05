import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { SlidingTextButton } from "./ui/sliding-text-button";
import { ThemeToggle } from "./ui/ThemeToggle";
import { useTheme } from "../context/ThemeContext";

interface NavbarProps {
  onOpenAudit?: () => void;
}

export function Navbar({ onOpenAudit }: NavbarProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    handleScroll();
    handleResize();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  const topVal = scrolled ? (isMobile ? 12 : 16) : 24;
  const widthVal = scrolled ? "min(calc(100% - 2rem), 960px)" : "min(calc(100% - 2rem), 1200px)";
  const bgVal = scrolled 
    ? (isLight ? "rgba(255, 255, 255, 0.92)" : "rgba(11, 11, 11, 0.9)") 
    : (isLight ? "rgba(255, 255, 255, 0.78)" : "rgba(11, 11, 11, 0.2)");
  const borderVal = scrolled 
    ? (isLight ? "rgba(15, 23, 42, 0.1)" : "rgba(255, 255, 255, 0.08)") 
    : (isLight ? "rgba(15, 23, 42, 0.05)" : "rgba(255, 255, 255, 0.02)");
  const shadowVal = scrolled 
    ? (isLight ? "0px 10px 30px rgba(15, 23, 42, 0.08)" : "0px 10px 30px rgba(0, 0, 0, 0.8)") 
    : "0px 0px 0px rgba(0, 0, 0, 0)";

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
        className="fixed left-1/2 -translate-x-1/2 z-50 flex items-center justify-between rounded-full py-2.5 sm:py-3 px-4 sm:px-6 backdrop-blur-2xl border"
      >
        <a href="#home" id="navbar-logo-link" aria-label="Local AI Solutions Home" className="flex items-center text-white no-underline relative z-50">
          <motion.img 
            id="navbar-logo-img"
            src="/localai_logo_orange.svg" 
            alt="Local AI Solutions" 
            className="h-9 sm:h-11 md:h-12 w-auto object-contain"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          />
        </a>

        <nav className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 gap-10" aria-label="Primary Navigation">
          <motion.a 
            href="#problems" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="font-body text-sm font-medium text-[var(--color-muted)] hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
          >
            Problems
          </motion.a>
          <motion.a 
            href="#solutions" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="font-body text-sm font-medium text-[var(--color-muted)] hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
          >
            Solutions
          </motion.a>
          <motion.a 
            href="#how-it-works" 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="font-body text-sm font-medium text-[var(--color-muted)] hover:text-slate-900 dark:hover:text-white transition-colors duration-300"
          >
            Process
          </motion.a>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3 relative z-50">
          <ThemeToggle 
            variant="compact" 
            id="navbar-desktop-theme-toggle" 
          />
          <motion.a 
            href="https://wa.me/27682265793" 
            target="_blank" 
            rel="noreferrer" 
            aria-label="Connect with Local AI Solutions on WhatsApp"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 flex items-center justify-center w-11 h-11 transition-all duration-300 group"
          >
            <WhatsAppIcon size={16} className="text-[var(--color-muted)] md:group-hover:text-[#25D366] transition-colors" />
          </motion.a>
          <SlidingTextButton 
            onClick={onOpenAudit}
          >
            Book Audit
          </SlidingTextButton>
        </div>

        {/* Mobile Actions: Immediate Theme Toggle + Accessible Menu Hamburger */}
        <div className="flex md:hidden items-center gap-2 relative z-50">
          <ThemeToggle 
            variant="compact" 
            id="navbar-mobile-header-toggle" 
          />
          <button
            type="button"
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav-drawer"
            className="w-11 h-11 flex flex-col justify-center items-center gap-[5px] rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-tertiary)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className={`w-5 h-[1.5px] ${isLight ? 'bg-slate-900' : 'bg-white'} transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileMenuOpen ? 'rotate-45 translate-y-[6.5px]' : ''}`}></span>
            <span className={`w-5 h-[1.5px] ${isLight ? 'bg-slate-900' : 'bg-white'} transition-opacity duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`w-5 h-[1.5px] ${isLight ? 'bg-slate-900' : 'bg-white'} transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${mobileMenuOpen ? '-rotate-45 -translate-y-[6.5px]' : ''}`}></span>
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay with Accessible Theme Segmented Toggle */}
      <div 
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
        className={`fixed inset-0 z-40 ${
          isLight 
            ? "bg-slate-50/98 text-slate-900" 
            : "bg-[rgba(5,5,5,0.98)] text-white"
        } backdrop-blur-3xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-full gap-7 px-6 max-w-sm mx-auto">
          {/* Navigation Links */}
          {["Problems", "Solutions", "How It Works", "Audit"].map((item, index) => {
            const id = item.toLowerCase().replace(/ /g, '-');
            return item === 'Audit' ? (
              <button
                key={item}
                className={`font-display text-3xl sm:text-4xl ${
                  isLight ? "text-slate-900 hover:text-[var(--color-tertiary)]" : "text-white hover:text-[var(--color-tertiary)]"
                } font-bold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] transform cursor-pointer ${
                  mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 40 + 80}ms` }}
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
                className={`font-display text-3xl sm:text-4xl ${
                  isLight ? "text-slate-900 hover:text-[var(--color-tertiary)]" : "text-white hover:text-[var(--color-tertiary)]"
                } font-bold transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] transform ${
                  mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: `${index * 40 + 80}ms` }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item}
              </a>
            );
          })}

          {/* Accessible Light / Dark Mode Toggle Block inside Mobile Nav Menu */}
          <div 
            className={`w-full pt-4 border-t ${
              isLight ? "border-slate-200" : "border-white/10"
            } flex flex-col items-center gap-2.5 transition-all duration-500 transform ${
              mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}
            style={{ transitionDelay: '260ms' }}
          >
            <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--color-muted)] font-semibold">
              Appearance
            </span>
            <ThemeToggle 
              variant="segmented" 
              id="navbar-mobile-menu-theme-toggle" 
            />
          </div>
          
          {/* WhatsApp Chat Link */}
          <a 
            href="https://wa.me/27682265793"
            target="_blank"
            rel="noreferrer"
            className={`w-full max-w-xs btn-whatsapp transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] transform ${
              mobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            } flex items-center justify-center gap-2.5`}
            style={{ transitionDelay: '320ms' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <WhatsAppIcon size={20} className="text-black" /> Let's Chat
          </a>
        </div>
      </div>
    </>
  );
}
