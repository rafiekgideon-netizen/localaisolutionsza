# Local AI Solutions (LAIS) — Cape Town Lead Capture & Revenue Recovery

A high-converting, responsive landing page engineered for **Local AI Solutions (LAIS)**, providing autonomous 24/7 lead capture, instant WhatsApp response automation, and revenue leak recovery for businesses across Cape Town and the Western Cape, South Africa.

---

## 🚀 Key Features

### 1. Interactive ROI & Revenue Recovery Calculator
- **Dynamic Recharts Visualization**: Interactive multi-month revenue recovery trend chart (`AreaChart` with smooth gradient fill) that adapts in real-time to user sliders (missed calls, average job value, admin overhead, response latency).
- **Multi-View Inspection**: Toggle smoothly between **Trend View** (6-month compounding run-rate projection), **Breakdown View** (bar comparison of current turnover vs. captured leaks), and **List View** (itemized financial breakdown).
- **Graceful Skeleton Loading**: Integrated skeleton placeholder during initial calculation hydration to ensure zero layout shift.

### 2. Guided Audit Questionnaire Modal
- **Multi-Step Assessment**: Step-by-step interactive workflow qualifying business bottlenecks (response latency, dispatch methods, missed call volume).
- **Real-Time Input Validation**: Rigorous client-side verification of South African & international phone numbers (`+27` / `08x`), email syntax, and contact metadata.
- **Accessibility (A11y)**: Full keyboard navigation support — press `Enter` to advance through steps or submit, and `Esc` to safely dismiss dialogs with proper `aria-*` tags and focus trapping.
- **Confetti Celebration**: Subtle canvas-confetti particle effect triggering upon successful submission, with an interactive replay option.

### 3. Cape Town Regional Authority & Trust Badges
- **Verified Local Accreditations**: Animated trust badges highlighting partnerships with the **Cape Chamber of Commerce**, **Silicon Cape Tech Ecosystem**, **POPIA South African Data Compliance**, and **Western Cape Metro Commerce**.
- **Performance Metrics**: Verified proof points including 40+ local businesses served, <60s average response SLA, and R2.4M+ recovered revenue.

### 4. Advanced UX & Design Craft
- **Section-Aware Scroll Progress Bar**: Ambient top progress bar that dynamically shifts color as users navigate from the hero section to the calculator and final CTA.
- **Strict Mobile Optimization**: Guaranteed single-axis vertical scrolling with zero horizontal overflow on mobile viewports.
- **Schema.org SEO**: Location-specific `LocalBusiness` JSON-LD structured data anchored to Cape Town coordinates (`-33.9249`, `18.4241`) for enhanced local search visibility.

---

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom ethereal dark theme variables
- **Animations**: `motion` (`motion/react`)
- **Visualizations**: `recharts`
- **Icons**: `lucide-react`
- **Celebration Effects**: `canvas-confetti`
- **Build Tool**: Vite
- **Server**: Express (Node.js full-stack proxy architecture)

---

## 📂 Project Structure

```text
├── index.html                   # HTML entry point with Cape Town LocalBusiness Schema.org JSON-LD
├── metadata.json                # Project identification and capabilities
├── package.json                 # Dependency definitions and scripts
├── server.ts                    # Full-stack Express + Vite integration server
├── src/
│   ├── App.tsx                  # Root application assembly & modal state management
│   ├── components/
│   │   ├── CalculatorSection.tsx       # Interactive revenue recovery calculator & trend chart
│   │   ├── QuestionnaireModal.tsx      # Multi-step audit questionnaire with validation & a11y
│   │   ├── QuestionnaireSuccessView.tsx# Completion view with confetti trigger
│   │   ├── TrustBar.tsx                # Regional stats & animated Cape Town trust badges
│   │   ├── ScrollProgressBar.tsx       # Section-aware ambient scroll progress indicator
│   │   ├── SectionSkeletons.tsx        # Skeleton placeholders for calculator & testimonials
│   │   ├── HeroSection.tsx             # Primary conversion header & value proposition
│   │   ├── FeaturesSection.tsx         # Autonomous lead capture architectural breakdown
│   │   ├── TestimonialsSection.tsx     # Local Cape Town client success testimonials
│   │   ├── FinalCTASection.tsx         # Bottom closing action
│   │   ├── Header.tsx / Footer.tsx     # Navigation & regional footer
│   │   └── ui/                         # Reusable primitives (buttons, modals, cards)
│   ├── utils/
│   │   └── confetti.ts                 # Canvas confetti controller utility
│   ├── index.css                       # Global Tailwind styling & theme definitions
│   └── main.tsx                        # Application mount entry point
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or bun

### Installation
```bash
# Clone repository
git clone https://github.com/your-username/local-ai-solutions-capetown.git

# Enter directory
cd local-ai-solutions-capetown

# Install dependencies
npm install
```

### Running Locally
```bash
# Start dev server on http://localhost:3000
npm run dev
```

### Building for Production
```bash
# Compile client assets and backend bundle
npm run build

# Start production server
npm start
```

---

## 📍 Target Geography & Compliance

- **Primary Market**: Cape Town, Western Cape, South Africa
- **Regulatory Adherence**: POPIA (Protection of Personal Information Act, South Africa)
- **Currency Support**: South African Rand (ZAR / R)
# localaisolutionsza
