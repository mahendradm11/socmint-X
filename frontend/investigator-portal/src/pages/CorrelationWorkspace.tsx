import { Filter, Focus, Layers } from "lucide-react";
import { CorrelationGraph } from "@/components/graphs/CorrelationGraph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIntelStore } from "@/store/useIntelStore";

export default function CorrelationWorkspace() {
  const focusMode = useIntelStore((s) => s.focusMode);
  const setFocusMode = useIntelStore((s) => s.setFocusMode);
  const selectedNodeId = useIntelStore((s) => s.selectedNodeId);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant={focusMode ? "default" : "outline"} size="sm" onClick={() => setFocusMode(!focusMode)}>
          <Focus className="h-4 w-4" /> Investigation focus {focusMode ? "ON" : "OFF"}
        </Button>
        <Button variant="ghost" size="sm">
          <Filter className="h-4 w-4" /> Filter entities
        </Button>
        <Button variant="ghost" size="sm">
          <Layers className="h-4 w-4" /> Community layers
        </Button>
        <Badge variant="muted">Louvain · Indirect linkage · A→B→C</Badge>
      </div>

      <div className="grid gap-4 xl:grid-cols-4">
        <Card className="xl:col-span-3 p-0 overflow-hidden" glow="cyber">
          <CorrelationGraph />
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Entity inspector</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedNodeId ? (
                <div className="space-y-2 font-mono text-xs text-slate-400">
                  <p>
                    Node: <span className="text-cyber-glow">{selectedNodeId}</span>
                  </p>
                  <p>Indirect paths: 2 discovered</p>
                  <p>Shortest path confidence: 87%</p>
                  <p className="text-slate-500 mt-4">Drag nodes · Scroll to zoom · Click for focus</p>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Select a node to inspect relationships and confidence overlays.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Connection legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[10px] font-mono text-slate-500">
              <p>
                <span className="inline-block w-6 h-0.5 bg-emerald-400 mr-2 align-middle" /> High confidence (&gt;85%)
              </p>
              <p>
                <span className="inline-block w-6 h-0.5 bg-cyber-glow mr-2 align-middle" /> Medium (70–85%)
              </p>
              <p>
                <span className="inline-block w-6 border-t border-dashed border-violet-400 w-6 mr-2 align-middle" /> Indirect
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
