"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  INTERFACES_PLAN,
  PEOPLE_PLAN,
  PLAN,
  ROOMS,
  providerBySlug,
  roomBySlug,
  seatBySlug,
  type LayerId,
} from "../data/model";
import { AssignmentBadge } from "./Blocks";
import FloorPlan from "./FloorPlan";
import InterfacesDiagram from "./InterfacesDiagram";
import LayerToggle from "./LayerToggle";
import PeopleDiagram from "./PeopleDiagram";
import ProviderView from "./ProviderView";
import RoomView from "./RoomView";
import SeatView from "./SeatView";

const ZOOM_MS = 500;
const EASE = "cubic-bezier(.4,0,.2,1)";

function zoomForRect(
  rect: { x: number; y: number; w: number; h: number },
  plan: { w: number; h: number }
) {
  const scale = Math.min(plan.w / rect.w, plan.h / rect.h, 4.2);
  const origin = `${((rect.x + rect.w / 2) / plan.w) * 100}% ${((rect.y + rect.h / 2) / plan.h) * 100}%`;
  return { scale, origin };
}

function zoomForRoom(slug: string) {
  const room = roomBySlug(slug);
  return room
    ? zoomForRect(room.rect, PLAN)
    : { scale: 2.4, origin: "50% 50%" };
}

function zoomForSeat(slug: string) {
  const seat = seatBySlug(slug);
  return seat
    ? zoomForRect(seat.rect, PEOPLE_PLAN)
    : { scale: 2.4, origin: "50% 50%" };
}

function zoomForProvider(slug: string) {
  const provider = providerBySlug(slug);
  return provider
    ? zoomForRect(provider.rect, INTERFACES_PLAN)
    : { scale: 2.4, origin: "50% 50%" };
}

