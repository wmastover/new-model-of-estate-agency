/**
 * The Atlas: three isometric maps of the agency, one per kind of thing.
 *
 * The model contains three different kinds of entity, and mixing them on
 * one drawing made the drawing lie. So the atlas is three maps:
 *
 *  - Organisations: the agency as one company among the companies it
 *    trades with, and how the money flows between them (from `PROVIDERS`).
 *  - People: the seats inside the agency, the agent layer they delegate
 *    to, and the vendor and buyer everyone serves (from `SEATS`).
 *  - Process: the eight jobs a sale passes through, in order, with the
 *    repeat-business loop (from `ROOMS`).
 *
 * All three maps share one geometry and one renderer (`FlowAtlas`), which
 * draws each in three stylistic variants (blueprint, ledger, circuit).
 * Content is a condensed reading of the model; nodes deep-link back to
 * their full section in the main tour via `slug`.
 */

/** Colour role of a tower. What it means is defined per map by `legend`. */
export type AtlasTone = "human" | "hybrid" | "ai" | "neutral" | "revenue";

export interface AtlasNode {
  id: string;
  /** Deep-link target in the main tour, e.g. `#booking-valuations`. */
  slug?: string;
  /** Label drawn on the tower, one entry per line. */
  label: string[];
  /** Small mono sub-label under the title in the info panel. */
  meta: string;
  kind: "job" | "seat" | "client" | "agent" | "agency" | "org";
  tone: AtlasTone;
  /** Footprint origin on the grid (grid units). */
  gx: number;
  gy: number;
  /** Footprint size in grid units. */
  fw: number;
  fh: number;
  /** Tower height in grid units (multiplied by ELEV for pixels). */
  height: number;
  /** Ordinal shown on pipeline towers, e.g. "01". */
  index?: string;
  /** One-line description for the tooltip and info panel. */
  blurb: string;
}

export interface AtlasEdge {
  id: string;
  from: string;
  to: string;
  /**
   * Visual style of the lane. What each style means is defined per map:
   *  - "flow": solid, the main sequence of the map
   *  - "support": dotted, supporting wiring
   *  - "money": gold, the relationships worth money
   *  - "cadence": dashed, a recurring rhythm (oversight, repeat business)
   */
  kind: "flow" | "support" | "money" | "cadence";
  /** Horizontal bow of the lane in px; 0 or absent draws a straight lane. */
  bend?: number;
}

export interface AtlasFlow {
  id: string;
  label: string;
  note: string;
  /** Edge ids activated by this flow. Empty means "all edges". */
  edges: string[];
}

export interface AtlasMapDef {
  id: string;
  /** Tab label in the HUD. */
  label: string;
  /** One-line answer to "what am I looking at". */
  note: string;
  /** Longer copy for the page below the drawing. */
  description: string;
  nodes: AtlasNode[];
  edges: AtlasEdge[];
  flows: AtlasFlow[];
  /** Tone swatches shown in the legend, with map-specific meanings. */
  legend: { tone: AtlasTone; label: string }[];
  /** Badge labels in the info panel, per tone, map-specific. */
  toneLabels: Partial<Record<AtlasTone, string>>;
}

/* ------------------------------------------------------------------ */
/* Isometric projection: a 2:1 grid, towers rising along -y.           */
/* ------------------------------------------------------------------ */

export const TILE_W = 64;
export const TILE_H = 32;
/** Pixels of rise per grid unit of height. */
export const ELEV = 26;

export interface Pt {
  x: number;
  y: number;
}

export function iso(gx: number, gy: number, gz = 0): Pt {
  return {
    x: (gx - gy) * (TILE_W / 2),
    y: (gx + gy) * (TILE_H / 2) - gz,
  };
}

/* ------------------------------------------------------------------ */
/* Map 1: Organisations. The agency in the middle of the market,       */
/* ringed by the companies it trades with. Lane grammar: solid is      */
/* demand coming in, dotted is money going out, gold is money coming   */
/* back in as referral fees.                                           */
/* ------------------------------------------------------------------ */

