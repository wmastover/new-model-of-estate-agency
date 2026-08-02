/**
 * A New Model of Estate Agency: content model.
 *
 * Working draft. Section (room) structure is stable; copy lives in the
 * `blocks` arrays, so edits should mostly happen there.
 */

/** Who leads the work. Replaces the 🟥🟨🟩 emoji from the source doc. */
export type Assignment = "human" | "hybrid" | "ai";

export const ASSIGNMENT_META: Record<
  Assignment,
  { label: string; description: string }
> = {
  human: {
    label: "Human-led",
    description:
      "Some work should stay with a person because handing it to a machine would damage the customer experience or lose the sale. This is the high-stakes, high-emotion, relationship-defining work.",
  },
  hybrid: {
    label: "Human + AI",
    description:
      "Some work is best done by a person and an AI agent operating side by side, with the AI handling speed, coverage and admin, and the human handling judgement and warmth.",
  },
  ai: {
    label: "AI-led",
    description:
      "Some work is repetitive and process-driven. It should be led by AI so that people are freed up for the work that actually matters.",
  },
};

/** The three lenses on the business, toggled above the drawing. */
export type LayerId = "mechanics" | "people" | "interfaces";

export const LAYERS: {
  id: LayerId;
  num: string;
  label: string;
  description: string;
  drafted: boolean;
}[] = [
  {
    id: "mechanics",
    num: "01",
    label: "The mechanics",
    description:
      "The jobs to be done: how the business works, room by room, and where AI takes the work.",
    drafted: true,
  },
  {
    id: "people",
    num: "02",
    label: "The people",
    description:
      "The roles: who sits where in a modern agency, and how the agent layer changes every seat.",
    drafted: true,
  },
  {
    id: "interfaces",
    num: "03",
    label: "The interfaces",
    description:
      "The wiring: every external provider the agency works with, how the money flows, and which relationships are revenue streams.",
    drafted: true,
  },
];

export type Block =
  | { kind: "lead"; text: string }
  | { kind: "p"; text: string }
  | { kind: "h"; text: string }
  | { kind: "list"; ordered?: boolean; title?: string; items: string[] }
  | {
      kind: "callout";
      tone: Assignment;
      label: string;
      body?: string;
      items?: string[];
    }
  | { kind: "stat"; value: string; title: string; note?: string }
  | { kind: "banner"; label: string; text: string };

export interface Room {
  slug: string;
  /** Room in the property metaphor. Kept as internal flavour, not displayed. */
  room: string;
  /** The actual job-to-be-done / section title. */
  title: string;
  /** Why this section lives in this room. */
  conceit: string;
  assignment: Assignment | null;
  summary: string;
  blocks: Block[];
  /** Section not yet written, rendered as "under renovation". */
  unfinished?: boolean;
  /** Rect on the floor plan, in viewBox units. */
  rect: { x: number; y: number; w: number; h: number };
  /** Optional explicit line-wrapping for the label on the plan. */
  planLabel?: string[];
  /** Where the room label sits if not centered. */
  outdoor?: boolean;
}

export const PLAN = { w: 720, h: 1300 } as const;

