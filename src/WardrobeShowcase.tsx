import { useEffect, useRef, useState, type CSSProperties } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import type { IconType } from "react-icons";
import {
  FiCpu, FiCloudRain, FiClock, FiRepeat, FiBriefcase, FiCheckCircle, FiUsers, FiWind,
  FiNavigation, FiLayers, FiArrowRight,
} from "react-icons/fi";

/* Panel content (viewer-facing, no metrics or framework names; edit any line to match what you built):
   Panel 1 - Profile picture only
   Panel 2 - What the project is, who it helps, the benefits
   Panel 3 - Zero-Iron protocol + commute-proofing
   Panel 4 - High-level "how it thinks" flow + tech tags (verify the tags against the project) */
type Face = { key: "photo" | "assistant" | "protocol" | "how"; label: string };
const FACES: Face[] = [
  { key: "photo", label: "Profile" },
  { key: "assistant", label: "The AI assistant and weather" },
  { key: "protocol", label: "Zero-Iron protocol and commute" },
  { key: "how", label: "How it works" },
];
const TECH = ["React", "TypeScript", "Tailwind", "Python", "FastAPI", "Gemini", "Claude", "Prompt engineering"]; // verify against the project
const AUTO_MS = 3500; // time each face stays in view

const Block = ({ icon: Icon, label, title, text }: { icon: IconType; label: string; title: string; text: string }) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center gap-2 font-comic text-xs tracking-[0.2em] text-amber-400"><Icon className="h-4 w-4 text-cyan-300" />{label}</div>
    <h3 className="font-comic text-2xl leading-none tracking-wide text-cyan-300 [text-shadow:2px_2px_0_#5a3412]">{title}</h3>
    <p className="text-[13px] leading-relaxed text-zinc-300">{text}</p>
  </div>
);
const Chip = ({ icon: Icon, text }: { icon: IconType; text: string }) => (
  <span className="flex items-center gap-1 border border-cyan-400/40 bg-cyan-400/10 px-1.5 py-0.5 text-[11px] text-cyan-200">
    <Icon className="h-3 w-3" />{text}
  </span>
);
const Flow = ({ steps }: { steps: string[] }) => (
  <div className="flex items-stretch gap-1">
    {steps.map((t, i) => (
      <div key={t} className="flex flex-1 items-center gap-1">
        <div className="flex-1 border-2 border-black bg-amber-400 px-1 py-1.5 text-center text-[11px] font-bold leading-tight text-black">{t}</div>
        {i < steps.length - 1 && <FiArrowRight className="h-4 w-4 shrink-0 text-cyan-300" aria-hidden />}
      </div>
    ))}
  </div>
);

