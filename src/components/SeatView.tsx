"use client";

import { SEATS, type Seat } from "../data/model";
import { BlockRenderer } from "./Blocks";
import PeopleDiagram from "./PeopleDiagram";

interface SeatViewProps {
  seat: Seat;
  onSelect: (slug: string | null) => void;
}

export default function SeatView({ seat, onSelect }: SeatViewProps) {
  const index = SEATS.findIndex((s) => s.slug === seat.slug);
  const prev = index > 0 ? SEATS[index - 1] : null;
  const next = index < SEATS.length - 1 ? SEATS[index + 1] : null;

  return (
    <div>
      {/* Seat header */}
      <div
        style={{
          borderBottom: "1px solid var(--hairline-10)",
          paddingBottom: 34,
          marginBottom: 44,
        }}
      >
        <button
          onClick={() => onSelect(null)}
          className="mono"
          style={{
            fontSize: 13,
            color: "var(--ink-300)",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            marginBottom: 30,
          }}
        >
          ← Back to the org chart
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
            marginBottom: 18,
          }}
        >
          <span className="kicker" style={{ color: "var(--blue)" }}>
            Seat {String(index + 1).padStart(2, "0")} /{" "}
            {String(SEATS.length).padStart(2, "0")}
          </span>
          <span className="kicker" style={{ color: "var(--ink-300)" }}>
            {seat.owns}
          </span>
        </div>
        <h1
          className="mono"
          style={{
            fontWeight: 600,
            fontSize: "clamp(34px, 5vw, 50px)",
            letterSpacing: "-0.035em",
            lineHeight: 1.04,
            color: "var(--ink-900)",
            margin: "0 0 14px",
          }}
        >
          {seat.title}
        </h1>
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.55,
            color: "var(--ink-500)",
            maxWidth: 620,
            margin: 0,
          }}
        >
          {seat.summary}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,660px)_1fr] gap-x-16 gap-y-12">
        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {seat.blocks.map((block, i) => (
            <BlockRenderer key={i} block={block} />
          ))}
        </div>

        {/* Side rail */}
        <aside className="lg:sticky lg:top-10 self-start" style={{ minWidth: 0 }}>
          <div
            className="kicker"
            style={{ color: "var(--ink-300)", fontWeight: 500, marginBottom: 14 }}
          >
            You are here
          </div>
          <div
            style={{
              border: "1px solid var(--hairline-12)",
              padding: 14,
              maxWidth: 240,
              marginBottom: 30,
            }}
          >
            <PeopleDiagram mini active={seat.slug} onSelect={(s) => onSelect(s)} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxWidth: 300 }}>
            {next && (
              <button
                onClick={() => onSelect(next.slug)}
                style={{
                  background: "var(--blue)",
                  color: "#fff",
                  fontSize: 14.5,
                  fontWeight: 500,
                  fontFamily: "var(--font-hanken), sans-serif",
                  padding: "14px 22px",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <span>
                  Next seat
                  <span style={{ display: "block", fontSize: 12.5, opacity: 0.75, marginTop: 2 }}>
                    {next.title}
                  </span>
                </span>
                <span aria-hidden>→</span>
              </button>
            )}
            {prev && (
              <button
                onClick={() => onSelect(prev.slug)}
                style={{
                  background: "transparent",
                  color: "var(--ink-800)",
                  fontSize: 14.5,
                  fontFamily: "var(--font-hanken), sans-serif",
                  padding: "13px 22px",
                  border: "1px solid var(--hairline-18)",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <span aria-hidden>←</span>
                <span style={{ flex: 1 }}>Back — {prev.title}</span>
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
