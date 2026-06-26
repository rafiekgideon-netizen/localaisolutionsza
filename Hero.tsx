import { ArrowRight, ChevronRight, Activity, Zap, CheckCircle2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useAnimationFrame } from "motion/react";
import ThreeBackground from "./ThreeBackground";
import Grainient from "../../components/Grainient";
import { InteractiveHoverButton } from "../../components/ui/interactive-hover-button";

function TypewriterText({ text, active }: { text: string; active: boolean }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (!active) {
      setDisplayText(text);
      return;
    }

    let i = 0;
    setDisplayText("");

    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 45); // elegant typing speed (45ms per character)

    return () => {
      clearInterval(interval);
    };
  }, [text, active]);

  return (
    <span className="inline-block relative">
      {displayText}
      {active && (
        <span className="inline-block w-[1.5px] h-[13px] ml-1 bg-[var(--color-tertiary)] animate-cursor-blink align-middle" />
      )}
    </span>
  );
}

interface HeroProps {
  onOpenAudit: () => void;
}

export function Hero({ onOpenAudit }: HeroProps) {
  const [loaded, setLoaded] = useState(false);
  const [activeLogIndex, setActiveLogIndex] = useState(0);
  const [blendAngle, setBlendAngle] = useState(-171);
  const [zoomLevel, setZoomLevel] = useState(0.95);
  const [warpStrength, setWarpStrength] = useState(0.75);
  const [inView, setInView] = useState(true);
  
  const heroRef = useRef<HTMLElement>(null);
  const warpTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleResize = () => {
      // Increase zoom on mobile so the gradient visual center remains focal
      setZoomLevel(window.innerWidth < 768 ? 1.8 : 0.95);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!heroRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => setInView(entries[0].isIntersecting),
      { threshold: 0 }
    );
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  useAnimationFrame((time, delta) => {
    if (!inView) return; // Pause calculation when out of view
    // Slowly rotate the blend angle over time, creating a dynamic shifting background mood
    setBlendAngle((prev) => (prev + delta * 0.02) % 360);
  });

  const handleBackgroundClick = () => {
    setWarpStrength(2.5);
    if (warpTimeoutRef.current) clearTimeout(warpTimeoutRef.current);
    warpTimeoutRef.current = setTimeout(() => {
      setWarpStrength(0.75);
    }, 600);
  };

  // Dynamic drag controller for our interactive glass mesh lens
  const dragX = useMotionValue(0);

  // Parallax motion values for premium interactive feel
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth out the mouse movement (premium heavy inertia)
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 25, mass: 1.5 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 25, mass: 1.5 });

  // Displace the ambient light aggressively but smoothly
  const lightX = useTransform(smoothX, [-1, 1], [-80, 80]);
  const lightY = useTransform(smoothY, [-1, 1], [-80, 80]);

  // Displace the glass texture slightly in the opposite direction for deep parallax
  const glassX = useTransform(smoothX, [-1, 1], [15, -15]);
  const glassY = useTransform(smoothY, [-1, 1], [15, -15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window !== "undefined") {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth) * 2 - 1; // -1 to 1
      const y = (e.clientY / innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    }
  };

  // Status feed config representing the live agent system
  const AGENT_STATUSES = [
    {
      type: "LEAD CAPTURED",
      time: "12s",
      content: "Quote requested — Plumbing, Kenilworth",
      color: "var(--color-success)",
      bgColor: "rgba(34, 197, 94, 0.08)",
      icon: CheckCircle2,
    },
    {
      type: "WHATSAPP REPLY SENT",
      time: "43s",
      content: '"Hi! Thanks for reaching out. We can have..."',
      color: "var(--color-tertiary)",
      bgColor: "rgba(249, 115, 22, 0.08)",
      icon: Zap,
    },
    {
      type: "PROCESSING",
      time: "1m",
      content: "Generating quote for Electrician — Stellenbosch",
      color: "var(--color-warning)",
      bgColor: "rgba(250, 204, 21, 0.08)",
      icon: Activity,
    }
  ];

  useEffect(() => {
    setLoaded(true);

    // Slowly cycle individual active states on repeat (4.5s intervals)
    const interval = setInterval(() => {
      setActiveLogIndex((prev) => (prev + 1) % AGENT_STATUSES.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="home" 
      ref={heroRef}
      className="hero-section min-h-[100dvh] flex items-center pt-32 pb-24 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onClick={handleBackgroundClick}
    >
      {/* Background Grainient */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-auto bg-[#050505]">
        <div 
          className="absolute inset-0 w-[100vw] h-[100dvh] opacity-60 hover:opacity-80 hover:brightness-110 transition-all duration-700 ease-out cursor-default"
          style={{ 
            WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 85%)",
            maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 15%, rgba(0,0,0,0) 85%)"
          }}
        >
          <Grainient
            color1="#FF7A00"
            color2="#000000"
            color3="#FF7A00"
            timeSpeed={2.05}
            colorBalance={0}
            warpStrength={warpStrength}
            warpFrequency={2.2}
            warpSpeed={0.6}
            warpAmplitude={50}
            blendAngle={blendAngle}
            blendSoftness={0.1}
            rotationAmount={90}
            noiseScale={2}
            grainAmount={0.09}
            grainScale={2.9}
            grainAnimated={inView}
            contrast={1.5}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={zoomLevel}
            className="w-full h-full transition-all duration-700"
          />
        </div>
        {/* Additional gradient layers for seamless blending with the dark architectural theme */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-[#050505] opacity-60" />
      </div>
      
      {/* Subtle Noise Texture */}
      <div className="noise-layer" />

      <div className="container relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mt-12">
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className={`transition-all duration-1000 ease-[cubic-bezier(0.32,0.72,0,1)] transform ${loaded ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-12 opacity-0 blur-md'}`}>
            <div className="eyebrow-pill mb-8 flex items-center w-max gap-2 group cursor-pointer md:hover:bg-[rgba(249,115,22,0.15)] transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-tertiary)] animate-pulse" />
              WE DON'T SELL AI. WE RECOVER REVENUE.
            </div>
            
            <h1 className="text-white mb-8 flex flex-col relative z-0">
              <span className="font-display font-bold tracking-tighter opacity-90 pb-2 md:pb-4" style={{ fontSize: "clamp(1.75rem, 4vw, 3.5rem)", lineHeight: 1.05 }}>
                Cape Town businesses <br className="hidden sm:block" /> don't need more AI.
              </span>
              <span className="font-bebas text-[var(--color-tertiary)] -ml-1 mt-2" style={{ fontSize: "clamp(4rem, 12vw, 10rem)", lineHeight: 0.85 }}>
                THEY NEED SYSTEMS
                <br />
                THAT WORK.
              </span>
            </h1>
            
            <p className="text-body-lg text-[var(--color-neutral-soft)] max-w-xl mb-12">
              We build 24/7 lead capture, instant-response automation, and revenue recovery systems for South African businesses. 
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <InteractiveHoverButton onClick={onOpenAudit}>Book Free Audit</InteractiveHoverButton>
              <button onClick={onOpenAudit} className="btn-secondary cursor-pointer">
                Check My Leaks
              </button>
            </div>
          </div>
        </div>

        {/* Right side telemetry console simulation */}
        <div className={`col-span-1 lg:col-span-5 relative z-20 transition-all duration-1000 delay-200 ease-[cubic-bezier(0.32,0.72,0,1)] transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'}`}>
          <div className="ethereal-card-shell absolute -inset-4 opacity-50 hidden lg:block border-[rgba(255,255,255,0.02)] z-0" />
          <div className="glass-card rounded-3xl p-6 relative z-10">
            
            {/* Ambient sweep line */}
            <div className="absolute left-0 w-full h-[150px] bg-gradient-to-b from-transparent via-[rgba(249,115,22,0.03)] to-transparent pointer-events-none animate-sweep z-0 animate-pulse" />

            <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.05)] pb-4 mb-6 relative z-10">
              <div className="font-mono text-xs text-[var(--color-muted)] flex items-center gap-2">
                <Activity className="w-3 h-3 text-[var(--color-tertiary)] animate-pulse" />
                LAIS AGENT STATUS
              </div>
              <div className="flex gap-2 items-center bg-[#111] px-2.5 py-1 rounded-full border border-[rgba(255,255,255,0.04)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-log-dot" />
                <span className="font-mono text-[9px] text-[var(--color-success)] tracking-widest font-bold animate-text-glow">LIVE</span>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              {AGENT_STATUSES.map((status, idx) => {
                const isActive = idx === activeLogIndex;
                const IconComponent = status.icon;

                return (
                  <div
                    key={status.type}
                    className={`relative border rounded-2xl p-4 flex gap-4 items-start transition-all duration-500 overflow-hidden ${
                      isActive
                        ? "animate-agent-glow border-[var(--color-tertiary)]/30 scale-[1.02] bg-[rgba(249,115,22,0.01)]"
                        : "bg-[rgba(255,255,255,0.01)] border-[rgba(255,255,255,0.03)] opacity-40 scale-[0.98]"
                    }`}
                  >
                    <div 
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform duration-500"
                      style={{ 
                        backgroundColor: status.bgColor,
                        transform: isActive ? 'scale(1.1) rotate(5deg)' : 'scale(1)'
                      }}
                    >
                      <IconComponent 
                        className="w-4.5 h-4.5 transition-colors" 
                        style={{ color: status.color }} 
                        strokeWidth={isActive ? 2.5 : 2} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className={`font-mono text-[10px] tracking-wider font-bold transition-colors duration-300 ${isActive ? "text-[var(--color-tertiary)]" : "text-[var(--color-muted-dark)]"}`}>
                          {status.type}
                        </span>
                        <span className="font-mono text-[10px] text-[var(--color-muted-dark)] flex items-center gap-1">
                          {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-tertiary)] animate-ping" />}
                          {status.time}
                        </span>
                      </div>
                      <p className={`text-body-sm transition-colors duration-300 ${isActive ? "text-white font-medium animate-text-glow font-mono tracking-wide" : "text-[var(--color-neutral-soft)]"}`}>
                        <TypewriterText text={status.content} active={isActive} />
                      </p>
                    </div>

                    {/* Active load progress indicator bar at bottom */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--color-tertiary)] to-transparent animate-progress-fill" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.05)] grid grid-cols-2 gap-4 relative z-10">
               <div>
                  <div className="font-telemetry text-2xl text-white mb-1 font-bold">14</div>
                  <div className="font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-wider">Leads Today</div>
               </div>
               <div>
                  <div className="font-telemetry text-2xl text-[var(--color-tertiary)] mb-1 font-bold">37s</div>
                  <div className="font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-wider">Avg Response</div>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-1000 delay-500 ease-[cubic-bezier(0.32,0.72,0,1)] transform ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <span className="font-mono text-[10px] text-[var(--color-muted-dark)] uppercase tracking-widest hidden sm:block">Scroll</span>
        <div className="w-[1px] h-12 bg-[rgba(255,255,255,0.1)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-[var(--color-tertiary)] animate-scroll-down" />
        </div>
      </div>
    </section>
  );
}
