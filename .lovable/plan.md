## Goal

Eliminate every "Something went wrong" / glitch across the three apps (Customer, Technician, Admin), keep the bottom nav anchored, and turn every Admin button into a real, navigable, fully populated flow with clear pages, confirmations and information.

---

## 1. Stability & layout fixes

### Customer / Technician mobile shell
- `src/routes/m.customer.profile.tsx` and `src/routes/m.tech.profile.tsx`: stop returning a bare `<Outlet/>` from the parent (it unmounts `MobileShell` → re-mounts `CustomerProfileProvider`/`TechProfileProvider` → form state momentarily blank = "glitch"). Replace with: always render the parent body when the route is exactly `/profile`, and let `/profile/edit` use its own MobileShell as a sibling. Cleaner: convert profile to a single component that conditionally renders the Edit body inline (no Outlet hop). This removes the white-flash + provider re-mount.
- `src/components/MobileShell.tsx`: keep providers OUTSIDE `MobileFrame` so navigating between sibling mobile routes does not unmount the provider tree. Move `CustomerProfileProvider`/`TechProfileProvider`/`ScenarioProvider` to wrap once at root via a tiny `MobileProviders` component used in `__root.tsx` only for `/m/*` paths. This also fixes the bottom tab bar appearing to "move up" when switching to Alerts (tab bar is re-rendered fresh each time today).
- `src/components/MobileFrame.tsx`: ensure status-bar Dynamic Island does not overlap the page header. Pages currently push content with `pt-12` — keep that, but reserve a fixed status-bar height so headers like Splash, Welcome, Login, Profile no longer collide on shorter viewports. Add `pt-[env(safe-area-inset-top)]` and bump children top padding.
- `src/routes/m.customer.splash.tsx` and `src/routes/m.tech.splash.tsx`: replace `absolute bottom-16` loader with a flex column layout (header / center logo / footer loader), removing absolute positioning to stop the loader overlapping the title on small screens.

### Tech welcome / login
- `src/routes/m.tech.welcome.tsx`: remove the floating "Today · P1 · Replace inverter PCB · SLA 38m · Accept" hero card stack (the user calls this the "Today card on Technician login screen"). Replace with a clean brand block + 3 feature pills only.
- `src/routes/m.tech.login.tsx`: keep the ID-card visual, fix vertical rhythm so CTA, biometric button and "New technician" footer never overlap on 720 px tall frames.

### Customer alerts nav-bar shift
- Confirmed cause: `Alerts` parent does `if (isChild) return <Outlet/>` without `MobileShell`; the detail route then renders its own `MobileShell`. Apply the same single-shell pattern as profile: always render `MobileShell` once, and `Outlet` inside it. Bottom nav stays anchored.

### Misc "Something went wrong" sweep
- Audit every route component and add safe fallbacks where data may be missing:
  - `ai-insights.tsx` → `adminAlerts.find(critical)!` and `predictions[0]` (crash if arrays empty). Replace `!` with safe defaults.
  - `m.customer.alerts.$id.tsx` already has an Empty state — verify Bills, Panels, Support detail pages do too. Add fallbacks to `m.customer.bills.$id.tsx`, `m.customer.panels.$id.tsx`, `m.customer.support.$id.tsx`.
  - `m.tech.job.$id.tsx` / `diagnose` / `complete`: render an Empty state when `id` is unknown rather than letting nested components crash.
  - Wrap each top-level mobile route component in a small `<RouteErrorBoundary>` (TanStack `errorComponent`) so any future throw shows a friendly card with "Go back" instead of the framework error overlay.
- Add `errorComponent` and `notFoundComponent` to `__root.tsx` Router defaults (TanStack requirement we are missing in places).

---

## 2. Admin Panel — make every button real

For each action below: a button no longer just toasts. It opens a dedicated route or a confirmation modal with full information, then performs the state update and routes back with a success toast.

### New Admin routes to create
- `src/routes/admin.alerts.$id.assign.tsx` — Assign Technician page. Picker (techs from `techniciansFull` filtered by skill + region + capacity), ETA estimate, assignment note, "Confirm assignment" → toast + back to /alerts.
- `src/routes/admin.alerts.$id.dispatch.tsx` — Dispatch flow: shows alert summary, recommended tech, parts required (from `inventory`), estimated drive time, "Auto-dispatch" / "Hold" buttons, audit log preview.
- `src/routes/admin.alerts.$id.escalate.tsx` — Escalate to L2/L3: severity bump, on-call rotation, paging channel (Slack / SMS / email), confirmation step.
- `src/routes/admin.alerts.$id.tsx` — Alert detail (used by Resolve, Acknowledge, Dismiss). "Resolve" opens an in-page confirm dialog (root cause dropdown, time spent, notes) → confirm → toast.
- `src/routes/admin.workflow.rules.new.tsx` — **New rule** wizard: 4 steps (Trigger → Condition → Action → Review). Real form using `Input`, `Select`, `Switch`. "Save rule" appends to in-memory list and returns to /admin/workflow.
- `src/routes/admin.workflow.rules.$id.tsx` — Rule detail with Enable/Disable, Run history, Edit, Revoke. "Enable/Disable" toggles state with toast; "Revoke" opens AlertDialog confirmation ("This rule will stop firing immediately. Continue?") → confirm → state change.
- `src/routes/admin.playground.tsx` — **Open AI playground**: chat-style UI with Orb-AI prompt presets ("Why is Apollo underperforming?", "Forecast next week"), streaming-style mock responses, model picker (from `orbAIModels`), token/temperature sliders, history sidebar.
- `src/routes/admin.predictive.$id.schedule.tsx` — **Schedule intervention** page: date/time picker, technician picker, parts checklist, customer notification toggle, cost estimate, "Confirm & schedule".
- `src/routes/admin.notifications.tsx` — **Bell icon** target: full notification inbox grouped by Today / Yesterday / Earlier, per-item Mark read / Open. Unread count is the badge in `PageShell`.
- `src/routes/billing.$id.tsx` — **Billing View** detail: customer block, line items, taxes, payment history, downloadable PDF placeholder, status timeline, "Mark paid", "Send reminder", "Issue credit note" buttons.
- `src/routes/billing.new.tsx` — **Generate** invoice: customer picker, line items editor, tax rules, preview pane, "Save draft / Send".
- `src/routes/admin.inventory.$sku.reorder.tsx` — **Reorder flow**: shows SKU, current stock, monthly burn, suggested qty, vendor list (mock), price, ETA, "Place PO" → confirmation screen with PO number.
- `src/routes/admin.actions.$id.complete.tsx` — **Complete** dispatched action: outcome form (resolved / partially / failed), parts used, photo placeholders, signature placeholder, "Submit completion" with confirmation.

