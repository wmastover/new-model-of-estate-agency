"use client";

import { useState } from "react";
import { PLAN, ROOMS, type Room } from "../data/model";
import {
  BLUE,
  CHIP,
  HAIR,
  HAIR_SOFT,
  HybridHatchDef,
  INK,
  INK_300,
  MONO,
  fillFor,
} from "./plan-style";

/** Room fill encodes who leads the work: the plan's key signal. */
function roomFill(room: Room): string {
  return fillFor(room.assignment, "hybrid-hatch");
}

interface FloorPlanProps {
  active?: string | null;
  onSelect?: (slug: string) => void;
  mini?: boolean;
}

export default function FloorPlan({ active, onSelect, mini }: FloorPlanProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <svg
      viewBox={`0 0 ${PLAN.w} ${PLAN.h}`}
      role="group"
      aria-label="Floor plan of the model estate agency"
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      <defs>
        <HybridHatchDef id="hybrid-hatch" />
      </defs>

      {/* Plot boundary */}
      <rect
        x="20"
        y="10"
        width="680"
        height="1280"
        fill="none"
        stroke={HAIR_SOFT}
        strokeWidth="1"
        strokeDasharray="3 6"
      />

      {/* Rooms */}
      {ROOMS.map((room, i) => {
        const { x, y, w, h } = room.rect;
        const isActive = active === room.slug;
        const isHover = hovered === room.slug;
        const cx = x + w / 2;
        const cy = y + h / 2;
        const num = String(i).padStart(2, "0");

        return (
          <g
            key={room.slug}
            onMouseEnter={() => setHovered(room.slug)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onSelect?.(room.slug)}
            style={{ cursor: onSelect ? "pointer" : "default" }}
            role={onSelect ? "button" : undefined}
            aria-label={room.title}
          >
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              fill={roomFill(room)}
              stroke={
                room.outdoor
                  ? "none"
                  : isActive || isHover
                    ? BLUE
                    : HAIR
              }
              strokeWidth={isActive || isHover ? 2 : 1}
              style={{ transition: "stroke .15s ease" }}
            />
            {room.outdoor && (
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill="none"
                stroke={isActive || isHover ? BLUE : HAIR_SOFT}
                strokeWidth={isActive || isHover ? 2 : 1}
                strokeDasharray="3 6"
              />
            )}
            {room.unfinished && !mini && (
              <rect
                x={x + 8}
                y={y + 8}
                width={w - 16}
                height={h - 16}
                fill="none"
                stroke={HAIR_SOFT}
                strokeWidth="1"
                strokeDasharray="2 5"
              />
            )}

            {!mini && (
              <>
                {/* index + assignment marker */}
                <text
                  x={x + 14}
                  y={y + 26}
                  style={{
                    fontFamily: MONO,
                    fontSize: 11,
                    fill: isHover || isActive ? BLUE : INK_300,
                    transition: "fill .2s ease",
                  }}
                >
                  {num}
                </text>
                {/* label: the job itself, set like a room name on a plan */}
                {(room.planLabel ?? [room.title]).map((line, li, lines) => (
                  <text
                    key={li}
                    x={room.outdoor ? x + 40 : cx}
                    y={cy + 5 + (li - (lines.length - 1) / 2) * 22}
                    textAnchor={room.outdoor ? undefined : "middle"}
                    style={{
                      fontFamily: MONO,
                      fontSize: 13,
                      fontWeight: 500,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      fill: INK,
                    }}
                  >
                    {line}
                  </text>
                ))}

                {/* who-does-it chip */}
                {room.assignment &&
                  (() => {
                    const chip = CHIP[room.assignment];
                    const chipX = room.outdoor ? x + 40 : cx - chip.w / 2;
                    const chipY =
                      cy +
                      ((room.planLabel?.length ?? 1) > 1 ? 34 : 22);
                    return (
                      <g>
                        <rect
                          x={chipX}
                          y={chipY}
                          width={chip.w}
                          height={22}
                          fill={chip.fill}
                          stroke={chip.stroke}
                          strokeWidth={chip.stroke ? 1 : undefined}
                        />
                        <text
                          x={chipX + chip.w / 2}
                          y={chipY + 15}
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
                  })()}
              </>
            )}

            {mini && (
              <rect
                x={x}
                y={y}
                width={w}
                height={h}
                fill={isActive ? BLUE : "transparent"}
                opacity={isActive ? 0.9 : 1}
                stroke="none"
              />
            )}
          </g>
        );
      })}

      {/* House outline, drawn on top so walls read solid */}
      <rect
        x="60"
        y="190"
        width="600"
        height="940"
        fill="none"
        stroke={INK}
        strokeWidth="2.5"
        pointerEvents="none"
      />

      {!mini && (
        <g pointerEvents="none">
          {/* Front door: gap in the top wall + swing arc */}
          <rect x="226" y="186" width="48" height="8" fill="#f4f3f0" />
          <line x1="230" y1="190" x2="230" y2="234" stroke={BLUE} strokeWidth="2" />
          <path d="M 230 234 A 44 44 0 0 0 274 190" fill="none" stroke={BLUE} strokeWidth="1.2" strokeDasharray="3 4" />

          {/* Garden path down to the front door */}
          <line x1="234" y1="36" x2="234" y2="186" stroke={HAIR_SOFT} strokeWidth="1" />
          <line x1="266" y1="36" x2="266" y2="186" stroke={HAIR_SOFT} strokeWidth="1" />
          <line x1="234" y1="76" x2="266" y2="76" stroke={HAIR_SOFT} strokeWidth="1" />
          <line x1="234" y1="116" x2="266" y2="116" stroke={HAIR_SOFT} strokeWidth="1" />
          <line x1="234" y1="156" x2="266" y2="156" stroke={HAIR_SOFT} strokeWidth="1" />

          {/* For-sale board in the front garden */}
          <line x1="600" y1="172" x2="600" y2="106" stroke={INK} strokeWidth="2.5" />
          <rect x="563" y="48" width="74" height="58" fill={BLUE} stroke={INK} strokeWidth="1" />
          <text
            x="600"
            y="68"
            textAnchor="middle"
            style={{
              fontFamily: MONO,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.12em",
              fill: "#f7f7f5",
            }}
          >
            FOR
          </text>
          <text
            x="600"
            y="82"
            textAnchor="middle"
            style={{
              fontFamily: MONO,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.12em",
              fill: "#f7f7f5",
            }}
          >
            SALE
          </text>
          <rect x="563" y="92" width="74" height="14" fill="#f4f3f0" stroke={INK} strokeWidth="1" />
          <text
            x="600"
            y="102"
            textAnchor="middle"
            style={{
              fontFamily: MONO,
              fontSize: 8,
              fontWeight: 600,
              letterSpacing: "0.2em",
              fill: INK,
            }}
          >
            AIP
          </text>

          {/* Sofa: winning valuations happens on the vendor's sofa */}
          <rect x="445" y="424" width="150" height="46" fill="none" stroke={HAIR} strokeWidth="1" />
          <line x1="445" y1="436" x2="595" y2="436" stroke={HAIR_SOFT} strokeWidth="1" />

          {/* Desk: taking on properties is the paperwork */}
          <rect x="82" y="530" width="100" height="36" fill="none" stroke={HAIR} strokeWidth="1" />

          {/* Counter + hobs: marketing is the kitchen of the operation */}
          <rect x="268" y="508" width="184" height="28" fill="none" stroke={HAIR} strokeWidth="1" />
          <circle cx="304" cy="522" r="8" fill="none" stroke={HAIR} strokeWidth="1" />
          <circle cx="330" cy="522" r="8" fill="none" stroke={HAIR} strokeWidth="1" />

          {/* Stairs: viewings walk buyers through the house */}
          {[0, 1, 2, 3, 4, 5].map((s) => (
            <line
              key={s}
              x1={482}
              y1={532 + s * 11}
              x2={544}
              y2={532 + s * 11}
              stroke={HAIR}
              strokeWidth="1"
            />
          ))}
          <line x1="513" y1="532" x2="513" y2="587" stroke={HAIR} strokeWidth="1" />

          {/* Table: offers happen across it */}
          <rect x="150" y="856" width="120" height="80" fill="none" stroke={HAIR} strokeWidth="1" />

          {/* Machine: progression is the laundry cycle of the deal */}
          <rect x="592" y="838" width="42" height="42" fill="none" stroke={HAIR} strokeWidth="1" />
          <circle cx="613" cy="859" r="12" fill="none" stroke={HAIR} strokeWidth="1" />

          {/* Back door out to completion */}
          <rect x="496" y="1126" width="48" height="8" fill="#f4f3f0" />
          <line x1="500" y1="1130" x2="500" y2="1174" stroke={BLUE} strokeWidth="2" />
          <path d="M 500 1174 A 44 44 0 0 1 544 1130" fill="none" stroke={BLUE} strokeWidth="1.2" strokeDasharray="3 4" />

          {/* Sold board in the back garden: the tour's full stop */}
          <line x1="580" y1="1262" x2="580" y2="1218" stroke={INK} strokeWidth="2.5" />
          <rect x="543" y="1160" width="74" height="58" fill="#0f1011" stroke={INK} strokeWidth="1" />
          <text
            x="580"
            y="1187"
            textAnchor="middle"
            style={{
              fontFamily: MONO,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.14em",
              fill: "#f7f7f5",
            }}
          >
            SOLD
          </text>
          <rect x="543" y="1204" width="74" height="14" fill="#f4f3f0" stroke={INK} strokeWidth="1" />
          <text
            x="580"
            y="1214"
            textAnchor="middle"
            style={{
              fontFamily: MONO,
              fontSize: 8,
              fontWeight: 600,
              letterSpacing: "0.2em",
              fill: INK,
            }}
          >
            AIP
          </text>

          {/* Drawing annotation: architect's margin note */}
          <text
            x="688"
            y="650"
            textAnchor="middle"
            transform="rotate(90 688 650)"
            style={{
              fontFamily: MONO,
              fontSize: 10.5,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              fill: INK_300,
            }}
          >
            AIP · Plan 01 · A new model of estate agency · not to scale
          </text>

          {/* North marker */}
          <circle cx="40" cy="52" r="13" fill="none" stroke={HAIR} strokeWidth="1" />
          <line x1="40" y1="61" x2="40" y2="45" stroke={INK} strokeWidth="1.4" />
          <path d="M 40 41 L 36 49 L 44 49 Z" fill={BLUE} />
        </g>
      )}
    </svg>
  );
}
