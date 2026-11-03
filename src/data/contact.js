/* =====================================================================
   CONTACT PAGE CONTENT — copy of this page's own sections. Shared sections
   (header, partners strip, closing line, footer) and the company details
   (email, phone, address) come from src/data/site.js.

   Headings: *word* → highlighted word.
   ===================================================================== */
import { company } from "./site.js";

/* ---------- Page <head> ---------- */
export const seo = {
  title: "Contact Breakthirty | Start Your Project",
  description: "Tell us what you're building, or what's broken. Email hello@breakthirty.com or call (702) 337-2733. The first chat is on us.",
  themeColor: "#ffffff",
  // ogTitle / ogDescription / image: optional — the title, description and the site's share picture are used otherwise
};

/* ---------- 1. Hero ---------- */
export const hero = {
  ariaLabel: "Contact Breakthirty",
  title: ["Let’s talk.", "We’re always", "*around*."],   // one entry per line
  hint: { label: "Scroll to the form", href: "#form" },
  intro: "Tell us what you're building, or what's broken. The first chat is on us, and we'll be honest about whether we're the right fit.",
  globeLabel: "Official partners",   // the globe shows our offices (src/data/partners.js → locations)
};

/* ---------- 2. Form ---------- */
export const form = {
  heading: "Tell us about your project",
  note: "(Rough is fine too)",
  form: {
    contactLabel: "(Contact)",
    writeLabel: "(Write us)",
    fields: [
      { name: "name", label: "Full Name", type: "text", autocomplete: "name", required: true },
      { name: "email", label: "Work Email", type: "email", autocomplete: "email", required: true },
      { name: "phone", label: "Phone Number", type: "tel", autocomplete: "tel", inputmode: "tel" },
      { name: "company", label: "Company Name", type: "text", autocomplete: "organization" },
    ],
    needsLabel: "What do you need?",
    needs: ["Design", "Marketing", "Engineering", "Automation & AI", "Others"],
    detailsLabel: "Project Details",
    sendLabel: "Send a message",
    legal: { before: "By sending, you agree to our ", link: "privacy policy", href: "/legal/privacy-policy", after: ". We only use your details to reply." },
  },
};

/* ---------- Sending (used by public/js/contact-page.js) ----------
   On Netlify (the default): the form is a Netlify Form named "contact". Netlify keeps every submission and emails it
   to ahmad.hassan@breakthirty.com — set that once in Netlify: Site configuration → Forms → Form notifications → Email notification.
   Reply in the inbox goes straight to the visitor (Netlify sets Reply-To from the email field).
   If PUBLIC_FORM_ENDPOINT is set in .env, the form posts to that API instead (AWS Lambda + SES: aws/contact-form/README.md).
   Where neither is available (e.g. npm run dev on your computer) the form opens the visitor's email app, addressed to `to`. */
export const sending = {
  endpoint: import.meta.env.PUBLIC_FORM_ENDPOINT || "",
  netlifyForm: "contact",   // the Netlify form name (must match name="…" on the <form> in ContactForm.astro)
  to: company.email,
  subject: "New project",   // the email subject becomes "New project — <company or name>"
  messages: {
    noName: "Add your name so we know who to reply to.",
    badEmail: "That work email doesn’t look right.",
    badPhone: "That phone number looks too short.",
    opening: "Opening your email app. Hit send and we’ll reply within a day.",
    sending: "Sending…",
    sent: "Thanks — it’s with us. We’ll reply within a day.",
    failed: "That didn’t go through. Email us at hello@breakthirty.com and we’ll reply within a day.",
    check: "Something in the form needs a look.",
    noDetails: "(No details yet — rough is fine.)",
  },
};

/* After the testimonials: this page's dashed-letter strip (art = which drawing, see src/components/closing/strips.js) */
export const strip = { label: "Talk. Sketch. Quote. Start.", art: "talk" };
