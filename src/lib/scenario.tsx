import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type ScenarioKey = "sunny" | "cloudy" | "underperforming";

export type Scenario = {
  key: ScenarioKey;
  label: string;
  description: string;
  // Today
  todayKwh: number;
  peakKw: number;
  peakTime: string;
  vsYesterdayPct: number; // signed
  // Health
  healthyPanels: number;
  totalPanels: number;
  healthScore: number; // 0-100
  // Money & impact
  savedTodayInr: number;
  co2KgToday: number;
  monthSavingsInr: number;
  monthKwh: number;
  monthCo2Kg: number;
  treesEquivalent: number;
  efficiencyPct: number;
  // ROI
  lifetimeEarningsInr: number;
  paybackYears: number;
  monthlyAvgInr: number;
  annualProjectionInr: number;
  // Live
  weather: string;
  battery: number;
  batteryState: "charging" | "discharging" | "idle";
  gridExportKw: number;
  // AI insight
  aiInsight: string;
  // Charts (hourly today)
  hourly: { t: number; v: number; expected: number }[];
  // Week and month series
  week: { d: string; v: number }[];
  month: { d: string; v: number }[];
  // Site comparison (yearly)
  monthly: { m: string; v: number; bill: number }[];
  // Alerts count
  alertCounts: { critical: number; warning: number; info: number };
};

function makeHourly(peakKw: number, sigma: number, dipFactor = 1) {
  const points: { t: number; v: number; expected: number }[] = [];
  for (let h = 5; h <= 19; h++) {
    const x = h - 12.5;
    const expected = +(6.0 * Math.exp(-(x * x) / 12)).toFixed(2);
    let v = peakKw * Math.exp(-(x * x) / sigma);
    // Cloudy ripples / underperforming dips
    if (dipFactor < 1) v *= dipFactor + (Math.random() - 0.5) * 0.15;
    if (dipFactor === 1 && peakKw < 6) v *= 0.85 + (Math.random() - 0.5) * 0.25;
    points.push({ t: h, v: +Math.max(0, v).toFixed(2), expected });
  }
  return points;
}

function makeWeek(base: number, jitter: number, trend = 0) {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return days.map((d, i) => ({
    d,
    v: +(base + trend * i + (Math.random() - 0.5) * jitter).toFixed(1),
  }));
}

function makeMonth(base: number, jitter: number) {
  return Array.from({ length: 30 }, (_, i) => ({
    d: `${i + 1}`,
    v: +(base + (Math.random() - 0.5) * jitter).toFixed(1),
  }));
}

function makeMonthly(baseKwh: number, gridRateInr = 8.4) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months.map((m, i) => {
    // Seasonal curve, peak in Apr-May
    const seasonal = 1 + 0.18 * Math.sin(((i - 2) / 12) * Math.PI * 2);
    const v = +(baseKwh * seasonal).toFixed(0);
    return { m, v, bill: Math.round(v * gridRateInr) };
  });
}

export const SCENARIOS: Record<ScenarioKey, Scenario> = {
  sunny: {
    key: "sunny",
    label: "Sunny day",
    description: "Clear sky, all panels healthy",
    todayKwh: 32.6,
    peakKw: 6.4,
    peakTime: "12:30",
    vsYesterdayPct: 14,
    healthyPanels: 20,
    totalPanels: 20,
    healthScore: 98,
    savedTodayInr: 478,
    co2KgToday: 9.6,
    monthSavingsInr: 16240,
    monthKwh: 812,
    monthCo2Kg: 268,
    treesEquivalent: 14,
    efficiencyPct: 99.1,
    lifetimeEarningsInr: 384000,
    paybackYears: 4.2,
    monthlyAvgInr: 14800,
    annualProjectionInr: 178000,
    weather: "Clear · 33°C",
    battery: 92,
    batteryState: "charging",
    gridExportKw: 1.8,
    aiInsight: "Peak yield 6.4 kW today — 8% above forecast. No action required.",
    hourly: makeHourly(6.4, 16),
    week: makeWeek(29, 4, 0.2),
    month: makeMonth(28, 6),
    monthly: makeMonthly(820),
    alertCounts: { critical: 0, warning: 0, info: 2 },
  },
  cloudy: {
    key: "cloudy",
    label: "Partly cloudy",
    description: "Variable irradiance, moderate output",
    todayKwh: 22.4,
    peakKw: 4.6,
    peakTime: "13:10",
    vsYesterdayPct: -6,
    healthyPanels: 19,
    totalPanels: 20,
    healthScore: 92,
    savedTodayInr: 328,
    co2KgToday: 6.6,
    monthSavingsInr: 13420,
    monthKwh: 612,
    monthCo2Kg: 202,
    treesEquivalent: 11,
    efficiencyPct: 94.8,
    lifetimeEarningsInr: 312000,
    paybackYears: 4.8,
    monthlyAvgInr: 12100,
    annualProjectionInr: 145000,
    weather: "Partly cloudy · 29°C",
    battery: 74,
    batteryState: "charging",
    gridExportKw: 0.6,
    aiInsight: "Variable cloud cover. Today's yield aligned with weather forecast.",
    hourly: makeHourly(4.6, 14, 0.85),
    week: makeWeek(22, 5),
    month: makeMonth(21, 7),
    monthly: makeMonthly(620),
    alertCounts: { critical: 0, warning: 1, info: 1 },
  },
  underperforming: {
    key: "underperforming",
    label: "Underperforming",
    description: "Soiling and 1 fault detected",
    todayKwh: 14.2,
    peakKw: 2.9,
    peakTime: "12:50",
    vsYesterdayPct: -38,
    healthyPanels: 17,
    totalPanels: 20,
    healthScore: 71,
    savedTodayInr: 208,
    co2KgToday: 4.2,
    monthSavingsInr: 8640,
    monthKwh: 408,
    monthCo2Kg: 134,
    treesEquivalent: 7,
    efficiencyPct: 78.4,
    lifetimeEarningsInr: 268000,
    paybackYears: 5.6,
    monthlyAvgInr: 8200,
    annualProjectionInr: 98000,
    weather: "Hazy · 31°C",
    battery: 48,
    batteryState: "discharging",
    gridExportKw: 0,
    aiInsight: "Panel C-12 producing 38% below expected. Cleaning visit scheduled Friday.",
    hourly: makeHourly(2.9, 12, 0.72),
    week: makeWeek(16, 6, -0.2),
    month: makeMonth(15, 5),
    monthly: makeMonthly(420),
    alertCounts: { critical: 1, warning: 2, info: 1 },
  },
};

type Ctx = { scenario: Scenario; setScenarioKey: (k: ScenarioKey) => void };
const ScenarioContext = createContext<Ctx | null>(null);

export function ScenarioProvider({ children }: { children: ReactNode }) {
  const [key, setKey] = useState<ScenarioKey>("sunny");
  const value = useMemo(() => ({ scenario: SCENARIOS[key], setScenarioKey: setKey }), [key]);
  return <ScenarioContext.Provider value={value}>{children}</ScenarioContext.Provider>;
}

export function useScenario() {
  const ctx = useContext(ScenarioContext);
  if (!ctx) {
    // Safe fallback when used outside provider
    return { scenario: SCENARIOS.sunny, setScenarioKey: () => {} };
  }
  return ctx;
}

export function inr(n: number) {
  return "₹ " + n.toLocaleString("en-IN");
}
