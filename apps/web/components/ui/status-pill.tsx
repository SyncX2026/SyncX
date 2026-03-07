import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const statusPillVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      status: {
        default: "border-transparent bg-primary text-primary-foreground",
        success: "border-transparent bg-emerald-500/10 text-emerald-500",
        warning: "border-transparent bg-amber-500/10 text-amber-500",
        error: "border-transparent bg-red-500/10 text-red-500",
        info: "border-transparent bg-cyan-500/10 text-cyan-500",
        neutral: "border-transparent bg-zinc-800 text-zinc-400",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
);

export interface StatusPillProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusPillVariants> {}

export function StatusPill({ className, status, ...props }: StatusPillProps) {
  return (
    <div className={cn(statusPillVariants({ status }), className)} {...props} />
  );
}
