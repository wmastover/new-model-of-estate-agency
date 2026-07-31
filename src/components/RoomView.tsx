"use client";

import { ASSIGNMENT_META, ROOMS, type Room } from "../data/model";
import { AssignmentBadge, BlockRenderer, Marker } from "./Blocks";
import FloorPlan from "./FloorPlan";

export { AssignmentBadge, Marker };

interface RoomViewProps {
  room: Room;
  onSelect: (slug: string | null) => void;
}

export default function RoomView({ room, onSelect }: RoomViewProps) {
  const index = ROOMS.findIndex((r) => r.slug === room.slug);
  const prev = index > 0 ? ROOMS[index - 1] : null;
  const next = index < ROOMS.length - 1 ? ROOMS[index + 1] : null;

  return (
    <div>
      {/* Room header */}
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
          ← Back to the floor plan
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
            {String(index).padStart(2, "0")} /{" "}
            {String(ROOMS.length - 1).padStart(2, "0")}
          </span>
          {room.assignment && <AssignmentBadge tone={room.assignment} />}
          {room.unfinished && (
            <span
              className="kicker"
              style={{
                border: "1px solid var(--hairline-18)",
                color: "var(--ink-500)",
                padding: "5px 11px",
              }}
            >
              Under renovation
            </span>
          )}
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
          {room.title}
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
          {room.conceit}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,660px)_1fr] gap-x-16 gap-y-12">
        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {room.blocks.map((block, i) => (
            <BlockRenderer key={i} block={block} />
          ))}

          {room.assignment && (
            <div
              style={{
                borderTop: "1px solid var(--hairline-10)",
                paddingTop: 22,
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
              }}
            >
              <span style={{ paddingTop: 5 }}>
                <Marker tone={room.assignment} size={7} />
              </span>
              <span style={{ fontSize: 14, lineHeight: 1.6, color: "var(--ink-300)" }}>
                <strong style={{ color: "var(--ink-700)", fontWeight: 600 }}>
                  Our call — {ASSIGNMENT_META[room.assignment].label}.
                </strong>{" "}
                {ASSIGNMENT_META[room.assignment].description}
              </span>
            </div>
          )}
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
              maxWidth: 190,
              marginBottom: 30,
            }}
          >
            <FloorPlan mini active={room.slug} onSelect={(s) => onSelect(s)} />
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
                  Continue the tour
                  <span style={{ display: "block", fontSize: 12.5, opacity: 0.75, marginTop: 2 }}>
                    {String(index + 1).padStart(2, "0")} — {next.title}
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
