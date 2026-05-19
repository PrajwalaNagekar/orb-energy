// Rich mock data for the Orb Energy admin command center.
// All charts/tables across modules consume this so the UI feels coherent
// and reactive to a single source of truth.

export type Severity = "critical" | "warning" | "info";
export type Health = "healthy" | "warning" | "critical";

// ------------------------------------------------------------------
// Sites & customers (Customer 360)
// ------------------------------------------------------------------
export interface Site {
  id: string;
  name: string;
  customerId: string;
  region: string;
  panels: number;
  health: Health;
  output: number; // kW now
  capacity: number; // kW capacity
  uptime: number; // %
  lat: number;
  lng: number;
}

export interface CustomerRecord {
  id: string;
  name: string;
  type: "C&I" | "Residential" | "Utility";
  sites: number;
  panels: number;
  health: number; // 0..100
  mrr: number; // INR
  arrears: number; // INR
  status: Health;
  contact: { name: string; email: string; phone: string };
  installed: string; // date
  csat: number; // 0..5
}

export const customers: CustomerRecord[] = [
  { id: "C-401", name: "Tata Coffee Estates", type: "C&I", sites: 3, panels: 248, health: 96, mrr: 142000, arrears: 0, status: "healthy", contact: { name: "Rohan Iyer", email: "rohan@tatacoffee.in", phone: "+91 98450 12345" }, installed: "2024-02-14", csat: 4.7 },
  { id: "C-402", name: "InfoEdge Tower", type: "C&I", sites: 1, panels: 84, health: 88, mrr: 62500, arrears: 14200, status: "warning", contact: { name: "Anita Rao", email: "ops@infoedge.com", phone: "+91 99100 23456" }, installed: "2023-11-02", csat: 4.2 },
  { id: "C-403", name: "Godrej Logistics", type: "Utility", sites: 5, panels: 612, health: 99, mrr: 318000, arrears: 0, status: "healthy", contact: { name: "Sameer Khan", email: "facilities@godrej.com", phone: "+91 98200 34567" }, installed: "2022-08-19", csat: 4.9 },
  { id: "C-404", name: "Apollo Hospitals", type: "C&I", sites: 2, panels: 196, health: 72, mrr: 108000, arrears: 86000, status: "critical", contact: { name: "Dr. Mehta", email: "mehta@apollo.in", phone: "+91 98430 45678" }, installed: "2024-05-05", csat: 3.8 },
  { id: "C-405", name: "Manipal University", type: "C&I", sites: 4, panels: 420, health: 94, mrr: 240000, arrears: 0, status: "healthy", contact: { name: "Vivek Pai", email: "vp.facilities@manipal.edu", phone: "+91 99860 56789" }, installed: "2023-04-22", csat: 4.6 },
  { id: "C-406", name: "Reliance Retail Hub", type: "C&I", sites: 6, panels: 720, health: 91, mrr: 412000, arrears: 22000, status: "warning", contact: { name: "Karan Shah", email: "k.shah@ril.com", phone: "+91 98678 67890" }, installed: "2022-12-30", csat: 4.4 },
  { id: "C-407", name: "Surya Residency", type: "Residential", sites: 1, panels: 24, health: 98, mrr: 18000, arrears: 0, status: "healthy", contact: { name: "Lakshmi Gupta", email: "lakshmi@surya.in", phone: "+91 98101 78901" }, installed: "2025-01-12", csat: 4.8 },
];

