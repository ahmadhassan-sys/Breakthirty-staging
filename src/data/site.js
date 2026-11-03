/* =====================================================================
   SITE-WIDE CONTENT — used on every page: the header, the partners strip,
   testimonials, the closing line and the footer.

   Links can point somewhere else on a given page with `on`:
     { href: "/services#design", on: { home: "#services" } }
   → "#services" on the homepage, "/services#design" everywhere else.
   Page keys: home, services, contact, work.
   ===================================================================== */

/* ---------- Company details (header, footer, contact page) ---------- */
export const company = {
  email: "hello@breakthirty.com",
  phone: "(702) 337-2733",
  phoneHref: "tel:+17023372733",
  address: "285 N Main Street, Suite 905 Kaysville, UT 84037, USA",
  // for search engines (structured data on every page)
  name: "Break Thirty",
  legalName: "Breakthirty LLC",
  url: "https://www.breakthirty.com",
  logo: "/assets/images/breakthirty-logo.png",
  street: "285 N Main Street, Suite 905",
  city: "Kaysville",
  region: "UT",
  postalCode: "84037",
  country: "US",
  social: [
    "https://www.linkedin.com/company/break-thirty",
    "https://www.instagram.com/wearebreakthirty",
    "https://www.facebook.com/breakthirty",
    "https://x.com/breakthirty",
  ],
};

/* ---------- Search engines and analytics (every page's <head>) ---------- */
export const searchSetup = {
  // Google Search Console ownership — the same token as on the old site, so the verified property keeps working
  googleVerification: "QvVObMIXx6PvbrFMIxtyTbsiCcpGDcd3wzoTwUhgO40",
  // Google Tag Manager — the old site's container (GA and any other tags are managed inside it). "" turns it off.
  gtm: "GTM-PZTWZ3V9",
  // Google Analytics 4 — the same measurement ID the Webflow site uses, so all visits keep going to the same GA property. "" turns it off.
  ga4: "G-RBSDEJ4KSM",
  // the company in one line (structured data)
  description: "Break Thirty is one accountable team for design, engineering, marketing and AI automation — brands, websites, Shopify, SEO and AI, from first sketch to scale.",
  knowsAbout: ["Brand strategy", "Brand identity", "UI/UX design", "Web development", "Shopify development", "Search engine optimization", "Conversion rate optimization", "Paid search", "Paid social", "Email marketing", "Amazon Seller Central", "AI automation"],
  areaServed: "Worldwide",
};

/* ---------- Header ---------- */
export const nav = {
  homeLabel: "breakthirty home",
  links: [
    // `page` marks the link as the current page (aria-current) on that page
    { label: "What we do", href: "/services", page: "services", on: { services: "#services" } },
    { label: "Work", href: "/work", page: "work", on: { work: "#work" } },
    { label: "Contact", href: "/contact", page: "contact", on: { contact: "#form" } },
  ],
  cta: { label: "Get in touch", href: "/contact", on: { contact: "#form" }, icon: "phone" },
};

/* ---------- Partners strip (under the hero) ---------- */
export const partnersStrip = {
  ariaLabel: "Official partners",
  label: "Official Partners",
  // `logo` picks the artwork from stripLogos in src/data/partners.js; `text` is shown next to it (leave out for logo only)
  logos: [
    { logo: "Shopify Partner", text: "Shopify Partner" },
    { logo: "Webflow", text: "Webflow" },
    { logo: "Klaviyo", text: "Klaviyo" },
    { logo: "AWS" },
    { logo: "Framer", text: "Framer" },
    { logo: "Azure", text: "Azure" },
    { logo: "Google Cloud", text: "Google Cloud" },
  ],
};

