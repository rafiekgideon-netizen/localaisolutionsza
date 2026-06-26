import React, { useState, useRef, useEffect } from "react";
import { 
  ChevronDown, 
  Search, 
  Bot, 
  ArrowRight, 
  HelpCircle, 
  Sparkles, 
  Award, 
  ChevronRight, 
  ChevronLeft, 
  RefreshCw, 
  Sliders 
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SlidingTextButton } from "./ui/sliding-text-button";

export function FAQSection() {
  const faqs = [
    {
      category: "Pricing",
      q: "What are your package structures and setup costs?",
      a: "Our productized offerings scale based on operational complexity: 1) FOUNDATION (R4,500 - R8,500 once-off) for landing pages and simple lead routing. 2) OPERATOR (R12,500 - R22,000 once-off) for fully built smart websites, 24/7 AI Agent employees, and missed-call text-backs. 3) COMMAND (R28,000 - R55,000 once-off) for enterprise workflow automation, invoicing/payment integrations, and CRM build-outs."
    },
    {
      category: "Support",
      q: "How does the monthly SLA/retainer work and what support is included?",
      a: "Our premium OPERATOR (R2,500/mo) and COMMAND (R5,500/mo) retainers guarantee active maintenance and zero-downtime execution. Support includes 100% of the heavy lifting: constant system updates, latency monitoring, weekly AI knowledge-base adjustments as your services shift, sanity checks for API syncs, and emergency support."
    },
    {
      category: "Contracts",
      q: "Are we locked into any long-term service agreements?",
      a: "No lock-in contracts or rigid structures. Our monthly maintenance retainers operate on an agile month-to-month commitment. We keep clients by delivering undeniable proof of recovered revenue, not by locking you into paperwork."
    },
    {
      category: "ROI",
      q: "How soon do these automated systems pay for themselves?",
      a: "Most local Western Cape clients recover their setup investment inside their first 30 days. By securing just 1-2 plumbing, solar, or legal jobs that traditionally went straight to voicemail or missed WhatsApps, the system generates immediate return."
    },
    {
      category: "Complexity",
      q: "AI is too complicated for my business — what training is needed?",
      a: "You and your staff don't have to touch or learn any AI. We design, deploy, and manage 100% of the system. The leads talk to our AI Agent employee on WhatsApp, get qualified, and slot directly into your WhatsApp app or phone as booked jobs."
    },
    {
      category: "Platform",
      q: "Why is WhatsApp the focus instead of emails?",
      a: "WhatsApp is the undisputed communications cornerstone for South African consumers. Studies show that responding to leads on WhatsApp within 5 minutes results in a 400% conversion uplift compared to email. We build where your clients are active."
    },
    {
      category: "Onboarding",
      q: "I tried automated chatbots before and users hated them. What's different?",
      a: "This isn't a rigid, keyword-based chatbot from 2019. It uses advanced conversational LLMs tuned to speak like a professional consultant. It references local Cape Town suburbs, recognizes South African accents, understands load-shedding concerns, and answers complex service FAQs accurately."
    },
    {
      category: "Audit",
      q: "What actually happens during the Free 30-Minute Strategy Audit?",
      a: "It's an operational review at R0 cost with zero pressure. We locate your top 3 revenue leak points (missed calls, off-hours delay, lag), map out immediate automation fixes, and deliver a personalized, tangible Revenue Leak Report."
    }
  ];

  // Filters and Core States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [readFaqs, setReadFaqs] = useState<string[]>([]);
  
  // Progress & Gamification Messages
  const totalFaqsCount = faqs.length;
  const readCount = readFaqs.length;
  const progressPercent = Math.min((readCount / totalFaqsCount) * 100, 100);

  // Quiz States
  const [quizStep, setQuizStep] = useState<number>(0); // 0 = start, 1-3 = questions, 4 = results
  const [answers, setAnswers] = useState<number[]>([]);
  
  // Intersection Observer for scroll animations
  const sectionRef = useRef<HTMLDivElement>(null);

  const categories = ["All", "Pricing", "Support", "Contracts", "ROI", "Complexity", "Platform", "Onboarding", "Audit"];

  // Mark FAQ as read when opened
  const handleToggleFAQ = (index: number, q: string) => {
    const isCurrentOpen = openIndex === index;
    setOpenIndex(isCurrentOpen ? null : index);
    if (!isCurrentOpen && !readFaqs.includes(q)) {
      setReadFaqs(prev => [...prev, q]);
    }
  };

  // Filter FAQs based on category AND search query
  const filteredFaqs = faqs.filter(
    (faq) => {
      const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
      const matchesSearch = faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            faq.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            faq.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    }
  );

  // Schema structures
  const faqSchemaJson = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
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

  // Quiz calculations
  const quizQuestions = [
    {
      title: "Incoming Lead / Inquiry Volume",
      question: "How many customer inquiries or leads does your business receive daily?",
      options: [
        { label: "1 to 3 leads (Mainly local organic referrals)", points: 1 },
        { label: "4 to 10 leads (Active website traffic and social channels)", points: 2 },
        { label: "10+ leads (Paid ads running or high-intensity service requests)", points: 3 }
      ]
    },
    {
      title: "Current Response Time Strategy",
      question: "How quickly are incoming calls and WhatsApp messages typically answered?",
      options: [
        { label: "Usually within 5-10 minutes (Highly active admin worker)", points: 1 },
        { label: "Between 30 minutes to 3 hours (Replied to on site or in-between jobs)", points: 2 },
        { label: "Often next day or completely missed outside business hours", points: 3 }
      ]
    },
    {
      title: "Manual Overhead & Invoicing",
      question: "How long is spent daily sorting calendars, answering basic FAQs, typing quotes, and formatting invoices?",
      options: [
        { label: "Under 1 hour — very straightforward admin workflow", points: 1 },
        { label: "1 to 3 hours — starts taking time away from actual tasks", points: 2 },
        { label: "3+ hours — massive admin drag / spreadsheet overload", points: 3 }
      ]
    }
  ];

  const handleSelectQuizOption = (points: number) => {
    const nextAnswers = [...answers, points];
    setAnswers(nextAnswers);
    if (quizStep < quizQuestions.length) {
      setQuizStep(prev => prev + 1);
    }
  };

  const handleResetQuiz = () => {
    setQuizStep(1);
    setAnswers([]);
  };

  // Recommendation tier calculation
  const totalScore = answers.reduce((a, b) => a + b, 0);
  let recommendedTier = {
    title: "FOUNDATION PACKAGE",
    price: "R4,500 - R8,500 Once-off",
    desc: "Best suited for small teams requiring immediate local website conversion optimization.",
    deliverables: ["Mobile-First conversion design", "WhatsApp CTA integration", "Basic automated lead-routing form", "Google Business Profile mapping"],
    conversionTip: "Establish your high-conversion online base. Secure consistent lead traffic first."
  };

  if (totalScore >= 5 && totalScore <= 7) {
    recommendedTier = {
      title: "OPERATOR PACKAGE",
      price: "R12,500 - R22,000 Once-off + R2,500/mo retainer",
      desc: "Perfect for active systems. Installs a dedicated AI Agent employee answering questions 24/7.",
      deliverables: ["Full premium custom smart website", "24/7 AI Agent Employee on WhatsApp", "Missed-Call text-back automations", "Standard calendar & CRM setup"],
      conversionTip: "Deploy your conversational AI receptionist immediately. Stop losing late-evening calls!"
    };
  } else if (totalScore >= 8) {
    recommendedTier = {
      title: "COMMAND PACKAGE",
      price: "R28,000 - R55,000 Once-off + R5,500/mo retainer",
      desc: "Designed for scaling enterprises and multi-staff organizations needing seamless operational pipes.",
      deliverables: ["Full custom business workflow design", "CRM, invoicing, & payments sync", "Staff hand-offs and live monitoring tools", "Top-tier custom AI knowledge integration", "Quarterly optimization audits & dedicated priority SLA"],
      conversionTip: "Reclaim up to 15-25 hours per week of admin chores with custom automated flow systems."
    };
  }

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111] border border-[rgba(255,255,255,0.08)] px-11 py-3 text-sm text-white placeholder-[var(--color-muted-dark)] rounded-md focus:outline-none focus:border-[var(--color-tertiary)] focus:ring-1 focus:ring-[var(--color-tertiary)]/50 transition-all font-sans"
            />
          </div>

          {/* Category Filter Chips Bar */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-2xl mx-auto mb-10">
            {categories.map((cat) => (
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
              filteredFaqs.map((faq, i) => {
                const globalIndex = faqs.findIndex(f => f.q === faq.q);
                const isOpen = openIndex === globalIndex;

                return (
                  <motion.div 
                    key={faq.q} 
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    whileHover={{ scale: 1.01 }}
                    transition={{ duration: 0.3 }}
                    className="ethereal-card-shell"
                  >
                    <div className={`ethereal-card-core transition-colors duration-300 ${isOpen ? '!bg-[rgba(249,115,22,0.04)] border-[rgba(249,115,22,0.2)]' : '!bg-[rgba(11,11,11,0.5)]'}`}>
                      <button 
                        type="button"
                        className="w-full flex items-center justify-between p-6 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-tertiary)]"
                        onClick={() => handleToggleFAQ(globalIndex, faq.q)}
                        aria-expanded={isOpen}
                      >
                        <div className="flex flex-col gap-1.5 pr-4">
                          <span className="font-mono text-[9px] text-[var(--color-tertiary)] uppercase tracking-wider font-semibold">
                            [{faq.category}] {readFaqs.includes(faq.q) && "✓ READ"}
                          </span>
                          <span className="font-display text-lg md:text-xl text-white tracking-tight leading-snug">
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
        <motion.div id="quiz-block" className="ethereal-card-shell reveal-up mb-16" whileHover={{ scale: 1.01 }}>
          <div className="ethereal-card-core p-8 md:p-12 !bg-[rgba(11,11,11,0.6)] backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-44 h-44 bg-[var(--color-tertiary)] opacity-[0.03] rounded-full blur-[60px] pointer-events-none" />
            
            {quizStep === 0 ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-[rgba(249,115,22,0.08)] border border-[rgba(249,115,22,0.2)] flex items-center justify-center mx-auto mb-6">
                  <Sliders className="w-5 h-5 text-[var(--color-tertiary)]" strokeWidth={2.5} />
                </div>
                <h3 className="font-display text-2xl text-white tracking-widest uppercase mb-3">
                  Is Your Business Ready For Automation?
                </h3>
                <p className="font-body text-body-sm text-[var(--color-muted)] max-w-lg mx-auto mb-8">
                  Complete our 3-question operational diagnostic to evaluate your lead processing gaps and map out our recommended recovery action logic.
                </p>
                <SlidingTextButton
                  onClick={() => setQuizStep(1)}
                  className="mx-auto"
                >
                  Start Diagnostic Tool
                  <div className="flex items-center justify-center bg-[rgba(0,0,0,0.1)] rounded-full w-8 h-8 ml-2">
                    <ArrowRight className="w-4 h-4 text-[#050505]" />
                  </div>
                </SlidingTextButton>
              </div>
            ) : quizStep <= quizQuestions.length ? (
              <div>
                {/* Progress Indicators */}
                <div className="flex items-center gap-1 mb-8">
                  {quizQuestions.map((_, index) => (
                    <div 
                      key={index} 
                      className={`h-1 flex-1 transition-colors duration-300 ${index < quizStep - 1 ? 'bg-[var(--color-tertiary)]' : index === quizStep - 1 ? 'bg-[rgba(249,115,22,0.3)]' : 'bg-[#1e1e1e]'}`}
                    />
                  ))}
                </div>

                <div className="mb-2 flex items-center gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-tertiary)] border border-[var(--color-tertiary)]/30 px-2 py-0.5 font-bold">
                    STEP 0{quizStep} OF 0{quizQuestions.length}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--color-muted-dark)] uppercase">
                    {quizQuestions[quizStep-1].title}
                  </span>
                </div>

                <h3 className="font-display text-xl md:text-2xl text-white tracking-tight mb-8">
                  {quizQuestions[quizStep-1].question}
                </h3>

                <div className="space-y-3.5">
                  {quizQuestions[quizStep-1].options.map((option, key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSelectQuizOption(option.points)}
                      className="w-full text-left p-5 bg-[#161616] border border-[rgba(255,255,255,0.06)] hover:border-[var(--color-tertiary)] hover:bg-[rgba(249,115,22,0.02)] transition-all flex items-center justify-between group cursor-pointer"
                    >
                      <span className="font-sans text-xs md:text-sm text-[var(--color-neutral-soft)] md:group-hover:text-white font-medium">
                        {option.label}
                      </span>
                      <ChevronRight className="w-4 h-4 text-[var(--color-muted-dark)] md:group-hover:text-[var(--color-tertiary)] transition-colors shrink-0 ml-3" />
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-start gap-4 mt-8 pt-4 border-t border-[rgba(255,255,255,0.04)]">
                  <button
                    type="button"
                    onClick={() => {
                      if (quizStep > 1) {
                        setQuizStep(prev => prev - 1);
                        setAnswers(prev => prev.slice(0, -1));
                      } else {
                        setQuizStep(0);
                      }
                    }}
                    className="flex items-center gap-1 text-[var(--color-muted)] hover:text-white transition-colors font-mono text-[10px] uppercase tracking-wider cursor-pointer"
                  >
                    <ChevronLeft className="w-3 h-3" /> Back
                  </button>
                </div>
              </div>
            ) : (
              // Quiz Results View
              <motion.div 
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="text-left"
              >
                <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between pb-6 mb-8 border-b border-[rgba(255,255,255,0.05)]">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-success)] font-bold mb-1 block">
                      ✓ Diagnostic Complete · Recommended Tier
                    </span>
                    <h3 className="font-display text-3xl text-white tracking-wider flex items-center gap-2">
                      <Award className="w-6 h-6 text-[var(--color-tertiary)] shrink-0" />
                      {recommendedTier.title}
                    </h3>
                  </div>
                  <div className="bg-[#181818] border border-[rgba(255,255,255,0.05)] px-5 py-3 rounded-md shrink-0">
                    <span className="font-mono text-[9px] uppercase block text-[var(--color-muted)] mb-0.5">ESTIMATED PRICE</span>
                    <span className="font-mono text-sm text-[var(--color-tertiary)] font-bold">{recommendedTier.price}</span>
                  </div>
                </div>

                <p className="font-sans text-sm text-[var(--color-muted)] leading-relaxed mb-6">
                  {recommendedTier.desc} Based on your responses, here are the most impactful recovery channels we would deploy in your workflow:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                  {recommendedTier.deliverables.map((del, index) => (
                    <div key={index} className="flex items-start gap-2.5 p-3.5 bg-[#161616] border border-[rgba(255,255,255,0.04)] rounded-md">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-tertiary)] mt-1.5 shrink-0" />
                      <span className="font-sans text-xs text-[var(--color-neutral-soft)] font-medium">{del}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.15)] rounded-md mb-8">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-success)] font-black block mb-1">PRO TIP FOR YOUR FLOW:</span>
                  <p className="font-sans text-xs text-white tracking-wide leading-relaxed">{recommendedTier.conversionTip}</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <SlidingTextButton
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent("open-chatbot", {
                          detail: `Hi! I completed the ready-for-automation diagnostic quiz and recommended the ${recommendedTier.title}. Can you provide details on what's next?`
                        })
                      );
                    }}
                    className="w-full sm:w-auto"
                  >
                    Discuss Result With Agent
                    <div className="flex items-center justify-center bg-[rgba(0,0,0,0.1)] rounded-full w-8 h-8 ml-2">
                      <Bot className="w-4 h-4 text-[#050505]" />
                    </div>
                  </SlidingTextButton>

                  <button
                    type="button"
                    onClick={handleResetQuiz}
                    className="flex items-center gap-1.5 text-[var(--color-muted)] hover:text-white transition-colors font-mono text-[10px] uppercase tracking-wider cursor-pointer py-3.5 px-3"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Re-take Quiz
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>


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