export const sites: Site[] = [
  { id: "S-1001", name: "Bengaluru HQ", customerId: "C-401", region: "South", panels: 124, health: "healthy", output: 482, capacity: 540, uptime: 99.6, lat: 12.97, lng: 77.59 },
  { id: "S-1002", name: "Pune Plant", customerId: "C-403", region: "West", panels: 184, health: "warning", output: 612, capacity: 720, uptime: 96.2, lat: 18.52, lng: 73.85 },
  { id: "S-1003", name: "Chennai Hub", customerId: "C-404", region: "South", panels: 96, health: "critical", output: 188, capacity: 420, uptime: 88.4, lat: 13.08, lng: 80.27 },
  { id: "S-1004", name: "Hyderabad Campus", customerId: "C-405", region: "South", panels: 142, health: "healthy", output: 524, capacity: 580, uptime: 99.1, lat: 17.38, lng: 78.48 },
  { id: "S-1005", name: "Mumbai DC", customerId: "C-406", region: "West", panels: 88, health: "warning", output: 296, capacity: 380, uptime: 94.8, lat: 19.07, lng: 72.87 },
  { id: "S-1006", name: "Delhi NCR", customerId: "C-406", region: "North", panels: 110, health: "healthy", output: 444, capacity: 480, uptime: 98.7, lat: 28.61, lng: 77.20 },
  { id: "S-1007", name: "Coorg Estate", customerId: "C-401", region: "South", panels: 62, health: "healthy", output: 218, capacity: 240, uptime: 99.4, lat: 12.42, lng: 75.74 },
  { id: "S-1008", name: "Noida Office", customerId: "C-402", region: "North", panels: 84, health: "warning", output: 248, capacity: 320, uptime: 95.0, lat: 28.53, lng: 77.39 },
  { id: "S-1009", name: "Surat Logistics", customerId: "C-403", region: "West", panels: 96, health: "healthy", output: 332, capacity: 360, uptime: 99.2, lat: 21.17, lng: 72.83 },
];

// ------------------------------------------------------------------
// Alerts (priority + AI explanation)
// ------------------------------------------------------------------
export interface AdminAlert {
  id: string;
  severity: Severity;
  site: string;
  panel: string;
  title: string;
  detail: string;
  time: string;
  ai: string;
  confidence: number;
  suggested: string;
  cluster?: string;
}

export const adminAlerts: AdminAlert[] = [
  { id: "AL-2041", severity: "critical", site: "Pune Plant", panel: "P-1042", title: "Sudden output drop 62%", detail: "String 4 fell from 4.8kW to 1.8kW in 90 seconds.", time: "2 min ago", ai: "String-level current imbalance + ambient irradiance unchanged. Most likely a connector fault or partial cell shading.", confidence: 92, suggested: "Auto-dispatch L1 technician (Arjun Mehta · 18 min ETA).", cluster: "CL-INV-04" },
  { id: "AL-2040", severity: "warning", site: "Chennai Hub", panel: "P-1031", title: "Module temperature 71°C", detail: "Sustained over 30 min, 18°C above neighbors.", time: "18 min ago", ai: "Temperature gradient consistent with soiling layer. Cleaning interval overdue by 9 days.", confidence: 87, suggested: "Schedule cleaning crew within 48h.", cluster: "CL-SOIL-01" },
  { id: "AL-2039", severity: "warning", site: "Bengaluru HQ", panel: "P-1027", title: "Inverter efficiency drift", detail: "Conversion efficiency 94.2% → 91.6% over 14 days.", time: "1 hr ago", ai: "Capacitor bank degradation pattern. Predicted hard-fail in 18-22 days.", confidence: 84, suggested: "Pre-order inverter PCB · schedule swap window.", cluster: "CL-INV-04" },
  { id: "AL-2038", severity: "info", site: "Hyderabad Campus", panel: "—", title: "Yield 6% above forecast", detail: "Clear-sky bonus.", time: "2 hr ago", ai: "Atmospheric clarity index 0.92 vs 0.81 forecast.", confidence: 95, suggested: "No action — informational." },
  { id: "AL-2037", severity: "critical", site: "Mumbai DC", panel: "P-1019", title: "Communication lost", detail: "Gateway GW-114 stopped publishing 23 min ago.", time: "3 hr ago", ai: "MQTT keepalive failure. LTE backhaul likely down.", confidence: 90, suggested: "Verify network at site · failover to backup SIM.", cluster: "CL-NET-02" },
  { id: "AL-2036", severity: "warning", site: "Delhi NCR", panel: "P-1011", title: "Micro-crack signature", detail: "EL imaging deviation +2.4σ.", time: "5 hr ago", ai: "Cell-level micro-crack consistent with hail event 11d ago.", confidence: 76, suggested: "Schedule thermal inspection during next visit." },
  { id: "AL-2035", severity: "critical", site: "Chennai Hub", panel: "P-1029", title: "Reverse current detected", detail: "−1.2A on string 2.", time: "6 hr ago", ai: "Likely diode failure. Risk of cascading damage.", confidence: 89, suggested: "Isolate string · dispatch immediately.", cluster: "CL-INV-04" },
];

// ------------------------------------------------------------------
// Technicians & dispatch
// ------------------------------------------------------------------
export interface Technician {
  id: string;
  name: string;
  region: string;
  skills: string[];
  jobs: number;
  capacity: number;
  sla: number;
  status: "On site" | "En route" | "Available" | "Off duty";
  utilization: number;
}