const ORG_NODES: AtlasNode[] = [
  {
    id: "agency",
    slug: "the-thesis",
    label: ["The", "agency"],
    meta: "The business · centre of the map",
    kind: "agency",
    tone: "hybrid",
    gx: 3,
    gy: 3,
    fw: 2,
    fh: 2,
    height: 3.4,
    blurb:
      "The estate agency itself: the company every other organisation on this map bills, supplies or pays.",
  },
  {
    id: "portals",
    slug: "portals",
    label: ["Portals"],
    meta: "Supplier · the biggest bill",
    kind: "org",
    tone: "neutral",
    gx: 4,
    gy: 0,
    fw: 1,
    fh: 1,
    height: 2.2,
    blurb:
      "Rightmove, Zoopla and OnTheMarket. Nearly all demand arrives through them, and they charge the biggest marketing bill the agency pays.",
  },
  {
    id: "photographer",
    slug: "photographer",
    label: ["Photo-", "grapher"],
    meta: "Supplier · per instruction",
    kind: "org",
    tone: "neutral",
    gx: 7,
    gy: 1,
    fw: 1,
    fh: 1,
    height: 1.1,
    blurb:
      "Per-instruction photography and video, usually the pacing item between a signed agreement and a live listing.",
  },
  {
    id: "epc",
    slug: "epc-floorplan",
    label: ["EPC &", "floorplan"],
    meta: "Supplier · compliance",
    kind: "org",
    tone: "neutral",
    gx: 8,
    gy: 4,
    fw: 1,
    fh: 1,
    height: 1.0,
    blurb:
      "The energy assessor behind the legal paperwork of marketing. No EPC, no listing.",
  },
  {
    id: "aml",
    slug: "aml-provider",
    label: ["AML", "provider"],
    meta: "Supplier · compliance",
    kind: "org",
    tone: "neutral",
    gx: 7,
    gy: 7,
    fw: 1,
    fh: 1,
    height: 1.1,
    blurb:
      "The outsourced identity and source-of-funds checks the law requires before marketing and completion.",
  },
  {
    id: "removals",
    slug: "removals-trades",
    label: ["Removals", "& trades"],
    meta: "Partner · goodwill",
    kind: "org",
    tone: "neutral",
    gx: 4,
    gy: 8,
    fw: 1,
    fh: 1,
    height: 0.9,
    blurb:
      "The moving-day economy. Recommendations are good service first; the tens of pounds in commission are not the point.",
  },
  {
    id: "board",
    slug: "board-contractor",
    label: ["Board", "contractor"],
    meta: "Supplier · advertising",
    kind: "org",
    tone: "neutral",
    gx: 1,
    gy: 7,
    fw: 1,
    fh: 1,
    height: 0.9,
    blurb:
      "For sale and sold boards. A tiny cost that doubles as street-level advertising.",
  },
  {
    id: "conveyancer",
    slug: "conveyancer",
    label: ["Convey-", "ancer"],
    meta: "Partner · pays referral fees",
    kind: "org",
    tone: "revenue",
    gx: 0,
    gy: 4,
    fw: 1,
    fh: 1,
    height: 1.6,
    blurb:
      "The legal engine of the sale, and a referral fee of £150 to £300 the agency can earn twice per transaction.",
  },
  {
    id: "mortgage",
    slug: "mortgage-advisor",
    label: ["Mortgage", "advisor"],
    meta: "Partner · pays referral fees",
    kind: "org",
    tone: "revenue",
    gx: 1,
    gy: 1,
    fw: 1,
    fh: 1,
    height: 1.5,
    blurb:
      "~£400 per completed introduction. The most reliable, under-collected fee in the business.",
  },
];

