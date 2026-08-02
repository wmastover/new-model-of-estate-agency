"use client";

import { PROVIDERS, type Provider } from "../data/model";
import { BlockRenderer } from "./Blocks";
import InterfacesDiagram from "./InterfacesDiagram";

function MoneyBadge({ monetised }: { monetised: boolean }) {
  const base: React.CSSProperties = {
    fontFamily: "var(--font-geist-mono), monospace",
    fontSize: 12,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
    padding: "5px 11px",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    whiteSpace: "nowrap",
  };
  if (monetised) {
    base.background = "var(--blue)";
    base.color = "var(--snow-900)";
    return <span style={base}>£ Revenue stream</span>;
  }
  base.border = "1px solid var(--hairline-18)";
  base.color = "var(--ink-500)";
  return <span style={base}>Cost centre</span>;
}

interface ProviderViewProps {
  provider: Provider;
  onSelect: (slug: string | null) => void;
}

export default function ProviderView({ provider, onSelect }: ProviderViewProps) {
  const index = PROVIDERS.findIndex((p) => p.slug === provider.slug);
  const prev = index > 0 ? PROVIDERS[index - 1] : null;
  const next = index < PROVIDERS.length - 1 ? PROVIDERS[index + 1] : null;

  return (
    <div>
      {/* Provider header */}
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
          ← Back to the wiring diagram
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
            Interface {String(index + 1).padStart(2, "0")} /{" "}
            {String(PROVIDERS.length).padStart(2, "0")}
          </span>
          <MoneyBadge monetised={provider.monetised} />
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
          {provider.title}
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
          {provider.summary}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,660px)_1fr] gap-x-16 gap-y-12">
        {/* Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {provider.blocks.map((block, i) => (
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
              maxWidth: 220,
              marginBottom: 30,
            }}
          >
            <InterfacesDiagram
              mini
              active={provider.slug}
              onSelect={(s) => onSelect(s)}
            />
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
                  Next interface
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
                <span style={{ flex: 1 }}>Back · {prev.title}</span>
              </button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
