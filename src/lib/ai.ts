// Client-side mock of the former server function. No network call, no API key.
// Preserves the same shape so AskOrbAI works unchanged.

export type AskInput = {
  prompt: string;
  persona?: "tech" | "customer";
  context?: string;
};

function mockReply(prompt: string, persona: "tech" | "customer") {
  const t = prompt.toLowerCase();
  if (persona === "tech") {
    if (t.includes("mppt") || t.includes("0v") || t.includes("string"))
      return "Likely causes for MPPT-2 reading 0V:\n1. Open string — check MC4 connectors at panels P-014 → P-021.\n2. Blown DC fuse F2 in combiner box (rated 15A).\n3. Failed bypass diode on a single panel pulling string down.\nStart with insulation tester (>1MΩ to ground), then Voc per panel. SOP-INV-204.";
    if (t.includes("earth") || t.includes("isolation"))
      return "Earth-fault on inverter X3:\n1. Isolate DC, lock-out tag-out.\n2. Megger each string +/− to PE at 500V (>1MΩ pass).\n3. Inspect MC4 for water ingress, check rooftop conduit.\n4. If <0.5MΩ, replace the offending sub-string.";
    if (t.includes("part") || t.includes("sku") || t.includes("inventory"))
      return "Common part SKUs in your van today:\n• ORB-MC4-PR — 12 in stock\n• ORB-DCFUSE-15A — 6 in stock\n• ORB-OPT-MPPT3 — 2 in stock\nReorder cutoff 4pm.";
    return "Run the standard 4-step diagnosis: visual → DC voltage → insulation → thermal. If anomaly persists, escalate to L2 with photos and Voc/Isc readings.";
  }
  if (t.includes("output") || t.includes("drop") || t.includes("low"))
    return "Today's output is ~12% below your 30-day average. Main reason: partial cloud cover between 1–3 PM and slight soiling on Roof A. Expected to recover tomorrow.";
  if (t.includes("save") || t.includes("savings") || t.includes("bill"))
    return "You've saved ₹ 4,820 this month vs grid-only — 38% off your bill. YTD savings: ₹ 41,260.";
  if (t.includes("clean") || t.includes("maintenance"))
    return "Next recommended cleaning is in 6 days based on dust patterns. Last service: 94 days ago.";
  if (t.includes("battery"))
    return "Battery is at 84% and healthy. It covered 2.1 kWh of evening load yesterday.";
  return "Your system is performing within expected range today. Live output: 4.2 kW, daily generation 22.6 kWh, CO₂ avoided 16.1 kg.";
}

export async function askOrbAI(args: { data: AskInput }): Promise<{ text: string }> {
  const { prompt, persona = "customer" } = args.data;
  // Simulate small latency so UI loading states are visible.
  await new Promise((r) => setTimeout(r, 350));
  return { text: mockReply(prompt, persona) };
}
