import { useState, useRef, useEffect } from "react";
import { 
  ChevronDown, 
  Search, 
  Bot, 
  ArrowRight, 
  HelpCircle, 
  Sparkles 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FAQS, FAQ_CATEGORIES } from "../data/faqData";
import { FAQQuiz } from "./FAQQuiz";

export function FAQSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [readFaqs, setReadFaqs] = useState<string[]>([]);
  
  const totalFaqsCount = FAQS.length;
  const readCount = readFaqs.length;
  const progressPercent = Math.min((readCount / totalFaqsCount) * 100, 100);

  const sectionRef = useRef<HTMLDivElement>(null);

  const handleToggleFAQ = (index: number, q: string) => {
    const isCurrentOpen = openIndex === index;
    setOpenIndex(isCurrentOpen ? null : index);
    if (!isCurrentOpen && !readFaqs.includes(q)) {
      setReadFaqs(prev => [...prev, q]);
    }
  };

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const faqSchemaJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  const serviceSchemaJson = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Local AI Solutions Revenue Recovery Systems",
    "description": "24/7 custom AI Agent employees, instant WhatsApp responder workflows, and automated pipeline systems built for South African businesses.",
    "provider": {
      "@type": "LocalBusiness",
      "name": "Local AI Solutions",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Cape Town",
        "addressCountry": "ZA"
      }
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "ZAR",
      "lowPrice": "4500",
      "highPrice": "55000",
      "offerCount": "3"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "bestRating": "5",
      "worstRating": "1",
      "ratingCount": "24"
    }
  };

  const handleTriggerChatbot = () => {
    window.dispatchEvent(
      new CustomEvent("open-chatbot", {
        detail: "Hi! I was reading the FAQs. Can you explain the SLA differences between the Operator and Command retainers?"
      })
    );
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll('.reveal-up');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section id="faq" className="section-padding bg-[var(--color-primary-surface)] relative border-t border-[rgba(255,255,255,0.03)]" ref={sectionRef}>
      {/* Search Engine Optimization (SEO) structured schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchemaJson) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchemaJson) }}
      />
      
      <div className="absolute inset-0 bg-ethereal-glow pointer-events-none opacity-20" />
      <div className="container max-w-4xl relative z-10">
        
        <div className="text-center mb-10 reveal-up">
          <div className="eyebrow-pill mb-6 mx-auto">OBJECTIONS & DETAILS</div>
          <h2 className="font-display text-display-lg text-white mb-4">Frequently Asked Questions</h2>
          <p className="font-body text-body-md text-[var(--color-muted)] max-w-lg mx-auto mb-8">
            Everything you need to know about our productized setups, support SLA, costs, and Cape Town systems.
          </p>

          {/* Real-time FAQ Search Engine Input */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted)]" />
            <input 
              type="text"
              placeholder="Search pricing, support, packages..."
              aria-label="Search frequently asked questions"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111] border border-[rgba(255,255,255,0.08)] px-11 py-3 text-sm text-white placeholder-[var(--color-muted-dark)] rounded-md focus:outline-none focus:border-[var(--color-tertiary)] focus:ring-1 focus:ring-[var(--color-tertiary)]/50 transition-all font-sans"
            />
          </div>

          {/* Category Filter Chips Bar */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-2xl mx-auto mb-10">
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-wider rounded-sm border cursor-pointer transition-all duration-200 ${selectedCategory === cat ? 'bg-[var(--color-tertiary)] text-black border-[var(--color-tertiary)] font-bold' : 'bg-[#111] text-[var(--color-muted)] border-[rgba(255,255,255,0.06)] hover:bg-[#161616] hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Gamified Trust Progress Bar */}
          <div className="max-w-md mx-auto p-4 bg-[rgba(17,17,17,0.7)] border border-[rgba(255,255,255,0.03)] rounded-md mb-8 text-left">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--color-tertiary)]" />
                Trust Checklist: Core Knowledge Read
              </span>
              <span className="font-mono text-xs text-[var(--color-tertiary)] font-semibold">
                {readCount} of {totalFaqsCount} ({Math.round(progressPercent)}%)
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#111] rounded-full overflow-hidden border border-[rgba(255,255,255,0.05)]">
              <motion.div 
                className="h-full bg-[var(--color-tertiary)] shadow-[0_0_10px_rgba(249,115,22,0.4)]"
                initial={{ width: "0%" }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
            <p className="font-sans text-[10px] text-[var(--color-muted-dark)] mt-1.5 leading-normal">
              {readCount === 0 && "Click some questions below to find out how our systems scale your response pipeline."}
              {readCount > 0 && readCount < totalFaqsCount && "Explore a few more topics to fully prepare your digital conversion strategy."}
              {readCount === totalFaqsCount && "Congratulations! You are fully informed and operations fluent. Book your Strategy Audit call below!"}
            </p>
          </div>
        </div>
        
        {/* Accordions Container */}
        <div className="space-y-4 mb-20">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => {
                const globalIndex = FAQS.findIndex(f => f.q === faq.q);
                const isOpen = openIndex === globalIndex;

                return (
                  <motion.div 
                    key={faq.q} 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="ethereal-card-shell"
                  >
                    <div className="ethereal-card-core !p-0">
                      <button 
                        type="button"
                        onClick={() => handleToggleFAQ(globalIndex, faq.q)}
                        aria-expanded={isOpen}
                        className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-tertiary)] border border-[rgba(249,115,22,0.2)] bg-[rgba(249,115,22,0.05)] px-2 py-0.5 rounded-sm shrink-0">
                            {faq.category}
                          </span>
                          <span className="font-sans text-sm md:text-base text-white font-medium">
                            {faq.q}
                          </span>
                        </div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 shrink-0 ${isOpen ? 'bg-[rgba(249,115,22,0.1)]' : 'bg-[rgba(255,255,255,0.05)]'}`}>
                          <ChevronDown className={`w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'rotate-180 text-[var(--color-tertiary)]' : 'text-[var(--color-muted)]'}`} strokeWidth={2.5} />
                        </div>
                      </button>
                      <div 
                        className={`grid transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'grid-rows-[1fr] opacity-100 border-t border-[rgba(255,255,255,0.04)]' : 'grid-rows-[0fr] opacity-0'}`}
                      >
                        <div className="overflow-hidden">
                          <div className="p-6">
                            <p className="font-body text-body-md text-[var(--color-muted)] leading-relaxed">
                              {faq.a}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-10 bg-[#111] border border-dashed border-[rgba(255,255,255,0.08)] p-6 rounded"
              >
                <HelpCircle className="w-8 h-8 mx-auto mb-3 text-[var(--color-muted)]" />
                <p className="font-mono text-sm text-[var(--color-muted)] mb-3">No matching answers found for category & search filters.</p>
                <button 
                  onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }} 
                  className="font-mono text-[10px] uppercase text-[var(--color-tertiary)] hover:underline"
                >
                  Clear search filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Operational Ready-for-Automation Mini-Quiz block */}
        <FAQQuiz />

        {/* Promo trigger linked to the Real-Time AI Agent widget */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-14 p-6 bg-gradient-to-r from-[#111] to-[rgba(249,115,22,0.04)] border border-[rgba(249,115,22,0.15)] rounded-lg flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-full bg-[rgba(249,115,22,0.08)] border border-[rgba(249,115,22,0.2)] flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 text-[var(--color-tertiary)] animate-pulse" strokeWidth={2} />
            </div>
            <div>
              <h4 className="font-display text-md text-white font-medium uppercase tracking-wider mb-1">
                Have a different scenario or SLA system query?
              </h4>
              <p className="text-xs text-[var(--color-muted)] leading-relaxed font-sans max-w-md">
                Ask our Live AI sandbox system expert. It has been pre-seeded with our confidential master operational documentation strategy.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleTriggerChatbot}
            className="flex items-center gap-2 text-white bg-[var(--color-tertiary)] hover:bg-[var(--color-tertiary-hover)] text-xs font-mono uppercase tracking-widest px-5 py-3.5 rounded-sm shrink-0 cursor-pointer text-black hover:scale-[1.03] transition-all font-bold"
          >
            Ask Live Agent
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </motion.div>

      </div>
    </section>
  );
}
