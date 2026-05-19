import { useState, useRef, useEffect } from "react";
import { PageShell } from "@/components/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brain, Send, Sparkles, Cpu } from "lucide-react";
import { orbAIModels } from "@/lib/admin-data";

const presets = [
  "Why is Apollo Hospitals underperforming?",
  "Forecast next week's yield for the South region",
  "Cluster all inverter-related anomalies",
  "Recommend the next preventive intervention",
];

type Msg = { role: "user" | "assistant"; text: string };

const sampleResponse = (q: string) =>
  `Analysing telemetry across 124 sites…\n\nFinding: ${q}\n\nBased on the latest 24h panel-level signals, MQTT throughput, and historical maintenance records, Orb-AI suggests prioritising the highest-impact cohort first. Confidence 92%. Suggested action set generated — review under Smart Actions.`;

function Playground() {
  const [model, setModel] = useState(orbAIModels[0]?.name ?? "Orb-Forecast v4.2");
  const [temperature, setTemperature] = useState(0.4);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: "Hi — I'm Orb-AI. Ask me about fleet performance, anomalies, forecasts or interventions." },
  ]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = (q: string) => {
    if (!q.trim()) return;
    setMessages((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setTimeout(() => setMessages((m) => [...m, { role: "assistant", text: sampleResponse(q) }]), 600);
  };

  return (
    <PageShell title="Orb-AI Playground" subtitle="Interactive console · prompts, model selection, and live diagnostics">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        <Card className="p-0 flex flex-col h-[640px]">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <Brain className="h-4 w-4 text-primary" />
            <p className="text-sm font-semibold">{model}</p>
            <span className="ml-auto text-[11px] text-muted-foreground">temp {temperature.toFixed(2)}</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "assistant" && <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0"><Sparkles className="h-3.5 w-3.5" /></div>}
                <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm whitespace-pre-line ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {m.text}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <div className="border-t border-border p-3">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {presets.map((p) => (
                <button key={p} onClick={() => send(p)} className="text-[11px] rounded-full border border-border px-2.5 py-1 hover:bg-muted">{p}</button>
              ))}
            </div>
            <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask Orb-AI…" />
              <Button type="submit"><Send className="h-3.5 w-3.5" /></Button>
            </form>
          </div>
        </Card>

        <div className="space-y-3">
          <Card className="p-4">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Model</p>
            <select value={model} onChange={(e) => setModel(e.target.value)} className="w-full text-sm rounded-md border border-border bg-background px-2 py-1.5">
              {orbAIModels.map((m) => <option key={m.name} value={m.name}>{m.name}</option>)}
            </select>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mt-4 mb-2">Temperature {temperature.toFixed(2)}</p>
            <input type="range" min={0} max={1} step={0.05} value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} className="w-full" />
          </Card>
          <Card className="p-4">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Models in production</p>
            <div className="space-y-2">
              {orbAIModels.map((m) => (
                <div key={m.name} className="flex items-center gap-2 text-xs">
                  <Cpu className="h-3.5 w-3.5 text-primary" />
                  <span className="flex-1 truncate">{m.name}</span>
                  <span className="font-semibold tabular-nums">{m.confidence}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}

export default Playground;
