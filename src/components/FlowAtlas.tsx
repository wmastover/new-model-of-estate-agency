"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  ATLAS_MAPS,
  ELEV,
  iso,
  type AtlasMapDef,
  type AtlasNode,
  type AtlasTone,
  type Pt,
} from "../data/atlas";

/* ------------------------------------------------------------------ */
/* Design space. The scene is drawn into a fixed viewBox and framed    */
/* by the camera transform; the wrapper stretches it responsively.      */
/* ------------------------------------------------------------------ */

const VIEW_W = 1280;
const VIEW_H = 720;
const FIT_PAD = 130;
const MIN_SCALE = 0.45;
const MAX_SCALE = 3.6;

/* ------------------------------------------------------------------ */
/* Themes: the three stylistic variants share geometry and behaviour.  */
/* ------------------------------------------------------------------ */

type FaceColors = {
  top: string;
  left: string;
  right: string;
  stroke: string;
  label: string;
};

interface Theme {
  id: string;
  label: string;
  kicker: string;
  background: string;
  panelBg: string;
  panelBorder: string;
  text: string;
  textDim: string;
  gridLine: string;
  gridMajor: string;
  accent: string;
  /** Gold used for the money lanes. */
  money: string;
  laneWidth: number;
  wireframe: boolean;
  nodeFilter?: string;
  scanline: boolean;
  payloadCore: string;
  payloadGlow: string;
  payloadGlowR: number;
  face: (tone: AtlasTone, hot: boolean) => FaceColors;
}

const THEMES: Theme[] = [
  {
    id: "blueprint",
    label: "Blueprint",
    kicker: "Drafting cyanotype",
    background:
      "radial-gradient(120% 120% at 50% 0%, #14488a 0%, #0e3057 45%, #0a2547 75%, #071c37 100%)",
    panelBg: "rgba(9,32,60,0.74)",
    panelBorder: "rgba(180,214,255,0.32)",
    text: "#eaf3ff",
    textDim: "rgba(200,224,255,0.62)",
    gridLine: "rgba(150,195,255,0.14)",
    gridMajor: "rgba(170,210,255,0.28)",
    accent: "#bfe0ff",
    money: "#ffe08a",
    laneWidth: 1.4,
    wireframe: true,
    nodeFilter: undefined,
    scanline: true,
    payloadCore: "#ffffff",
    payloadGlow: "rgba(190,225,255,0.5)",
    payloadGlowR: 9,
    face: (tone, hot) => {
      const stroke =
        tone === "revenue"
          ? "#ffe08a"
          : tone === "ai"
            ? "#bfe6ff"
            : tone === "human"
              ? "#ffffff"
              : tone === "hybrid"
                ? "#dcefff"
                : "rgba(205,230,255,0.85)";
      return {
        top: hot ? "rgba(190,222,255,0.20)" : "rgba(190,220,255,0.10)",
        left: "rgba(150,190,255,0.07)",
        right: "rgba(120,165,235,0.05)",
        stroke,
        label: "#eaf3ff",
      };
    },
  },
  {
    id: "ledger",
    label: "Ledger",
    kicker: "Warm paper drawing",
    background:
      "radial-gradient(120% 120% at 50% -10%, #ffffff 0%, #f4f3f0 55%, #eceae4 100%)",
    panelBg: "rgba(255,255,255,0.92)",
    panelBorder: "rgba(0,0,0,0.14)",
    text: "#17181a",
    textDim: "#5c5e62",
    gridLine: "rgba(0,0,0,0.06)",
    gridMajor: "rgba(0,0,0,0.14)",
    accent: "#2f6fe0",
    money: "#c6912f",
    laneWidth: 1.6,
    wireframe: false,
    nodeFilter: "drop-shadow(0 10px 14px rgba(20,24,32,0.16))",
    scanline: false,
    payloadCore: "#2f6fe0",
    payloadGlow: "rgba(47,111,224,0.32)",
    payloadGlowR: 8,
    face: (tone, hot) => {
      const base: Record<AtlasTone, FaceColors> = {
        human: { top: "#42454a", left: "#303338", right: "#25272b", stroke: "#17181a", label: "#f7f7f5" },
        ai: { top: "#6ea0ee", left: "#4f86e0", right: "#3d72cf", stroke: "#22539f", label: "#f7f9ff" },
        hybrid: { top: "#a9c0e8", left: "#8aa6db", right: "#7691c9", stroke: "#3a63a8", label: "#182740" },
        neutral: { top: "#ded9ce", left: "#cbc6ba", right: "#b9b4a7", stroke: "#8a8c90", label: "#33352f" },
        revenue: { top: "#eaba60", left: "#d8a340", right: "#c6912f", stroke: "#9a6a12", label: "#3a2708" },
      };
      const f = base[tone];
      if (!hot) return f;
      return { ...f, top: f.top, stroke: "#2f6fe0" };
    },
  },
  {
    id: "circuit",
    label: "Circuit",
    kicker: "Neon night board",
    background:
      "radial-gradient(120% 120% at 50% 0%, #14171d 0%, #0b0d11 55%, #060708 100%)",
    panelBg: "rgba(12,14,18,0.82)",
    panelBorder: "rgba(120,160,220,0.22)",
    text: "#e9eef7",
    textDim: "rgba(180,200,230,0.55)",
    gridLine: "rgba(90,130,200,0.10)",
    gridMajor: "rgba(90,140,220,0.22)",
    accent: "#4d8df0",
    money: "#ffd166",
    laneWidth: 1.5,
    wireframe: false,
    nodeFilter: "drop-shadow(0 0 7px rgba(77,141,240,0.30))",
    scanline: false,
    payloadCore: "#cfe6ff",
    payloadGlow: "rgba(77,141,240,0.6)",
    payloadGlowR: 10,
    face: (tone, hot) => {
      const stroke =
        tone === "revenue"
          ? "#ffd166"
          : tone === "ai"
            ? "#4d8df0"
            : tone === "human"
              ? "#f2f2f0"
              : tone === "hybrid"
                ? "#7db4ff"
                : "#37527a";
      return {
        top: hot ? "#1d222b" : "#171a20",
        left: "#101318",
        right: "#0b0e12",
        stroke,
        label: "#dfe8f5",
      };
    },
  },
];

