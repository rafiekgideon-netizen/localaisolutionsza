import { useState, useEffect, useRef, useMemo } from "react";
import { ArrowRight, BarChart3, List, TrendingUp, Sparkles, CalendarClock, ShieldCheck, Clock3 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SlidingTextButton } from "./ui/sliding-text-button";
import { useTheme } from "../context/ThemeContext";
import { 
  BarChart, 
  Bar, 
  AreaChart,
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  CartesianGrid
} from "recharts";

interface CalculatorSectionProps {
  onOpenAudit?: () => void;
}

const formatZAR = (val: number) => {
  return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(val);
};

// Fluid real-time count-up animation component
function CountUpNumber({ 
  value, 
  formatFn, 
  duration = 450 
}: { 
  value: number; 
  formatFn?: (val: number) => string;
  duration?: number;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const startValue = prevValueRef.current;
    const endValue = value;

    if (startValue === endValue) {
      setDisplayValue(endValue);
      return;
    }

    let startTimestamp: number | null = null;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startValue + (endValue - startValue) * eased);

      setDisplayValue(current);

      if (progress < 1) {
        animFrameRef.current = window.requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
        prevValueRef.current = endValue;
      }
    };

    if (animFrameRef.current) {
      window.cancelAnimationFrame(animFrameRef.current);
    }
    animFrameRef.current = window.requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) {
        window.cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [value, duration]);

  return <span>{formatFn ? formatFn(displayValue) : displayValue.toLocaleString()}</span>;
}

