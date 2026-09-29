import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion, useScroll, useTransform, useSpring, useMotionValueEvent,
  AnimatePresence, type MotionValue, type Transition,
} from "framer-motion";
import type { IconType } from "react-icons";
import {
  FiArrowUpRight, FiDownload, FiExternalLink, FiTerminal, FiChevronDown,
  FiLayers, FiServer, FiCloud, FiDatabase, FiShield, FiCpu, FiPhone, FiMail,
} from "react-icons/fi";
import { FaGithub, FaLinkedinIn } from "react-icons/fa";

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
  "border border-purple-500/10 bg-white/[0.02] backdrop-blur-xl shadow-[0_10px_40px_-10px_rgba(124,58,237,0.35)]";

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
    layers: ["Portal · Bootstrap", "API · .NET Core", "Data · SQL Server", "Mobile · FCM"],
  },
];

/* ---------- Scroll-linked 3D stage ---------- */
function Stage({ id, children }: { id: string; children: ReactNode }) {
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
        <div className="w-full max-w-6xl">{children}</div>
      </motion.div>
    </section>
  );
}

/* ---------- Particle mesh (reacts to scroll depth + cursor) ---------- */
function ParticleField({ scrollValue }: { scrollValue: MotionValue<number> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const depth = useRef(0);
  useMotionValueEvent(scrollValue, "change", (v) => { depth.current = v; });

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let w = 0, h = 0, raf = 0;
    const mouse = { x: -999, y: -999 };
    const N = 90;
    const pts = Array.from({ length: N }, () => ({
      x: Math.random(), y: Math.random(), z: Math.random(),
      vx: (Math.random() - 0.5) * 0.0004, vy: (Math.random() - 0.5) * 0.0004,
    }));
    const dpr = () => Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = canvas.width = window.innerWidth * dpr();
      h = canvas.height = window.innerHeight * dpr();
    };
    const onMove = (e: PointerEvent) => { mouse.x = e.clientX * dpr(); mouse.y = e.clientY * dpr(); };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const s = depth.current;
      const scale = 1 + s * 2.2;
      const proj = pts.map((p) => {
        if (!reduce) { p.x = (p.x + p.vx + 1) % 1; p.y = (p.y + p.vy + 1) % 1; }
        const zz = (p.z + s * 1.5) % 1;
        const k = 0.4 + zz * scale * 0.6;
        return { x: (0.5 + (p.x - 0.5) * k) * w, y: (0.5 + (p.y - 0.5) * k) * h, r: 0.6 + zz * 2.4, a: 0.25 + zz * 0.6 };
      });
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const d = Math.hypot(proj[i].x - proj[j].x, proj[i].y - proj[j].y);
          if (d < 170) {
            ctx.strokeStyle = `rgba(168,85,247,${(1 - d / 170) * 0.22})`;
            ctx.beginPath(); ctx.moveTo(proj[i].x, proj[i].y); ctx.lineTo(proj[j].x, proj[j].y); ctx.stroke();
          }
        }
        const md = Math.hypot(proj[i].x - mouse.x, proj[i].y - mouse.y);
        if (md < 220) {
          ctx.strokeStyle = `rgba(124,58,237,${(1 - md / 220) * 0.6})`;
          ctx.beginPath(); ctx.moveTo(proj[i].x, proj[i].y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = `rgba(192,132,252,${proj[i].a})`;
        ctx.shadowColor = "#A855F7"; ctx.shadowBlur = 12;
        ctx.beginPath(); ctx.arc(proj[i].x, proj[i].y, proj[i].r, 0, Math.PI * 2); ctx.fill();
        ctx.shadowBlur = 0;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-screen w-screen opacity-80" />;
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
      <h2 className="flex items-center gap-3 text-4xl font-bold tracking-tight text-white md:text-6xl">
        <span className="h-3 w-3 shrink-0 rounded-full bg-purple-500 shadow-[0_0_14px_#A855F7]" />
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
      className={`fixed right-4 top-4 z-50 flex items-center gap-1 rounded-full px-2 py-1.5 md:right-8 md:top-6 ${glass} bg-black/40`}
    >
      {NAV.map((n) => (
        <a key={n.id} href={`#${n.id}`}
          className="rounded-full px-3 py-1.5 text-[11px] text-zinc-400 transition hover:bg-purple-500/20 hover:text-white md:px-4 md:text-xs">
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
            className="text-5xl font-extrabold leading-[1.02] tracking-tighter text-white [text-shadow:0_0_40px_rgba(168,85,247,0.45)] md:text-7xl"
          >
            {PROFILE.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.15 }}
            className="mt-4 bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-lg font-semibold text-transparent md:text-2xl"
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
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_30px_-4px_#7C3AED] transition-shadow duration-300 hover:shadow-[0_0_60px_4px_#A855F7]">
              View my work
              <FiArrowUpRight className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </motion.a>
            <motion.a href={RESUME_URL} download whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.96 }} transition={spring}
              className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm text-zinc-200 transition hover:border-purple-400/50 hover:shadow-[0_0_40px_-4px_#A855F7] ${glass}`}>
              <FiDownload /> Download Resume
            </motion.a>
          </motion.div>

          <div className="mt-8 flex gap-3">
            {socials.map(({ icon: Icon, href, label }, i) => (
              <motion.a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
                aria-label={label} title={label}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.7 + i * 0.07 }}
                whileHover={{ y: -4, scale: 1.1 }}
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-purple-300 transition hover:border-purple-400/50 hover:text-white hover:shadow-[0_0_28px_-2px_#A855F7] ${glass}`}>
                <Icon className="h-4 w-4" />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Profile picture slot */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: 30 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ ...spring, delay: 0.2 }}
          className="relative mx-auto h-64 w-64 md:h-80 md:w-80"
        >
          <motion.div aria-hidden animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }} transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -inset-6 rounded-full bg-[radial-gradient(circle,#7C3AED_0%,transparent_70%)] blur-2xl" />
          <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-purple-500/40 bg-[#0B0A0F] shadow-[0_0_60px_-8px_#A855F7]">
            {PROFILE_IMG ? (
              <img src={PROFILE_IMG} alt={PROFILE.name} className="h-full w-full object-cover object-[center_34%] scale-102" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-6xl font-bold text-purple-500/40">MA</div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-2">
        {focus.map((f, i) => (
          <motion.div key={f.title}
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ ...spring, delay: 0.9 + i * 0.1 }}
            whileHover={{ y: -6 }}
            className={`rounded-2xl p-6 hover:border-purple-400/40 ${glass}`}>
            <div className="text-lg font-bold text-white">{f.title}</div>
            <div className="mt-1 text-sm text-purple-300">{f.stack}</div>
          </motion.div>
        ))}
      </div>
      <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}
        className="mt-10 flex justify-center text-purple-400/60"><FiChevronDown className="h-6 w-6" /></motion.div>
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
            className={`relative overflow-hidden rounded-2xl p-6 ${glass}`}>
            <motion.div aria-hidden animate={{ scale: [1, 1.5, 1], opacity: [0.25, 0.6, 0.25] }}
              transition={{ repeat: Infinity, duration: 3.5, delay: i * 0.5, ease: "easeInOut" }}
              className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[radial-gradient(circle,#A855F7_0%,transparent_70%)] blur-xl" />
            <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_14px_3px_#A855F7]" />
            <div className="relative text-5xl font-extrabold text-white [text-shadow:0_0_28px_rgba(168,85,247,0.7)]">
              <Counter {...m} />
            </div>
            <div className="relative mt-3 text-xs text-zinc-400">{m.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="space-y-6 border-l border-purple-500/20 pl-8">
        {TIMELINE.map((t, i) => (
          <motion.article key={t.title}
            initial={{ opacity: 0, x: -40, scale: 0.94 }} whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }} transition={{ ...spring, delay: i * 0.1 }}
            className={`relative rounded-2xl p-6 md:p-8 ${glass}`}>
            <span className="absolute -left-[41px] top-8 h-3 w-3 rounded-full bg-purple-500 shadow-[0_0_16px_4px_#A855F7]" />
            <h3 className="text-xl font-bold text-white md:text-2xl">{t.title}</h3>
            <div className="mt-1 text-sm text-purple-300">{t.org} <span className="text-zinc-600">|</span> {t.period}</div>
            <ul className="mt-4 space-y-2 text-sm leading-relaxed text-zinc-400">
              {t.points.map((pt) => (
                <li key={pt} className="flex gap-3"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-purple-500" />{pt}</li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </>
  );
}

/* ---------- Skills ---------- */
function FloatingTag({ i, progress, children }: { i: number; progress: MotionValue<number>; children: ReactNode }) {
  const dir = i % 2 === 0 ? 1 : -1;
  const y = useTransform(progress, [0, 1], [30 * dir, -30 * dir]);
  return (
    <motion.span style={{ y }} whileHover={{ scale: 1.1 }} transition={spring}
      className="cursor-default rounded-lg border border-purple-500/10 bg-purple-500/[0.06] px-3 py-1.5 text-xs text-purple-200 backdrop-blur-md transition-colors hover:border-purple-400/50 hover:bg-purple-500/20 hover:shadow-[0_0_20px_-2px_#A855F7]">
      {children}
    </motion.span>
  );
}

function Skills() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, smooth);
  return (
    <div ref={ref}>
      <Heading title="Tools & Skills" />
      <div className="grid gap-5 md:grid-cols-2">
        {SKILLS.map((g, gi) => (
          <motion.div key={g.group}
            initial={{ opacity: 0, y: 60, rotateX: 20 }} whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, margin: "-60px" }} transition={{ ...spring, delay: (gi % 2) * 0.06 }}
            className={`rounded-2xl p-6 ${glass}`}>
            <div className="mb-5 flex items-center gap-3">
              <span className="rounded-lg bg-purple-500/10 p-2 text-purple-400 shadow-[0_0_18px_-4px_#A855F7]"><g.icon className="h-5 w-5" /></span>
              <h3 className="text-lg font-semibold text-white">{g.group}</h3>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {g.tags.map((t, ti) => <FloatingTag key={t} i={ti + gi} progress={progress}>{t}</FloatingTag>)}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
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
            className="absolute inset-0 flex items-center justify-center rounded-xl border border-purple-400/30 bg-gradient-to-br from-violet-600/30 to-purple-500/10 text-xs font-medium text-purple-100 shadow-[0_0_30px_-6px_#7C3AED] backdrop-blur-md">
            {l}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

function ProjectPanel({ p, index }: { p: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, smooth);
  const flip = index % 2 === 1;
  return (
    <div ref={ref} className={`grid items-stretch gap-6 rounded-3xl p-6 md:grid-cols-[1.4fr_1fr] md:p-10 ${glass}`}>
      <div className={flip ? "md:order-2" : ""}>
        <div className="text-xs text-purple-400">{p.client}</div>
        <h3 className="mt-2 text-3xl font-bold tracking-tight text-white">{p.name}</h3>
        <p className="mt-4 text-sm leading-relaxed text-zinc-400">{p.blurb}</p>
        <ul className="mt-5 space-y-2.5 text-sm leading-relaxed text-zinc-300">
          {p.points.map((pt) => (
            <li key={pt} className="flex gap-3"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-purple-500" />{pt}</li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <span key={s} className="rounded-md border border-purple-500/10 bg-purple-500/[0.06] px-2.5 py-1 text-[11px] text-purple-200">{s}</span>
          ))}
        </div>
        {(p.github || p.demo) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {p.github && (
              <a href={p.github} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-purple-500/20 px-4 py-2 text-xs text-white transition hover:bg-purple-500/20">
                <FaGithub /> GitHub
              </a>
            )}
            {p.demo && (
              <a href={p.demo} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_24px_-4px_#7C3AED] transition hover:bg-violet-500">
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
          className="overflow-hidden rounded-2xl border border-purple-500/10 bg-black/70 shadow-[0_20px_80px_-20px_rgba(124,58,237,0.5)] backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-purple-500/10 bg-white/[0.03] px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-zinc-700" /><span className="h-3 w-3 rounded-full bg-zinc-700" />
            <span className="h-3 w-3 rounded-full bg-purple-500 shadow-[0_0_10px_#A855F7]" />
            <FiTerminal className="ml-3 text-zinc-500" />
          </div>
          <div ref={boxRef} className="h-72 space-y-1.5 overflow-y-auto p-5 text-sm">
            <AnimatePresence initial={false}>
              {lines.map((l, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={spring}
                  className={l.t === "in" ? "text-white" : l.t === "err" ? "text-rose-400" : "text-purple-300"}>
                  {l.t === "in" && <span className="mr-2 text-purple-500">$</span>}{l.v}
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="flex items-center">
              <span className="mr-2 text-purple-500">$</span>
              <input ref={inputRef} value={input} autoComplete="off" spellCheck={false} aria-label="Terminal command"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { run(input); setInput(""); } }}
                className="w-full bg-transparent text-white caret-purple-400 outline-none" />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          {cards.map(({ icon: Icon, label, value, href }, i) => (
            <motion.a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer"
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ ...spring, delay: i * 0.08 }} whileHover={{ y: -6 }}
              className={`flex min-w-0 flex-col justify-between gap-6 rounded-2xl p-5 hover:border-purple-400/40 hover:shadow-[0_0_40px_-8px_#A855F7] ${glass}`}>
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400 shadow-[0_0_18px_-4px_#A855F7]">
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
    <main className="relative min-h-screen overflow-x-hidden bg-black font-mono text-zinc-200 antialiased selection:bg-purple-500/40">
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_0%,#7C3AED33_0%,#0B0A0F_55%,#000_100%)]" />
      <ParticleField scrollValue={scrollYProgress} />
      <motion.div style={{ scaleX: bar }} className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-gradient-to-r from-violet-600 to-purple-400 shadow-[0_0_14px_#A855F7]" />
      <Nav />
      <div className="relative z-10">
        <Stage id="hero"><Hero /></Stage>
        <Stage id="experience"><Experience /></Stage>
        <Stage id="skills"><Skills /></Stage>
        <Stage id="projects"><Projects /></Stage>
        <Stage id="contact"><Contact /></Stage>
      </div>
    </main>
  );
}