/* ------------------------------------------------------------------ */
/* Geometry: projected towers, lanes and scene bounds, per map.        */
/* ------------------------------------------------------------------ */

interface NodeGeo {
  node: AtlasNode;
  top: string;
  left: string;
  right: string;
  ground: Pt;
  crown: Pt;
  depth: number;
}

interface EdgeGeo {
  id: string;
  from: string;
  to: string;
  kind: string;
  pts: Pt[];
  path: string;
  length: number;
}

function ptsToStr(pts: Pt[]): string {
  return pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
}

function polyLength(pts: Pt[]): number {
  let total = 0;
  for (let i = 1; i < pts.length; i++) {
    total += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  }
  return total;
}

function pointAt(pts: Pt[], t: number): Pt {
  if (pts.length < 2) return pts[0];
  const total = polyLength(pts);
  let target = Math.max(0, Math.min(1, t)) * total;
  for (let i = 1; i < pts.length; i++) {
    const seg = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
    if (target <= seg || i === pts.length - 1) {
      const f = seg === 0 ? 0 : target / seg;
      return {
        x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * f,
        y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * f,
      };
    }
    target -= seg;
  }
  return pts[pts.length - 1];
}

interface GridRange {
  gxMin: number;
  gxMax: number;
  gyMin: number;
  gyMax: number;
}

