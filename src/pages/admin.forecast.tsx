import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { yieldForecast, dailyForecast } from "@/lib/admin-data";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ComposedChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { KpiCard } from "@/components/KpiCard";
import { Activity, CloudRain, Sun, Target } from "lucide-react";

const tip = { contentStyle: { background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 } };

function Forecast() {
  const todayTotal = yieldForecast.reduce((a, h) => a + h.forecast, 0);
  const actualSoFar = yieldForecast.reduce((a, h) => a + (h.actual ?? 0), 0);
  const accuracy = Math.round((1 - Math.abs(actualSoFar - yieldForecast.slice(0, 15).reduce((a, h) => a + h.forecast, 0)) / actualSoFar) * 100);

  return (
    <PageShell title="Yield Forecasting" subtitle="Orb-AI Forecaster v4.2 · weather + soiling-adjusted output">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Today forecast" value={`${(todayTotal / 1000).toFixed(1)} MWh`} delta="+8.2%" trend="up" accent="solar" icon={<Sun className="h-4 w-4" />} hint="vs 7-day avg" />
        <KpiCard label="Actual so far" value={`${(actualSoFar / 1000).toFixed(1)} MWh`} delta="+2.1%" trend="up" accent="success" icon={<Activity className="h-4 w-4" />} />
        <KpiCard label="Forecast accuracy" value={`${Math.max(88, accuracy)}%`} accent="info" icon={<Target className="h-4 w-4" />} hint="Last 14 days" />
        <KpiCard label="Soiling adjustment" value="−6.0%" accent="warning" icon={<CloudRain className="h-4 w-4" />} hint="Pre-monsoon ramp" />
      </div>

      <Card className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold">Hourly yield forecast vs actual (today)</h3>
            <p className="text-xs text-muted-foreground mt-0.5">kWh · weather-adjusted</p>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-chart-3" /> Forecast</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-chart-1" /> Actual</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-chart-2" /> Soiling-adj</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={yieldForecast}>
            <defs>
              <linearGradient id="fG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart-3)" stopOpacity={0.35} />
                <stop offset="100%" stopColor="var(--color-chart-3)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis dataKey="hour" fontSize={10} stroke="var(--color-muted-foreground)" />
            <YAxis fontSize={11} stroke="var(--color-muted-foreground)" />
            <Tooltip {...tip} />
            <Area type="monotone" dataKey="forecast" stroke="var(--color-chart-3)" strokeWidth={2} fill="url(#fG)" />
            <Line type="monotone" dataKey="soilingAdj" stroke="var(--color-chart-2)" strokeWidth={2} strokeDasharray="4 4" dot={false} />
            <Line type="monotone" dataKey="actual" stroke="var(--color-chart-1)" strokeWidth={2.5} dot={{ r: 3 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 p-5">
          <h3 className="font-semibold">14-day daily forecast</h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3">MWh · with weather adjustment</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={dailyForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="day" fontSize={11} stroke="var(--color-muted-foreground)" />
              <YAxis fontSize={11} stroke="var(--color-muted-foreground)" />
              <Tooltip {...tip} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="forecast" fill="var(--color-chart-3)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="weatherAdj" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="font-semibold mb-3">Confidence decay</h3>
          <p className="text-xs text-muted-foreground mt-0.5 mb-3">Model certainty by horizon</p>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={dailyForecast}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="day" fontSize={11} stroke="var(--color-muted-foreground)" />
              <YAxis fontSize={11} domain={[60, 100]} stroke="var(--color-muted-foreground)" />
              <Tooltip {...tip} />
              <Line type="monotone" dataKey="confidence" stroke="var(--color-chart-5)" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </PageShell>
  );
}

export default Forecast;
