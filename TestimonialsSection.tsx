import { useState, useEffect, useRef } from "react";
import { Star, ChevronLeft, ChevronRight, Quote, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  location: string;
  rating: number;
  quote: string;
  stat: string;
  statLabel: string;
  avatarId: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: "Christo Coetzee",
    role: "Managing Director",
    company: "Vanguard Solar Installations",
    location: "Pretoria East, GP",
    rating: 5,
    quote: "With the load-shedding cycles and high demand, we were losing up to 45% of incoming quote requests because we couldn't respond fast enough after-hours. The LAIS WhatsApp integration instantly processes any battery or inverter size query and answers technical questions instantly. It literally booked 14 solar consultations last week on auto-pilot while the sales team slept.",
    stat: "+310% ROI",
    statLabel: "In First 30 Days",
    avatarId: "photo-1507003211169-0a1dd7228f2d"
  },
  {
    id: 2,
    name: "Naledi Dlamini",
    role: "Operations Coordinator",
    company: "Siyaya Express Logistics",
    location: "Durban Central, KZN",
    rating: 5,
    quote: "Clients booking emergency courier runs require answer turnarounds in under 2 minutes otherwise they move straight to the next name on Google. The LAIS AI dispatch responder captures the route parameters on WhatsApp, outputs accurate rate calculations immediately, and updates our dispatch ledger. Absolute game changer.",
    stat: "14s Response",
    statLabel: "Downtime Eradicated",
    avatarId: "photo-1573496359142-b8d87734a5a2"
  },
  {
    id: 3,
    name: "Farhan Patel",
    role: "Principal Attorney",
    company: "Patel & Associates Law",
    location: "Sandton, Johannesburg",
    rating: 5,
    quote: "Legal consultations require sensitive, precise initial intake protocols. We customized the LAIS conversational agent to pre-qualify claims according to our preliminary guidelines without dispensing actual legal advice. It saves our clerks over 12 hours a week and ensures our calendar is only filled with qualified high-value appointments.",
    stat: "12 Hours",
    statLabel: "Saved Per Week",
    avatarId: "photo-1500648767791-00dcc994a43e"
  },
  {
    id: 4,
    name: "Ruan Myburgh",
    role: "Founder",
    company: "Apex Emergency Locksmith",
    location: "Table View, Cape Town",
    rating: 5,
    quote: "An emergency after-hours locksmith relies entirely on speed. If your phone goes to voicemail at 2 AM, the client hangs up and calls someone else. Since routing LAIS as our primary conversational frontline, we capture 100% of out-of-office requests. The AI guides the user to submit their location coordinates via WhatsApp and dispatches our tech.",
    stat: "0 Missed",
    statLabel: "Emergency Leads",
    avatarId: "photo-1472099645785-5658abf4ff4e"
  },
  {
    id: 5,
    name: "Evelyn Nkosi",
    role: "General Manager",
    company: "EcoClean Industrial Services",
    location: "Bellville, WC",
    rating: 5,
    quote: "Our commercial cleaning bids require lengthy questionnaires on square meterage and operational shifts. LAIS simplified the entire client intake by breaking it down into an easy, engaging step-by-step diagnostic dialog. Quote generation that used to take us a full day is now delivered to the prospect's email within 30 seconds.",
    stat: "+55% Lift",
    statLabel: "Session Conversion",
    avatarId: "photo-1580489944761-15a19d654956"
  }
];

