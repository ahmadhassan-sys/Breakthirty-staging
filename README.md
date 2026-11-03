# Break Thirty — Astro

```sh
npm install
npm run dev      # http://localhost:4321  ·  /services  ·  /work  ·  /contact
npm run build    # outputs to ./dist
npm run preview
```

Needs Node 22.23.4 or newer.

## Pages

| URL         | Page file                   | Its own content         |
|-------------|-----------------------------|-------------------------|
| `/`         | `src/pages/index.astro`     | `src/data/home.js`      |
| `/services` | `src/pages/services.astro`  | `src/data/services.js`  |
| `/work`     | `src/pages/work.astro`      | `src/data/work.js`      |
| `/contact`  | `src/pages/contact.astro`   | `src/data/contact.js`   |
| `/blog`     | `src/pages/blog/index.astro` | `src/data/blog.js` + `src/content/blog/` |
| `/blog/<post>` | `src/pages/blog/[slug].astro` | one Markdown file per post in `src/content/blog/` |

Sections used on every page (header, partners strip, testimonials, the dashed-letter strip, the closing
call to action, footer) and the
company details (email, phone, address) come from **`src/data/site.js`** — edit them once, every page updates.

## Where things live

```
src/
  data/
    site.js            ← shared: header links, partners strip, testimonials, closing strip + call to action, footer
    home.js            ← homepage sections
    services.js        ← services page sections (disciplines + their services, hero, say hello)
    services-icons.js  ← the icon of each service (keyed by the service title)
    work.js            ← Our Work page: hero, filters, featured project, case studies, one-team section
    contact.js         ← contact page: hero, form labels, where the form sends + its messages
    partners.js        ← partner logos + office locations
  pages/               ← one file per page: section order + the page's script list
  layouts/BaseLayout.astro ← <head> and the script loader
  components/          ← one Astro component per section (layout only; content comes in as props)
    Header  PartnersStrip  Testimonials  Contact  Footer                 (shared)
    closing/           ← Strip (dashed-letter strip; drawings in strips.js)  ClosingCta ("Building something?")   (shared)
    Hero  Work  Services  WhyOneTeam  Vision  Network                     (homepage)
    services/          ← ServicesHero  ServicesList  SayHello          (services page)
    work/              ← WorkHero  WorkList  WorkHello                 (Our Work page)
    contact/           ← ContactHero  ContactForm                      (contact page)
    ui/                ← Button, Icon, Wordmark, ArrowIcon, Rich (heading formatting), TargetLink, links helper
  styles/
    pages/home.css     ← the homepage's style list, in cascade order
    pages/services.css ← the services page's style list, in cascade order
    pages/work.css     ← the Our Work page's style list, in cascade order
    pages/contact.css  ← the contact page's style list, in cascade order
    *.css              ← one file per section (+ global, shared, theme, dark)
    services/*.css     ← the services page's own sections
    work-page/*.css    ← the Our Work page's own sections
    contact/*.css      ← the contact page's own sections
public/
  js/                  ← one script per section; each page lists the ones it runs (in order)
  assets/              ← fonts/, images/ (services/, work/ for those pages), videos/
```

## Editing content

- Text, links, images: the files in `src/data/`.
- In headings, `*word*` makes the highlighted word and `\n` is a line break.
- Links can point somewhere else on a given page with `on`, e.g.
  `{ href: "/services#design", on: { home: "#services" } }` → `#services` on the homepage.