export const ROOMS: Room[] = [
  {
    slug: "the-thesis",
    room: "Front garden",
    title: "The thesis",
    conceit: "Every viewing starts at the kerb. So does this document.",
    assignment: null,
    summary:
      "Estate agency is approaching its first real inflection point since the portals arrived. Here is the whole business, split into eight jobs, with a framework for who should do each one.",
    outdoor: true,
    rect: { x: 60, y: 30, w: 600, h: 160 },
    blocks: [
      {
        kind: "lead",
        text: "Residential estate agency in the UK has worked in largely the same way since the property portals and modern CRMs arrived in the early 2000s. That was the last time the shape of the job really changed. We think another change of that size is now close, and this time it will be driven by AI and automation.",
      },
      {
        kind: "p",
        text: "It helps to start from what each side is actually paying for. From the vendor's point of view, you pay an estate agent to take the hassle of selling a house off your hands. From the agent's point of view, the job is to sell as many houses as possible, and there is a fixed list of things that have to happen for that to occur.",
      },
      {
        kind: "p",
        text: "Our view is not that AI replaces the agent. It is that the work splits into three kinds, and each kind should be handled differently.",
      },
      { kind: "h", text: "The framework: who should do what" },
      {
        kind: "p",
        text: "Every job in the sale of a house falls into one of three buckets.",
      },
      {
        kind: "callout",
        tone: "human",
        label: "Human-led",
        body: "Some work should stay with a person because handing it to a machine would damage the customer experience or lose the sale. This is the high-stakes, high-emotion, relationship-defining work.",
      },
      {
        kind: "callout",
        tone: "hybrid",
        label: "Human and AI together",
        body: "Some work is best done by a person and an AI agent operating side by side, with the AI handling speed, coverage and admin, and the human handling judgement and warmth.",
      },
      {
        kind: "callout",
        tone: "ai",
        label: "AI-led",
        body: "Some work is repetitive and process-driven. It should be led by AI so that people are freed up for the work that actually matters.",
      },
      {
        kind: "p",
        text: "Mapped onto the eight jobs of a sale, you get the floor plan this document is built around. Each section covers the same four things: what the job is, how it works today, why it sits where it does on the human/AI scale, and where AI fits in.",
      },
      {
        kind: "banner",
        label: "The model",
        text: "Human-led where trust wins business. AI-led where process wins margin. Together everywhere else.",
      },
    ],
  },
  {
    slug: "booking-valuations",
    room: "Entrance hall",
    title: "Booking valuations",
    conceit: "The valuation is how an agency gets through the front door.",
    assignment: "hybrid",
    summary:
      "Getting a vendor to agree to a face-to-face valuation appointment: arguably the single most valuable activity an agency does. Everything downstream depends on it.",
    rect: { x: 60, y: 190, w: 300, h: 310 },
    blocks: [
      { kind: "h", text: "What the job is" },
      {
        kind: "lead",
        text: "Getting a vendor to agree to a face-to-face valuation appointment. This is arguably the single most valuable activity an agency does. The valuation is your best chance to win a vendor's business, and everything downstream depends on it.",
      },
      {
        kind: "stat",
        value: "~£5,000",
        title: "What one instruction is worth",
        note: "A £500,000 home is worth roughly £5,000 to the agency in commission, since fees generally sit between 1% and 1.5%. The better you are at booking valuations, the more business you win, and the more you earn.",
      },
      { kind: "h", text: "How it works today" },
      {
        kind: "list",
        ordered: true,
        title: "Where valuations come from: a good agency works all of them",
        items: [
          "Existing connections: for example a vendor who came back because you sold their house five years ago",
          "Touting: mail-outs to houses currently on the market with a competitor",
          "Mail-outs to the neighbours of houses you have sold",
          "Website enquiries, which are less common than they used to be",
          "[[portals|Portal enquiries]] from Rightmove, Zoopla and OnTheMarket: these usually land with around six agents at once, so they are highly competitive",
          "Turning a buyer into a seller: someone viewing one of your listings has their own house to sell",
          "Brand awareness: the high street shop, sold boards, local newspapers, market update emails, your listings on the portals, and your Instagram and Facebook presence",
          "Re-engaging vendors who instructed a competitor",
          "Direct phone calls into the office",
        ],
      },
      {
        kind: "p",
        text: "Enquiries from your website and [[portals|the portals]] usually pull through into an inbox on the CRM. Most agents will call the vendor the moment they see the enquiry to try to book a time. A high-touch, personal approach wins more business here, so agents compete to be first to make contact, especially on portal enquiries, where the competition is fiercest.",
      },
      {
        kind: "callout",
        tone: "hybrid",
        label: "Why it sits here",
        body: "The relationship starts at the first contact, and being human and fast is what wins it. But a person cannot always call within seconds, and cannot personalise every touch at scale. That gap is exactly what an AI agent can close without cheapening the experience.",
      },
      {
        kind: "callout",
        tone: "ai",
        label: "Where AI fits in",
        items: [
          "A personal holding message within 60 seconds of an enquiry landing. It can reference the specific house, confirm the agent has looked at it, and promise a call as soon as possible. You will not always be able to call immediately, but you can guarantee the vendor hears from you first, with something that feels considered rather than automated.",
          "A genuinely personalised valuation pack. One local agency we know leaves a valuation pack on the doorstep of every booked valuation, the same day the enquiry comes in. Today that pack is a generic company document that walks through the process. AI can make it ten times better: picture a vendor arriving home a few hours after booking to find a folder of comparable properties, research on their own home, and a personalised letter from their agent.",
        ],
      },
    ],
  },
  {
    slug: "winning-valuations",
    room: "Living room",
    title: "Winning valuations",
    conceit: "Business is won sitting on the vendor's sofa.",
    assignment: "human",
    summary:
      "Converting the valuation appointment into a signed instruction. The moment a vendor decides who they trust with the biggest transaction of their life.",
    rect: { x: 360, y: 190, w: 300, h: 310 },
    blocks: [
      { kind: "h", text: "What the job is" },
      {
        kind: "lead",
        text: "Converting the [[booking-valuations|valuation appointment]] into a signed instruction.",
      },
      {
        kind: "callout",
        tone: "human",
        label: "Why it sits here",
        body: "This is persuasion, reassurance and reading the room in someone's living room. It is the moment a vendor decides who they trust with the biggest transaction of their life. That has to be a person.",
      },
      {
        kind: "callout",
        tone: "ai",
        label: "Where AI fits in",
        body: "The follow-up, particularly for lower-leverage leads. Vendors who are not planning to sell for six months, or who are currently on the market with another agent, rarely get consistent attention because they are not urgent. AI can run tailored, high-touch follow-up over long periods so that no warm lead goes cold simply because nobody had time to keep in touch.",
      },
    ],
  },
  {
    slug: "taking-on-properties",
    room: "Study",
    title: "Taking on properties",
    conceit: "The paperwork room: instructions become live listings here.",
    assignment: "ai",
    summary:
      "Everything between a signed marketing agreement and a property being fully live on Rightmove. Pure process, and the strongest case for AI-led operation.",
    rect: { x: 60, y: 500, w: 200, h: 310 },
    planLabel: ["Taking on", "properties"],
    blocks: [
      { kind: "h", text: "What the job is" },
      {
        kind: "lead",
        text: "Everything between a signed marketing agreement and a property being fully live on Rightmove.",
      },
      { kind: "h", text: "How it works today" },
      {
        kind: "list",
        ordered: true,
        title: "The list is well defined and mostly administrative",
        items: [
          "Writing the property details",
          "Arranging [[photographer|professional photography]], plus a walkthrough or video",
          "Getting an [[epc-floorplan|EPC and a floorplan]] produced",
          "Posting to [[portals|the portals]] through the CRM integration with Rightmove, Zoopla and OnTheMarket",
          "Working out access arrangements for [[managing-viewings|viewings]]",
          "Running [[aml-provider|AML checks]], usually through an outsourced provider",
        ],
      },
      {
        kind: "callout",
        tone: "ai",
        label: "Why it sits here",
        body: "This is process work with clear steps and few emotional stakes. Getting it done faster and more consistently is pure upside, and it frees the team to spend time where it counts.",
      },
      {
        kind: "callout",
        tone: "ai",
        label: "Where AI fits in",
        body: "Almost everywhere. Drafting the details, coordinating the photographer and the EPC, triggering the AML process, and pushing the listing live through the CRM can all be driven by AI, with a person simply signing off the finished listing.",
      },
    ],
  },
  {
    slug: "marketing-properties",
    room: "Kitchen",
    title: "Marketing properties",
    conceit: "The heart of the home: where demand gets generated.",
    assignment: "ai",
    summary:
      "The ongoing lead generation that keeps viewings coming in for a listing. AI-led without being AI-only.",
    rect: { x: 260, y: 500, w: 200, h: 310 },
    planLabel: ["Marketing", "properties"],
    blocks: [
      { kind: "h", text: "What the job is" },
      {
        kind: "lead",
        text: "The ongoing lead generation that keeps viewings coming in for a listing.",
      },
      { kind: "h", text: "How it works today" },
      {
        kind: "p",
        text: "In practice this is a mix of portal management, social posting and applicant matching, wrapped around regular conversations with the vendor.",
      },
      {
        kind: "callout",
        tone: "ai",
        label: "Why it sits here",
        body: "The generation of demand is largely repeatable and data-driven, which makes it a strong fit for automation. But the vendor-facing judgement calls are not, so this job is AI-led without being AI-only.",
      },
      {
        kind: "callout",
        tone: "ai",
        label: "Where AI fits in",
        items: [
          "Making sure the listing is pulling a healthy number of viewings from [[portals|the portals]], and flagging when it is not",
          "Posting to social channels for awareness",
          "Matching the property to relevant applicants and emailing them through the CRM",
        ],
      },
      {
        kind: "callout",
        tone: "human",
        label: "Still needs a person",
        items: [
          "Communicating progress to the vendor",
          "Negotiating a price reduction when viewings dry up, or when the vendor's own urgency rises because they have found somewhere to buy",
          "Negotiating a renewal when the contract is coming to an end",
        ],
      },
    ],
  },
  {
    slug: "managing-viewings",
    room: "Landing & bedrooms",
    title: "Managing viewings",
    conceit: "Walking buyers through the house, room by room.",
    assignment: "hybrid",
    summary:
      "Everything from a viewing enquiry through to either feedback on the property or a negotiation on price. Qualifying and scheduling suit AI; the viewing itself stays human.",
    rect: { x: 460, y: 500, w: 200, h: 310 },
    planLabel: ["Managing", "viewings"],
    blocks: [
      { kind: "h", text: "What the job is" },
      {
        kind: "lead",
        text: "Everything from a viewing enquiry through to either feedback on the property or a negotiation on price.",
      },
      { kind: "h", text: "How it works today" },
      {
        kind: "p",
        text: "As with valuations, most viewing requests arrive in the CRM from the website or the portals. The difference is that these are seen as lower-value leads, so agencies worry less about the personal touch and are much more open to automation here.",
      },
      {
        kind: "p",
        text: "To book a viewing you first qualify the buyer with a few questions: do they have a mortgage in principle, can they afford this property, and do they have something of their own to sell in the area? These questions do more than screen a buyer. They surface value in other directions.",
      },
      {
        kind: "stat",
        value: "£400 to £5,000",
        title: "What the qualifying questions are worth",
        note: "A buyer without a mortgage is a [[mortgage-advisor|referral]] worth around £400. A buyer with a property to sell is a potential [[booking-valuations|valuation]] worth around £5,000. Asking them consistently adds up.",
      },
      {
        kind: "p",
        text: "Once a buyer is qualified, scheduling tends to be very manual. The CRM holds the access arrangements, but the edge cases get messy. Tenanted flats need sign-off from both the tenant and the landlord, and the tenant is often uncooperative. Keys are a logistical headache when you hold a single set but two different agents need to show the property at different times of day. Most agencies end up playing phone tennis with everyone involved to pin a slot down.",
      },
      {
        kind: "p",
        text: "Once the viewing happens, a [[sales-negotiator|negotiator]] meets the buyer at the property, conducts the viewing, and then chases them over the following days for feedback. That feedback goes to the vendor, usually by phone, and it often does double duty as the evidence base for a future conversation about reducing the price.",
      },
      {
        kind: "callout",
        tone: "hybrid",
        label: "Why it sits here",
        body: "The qualifying and scheduling are repetitive and rules-based, which suits AI. The viewing itself, and the feedback conversation with the vendor, still benefit from a human.",
      },
      {
        kind: "callout",
        tone: "ai",
        label: "Where AI fits in",
        items: [
          "Reaching out to and qualifying prospects the moment they enquire, and automatically capturing referral opportunities such as mortgage introductions and valuation leads",
          "Gathering feedback after viewings, chasing consistently so that nothing slips",
        ],
      },
    ],
  },
  {
    slug: "negotiating-the-sale",
    room: "Dining room",
    title: "Negotiating the sale",
    conceit: "Offers get made, and improved, across this table.",
    assignment: "human",
    summary:
      "Taking an offer to the vendor and advising them whether to accept it. Life-changing news, delivered by a person.",
    rect: { x: 60, y: 810, w: 300, h: 320 },
    blocks: [
      { kind: "h", text: "What the job is" },
      {
        kind: "lead",
        text: "Taking an offer to the vendor and advising them whether to accept it.",
      },
      { kind: "h", text: "How it works today" },
      {
        kind: "p",
        text: "When a [[managing-viewings|viewing]] produces an offer, the agency presents it to the vendor with a recommendation. This should almost always be done by a person, on the phone. It is life-changing news, and it deserves a personal touch. It is also a legal requirement to present every offer, so the agent has to make the call regardless.",
      },
      {
        kind: "p",
        text: "A good agency tries to close on terms that both sides are comfortable with, rather than squeezing for the last pound. You will be working with both parties for roughly three more months before [[completing-the-sale|completion]], and when someone feels they were pushed on price, it tends to resurface later. The vendor takes the lightbulbs on the way out, or the buyer walks because the white goods were not included.",
      },
      {
        kind: "callout",
        tone: "human",
        label: "Why it sits here",
        body: "This is judgement, advice and emotional weight all at once, on a decision that changes people's lives. It stays with a person.",
      },
      {
        kind: "callout",
        tone: "ai",
        label: "Where AI fits in",
        body: "Very little on the actual negotiation, by design. The most it should do is prepare the ground: pulling together the comparable evidence and the viewing feedback so the agent walks into the call fully briefed.",
      },
    ],
  },
  {
    slug: "progressing-the-sale",
    room: "Utility room",
    title: "Progressing the sale",
    conceit:
      "The plumbing of the deal: unglamorous, and where everything gets stuck.",
    assignment: "hybrid",
    summary:
      "Shepherding an agreed sale from acceptance to the point where it is ready to complete. The chase is mechanical; the reassurance is not.",
    rect: { x: 360, y: 810, w: 300, h: 320 },
    blocks: [
      { kind: "h", text: "What the job is" },
      {
        kind: "lead",
        text: "Shepherding an agreed sale from acceptance through to the point where it is ready to complete.",
      },
      { kind: "h", text: "How it works today" },
      {
        kind: "p",
        text: "Once a sale is agreed and both parties are happy, the [[conveyancer|solicitors]] get involved. Both sides instruct one, and some agencies have partner firms that pay referral fees, so there is another commercial opportunity here.",
      },
      {
        kind: "p",
        text: "Progressing is essentially a chase. You work through a series of solicitors to find out who is currently blocking progress, then try to clear the blockage. The longer the chain, the more work it is. Today this is manual: emails and phone calls to a string of solicitors, roughly once every two weeks, and every time you chase them you update your vendor and buyer.",
      },
      {
        kind: "p",
        text: "The part that should not be automated is the communication with vendors and buyers. This period is highly stressful, and small things can blow a deal up. A first-time buyer who gets a survey back on an older house will often read lines like \u201cthe roof will need replacing at some point\u201d or \u201cthere may be damp, so you should get a specialist in.\u201d Experienced buyers know a survey is largely a surveyor covering themselves and are not put off. A first-time buyer can panic and pull out. The agent's job is to steady them, explain what the survey actually means, and make sure they have someone to talk to. Hand that to an AI and you risk doing real damage to the conversion rate of the business.",
      },
      {
        kind: "callout",
        tone: "hybrid",
        label: "Why it sits here",
        body: "The chasing is repetitive coordination, which AI does well. The reassurance is delicate human work that protects the deal.",
      },
      {
        kind: "callout",
        tone: "ai",
        label: "Where AI fits in",
        body: "The mechanical side of progression: tracking who owes what across the chain, chasing solicitors on a reliable cadence, and surfacing the current blocker so the agent always knows the state of play. The human keeps the vendor and buyer conversations.",
      },
    ],
  },
  {
    slug: "completing-the-sale",
    room: "Back garden",
    title: "Completing the sale",
    conceit:
      "Sold board up. Keys handed over. The tour ends where the next one begins.",
    assignment: "human",
    summary:
      "Handing over the keys: the emotional high point of the whole process, and the start of a long relationship.",
    outdoor: true,
    rect: { x: 60, y: 1130, w: 600, h: 150 },
    blocks: [
      { kind: "h", text: "What the job is" },
      { kind: "lead", text: "Handing over the keys." },
      { kind: "h", text: "How it works today" },
      {
        kind: "p",
        text: "This is the best part of the job, and it should feel like it. Handing someone the keys to their first home is a moment worth marking. Buyers do not pay the agency's bills, but they are an excellent long-term investment. A bottle of prosecco and a card when they move in buys a lot of loyalty, and often a [[booking-valuations|future instruction]].",
      },
      {
        kind: "callout",
        tone: "human",
        label: "Why it sits here",
        body: "It is the emotional high point of the whole process and the start of a long relationship. This is entirely a human moment.",
      },
      {
        kind: "callout",
        tone: "ai",
        label: "Where AI fits in",
        body: "Only in the background: making sure the small touches actually happen, prompting the card and the gift, and logging the new owner for future contact. The moment itself belongs to a person.",
      },
    ],
  },
];

