import { useState } from "react";
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  ChevronDown, 
  Info, 
  MessageSquare, 
  Boxes, 
  Zap, 
  BrainCircuit,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface TrustBadgeItem {
  id: string;
  name: string;
  subtitle: string;
  code: string;
  icon: typeof ShieldCheck;
  accentColor: string;
  tag: string;
  description: string;
  capabilities: string[];
}

interface StackedBadgeGroup {
  id: string;
  groupTitle: string;
  badges: TrustBadgeItem[];
}

const STACKED_BADGE_GROUPS: StackedBadgeGroup[] = [
  {
    id: "group-meta-google",
    groupTitle: "Cloud & Messaging Ecosystem",
    badges: [
      {
        id: "meta-partner",
        name: "Meta Business Partner",
        subtitle: "Official WhatsApp & Meta Business Platform",
        code: "META-BIZ-ZA",
        icon: MessageSquare,
        accentColor: "#0081FB",
        tag: "Official Partner",
        description: "Direct tier-1 access to Meta's WhatsApp Cloud API infrastructure, pre-approved transactional templates, and zero-downtime conversational pipelines.",
        capabilities: ["Direct WhatsApp Cloud API", "Verified Green Tick Integration", "Zero Ban-Risk Compliance"]
      },
      {
        id: "google-workspace",
        name: "Google Workspace Partner",
        subtitle: "Cloud, Gmail, Calendar & Sheets API Deployer",
        code: "G-WORKSPACE-DEV",
        icon: Boxes,
        accentColor: "#4285F4",
        tag: "Certified Deployer",
        description: "Certified deployment of enterprise Google Cloud infrastructure, multi-calendar scheduling sync, and automated spreadsheet CRM pipelines.",
        capabilities: ["Bi-directional Calendar Sync", "Gmail Business Gateway", "Secure Cloud Sheets CRM"]
      }
    ]
  },
  {
    id: "group-manychat-anthropic",
    groupTitle: "Conversational & Reasoning AI",
    badges: [
      {
        id: "manychat-certified",
        name: "ManyChat Certified",
        subtitle: "Conversational Automation Agency",
        code: "MC-CERT-AGENCY",
        icon: Zap,
        accentColor: "#F59E0B",
        tag: "Certified Agency",
        description: "Accredited conversational flow architects specializing in rapid multi-channel lead qualification, instant WhatsApp booking funnels, and SMS failovers.",
        capabilities: ["Omnichannel Flow Logic", "Smart Lead Qualification", "Automated Booking Triggers"]
      },
      {
        id: "anthropic-verified",
        name: "AnthropicAI (Claude) Verified",
        subtitle: "Enterprise LLM & Safety Architecture",
        code: "ANTHROPIC-V-2025",
        icon: BrainCircuit,
        accentColor: "#D97706",
        tag: "Verified Architect",
        description: "Validated production implementations of Claude 3.5 Sonnet and Opus reasoning engines with constitutional safety and zero-hallucination protocols.",
        capabilities: ["Claude 3.5 Sonnet Pipeline", "Constitutional Guardrails", "Strict Zero-Hallucination SLA"]
      }
    ]
  },
  {
    id: "group-g2-raii",
    groupTitle: "Governance & Client Excellence",
    badges: [
      {
        id: "g2-raii-member",
        name: "G2 & RAII Member",
        subtitle: "Top-Rated SME Agency & Responsible AI Institute",
        code: "G2-RAII-ETHICS",
        icon: ShieldCheck,
        accentColor: "#10B981",
        tag: "Peer-Reviewed & RAII",
        description: "Ranked on G2 for outstanding SME satisfaction (4.9/5 CSAT) and accredited by the Responsible AI Institute (RAII) for ethical AI safety and transparency.",
        capabilities: ["G2 Enterprise Satisfaction Rating", "RAII Ethical Framework Compliant", "Bank-Grade POPIA Data Handling"]
      },
      {
        id: "responsible-ai-charter",
        name: "RAII Responsible AI Institute",
        subtitle: "Audited Ethical & Privacy Standards",
        code: "RAII-CERT-AUTH",
        icon: Award,
        accentColor: "#059669",
        tag: "Accredited Member",
        description: "Active member adhering to the Responsible AI Institute guidelines for bias elimination, algorithmic transparency, and strict client data sovereignty.",
        capabilities: ["POPIA & GDPR Compliant", "Independent Bias Auditing", "Client Data Sovereignty Guarantee"]
      }
    ]
  }
];

