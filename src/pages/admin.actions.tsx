import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { adminAlerts } from "@/lib/admin-data";
import { Sparkles, Zap, Send, X } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { toast } from "sonner";

function Actions() {
  const [acted, setActed] = useState<Record<string, "dispatched" | "dismissed">>({});

  const sorted = [...adminAlerts].sort((a, b) => {
    const w = (s: string) => (s === "critical" ? 0 : s === "warning" ? 1 : 2);
    return w(a.severity) - w(b.severity) || b.confidence - a.confidence;
  });

  return (
    <PageShell title="AI Smart Actions" subtitle="Prioritised, explainable alerts with one-click intervention">
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-solar/5 p-5">
        <div className="flex items-center gap-2 text-primary text-sm font-semibold">
          <Sparkles className="h-4 w-4" /> Orb-AI Smart Actions
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {sorted.length} alerts ranked by severity, confidence and business impact. Each action is fully auditable.
        </p>
      </div>

      <div className="space-y-3">
        {sorted.map((a) => {
          const state = acted[a.id];
          return (
            <Card key={a.id} className={`p-5 transition-all ${state === "dispatched" ? "opacity-60" : ""}`}>
              <div className="flex flex-wrap items-start gap-3">
                <div className="flex-1 min-w-[260px]">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={a.severity} />
                    <span className="font-mono text-[10px] text-muted-foreground">{a.id}</span>
                    <span className="text-[10px] font-bold text-info bg-info/10 px-1.5 py-0.5 rounded uppercase">
                      {a.confidence}% confidence
                    </span>
                    {a.cluster && <span className="text-[10px] text-muted-foreground">cluster {a.cluster}</span>}
                  </div>
                  <h3 className="font-semibold mt-1.5">{a.title}</h3>
                  <p className="text-sm text-muted-foreground">{a.site} · {a.panel} · {a.time}</p>
                  <p className="text-sm mt-2">{a.detail}</p>

                  <div className="mt-3 rounded-lg border border-primary/15 bg-primary/5 p-3">
                    <p className="text-[11px] uppercase tracking-wider text-primary font-semibold flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> Why this matters
                    </p>
                    <p className="text-sm mt-1">{a.ai}</p>
                  </div>

                  <div className="mt-2 rounded-lg border border-success/20 bg-success/5 p-3">
                    <p className="text-[11px] uppercase tracking-wider text-success font-semibold flex items-center gap-1">
                      <Zap className="h-3 w-3" /> Suggested action
                    </p>
                    <p className="text-sm mt-1">{a.suggested}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 w-full sm:w-44">
                  {state === "dispatched" ? (
                    <span className="text-xs text-success font-semibold inline-flex items-center gap-1"><Send className="h-3.5 w-3.5" /> Dispatched</span>
                  ) : state === "dismissed" ? (
                    <span className="text-xs text-muted-foreground font-semibold inline-flex items-center gap-1"><X className="h-3.5 w-3.5" /> Dismissed</span>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        onClick={() => {
                          setActed((s) => ({ ...s, [a.id]: "dispatched" }));
                          toast.success("Auto-dispatched", { description: `${a.id} · ${a.suggested}` });
                        }}
                      >
                        <Send className="h-3.5 w-3.5 mr-1" /> Auto-dispatch
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast.info("Escalated to Operations Lead")}
                      >
                        Escalate
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setActed((s) => ({ ...s, [a.id]: "dismissed" }));
                          toast("Dismissed");
                        }}
                      >
                        Dismiss
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
}

export default Actions;