function buildGeometry(map: AtlasMapDef) {
  const nodeGeo: NodeGeo[] = map.nodes.map((node) => {
    const { gx, gy, fw, fh } = node;
    const H = node.height * ELEV;
    const A = iso(gx, gy, H);
    const B = iso(gx + fw, gy, H);
    const C = iso(gx + fw, gy + fh, H);
    const D = iso(gx, gy + fh, H);
    const Bb = iso(gx + fw, gy, 0);
    const Cb = iso(gx + fw, gy + fh, 0);
    const Db = iso(gx, gy + fh, 0);
    return {
      node,
      top: ptsToStr([A, B, C, D]),
      right: ptsToStr([B, C, Cb, Bb]),
      left: ptsToStr([D, C, Cb, Db]),
      ground: iso(gx + fw / 2, gy + fh / 2, 0),
      crown: iso(gx + fw / 2, gy + fh / 2, H),
      depth: gx + gy,
    };
  });

  const centers = new Map<string, Pt>();
  nodeGeo.forEach((g) => centers.set(g.node.id, g.ground));

  const edgeGeo: EdgeGeo[] = map.edges.map((e) => {
    const a = centers.get(e.from)!;
    const b = centers.get(e.to)!;
    let pts: Pt[];
    if (e.bend) {
      // A quadratic arc bowing sideways from the midpoint, so parallel or
      // return lanes read separately from the straight ones.
      const cx = (a.x + b.x) / 2 + e.bend;
      const cy = (a.y + b.y) / 2;
      pts = [];
      const N = 26;
      for (let i = 0; i <= N; i++) {
        const t = i / N;
        const mt = 1 - t;
        pts.push({
          x: mt * mt * a.x + 2 * mt * t * cx + t * t * b.x,
          y: mt * mt * a.y + 2 * mt * t * cy + t * t * b.y,
        });
      }
    } else {
      pts = [a, b];
    }
    const path = `M ${pts.map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" L ")}`;
    return { id: e.id, from: e.from, to: e.to, kind: e.kind, pts, path, length: polyLength(pts) };
  });

  // Scene bounds from every tower face and lane point.
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  const consider = (p: Pt) => {
    minX = Math.min(minX, p.x);
    minY = Math.min(minY, p.y);
    maxX = Math.max(maxX, p.x);
    maxY = Math.max(maxY, p.y);
  };
  map.nodes.forEach((n) => {
    const H = n.height * ELEV;
    consider(iso(n.gx, n.gy, H));
    consider(iso(n.gx + n.fw, n.gy, H));
    consider(iso(n.gx + n.fw, n.gy + n.fh, H));
    consider(iso(n.gx, n.gy + n.fh, H));
    consider(iso(n.gx + n.fw, n.gy + n.fh, 0));
    consider(iso(n.gx, n.gy + n.fh, 0));
    consider(iso(n.gx + n.fw, n.gy, 0));
  });
  edgeGeo.forEach((e) => e.pts.forEach(consider));

  // Ground grid extent, a few tiles beyond the towers.
  const grid: GridRange = map.nodes.reduce<GridRange>(
    (r, n) => ({
      gxMin: Math.min(r.gxMin, Math.floor(n.gx) - 3),
      gxMax: Math.max(r.gxMax, Math.ceil(n.gx + n.fw) + 3),
      gyMin: Math.min(r.gyMin, Math.floor(n.gy) - 3),
      gyMax: Math.max(r.gyMax, Math.ceil(n.gy + n.fh) + 3),
    }),
    { gxMin: Infinity, gxMax: -Infinity, gyMin: Infinity, gyMax: -Infinity },
  );

  const bounds = { minX, minY, maxX, maxY };
  return { nodeGeo, edgeGeo, bounds, grid };
}

interface Payload {
  key: string;
  edgeId: string;
  phase: number;
  period: number;
}

function buildPayloads(edges: EdgeGeo[]): Payload[] {
  const out: Payload[] = [];
  edges.forEach((e) => {
    const count = e.kind === "support" ? 1 : 2;
    const speed = 74; // px per second
    const period = Math.max(1.4, e.length / speed);
    for (let i = 0; i < count; i++) {
      out.push({ key: `${e.id}-${i}`, edgeId: e.id, phase: i / count, period });
    }
  });
  return out;
}

/* ------------------------------------------------------------------ */
/* Component.                                                          */
/* ------------------------------------------------------------------ */

interface View {
  x: number;
  y: number;
  scale: number;
}