export function roomBySlug(slug: string): Room | undefined {
  return ROOMS.find((r) => r.slug === slug);
}

/* ------------------------------------------------------------------ */
/* The people: seats on the org section, each with its own page.       */
/* Content inferred from the jobs document: what each seat keeps, and  */
/* what it hands to the agent layer.                                   */
/* ------------------------------------------------------------------ */

export interface Seat {
  slug: string;
  title: string;
  /** Label lines on the org drawing. */
  planLabel: string[];
  /** Which jobs on the floor plan this seat owns. */
  owns: string;
  summary: string;
  blocks: Block[];
  /** Rect on the people drawing, in viewBox units. */
  rect: { x: number; y: number; w: number; h: number };
}

export const PEOPLE_PLAN = { w: 720, h: 640 } as const;

export const SEATS: Seat[] = [
  {
    slug: "branch-manager",
    title: "Branch manager",
    planLabel: ["Branch", "manager"],
    owns: "Oversees every job · leads the hard conversations",
    summary:
      "Owns the branch: the P&L, the standards, and the judgement calls nobody else should make.",
    rect: { x: 280, y: 40, w: 160, h: 104 },
    blocks: [
      {
        kind: "lead",
        text: "The branch manager owns the outcome: [[winning-valuations|instructions won]], [[completing-the-sale|sales completed]], and the reputation of the office. In the new model this seat changes least in what it is for, and most in how it spends the day.",
      },
      { kind: "h", text: "What the seat keeps" },
      {
        kind: "list",
        items: [
          "The hard conversations: [[marketing-properties|price reductions]] when viewings dry up, contract renewals, and rescuing [[progressing-the-sale|deals that are wobbling]]",
          "Pricing strategy and the recommendation on every offer",
          "Hiring, coaching, and the quality of every human touch the branch makes",
        ],
      },
      { kind: "h", text: "What moves to the agent layer" },
      {
        kind: "list",
        items: [
          "Pipeline visibility: the live state of every valuation, listing and chain, without asking anyone",
          "Chasing the team for updates",
          "Reporting and admin",
        ],
      },
      {
        kind: "callout",
        tone: "ai",
        label: "Management by exception",
        body: "A manager's day is currently interrupts and status-chasing. With the agent layer holding a live picture of every valuation, listing and chain, the manager steps in where a human changes the outcome, not to find out what is going on.",
      },
    ],
  },
  {
    slug: "valuation-manager",
    title: "Valuation manager",
    planLabel: ["Valuation", "manager"],
    owns: "Owns jobs 01–02 · booking and winning valuations",
    summary:
      "Wins instructions: first through the door, best prepared in the living room.",
    rect: { x: 20, y: 224, w: 160, h: 116 },
    blocks: [
      {
        kind: "lead",
        text: "The valuation manager carries the two jobs that decide whether the agency grows: [[booking-valuations|booking valuations]] and [[winning-valuations|winning them]]. The seat is pure sales, and it is the most human seat in the branch.",
      },
      { kind: "h", text: "What the seat keeps" },
      {
        kind: "list",
        items: [
          "The appointment itself: persuasion, reassurance and reading the room in someone's living room",
          "Judgement on pricing: saying a number the vendor wants to hear, and being able to stand behind it",
          "Re-engaging warm vendors personally, at the right moment",
        ],
      },
      { kind: "h", text: "What moves to the agent layer" },
      {
        kind: "list",
        items: [
          "The 60-second first touch on every enquiry: personal, specific to the house, and always first",
          "The valuation pack: comparable properties, research on the vendor's home, and a personalised letter, prepared the same day",
          "Long-running follow-up on lower-leverage leads: vendors six months from selling, or currently with a competitor",
        ],
      },
      {
        kind: "callout",
        tone: "ai",
        label: "No warm lead goes cold",
        body: "Vendors who are not urgent rarely get consistent attention. The agent layer runs tailored, high-touch follow-up over long periods, so the valuation manager walks into conversations the moment they become winnable.",
      },
    ],
  },
  {
    slug: "sales-negotiator",
    title: "Sales negotiator",
    planLabel: ["Sales", "negotiator"],
    owns: "Owns jobs 05–06 · viewings and the offer",
    summary:
      "Turns enquiries into offers: the viewing, the feedback call, and the referral value nobody captures consistently.",
    rect: { x: 195, y: 224, w: 160, h: 116 },
    blocks: [
      {
        kind: "lead",
        text: "The negotiator owns the buyer's journey: from [[managing-viewings|viewing enquiry]] through to [[negotiating-the-sale|an offer on the table]]. It is the seat with the most repetitive admin around the most human moments.",
      },
      { kind: "h", text: "What the seat keeps" },
      {
        kind: "list",
        items: [
          "Conducting the viewing: walking the buyer through the house and reading what they actually think",
          "The feedback conversation with the vendor, which doubles as the evidence base for price conversations",
          "Presenting offers: life-changing news, delivered personally, as the law requires",
        ],
      },
      { kind: "h", text: "What moves to the agent layer" },
      {
        kind: "list",
        items: [
          "Qualifying every buyer the moment they enquire: mortgage in principle, affordability, something to sell",
          "Capturing the referral value in those answers: a [[mortgage-advisor|mortgage introduction]] is worth around £400, a buyer with a home to sell is a ~£5,000 [[booking-valuations|valuation lead]]",
          "Scheduling: the tenant, landlord and key logistics that today mean phone tennis",
          "Chasing viewing feedback consistently, so nothing slips",
        ],
      },
      {
        kind: "callout",
        tone: "ai",
        label: "Qualification that never sleeps",
        body: "Viewing enquiries are treated as lower-value leads, so the personal touch matters less and automation is welcome. The agent layer qualifies instantly, books around everyone's constraints, and hands the negotiator a diary full of qualified buyers.",
      },
    ],
  },
  {
    slug: "sales-progressor",
    title: "Sales progressor",
    planLabel: ["Sales", "progressor"],
    owns: "Owns job 07 · sale agreed to ready-to-complete",
    summary:
      "Holds agreed sales together for the three months between yes and keys.",
    rect: { x: 370, y: 224, w: 160, h: 116 },
    blocks: [
      {
        kind: "lead",
        text: "The progressor runs [[progressing-the-sale|the stretch]] where roughly three months of [[conveyancer|solicitors]], surveys and chains sit between [[negotiating-the-sale|an agreed sale]] and [[completing-the-sale|completion]]. The job is a chase and a counselling service, run side by side.",
      },
      { kind: "h", text: "What the seat keeps" },
      {
        kind: "list",
        items: [
          "Reassuring vendors and buyers through the most stressful period of the transaction",
          "The survey conversation: steadying a first-time buyer who has just read \u201cthe roof will need replacing at some point\u201d, before they panic and pull out",
          "Judgement on when a chain needs escalating and when a deal needs saving",
        ],
      },
      { kind: "h", text: "What moves to the agent layer" },
      {
        kind: "list",
        items: [
          "Chasing the string of solicitors on a reliable cadence, rather than roughly once a fortnight",
          "Tracking who owes what across the chain and surfacing the current blocker",
          "Drafting the update for the vendor and buyer after every chase, for the progressor to deliver",
        ],
      },
      {
        kind: "callout",
        tone: "ai",
        label: "The chase, automated",
        body: "The mechanical side of progression is coordination, which AI does well. The human keeps every vendor and buyer conversation. Hand those to a machine and you risk real damage to the conversion rate of the business.",
      },
    ],
  },
  {
    slug: "admin-marketing",
    title: "Admin & marketing",
    planLabel: ["Admin &", "marketing"],
    owns: "Owns jobs 03–04 · listings live, demand generated",
    summary:
      "Runs the machine that takes listings live and keeps viewings coming. The seat the agent layer changes most.",
    rect: { x: 545, y: 224, w: 160, h: 116 },
    blocks: [
      {
        kind: "lead",
        text: "This seat owns the two AI-led jobs: [[taking-on-properties|taking on properties]] and [[marketing-properties|marketing them]]. It changes more than any other, from producing the work to directing it.",
      },
      { kind: "h", text: "What the seat keeps" },
      {
        kind: "list",
        items: [
          "Final sign-off on every listing before it goes live",
          "The quality bar: photography, details and brand across every channel",
          "Escalating listings that are not performing to the humans who own the vendor conversation",
        ],
      },
      { kind: "h", text: "What moves to the agent layer" },
      {
        kind: "list",
        items: [
          "Drafting details, booking [[photographer|the photographer]], ordering the [[epc-floorplan|EPC and floorplan]], triggering [[aml-provider|AML]]",
          "Pushing listings live through the CRM to [[portals|Rightmove, Zoopla and OnTheMarket]]",
          "Monitoring portal performance and flagging listings that are not pulling viewings",
          "Social posting and matching properties to applicants by email",
        ],
      },
      {
        kind: "callout",
        tone: "ai",
        label: "From doing to directing",
        body: "Everything here is process work with clear steps and few emotional stakes. Done by agents, it happens faster and more consistently, and the seat becomes an editor of machine output rather than a producer of admin.",
      },
    ],
  },
];

