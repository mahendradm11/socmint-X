import { Download, FileText, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function EvidenceReports() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card glow="cyber" className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Intelligence report preview — prosecution-ready layout</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4" /> Export PDF (Phase 5)
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border border-white/10 bg-white/[0.02] p-8 font-serif text-slate-300 max-w-3xl mx-auto shadow-panel">
            <div className="border-b border-white/10 pb-4 mb-6">
              <p className="text-[10px] uppercase tracking-widest text-slate-500">CID Karnataka · Confidential</p>
              <h2 className="text-xl text-slate-100 mt-2">SOCMINT Attribution Intelligence Report</h2>
              <p className="text-sm text-slate-500 mt-1">Case CID-2026-0001 · Generated {new Date().toLocaleDateString()}</p>
            </div>
            <section className="space-y-4 text-sm">
              <p>
                <strong className="text-slate-200">Executive summary:</strong> Multi-modal behavioral analysis
                indicates HIGH correlation (84%) between Account @burner_x and @suspect_main across stylometric,
                temporal, and NLP modalities.
              </p>
              <p>
                <strong className="text-slate-200">Evidence chain:</strong> SHA-256 audit hashes attached per DPDP
                Act 2023. IT Act 2000 Section 65B certification block included.
              </p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                {["Stylometry +35", "Temporal +18", "NLP +28", "Geo conflict -8"].map((item) => (
                  <div key={item} className="rounded border border-white/10 px-3 py-2 font-mono text-xs">
                    {item}
                  </div>
                ))}
              </div>
            </section>
            <div className="mt-8 pt-4 border-t border-white/10 flex items-center gap-2 text-[10px] font-mono text-slate-500">
              <ShieldCheck className="h-4 w-4 text-intel-teal" />
              Digital integrity hash: a7f3…e92b · Investigator: authorized
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-4 w-4" /> Evidence cards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { title: "Attribution matrix", conf: "84%" },
            { title: "Audit log excerpt", conf: "100%" },
            { title: "Graph export snapshot", conf: "91%" },
          ].map((e) => (
            <div key={e.title} className="flex justify-between rounded-lg border border-white/[0.06] bg-navy-900/50 px-3 py-2">
              <span className="text-sm text-slate-300">{e.title}</span>
              <Badge variant="success">{e.conf}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Compliance checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-400">
          <p>✓ Public data sources only</p>
          <p>✓ Purpose limitation (investigation)</p>
          <p>✓ Full query audit trail</p>
          <p>✓ Explainable AI — no black-box</p>
          <p>✓ Role-based access enforced</p>
        </CardContent>
      </Card>
    </div>
  );
}
