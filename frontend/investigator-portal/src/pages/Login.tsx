import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CyberGrid } from "@/components/layout/CyberGrid";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("investigator");
  const [password, setPassword] = useState("cid2025");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.login(username, password);
      localStorage.setItem("socmint_token", res.access_token);
      localStorage.setItem("socmint_user", res.username);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6">
      <CyberGrid />
      <div className="pointer-events-none fixed inset-0 bg-radial-command" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md glass-panel p-8 shadow-glow"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyber/20 shadow-glow">
            <Shield className="h-7 w-7 text-cyber-glow" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient-intel">SOCMINT Platform</h1>
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
              Identity Attribution &amp; Behavioral Intelligence
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-400 mb-6">
          Secure investigator access · CID Karnataka · DPDP Act 2023 compliant channel
        </p>

        {error && (
          <p className="mb-4 rounded-lg border border-intel-crimson/40 bg-intel-crimson/10 px-3 py-2 text-sm text-intel-crimson">
            {error}
          </p>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-mono uppercase text-slate-500">Operator ID</label>
            <Input className="mt-1" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase text-slate-500 flex items-center gap-1">
              <Lock className="h-3 w-3" /> Credential
            </label>
            <Input
              type="password"
              className="mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Authenticating…" : "Enter command center"}
          </Button>
        </form>

        <p className="mt-6 text-center text-[10px] font-mono text-slate-600">
          DEMO · investigator / cid2025
        </p>
      </motion.div>
    </div>
  );
}
