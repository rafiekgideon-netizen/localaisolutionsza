export interface AuditFormData {
  businessName: string;
  businessType: string;
  location: string;
  staff: string;
  challenge: string;
  leadSource: string;
  responseMethod: string;
  missedCalls: string;
  phone: string;
  email: string;
  desiredOutcome: string;
  preferredTime: string;
}

export const INITIAL_FORM_DATA: AuditFormData = {
  businessName: "",
  businessType: "",
  location: "",
  staff: "",
  challenge: "",
  leadSource: "",
  responseMethod: "",
  missedCalls: "",
  phone: "",
  email: "",
  desiredOutcome: "",
  preferredTime: ""
};

export const fieldValidators: Record<keyof AuditFormData, (val: string) => string> = {
  businessName: (val) => {
    const trimmed = val.trim();
    if (!trimmed) return "Business name is required";
    if (trimmed.length < 2) return "Business name must be at least 2 characters";
    return "";
  },
  businessType: (val) => {
    if (!val) return "Please select your business type";
    return "";
  },
  location: (val) => {
    const trimmed = val.trim();
    if (!trimmed) return "Location is required (e.g. Cape Town, Bellville)";
    if (trimmed.length < 2) return "Please enter a valid city or area";
    return "";
  },
  staff: () => "", // Optional selection
  challenge: (val) => {
    if (!val) return "Please select your biggest challenge";
    return "";
  },
  leadSource: (val) => {
    if (!val) return "Please select your primary lead source";
    return "";
  },
  responseMethod: (val) => {
    if (!val) return "Please select how you currently handle enquiries";
    return "";
  },
  missedCalls: (val) => {
    if (!val) return "Please indicate if you miss calls or leads";
    return "";
  },
  phone: (val) => {
    const trimmed = val.trim();
    if (!trimmed) return "WhatsApp / Mobile number is required";
    const digitsOnly = trimmed.replace(/\D/g, "");
    if (digitsOnly.length < 9 || digitsOnly.length > 15) {
      return "Please enter a valid phone number (e.g. 082 555 1234 or +27 82 555 1234)";
    }
    return "";
  },
  email: (val) => {
    const trimmed = val.trim();
    if (!trimmed) return "Email address is required";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmed)) {
      return "Please enter a valid email address (e.g. name@company.co.za)";
    }
    return "";
  },
  desiredOutcome: (val) => {
    if (!val) return "Please select your desired outcome";
    return "";
  },
  preferredTime: (val) => {
    if (!val) return "Please select a preferred consultation time";
    return "";
  }
};

export const stepFields: Record<number, (keyof AuditFormData)[]> = {
  1: ["businessName", "businessType", "location"],
  2: ["challenge", "leadSource", "responseMethod", "missedCalls"],
  3: ["phone", "email"],
  4: ["desiredOutcome", "preferredTime"]
};

export const QUESTIONNAIRE_STEPS = [
  { id: 1, label: "Business" },
  { id: 2, label: "Challenges" },
  { id: 3, label: "Contact" },
  { id: 4, label: "Goals" }
];

export const BUSINESS_TYPES = [
  { value: "Trades", label: "Trades (Electrician, Plumber, etc.)" },
  { value: "Automotive", label: "Automotive (Dealership, Detailing, etc.)" },
  { value: "Health & Beauty", label: "Health & Beauty" },
  { value: "Home Services", label: "Home Services" },
  { value: "Retail & F&B", label: "Retail & F&B" },
  { value: "Other", label: "Other" }
];

export const STAFF_OPTIONS = ['Just me', '2–5', '6–15', '15+'];

export const CHALLENGE_OPTIONS = [
  "Missing too many calls",
  "Slow WhatsApp response",
  "After-hours enquiries going cold",
  "Too much manual admin",
  "Poor lead follow-up",
  "Not enough new leads",
  "No system — doing it all manually",
  "Hard to track where leads come from"
];

export const LEAD_SOURCE_OPTIONS = [
  "Word of mouth / referrals",
  "Google / website",
  "Facebook / Instagram",
  "WhatsApp groups",
  "Walk-ins / signage",
  "Gumtree / Marketplace"
];

export const RESPONSE_METHOD_OPTIONS = [
  "Answer calls manually",
  "Reply to WhatsApp when I can",
  "Email when I remember",
  "No system — I just wing it",
  "I have someone who handles it",
  "Mix of all of the above"
];

export const MISSED_CALLS_OPTIONS = ['Yes — regularly', 'Sometimes', 'Rarely'];

export const DESIRED_OUTCOME_OPTIONS = [
  "More leads per month",
  "Faster response to enquiries",
  "Less manual admin",
  "Never miss a call again",
  "Work less, earn more",
  "Scale without hiring more staff",
  "Understand where my leads come from",
  "All of the above"
];

export const PREFERRED_TIME_OPTIONS = [
  "Weekday morning (8am–12pm)",
  "Weekday afternoon (1pm–5pm)",
  "Weekday evening (5pm–7pm)",
  "Saturday morning"
];