- Lists that the scripts build (case studies, services cards, testimonials, partner grid, the
  services page's icons and hero pictures, the closing words) also come from `src/data/`; each page
  passes them to its scripts through a JSON block, so you never edit the JS for content.

## Adding a page

1. Create `src/pages/your-page.astro` (copy `services.astro` as a starting point).
2. Reuse the shared components and add the page's own in `src/components/your-page/`.
3. Add `src/styles/pages/your-page.css` listing its style files in order.
4. List the page's scripts (from `public/js`) in the page file.

## The dashed-letter strip

After the testimonials each page has its own words: "Sketch. Make. Break. Scale." (homepage and case studies,
`closing.strip` in `src/data/site.js`), "Sketched. Made. Broken. Scaled." (Our Work), "Design. Build. Grow. Automate."
(services), "Talk. Sketch. Quote. Start." (contact) — the `strip` in each page's data file. `art` picks the drawing in
`src/components/closing/strips.js` (its outline, size, loop time and the pixels the hover fills in).

## The blog

Each post is one Markdown file in `src/content/blog/`; the file name is its URL (`how-to-pay-for-facebook-ads.md` →
`/blog/how-to-pay-for-facebook-ads`, the same URLs as the old Webflow site). The 45 posts and their pictures were copied
from the old site; pictures are in `public/assets/images/blog/<post>/` (`cover.webp`, then `1.webp`, `2.mp4`… — the old
GIFs are short looping videos now, with a `.webp` still beside each).

The front matter (title, SEO title, description, date, tags, cover…) is listed in `src/content.config.ts`. In the text:

- `## Heading` starts a section (and a line in "You will read"); `### Heading` is a step or item title; `####` a smaller one.
- A section called `## FAQs` turns each `### question` and the paragraphs under it into an open / close answer.
- `![alt text](/assets/images/blog/<post>/1.webp "caption")` on its own line is a figure; an `.mp4` plays like a GIF.
- Tables, code blocks, lists and links work as usual Markdown.

The shaping is done by `src/lib/rehype-blog.mjs` (a plugin for Astro's Markdown processor, set in `astro.config.mjs`).
After changing that file, delete `.astro/data-store.json` (Astro caches rendered posts) and restart `npm run dev`.

The blog page shows the post with `featured: true` as "Must read", then every other post, newest first; the filters are
the posts' tags. Under each post, "Discover More" shows three posts that share a tag with it. The words around the posts
are in `src/data/blog.js`. `public/_redirects` sends the old `/blogs/all-blogs` (and the old service pages) to the new pages.
Canonical and share links use `site` in `astro.config.mjs` (`https://www.breakthirty.com`).

## SEO

- Each page's title and description: `seo` in its data file (`src/data/*.js`), `seo:` in a case study file, the front
  matter of a blog post or legal page. Keep titles under ~60 characters and descriptions under ~160.
- Every page gets a canonical link, share tags (`og:` / `twitter:`) and structured data (the company and the website;
  breadcrumbs on inner pages; an article on blog posts) from `src/layouts/BaseLayout.astro`. The company details used
  there are `company` in `src/data/site.js`. The default share picture is `public/assets/images/og-default.jpg`
  (1200 × 630); case studies and posts use their own cover.
- `/sitemap.xml` is built from the pages, case studies, posts and legal pages (`src/pages/sitemap.xml.js`);
  `public/robots.txt` points to it. Submit `https://www.breakthirty.com/sitemap.xml` in Google Search Console.
- `public/_redirects` sends every address of the old Webflow site to its new page (301), so their search standing moves over.
- Legal pages: `src/content/legal/*.md` → `/legal/privacy-policy`, `/legal/terms-of-service` (the old URLs).
- `src/pages/404.astro` is the page shown for addresses that don't exist (kept out of search results).

### Structured data, verification, analytics (added in the full SEO pass)

- Every page: the company (Organization, with contact point), the website, the page itself (WebPage / CollectionPage / ContactPage) and its breadcrumb — `src/layouts/BaseLayout.astro`.
- Per page, from `src/lib/schema.js`: services (Service + OfferCatalog of all 52), the Our Work list (ItemList), each case study (CreativeWork), the blog (Blog), each post (BlogPosting, plus FAQPage when it has a FAQ section).
- Google Search Console verification and Google Tag Manager (the old site's `GTM-PZTWZ3V9`): `searchSetup` in `src/data/site.js`. Google Analytics 4 (`G-RBSDEJ4KSM`, the Webflow site's property) is `searchSetup.ga4`. A sent contact form pushes `contact_form_submit` (GTM) and `generate_lead` (GA4).
- `/rss.xml` (blog feed), `/site.webmanifest`, `/favicon.ico` + PNG icons; old `/blog-tags/*` pages redirect to `/blog`.
- Check a page after changing schema: https://search.google.com/test/rich-results and https://validator.schema.org

## The contact form (Netlify Forms)

The form on /contact is a Netlify Form named `contact`. Netlify keeps every submission (Netlify → your site → Forms)
and emails each one to ahmad.hassan@breakthirty.com; hitting Reply answers the visitor. One-time setup in Netlify:
1. Site configuration → Forms → **Enable form detection**, then redeploy (Netlify finds the form in the built HTML).
2. Forms → Form notifications → Add notification → **Email notification** → form `contact` → ahmad.hassan@breakthirty.com.
Spam: the hidden `website` field (honeypot) plus Netlify's own spam filter. On `npm run dev` there is no Netlify, so
the form opens the visitor's email app instead. Keep `name="contact"`, `data-netlify` and the hidden fields in
`src/components/contact/ContactForm.astro`. (An AWS Lambda alternative is in `aws/contact-form/`: set `PUBLIC_FORM_ENDPOINT`.)

## Case study pages

Each case study is one file in `src/content/case-studies/` and becomes a page at `/work/<file name>`
(`chartsight.yaml` → `/work/chartsight`). The build checks every file against `src/content.config.ts` and tells you if
a field is missing or misspelled. After adding a new file, restart `npm run dev`.

Videos (template b): any picture — the hero, demo, before/after, the brand picture, `wide`, `pair` and `stack` items —
can take `video: /assets/videos/<case>/<name>.mp4`, with `image:` set to the video's first frame. The picture reveals as
usual, then the video fades in and plays muted on a loop while it's on screen (`public/js/case-study-b/videos.js`).
Make the files with: `ffmpeg -i in.mp4 -an -vf "scale=1600:-2,format=yuv420p" -c:v libx264 -crf 25 -movflags +faststart out.mp4`
and the poster with `ffmpeg -i out.mp4 -frames:v 1 -q:v 3 out.jpg`. A feature can also have a `link:` ("Visit Website").

Two layouts, picked by `template:` in the file:

- `a` — ChartSight's layout, a fixed set of sections (ChartSight, Kind Over Matter Creative, Promescent, Rivas Pro
  Details). Components: `src/components/case-study/TemplateA.astro` + `sections/`. Styles: `src/styles/case-study/`.
  Scripts: `public/js/case-study/`.
- `b` — the page is a list of `sections`, each with a `type` (intro, demo, overview, rule, services, challenge,
  beforeAfter, stat, how, note, output, statement, brand, impact, outcome, next), so a case study can add, drop or
  reorder sections (Construction Check, The Coupon Chaser, Weldon Brewster, Ethical Narrative). Components:
  `TemplateB.astro` + `b/`. Styles: `src/styles/case-study-b/base.css` + one file per case study (its own colours and
  tweaks, named after the file). Scripts: `public/js/case-study-b/`.
  Pictures under a part are rows: `wide`, `pair`, `labels`, `mono`, `sub` (see `b/Media.astro`).

Pictures: `public/assets/images/case-studies/<name>/`. Words every case study shares ("Home", "Next Case Study",
"View case study"…) are in `src/data/case-study.js`. The header, the closing strip and call to action, and the footer are
the site's shared ones.

- Our Work page: the entry in `cases` (`src/data/work.js`) with the same id as the file links to the page; the list's
  order is also the order of "Next case study" numbers. `next:` in the file is the id of the next case study.
- Homepage: a Selected Work item in `src/data/home.js` opens the page when its `case` is the file name.

## Case studies (Our Work page)

The list is `cases` in `src/data/work.js` (entries with a case study file link to its page): add or edit them there: name, link, `tags` (the filter keys),
the two descriptions and its pictures (the first one is the cover). The filter counts, the grid,
the index list and the spinning pages in the hero all update from that one list.

## Notes

- The homepage intro loader (a dot globe that turns into the logo, then a pixel wave opens the page) is
  `public/js/b30-loader.js`, loaded in `<head>` only by the homepage (`loader` on `<BaseLayout>` in
  `src/pages/index.astro`). It plays when the homepage is opened fresh or reloaded, not when you come from another
  page of the site or use back / forward. Its settings are `CONFIG` at the top of the file; add `?loader=0` to the
  URL to skip it once.
- The site is light only: the dark theme and its switch are retired (the switch is hidden, and any saved "dark"
  choice is cleared on load).
- The tablet in the Vision section is a little desktop: its folders, the Process notes and the BT pictures are
  `vision.tablet` in `src/data/home.js` (pictures in `public/assets/images/vision/`).

- Every component is a plain `.astro` component: the pages are static HTML with no framework and
  no islands (Astro's dev toolbar will say "No islands detected" — that's expected). All motion is
  done by the scripts in `public/js`.
- Styles are loaded through one ordered list per page (`src/styles/pages/`) on purpose: the
  cascade order matters, and per-component imports let the bundler reorder files between pages.
- Speed: everything is served from the site itself (fonts in `public/assets/fonts`, Lenis in
  `public/js/vendor`). Images below the first screen use `loading="lazy"`. Phones get the smaller
  showreel (`hero-reel-small.mp4`). The hero foreground video has a keyframe every 3 frames so
  scroll-scrubbing stays smooth; if you replace it, encode it the same way:
  `ffmpeg -i in.mp4 -c:v libx264 -preset slow -crf 21 -g 3 -bf 0 -pix_fmt yuv420p -an -movflags +faststart hero-foreground.mp4`
- `public/_headers` sets browser caching on Netlify (hashed `/_astro` files and fonts are cached for good;
  images, videos and scripts for a day). The footer wordmark starts only when the page nears the footer.
- `npm run build` minifies the scripts in `dist/js` (esbuild, set up in `astro.config.mjs`); keep editing the
  readable files in `public/js`. Files ending in `.min.js` are left as they are.
- Judge speed with `npm run build && npm run preview`, not `npm run dev` (dev mode serves every file
  separately and unoptimised).
- CSS minification is off in `astro.config.mjs` on purpose: the minifier merges some duplicate
  rules and changes which one wins in the dark theme.

## Phones: shared sections are components

Every section that appears on more than one page has **one** phone version, kept with the component itself
(desktop is untouched; all of it sits inside `max-width: 899px`):

| Section | Markup | Phone styles | Phone behaviour |
|---|---|---|---|
| Header + Menu | `components/Header.astro` | end of `styles/hero.css` | end of `public/js/header.js` (the Menu) |
| Partners strip | `components/PartnersStrip.astro` | end of `styles/partners.css` | end of `public/js/partners.js` (brand pixels) |
| Testimonials | `components/Testimonials.astro` | end of `styles/testimonials.css` | end of `public/js/testimonials.js` (swipe deck) |
| "Sketch…" strip + call to action | `components/closing/Strip.astro`, `ClosingCta.astro` | end of `styles/closing.css` | — |
| Closing band | `components/Contact.astro` | end of `styles/contact.css` | — |
| Footer | `components/Footer.astro` | end of `styles/footer.css` | end of `public/js/footer.js` (rises in) |
| Buttons, text reveals | `components/ui/Button.astro` | end of `styles/shared.css` | — |

The page files (`styles/home-mobile.css`, `styles/mobile/*.css`, `public/js/*-mobile.js`, `mobile-layer.js`, `mobile-m5.js`)
only hold what belongs to that page — don't restyle a shared section there; change its component file instead.
