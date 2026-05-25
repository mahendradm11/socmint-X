import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricTile({
  label,
  value,
  delta,
  icon: Icon,
  trend = "neutral",
  className,
}: {
  label: string;
  value: string | number;
  delta?: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  className?: string;
}) {
  const trendColor =
    trend === "up" ? "text-emerald-400" : trend === "down" ? "text-intel-crimson" : "text-slate-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("glass-panel p-4 intel-border group hover:border-cyber/30 transition-all", className)}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-mono">{label}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-100 tabular-nums">{value}</p>
          {delta && <p className={cn("mt-1 text-xs font-mono", trendColor)}>{delta}</p>}
        </div>
        <div className="rounded-lg bg-cyber/10 p-2 text-cyber-glow group-hover:shadow-glow transition-shadow">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}