export default function Tour() {
  const [layer, setLayer] = useState<LayerId>("mechanics");
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [activeSeat, setActiveSeat] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const [zoom, setZoom] = useState({ scale: 2.4, origin: "50% 50%" });
  const [seatZoom, setSeatZoom] = useState({ scale: 2.4, origin: "50% 50%" });
  const [providerZoom, setProviderZoom] = useState({
    scale: 2.4,
    origin: "50% 50%",
  });
  /** "in" = drawing zooming into a detail; "out" = drawing re-entering. */
  const [planAnim, setPlanAnim] = useState<"none" | "in" | "out">("none");
  const [peopleAnim, setPeopleAnim] = useState<"none" | "in" | "out">("none");
  const [interfacesAnim, setInterfacesAnim] = useState<"none" | "in" | "out">(
    "none"
  );
  const topRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollTop = () =>
    topRef.current?.scrollIntoView({ behavior: "instant", block: "start" });

  const push = (hash: string | null) =>
    window.history.pushState(
      null,
      "",
      hash ? `#${hash}` : window.location.pathname
    );

  const selectRoom = useCallback(
    (slug: string | null) => {
      if (timerRef.current) clearTimeout(timerRef.current);

      const commit = (s: string | null) => {
        setActiveRoom(s);
        push(s);
        scrollTop();
      };

      if (slug === null) {
        setPlanAnim("out");
        commit(null);
        return;
      }
      setZoom(zoomForRoom(slug));
      if (activeRoom !== null) {
        commit(slug);
        return;
      }
      // Plan into a room: play the zoom, but commit on a timer so the
      // content always arrives even if animations are throttled.
      setPlanAnim("in");
      timerRef.current = setTimeout(() => commit(slug), ZOOM_MS);
    },
    [activeRoom]
  );

  const selectSeat = useCallback(
    (slug: string | null) => {
      if (timerRef.current) clearTimeout(timerRef.current);

      const commit = (s: string | null) => {
        setActiveSeat(s);
        push(s ?? "people");
        scrollTop();
      };

      if (slug === null) {
        setPeopleAnim("out");
        commit(null);
        return;
      }
      setSeatZoom(zoomForSeat(slug));
      if (activeSeat !== null) {
        commit(slug);
        return;
      }
      setPeopleAnim("in");
      timerRef.current = setTimeout(() => commit(slug), ZOOM_MS);
    },
    [activeSeat]
  );

  const selectProvider = useCallback(
    (slug: string | null) => {
      if (timerRef.current) clearTimeout(timerRef.current);

      const commit = (s: string | null) => {
        setActiveProvider(s);
        push(s ?? "interfaces");
        scrollTop();
      };

      if (slug === null) {
        setInterfacesAnim("out");
        commit(null);
        return;
      }
      setProviderZoom(zoomForProvider(slug));
      if (activeProvider !== null) {
        commit(slug);
        return;
      }
      setInterfacesAnim("in");
      timerRef.current = setTimeout(() => commit(slug), ZOOM_MS);
    },
    [activeProvider]
  );

  const switchLayer = useCallback((id: LayerId) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setLayer(id);
    setActiveRoom(null);
    setActiveSeat(null);
    setActiveProvider(null);
    setPlanAnim("none");
    setPeopleAnim("none");
    setInterfacesAnim("none");
    push(id === "mechanics" ? null : id);
  }, []);

  // Deep links, back/forward buttons, and in-content [[references]],
  // which are plain anchors whose hash change lands here via popstate.
  useEffect(() => {
    const fromHash = (scroll?: boolean) => {
      const slug = window.location.hash.replace("#", "");
      if (scroll) scrollTop();
      setPlanAnim("none");
      setPeopleAnim("none");
      setInterfacesAnim("none");
      if (slug === "people" || slug === "interfaces") {
        setLayer(slug);
        setActiveRoom(null);
        setActiveSeat(null);
        setActiveProvider(null);
        return;
      }
      const seat = seatBySlug(slug);
      if (seat) {
        setSeatZoom(zoomForSeat(seat.slug));
        setLayer("people");
        setActiveSeat(seat.slug);
        setActiveRoom(null);
        setActiveProvider(null);
        return;
      }
      const provider = providerBySlug(slug);
      if (provider) {
        setProviderZoom(zoomForProvider(provider.slug));
        setLayer("interfaces");
        setActiveProvider(provider.slug);
        setActiveRoom(null);
        setActiveSeat(null);
        return;
      }
      const room = roomBySlug(slug);
      if (room) setZoom(zoomForRoom(room.slug));
      setLayer("mechanics");
      setActiveRoom(room ? room.slug : null);
      setActiveSeat(null);
      setActiveProvider(null);
    };
    fromHash();
    const onPop = () => fromHash(true);
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Escape returns to the drawing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (activeRoom) selectRoom(null);
      else if (activeSeat) selectSeat(null);
      else if (activeProvider) selectProvider(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    activeRoom,
    activeSeat,
    activeProvider,
    selectRoom,
    selectSeat,
    selectProvider,
  ]);

  if (activeRoom !== null) {
    return (
      <div ref={topRef} style={{ scrollMarginTop: 24 }}>
        <div key={activeRoom} style={{ animation: `room-enter 450ms ${EASE} both` }}>
          <RoomView room={roomBySlug(activeRoom)!} onSelect={selectRoom} />
        </div>
      </div>
    );
  }

  if (activeSeat !== null) {
    return (
      <div ref={topRef} style={{ scrollMarginTop: 24 }}>
        <div key={activeSeat} style={{ animation: `room-enter 450ms ${EASE} both` }}>
          <SeatView seat={seatBySlug(activeSeat)!} onSelect={selectSeat} />
        </div>
      </div>
    );
  }

  if (activeProvider !== null) {
    return (
      <div ref={topRef} style={{ scrollMarginTop: 24 }}>
        <div
          key={activeProvider}
          style={{ animation: `room-enter 450ms ${EASE} both` }}
        >
          <ProviderView
            provider={providerBySlug(activeProvider)!}
            onSelect={selectProvider}
          />
        </div>
      </div>
    );
  }

  return (
    <div ref={topRef} style={{ scrollMarginTop: 24 }}>
      <LayerToggle layer={layer} onChange={switchLayer} />

      {layer === "people" && (
        <div
          key="people"
          style={{
            transformOrigin: seatZoom.origin,
            ["--zoom-scale" as string]: seatZoom.scale,
            animation:
              peopleAnim === "in"
                ? `plan-zoom-in ${ZOOM_MS}ms ${EASE} forwards`
                : peopleAnim === "out"
                  ? `plan-zoom-out 550ms ${EASE} both`
                  : `room-enter 450ms ${EASE} both`,
          }}
        >
          <div style={{ maxWidth: 620, margin: "0 auto" }}>
            <PeopleDiagram active={null} onSelect={selectSeat} />
          </div>
          <p
            className="kicker"
            style={{
              textAlign: "center",
              color: "var(--ink-300)",
              marginTop: 28,
            }}
          >
            Click a seat to see how the role changes
          </p>
        </div>
      )}

      {layer === "interfaces" && (
        <div
          key="interfaces"
          style={{
            transformOrigin: providerZoom.origin,
            ["--zoom-scale" as string]: providerZoom.scale,
            animation:
              interfacesAnim === "in"
                ? `plan-zoom-in ${ZOOM_MS}ms ${EASE} forwards`
                : interfacesAnim === "out"
                  ? `plan-zoom-out 550ms ${EASE} both`
                  : `room-enter 450ms ${EASE} both`,
          }}
        >
          <div style={{ maxWidth: 620, margin: "0 auto" }}>
            <InterfacesDiagram active={null} onSelect={selectProvider} />
          </div>
          <p
            className="kicker"
            style={{
              textAlign: "center",
              color: "var(--ink-300)",
              marginTop: 28,
            }}
          >
            Click a provider to see how the money flows
          </p>
        </div>
      )}

      {layer === "mechanics" && (
        <>
          <div
            style={{
              transformOrigin: zoom.origin,
              ["--zoom-scale" as string]: zoom.scale,
              animation:
                planAnim === "in"
                  ? `plan-zoom-in ${ZOOM_MS}ms ${EASE} forwards`
                  : planAnim === "out"
                    ? `plan-zoom-out 550ms ${EASE} both`
                    : undefined,
            }}
          >
            <div style={{ maxWidth: 540, margin: "0 auto" }}>
              <FloorPlan active={null} onSelect={selectRoom} />
            </div>
          </div>

          {/* Index: the document as a straight list, for skimmers */}
          <section
            style={{
              marginTop: 84,
              opacity: planAnim === "in" ? 0 : 1,
              transition: "opacity .3s ease",
            }}
          >
            <div
              className="kicker"
              style={{ color: "var(--ink-300)", marginBottom: 26 }}
            >
              Index · the tour in order
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "44px 1.6fr auto 30px",
                padding: "9px 0",
                borderBottom: "1px solid rgba(0,0,0,.25)",
                columnGap: 18,
              }}
              className="kicker"
            >
              <span style={{ color: "var(--ink-300)" }}>No.</span>
              <span style={{ color: "var(--ink-300)" }}>Job to be done</span>
              <span style={{ color: "var(--ink-300)" }}>Who leads</span>
              <span />
            </div>
            {ROOMS.map((room, i) => (
              <button
                key={room.slug}
                onClick={() => selectRoom(room.slug)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "44px 1.6fr auto 30px",
                  columnGap: 18,
                  alignItems: "center",
                  padding: "15px 0",
                  width: "100%",
                  background: "none",
                  border: "none",
                  borderBottom: "1px solid var(--hairline-10)",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "var(--font-hanken), sans-serif",
                }}
              >
                <span
                  className="mono"
                  style={{ fontSize: 13, color: "var(--ink-200)" }}
                >
                  {String(i).padStart(2, "0")}
                </span>
                <span
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "var(--ink-800)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {room.title}
                </span>
                <span>
                  {room.assignment ? (
                    <AssignmentBadge tone={room.assignment} />
                  ) : (
                    <span className="kicker" style={{ color: "var(--ink-300)" }}>
                      Overview
                    </span>
                  )}
                </span>
                <span
                  className="mono"
                  style={{
                    color: "var(--blue)",
                    fontSize: 15,
                    justifySelf: "end",
                  }}
                >
                  →
                </span>
              </button>
            ))}
          </section>

          {/* Where this leaves us: the document's conclusion */}
          <section
            style={{
              marginTop: 96,
              opacity: planAnim === "in" ? 0 : 1,
              transition: "opacity .3s ease",
            }}
          >
            <div
              className="kicker"
              style={{ color: "var(--blue)", marginBottom: 22 }}
            >
              Where this leaves us
            </div>
            <h2
              className="mono"
              style={{
                fontWeight: 600,
                fontSize: 31,
                letterSpacing: "-0.03em",
                margin: "0 0 18px",
                color: "var(--ink-900)",
              }}
            >
              Read down the list and a clear pattern appears.
            </h2>
            <p
              style={{
                fontSize: 17,
                lineHeight: 1.6,
                color: "var(--ink-700)",
                maxWidth: 680,
                margin: "0 0 16px",
              }}
            >
              The work that wins and keeps business, and the work that carries
              real emotional weight, stays with people: winning valuations,
              negotiating offers, reassuring buyers and sellers through the
              stressful middle, and handing over the keys at the end. The work
              that is repetitive, administrative or purely about speed and
              coverage moves to AI: preparing listings, generating viewings,
              qualifying leads, and chasing solicitors.
            </p>
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.6,
                color: "var(--ink-500)",
                maxWidth: 680,
                margin: "0 0 32px",
              }}
            >
              The jobs in the middle are the interesting ones. Booking
              valuations, managing viewings and progressing sales are all
              places where a person and an AI agent working together beat
              either on their own, because the AI provides the speed and
              consistency while the human provides the judgement and the
              warmth.
            </p>
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
                The prize
              </span>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.35,
                }}
              >
                Not a cheaper agency: an agency where people spend their time
                on the work that wins business and builds relationships.
              </span>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
