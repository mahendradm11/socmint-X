import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  glow,
}: {
  className?: string;
  children: React.ReactNode;
  glow?: "cyber" | "teal" | "crimson" | "none";
}) {
  const glowClass =
    glow === "cyber"
      ? "shadow-glow"
      : glow === "teal"
        ? "shadow-glow-teal"
        : glow === "crimson"
          ? "shadow-glow-crimson"
          : "";
  return (
    <div className={cn("glass-panel scanline-overlay relative overflow-hidden", glowClass, className)}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("flex items-center justify-between border-b border-white/[0.06] px-4 py-3", className)}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return <h3 className={cn("text-sm font-semibold tracking-wide text-slate-200", className)}>{children}</h3>;
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("p-4", className)}>{children}</div>;
}
