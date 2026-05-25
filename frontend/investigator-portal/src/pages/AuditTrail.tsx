import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Fingerprint } from "lucide-react";
import { api } from "@/lib/api/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Log = {
  id: number;
  action: string;
  resource_type: string;
  resource_id: string | null;
  integrity_hash: string;
  created_at: string;
};

export default function AuditTrail() {
  const [logs, setLogs] = useState<Log[]>([]);

  useEffect(() => {
    api.auditLogs().then((data) => setLogs(data as Log[])).catch(() => {});
  }, []);

  return (
    <Card glow="teal">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fingerprint className="h-4 w-4 text-intel-teal" />
          DPDP Act 2023 — Integrity-hashed audit log
        </CardTitle>
        <Badge variant="success">Tamper-evident</Badge>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] font-mono uppercase text-slate-500 border-b border-white/[0.06]">
                <th className="pb-2 pr-4">Timestamp</th>
                <th className="pb-2 pr-4">Action</th>
                <th className="pb-2 pr-4">Resource</th>
                <th className="pb-2">SHA-256 hash</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-white/[0.04] font-mono text-xs"
                >
                  <td className="py-3 text-slate-500 pr-4">
                    {log.created_at ? new Date(log.created_at).toLocaleString() : "—"}
                  </td>
                  <td className="py-3 text-cyber-glow pr-4">{log.action}</td>
                  <td className="py-3 text-slate-400 pr-4">
                    {log.resource_type}
                    {log.resource_id ? ` #${log.resource_id}` : ""}
                  </td>
                  <td className="py-3 text-slate-600">{log.integrity_hash.slice(0, 24)}…</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
