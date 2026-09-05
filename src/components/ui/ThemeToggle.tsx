import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { motion } from "motion/react";

interface ThemeToggleProps {
  variant?: "compact" | "segmented" | "card";
  className?: string;
  id?: string;
  showLabels?: boolean;
}

export function ThemeToggle({
  variant = "compact",
  className = "",
  id = "theme-toggle",
  showLabels = false,
}: ThemeToggleProps) {
  const { theme, toggleTheme, setTheme } = useTheme();
  const isDark = theme === "dark";

  // Segmented control (ideal for inside the opened mobile navigation menu)
  if (variant === "segmented") {
    return (
      <div 
        id={id}
        role="radiogroup" 
        aria-label="Color theme selection"
        className={`inline-flex items-center p-1 rounded-full bg-black/10 dark:bg-white/10 border border-black/10 dark:border-white/10 backdrop-blur-md transition-colors ${className}`}
      >
        {/* Light Option */}
        <button
          type="button"
          role="radio"
          aria-checked={!isDark}
          tabIndex={0}
          onClick={() => setTheme("light")}
          className={`relative flex items-center justify-center gap-2 px-4 py-2 rounded-full font-mono text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-tertiary)] focus-visible:ring-offset-2 ${
            !isDark 
              ? "text-slate-900" 
              : "text-slate-400 hover:text-slate-200"
          }`}
          aria-label="Switch to Light Theme"
        >
          {!isDark && (
            <motion.span
              layoutId="mobile-theme-active-indicator"
              className="absolute inset-0 bg-white rounded-full shadow-md shadow-black/10 dark:shadow-none"
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <Sun className={`w-4 h-4 ${!isDark ? "text-amber-500" : "text-slate-400"}`} />
            <span>Light</span>
          </span>
        </button>

        {/* Dark Option */}
        <button
          type="button"
          role="radio"
          aria-checked={isDark}
          tabIndex={0}
          onClick={() => setTheme("dark")}
          className={`relative flex items-center justify-center gap-2 px-4 py-2 rounded-full font-mono text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-tertiary)] focus-visible:ring-offset-2 ${
            isDark 
              ? "text-white" 
              : "text-slate-500 hover:text-slate-900"
          }`}
          aria-label="Switch to Dark Theme"
        >
          {isDark && (
            <motion.span
              layoutId="mobile-theme-active-indicator"
              className="absolute inset-0 bg-[#1e1e1e] border border-white/10 rounded-full shadow-inner"
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-2">
            <Moon className={`w-4 h-4 ${isDark ? "text-[var(--color-tertiary)]" : "text-slate-500"}`} />
            <span>Dark</span>
          </span>
        </button>
      </div>
    );
  }

  // Card variant (alternative full-width item inside menus)
  if (variant === "card") {
    return (
      <div 
        id={id}
        className={`w-full max-w-xs flex items-center justify-between p-3.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 ${className}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-black/5 dark:bg-white/10 text-slate-800 dark:text-slate-200">
            {isDark ? (
              <Moon className="w-4 h-4 text-[var(--color-tertiary)]" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </div>
          <div className="text-left">
            <p className="font-body text-xs font-semibold text-slate-900 dark:text-white">
              {isDark ? "Dark Theme" : "Light Theme"}
            </p>
            <p className="font-mono text-[10px] text-slate-500 dark:text-slate-400">
              {isDark ? "Active for high contrast" : "Active for daylight clarity"}
            </p>
          </div>
        </div>

        {/* Accessible Switch */}
        <button
          type="button"
          role="switch"
          aria-checked={isDark}
          onClick={toggleTheme}
          aria-label={`Toggle theme. Currently ${isDark ? "Dark" : "Light"} mode. Press to switch to ${isDark ? "Light" : "Dark"} mode.`}
          className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-tertiary)] focus-visible:ring-offset-2 ${
            isDark ? "bg-[var(--color-tertiary)]" : "bg-slate-300 dark:bg-slate-700"
          }`}
        >
          <span className="sr-only">Toggle theme</span>
          <span
            className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
              isDark ? "translate-x-6 text-[var(--color-tertiary)]" : "translate-x-0 text-slate-600"
            }`}
          >
            {isDark ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
          </span>
        </button>
      </div>
    );
  }

  // Compact variant (standard accessible round button for Navbar bar on desktop and mobile)
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode. Currently ${isDark ? "dark" : "light"} mode.`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={`relative rounded-full min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 transition-all duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-tertiary)] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent group ${className}`}
    >
      <span className="sr-only">
        {isDark ? "Currently in dark mode. Click to activate light mode." : "Currently in light mode. Click to activate dark mode."}
      </span>
      
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* Sun icon for light mode */}
        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 0 : 1,
            rotate: isDark ? 90 : 0,
            opacity: isDark ? 0 : 1,
          }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Sun className="w-4 h-4 text-amber-500 group-hover:rotate-45 transition-transform duration-300" />
        </motion.div>

        {/* Moon icon for dark mode */}
        <motion.div
          initial={false}
          animate={{
            scale: isDark ? 1 : 0,
            rotate: isDark ? 0 : -90,
            opacity: isDark ? 1 : 0,
          }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Moon className="w-4 h-4 text-[var(--color-tertiary)] group-hover:-rotate-12 transition-transform duration-300" />
        </motion.div>
      </div>

      {showLabels && (
        <span className="ml-2 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
          {isDark ? "Dark" : "Light"}
        </span>
      )}
    </button>
  );
}
