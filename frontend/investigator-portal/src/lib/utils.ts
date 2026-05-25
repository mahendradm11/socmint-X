import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPercent(n: number, digits = 0) {
  return `${(n * 100).toFixed(digits)}%`;
}

export function riskColor(level: string) {
  const map: Record<string, string> = {
    CONFIRMED: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
    HIGH: "text-cyber-glow border-cyber/40 bg-cyber/10",
    MEDIUM: "text-intel-amber border-intel-amber/40 bg-intel-amber/10",
    LOW: "text-slate-400 border-slate-500/40 bg-slate-500/10",
    "INSUFFICIENT DATA": "text-intel-crimson border-intel-crimson/40 bg-intel-crimson/10",
  };
  return map[level] ?? map.LOW;
}
