import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MermaidDiagram from "./MermaidDiagram";

/* Reconstructed from the responsibilities listed for the Eleviant Tech role (May 2022 - Oct 2025).
   It is a simplified model, not an internal client diagram. Items marked VERIFY are reasonable inferences:
   confirm or edit them so every claim matches what you actually did. */

const ARCH = `flowchart LR
  User(["Business users<br/>(multiple roles)"])
  subgraph FE["Frontend"]
    UI["React + TypeScript<br/>reusable components · lazy loading"]
  end
  subgraph BE["ASP.NET Core backend"]
    API["REST API controllers<br/>RBAC authorization"]
    SVC["Services<br/>business rules"]
    DAL["Data access<br/>EF / LINQ · stored procedures"]
  end
  DB[("SQL Server<br/>master · mapping · transaction")]
  BLOB[["Azure Blob Storage<br/>file management"]]
  PN{{"PubNub<br/>real-time status"}}
  TW{{"Twilio and other<br/>communication services"}}
  User --> UI --> API --> SVC --> DAL --> DB
  SVC --> BLOB
  SVC -.->|"publish events"| PN
  SVC -.->|"notify"| TW
  PN -.->|"push updates"| UI`;

const SEQ = `sequenceDiagram
  autonumber
  actor U as Business user
  participant UI as React UI
  participant API as ASP.NET Core API
  participant DB as SQL Server
  participant PN as PubNub
  participant TW as Twilio
  U->>UI: Change a status
  UI->>API: PUT /status (with token)
  API->>API: Authorize role (RBAC)
  API->>DB: Update via stored procedure
  DB-->>API: Committed
  API-)PN: Publish status event
  API-)TW: Send notification
  API-->>UI: 200 OK
  PN-)UI: Push update to subscribers
  Note over UI,PN: After a network drop the client reconnects and re-fetches current state from the API`;

const ERD = `erDiagram
  LEAVE_TYPE ||--o{ EMPLOYEE_LEAVE_MAP : "assigned via"
  LEAVE_TYPE ||--o{ LEAVE_REQUEST : "classifies"
  LEAVE_TYPE {
    int Id PK
    string Name
    bool IsPaid
  }
  EMPLOYEE_LEAVE_MAP {
    int Id PK
    int EmployeeId FK
    int LeaveTypeId FK
    decimal Balance
  }
  LEAVE_REQUEST {
    int Id PK
    int EmployeeId FK
    int LeaveTypeId FK
    date FromDate
    date ToDate
    string Status
  }`;

const TABS = [
  { id: "arch", label: "Architecture", code: ARCH, alt: "Architecture diagram: React client, ASP.NET Core API, SQL Server, Azure Blob, PubNub and Twilio",
    role: "I built and extended the REST API layer, the reusable React and TypeScript components, RBAC for multiple business roles, and the PubNub, Twilio and Azure Blob integrations." },
  { id: "seq", label: "Request flow", code: SEQ, alt: "Sequence diagram of a real-time status update",
    role: "I owned the status-maintenance path end to end: authorising the change, persisting it, publishing the real-time event and handling network failures." },
  { id: "data", label: "Data model", code: ERD, alt: "Entity relationship diagram of the leave-management schema",
    role: "In my first year I designed the master, mapping and transaction tables and the stored procedures behind the leave-management API.",
    note: "Simplified illustration with generic column names, not the production schema." },
];

const BREAKDOWN: [string, string][] = [
  ["Presentation", "React + TypeScript single-page app with reusable components and React lazy loading for faster first load."],
  ["API", "ASP.NET Core Web API (C#/.NET) exposing REST endpoints for business-critical workflows, with role-based access control across multiple user roles."],
  ["Data", "SQL Server with master, mapping and transaction tables, stored procedures, and tuned queries and indexes."],
  ["Files", "Azure Blob Storage for application file management."],
  ["Real-time and messaging", "PubNub for live status updates; Twilio and other third-party services for communication; Firebase Cloud Messaging for push notifications in the earlier leave-management work."],
  ["Caching and queues", "None claimed. Performance came from SQL indexing and query tuning, React lazy loading and frontend optimisation."],
  ["Quality and delivery", "xUnit tests at about 70% coverage, 300+ SonarQube findings resolved, peer code reviews, Git and Azure DevOps."],
];

