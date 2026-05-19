import { Link, Outlet, useNavigate , useLocation } from "react-router-dom";
import {
  ArrowLeft, ChevronRight, Settings, Shield, FileText, LogOut, Sun, MapPin, Bell, Pencil, Copy, Check, Sparkles } from "lucide-react";
import { MobileShell } from "@/components/MobileShell";
import { useCustomerProfile } from "@/lib/customer-profile";
import { useState } from "react";
import { toast } from "sonner";

function Profile() {
  const pathname = useLocation().pathname;
  const isChild = pathname !== "/m/customer/profile" && pathname.startsWith("/m/customer/profile/");
  if (isChild) return <Outlet />;
  return (
    <MobileShell theme="customer">
      <ProfileBody />
    </MobileShell>
  );
}

function ProfileBody() {
  const { profile, reset } = useCustomerProfile();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const initials = profile.name.split(" ").map((p) => p[0]).slice(0, 2).join("");

  const copyId = () => {
    try { navigator.clipboard.writeText(profile.customerId); } catch {}
    setCopied(true);
    toast.success("Customer ID copied", { description: profile.customerId });
    setTimeout(() => setCopied(false), 1500);
  };

  const signOut = () => {
    reset();
    toast.success("Signed out", { description: "See you soon!" });
    setTimeout(() => navigate("/m/customer/welcome"), 400);
  };

  return (
    <>
      <header className="px-5 pt-12 pb-4 flex items-center gap-3">
        <Link to="/m/customer" className="p-1 -ml-1"><ArrowLeft className="h-5 w-5" /></Link>
        <h1 className="text-lg font-semibold">Profile</h1>
        <Link to="/m/customer/profile/edit" className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
          <Pencil className="h-3.5 w-3.5" /> Edit
        </Link>
      </header>


      <div className="px-5 pb-8">
        {/* Hero card */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-5">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold">{initials}</div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold truncate">{profile.name}</p>
              <p className="text-[11px] text-white/80 truncate">{profile.email}</p>
              <p className="text-[10px] text-white/70 mt-0.5">Customer since · {new Date(profile.installDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}</p>
            </div>
          </div>
          {/* Customer ID chip */}
          <button
            onClick={copyId}
            className="mt-3 w-full rounded-xl bg-white/15 backdrop-blur px-3 py-2.5 flex items-center gap-2 text-left active:bg-white/25"
          >
            <Sparkles className="h-3.5 w-3.5 text-white/80" />
            <div className="flex-1">
              <p className="text-[9px] uppercase tracking-wider text-white/70">Orb Customer ID</p>
              <p className="text-sm font-mono font-bold tracking-wide">{profile.customerId}</p>
            </div>
            {copied ? <Check className="h-4 w-4 text-emerald-200" /> : <Copy className="h-4 w-4 text-white/80" />}
          </button>
          <p className="text-[10px] text-white/60 mt-2 text-center">
            Same ID is used by your technician and our admin team — share it for faster support.
          </p>
        </div>

        {/* System summary */}
        <div className="mt-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 space-y-3">
          <Stat i={Sun} l="System" v={`${profile.systemKwp} kWp · ${profile.panelCount} panels`} />
          <Stat i={MapPin} l="Site" v={`${profile.city} · ${profile.address}`} />
          <Stat i={Shield} l="Plan & warranty" v={`${profile.plan} · ${profile.warrantyYears} yrs left`} />
          <Stat i={FileText} l="Account manager" v={profile.accountManager} />
        </div>

        {/* Admin sync */}
        <div className="mt-3 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-900 p-3 flex items-center gap-3">
          <Sparkles className="h-4 w-4 text-violet-600 shrink-0" />
          <div className="flex-1">
            <p className="text-[11px] font-semibold text-violet-800 dark:text-violet-200">Synced with Orb Admin Console</p>
            <p className="text-[10px] text-violet-600 dark:text-violet-300/80">
              Config v{profile.configVersion} · last sync {new Date(profile.syncedAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
            </p>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mt-5 mb-2">Account</p>
        <div className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
          <Row i={Bell} l="Notifications" to="/m/customer/notifications" />
          <Row i={FileText} l="Documents & contracts" to="/m/customer/documents" />
          <Row i={Settings} l="Preferences" to="/m/customer/preferences" />
          <Row i={Shield} l="Privacy & security" to="/m/customer/privacy" />
        </div>

        <button onClick={signOut} className="mt-5 w-full rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-600 font-semibold text-sm py-3 inline-flex items-center justify-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </>

  );
}

function Row({ i: I, l, to }: { i: typeof Sun; l: string; to: "/m/customer/notifications" | "/m/customer/documents" | "/m/customer/preferences" | "/m/customer/privacy" }) {
  return (
    <Link to={to} className="flex items-center gap-3 p-3.5">
      <I className="h-4 w-4 text-slate-500" />
      <span className="text-sm flex-1">{l}</span>
      <ChevronRight className="h-4 w-4 text-slate-400" />
    </Link>
  );
}

function Stat({ i: I, l, v }: { i: typeof Sun; l: string; v: string }) {
  return (
    <div className="flex items-start gap-3">
      <I className="h-4 w-4 text-emerald-500 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-slate-500">{l}</p>
        <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">{v}</p>
      </div>
    </div>
  );
}

export default Profile;