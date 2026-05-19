import { useState } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { askOrbAI } from "@/lib/ai";

type Msg = { role: "user" | "assistant"; text: string };

interface Props {
  persona: "customer" | "tech";
  context?: string;
  suggestions?: string[];
  /** Visual variant: gradient hero (default) or compact card */
  variant?: "hero" | "card";
  className?: string;
}

/**
 * Production-ready Ask Orb-AI widget. Calls the Lovable AI Gateway via a
 * server function. Used inside the Customer & Technician mobile apps.
 */
export function AskOrbAI({ persona, context, suggestions = [], variant = "hero", className = "" }: Props) {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);

  const send = async (q?: string) => {
    const prompt = (q ?? input).trim();
    if (!prompt || busy) return;
    setMsgs((m) => [...m, { role: "user", text: prompt }]);
    setInput("");
    setBusy(true);
    // Hard timeout so the UI never sits buffering forever.
    const timeout = new Promise<{ text: string }>((resolve) =>
      setTimeout(
        () => resolve({ text: "Orb-AI is taking a moment — please try again." }),
        12000,
      ),
    );
    try {
      const res = await Promise.race([
        askOrbAI({ data: { prompt, persona, context } }),
        timeout,
      ]);
      setMsgs((m) => [...m, { role: "assistant", text: res.text }]);
    } catch (e) {
      setMsgs((m) => [
        ...m,
        { role: "assistant", text: e instanceof Error ? e.message : "Orb-AI is unavailable." },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const isHero = variant === "hero";
  const accent =
    persona === "tech"
      ? "from-violet-500 to-fuchsia-600"
      : "from-emerald-500 to-teal-600";

  return (
    <div
      className={`rounded-2xl ${
        isHero ? `bg-gradient-to-br ${accent} text-white p-5` : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4"
      } ${className}`}
    >
      <div className="flex items-center gap-2">
        <Sparkles className={`h-4 w-4 ${isHero ? "" : "text-emerald-600"}`} />
        <p className={`text-sm font-semibold ${isHero ? "" : "text-slate-900 dark:text-white"}`}>Ask Orb-AI</p>
        <span className={`ml-auto text-[10px] uppercase tracking-wider ${isHero ? "text-white/70" : "text-slate-400"}`}>
          Live
        </span>
      </div>
      <p className={`text-[11px] mt-1 ${isHero ? "text-white/80" : "text-slate-500"}`}>
        {persona === "tech"
          ? "Diagnostics, SOPs and part lookups — powered by Lovable AI."
          : "Ask about your output, savings or system — powered by Lovable AI."}
      </p>

      {msgs.length > 0 && (
        <div className={`mt-3 space-y-2 max-h-56 overflow-y-auto rounded-xl ${isHero ? "bg-white/10 backdrop-blur" : "bg-slate-50 dark:bg-slate-900/50"} p-2.5`}>
          {msgs.map((m, i) => (
            <div
              key={i}
              className={`text-[12.5px] leading-snug rounded-lg px-2.5 py-1.5 ${
                m.role === "user"
                  ? isHero
                    ? "bg-white/20 text-white ml-6"
                    : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-100 ml-6"
                  : isHero
                    ? "bg-white text-slate-900 mr-6"
                    : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 mr-6 whitespace-pre-wrap"
              }`}
            >
              {m.text}
            </div>
          ))}
          {busy && (
            <div className={`text-[12px] inline-flex items-center gap-1.5 ${isHero ? "text-white/80" : "text-slate-500"}`}>
              <Loader2 className="h-3 w-3 animate-spin" /> Orb-AI is thinking…
            </div>
          )}
        </div>
      )}

      {suggestions.length > 0 && msgs.length === 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              disabled={busy}
              className={`text-[11px] rounded-full px-2.5 py-1 ${
                isHero
                  ? "bg-white/15 text-white border border-white/20"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className={`mt-3 flex items-center gap-2 rounded-xl ${isHero ? "bg-white/15 backdrop-blur" : "bg-slate-100 dark:bg-slate-900/50"} px-3 py-2`}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
          placeholder={persona === "tech" ? "e.g. Why is MPPT-2 reading 0V?" : "e.g. Why did output drop today?"}
          className={`flex-1 bg-transparent text-sm outline-none ${
            isHero ? "placeholder:text-white/60 text-white" : "placeholder:text-slate-400 text-slate-900 dark:text-white"
          }`}
        />
        <button
          onClick={() => send()}
          disabled={busy || !input.trim()}
          className={`h-7 w-7 rounded-lg flex items-center justify-center disabled:opacity-40 ${
            isHero ? "bg-white text-slate-900" : "bg-emerald-500 text-white"
          }`}
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
