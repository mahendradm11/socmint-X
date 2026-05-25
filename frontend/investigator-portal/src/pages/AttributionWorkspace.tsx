import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Scale, Sparkles } from "lucide-react";
import { ConfidenceRing } from "@/components/intelligence/ConfidenceRing";
import { ModalityBreakdown } from "@/components/intelligence/ModalityBreakdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { modalityIndicators } from "@/data/mockIntelligence";
import { api } from "@/lib/api/client";
import { cn, riskColor } from "@/lib/utils";

const SAMPLE_A = `ನಮಸ್ಕಾರ friends, this offer is 100% genuine!
Just DM me fast — limited slots only!!!`;

const SAMPLE_B = `ನಮಸ್ಕಾರ friends, this offer is 100% genuine!
Just DM me fast — limited slots only!!!`;

type Result = {
  confidence_score: number;
  risk_level: string;
  reasoning_chain: string[];
  modality_scores: Array<{ modality: string; score: number; weight: number; evidence: string }>;
};

export default function AttributionWorkspace() {
  const [labelA, setLabelA] = useState("@burner_x");
  const [labelB, setLabelB] = useState("@suspect_main");
  const [textA, setTextA] = useState(SAMPLE_A);
  const [textB, setTextB] = useState(SAMPLE_B);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onRun(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const now = new Date();
    const posts = (t: string) =>
      t.split("\n\n").filter(Boolean).map((text, i) => ({
        text: text.trim(),
        timestamp: new Date(now.getTime() - i * 3600000 * 5).toISOString(),
      }));

    try {
      const res = await api.runAttribution({
        account_a: { label: labelA, posts: posts(textA) },
        account_b: { label: labelB, posts: posts(textB) },
      });
      setResult(res as Result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Attribution failed");
    } finally {
      setLoading(false);
    }
  }

  const displayScore = result?.confidence_score ?? 0.84;
  const displayRisk = result?.risk_level ?? "HIGH";

  return (
    <div className="grid gap-6 xl:grid-cols-12">
      <form onSubmit={onRun} className="xl:col-span-4 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Corpus input</CardTitle>
            <Badge variant="muted">Live API</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-500">Account A</label>
              <Input value={labelA} onChange={(e) => setLabelA(e.target.value)} className="mt-1" />
              <Textarea value={textA} onChange={(e) => setTextA(e.target.value)} className="mt-2 min-h-[100px]" />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase text-slate-500">Account B</label>
              <Input value={labelB} onChange={(e) => setLabelB(e.target.value)} className="mt-1" />
              <Textarea value={textB} onChange={(e) => setTextB(e.target.value)} className="mt-2 min-h-[100px]" />
            </div>
            {error && <p className="text-xs text-intel-crimson">{error}</p>}
            <Button type="submit" disabled={loading} className="w-full">
              <Sparkles className="h-4 w-4" />
              {loading ? "Fusing modalities…" : "Execute attribution fusion"}
            </Button>
          </CardContent>
        </Card>
      </form>

      <div className="xl:col-span-8 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Card glow="cyber" className="flex flex-col items-center justify-center py-8 relative">
            <div className="relative">
              <ConfidenceRing score={displayScore} label="Attribution" riskLevel={displayRisk} />
            </div>
            <p className={cn("mt-4 px-4 py-1 rounded-full border text-xs font-semibold uppercase", riskColor(displayRisk))}>
              {displayRisk} correlation confidence
            </p>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-cyber-glow" />
                Explainable indicators
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ModalityBreakdown items={modalityIndicators} />
              <p className="mt-4 text-center text-lg font-semibold text-gradient-intel">
                {Math.round(displayScore * 100)}% — {displayRisk} Correlation Confidence
              </p>
            </CardContent>
          </Card>
        </div>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>AI reasoning chain — court-ready transparency</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.reasoning_chain.map((line, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="rounded-lg border border-white/[0.06] bg-navy-900/50 px-3 py-2 text-sm text-slate-400"
                  >
                    {line}
                  </motion.li>
                ))}
              </ul>
              {result.modality_scores.length > 0 && (
                <div className="mt-4 grid gap-2 sm:grid-cols-3">
                  {result.modality_scores.map((m) => (
                    <div key={m.modality} className="rounded-lg bg-cyber/5 border border-cyber/20 p-2">
                      <p className="text-[10px] text-slate-500">{m.modality}</p>
                      <p className="text-lg font-mono text-cyber-glow">{(m.score * 100).toFixed(0)}%</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