export const techniciansFull: Technician[] = [
  { id: "T-12", name: "Arjun Mehta", region: "Pune", skills: ["Inverter", "PV"], jobs: 4, capacity: 6, sla: 98, status: "On site", utilization: 67 },
  { id: "T-08", name: "Priya Nair", region: "Bengaluru", skills: ["PV", "Cleaning"], jobs: 3, capacity: 5, sla: 96, status: "En route", utilization: 60 },
  { id: "T-19", name: "Rakesh Kumar", region: "Chennai", skills: ["Inverter", "Network"], jobs: 5, capacity: 6, sla: 92, status: "On site", utilization: 83 },
  { id: "T-04", name: "Sana Iqbal", region: "Hyderabad", skills: ["PV", "Diagnostics"], jobs: 2, capacity: 6, sla: 99, status: "Available", utilization: 33 },
  { id: "T-22", name: "Vikram Shah", region: "Mumbai", skills: ["Network", "Cleaning"], jobs: 4, capacity: 5, sla: 91, status: "On site", utilization: 80 },
  { id: "T-31", name: "Neha Joshi", region: "Delhi", skills: ["Inverter", "PV"], jobs: 3, capacity: 6, sla: 95, status: "Available", utilization: 50 },
];

export interface Dispatch {
  id: string;
  alertId: string;
  technician: string;
  site: string;
  status: "Queued" | "Assigned" | "En route" | "On site" | "Closed";
  eta: string;
  priority: "P1" | "P2" | "P3";
}

export const dispatches: Dispatch[] = [
  { id: "D-9001", alertId: "AL-2041", technician: "T-12", site: "Pune Plant", status: "En route", eta: "12 min", priority: "P1" },
  { id: "D-9002", alertId: "AL-2037", technician: "T-22", site: "Mumbai DC", status: "On site", eta: "—", priority: "P1" },
  { id: "D-9003", alertId: "AL-2035", technician: "T-19", site: "Chennai Hub", status: "Assigned", eta: "38 min", priority: "P1" },
  { id: "D-9004", alertId: "AL-2040", technician: "T-19", site: "Chennai Hub", status: "Queued", eta: "—", priority: "P2" },
  { id: "D-9005", alertId: "AL-2036", technician: "T-31", site: "Delhi NCR", status: "Queued", eta: "—", priority: "P3" },
];

// ------------------------------------------------------------------
// SLA + service analytics
// ------------------------------------------------------------------
export const slaWeekly = [
  { day: "Mon", target: 95, actual: 96.2, mttr: 142, opened: 12, closed: 11 },
  { day: "Tue", target: 95, actual: 97.8, mttr: 128, opened: 9, closed: 12 },
  { day: "Wed", target: 95, actual: 94.6, mttr: 156, opened: 14, closed: 10 },
  { day: "Thu", target: 95, actual: 98.4, mttr: 118, opened: 8, closed: 11 },
  { day: "Fri", target: 95, actual: 97.1, mttr: 134, opened: 11, closed: 13 },
  { day: "Sat", target: 95, actual: 99.0, mttr: 96, opened: 6, closed: 8 },
  { day: "Sun", target: 95, actual: 98.6, mttr: 102, opened: 5, closed: 7 },
];

export const slaByRegion = [
  { region: "South", sla: 98.4, jobs: 142, mttr: "1h 58m" },
  { region: "West", sla: 96.2, jobs: 118, mttr: "2h 22m" },
  { region: "North", sla: 97.1, jobs: 84, mttr: "2h 06m" },
  { region: "East", sla: 99.0, jobs: 36, mttr: "1h 42m" },
];

// ------------------------------------------------------------------
// Forecasts (yield + actual)
// ------------------------------------------------------------------
export const yieldForecast = Array.from({ length: 24 }).map((_, i) => {
  const sun = Math.max(0, Math.sin(((i - 6) / 12) * Math.PI));
  const forecast = Math.round(sun * 1280);
  const actual = i <= 14 ? Math.round(forecast * (0.92 + Math.random() * 0.14)) : null;
  return { hour: `${i.toString().padStart(2, "0")}:00`, forecast, actual, soilingAdj: Math.round(forecast * 0.94) };
});

