import { Link, useLocation } from "react-router-dom";
import { Home, Zap, Bell, Receipt, User, Sun, Cloud, AlertTriangle, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { useScenario, type ScenarioKey } from "@/lib/scenario";
import { MobileFrame } from "@/components/MobileFrame";

const items: { to: string; icon: LucideIcon; label: string }[] = [
  { to: "/m/customer", icon: Home, label: "Home" },
  { to: "/m/customer/energy", icon: Zap, label: "Energy" },
  { to: "/m/customer/alerts", icon: Bell, label: "Alerts" },
  { to: "/m/customer/bills", icon: Receipt, label: "Bills" },
  { to: "/m/customer/profile", icon: User, label: "Me" },
];

function TabBar({ items, activeColor, basePath }: { items: { to: string; icon: LucideIcon; label: string }[]; activeColor: string; basePath: string }) {
  const path = useLocation().pathname;
  return (
    <nav className="absolute bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 px-2 pt-2 pb-5 flex items-center justify-around dark:bg-slate-900/95 dark:border-slate-800">
      {items.map((it) => {
        const active = path === it.to || (it.to !== basePath && path.startsWith(it.to));
        return (
          <Link
            key={it.to}
            to={it.to}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 ${active ? activeColor : "text-slate-400"}`}
          >
            <it.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function CustomerTabBar() {
  return <TabBar items={items} activeColor="text-emerald-600" basePath="/m/customer" />;
}

const techItems: { to: string; icon: LucideIcon; label: string }[] = [
  { to: "/m/tech", icon: Home, label: "Jobs" },
  { to: "/m/tech/schedule", icon: Zap, label: "Schedule" },
  { to: "/m/tech/parts", icon: Receipt, label: "Parts" },
  { to: "/m/tech/history", icon: Bell, label: "History" },
  { to: "/m/tech/profile", icon: User, label: "Me" },
];

export function TechTabBar() {
  return <TabBar items={techItems} activeColor="text-orange-500" basePath="/m/tech" />;
}

function ScenarioFab() {
  const { scenario, setScenarioKey } = useScenario();
  const [open, setOpen] = useState(false);
  const opts: { k: ScenarioKey; icon: LucideIcon; label: string }[] = [
    { k: "sunny", icon: Sun, label: "Sunny" },
    { k: "cloudy", icon: Cloud, label: "Cloudy" },
    { k: "underperforming", icon: AlertTriangle, label: "Issue" },
  ];
  return (
    <div className="absolute bottom-24 right-3 z-50 flex flex-col items-end gap-2 pointer-events-none">
      {open && (
        <div className="pointer-events-auto rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 p-1.5 flex flex-col gap-0.5 animate-in fade-in slide-in-from-bottom-2">
          {opts.map((o) => {
            const active = scenario.key === o.k;
            return (
              <button
                key={o.k}
                onClick={() => { setScenarioKey(o.k); setOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${active ? "bg-emerald-500 text-white" : "text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"}`}
              >
                <o.icon className="h-3.5 w-3.5" />
                {o.label}
              </button>
            );
          })}
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="pointer-events-auto h-11 w-11 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl flex items-center justify-center"
        aria-label="Mock scenario"
      >
        {scenario.key === "sunny" ? <Sun className="h-5 w-5" /> : scenario.key === "cloudy" ? <Cloud className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
      </button>
    </div>
  );
}

/**
 * Static mobile shell — content scrolls inside the phone screen, while the bottom
 * tab bar is anchored absolutely to the screen frame so it never moves when
 * navigating between sibling routes.
 */
export function MobileShell({ children, theme = "customer" }: { children: React.ReactNode; theme?: "customer" | "tech" }) {
  return (
    <MobileFrame tone="white">
      <div className="pb-28">{children}</div>
      {theme === "customer" ? <CustomerTabBar /> : <TechTabBar />}
      {theme === "customer" && <ScenarioFab />}
    </MobileFrame>
  );
}
