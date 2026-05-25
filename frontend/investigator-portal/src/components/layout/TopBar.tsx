import { Bell, LogOut, Radio, Search, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const navigate = useNavigate();
  const user = localStorage.getItem("socmint_user") || "investigator";

  function logout() {
    localStorage.removeItem("socmint_token");
    localStorage.removeItem("socmint_user");
    navigate("/login");
  }

  return (
    <header className="relative z-10 flex h-14 shrink-0 items-center justify-between border-b border-white/[0.06] bg-navy-950/60 px-6 backdrop-blur-md">
      <div>
        <h1 className="text-base font-semibold text-slate-100">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500 font-mono">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input className="w-72 pl-9 h-9 bg-navy-900/80" placeholder="Search indicators, cases, entities…" />
        </div>
        <Badge variant="success" className="hidden md:inline-flex gap-1">
          <Radio className="h-3 w-3 animate-pulse_intel" /> LIVE
        </Badge>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-intel-crimson" />
        </Button>
        <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-navy-900/80 px-3 py-1.5">
          <User className="h-4 w-4 text-cyber-glow" />
          <span className="text-xs font-mono text-slate-300">{user}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