const WHY = "A relational core fits this workload: leave and scheduling data is transactional, so SQL Server with stored procedures gives integrity guarantees, set-based performance and a stable contract for web and mobile clients. A document store would add schema flexibility this domain did not need, at the cost of weaker multi-table consistency. Managed pub/sub (PubNub) trades some vendor dependency and per-message cost for not running and scaling WebSocket infrastructure in-house. Keeping the system a modular ASP.NET Core API with dependency injection, rather than splitting into microservices, kept deployment, debugging and testing simple for a team of this size.";

/* VERIFY: items 2 and 3 are inferences about how the system behaved. Edit to match reality. */
const EDGE = [
  ["Real-time connection loss.", "The API stays the source of truth. After a reconnect the UI re-fetches current state, so a missed PubNub event cannot leave a stale status on screen."],
  ["Third-party outages.", "The database change commits first and PubNub or Twilio calls are treated as side effects, so a provider failure does not roll back or block the business operation."],
  ["Time zones.", "Schedules and notifications are rendered per configured local time zone, so recurring events land at the right local time across regions."],
];

export default function ArchitectureDiagrams() {
  const [id, setId] = useState("arch");
  const t = TABS.find((x) => x.id === id)!;
  return (
    <section className="mt-16" aria-label="System architecture and design">
      <h3 className="font-comic text-3xl tracking-wider text-cyan-300 [text-shadow:3px_3px_0_#5a3412] md:text-4xl">System Architecture &amp; Design</h3>
      <p className="mt-2 max-w-3xl text-sm text-zinc-400">Eleviant Tech · Trainee to Senior Software Engineer · full-stack business applications on .NET, React, SQL Server and Azure. A simplified reconstruction of the platform and where my code fits.</p>

      <div role="tablist" className="mt-5 flex flex-wrap gap-2">
        {TABS.map((x) => (
          <button key={x.id} role="tab" aria-selected={x.id === id} onClick={() => setId(x.id)}
            className={`border-[3px] border-black px-4 py-1.5 font-comic text-base tracking-wider shadow-[3px_3px_0_#d9822b] transition-colors ${x.id === id ? "bg-cyan-400 text-black" : "bg-amber-400/80 text-black hover:bg-amber-300"}`}>{x.label}</button>
        ))}
      </div>
      <div className="mt-5 border-[3px] border-amber-500 bg-[#17120d] p-4 shadow-[6px_6px_0_#5a3412]">
        <AnimatePresence mode="wait">
          <motion.div key={id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <MermaidDiagram code={t.code} label={t.alt} />
          </motion.div>
        </AnimatePresence>
        <p className="mt-4 border-t-2 border-dashed border-amber-500/40 pt-3 text-sm leading-relaxed text-zinc-300"><span className="font-comic tracking-wider text-amber-400">MY ROLE: </span>{t.role}</p>
        {"note" in t && t.note && <p className="mt-1 text-xs text-zinc-500">{t.note}</p>}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="border-[3px] border-amber-500 bg-[#1f160d] p-5 shadow-[6px_6px_0_#5a3412]">
          <h4 className="font-comic text-2xl tracking-wider text-white">Architecture breakdown</h4>
          <dl className="mt-3 space-y-3 text-sm">
            {BREAKDOWN.map(([k, v]) => (
              <div key={k}><dt className="font-comic tracking-wider text-amber-400">{k}</dt><dd className="leading-relaxed text-zinc-300">{v}</dd></div>
            ))}
          </dl>
        </div>
        <div className="flex flex-col gap-6">
          <div className="border-[3px] border-amber-500 bg-[#1f160d] p-5 shadow-[6px_6px_0_#5a3412]">
            <h4 className="font-comic text-2xl tracking-wider text-white">The why: trade-offs</h4>
            <p className="mt-3 text-sm leading-relaxed text-zinc-300">{WHY}</p>
          </div>
          <div className="border-[3px] border-cyan-400 bg-[#0d2428] p-5 shadow-[6px_6px_0_#0b6b73]">
            <h4 className="font-comic text-2xl tracking-wider text-white">Edge cases handled</h4>
            <ul className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-300">
              {EDGE.map(([h, b]) => (
                <li key={h} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-amber-500" /><span><b className="text-cyan-300">{h}</b> {b}</span></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
