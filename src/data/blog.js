/* =====================================================================
   Blog — the words on the blog page (/blog) and around every post (/blog/<post>).
   The posts themselves are Markdown files in src/content/blog/ (one per post; the file name is the URL).
   ===================================================================== */

/* ---------- The blog page ---------- */
export const seo = {
  title: "Marketing Tips & Strategies | The Break Thirty™ Blog",
  description: "Discover effective strategies and expert insights for digital growth, covering development, CRO, SEO, PPC, social media, email marketing, and beyond.",
  themeColor: "#ffffff",
};

export const hero = {
  title: ["The blog. No fluff,", "just good stuff."],   // two lines
  hint: { label: "Scroll to blogs", href: "#blogs" },
  featured: { pill: "Must read", button: "Read the guide" },   // the post with `featured: true` (else the newest)
};

export const list = {
  heading: "All Blogs",
  all: "All",          // the first filter; the number of guides is added after it
  filtersLabel: "Filter guides by category",
  filterLabel: "Filter",          // phones: the button that opens the filters
  sheetTitle: "Filter guides",    // phones: the filters' title
  closeLabel: "Close filters",
};

/* ---------- Around every post ---------- */
export const post = {
  back: { label: "Back", href: "/blog" },
  toc: "You will read",
  cta: { text: "Get a free audit to optimize your performance.", button: { label: "Get in touch", href: "/contact" } },
  more: "Discover More",
  minRead: "min read",
  author: "Break Thirty",   // for search engines (structured data)
};

/* After the guides: this page's dashed-letter strip (art = which drawing, see src/components/closing/strips.js) */
export const strip = { label: "Read. Apply. Test. Grow.", art: "read" };