/* One comic panel. Panel 1 is the headshot alone; Panels 2-4 carry the project story. */
function FaceCard({ f, n, image, name }: { f: Face; n: number; image?: string; name?: string }) {
  const frame = "h-full w-full select-none overflow-hidden border-[3px] border-amber-500 bg-[#1f160d] shadow-[6px_6px_0_#5a3412]";
  if (f.key === "photo")
    return (
      <div className={`${frame} relative`}>
        {image ? (
          <img src={image} alt={name ?? "Profile photo"} draggable={false} className="h-full w-full object-cover object-[center_30%]" />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-comic text-7xl text-cyan-300">MA</div>
        )}
        {/* Hint: more panels follow */}
        <motion.span aria-hidden animate={{ x: [0, 7, 0] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center border-[3px] border-black bg-amber-400 text-black shadow-[3px_3px_0_#22E6F2]">
          <FiArrowRight className="h-5 w-5" />
        </motion.span>
      </div>
    );
  return (
    <div className={`${frame} flex flex-col gap-3 p-4 text-left`}>
      {f.key === "assistant" && (
        <>
          <Block icon={FiCpu} label="THE PROJECT" title="AI Personal Stylist"
            text="An AI wardrobe assistant that turns the clothes you already own into ready-to-wear outfits, matched to the day's weather." />
          <Block icon={FiClock} label="WHO IT HELPS" title="No More 8 AM Panic"
            text="Made for busy students and young professionals with a full closet and no time to plan. It picks the outfit so you can just go." />
          <div className="mt-auto flex flex-wrap gap-1.5">
            <Chip icon={FiClock} text="Saves time" />
            <Chip icon={FiRepeat} text="Reuses your closet" />
            <Chip icon={FiCloudRain} text="Weather-smart" />
            <Chip icon={FiBriefcase} text="Office-ready" />
          </div>
        </>
      )}
      {f.key === "protocol" && (
        <>
          <Block icon={FiCheckCircle} label="ZERO-IRON PROTOCOL" title="Wrinkle-Free by Design"
            text="Outfits are built only from easy-care pieces, so you can grab and go with no steaming and no ironing." />
          <Block icon={FiNavigation} label="COMMUTE-PROOF" title="Built for the Bus"
            text="Every look is checked for crowded public transit: comfortable shoes, snag-free fabrics, and layers for rain and cold office AC." />
          <div className="mt-auto flex flex-wrap gap-1.5">
            <Chip icon={FiCheckCircle} text="No-iron" />
            <Chip icon={FiUsers} text="Crowd-safe" />
            <Chip icon={FiCloudRain} text="Rain-ready" />
            <Chip icon={FiWind} text="AC-ready" />
          </div>
        </>
      )}
      {f.key === "how" && (
        <>
          <Block icon={FiLayers} label="UNDER THE HOOD" title="How It Thinks"
            text="You share your closet, the local weather and your daily rules. The AI reasons over them and returns outfits you can scan in seconds." />
          <Flow steps={["Closet + weather + rules", "AI styling", "Outfit picks"]} />
          <div className="mt-auto flex flex-wrap gap-1.5">
            {TECH.map((t) => <span key={t} className="border border-cyan-400/40 bg-cyan-400/10 px-1.5 py-0.5 text-[11px] text-cyan-200">{t}</span>)}
          </div>
        </>
      )}
    </div>
  );
}

const SIZE = { "--w": "clamp(240px, 70vw, 320px)", width: "var(--w)", height: "calc(var(--w) * 1.3)" } as CSSProperties;
const START = -45; // "interstice" angle: the seam between Panel 1 and Panel 2 faces the viewer

/* Auto-rotating comic cube.
   - Opens on the interstice (edge-on, Panel 1 + Panel 2 visible), then settles on Panel 1 and keeps turning.
   - Pauses while hovered, focused, dragged, off-screen or in a background tab.
   - Still draggable/clickable. Under prefers-reduced-motion it opens flat on Panel 1 and never auto-rotates. */
export default function WardrobeShowcase({ image, name }: { image?: string; name?: string }) {
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ry = useMotionValue(reduce ? 0 : START);
  const rx = useMotionValue(-8);
  const sy = useSpring(ry, { stiffness: 70, damping: 16, mass: 0.8 });
  const sx = useSpring(rx, { stiffness: 120, damping: 20 });
  const [idx, setIdx] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const hold = useRef(false);     // hover / focus / drag
  const visible = useRef(true);   // on screen

  const snapTo = (deg: number) => { ry.set(deg); setIdx((((Math.round(-deg / 90) % 4) + 4) % 4)); };
  const step = (d: number) => snapTo(Math.round(ry.get() / 90) * 90 - d * 90);
  const jump = (i: number) => step(((i - idx + 5) % 4) - 1); // shortest direction
  // Auto tick: from the interstice, settle on Panel 1; afterwards advance Panel 1 -> 2 -> 3 -> 4.
  const tick = () => { const r = ry.get(); snapTo(r % 90 === 0 ? r - 90 : Math.round(r / 90) * 90); };

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; }, { threshold: 0.3 });
    io.observe(box.current!);
    if (reduce) return () => io.disconnect();
    const id = setInterval(() => { if (!hold.current && visible.current && !document.hidden) tick(); }, AUTO_MS);
    return () => { clearInterval(id); io.disconnect(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col items-center gap-7">
      <div
        ref={box} tabIndex={0} role="group" aria-label="Auto-rotating 3D project cube: AI Wardrobe Assistant"
        onKeyDown={(e) => { if (e.key === "ArrowRight") step(-1); if (e.key === "ArrowLeft") step(1); }}
        onFocus={() => (hold.current = true)} onBlur={() => (hold.current = false)}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") hold.current = true; }}
        onPointerLeave={() => { hold.current = false; rx.set(-8); }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          rx.set(-8 - ((e.clientY - r.top) / r.height - 0.5) * 14); // cursor parallax tilt
        }}
        className="relative [perspective:1400px] outline-none"
        style={{ ...SIZE, touchAction: "pan-y" }}
      >
        <motion.div
          onPanStart={() => (hold.current = true)}
          onPan={(_, i) => ry.set(ry.get() + i.delta.x * 0.45)}
          onPanEnd={(_, i) => { snapTo(Math.round((ry.get() + i.velocity.x * 0.12) / 90) * 90); hold.current = false; }}
          style={{ rotateY: sy, rotateX: sx, transformStyle: "preserve-3d", width: "100%", height: "100%" }}
          className="relative cursor-grab will-change-transform active:cursor-grabbing"
        >
          {FACES.map((f, k) => (
            <div key={f.key} className="absolute inset-0 [backface-visibility:hidden]"
              style={{ transform: `rotateY(${k * 90}deg) translateZ(calc(var(--w) / 2))` }}>
              <FaceCard f={f} n={k + 1} image={image} name={name} />
            </div>
          ))}
        </motion.div>
        <div aria-hidden className="absolute -bottom-8 left-[10%] h-5 w-[80%] rounded-[50%] bg-cyan-400/20 blur-xl" />
      </div>

      <div className="flex gap-2">
        {FACES.map((f, i) => (
          <button key={f.key} onClick={() => jump(i)} aria-label={f.label} aria-current={i === idx}
            className={`h-3 w-8 border-2 border-black transition-colors ${i === idx ? "bg-cyan-400" : "bg-amber-500/50 hover:bg-amber-400"}`} />
        ))}
      </div>
    </div>
  );
}
