import { useState, useEffect, useRef } from "react";
import { ArrowRight, BarChart3, List } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { SlidingTextButton } from "./ui/sliding-text-button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from "recharts";

interface CalculatorSectionProps {
  onOpenAudit?: () => void;
}

function AnimatedNumber({ value, formatFn }: { value: number; formatFn?: (val: number) => string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const duration = 1200; // 1.2s fluid duration
    const startValue = 0;
    const endValue = value;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Easing out quad
      const easedProgress = progress * (2 - progress);
      const current = Math.floor(startValue + easedProgress * (endValue - startValue));
      
      setDisplayValue(current);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setDisplayValue(endValue);
      }
    };

    const animFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animFrame);
  }, [value]);

  return <span>{formatFn ? formatFn(displayValue) : displayValue}</span>;
}

export function CalculatorSection({ onOpenAudit }: CalculatorSectionProps) {
  const [callsMissed, setCallsMissed] = useState(3);
  const [jobValue, setJobValue] = useState(2500);
  const [adminHours, setAdminHours] = useState(10);
  const [responseSpeedOption, setResponseSpeedOption] = useState<string>("30min-2hr");
  const [monthlyTurnover, setMonthlyTurnover] = useState(50000);
  const [viewMode, setViewMode] = useState<"list" | "chart">("list");
  
  const [totalLoss, setTotalLoss] = useState(0);
  const [missedCallsLoss, setMissedCallsLoss] = useState(0);
  const [slowResponseLoss, setSlowResponseLoss] = useState(0);
  const [adminLoss, setAdminLoss] = useState(0);

  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Calculation Logic
    const workingDays = 20;
    const conversionRate = 0.15; // 15% of leads convert
    
    // Missed calls cost
    const missedLoss = callsMissed * jobValue * workingDays * conversionRate;
    
    // Slow response cost based on penalty multiplier
    let penaltyMultiplier = 0.1;
    if (responseSpeedOption === "5-30min") penaltyMultiplier = 0.05;
    else if (responseSpeedOption === "30min-2hr") penaltyMultiplier = 0.15;
    else if (responseSpeedOption === "2hr+") penaltyMultiplier = 0.25;
    else if (responseSpeedOption === "< 5min") penaltyMultiplier = 0.0;
    
    const assumedLeads = 10;
    const slowLoss = assumedLeads * jobValue * workingDays * conversionRate * penaltyMultiplier;
    const adminCost = adminHours * 300 * 4;
    
    setMissedCallsLoss(missedLoss);
    setSlowResponseLoss(slowLoss);
    setAdminLoss(adminCost);
    setTotalLoss(missedLoss + slowLoss + adminCost);
  }, [callsMissed, jobValue, adminHours, responseSpeedOption]);

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

  const formatZAR = (val: number) => {
    return new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 }).format(val);
  };

  // 85% capture / recovery average as noted in the executive blueprint documentation
  const recoveredRevenue = totalLoss * 0.85;
  const growthPercentage = monthlyTurnover > 0 ? (recoveredRevenue / monthlyTurnover) * 100 : 0;

  // Chart Data preparation
  const chartData = [
    { name: "Current Turnover", value: monthlyTurnover, color: "#a0a0a0" },
    { name: "Captured Leak", value: totalLoss, color: "#d32f2f" },
    { name: "LAIS Recovered", value: recoveredRevenue, color: "#f97316" },
    { name: "Projected Total", value: monthlyTurnover + recoveredRevenue, color: "#10b981" }
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#161616] border border-[rgba(255,255,255,0.08)] p-3 shadow-2xl font-mono text-xs text-white rounded-md">
          <p className="font-semibold mb-1 text-[var(--color-muted)]">{payload[0].payload.name}</p>
          <p className="text-[var(--color-tertiary)] font-bold text-sm">{formatZAR(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <section id="calculator" className="section-padding bg-[var(--color-primary-surface)] relative" ref={sectionRef}>
      <div className="absolute inset-0 bg-ethereal-glow pointer-events-none opacity-20" />
      <div className="container max-w-6xl relative z-10">
        
        <div className="text-center mb-16 reveal-up">
          <div className="eyebrow-pill mb-6 mx-auto">TELEMETRY</div>
          <h2 className="font-display text-display-lg text-white mb-4">Calculate Your Revenue Leak</h2>
          <p className="font-body text-body-lg text-[var(--color-muted)] max-w-2xl mx-auto">Input your current operational metrics to expose the hidden cost of manual processes.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch reveal-up" style={{ transitionDelay: '150ms' }}>
          {/* Inputs */}
          <motion.div whileHover={{ scale: 1.02 }} className="lg:col-span-7 ethereal-card-shell h-full">
            <div className="ethereal-card-core h-full flex flex-col p-8 md:p-12 !bg-[rgba(11,11,11,0.5)] backdrop-blur-md">
              <h3 className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-widest mb-10 pb-4 border-b border-[rgba(255,255,255,0.06)] font-medium">Capture Parameters</h3>
              
              <div className="space-y-8 flex-1">
                <div className="group">
                  <div className="flex items-center justify-between mb-4">
                    <label className="font-mono text-xs text-white uppercase tracking-wider">Current Monthly Turnover</label>
                    <span className="font-mono text-lg text-[var(--color-tertiary)]">R {monthlyTurnover.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="10000" max="300000" step="5000" 
                    value={monthlyTurnover} onChange={(e) => setMonthlyTurnover(Number(e.target.value))}
                    className="w-full cursor-pointer transition-colors"
                  />
                  <span className="font-mono text-[10px] text-[var(--color-muted-dark)] block mt-1">Est. baseline revenue to weigh recovered growth %</span>
                </div>

                <div className="group">
                  <div className="flex items-center justify-between mb-4">
                    <label className="font-mono text-xs text-white uppercase tracking-wider">Missed calls per day</label>
                    <span className="font-mono text-lg text-[var(--color-tertiary)]">{callsMissed}</span>
                  </div>
                  <input 
                    type="range" min="0" max="25" step="1" 
                    value={callsMissed} onChange={(e) => setCallsMissed(Number(e.target.value))}
                    className="w-full cursor-pointer transition-colors"
                  />
                </div>

                <div className="group">
                  <div className="flex items-center justify-between mb-4">
                    <label className="font-mono text-xs text-white uppercase tracking-wider">Average Job Value</label>
                    <span className="font-mono text-lg text-[var(--color-tertiary)]">R {jobValue.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="500" max="20000" step="500" 
                    value={jobValue} onChange={(e) => setJobValue(Number(e.target.value))}
                    className="w-full cursor-pointer transition-colors"
                  />
                </div>

                <div className="group">
                  <div className="flex items-center justify-between mb-4">
                    <label className="font-mono text-xs text-white uppercase tracking-wider">Admin hours / week</label>
                    <span className="font-mono text-lg text-[var(--color-tertiary)]">{adminHours}</span>
                  </div>
                  <input 
                    type="range" min="0" max="40" step="1" 
                    value={adminHours} onChange={(e) => setAdminHours(Number(e.target.value))}
                    className="w-full cursor-pointer transition-colors"
                  />
                </div>

                <div>
                  <label className="font-mono text-xs text-white uppercase tracking-wider block mb-4">WhatsApp response time</label>
                  <select 
                    value={responseSpeedOption} 
                    onChange={(e) => setResponseSpeedOption(e.target.value)}
                    className="input-field !py-4"
                  >
                    <option value="< 5min" className="text-black">&lt; 5 minutes (Instant)</option>
                    <option value="5-30min" className="text-black">5 - 30 minutes</option>
                    <option value="30min-2hr" className="text-black">30 minutes - 2 hours</option>
                    <option value="2hr+" className="text-black">2 hours +</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Output */}
          <motion.div whileHover={{ scale: 1.02 }} className="lg:col-span-5 ethereal-card-shell h-full">
            <div className="ethereal-card-core h-full flex flex-col p-8 md:p-12 !bg-[rgba(249,115,22,0.03)] border-none ring-1 ring-[rgba(249,115,22,0.1)] relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[var(--color-tertiary)] opacity-[0.05] rounded-full blur-[100px] pointer-events-none transform translate-x-1/2 -translate-y-1/2" />
              
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-[rgba(255,255,255,0.05)]">
                <h3 className="font-mono text-xs text-[var(--color-tertiary)] uppercase tracking-widest font-medium">Estimated Monthly Leak</h3>
                
                {/* View Mode Toggle Switch */}
                <div className="flex bg-[#111] p-1 rounded-full border border-[rgba(255,255,255,0.08)]">
                  <button 
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-full cursor-pointer transition-colors ${viewMode === "list" ? "bg-[var(--color-tertiary)] text-black" : "text-[var(--color-muted)] hover:text-white"}`}
                    title="List View"
                  >
                    <List className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                  <button 
                    type="button"
                    onClick={() => setViewMode("chart")}
                    className={`p-1.5 rounded-full cursor-pointer transition-colors ${viewMode === "chart" ? "bg-[var(--color-tertiary)] text-black" : "text-[var(--color-muted)] hover:text-white"}`}
                    title="Chart View"
                  >
                    <BarChart3 className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
              </div>

              {/* Dynamic Animated Total Leak display */}
              <div className="font-display text-[clamp(2.5rem,5vw,4.5rem)] text-white tracking-tight mb-2 tabular-nums leading-none">
                <AnimatedNumber value={totalLoss} formatFn={formatZAR} />
              </div>
              <p className="font-mono text-[11px] text-[var(--color-muted)] uppercase tracking-wider mb-8">
                With LAIS, recover up to <span className="text-[var(--color-success)] font-bold">{formatZAR(recoveredRevenue)}</span> monthly
              </p>

              {/* Growth Stat Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8 p-4 bg-[rgba(16,185,129,0.06)] border border-[rgba(16,185,129,0.15)] rounded-lg flex items-center justify-between"
              >
                <div>
                  <p className="text-[10px] font-mono text-[var(--color-success)] uppercase tracking-widest font-bold mb-0.5">
                    Est. Revenue Growth
                  </p>
                  <p className="text-2xl font-display text-white tracking-tight leading-none font-bold">
                    +{growthPercentage.toFixed(1)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-mono text-[var(--color-muted)] uppercase mb-0.5">
                    Projected Monthly
                  </p>
                  <p className="font-mono text-sm text-[var(--color-success)] font-semibold">
                    {formatZAR(monthlyTurnover + recoveredRevenue)}
                  </p>
                </div>
              </motion.div>

              {/* Interactive Views */}
              <div className="flex-1 min-h-[200px] flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  {viewMode === "list" ? (
                    <motion.div 
                      key="list"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6 flex-1"
                    >
                      <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.04)] group">
                        <span className="font-body text-body-sm text-[var(--color-muted)] md:group-hover:text-white transition-colors duration-300">Missed calls</span>
                        <span className="font-mono text-sm text-[var(--color-error)] opacity-80">
                          <AnimatedNumber value={missedCallsLoss} formatFn={formatZAR} />
                        </span>
                      </div>
                      <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.04)] group">
                        <span className="font-body text-body-sm text-[var(--color-muted)] md:group-hover:text-white transition-colors duration-300">Slow response penalty</span>
                        <span className="font-mono text-sm text-[var(--color-error)] opacity-80">
                          <AnimatedNumber value={slowResponseLoss} formatFn={formatZAR} />
                        </span>
                      </div>
                      <div className="flex items-center justify-between pb-4 border-b border-[rgba(255,255,255,0.04)] group">
                        <span className="font-body text-body-sm text-[var(--color-muted)] md:group-hover:text-white transition-colors duration-300">Admin overhead</span>
                        <span className="font-mono text-sm text-[var(--color-error)] opacity-80">
                          <AnimatedNumber value={adminLoss} formatFn={formatZAR} />
                        </span>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="chart"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-[220px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                          <XAxis 
                            dataKey="name" 
                            stroke="rgba(255,255,255,0.2)" 
                            fontSize={10} 
                            tickLine={false} 
                            axisLine={false}
                          />
                          <YAxis 
                            stroke="rgba(255,255,255,0.2)" 
                            fontSize={9} 
                            tickLine={false} 
                            axisLine={false}
                            tickFormatter={(v) => `R${v/1000}k`}
                          />
                          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
                          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {chartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-8 mt-auto">
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
      </div>
    </section>
  );
}
