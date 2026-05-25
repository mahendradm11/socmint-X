import { Handle, Position, type NodeProps } from "reactflow";
import { AtSign, Globe, Hash, Image, Mail, MapPin, Smartphone, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const typeConfig: Record<string, { icon: typeof AtSign; color: string }> = {
  account: { icon: AtSign, color: "border-cyber/50 bg-cyber/10 text-cyber-glow" },
  email: { icon: Mail, color: "border-intel-violet/50 bg-intel-violet/10 text-intel-violet" },
  ip: { icon: Globe, color: "border-slate-500/50 bg-slate-500/10 text-slate-300" },
  device: { icon: Smartphone, color: "border-intel-teal/50 bg-intel-teal/10 text-intel-teal" },
  image: { icon: Image, color: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400" },
  community: { icon: Users, color: "border-intel-amber/50 bg-intel-amber/10 text-intel-amber" },
  location: { icon: MapPin, color: "border-intel-crimson/50 bg-intel-crimson/10 text-intel-crimson" },
  hashtag: { icon: Hash, color: "border-cyber/40 bg-cyber/5 text-cyber-glow" },
};

export function IntelNode({ data, selected }: NodeProps) {
  const conf = (data.confidence as number) ?? 0.5;
  const type = (data.type as string) ?? "account";
  const cfg = typeConfig[type] ?? typeConfig.account;
  const Icon = cfg.icon;

  const glow =
    conf >= 0.85 ? "node-glow-high shadow-glow" : conf >= 0.7 ? "node-glow-medium" : "node-glow-low";

  return (
    <div
      className={cn(
        "min-w-[140px] rounded-xl border px-3 py-2 backdrop-blur-md transition-all",
        cfg.color,
        glow,
        selected && "ring-2 ring-cyber/60"
      )}
    >
      <Handle type="target" position={Position.Left} className="!bg-cyber !w-2 !h-2" />
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 shrink-0" />
        <div>
          <p className="text-xs font-semibold text-slate-100">{data.label as string}</p>
          <p className="text-[9px] font-mono uppercase text-slate-500">{type}</p>
        </div>
      </div>
      <p className="mt-1 text-[10px] font-mono text-right text-slate-400">
        {(conf * 100).toFixed(0)}% conf
      </p>
      <Handle type="source" position={Position.Right} className="!bg-cyber !w-2 !h-2" />
    </div>
  );
}