/* ---------- Testimonials ---------- */
export const testimonials = {
  heading: "*People* who'd take our call again.",   // *word* = the highlighted word
  eyebrow: "Testimonials",
  cta: { label: "Get in touch", href: "/contact" },
  verifiedBy: { logo: "/assets/images/clutch-logo.png", name: "Clutch", label: "Verified" },
  nextLabel: "Next",
  // q = paragraphs of the quote
  items: [
    {
      q: [
        "Break Thirty helped build my visual identity and web presence from the ground up. The team made meaningful progress weekly and put my new brand in a great position for launch. They meet deadlines, are incredibly responsive, and the design talent on their team is top notch.",
        "Break Thirty truly seemed to care about my satisfaction. They worked to understand my needs with patience, confidence and genuine care. I was very happy with the work, so I can’t think of any areas they could have done differently.",
      ],
      who: "Evan Goldsmith",
      org: "Kind Over Matter Creative",
      img: "/assets/images/testimonial-evan-goldsmith.jpg",
    },
    {
      q: [
        "Break Thirty built and maintain both websites in Webflow, developed the Structural Stories brand, designed pitch decks and client service agreement templates, built a custom photo storage application, and handle ongoing SEO, email signatures, and site updates.",
        "They were always on time and on top of things. We meet every week, I bring the list, and it comes back done. When I email something between calls I usually have an answer the same day. I change my mind, I redesign things, I show up with ideas out of left field, and the answer is always “okay, we can do that,” followed by something better than I pictured.",
      ],
      who: "Weldon Brewster",
      org: "Structural Stories",
      img: "/assets/images/testimonial-weldon-brewster.jpg",
    },
    {
      q: [
        "Initially, the project was for website development, but it ended up being a massive undertaking with product development, branding, and resourcing the entire project.",
        "From having an idea on paper to creating the actual product in hand, none of this was possible without Ryan and his team. They kept our development on track, helped us figure out new ways to keep product development moving forward, and helped us overcome hurdles when it was not even their job.",
        "I was impressed with how personable and attentive they were. I’ve never worked with a team that stayed so calm, optimistic, and patient. Break Thirty went above and beyond to keep our product in motion from beginning to end.",
      ],
      who: "Autumn Payne",
      org: "Ethical Narrative",
      img: "/assets/images/testimonial-autumn-payne.jpg",
    },
    {
      q: [
        "Break Thirty has been an ongoing marketing partner for Promescent, supporting our team across performance marketing, Amazon, reporting and analytics, website redesign, and SEO.",
        "They cut unnecessary ad spend by 70% while optimizing organic growth, and raised our new customer ROAS from about 1.5x to over 2x. Their reporting gave our team one reliable view of performance across channels, making budget and strategy decisions faster and more confident.",
        "Their project management has been excellent. They consistently deliver on time, reply quickly, and handle urgent issues with real urgency. They flag issues, bring new ideas, and recommend next steps before we ask. They are invested in our success and treat our business like their own. Break Thirty has become a trusted part of our team.",
      ],
      who: "Martin Rubio",
      org: "Promescent",
      img: "/assets/images/testimonial-martin-rubio-2.jpg",
    },
  ],
};

/* ---------- Contact (the closing line before the footer) ---------- */
/* After the testimonials, on every page: the dashed-letter strip and the call to action */
export const closing = {
  strip: { label: "Sketch. Make. Break. Scale.", art: "sketch" },   // homepage + case studies; the other pages set their own `strip`
  cta: {
    eyebrow: "Let's talk",
    heading: "Building something?\nOr fixing something broken?",   // \n = line break, *word* = highlighted word
    button: { label: "Get in touch", href: "/contact" },
  },
};

export const contact = {
  // The closing words: two lines, each with a left and a right word. *word* = the mono (pixel) style.
  // (hidden now: the closing band is a short white space before the footer)
  closing: [
    ["Sketch.", "*Make*."],
    ["*Break*.", "Scale."],
  ],
  // older closing heading — kept for the section's label; hidden on the page now
  heading: ["Building something?", "Or fixing something", "broken?"],
  text: "Tell us what you're building, or what's broken. The first chat is on us, and we'll be honest about whether we're the right fit.",
};

/* ---------- Footer ---------- */
export const footer = {
  wordmark: "breakthirty",
  heading: { before: "Let’s ", highlight: "break", after: " the usual. ", second: "Boring can sit this one out." },
  // x / y = position on the 1920-wide design
  columns: [
    { title: "Services", nav: true, x: 1110, y: 295, links: [
      { label: "Design", href: "/services#design", on: { home: "#services", services: "#design" } },
      { label: "Marketing", href: "/services#marketing", on: { home: "#services", services: "#marketing" } },
      { label: "Engineering", href: "/services#engineering", on: { home: "#services", services: "#engineering" } },
      { label: "Automation & AI", href: "/services#ai", on: { home: "#services", services: "#ai" } },
    ] },
    { title: "Company", nav: true, x: 1423, y: 295, links: [
      { label: "Work", href: "/work", on: { work: "#work" } },
      { label: "About", href: "/#vision", on: { home: "#vision" } },
      { label: "Blog", href: "/blog" },
      { label: "Contact", href: "/contact", on: { contact: "#form" } },
    ] },
    { title: "Socials", nav: true, x: 1651, y: 295, links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/company/break-thirty", external: true },
      { label: "Instagram", href: "https://www.instagram.com/wearebreakthirty", external: true },
      { label: "Facebook", href: "https://www.facebook.com/breakthirty", external: true },
    ] },
    { title: "New Business", x: 1110, y: 485, links: [
      { label: company.email, href: `mailto:${company.email}` },
      { label: company.phone, href: company.phoneHref },
    ] },
    { title: "Address", x: 1423, y: 480, address: company.address },
  ],
  cta: { label: "Get in touch", href: `mailto:${company.email}?subject=Hello%20Breakthirty`, icon: "phone" },
  copyright: { year: "2025", text: " | All rights reserved." },
  legal: [
    { label: "Privacy Policy", href: "/legal/privacy-policy" },
    { label: "Terms of Service", href: "/legal/terms-of-service" },
  ],
};
