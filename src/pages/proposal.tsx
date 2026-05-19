import { Link } from "react-router-dom";
import { Sun, ArrowLeft, Cpu, Smartphone, Wrench, ShieldCheck, Radio, Sparkles, TrendingDown, TrendingUp, Clock, Database } from "lucide-react";

function Proposal() {
  return (
    <div className="min-h-screen bg-[#0a1428] text-white">
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-[#0a1428]/80 border-b border-white/5">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to ecosystem
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-500">
              <Sun className="h-4 w-4 text-[#0a1428]" />
            </div>
            <span className="text-xs uppercase tracking-[0.2em] text-white/50">Strategic Proposal · 2026</span>
          </div>
        </div>
      </header>

      {/* Cover */}
      <section className="px-6 py-20 lg:py-32">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-400 mb-6">Prepared for Orb Energy</p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            Unified Ecosystem<br />
            for Solar Panel<br />
            <span className="bg-gradient-to-r from-amber-300 to-orange-500 bg-clip-text text-transparent">Intelligence.</span>
          </h1>
          <p className="mt-8 text-lg text-white/55 max-w-2xl leading-relaxed">
            A bespoke IoT, AI and lifecycle management platform — engineered to give Orb Energy granular visibility, predictive control and a delightful customer experience across every panel deployed.
          </p>
        </div>
      </section>

      {/* Executive Summary */}
      <Section eyebrow="Executive Summary" title="End-to-end visibility across every panel, every customer, every site.">
        <p className="text-white/60 max-w-3xl mb-10">
          Orb Energy needs more than monitoring — it needs a unified operating system that connects installations, customers, technicians and AI-driven insights into one experience. This platform delivers exactly that.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
          {[
            { k: "100%", v: "Panel-level visibility" },
            { k: "24/7", v: "Predictive fault detection" },
            { k: "3 Apps", v: "Customer · Tech · Admin" },
            { k: "1 Brain", v: "Orb-AI intelligence" },
          ].map((s) => (
            <div key={s.v} className="bg-[#0a1428] p-6">
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-300 to-orange-500 bg-clip-text text-transparent">{s.k}</div>
              <div className="text-xs text-white/50 mt-2">{s.v}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Strategic Objectives */}
      <Section eyebrow="Strategic Objectives" title="What this platform must achieve.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { n: "01", t: "Granular visibility", d: "Real-time health, output and ROI for every individual panel — not just the inverter." },
            { n: "02", t: "AI automation", d: "Predictive maintenance, anomaly detection and intelligent dispatch via Orb-AI." },
            { n: "03", t: "Operational efficiency", d: "Streamline technicians, support, billing and reporting on one command centre." },
            { n: "04", t: "Customer delight", d: "A premium, transparent app experience that builds trust and reduces churn." },
          ].map((o) => (
            <div key={o.n} className="rounded-2xl border border-white/10 bg-white/[0.02] p-7">
              <div className="text-amber-400 font-mono text-sm mb-3">{o.n}</div>
              <h4 className="text-xl font-semibold">{o.t}</h4>
              <p className="text-sm text-white/55 mt-2">{o.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Ecosystem */}
      <Section eyebrow="The Ecosystem" title="Five components. One unified platform.">
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { i: Smartphone, t: "Customer App", d: "Real-time output, ROI, alerts" },
              { i: Wrench, t: "Technician App", d: "Dispatch, diagnostics, jobs" },
              { i: ShieldCheck, t: "Admin Console", d: "Fleet, billing, analytics" },
              { i: Radio, t: "IoT Edge", d: "Per-panel telemetry & control" },
              { i: Cpu, t: "Orb-AI Core", d: "Forecasting, anomaly detection, dispatch", featured: true },
            ].map((c) => (
              <div
                key={c.t}
                className={`rounded-2xl border p-6 ${
                  c.featured
                    ? "md:col-span-1 border-amber-400/40 bg-gradient-to-br from-amber-500/15 to-orange-500/5 shadow-[0_0_40px_rgba(251,176,59,0.15)]"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                <c.i className={`h-6 w-6 mb-4 ${c.featured ? "text-amber-400" : "text-white/70"}`} />
                <h4 className="font-semibold">{c.t}</h4>
                <p className="text-xs text-white/50 mt-1.5">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Architecture */}
      <Section eyebrow="Architecture" title="A layered IoT stack, built for scale.">
        <div className="rounded-2xl overflow-hidden border border-white/10">
          {[
            { l: "Experience Layer", c: "Customer App · Technician App · Admin Console", color: "from-emerald-500/20 to-emerald-500/0" },
            { l: "Intelligence Layer", c: "Orb-AI · Forecasting · Anomaly Detection · Dispatch Logic", color: "from-amber-500/20 to-amber-500/0" },
            { l: "Core Services", c: "Identity · Billing · Asset Registry · Workflow Engine", color: "from-sky-500/20 to-sky-500/0" },
            { l: "Ingest & Streaming", c: "MQTT · Time-Series DB · Event Bus · Rules", color: "from-violet-500/20 to-violet-500/0" },
            { l: "IoT Edge", c: "Per-panel sensors · Gateway · Secure OTA", color: "from-rose-500/20 to-rose-500/0" },
          ].map((row) => (
            <div key={row.l} className={`flex items-center gap-6 p-5 border-b border-white/5 last:border-0 bg-gradient-to-r ${row.color}`}>
              <div className="w-44 shrink-0 font-semibold text-sm">{row.l}</div>
              <div className="text-sm text-white/60">{row.c}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Customer experience */}
      <Section eyebrow="Customer Experience" title="A premium app that turns data into trust.">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <ol className="space-y-5">
            {[
              { n: 1, t: "Live Panel Grid", d: "Visual map of every panel with real-time output and health status." },
              { n: 2, t: "ROI Tracker", d: "Savings, payback period and lifetime earnings — updated daily." },
              { n: 3, t: "Environmental Impact", d: "CO₂ offset, trees equivalent and community contribution." },
              { n: 4, t: "Smart Alerts", d: "Plain-language notifications with recommended actions." },
            ].map((s) => (
              <li key={s.n} className="flex gap-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-400 font-semibold text-sm">{s.n}</div>
                <div>
                  <h4 className="font-semibold">{s.t}</h4>
                  <p className="text-sm text-white/55 mt-1">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="flex justify-center">
            <Link to="/app/customer" className="block">
              <PhoneMock />
            </Link>
          </div>
        </div>
      </Section>

      {/* Operations */}
      <Section eyebrow="Operations" title="Field & fleet operations, unified.">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7">
            <Wrench className="h-6 w-6 text-amber-400 mb-4" />
            <h4 className="font-semibold text-lg">Technician App</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              {["Smart job dispatch by skill & geo", "Step-by-step diagnostic workflows", "Offline-first with auto-sync", "Photo, signature & parts capture", "Live escalation to L2 support"].map((x) => (
                <li key={x} className="flex items-start gap-2"><span className="text-amber-400 mt-0.5">·</span>{x}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-7">
            <ShieldCheck className="h-6 w-6 text-sky-400 mb-4" />
            <h4 className="font-semibold text-lg">Admin Command Centre</h4>
            <ul className="mt-4 space-y-2 text-sm text-white/60">
              {["Fleet-wide health heatmap", "Customer 360 & billing controls", "SLA tracking & service analytics", "Inventory & technician planning", "Configurable reports & exports"].map((x) => (
                <li key={x} className="flex items-start gap-2"><span className="text-sky-400 mt-0.5">·</span>{x}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Intelligence */}
      <Section eyebrow="Intelligence" title="Orb-AI: from telemetry to foresight.">
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          {[
            { t: "Predictive Maintenance", d: "Detects degradation 14–30 days before failure." },
            { t: "Yield Forecasting", d: "Hourly output prediction using weather + soiling models." },
            { t: "Anomaly Clustering", d: "Identifies systemic faults across installations automatically." },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-500/10 to-transparent p-6">
              <Sparkles className="h-5 w-5 text-amber-400 mb-3" />
              <h4 className="font-semibold">{c.t}</h4>
              <p className="text-sm text-white/55 mt-2">{c.d}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10">
          {[
            { i: TrendingDown, k: "−40%", v: "unplanned site visits" },
            { i: TrendingUp, k: "+8%", v: "average panel yield" },
            { i: Clock, k: "<2 min", v: "alert-to-action time" },
            { i: Database, k: "99.9%", v: "data ingest reliability" },
          ].map((m) => (
            <div key={m.v} className="bg-[#0a1428] p-6">
              <m.i className="h-4 w-4 text-amber-400 mb-3" />
              <div className="text-2xl font-bold">{m.k}</div>
              <div className="text-xs text-white/50 mt-1">{m.v}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section eyebrow="Next Steps" title="Let's build the future of solar, together.">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            { n: "01", t: "Discovery Workshop", d: "Align on KPIs, integrations and success metrics with Orb Energy stakeholders." },
            { n: "02", t: "Solution Blueprint", d: "Detailed architecture, UX flows, data model and delivery roadmap." },
            { n: "03", t: "Pilot Deployment", d: "Limited fleet rollout to validate telemetry, AI models and operations." },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl border border-white/10 bg-white/[0.02] p-7">
              <div className="text-amber-400 font-mono text-sm mb-3">{s.n}</div>
              <h4 className="font-semibold">{s.t}</h4>
              <p className="text-sm text-white/55 mt-2">{s.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-3">
          <Link to="/admin-console" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-7 py-3 text-sm font-semibold text-[#0a1428]">
            Open Admin Console
          </Link>
          <Link to="/app/customer" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3 text-sm font-semibold">
            Try Customer App
          </Link>
        </div>
      </Section>

      <footer className="px-6 py-10 border-t border-white/5 text-xs text-white/40">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <span>Confidential proposal prepared for Orb Energy</span>
          <span>anormos.com · info@anormos.com · 99 166 55 166</span>
        </div>
      </footer>
    </div>
  );
}

function Section({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section className="px-6 py-16 lg:py-24 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs uppercase tracking-[0.25em] text-amber-400/80 mb-3">{eyebrow}</p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10 max-w-3xl">{title}</h2>
        {children}
      </div>
    </section>
  );
}

function PhoneMock() {
  return (
    <div className="relative w-[260px] rounded-[2.2rem] border-[10px] border-white/15 bg-[#0a1428] p-4 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
      <div className="absolute top-2 left-1/2 -translate-x-1/2 h-1 w-12 rounded-full bg-white/20" />
      <div className="mt-3 text-center">
        <div className="text-[10px] text-white/40 uppercase tracking-wider">Today's Output</div>
        <div className="text-3xl font-bold mt-1">28.4 <span className="text-base text-white/50">kWh</span></div>
        <div className="text-xs text-emerald-400 mt-1">▲ 12% vs yesterday</div>
      </div>
      <div className="mt-4 grid grid-cols-5 gap-1.5">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={`aspect-square rounded ${i === 7 ? "bg-rose-500" : "bg-amber-400/80"}`} />
        ))}
      </div>
      <p className="text-[11px] text-white/50 text-center mt-3">19 of 20 panels healthy</p>
      <div className="mt-3 rounded-lg bg-amber-400 text-[#0a1428] text-xs font-semibold py-2 text-center">View Details</div>
    </div>
  );
}

export default Proposal;