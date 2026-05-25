import type { Edge, Node } from "reactflow";

export const commandMetrics = {
  activeInvestigations: 12,
  highConfidenceLinks: 47,
  anomalies24h: 8,
  accountsMonitored: 2847,
  avgAttribution: 0.84,
};

export const threatHeatmap = [
  { region: "Bengaluru Urban", intensity: 92, cases: 14 },
  { region: "Mysuru", intensity: 54, cases: 5 },
  { region: "Mangaluru", intensity: 41, cases: 3 },
  { region: "Hubballi", intensity: 38, cases: 4 },
  { region: "Belagavi", intensity: 29, cases: 2 },
];

export const activityByLanguage = [
  { name: "Kannada", value: 38 },
  { name: "English", value: 32 },
  { name: "Code-switch", value: 22 },
  { name: "Hindi", value: 8 },
];

export const hourlyActivity = Array.from({ length: 24 }, (_, h) => ({
  hour: `${h}:00`,
  posts: Math.round(12 + Math.sin((h - 9) / 3) * 18 + Math.random() * 8),
}));

export const suspectClusters = [
  { id: "CLU-01", label: "Sock-puppet ring A", nodes: 14, confidence: 0.91 },
  { id: "CLU-02", label: "Disinfo amplifier B", nodes: 9, confidence: 0.78 },
  { id: "CLU-03", label: "Burner migration C", nodes: 6, confidence: 0.86 },
];

export const timelineEvents = [
  { id: "1", time: "2025-05-01T08:00:00", type: "account_created", label: "Burner @shadow_kn created", severity: "low" },
  { id: "2", time: "2025-05-03T21:15:00", type: "behavior_shift", label: "Posting rhythm aligns with primary suspect", severity: "high" },
  { id: "3", time: "2025-05-08T14:30:00", type: "identity_link", label: "Shared follower graph edge detected", severity: "critical" },
  { id: "4", time: "2025-05-12T09:00:00", type: "evasion", label: "Username permutation + VPN hop", severity: "medium" },
  { id: "5", time: "2025-05-18T22:45:00", type: "attribution", label: "87% stylometric match — HIGH confidence", severity: "critical" },
];

export const graphNodes: Node[] = [
  { id: "acc-a", type: "intel", position: { x: 80, y: 200 }, data: { label: "@burner_x", type: "account", confidence: 0.92 } },
  { id: "acc-b", type: "intel", position: { x: 420, y: 120 }, data: { label: "@suspect_main", type: "account", confidence: 0.88 } },
  { id: "email-1", type: "intel", position: { x: 280, y: 320 }, data: { label: "kn***@proton.me", type: "email", confidence: 0.71 } },
  { id: "ip-1", type: "intel", position: { x: 520, y: 280 }, data: { label: "103.21.x.x", type: "ip", confidence: 0.65 } },
  { id: "device-1", type: "intel", position: { x: 200, y: 80 }, data: { label: "Android-14-fp", type: "device", confidence: 0.79 } },
  { id: "img-1", type: "intel", position: { x: 640, y: 180 }, data: { label: "pHash cluster", type: "image", confidence: 0.84 } },
  { id: "comm-1", type: "intel", position: { x: 360, y: 420 }, data: { label: "Cluster-7", type: "community", confidence: 0.9 } },
];

export const graphEdges: Edge[] = [
  { id: "e1", source: "acc-a", target: "acc-b", label: "87% attr", data: { confidence: 0.87 }, animated: true, style: { stroke: "#22c55e" } },
  { id: "e2", source: "acc-a", target: "email-1", data: { confidence: 0.71 }, style: { stroke: "#3b9eff" } },
  { id: "e3", source: "acc-b", target: "ip-1", data: { confidence: 0.65 }, style: { stroke: "#94a3b8" } },
  { id: "e4", source: "device-1", target: "acc-a", data: { confidence: 0.79 }, style: { stroke: "#3b9eff" } },
  { id: "e5", source: "acc-b", target: "img-1", label: "visual", data: { confidence: 0.84 }, style: { stroke: "#14b8a6" } },
  { id: "e6", source: "email-1", target: "comm-1", data: { confidence: 0.55 }, style: { stroke: "#64748b", strokeDasharray: "5 5" } },
  { id: "e7", source: "acc-a", target: "comm-1", label: "indirect", data: { confidence: 0.6 }, style: { stroke: "#8b5cf6", strokeDasharray: "4 4" } },
];

export const modalityIndicators = [
  { label: "Username Similarity", score: 28, type: "positive" as const },
  { label: "Stylometric Match", score: 35, type: "positive" as const },
  { label: "Temporal Overlap", score: 18, type: "positive" as const },
  { label: "Image pHash Proximity", score: 12, type: "positive" as const },
  { label: "Geo Conflict", score: -8, type: "negative" as const },
  { label: "VPN Anonymization", score: -5, type: "negative" as const },
];

export const behavioralHeatmap = Array.from({ length: 7 }, (_, d) =>
  Array.from({ length: 24 }, (_, h) => ({
    day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][d],
    hour: h,
    value: Math.round(Math.random() * 100),
  }))
).flat();

export const copilotSuggestions = [
  "Expand indirect links via Cluster-7 community detection",
  "Run temporal overlap on UTC+5:30 peak hours for both accounts",
  "Export Section 65B evidence chain for CID-2026-0001",
];