export const dailyForecast = Array.from({ length: 14 }).map((_, i) => {
  const base = 38 + Math.sin(i / 2.4) * 6;
  return {
    day: `D+${i + 1}`,
    forecast: Math.round(base * 1000) / 1000,
    weatherAdj: Math.round((base * (0.92 + Math.random() * 0.12)) * 1000) / 1000,
    confidence: 96 - Math.min(20, i * 1.4),
  };
});

// ------------------------------------------------------------------
// Anomaly clusters
// ------------------------------------------------------------------
export interface AnomalyCluster {
  id: string;
  category: string;
  cause: string;
  alerts: number;
  sites: string[];
  trend: "rising" | "falling" | "steady";
  severity: Severity;
  firstSeen: string;
  recommendation: string;
}

export const anomalyClusters: AnomalyCluster[] = [
  { id: "CL-INV-04", category: "Inverter", cause: "Capacitor bank degradation (PCB rev 3.1)", alerts: 14, sites: ["Pune Plant", "Bengaluru HQ", "Chennai Hub"], trend: "rising", severity: "critical", firstSeen: "11d ago", recommendation: "Bulk PCB rev 3.2 swap — saves ₹ 4.6L over 6 months." },
  { id: "CL-SOIL-01", category: "Soiling", cause: "Pre-monsoon dust ramp", alerts: 26, sites: ["Chennai Hub", "Mumbai DC", "Hyderabad Campus"], trend: "rising", severity: "warning", firstSeen: "8d ago", recommendation: "Shorten cleaning cadence to 14d in coastal regions." },
  { id: "CL-NET-02", category: "Connectivity", cause: "Carrier LTE outages, region North-West", alerts: 9, sites: ["Mumbai DC", "Surat Logistics"], trend: "steady", severity: "warning", firstSeen: "21d ago", recommendation: "Activate dual-SIM failover on affected gateways." },
  { id: "CL-PV-07", category: "PV Module", cause: "Hail micro-cracks, Delhi NCR cohort", alerts: 6, sites: ["Delhi NCR", "Noida Office"], trend: "falling", severity: "info", firstSeen: "11d ago", recommendation: "Thermal inspection during next planned visit." },
];

// ------------------------------------------------------------------
// Predictive maintenance
// ------------------------------------------------------------------
export interface Prediction {
  id: string;
  asset: string;
  site: string;
  fault: string;
  daysToFailure: number;
  confidence: number;
  windowStart: string;
  windowEnd: string;
  riskTrend: number[];
  cost: { now: number; later: number };
}

export const predictions: Prediction[] = [
  { id: "PR-501", asset: "Inverter INV-204", site: "Pune Plant", fault: "Capacitor failure", daysToFailure: 18, confidence: 92, windowStart: "D+12", windowEnd: "D+22", riskTrend: [12, 18, 24, 31, 42, 58, 71, 84, 92], cost: { now: 22000, later: 148000 } },
  { id: "PR-502", asset: "Module string S2-04", site: "Chennai Hub", fault: "Diode breakdown", daysToFailure: 7, confidence: 89, windowStart: "D+3", windowEnd: "D+9", riskTrend: [22, 31, 44, 56, 68, 76, 84, 89], cost: { now: 9800, later: 64000 } },
  { id: "PR-503", asset: "Gateway GW-114", site: "Mumbai DC", fault: "LTE modem fail", daysToFailure: 23, confidence: 71, windowStart: "D+18", windowEnd: "D+28", riskTrend: [8, 14, 22, 28, 38, 48, 58, 65, 71], cost: { now: 4500, later: 28000 } },
  { id: "PR-504", asset: "Module M-1188", site: "Delhi NCR", fault: "Micro-crack propagation", daysToFailure: 30, confidence: 76, windowStart: "D+22", windowEnd: "D+38", riskTrend: [4, 9, 16, 24, 33, 42, 54, 64, 76], cost: { now: 6800, later: 42000 } },
];

// ------------------------------------------------------------------
// Inventory
// ------------------------------------------------------------------
export interface Sku {
  id: string;
  name: string;
  category: string;
  warehouse: string;
  stock: number;
  reorder: number;
  monthlyBurn: number;
}

