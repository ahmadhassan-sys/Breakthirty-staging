/**
 * Content collections.
 * caseStudies: one YAML file per case study in src/content/case-studies/ → a page at /work/<file name>.
 * The schema below is what every case study must contain; the build stops with a clear message if something is
 * missing or misspelled.
 * Two templates: `template: a` (ChartSight's layout) and `template: b` (a list of sections).
 * blog: one Markdown file per post in src/content/blog/ → a page at /blog/<file name> (the old site's URLs).
 */
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const stat = z.object({
  value: z.string(),                       // what shows when the number can't roll, e.g. "74,000+" or "Any format"
  count: z.number().optional(),            // if set, the number rolls up to this…
  from: z.number().optional(),             // …starting from this
  suffix: z.string().optional(),           // e.g. "+"
});

/* what every case study has, whatever its template */
const common = {
  order: z.number().default(0),                // lower comes first in the lists
  name: z.string(),
  seo: z.object({ title: z.string(), description: z.string() }),
  // how the case study shows up on the Our Work page if it isn't already in src/data/work.js
  cards: z.object({
    home: z.object({
      kicker: z.string(), year: z.string(), title: z.string(), body: z.string(),
      image: z.string(), alt: z.string().default(""), focus: z.tuple([z.number(), z.number()]).default([0.5, 0.5]),
    }).optional(),
    work: z.object({ tags: z.array(z.string()), summary: z.string(), short: z.string(), images: z.array(z.string()).min(1) }).optional(),
  }).default({}),
  hero: z.object({ image: z.string(), label: z.string(), video: z.string().optional(), full: z.boolean().optional() }),   // full: the whole 16:9 picture/video, nothing cropped or covered
  next: z.string(),   // the id of the next case study (its page here, or its card on the Our Work page)
};

/* template a: ChartSight's layout, a fixed set of sections */
const templateA = z.object({
  template: z.literal("a"),
  ...common,
  intro: z.object({ type: z.string(), roles: z.array(z.string()), lede: z.string(), crumbTight: z.boolean().optional() }),
  demo: z.object({ label: z.string(), image: z.string(), alt: z.string() }),
  overview: z.object({
    heading: z.string(), body: z.array(z.string()),
    details: z.array(z.object({ label: z.string(), value: z.string() })),
    demoButton: z.string(),
  }),
  services: z.object({ heading: z.string(), list: z.array(z.string()) }),
  challenge: z.object({ heading: z.string(), body: z.array(z.string()) }),
  beforeAfter: z.object({
    before: z.object({ image: z.string(), label: z.string(), alt: z.string() }),
    after: z.object({ image: z.string(), label: z.string(), alt: z.string() }),
  }),
  stat: stat.extend({ text: z.string() }),
  how: z.object({ heading: z.string(), steps: z.array(z.object({ title: z.string(), text: z.string() })) }),
  output: z.object({
    heading: z.string(), navLabel: z.string(),
    parts: z.array(z.object({ tab: z.string(), title: z.string(), text: z.string(), image: z.string(), alt: z.string() })),
  }),
  statement: z.string(),
  impact: z.object({ heading: z.string(), rows: z.array(stat.extend({ text: z.string() })) }),
  outcome: z.object({
    quote: z.string(), more: z.string().optional(),
    person: z.object({ name: z.string(), role: z.string(), photo: z.string() }),
  }),
});

/* template b: the page is a list of sections, each with a `type` (see src/components/case-study/TemplateB.astro) */
const SECTION_TYPES = ["intro", "demo", "overview", "rule", "services", "challenge", "beforeAfter", "stat", "how", "note",
  "output", "statement", "brand", "impact", "outcome", "next"] as const;
const templateB = z.object({
  template: z.literal("b"),
  ...common,
  sections: z.array(z.object({ type: z.enum(SECTION_TYPES) }).passthrough()).min(1),
  still: z.boolean().optional(),   // pictures and videos appear as they are (the default); false: the reveal animation comes back
  strip: z.boolean().optional(),   // (no longer used: case studies have no dashed-letter strip)
});

const caseStudies = defineCollection({
  loader: glob({ pattern: "**/*.{yaml,yml}", base: "./src/content/case-studies" }),
  schema: z.discriminatedUnion("template", [templateA, templateB]),
});

/* blog posts: the front matter below, then the article in Markdown.
   ## heading = a section (and a line in "You will read"); ### heading = a step / item title; #### = a smaller title.
   A section called "FAQs" (or "Frequently asked questions") turns its ### questions into open / close answers.
   Pictures: ![alt text](/assets/images/blog/<post>/1.webp "optional caption"); an .mp4 plays like a GIF. */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),                          // the heading on the page and on its card
    seoTitle: z.string().optional(),            // <title> (defaults to the title)
    description: z.string(),                    // meta description
    excerpt: z.string().optional(),             // the line on its card (defaults to the description)
    lead: z.string().optional(),                // the line beside the title on the post (defaults to the description)
    date: z.coerce.date(),                      // published
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),      // the pills; also the blog page's filters
    image: z.string(),                          // the cover (post hero, cards, social share)
    imageAlt: z.string().default(""),
    cardImage: z.string().optional(),           // a different picture for the card, if any
    keywords: z.array(z.string()).default([]),
    featured: z.boolean().default(false),       // the "Must read" guide at the top of the blog page
    draft: z.boolean().default(false),          // true = not published
  }),
});

/* legal pages: src/content/legal/<name>.md → /legal/<name> (the old site's URLs) */
const legal = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/legal" }),
  schema: z.object({
    title: z.string(),
    seoTitle: z.string().optional(),
    description: z.string(),
    lead: z.string().optional(),      // the line under the title (else the description)
    company: z.string().optional(),
    updated: z.string().optional(),   // as shown: "January 14, 2025"
  }),
});

export const collections = { caseStudies, blog, legal };
