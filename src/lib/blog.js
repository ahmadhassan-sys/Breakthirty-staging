/**
 * Blog helpers: the posts in src/content/blog/, newest first, with their read time, date label and link.
 */
import { getCollection } from "astro:content";

const fmt = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

export const postHref = (id) => `/blog/${id}`;
export const dateLabel = (d) => fmt.format(d);

/* words in the Markdown body ÷ 200 a minute */
export const readMinutes = (body = "") => {
  const words = body.replace(/!\[[^\]]*\]\([^)]*\)/g, " ").replace(/[#*_>`|\-\[\]()]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
};

/* every published post, newest first; each with what the cards and pages show */
export async function posts() {
  const all = await getCollection("blog", ({ data }) => !data.draft);
  return all
    .map((e) => ({
      id: e.id,
      entry: e,
      href: postHref(e.id),
      title: e.data.title,
      excerpt: e.data.excerpt || e.data.description,
      tags: e.data.tags,
      image: e.data.cardImage || e.data.image,
      imageAlt: e.data.imageAlt || e.data.title,
      date: e.data.date,
      dateLabel: dateLabel(e.data.date),
      iso: e.data.date.toISOString().slice(0, 10),
      minutes: readMinutes(e.body),
      featured: e.data.featured,
    }))
    .sort((a, b) => b.date - a.date || a.title.localeCompare(b.title));
}

/* the filters: every tag, most used first */
export function tagList(list) {
  const n = new Map();
  list.forEach((p) => p.tags.forEach((t) => n.set(t, (n.get(t) || 0) + 1)));
  return [...n.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t]) => t);
}

/* "Discover More" under a post: the newest posts that share a tag with it, then the newest of the rest */
export function related(list, post, count = 3) {
  const others = list.filter((p) => p.id !== post.id);
  const share = others.filter((p) => p.tags.some((t) => post.tags.includes(t)));
  return [...share, ...others.filter((p) => !share.includes(p))].slice(0, count);
}
