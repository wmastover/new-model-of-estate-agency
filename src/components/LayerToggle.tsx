"use client";

import { useState } from "react";
import { LAYERS, type LayerId } from "../data/model";

export default function LayerToggle({
  layer,
  onChange,
}: {
  layer: LayerId;
  onChange: (id: LayerId) => void;
}) {
  const [hovered, setHovered] = useState<LayerId | null>(null);
  const current = LAYERS.find((l) => l.id === layer)!;

  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${LAYERS.length}, auto)`,
            gap: 1,
            background: "var(--hairline-16)",
            border: "1px solid var(--hairline-16)",
          }}
        >
          {LAYERS.map((l) => {
            const isActive = l.id === layer;
            const isHover = hovered === l.id;
            return (
              <button
                key={l.id}
                onClick={() => onChange(l.id)}
                onMouseEnter={() => setHovered(l.id)}
                onMouseLeave={() => setHovered(null)}
                className="kicker"
                style={{
                  border: "none",
                  cursor: "pointer",
                  padding: "13px 24px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: isActive
                    ? "var(--ink-900)"
                    : isHover
                      ? "#fff"
                      : "var(--paper)",
                  color: isActive ? "var(--snow-900)" : "var(--ink-500)",
                  transition: "background .2s ease, color .2s ease",
                }}
              >
                <span
                  className="mono"
                  style={{
                    color: isActive ? "var(--blue-dark)" : "var(--ink-200)",
                  }}
                >
                  {l.num}
                </span>
                {l.label}
                {!l.drafted && (
                  <span
                    className="mono"
                    style={{
                      fontSize: 10,
                      color: isActive ? "var(--snow-500)" : "var(--ink-200)",
                      textTransform: "none",
                      letterSpacing: "0.02em",
                    }}
                  >
                    · draft
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <p
        style={{
          textAlign: "center",
          fontSize: 15,
          lineHeight: 1.55,
          color: "var(--ink-500)",
          maxWidth: 560,
          margin: "22px auto 0",
        }}
      >
        {current.description}
      </p>
    </div>
  );
}
