import { FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderPlus, Shield } from "lucide-react";
import { api } from "@/lib/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type CaseRow = {
  id: number;
  case_number: string;
  title: string;
  status: string;
  indicator_count: number;
  created_at: string;
};

export default function CasesWorkspace() {
  const [cases, setCases] = useState<CaseRow[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [indicator, setIndicator] = useState("");
  const [msg, setMsg] = useState("");

  function refresh() {
    api.listCases().then(setCases).catch(() => {});
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    try {
      await api.createCase({
        title,
        description,
        seed_indicators: indicator.trim()
          ? [{ indicator_type: "username", value: indicator, platform: "twitter", label: "" }]
          : [],
      });
      setTitle("");
      setDescription("");
      setIndicator("");
      setMsg("Case operation registered.");
      refresh();
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-2" glow="cyber">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderPlus className="h-4 w-4" /> New investigation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onCreate} className="space-y-3">
            <Input placeholder="Case title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Textarea placeholder="Operational description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Input placeholder="Seed indicator (@username)" value={indicator} onChange={(e) => setIndicator(e.target.value)} />
            <Button type="submit" className="w-full">Create case</Button>
            {msg && <p className="text-xs text-intel-teal font-mono">{msg}</p>}
          </form>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-4 w-4" /> Active operations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-left text-[10px] font-mono uppercase text-slate-500">
                  <th className="pb-2">Case ID</th>
                  <th className="pb-2">Title</th>
                  <th className="pb-2">Indicators</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c, i) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                  >
                    <td className="py-3 font-mono text-cyber-glow">{c.case_number}</td>
                    <td className="py-3 text-slate-200">{c.title}</td>
                    <td className="py-3 text-slate-400">{c.indicator_count}</td>
                    <td className="py-3">
                      <Badge variant="success">{c.status}</Badge>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            {cases.length === 0 && (
              <p className="text-sm text-slate-500 py-8 text-center">No active operations. Initialize first case.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
