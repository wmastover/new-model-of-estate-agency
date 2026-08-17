/**
 * The Atlas: a three-dimensional flow map of the sale.
 *
 * Turns the eight jobs of the sale (from `model.ts`) plus the external
 * providers into a graph of towers on an isometric grid, wired together by
 * lanes that carry animated payloads. The same graph is rendered by
 * `FlowAtlas` in three stylistic variants (blueprint, ledger, circuit).
 *
 * Content is a condensed reading of the model; each node deep-links back to
 * its full section in the main tour via `slug`.
 */

/** Who leads the work, plus map-only tones for wiring and revenue. */
export type AtlasTone = "human" | "hybrid" | "ai" | "neutral" | "revenue";

export interface AtlasNode {
  id: string;
  /** Deep-link target in the main tour, e.g. `#booking-valuations`. */
  slug?: string;
  /** Label drawn on the tower, one entry per line. */
  label: string[];
  /** Small mono sub-label under the title in the info panel. */
  meta: string;
  kind: "job" | "provider" | "origin";
  tone: AtlasTone;
  /** Footprint origin on the grid (integer grid units). */
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
  kind: "pipeline" | "service" | "referral" | "loop";
}

export interface AtlasFlow {
  id: string;
  label: string;
  note: string;
  /** Edge ids activated by this flow. Empty means "all edges". */
  edges: string[];
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
/* Nodes.                                                              */
/* ------------------------------------------------------------------ */

export const NODES: AtlasNode[] = [
  {
    id: "thesis",
    slug: "the-thesis",
    label: ["The", "thesis"],
    meta: "Origin · the kerb",
    kind: "origin",
    tone: "neutral",
    gx: 1,
    gy: 0,
    fw: 1,
    fh: 1,
    height: 1.4,
    index: "00",
    blurb: "Where the tour starts: the whole business, split into eight jobs.",
  },
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
    blurb: "Getting a vendor to a face-to-face valuation. The most valuable thing an agency does.",
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

  /* External providers: the wiring around the pipeline. */
  {
    id: "portals",
    slug: "portals",
    label: ["Portals"],
    meta: "Interface · cost centre",
    kind: "provider",
    tone: "neutral",
    gx: 7,
    gy: 0,
    fw: 1,
    fh: 1,
    height: 1.7,
    blurb: "Rightmove, Zoopla, OnTheMarket. Where nearly all demand comes from.",
  },
  {
    id: "photographer",
    slug: "photographer",
    label: ["Photo-", "grapher"],
    meta: "Interface · cost centre",
    kind: "provider",
    tone: "neutral",
    gx: 7,
    gy: 2,
    fw: 1,
    fh: 1,
    height: 1.1,
    blurb: "Per-instruction photography and video. Usually the pacing item to go live.",
  },
  {
    id: "epc",
    slug: "epc-floorplan",
    label: ["EPC &", "floorplan"],
    meta: "Interface · compliance",
    kind: "provider",
    tone: "neutral",
    gx: 7,
    gy: 4,
    fw: 1,
    fh: 1,
    height: 1.0,
    blurb: "The legal paperwork of marketing. No EPC, no listing.",
  },
  {
    id: "aml",
    slug: "aml-provider",
    label: ["AML", "provider"],
    meta: "Interface · compliance",
    kind: "provider",
    tone: "neutral",
    gx: 7,
    gy: 6,
    fw: 1,
    fh: 1,
    height: 1.2,
    blurb: "Identity and source-of-funds checks the law requires before marketing and completion.",
  },
  {
    id: "removals",
    slug: "removals-trades",
    label: ["Removals", "& trades"],
    meta: "Interface · goodwill",
    kind: "provider",
    tone: "neutral",
    gx: 7,
    gy: 8,
    fw: 1,
    fh: 1,
    height: 0.9,
    blurb: "The moving-day economy. Good service first, not a real revenue line.",
  },
  {
    id: "board",
    slug: "board-contractor",
    label: ["Board", "contractor"],
    meta: "Interface · advertising",
    kind: "provider",
    tone: "neutral",
    gx: -1,
    gy: 2,
    fw: 1,
    fh: 1,
    height: 0.9,
    blurb: "For sale and sold boards. A tiny cost that doubles as street-level advertising.",
  },
  {
    id: "mortgage",
    slug: "mortgage-advisor",
    label: ["Mortgage", "advisor"],
    meta: "Interface · revenue stream",
    kind: "provider",
    tone: "revenue",
    gx: -1,
    gy: 4,
    fw: 1,
    fh: 1,
    height: 1.4,
    blurb: "~£400 per completed introduction. The most reliable, under-collected fee in the business.",
  },
  {
    id: "conveyancer",
    slug: "conveyancer",
    label: ["Convey-", "ancer"],
    meta: "Interface · revenue stream",
    kind: "provider",
    tone: "revenue",
    gx: -1,
    gy: 6,
    fw: 1,
    fh: 1,
    height: 1.5,
    blurb: "The legal engine of the sale, and a referral fee the agency can earn twice per transaction.",
  },
];

export function atlasNodeById(id: string): AtlasNode | undefined {
  return NODES.find((n) => n.id === id);
}

/* ------------------------------------------------------------------ */
/* Edges.                                                              */
/* ------------------------------------------------------------------ */

export const EDGES: AtlasEdge[] = [
  // The pipeline: the sale, job by job.
  { id: "p0", from: "thesis", to: "booking", kind: "pipeline" },
  { id: "p1", from: "booking", to: "winning", kind: "pipeline" },
  { id: "p2", from: "winning", to: "takingon", kind: "pipeline" },
  { id: "p3", from: "takingon", to: "marketing", kind: "pipeline" },
  { id: "p4", from: "marketing", to: "viewings", kind: "pipeline" },
  { id: "p5", from: "viewings", to: "negotiating", kind: "pipeline" },
  { id: "p6", from: "negotiating", to: "progressing", kind: "pipeline" },
  { id: "p7", from: "progressing", to: "completing", kind: "pipeline" },

  // Repeat business: completion feeds the next instruction.
  { id: "loop", from: "completing", to: "booking", kind: "loop" },

  // Service wiring to external providers.
  { id: "s-book-portals", from: "portals", to: "booking", kind: "service" },
  { id: "s-take-photo", from: "takingon", to: "photographer", kind: "service" },
  { id: "s-take-epc", from: "takingon", to: "epc", kind: "service" },
  { id: "s-take-aml", from: "takingon", to: "aml", kind: "service" },
  { id: "s-take-board", from: "takingon", to: "board", kind: "service" },
  { id: "s-mkt-portals", from: "marketing", to: "portals", kind: "service" },
  { id: "s-view-portals", from: "viewings", to: "portals", kind: "service" },
  { id: "s-neg-board", from: "negotiating", to: "board", kind: "service" },
  { id: "s-prog-aml", from: "progressing", to: "aml", kind: "service" },
  { id: "s-comp-board", from: "completing", to: "board", kind: "service" },
  { id: "s-comp-removals", from: "completing", to: "removals", kind: "service" },

  // Referral revenue.
  { id: "r-view-mortgage", from: "viewings", to: "mortgage", kind: "referral" },
  { id: "r-prog-conveyancer", from: "progressing", to: "conveyancer", kind: "referral" },
];

export function atlasEdgeById(id: string): AtlasEdge | undefined {
  return EDGES.find((e) => e.id === id);
}

/* ------------------------------------------------------------------ */
/* Flows: named journeys that light up a subset of the map.            */
/* ------------------------------------------------------------------ */

export const FLOWS: AtlasFlow[] = [
  {
    id: "all",
    label: "The whole map",
    note: "Every job and every wire, live at once.",
    edges: [],
  },
  {
    id: "sale",
    label: "A house sells",
    note: "The eight jobs in order, then repeat business.",
    edges: ["p0", "p1", "p2", "p3", "p4", "p5", "p6", "p7", "loop"],
  },
  {
    id: "lead",
    label: "A lead is won",
    note: "From a portal enquiry to a signed instruction.",
    edges: ["s-book-portals", "p0", "p1"],
  },
  {
    id: "listing",
    label: "A listing goes live",
    note: "Instruction to fully live on the portals.",
    edges: [
      "p2",
      "s-take-photo",
      "s-take-epc",
      "s-take-aml",
      "s-take-board",
      "p3",
      "s-mkt-portals",
    ],
  },
  {
    id: "offer",
    label: "An offer completes",
    note: "Viewing feedback to keys in hand.",
    edges: ["p5", "p6", "s-prog-aml", "r-prog-conveyancer", "p7", "s-comp-board", "s-comp-removals"],
  },
  {
    id: "money",
    label: "The money",
    note: "Where referral revenue actually flows.",
    edges: ["r-view-mortgage", "r-prog-conveyancer"],
  },
];
