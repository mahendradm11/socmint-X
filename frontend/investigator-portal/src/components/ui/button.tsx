import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber/60 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-cyber text-white hover:bg-cyber-glow shadow-glow",
        ghost: "bg-transparent text-slate-300 hover:bg-white/5 border border-white/10",
        outline: "border border-cyber/40 text-cyber-glow hover:bg-cyber/10",
        danger: "bg-intel-crimson/20 text-intel-crimson border border-intel-crimson/40 hover:bg-intel-crimson/30",
        intel: "bg-intel-teal/20 text-intel-teal border border-intel-teal/40 hover:bg-intel-teal/30",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-6 text-sm",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
