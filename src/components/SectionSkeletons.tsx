import { motion } from "motion/react";

export function CalculatorSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full animate-pulse"
      aria-label="Loading calculator telemetry"
    >
      {/* Inputs Card Skeleton */}
      <div className="lg:col-span-7 ethereal-card-shell h-full">
        <div className="ethereal-card-core h-full flex flex-col p-8 md:p-12 !bg-[rgba(11,11,11,0.5)] backdrop-blur-md">
          <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/[0.06]">
            <div className="h-3 w-36 bg-white/10 rounded-sm" />
            <div className="h-2 w-16 bg-white/5 rounded-sm" />
          </div>

          <div className="space-y-8 flex-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-3 w-40 bg-white/10 rounded-sm" />
                  <div className="h-4 w-20 bg-[var(--color-tertiary)]/20 rounded-sm" />
                </div>
                <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden relative">
                  <div className="h-full w-1/3 bg-[var(--color-tertiary)]/30 rounded-full animate-pulse" />
                </div>
                <div className="h-2 w-48 bg-white/5 rounded-sm" />
              </div>
            ))}

            <div className="space-y-3 pt-2">
              <div className="h-3 w-44 bg-white/10 rounded-sm" />
              <div className="h-12 w-full bg-white/5 border border-white/10 rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Output Card Skeleton */}
      <div className="lg:col-span-5 ethereal-card-shell h-full">
        <div className="ethereal-card-core h-full flex flex-col p-8 md:p-12 !bg-[rgba(249,115,22,0.02)] border-none ring-1 ring-[rgba(249,115,22,0.1)] relative overflow-hidden backdrop-blur-md">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <div className="h-3 w-36 bg-[var(--color-tertiary)]/30 rounded-sm" />
            <div className="h-7 w-16 bg-white/5 rounded-full border border-white/10" />
          </div>

          <div className="h-16 w-52 bg-white/15 rounded-md mb-2" />
          <div className="h-3 w-64 bg-white/10 rounded-sm mb-8" />

          {/* Growth stat card skeleton */}
          <div className="mb-8 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-lg flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-2.5 w-28 bg-emerald-400/20 rounded-sm" />
              <div className="h-6 w-20 bg-emerald-400/30 rounded-md" />
            </div>
            <div className="space-y-2 text-right">
              <div className="h-2.5 w-24 bg-white/10 rounded-sm ml-auto" />
              <div className="h-4 w-28 bg-emerald-400/30 rounded-sm ml-auto" />
            </div>
          </div>

          {/* Metric breakdown bars */}
          <div className="space-y-4 flex-1 py-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between pb-3 border-b border-white/[0.04]">
                <div className="h-3 w-32 bg-white/10 rounded-sm" />
                <div className="h-3 w-16 bg-red-400/20 rounded-sm" />
              </div>
            ))}
          </div>

          {/* CTA Button skeleton */}
          <div className="pt-8 mt-auto">
            <div className="h-14 w-full bg-[var(--color-tertiary)]/20 border border-[var(--color-tertiary)]/30 rounded-full" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function TestimonialsSkeleton() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full animate-pulse"
      aria-label="Loading verified contractor results"
    >
      {/* Testimonial Main Content Skeleton */}
      <div className="lg:col-span-8 bg-[rgba(15,15,15,0.6)] backdrop-blur-md rounded-3xl border border-[rgba(255,255,255,0.05)] p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden min-h-[360px]">
        <div>
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="w-4 h-4 rounded-xs bg-[var(--color-tertiary)]/30" />
              ))}
            </div>
            <div className="h-6 w-36 bg-emerald-500/10 border border-emerald-500/20 rounded-full" />
          </div>

          <div className="space-y-3.5 my-8">
            <div className="h-5 w-full bg-white/10 rounded-sm" />
            <div className="h-5 w-11/12 bg-white/10 rounded-sm" />
            <div className="h-5 w-3/4 bg-white/10 rounded-sm" />
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/[0.04] flex-wrap gap-4 mt-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/10 shrink-0" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-white/15 rounded-sm" />
              <div className="h-3 w-48 bg-white/10 rounded-sm" />
            </div>
          </div>
          <div className="h-7 w-28 bg-white/5 border border-white/5 rounded-lg" />
        </div>
      </div>

      {/* Operational Stat Callout Skeleton */}
      <div className="lg:col-span-4 bg-[rgba(249,115,22,0.02)] border border-[rgba(249,115,22,0.15)] rounded-3xl p-6 sm:p-10 flex flex-col justify-center relative overflow-hidden min-h-[360px]">
        <div className="h-3 w-32 bg-[var(--color-tertiary)]/30 rounded-sm mb-6" />
        <div className="h-16 w-44 bg-white/20 rounded-md mb-4" />
        <div className="space-y-2">
          <div className="h-3.5 w-full bg-white/10 rounded-sm" />
          <div className="h-3.5 w-4/5 bg-white/10 rounded-sm" />
        </div>
      </div>
    </motion.div>
  );
}
