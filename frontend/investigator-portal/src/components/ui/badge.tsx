import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "border-cyber/40 bg-cyber/15 text-cyber-glow",
        success: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
        warning: "border-intel-amber/40 bg-intel-amber/10 text-intel-amber",
        danger: "border-intel-crimson/40 bg-intel-crimson/10 text-intel-crimson",
        muted: "border-white/10 bg-white/5 text-slate-400",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export function Badge({
  className,
  variant,
  children,
}: {
  className?: string;
  variant?: VariantProps<typeof badgeVariants>["variant"];
  children: React.ReactNode;
}) {
  return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>;
}
