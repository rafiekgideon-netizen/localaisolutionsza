import { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { ThemeProvider } from "./context/ThemeContext";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { TrustBar } from "./components/TrustBar";
import { IndustriesSection } from "./components/IndustriesSection";
import { ProblemSection } from "./components/ProblemSection";
import { SolutionSection } from "./components/SolutionSection";
import { ComparisonSection } from "./components/ComparisonSection";
import { HowItWorksSection } from "./components/HowItWorksSection";
import { CalculatorSection } from "./components/CalculatorSection";
import { QuestionnaireModal } from "./components/QuestionnaireModal";
import { BookingSection } from "./components/BookingSection";
import { WhatsAppSection } from "./components/WhatsAppSection";
import { ExpandedProofSection } from "./components/ExpandedProofSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { ScrollProgressBar } from "./components/ScrollProgressBar";
import { FAQSection } from "./components/FAQSection";
import { FinalCTASection } from "./components/FinalCTASection";
import { Footer } from "./components/Footer";
import { Chatbot } from "./components/Chatbot";
import { ScrollReveal } from "./components/ui/ScrollReveal";

export default function App() {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );

    const elements = document.querySelectorAll(".reveal-up");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[var(--color-primary)] font-body text-[var(--color-neutral-soft)] antialiased transition-colors duration-400 ease-in-out">
        <ScrollProgressBar />
        <Navbar onOpenAudit={() => setIsAuditModalOpen(true)} />
        
        <main className="w-full max-w-full overflow-x-hidden">
          <Hero onOpenAudit={() => setIsAuditModalOpen(true)} />

          <ScrollReveal>
            <TrustBar />
          </ScrollReveal>

          <ScrollReveal>
            <IndustriesSection onOpenAudit={() => setIsAuditModalOpen(true)} />
          </ScrollReveal>

          <ScrollReveal>
            <ProblemSection />
          </ScrollReveal>

          <ScrollReveal>
            <SolutionSection onOpenAudit={() => setIsAuditModalOpen(true)} />
          </ScrollReveal>

          <ScrollReveal>
            <ComparisonSection />
          </ScrollReveal>

          <ScrollReveal>
            <HowItWorksSection onOpenAudit={() => setIsAuditModalOpen(true)} />
          </ScrollReveal>

          <ScrollReveal>
            <CalculatorSection onOpenAudit={() => setIsAuditModalOpen(true)} />
          </ScrollReveal>

          <ScrollReveal>
            <ExpandedProofSection />
          </ScrollReveal>

          <ScrollReveal>
            <TestimonialsSection />
          </ScrollReveal>

          <ScrollReveal>
            <BookingSection />
          </ScrollReveal>

          <ScrollReveal>
            <FAQSection />
          </ScrollReveal>

          <ScrollReveal>
            <WhatsAppSection />
          </ScrollReveal>

          <ScrollReveal>
            <FinalCTASection onOpenAudit={() => setIsAuditModalOpen(true)} />
          </ScrollReveal>
        </main>

        <Footer />

        {/* Persistent Mobile Sticky CTA Bar */}
        <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-[var(--color-overlay)] backdrop-blur-md border-t border-[rgba(255,255,255,0.06)] dark:border-[rgba(255,255,255,0.06)] border-slate-200 md:hidden">
          <button 
            onClick={() => setIsAuditModalOpen(true)} 
            className="btn-primary w-full text-center text-sm py-3 justify-center"
          >
            Book Free Audit
          </button>
        </div>

        <QuestionnaireModal 
          isOpen={isAuditModalOpen} 
          onClose={() => setIsAuditModalOpen(false)} 
        />

        <Chatbot />
        <Analytics />
        <SpeedInsights />
      </div>
    </ThemeProvider>
  );
}
