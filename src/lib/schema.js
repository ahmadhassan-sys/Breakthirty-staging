/**
 * Structured data (schema.org) for each kind of page. BaseLayout already puts the company, the website, the page itself
 * and its breadcrumb on every page; these add what the page is about. They go in a page's `seo.schema`.
 * Check any page with https://validator.schema.org or Google's Rich Results Test after changing these.
 */
const abs = (path, site) => new URL(path, site).href.replace(/(.)\/$/, "$1");
const org = (site) => ({ "@id": new URL("/#organization", site).href });   // the company node BaseLayout puts on every page
const plain = (s = "") => String(s).replace(/\*([^*]+)\*/g, "$1").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[`_]/g, "").replace(/\s+/g, " ").trim();

/** /services — the four disciplines as services, each with its catalogue of services */
export function servicesSchema(disciplines, site) {
  const provider = org(site);
  return disciplines.map((d) => ({
    "@type": "Service",
    "@id": `${abs(`/services#${d.id}`, site)}`,
    name: d.name,
    serviceType: d.name,
    description: d.statement,
    url: abs(`/services#${d.id}`, site),
    provider,
    areaServed: "Worldwide",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${d.name} services`,
      itemListElement: d.services.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.title, description: s.desc } })),
    },
  }));
}

/** /work — the case studies as a list (only those with their own page) */
export function workListSchema(cases, site) {
  const items = cases.filter((c) => c.href && c.href.startsWith("/work/"));
  return [{
    "@type": "ItemList",
    name: "Case studies",
    numberOfItems: items.length,
    itemListElement: items.map((c, i) => ({ "@type": "ListItem", position: i + 1, url: abs(c.href, site), name: c.name })),
  }];
}

/** /work/<case> — the project itself */
export function caseStudySchema(entry, site) {
  const d = entry.data, intro = (d.sections || []).find((s) => s.type === "intro") || {};
  const url = abs(`/work/${entry.id}`, site);
  return [{
    "@type": "CreativeWork",
    "@id": `${url}#project`,
    name: d.name,
    headline: d.seo.title,
    description: d.seo.description,
    url,
    image: abs(d.hero.image, site),
    creator: org(site),
    publisher: org(site),
    mainEntityOfPage: { "@id": `${url}#webpage` },
    ...(intro.kind ? { genre: plain(intro.kind) } : {}),
    ...(intro.roles && intro.roles.length ? { keywords: intro.roles.map(plain).join(", ") } : {}),
    ...(intro.lede ? { abstract: plain(intro.lede) } : {}),
    inLanguage: "en-US",
  }];
}

/** /blog — the blog and its posts */
export function blogSchema(list, site) {
  const url = abs("/blog", site);
  return [{
    "@type": "Blog",
    "@id": `${url}#blog`,
    name: "The Break Thirty blog",
    url,
    publisher: org(site),
    inLanguage: "en-US",
    blogPost: list.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: abs(p.href, site),
      datePublished: p.iso,
      image: abs(p.image, site),
    })),
  }];
}

/** the questions and answers of a post's "FAQ" section (## FAQ… then ### question / answer paragraphs) */
export function faqsFrom(markdown = "") {
  const m = markdown.match(/^##\s+(faqs?|frequently asked questions)\b[^\n]*\n([\s\S]*?)(?=^##\s|(?![\s\S]))/im);
  if (!m) return [];
  return m[2].split(/^###\s+/m).slice(1).map((block) => {
    const [q, ...rest] = block.split("\n");
    const a = rest.join("\n").replace(/!\[[^\]]*\]\([^)]*\)/g, "").split(/\n{2,}/).map(plain).filter(Boolean).join(" ");
    return { q: plain(q.replace(/^\d+\\?\.\s*/, "")), a };
  }).filter((x) => x.q && x.a);
}

/** /blog/<post> — the post, and its FAQs when it has some */
export function postSchema({ post, data, minutes, words, author, site }) {
  const url = abs(post.href, site);
  const nodes = [{
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@id": `${url}#webpage` },
    url,
    headline: data.title,
    description: data.description,
    image: { "@type": "ImageObject", url: abs(data.image, site), caption: data.imageAlt || data.title },
    datePublished: post.iso,
    dateModified: data.updated ? data.updated.toISOString().slice(0, 10) : post.iso,
    ...(data.keywords && data.keywords.length ? { keywords: data.keywords.join(", ") } : {}),
    author: { "@type": "Organization", name: author, url: abs("/", site) },
    publisher: org(site),
    articleSection: data.tags[0],
    about: data.tags.map((t) => ({ "@type": "Thing", name: t })),
    wordCount: words,
    timeRequired: `PT${minutes}M`,
    inLanguage: "en-US",
    isPartOf: { "@type": "Blog", "@id": `${abs("/blog", site)}#blog`, name: "The Break Thirty blog", url: abs("/blog", site) },
  }];
  const faqs = faqsFrom(post.entry.body);
  if (faqs.length) nodes.push({
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    isPartOf: { "@id": `${url}#webpage` },
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  });
  return nodes;
}

/** /contact — how to reach the company */
export function contactSchema(company, site) {
  return [{
    "@type": "ContactPoint",
    "@id": `${abs("/contact", site)}#contact-point`,
    contactType: "sales",
    email: company.email,
    telephone: company.phoneHref.replace("tel:", ""),
    url: abs("/contact", site),
    availableLanguage: "English",
  }];
}
