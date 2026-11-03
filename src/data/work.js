/* =====================================================================
   OUR WORK PAGE CONTENT — copy, links and images of this page's own sections.
   Shared sections (header, partners strip, testimonials, closing line, footer)
   come from src/data/site.js.

   Headings: *word* → highlighted word.
   ===================================================================== */

/* ---------- Page <head> ---------- */
export const seo = {
  title: "Our Work: Case Studies & Client Results | Breakthirty",
  description: "Case studies from Breakthirty: AI products, Shopify stores, brands and marketing for clients like ChartSight, Construction Check and Kind Over Matter.",
  themeColor: "#ffffff",
  // ogTitle / ogDescription / image: optional — the title, description and the site's share picture are used otherwise
};

/* ---------- 1. Hero ---------- */
export const hero = {
  glow: "/assets/images/hero-glow.webp",
  intro: "Design, engineering, marketing and AI, from one team. Here's what that looks like once it's live.",
  rigLabel: "Case studies. Drag to spin, click a page to open it.",   // the spinning pages are made from `cases`
  title: ["Built.", "Shipped.", "Measured."],   // one entry per line
  scrollHint: "Scroll to the results",
};

/* ---------- 2. Filters (the tabs above the list) ----------
   key: used in each case study's `tags` · tab: the tab's name · tag: the small label on a card */
export const filters = {
  allLabel: "All Works",
  label: "Filter by service",
  items: [
    { key: "design", tab: "Design", tag: "Design" },
    { key: "engineering", tab: "Engineering", tag: "Engineering" },
    { key: "marketing", tab: "Marketing", tag: "Marketing" },
    { key: "ai", tab: "Automation & AI", tag: "AI" },
  ],
  views: { label: "Layout", grid: "Grid", index: "Index" },
};

/* ---------- 3. Case studies (grid, index list and the hero's spinning pages) ----------
   In this order. An entry whose id has a case study file (src/content/case-studies/<id>.yaml) links to its page
   automatically; the others link to this page. */
