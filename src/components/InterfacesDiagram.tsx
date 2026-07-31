/**
 * Plan 03 — The interfaces. A wiring diagram: the agency as an AI
 * switchboard, wired to every external provider. Blue lines carry money —
 * relationships the agency monetises through referrals. Content in drafting.
 */

import {
  BLUE,
  HAIR,
  HAIR_SOFT,
  INK,
  MarginNote,
  MONO,
} from "./plan-style";

interface Node {
  lines: string[];
  x: number;
  y: number;
  /** Referral revenue flows down this wire. */
  monetised?: boolean;
}

const NODE_W = 180;
const NODE_H = 78;

const NODES: Node[] = [
  { lines: ["Portals"], x: 20, y: 40 },
  { lines: ["Photographer"], x: 270, y: 40 },
  { lines: ["EPC &", "floorplan"], x: 520, y: 40 },
  { lines: ["Board", "contractor"], x: 20, y: 356 },
  { lines: ["AML provider"], x: 520, y: 356 },
  { lines: ["Conveyancer"], x: 20, y: 672, monetised: true },
  { lines: ["Mortgage", "advisor"], x: 270, y: 672, monetised: true },
  { lines: ["Removals", "& trades"], x: 520, y: 672, monetised: true },
];

const CENTER = { x: 360, y: 395 };

export default function InterfacesDiagram() {
  return (
    <svg
      viewBox="0 0 720 790"
      role="img"
      aria-label="Wiring diagram of the agency's external interfaces"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      {/* Wires first, boxes drawn over them */}
      {NODES.map((node) => {
        const ncx = node.x + NODE_W / 2;
        const ncy = node.y + NODE_H / 2;
        return (
          <g key={node.lines.join()}>
            <line
              x1={ncx}
              y1={ncy}
              x2={CENTER.x}
              y2={CENTER.y}
              stroke={node.monetised ? BLUE : HAIR}
              strokeWidth={node.monetised ? 1.5 : 1}
              strokeDasharray={node.monetised ? undefined : "4 4"}
            />
            {node.monetised && (
              <g>
                <rect
                  x={(ncx + CENTER.x) / 2 - 42}
                  y={(ncy + CENTER.y) / 2 - 11}
                  width={84}
                  height={22}
                  fill={BLUE}
                />
                <text
                  x={(ncx + CENTER.x) / 2}
                  y={(ncy + CENTER.y) / 2 + 4}
                  textAnchor="middle"
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    fill: "#f7f7f5",
                  }}
                >
                  £ REFERRAL
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Provider nodes */}
      {NODES.map((node) => {
        const ncx = node.x + NODE_W / 2;
        const ncy = node.y + NODE_H / 2;
        return (
          <g key={node.lines.join()}>
            <rect
              x={node.x}
              y={node.y}
              width={NODE_W}
              height={NODE_H}
              fill="#f4f3f0"
              stroke={node.monetised ? BLUE : HAIR}
              strokeWidth={node.monetised ? 1.5 : 1}
            />
            {node.lines.map((line, i) => (
              <text
                key={i}
                x={ncx}
                y={
                  ncy +
                  5 +
                  (i - (node.lines.length - 1) / 2) * 18
                }
                textAnchor="middle"
                style={{
                  fontFamily: MONO,
                  fontSize: 11.5,
                  fontWeight: 500,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  fill: INK,
                }}
              >
                {line}
              </text>
            ))}
          </g>
        );
      })}

      {/* The agency — an AI switchboard at the centre */}
      <rect
        x="238"
        y="313"
        width="244"
        height="164"
        fill="none"
        stroke={BLUE}
        strokeWidth="1.2"
        strokeDasharray="3 4"
      />
      <rect x="250" y="325" width="220" height="140" fill="#0f1011" />
      <text
        x="360"
        y="388"
        textAnchor="middle"
        style={{
          fontFamily: MONO,
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: "0.09em",
          textTransform: "uppercase",
          fill: "#f7f7f5",
        }}
      >
        The agency
      </text>
      <text
        x="360"
        y="412"
        textAnchor="middle"
        style={{
          fontFamily: MONO,
          fontSize: 10.5,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fill: "#7fa8f0",
        }}
      >
        AI switchboard
      </text>

      {/* Plot boundary + margin note */}
      <rect
        x="4"
        y="8"
        width="686"
        height="774"
        fill="none"
        stroke={HAIR_SOFT}
        strokeWidth="1"
        strokeDasharray="3 6"
      />
      <MarginNote
        x={704}
        y={395}
        text="AIP — Plan 03 — The interfaces — wiring & referrals"
      />
    </svg>
  );
}