### Wire-ups in existing pages
- `src/routes/alerts.tsx`: "Assign technician" → Link to `/admin/alerts/$id/assign`. "Acknowledge" → in-place toggle with toast and visible "Acknowledged" pill.
- `src/routes/admin.actions.tsx`: "Auto-dispatch" → routes to dispatch page; "Escalate" → escalate page; "Dismiss" → AlertDialog confirm; "Complete" added when state is `dispatched`.
- `src/routes/admin.workflow.tsx`: "New rule" → `/admin/workflow/rules/new`. Each row → `/admin/workflow/rules/$id`. Enable/Disable persists in local state and the table re-renders.
- `src/routes/admin.predictive.tsx`: "Schedule intervention" → `/admin/predictive/$id/schedule`. "Snooze" opens a small dropdown (1h / 24h / 7d).
- `src/routes/billing.tsx`: row "View" → `/billing/$id`. "New invoice" → `/billing/new`. "Generate" added under Reports tab style for credit notes.
- `src/routes/admin.inventory.tsx`: "Reorder" → `/admin/inventory/$sku/reorder`.
- `src/components/PageShell.tsx`: bell icon becomes a `<Link to="/admin/notifications">`. Badge reads from a small `useNotifications()` hook fed by mock data so the count is real, not hardcoded to "3".

### Fleet Health Heatmap visibility
- `src/routes/admin-console.tsx`: keep the existing heatmap card but also surface a **"Open full heatmap"** CTA linking to `/admin/heatmap`, plus add legend row, total anomalies counter and top-3 hotspot list right under the grid (drawn from `heatmapMatrix`).
- `src/routes/admin.heatmap.tsx`: add an Insights panel above the matrix (top 3 hottest sites, hottest hour-of-day band, week-over-week change), make cell click open a side drawer (already exists as Cell inspector — promote it to sticky on desktop, modal on mobile), and render a small per-region breakdown bar chart.

### UI pieces to add
- `src/components/ConfirmDialog.tsx` — thin wrapper around shadcn `AlertDialog` for Resolve / Revoke / Dismiss confirmations.
- `src/components/EmptyState.tsx` — used by every detail route's not-found path.
- `src/lib/admin-data.ts` — extend with: `notifications`, `auditLog`, `vendors` (for reorder), `invoiceLineItems` (for billing detail), and helper functions `getAlert(id)`, `getRule(id)`, `getInvoice(id)`, `getPrediction(id)`, `getSku(id)` so detail pages have real data.

---

## 3. QA pass

- Click-through every primary CTA in: Customer (Home → Energy → Alerts → Bills → Profile → Edit → Save → back; Alert detail; Bill detail; Panel detail; Support; Notifications). Technician (Home → Job → Diagnose → Complete → History; Schedule; Parts; Knowledge; Sync; Profile → Edit). Admin (every sidebar entry, then every button on each page including new flows above).
- Confirm no React crash, no router warning, no missing-route navigation, and the bottom tab bar never moves between sibling routes.

---

## Files (summary)

Edit: `__root.tsx`, `MobileShell.tsx`, `MobileFrame.tsx`, `m.customer.splash.tsx`, `m.tech.splash.tsx`, `m.tech.welcome.tsx`, `m.tech.login.tsx`, `m.customer.profile.tsx`, `m.tech.profile.tsx`, `m.customer.alerts.tsx`, `ai-insights.tsx`, `alerts.tsx`, `admin.actions.tsx`, `admin.workflow.tsx`, `admin.predictive.tsx`, `admin.inventory.tsx`, `admin.heatmap.tsx`, `admin-console.tsx`, `billing.tsx`, `PageShell.tsx`, `lib/admin-data.ts`.

Create: `admin.alerts.$id.tsx`, `admin.alerts.$id.assign.tsx`, `admin.alerts.$id.dispatch.tsx`, `admin.alerts.$id.escalate.tsx`, `admin.workflow.rules.new.tsx`, `admin.workflow.rules.$id.tsx`, `admin.playground.tsx`, `admin.predictive.$id.schedule.tsx`, `admin.notifications.tsx`, `admin.actions.$id.complete.tsx`, `admin.inventory.$sku.reorder.tsx`, `billing.$id.tsx`, `billing.new.tsx`, `components/ConfirmDialog.tsx`, `components/EmptyState.tsx`.