const ORG_EDGES: AtlasEdge[] = [
  // Demand flowing into the business.
  { id: "demand", from: "portals", to: "agency", kind: "flow", bend: 70 },

  // Money going out: subscriptions, per-job fees, compliance costs.
  { id: "out-portals", from: "agency", to: "portals", kind: "support" },
  { id: "out-photo", from: "agency", to: "photographer", kind: "support" },
  { id: "out-epc", from: "agency", to: "epc", kind: "support" },
  { id: "out-aml", from: "agency", to: "aml", kind: "support" },
  { id: "out-board", from: "agency", to: "board", kind: "support" },

  // Goodwill: recommendations, not a real revenue line.
  { id: "out-removals", from: "agency", to: "removals", kind: "support" },

  // Money coming back in as referral fees.
  { id: "in-conveyancer", from: "conveyancer", to: "agency", kind: "money" },
  { id: "in-mortgage", from: "mortgage", to: "agency", kind: "money" },
];

const ORG_FLOWS: AtlasFlow[] = [
  {
    id: "all",
    label: "The whole market",
    note: "Every organisation the agency trades with, live at once.",
    edges: [],
  },
  {
    id: "demand",
    label: "Where demand arrives",
    note: "Enquiries flow in from the portals; almost nowhere else.",
    edges: ["demand"],
  },
  {
    id: "money-out",
    label: "Money out",
    note: "Subscriptions, per-instruction fees and compliance costs.",
    edges: ["out-portals", "out-photo", "out-epc", "out-aml", "out-board"],
  },
  {
    id: "money-in",
    label: "Money in",
    note: "Referral fees: the only wires on this map that pay the agency.",
    edges: ["in-conveyancer", "in-mortgage"],
  },
  {
    id: "compliance",
    label: "The compliance wiring",
    note: "EPC and AML: the checks the law requires before marketing and completion.",
    edges: ["out-epc", "out-aml"],
  },
];

/* ------------------------------------------------------------------ */
/* Map 2: People. The seats in a row, the branch manager behind them,  */
/* the agent layer as a low slab beneath them, and the vendor and      */
/* buyer at the edges. Lane grammar: solid is the sale changing hands  */
/* between seats, dotted is work delegated to the agent layer, gold is */
/* the client-facing conversations the model refuses to automate,      */
/* dashed is management oversight.                                     */
/* ------------------------------------------------------------------ */

const PEOPLE_NODES: AtlasNode[] = [
  {
    id: "branch",
    slug: "branch-manager",
    label: ["Branch", "manager"],
    meta: "Seat · oversees every job",
    kind: "seat",
    tone: "human",
    gx: 4,
    gy: 0,
    fw: 1,
    fh: 1,
    height: 3.4,
    blurb:
      "Owns the branch: the P&L, the standards, and the judgement calls nobody else should make.",
  },
  {
    id: "valuation",
    slug: "valuation-manager",
    label: ["Valuation", "manager"],
    meta: "Seat · owns jobs 01–02",
    kind: "seat",
    tone: "human",
    gx: 1,
    gy: 2,
    fw: 1,
    fh: 1,
    height: 2.9,
    blurb:
      "Wins instructions: first through the door, best prepared in the living room. The most human seat in the branch.",
  },
  {
    id: "admin",
    slug: "admin-marketing",
    label: ["Admin &", "marketing"],
    meta: "Seat · owns jobs 03–04",
    kind: "seat",
    tone: "human",
    gx: 3,
    gy: 2,
    fw: 1,
    fh: 1,
    height: 2.0,
    blurb:
      "Runs the machine that takes listings live and keeps viewings coming. The seat the agent layer changes most.",
  },
  {
    id: "negotiator",
    slug: "sales-negotiator",
    label: ["Sales", "negotiator"],
    meta: "Seat · owns jobs 05–06",
    kind: "seat",
    tone: "human",
    gx: 5,
    gy: 2,
    fw: 1,
    fh: 1,
    height: 2.7,
    blurb:
      "Turns enquiries into offers: the viewing, the feedback call, and the referral value nobody captures consistently.",
  },
  {
    id: "progressor",
    slug: "sales-progressor",
    label: ["Sales", "progressor"],
    meta: "Seat · owns job 07",
    kind: "seat",
    tone: "human",
    gx: 7,
    gy: 2,
    fw: 1,
    fh: 1,
    height: 2.5,
    blurb:
      "Holds agreed sales together for the three months between yes and keys: a chase and a counselling service, side by side.",
  },
  {
    id: "agent-layer",
    label: ["The agent layer"],
    meta: "AI · works for every seat",
    kind: "agent",
    tone: "ai",
    gx: 2,
    gy: 4,
    fw: 4,
    fh: 1,
    height: 0.7,
    blurb:
      "The AI workforce under the floor: every seat hands it the repetitive coverage work and keeps the judgement and the warmth.",
  },
  {
    id: "vendor",
    label: ["The", "vendor"],
    meta: "Client · pays the fee",
    kind: "client",
    tone: "neutral",
    gx: 0,
    gy: 5,
    fw: 1,
    fh: 1,
    height: 1.8,
    blurb:
      "The person selling the house, and the only person on this map who pays the agency. Every gold wire exists to keep them.",
  },
  {
    id: "buyer",
    label: ["The", "buyer"],
    meta: "Client · buys the house",
    kind: "client",
    tone: "neutral",
    gx: 8,
    gy: 4,
    fw: 1,
    fh: 1,
    height: 1.8,
    blurb:
      "Doesn't pay the agency's bills, but is an excellent long-term investment: today's buyer is a future vendor.",
  },
];

