/* =====================================================================
   HOMEPAGE CONTENT — the copy, links and images of the homepage's own sections.
   Sections shared with other pages (header links, partners strip, testimonials,
   closing line, footer) are in src/data/site.js.

   Edit text here; the components in src/components only handle layout.
   Small formatting rules used in headings:
     *word*   → highlighted word (the alternate style, e.g. "Sketch")
     \n       → line break
   Partner logos and office locations live in src/data/partners.js.
   ===================================================================== */

/* ---------- Page <head> ---------- */
export const seo = {
  title: "Breakthirty | Design, Engineering, Marketing & AI Agency",
  description: "Breakthirty is one accountable team for design, engineering, marketing and AI, from first sketch to scale: brands, websites, Shopify, SEO and automation.",
  themeColor: "#ffffff",
  // ogTitle / ogDescription / image: optional — the title, description and the site's share picture are used otherwise
};

/* ---------- 1. Hero ---------- */
export const hero = {
  ariaLabel: "Breakthirty — One team, from Sketch to Scale",
  // Two lines: line1 / then the highlighted word + the rest of line 2
  title: { line1: "One team, from", highlight: "Sketch", line2: " to Scale." },
  intro: [
    "Design, engineering, marketing and AI in one accountable team.",
    "No handoff, no gaps between the people who plan it and the people who ship it.",
  ],
  cta: { label: "Say hello", href: "/contact", icon: "target" },
  // Words that travel round the ring above the monitor
  orbitWords: ["Design", "Engineering", "Marketing", "Automation & AI"],
  orbitLabel: "Design, Engineering, Marketing, Automation & AI",
  media: {
    glow: "/assets/images/hero-glow.webp",
    foreground: "/assets/images/hero-foreground.webp",
    foregroundVideo: "/assets/videos/hero-foreground.mp4",
    bezel: "/assets/images/hero-monitor-bezel.webp",
    reelVideo: "/assets/videos/hero-reel.mp4",
    reelVideoSmall: "/assets/videos/hero-reel-small.mp4",   // phones (under 900px wide)
    reelPoster: "/assets/images/hero-reel-poster.webp",
    reelLabel: "Breakthirty showreel",
  },
};

/* ---------- 2. Selected work ---------- */
export const work = {
  intro: "The ones we're allowed to talk about. Hover for a peek, click for the whole story.",
  heading: "Selected *Work* ®",
  ctaLabel: "View case study",
  // case = the case study's id (its file in src/content/case-studies/): the card opens /work/<id> when that file
  // exists, otherwise the Our Work page. focus = crop focal point [x, y] from 0 to 1
  items: [
    {
      kicker: "AI & Engineering",
      year: "2024",
      title: "ChartSight, medical records shown on the body.",
      body: "Claim reviewers read hundreds of pages of medical records to understand one patient. We built an AI that reads them and shows every injury and illness on a 3D body, in the order it happened.",
      case: "chartsight",
      img: "/assets/images/work-onboarding.webp",
      alt: "A pink cloud glowing over a teal-to-orange sky",
      focus: [0.5, 0.5],
    },
    {
      kicker: "Ecommerce & Engineering",
      year: "2024",
      title: "The Coupon Chaser, coupons that actually work.",
      body: "Most coupon codes online are dead by the time shoppers find them. We built a coupon site where a team checks every code by hand daily, and one click shows which ones work right now.",
      case: "coupon-chaser",
      img: "/assets/images/work-checkout.webp",
      alt: "A translucent glowing flower on a dark background",
      focus: [0.5, 0.5],
    },
    {
      kicker: "Brand & Web",
      year: "2024",
      title: "Weldon Brewster, two brands and one gallery.",
      body: "A Los Angeles construction photographer needed more than a portfolio. We rebranded his photography, launched his film studio, Structural Stories, and built a private gallery for his archive.",
      case: "weldon-brewster",
      img: "/assets/images/work-agent.webp",
      alt: "Iridescent liquid chrome waves",
      focus: [0.5, 0.5],
    },
    {
      kicker: "AI & Automation",
      year: "2024",
      title: "Construction Check, estimates in hours, not days.",
      body: "Estimators write every Basis of Estimate from scratch, and the experts are retiring. We built an AI that reads the drawings and drafts it, so estimators review instead of starting from a blank page.",
      case: "construction-check",
      img: "/assets/images/work-launch.webp",
      alt: "Classical columns among marigolds and clouds",
      focus: [0.5, 0.5],
    },
  ],
};

