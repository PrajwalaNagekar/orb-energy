import { Link } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { KpiCard } from "@/components/KpiCard";
import { StatusBadge } from "@/components/StatusBadge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Activity, AlertTriangle, TrendingUp, Leaf, Zap, Sparkles, ArrowRight } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { energyTrend, sitesComparison, fleetHealth, alerts, aiInsights } from "@/lib/mock-data";

const tooltipStyle = {
  contentStyle: {
    background: "var(--color-card)",
    border: "1px solid var(--color-border)",
    borderRadius: 8,
    fontSize: 12,
    boxShadow: "var(--shadow-elevated)" },
  labelStyle: { color: "var(--color-muted-foreground)", fontSize: 11 } };

function Dashboard() {
  return (
    <PageShell
      title="Executive Dashboard"
      subtitle="Fleet-wide intelligence · Live as of 2 sec ago"
      actions={
        <>
          <Button variant="outline" size="sm">Last 7 days</Button>
          <Button size="sm" className="bg-primary"><Sparkles className="h-3.5 w-3.5 mr-1.5" /> Ask Orb-AI</Button>
        </>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total sites" value="124" delta="+6" trend="up" icon={<Activity className="h-4 w-4" />} accent="info" hint="Across 8 regions" />
        <KpiCard label="Healthy panels" value="14,892" delta="+0.4%" trend="up" icon={<Sun className="h-4 w-4" />} accent="success" hint="of 15,420 deployed" />
        <KpiCard label="Active alerts" value="23" delta="−12" trend="down" icon={<AlertTriangle className="h-4 w-4" />} accent="warning" hint="3 critical · 14 warning" />
        <KpiCard label="Today's output" value="42.8 MWh" delta="+8.2%" trend="up" icon={<Zap className="h-4 w-4" />} accent="solar" hint="vs 7-day average" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold">Energy output — today vs yesterday</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Aggregated kWh across the entire fleet</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-chart-3" /> Today</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-muted-foreground/40" /> Yesterday</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={energyTrend}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="t" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip {...tooltipStyle} />
              <Area type="monotone" dataKey="yesterday" stroke="var(--color-muted-foreground)" strokeWidth={1.5} fill="transparent" strokeDasharray="4 4" />
              <Area type="monotone" dataKey="today" stroke="var(--color-chart-3)" strokeWidth={2.5} fill="url(#g1)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold">ROI & impact</h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-4">Lifetime customer value</p>
          <div className="space-y-4">
            {[
              { label: "Total savings", value: "₹ 18.4 Cr", icon: TrendingUp, accent: "text-success bg-success/10" },
              { label: "CO₂ offset", value: "12,840 t", icon: Leaf, accent: "text-success bg-success/10" },
              { label: "Avg payback", value: "4.2 yrs", icon: Activity, accent: "text-info bg-info/10" },
              { label: "Trees equivalent", value: "5.1 lakh", icon: Leaf, accent: "text-success bg-success/10" },
            ].map((m) => (
              <div key={m.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${m.accent}`}><m.icon className="h-4 w-4" /></div>
                  <span className="text-sm text-muted-foreground">{m.label}</span>
                </div>
                <span className="font-semibold tabular-nums">{m.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold">Site output vs target</h3>
              <p className="text-xs text-muted-foreground mt-0.5">kWh, last 24 hours</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={sitesComparison} barCategoryGap={20}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip {...tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="output" fill="var(--color-chart-1)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="var(--color-muted)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2"><Sparkles className="h-4 w-4 text-solar-foreground" /> Orb-AI predictions</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Latest model output</p>
            </div>
            <Link to="/ai-insights" className="text-xs text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="space-y-3">
            {aiInsights.slice(0, 3).map((i) => (
              <div key={i.title} className="rounded-lg border border-border/60 p-3 hover:border-primary/30 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium">{i.title}</p>
                  <span className="text-[10px] font-semibold text-success bg-success/10 px-1.5 py-0.5 rounded">{i.confidence}%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{i.site} · {i.impact}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Recent alerts</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Past 24 hours</p>
            </div>
            <Link to="/alerts" className="text-xs text-primary hover:underline flex items-center gap-1">View all <ArrowRight className="h-3 w-3" /></Link>
          </div>
          <div className="overflow-hidden rounded-lg border border-border/60">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-3 py-2">Severity</th>
                  <th className="text-left font-medium px-3 py-2">Alert</th>
                  <th className="text-left font-medium px-3 py-2 hidden md:table-cell">Site</th>
                  <th className="text-left font-medium px-3 py-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {alerts.slice(0, 5).map((a) => (
                  <tr key={a.id} className="border-t border-border/60 hover:bg-muted/30">
                    <td className="px-3 py-2.5"><StatusBadge status={a.severity} /></td>
                    <td className="px-3 py-2.5 font-medium">{a.title}</td>
                    <td className="px-3 py-2.5 text-muted-foreground hidden md:table-cell">{a.site}</td>
                    <td className="px-3 py-2.5 text-muted-foreground text-xs">{a.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold">Fleet health (7d)</h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-4">% panels by status</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={fleetHealth} stackOffset="expand">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="healthy" stackId="a" fill="var(--color-chart-1)" />
              <Bar dataKey="warning" stackId="a" fill="var(--color-chart-3)" />
              <Bar dataKey="critical" stackId="a" fill="var(--color-chart-4)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </PageShell>
  );
}

export default Dashboard;
