import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Leaf, TreePine, TrendingUp, Sparkles, Bell, ChevronRight } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, XAxis } from "recharts";
import { energyTrend, panels } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function CustomerApp() {
  const visible = panels.slice(0, 20);
  return (
    <PageShell title="Customer App Preview" subtitle="What your customers see — branded, premium, transparent">
      <div className="flex justify-center">
        <div className="w-full max-w-sm bg-background rounded-[2.5rem] border-8 border-foreground/90 shadow-2xl overflow-hidden">
          {/* Status bar */}
          <div className="h-7 bg-foreground/90 flex items-center justify-center">
            <div className="w-24 h-5 rounded-full bg-background/10" />
          </div>

          <div className="p-5 space-y-5 max-h-[720px] overflow-y-auto bg-gradient-to-b from-accent/30 to-background">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Good morning,</p>
                <p className="font-semibold">Anand Sharma</p>
              </div>
              <div className="relative">
                <Bell className="h-5 w-5 text-foreground" />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-destructive" />
              </div>
            </div>

            {/* Hero */}
            <Card className="p-5 bg-[image:var(--gradient-solar)] border-0 text-solar-foreground overflow-hidden relative">
              <Sun className="absolute -top-4 -right-4 h-32 w-32 opacity-20" />
              <div className="relative">
                <p className="text-xs uppercase tracking-wider opacity-80 font-medium">Today's output</p>
                <p className="text-4xl font-semibold mt-1">28.4 <span className="text-lg opacity-80">kWh</span></p>
                <p className="text-xs mt-2 flex items-center gap-1"><TrendingUp className="h-3 w-3" /> 12% vs yesterday</p>
              </div>
              <div className="mt-3 -mb-2 -mx-1">
                <ResponsiveContainer width="100%" height={60}>
                  <AreaChart data={energyTrend}>
                    <defs>
                      <linearGradient id="ch" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="white" stopOpacity={0.4} />
                        <stop offset="100%" stopColor="white" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area dataKey="today" stroke="white" strokeWidth={2} fill="url(#ch)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Panel grid */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold">Your panels</p>
                <p className="text-xs text-success font-medium">19 of 20 healthy</p>
              </div>
              <div className="grid grid-cols-5 gap-1.5">
                {visible.map((p, i) => (
                  <div
                    key={p.id}
                    className={cn(
                      "aspect-square rounded border-2",
                      i === 7 ? "bg-destructive/20 border-destructive animate-pulse" : "bg-success/20 border-success/40"
                    )}
                  />
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3 text-xs">View details <ChevronRight className="h-3 w-3 ml-1" /></Button>
            </Card>

            {/* Smart alert */}
            <Card className="p-4 border-warning/30 bg-warning/5">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-warning-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-warning-foreground">Smart alert</p>
                  <p className="text-sm mt-1">One panel is producing less than usual. We've already scheduled a free inspection for Thursday.</p>
                  <Button size="sm" variant="outline" className="mt-2 h-7 text-xs">View schedule</Button>
                </div>
              </div>
            </Card>

            {/* Impact */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3">
                <Leaf className="h-4 w-4 text-success" />
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-2">CO₂ saved</p>
                <p className="text-lg font-semibold">142 kg</p>
                <p className="text-[10px] text-muted-foreground">this month</p>
              </Card>
              <Card className="p-3">
                <TreePine className="h-4 w-4 text-success" />
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-2">Trees equiv</p>
                <p className="text-lg font-semibold">6.2</p>
                <p className="text-[10px] text-muted-foreground">lifetime</p>
              </Card>
              <Card className="p-3 col-span-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Lifetime savings</p>
                <p className="text-2xl font-semibold mt-1">₹ 84,200</p>
                <div className="flex items-center justify-between mt-2 text-xs">
                  <span className="text-muted-foreground">Payback in 2.4 yrs</span>
                  <span className="text-success font-medium">+₹ 4,820 this month</span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default CustomerApp;
