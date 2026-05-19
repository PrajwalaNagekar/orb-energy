import { PageShell } from "@/components/PageShell";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { jobs } from "@/lib/mock-data";
import { Camera, PenTool, Package, ChevronRight, Wifi, MapPin, CheckCircle2, Circle, AlertOctagon } from "lucide-react";

const checklist = [
  { task: "Visual inspection of panels", done: true },
  { task: "Thermal scan of inverter", done: true },
  { task: "Verify DC voltage at junction", done: false },
  { task: "Replace inverter PCB", done: false },
  { task: "Re-commission system", done: false },
];

function JobsPage() {
  return (
    <PageShell title="Technician Workspace" subtitle="Field jobs · offline-first · synced 2 min ago">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Today's route</h3>
            <span className="flex items-center gap-1.5 text-xs text-success"><Wifi className="h-3.5 w-3.5" /> Synced</span>
          </div>
          <div className="space-y-3">
            {jobs.map((j, i) => (
              <div key={j.id} className="flex items-start gap-3 p-3 rounded-lg border border-border/60 hover:border-primary/30 hover:bg-muted/30 transition-colors cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold shrink-0">{i + 1}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={j.priority} />
                    <span className="text-xs text-muted-foreground font-mono">{j.id}</span>
                  </div>
                  <p className="font-medium text-sm mt-1.5">{j.task}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><MapPin className="h-3 w-3" /> {j.customer} · {j.site}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold tabular-nums">{j.eta}</p>
                  <p className="text-xs text-muted-foreground">{j.status}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground self-center" />
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5 bg-[image:var(--gradient-solar)] border-0 text-solar-foreground">
            <p className="text-xs uppercase tracking-wider font-medium opacity-80">Active job</p>
            <h3 className="text-lg font-semibold mt-1">JOB-7821 · Apollo Hospitals</h3>
            <p className="text-sm opacity-90 mt-1">Replace inverter PCB · P1</p>
          </Card>

          <Card className="p-5">
            <h4 className="font-semibold text-sm mb-3">Diagnostic checklist</h4>
            <div className="space-y-2">
              {checklist.map((c) => (
                <div key={c.task} className="flex items-center gap-2 text-sm">
                  {c.done ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Circle className="h-4 w-4 text-muted-foreground" />}
                  <span className={c.done ? "line-through text-muted-foreground" : ""}>{c.task}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h4 className="font-semibold text-sm mb-3">Capture</h4>
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" className="h-20 flex-col gap-1"><Camera className="h-4 w-4" /><span className="text-[10px]">Photo</span></Button>
              <Button variant="outline" className="h-20 flex-col gap-1"><PenTool className="h-4 w-4" /><span className="text-[10px]">Signature</span></Button>
              <Button variant="outline" className="h-20 flex-col gap-1"><Package className="h-4 w-4" /><span className="text-[10px]">Parts</span></Button>
            </div>
            <Button variant="outline" className="w-full mt-3 text-destructive border-destructive/40 hover:bg-destructive/5">
              <AlertOctagon className="h-3.5 w-3.5 mr-1.5" /> Escalate to L2
            </Button>
            <Button className="w-full mt-2">Complete job</Button>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

export default JobsPage;
