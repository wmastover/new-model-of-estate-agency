import Link from "next/link";
import type { Metadata } from "next";
import FlowAtlas from "../../components/FlowAtlas";
import { ATLAS_MAPS } from "../../data/atlas";

export const metadata: Metadata = {
  title: "The Atlas · A New Model of Estate Agency",
  description:
    "Three isometric maps of a modern estate agency: the organisations it trades with, the people inside it, and the process a sale runs through. By Applied Intelligence Partners.",
};

export default function AtlasPage() {
  return (
    <div
      style={{
        maxWidth: 1180,
        margin: "0 auto",
        padding: "0 24px",
        width: "100%",
      }}
    >
      <header
        style={{
          padding: "52px 0 34px",
          borderBottom: "1px solid var(--hairline-10)",
          marginBottom: 40,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            marginBottom: 40,
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
          <Link
            href="/"
            className="mono"
            style={{
              marginLeft: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "1px solid var(--hairline-16)",
              borderRadius: 2,
              padding: "7px 13px",
              fontSize: 12,
              color: "var(--ink-500)",
              textDecoration: "none",
            }}
          >
            ← Back to the walkthrough
          </Link>
        </div>

        <div className="kicker" style={{ color: "var(--blue)", marginBottom: 20 }}>
          The atlas · interactive · working draft
        </div>
        <h1
          className="mono"
          style={{
            fontWeight: 600,
            fontSize: "clamp(32px, 5vw, 50px)",
            letterSpacing: "-0.035em",
            lineHeight: 1.04,
            margin: "0 0 18px",
            color: "var(--ink-900)",
          }}
        >
          Three maps of one agency.
        </h1>
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.6,
            color: "var(--ink-500)",
            maxWidth: 680,
            margin: 0,
          }}
        >
          The model contains three different kinds of thing, so it gets three
          different maps: the organisations the agency trades with, the people
          who do the work, and the process a sale runs through. Switch maps in
          the top-left corner, pick a flow to trace one journey, click a tower
          to read its section, and redraw the whole thing in three styles.
        </p>
      </header>

      <main style={{ flex: 1 }}>
        <FlowAtlas />

        <section style={{ margin: "40px 0 0", maxWidth: 720 }}>
          <div
            className="kicker"
            style={{ color: "var(--ink-300)", marginBottom: 16 }}
          >
            One drawing per kind of thing
          </div>
          <div style={{ display: "grid", gap: 24 }}>
            {ATLAS_MAPS.map((m, i) => (
              <div key={m.id}>
                <div
                  className="mono"
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--ink-800)",
                    marginBottom: 6,
                  }}
                >
                  {String(i + 1).padStart(2, "0")} · {m.label}
                </div>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: "var(--ink-500)",
                    margin: 0,
                  }}
                >
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ margin: "40px 0 24px", maxWidth: 720 }}>
          <div
            className="kicker"
            style={{ color: "var(--ink-300)", marginBottom: 16 }}
          >
            Three renderings of each map
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 20,
            }}
          >
            {[
              [
                "Blueprint",
                "The drafting cyanotype: white wireframe towers on drawing-office blue, the way the plan started life.",
              ],
              [
                "Ledger",
                "The warm-paper variant that matches the walkthrough: solid, colour-coded towers casting soft shadows.",
              ],
              [
                "Circuit",
                "The neon night board: dark towers with emissive edges and glowing packets running the lanes.",
              ],
            ].map(([title, body]) => (
              <div key={title}>
                <div
                  className="mono"
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "var(--ink-800)",
                    marginBottom: 6,
                  }}
                >
                  {title}
                </div>
                <p
                  style={{
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: "var(--ink-500)",
                    margin: 0,
                  }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer
        className="mono"
        style={{
          marginTop: 70,
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
        <span>A new model of estate agency · the atlas · working draft</span>
      </footer>
    </div>
  );
}