/* ---------- 3. Services ---------- */
export const services = {
  heading: "*Solutions* we\nprovide",
  label: "Services",
  lede: "Most projects need two or three of these. Handy that we all sit together. Pick one to see what's inside.",
  hands: { robot: "/assets/images/services-hand-robot.webp", human: "/assets/images/services-hand-human.webp" },
  items: [
    {
      num: "01",
      name: "Design",
      href: "/services#design",   // the card's "Explore" link
      desc: "Brands and products that look good and make sense. Ideally at the same time.",
      items: ["Brand identity", "Product & UX", "Web design", "Design system", "Motion"],
    },
    {
      num: "02",
      name: "Engineering",
      href: "/services#engineering",   // the card's "Explore" link
      desc: "Websites, stores and platforms that stay up when it matters. Like launch day.",
      items: ["Webflow builds", "Shopify & Plus", "Web apps", "Integrations", "Performance"],
    },
    {
      num: "03",
      name: "Marketing",
      href: "/services#marketing",   // the card's "Explore" link
      desc: "Getting the right people to show up. Measured in pipeline, not in likes.",
      items: ["SEO & All", "Paid media", "Content", "Email & CRM", "Analytics"],
    },
    {
      num: "04",
      name: "Automation & AI",
      href: "/services#ai",   // the card's "Explore" link
      desc: "Agents and workflows that take the boring bits off your plate. Your team will notice.",
      items: ["AI agents", "Workflow automation", "Internal tools", "LLM integrations", "Data"],
    },
  ],
};

/* ---------- 4. Why one team ---------- */
export const whyOneTeam = {
  ariaLabel: "Why one team",
  text: "One team, already synced, already shipped things like this. Pick your mix above and we'll take it from there.",
  cta: { label: "Get in touch", href: "/contact", icon: "target24" },
  heading: "Stop briefing\n*four agencies* to get\none idea out the door.",
};

/* ---------- 5. Vision ---------- */
export const vision = {
  statement: "To take every idea from first sketch to full scale.",
  // the rock under the tablet: the pixel version shows by default, the photo shows under the cursor
  rock: { pixel: "/assets/images/vision-rock-pixel.webp", original: "/assets/images/vision-rock.webp" },
  // the tablet's screens: a desktop with three folders. One click selects an icon, a double-click opens it.
  tablet: {
    backLabel: "Back",
    openHint: "Double-click to open",
    desktop: [
      { label: "Sketch\nto Scale", open: "clients" },   // (doesn't open anything yet)
      { label: "BT", open: "bt" },
    ],
    // "Process.jpg" (the last icon in the BT folder): opening it shows the four stages as sticky notes
    process: {
      file: "Process.jpg",
      title: "A little less chaos.",
      // box: [left, top, width, height] on the tablet's screen (design px); rotate in degrees
      cards: [
        { title: "Sketch", color: "#F4EB02", rotate: -4.42, box: [51.5, 150, 339.031, 155.025], text: "We get to know the business, users and goals, then get the idea down fast. Strategy, early concepts and wireframes set a clear direction." },
        { title: "Make", color: "#B0E9FD", rotate: 6.36, box: [367, 157.8, 344.257, 182.663], text: "One team turns the sketch into the real thing, covering brand, UI design, development and content. You get a working product, not a mockup." },
        { title: "Break", color: "#D1E0D4", rotate: -1.33, box: [52, 298.81, 332.934, 137.639], text: "We test it hard before the world does, through user testing, QA, performance checks and edge cases. What launches holds up." },
        { title: "Scale", color: "#FAD7FF", rotate: 3.49, box: [367, 303.8, 337.294, 149.826], text: "We launch, then help it grow with marketing, analytics and automation. Real data keeps it improving long after launch." },
      ],
    },
    // "BT" folder: four pictures, each opens full screen (then Process.jpg, above)
    bt: [
      { key: "before", file: "Before.png", alt: "Before", src: "/assets/images/vision/before.webp" },
      { key: "after", file: "After.png", alt: "After", src: "/assets/images/vision/after.gif" },
      { key: "about", file: "About.png", alt: "About", src: "/assets/images/vision/about.webp" },
      { key: "breakdown", file: "Breakdown.png", alt: "Breakdown", src: "/assets/images/vision/breakdown.webp" },
    ],
  },
};

/* ---------- 6. Our network (partners + global offices) ---------- */
export const network = {
  copy: {
    eyebrow: "Our network",
    heading: ["Trusted partners.", "Worldwide connections.", "*One team*."],   // one entry per line; *word* = the highlighted word
    body: "From the platforms we partner with to the places we work, we bring the right connections together to keep your business moving.",
    tabs: { partner: "Partners", global: "Global" },
    listLabel: "Official partners",
  },
};