export const inventory: Sku[] = [
  { id: "SKU-PCB31", name: "Inverter PCB rev 3.1", category: "Inverter", warehouse: "Bengaluru WH", stock: 18, reorder: 24, monthlyBurn: 14 },
  { id: "SKU-PCB32", name: "Inverter PCB rev 3.2", category: "Inverter", warehouse: "Bengaluru WH", stock: 84, reorder: 30, monthlyBurn: 12 },
  { id: "SKU-DIODE", name: "Bypass diode pack (10)", category: "Module", warehouse: "Pune WH", stock: 6, reorder: 12, monthlyBurn: 8 },
  { id: "SKU-GW114", name: "Gateway GW-114 LTE", category: "Network", warehouse: "Mumbai WH", stock: 11, reorder: 8, monthlyBurn: 5 },
  { id: "SKU-CONN", name: "MC4 connector kit", category: "Module", warehouse: "Chennai WH", stock: 142, reorder: 60, monthlyBurn: 45 },
  { id: "SKU-CLEAN", name: "Cleaning kit (pro)", category: "Service", warehouse: "Hyderabad WH", stock: 3, reorder: 10, monthlyBurn: 9 },
  { id: "SKU-SENSOR", name: "Irradiance sensor v2", category: "Sensor", warehouse: "Delhi WH", stock: 28, reorder: 20, monthlyBurn: 6 },
];

// ------------------------------------------------------------------
// Billing
// ------------------------------------------------------------------
export interface Invoice {
  id: string;
  customer: string;
  customerId: string;
  amount: number;
  status: "Paid" | "Pending" | "Overdue" | "Disputed";
  due: string;
  issued: string;
}

export const invoices: Invoice[] = [
  { id: "INV-78201", customer: "Tata Coffee Estates", customerId: "C-401", amount: 142000, status: "Paid", due: "2026-04-12", issued: "2026-04-01" },
  { id: "INV-78202", customer: "InfoEdge Tower", customerId: "C-402", amount: 62500, status: "Pending", due: "2026-05-08", issued: "2026-04-22" },
  { id: "INV-78203", customer: "Apollo Hospitals", customerId: "C-404", amount: 108000, status: "Overdue", due: "2026-04-02", issued: "2026-03-22" },
  { id: "INV-78204", customer: "Apollo Hospitals", customerId: "C-404", amount: 108000, status: "Overdue", due: "2026-03-02", issued: "2026-02-22" },
  { id: "INV-78205", customer: "Godrej Logistics", customerId: "C-403", amount: 318000, status: "Paid", due: "2026-04-15", issued: "2026-04-01" },
  { id: "INV-78206", customer: "Manipal University", customerId: "C-405", amount: 240000, status: "Paid", due: "2026-04-18", issued: "2026-04-01" },
  { id: "INV-78207", customer: "Reliance Retail Hub", customerId: "C-406", amount: 412000, status: "Pending", due: "2026-05-12", issued: "2026-04-22" },
  { id: "INV-78208", customer: "Reliance Retail Hub", customerId: "C-406", amount: 22000, status: "Disputed", due: "2026-04-08", issued: "2026-03-28" },
];

export const billingTrend = [
  { month: "Nov", billed: 280, collected: 264 },
  { month: "Dec", billed: 312, collected: 298 },
  { month: "Jan", billed: 296, collected: 286 },
  { month: "Feb", billed: 318, collected: 302 },
  { month: "Mar", billed: 342, collected: 318 },
  { month: "Apr", billed: 368, collected: 326 },
];

// ------------------------------------------------------------------
// IoT / Edge / Ingestion
// ------------------------------------------------------------------
export interface IngestionMetric {
  name: string;
  status: "operational" | "degraded" | "outage";
  throughput: string;
  latency: string;
  uptime: number;
  detail: string;
}

export const ingestion: IngestionMetric[] = [
  { name: "MQTT Broker (primary)", status: "operational", throughput: "182k msg/s", latency: "8 ms", uptime: 99.99, detail: "Cluster 4/4 nodes healthy · backpressure 0%" },
  { name: "Time-series DB", status: "operational", throughput: "1.4 M pts/s", latency: "12 ms", uptime: 99.97, detail: "Hot tier 64% · 21d retention" },
  { name: "Event Bus", status: "operational", throughput: "24k evt/s", latency: "6 ms", uptime: 99.99, detail: "Lag 142 ms · 12 consumer groups" },
  { name: "Rules Engine", status: "operational", throughput: "9.6k eval/s", latency: "18 ms", uptime: 99.94, detail: "284 active rules · 6 misfires/24h" },
  { name: "Stream Processor", status: "degraded", throughput: "78k evt/s", latency: "84 ms", uptime: 99.62, detail: "1 worker at 92% CPU · scale-up pending" },
  { name: "Secure OTA", status: "operational", throughput: "—", latency: "—", uptime: 99.98, detail: "Last campaign 2h ago · 14,820 / 15,420 success" },
  { name: "Edge Gateway Fleet", status: "degraded", throughput: "182 / 184", latency: "—", uptime: 98.91, detail: "GW-114 (Mumbai DC) offline · GW-201 reconnecting" },
  { name: "Identity (mTLS)", status: "operational", throughput: "—", latency: "—", uptime: 99.99, detail: "Cert rotation queue empty" },
];

