import { Fragment } from "react";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { behavioralHeatmap, hourlyActivity } from "@/data/mockIntelligence";

const radarData = [
  { trait: "Stylometry", a: 88, b: 85 },
  { trait: "Temporal", a: 92, b: 78 },
  { trait: "Emoji style", a: 76, b: 74 },
  { trait: "Vocabulary", a: 81, b: 79 },
  { trait: "Response rhythm", a: 70, b: 68 },
  { trait: "Evasion score", a: 12, b: 45 },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function BehavioralDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <Badge variant="success">Consistency: HIGH</Badge>
        <Badge variant="warning">Evasion indicators: 2</Badge>
        <Badge variant="default">Kannada code-switch detected</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card glow="cyber">
          <CardHeader>
            <CardTitle>Behavioral signature radar</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="trait" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Radar name="Account A" dataKey="a" stroke="#3b9eff" fill="#1e6bff" fillOpacity={0.35} />
                <Radar name="Account B" dataKey="b" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.25} />
                <Tooltip contentStyle={{ background: "#0f1729", border: "1px solid rgba(255,255,255,0.1)" }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Posting rhythm — active hours</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyActivity}>
                <XAxis dataKey="hour" tick={{ fill: "#64748b", fontSize: 9 }} interval={2} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#0f1729", border: "1px solid rgba(255,255,255,0.1)" }} />
                <Bar dataKey="posts" fill="#14b8a6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity heatmap — day × hour matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="inline-grid gap-0.5" style={{ gridTemplateColumns: `48px repeat(24, 1fr)` }}>
              <div />
              {Array.from({ length: 24 }, (_, h) => (
                <div key={h} className="text-[8px] font-mono text-slate-600 text-center">
                  {h}
                </div>
              ))}
              {days.map((day) => (
                <Fragment key={day}>
                  <div className="text-[10px] text-slate-500 pr-2 flex items-center">
                    {day}
                  </div>
                  {Array.from({ length: 24 }, (_, h) => {
                    const cell = behavioralHeatmap.find((c) => c.day === day && c.hour === h);
                    const v = cell?.value ?? 0;
                    return (
                      <motion.div
                        key={`${day}-${h}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-5 w-5 rounded-sm"
                        style={{
                          background: `rgba(30, 107, 255, ${v / 100})`,
                        }}
                        title={`${day} ${h}:00 — ${v}`}
                      />
                    );
                  })}
                </Fragment>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
