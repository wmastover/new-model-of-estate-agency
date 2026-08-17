import Link from "next/link";
import Tour from "../components/Tour";

export default function Home() {
  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px", width: "100%" }}>
      {/* Masthead */}
      <header
        style={{
          padding: "72px 0 52px",
          borderBottom: "1px solid var(--hairline-10)",
          marginBottom: 64,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 56,
            flexWrap: "wrap",
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
            <span
              className="mono"
              style={{
                fontSize: 20,
                fontWeight: 500,
                letterSpacing: 2,
                color: "var(--ink-800)",
              }}
            >
              AIP
            </span>
            <span
              className="aip-caret"
              style={{
                display: "inline-block",
                width: 8,
                height: 16,
                background: "var(--blue)",
              }}
            />
          </span>
          <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: "-0.01em" }}>
            Applied Intelligence Partners
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "1px solid var(--hairline-16)",
              borderRadius: 2,
              padding: "6px 11px",
              fontSize: 12,
              color: "var(--ink-500)",
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                background: "var(--ink-800)",
                transform: "rotate(45deg)",
                display: "inline-block",
              }}
            />
            Backed by Antler
          </span>
          <Link
            href="/atlas"
            className="mono"
            style={{
              marginLeft: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "1px solid var(--blue)",
              borderRadius: 2,
              padding: "6px 12px",
              fontSize: 12,
              color: "var(--blue)",
              textDecoration: "none",
            }}
          >
            View the 3D atlas →
          </Link>
        </div>

        <div className="kicker" style={{ color: "var(--blue)", marginBottom: 22 }}>
          Operating model · working draft · July 2026
        </div>
        <h1
          className="mono"
          style={{
            fontWeight: 600,
            fontSize: "clamp(38px, 6vw, 60px)",
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
            margin: "0 0 20px",
            color: "var(--ink-900)",
          }}
        >
          A new model of estate&nbsp;agency.
        </h1>
        <p
          style={{
            fontSize: 18,
            lineHeight: 1.6,
            color: "var(--ink-500)",
            maxWidth: 680,
            margin: "0 0 34px",
          }}
        >
          How UK residential estate agency actually works, job by job, and
          exactly where AI changes the economics. Not AI replacing the agent:
          the work splits into three kinds, and each kind should be handled
          differently. Detailed enough to build an agency from scratch. Step
          through the property below.
        </p>

        {/* Legend */}
        <div
          style={{
            display: "flex",
            gap: 28,
            flexWrap: "wrap",
            borderTop: "1px solid var(--hairline-10)",
            paddingTop: 20,
          }}
        >
          {(
            [
              [
                "rgba(15,16,17,.07)",
                "Human-led: trust-critical, relationship-defining",
              ],
              [
                "repeating-linear-gradient(45deg, rgba(47,111,224,.30) 0 1.5px, rgba(47,111,224,.06) 1.5px 8px)",
                "Human + AI: side by side",
              ],
              [
                "rgba(47,111,224,.18)",
                "AI-led: repetitive, process-driven",
              ],
            ] as const
          ).map(([swatch, label]) => (
            <span
              key={label}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                fontSize: 14,
                color: "var(--ink-500)",
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  flexShrink: 0,
                  background: swatch,
                  border: "1px solid var(--hairline-16)",
                }}
              />
              {label}
            </span>
          ))}
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <Tour />
      </main>

      <footer
        className="mono"
        style={{
          marginTop: 110,
          borderTop: "1px solid var(--hairline-10)",
          padding: "40px 0 80px",
          color: "var(--ink-300)",
          fontSize: 13,
          display: "flex",
          justifyContent: "space-between",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <span>AIP · Applied Intelligence Partners</span>
        <span>A new model of estate agency · working draft · content will change, the rooms won&apos;t</span>
      </footer>
    </div>
  );
}
