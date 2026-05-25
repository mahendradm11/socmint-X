# SOCMINT Frontend Architecture

## Stack
| Layer | Technology |
|-------|------------|
| Framework | React 19 + Vite 6 + TypeScript |
| Styling | Tailwind CSS 3 (custom intelligence tokens) |
| Motion | Framer Motion |
| UI primitives | shadcn-style (`components/ui`) |
| Graphs | React Flow (correlation), Cytoscape-ready (`infrastructure/graph`) |
| Charts | Recharts |
| Icons | Lucide React |
| State | Zustand (`store/useIntelStore`) |

## Folder structure
```
src/
├── app/                 # (routes in App.tsx)
├── components/
│   ├── ui/              # Button, Card, Badge, Input, MetricTile
│   ├── layout/          # CommandShell, Sidebar, TopBar, CyberGrid
│   ├── graphs/          # CorrelationGraph, IntelNode
│   └── intelligence/    # ConfidenceRing, ModalityBreakdown
├── pages/               # One module per operational screen
├── lib/                 # utils, api/client
├── store/               # Zustand global UI state
├── data/                # mockIntelligence (dashboard/graph demos)
└── styles/globals.css   # Design system tokens
```

## Page hierarchy
1. **Command Center** `/` — SOC overview, metrics, heatmaps
2. **Identity Correlation** `/correlation` — React Flow entity graph
3. **Behavioral Intel** `/behavioral` — Radar, heatmaps, rhythm
4. **Attribution Engine** `/attribution` — Live API + explainable AI
5. **Timeline Explorer** `/timeline` — Cinematic event chain
6. **Investigator AI** `/copilot` — Analyst assistant panel
7. **Evidence Reports** `/evidence` — PDF-ready preview
8. **Case Operations** `/cases` — Live case API
9. **DPDP Audit** `/audit` — Live audit API

## Design system
- **Colors:** void, navy-*, cyber, intel-teal/amber/crimson
- **Typography:** IBM Plex Sans (UI), JetBrains Mono (data)
- **Panels:** `.glass-panel`, `.intel-border`, scanline overlay
- **Motion:** staggered page entry, metric tiles, graph node glow by confidence

## State management
- **Server:** FastAPI via `lib/api/client` (JWT in localStorage)
- **Client:** Zustand for graph focus mode, selected node, filters

## Graph strategy
- **Primary:** React Flow with custom `IntelNode`, confidence-based edge colors
- **Future:** Cytoscape.js for Louvain community layout at 10k+ nodes

## Responsive strategy
- Desktop-first (ultra-wide SOC layouts)
- Sidebar collapses on `< 800px` (add mobile drawer in Phase 2)
- Grid breakpoints: `sm`, `lg`, `xl`
