import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down" | "neutral";
  icon?: ReactNode;
  accent?: "primary" | "success" | "warning" | "info" | "solar";
  hint?: string;
}

const accentMap = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-warning-foreground",
  info: "bg-info/10 text-info",
  solar: "bg-solar/15 text-solar-foreground",
};

export function KpiCard({ label, value, delta, trend = "up", icon, accent = "primary", hint }: Props) {
  return (
    <Card className="p-5 border-border/60 hover:shadow-[var(--shadow-elevated)] transition-shadow">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        {icon && <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center", accentMap[accent])}>{icon}</div>}
      </div>
      {delta && (
        <div className={cn("mt-3 flex items-center gap-1 text-xs font-medium",
          trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground")}>
          {trend === "up" ? <ArrowUpRight className="h-3.5 w-3.5" /> : trend === "down" ? <ArrowDownRight className="h-3.5 w-3.5" /> : null}
          <span>{delta}</span>
          <span className="text-muted-foreground font-normal">vs last week</span>
        </div>
      )}
    </Card>
  );
}
