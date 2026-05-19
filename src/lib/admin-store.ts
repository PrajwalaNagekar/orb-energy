// Tiny in-memory reactive store for the admin prototype.
// All mutations are local to the browser session.
import { useSyncExternalStore } from "react";

type Listener = () => void;

function createStore<T>(initial: T) {
  let state = initial;
  const listeners = new Set<Listener>();
  return {
    get: () => state,
    set: (updater: (prev: T) => T) => {
      state = updater(state);
      listeners.forEach((l) => l());
    },
    subscribe: (l: Listener) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
}

export function useStore<T>(store: ReturnType<typeof createStore<T>>): T {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}

// ---------- Pending technician onboarding ----------
export interface PendingTechnician {
  id: string; // request ID (REQ-xxxx)
  empId?: string; // assigned ORB-T-xxxx after approval
  name: string;
  email: string;
  phone: string;
  region: string;
  level: "L1" | "L2" | "L3";
  skills: string[];
  certifications: string[];
  yearsExperience: number;
  vanId?: string;
  homeBase: string;
  supervisor: string;
  shift: string;
  emergencyContact: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  notes?: string;
}

export const technicianRequests = createStore<PendingTechnician[]>([
  {
    id: "REQ-3091",
    name: "Arjun Mehta",
    email: "arjun.mehta@orb.energy",
    phone: "+91 99887 12345",
    region: "Pune",
    level: "L2",
    skills: ["Inverter", "PV", "Diagnostics"],
    certifications: ["MNRE Cat-A", "ABB Inverter L2"],
    yearsExperience: 6,
    homeBase: "Pune Hub",
    supervisor: "K. Patel",
    shift: "06:00–14:00",
    emergencyContact: "Sneha Mehta · +91 99887 23456",
    status: "pending",
    submittedAt: "2 hours ago",
    notes: "Strong inverter expertise · ex-Tata Solar.",
  },
  {
    id: "REQ-3092",
    name: "Lakshmi Iyer",
    email: "lakshmi.iyer@orb.energy",
    phone: "+91 98450 88112",
    region: "Bengaluru",
    level: "L1",
    skills: ["PV", "Cleaning"],
    certifications: ["MNRE Cat-B"],
    yearsExperience: 2,
    homeBase: "Bengaluru WH",
    supervisor: "R. Subbu",
    shift: "08:00–16:00",
    emergencyContact: "Mrs. Iyer · +91 98450 11223",
    status: "pending",
    submittedAt: "5 hours ago",
  },
]);

// ---------- Active alert state (so dismiss/dispatch from any screen sticks) ----------
export interface ActionLog {
  id: string;
  ts: string;
  actor: string;
  action: string;
  target: string;
  detail?: string;
}

export const auditLog = createStore<ActionLog[]>([
  { id: "L-9921", ts: "9:41 AM", actor: "Sara Ahmed", action: "Auto-dispatch", target: "AL-2041", detail: "Tech T-12 assigned · ETA 18m" },
  { id: "L-9920", ts: "9:32 AM", actor: "Orb-AI", action: "Alert raised", target: "AL-2041", detail: "Confidence 92%" },
  { id: "L-9919", ts: "9:21 AM", actor: "Sara Ahmed", action: "Marked resolved", target: "AL-2031" },
]);

export function logAction(entry: Omit<ActionLog, "id" | "ts">) {
  auditLog.set((prev) => [
    {
      id: `L-${9900 + prev.length + 1}`,
      ts: new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
      ...entry,
    },
    ...prev,
  ]);
}

// ---------- Action state for alerts (dispatched / resolved / escalated / dismissed) ----------
export type AlertActionState = "dispatched" | "resolved" | "escalated" | "dismissed" | "scheduled";
export const alertActions = createStore<Record<string, AlertActionState>>({});

export function setAlertAction(id: string, state: AlertActionState) {
  alertActions.set((prev) => ({ ...prev, [id]: state }));
}

// ---------- Vendors for reorder flow ----------
export const vendors = [
  { id: "V-01", name: "Solis Components", rating: 4.8, etaDays: 4, terms: "Net 30", price: 1.0 },
  { id: "V-02", name: "Sungrow India", rating: 4.6, etaDays: 6, terms: "Net 45", price: 0.94 },
  { id: "V-03", name: "Local — Bengaluru WH transfer", rating: 4.9, etaDays: 1, terms: "Same-day", price: 1.08 },
];

// ---------- Notifications inbox ----------
export interface AdminNotification {
  id: string;
  title: string;
  body: string;
  ts: string;
  severity: "critical" | "warning" | "info" | "success";
  link?: string;
  read?: boolean;
}

export const notifications = createStore<AdminNotification[]>([
  { id: "N-901", title: "Critical alert · Pune Plant", body: "String 4 fell 62% — auto-dispatch fired.", ts: "2m", severity: "critical", link: "/admin/actions" },
  { id: "N-902", title: "Predicted fault in 7 days", body: "Diode breakdown · Chennai Hub. Schedule intervention.", ts: "18m", severity: "warning", link: "/admin/predictive" },
  { id: "N-903", title: "Inventory low", body: "PCB rev 3.1 below reorder point at Bengaluru WH.", ts: "1h", severity: "warning", link: "/admin/inventory" },
  { id: "N-904", title: "New technician request", body: "Arjun Mehta submitted REQ-3091 for L2 access.", ts: "2h", severity: "info", link: "/technicians" },
  { id: "N-905", title: "SLA target met", body: "South region 98.4% — above target.", ts: "5h", severity: "success", link: "/admin/sla" },
]);

export function markNotificationRead(id: string) {
  notifications.set((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
}
export function markAllNotificationsRead() {
  notifications.set((prev) => prev.map((n) => ({ ...n, read: true })));
}
