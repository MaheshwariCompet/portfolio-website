import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion, useScroll, useTransform, useSpring,
  AnimatePresence, type MotionValue, type Transition,
} from "framer-motion";
import type { IconType } from "react-icons";
import {
  FiArrowUpRight, FiDownload, FiExternalLink, FiTerminal, FiChevronDown,
  FiLayers, FiServer, FiCloud, FiDatabase, FiShield, FiCpu, FiPhone, FiMail,
  FiCalendar, FiRadio, FiZap, FiMessageSquare, FiTrendingUp, FiBell, FiMonitor, FiAward,
} from "react-icons/fi";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";
import WardrobeShowcase from "./WardrobeShowcase";
import ArchitectureDiagrams from "./ArchitectureDiagrams";
import SkillWheel from "./SkillWheel";

/* ===== Edit these ===== */
// Put your photo in src/assets and import it, e.g.
import photo from "./assets/portfolio_headshot_picture.png";
const PROFILE_IMG = photo;
const RESUME_URL = "/Maheshwari__FullstackDeveloper.pdf"; // place the PDF in /public
const PROFILE = {
  name: "Maheshwari Arulkumar",
  email: "arulkumar.maheshwari@gmail.com",
  phone: "+91 63830 34859",
  linkedin: "https://linkedin.com/in/maheshwari-arulkumar",
  github: "https://github.com/MaheshwariCompet", // replace with your GitHub URL
};
/* ====================== */

const spring: Transition = { type: "spring", mass: 0.5, damping: 15, stiffness: 120 };
const smooth = { mass: 0.5, damping: 15, stiffness: 120 };
const glass =
  "border-[3px] border-amber-500 bg-[#1f160d]/95 shadow-[6px_6px_0_#5a3412]";

