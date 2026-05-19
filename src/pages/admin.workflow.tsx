import { useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Workflow, Play, Pause, CheckCircle2, ArrowRight, Plus, Search,
  Activity, Clock, AlertTriangle, Zap, Filter, MoreHorizontal, TrendingUp,
  GitBranch, ChevronRight, XCircle, RotateCcw, Send, Sparkles,
} from "lucide-react";
import { workflowQueues, automationRules, dispatches, techniciansFull, type Dispatch } from "@/lib/admin-data";
import { StatusBadge } from "@/components/StatusBadge";
import { toast } from "sonner";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend,
} from "recharts";

const toneMap: Record<string, string> = {
  info: "bg-info/10 text-info",
  warning: "bg-warning/15 text-warning-foreground",
  primary: "bg-primary/10 text-primary",
  destructive: "bg-destructive/10 text-destructive",
  solar: "bg-solar/15 text-solar-foreground",
  success: "bg-success/10 text-success",
};

const PIPELINE: { key: Dispatch["status"]; label: string; tone: string }[] = [
  { key: "Queued",   label: "Queued",   tone: "bg-muted text-muted-foreground" },
  { key: "Assigned", label: "Assigned", tone: "bg-info/10 text-info" },
  { key: "En route", label: "En route", tone: "bg-warning/15 text-warning-foreground" },
  { key: "On site",  label: "On site",  tone: "bg-primary/10 text-primary" },
  { key: "Closed",   label: "Closed",   tone: "bg-success/10 text-success" },
];

const throughput7d = [
  { d: "Mon", opened: 18, closed: 14, sla: 96 },
  { d: "Tue", opened: 22, closed: 21, sla: 98 },
  { d: "Wed", opened: 14, closed: 17, sla: 94 },
  { d: "Thu", opened: 26, closed: 22, sla: 97 },
  { d: "Fri", opened: 19, closed: 24, sla: 99 },
  { d: "Sat", opened: 11, closed: 13, sla: 99 },
  { d: "Sun", opened: 9,  closed: 10, sla: 100 },
];

const approvals = [
  { id: "AP-501", title: "Replace PCB-A2 · Apollo Hosp.", requestor: "T-19 Rakesh", amount: "₹ 18,400", sla: "2h 12m", risk: "low" },
  { id: "AP-502", title: "Emergency cleaning crew · Tata Coffee", requestor: "T-12 Arjun", amount: "₹ 7,200", sla: "45m", risk: "med" },
  { id: "AP-503", title: "Inverter swap · InfoEdge Tower", requestor: "T-22 Vikram", amount: "₹ 64,000", sla: "Breached", risk: "high" },
];

const escalations = [
  { id: "ES-77", site: "Apollo Hospitals", reason: "P1 SLA breach > 4h",  level: "L2 → L3", owner: "Ops Lead", age: "1h 12m" },
  { id: "ES-78", site: "InfoEdge Tower",  reason: "Parts unavailable",   level: "L1 → L2", owner: "Supply",   age: "38m" },
  { id: "ES-79", site: "Mumbai DC",       reason: "Customer escalation", level: "L2 → L3", owner: "CSM",      age: "22m" },
];

const auditFeed = [
  { t: "12:42", who: "Rule R-01", what: "Auto-dispatched AL-2041 → T-12",     tone: "success" as const },
  { t: "12:38", who: "T-22",      what: "Marked D-9002 as On site",            tone: "info" as const },
  { t: "12:31", who: "Orb-AI",    what: "Re-balanced Chennai queue (3 jobs)",  tone: "primary" as const },
  { t: "12:24", who: "Approver",  what: "Approved AP-499 · ₹ 12,400",          tone: "success" as const },
  { t: "12:18", who: "Rule R-04", what: "Paged on-call: Gateway GW-12 offline", tone: "warning" as const },
  { t: "12:05", who: "T-19",      what: "Escalated JOB-7821 → L2",             tone: "destructive" as const },
];