export const ingestionThroughput = Array.from({ length: 24 }).map((_, i) => ({
  hour: `${i.toString().padStart(2, "0")}:00`,
  mqtt: Math.round(160 + Math.sin(i / 3) * 22 + Math.random() * 6),
  events: Math.round(20 + Math.sin(i / 4) * 5 + Math.random() * 2),
}));

// ------------------------------------------------------------------
// Workflow engine
// ------------------------------------------------------------------
export const workflowQueues = [
  { name: "Open Jobs", count: 24, color: "info" },
  { name: "Dispatch Queue", count: 9, color: "warning" },
  { name: "Pending Approval", count: 5, color: "primary" },
  { name: "Escalated", count: 3, color: "destructive" },
  { name: "Awaiting Parts", count: 7, color: "solar" },
  { name: "Closed (24h)", count: 41, color: "success" },
] as const;

export const automationRules = [
  { id: "R-01", name: "Auto-dispatch P1 within 5 min", enabled: true, triggered: 14, success: 13 },
  { id: "R-02", name: "Soiling → schedule cleaning crew", enabled: true, triggered: 8, success: 8 },
  { id: "R-03", name: "Inverter drift → pre-order PCB", enabled: true, triggered: 5, success: 5 },
  { id: "R-04", name: "Gateway offline >15m → page on-call", enabled: true, triggered: 2, success: 2 },
  { id: "R-05", name: "Yield deviation >12% → notify CSM", enabled: false, triggered: 0, success: 0 },
];

// ------------------------------------------------------------------
// AI insights / model meta
// ------------------------------------------------------------------
export const orbAIModels = [
  { name: "Yield Forecaster v4.2", domain: "Forecasting", confidence: 94, drift: "low", lastTrained: "2d ago" },
  { name: "Anomaly Detector v3.0", domain: "Anomaly", confidence: 91, drift: "low", lastTrained: "5d ago" },
  { name: "Cluster Engine v2.1", domain: "Anomaly Clustering", confidence: 88, drift: "moderate", lastTrained: "9d ago" },
  { name: "Predictive Maintenance v3.4", domain: "Predictive", confidence: 90, drift: "low", lastTrained: "3d ago" },
  { name: "Dispatch Optimizer v1.8", domain: "Dispatch", confidence: 86, drift: "low", lastTrained: "1d ago" },
];

// ------------------------------------------------------------------
// Heatmap (sites × hours)
// ------------------------------------------------------------------
export const heatmapMatrix = sites.map((s) => ({
  site: s.name,
  health: s.health,
  cells: Array.from({ length: 24 }).map((_, h) => {
    const base = s.health === "critical" ? 0.55 : s.health === "warning" ? 0.35 : 0.15;
    const peak = Math.max(0, Math.sin(((h - 6) / 12) * Math.PI));
    return Math.min(1, base + peak * 0.18 + Math.random() * 0.12);
  }),
}));

// ------------------------------------------------------------------
// Quick KPI summaries (derived)
// ------------------------------------------------------------------
export const fleetKpis = {
  panelsOnline: sites.reduce((a, s) => a + s.panels, 0),
  sitesOnline: sites.length,
  underperforming: sites.filter((s) => s.health !== "healthy").length,
  openAlerts: adminAlerts.length,
  criticalAlerts: adminAlerts.filter((a) => a.severity === "critical").length,
  technicianLoad: Math.round(techniciansFull.reduce((a, t) => a + t.utilization, 0) / techniciansFull.length),
  mrr: customers.reduce((a, c) => a + c.mrr, 0),
  arrears: customers.reduce((a, c) => a + c.arrears, 0),
  slaCompliance: Math.round((slaWeekly.reduce((a, d) => a + d.actual, 0) / slaWeekly.length) * 10) / 10,
};
