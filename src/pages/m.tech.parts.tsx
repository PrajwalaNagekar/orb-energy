import { Link } from "react-router-dom";
import { ArrowLeft, Search, Package, Plus, X, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { MobileShell } from "@/components/MobileShell";

type Part = { sku: string; n: string; q: number; max: number; c: "emerald" | "amber" | "rose" };

const SEED: Part[] = [
  { sku: "PCB-A2", n: "Inverter PCB-A2", q: 3, max: 5, c: "emerald" },
  { sku: "MC4-CON", n: "MC4 connector pair", q: 12, max: 30, c: "emerald" },
  { sku: "OPT-340", n: "Power optimiser 340W", q: 2, max: 8, c: "amber" },
  { sku: "FUSE-15A", n: "DC fuse 15A", q: 8, max: 20, c: "emerald" },
  { sku: "CABLE-6", n: "DC cable 6 mm² (m)", q: 0, max: 50, c: "rose" },
  { sku: "GROM-25", n: "Cable grommet 25mm", q: 14, max: 25, c: "emerald" },
];
const KEY = "orb.tech.van.parts";

function color(p: Part) {
  const pct = (p.q / p.max) * 100;
  if (pct === 0) return "rose" as const;
  if (pct < 35) return "amber" as const;
  return "emerald" as const;
}

function Parts() {
  const [parts, setParts] = useState<Part[]>(SEED);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Part>({ sku: "", n: "", q: 1, max: 10, c: "emerald" });

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(KEY) : null;
      if (raw) setParts(JSON.parse(raw));
    } catch {/* noop */}
  }, []);

  const persist = (next: Part[]) => {
    setParts(next);
    try { window.localStorage.setItem(KEY, JSON.stringify(next)); } catch {/* noop */}
  };

  const filtered = parts.filter(
    (p) => !search || p.sku.toLowerCase().includes(search.toLowerCase()) || p.n.toLowerCase().includes(search.toLowerCase())
  );

  const out = parts.filter((p) => p.q === 0).length;
  const low = parts.filter((p) => p.q > 0 && p.q / p.max < 0.35).length;

  const add = () => {
    if (!draft.sku.trim() || !draft.n.trim() || draft.max <= 0) return;
    const next: Part = { ...draft, sku: draft.sku.trim().toUpperCase(), c: color(draft) };
    persist([next, ...parts.filter((p) => p.sku !== next.sku)]);
    setOpen(false);
    setDraft({ sku: "", n: "", q: 1, max: 10, c: "emerald" });
  };

  return (
    <MobileShell theme="tech">
      <header className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link to="/m/tech" className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-lg font-semibold">Van inventory</h1>
        <button
          onClick={() => setOpen(true)}
          className="ml-auto inline-flex items-center gap-1 h-8 rounded-full bg-orange-500 text-white px-3 text-xs font-semibold"
        >
          <Plus className="h-3.5 w-3.5" /> Add part
        </button>
      </header>

      <div className="px-5">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="SKU or part name"
            className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none"
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {[
            { k: String(parts.length), l: "Items", c: "text-slate-700 dark:text-slate-200" },
            { k: String(out), l: "Out of stock", c: "text-rose-600" },
            { k: String(low), l: "Low", c: "text-amber-600" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3">
              <div className={`text-base font-bold ${s.c}`}>{s.k}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
          {filtered.map((p) => {
            const pct = (p.q / p.max) * 100;
            const c = color(p);
            const bar = c === "rose" ? "bg-rose-500" : c === "amber" ? "bg-amber-500" : "bg-emerald-500";
            return (
              <div key={p.sku} className="p-3.5">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center"><Package className="h-4 w-4 text-slate-500" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{p.n}</p>
                    <p className="text-[10px] text-slate-500">{p.sku}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => persist(parts.map((x) => x.sku === p.sku ? { ...x, q: Math.max(0, x.q - 1) } : x))}
                      className="h-6 w-6 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 text-sm font-bold"
                    >−</button>
                    <span className="text-sm font-bold tabular-nums w-12 text-center">{p.q}<span className="text-slate-400 text-xs">/{p.max}</span></span>
                    <button
                      onClick={() => persist(parts.map((x) => x.sku === p.sku ? { ...x, q: Math.min(x.max, x.q + 1) } : x))}
                      className="h-6 w-6 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 text-sm font-bold"
                    >+</button>
                  </div>
                </div>
                <div className="mt-2 h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full ${bar}`} style={{ width: `${Math.max(pct, 4)}%` }} />
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="p-6 text-center text-sm text-slate-500">No parts match "{search}".</p>
          )}
        </div>
      </div>

      {/* Add part sheet */}
      {open && (
        <div className="absolute inset-0 z-50 bg-black/40 flex items-end" onClick={() => setOpen(false)}>
          <div
            className="w-full bg-white dark:bg-slate-900 rounded-t-3xl p-5 pb-7"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold">Add part to van</h2>
              <button onClick={() => setOpen(false)} className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-4 space-y-3">
              <Field label="SKU" value={draft.sku} onChange={(v) => setDraft({ ...draft, sku: v })} placeholder="e.g. INV-FUSE-30A" />
              <Field label="Part name" value={draft.n} onChange={(v) => setDraft({ ...draft, n: v })} placeholder="e.g. DC fuse 30A" />
              <div className="grid grid-cols-2 gap-3">
                <Num label="On hand" value={draft.q} onChange={(v) => setDraft({ ...draft, q: v })} />
                <Num label="Van capacity" value={draft.max} onChange={(v) => setDraft({ ...draft, max: v })} />
              </div>
            </div>
            <button
              onClick={add}
              disabled={!draft.sku.trim() || !draft.n.trim() || draft.max <= 0}
              className="mt-5 w-full rounded-2xl bg-orange-500 disabled:bg-slate-300 text-white text-sm font-semibold py-3.5 inline-flex items-center justify-center gap-2"
            >
              <Check className="h-4 w-4" /> Add to inventory
            </button>
          </div>
        </div>
      )}
    </MobileShell>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400"
      />
    </label>
  );
}

function Num({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{label}</span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="mt-1 w-full rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-400"
      />
    </label>
  );
}

export default Parts;
