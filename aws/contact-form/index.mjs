/**
 * Contact form → email. AWS Lambda behind an API Gateway HTTP API (see template.yaml).
 *
 * The contact page (public/js/contact-page.js) POSTs the form as JSON:
 *   { name, email, phone?, company?, needs?: string[], details?, website?, startedAt? }
 * and this sends it with Amazon SES to TO_EMAIL (ahmad.hassan@breakthirty.com), with Reply-To set to the visitor,
 * so hitting Reply in the inbox answers them directly.
 *
 * Spam: `website` is a hidden field people never see (bots fill it), and `startedAt` is when the page
 * loaded — a form sent in under MIN_FILL_MS was not typed by a person. Both are answered "ok" without
 * sending, so bots learn nothing. The API's throttling (template.yaml) caps how fast anyone can post.
 *
 * Environment (set by template.yaml): TO_EMAIL, FROM_EMAIL, ALLOWED_ORIGINS (comma-separated), MIN_FILL_MS.
 */

const env = (k, d = "") => (process.env[k] ?? d).trim();
const NEEDS = ["Design", "Marketing", "Engineering", "Automation & AI", "Others"];
const LIMITS = { name: 200, email: 254, phone: 40, company: 200, details: 5000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const oneLine = (s) => String(s ?? "").replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim();
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** the browser's origin, if it's one of ours (else null) */
function allowedOrigin(headers) {
  const origin = (headers.origin || headers.Origin || "").replace(/\/$/, "");
  const list = env("ALLOWED_ORIGINS").split(",").map((o) => o.trim().replace(/\/$/, "")).filter(Boolean);
  return list.includes(origin) ? origin : null;
}

function reply(status, body, origin) {
  const headers = { "Content-Type": "application/json", "Cache-Control": "no-store" };
  if (origin) Object.assign(headers, { "Access-Control-Allow-Origin": origin, Vary: "Origin" });
  return { statusCode: status, headers, body: JSON.stringify(body) };
}

/** checks and tidies the submission; returns { data } or { errors: [field…] } */
export function validate(input) {
  const v = input && typeof input === "object" ? input : {};
  const data = {
    name: oneLine(v.name), email: oneLine(v.email).toLowerCase(), phone: oneLine(v.phone), company: oneLine(v.company),
    needs: (Array.isArray(v.needs) ? v.needs : []).map(oneLine).filter((n) => NEEDS.includes(n)).slice(0, NEEDS.length),
    details: String(v.details ?? "").replace(/\r\n?/g, "\n").trim(),
  };
  const errors = [];
  if (!data.name || data.name.length > LIMITS.name) errors.push("name");
  if (!EMAIL_RE.test(data.email) || data.email.length > LIMITS.email) errors.push("email");
  if (data.phone && (data.phone.length > LIMITS.phone || data.phone.replace(/\D/g, "").length < 7)) errors.push("phone");
  if (data.company.length > LIMITS.company) errors.push("company");
  if (data.details.length > LIMITS.details) errors.push("details");
  return errors.length ? { errors } : { data };
}

/** the email: a plain-text version and a simple HTML one */
export function compose(d, meta = {}) {
  const who = d.company || d.name;
  const subject = oneLine(`New project — ${who}`).slice(0, 180);
  const rows = [["Name", d.name], ["Email", d.email], ["Phone", d.phone], ["Company", d.company], ["Needs", d.needs.join(", ")]].filter(([, x]) => x);
  const details = d.details || "(No details yet — rough is fine.)";
  const text = [...rows.map(([k, x]) => `${k}: ${x}`), "", details, "", `— Sent from the contact form on ${meta.page || "breakthirty.com/contact"}`].join("\n");
  const html = `<!doctype html><html><body style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.5;color:#0D1432">
<h2 style="font-weight:400;margin:0 0 16px">New project enquiry</h2>
<table cellpadding="6" cellspacing="0" style="border-collapse:collapse">${rows.map(([k, x]) => `<tr><td style="color:#6a7782;vertical-align:top">${esc(k)}</td><td>${k === "Email" ? `<a href="mailto:${esc(x)}">${esc(x)}</a>` : esc(x)}</td></tr>`).join("")}</table>
<p style="white-space:pre-wrap;margin:20px 0;padding:16px;background:#f5f6f7;border-radius:8px">${esc(details)}</p>
<p style="color:#6a7782;font-size:12px">Sent from the contact form on ${esc(meta.page || "breakthirty.com/contact")}. Reply to this email to answer ${esc(d.name)} directly.</p>
</body></html>`;
  return { subject, text, html };
}

/** sends with Amazon SES (the AWS SDK is part of the Lambda Node.js runtime) */
async function sesSend({ to, from, replyTo, subject, text, html }) {
  const { SESv2Client, SendEmailCommand } = await import("@aws-sdk/client-sesv2");
  const client = (sesSend.client ||= new SESv2Client({}));
  await client.send(new SendEmailCommand({
    FromEmailAddress: from,
    Destination: { ToAddresses: [to] },
    ReplyToAddresses: [replyTo],
    Content: { Simple: { Subject: { Data: subject, Charset: "UTF-8" }, Body: { Text: { Data: text, Charset: "UTF-8" }, Html: { Data: html, Charset: "UTF-8" } } } },
  }));
}

/** the handler, with the sender passed in (so it can be tested without AWS: see test.mjs) */
export function makeHandler(send = sesSend, now = () => Date.now()) {
  return async (event) => {
    const headers = Object.fromEntries(Object.entries(event.headers || {}).map(([k, x]) => [k.toLowerCase(), x]));
    const method = (event.requestContext && event.requestContext.http && event.requestContext.http.method) || event.httpMethod || "POST";
    const origin = allowedOrigin(headers);
    if (method === "OPTIONS") return { ...reply(204, {}, origin), body: "" };
    if (method !== "POST") return reply(405, { ok: false, error: "method" }, origin);
    if (!origin) return reply(403, { ok: false, error: "origin" }, null);

    let body;
    try {
      const raw = event.isBase64Encoded ? Buffer.from(event.body || "", "base64").toString("utf8") : event.body || "";
      if (raw.length > 20000) return reply(413, { ok: false, error: "too_large" }, origin);
      body = JSON.parse(raw || "{}");
    } catch {
      return reply(400, { ok: false, error: "bad_json" }, origin);
    }

    // bots: answer "ok", send nothing
    const started = Number(body.startedAt);
    if (oneLine(body.website) || (Number.isFinite(started) && started > 0 && now() - started < Number(env("MIN_FILL_MS", "3000")))) {
      console.log(JSON.stringify({ msg: "dropped", reason: oneLine(body.website) ? "honeypot" : "too_fast" }));
      return reply(200, { ok: true }, origin);
    }

    const { data, errors } = validate(body);
    if (errors) return reply(400, { ok: false, error: "invalid", fields: errors }, origin);

    const mail = compose(data, { page: `${origin}/contact` });
    try {
      await send({ to: env("TO_EMAIL"), from: env("FROM_EMAIL"), replyTo: data.email, ...mail });
    } catch (err) {
      console.error(JSON.stringify({ msg: "send_failed", name: err && err.name, message: err && err.message }));
      return reply(502, { ok: false, error: "send_failed" }, origin);
    }
    console.log(JSON.stringify({ msg: "sent", needs: data.needs, hasCompany: !!data.company }));   // no personal details in the logs
    return reply(200, { ok: true }, origin);
  };
}

export const handler = makeHandler();
