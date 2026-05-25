import { motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type Indicator = { label: string; score: number; type: "positive" | "negative" };

export function ModalityBreakdown({ items }: { items: Indicator[] }) {
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-navy-900/60 px-3 py-2"
        >
          <div className="flex items-center gap-2">
            {item.type === "positive" ? (
              <Plus className="h-3.5 w-3.5 text-emerald-400" />
            ) : (
              <Minus className="h-3.5 w-3.5 text-intel-crimson" />
            )}
            <span className="text-sm text-slate-300">{item.label}</span>
          </div>
          <span
            className={cn(
              "font-mono text-sm font-semibold tabular-nums",
              item.type === "positive" ? "text-emerald-400" : "text-intel-crimson"
            )}
          >
            {item.type === "positive" ? "+" : ""}
            {item.score}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
