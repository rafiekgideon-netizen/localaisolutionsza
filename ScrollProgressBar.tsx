import { useEffect, useState } from "react";

export function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (scrollHeight > 0) {
        const scrolled = (window.scrollY / scrollHeight) * 100;
        setScrollProgress(scrolled);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger once on mount
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 right-0 h-[3px] bg-white/5 z-[9999] pointer-events-none origin-left"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={scrollProgress}
    >
      <div 
        className="h-full bg-gradient-to-r from-[var(--color-tertiary)] via-[rgba(249,115,22,0.9)] to-[var(--color-tertiary)] transition-all duration-75 ease-out relative"
        style={{ width: `${scrollProgress}%` }}
      >
        {/* Glowing moving tip indicator */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-[var(--color-tertiary)] rounded-full blur-[6px] opacity-80" />
      </div>
    </div>
  );
}
