import { motion } from "framer-motion";
import {
  Activity,
  Brain,
  FileBadge,
  Fingerprint,
  GitBranch,
  LayoutDashboard,
  Network,
  ScrollText,
  Shield,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", icon: LayoutDashboard, label: "Command Center" },
  { to: "/correlation", icon: Network, label: "Identity Correlation" },
  { to: "/behavioral", icon: Fingerprint, label: "Behavioral Intel" },
  { to: "/attribution", icon: GitBranch, label: "Attribution Engine" },
  { to: "/timeline", icon: Activity, label: "Timeline Explorer" },
  { to: "/copilot", icon: Brain, label: "Investigator AI" },
  { to: "/evidence", icon: FileBadge, label: "Evidence Reports" },
  { to: "/cases", icon: Shield, label: "Case Operations" },
  { to: "/audit", icon: ScrollText, label: "DPDP Audit" },
];

export function Sidebar() {
  return (
    <aside className="relative z-20 flex w-[248px] shrink-0 flex-col border-r border-white/[0.06] bg-navy-950/90 backdrop-blur-xl">
      <div className="border-b border-white/[0.06] px-4 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyber/20 shadow-glow">
            <Shield className="h-5 w-5 text-cyber-glow" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-gradient-intel">SOCMINT</p>
            <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-500">
              CID Karnataka
            </p>
          </div>
        </div>
        <p className="mt-3 text-[10px] leading-snug text-slate-500">
          Cross-Platform Identity Attribution &amp; Behavioral Intelligence
        </p>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {nav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                isActive
                  ? "bg-cyber/15 text-cyber-glow"
                  : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="nav-glow"
                    className="absolute inset-0 rounded-lg border border-cyber/30 shadow-glow"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="relative h-4 w-4 shrink-0" />
                <span className="relative font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-white/[0.06] p-3">
        <div className="rounded-lg bg-navy-800/80 p-3 font-mono text-[10px] text-slate-500">
          <span className="text-intel-teal">●</span> SECURE CHANNEL
          <br />
          TLS 1.3 · DPDP 2023
        </div>
      </div>
    </aside>
  );
}
