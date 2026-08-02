"use client";

/**
 * Plan 03, The interfaces. A wiring diagram: the agency at the centre,
 * wired to every external provider. Blue lines carry money, the
 * relationships the agency monetises through referrals. Every provider
 * box opens into its own page.
 */

import { useState } from "react";
import { PROVIDERS } from "../data/model";
import { BLUE, HAIR, HAIR_SOFT, INK, INK_300, MarginNote, MONO } from "./plan-style";

const CENTER = { x: 360, y: 395 };

interface InterfacesDiagramProps {
  active?: string | null;
  onSelect?: (slug: string) => void;
  mini?: boolean;
}

export default function InterfacesDiagram({
  active,
  onSelect,
  mini,
}: InterfacesDiagramProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <svg
      viewBox="0 0 720 790"
      role="group"
      aria-label="Wiring diagram of the agency's external interfaces"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      {/* Wires first, boxes drawn over them */}
      {PROVIDERS.map((node) => {
        const ncx = node.rect.x + node.rect.w / 2;
        const ncy = node.rect.y + node.rect.h / 2;
        return (
          <g key={node.slug} pointerEvents="none">
            <line
              x1={ncx}
              y1={ncy}
              x2={CENTER.x}
              y2={CENTER.y}
              stroke={node.monetised ? BLUE : HAIR}
              strokeWidth={node.monetised ? 1.5 : 1}
              strokeDasharray={node.monetised ? undefined : "4 4"}
            />
            {node.monetised && !mini && (
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
      {PROVIDERS.map((node, i) => {
        const { x, y, w, h } = node.rect;
        const ncx = x + w / 2;
        const ncy = y + h / 2;
        const isActive = active === node.slug;
        const isHover = hovered === node.slug;
        return (
          <g
            key={node.slug}
            onMouseEnter={() => setHovered(node.slug)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect?.(node.slug)}
            style={{ cursor: onSelect ? "pointer" : "default" }}
            role={onSelect ? "button" : undefined}
            aria-label={node.title}
          >
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              fill="#f4f3f0"
              stroke={
                isActive || isHover ? BLUE : node.monetised ? BLUE : HAIR
              }
              strokeWidth={isActive || isHover ? 2 : node.monetised ? 1.5 : 1}
              style={{ transition: "stroke .15s ease" }}
            />
            {mini && isActive && (
              <rect x={x} y={y} width={w} height={h} fill={BLUE} opacity={0.9} />
            )}
            {!mini && (
              <>
                <text
                  x={x + 10}
                  y={y + 20}
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    fill: isHover || isActive ? BLUE : INK_300,
                    transition: "fill .2s ease",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </text>
                {node.planLabel.map((line, li, lines) => (
                  <text
                    key={li}
                    x={ncx}
                    y={ncy + 5 + (li - (lines.length - 1) / 2) * 18}
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
              </>
            )}
          </g>
        );
      })}

      {/* The agency at the centre */}
      <g pointerEvents="none">
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
          y="400"
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
      </g>

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
        pointerEvents="none"
      />
      {!mini && (
        <MarginNote
          x={704}
          y={395}
          text="AIP · Plan 03 · The interfaces · wiring & referrals"
        />
      )}
    </svg>
  );
}
