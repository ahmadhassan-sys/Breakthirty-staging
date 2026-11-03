/**
 * Where a link points on the current page: `on[page]` if the link has one, otherwise `href`.
 * Example: { href: "/services#design", on: { home: "#services" } }
 */
export const hrefFor = (link, page) => (link.on && link.on[page]) || link.href;

/** True when the link leads to another page (not an anchor on this one). */
export const isOtherPage = (href) => !href.startsWith("#");
