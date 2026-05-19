import { Link } from "react-router-dom";
import { ArrowLeft, Search, Sun } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { useMemo } from "react";
import { useScenario } from "@/lib/scenario";

function Panels() {
  return (
    <MobileShell theme="customer">
      <Inner />
    </MobileShell>
  );
}

function Inner() {
  const { scenario: s } = useScenario();
  const total = 36;
  const okTarget = Math.round((s.healthyPanels / s.totalPanels) * total);
  const warnCount = s.healthScore < 90 ? Math.max(2, Math.round((100 - s.healthScore) / 6)) : 1;
  const faultCount = s.healthScore < 80 ? Math.max(1, Math.round((100 - s.healthScore) / 14)) : 0;

  const panels = useMemo(() => {
    return Array.from({ length: total }, (_, i) => {
      let status: "ok" | "warn" | "fault";
      if (i < faultCount) status = "fault";
      else if (i < faultCount + warnCount) status = "warn";
      else status = "ok";
      const r = (i * 9301 + 49297) % 100;
      const baseKw = 0.42 * (s.peakKw / 6.4);
      const kw = status === "ok" ? baseKw + (r % 6) / 200 : status === "warn" ? baseKw * 0.6 : 0;
      return { id: `P-${String(i + 1).padStart(3, "0")}`, status, kw };
    });
    // Re-shuffle so problem panels aren't first
  }, [s.peakKw, faultCount, warnCount]);

  const ordered = useMemo(() => {
    // Stable scattered order
    const arr = [...panels];
    const out: typeof panels = [];
    let i = 0;
    while (arr.length) {
      const idx = (i * 7) % arr.length;
      out.push(arr.splice(idx, 1)[0]);
      i++;
    }
    return out;
  }, [panels]);

  const okCount = panels.filter((p) => p.status === "ok").length;
  const attention = panels.filter((p) => p.status !== "ok");

  return (
    <>
      <header className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link to="/m/customer" className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-lg font-semibold">My Panels</h1>
      </header>

      <div className="px-5">
        <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white p-5">
          <p className="text-[11px] uppercase tracking-wider text-white/80">Fleet health</p>
          <div className="flex items-end justify-between mt-2">
            <div>
              <span className="text-4xl font-bold">{okCount}</span>
              <span className="text-base text-white/80">/{total} healthy</span>
            </div>
            <div className="text-right text-[11px] text-white/80">
              <p>Roof A · Tier 2</p>
              <p>14.4 kWp installed</p>
            </div>
          </div>
        </div>

        <div className="mt-4 relative">
          <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
          <input placeholder="Search panel ID" className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none" />
        </div>

        <div className="mt-3 flex items-center gap-3 text-[11px]">
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Healthy</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Underperforming</span>
          <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> Fault</span>
        </div>

        <div className="mt-4 grid grid-cols-6 gap-1.5">
          {ordered.map((p) => (
            <Link
              key={p.id}
              to={`/m/customer/panels/${p.id}`}
              className={`aspect-square rounded-md flex items-center justify-center text-[8px] font-bold text-white transition-transform hover:scale-105 ${
                p.status === "ok" ? "bg-emerald-500" : p.status === "warn" ? "bg-amber-500" : "bg-rose-500 animate-pulse"
              }`}
            >
              <Sun className="h-3 w-3" />
            </Link>
          ))}
        </div>

        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-6 mb-2">
          {attention.length > 0 ? "Needs attention" : "All panels"}
        </p>
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
          {(attention.length > 0 ? attention.slice(0, 6) : ordered.slice(0, 6)).map((p) => {
            const idx = parseInt(p.id.split("-")[1], 10);
            const row = Math.ceil(idx / 6);
            const col = ((idx - 1) % 6) + 1;
            const name = `Roof A · Row ${row} · Col ${col}`;
            return (
              <Link key={p.id} to={`/m/customer/panels/${p.id}`} className="flex items-center justify-between p-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{p.id} · {name}</p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {p.status === "ok" ? `Orb Mono PERC 425W · ${(p.kw * 1000).toFixed(0)}W now`
                      : p.status === "warn" ? "Output 28% below expected"
                      : "No output detected"}
                  </p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                  p.status === "ok" ? "bg-emerald-100 text-emerald-700"
                    : p.status === "warn" ? "bg-amber-100 text-amber-700"
                    : "bg-rose-100 text-rose-700"
                }`}>
                  {p.status === "ok" ? "OK" : p.status === "warn" ? "WARN" : "FAULT"}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Panels;