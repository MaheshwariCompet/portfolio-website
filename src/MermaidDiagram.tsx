import { useEffect, useId, useRef, useState } from "react";
import { useInView } from "framer-motion";

/* Renders Mermaid source as SVG in the comic palette.
   Mermaid (a large library) is imported dynamically and only once the diagram scrolls near the viewport,
   so it never blocks first paint. Requires:  npm install mermaid */
const THEME = {
  background: "#17120d", fontFamily: "Barlow, system-ui, sans-serif", fontSize: "14px",
  primaryColor: "#1f160d", primaryTextColor: "#f1e6d6", primaryBorderColor: "#d9822b",
  secondaryColor: "#0d2428", secondaryBorderColor: "#22E6F2", tertiaryColor: "#17120d", tertiaryBorderColor: "#5a3412",
  lineColor: "#22E6F2", textColor: "#f1e6d6", clusterBkg: "#17120d", clusterBorder: "#d9822b", edgeLabelBackground: "#17120d",
  actorBkg: "#d9822b", actorBorder: "#22E6F2", actorTextColor: "#0a0f12", actorLineColor: "#b7a68f",
  signalColor: "#22E6F2", signalTextColor: "#f1e6d6", labelBoxBkgColor: "#1f160d", labelBoxBorderColor: "#d9822b", labelTextColor: "#f1e6d6",
  noteBkgColor: "#f2c27a", noteTextColor: "#0a0f12", noteBorderColor: "#0a0f12", sequenceNumberColor: "#0a0f12",
  attributeBackgroundColorOdd: "#1f160d", attributeBackgroundColorEven: "#17120d",
};

export default function MermaidDiagram({ code, label }: { code: string; label: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const near = useInView(wrap, { once: true, margin: "300px" });
  const uid = "mmd" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const run = useRef(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!near) return;
    let cancelled = false;
    setFailed(false);
    import("mermaid")
      .then(async ({ default: mermaid }) => {
        mermaid.initialize({ startOnLoad: false, securityLevel: "strict", theme: "base", themeVariables: THEME });
        const { svg } = await mermaid.render(`${uid}-${++run.current}`, code);
        if (!cancelled && host.current) host.current.innerHTML = svg;
      })
      .catch(() => { if (!cancelled) setFailed(true); });
    return () => { cancelled = true; };
  }, [near, code, uid]);

  return (
    <div ref={wrap} className="overflow-x-auto">
      {failed ? (
        <pre className="whitespace-pre-wrap p-4 text-xs text-cyan-200">{code}</pre>
      ) : (
        <div ref={host} role="img" aria-label={label} className="mx-auto min-h-[200px] min-w-[620px] [&_svg]:mx-auto [&_svg]:h-auto [&_svg]:max-w-full" />
      )}
    </div>
  );
}
