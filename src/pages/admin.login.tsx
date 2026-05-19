import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect, FormEvent } from "react";
import { Sun, ShieldCheck, KeyRound, Eye, EyeOff, ArrowRight, Lock, Loader2, Fingerprint } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth";
import { toast } from "sonner";

function AdminLogin() {
  const navigate = useNavigate();
  const { signIn } = useAdminAuth();
  const [stage, setStage] = useState<"creds" | "otp">("creds");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("orb-energy");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => { if (stage === "otp") refs.current[0]?.focus(); }, [stage]);

  const submitCreds = (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || password.length < 4) {
      toast.error("Enter a valid username and password");
      return;
    }
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setStage("otp");
      toast.success("Code sent", { description: "6-digit code sent to authenticator app." });
    }, 700);
  };

  const setDigit = (i: number, v: string) => {
    const d = v.replace(/\D/g, "").slice(0, 1);
    const next = [...code];
    next[i] = d;
    setCode(next);
    if (d && i < 5) refs.current[i + 1]?.focus();
  };

  const submitOtp = (e: FormEvent) => {
    e.preventDefault();
    if (code.join("").length !== 6) {
      toast.error("Enter all 6 digits");
      return;
    }
    setBusy(true);
    setTimeout(() => {
      signIn({
        username,
        name: "Shreya Anand",
        role: "Operations Lead · L3",
        loggedAt: Date.now() });
      toast.success("Welcome back, Shreya", { description: "Two-factor verified · session secured." });
      navigate("/admin-console");
    }, 700);
  };

  return (
    <div className="min-h-screen w-full grid lg:grid-cols-[1.1fr_1fr] bg-[#0a1428] text-white">
      {/* Brand panel */}
      <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.18]" style={{
          backgroundImage: "radial-gradient(circle at 20% 20%, oklch(0.78 0.17 70) 0%, transparent 50%), radial-gradient(circle at 80% 70%, oklch(0.55 0.18 240) 0%, transparent 60%)" }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
          backgroundSize: "40px 40px" }} />
        <div className="relative">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-500 shadow-[0_0_24px_rgba(251,176,59,0.4)]">
              <Sun className="h-5 w-5 text-[#0a1428]" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">Orb.Energy</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/50">Unified Solar Ecosystem</p>
            </div>
          </div>
        </div>
        <div className="relative space-y-6 max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wider text-white/70">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> Operator Console · Restricted
          </div>
          <h1 className="text-4xl xl:text-5xl font-bold tracking-tight leading-tight">
            The command centre for <span className="bg-gradient-to-r from-amber-300 to-orange-500 bg-clip-text text-transparent">solar intelligence</span>.
          </h1>
          <p className="text-white/60 leading-relaxed">
            Fleet-wide observability, predictive maintenance, dispatch automation,
            billing control and SLA telemetry — wired straight into Orb-AI.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { k: "15,420", v: "Panels online" },
              { k: "98.4%", v: "SLA compliance" },
              { k: "Orb-AI v4.2", v: "Forecast model" },
              { k: "mTLS · 2FA", v: "Identity layer" },
            ].map((s) => (
              <div key={s.v} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <p className="text-lg font-semibold tabular-nums">{s.k}</p>
                <p className="text-[11px] uppercase tracking-wider text-white/50">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-[11px] text-white/40 flex items-center gap-3">
          <Lock className="h-3 w-3" /> All traffic encrypted · SOC 2 Type II · ISO 27001
        </div>
      </div>

      {/* Auth panel */}
      <div className="flex items-center justify-center p-6 sm:p-12 bg-white text-[#0a1428]">
        <div className="w-full max-w-md">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-8">
            ← Back to ecosystem
          </Link>

          {stage === "creds" ? (
            <form onSubmit={submitCreds} className="space-y-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Step 1 of 2</p>
                <h2 className="text-2xl font-bold mt-1">Sign in to Admin Console</h2>
                <p className="text-sm text-muted-foreground mt-1">Use your operator credentials. 2FA is required.</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Username</label>
                  <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-border bg-background px-3 h-11 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/40 transition-all">
                    <Fingerprint className="h-4 w-4 text-muted-foreground" />
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="flex-1 bg-transparent text-sm outline-none"
                      placeholder="operator.id"
                      autoComplete="username"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-muted-foreground">Password</label>
                    <button type="button" className="text-[11px] text-primary hover:underline">Forgot?</button>
                  </div>
                  <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-border bg-background px-3 h-11 focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary/40 transition-all">
                    <KeyRound className="h-4 w-4 text-muted-foreground" />
                    <input
                      type={show ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-1 bg-transparent text-sm outline-none"
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    <button type="button" onClick={() => setShow((s) => !s)} className="text-muted-foreground hover:text-foreground">
                      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full h-11 rounded-xl bg-[#0a1428] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#0a1428]/90 disabled:opacity-60 transition-colors"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Continue <ArrowRight className="h-4 w-4" /></>}
              </button>

              <div className="rounded-xl bg-muted/40 border border-border p-3 text-[11px] text-muted-foreground">
                <p className="font-semibold text-foreground">Demo credentials</p>
                <p>Username <span className="font-mono">admin</span> · Password <span className="font-mono">orb-energy</span> · 2FA code <span className="font-mono">any 6 digits</span></p>
              </div>
            </form>
          ) : (
            <form onSubmit={submitOtp} className="space-y-5">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Step 2 of 2</p>
                <h2 className="text-2xl font-bold mt-1">Two-factor verification</h2>
                <p className="text-sm text-muted-foreground mt-1">Enter the 6-digit code from your authenticator app.</p>
              </div>

              <div className="flex gap-2 justify-between">
                {code.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => { refs.current[i] = el; }}
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => setDigit(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !code[i] && i > 0) refs.current[i - 1]?.focus();
                    }}
                    className="h-13 w-12 text-center rounded-xl border border-border bg-background text-lg font-bold tabular-nums outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all"
                    style={{ height: 52 }}
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={busy}
                className="w-full h-11 rounded-xl bg-[#0a1428] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#0a1428]/90 disabled:opacity-60 transition-colors"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Verify & enter console <ShieldCheck className="h-4 w-4" /></>}
              </button>

              <div className="flex items-center justify-between text-xs">
                <button type="button" onClick={() => setStage("creds")} className="text-muted-foreground hover:text-foreground">
                  ← Back
                </button>
                <button type="button" onClick={() => toast.info("New code sent")} className="text-primary hover:underline font-medium">
                  Resend code
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