const NAV = [
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const METRICS = [
  { value: 3.6, suffix: " yrs", decimals: 1, label: "Commercial experience" },
  { value: 70, suffix: "%", decimals: 0, label: "Unit-test coverage reached" },
  { value: 300, suffix: "+", decimals: 0, label: "SonarQube issues resolved" },
];

const TIMELINE = [
  {
    title: "Senior Engineer (from Trainee)",
    org: "Eleviant Tech · CTG Group",
    period: "May 2022 – Oct 2025",
    points: [
      "Built enterprise full-stack apps across React, .NET, SQL Server and Azure for global clients.",
      "Designed RESTful APIs with ASP.NET Core, EF, LINQ and stored procedures for scheduling and leave management.",
      "Shipped real-time status updates via PubNub and Twilio-enabled communication workflows.",
      "Ran code reviews, mentored juniors and wrote technical documentation.",
      "Participated in sprint planning, refinement, daily stand-ups, reviews and retrospectives.",
      "Collaborated closely with cross-functional teams to deliver features on time while maintaining high engineering standards.",
    ],
  },
  {
    title: "Structured professional development",
    org: "NexByte Solutions · project-based learning",
    period: "2026 – Present",
    points: [
      "Structured learning in Agile and leadership fundamentals, AI-assisted development, prompt engineering, RAG and Vibe Coding through guided hands-on projects.",
      "Refreshing .NET, React, Azure, REST API, microservices, CI/CD, performance, security and system design through JD-specific preparation and edge-case analysis.",
      "Building project narratives, STAR stories and technical documentation to support a confident return to a full-time engineering role.",
    ],
  },
];

const SKILLS: { group: string; icon: IconType; tags: string[] }[] = [
  { group: "Frontend", icon: FiLayers, tags: ["React.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap", "DevExpress"] },
  { group: "Backend", icon: FiServer, tags: ["C#", ".NET 8 / Core", "ASP.NET Core Web API", "Entity Framework", "LINQ", "REST", "RBAC"] },
  { group: "AI / LLM", icon: FiCpu, tags: ["Python", "FastAPI", "Gemini", "Claude", "ChatGPT", "Prompt engineering", "RAG"] },
  { group: "Data & Architecture", icon: FiDatabase, tags: ["SQL Server", "T-SQL", "Stored procedures", "Indexing", "Dependency injection"] },
  { group: "Cloud & Integrations", icon: FiCloud, tags: ["Azure Blob", "Azure Functions", "Service Bus", "Azure DevOps", "PubNub", "Twilio", "FCM", "Git"] },
  { group: "Quality", icon: FiShield, tags: ["xUnit", "Moq", "FluentAssertions", "SonarQube", "Code review", "Jira / Scrum"] },
];

type Project = {
  name: string; client: string; blurb: string; stack: string[];
  points: string[]; github?: string; demo?: string; layers: string[];
  /* Optional: one entry per item in `points` (same order). Gives each point an icon + short headline for the impact cards. */
  impact?: { icon: IconType; title: string; badge?: string }[];
};
const PROJECTS: Project[] = [
  {
    name: "InterpVault",
    client: "BIG Language Solutions",
    blurb: "Interpretation services platform connecting clients and interpreters across phone, video-remote and on-site workflows, with billing, documents and role-based access.",
    stack: [".NET 8", "ASP.NET Core", "React", "TypeScript", "SQL Server", "Azure Blob", "PubNub", "Twilio"],
    points: [
      "Delivered full-stack status-maintenance features with React, TypeScript, REST APIs, SQL Server and role-based access control.",
      "Built a recurrent leave-schedule API with timezone-aware schedules and notifications.",
      "Implemented real-time PubNub status notifications in a Twilio-enabled platform, handling network failures.",
      "Improved frontend performance with React lazy loading and linting standards.",
      "SMS Send Invite system to add third-party users to live interpretations directly.",
      "Interpretation Scheduled API performance optimization.",
    ],
    impact: [
      { icon: FiShield, title: "Role-based status features" },
      { icon: FiCalendar, title: "Timezone-aware scheduling" },
      { icon: FiRadio, title: "Real-time status alerts" },
      { icon: FiZap, title: "Faster frontend" },
      { icon: FiMessageSquare, title: "SMS invites to live calls" },
      { icon: FiTrendingUp, title: "Faster scheduling API" },
    ],
    layers: ["Client · React", "API · ASP.NET Core", "Data · SQL Server", "Cloud · Azure"],
  },
  {
    name: "TK Inspection & TK Tracker",
    client: "thyssenkrupp",
    blurb: "Industrial inspection web and mobile solutions for job creation, defect logging, reporting and leave administration.",
    stack: [".NET Core 3.1", ".NET Framework 4.8", "C#", "VB.NET", "SQL Server", "Bootstrap", "DevExpress", "FCM"],
    points: [
      "Owned the leave-management Web API: master, mapping and transaction tables, stored procedures and mobile-facing responses.",
      "Implemented FCM notifications for leave requests and maintained version-controlled SQL and release scripts.",
      "Upgraded legacy portal screens with Bootstrap, VB.NET stored-procedure integration and DevExpress sorting and filtering.",
      "Completed the leave module ahead of schedule while the lead was unavailable, earning broader responsibility.",
    ],
    impact: [
      { icon: FiServer, title: "Leave-management API" },
      { icon: FiBell, title: "FCM leave alerts" },
      { icon: FiMonitor, title: "Legacy portal upgrade" },
      { icon: FiAward, title: "Delivered ahead of schedule", badge: "Standout" },
    ],
    layers: ["Portal · Bootstrap", "API · .NET Core", "Data · SQL Server", "Mobile · FCM"],
  },
];


/* ---------- Scroll-linked 3D stage ---------- */
function Stage({ id, tag, children }: { id: string; tag?: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, smooth);
  const rotateX = useTransform(p, [0, 0.25, 0.75, 1], [18, 0, 0, -12]);
  const scale = useTransform(p, [0, 0.25, 0.75, 1], [0.88, 1, 1, 0.92]);
  const opacity = useTransform(p, [0, 0.2, 0.8, 1], [0, 1, 1, 0.15]);
  const z = useTransform(p, [0, 0.25, 0.75, 1], [-200, 0, 0, -150]);
  return (
    <section ref={ref} id={id} className="relative min-h-screen w-full [perspective:1400px]">
      <motion.div
        style={{ rotateX, scale, opacity, z, transformStyle: "preserve-3d", transformOrigin: "50% 100%" }}
        className="flex min-h-screen w-full items-center justify-center px-6 py-24 will-change-transform"
      >
        <div className="relative w-full max-w-6xl">
          {tag && <span className="absolute -top-12 left-0 -rotate-1 border-[3px] border-black bg-amber-400 px-3 py-1 font-comic text-lg tracking-wider text-black shadow-[4px_4px_0_#22E6F2]">{tag}</span>}
          {children}
        </div>
      </motion.div>
    </section>
  );
}

function Counter({ value, decimals, suffix }: { value: number; decimals: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(0);
  const [started, setStarted] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setStarted(true), { threshold: 0.4 });
    io.observe(ref.current!);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    let raf = 0, t0: number | undefined;
    const tick = (t: number) => {
      t0 ??= t;
      const k = Math.min((t - t0) / 1600, 1);
      setShown(value * (1 - Math.pow(1 - k, 3)));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, value]);
  return <span ref={ref}>{shown.toFixed(decimals)}{suffix}</span>;
}

