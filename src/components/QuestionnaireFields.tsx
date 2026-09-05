import { Check, AlertCircle, HelpCircle } from "lucide-react";

interface FormFieldInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  onBlur: () => void;
  error?: string;
  isValid?: boolean;
  helperText?: string;
  validHelperText?: string;
}

export function FormFieldInput({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  isValid,
  helperText,
  validHelperText
}: FormFieldInputProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label htmlFor={id} className="block font-mono text-xs text-[var(--color-muted)] uppercase tracking-wider">
          {label}
        </label>
        {isValid && (
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
            <Check className="w-3 h-3" /> completed
          </span>
        )}
      </div>
      <div className="relative">
        <input 
          id={id} 
          aria-required="true" 
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined} 
          type={type} 
          placeholder={placeholder} 
          className={`input-field min-h-[48px] pr-10 transition-all duration-200 ${
            error 
              ? "!border-red-500/80 !bg-red-500/[0.03] shadow-[0_0_0_1px_rgba(239,68,68,0.4)]" 
              : isValid 
                ? "!border-emerald-500/60 !bg-emerald-500/[0.02] shadow-[0_0_0_1px_rgba(34,197,94,0.25)]" 
                : ""
          }`} 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          onBlur={onBlur}
        />
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          {error ? (
            <AlertCircle className="w-4 h-4 text-red-400" />
          ) : isValid ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : null}
        </div>
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-xs text-red-400 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      ) : isValid && validHelperText ? (
        <p className="mt-2 text-xs text-emerald-400/90 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 font-body">
          <Check className="w-3.5 h-3.5 shrink-0" />
          {validHelperText}
        </p>
      ) : helperText ? (
        <p className="mt-2 text-xs text-[var(--color-muted-dark)] font-body">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

interface FormFieldSelectProps {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  options: { value: string; label: string }[] | string[];
  onChange: (val: string) => void;
  onBlur: () => void;
  error?: string;
  isValid?: boolean;
  tooltipText?: string;
}

export function FormFieldSelect({
  id,
  label,
  placeholder = "Select an option...",
  value,
  options,
  onChange,
  onBlur,
  error,
  isValid,
  tooltipText
}: FormFieldSelectProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label htmlFor={id} className="font-mono text-xs text-[var(--color-muted)] uppercase tracking-wider flex items-center gap-2 relative">
          {label}
          {tooltipText && (
            <div className="group flex items-center">
              <HelpCircle className="w-3.5 h-3.5 text-[var(--color-muted-dark)] hover:text-white transition-colors cursor-help" />
              <div className="absolute bottom-full left-0 mb-2 w-48 sm:w-64 p-3 bg-[#222] text-[11px] leading-relaxed text-[var(--color-muted)] font-body normal-case tracking-normal rounded-xl border border-[rgba(255,255,255,0.1)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl">
                {tooltipText}
              </div>
            </div>
          )}
        </label>
        {isValid && (
          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
            <Check className="w-3 h-3" /> completed
          </span>
        )}
      </div>
      <div className="relative">
        <select 
          id={id} 
          aria-required="true" 
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined} 
          className={`input-field min-h-[48px] appearance-none bg-no-repeat bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5YzlhOWEiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cG9seWxpbmUgcG9pbnRzPSI2IDkgMTIgMTUgMTggOSIvPjwvc3ZnPg==')] bg-[position:right_1rem_center] transition-all duration-200 ${
            error 
              ? "!border-red-500/80 !bg-red-500/[0.03] shadow-[0_0_0_1px_rgba(239,68,68,0.4)]" 
              : isValid 
                ? "!border-emerald-500/60 !bg-emerald-500/[0.02] shadow-[0_0_0_1px_rgba(34,197,94,0.25)]" 
                : ""
          }`} 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
        >
          <option value="" disabled className="text-black">{placeholder}</option>
          {options.map((opt) => {
            const optVal = typeof opt === "string" ? opt : opt.value;
            const optLabel = typeof opt === "string" ? opt : opt.label;
            return (
              <option key={optVal} value={optVal} className="text-black">
                {optLabel}
              </option>
            );
          })}
        </select>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-xs text-red-400 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
