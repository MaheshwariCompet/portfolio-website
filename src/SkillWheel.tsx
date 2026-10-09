import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { IconType } from "react-icons";

type Group = { group: string; icon: IconType; tags: string[] };

/* "Weapon wheel" skill selector: hover, tap, or focus a category on the ring and its tools
   spin into the centre hub. Keyboard: Tab to a category. */
export default function SkillWheel({ groups }: { groups: Group[] }) {
  const [a, setA] = useState(0);
  const g = groups[a];
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative aspect-square w-[min(92vw,540px)]" role="tablist" aria-label="Tool categories">
        <div aria-hidden className="absolute inset-[10%] rounded-full border-[3px] border-dashed border-amber-500/40" />
        {groups.map((x, i) => {
          const ang = ((-90 + (i * 360) / groups.length) * Math.PI) / 180;
          const on = i === a;
          return (
            <button key={x.group} role="tab" aria-selected={on} aria-label={x.group}
              onClick={() => setA(i)} onFocus={() => setA(i)}
              onPointerEnter={(e) => { if (e.pointerType === "mouse") setA(i); }}
              style={{ left: `${50 + 40 * Math.cos(ang)}%`, top: `${50 + 40 * Math.sin(ang)}%` }}
              className={`absolute flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center border-[3px] border-black shadow-[4px_4px_0_#d9822b] transition-all duration-200 sm:h-16 sm:w-16 ${on ? "scale-110 bg-cyan-400 text-black" : "bg-amber-400 text-black hover:bg-amber-300"}`}>
              <x.icon className="h-6 w-6" />
              <span className="pointer-events-none absolute top-full mt-1.5 hidden whitespace-nowrap font-comic text-sm tracking-wider text-amber-300 sm:block">{x.group}</span>
            </button>
          );
        })}
        <div className="absolute left-1/2 top-1/2 flex aspect-square w-[56%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[3px] border-cyan-400 bg-[#0d2428] p-[7%] text-center shadow-[6px_6px_0_#5a3412]">
          <AnimatePresence mode="wait">
            <motion.div key={g.group} initial={{ opacity: 0, rotate: -25, scale: 0.8 }} animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 25, scale: 0.8 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
              <div className="font-comic text-2xl tracking-wider text-cyan-300 [text-shadow:2px_2px_0_#5a3412] sm:text-3xl">{g.group}</div>
              <div className="mt-2 flex flex-wrap justify-center gap-1">
                {g.tags.map((t) => <span key={t} className="border border-cyan-400/40 bg-cyan-400/10 px-1.5 py-0.5 text-[10px] text-cyan-100 sm:text-xs">{t}</span>)}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      <p className="text-xs text-zinc-500">Pick a category on the wheel.</p>
    </div>
  );
}
