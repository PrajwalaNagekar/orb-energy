import { ReactNode } from "react";

/**
 * MobileFrame — realistic iPhone 15 Pro bezel with Dynamic Island,
 * status bar (time + signal/wifi/battery glyphs) and home indicator.
 * Wraps every mobile route.
 */
export function MobileFrame({
  children,
  tone = "cream",
  statusBarDark = true,
}: {
  children: ReactNode;
  tone?: "cream" | "white" | "dark" | "emerald" | "amber" | "navy" | "sunset";
  statusBarDark?: boolean;
}) {
  const bg =
    tone === "cream"
      ? "bg-[#f3ebdd]"
      : tone === "white"
        ? "bg-white"
        : tone === "dark"
          ? "bg-[#0a1428] text-white"
          : tone === "navy"
            ? "bg-[#0b1020] text-white"
            : tone === "sunset"
              ? "bg-gradient-to-b from-[#1a0f2e] via-[#3a1a4f] to-[#ff6b35] text-white"
              : tone === "emerald"
                ? "bg-emerald-50"
                : "bg-amber-50";

  const isDarkTone = tone === "dark" || tone === "navy" || tone === "sunset";
  const statusDark = statusBarDark && !isDarkTone;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-200 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex justify-center items-start py-6 sm:py-10 px-4">
      {/* Outer phone bezel */}
      <div className="relative w-full max-w-[390px] rounded-[3rem] bg-[#0a0a0a] p-[10px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55),0_0_0_2px_rgba(255,255,255,0.06)_inset]">
        {/* Side buttons */}
        <span className="absolute -left-[3px] top-[110px] h-7 w-[3px] rounded-l bg-[#1a1a1a]" />
        <span className="absolute -left-[3px] top-[170px] h-12 w-[3px] rounded-l bg-[#1a1a1a]" />
        <span className="absolute -left-[3px] top-[235px] h-12 w-[3px] rounded-l bg-[#1a1a1a]" />
        <span className="absolute -right-[3px] top-[200px] h-20 w-[3px] rounded-r bg-[#1a1a1a]" />

        {/* Inner screen */}
        <div className={`relative overflow-hidden rounded-[2.4rem] ${bg} flex flex-col`} style={{ height: "min(844px, calc(100vh - 80px))", minHeight: 720 }}>
          <StatusBar dark={statusDark} />
          <div className="flex-1 overflow-y-auto pb-6 scrollbar-thin">{children}</div>
          {/* Home indicator */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 h-[5px] w-[120px] rounded-full bg-black/70 dark:bg-white/40" />
        </div>
      </div>
    </div>
  );
}

function StatusBar({ dark }: { dark: boolean }) {
  const c = dark ? "text-slate-900" : "text-white";
  return (
    <div className={`relative flex items-center justify-between px-7 pt-3 pb-2 text-[14px] font-semibold ${c} z-10`}>
      <span className="tabular-nums">9:41</span>

      {/* Dynamic Island with camera dot */}
      <div className="absolute left-1/2 -translate-x-1/2 top-2 h-[30px] w-[110px] rounded-full bg-black flex items-center justify-end pr-3">
        <span className="h-2 w-2 rounded-full bg-[#1c1c1e] ring-1 ring-[#2a2a2c]" />
      </div>

      <div className="flex items-center gap-1.5">
        {/* Signal bars */}
        <span className="flex items-end gap-[2px] h-3">
          <span className={`w-[3px] h-[4px] rounded-sm ${dark ? "bg-slate-900" : "bg-white"}`} />
          <span className={`w-[3px] h-[6px] rounded-sm ${dark ? "bg-slate-900" : "bg-white"}`} />
          <span className={`w-[3px] h-[9px] rounded-sm ${dark ? "bg-slate-900" : "bg-white"}`} />
          <span className={`w-[3px] h-[12px] rounded-sm ${dark ? "bg-slate-900" : "bg-white"}`} />
        </span>
        {/* Wifi */}
        <svg viewBox="0 0 16 12" className="h-3 w-4" fill="currentColor">
          <path d="M8 11.5a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4zm0-4.2c1.4 0 2.7.5 3.6 1.4l1-1.1A6.5 6.5 0 003.4 7.6l1 1.1A5 5 0 018 7.3zm0-3.4c2.3 0 4.4.9 6 2.4l1-1.1A8.7 8.7 0 001 5.2l1 1.1a8.5 8.5 0 016-2.4z" />
        </svg>
        {/* Battery */}
        <span className="relative inline-flex items-center">
          <span className={`h-3 w-6 rounded-[3px] border ${dark ? "border-slate-900/80" : "border-white/80"} flex items-center p-[1px]`}>
            <span className={`h-full w-[80%] rounded-[1.5px] ${dark ? "bg-slate-900" : "bg-white"}`} />
          </span>
          <span className={`ml-[1px] h-1.5 w-[2px] rounded-r ${dark ? "bg-slate-900/80" : "bg-white/80"}`} />
        </span>
      </div>
    </div>
  );
}
