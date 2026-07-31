/**
 * Shared drawing language for the three schematic diagrams —
 * one set of inks, fills and chips so every layer codes work the same way.
 */

import type { Assignment } from "../data/model";

export const MONO = "var(--font-geist-mono), monospace";
export const INK = "#26282b";
export const INK_300 = "#8a8c90";
export const INK_500 = "#5c5e62";
export const BLUE = "#2f6fe0";
export const HAIR = "rgba(0,0,0,.28)";
export const HAIR_SOFT = "rgba(0,0,0,.18)";

export const FILL_AI = "rgba(47,111,224,.16)";
export const FILL_HUMAN = "rgba(15,16,17,.055)";

export const CHIP: Record<
  Assignment,
  { label: string; w: number; fill: string; text: string; stroke?: string }
> = {
  human: { label: "HUMAN-LED", w: 78, fill: "#17181a", text: "#f7f7f5" },
  hybrid: {
    label: "HUMAN + AI",
    w: 86,
    fill: "#f4f3f0",
    text: "#2f6fe0",
    stroke: "#2f6fe0",
  },
  ai: { label: "AI-LED", w: 60, fill: "#2f6fe0", text: "#f7f7f5" },
};

/** Diagonal blue hatch = humans + AI. Pattern ids are per-SVG. */
export function HybridHatchDef({ id }: { id: string }) {
  return (
    <pattern
      id={id}
      width="10"
      height="10"
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(45)"
    >
      <rect width="10" height="10" fill="rgba(47,111,224,.05)" />
      <line
        x1="0"
        y1="0"
        x2="0"
        y2="10"
        stroke="rgba(47,111,224,.28)"
        strokeWidth="1.5"
      />
    </pattern>
  );
}

export function fillFor(assignment: Assignment | null, hatchId: string) {
  if (assignment === "ai") return FILL_AI;
  if (assignment === "hybrid") return `url(#${hatchId})`;
  if (assignment === "human") return FILL_HUMAN;
  return "rgba(0,0,0,0.001)";
}

/** Small who-does-it chip, centered on cx. */
export function SvgChip({
  cx,
  y,
  tone,
}: {
  cx: number;
  y: number;
  tone: Assignment;
}) {
  const chip = CHIP[tone];
  const x = cx - chip.w / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={chip.w}
        height={22}
        fill={chip.fill}
        stroke={chip.stroke}
        strokeWidth={chip.stroke ? 1 : undefined}
      />
      <text
        x={cx}
        y={y + 15}
        textAnchor="middle"
        style={{
          fontFamily: MONO,
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.07em",
          fill: chip.text,
        }}
      >
        {chip.label}
      </text>
    </g>
  );
}

/** Rotated architect's margin note along the right edge of a drawing. */
export function MarginNote({
  x,
  y,
  text,
}: {
  x: number;
  y: number;
  text: string;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      transform={`rotate(90 ${x} ${y})`}
      style={{
        fontFamily: MONO,
        fontSize: 10.5,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        fill: INK_300,
      }}
    >
      {text}
    </text>
  );
}
