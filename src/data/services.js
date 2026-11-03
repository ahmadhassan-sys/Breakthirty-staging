/* =====================================================================
   SERVICES PAGE CONTENT ("What we do") — copy, links and images of this page's
   own sections. Shared sections (header, partners strip, testimonials, closing
   line, footer) come from src/data/site.js.

   Headings: *word* → highlighted word, \n → line break.
   ===================================================================== */

/* ---------- Page <head> ---------- */
export const seo = {
  title: "Services: Design, Engineering, Marketing & AI | Breakthirty",
  description: "Brand and product design, web and Shopify development, SEO and performance marketing, and AI automation: four disciplines, one team that ships.",
  themeColor: "#ffffff",
  // ogTitle / ogDescription / image: optional — the title, description and the site's share picture are used otherwise
};

/* ---------- 1. Hero ---------- */
export const hero = {
  // two lines; *Sketch* is the highlighted word
  title: ["Everything it takes,", "from *Sketch* to Scale."],
  intro: "52 services across four disciplines. Different hats, different skills, no awkward handoffs. Just one team making it all work together.",
  glow: "/assets/images/hero-glow.webp",                 // the soft colour behind the hero (same as the homepage)
  media: {
    cover: "/assets/images/services/hero-cover.webp",   // the picture in the hero's top-right frame
    href: "#design",
    label: "Our services: see what each discipline looks like",
    hoverWord: "Explore",                                // the word on the cursor over the picture
  },
  indexLabel: "Disciplines",
};

/* ---------- 2. The four disciplines and their services ----------
   Each discipline: id (the #anchor), name, colour, statement, hero pictures, services.
   Services are listed top to bottom in the left column, then the right column.
   Each service's icon is in src/data/services-icons.js, under the same title. */
