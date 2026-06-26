import { Globe, RefreshCw, Bot, FileCheck, ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import BorderGlow from "../../components/BorderGlow";
import { SlidingTextButton } from "./ui/sliding-text-button";

interface SolutionSectionProps {
  onOpenAudit?: () => void;
}

export function SolutionSection({ onOpenAudit }: SolutionSectionProps) {
  const solutions = [
    {
      title: "Smart Website",
      desc: "Converts traffic into WhatsApp leads. Not a digital brochure, but a conversion engine.",
      outcome: "Every visitor becomes a conversation",
      icon: <Globe strokeWidth={1} className="w-8 h-8 text-white md:group-hover:text-[var(--color-tertiary)] transition-colors duration-500" />,
      colSpan: "md:col-span-2 lg:col-span-5"
    },
    {
      title: "Automated Workflows",
      desc: "Handles quoting, scheduling, and follow-up instantly.",
      outcome: "15+ admin hours recovered per week",
      icon: <RefreshCw strokeWidth={1} className="w-8 h-8 text-white md:group-hover:text-[var(--color-tertiary)] transition-colors duration-500" />,
      colSpan: "md:col-span-1 lg:col-span-7"
    },
    {
      title: "24/7 AI Agent",
      desc: "Answers calls, chats on WhatsApp, captures leads, and books jobs. Automatically.",
      outcome: "Never miss a lead — even at 2am",
      icon: <Bot strokeWidth={1} className="w-8 h-8 text-white md:group-hover:text-[var(--color-tertiary)] transition-colors duration-500" />,
      colSpan: "md:col-span-2 lg:col-span-8"
    },
    {
      title: "AI Strategy",
      desc: "Maps your revenue leaks and builds a tailored recovery plan.",
      outcome: "Clear roadmap. Measurable ROI.",
      icon: <FileCheck strokeWidth={1} className="w-8 h-8 text-white md:group-hover:text-[var(--color-tertiary)] transition-colors duration-500" />,
      colSpan: "md:col-span-1 lg:col-span-4"
    }
  ];

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <section id="solutions" className="section-padding relative overflow-hidden bg-[#050505] border-y border-[rgba(255,255,255,0.06)]" ref={sectionRef}>
      
      <div className="container relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="mb-20 max-w-2xl"
        >
          <div className="eyebrow-pill mb-6 bg-[rgba(249,115,22,0.05)] border-[rgba(249,115,22,0.15)] text-[var(--color-tertiary)] tracking-[0.25em]">THE SOLUTION</div>
          <h2 className="font-display text-display-lg text-white mb-6">We build systems that<br/><span className="text-[var(--color-tertiary)] opacity-90">recover your revenue</span>.</h2>
          <p className="font-body text-body-lg text-[rgba(255,255,255,0.6)]">No jargon. No complexity. Just automated systems that capture leads, respond instantly, and free up your time.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6 mb-16">
          {solutions.map((sol, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 1, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className={`flex ${sol.colSpan}`}
            >
              <BorderGlow
                edgeSensitivity={30}
                glowColor="29 93 52"
                backgroundColor="#070707"
                borderRadius={24}
                glowRadius={40}
                glowIntensity={1}
                coneSpread={25}
                animated
                colors={['#f68712', '#f68712', '#ffffff']}
                className="w-full flex"
              >
                <div className={`glass-card group rounded-[24px] p-8 md:p-10 flex flex-col justify-between flex-1 w-full relative z-10 overflow-hidden`}>
                  <div className="absolute inset-0 pointer-events-none rounded-[24px] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] z-10" />
                  
                  <div className="relative z-20">
                    <div className="w-16 h-16 rounded-2xl bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] flex items-center justify-center mb-8 md:group-hover:scale-105 md:group-hover:bg-[rgba(255,255,255,0.06)] md:group-hover:border-[rgba(249,115,22,0.2)] md:group-hover:shadow-[0_0_20px_rgba(249,115,22,0.15)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]">
                      {sol.icon}
                    </div>
                    <h3 className="font-display text-3xl text-white mb-4 tracking-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">{sol.title}</h3>
                    <p className="font-body text-body-md text-[rgba(255,255,255,0.6)] mb-8">{sol.desc}</p>
                  </div>
                  <div className="pt-6 border-t border-[rgba(255,255,255,0.06)] mt-auto relative z-20">
                    <p className="font-mono text-xs text-[var(--color-tertiary)] tracking-[0.1em] drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]">OUTCOME: {sol.outcome}</p>
                  </div>
                </div>
              </BorderGlow>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex w-full"
        >
          <BorderGlow
            edgeSensitivity={30}
            glowColor="29 93 52"
            backgroundColor="#070707"
            borderRadius={24}
            glowRadius={40}
            glowIntensity={1}
            coneSpread={25}
            animated
            colors={['#f68712', '#f68712', '#ffffff']}
            className="w-full"
          >
            <div className="glass-card rounded-[24px] relative overflow-hidden w-full h-full">
              <div className="absolute inset-0 pointer-events-none rounded-[24px] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-[rgba(255,255,255,0.02)] via-[rgba(249,115,22,0.04)] to-transparent opacity-80 z-0" />
              
              <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 z-20">
                <div className="max-w-xl">
                  <h3 className="font-display text-4xl text-white tracking-tight mb-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">Free AI Strategy Audit</h3>
                  <p className="font-body text-body-md text-[rgba(255,255,255,0.6)]">A 30-minute session to identify your top revenue leaks and map out an automation recovery plan.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0">
                  <span className="font-telemetry text-2xl text-[var(--color-tertiary)] hidden sm:block font-medium drop-shadow-[0_0_12px_rgba(249,115,22,0.4)]">COST: R0</span>
                  <SlidingTextButton onClick={onOpenAudit} className="w-full sm:w-auto">
                    Book Free Audit
                    <div className="flex items-center justify-center bg-[rgba(0,0,0,0.1)] rounded-full w-8 h-8 ml-2">
                      <ArrowRight strokeWidth={2.5} className="w-4 h-4 text-[#050505]" />
                    </div>
                  </SlidingTextButton>
                </div>
              </div>
            </div>
          </BorderGlow>
        </motion.div>
      </div>
    </section>
  );
}
