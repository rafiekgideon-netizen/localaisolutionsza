import { useState, useRef } from "react";
import { 
  motion, 
  AnimatePresence,
  useScroll,
  useTransform,
  useVelocity,
  useSpring,
  useAnimationFrame,
  useMotionValue
} from "motion/react";
import { 
  Droplet, 
  Zap, 
  Stethoscope, 
  Scissors, 
  Car, 
  Utensils, 
  Sparkles, 
  TreePine, 
  HardHat, 
  Home, 
  Fan, 
  Wrench,
  ArrowRight,
  Scale,
  Dumbbell,
  Paintbrush,
  Bone,
  Camera,
  Bug,
  GraduationCap,
  Key,
  Truck,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

const industries = [
  { name: "Plumbers", icon: Droplet, imgId: "photo-1504307651254-35680f356dfd" },
  { name: "Electricians", icon: Zap, imgId: "photo-1581092921461-eab62e97a780" },
  { name: "Dentists", icon: Stethoscope, imgId: "photo-1629909613654-28e377c37b09" },
  { name: "Salons", icon: Scissors, imgId: "photo-1560066984-138dadb4c035" },
  { name: "Auto Dealers", icon: Car, imgId: "photo-1552519507-da3b142c6e3d" },
  { name: "Restaurants", icon: Utensils, imgId: "photo-1517248135467-4c7edcad34c4" },
  { name: "Cleaning Services", icon: Sparkles, imgId: "photo-1581578731548-c64695cc6952" },
  { name: "Landscaping", icon: TreePine, imgId: "photo-1558904541-efa8c3a30fc9" },
  { name: "Builders", icon: HardHat, imgId: "photo-1504307651254-35680f356dfd" },
  { name: "Roofers", icon: Home, imgId: "photo-1632759162444-147b15a6b5a7" },
  { name: "HVAC", icon: Fan, imgId: "photo-1621905251189-08b45d6a269e" },
  { name: "Mechanics", icon: Wrench, imgId: "photo-1486006920555-c77dce18193b" },
];

const additionalIndustries = [
  { name: "Lawyers & Legal", icon: Scale, imgId: "photo-1589829545856-d10d557cf95f" },
  { name: "Gyms & Studios", icon: Dumbbell, imgId: "photo-1517838277536-f5f99be501cd" },
  { name: "Painters", icon: Paintbrush, imgId: "photo-1562975088-7e9c6a210745" },
  { name: "Pet Services", icon: Bone, imgId: "photo-1516734212186-a967f81ad0d7" },
  { name: "Photography", icon: Camera, imgId: "photo-1516035069371-29a1b244cc32" },
  { name: "Pest Control", icon: Bug, imgId: "photo-1605371924599-2d0365da1ae0" },
  { name: "Tutors & Academies", icon: GraduationCap, imgId: "photo-1427504494785-3a9ca7044f45" },
  { name: "Tree Services", icon: TreePine, imgId: "photo-1502082553048-f009c37129b9" },
  { name: "Locksmiths", icon: Key, imgId: "photo-1584622650111-993a426fbf0a" },
  { name: "Moving Services", icon: Truck, imgId: "photo-1600518464441-9154a4dea21b" },
];

const getIndustryImageResponsiveProps = (id: string, altText: string) => {
  const baseUrl = `https://images.unsplash.com/${id}`;
  return {
    src: `${baseUrl}?auto=format&fit=crop&q=35&w=240&h=160`,
    srcSet: `
      ${baseUrl}?auto=format&fit=crop&q=35&w=120&h=80 120w,
      ${baseUrl}?auto=format&fit=crop&q=35&w=240&h=160 240w,
      ${baseUrl}?auto=format&fit=crop&q=35&w=360&h=240 360w
    `,
    sizes: "(max-width: 640px) 120px, 240px",
    alt: altText,
    referrerPolicy: "no-referrer" as const,
  };
};

interface IndustriesSectionProps {
  onOpenAudit: () => void;
}

export function IndustriesSection({ onOpenAudit }: IndustriesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const duplicatedIndustries = [...industries, ...industries, ...industries];

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });

  const velocityFactor = useTransform(smoothVelocity, [-3000, 3000], [-2, 2], {
    clamp: false
  });

  const baseX = useMotionValue(0);
  const [isPaused, setIsPaused] = useState(false);

  useAnimationFrame((time, delta) => {
    if (isPaused) return;

    // Elegant, premium background crawl speed to the left (scaled by frame delta)
    let moveBy = -0.06 * (delta / 16);
    
    // Add a gentle, highly responsive scroll velocity influence
    moveBy += velocityFactor.get() * 0.04;
    
    baseX.set(baseX.get() + moveBy);
  });

  // Wrap translation perfectly. One full cycle ofduplicatedIndustries is 33.3333%.
  const x = useTransform(baseX, (v) => `${wrap(-33.3333, 0, v)}%`);

  return (
    <section id="industries" className="py-24 bg-[#0a0a0a] relative overflow-hidden border-t border-[rgba(255,255,255,0.06)]">
      {/* Self-contained custom pulse & vertical rotate animation styles */}
      <style>{`
        @keyframes icon-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .pulse-on-hover {
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .group:hover .pulse-on-hover {
          animation: icon-pulse 2s infinite ease-in-out;
        }
        @keyframes industry-rotate {
          0%, 7.08% { transform: translateY(0); }
          8.33%, 15.41% { transform: translateY(calc(-100% / 13)); }
          16.66%, 23.74% { transform: translateY(calc(-100% / 13 * 2)); }
          25%, 32.08% { transform: translateY(calc(-100% / 13 * 3)); }
          33.33%, 40.41% { transform: translateY(calc(-100% / 13 * 4)); }
          41.66%, 48.74% { transform: translateY(calc(-100% / 13 * 5)); }
          50%, 57.08% { transform: translateY(calc(-100% / 13 * 6)); }
          58.33%, 65.41% { transform: translateY(calc(-100% / 13 * 7)); }
          66.66%, 73.74% { transform: translateY(calc(-100% / 13 * 8)); }
          75%, 82.08% { transform: translateY(calc(-100% / 13 * 9)); }
          83.33%, 90.41% { transform: translateY(calc(-100% / 13 * 10)); }
          91.66%, 98.74% { transform: translateY(calc(-100% / 13 * 11)); }
          100% { transform: translateY(calc(-100% / 13 * 12)); }
        }
        .animate-industry-rotate {
          animation: industry-rotate 24s ease-in-out infinite;
        }
      `}</style>

      {/* High-end gradient side mask overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-20 pointer-events-none" />

      <div className="w-full relative z-10 mx-auto">
        <div className="text-center mb-16 max-w-2xl mx-auto px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-bebas text-5xl md:text-7xl lg:text-8xl text-white mb-6 flex flex-col sm:flex-row items-center justify-center gap-x-4 tracking-[0.02em] leading-none">
              <span className="opacity-90">BUILT FOR</span>
              <span className="relative h-[1.15em] w-full sm:w-[420px] overflow-hidden inline-flex items-center sm:justify-start justify-center text-[var(--color-tertiary)] font-bold [line-height:1.15em] py-0.5">
                <span className="absolute left-0 right-0 top-0 flex flex-col animate-industry-rotate">
                  {[...industries, industries[0]].map((ind, idx) => (
                    <span key={`${ind.name}-${idx}`} className="h-[1.15em] flex-shrink-0 flex items-center justify-center sm:justify-start [line-height:1.15em] uppercase tracking-wide">
                      {ind.name}.
                    </span>
                  ))}
                </span>
              </span>
            </h2>
            <p className="font-body text-lg text-[var(--color-muted)] leading-relaxed">
              Whether you're fixing pipes or fixing cars, if you rely on local leads, we've got you covered.
            </p>
          </motion.div>
        </div>

        {/* 
          Continuous scrolling list (marquee driven by scroll velocity)
        */}
        <div 
          className="relative w-full overflow-hidden py-4 mb-8"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocusCapture={() => setIsPaused(true)}
          onBlurCapture={() => setIsPaused(false)}
        >
          <motion.div style={{ x }} className="flex gap-4 md:gap-6 w-max">
            {duplicatedIndustries.map((industry, index) => {
              const Icon = industry.icon;
              return (
                <div
                  key={`${industry.name}-${index}`}
                  onClick={onOpenAudit}
                  aria-label={`Start Strategic Revenue Audit for ${industry.name}`}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onOpenAudit();
                    }
                  }}
                  className="flex-shrink-0 w-[240px] bg-[#111] border border-[rgba(255,255,255,0.06)] p-6 group hover:border-[var(--color-tertiary)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[160px] relative overflow-hidden"
                >
                  {/* Optimized Background Image overlay */}
                  <img 
                    {...getIndustryImageResponsiveProps(industry.imgId, industry.name)}
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-[0.03] group-hover:opacity-[0.14] transition-opacity duration-500 z-0 pointer-events-none" 
                  />

                  <div className="relative z-10">
                    <div className="mb-4 text-[var(--color-tertiary)] opacity-80 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 relative">
                      {/* Subtle radial gradient glow behind the icon */}
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.18)_0%,transparent_70%)] w-24 h-24 -translate-x-6 -translate-y-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg pointer-events-none z-0" />
                      <Icon className="w-8 h-8 relative z-10 pulse-on-hover" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-display text-xl text-white m-0 tracking-tight">
                      {industry.name}
                    </h3>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.03)] opacity-80 sm:opacity-0 sm:translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-between relative z-10">
                    <span className="font-mono text-[10px] text-[var(--color-tertiary)] uppercase tracking-widest inline-flex items-center gap-1.5 font-bold">
                      Learn how <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Toggleable Additional Industries Section */}
        <div className="flex flex-col items-center justify-center px-4 relative z-10 mt-8">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
            aria-controls="additional-industries-grid"
            className="flex items-center gap-2 px-6 py-3 bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.08)] border border-[rgba(255,255,255,0.08)] hover:border-[var(--color-tertiary)] text-white text-xs font-mono uppercase tracking-widest transition-all duration-300 pointer-events-auto"
          >
            {isExpanded ? (
              <>
                <span>Hide Extra Sectors</span>
                <ChevronUp className="w-4 h-4 text-[var(--color-tertiary)] animate-bounce" />
              </>
            ) : (
              <>
                <span>View More Industries</span>
                <ChevronDown className="w-4 h-4 text-[var(--color-tertiary)] animate-bounce" />
              </>
            )}
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                id="additional-industries-grid"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-6xl mt-12 overflow-hidden px-4 md:px-8"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 py-4">
                  {additionalIndustries.map((industry) => {
                    const Icon = industry.icon;
                    return (
                      <motion.div
                        key={industry.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.4 }}
                        onClick={onOpenAudit}
                        aria-label={`Start Strategic Revenue Audit for ${industry.name}`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onOpenAudit();
                          }
                        }}
                        className="bg-[#111] border border-[rgba(255,255,255,0.06)] p-5 group hover:border-[var(--color-tertiary)] hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[140px] relative overflow-hidden"
                      >
                        {/* Optimized Background Image overlay */}
                        <img 
                          {...getIndustryImageResponsiveProps(industry.imgId, industry.name)}
                          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-[0.03] group-hover:opacity-[0.14] transition-opacity duration-500 z-0 pointer-events-none" 
                        />

                        <div className="relative z-10">
                          <div className="mb-3 text-[var(--color-tertiary)] opacity-80 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 relative">
                            {/* Subtle radial gradient glow behind the icon */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.18)_0%,transparent_70%)] w-20 h-20 -translate-x-5 -translate-y-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg pointer-events-none z-0" />
                            <Icon className="w-7 h-7 relative z-10 pulse-on-hover" strokeWidth={1.5} />
                          </div>
                          <h3 className="font-display text-lg text-white m-0 tracking-tight">
                            {industry.name}
                          </h3>
                        </div>

                        <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.03)] opacity-80 sm:opacity-0 sm:translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-between relative z-10">
                          <span className="font-mono text-[9px] text-[var(--color-tertiary)] uppercase tracking-widest inline-flex items-center gap-1.5 font-bold">
                            Learn how <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
