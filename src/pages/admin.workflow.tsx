import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { workflowQueues, automationRules, dispatches } from "@/lib/admin-data";
import { Workflow, Play, Pause, CheckCircle2, ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { toast } from "sonner";

const toneMap: Record<string, string> = {
  info: "bg-info/10 text-info",
  warning: "bg-warning/15 text-warning-foreground",
  primary: "bg-primary/10 text-primary",
  destructive: "bg-destructive/10 text-destructive",
  solar: "bg-solar/15 text-solar-foreground",
  success: "bg-success/10 text-success" };

function WF() {
  const [rules, setRules] = useState(automationRules);

  const toggle = (id: string) => {
    setRules((r) => r.map((x) => x.id === id ? { ...x, enabled: !x.enabled } : x));
    toast.success("Rule updated");
  };

  return (
    <PageShell title="Workflow Engine" subtitle="State visibility · automation · approvals · escalation">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {workflowQueues.map((q) => (
          <Card key={q.name} className="p-4">
            <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${toneMap[q.color]}`}>
              <Workflow className="h-4 w-4" />
            </div>
            <p className="text-2xl font-bold tabular-nums mt-3">{q.count}</p>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{q.name}</p>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold">Dispatch queue</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Live job assignments · Orb-AI Dispatch Optimizer v1.8</p>
          </div>
          <Button size="sm" variant="outline" onClick={() => toast.success("Queue rebalanced")}>Rebalance</Button>
        </div>
        <div className="overflow-hidden rounded-lg border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-3 py-2 font-medium">Dispatch</th>
                <th className="text-left px-3 py-2 font-medium">Alert</th>
                <th className="text-left px-3 py-2 font-medium">Site</th>
                <th className="text-left px-3 py-2 font-medium">Tech</th>
                <th className="text-left px-3 py-2 font-medium">Priority</th>
                <th className="text-left px-3 py-2 font-medium">Status</th>
                <th className="text-right px-3 py-2 font-medium">ETA</th>
              </tr>
            </thead>
            <tbody>
              {dispatches.map((d) => (
                <tr key={d.id} className="border-t border-border/60 hover:bg-muted/30">
                  <td className="px-3 py-2.5 font-mono text-xs">{d.id}</td>
                  <td className="px-3 py-2.5 font-mono text-xs">{d.alertId}</td>
                  <td className="px-3 py-2.5 font-medium">{d.site}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{d.technician}</td>
                  <td className="px-3 py-2.5"><StatusBadge status={d.priority} /></td>
                  <td className="px-3 py-2.5"><StatusBadge status={d.status} /></td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-xs">{d.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold">Automation rules</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Rules engine · last 24h</p>
          </div>
          <Button size="sm" onClick={() => toast.success("New rule wizard opened")}>New rule</Button>
        </div>
        <div className="space-y-2">
          {rules.map((r) => (
            <div key={r.id} className="flex items-center gap-3 rounded-lg border border-border/60 p-3 hover:bg-muted/30">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${r.enabled ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                {r.enabled ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{r.name}</p>
                <p className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                  <span className="font-mono">{r.id}</span>
                  <ArrowRight className="h-3 w-3" />
                  Triggered {r.triggered} · success {r.success}
                  {r.success === r.triggered && r.triggered > 0 && <CheckCircle2 className="h-3 w-3 text-success" />}
                </p>
              </div>
              <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => toggle(r.id)}>
                {r.enabled ? "Disable" : "Enable"}
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </PageShell>
  );
}

export default WF;
