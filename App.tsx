import { useState } from "react";
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

export default function App() {
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--color-primary)] font-body text-[var(--color-neutral-soft)] antialiased">
      <ScrollProgressBar />
      <Navbar onOpenAudit={() => setIsAuditModalOpen(true)} />
      
      <main>
        <Hero onOpenAudit={() => setIsAuditModalOpen(true)} />
        <TrustBar />
        <IndustriesSection onOpenAudit={() => setIsAuditModalOpen(true)} />
        <ProblemSection />
        <SolutionSection onOpenAudit={() => setIsAuditModalOpen(true)} />
        <ComparisonSection />
        <HowItWorksSection onOpenAudit={() => setIsAuditModalOpen(true)} />
        <CalculatorSection onOpenAudit={() => setIsAuditModalOpen(true)} />
        <ExpandedProofSection />
        <TestimonialsSection />
        <BookingSection />
        <FAQSection />
        <WhatsAppSection />
        <FinalCTASection onOpenAudit={() => setIsAuditModalOpen(true)} />
      </main>

      <Footer />

      {/* Persistent Mobile Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-3 bg-[var(--color-overlay)] backdrop-blur-md border-t border-[rgba(255,255,255,0.06)] md:hidden">
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
    </div>
  );
}