function Heading({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-12">
      <h2 className="flex items-center gap-3 font-comic text-5xl font-normal tracking-wider text-cyan-300 [text-shadow:4px_4px_0_#5a3412] md:text-7xl">
        <span className="h-4 w-4 shrink-0 rotate-45 bg-amber-500" />
        {title}
      </h2>
      {sub && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 md:text-base">{sub}</p>}
    </div>
  );
}

/* ---------- Nav ---------- */
function Nav() {
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={spring}
      className={`fixed right-4 top-4 z-50 flex items-center gap-1 rounded-none px-2 py-1.5 md:right-8 md:top-6 ${glass} bg-black/40`}
    >
      {NAV.map((n) => (
        <a key={n.id} href={`#${n.id}`}
          className="rounded-none px-3 py-1.5 font-comic text-sm tracking-wider text-zinc-300 transition hover:bg-cyan-500/20 hover:text-white md:px-4 md:text-xs">
          {n.label}
        </a>
      ))}
    </motion.nav>
  );
}

/* ---------- Hero ---------- */
function Hero() {
  const socials: { icon: IconType; href: string; label: string }[] = [
    { icon: FaLinkedinIn, href: PROFILE.linkedin, label: "LinkedIn" },
    { icon: FaGithub, href: PROFILE.github, label: "GitHub" },
    { icon: FiMail, href: `mailto:${PROFILE.email}`, label: "Email" },
    { icon: FiPhone, href: `tel:${PROFILE.phone.replace(/\s/g, "")}`, label: "Call" },
  ];
  const focus = [
    { title: "Full Stack", stack: ".NET, SQL, React & Microsoft Azure" },
    { title: "AI / LLM", stack: "Python, FastAPI, Gemini, Claude & ChatGPT" },
  ];
  return (
    <div>
      <div className="grid items-center gap-12 md:grid-cols-[1.3fr_1fr]">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 40, rotateX: -50 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={spring}
            className="font-comic text-6xl font-normal leading-[0.95] tracking-wide text-white [text-shadow:4px_4px_0_#0b6b73] md:text-8xl"
          >
            {PROFILE.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.15 }}
            className="mt-5 inline-block -rotate-1 border-[3px] border-black bg-amber-400 px-4 py-1 font-comic text-xl tracking-wider text-black shadow-[4px_4px_0_#22E6F2] md:text-3xl"
          >
            .NET Fullstack Developer, AI/LLM Integration
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-6 max-w-xl text-sm leading-relaxed text-zinc-400 md:text-base"
          >
            Building scalable full stack web applications with .NET, SQL Server & React, and AI-powered
            platforms with Python, FastAPI, React & modern LLM APIs.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.5 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <motion.a href="#projects" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} transition={spring}
              className="group inline-flex items-center gap-2 border-[3px] border-black bg-cyan-400 px-6 py-3 font-comic text-lg tracking-wider text-black shadow-[5px_5px_0_#d9822b] transition-shadow hover:shadow-[8px_8px_0_#d9822b]">
              View my work
              <FiArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </motion.a>
            <motion.a href={RESUME_URL} download whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} transition={spring}
              className={`inline-flex items-center gap-2 rounded-sm px-6 py-3 text-sm text-zinc-200 transition hover:border-cyan-400/50 hover:shadow-[4px_4px_0_#5a3412] ${glass}`}>
              <FiDownload /> Download Resume
            </motion.a>
          </motion.div>

          <div className="mt-8 flex gap-3">
            {socials.map(({ icon: Icon, href, label }, i) => (
              <motion.a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                aria-label={label} title={label}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.7 + i * 0.07 }}
                whileHover={{ y: -4, scale: 1.1 }}
                className={`flex h-11 w-11 items-center justify-center rounded-sm text-cyan-300 transition hover:border-cyan-400/50 hover:text-white hover:shadow-[4px_4px_0_#5a3412] ${glass}`}>
                <Icon className="h-4 w-4" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Profile picture area: auto-rotating comic cube. Panel 1 carries the headshot. */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ ...spring, delay: 0.2 }}
          className="relative mx-auto flex flex-col items-center"
        >
          <div className="relative">
            <WardrobeShowcase image={PROFILE_IMG} name={PROFILE.name} />
          </div>
        </motion.div>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {focus.map((f, i) => (
          <motion.div key={f.title}
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.9 + i * 0.1 }}
            whileHover={{ y: -6 }}
            className={`rounded-sm p-6 hover:border-cyan-400/40 ${glass}`}>
            <div className="font-comic font-normal tracking-wider text-2xl  text-white">{f.title}</div>
            <div className="mt-1 text-sm text-cyan-300">{f.stack}</div>
          </motion.div>
        ))}
      </div>
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        className="mt-10 flex justify-center text-cyan-400/60"><FiChevronDown className="h-6 w-6" /></motion.div>
    </div>
  );
}