const getUnsplashResponsiveProps = (id: string, altText: string) => {
  const baseUrl = `https://images.unsplash.com/${id}`;
  return {
    src: `${baseUrl}?auto=format&fit=crop&q=80&w=96&h=96`,
    srcSet: `
      ${baseUrl}?auto=format&fit=crop&q=80&w=48&h=48 48w,
      ${baseUrl}?auto=format&fit=crop&q=80&w=96&h=96 96w,
      ${baseUrl}?auto=format&fit=crop&q=80&w=144&h=144 144w,
      ${baseUrl}?auto=format&fit=crop&q=80&w=200&h=200 200w
    `,
    sizes: "(max-width: 640px) 48px, 96px",
    alt: altText,
    referrerPolicy: "no-referrer" as const,
  };
};

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isAutoplay) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
      }, 7000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoplay]);

  const handlePrev = () => {
    setIsAutoplay(false);
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setIsAutoplay(false);
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const selectTestimonial = (index: number) => {
    setIsAutoplay(false);
    setCurrentIndex(index);
  };

  return (
    <section id="testimonials" className="section-padding bg-[var(--color-primary)] border-t border-[var(--color-border)] relative overflow-hidden">
      {/* Background visual accents */}
      <div className="absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-[rgba(249,115,22,0.02)] to-transparent pointer-events-none" />
      <div className="absolute left-1/3 top-1/2 w-[400px] h-[400px] bg-[var(--color-tertiary)] opacity-[0.02] blur-[120px] rounded-full pointer-events-none" />

      <div className="container max-w-6xl relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="eyebrow-pill mb-6">TRUST & OUTCOMES</div>
            <h2 className="font-display text-display-lg text-white">
              Endorsed by South <br />African <span className="text-[var(--color-tertiary)]">Contractors</span> & Firms.
            </h2>
          </div>
          <p className="font-body text-body-md text-[var(--color-muted)] max-w-md leading-relaxed">
            Real operational results from local South African enterprises who transitioned their booking and communications channels into autonomous growth machines.
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsAutoplay(false)}
          onMouseLeave={() => setIsAutoplay(true)}
        >
          <div className="min-h-[460px] md:min-h-[380px] lg:min-h-[320px] flex items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="w-full"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                  
                  {/* Testimonial Main Content */}
                  <div className="lg:col-span-8 bg-[rgba(15,15,15,0.6)] backdrop-blur-md rounded-3xl border border-[rgba(255,255,255,0.05)] p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(ellipse_at_top_right,rgba(249,115,22,0.05),transparent_70%)] pointer-events-none" />
                    
                    <div className="mb-8">
                      {/* Rating Stars and verification indicator */}
                      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                        <div className="flex items-center gap-1">
                          {[...Array(TESTIMONIALS[currentIndex].rating)].map((_, i) => (
                            <Star 
                              key={i} 
                              className="w-4.5 h-4.5 fill-[var(--color-tertiary)] text-[var(--color-tertiary)]" 
                              strokeWidth={1.5}
                            />
                          ))}
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/5 border border-green-500/10 rounded-full">
                          <ShieldCheck className="w-3.5 h-3.5 text-[var(--color-success)]" />
                          <span className="font-mono text-[9px] text-[var(--color-success)] uppercase tracking-wider font-bold">Verified System Success</span>
                        </div>
                      </div>

                      {/* Actual Quote */}
                      <div className="flex gap-4 items-start">
                        <Quote className="w-8 h-8 text-[var(--color-tertiary)] opacity-20 shrink-0 mt-1" strokeWidth={1} />
                        <blockquote className="font-body text-lg sm:text-xl text-white tracking-tight leading-relaxed italic">
                          "{TESTIMONIALS[currentIndex].quote}"
                        </blockquote>
                      </div>
                    </div>

                    {/* Left side author details */}
                    <div className="flex items-center justify-between pt-6 border-t border-[rgba(255,255,255,0.04)] flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <img 
                          {...getUnsplashResponsiveProps(TESTIMONIALS[currentIndex].avatarId, TESTIMONIALS[currentIndex].name)}
                          className="w-12 h-12 rounded-full object-cover border border-[rgba(255,255,255,0.1)] shrink-0" 
                        />
                        <div>
                          <div className="font-display text-lg text-white font-medium">{TESTIMONIALS[currentIndex].name}</div>
                          <div className="flex items-center gap-2 mt-0.5 font-mono text-xs text-[var(--color-muted)]">
                            <span>{TESTIMONIALS[currentIndex].role}</span>
                            <span className="text-[rgba(255,255,255,0.15)]">•</span>
                            <span className="text-[var(--color-tertiary)]">{TESTIMONIALS[currentIndex].company}</span>
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-[10px] text-[var(--color-muted-dark)] uppercase bg-[#111] px-3 py-1.5 border border-[rgba(255,255,255,0.04)] rounded-lg">
                        {TESTIMONIALS[currentIndex].location}
                      </span>
                    </div>

                  </div>

                  {/* Operational Stat Callout */}
                  <div className="lg:col-span-4 bg-[rgba(249,115,22,0.02)] border border-[rgba(249,115,22,0.15)] rounded-3xl p-6 sm:p-10 flex flex-col justify-center text-center sm:text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[var(--color-tertiary)]/5 to-transparent pointer-events-none" />
                    <span className="font-mono text-[10px] text-[var(--color-tertiary)] uppercase tracking-widest font-bold mb-4 block">Measurable Impact</span>
                    <div className="font-display text-5xl sm:text-6xl text-white font-bold tracking-tight mb-2">
                      {TESTIMONIALS[currentIndex].stat}
                    </div>
                    <div className="font-body text-sm text-[var(--color-muted)] leading-relaxed">
                      {TESTIMONIALS[currentIndex].statLabel}
                    </div>
                  </div>

                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel Manual Controls */}
          <div className="flex items-center justify-between mt-10">
            {/* Progress indicators / dots */}
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((t, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={t.id}
                    onClick={() => selectTestimonial(idx)}
                    className="group py-3 px-1 focus:outline-none cursor-pointer"
                    aria-label={`Go to testimonial ${idx + 1}`}
                  >
                    <div className={`h-1.5 rounded-full transition-all duration-300 ${isActive ? "w-8 bg-[var(--color-tertiary)]" : "w-2.5 bg-[rgba(255,255,255,0.15)] group-hover:bg-[rgba(255,255,255,0.3)]"}`} />
                  </button>
                );
              })}
            </div>

            {/* Previous/Next custom buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full bg-[#111] border border-[rgba(255,255,255,0.05)] hover:border-[var(--color-tertiary)] text-[var(--color-muted)] hover:text-white flex items-center justify-center transition-all duration-300 md:hover:scale-105 select-none cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-[#111] border border-[rgba(255,255,255,0.05)] hover:border-[var(--color-tertiary)] text-[var(--color-muted)] hover:text-white flex items-center justify-center transition-all duration-300 md:hover:scale-105 select-none cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
