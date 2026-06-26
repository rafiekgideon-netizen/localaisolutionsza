import React, { useState, useRef, useEffect, FormEvent } from "react";
import { X, Send, Bot, Loader2 } from "lucide-react";

type Message = {
  role: "user" | "model";
  content: string;
};

const SECTION_GREETINGS: { [key: string]: string } = {
  hero: "Hi! I'm the LAIS systems expert. Are you losing leads, or do you have a question about our Cape Town operations?",
  industries: "Wondering if LAIS fits your specific trade? Ask me how our AI systems qualify leads for Plumbers, Electricians, Dentists, or Lawyers!",
  problem: "South African SMEs lost R650k+ on average per year to missed calls. Ask me how we stop those specific revenue leaks!",
  solution: "I see you're looking at our core offers. I can answer any questions about the Smart Website or automated WhatsApp sequences!",
  comparison: "Curious how our AI systems compare to classic receptionist costs or rigid 2019 chatbots? Ask me anything!",
  "how-it-works": "Our onboarding matches your business. Want to know how we pre-qualify leads before routing them to you?",
  calculator: "Have questions about your calculated revenue leak or baseline numbers? Ask me how we secure that 85% capture rate!",
  proof: "Our systems deliver undeniable results. Ask me about any of our case study metrics or ROI calculations!",
  testimonials: "Our Western Cape clients see massive response time boosts. Do you have questions about client experiences?",
  booking: "Need help booking your Free 30-Minute Strategy Audit? Let me know here, I can explain what's included!",
  faq: "Curious about our SLA packages, FOUNDATION vs OPERATOR vs COMMAND pricing, or retainer support? Ask me anything!",
  whatsapp: "Prefer to chat on WhatsApp? It is our primary channel. Ask me how we integrate custom WhatsApp widgets!"
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", content: "Hi! I'm the LAIS systems expert. Are you losing leads, or do you have a question about our operations?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Show premium tooltip with a slight offset-delay to capture attention
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  // Track scroll section to keep chatbot context-aware
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero", "industries", "problem", "solution", "comparison", "how-it-works", "calculator", "proof", "testimonials", "booking", "faq", "whatsapp"];
      let currentSection = "hero";
      let minDistance = Infinity;

      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Distance from the vertical center of the screen
          const distance = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
          if (distance < minDistance) {
            minDistance = distance;
            currentSection = id;
          }
        }
      });

      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial load execution
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  // Update greeting dynamically ONLY when user hasn't typed anything yet to prevent interrupting conversations
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === "model") {
      const greeting = SECTION_GREETINGS[activeSection] || SECTION_GREETINGS.hero;
      setMessages([{ role: "model", content: greeting }]);
    }
  }, [activeSection, messages.length]);

  // Event trigger orchestration from other UI elements (like FAQ Sections button)
  useEffect(() => {
    const handleOpenChatbot = (e: Event) => {
      const customEvent = e as CustomEvent;
      const initialQuery = customEvent.detail;
      setIsOpen(true);
      setShowTooltip(false);
      if (initialQuery) {
        setInput(initialQuery);
      }
    };

    window.addEventListener("open-chatbot", handleOpenChatbot);
    return () => window.removeEventListener("open-chatbot", handleOpenChatbot);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    
    // Add user message to state
    const newMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Map to Gemini API format
      const apiMessages = newMessages.map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }));

      // Add active section context to help the assistant formulate context-specific answers
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: apiMessages,
          scrollSection: activeSection 
        })
      });

      if (!res.ok) throw new Error("API responded with error");
      
      const data = await res.json();
      setMessages([...newMessages, { role: "model", content: data.text }]);
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: "model", content: "Connection offline. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Animated Entry Tooltip */}
      <div 
        className={`fixed bottom-[148px] md:bottom-[88px] right-6 z-50 max-w-[240px] bg-[#161616] border border-[var(--color-tertiary)]/30 p-3 shadow-[0_10px_30px_rgba(0,0,0,0.6)] rounded-lg transition-all duration-500 transform ${showTooltip && !isOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}
      >
        {/* Pointer pointing to widget button */}
        <div className="absolute bottom-[-6px] right-6 w-3 h-3 bg-[#161616] border-r border-b border-[var(--color-tertiary)]/35 transform rotate-45"></div>
        
        <div className="relative">
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowTooltip(false);
            }}
            className="absolute -top-1.5 -right-1 w-6 h-6 flex items-center justify-center text-[var(--color-muted)] hover:text-white rounded-full transition-colors cursor-pointer"
            aria-label="Dismiss tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          
          <div className="pr-5">
            <p className="text-xs text-[var(--color-neutral-soft)] leading-relaxed font-sans">
              Ask me anything. I'm the 24/7 Employee for Local AI Solutions.
            </p>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setShowTooltip(false);
        }}
        className={`fixed bottom-20 md:bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[var(--color-tertiary)] flex items-center justify-center shadow-[0_0_25px_rgba(249,115,22,0.35)] transition-all duration-300 md:hover:scale-105 ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100 pointer-events-auto'}`}
        aria-label="Open Expert Chat"
      >
        <span className="absolute inset-0 rounded-full border border-[var(--color-tertiary)] animate-ping opacity-25 pointer-events-none" />
        <Bot className="w-6 h-6 text-black" strokeWidth={2} />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-20 md:bottom-8 right-6 md:right-8 z-50 w-[calc(100vw-48px)] md:w-[380px] h-[500px] max-h-[calc(100vh-140px)] md:max-h-[calc(100vh-96px)] rounded-sm border border-[rgba(255,255,255,0.1)] bg-[#111111] shadow-2xl flex flex-col overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-12 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[rgba(255,255,255,0.06)] bg-[#161616]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[rgba(249,115,22,0.1)] flex items-center justify-center">
              <Bot className="w-4 h-4 text-[var(--color-tertiary)]" strokeWidth={2} />
            </div>
            <div>
              <h3 className="font-display text-sm text-white tracking-widest uppercase">LAIS Expert</h3>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)] animate-pulse" />
                <span className="font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-wider">System Online</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="w-11 h-11 flex items-center justify-center text-[var(--color-muted)] md:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] p-3 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[var(--color-tertiary)] text-black rounded-l-md rounded-tr-md font-medium' 
                    : 'bg-[#1a1a1a] text-[var(--color-neutral-soft)] border border-[rgba(255,255,255,0.05)] rounded-r-md rounded-tl-md'
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#1a1a1a] p-3 rounded-r-md rounded-tl-md border border-[rgba(255,255,255,0.05)]">
                <Loader2 className="w-4 h-4 text-[var(--color-tertiary)] animate-spin" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[rgba(255,255,255,0.06)] bg-[#161616]">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about our operational systems..."
              className="w-full bg-[#111111] border border-[rgba(255,255,255,0.1)] text-white text-sm px-4 py-3 placeholder-[var(--color-muted-dark)] focus:outline-none focus:border-[var(--color-tertiary)] transition-colors pr-14 min-h-[44px]"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="absolute right-1 w-11 h-11 flex items-center justify-center text-[var(--color-muted)] md:hover:text-[var(--color-tertiary)] disabled:opacity-50 disabled:md:hover:text-[var(--color-muted)] transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" strokeWidth={2} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
