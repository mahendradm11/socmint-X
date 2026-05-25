import { motion } from "framer-motion";
import { cn, formatPercent } from "@/lib/utils";

export function ConfidenceRing({
  score,
  label,
  riskLevel,
  size = 160,
}: {
  score: number;
  label: string;
  riskLevel: string;
  size?: number;
}) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score);

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={8}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#grad)"
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1e6bff" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-3xl font-bold tabular-nums text-slate-100">{formatPercent(score, 0)}</span>
        <span className="text-[10px] font-mono uppercase text-slate-500">{label}</span>
      </div>
      <p className={cn("mt-2 text-xs font-semibold uppercase tracking-wider", "text-cyber-glow")}>
        {riskLevel}
      </p>
    </div>
  );
}
