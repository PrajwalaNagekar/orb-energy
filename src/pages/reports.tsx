import { useState } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileBarChart, FileSpreadsheet, FileText, Calendar, Filter, Sparkles } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { energyTrend, sitesComparison } from "@/lib/mock-data";

const templates = [
  { id: "performance", name: "Fleet performance", desc: "Output, capacity factor & ROI per site", icon: FileBarChart },
  { id: "sustainability", name: "Sustainability report", desc: "CO₂ avoided, trees & impact (ESG-ready)", icon: Sparkles },
  { id: "billing", name: "Customer billing summary", desc: "Invoices, payments & ageing report", icon: FileSpreadsheet },
  { id: "ops", name: "Operations & SLA", desc: "Tickets, MTTR, technician utilisation", icon: FileText },
];

const downtime = [
  { name: "Inverter", value: 38, fill: "var(--color-chart-4)" },
  { name: "Soiling", value: 24, fill: "var(--color-chart-3)" },
  { name: "Network", value: 18, fill: "var(--color-chart-2)" },
  { name: "Shading", value: 12, fill: "var(--color-chart-5)" },
  { name: "Other", value: 8, fill: "var(--color-muted-foreground)" },
];

function ReportsPage() {
  const [range, setRange] = useState("30d");
  const [generating, setGenerating] = useState<string | null>(null);

  const generate = (id: string, name: string) => {
    setGenerating(id);
    setTimeout(() => {
      setGenerating(null);
      alert(`✓ "${name}" report generated and emailed to ops@orb.energy`);
    }, 900);
  };

  return (
    <PageShell
      title="Reports"
      subtitle="Configurable analytics, scheduled exports and ESG reporting"
      actions={
        <>
          <select value={range} onChange={(e) => setRange(e.target.value)} className="h-8 text-xs rounded-md border border-border bg-background px-2">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last quarter</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" size="sm" onClick={() => alert("Filters drawer")}><Filter className="h-3.5 w-3.5 mr-1.5" /> Filters</Button>
          <Button size="sm" onClick={() => alert("Schedule recurring report")}><Calendar className="h-3.5 w-3.5 mr-1.5" /> Schedule</Button>
        </>
      }
    >
      <div>
        <h3 className="font-semibold mb-3">Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {templates.map((t) => (
            <Card key={t.id} className="p-4 hover:border-primary/40 transition-colors">
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                <t.icon className="h-4 w-4" />
              </div>
              <p className="font-semibold text-sm">{t.name}</p>
              <p className="text-xs text-muted-foreground mt-1 mb-3">{t.desc}</p>
              <div className="flex gap-2">
                <Button size="sm" className="h-7 text-xs flex-1" disabled={generating === t.id} onClick={() => generate(t.id, t.name)}>
                  {generating === t.id ? "Generating…" : "Generate"}
                </Button>
                <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => alert(`PDF download for ${t.name}`)}>
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 p-5">
          <h3 className="font-semibold">Energy yield trend</h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3">Range: {range}</p>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={energyTrend}>
              <defs>
                <linearGradient id="gr" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="t" stroke="var(--color-muted-foreground)" fontSize={11} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
              <Tooltip />
              <Area type="monotone" dataKey="today" stroke="var(--color-chart-1)" strokeWidth={2.5} fill="url(#gr)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="font-semibold">Downtime causes</h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3">% of total minutes lost</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={downtime} dataKey="value" innerRadius={50} outerRadius={80} paddingAngle={2}>
                {downtime.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 10 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold">Output vs target — by site</h3>
        <p className="text-xs text-muted-foreground mt-0.5 mb-3">Drill-down available</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={sitesComparison}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} />
            <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="output" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="target" fill="var(--color-muted)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold mb-3">Scheduled exports</h3>
        <div className="space-y-2">
          {[
            { name: "Weekly performance", every: "Every Mon · 09:00", to: "ops@orb.energy" },
            { name: "Monthly billing", every: "1st of month · 06:00", to: "finance@orb.energy" },
            { name: "Quarterly ESG", every: "Quarterly · last Fri", to: "esg@orb.energy" },
          ].map((s) => (
            <div key={s.name} className="flex items-center justify-between rounded-lg border border-border/60 p-3">
              <div>
                <p className="font-medium text-sm">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.every} → {s.to}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => alert(`Edit ${s.name}`)}>Edit</Button>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive" onClick={() => alert(`Disable ${s.name}`)}>Disable</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </PageShell>
  );
}

export default ReportsPage;
