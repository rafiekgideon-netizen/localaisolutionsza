import { PhoneCall, MoonStar, Clock, CircleX, Share2 } from "lucide-react";
import { useEffect, useRef } from "react";
import { WhatsAppIcon } from "./WhatsAppIcon";
import { motion } from "motion/react";

export function ProblemSection() {
  const problems = [
    {
      id: "01",
      title: "Missed Calls",
      desc: "Calls ring out after hours. That lead calls your competitor. Every unanswered ring is lost revenue.",
      icon: <PhoneCall strokeWidth={1} className="w-8 h-8 text-[var(--color-error)]" />,
      colSpan: "md:col-span-2 lg:col-span-8"
    },
    {
      id: "02",
      title: "Slow WhatsApp",
      desc: "Takes hours to reply. The job was gone in 4 minutes.",
      icon: <WhatsAppIcon size={32} colored={true} />,
      colSpan: "md:col-span-1 lg:col-span-4"
    },
    {
      id: "03",
      title: "After-Hours Invisibility",
      desc: "Enquiries at 9pm. Your business doesn't exist until 8am. That's 14 hours of zero response.",
      icon: <MoonStar strokeWidth={1} className="w-8 h-8 text-[var(--color-muted)]" />,
      colSpan: "md:col-span-1 lg:col-span-4"
    },
    {
      id: "04",
      title: "Manual Admin Overload",
      desc: "Quoting, scheduling, invoicing — all done by hand, eating your weekends.",
      icon: <Clock strokeWidth={1} className="w-8 h-8 text-[var(--color-warning)]" />,
      colSpan: "md:col-span-2 lg:col-span-8"
    },
    {
      id: "05",
      title: "Poor Lead Follow-Up",
      desc: "Leads come in. Nobody follows up. Revenue simply walks out the door.",
      icon: <CircleX strokeWidth={1} className="w-8 h-8 text-[var(--color-error)]" />,
      colSpan: "md:col-span-2 lg:col-span-6"
    },
    {
      id: "06",
      title: "Disconnected Chaos",
      desc: "WhatsApp, spreadsheets, paper — nothing talks to anything.",
      icon: <Share2 strokeWidth={1} className="w-8 h-8 text-[var(--color-muted)]" />,
      colSpan: "md:col-span-1 lg:col-span-6"
    }
  ];

  const sectionRef = useRef<HTMLDivElement>(null);

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
    <section id="problems" className="section-padding bg-[var(--color-primary)] relative" ref={sectionRef}>
      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 reveal-up">
          <div className="max-w-2xl">
            <div className="eyebrow-pill mb-6">THE PROBLEM</div>
            <h2 className="font-display text-display-lg text-white">
              Six ways your business is <span className="text-[var(--color-error)]">bleeding revenue</span>.
            </h2>
          </div>
          <p className="font-body text-body-lg text-[var(--color-muted)] max-w-sm mb-2">
            These are not technology problems. They are revenue problems costing you every single day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6">
          {problems.map((prob, index) => (
            <motion.div whileHover={{ scale: 1.02 }} key={prob.id} className={`ethereal-card-shell reveal-up ${prob.colSpan}`} style={{ transitionDelay: `${index * 100}ms` }}>
              <div className="ethereal-card-core flex flex-col group min-h-[240px]">
                <div className="flex justify-between items-start mb-8 opacity-70 md:group-hover:opacity-100 transition-opacity duration-300">
                  {prob.icon}
                  <span className="font-telemetry text-sm text-[var(--color-muted-dark)]">{prob.id}</span>
                </div>
                <div className="mt-auto">
                  <h3 className="font-display text-2xl text-white mb-3">{prob.title}</h3>
                  <p className="font-body text-body-sm text-[var(--color-muted)]">{prob.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