export function TrustBar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    setActiveDropdown(prev => prev === id ? null : id);
  };

  return (
    <section className="bg-[var(--color-primary-surface)] py-10 sm:py-12 border-y border-[rgba(255,255,255,0.05)] relative overflow-hidden">
      <div className="absolute inset-0 bg-ethereal-glow pointer-events-none opacity-20" />
      
      <div className="container relative z-10 max-w-6xl">
        {/* Core Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 text-center pb-8 mb-8 border-b border-[rgba(255,255,255,0.06)]">
          <div className="flex flex-col items-center reveal-up" style={{ transitionDelay: '100ms' }}>
            <span className="font-display text-3xl sm:text-4xl md:text-5xl text-[var(--color-tertiary)] tracking-tight mb-1 font-bold">40+</span>
            <span className="font-mono text-[11px] text-[var(--color-muted)] uppercase tracking-[0.2em] font-medium">Local Businesses Served</span>
          </div>
          <div className="flex flex-col items-center reveal-up" style={{ transitionDelay: '200ms' }}>
            <span className="font-display text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-1 font-bold">&lt; 60s</span>
            <span className="font-mono text-[11px] text-[var(--color-muted)] uppercase tracking-[0.2em] font-medium">Average Response Time</span>
          </div>
          <div className="flex flex-col items-center reveal-up" style={{ transitionDelay: '300ms' }}>
            <span className="font-display text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-1 font-bold">R2.4M+</span>
            <span className="font-mono text-[11px] text-[var(--color-muted)] uppercase tracking-[0.2em] font-medium">Revenue Recovered</span>
          </div>
        </div>

        {/* Verified Certifications & Accreditations (Stacked 2 together for compact space) */}
        <div className="reveal-up" style={{ transitionDelay: '350ms' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
              <p className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-muted)] font-semibold">
                Verified Certifications & Accreditations
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 font-mono text-[10px] text-[var(--color-muted-dark)] uppercase">
              <Sparkles className="w-3 h-3 text-[var(--color-tertiary)]" />
              Click badge for accreditation details
            </span>
          </div>

          {/* 3 Columns, each stacking 2 badges together vertically */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {STACKED_BADGE_GROUPS.map((group, groupIdx) => (
              <div 
                key={group.id}
                className="rounded-xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.07)] p-2.5 flex flex-col gap-2 hover:border-[rgba(249,115,22,0.3)] transition-colors duration-300"
              >
                {group.badges.map((badge, badgeIdx) => {
                  const Icon = badge.icon;
                  const isOpen = activeDropdown === badge.id;
                  const isHovered = hoveredBadge === badge.id;

                  return (
                    <div 
                      key={badge.id}
                      className="relative"
                      onMouseEnter={() => setHoveredBadge(badge.id)}
                      onMouseLeave={() => setHoveredBadge(null)}
                    >
                      {/* Compact Stacked Badge Row */}
                      <button
                        type="button"
                        onClick={() => toggleDropdown(badge.id)}
                        className={`w-full text-left p-2.5 rounded-lg transition-all duration-200 flex items-center justify-between gap-2.5 cursor-pointer ${
                          isOpen 
                            ? "bg-[rgba(249,115,22,0.08)] border border-[rgba(249,115,22,0.3)]" 
                            : "bg-[rgba(255,255,255,0.015)] border border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.1)]"
                        }`}
                        aria-expanded={isOpen}
                        aria-label={`Toggle details for ${badge.name}`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {/* Mini Icon */}
                          <div 
                            className="w-7 h-7 rounded-md bg-[#111] border border-white/10 flex items-center justify-center shrink-0"
                            style={{ color: badge.accentColor }}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>

                          {/* Title & Tag */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h4 className="font-body text-xs font-semibold text-white truncate group-hover:text-[var(--color-tertiary)]">
                                {badge.name}
                              </h4>
                            </div>
                            <p className="font-mono text-[10px] text-[var(--color-muted)] truncate">
                              {badge.tag}
                            </p>
                          </div>
                        </div>

                        {/* Verified badge & chevron toggle */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Verified
                          </span>
                          <div className={`w-5 h-5 rounded flex items-center justify-center text-[var(--color-muted)] hover:text-white transition-transform ${isOpen ? "rotate-180 text-[var(--color-tertiary)]" : ""}`}>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </button>

                      {/* Instant Hover Tooltip (if not actively opened in dropdown) */}
                      {isHovered && !isOpen && (
                        <div className="hidden lg:block absolute bottom-full left-0 right-0 mb-1.5 z-30 pointer-events-none">
                          <div className="bg-slate-900 dark:bg-[#151515] border border-white/15 rounded-lg p-2.5 shadow-2xl text-[11px] font-body text-slate-200">
                            <div className="flex items-center justify-between font-mono text-[9px] text-[var(--color-tertiary)] uppercase font-semibold mb-1">
                              <span>{badge.code}</span>
                              <span className="text-emerald-400">Verified Active</span>
                            </div>
                            <p className="line-clamp-2 text-slate-300 leading-snug">
                              {badge.description}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Expandable Accordion Dropdown Details */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden mt-1.5"
                          >
                            <div className="p-3 rounded-lg bg-[#0c0c0c] border border-white/10 text-xs space-y-2">
                              <div className="flex items-center justify-between pb-1.5 border-b border-white/10 font-mono text-[10px]">
                                <span className="text-[var(--color-tertiary)] font-bold">{badge.code}</span>
                                <span className="text-emerald-400 flex items-center gap-1 font-medium">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Active Accreditation
                                </span>
                              </div>

                              <p className="font-body text-[11px] text-slate-300 leading-relaxed">
                                {badge.description}
                              </p>

                              <div className="space-y-1 pt-1">
                                <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--color-muted)] font-semibold">
                                  Enterprise Standards:
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {badge.capabilities.map((cap, i) => (
                                    <span 
                                      key={i}
                                      className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[9px] text-slate-300"
                                    >
                                      ✓ {cap}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