const PEOPLE_EDGES: AtlasEdge[] = [
  // The sale changing hands between seats, in job order.
  { id: "h1", from: "valuation", to: "admin", kind: "flow" },
  { id: "h2", from: "admin", to: "negotiator", kind: "flow" },
  { id: "h3", from: "negotiator", to: "progressor", kind: "flow" },

  // Work delegated to the agent layer.
  { id: "d-branch", from: "branch", to: "agent-layer", kind: "support" },
  { id: "d-valuation", from: "valuation", to: "agent-layer", kind: "support" },
  { id: "d-admin", from: "admin", to: "agent-layer", kind: "support" },
  { id: "d-negotiator", from: "negotiator", to: "agent-layer", kind: "support" },
  { id: "d-progressor", from: "progressor", to: "agent-layer", kind: "support" },

  // Management by exception.
  { id: "o-valuation", from: "branch", to: "valuation", kind: "cadence" },
  { id: "o-admin", from: "branch", to: "admin", kind: "cadence" },
  { id: "o-negotiator", from: "branch", to: "negotiator", kind: "cadence" },
  { id: "o-progressor", from: "branch", to: "progressor", kind: "cadence" },

  // The client-facing conversations that stay human.
  { id: "c-valuation-vendor", from: "valuation", to: "vendor", kind: "money" },
  { id: "c-branch-vendor", from: "branch", to: "vendor", kind: "money", bend: -120 },
  { id: "c-progressor-vendor", from: "progressor", to: "vendor", kind: "money", bend: -60 },
  { id: "c-negotiator-buyer", from: "negotiator", to: "buyer", kind: "money" },
  { id: "c-progressor-buyer", from: "progressor", to: "buyer", kind: "money" },
];

const PEOPLE_FLOWS: AtlasFlow[] = [
  {
    id: "all",
    label: "The whole floor",
    note: "Every seat, both clients and the agent layer, live at once.",
    edges: [],
  },
  {
    id: "handoffs",
    label: "The sale changes hands",
    note: "One instruction, four seats: valuation to admin to negotiator to progressor.",
    edges: ["h1", "h2", "h3"],
  },
  {
    id: "vendor",
    label: "Serving the vendor",
    note: "The conversations that win and keep the instruction. All human.",
    edges: ["c-valuation-vendor", "c-branch-vendor", "c-progressor-vendor"],
  },
  {
    id: "buyer",
    label: "Serving the buyer",
    note: "Viewings, offers and reassurance through the stressful middle.",
    edges: ["c-negotiator-buyer", "c-progressor-buyer"],
  },
  {
    id: "delegation",
    label: "Work moving to agents",
    note: "The repetitive coverage work every seat hands to the agent layer.",
    edges: ["d-branch", "d-valuation", "d-admin", "d-negotiator", "d-progressor"],
  },
  {
    id: "oversight",
    label: "Management by exception",
    note: "The manager steps in where a human changes the outcome, not to ask for status.",
    edges: ["o-valuation", "o-admin", "o-negotiator", "o-progressor"],
  },
];

