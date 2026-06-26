import React from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface SlidingTextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function SlidingTextButton({ children, className, ...props }: SlidingTextButtonProps) {
  return (
    <motion.button
      whileHover="hover"
      initial="initial"
      className={cn(
        "relative flex w-auto cursor-pointer items-center justify-center overflow-hidden rounded-full bg-[#f68712] px-8 py-3.5 text-center font-semibold tracking-wide text-[#050505] shadow-[0_0_20px_rgba(246,135,18,0.2)] transition-shadow duration-300 hover:shadow-[0_0_35px_rgba(246,135,18,0.4)]",
        className
      )}
      {...props}
    >
      <div className="relative overflow-hidden flex items-center justify-center w-full">
        <motion.span
          variants={{
            initial: { y: 0, opacity: 1, filter: "blur(0px)" },
            hover: { y: "-120%", opacity: 0, filter: "blur(4px)" },
          }}
          transition={{ type: "spring", bounce: 0, duration: 0.6 }}
          className="flex items-center gap-2"
        >
          {children}
        </motion.span>
        
        <motion.span
          variants={{
            initial: { y: "150%", opacity: 0, filter: "blur(4px)" },
            hover: { y: 0, opacity: 1, filter: "blur(0px)" },
          }}
          transition={{ type: "spring", bounce: 0, duration: 0.6 }}
          className="absolute inset-0 flex items-center justify-center gap-2"
        >
          {children}
        </motion.span>
      </div>
    </motion.button>
  );
}
