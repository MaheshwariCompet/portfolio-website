import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { IconType } from "react-icons";
import {
  FiLayers, FiServer, FiRadio, FiGitPullRequest, FiRefreshCw, FiUsers,
  FiCpu, FiTrendingUp, FiBookOpen, FiTarget,
} from "react-icons/fi";

/* Interactive replacement for the resume-style bullet lists.
   Each tile shows a 2-3 word headline; selecting it reveals the full detail in the caption panel. */
type Tile = { icon: IconType; title: string; short: string; detail: string };
type Role = { title: string; org: string; period: string; tiles: Tile[] };

const ROLES: Role[] = [
  {
    title: "Senior Engineer (from Trainee)", org: "Eleviant Tech · CTG Group", period: "May 2022 – Oct 2025",
    tiles: [
      { icon: FiLayers, title: "Full-stack apps", short: "React · .NET · SQL · Azure", detail: "Built enterprise full-stack apps across React, .NET, SQL Server and Azure for global clients." },
      { icon: FiServer, title: "REST APIs", short: "ASP.NET Core · EF · LINQ", detail: "Designed RESTful APIs with ASP.NET Core, EF, LINQ and stored procedures for scheduling and leave management." },
      { icon: FiRadio, title: "Real-time", short: "PubNub · Twilio", detail: "Shipped real-time status updates via PubNub and Twilio-enabled communication workflows." },
      { icon: FiGitPullRequest, title: "Reviews & mentoring", short: "Reviews · juniors · docs", detail: "Ran code reviews, mentored juniors and wrote technical documentation." },
      { icon: FiRefreshCw, title: "Agile delivery", short: "Sprints · stand-ups · retros", detail: "Participated in sprint planning, refinement, daily stand-ups, reviews and retrospectives." },
      { icon: FiUsers, title: "Team delivery", short: "Cross-functional · on time", detail: "Collaborated closely with cross-functional teams to deliver features on time while maintaining high engineering standards." },
    ],
  },
  {
    title: "Structured professional development", org: "NexByte Solutions · project-based learning", period: "2026 – Present",
    tiles: [
      { icon: FiCpu, title: "AI-assisted dev", short: "Prompting · RAG · Vibe Coding", detail: "Structured learning in Agile and leadership fundamentals, AI-assisted development, prompt engineering, RAG and Vibe Coding through guided hands-on projects." },
      { icon: FiTrendingUp, title: "Stack refresh", short: ".NET · React · Azure · CI/CD", detail: "Refreshing .NET, React, Azure, REST API, microservices, CI/CD, performance, security and system design through JD-specific preparation and edge-case analysis." },
      { icon: FiBookOpen, title: "Storytelling", short: "STAR · docs · narratives", detail: "Building project narratives, STAR stories and technical documentation to support a confident return to a full-time engineering role." },
      { icon: FiTarget, title: "Goal", short: "Back to full-time engineering", detail: "Building the skills and the portfolio for a confident return to a full-time engineering role." },
    ],
  },
];

function RoleCard({ role, index }: { role: Role; index: number }) {
  const [i, setI] = useState(0);
  const cur = role.tiles[i];
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }}
      transition={{ type: "spring", stiffness: 120, damping: 18, delay: index * 0.1 }}
      className="border-[3px] border-amber-500 bg-[#1f160d] p-5 shadow-[6px_6px_0_#5a3412] md:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-comic text-3xl tracking-wider text-white">{role.title}</h3>
        <span className="border-2 border-black bg-amber-400 px-2 font-comic text-sm tracking-wider text-black">{role.period}</span>
      </div>
      <div className="mt-1 text-sm text-cyan-300">{role.org}</div>

      <div role="tablist" className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3">
        {role.tiles.map((t, n) => {
          const on = n === i;
          return (
            <button key={t.title} role="tab" aria-selected={on} onClick={() => setI(n)} onFocus={() => setI(n)}
              onPointerEnter={(e) => { if (e.pointerType === "mouse") setI(n); }}
              className={`group flex flex-col items-start gap-1 border-[3px] border-black p-3 text-left shadow-[3px_3px_0_#d9822b] transition-all duration-200 ${on ? "-translate-y-1 bg-cyan-400 text-black" : "bg-amber-400/90 text-black hover:bg-amber-300"}`}>
              <t.icon className="h-5 w-5" />
              <span className="font-comic text-lg leading-tight tracking-wider">{t.title}</span>
              <span className="text-[11px] font-semibold leading-snug opacity-80">{t.short}</span>
            </button>
          );
        })}
      </div>

      <div className="relative mt-5 min-h-[84px]">
        <AnimatePresence mode="wait">
          <motion.p key={cur.title} initial={{ opacity: 0, y: 10, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
            className="relative border-[3px] border-black bg-[#f2c27a] px-4 py-3 text-sm font-semibold leading-relaxed text-[#0a0f12] shadow-[4px_4px_0_#22E6F2]">
            <span aria-hidden className="absolute -top-[11px] left-8 h-4 w-4 rotate-45 border-l-[3px] border-t-[3px] border-black bg-[#f2c27a]" />
            {cur.detail}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

export default function MissionBoard() {
  return <div className="space-y-8">{ROLES.map((r, i) => <RoleCard key={r.title} role={r} index={i} />)}</div>;
}
