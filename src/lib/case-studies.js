/**
 * Case studies, from src/content/case-studies/ (one file each, page at /work/<file name>).
 * Our Work page: the entry with the same id in src/data/work.js links to the page (or the file's `cards.work` adds
 * one). Homepage: the item whose `case` is the id links to the page.
 */
import { getCollection } from "astro:content";
import { cases as placeholderCases } from "../data/work.js";
import { work as homeWork } from "../data/home.js";

export const caseHref = (id) => `/work/${id}`;

/** every case study file, in `order` */
export async function caseStudies() {
  return (await getCollection("caseStudies")).sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id));
}

/**
 * the Our Work page's list, from src/data/work.js. An entry whose id matches a case study file (e.g. "construction-check"
 * and construction-check.yaml) links to that page. Case study files that aren't in work.js but have `cards.work` go first.
 */
export async function workCases() {
  const files = await caseStudies(), ids = new Set(files.map((c) => c.id));
  const listed = new Set(placeholderCases.map((c) => c.id));
  const extra = files.filter((c) => c.data.cards.work && !listed.has(c.id)).map((c) => ({
    id: c.id, name: c.data.name, href: caseHref(c.id), ...c.data.cards.work,
  }));
  return [...extra, ...placeholderCases.map((c) => (ids.has(c.id) ? { ...c, href: caseHref(c.id) } : c))];
}

/**
 * the homepage's Selected Work list (src/data/home.js). An item's `case` is a case study id: it links to /work/<id>
 * when that case study file exists, otherwise to the Our Work page. Case study files with `cards.home` that no item
 * points to are added in front.
 */
export async function homeWorkItems() {
  const files = await caseStudies(), ids = new Set(files.map((c) => c.id));
  const linked = new Set(homeWork.items.map((it) => it.case).filter(Boolean));
  const extra = files.filter((c) => c.data.cards.home && !linked.has(c.id)).map((c) => {
    const h = c.data.cards.home;
<<<<<<< HEAD
    return { kicker: h.kicker, year: h.year, title: h.title, body: h.body, href: caseHref(c.id), img: h.image, alt: h.alt, focus: h.focus, hero: c.data.hero && c.data.hero.image };
  });
  const byId = new Map(files.map((c) => [c.id, c]));
  // hero: the case study's own hero picture (the homepage zoom turns into it on the way, see public/js/core.js)
  const items = homeWork.items.map(({ case: id, ...it }) => ({ ...it, href: it.href || (id && ids.has(id) ? caseHref(id) : "/work"),
    hero: id && byId.get(id) && byId.get(id).data.hero ? byId.get(id).data.hero.image : undefined }));
=======
    return { kicker: h.kicker, year: h.year, title: h.title, body: h.body, href: caseHref(c.id), img: h.image, alt: h.alt, focus: h.focus };
  });
  const items = homeWork.items.map(({ case: id, ...it }) => ({ ...it, href: it.href || (id && ids.has(id) ? caseHref(id) : "/work") }));
>>>>>>> f0e7d935b7adba6199409368d09b447496a99313
  return [...extra, ...items];
}

/** the "Next case study" block for a case study: its number in the list, name, summary, link and cover */
export async function nextCase(id) {
  const list = await workCases(), i = list.findIndex((c) => c.id === id);
  const c = list[i];
  if (!c) return null;
  return { n: `(${String(i + 1).padStart(2, "0")})`, name: c.name, text: c.summary, href: c.href, image: c.images[0] };
}
