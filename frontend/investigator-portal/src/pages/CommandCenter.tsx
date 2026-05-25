import { motion } from "framer-motion";
import { AlertTriangle, Crosshair, Link2, Radar, Target, Users } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Link } from "react-router-dom";
import { MetricTile } from "@/components/ui/metric-tile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  activityByLanguage,
  commandMetrics,
  hourlyActivity,
  suspectClusters,
  threatHeatmap,
  timelineEvents,
} from "@/data/mockIntelligence";
import { api } from "@/lib/api/client";
import { useEffect, useState } from "react";

const PIE_COLORS = ["#1e6bff", "#14b8a6", "#8b5cf6", "#f59e0b"];

export default function CommandCenter() {
  const [caseCount, setCaseCount] = useState(0);

  useEffect(() => {
    api.listCases().then((c) => setCaseCount(c.length)).catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-intel-teal">Threat posture: ELEVATED</p>
          <p className="mt-1 text-sm text-slate-400">
            {caseCount} active case operations · Multi-modal attribution online
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/correlation">
            <Button size="sm">
              <Crosshair className="h-4 w-4" /> Open correlation
            </Button>
          </Link>
          <Link to="/attribution">
            <Button variant="outline" size="sm">
              Run attribution
            </Button>
          </Link>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricTile label="Active investigations" value={caseCount || commandMetrics.activeInvestigations} icon={Target} delta="+3 this week" trend="up" />
        <MetricTile label="High-confidence links" value={commandMetrics.highConfidenceLinks} icon={Link2} delta="12 new" trend="up" />
        <MetricTile label="Behavioral anomalies (24h)" value={commandMetrics.anomalies24h} icon={AlertTriangle} delta="2 critical" trend="down" />
        <MetricTile label="Accounts monitored" value={commandMetrics.accountsMonitored.toLocaleString()} icon={Radar} delta="Live ingest" trend="neutral" />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2" glow="cyber">
          <CardHeader>
            <CardTitle>Activity pulse — 24h operational rhythm</CardTitle>
            <Badge variant="success">Streaming</Badge>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyActivity}>
                <defs>
                  <linearGradient id="areaCyber" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#1e6bff" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#1e6bff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" tick={{ fill: "#64748b", fontSize: 10 }} interval={3} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#0f1729", border: "1px solid rgba(255,255,255,0.1)" }} />
                <Area type="monotone" dataKey="posts" stroke="#3b9eff" fill="url(#areaCyber)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Multilingual activity</CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={activityByLanguage} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={2}>
                  {activityByLanguage.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#0f1729", border: "1px solid rgba(255,255,255,0.1)" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-2 flex flex-wrap gap-2 justify-center">
              {activityByLanguage.map((l, i) => (
                <span key={l.name} className="text-[10px] text-slate-500">
                  <span className="inline-block w-2 h-2 rounded-full mr-1" style={{ background: PIE_COLORS[i] }} />
                  {l.name}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Suspicious activity heatmap — Karnataka</CardTitle>
            <Radar className="h-4 w-4 text-cyber-glow animate-pulse_intel" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {threatHeatmap.map((r) => (
                <div key={r.region} className="flex items-center gap-3">
                  <span className="w-32 text-xs text-slate-400 truncate">{r.region}</span>
                  <div className="flex-1 h-2 rounded-full bg-navy-800 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-cyber-dim to-cyber-glow"
                      initial={{ width: 0 }}
                      animate={{ width: `${r.intensity}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                  <span className="text-xs font-mono text-slate-500 w-8">{r.intensity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card glow="teal">
          <CardHeader>
            <CardTitle>Active suspect clusters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {suspectClusters.map((c) => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border border-white/[0.06] bg-navy-900/50 px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-slate-200">{c.label}</p>
                  <p className="text-[10px] font-mono text-slate-500">{c.nodes} entities · {c.id}</p>
                </div>
                <Badge variant={c.confidence > 0.85 ? "success" : "default"}>
                  {(c.confidence * 100).toFixed(0)}%
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Investigation timeline — latest signals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative border-l border-cyber/30 pl-6 space-y-4">
            {timelineEvents.slice(-4).map((e, i) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="relative"
              >
                <span
                  className={`absolute -left-[29px] top-1 h-3 w-3 rounded-full border-2 ${
                    e.severity === "critical"
                      ? "border-intel-crimson bg-intel-crimson/30"
                      : e.severity === "high"
                        ? "border-cyber bg-cyber/30"
                        : "border-slate-500 bg-slate-500/30"
                  }`}
                />
                <p className="text-[10px] font-mono text-slate-500">{new Date(e.time).toLocaleString()}</p>
                <p className="text-sm text-slate-200">{e.label}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
