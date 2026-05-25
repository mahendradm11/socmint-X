import { Navigate, Route, Routes } from "react-router-dom";
import { CommandShell } from "@/components/layout/CommandShell";
import Login from "@/pages/Login";
import CommandCenter from "@/pages/CommandCenter";
import CorrelationWorkspace from "@/pages/CorrelationWorkspace";
import BehavioralDashboard from "@/pages/BehavioralDashboard";
import AttributionWorkspace from "@/pages/AttributionWorkspace";
import TimelineExplorer from "@/pages/TimelineExplorer";
import InvestigatorCopilot from "@/pages/InvestigatorCopilot";
import EvidenceReports from "@/pages/EvidenceReports";
import CasesWorkspace from "@/pages/CasesWorkspace";
import AuditTrail from "@/pages/AuditTrail";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("socmint_token");
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <CommandShell />
          </PrivateRoute>
        }
      >
        <Route index element={<CommandCenter />} />
        <Route path="correlation" element={<CorrelationWorkspace />} />
        <Route path="behavioral" element={<BehavioralDashboard />} />
        <Route path="attribution" element={<AttributionWorkspace />} />
        <Route path="timeline" element={<TimelineExplorer />} />
        <Route path="copilot" element={<InvestigatorCopilot />} />
        <Route path="evidence" element={<EvidenceReports />} />
        <Route path="cases" element={<CasesWorkspace />} />
        <Route path="audit" element={<AuditTrail />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
