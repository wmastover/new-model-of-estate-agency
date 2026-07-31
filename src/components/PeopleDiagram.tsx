"use client";

/**
 * Plan 02 — The people. An org section of a modern branch, drawn in the
 * same schematic language as the floor plan. Every box is a person and
 * opens into a seat page; the AI agent layer sits underneath the branch.
 */

import { useState } from "react";
import { SEATS } from "../data/model";
import {
  BLUE,
  FILL_AI,
  FILL_HUMAN,
  HAIR,
  HAIR_SOFT,
  INK,
  INK_300,
  INK_500,
  MarginNote,
  MONO,
} from "./plan-style";

const DROPS = [100, 275, 450, 625];

interface PeopleDiagramProps {
  active?: string | null;
  onSelect?: (slug: string) => void;
  mini?: boolean;
}

export default function PeopleDiagram({
  active,
  onSelect,
  mini,
}: PeopleDiagramProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <svg
      viewBox="0 0 720 640"
      role="group"
      aria-label="Org section of a modern estate agency branch"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      {/* Reporting lines */}
      <line x1="360" y1="144" x2="360" y2="184" stroke={HAIR} strokeWidth="1" />
      <line x1="100" y1="184" x2="625" y2="184" stroke={HAIR} strokeWidth="1" />
      {DROPS.map((cx) => (
        <line
          key={cx}
          x1={cx}
          y1="184"
          x2={cx}
          y2="224"
          stroke={HAIR}
          strokeWidth="1"
        />
      ))}

      {/* Every seat drops into the agent layer */}
      {DROPS.map((cx) => (
        <line
          key={cx}
          x1={cx}
          y1="340"
          x2={cx}
          y2="420"
          stroke={BLUE}
          strokeWidth="1.2"
          strokeDasharray="3 4"
        />
      ))}

      {/* Seats */}
      {SEATS.map((seat, i) => {
        const { x, y, w, h } = seat.rect;
        const cx = x + w / 2;
        const cy = y + h / 2;
        const isActive = active === seat.slug;
        const isHover = hovered === seat.slug;
        return (
          <g
            key={seat.slug}
            onMouseEnter={() => setHovered(seat.slug)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect?.(seat.slug)}
            style={{ cursor: onSelect ? "pointer" : "default" }}
            role={onSelect ? "button" : undefined}
            aria-label={seat.title}
          >
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              fill={FILL_HUMAN}
              stroke={isActive || isHover ? BLUE : HAIR}
              strokeWidth={isActive || isHover ? 2 : 1}
              style={{ transition: "stroke .15s ease" }}
            />
            {mini && isActive && (
              <rect x={x} y={y} width={w} height={h} fill={BLUE} opacity={0.9} />
            )}
            {!mini && (
              <>
                <text
                  x={x + 12}
                  y={y + 22}
                  style={{
                    fontFamily: MONO,
                    fontSize: 10.5,
                    fill: isHover || isActive ? BLUE : INK_300,
                    transition: "fill .2s ease",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </text>
                {seat.planLabel.map((line, li, lines) => (
                  <text
                    key={li}
                    x={cx}
                    y={cy + 5 + (li - (lines.length - 1) / 2) * 19}
                    textAnchor="middle"
                    style={{
                      fontFamily: MONO,
                      fontSize: 12,
                      fontWeight: 500,
                      letterSpacing: "0.07em",
                      textTransform: "uppercase",
                      fill: INK,
                    }}
                  >
                    {line}
                  </text>
                ))}
              </>
            )}
          </g>
        );
      })}

      {/* The AI agent layer underneath the whole branch */}
      <rect
        x="20"
        y="420"
        width="650"
        height="130"
        fill={FILL_AI}
        stroke={BLUE}
        strokeWidth="1.2"
        strokeDasharray="3 4"
        pointerEvents="none"
      />
      {!mini && (
        <g pointerEvents="none">
          <text
            x="345"
            y="478"
            textAnchor="middle"
            style={{
              fontFamily: MONO,
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fill: INK,
            }}
          >
            AI agent layer
          </text>
          <text
            x="345"
            y="502"
            textAnchor="middle"
            style={{
              fontFamily: "var(--font-hanken), sans-serif",
              fontSize: 13,
              fill: INK_500,
            }}
          >
            one set of agents, working under every seat in the branch
          </text>
        </g>
      )}

      {/* Plot boundary + margin note, same drawing conventions */}
      <rect
        x="4"
        y="8"
        width="686"
        height="586"
        fill="none"
        stroke={HAIR_SOFT}
        strokeWidth="1"
        strokeDasharray="3 6"
        pointerEvents="none"
      />
      {!mini && (
        <MarginNote
          x={704}
          y={300}
          text="AIP — Plan 02 — The people — who holds each seat"
        />
      )}
    </svg>
  );
}