export const cases = [
  {
    id: "construction-check",
    name: "Construction Check",
    href: "/work",
    tags: ["design", "engineering", "ai"],   // filter keys from `filters` below
    summary: "Estimators rebuilt the same spreadsheet for every bid. We taught a system to read drawings, and kept numbers in their hands.",   // grid card
    short: "Estimators rebuilt the same spreadsheet for every bid.",   // index row
    images: ["/assets/images/work/construction-check-1.jpg", "/assets/images/work/construction-check-2.jpg", "/assets/images/work/construction-check-3.jpg", "/assets/images/work/construction-check-4.jpg", "/assets/images/work/construction-check-5.jpg"],   // first one is the cover
  },
  {
    id: "chartsight",
    name: "ChartSight",
    href: "/work",
    tags: ["engineering", "ai"],   // filter keys from `filters` below
    summary: "Claim reviewers read stacks of medical records to understand one patient. We built an AI that reads them and shows every condition on a 3D body.",   // grid card
    short: "Every injury and illness, on a 3D body, in order.",   // index row
    images: ["/assets/images/work-onboarding.webp", "/assets/images/work-checkout.webp", "/assets/images/work-agent.webp", "/assets/images/work-launch.webp"],   // first one is the cover
  },
  {
    id: "kind-over-matter",
    name: "Kind Over Matter Creative",
    href: "/work",
    tags: ["design", "engineering"],   // filter keys from `filters` below
    summary: "A studio with a loud voice had a quiet site. We rebuilt brand and store as one, launched in six weeks.",   // grid card
    short: "A loud studio had a very quiet site.",   // index row
    images: ["/assets/images/work/kind-over-matter-1.jpg", "/assets/images/work/kind-over-matter-2.jpg", "/assets/images/work/kind-over-matter-3.jpg", "/assets/images/work/kind-over-matter-4.jpg", "/assets/images/work/kind-over-matter-5.jpg"],   // first one is the cover
  },
  {
    id: "promescent",
    name: "Promescent",
    href: "/work",
    tags: ["design", "marketing"],   // filter keys from `filters` below
    summary: "Great product, awkward category, ad accounts that kept getting flagged. We rebuilt the funnel and message so people could say yes.",   // grid card
    short: "Great product, awkward category, ads kept getting flagged.",   // index row
    images: ["/assets/images/work/promscent-1.jpg", "/assets/images/work/promscent-2.jpg", "/assets/images/work/promscent-3.jpg", "/assets/images/work/promscent-4.jpg", "/assets/images/work/promscent-5.jpg"],   // first one is the cover
  },
  {
    id: "ethical-narrative",
    name: "Ethical Narrative",
    href: "/work",
    tags: ["design", "engineering"],   // filter keys from `filters` below
    summary: "A publisher's archive lived in folders only two people understood. We turned it into a searchable library their readers actually use daily.",   // grid card
    short: "A publisher's archive lived in folders nobody searched.",   // index row
    images: ["/assets/images/work/ethical-narrative-1.jpg", "/assets/images/work/ethical-narrative-2.jpg", "/assets/images/work/ethical-narrative-3.jpg", "/assets/images/work/ethical-narrative-4.jpg", "/assets/images/work/ethical-narrative-5.jpg"],   // first one is the cover
  },
  {
    id: "rivas-pro-details",
    name: "Rivas Pro Details",
    href: "/work",
    tags: ["design"],   // filter keys from `filters` below
    summary: "A detailing crew booked jobs by text and memory. We designed a brand and booking flow as sharp as their work.",   // grid card
    short: "A detailing crew booked jobs by text alone.",   // index row
    images: ["/assets/images/work/rivas-pro-details-1.jpg", "/assets/images/work/rivas-pro-details-2.jpg", "/assets/images/work/rivas-pro-details-3.jpg", "/assets/images/work/rivas-pro-details-4.jpg", "/assets/images/work/rivas-pro-details-5.jpg"],   // first one is the cover
  },
  {
    id: "coupon-chaser",
    name: "The Coupon Chaser",
    href: "/work",
    tags: ["design", "engineering", "marketing"],   // filter keys from `filters` below
    summary: "Coupon sites stop at the code. We built the rest: the product, a live code checker and the pages that win search.",   // grid card
    short: "Coupon sites stopped at the code.",   // index row
    images: ["/assets/images/case-studies/coupon-chaser/hero.jpg", "/assets/images/case-studies/coupon-chaser/demo.jpg", "/assets/images/case-studies/coupon-chaser/p1w.jpg", "/assets/images/case-studies/coupon-chaser/p2a.jpg", "/assets/images/case-studies/coupon-chaser/p3w.jpg"],   // first one is the cover
  },
  {
    id: "weldon-brewster",
    name: "Weldon Brewster",
    href: "/work",
    tags: ["design", "engineering"],   // filter keys from `filters` below
    summary: "A photographer, then a film studio, then a private gallery. We built the brands, websites and software behind all three.",   // grid card
    short: "One photographer, three brands to build.",   // index row
    images: ["/assets/images/case-studies/weldon-brewster/hero.jpg", "/assets/images/case-studies/weldon-brewster/demo.jpg", "/assets/images/case-studies/weldon-brewster/p1w.jpg", "/assets/images/case-studies/weldon-brewster/p2a.jpg", "/assets/images/case-studies/weldon-brewster/p3w.jpg"],   // first one is the cover
  },
];

/* ---------- 4. Featured project (above the list) ---------- */
export const featured = {
  kicker: "Featured project",
  title: "An AI assistant that turns site documents into cost estimates.",
  meta: "Design · Engineering · Automation & AI",
  name: "Construction check",
  text: "Estimators were rebuilding the same spreadsheet for every bid. We taught the system to read the drawings instead, and kept the estimator in control of every number.",
  year: "2025",
  href: "/work/construction-check",
  cta: "View case study",
  mediaLabel: "Construction Check case study",
  cover: "/assets/images/work/featured.jpg",
  moreFrom: "construction-check",   // the pictures shown on hover: this case study's images 2–5
};

/* ---------- 5. "Selected work" heading ---------- */
export const selected = {
  intro: "The ones we're allowed to talk about. Hover for a peek, click for the whole story.",
  heading: "Selected *Work* ®",
};

/* ---------- 6. One team (the hand) ---------- */
export const hello = {
  heading: "One team behind every project. Nothing gets lost between handoffs.",
  text: "Strategy, design, code and campaigns sit at one table. Different minds, shared goals, better work. No silos, just good stuff that works.",
  hand: "/assets/images/work/hello-hand.webp",
  cta: { label: "Say hello", href: "/contact", icon: "phone" },
};

/* After the testimonials: this page's dashed-letter strip (art = which drawing, see src/components/closing/strips.js) */
export const strip = { label: "Sketched. Made. Broken. Scaled.", art: "sketched" };
