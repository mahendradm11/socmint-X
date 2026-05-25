import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { timelineEvents } from "@/data/mockIntelligence";

const severityBadge = {
  critical: "danger" as const,
  high: "default" as const,
  medium: "warning" as const,
  low: "muted" as const,
};

export default function TimelineExplorer() {
  return (
    <div className="relative">
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyber/60 via-intel-teal/40 to-transparent hidden lg:block" />

      <div className="space-y-8 max-w-4xl mx-auto">
        {timelineEvents.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`flex gap-6 ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
          >
            <div className="flex-1">
              <Card glow={e.severity === "critical" ? "crimson" : e.severity === "high" ? "cyber" : undefined}>
                <CardHeader className="flex-row items-center gap-2">
                  <Badge variant={severityBadge[e.severity as keyof typeof severityBadge]}>
                    {e.type.replace("_", " ")}
                  </Badge>
                  <span className="text-[10px] font-mono text-slate-500 ml-auto">
                    {new Date(e.time).toLocaleString()}
                  </span>
                </CardHeader>
                <CardContent>
                  <p className="text-base text-slate-100">{e.label}</p>
                </CardContent>
              </Card>
            </div>
            <div className="hidden lg:flex w-8 shrink-0 items-center justify-center">
              <div
                className={`h-4 w-4 rounded-full border-2 ${
                  e.severity === "critical"
                    ? "border-intel-crimson bg-intel-crimson/40 shadow-glow-crimson"
                    : "border-cyber bg-cyber/40 shadow-glow"
                }`}
              />
            </div>
            <div className="flex-1 hidden lg:block" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
