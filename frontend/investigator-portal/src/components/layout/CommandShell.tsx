import { Outlet, useLocation } from "react-router-dom";
import { CyberGrid } from "./CyberGrid";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

const titles: Record<string, { title: string; subtitle: string }> = {
  "/": { title: "Intelligence Command Center", subtitle: "OPERATIONAL OVERVIEW · REAL-TIME SOC" },
  "/correlation": { title: "Identity Correlation Workspace", subtitle: "GRAPH INTELLIGENCE · ENTITY LINKAGE" },
  "/behavioral": { title: "Behavioral Fingerprinting", subtitle: "STYLOMETRY · TEMPORAL · EVASION SIGNALS" },
  "/attribution": { title: "Explainable Attribution Engine", subtitle: "MULTI-MODAL FUSION · COURT-READY SCORING" },
  "/timeline": { title: "Investigation Timeline Explorer", subtitle: "CHRONOLOGICAL SUSPECT EVOLUTION" },
  "/copilot": { title: "Investigator AI Co-Pilot", subtitle: "ANALYST ASSIST · EVIDENCE SYNTHESIS" },
  "/evidence": { title: "Evidence Report Generator", subtitle: "SECTION 65B · DPDP AUDIT CHAIN" },
  "/cases": { title: "Case Operations", subtitle: "SEED INDICATORS · INVESTIGATION MANAGEMENT" },
  "/audit": { title: "DPDP Compliance Audit", subtitle: "INTEGRITY-HASHED ACTION LOG" },
};

export function CommandShell() {
  const { pathname } = useLocation();
  const meta = titles[pathname] ?? { title: "SOCMINT Platform", subtitle: "CID KARNATAKA" };

  return (
    <div className="relative flex min-h-screen">
      <CyberGrid />
      <div className="pointer-events-none fixed inset-0 bg-radial-command z-0" />
      <Sidebar />
      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
        <TopBar title={meta.title} subtitle={meta.subtitle} />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
