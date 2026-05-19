import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  healthy: "bg-success/10 text-success border-success/20",
  warning: "bg-warning/15 text-warning-foreground border-warning/30",
  critical: "bg-destructive/10 text-destructive border-destructive/20",
  info: "bg-info/10 text-info border-info/20",
  P1: "bg-destructive/10 text-destructive border-destructive/20",
  P2: "bg-warning/15 text-warning-foreground border-warning/30",
  P3: "bg-info/10 text-info border-info/20",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const key = status.toLowerCase();
  const style = styles[status] ?? styles[key] ?? "bg-muted text-muted-foreground border-border";
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize", style, className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