export function seatBySlug(slug: string): Seat | undefined {
  return SEATS.find((s) => s.slug === slug);
}

/* ------------------------------------------------------------------ */
/* The interfaces: external providers on the wiring diagram, each      */
/* with its own page covering what they are, how they work with the   */
/* agency, and how the money flows.                                   */
/* ------------------------------------------------------------------ */

export interface Provider {
  slug: string;
  title: string;
  /** Label lines on the wiring diagram. */
  planLabel: string[];
  /** Referral revenue flows down this wire. */
  monetised: boolean;
  summary: string;
  blocks: Block[];
  /** Rect on the interfaces drawing, in viewBox units. */
  rect: { x: number; y: number; w: number; h: number };
}

export const INTERFACES_PLAN = { w: 720, h: 790 } as const;

const PROVIDER_W = 180;
const PROVIDER_H = 78;

export const PROVIDERS: Provider[] = [
  {
    slug: "portals",
    title: "The portals",
    planLabel: ["Portals"],
    monetised: false,
    summary:
      "The shop window: where nearly all demand comes from, and the biggest marketing bill the agency pays.",
    rect: { x: 20, y: 40, w: PROVIDER_W, h: PROVIDER_H },
    blocks: [
      {
        kind: "lead",
        text: "The property portals: Rightmove, Zoopla and OnTheMarket. The shop window for almost every buyer in the country, and the single most important source of demand an agency has.",
      },
      { kind: "h", text: "How they work with the agency" },
      {
        kind: "p",
        text: "Listings are pushed to the portals automatically through the CRM integration. Everything flows back the other way as enquiries: [[managing-viewings|viewing requests]] and [[booking-valuations|valuation leads]] land in the CRM inbox, and the portals supply performance data on how each listing is doing.",
      },
      {
        kind: "p",
        text: "Portal enquiries are shared. A valuation lead typically lands with around six agents at once, so speed of response matters more here than anywhere else in the business.",
      },
      { kind: "h", text: "The money" },
      {
        kind: "p",
        text: "Money flows one way: out. The portals charge a per-branch monthly subscription, and Rightmove is the biggest single marketing overhead most agencies carry, often well over £1,500 a month per branch and rising every year. Agencies pay it because the buyers are there and nowhere else.",
      },
      {
        kind: "banner",
        label: "Cost centre",
        text: "No referral revenue. The return is demand: a steady flow of viewing and valuation enquiries.",
      },
      {
        kind: "callout",
        tone: "ai",
        label: "Where the agent layer helps",
        body: "Answering every portal enquiry within 60 seconds, monitoring listing performance, and flagging listings that are not pulling viewings, so the subscription is never wasted.",
      },
    ],
  },
  {
    slug: "photographer",
    title: "Photographer",
    planLabel: ["Photographer"],
    monetised: false,
    summary:
      "Per-instruction photography and video: usually the pacing item between a signed agreement and a live listing.",
    rect: { x: 270, y: 40, w: PROVIDER_W, h: PROVIDER_H },
    blocks: [
      {
        kind: "lead",
        text: "A professional property photographer, usually a local freelancer or small firm, covering photography plus a walkthrough or video where the marketing package includes one.",
      },
      { kind: "h", text: "How they work with the agency" },
      {
        kind: "p",
        text: "Booked per instruction as part of [[taking-on-properties|taking a property on]]. The agency coordinates access with the vendor, chases the edited shots, and quality-checks them before the listing goes live. In practice photography is usually what sets the pace between a signed agreement and a live listing.",
      },
      { kind: "h", text: "The money" },
      {
        kind: "p",
        text: "A per-shoot fee, typically somewhere around £100 to £200 depending on the property and whether video is included. Most agencies absorb it inside the commission; some charge it to the vendor as part of a premium marketing package.",
      },
      {
        kind: "banner",
        label: "Cost centre",
        text: "A cost of taking on stock. Good photography pays back through viewings, not through any fee.",
      },
      {
        kind: "callout",
        tone: "ai",
        label: "Where the agent layer helps",
        body: "Booking the shoot, coordinating access with the vendor, and chasing the turnaround automatically, so photography stops being the bottleneck in going live.",
      },
    ],
  },
  {
    slug: "epc-floorplan",
    title: "EPC & floorplan",
    planLabel: ["EPC &", "floorplan"],
    monetised: false,
    summary: "The legal paperwork of marketing: no EPC, no listing.",
    rect: { x: 520, y: 40, w: PROVIDER_W, h: PROVIDER_H },
    blocks: [
      {
        kind: "lead",
        text: "A domestic energy assessor who produces the Energy Performance Certificate, usually drawing the floorplan on the same visit. An EPC is a legal requirement for marketing a property.",
      },
      { kind: "h", text: "How they work with the agency" },
      {
        kind: "p",
        text: "Ordered at [[taking-on-properties|take-on]]. The assessor visits once, and the certificate and floorplan come back within a few days. A property cannot be fully marketed without an EPC in place or at least commissioned, so a slow assessor delays the listing.",
      },
      { kind: "h", text: "The money" },
      {
        kind: "p",
        text: "A modest per-visit fee, typically £60 to £120 for the EPC and floorplan together. Some agencies recharge it to the vendor at cost or with a small margin, but nobody is building a business on it.",
      },
      {
        kind: "banner",
        label: "Cost centre",
        text: "A compliance cost. At most a small recharge margin; the real value is an on-time listing.",
      },
      {
        kind: "callout",
        tone: "ai",
        label: "Where the agent layer helps",
        body: "Ordering the assessment the moment the agreement is signed, chasing the certificate, and attaching it to the listing without anyone having to think about it.",
      },
    ],
  },
  {
    slug: "board-contractor",
    title: "Board contractor",
    planLabel: ["Board", "contractor"],
    monetised: false,
    summary:
      "For sale and sold boards: a tiny cost that doubles as street-level advertising.",
    rect: { x: 20, y: 356, w: PROVIDER_W, h: PROVIDER_H },
    blocks: [
      {
        kind: "lead",
        text: "The contractor who puts up, changes and takes down the boards: for sale, sold, and back again.",
      },
      { kind: "h", text: "How they work with the agency" },
      {
        kind: "p",
        text: "Instructed at three moments in every sale: erect the board when [[taking-on-properties|the listing goes live]], switch the slip to sold when [[negotiating-the-sale|the sale is agreed]], and collect the board after [[completing-the-sale|completion]]. Boards are also marketing. A street of your boards is the cheapest brand awareness an agency can buy, and sold boards generate [[booking-valuations|valuation enquiries]] from the neighbours.",
      },
      { kind: "h", text: "The money" },
      {
        kind: "p",
        text: "A small fee per board movement, typically a few pounds each time, billed monthly. Pure cost, but one with a marketing return attached.",
      },
      {
        kind: "banner",
        label: "Cost centre",
        text: "A small cost that doubles as street-level advertising.",
      },
      {
        kind: "callout",
        tone: "ai",
        label: "Where the agent layer helps",
        body: "Triggering the right board instruction automatically at every pipeline transition, so boards never lag the deal and the sold slip goes up the day the sale is agreed.",
      },
    ],
  },
  {
    slug: "aml-provider",
    title: "AML provider",
    planLabel: ["AML provider"],
    monetised: false,
    summary:
      "The compliance checks the law requires before marketing a property and before completing a sale.",
    rect: { x: 520, y: 356, w: PROVIDER_W, h: PROVIDER_H },
    blocks: [
      {
        kind: "lead",
        text: "An outsourced anti-money-laundering service that runs the identity and source-of-funds checks the agency is legally required to perform.",
      },
      { kind: "h", text: "How they work with the agency" },
      {
        kind: "p",
        text: "Triggered at [[taking-on-properties|take-on]] for vendors, and again for buyers once [[negotiating-the-sale|a sale is agreed]]. The checks are digital: the provider verifies ID documents, screens against sanctions lists, and flags anything that needs a human decision. The agency cannot legally market the property or [[progressing-the-sale|progress the sale]] until the checks pass.",
      },
      { kind: "h", text: "The money" },
      {
        kind: "p",
        text: "A per-check fee, typically £10 to £30. Many agencies recharge it to the client, sometimes with a small margin, but it exists to keep the agency compliant, not to make money.",
      },
      {
        kind: "banner",
        label: "Cost centre",
        text: "A compliance cost with, at best, a small recharge margin.",
      },
      {
        kind: "callout",
        tone: "ai",
        label: "Where the agent layer helps",
        body: "Triggering checks at the right moments, chasing outstanding documents, and flagging failures, so compliance never holds up a listing or a sale.",
      },
    ],
  },
  {
    slug: "conveyancer",
    title: "Conveyancer",
    planLabel: ["Conveyancer"],
    monetised: true,
    summary:
      "The legal engine of the sale, and a referral fee the agency can earn twice per transaction.",
    rect: { x: 20, y: 672, w: PROVIDER_W, h: PROVIDER_H },
    blocks: [
      {
        kind: "lead",
        text: "The solicitors or licensed conveyancers who do the legal work of transferring the property: contracts, searches, enquiries, exchange and completion.",
      },
      { kind: "h", text: "How they work with the agency" },
      {
        kind: "p",
        text: "Both sides instruct one once [[negotiating-the-sale|a sale is agreed]]. From that point the [[sales-progressor|sales progressor]] works through the chain of conveyancers to find whoever is currently blocking progress and clear it. The conveyancer is the party the agency chases more than any other.",
      },
      { kind: "h", text: "The money" },
      {
        kind: "p",
        text: "Two flows. The client pays the conveyancer directly for the legal work. And when the agency recommends a partner firm, the firm pays the agency a referral fee, typically £150 to £300 per instruction, which must be disclosed to the client. With a vendor and a buyer on every sale, there are two referral opportunities per transaction.",
      },
      {
        kind: "banner",
        label: "Revenue stream",
        text: "Referral fees of roughly £150 to £300 per instruction, up to twice per sale.",
      },
      {
        kind: "callout",
        tone: "ai",
        label: "Where the agent layer helps",
        body: "Making the recommendation at the right moment on every deal so no referral is missed, then chasing the firm on a reliable cadence once instructed.",
      },
    ],
  },
  {
    slug: "mortgage-advisor",
    title: "Mortgage advisor",
    planLabel: ["Mortgage", "advisor"],
    monetised: true,
    summary:
      "The most reliable referral fee in the business, captured far less often than it should be.",
    rect: { x: 270, y: 672, w: PROVIDER_W, h: PROVIDER_H },
    blocks: [
      {
        kind: "lead",
        text: "A mortgage broker, either in-house or a partner firm, who arranges the buyer's mortgage.",
      },
      { kind: "h", text: "How they work with the agency" },
      {
        kind: "p",
        text: "The introduction happens at [[managing-viewings|the viewing stage]]. Qualifying a buyer surfaces whether they have a mortgage in principle; if they do not, the [[sales-negotiator|negotiator]] books them a meeting with the advisor. A buyer with financing arranged is also a stronger buyer for the vendor, so the introduction helps the sale as well as the fee line.",
      },
      { kind: "h", text: "The money" },
      {
        kind: "p",
        text: "The advisor pays the agency a referral fee for every completed introduction, worth around £400. It is one of the most reliable revenue streams an agency has, and one of the most under-collected, because the qualifying questions get skipped when negotiators are busy.",
      },
      {
        kind: "banner",
        label: "Revenue stream",
        text: "Around £400 per completed introduction. Captured consistently, it adds up fast.",
      },
      {
        kind: "callout",
        tone: "ai",
        label: "Where the agent layer helps",
        body: "Qualifying every single enquiry the moment it lands, so every buyer without a mortgage in principle becomes an introduction rather than a missed fee.",
      },
    ],
  },
  {
    slug: "removals-trades",
    title: "Removals & trades",
    planLabel: ["Removals", "& trades"],
    monetised: true,
    summary:
      "The moving-day economy: small commissions on relationships the agency already owns.",
    rect: { x: 520, y: 672, w: PROVIDER_W, h: PROVIDER_H },
    blocks: [
      {
        kind: "lead",
        text: "Removal firms, cleaners and trades: everyone a mover needs in the fortnight either side of completion.",
      },
      { kind: "h", text: "How they work with the agency" },
      {
        kind: "p",
        text: "The agency is standing next to two households who are about to move and asking who to use. Recommendations happen naturally around [[completing-the-sale|exchange and completion]], when dates firm up, and they are part of good service as much as a commercial play.",
      },
      { kind: "h", text: "The money" },
      {
        kind: "p",
        text: "Partner firms pay a commission per booked referral. Individually small, tens of pounds rather than hundreds, but pure margin on relationships the agency already owns. Today it is barely captured at all, because nobody's job is to remember it at the busiest moment of the deal.",
      },
      {
        kind: "banner",
        label: "Revenue stream",
        text: "Small per-deal commissions that are almost pure margin, and almost never collected today.",
      },
      {
        kind: "callout",
        tone: "ai",
        label: "Where the agent layer helps",
        body: "Prompting the recommendation automatically when exchange dates land, and logging the introduction so the commission actually gets invoiced.",
      },
    ],
  },
];

export function providerBySlug(slug: string): Provider | undefined {
  return PROVIDERS.find((p) => p.slug === slug);
}