export default function FlowAtlas() {
  const [mapId, setMapId] = useState<string>(ATLAS_MAPS[0].id);
  const map = ATLAS_MAPS.find((m) => m.id === mapId)!;

  const { nodeGeo, edgeGeo, bounds, grid } = useMemo(
    () => buildGeometry(map),
    [map],
  );
  const edgeMap = useMemo(() => {
    const m = new Map<string, EdgeGeo>();
    edgeGeo.forEach((e) => m.set(e.id, e));
    return m;
  }, [edgeGeo]);
  const payloads = useMemo(() => buildPayloads(edgeGeo), [edgeGeo]);
  const sortedNodes = useMemo(
    () => [...nodeGeo].sort((a, b) => a.depth - b.depth),
    [nodeGeo],
  );

  const initialView = useMemo<View>(() => {
    const bw = bounds.maxX - bounds.minX;
    const bh = bounds.maxY - bounds.minY;
    const scale = Math.min(
      (VIEW_W - FIT_PAD * 2) / bw,
      (VIEW_H - FIT_PAD * 2) / bh,
    );
    const x = FIT_PAD - bounds.minX * scale + ((VIEW_W - FIT_PAD * 2) - bw * scale) / 2;
    const y = FIT_PAD - bounds.minY * scale + ((VIEW_H - FIT_PAD * 2) - bh * scale) / 2;
    return { x, y, scale };
  }, [bounds]);

  const [themeId, setThemeId] = useState<string>("circuit");
  const theme = THEMES.find((t) => t.id === themeId)!;
  const [flowId, setFlowId] = useState<string>("all");
  const flow = map.flows.find((f) => f.id === flowId) ?? map.flows[0];
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [grabbing, setGrabbing] = useState(false);

  const switchMap = useCallback((id: string) => {
    setMapId(id);
    setFlowId("all");
    setSelected(null);
    setHovered(null);
  }, []);

  const activeEdges = useMemo(() => {
    if (flow.edges.length === 0) return null; // null => all active
    return new Set(flow.edges);
  }, [flow]);

  const activeNodes = useMemo(() => {
    if (!activeEdges) return null;
    const s = new Set<string>();
    edgeGeo.forEach((e) => {
      if (activeEdges.has(e.id)) {
        s.add(e.from);
        s.add(e.to);
      }
    });
    return s;
  }, [activeEdges, edgeGeo]);

  // Refs read by the animation loop so it always sees the latest values.
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cameraRef = useRef<SVGGElement>(null);
  const viewRef = useRef<View>(initialView);
  const payloadRefs = useRef<Map<string, SVGGElement>>(new Map());
  const activeEdgesRef = useRef<Set<string> | null>(activeEdges);
  const pausedRef = useRef(paused);
  const reducedRef = useRef(false);

  useEffect(() => {
    activeEdgesRef.current = activeEdges;
  }, [activeEdges]);
  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const applyCamera = useCallback(() => {
    const v = viewRef.current;
    cameraRef.current?.setAttribute(
      "transform",
      `translate(${v.x.toFixed(2)} ${v.y.toFixed(2)}) scale(${v.scale.toFixed(4)})`,
    );
  }, []);

  const resetView = useCallback(() => {
    viewRef.current = { ...initialView };
    applyCamera();
  }, [initialView, applyCamera]);

  // Reframe the camera whenever the map (and so its bounds) changes.
  useEffect(() => {
    resetView();
  }, [resetView]);

  // Position payloads once, statically, for reduced-motion users.
  const placePayloadsStatic = useCallback(() => {
    const active = activeEdgesRef.current;
    payloads.forEach((p) => {
      const el = payloadRefs.current.get(p.key);
      if (!el) return;
      const on = !active || active.has(p.edgeId);
      const edge = edgeMap.get(p.edgeId);
      if (!edge) return;
      const pt = pointAt(edge.pts, p.phase === 0 ? 0.5 : p.phase);
      el.setAttribute("transform", `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`);
      el.style.opacity = on ? "1" : "0";
    });
  }, [payloads, edgeMap]);

  useEffect(() => {
    applyCamera();
    reducedRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedRef.current) {
      placePayloadsStatic();
      return;
    }

    let raf = 0;
    let last = performance.now();
    let elapsed = 0;
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      if (!pausedRef.current) elapsed += dt;
      const t = elapsed / 1000;
      const active = activeEdgesRef.current;
      payloads.forEach((p) => {
        const el = payloadRefs.current.get(p.key);
        if (!el) return;
        const on = !active || active.has(p.edgeId);
        if (!on) {
          el.style.opacity = "0";
          return;
        }
        const edge = edgeMap.get(p.edgeId);
        if (!edge) return;
        const local = ((p.phase + t / p.period) % 1 + 1) % 1;
        const pt = pointAt(edge.pts, local);
        el.setAttribute(
          "transform",
          `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)})`,
        );
        // Fade in and out near the tower endpoints.
        const edgeFade = Math.min(1, local / 0.08, (1 - local) / 0.08);
        el.style.opacity = (0.35 + 0.65 * Math.max(0, edgeFade)).toFixed(3);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [payloads, edgeMap, applyCamera, placePayloadsStatic]);

  // Re-place static payloads when the flow changes for reduced-motion users.
  useEffect(() => {
    if (reducedRef.current) placePayloadsStatic();
  }, [activeEdges, placePayloadsStatic]);

  /* ---- Pan and zoom ------------------------------------------------ */

  const dragRef = useRef<{
    x: number;
    y: number;
    id: number;
    active: boolean;
  } | null>(null);
  const movedRef = useRef(false);

  const svgScale = useCallback(() => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return { sx: 1, sy: 1, rect: null as DOMRect | null };
    return { sx: VIEW_W / rect.width, sy: VIEW_H / rect.height, rect };
  }, []);

  // Record the press, but do not capture the pointer yet: capturing on down
  // would swallow clicks on the HUD buttons and the towers. Panning only
  // begins (and captures) once the pointer actually moves past a threshold.
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragRef.current = { x: e.clientX, y: e.clientY, id: e.pointerId, active: false };
    movedRef.current = false;
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!drag) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      if (!drag.active) {
        if (Math.abs(dx) + Math.abs(dy) <= 4) return;
        drag.active = true;
        movedRef.current = true;
        setGrabbing(true);
        try {
          (e.currentTarget as HTMLElement).setPointerCapture(drag.id);
        } catch {
          /* capture unsupported */
        }
      }
      const { sx, sy } = svgScale();
      const v = viewRef.current;
      v.x += dx * sx;
      v.y += dy * sy;
      drag.x = e.clientX;
      drag.y = e.clientY;
      applyCamera();
    },
    [svgScale, applyCamera],
  );

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    const drag = dragRef.current;
    dragRef.current = null;
    setGrabbing(false);
    if (drag?.active) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(drag.id);
      } catch {
        /* pointer already released */
      }
    }
  }, []);

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      const { sx, sy, rect } = svgScale();
      if (!rect) return;
      const px = (e.clientX - rect.left) * sx;
      const py = (e.clientY - rect.top) * sy;
      const v = viewRef.current;
      const factor = e.deltaY < 0 ? 1.12 : 1 / 1.12;
      const next = Math.max(MIN_SCALE, Math.min(MAX_SCALE, v.scale * factor));
      v.x = px - (px - v.x) * (next / v.scale);
      v.y = py - (py - v.y) * (next / v.scale);
      v.scale = next;
      applyCamera();
    },
    [svgScale, applyCamera],
  );

  const onNodeClick = useCallback((id: string) => {
    if (movedRef.current) return;
    setSelected((cur) => (cur === id ? null : id));
  }, []);

  /* ---- Derived styling helpers ------------------------------------ */

  const nodeActive = (id: string) => !activeNodes || activeNodes.has(id);
  const edgeActive = (id: string) => !activeEdges || activeEdges.has(id);

  const selectedNode = selected
    ? map.nodes.find((n) => n.id === selected) ?? null
    : null;

  const wrapperStyle: CSSProperties = {
    position: "relative",
    width: "100%",
    height: "clamp(520px, 74vh, 780px)",
    background: theme.background,
    border: `1px solid ${theme.panelBorder}`,
    borderRadius: 4,
    overflow: "hidden",
    touchAction: "none",
    cursor: grabbing ? "grabbing" : "grab",
    userSelect: "none",
    WebkitUserSelect: "none",
    transition: "background .5s ease, border-color .5s ease",
  };

  return (
    <div>
      <div
        ref={wrapperRef}
        style={wrapperStyle}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onWheel={onWheel}
        role="application"
        aria-label={`${map.label} map, ${theme.label} variant`}
      >
        <svg
          viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
          preserveAspectRatio="xMidYMid meet"
          style={{ display: "block", width: "100%", height: "100%" }}
        >
          <g ref={cameraRef}>
            <GroundGrid theme={theme} grid={grid} />

            {/* Lanes on the floor, beneath the towers. */}
            <g>
              {edgeGeo.map((e) => {
                const on = edgeActive(e.id);
                const isMoney = e.kind === "money";
                return (
                  <path
                    key={e.id}
                    d={e.path}
                    fill="none"
                    stroke={isMoney ? theme.money : theme.gridMajor}
                    strokeWidth={theme.laneWidth * (isMoney ? 1.5 : 1)}
                    strokeDasharray={
                      e.kind === "support"
                        ? "2 7"
                        : e.kind === "cadence"
                          ? "9 8"
                          : undefined
                    }
                    strokeLinecap="round"
                    opacity={on ? (isMoney ? 0.9 : 0.65) : 0.09}
                    style={{ transition: "opacity .4s ease" }}
                  />
                );
              })}
            </g>

            {/* Payload markers travelling the active lanes. */}
            <g>
              {payloads.map((p) => (
                <g
                  key={p.key}
                  ref={(el) => {
                    if (el) payloadRefs.current.set(p.key, el);
                    else payloadRefs.current.delete(p.key);
                  }}
                  style={{ opacity: 0 }}
                >
                  <circle r={theme.payloadGlowR} fill={theme.payloadGlow} />
                  <circle r={3.4} fill={theme.payloadCore} />
                </g>
              ))}
            </g>

            {/* Towers, painted back to front. */}
            {sortedNodes.map((g) => {
              const on = nodeActive(g.node.id);
              const hot = hovered === g.node.id || selected === g.node.id;
              const fc = theme.face(g.node.tone, hot);
              const lift = hot ? -8 : 0;
              return (
                <g
                  key={g.node.id}
                  className="atlas-rise"
                  style={{
                    cursor: "pointer",
                    filter: theme.nodeFilter,
                    animationDelay: `${g.depth * 45}ms`,
                  }}
                  onPointerEnter={() => !dragRef.current && setHovered(g.node.id)}
                  onPointerLeave={() => setHovered((h) => (h === g.node.id ? null : h))}
                  onClick={() => onNodeClick(g.node.id)}
                  role="button"
                  aria-label={g.node.label.join(" ")}
                >
                {/* Inner group: the entry animation on the parent fills both
                    directions, so its final keyframe would override inline
                    opacity/transform. Dimming and the hover lift live here. */}
                <g
                  style={{
                    opacity: on ? 1 : 0.16,
                    transform: `translateY(${lift}px)`,
                    transition: "opacity .4s ease, transform .25s ease",
                  }}
                >
                  <polygon
                    points={g.left}
                    fill={fc.left}
                    stroke={fc.stroke}
                    strokeWidth={theme.wireframe ? 1 : 1.1}
                    strokeLinejoin="round"
                  />
                  <polygon
                    points={g.right}
                    fill={fc.right}
                    stroke={fc.stroke}
                    strokeWidth={theme.wireframe ? 1 : 1.1}
                    strokeLinejoin="round"
                  />
                  <polygon
                    points={g.top}
                    fill={fc.top}
                    stroke={fc.stroke}
                    strokeWidth={theme.wireframe ? 1 : 1.3}
                    strokeLinejoin="round"
                  />
                  {/* Beacon on the crown of hot / revenue towers. */}
                  {(hot || g.node.tone === "revenue") && (
                    <circle
                      cx={g.crown.x}
                      cy={g.crown.y}
                      r={hot ? 4.5 : 3}
                      fill={g.node.tone === "revenue" ? theme.money : theme.accent}
                      className="atlas-beacon"
                    />
                  )}
                  {/* Index + label on the crown. */}
                  {g.node.index && (
                    <text
                      x={g.crown.x}
                      y={g.crown.y - 10}
                      textAnchor="middle"
                      style={{
                        fontFamily: "var(--font-geist-mono), monospace",
                        fontSize: 11,
                        fontWeight: 600,
                        letterSpacing: "0.08em",
                        fill: fc.label,
                        pointerEvents: "none",
                      }}
                    >
                      {g.node.index}
                    </text>
                  )}
                  {g.node.label.map((line, li) => (
                    <text
                      key={li}
                      x={g.crown.x}
                      y={g.crown.y + 5 + li * 12}
                      textAnchor="middle"
                      style={{
                        fontFamily: "var(--font-geist-mono), monospace",
                        fontSize: 9.5,
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        fill: fc.label,
                        pointerEvents: "none",
                      }}
                    >
                      {line}
                    </text>
                  ))}
                </g>
                </g>
              );
            })}

            {/* Floating callout for the hovered tower. */}
            {hovered &&
              (() => {
                const g = nodeGeo.find((n) => n.node.id === hovered);
                if (!g) return null;
                const label = g.node.label.join(" ");
                const w = Math.max(148, label.length * 7.4 + 40);
                const cx = g.crown.x;
                const cy = g.crown.y - 34;
                return (
                  <g pointerEvents="none" style={{ opacity: 0.98 }}>
                    <line
                      x1={cx}
                      y1={g.crown.y - 6}
                      x2={cx}
                      y2={cy + 14}
                      stroke={theme.accent}
                      strokeWidth={1}
                    />
                    <circle cx={cx} cy={g.crown.y - 6} r={2.2} fill={theme.accent} />
                    <rect
                      x={cx - w / 2}
                      y={cy - 14}
                      width={w}
                      height={30}
                      rx={3}
                      fill={theme.panelBg}
                      stroke={theme.panelBorder}
                    />
                    <text
                      x={cx}
                      y={cy - 1}
                      textAnchor="middle"
                      style={{
                        fontFamily: "var(--font-geist-mono), monospace",
                        fontSize: 10.5,
                        fontWeight: 600,
                        letterSpacing: "0.02em",
                        fill: theme.text,
                      }}
                    >
                      {label}
                    </text>
                    <text
                      x={cx}
                      y={cy + 11}
                      textAnchor="middle"
                      style={{
                        fontFamily: "var(--font-geist-mono), monospace",
                        fontSize: 8.5,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        fill: theme.textDim,
                      }}
                    >
                      {g.node.meta}
                    </text>
                  </g>
                );
              })()}
          </g>

          {theme.scanline && (
            <rect
              x="0"
              y="-40"
              width={VIEW_W}
              height="40"
              fill="url(#atlas-scan)"
              className="atlas-scan"
              pointerEvents="none"
            />
          )}
          <defs>
            <linearGradient id="atlas-scan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(190,225,255,0)" />
              <stop offset="50%" stopColor="rgba(190,225,255,0.10)" />
              <stop offset="100%" stopColor="rgba(190,225,255,0)" />
            </linearGradient>
          </defs>
        </svg>

        {/* ---- HUD -------------------------------------------------- */}
        <TopBar
          theme={theme}
          map={map}
          mapId={mapId}
          onMap={switchMap}
          flowId={flow.id}
          onFlow={(id) => {
            setFlowId(id);
            setSelected(null);
          }}
          paused={paused}
          onPause={() => setPaused((p) => !p)}
          onReset={resetView}
        />

        <BottomBar
          theme={theme}
          map={map}
          flowNote={flow.note}
          themeId={themeId}
          onTheme={setThemeId}
        />

        {selectedNode && (
          <InfoPanel
            theme={theme}
            map={map}
            node={selectedNode}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Ground grid.                                                        */
/* ------------------------------------------------------------------ */

function GroundGrid({ theme, grid }: { theme: Theme; grid: GridRange }) {
  const lines = useMemo(() => {
    const out: { d: string; major: boolean }[] = [];
    for (let g = grid.gxMin; g <= grid.gxMax; g++) {
      const a = iso(g, grid.gyMin, 0);
      const b = iso(g, grid.gyMax, 0);
      out.push({ d: `M ${a.x} ${a.y} L ${b.x} ${b.y}`, major: g % 2 === 0 });
    }
    for (let g = grid.gyMin; g <= grid.gyMax; g++) {
      const a = iso(grid.gxMin, g, 0);
      const b = iso(grid.gxMax, g, 0);
      out.push({ d: `M ${a.x} ${a.y} L ${b.x} ${b.y}`, major: g % 2 === 0 });
    }
    return out;
  }, [grid]);

  return (
    <g pointerEvents="none">
      {lines.map((l, i) => (
        <path
          key={i}
          d={l.d}
          stroke={l.major ? theme.gridMajor : theme.gridLine}
          strokeWidth={l.major ? 0.8 : 0.6}
          fill="none"
          style={{ transition: "stroke .5s ease" }}
        />
      ))}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* HUD pieces.                                                         */
/* ------------------------------------------------------------------ */

function panelChrome(theme: Theme): CSSProperties {
  return {
    background: theme.panelBg,
    border: `1px solid ${theme.panelBorder}`,
    color: theme.text,
    backdropFilter: "blur(8px)",
    WebkitBackdropFilter: "blur(8px)",
    borderRadius: 3,
  };
}

function TopBar({
  theme,
  map,
  mapId,
  onMap,
  flowId,
  onFlow,
  paused,
  onPause,
  onReset,
}: {
  theme: Theme;
  map: AtlasMapDef;
  mapId: string;
  onMap: (id: string) => void;
  flowId: string;
  onFlow: (id: string) => void;
  paused: boolean;
  onPause: () => void;
  onReset: () => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: 14,
        left: 14,
        right: 14,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
        flexWrap: "wrap",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          ...panelChrome(theme),
          padding: "10px 12px",
          pointerEvents: "auto",
          maxWidth: 420,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            className="mono"
            style={{
              fontSize: 9,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: theme.textDim,
              marginRight: 2,
            }}
          >
            Map
          </span>
          {ATLAS_MAPS.map((m) => (
            <HudButton
              key={m.id}
              theme={theme}
              onClick={() => onMap(m.id)}
              active={mapId === m.id}
            >
              {m.label}
            </HudButton>
          ))}
        </div>
        <div
          className="mono"
          style={{
            fontSize: 11,
            color: theme.textDim,
            marginTop: 8,
          }}
        >
          {map.note}
        </div>
      </div>

      <div
        style={{
          ...panelChrome(theme),
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 10px",
          pointerEvents: "auto",
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: 9,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: theme.textDim,
          }}
        >
          Flow
        </span>
        <select
          value={flowId}
          onChange={(e) => onFlow(e.target.value)}
          className="mono"
          style={{
            background: "transparent",
            color: theme.text,
            border: `1px solid ${theme.panelBorder}`,
            borderRadius: 2,
            padding: "5px 8px",
            fontSize: 12,
            cursor: "pointer",
            outline: "none",
          }}
        >
          {map.flows.map((f) => (
            <option key={f.id} value={f.id} style={{ color: "#111" }}>
              {f.label}
            </option>
          ))}
        </select>
        <HudButton theme={theme} onClick={onPause} active={paused}>
          {paused ? "Play" : "Pause"}
        </HudButton>
        <HudButton theme={theme} onClick={onReset}>
          Recentre
        </HudButton>
      </div>
    </div>
  );
}

function HudButton({
  theme,
  onClick,
  active,
  children,
}: {
  theme: Theme;
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="mono"
      style={{
        background: active ? theme.accent : "transparent",
        color: active ? "#0a0b0c" : theme.text,
        border: `1px solid ${active ? theme.accent : theme.panelBorder}`,
        borderRadius: 2,
        padding: "5px 10px",
        fontSize: 11,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "background .2s ease, color .2s ease",
      }}
    >
      {children}
    </button>
  );
}

function BottomBar({
  theme,
  map,
  flowNote,
  themeId,
  onTheme,
}: {
  theme: Theme;
  map: AtlasMapDef;
  flowNote: string;
  themeId: string;
  onTheme: (id: string) => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 14,
        right: 14,
        bottom: 14,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: 12,
        flexWrap: "wrap",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          ...panelChrome(theme),
          padding: "10px 14px",
          pointerEvents: "auto",
          maxWidth: 340,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 8,
          }}
        >
          {map.legend.map((l) => (
            <span
              key={l.tone}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 10,
                color: theme.textDim,
              }}
              className="mono"
            >
              <span
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: 1,
                  background: swatch(theme, l.tone),
                  border:
                    l.tone === "human" && theme.id === "blueprint"
                      ? `1px solid ${theme.accent}`
                      : "none",
                }}
              />
              {l.label}
            </span>
          ))}
        </div>
        <span style={{ fontSize: 11, color: theme.textDim }} className="mono">
          Drag to pan · scroll to zoom · click a module
        </span>
        <div style={{ fontSize: 12, color: theme.text, marginTop: 4 }}>
          {flowNote}
        </div>
      </div>

      <div
        style={{
          ...panelChrome(theme),
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "8px 10px",
          pointerEvents: "auto",
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: 9,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: theme.textDim,
            marginRight: 2,
          }}
        >
          Variant
        </span>
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => onTheme(t.id)}
            className="mono"
            style={{
              background: themeId === t.id ? theme.accent : "transparent",
              color: themeId === t.id ? "#0a0b0c" : theme.text,
              border: `1px solid ${themeId === t.id ? theme.accent : theme.panelBorder}`,
              borderRadius: 2,
              padding: "5px 11px",
              fontSize: 11,
              letterSpacing: "0.04em",
              cursor: "pointer",
              transition: "background .2s ease, color .2s ease",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function swatch(theme: Theme, tone: AtlasTone): string {
  const f = theme.face(tone, false);
  return theme.wireframe ? f.stroke : f.top;
}

function InfoPanel({
  theme,
  map,
  node,
  onClose,
}: {
  theme: Theme;
  map: AtlasMapDef;
  node: AtlasNode;
  onClose: () => void;
}) {
  const toneLabel = map.toneLabels[node.tone] ?? node.tone;
  return (
    <div
      style={{
        ...panelChrome(theme),
        position: "absolute",
        left: 14,
        bottom: 96,
        width: "min(360px, calc(100% - 28px))",
        padding: "16px 18px 18px",
        pointerEvents: "auto",
        animation: "room-enter .35s cubic-bezier(.4,0,.2,1) both",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        <span
          className="mono"
          style={{
            fontSize: 9.5,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: theme.accent,
          }}
        >
          {node.meta}
        </span>
        <button
          onClick={onClose}
          aria-label="Close"
          className="mono"
          style={{
            background: "transparent",
            border: `1px solid ${theme.panelBorder}`,
            color: theme.text,
            borderRadius: 2,
            width: 22,
            height: 22,
            lineHeight: "18px",
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>
      <h3
        className="mono"
        style={{
          margin: "0 0 8px",
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: "-0.02em",
          color: theme.text,
        }}
      >
        {node.label.join(" ")}
      </h3>
      <span
        className="mono"
        style={{
          display: "inline-block",
          fontSize: 10,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: theme.text,
          background:
            node.tone === "revenue"
              ? "rgba(255,209,102,0.2)"
              : "rgba(127,168,240,0.16)",
          border: `1px solid ${theme.panelBorder}`,
          padding: "3px 8px",
          borderRadius: 2,
          marginBottom: 12,
        }}
      >
        {toneLabel}
      </span>
      <p
        style={{
          margin: "0 0 14px",
          fontSize: 13.5,
          lineHeight: 1.5,
          color: theme.textDim,
        }}
      >
        {node.blurb}
      </p>
      {node.slug && (
        <a
          href={`/#${node.slug}`}
          className="mono"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 12,
            letterSpacing: "0.04em",
            color: theme.accent,
            textDecoration: "none",
            borderBottom: `1px solid ${theme.accent}`,
            paddingBottom: 2,
          }}
        >
          Read the full section →
        </a>
      )}
    </div>
  );
}