/* ------------------------------------------------------------------ */
/* Map 3: Process. The eight jobs of the sale as a serpentine          */
/* pipeline, with completion feeding the next instruction. Lane        */
/* grammar: solid is the sale moving to the next job, dashed is        */
/* repeat business.                                                    */
/* ------------------------------------------------------------------ */

const PROCESS_NODES: AtlasNode[] = [
  {
    id: "booking",
    slug: "booking-valuations",
    label: ["Booking", "valuations"],
    meta: "Job 01 · Human + AI",
    kind: "job",
    tone: "hybrid",
    gx: 3,
    gy: 0,
    fw: 1,
    fh: 1,
    height: 3.2,
    index: "01",
    blurb:
      "Getting a vendor to a face-to-face valuation. The most valuable thing an agency does.",
  },
  {
    id: "winning",
    slug: "winning-valuations",
    label: ["Winning", "valuations"],
    meta: "Job 02 · Human-led",
    kind: "job",
    tone: "human",
    gx: 5,
    gy: 1,
    fw: 1,
    fh: 1,
    height: 3.0,
    index: "02",
    blurb: "Turning the appointment into a signed instruction, on the vendor's sofa.",
  },
  {
    id: "takingon",
    slug: "taking-on-properties",
    label: ["Taking on", "properties"],
    meta: "Job 03 · AI-led",
    kind: "job",
    tone: "ai",
    gx: 5,
    gy: 3,
    fw: 1,
    fh: 1,
    height: 1.9,
    index: "03",
    blurb: "Signed agreement to fully live on Rightmove. Pure process.",
  },
  {
    id: "marketing",
    slug: "marketing-properties",
    label: ["Marketing", "properties"],
    meta: "Job 04 · AI-led",
    kind: "job",
    tone: "ai",
    gx: 3,
    gy: 3,
    fw: 1,
    fh: 1,
    height: 2.1,
    index: "04",
    blurb: "The ongoing lead generation that keeps viewings coming in.",
  },
  {
    id: "viewings",
    slug: "managing-viewings",
    label: ["Managing", "viewings"],
    meta: "Job 05 · Human + AI",
    kind: "job",
    tone: "hybrid",
    gx: 1,
    gy: 4,
    fw: 1,
    fh: 1,
    height: 2.6,
    index: "05",
    blurb: "Enquiry through to feedback or an offer. Qualify fast, view in person.",
  },
  {
    id: "negotiating",
    slug: "negotiating-the-sale",
    label: ["Negotiating", "the sale"],
    meta: "Job 06 · Human-led",
    kind: "job",
    tone: "human",
    gx: 1,
    gy: 6,
    fw: 1,
    fh: 1,
    height: 3.0,
    index: "06",
    blurb: "Taking an offer to the vendor. Life-changing news, delivered by a person.",
  },
  {
    id: "progressing",
    slug: "progressing-the-sale",
    label: ["Progressing", "the sale"],
    meta: "Job 07 · Human + AI",
    kind: "job",
    tone: "hybrid",
    gx: 3,
    gy: 7,
    fw: 1,
    fh: 1,
    height: 2.2,
    index: "07",
    blurb: "Holding an agreed sale together for the three months to completion.",
  },
  {
    id: "completing",
    slug: "completing-the-sale",
    label: ["Completing", "the sale"],
    meta: "Job 08 · Human-led",
    kind: "job",
    tone: "human",
    gx: 5,
    gy: 7,
    fw: 1,
    fh: 1,
    height: 2.8,
    index: "08",
    blurb: "Handing over the keys, and the start of a long relationship.",
  },
];

const PROCESS_EDGES: AtlasEdge[] = [
  { id: "p1", from: "booking", to: "winning", kind: "flow" },
  { id: "p2", from: "winning", to: "takingon", kind: "flow" },
  { id: "p3", from: "takingon", to: "marketing", kind: "flow" },
  { id: "p4", from: "marketing", to: "viewings", kind: "flow" },
  { id: "p5", from: "viewings", to: "negotiating", kind: "flow" },
  { id: "p6", from: "negotiating", to: "progressing", kind: "flow" },
  { id: "p7", from: "progressing", to: "completing", kind: "flow" },

  // Repeat business: completion feeds the next instruction.
  { id: "repeat", from: "completing", to: "booking", kind: "cadence", bend: 340 },
];