export function CalculatorSection({ onOpenAudit }: CalculatorSectionProps) {
  const { theme } = useTheme();
  const isLight = theme === "light";

  // Calculator input states
  const [monthlyTurnover, setMonthlyTurnover] = useState(50000);
  const [callsMissed, setCallsMissed] = useState(3);
  const [jobValue, setJobValue] = useState(2500);
  const [adminHours, setAdminHours] = useState(10);
  const [responseSpeedOption, setResponseSpeedOption] = useState<string>("30min-2hr");
  const [viewMode, setViewMode] = useState<"trend" | "breakdown" | "list">("trend");
  const [isLiveCalculating, setIsLiveCalculating] = useState(false);

  // Trigger brief visual telemetry activity pulse when user touches sliders
  const handleSliderChange = (setter: (val: any) => void, val: any) => {
    setter(val);
    setIsLiveCalculating(true);
  };

  useEffect(() => {
    if (!isLiveCalculating) return;
    const timer = setTimeout(() => {
      setIsLiveCalculating(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [isLiveCalculating, monthlyTurnover, callsMissed, jobValue, adminHours, responseSpeedOption]);

  // Core calculations
  const { missedCallsLoss, slowResponseLoss, adminLoss, totalLoss } = useMemo(() => {
    const workingDays = 20;
    const conversionRate = 0.15; // 15% conversion benchmark
    
    const missedLoss = callsMissed * jobValue * workingDays * conversionRate;
    
    let penaltyMultiplier = 0.1;
    if (responseSpeedOption === "5-30min") penaltyMultiplier = 0.05;
    else if (responseSpeedOption === "30min-2hr") penaltyMultiplier = 0.15;
    else if (responseSpeedOption === "2hr+") penaltyMultiplier = 0.25;
    else if (responseSpeedOption === "< 5min") penaltyMultiplier = 0.0;
    
    const assumedLeads = 10;
    const slowLoss = assumedLeads * jobValue * workingDays * conversionRate * penaltyMultiplier;
    const adminCost = adminHours * 300 * 4;

    return {
      missedCallsLoss: missedLoss,
      slowResponseLoss: slowLoss,
      adminLoss: adminCost,
      totalLoss: missedLoss + slowLoss + adminCost,
    };
  }, [callsMissed, jobValue, adminHours, responseSpeedOption]);

  // 85% capture benchmark as stated in Cape Town automation documentation
  const recoveredRevenue = totalLoss * 0.85;
  const growthPercentage = monthlyTurnover > 0 ? (recoveredRevenue / monthlyTurnover) * 100 : 0;

  // Annual Projections
  const annualRecovered = recoveredRevenue * 12;
  const annualLeak = totalLoss * 12;
  const annualRunRate = (monthlyTurnover * 12) + annualRecovered;
  const annualHoursSaved = adminHours * 4 * 12;
  const annualLeadsSaved = Math.round(callsMissed * 20 * 12 * 0.85);

  // Multi-month interactive trend projection data calculated from user sliders
  const recoveryTrendData = useMemo(() => {
    const months = [
      { month: "M1", monthLabel: "Month 1 (Go-Live)", multiplier: 0.70 },
      { month: "M2", monthLabel: "Month 2 (Routing Active)", multiplier: 0.85 },
      { month: "M3", monthLabel: "Month 3 (Peak Capture)", multiplier: 1.00 },
      { month: "M4", monthLabel: "Month 4 (Compounding)", multiplier: 1.05 },
      { month: "M5", monthLabel: "Month 5 (Compounding)", multiplier: 1.10 },
      { month: "M6", monthLabel: "Month 6 (Matured Baseline)", multiplier: 1.15 },
    ];

    let runningCumulative = 0;
    return months.map(m => {
      const monthly = Math.round(recoveredRevenue * m.multiplier);
      runningCumulative += monthly;
      const callsSaved = Math.round(callsMissed * 20 * m.multiplier * 0.85);
      return {
        month: m.month,
        monthLabel: m.monthLabel,
        monthlyRecovered: monthly,
        cumulativeRecovered: runningCumulative,
        callsSaved
      };
    });
  }, [recoveredRevenue, callsMissed]);

  const chartData = [
    { name: "Current Turnover", value: monthlyTurnover, color: isLight ? "#94A3B8" : "#737373" },
    { name: "Captured Leak", value: totalLoss, color: "#ef4444" },
    { name: "LAIS Recovered", value: recoveredRevenue, color: "#f97316" },
    { name: "Projected Total", value: monthlyTurnover + recoveredRevenue, color: "#10b981" }
  ];

  const axisColor = isLight ? "rgba(15, 23, 42, 0.45)" : "rgba(255, 255, 255, 0.3)";
  const gridColor = isLight ? "rgba(15, 23, 42, 0.08)" : "rgba(255, 255, 255, 0.06)";

  return (
    <section 
      id="calculator" 
      className="section-padding bg-[var(--color-primary-surface)] relative overflow-hidden calculator-container"
      style={{ backdropFilter: "none", WebkitBackdropFilter: "none", filter: "none" }}
    >
      <div className="absolute inset-0 bg-ethereal-glow pointer-events-none opacity-20" />
      <div className="container max-w-6xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="eyebrow-pill mb-4 mx-auto inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            TELEMETRY & ROI
          </div>
          <h2 className="font-display text-display-lg text-white mb-4">Calculate Your Revenue Leak</h2>
          <p className="font-body text-body-lg text-[var(--color-muted)] max-w-2xl mx-auto">
            Input your current operational numbers to expose the hidden cost of missed calls and slow responses.
          </p>

          {/* Subtle Live Telemetry Status Bar */}
          <div className="mt-4 inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-xs font-mono text-[var(--color-muted)]">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Cape Town Contractor Telemetry</span>
            <span className="text-black/30 dark:text-white/30">•</span>
            <span className="text-[var(--color-tertiary)] font-semibold">Live Auto-Calibrating</span>
          </div>
        </div>

        {/* Main Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full min-w-0">
          
          {/* Inputs Column */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-7 ethereal-card-shell h-full w-full min-w-0"
          >
            <div className="ethereal-card-core h-full flex flex-col p-6 sm:p-8 md:p-10 w-full min-w-0 relative">
              {/* Subtle Calculation Activity Shimmer */}
              {isLiveCalculating && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[var(--color-tertiary)] to-transparent animate-pulse" />
              )}

              <div className="flex items-center justify-between mb-6 pb-4 border-b border-black/10 dark:border-white/10">
                <h3 className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest font-semibold flex items-center gap-2">
                  <Clock3 className="w-3.5 h-3.5 text-[var(--color-tertiary)]" />
                  Capture Parameters
                </h3>
                <span className="text-[11px] font-mono text-[var(--color-muted-dark)] hidden sm:inline">
                  Adjust sliders to simulate
                </span>
              </div>
              
              <div className="space-y-6 sm:space-y-8 flex-1 w-full min-w-0">
                {/* Monthly Turnover Slider */}
                <div className="group">
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="calc-turnover" className="font-mono text-xs text-white uppercase tracking-wider font-semibold">
                      Current Monthly Turnover
                    </label>
                    <span className="font-mono text-base sm:text-lg text-[var(--color-tertiary)] font-bold">
                      R {monthlyTurnover.toLocaleString()}
                    </span>
                  </div>
                  <input 
                    id="calc-turnover"
                    type="range" min="10000" max="300000" step="5000" 
                    value={monthlyTurnover} 
                    onChange={(e) => handleSliderChange(setMonthlyTurnover, Number(e.target.value))}
                    className="w-full cursor-pointer transition-colors"
                  />
                  <span className="font-mono text-[10px] text-[var(--color-muted-dark)] block mt-1">
                    Baseline turnover to calculate your recovered percentage
                  </span>
                </div>

                {/* Missed Calls Slider */}
                <div className="group">
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="calc-missed-calls" className="font-mono text-xs text-white uppercase tracking-wider font-semibold">
                      Missed Calls Per Day
                    </label>
                    <span className="font-mono text-base sm:text-lg text-[var(--color-tertiary)] font-bold">
                      {callsMissed} {callsMissed === 1 ? 'call' : 'calls'}
                    </span>
                  </div>
                  <input 
                    id="calc-missed-calls"
                    type="range" min="0" max="25" step="1" 
                    value={callsMissed} 
                    onChange={(e) => handleSliderChange(setCallsMissed, Number(e.target.value))}
                    className="w-full cursor-pointer transition-colors"
                  />
                  <span className="font-mono text-[10px] text-[var(--color-muted-dark)] block mt-1">
                    Calls going to voicemail while on-site, driving, or after-hours
                  </span>
                </div>

                {/* Job Value Slider */}
                <div className="group">
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="calc-job-value" className="font-mono text-xs text-white uppercase tracking-wider font-semibold">
                      Average Job / Order Value
                    </label>
                    <span className="font-mono text-base sm:text-lg text-[var(--color-tertiary)] font-bold">
                      R {jobValue.toLocaleString()}
                    </span>
                  </div>
                  <input 
                    id="calc-job-value"
                    type="range" min="500" max="20000" step="500" 
                    value={jobValue} 
                    onChange={(e) => handleSliderChange(setJobValue, Number(e.target.value))}
                    className="w-full cursor-pointer transition-colors"
                  />
                  <span className="font-mono text-[10px] text-[var(--color-muted-dark)] block mt-1">
                    Typical quote or invoice ticket size for your service
                  </span>
                </div>

                {/* Admin Hours Slider */}
                <div className="group">
                  <div className="flex items-center justify-between mb-3">
                    <label htmlFor="calc-admin-hours" className="font-mono text-xs text-white uppercase tracking-wider font-semibold">
                      Admin Hours Spent / Week
                    </label>
                    <span className="font-mono text-base sm:text-lg text-[var(--color-tertiary)] font-bold">
                      {adminHours} hrs
                    </span>
                  </div>
                  <input 
                    id="calc-admin-hours"
                    type="range" min="0" max="40" step="1" 
                    value={adminHours} 
                    onChange={(e) => handleSliderChange(setAdminHours, Number(e.target.value))}
                    className="w-full cursor-pointer transition-colors"
                  />
                  <span className="font-mono text-[10px] text-[var(--color-muted-dark)] block mt-1">
                    Time answering FAQs, drafting quotes, and chasing bookings manually
                  </span>
                </div>

                {/* WhatsApp Response Speed */}
                <div>
                  <label htmlFor="calc-response-speed" className="font-mono text-xs text-white uppercase tracking-wider block mb-3 font-semibold">
                    Current WhatsApp Response Time
                  </label>
                  <select 
                    id="calc-response-speed"
                    value={responseSpeedOption} 
                    onChange={(e) => handleSliderChange(setResponseSpeedOption, e.target.value)}
                    className="input-field !py-3.5 sm:!py-4 w-full cursor-pointer"
                  >
                    <option value="< 5min" className="text-black bg-white">&lt; 5 minutes (Instant AI Speed)</option>
                    <option value="5-30min" className="text-black bg-white">5 - 30 minutes (Fast Manual)</option>
                    <option value="30min-2hr" className="text-black bg-white">30 minutes - 2 hours (Average Contractor)</option>
                    <option value="2hr+" className="text-black bg-white">2 hours + (High Lead Dropout)</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Outputs Column */}
          <motion.div 
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-5 ethereal-card-shell h-full w-full min-w-0"
          >
            <div className="ethereal-card-core h-full flex flex-col p-6 sm:p-8 md:p-10 !bg-[rgba(249,115,22,0.03)] border-none ring-1 ring-[rgba(249,115,22,0.14)] relative overflow-hidden w-full min-w-0" style={{ backdropFilter: "none", WebkitBackdropFilter: "none" }}>
              <div className="absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 max-w-full bg-[radial-gradient(circle,rgba(249,115,22,0.08)_0%,transparent_70%)] pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
              
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-black/10 dark:border-white/10">
                <div>
                  <h3 className="font-mono text-xs text-[var(--color-tertiary)] uppercase tracking-widest font-semibold">
                    Estimated Monthly Leak
                  </h3>
                </div>
                
                {/* View Mode Toggle Switch */}
                <div className="flex bg-black/10 dark:bg-[#111] p-1 rounded-full border border-black/10 dark:border-white/10">
                  <button 
                    type="button"
                    onClick={() => setViewMode("trend")}
                    aria-label="Display as dynamic recovery trend chart"
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-full cursor-pointer transition-colors flex items-center gap-1.5 ${
                      viewMode === "trend" 
                        ? "bg-[var(--color-tertiary)] text-black font-bold shadow-sm" 
                        : "text-[var(--color-muted)] hover:text-white"
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Trend</span>
                  </button>
                  <button 
                    type="button"
                    onClick={() => setViewMode("breakdown")}
                    aria-label="Display as breakdown chart"
                    className={`p-1.5 rounded-full cursor-pointer transition-colors ${
                      viewMode === "breakdown" 
                        ? "bg-[var(--color-tertiary)] text-black" 
                        : "text-[var(--color-muted)] hover:text-white"
                    }`}
                    title="Breakdown Bar Chart"
                  >
                    <BarChart3 className="w-4 h-4" strokeWidth={2.2} />
                  </button>
                  <button 
                    type="button"
                    onClick={() => setViewMode("list")}
                    aria-label="Display as list"
                    className={`p-1.5 rounded-full cursor-pointer transition-colors ${
                      viewMode === "list" 
                        ? "bg-[var(--color-tertiary)] text-black" 
                        : "text-[var(--color-muted)] hover:text-white"
                    }`}
                    title="Itemized List"
                  >
                    <List className="w-4 h-4" strokeWidth={2.2} />
                  </button>
                </div>
              </div>

              {/* Dynamic Animated Total Leak display */}
              <div className="font-display text-[clamp(2.2rem,4.2vw,3.8rem)] text-white tracking-tight mb-1 tabular-nums leading-none font-bold">
                <CountUpNumber value={totalLoss} formatFn={formatZAR} />
              </div>
              <p className="font-mono text-[11px] text-[var(--color-muted)] uppercase tracking-wider mb-5">
                Recover up to <span className="text-[var(--color-success)] font-bold">{formatZAR(recoveredRevenue)}</span> monthly with LAIS
              </p>

              {/* Monthly Growth Stat Badge */}
              <div className="mb-5 p-3.5 bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.18)] rounded-xl flex items-center justify-between flex-wrap gap-2">
                <div>
                  <p className="text-[10px] font-mono text-[var(--color-success)] uppercase tracking-widest font-bold mb-0.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Est. Revenue Growth
                  </p>
                  <p className="text-xl sm:text-2xl font-display text-white tracking-tight leading-none font-bold">
                    +{growthPercentage.toFixed(1)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-[var(--color-muted)] uppercase mb-0.5">
                    Projected Monthly Run-Rate
                  </p>
                  <p className="font-mono text-xs sm:text-sm text-[var(--color-success)] font-semibold">
                    <CountUpNumber value={monthlyTurnover + recoveredRevenue} formatFn={formatZAR} />
                  </p>
                </div>
              </div>

              {/* Interactive Dynamic Views */}
              <div className="flex-1 min-h-[190px] flex flex-col justify-center w-full min-w-0 overflow-hidden mb-5">
                <AnimatePresence mode="wait">
                  {/* VIEW 1: DYNAMIC RECOVERY TREND CHART (DEFAULT) */}
                  {viewMode === "trend" && (
                    <motion.div 
                      key="trend-chart"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="w-full flex flex-col flex-1"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-[var(--color-muted)] mb-2 px-1">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-sm bg-[var(--color-tertiary)]" />
                          Monthly Recovery
                        </span>
                        <span className="text-[var(--color-success)] font-semibold">
                          6-Mo Total: {formatZAR(recoveryTrendData[recoveryTrendData.length - 1]?.cumulativeRecovered || 0)}
                        </span>
                      </div>

                      <div className="w-full h-[170px] min-w-0">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={recoveryTrendData} margin={{ top: 10, right: 10, left: -22, bottom: 0 }}>
                            <defs>
                              <linearGradient id="recoveryGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.45}/>
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0.02}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                            <XAxis 
                              dataKey="month" 
                              stroke={axisColor} 
                              fontSize={10} 
                              tickLine={false} 
                              axisLine={false}
                            />
                            <YAxis 
                              stroke={axisColor} 
                              fontSize={9} 
                              tickLine={false} 
                              axisLine={false}
                              tickFormatter={(v) => `R${(v/1000).toFixed(0)}k`}
                            />
                            <Tooltip 
                              content={({ active, payload }: any) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-slate-900/98 dark:bg-[#141414]/98 border border-white/15 p-3 shadow-2xl font-mono text-xs text-white rounded-xl" style={{ backdropFilter: "none", WebkitBackdropFilter: "none" }}>
                                      <p className="font-semibold text-white mb-2 flex items-center gap-1.5 border-b border-white/10 pb-1.5">
                                        <span className="w-2 h-2 rounded-full bg-[var(--color-tertiary)]" />
                                        {data.monthLabel}
                                      </p>
                                      <div className="space-y-1">
                                        <div className="flex items-center justify-between gap-4">
                                          <span className="text-slate-400 text-[11px]">Monthly:</span>
                                          <span className="text-[var(--color-tertiary)] font-bold">{formatZAR(data.monthlyRecovered)}</span>
                                        </div>
                                        <div className="flex items-center justify-between gap-4">
                                          <span className="text-slate-400 text-[11px]">Cumulative:</span>
                                          <span className="text-emerald-400 font-bold">{formatZAR(data.cumulativeRecovered)}</span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              }} 
                            />
                            <Area 
                              type="monotone" 
                              dataKey="monthlyRecovered" 
                              stroke="#f97316" 
                              strokeWidth={2.5}
                              fillOpacity={1} 
                              fill="url(#recoveryGradient)" 
                              activeDot={{ r: 5, fill: "#f97316", stroke: "#ffffff", strokeWidth: 1.5 }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </motion.div>
                  )}

                  {/* VIEW 2: BREAKDOWN BAR CHART */}
                  {viewMode === "breakdown" && (
                    <motion.div 
                      key="breakdown-chart"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                      className="w-full h-[170px] min-w-0"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                          <XAxis 
                            dataKey="name" 
                            stroke={axisColor} 
                            fontSize={9} 
                            tickLine={false} 
                            axisLine={false}
                          />
                          <YAxis 
                            stroke={axisColor} 
                            fontSize={9} 
                            tickLine={false} 
                            axisLine={false}
                            tickFormatter={(v) => `R${(v/1000).toFixed(0)}k`}
                          />
                          <Tooltip 
                            content={({ active, payload }: any) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-slate-900 dark:bg-[#161616] border border-white/10 p-2.5 shadow-2xl font-mono text-xs text-white rounded-md">
                                    <p className="font-semibold mb-1 text-slate-400">{payload[0].payload.name}</p>
                                    <p className="text-[var(--color-tertiary)] font-bold text-sm">{formatZAR(payload[0].value)}</p>
                                  </div>
                                );
                              }
                              return null;
                            }} 
                            cursor={{ fill: "rgba(255,255,255,0.03)" }} 
                          />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </motion.div>
                  )}

                  {/* VIEW 3: ITEMIZED LIST */}
                  {viewMode === "list" && (
                    <motion.div 
                      key="list"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3 flex-1 w-full"
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
                        <span className="font-body text-body-sm text-[var(--color-muted)]">Missed Calls Leak</span>
                        <span className="font-mono text-sm text-[var(--color-error)] font-semibold">
                          <CountUpNumber value={missedCallsLoss} formatFn={formatZAR} />
                        </span>
                      </div>
                      <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
                        <span className="font-body text-body-sm text-[var(--color-muted)]">Slow Response Penalty</span>
                        <span className="font-mono text-sm text-[var(--color-error)] font-semibold">
                          <CountUpNumber value={slowResponseLoss} formatFn={formatZAR} />
                        </span>
                      </div>
                      <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10">
                        <span className="font-body text-body-sm text-[var(--color-muted)]">Admin Time Cost</span>
                        <span className="font-mono text-sm text-[var(--color-error)] font-semibold">
                          <CountUpNumber value={adminLoss} formatFn={formatZAR} />
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-auto w-full">
                <SlidingTextButton onClick={onOpenAudit} className="w-full !justify-between">
                  Plug The Leaks
                  <div className="flex items-center justify-center bg-[rgba(0,0,0,0.1)] rounded-full w-8 h-8 ml-2">
                    <ArrowRight strokeWidth={2.5} className="w-4 h-4 text-[#050505]" />
                  </div>
                </SlidingTextButton>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Dedicated "Annual Savings Projection" Interactive Feature with Real-Time Count-Up Animation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 ethereal-card-shell w-full"
        >
          <div className="ethereal-card-core p-6 sm:p-8 md:p-10 !bg-gradient-to-br from-[rgba(249,115,22,0.06)] via-transparent to-[rgba(16,185,129,0.04)] border border-[rgba(249,115,22,0.2)] rounded-2xl relative overflow-hidden">
            
            {/* Ambient highlight glow */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-[radial-gradient(circle,rgba(249,115,22,0.1)_0%,transparent_70%)] pointer-events-none" />
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 mb-6 border-b border-black/10 dark:border-white/10 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-tertiary)]/15 border border-[var(--color-tertiary)]/30 flex items-center justify-center text-[var(--color-tertiary)]">
                  <CalendarClock className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-xl sm:text-2xl text-white font-bold tracking-tight">
                      Annual Savings Projection
                    </h3>
                    <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-[var(--color-tertiary)]/15 text-[var(--color-tertiary)] font-bold border border-[var(--color-tertiary)]/25">
                      12-Month Horizon
                    </span>
                  </div>
                  <p className="font-body text-xs sm:text-sm text-[var(--color-muted)]">
                    Projected compound revenue preserved across a full 12-month autonomous deployment
                  </p>
                </div>
              </div>

              {/* Real-time sync status indicator */}
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-muted)] bg-black/10 dark:bg-white/5 px-3 py-1.5 rounded-full border border-black/10 dark:border-white/10 w-fit">
                <span className={`w-2 h-2 rounded-full ${isLiveCalculating ? "bg-amber-400 animate-ping" : "bg-emerald-400"}`} />
                <span>{isLiveCalculating ? "Re-calculating 12-Mo ROI..." : "Real-Time Count-Up Active"}</span>
              </div>
            </div>

            {/* Annual Numbers Display with Count-Up Transition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              
              {/* Primary Metric: Potential Revenue Recovered */}
              <div className="p-5 rounded-xl bg-black/10 dark:bg-black/30 border border-[var(--color-tertiary)]/30 relative overflow-hidden">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[11px] text-[var(--color-tertiary)] uppercase tracking-wider font-bold">
                    Potential Revenue Recovered
                  </span>
                  <Sparkles className="w-3.5 h-3.5 text-[var(--color-tertiary)]" />
                </div>
                <div className="font-display text-2xl sm:text-3xl text-white font-extrabold tracking-tight tabular-nums">
                  <CountUpNumber value={annualRecovered} formatFn={formatZAR} />
                </div>
                <span className="font-mono text-[10px] text-[var(--color-success)] mt-1 block font-medium">
                  +12-Month Net Cashflow Protected
                </span>
              </div>

              {/* Secondary Metric: Annual Leak Prevented */}
              <div className="p-5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[11px] text-[var(--color-muted)] uppercase tracking-wider font-medium">
                    Total Annual Leak Prevented
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-red-400" />
                </div>
                <div className="font-display text-2xl sm:text-3xl text-white font-bold tracking-tight tabular-nums">
                  <CountUpNumber value={annualLeak} formatFn={formatZAR} />
                </div>
                <span className="font-mono text-[10px] text-[var(--color-muted-dark)] mt-1 block">
                  Missed calls + slow quote penalties
                </span>
              </div>

              {/* Tertiary Metric: Projected Annual Run-Rate */}
              <div className="p-5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[11px] text-[var(--color-muted)] uppercase tracking-wider font-medium">
                    Projected Annual Run-Rate
                  </span>
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="font-display text-2xl sm:text-3xl text-emerald-400 font-bold tracking-tight tabular-nums">
                  <CountUpNumber value={annualRunRate} formatFn={formatZAR} />
                </div>
                <span className="font-mono text-[10px] text-[var(--color-muted-dark)] mt-1 block">
                  Current turnover + recovered revenue
                </span>
              </div>

              {/* Quaternary Metric: Hours Reclaimed */}
              <div className="p-5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[11px] text-[var(--color-muted)] uppercase tracking-wider font-medium">
                    Admin Hours Reclaimed
                  </span>
                  <Clock3 className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="font-display text-2xl sm:text-3xl text-white font-bold tracking-tight tabular-nums">
                  <CountUpNumber value={annualHoursSaved} /> hrs
                </div>
                <span className="font-mono text-[10px] text-[var(--color-muted-dark)] mt-1 block">
                  ~<CountUpNumber value={annualLeadsSaved} /> client leads saved / year
                </span>
              </div>
            </div>

            {/* Bottom summary note */}
            <div className="mt-6 pt-4 border-t border-black/10 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--color-muted)]">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-tertiary)]" />
                Projections modeled on verified Cape Town trades & contractor conversion data.
              </span>
              <button 
                type="button"
                onClick={onOpenAudit}
                className="text-[var(--color-tertiary)] hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
              >
                Claim your customized audit <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
