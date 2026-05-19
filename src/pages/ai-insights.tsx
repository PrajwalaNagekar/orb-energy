import { Link } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { orbAIModels, anomalyClusters, predictions, adminAlerts } from "@/lib/admin-data";
import { Sparkles, Brain, TrendingUp, Radio, Zap, ArrowRight, Activity } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { yieldForecast } from "@/lib/admin-data";

const tip = { contentStyle: { background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 } };

function OrbAI() {
  const topAlert = adminAlerts.find((a) => a.severity === "critical") ?? adminAlerts[0];
  const topPrediction = predictions[0];
  if (!topAlert || !topPrediction) return null;

  return (
    <PageShell
      title="Orb-AI Intelligence Layer"
      subtitle="Forecasting · Anomaly Detection · Predictive Maintenance · Dispatch Optimisation"
      actions={<Button size="sm"><Brain className="h-3.5 w-3.5 mr-1.5" /> Open AI playground</Button>}
    >
      {/* Hero */}
      <Card className="p-6 bg-[image:var(--gradient-eco)] text-white border-0 overflow-hidden relative">
        <div className="absolute top-0 right-0 opacity-10"><Sparkles className="h-48 w-48" /></div>
        <div className="relative">
          <p className="text-xs uppercase tracking-wider opacity-80 font-medium">Today's headline</p>
          <h2 className="text-2xl font-semibold mt-2">Fleet predicted to deliver +8.2% yield tomorrow</h2>
          <p className="text-sm opacity-90 mt-2 max-w-2xl">Clear-sky weather across 6 of 8 regions. Recommend deferring scheduled cleaning at Bengaluru HQ to maximise generation window.</p>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="px-2.5 py-1 rounded-full bg-white/20 text-xs font-medium">95% confidence</span>
            <span className="px-2.5 py-1 rounded-full bg-white/20 text-xs font-medium">Yield Forecaster v4.2</span>
            <span className="px-2.5 py-1 rounded-full bg-white/20 text-xs font-medium">5 models in production</span>
          </div>
        </div>
      </Card>

      {/* Sub-module entry points */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { to: "/admin/forecast", icon: TrendingUp, name: "Forecasting", sub: "Hourly · 14-day · weather-adj" },
          { to: "/admin/predictive", icon: Brain, name: "Predictive", sub: "14–30d fault interception" },
          { to: "/admin/clusters", icon: Radio, name: "Anomaly Clusters", sub: "Pattern grouping" },
          { to: "/admin/actions", icon: Zap, name: "Smart Actions", sub: "Dispatch & escalation" },
        ].map((m) => (
          <Link key={m.to} to={m.to} className="group">
            <Card className="p-4 hover:border-primary/30 hover:shadow-[var(--shadow-elevated)] transition-all">
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><m.icon className="h-4 w-4" /></div>
              <p className="font-semibold mt-3">{m.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{m.sub}</p>
              <p className="mt-3 inline-flex items-center gap-1 text-[11px] text-primary font-semibold group-hover:gap-2 transition-all">Open <ArrowRight className="h-3 w-3" /></p>
            </Card>
          </Link>
        ))}
      </div>

      {/* Model registry */}
      <Card className="p-5">
        <h3 className="font-semibold mb-3">Model registry</h3>
        <div className="overflow-hidden rounded-lg border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="text-left px-3 py-2 font-medium">Model</th>
                <th className="text-left px-3 py-2 font-medium">Domain</th>
                <th className="text-left px-3 py-2 font-medium">Confidence</th>
                <th className="text-left px-3 py-2 font-medium">Drift</th>
                <th className="text-right px-3 py-2 font-medium">Last trained</th>
              </tr>
            </thead>
            <tbody>
              {orbAIModels.map((m) => (
                <tr key={m.name} className="border-t border-border/60 hover:bg-muted/30">
                  <td className="px-3 py-2.5 font-medium">{m.name}</td>
                  <td className="px-3 py-2.5 text-muted-foreground">{m.domain}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-success" style={{ width: `${m.confidence}%` }} />
                      </div>
                      <span className="tabular-nums text-xs font-semibold">{m.confidence}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`text-[10px] font-bold uppercase rounded-full px-1.5 py-0.5 ${m.drift === "low" ? "bg-success/10 text-success" : "bg-warning/15 text-warning-foreground"}`}>
                      {m.drift}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-right text-muted-foreground text-xs">{m.lastTrained}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 p-5">
          <h3 className="font-semibold flex items-center gap-2"><Activity className="h-4 w-4 text-info" /> Yield prediction · today</h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3">Hourly · weather-adjusted</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={yieldForecast}>
              <defs>
                <linearGradient id="aiy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="hour" fontSize={10} stroke="var(--color-muted-foreground)" />
              <Tooltip {...tip} />
              <Area dataKey="forecast" stroke="var(--color-chart-3)" strokeWidth={2.5} fill="url(#aiy)" />
              <Area dataKey="actual" stroke="var(--color-chart-1)" strokeWidth={2} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-3">Top priority insight</h3>
          <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3">
            <p className="text-[11px] uppercase tracking-wider text-destructive font-semibold">Critical alert</p>
            <p className="text-sm font-semibold mt-1">{topAlert.title}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{topAlert.site}</p>
            <p className="text-sm mt-2">{topAlert.ai}</p>
            <Button asChild size="sm" className="mt-3 w-full"><Link to="/admin/actions">Review smart actions</Link></Button>
          </div>
          <div className="rounded-lg border border-warning/30 bg-warning/5 p-3 mt-3">
            <p className="text-[11px] uppercase tracking-wider text-warning-foreground font-semibold">Predicted fault</p>
            <p className="text-sm font-semibold mt-1">{topPrediction.fault}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{topPrediction.asset} · {topPrediction.site}</p>
            <p className="text-sm mt-2">In {topPrediction.daysToFailure} days · {topPrediction.confidence}% confidence</p>
            <Button asChild size="sm" variant="outline" className="mt-3 w-full"><Link to="/admin/predictive">Open predictive console</Link></Button>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <h3 className="font-semibold flex items-center gap-2"><Radio className="h-4 w-4 text-warning-foreground" /> Anomaly clusters detected</h3>
        <p className="text-xs text-muted-foreground mt-0.5 mb-4">Systemic patterns across installations</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {anomalyClusters.map((c) => (
            <Link key={c.id} to="/admin/clusters" className="rounded-lg border border-border/60 p-4 hover:border-primary/30 transition-colors">
              <p className="text-[10px] font-mono text-muted-foreground">{c.id}</p>
              <p className="font-semibold mt-1">{c.category}</p>
              <p className="text-2xl font-semibold mt-2 text-warning-foreground">{c.alerts}<span className="text-sm text-muted-foreground ml-1 font-normal">alerts</span></p>
              <p className="text-[11px] text-muted-foreground mt-1">{c.sites.length} sites affected</p>
            </Link>
          ))}
        </div>
      </Card>
    </PageShell>
  );
}

export default OrbAI;
