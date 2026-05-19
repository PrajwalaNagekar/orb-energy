import { Link } from "react-router-dom";
import { ArrowLeft, Wifi, WifiOff, RefreshCw, CheckCircle2, Clock, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { MobileShell } from "@/components/MobileShell";

type Q = { t: string; st: "queued" | "syncing" | "synced" };

const SEED: Q[] = [
  { t: "JOB-7821 · 3 photos", st: "queued" },
  { t: "JOB-7821 · diagnostics", st: "queued" },
  { t: "JOB-7821 · parts used", st: "queued" },
  { t: "JOB-7820 · sign-off", st: "synced" },
  { t: "JOB-7819 · report", st: "synced" },
];

function Sync() {
  const [queue, setQueue] = useState<Q[]>(SEED);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastSync, setLastSync] = useState("2 hr ago");

  useEffect(() => {
    if (!running) return;
    const queuedIdx = queue.findIndex((q) => q.st === "queued");
    if (queuedIdx === -1) {
      setRunning(false);
      setProgress(100);
      setLastSync("just now");
      return;
    }
    // mark as syncing
    setQueue((q) => q.map((x, i) => (i === queuedIdx ? { ...x, st: "syncing" } : x)));
    const t = setTimeout(() => {
      setQueue((q) => q.map((x, i) => (i === queuedIdx ? { ...x, st: "synced" } : x)));
      const remaining = queue.filter((x) => x.st === "queued").length - 1;
      const total = SEED.filter((x) => x.st === "queued").length;
      setProgress(Math.round(((total - remaining) / total) * 100));
    }, 900);
    return () => clearTimeout(t);
  }, [running, queue]);

  const queuedCount = queue.filter((q) => q.st === "queued").length;
  const trigger = () => {
    if (queuedCount === 0) return;
    setProgress(5);
    setRunning(true);
  };

  return (
    <MobileShell theme="tech">
      <header className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link to="/m/tech/profile" className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-lg font-semibold">Sync</h1>
      </header>

      <div className="px-5">
        <div className={`rounded-2xl text-white p-5 transition-colors ${running ? "bg-gradient-to-br from-emerald-500 to-teal-600" : "bg-gradient-to-br from-amber-500 to-orange-600"}`}>
          <div className="flex items-center gap-2">
            {running ? <Zap className="h-4 w-4 animate-pulse" /> : <WifiOff className="h-4 w-4" />}
            <span className="text-[11px] uppercase tracking-wider text-white/85">
              {running ? "Sync in progress" : queuedCount > 0 ? "Offline mode active" : "All synced"}
            </span>
          </div>
          <p className="text-base font-semibold mt-2">
            {running ? `Uploading ${queue.filter((q) => q.st === "syncing").length || 0} of ${queuedCount + queue.filter((q) => q.st === "synced").length}…` : `${queuedCount} actions queued`}
          </p>
          <p className="text-[11px] text-white/80 mt-1">
            {running ? "Do not close the app. Encrypted upload over LTE." : queuedCount > 0 ? "Will sync automatically when connection returns." : "Your van is fully reconciled with Orb Cloud."}
          </p>

          {/* Progress bar */}
          {(running || progress > 0) && (
            <div className="mt-4 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
          )}

          <button
            onClick={trigger}
            disabled={running || queuedCount === 0}
            className="mt-4 w-full rounded-xl bg-white text-orange-600 disabled:bg-white/40 disabled:text-white/70 font-semibold text-sm py-2.5 inline-flex items-center justify-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${running ? "animate-spin" : ""}`} />
            {running ? "Syncing…" : queuedCount === 0 ? "Nothing to sync" : "Trigger offline sync"}
          </button>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
            <Wifi className="h-4 w-4 text-emerald-500 mb-1" />
            <p className="text-[11px] text-slate-500">Last synced</p>
            <p className="text-sm font-semibold">{lastSync}</p>
          </div>
          <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4">
            <Clock className="h-4 w-4 text-amber-500 mb-1" />
            <p className="text-[11px] text-slate-500">Cached jobs</p>
            <p className="text-sm font-semibold">5 jobs · 240 MB</p>
          </div>
        </div>

        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-5 mb-2">Sync queue</p>
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
          {queue.map((q, i) => (
            <div key={i} className="flex items-center gap-3 p-3.5">
              {q.st === "queued" ? (
                <Clock className="h-4 w-4 text-amber-500" />
              ) : q.st === "syncing" ? (
                <RefreshCw className="h-4 w-4 text-sky-500 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              )}
              <span className="text-sm flex-1">{q.t}</span>
              <span
                className={`text-[10px] font-semibold ${
                  q.st === "queued" ? "text-amber-600" : q.st === "syncing" ? "text-sky-600" : "text-emerald-600"
                }`}
              >
                {q.st.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </MobileShell>
  );
}

export default Sync;
