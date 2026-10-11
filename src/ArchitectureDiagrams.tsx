import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { IconType } from "react-icons";
import { FiMonitor, FiServer, FiDatabase, FiFolder, FiRadio, FiZap, FiShield, FiWifiOff, FiCloudOff, FiGlobe } from "react-icons/fi";
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

type Layer = { icon: IconType; name: string; tag: string; detail: string };
const LAYERS: Layer[] = [
  { icon: FiMonitor, name: "Presentation", tag: "React + TypeScript", detail: "Reusable components and React lazy loading for a faster first load." },
  { icon: FiServer, name: "API", tag: "ASP.NET Core", detail: "REST endpoints for business workflows, with role-based access across user roles." },
  { icon: FiDatabase, name: "Data", tag: "SQL Server", detail: "Master, mapping and transaction tables, stored procedures, tuned queries and indexes." },
  { icon: FiFolder, name: "Files", tag: "Azure Blob", detail: "Application file management." },
  { icon: FiRadio, name: "Real-time", tag: "PubNub · Twilio · FCM", detail: "Live status updates, third-party communication and push notifications in the earlier leave work." },
  { icon: FiZap, name: "Caching & queues", tag: "None claimed", detail: "Performance came from indexing and query tuning, lazy loading and frontend optimisation." },
  { icon: FiShield, name: "Quality", tag: "xUnit · SonarQube", detail: "About 70% coverage, 300+ findings resolved, peer reviews, Git and Azure DevOps." },
];

/* VERIFY: the second and third scenarios are inferences about system behaviour. Edit to match reality. */
const EDGE = [
  { icon: FiWifiOff, title: "Connection drops", breaks: "A real-time event is missed.", fix: "The API is the source of truth; after reconnect the UI re-fetches current state." },
  { icon: FiCloudOff, title: "Provider outage", breaks: "PubNub or Twilio is down.", fix: "The database change commits first and notifications are side effects, so the operation never rolls back." },
  { icon: FiGlobe, title: "Time zones", breaks: "Users sit in different regions.", fix: "Schedules and notifications render per configured local time zone." },
];

function LayerExplorer() {
  const [i, setI] = useState(0);
  const L = LAYERS[i];
  return (
    <div className="grid gap-4 md:grid-cols-[1fr_1.2fr]">
      <div role="tablist" aria-orientation="vertical" className="flex flex-col gap-2">
        {LAYERS.map((l, n) => (
          <button key={l.name} role="tab" aria-selected={n === i} onClick={() => setI(n)} onFocus={() => setI(n)}
            onPointerEnter={(e) => { if (e.pointerType === "mouse") setI(n); }}
            style={{ marginLeft: n === i ? 0 : 12 }}
            className={`flex items-center gap-3 border-[3px] border-black px-3 py-2 text-left shadow-[3px_3px_0_#d9822b] transition-all duration-200 ${n === i ? "bg-cyan-400 text-black" : "bg-amber-400/90 text-black hover:bg-amber-300"}`}>
            <l.icon className="h-5 w-5 shrink-0" />
            <span className="font-comic text-lg tracking-wider">{l.name}</span>
            <span className="ml-auto text-[11px] font-semibold opacity-75">{l.tag}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center border-[3px] border-cyan-400 bg-[#0d2428] p-6 shadow-[6px_6px_0_#0b6b73]">
        <AnimatePresence mode="wait">
          <motion.div key={L.name} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            <L.icon className="h-10 w-10 text-cyan-300" />
            <div className="mt-3 font-comic text-3xl tracking-wider text-white">{L.name}</div>
            <div className="mt-1 inline-block border-2 border-black bg-amber-400 px-2 text-xs font-semibold text-black">{L.tag}</div>
            <p className="mt-4 text-sm leading-relaxed text-zinc-300">{L.detail}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function EdgeCard({ e }: { e: (typeof EDGE)[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <button onClick={() => setOpen((v) => !v)} aria-expanded={open}
      className="flex flex-col gap-3 border-[3px] border-amber-500 bg-[#1f160d] p-4 text-left shadow-[5px_5px_0_#5a3412] transition-transform hover:-translate-y-1">
      <div className="flex items-center gap-2 font-comic text-xl tracking-wider text-white"><e.icon className="h-5 w-5 text-cyan-300" />{e.title}</div>
      <div className="text-sm text-zinc-400"><span className="mr-2 border border-black bg-amber-400 px-1.5 font-comic text-xs text-black">BREAKS</span>{e.breaks}</div>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div key="fix" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="text-sm text-zinc-200"><span className="mr-2 border border-black bg-cyan-400 px-1.5 font-comic text-xs text-black">FIX</span>{e.fix}</div>
          </motion.div>
        ) : (
          <span key="hint" className="text-xs text-cyan-300">Tap to see the fix</span>
        )}
      </AnimatePresence>
    </button>
  );
}

const SubHead = ({ children }: { children: string }) => (
  <h4 className="mb-4 mt-10 font-comic text-2xl tracking-wider text-white">{children}</h4>
);

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

      <SubHead>Architecture breakdown</SubHead>
      <LayerExplorer />
      <SubHead>Edge cases handled</SubHead>
      <div className="grid gap-4 md:grid-cols-3">{EDGE.map((e) => <EdgeCard key={e.title} e={e} />)}</div>
    </section>
  );
}
