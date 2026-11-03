/**
 * /rss.xml — the blog's feed (newest first), for feed readers and anything that follows the blog.
 * Linked from every page's <head> (src/layouts/BaseLayout.astro).
 */
import { posts } from "../lib/blog.js";

const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET({ site }) {
  const all = await posts();
  const url = (p) => new URL(p, site).href.replace(/(.)\/$/, "$1");
  const items = all.map((p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${url(p.href)}</link>
      <guid isPermaLink="true">${url(p.href)}</guid>
      <pubDate>${p.date.toUTCString()}</pubDate>
      <description>${esc(p.entry.data.description)}</description>
${p.tags.map((t) => `      <category>${esc(t)}</category>`).join("\n")}
      <enclosure url="${url(p.image)}" type="${/\.png$/i.test(p.image) ? "image/png" : /\.jpe?g$/i.test(p.image) ? "image/jpeg" : "image/webp"}" length="0" />
    </item>`).join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Break Thirty blog</title>
    <link>${url("/blog")}</link>
    <atom:link href="${url("/rss.xml")}" rel="self" type="application/rss+xml" />
    <description>Guides on Shopify, SEO, paid search and social, email marketing, Amazon Seller Central and more, from the Break Thirty team.</description>
    <language>en-us</language>
    <lastBuildDate>${(all[0] ? all[0].date : new Date()).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
