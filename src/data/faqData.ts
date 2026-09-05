export interface FAQItem {
  category: string;
  q: string;
  a: string;
}

export const FAQS: FAQItem[] = [
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

export const FAQ_CATEGORIES = [
  "All",
  "Pricing",
  "Support",
  "Contracts",
  "ROI",
  "Complexity",
  "Platform",
  "Onboarding",
  "Audit"
];

export interface QuizOption {
  label: string;
  points: number;
}

export interface QuizQuestion {
  title: string;
  question: string;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
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

export interface RecommendationTier {
  title: string;
  price: string;
  desc: string;
  deliverables: string[];
  conversionTip: string;
}

export function getRecommendedTier(totalScore: number): RecommendationTier {
  if (totalScore >= 8) {
    return {
      title: "COMMAND PACKAGE",
      price: "R28,000 - R55,000 Once-off + R5,500/mo retainer",
      desc: "Designed for scaling enterprises and multi-staff organizations needing seamless operational pipes.",
      deliverables: ["Full custom business workflow design", "CRM, invoicing, & payments sync", "Staff hand-offs and live monitoring tools", "Top-tier custom AI knowledge integration", "Quarterly optimization audits & dedicated priority SLA"],
      conversionTip: "Reclaim up to 15-25 hours per week of admin chores with custom automated flow systems."
    };
  }
  if (totalScore >= 5) {
    return {
      title: "OPERATOR PACKAGE",
      price: "R12,500 - R22,000 Once-off + R2,500/mo retainer",
      desc: "Perfect for active systems. Installs a dedicated AI Agent employee answering questions 24/7.",
      deliverables: ["Full premium custom smart website", "24/7 AI Agent Employee on WhatsApp", "Missed-Call text-back automations", "Standard calendar & CRM setup"],
      conversionTip: "Deploy your conversational AI receptionist immediately. Stop losing late-evening calls!"
    };
  }
  return {
    title: "FOUNDATION PACKAGE",
    price: "R4,500 - R8,500 Once-off",
    desc: "Best suited for small teams requiring immediate local website conversion optimization.",
    deliverables: ["Mobile-First conversion design", "WhatsApp CTA integration", "Basic automated lead-routing form", "Google Business Profile mapping"],
    conversionTip: "Establish your high-conversion online base. Secure consistent lead traffic first."
  };
}
