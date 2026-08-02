"use client";

import {
  ASSIGNMENT_META,
  PROVIDERS,
  ROOMS,
  SEATS,
  type Assignment,
  type Block,
} from "../data/model";

/* ------------------------------------------------------------------ */
/* Wikipedia-style references. Content strings can contain             */
/* [[slug]] or [[slug|display text]], which render as links to the    */
/* room, seat or provider page with that slug. Navigation rides the   */
/* existing hash routing: the anchor sets the hash, Tour picks it up. */
/* ------------------------------------------------------------------ */

const TITLE_BY_SLUG: Record<string, string> = Object.fromEntries(
  [...ROOMS, ...SEATS, ...PROVIDERS].map((entry) => [entry.slug, entry.title])
);

const REF_PATTERN = /\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g;

function Ref({ slug, label }: { slug: string; label?: string }) {
  return (
    <a href={`#${slug}`} className="ref">
      {label ?? TITLE_BY_SLUG[slug] ?? slug}
    </a>
  );
}

/** Renders a content string, turning [[slug|text]] references into links. */
export function RichText({ text }: { text: string }) {
  const matches = [...text.matchAll(REF_PATTERN)];
  if (matches.length === 0) return <>{text}</>;

  const parts: React.ReactNode[] = [];
  let cursor = 0;
  matches.forEach((m, i) => {
    if (m.index > cursor) parts.push(text.slice(cursor, m.index));
    parts.push(<Ref key={i} slug={m[1]} label={m[2]} />);
    cursor = m.index + m[0].length;
  });
  if (cursor < text.length) parts.push(text.slice(cursor));
  return <>{parts}</>;
}

/** Square marker: replaces the source doc's 🟥🟨🟩 emoji. */
export function Marker({
  tone,
  size = 8,
}: {
  tone: Assignment;
  size?: number;
}) {
  const style: React.CSSProperties = {
    width: size,
    height: size,
    display: "inline-block",
    flexShrink: 0,
  };
  if (tone === "ai") style.background = "var(--blue)";
  else if (tone === "human") style.background = "var(--ink-800)";
  else style.border = "1.5px solid var(--blue)";
  return <span style={style} aria-hidden />;
}

export function AssignmentBadge({ tone }: { tone: Assignment }) {
  const meta = ASSIGNMENT_META[tone];
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
  if (tone === "ai") {
    base.background = "var(--blue)";
    base.color = "var(--snow-900)";
  } else if (tone === "human") {
    base.background = "var(--ink-900)";
    base.color = "var(--snow-900)";
  } else {
    base.border = "1px solid var(--blue)";
    base.color = "var(--blue)";
  }
  return <span style={base}>{meta.label}</span>;
}

function CalloutBlock({ block }: { block: Extract<Block, { kind: "callout" }> }) {
  return (
    <div
      style={{
        border: "1px solid var(--hairline-16)",
        padding: "26px 30px",
        background: "var(--paper)",
      }}
    >
      <div
        className="kicker"
        style={{
          color: block.tone === "human" ? "var(--ink-700)" : "var(--blue)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 16,
          fontWeight: 500,
        }}
      >
        <Marker tone={block.tone} size={7} />
        {block.label}
      </div>
      {block.body && (
        <p style={{ fontSize: 15.5, lineHeight: 1.65, color: "var(--ink-500)", margin: 0 }}>
          <RichText text={block.body} />
        </p>
      )}
      {block.items && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {block.items.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 14 }}>
              <span
                className="mono"
                style={{ color: "var(--blue)", flexShrink: 0, fontSize: 15 }}
              >
                ·
              </span>
              <span style={{ fontSize: 15.5, lineHeight: 1.65, color: "var(--ink-500)" }}>
                <RichText text={item} />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function BlockRenderer({ block }: { block: Block }) {
  switch (block.kind) {
    case "lead":
      return (
        <p style={{ fontSize: 19, lineHeight: 1.6, color: "var(--ink-800)", margin: 0 }}>
          <RichText text={block.text} />
        </p>
      );
    case "p":
      return (
        <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--ink-500)", margin: 0 }}>
          <RichText text={block.text} />
        </p>
      );
    case "h":
      return (
        <h3
          className="mono"
          style={{
            fontWeight: 600,
            fontSize: 22,
            letterSpacing: "-0.02em",
            color: "var(--ink-800)",
            margin: "18px 0 0",
          }}
        >
          {block.text}
        </h3>
      );
    case "list":
      return (
        <div>
          {block.title && (
            <div
              className="kicker"
              style={{ color: "var(--ink-500)", fontWeight: 500, marginBottom: 18 }}
            >
              {block.title}
            </div>
          )}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {block.items.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 18,
                  padding: "13px 0",
                  borderTop: "1px solid var(--hairline-10)",
                  borderBottom:
                    i === block.items.length - 1
                      ? "1px solid var(--hairline-10)"
                      : "none",
                }}
              >
                <span
                  className="mono"
                  style={{
                    color: "var(--blue)",
                    fontSize: 13,
                    flexShrink: 0,
                    paddingTop: 3,
                    width: 22,
                  }}
                >
                  {block.ordered ? String(i + 1).padStart(2, "0") : "·"}
                </span>
                <span style={{ fontSize: 15.5, lineHeight: 1.6, color: "var(--ink-700)" }}>
                  <RichText text={item} />
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    case "callout":
      return <CalloutBlock block={block} />;
    case "stat":
      return (
        <div
          style={{
            border: "1px solid var(--hairline-12)",
            padding: "30px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <span
            className="mono"
            style={{
              fontWeight: 600,
              fontSize: 38,
              letterSpacing: "-0.03em",
              color: "var(--blue)",
            }}
          >
            {block.value}
          </span>
          <span
            style={{
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: "var(--ink-800)",
            }}
          >
            {block.title}
          </span>
          {block.note && (
            <span style={{ fontSize: 14, color: "var(--ink-500)", lineHeight: 1.5 }}>
              <RichText text={block.note} />
            </span>
          )}
        </div>
      );
    case "banner":
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "var(--ink-900)",
            color: "var(--snow-900)",
            padding: "18px 24px",
            flexWrap: "wrap",
          }}
        >
          <span
            className="kicker"
            style={{
              background: "var(--blue)",
              color: "var(--snow-900)",
              padding: "7px 13px",
              flexShrink: 0,
            }}
          >
            {block.label}
          </span>
          <span
            style={{
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              lineHeight: 1.35,
            }}
          >
            {block.text}
          </span>
        </div>
      );
  }
}
