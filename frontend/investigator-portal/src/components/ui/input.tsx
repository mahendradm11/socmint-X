import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-lg border border-white/10 bg-navy-950/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyber/50 focus:outline-none focus:ring-1 focus:ring-cyber/40 font-mono",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-[100px] w-full rounded-lg border border-white/10 bg-navy-950/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyber/50 focus:outline-none focus:ring-1 focus:ring-cyber/40 resize-y",
        className
      )}
      {...props}
    />
  );
}
