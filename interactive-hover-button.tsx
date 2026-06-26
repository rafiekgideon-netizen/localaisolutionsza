import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"

export function InteractiveHoverButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <motion.button
      whileHover="hover"
      initial="initial"
      className={cn(
        "relative w-auto cursor-pointer overflow-hidden rounded-full bg-[rgba(15,15,15,1)] border border-[rgba(255,255,255,0.12)] px-8 py-3.5 text-center font-medium text-white shadow-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(246,135,18,0.25)] hover:border-[rgba(246,135,18,0.5)]",
        className
      )}
      {...props}
    >
      <motion.div 
        variants={{
          initial: { top: "100%", borderRadius: "50%" },
          hover: { top: "0%", borderRadius: "0%" }
        }}
        transition={{ type: "spring", bounce: 0, duration: 0.55 }}
        className="absolute inset-0 left-0 right-0 h-full w-full bg-[#f68712] origin-bottom" 
      />
      
      <div className="relative z-10 flex items-center justify-center gap-2">
        <motion.span 
          variants={{
            initial: { x: 10 },
            hover: { x: 0 }
          }}
          transition={{ type: "spring", bounce: 0, duration: 0.55 }}
          className="text-sm tracking-wide font-medium whitespace-nowrap"
        >
          {children}
        </motion.span>
        
        <motion.div 
          className="flex items-center justify-center overflow-hidden"
          variants={{
            initial: { width: 0, opacity: 0, x: -10 },
            hover: { width: 22, opacity: 1, x: 0 }
          }}
          transition={{ type: "spring", bounce: 0, duration: 0.55, delay: 0.02 }}
        >
          <ArrowRight className="h-4 w-4 text-white" strokeWidth={2.5} />
        </motion.div>
      </div>
    </motion.button>
  )
}