/* ---------- Experience ---------- */
function Experience() {
  return (
    <>
      <Heading title="Building real workflows" />
      <div className="mb-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {METRICS.map((m, i) => (
          <motion.div key={m.label}
            initial={{ opacity: 0, y: 50, rotateX: 25 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-60px" }} transition={{ ...spring, delay: i * 0.08 }}
            className={`relative overflow-hidden rounded-sm p-6 ${glass}`}>
            <motion.div aria-hidden animate={{ scale: [1, 1.5, 1], opacity: [0.25, 0.6, 0.25] }}
              transition={{ repeat: Infinity, duration: 3.5, delay: i * 0.5, ease: "easeInOut" }}
              className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[radial-gradient(circle,#22E6F2_0%,transparent_70%)] blur-xl" />
            <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-cyan-400 shadow-[4px_4px_0_#5a3412]" />
            <div className="relative font-comic text-6xl text-cyan-300 [text-shadow:3px_3px_0_#5a3412]">
              <Counter {...m} />
            </div>
            <div className="relative mt-3 text-xs text-zinc-400">{m.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-6 border-l border-cyan-500/20 pl-8">
        {TIMELINE.map((t, i) => (
          <motion.article key={t.title}
            initial={{ opacity: 0, x: -40, scale: 0.94 }} whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }} transition={{ ...spring, delay: i * 0.1 }}
            className={`relative rounded-sm p-6 md:p-8 ${glass}`}>
            <span className="absolute -left-[41px] top-8 h-3 w-3 rounded-full bg-cyan-500 shadow-[4px_4px_0_#5a3412]" />
            <h3 className="font-comic font-normal tracking-wider text-3xl  text-white md:text-2xl">{t.title}</h3>
            <div className="mt-1 text-sm text-cyan-300">{t.org} <span className="text-zinc-600">|</span> {t.period}</div>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-zinc-400">
              {t.points.map((pt) => (
                <li key={pt} className="flex gap-3"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-500" />{pt}</li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
      <ArchitectureDiagrams />
    </>
  );
}

/* ---------- Skills ---------- */
function Skills() {
  return (
    <>
      <Heading title="Tools & Skills" sub="Spin the wheel to see what is in each part of the toolkit." />
      <SkillWheel groups={SKILLS} />
    </>
  );
}

/* ---------- Projects ---------- */
function IsoBlocks({ layers, progress, flip }: { layers: string[]; progress: MotionValue<number>; flip: boolean }) {
  const rotX = useTransform(progress, [0, 0.5, 1], [70, 58, 45]);
  const rotZ = useTransform(progress, [0, 0.5, 1], flip ? [25, 40, 55] : [-25, -40, -55]);
  return (
    <div className="flex h-64 items-center justify-center [perspective:1000px] md:h-full md:min-h-[320px]">
      <motion.div style={{ rotateX: rotX, rotateZ: rotZ, transformStyle: "preserve-3d" }} className="relative h-40 w-56">
        {layers.map((l, i) => (
          <motion.div key={l}
            initial={{ z: 0, opacity: 0 }} whileInView={{ z: i * 46, opacity: 1 }} viewport={{ once: true }}
            transition={{ ...spring, delay: 0.15 * i }}
            className="absolute inset-0 flex items-center justify-center rounded-sm border border-cyan-400/30 bg-gradient-to-br from-cyan-600/30 to-cyan-500/10 text-xs font-medium text-cyan-100 shadow-[4px_4px_0_#5a3412] backdrop-blur-md">
            {l}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function ImpactGrid({ items }: { items: { icon: IconType; title: string; text: string; badge?: string }[] }) {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 [perspective:900px]">
      {items.map(({ icon: Icon, title, text, badge }, i) => (
        <motion.div key={title}
          initial={{ opacity: 0, y: 30, rotateX: 20 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-40px" }} transition={{ ...spring, delay: i * 0.07 }}
          whileHover={{ y: -4, x: -2 }}
          className="relative flex flex-col gap-2 border-[3px] border-amber-500 bg-[#2a1d11] p-3.5 shadow-[4px_4px_0_#5a3412] transition-shadow hover:shadow-[7px_7px_0_#22E6F2]">
          <span aria-hidden className="absolute right-2 top-1.5 font-comic text-xs tracking-widest text-amber-500/60">{String(i + 1).padStart(2, "0")}</span>
          <span className="flex h-9 w-9 items-center justify-center border-2 border-black bg-amber-400 text-black shadow-[2px_2px_0_#22E6F2]">
            <Icon className="h-5 w-5" aria-hidden />
          </span>
          <h4 className="font-comic text-lg leading-tight tracking-wide text-cyan-300">{title}</h4>
          {badge && <span className="self-start border-2 border-black bg-cyan-400 px-1.5 font-comic text-xs tracking-wider text-black">{badge}</span>}
          <p className="text-[12px] leading-relaxed text-zinc-400">{text}</p>
        </motion.div>
      ))}
    </div>
  );
}

function ProjectPanel({ p, index }: { p: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, smooth);
  const flip = index % 2 === 1;
  return (
    <div ref={ref} className={`grid items-stretch gap-6 rounded-sm p-6 md:grid-cols-[1.4fr_1fr] md:p-10 ${glass}`}>
      <div className={flip ? "md:order-2" : ""}>
        <div className="text-xs text-cyan-400">{p.client}</div>
        <h3 className="mt-2 font-comic font-normal tracking-wider text-3xl   text-white">{p.name}</h3>
        <p className="mt-4 text-sm leading-relaxed text-zinc-400">{p.blurb}</p>
        {p.impact ? (
          <ImpactGrid items={p.impact.map((m, i) => ({ ...m, text: p.points[i] }))} />
        ) : (
          <ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-zinc-300">
            {p.points.map((pt) => (
              <li key={pt} className="flex gap-3"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-500" />{pt}</li>
            ))}
          </ul>
        )}
        <div className="mt-6 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <span key={s} className="rounded-md border border-cyan-500/10 bg-cyan-500/[0.06] px-2.5 py-1 text-[11px] text-cyan-200">{s}</span>
          ))}
        </div>
        {(p.github || p.demo) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {p.github && (
              <a href={p.github} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border border-cyan-500/20 px-4 py-2 text-xs text-white transition hover:bg-cyan-500/20">
                <FaGithub /> GitHub
              </a>
            )}
            {p.demo && (
              <a href={p.demo} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 border-2 border-black bg-cyan-400 px-4 py-2 text-xs font-semibold text-black shadow-[3px_3px_0_#d9822b] transition hover:bg-cyan-300">
                <FiExternalLink /> Live demo
              </a>
            )}
          </div>
        )}
      </div>
      <div className={flip ? "md:order-1" : ""}>
        <IsoBlocks layers={p.layers} progress={progress} flip={flip} />
      </div>
    </div>
  );
}

function Projects() {
  return (
    <>
      <Heading
        title="Shipped Products & Proven Impact"
        sub="Moving past theoretical exercises to build functional, production-ready applications that solve actual user problems."
      />
      <div className="space-y-10">{PROJECTS.map((p, i) => <ProjectPanel key={p.name} p={p} index={i} />)}</div>
    </>
  );
}


/* ---------- Contact ---------- */
type Line = { t: "in" | "out" | "err"; v: string };

function Contact() {
  const [lines, setLines] = useState<Line[]>([{ t: "out", v: "Type `help` to see available commands." }]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => { boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight }); }, [lines]);

  const answers: Record<string, string> = {
    help: "Commands: whoami, email, phone, linkedin, github, hire, clear",
    whoami: `${PROFILE.name}: .NET Full Stack Developer, AI/LLM Integration.`,
    email: PROFILE.email,
    phone: PROFILE.phone,
    linkedin: PROFILE.linkedin,
    github: PROFILE.github,
    hire: "Opening your mail client...",
  };

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    if (cmd === "clear") return setLines([]);
    if (cmd === "hire") window.location.href = `mailto:${PROFILE.email}?subject=Let's build something useful`;
    const reply: Line[] = !cmd ? [] : cmd in answers
      ? [{ t: "out", v: answers[cmd] }]
      : [{ t: "err", v: `command not found: ${cmd}. Type \`help\`.` }];
    setLines((l) => [...l, { t: "in", v: raw }, ...reply]);
  };

  const cards: { icon: IconType; label: string; value: string; href: string }[] = [
    { icon: FaLinkedinIn, label: "LinkedIn", value: "maheshwari-arulkumar", href: PROFILE.linkedin },
    { icon: FaGithub, label: "GitHub", value: PROFILE.github.replace("https://github.com/", ""), href: PROFILE.github },
    { icon: FiMail, label: "Email", value: PROFILE.email, href: `mailto:${PROFILE.email}` },
    { icon: FiPhone, label: "Call", value: PROFILE.phone, href: `tel:${PROFILE.phone.replace(/\s/g, "")}` },
  ];

  return (
    <>
      <Heading title="Let's build something useful" sub="Open to full-time opportunities in .NET full-stack engineering and AI software." />
      <div className="grid gap-6 md:grid-cols-[1.3fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 25 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }} transition={spring} onClick={() => inputRef.current?.focus()}
          className="overflow-hidden rounded-sm border border-cyan-500/10 bg-black/70 shadow-[4px_4px_0_#5a3412] backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-cyan-500/10 bg-white/[0.03] px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-zinc-700" /><span className="h-3 w-3 rounded-full bg-zinc-700" />
            <span className="h-3 w-3 rounded-full bg-cyan-500 shadow-[4px_4px_0_#5a3412]" />
            <FiTerminal className="ml-3 text-zinc-500" />
          </div>
          <div ref={boxRef} className="h-72 space-y-1.5 overflow-y-auto p-5 text-sm">
            <AnimatePresence initial={false}>
              {lines.map((l, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={spring}
                  className={l.t === "in" ? "text-white" : l.t === "err" ? "text-rose-400" : "text-cyan-300"}>
                  {l.t === "in" && <span className="mr-2 text-cyan-500">$</span>}{l.v}
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="flex items-center">
              <span className="mr-2 text-cyan-500">$</span>
              <input ref={inputRef} value={input} autoComplete="off" spellCheck={false} aria-label="Terminal command"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { run(input); setInput(""); } }}
                className="w-full bg-transparent text-white caret-cyan-400 outline-none" />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          {cards.map(({ icon: Icon, label, value, href }, i) => (
            <motion.a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ ...spring, delay: i * 0.08 }} whileHover={{ y: -6 }}
              className={`flex min-w-0 flex-col justify-between gap-6 rounded-sm p-5 hover:border-cyan-400/40 hover:shadow-[4px_4px_0_#5a3412] ${glass}`}>
              <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-cyan-500/10 text-cyan-400 shadow-[4px_4px_0_#5a3412]">
                <Icon />
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-zinc-500">{label}</span>
                <span className="mt-1 block break-words text-xs text-zinc-200">{value}</span>
              </span>
            </motion.a>
          ))}
        </div>
      </div>
      <p className="mt-16 text-center text-xs text-zinc-600">© {new Date().getFullYear()} {PROFILE.name}</p>
    </>
  );
}

/* ---------- Root ---------- */
export default function Portfolio() {
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, smooth);
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#17120d] font-body text-zinc-200 antialiased selection:bg-cyan-500/40">
      <div aria-hidden className="halftone pointer-events-none fixed inset-0 z-0" />
      <motion.div style={{ scaleX: bar }} className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-cyan-600 to-cyan-400 shadow-[4px_4px_0_#5a3412]" />
      <Nav />
      <div className="relative z-10">
        <Stage id="hero" tag="Page 1: Origin story"><Hero /></Stage>
        <Stage id="experience" tag="Page 2: The missions"><Experience /></Stage>
        <Stage id="skills" tag="Page 3: The gadgets"><Skills /></Stage>
        <Stage id="projects" tag="Page 4: Big battles"><Projects /></Stage>
        <Stage id="contact" tag="Final page: Call the hero"><Contact /></Stage>
      </div>
    </main>
  );
}
