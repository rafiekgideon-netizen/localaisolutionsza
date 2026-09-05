import { useEffect, useState, useRef } from "react";

interface SectionTheme {
  id: string;
  name: string;
  primary: string;
  gradientFrom: string;
  gradientVia: string;
  gradientTo: string;
  glow: string;
}

const SECTION_THEMES: SectionTheme[] = [
  {
    id: "home",
    name: "Overview",
    primary: "#f97316", // LAIS Signature Orange
    gradientFrom: "#ea580c",
    gradientVia: "#f97316",
    gradientTo: "#fb923c",
    glow: "rgba(249, 115, 22, 0.6)"
  },
  {
    id: "problems",
    name: "Revenue Leaks",
    primary: "#f97316",
    gradientFrom: "#ea580c",
    gradientVia: "#f97316",
    gradientTo: "#fb923c",
    glow: "rgba(249, 115, 22, 0.6)"
  },
  {
    id: "solutions",
    name: "Autonomous System",
    primary: "#f97316",
    gradientFrom: "#ea580c",
    gradientVia: "#f97316",
    gradientTo: "#fb923c",
    glow: "rgba(249, 115, 22, 0.6)"
  },
  {
    id: "calculator",
    name: "Telemetry Calculator",
    primary: "#f59e0b", // Golden Amber for Calculator telemetry
    gradientFrom: "#d97706",
    gradientVia: "#f59e0b",
    gradientTo: "#fcd34d",
    glow: "rgba(245, 158, 11, 0.7)"
  },
  {
    id: "testimonials",
    name: "Verified Results",
    primary: "#10b981", // Emerald Recovery
    gradientFrom: "#059669",
    gradientVia: "#10b981",
    gradientTo: "#34d399",
    glow: "rgba(16, 185, 129, 0.6)"
  },
  {
    id: "audit",
    name: "Book Strategy Session",
    primary: "#ff4d00", // High-energy Coral Flame for Final CTA
    gradientFrom: "#dc2626",
    gradientVia: "#ff4d00",
    gradientTo: "#f97316",
    glow: "rgba(255, 77, 0, 0.8)"
  }
];

export function ScrollProgressBar() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [activeTheme, setActiveTheme] = useState<SectionTheme>(SECTION_THEMES[0]);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const currentScrollY = window.scrollY;
        
        if (scrollHeight > 0) {
          const scrolled = Math.min(Math.max((currentScrollY / scrollHeight) * 100, 0), 100);
          setScrollProgress(scrolled);
        } else {
          setScrollProgress(0);
        }

        // Detect which key section is closest or in view
        const viewportMiddle = currentScrollY + window.innerHeight * 0.35;
        let matchedTheme = SECTION_THEMES[0];

        for (let i = SECTION_THEMES.length - 1; i >= 0; i--) {
          const theme = SECTION_THEMES[i];
          const el = document.getElementById(theme.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            const elementTop = rect.top + currentScrollY;
            if (viewportMiddle >= elementTop - 120) {
              matchedTheme = theme;
              break;
            }
          }
        }

        setActiveTheme(matchedTheme);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-[9999] pointer-events-auto select-none transition-all duration-300 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="region"
      aria-label="Page reading progress and section indicator"
    >
      {/* Invisible hit-area to allow effortless hovering along top edge */}
      <div className="absolute top-0 left-0 right-0 h-4 cursor-pointer" />

      {/* Progress Track Background */}
      <div className={`w-full bg-white/[0.04] backdrop-blur-xs transition-all duration-300 relative ${isHovered ? 'h-[6px]' : 'h-[3px]'}`}>
        <progress 
          className="sr-only" 
          value={scrollProgress} 
          max={100}
          aria-label="Page scroll progress"
        >
          {Math.round(scrollProgress)}%
        </progress>

        {/* Dynamic Animated Color Gradient Fill */}
        <div 
          className="h-full transition-all duration-150 ease-out relative"
          style={{ 
            width: `${scrollProgress}%`,
            background: `linear-gradient(90deg, ${activeTheme.gradientFrom}, ${activeTheme.gradientVia}, ${activeTheme.gradientTo})`,
            boxShadow: isHovered 
              ? `0 0 16px 2px ${activeTheme.glow}, 0 2px 8px ${activeTheme.glow}` 
              : `0 0 10px 1px ${activeTheme.glow}`
          }}
        >
          {/* Glowing moving tip bead */}
          <div 
            className={`absolute right-0 top-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ${
              isHovered ? 'w-4 h-4 blur-[3px]' : 'w-3 h-3 blur-[4px]'
            }`}
            style={{ 
              backgroundColor: activeTheme.gradientTo,
              boxShadow: `0 0 12px 3px ${activeTheme.primary}`
            }} 
          />
        </div>

        {/* Hover State Floating Tooltip */}
        <div 
          className={`absolute top-3 right-6 transition-all duration-300 pointer-events-none transform ${
            isHovered 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 -translate-y-1 scale-95'
          }`}
        >
          <div className="bg-[#121212]/95 backdrop-blur-md border border-white/10 rounded-full py-1 px-3 shadow-2xl flex items-center gap-2">
            <span 
              className="w-2 h-2 rounded-full animate-pulse" 
              style={{ backgroundColor: activeTheme.primary }} 
            />
            <span className="font-mono text-[10px] text-white/90 uppercase tracking-wider font-semibold">
              {activeTheme.name}
            </span>
            <span className="font-mono text-[10px] text-[var(--color-muted)] border-l border-white/10 pl-2">
              {Math.round(scrollProgress)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
