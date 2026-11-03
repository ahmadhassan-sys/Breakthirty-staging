/**
 * Shapes a blog post's Markdown into the post template's markup (src/pages/blog/[slug].astro):
 *   everything before the first ## → <div class="bp-intro">
 *   each ## and what follows        → <section class="bp-sec" id="…"><h2 class="bp-h">…</h2><div class="bp-sec__b">…</div></section>
 *   each ### and what follows       → <div class="bp-item"><h3 class="bp-item__t">…</h3>…</div>
 *   a section named FAQ(s) / Frequently asked questions → its ### questions become <details class="bp-faq">
 *   a picture on its own line       → <figure class="bp-fig blg-img"> (an .mp4 plays like a GIF: muted, looping)
 * Picture sizes come from src/data/blog-media.json (so the page doesn't jump while they load).
 * Only files in src/content/blog/ and src/content/legal/ are touched. Runs as a Sätteri hast plugin (Astro 7's Markdown processor), see astro.config.mjs.
 */
import { readFileSync } from "node:fs";

let MEDIA = null;
const media = () => {
  if (!MEDIA) { try { MEDIA = JSON.parse(readFileSync(new URL("../data/blog-media.json", import.meta.url), "utf8")); } catch { MEDIA = {}; } }
  return MEDIA;
};