const PROCESS_FLOWS: AtlasFlow[] = [
  {
    id: "all",
    label: "The whole pipeline",
    note: "All eight jobs in order, plus repeat business.",
    edges: [],
  },
  {
    id: "instruction",
    label: "Winning the instruction",
    note: "Jobs 01–02: from first contact to a signature on the sofa.",
    edges: ["p1"],
  },
  {
    id: "to-market",
    label: "Getting to market",
    note: "Jobs 03–04: signed agreement to live listing pulling viewings.",
    edges: ["p2", "p3"],
  },
  {
    id: "to-offer",
    label: "Finding the buyer",
    note: "Jobs 05–06: enquiries qualified, viewings done, an offer accepted.",
    edges: ["p4", "p5"],
  },
  {
    id: "to-keys",
    label: "Closing and completing",
    note: "Jobs 07–08: three months of chasing and reassurance, then the keys.",
    edges: ["p6", "p7"],
  },
  {
    id: "repeat",
    label: "Repeat business",
    note: "A good completion is the cheapest valuation lead there is.",
    edges: ["repeat"],
  },
];

/* ------------------------------------------------------------------ */
/* The three maps.                                                     */
/* ------------------------------------------------------------------ */

export const ATLAS_MAPS: AtlasMapDef[] = [
  {
    id: "organisations",
    label: "Organisations",
    note: "The companies the agency trades with, and how the money flows.",
    description:
      "The agency in the middle of its market. Around it, every organisation it trades with: the portals that supply nearly all demand, the suppliers it pays per instruction, the compliance providers the law requires, and the two partners that pay referral fees back. Dotted lanes are money out, gold lanes are money in.",
    nodes: ORG_NODES,
    edges: ORG_EDGES,
    flows: ORG_FLOWS,
    legend: [
      { tone: "hybrid", label: "The agency" },
      { tone: "neutral", label: "Cost centre" },
      { tone: "revenue", label: "Pays the agency" },
    ],
    toneLabels: {
      hybrid: "The agency",
      neutral: "Cost centre",
      revenue: "Revenue stream",
    },
  },
  {
    id: "people",
    label: "People",
    note: "The seats, the agent layer beneath them, and the two clients.",
    description:
      "Who actually does the work. Four seats pass the sale between them in job order, the branch manager oversees by exception, and the agent layer sits under the whole floor taking the repetitive coverage work. The vendor and buyer stand at the edges: the gold lanes are the client conversations the model refuses to automate.",
    nodes: PEOPLE_NODES,
    edges: PEOPLE_EDGES,
    flows: PEOPLE_FLOWS,
    legend: [
      { tone: "human", label: "A seat (person)" },
      { tone: "ai", label: "The agent layer" },
      { tone: "neutral", label: "A client" },
    ],
    toneLabels: {
      human: "Seat · a person",
      ai: "The agent layer",
      neutral: "Client",
    },
  },
  {
    id: "process",
    label: "Process",
    note: "The eight jobs a sale passes through, in order.",
    description:
      "What has to happen for a house to sell, drawn as a pipeline. Each tower is one of the eight jobs, colour-coded by who leads it under the model: human where trust wins business, AI where process wins margin, both together everywhere else. The dashed return lane is repeat business feeding the next instruction.",
    nodes: PROCESS_NODES,
    edges: PROCESS_EDGES,
    flows: PROCESS_FLOWS,
    legend: [
      { tone: "human", label: "Human-led" },
      { tone: "hybrid", label: "Human + AI" },
      { tone: "ai", label: "AI-led" },
    ],
    toneLabels: {
      human: "Human-led",
      hybrid: "Human + AI",
      ai: "AI-led",
    },
  },
];

export function atlasMapById(id: string): AtlasMapDef | undefined {
  return ATLAS_MAPS.find((m) => m.id === id);
}