const toneToClass: Record<string, string> = {
  success: "bg-success", info: "bg-info", primary: "bg-primary",
  warning: "bg-warning", destructive: "bg-destructive",
};

function WF() {
  const [rules, setRules] = useState(automationRules);
  const [board, setBoard]   = useState<Dispatch[]>(dispatches);
  const [query, setQuery]   = useState("");
  const [priority, setPriority] = useState<string>("all");
  const [region, setRegion] = useState<string>("all");
  const [selected, setSelected] = useState<Dispatch | null>(null);
  const [newRuleOpen, setNewRuleOpen] = useState(false);
  const [newRule, setNewRule] = useState({ name: "", trigger: "alert.created", action: "dispatch.auto" });

  const toggle = (id: string) => {
    setRules((r) => r.map((x) => x.id === id ? { ...x, enabled: !x.enabled } : x));
    toast.success("Rule updated");
  };

  const filtered = useMemo(() => board.filter((d) => {
    if (priority !== "all" && d.priority !== priority) return false;
    if (query && !`${d.id} ${d.alertId} ${d.site} ${d.technician}`.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  }), [board, priority, query]);

  const advance = (d: Dispatch) => {
    const idx = PIPELINE.findIndex((s) => s.key === d.status);
    if (idx < 0 || idx === PIPELINE.length - 1) return;
    const next = PIPELINE[idx + 1].key;
    setBoard((b) => b.map((x) => x.id === d.id ? { ...x, status: next } : x));
    toast.success(`${d.id} → ${next}`);
  };
  const reassign = (d: Dispatch, tech: string) => {
    setBoard((b) => b.map((x) => x.id === d.id ? { ...x, technician: tech } : x));
    toast.success(`${d.id} reassigned to ${tech}`);
  };

  const createRule = () => {
    if (!newRule.name) { toast.error("Rule name required"); return; }
    const id = `R-${(rules.length + 1).toString().padStart(2, "0")}`;
    setRules((r) => [...r, { id, name: newRule.name, enabled: true, triggered: 0, success: 0 }]);
    setNewRuleOpen(false);
    setNewRule({ name: "", trigger: "alert.created", action: "dispatch.auto" });
    toast.success(`Rule ${id} created`);
  };

  const automationHealth = Math.round((rules.reduce((a, r) => a + (r.triggered ? r.success / r.triggered : 1), 0) / rules.length) * 100);

  return (
    <PageShell
      title="Workflow Engine"
      subtitle="State visibility · automation · approvals · escalation"
      actions={
        <>
          <Button size="sm" variant="outline" onClick={() => toast.success("Live mode enabled")}>
            <Activity className="h-3.5 w-3.5" /> Live
          </Button>
          <Button size="sm" onClick={() => setNewRuleOpen(true)}>
            <Plus className="h-3.5 w-3.5" /> New rule
          </Button>
        </>
      }
    >
      {/* Queue tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {workflowQueues.map((q) => (
          <Card key={q.name} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start justify-between">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${toneMap[q.color]}`}>
                <Workflow className="h-4 w-4" />
              </div>
              <span className="text-[10px] text-success font-semibold inline-flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" /> {Math.floor(Math.random() * 12) + 2}%
              </span>
            </div>
            <p className="text-2xl font-bold tabular-nums mt-3">{q.count}</p>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{q.name}</p>
          </Card>
        ))}
      </div>

      {/* Health strip */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Card className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Automation success</p>
          <div className="flex items-end gap-2 mt-1">
            <p className="text-2xl font-bold tabular-nums">{automationHealth}%</p>
            <span className="text-[11px] text-success mb-1">stable</span>
          </div>
          <Progress value={automationHealth} className="h-1.5 mt-2" />
        </Card>
        <Card className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Avg MTTR</p>
          <div className="flex items-end gap-2 mt-1">
            <p className="text-2xl font-bold tabular-nums">2h 14m</p>
            <span className="text-[11px] text-success mb-1">-8%</span>
          </div>
          <Progress value={72} className="h-1.5 mt-2" />
        </Card>
        <Card className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">SLA compliance</p>
          <div className="flex items-end gap-2 mt-1">
            <p className="text-2xl font-bold tabular-nums">97.4%</p>
            <span className="text-[11px] text-success mb-1">+1.2</span>
          </div>
          <Progress value={97} className="h-1.5 mt-2" />
        </Card>
        <Card className="p-4">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Open escalations</p>
          <div className="flex items-end gap-2 mt-1">
            <p className="text-2xl font-bold tabular-nums">{escalations.length}</p>
            <span className="text-[11px] text-warning mb-1">1 P1</span>
          </div>
          <Progress value={42} className="h-1.5 mt-2" />
        </Card>
      </div>

      <Tabs defaultValue="pipeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pipeline"><GitBranch className="h-3.5 w-3.5" /> Pipeline</TabsTrigger>
          <TabsTrigger value="rules"><Zap className="h-3.5 w-3.5" /> Automation</TabsTrigger>
          <TabsTrigger value="approvals"><CheckCircle2 className="h-3.5 w-3.5" /> Approvals</TabsTrigger>
          <TabsTrigger value="escalations"><AlertTriangle className="h-3.5 w-3.5" /> Escalations</TabsTrigger>
          <TabsTrigger value="analytics"><TrendingUp className="h-3.5 w-3.5" /> Analytics</TabsTrigger>
          <TabsTrigger value="audit"><Clock className="h-3.5 w-3.5" /> Activity</TabsTrigger>
        </TabsList>

        {/* PIPELINE */}
        <TabsContent value="pipeline" className="space-y-3">
          <Card className="p-3 flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search dispatch, alert, site or technician…" className="pl-8 h-9" />
            </div>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="h-9 w-[130px]"><Filter className="h-3 w-3" /><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                <SelectItem value="P1">P1 critical</SelectItem>
                <SelectItem value="P2">P2 high</SelectItem>
                <SelectItem value="P3">P3 normal</SelectItem>
              </SelectContent>
            </Select>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="h-9 w-[130px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All regions</SelectItem>
                <SelectItem value="south">South</SelectItem>
                <SelectItem value="west">West</SelectItem>
                <SelectItem value="north">North</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant="outline" onClick={() => toast.success("Queue rebalanced by Orb-AI")}>
              <Sparkles className="h-3.5 w-3.5" /> Auto-balance
            </Button>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {PIPELINE.map((col) => {
              const items = filtered.filter((d) => d.status === col.key);
              return (
                <Card key={col.key} className="p-3 bg-muted/20 min-h-[280px]">
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${col.tone.split(" ")[0]}`} />
                      <span className="text-xs font-semibold uppercase tracking-wider">{col.label}</span>
                    </div>
                    <Badge variant="secondary" className="h-5 px-1.5 text-[10px] tabular-nums">{items.length}</Badge>
                  </div>
                  <div className="space-y-2">
                    {items.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => setSelected(d)}
                        className="rounded-lg border border-border/70 bg-background p-2.5 cursor-pointer hover:shadow-sm transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-muted-foreground">{d.id}</span>
                          <StatusBadge status={d.priority} />
                        </div>
                        <p className="text-sm font-medium mt-1 truncate">{d.site}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{d.alertId} · {d.technician}</p>
                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                          <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {d.eta}
                          </span>
                          {col.key !== "Closed" && (
                            <button
                              onClick={(e) => { e.stopPropagation(); advance(d); }}
                              className="text-[10px] text-primary font-semibold inline-flex items-center gap-0.5 hover:underline"
                            >
                              Advance <ChevronRight className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {!items.length && (
                      <div className="text-[11px] text-muted-foreground text-center py-6 border border-dashed border-border/60 rounded-lg">
                        empty
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* AUTOMATION */}
        <TabsContent value="rules">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold">Automation rules</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Triggered events from the last 24h · {rules.filter(r => r.enabled).length} active</p>
              </div>
              <Button size="sm" onClick={() => setNewRuleOpen(true)}><Plus className="h-3.5 w-3.5" /> New rule</Button>
            </div>
            <div className="space-y-2">
              {rules.map((r) => {
                const rate = r.triggered ? Math.round((r.success / r.triggered) * 100) : 100;
                return (
                  <div key={r.id} className="flex items-center gap-3 rounded-lg border border-border/60 p-3 hover:bg-muted/30">
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${r.enabled ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                      {r.enabled ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium truncate">{r.name}</p>
                        <Badge variant="outline" className="h-4 px-1 text-[9px] font-mono">{r.id}</Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 inline-flex items-center gap-2">
                        Triggered {r.triggered} · success {r.success} · {rate}%
                        {rate === 100 && r.triggered > 0 && <CheckCircle2 className="h-3 w-3 text-success" />}
                      </p>
                    </div>
                    <div className="w-28 hidden md:block">
                      <Progress value={rate} className="h-1.5" />
                    </div>
                    <Switch checked={r.enabled} onCheckedChange={() => toggle(r.id)} />
                    <Button size="icon" variant="ghost" className="h-8 w-8"><MoreHorizontal className="h-3.5 w-3.5" /></Button>
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        {/* APPROVALS */}
        <TabsContent value="approvals">
          <Card className="p-5 space-y-2">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="font-semibold">Pending approvals</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Awaiting sign-off · approver: Sahil A.</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast.success("All clear approvals batched")}>Bulk approve</Button>
            </div>
            {approvals.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-lg border border-border/60 p-3 hover:bg-muted/30">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${a.risk === "high" ? "bg-destructive/10 text-destructive" : a.risk === "med" ? "bg-warning/15 text-warning-foreground" : "bg-success/10 text-success"}`}>
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{a.title}</p>
                    <Badge variant="outline" className="h-4 px-1 text-[9px] font-mono">{a.id}</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">By {a.requestor} · SLA {a.sla}</p>
                </div>
                <p className="text-sm font-semibold tabular-nums">{a.amount}</p>
                <Button size="sm" variant="outline" className="h-8" onClick={() => toast.error(`${a.id} rejected`)}>
                  <XCircle className="h-3.5 w-3.5" /> Reject
                </Button>
                <Button size="sm" className="h-8" onClick={() => toast.success(`${a.id} approved`)}>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                </Button>
              </div>
            ))}
          </Card>
        </TabsContent>

        {/* ESCALATIONS */}
        <TabsContent value="escalations">
          <Card className="p-5 space-y-2">
            <div className="mb-1">
              <h3 className="font-semibold">Active escalations</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Tiered routing · on-call: Priya N.</p>
            </div>
            {escalations.map((e) => (
              <div key={e.id} className="flex items-center gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center bg-destructive/10 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">{e.site}</p>
                    <Badge variant="outline" className="h-4 px-1 text-[9px] font-mono">{e.id}</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{e.reason} · routed {e.level} · owner {e.owner} · open {e.age}</p>
                </div>
                <Button size="sm" variant="outline" className="h-8" onClick={() => toast.success(`${e.id} acknowledged`)}>Ack</Button>
                <Button size="sm" className="h-8" onClick={() => toast.success(`${e.id} resolved`)}>
                  <Send className="h-3.5 w-3.5" /> Resolve
                </Button>
              </div>
            ))}
          </Card>
        </TabsContent>

        {/* ANALYTICS */}
        <TabsContent value="analytics" className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <Card className="p-5 lg:col-span-2">
            <h3 className="font-semibold text-sm mb-1">Throughput · last 7 days</h3>
            <p className="text-xs text-muted-foreground mb-4">Opened vs closed dispatches</p>
            <div className="h-64">
              <ResponsiveContainer>
                <AreaChart data={throughput7d}>
                  <defs>
                    <linearGradient id="o" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--info))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--info))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="c" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--success))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--success))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="d" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Area type="monotone" dataKey="opened" stroke="hsl(var(--info))" fill="url(#o)" />
                  <Area type="monotone" dataKey="closed" stroke="hsl(var(--success))" fill="url(#c)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="font-semibold text-sm mb-1">SLA compliance</h3>
            <p className="text-xs text-muted-foreground mb-4">Daily %</p>
            <div className="h-64">
              <ResponsiveContainer>
                <BarChart data={throughput7d}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis dataKey="d" fontSize={11} />
                  <YAxis fontSize={11} domain={[80, 100]} />
                  <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="sla" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        {/* AUDIT */}
        <TabsContent value="audit">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold">Live activity feed</h3>
                <p className="text-xs text-muted-foreground mt-0.5">All workflow events · auto-refresh</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => toast.success("Feed refreshed")}>
                <RotateCcw className="h-3.5 w-3.5" /> Refresh
              </Button>
            </div>
            <div className="relative">
              <div className="absolute left-[7px] top-1 bottom-1 w-px bg-border" />
              <div className="space-y-3">
                {auditFeed.map((a, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div className={`h-3.5 w-3.5 rounded-full ring-4 ring-background ${toneToClass[a.tone]}`} />
                    <div className="flex-1 -mt-0.5">
                      <p className="text-sm">
                        <span className="font-medium">{a.who}</span>{" "}
                        <span className="text-muted-foreground">{a.what}</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground">{a.t}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dispatch detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  Dispatch {selected.id}
                  <StatusBadge status={selected.priority} />
                </DialogTitle>
                <DialogDescription>Alert {selected.alertId} · {selected.site}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Status</p>
                    <p className="font-medium mt-0.5">{selected.status}</p>
                  </div>
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">ETA</p>
                    <p className="font-medium mt-0.5">{selected.eta}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1.5">Reassign technician</p>
                  <Select value={selected.technician} onValueChange={(v) => reassign(selected, v)}>
                    <SelectTrigger className="h-9"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {techniciansFull.map((t) => (
                        <SelectItem key={t.id} value={t.id}>{t.id} · {t.name} · {t.region}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-lg border border-border/60 p-3 bg-muted/30">
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground inline-flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> Orb-AI recommendation
                  </p>
                  <p className="text-sm mt-1">Closest qualified technician within 8 km is <b>T-04 Sana</b> with 99% SLA and 33% load.</p>
                </div>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
                <Button onClick={() => { advance(selected); setSelected(null); }}>
                  Advance state <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* New rule dialog */}
      <Dialog open={newRuleOpen} onOpenChange={setNewRuleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New automation rule</DialogTitle>
            <DialogDescription>Define a trigger and an automated action.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <Label htmlFor="rule-name" className="text-xs">Name</Label>
              <Input id="rule-name" value={newRule.name} onChange={(e) => setNewRule({ ...newRule, name: e.target.value })} placeholder="e.g. Critical inverter → assign top tech" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">When</Label>
                <Select value={newRule.trigger} onValueChange={(v) => setNewRule({ ...newRule, trigger: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alert.created">Alert created</SelectItem>
                    <SelectItem value="sla.breached">SLA breached</SelectItem>
                    <SelectItem value="gateway.offline">Gateway offline</SelectItem>
                    <SelectItem value="yield.deviation">Yield deviation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Then</Label>
                <Select value={newRule.action} onValueChange={(v) => setNewRule({ ...newRule, action: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dispatch.auto">Auto-dispatch</SelectItem>
                    <SelectItem value="notify.csm">Notify CSM</SelectItem>
                    <SelectItem value="page.oncall">Page on-call</SelectItem>
                    <SelectItem value="ticket.create">Create ticket</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs">Notes</Label>
              <Textarea rows={3} placeholder="Optional context for approvers…" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewRuleOpen(false)}>Cancel</Button>
            <Button onClick={createRule}><Zap className="h-3.5 w-3.5" /> Create rule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}

export default WF;