const el = (tagName, properties = {}, children = []) => ({ type: "element", tagName, properties, children });
const text = (n) => (n.type === "text" ? n.value : (n.children || []).map(text).join(""));
const isEl = (n, ...tags) => n && n.type === "element" && (!tags.length || tags.includes(n.tagName));
const blank = (n) => n.type === "text" && !n.value.trim();
const addClass = (n, c) => {
  const p = n.properties, prev = [p.className, p.class].flatMap((v) => (v == null ? [] : Array.isArray(v) ? v : String(v).split(/\s+/))).filter(Boolean);
  delete p.class; p.className = [...prev, ...c.split(" ")];
};
const slugify = (s) => s.toLowerCase().replace(/[’'"]/g, "").replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60) || "section";
const FAQ = /^(faqs?|frequently asked questions)\b/i;
const CHEVRON = el("svg", { viewBox: "0 0 20 11", fill: "none", stroke: "currentColor", strokeWidth: "1.3", ariaHidden: "true" }, [el("path", { d: "M1 1l9 9 9-9" })]);

function figure(img, caption) {
  const src = String(img.properties.src || ""), alt = String(img.properties.alt || "");
  const size = media()[src] || [];
  const dims = size.length ? { width: String(size[0]), height: String(size[1]) } : {};
  const style = size.length ? `aspect-ratio:${size[0]}/${size[1]}` : undefined;
  const m = /\.mp4$/i.test(src)
    ? el("video", { className: ["bp-fig__m"], src, poster: src.replace(/\.mp4$/i, ".webp"), muted: true, loop: true, playsInline: true, preload: "none", ariaLabel: alt || undefined, ...dims }, [])
    : el("img", { className: ["bp-fig__m"], src, alt, loading: "lazy", decoding: "async", ...dims });
  const kids = [el("span", { className: ["bp-fig__in"], style }, [m])];
  if (caption) kids.push(el("figcaption", { className: ["bp-fig__cap"] }, [{ type: "text", value: caption }]));
  return el("figure", { className: ["bp-fig", "blg-img"] }, kids);
}

/* one block of the article, dressed for the template */
function dress(n) {
  if (isEl(n, "p")) {
    const kids = n.children.filter((c) => !blank(c));
    if (kids.length === 1 && isEl(kids[0], "img")) return figure(kids[0], kids[0].properties.title);
    n.properties.dataReveal = "";
  } else if (isEl(n, "ul")) { addClass(n, "bp-ul"); n.properties.dataReveal = ""; }
  else if (isEl(n, "ol")) { addClass(n, "bp-ol"); n.properties.dataReveal = ""; }
  else if (isEl(n, "h4", "h5", "h6")) { n.tagName = "h4"; addClass(n, "bp-sub"); n.properties.dataReveal = ""; }
  else if (isEl(n, "table")) return el("div", { className: ["bp-table"], dataReveal: "" }, [n]);
  else if (isEl(n, "pre")) { addClass(n, "bp-code"); n.properties.dataReveal = ""; }
  else if (isEl(n, "blockquote")) { addClass(n, "bp-quote"); n.properties.dataReveal = ""; }
  return n;
}

/* links: other sites open in a new tab */
function links(n) {
  if (isEl(n, "a")) {
    const href = String(n.properties.href || "");
    if (/^https?:\/\//.test(href) && !/^https?:\/\/(www\.)?breakthirty\.com/.test(href)) { n.properties.target = "_blank"; n.properties.rel = ["noopener"]; }
  }
  (n.children || []).forEach(links);
}

export const slugifyHeading = slugify;

/* a plain copy of the (read-only) tree: type, tag, properties, value, children */
const copy = (n) => {
  const o = { type: n.type };
  if (n.tagName) o.tagName = n.tagName;
  if (n.properties) o.properties = { ...n.properties };
  if ("value" in n) o.value = n.value;
  if (n.children) o.children = Array.from(n.children, copy);
  return o;
};

/* the Sätteri plugin: only for the blog's files; rebuilds the document once its tree is complete */
export default function blogPlugin(ctx) {
  const path = ctx && ctx.fileURL ? decodeURIComponent(ctx.fileURL.pathname) : "";
  if (!/content[\\/]+(blog|legal)[\\/]/.test(path)) return null;   // the blog posts and the legal pages (same template)
  return {
    name: "b30-blog",
    after(root, c) {
      const tree = copy(root);
      shape(tree);
      c.replaceNode(root, tree);
    },
  };
}

function shape(tree) {
  {
    links(tree);
    const nodes = tree.children.filter((n) => !blank(n));
    const out = [], ids = new Set();
    let intro = [], sec = null, body = null, item = null, faq = false;
    const flushIntro = () => { if (intro.length) out.push(el("div", { className: ["bp-intro"] }, intro)); intro = []; };
    for (const raw of nodes) {
      if (isEl(raw, "h2")) {
        flushIntro();
        const t = text(raw).trim();
        let id = slugify(t), k = 2; while (ids.has(id)) id = `${slugify(t)}-${k++}`; ids.add(id);
        faq = FAQ.test(t);
        raw.properties = { className: ["bp-h"], id: `${id}-h`, dataHeading: "" };
        body = el("div", { className: ["bp-sec__b"] }, faq ? [el("div", { className: ["bp-faqs"] }, [])] : []);
        sec = el("section", { className: ["bp-sec"], id, ariaLabelledBy: `${id}-h` }, [raw, body]);
        out.push(sec); item = null;
        continue;
      }
      if (!sec) { intro.push(dress(raw)); continue; }
      if (faq) {
        const list = body.children[0];
        if (isEl(raw, "h3", "h4")) {
          const first = !list.children.length;
          item = el("div", { className: ["bp-faq__a"] }, []);
          list.children.push(el("details", { className: ["bp-faq"], open: first || undefined, dataReveal: "" }, [
            el("summary", {}, [el("span", {}, raw.children), el("i", { className: ["bp-faq__ic"] }, [CHEVRON])]), item]));
        } else if (item) { const d = dress(raw); if (d.properties) delete d.properties.dataReveal; item.children.push(d); }
        else body.children.splice(body.children.length - 1, 0, dress(raw));   // words before the first question
        continue;
      }
      if (isEl(raw, "h3")) {
        raw.properties = { className: ["bp-item__t"], dataReveal: "" };
        item = el("div", { className: ["bp-item"] }, [raw]);
        body.children.push(item);
        continue;
      }
      (item || body).children.push(dress(raw));
    }
    flushIntro();
    tree.children = out;
  }
}
