/**
 * /sitemap.xml — every page search engines should find (the same addresses as the canonical links: no trailing slash).
 * New blog posts, case studies and legal pages are picked up automatically; add any new top-level page to PAGES.
 */
import { getCollection } from "astro:content";

const PAGES = ["/", "/services", "/work", "/contact", "/blog"];

export async function GET({ site }) {
  const url = (path) => (path === "/" ? new URL("/", site).href : new URL(path, site).href.replace(/\/$/, ""));
  const day = (d) => d.toISOString().slice(0, 10);
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const cases = await getCollection("caseStudies");
  const legal = await getCollection("legal");
  const newest = posts.reduce((m, p) => Math.max(m, +(p.data.updated || p.data.date)), 0);

  const rows = [
    ...PAGES.map((p) => ({ loc: url(p), lastmod: p === "/blog" && newest ? day(new Date(newest)) : undefined })),
    ...cases.map((c) => ({ loc: url(`/work/${c.id}`) })),
    ...posts.map((p) => ({ loc: url(`/blog/${p.id}`), lastmod: day(p.data.updated || p.data.date) })),
    ...legal.map((l) => ({ loc: url(`/legal/${l.id}`) })),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rows.map((r) => `  <url><loc>${r.loc}</loc>${r.lastmod ? `<lastmod>${r.lastmod}</lastmod>` : ""}</url>`).join("\n")}
</urlset>
`;
  return new Response(xml, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
