/**
 * Case study styles that depend on the page: one case study route builds every case study page, and a CSS import
 * there would go to all of them. So each template's files (and template B's per-page file) are read as text here
 * and written into that page only, after the shared styles (src/styles/pages/case-study.css).
 */
const A_ORDER = ["base", "header", "hero", "intro", "demo", "sections", "before-after", "stat", "how", "output", "statement", "impact", "outcome", "next", "page"];
const a = import.meta.glob("./case-study/*.css", { query: "?raw", import: "default", eager: true });
const b = import.meta.glob("./case-study-b/*.css", { query: "?raw", import: "default", eager: true });

/** template A: its files in cascade order · template B: base.css, then the page's own file (named after the case study) */
export function caseStudyCss(template, id) {
  if (template === "b") return [b["./case-study-b/base.css"], b[`./case-study-b/${id}.css`] || ""].join("\n");
  return A_ORDER.map((f) => a[`./case-study/${f}.css`]).join("\n");
}
