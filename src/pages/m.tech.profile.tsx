import { Link, Outlet, useNavigate , useLocation } from "react-router-dom";
import { ArrowLeft, Award, Wrench, ChevronRight, Settings, Shield, BookOpen, LogOut, IdCard, Cloud, RefreshCw, Pencil, Truck } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { useTechProfile } from "@/lib/tech-profile";
import { toast } from "sonner";

function TechProfileLayout() {
  const pathname = useLocation().pathname;
  const isChild = pathname !== "/m/tech/profile" && pathname.startsWith("/m/tech/profile/");
  if (isChild) return <Outlet />;
  return (
    <MobileShell theme="tech">
      <TechProfileBody />
    </MobileShell>
  );
}

function TechProfileBody() {
  const { profile, update, reset } = useTechProfile();
  const navigate = useNavigate();
  const initials = profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2);
  const synced = new Date(profile.syncedAt);
  const ago = Math.max(1, Math.round((Date.now() - synced.getTime()) / 60000));

  const handleSync = () => {
    update({ configVersion: profile.configVersion + 1 });
    toast.success("Synced with Admin Console", { description: `Now on config v${profile.configVersion + 1}` });
  };

  const signOut = () => {
    reset();
    toast.success("Clocked out", { description: "Drive safe, technician." });
    setTimeout(() => navigate("/m/tech/welcome"), 400);
  };

  return (
    <>
      <header className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link to="/m/tech" className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-lg font-semibold">Profile</h1>
        <Link to="/m/tech/profile/edit" className="ml-auto h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <Pencil className="h-4 w-4 text-slate-600 dark:text-slate-300" />
        </Link>
      </header>

      <div className="px-5 pb-8">
        {/* Identity card */}
        <div className="relative rounded-3xl bg-gradient-to-br from-orange-500 to-amber-600 text-white p-5 overflow-hidden">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="relative flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-xl font-bold">{initials}</div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold truncate">{profile.name}</p>
              <p className="text-[11px] text-white/85">{profile.level} Field Technician · {profile.region}</p>
              <div className="flex items-center gap-2 mt-1">
                <Award className="h-3 w-3" />
                <span className="text-[10px]">Top performer · Aug 2026</span>
              </div>
            </div>
          </div>
          <div className="relative mt-4 rounded-2xl bg-black/20 backdrop-blur p-3 flex items-center gap-3">
            <IdCard className="h-4 w-4 text-amber-200" />
            <div className="flex-1">
              <p className="text-[9px] uppercase tracking-widest text-white/70">Technician ID</p>
              <p className="text-[13px] font-mono font-semibold tracking-wider">{profile.techId}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-widest text-white/70">Van</p>
              <p className="text-[11px] font-mono font-semibold">{profile.vanId}</p>
            </div>
          </div>
        </div>

        {/* Admin sync banner */}
        <button onClick={handleSync} className="mt-3 w-full rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900 p-3 flex items-center gap-3 hover:bg-sky-100 dark:hover:bg-sky-950/50 active:scale-[0.99] transition-all text-left">
          <div className="h-8 w-8 rounded-xl bg-sky-500 flex items-center justify-center text-white"><Cloud className="h-4 w-4" /></div>
          <div className="flex-1">
            <p className="text-[12px] font-semibold text-sky-900 dark:text-sky-200">Synced with Admin · v{profile.configVersion}</p>
            <p className="text-[10px] text-sky-700/80 dark:text-sky-300/70">Dispatch zone &amp; skills last updated {ago} min ago · tap to re-sync</p>
          </div>
          <RefreshCw className="h-4 w-4 text-sky-500" />
        </button>

        {/* Performance */}
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          {[
            { k: profile.jobsClosed.toString(), l: "Jobs" },
            { k: `${profile.slaPct}%`, l: "SLA" },
            { k: profile.rating.toFixed(1), l: "Rating" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3">
              <div className="text-lg font-bold">{s.k}</div>
              <div className="text-[10px] text-slate-500 mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Dispatch config (admin-managed) */}
        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-5 mb-2">Dispatch configuration</p>
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
          <Row label="Dispatch zone" value={profile.dispatchZone} />
          <Row label="Max jobs / day" value={profile.maxJobsPerDay.toString()} />
          <Row label="Shift" value={profile.shift} />
          <Row label="Supervisor" value={profile.supervisor} />
          <Row label="Home base" value={profile.homeBase} />
        </div>
        <p className="text-[10px] text-slate-400 mt-1.5 px-1">Managed by Admin Panel · read-only</p>

        {/* Skills */}
        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-5 mb-2">Skills &amp; certifications</p>
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 flex flex-wrap gap-2">
          {[...profile.skills, ...profile.certifications].map((s) => (
            <span key={s} className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">{s}</span>
          ))}
        </div>

        {/* App navigate */}
        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-5 mb-2">App</p>
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
          {[
            { i: BookOpen, l: "Knowledge base", to: "/m/tech/knowledge" },
            { i: Wrench, l: "Sync & offline data", to: "/m/tech/sync" },
            { i: Truck, l: "Van inventory", to: "/m/tech/parts" },
            { i: Settings, l: "Edit profile", to: "/m/tech/profile/edit" },
            { i: Shield, l: "Privacy & security", to: "/m/tech/profile/edit" },
          ].map((it) => (
            <Link key={it.l} to={it.to} className="flex items-center gap-3 p-3.5">
              <it.i className="h-4 w-4 text-slate-500" />
              <span className="text-sm flex-1">{it.l}</span>
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </Link>
          ))}
        </div>

        <button onClick={signOut} className="mt-5 w-full rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 font-semibold text-sm py-3 inline-flex items-center justify-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors">
          <LogOut className="h-4 w-4" /> Sign out
        </button>

        <p className="text-center text-[10px] text-slate-400 mt-4">Orb.Field v3.2 · build 2026.04.30</p>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-3.5">
      <span className="text-[12px] text-slate-500 flex-1">{label}</span>
      <span className="text-[13px] font-semibold text-right">{value}</span>
    </div>
  );
}

export default TechProfileLayout;