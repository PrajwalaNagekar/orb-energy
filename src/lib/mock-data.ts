export const energyTrend = [
  { t: "00:00", today: 0, yesterday: 0 },
  { t: "03:00", today: 0, yesterday: 0 },
  { t: "06:00", today: 12, yesterday: 8 },
  { t: "09:00", today: 142, yesterday: 128 },
  { t: "12:00", today: 318, yesterday: 280 },
  { t: "15:00", today: 286, yesterday: 264 },
  { t: "18:00", today: 84, yesterday: 78 },
  { t: "21:00", today: 4, yesterday: 2 },
];

export const sitesComparison = [
  { name: "Bengaluru HQ", output: 482, target: 500 },
  { name: "Pune Plant", output: 612, target: 580 },
  { name: "Chennai Hub", output: 388, target: 420 },
  { name: "Hyderabad", output: 524, target: 510 },
  { name: "Mumbai DC", output: 296, target: 350 },
  { name: "Delhi NCR", output: 444, target: 460 },
];

export const fleetHealth = [
  { day: "Mon", healthy: 94, warning: 4, critical: 2 },
  { day: "Tue", healthy: 95, warning: 3, critical: 2 },
  { day: "Wed", healthy: 93, warning: 5, critical: 2 },
  { day: "Thu", healthy: 96, warning: 3, critical: 1 },
  { day: "Fri", healthy: 92, warning: 6, critical: 2 },
  { day: "Sat", healthy: 94, warning: 4, critical: 2 },
  { day: "Sun", healthy: 95, warning: 3, critical: 2 },
];

export type PanelStatus = "healthy" | "warning" | "critical";
export const panels: { id: string; site: string; output: number; status: PanelStatus; temp: number }[] = Array.from({ length: 60 }).map((_, i) => {
  const r = Math.random();
  const status: PanelStatus = r > 0.92 ? "critical" : r > 0.82 ? "warning" : "healthy";
  return {
    id: `P-${(1024 + i).toString()}`,
    site: ["Bengaluru HQ", "Pune Plant", "Chennai Hub", "Hyderabad"][i % 4],
    output: status === "critical" ? Math.round(40 + Math.random() * 60) : status === "warning" ? Math.round(180 + Math.random() * 60) : Math.round(290 + Math.random() * 50),
    status,
    temp: Math.round(38 + Math.random() * 18),
  };
});

export const alerts = [
  { id: "AL-2041", severity: "critical", site: "Pune Plant", panel: "P-1042", title: "Sudden output drop 62%", time: "2 min ago", ai: "Likely shading or partial cell failure. Dispatch L1 technician." },
  { id: "AL-2040", severity: "warning", site: "Chennai Hub", panel: "P-1031", title: "Temperature above threshold (71°C)", time: "18 min ago", ai: "Soiling detected. Schedule cleaning within 48 hours." },
  { id: "AL-2039", severity: "warning", site: "Bengaluru HQ", panel: "P-1027", title: "Inverter efficiency drift", time: "1 hr ago", ai: "Predicted failure in 18-22 days. Pre-order inverter PCB." },
  { id: "AL-2038", severity: "info", site: "Hyderabad", panel: "—", title: "Yield 6% above forecast", time: "2 hr ago", ai: "Clear-sky bonus. No action required." },
  { id: "AL-2037", severity: "critical", site: "Mumbai DC", panel: "P-1019", title: "Communication lost", time: "3 hr ago", ai: "Gateway offline. Verify network at site." },
  { id: "AL-2036", severity: "warning", site: "Delhi NCR", panel: "P-1011", title: "Micro-crack signature", time: "5 hr ago", ai: "Schedule thermal inspection during next visit." },
];

export const customers = [
  { id: "C-401", name: "Tata Coffee Estates", sites: 3, panels: 248, health: 96, mrr: "₹ 1,42,000", status: "healthy" },
  { id: "C-402", name: "InfoEdge Tower", sites: 1, panels: 84, health: 88, mrr: "₹ 62,500", status: "warning" },
  { id: "C-403", name: "Godrej Logistics", sites: 5, panels: 612, health: 99, mrr: "₹ 3,18,000", status: "healthy" },
  { id: "C-404", name: "Apollo Hospitals", sites: 2, panels: 196, health: 72, mrr: "₹ 1,08,000", status: "critical" },
  { id: "C-405", name: "Manipal University", sites: 4, panels: 420, health: 94, mrr: "₹ 2,40,000", status: "healthy" },
];

export const technicians = [
  { id: "T-12", name: "Arjun Mehta", region: "Pune", jobs: 4, sla: 98, status: "On site" },
  { id: "T-08", name: "Priya Nair", region: "Bengaluru", jobs: 3, sla: 96, status: "En route" },
  { id: "T-19", name: "Rakesh Kumar", region: "Chennai", jobs: 5, sla: 92, status: "On site" },
  { id: "T-04", name: "Sana Iqbal", region: "Hyderabad", jobs: 2, sla: 99, status: "Available" },
  { id: "T-22", name: "Vikram Shah", region: "Mumbai", jobs: 4, sla: 91, status: "On site" },
];

export const jobs = [
  { id: "JOB-7821", priority: "P1", customer: "Apollo Hospitals", site: "Chennai", task: "Replace inverter PCB", eta: "10:30", status: "In progress" },
  { id: "JOB-7820", priority: "P2", customer: "InfoEdge Tower", site: "Noida", task: "Panel cleaning · 84 units", eta: "12:00", status: "Assigned" },
  { id: "JOB-7819", priority: "P1", customer: "Godrej Logistics", site: "Pune", task: "Investigate output drop", eta: "09:45", status: "In progress" },
  { id: "JOB-7818", priority: "P3", customer: "Tata Coffee", site: "Coorg", task: "Quarterly inspection", eta: "14:00", status: "Scheduled" },
];

export const aiInsights = [
  { title: "Inverter degradation cluster", site: "Pune Plant", confidence: 92, impact: "₹ 48,000 / month", action: "Bulk PCB replacement, save 22% lifetime cost" },
  { title: "Soiling pattern – monsoon ramp", site: "Bengaluru HQ", confidence: 87, impact: "5.2% yield loss", action: "Increase cleaning cadence to 14 days" },
  { title: "Panel string mismatch", site: "Hyderabad", confidence: 78, impact: "12 panels under-performing", action: "Rebalance string in next maintenance window" },
  { title: "Forecast: tomorrow", site: "Fleet-wide", confidence: 95, impact: "+8% above 7-day avg", action: "No action — clear sky predicted" },
];