export const disciplines = [
  {
    id: "design",
    name: "Design",
    color: "#F95050",
    statement: "Making things look good is one thing. Making them work is the whole point.",
    // pictures shown in the hero when you hover this discipline
    images: ["/assets/images/services/design-1.webp", "/assets/images/services/design-2.webp", "/assets/images/services/design-3.webp", "/assets/images/services/design-4.webp"],
    services: [
      { title: "Brand Strategy", desc: "Positioning and messaging, before any design." },
      { title: "Creative Direction & Design Leadership", desc: "A senior lead keeping everything on vision." },
      { title: "Brand Identity", desc: "Logo, type, colour and guidelines." },
      { title: "Graphic & Marketing Design", desc: "Ads, social, decks and print." },
      { title: "Illustration", desc: "Custom 2D illustration with its own style." },
      { title: "UI/UX & Product Design", desc: "Web and mobile products that make sense." },
      { title: "Design Systems", desc: "Components your team can scale." },
      { title: "Accessibility Design & Audits", desc: "WCAG audits and fixes." },
      { title: "Motion & Interaction Design", desc: "UI motion and micro-interactions." },
      { title: "2D & 3D Animation", desc: "Explainers, renders and brand animation." },
      { title: "2D Game Design & Assets", desc: "Characters, worlds and sprites for 2D games." },
      { title: "Audio Production & Sound Design", desc: "Sound engineered and mixed in-house." },
    ],
  },
  {
    id: "engineering",
    name: "Engineering",
    color: "#3457BA",
    statement: "Websites, stores, and platforms that work when you need them to. Imagine that.",
    // pictures shown in the hero when you hover this discipline
    images: ["/assets/images/services/engineering-1.webp", "/assets/images/services/engineering-2.webp", "/assets/images/services/engineering-3.webp", "/assets/images/services/engineering-4.webp"],
    services: [
      { title: "Web & Frontend Development", desc: "Fast sites, built true to the design." },
      { title: "Custom Software Development", desc: "Backend and full-stack platforms." },
      { title: "Mobile App Development", desc: "iOS and Android, native or cross-platform." },
      { title: "Shopify & Ecommerce Development", desc: "Shopify, WooCommerce and headless stores." },
      { title: "Ecommerce Strategy & CRO", desc: "Fewer drop-offs, more marketplaces." },
      { title: "Integrations & APIs", desc: "Payments, fulfilment and platforms, connected." },
      { title: "Salesforce Development", desc: "Custom builds and admin on Salesforce." },
      { title: "Cloud & DevOps", desc: "AWS, Azure and GCP, shipped routinely." },
      { title: "Security & Compliance", desc: "Secure systems you can prove to auditors." },
      { title: "Data Engineering & Analytics", desc: "Pipelines, warehouses and dashboards." },
      { title: "Blockchain & Smart Contracts", desc: "dApps and contracts, built and audited." },
      { title: "Quality Assurance & Testing", desc: "Manual testing across browsers and devices." },
      { title: "Test Automation & Performance Testing", desc: "Automated suites and load tests." },
      { title: "Prototyping & MVPs", desc: "From idea to testable product in days." },
      { title: "Dedicated Development Teams", desc: "Remote engineers, leads included." },
      { title: "2D Game Development", desc: "The games our designers draw, built." },
    ],
  },
  {
    id: "marketing",
    name: "Marketing",
    color: "#F4EB02",
    statement: "Putting your brand in front of the right people, at the right time, for the right reasons.",
    // pictures shown in the hero when you hover this discipline
    images: ["/assets/images/services/marketing-1.webp", "/assets/images/services/marketing-2.webp", "/assets/images/services/marketing-3.webp", "/assets/images/services/marketing-4.webp"],
    services: [
      { title: "Growth & Marketing Strategy", desc: "Where growth comes from, and who runs it." },
      { title: "Performance Marketing", desc: "Paid media, measured in revenue." },
      { title: "SEO & GEO", desc: "Found on Google and in AI answers." },
      { title: "Social Media Management", desc: "Active, on-brand channels." },
      { title: "Influencer Marketing", desc: "Creators sourced, briefed and tracked." },
      { title: "Content & Video Production", desc: "Script to final cut, in-house." },
      { title: "Email, SMS & Marketing Automation", desc: "Lifecycle flows that run themselves." },
      { title: "CRM & Revenue Operations", desc: "HubSpot and Salesforce, set up right." },
      { title: "PR & Reputation Management", desc: "Press, comms and reviews, managed." },
      { title: "Account-Based Marketing", desc: "Campaigns for the accounts you want." },
      { title: "Affiliate & Partner Marketing", desc: "Partners who sell on commission." },
      { title: "App Store Optimization", desc: "Apps found and downloaded." },
    ],
  },
  {
    id: "ai",
    name: "Automation & AI",
    color: "#0C5238",
    statement: "Agents and workflows that handle the boring bits, so you can get on with the interesting stuff.",
    // pictures shown in the hero when you hover this discipline
    images: ["/assets/images/services/ai-1.webp", "/assets/images/services/ai-2.webp", "/assets/images/services/ai-3.webp", "/assets/images/services/ai-4.webp"],
    services: [
      { title: "AI Strategy & Readiness", desc: "Where AI pays off, and a roadmap." },
      { title: "AI Agents & Multi-Agent Systems", desc: "Agents that finish the task." },
      { title: "Workflow Automation", desc: "Repetitive work, handled automatically." },
      { title: "Chatbots & Voice Agents", desc: "Support by chat or phone, any hour." },
      { title: "Knowledge Assistants & RAG", desc: "Answers from your own documents." },
      { title: "Generative AI & LLM Integration", desc: "AI features inside your product." },
      { title: "Document AI & NLP", desc: "What matters, pulled from any document." },
      { title: "Computer Vision", desc: "Systems that understand images and video." },
      { title: "Predictive Analytics & Machine Learning", desc: "Forecasts, fraud flags and churn signals." },
      { title: "MLOps & LLMOps", desc: "Models in production, kept accurate." },
      { title: "AI Governance & Security", desc: "Safe, fair, explainable AI." },
      { title: "Data Labeling & Training Data", desc: "Clean data your models learn from." },
    ],
  },
];

export const list = {
  ariaLabel: "Services",
  cta: { label: "Get in touch", href: "/contact" },
};

/* ---------- 3. Say hello ---------- */
export const hello = {
  text: "Ideas get sharper. Brands get better. Technology actually does something useful. And, occasionally, everyone gets to go home on time.",
  cta: { label: "Say hello", href: "/contact", icon: "phone" },
  hand: "/assets/images/services/hello-hand.webp",
  heading: "Good things happen when the right people stop working in silos.",
};

/* After the testimonials: this page's dashed-letter strip (art = which drawing, see src/components/closing/strips.js) */
export const strip = { label: "Design. Build. Grow. Automate.", art: "design" };
