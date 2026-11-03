/**
 * Tests for the contact form function — no AWS needed (SES is replaced by a stand-in).
 * Run: node aws/contact-form/test.mjs
 */
import assert from "node:assert/strict";
process.env.TO_EMAIL = "ahmad.hassan@breakthirty.com";
process.env.FROM_EMAIL = "Break Thirty website <forms@breakthirty.com>";
process.env.ALLOWED_ORIGINS = "https://www.breakthirty.com,https://breakthirty.com";
process.env.MIN_FILL_MS = "3000";
const { makeHandler } = await import("./index.mjs");

let sent = [], fail = false;
const NOW = 1_800_000_000_000;
const h = makeHandler(async (m) => { if (fail) throw Object.assign(new Error("boom"), { name: "MessageRejected" }); sent.push(m); }, () => NOW);
const ev = (body, { origin = "https://www.breakthirty.com", method = "POST", b64 = false } = {}) => ({
  requestContext: { http: { method } }, headers: { Origin: origin, "Content-Type": "application/json" },
  isBase64Encoded: b64, body: b64 ? Buffer.from(JSON.stringify(body)).toString("base64") : typeof body === "string" ? body : JSON.stringify(body),
});
const good = { name: "Jane Doe", email: "Jane@Example.com", phone: "+1 702 555 0101", company: "Acme", needs: ["Design", "Engineering", "Hacking"], details: "We need a <b>new</b> site.\nSoon.", website: "", startedAt: NOW - 20000 };
const run = async (name, fn) => { sent = []; fail = false; await fn(); console.log("  ok ·", name); };

await run("a good submission is sent to ahmad.hassan@ with Reply-To the visitor", async () => {
  const r = await h(ev(good)); assert.equal(r.statusCode, 200); assert.deepEqual(JSON.parse(r.body), { ok: true });
  assert.equal(r.headers["Access-Control-Allow-Origin"], "https://www.breakthirty.com");
  assert.equal(sent.length, 1); const m = sent[0];
  assert.equal(m.to, "ahmad.hassan@breakthirty.com"); assert.equal(m.replyTo, "jane@example.com"); assert.equal(m.subject, "New project — Acme");
  assert.match(m.text, /Needs: Design, Engineering\n/); assert.doesNotMatch(m.text, /Hacking/);       // unknown choices dropped
  assert.match(m.html, /&lt;b&gt;new&lt;\/b&gt;/); assert.doesNotMatch(m.html, /<b>new<\/b>/);       // no HTML from visitors
});
await run("the body may arrive base64-encoded", async () => { const r = await h(ev(good, { b64: true })); assert.equal(r.statusCode, 200); assert.equal(sent.length, 1); });
await run("no company: the subject uses the name", async () => { await h(ev({ ...good, company: "" })); assert.equal(sent[0].subject, "New project — Jane Doe"); });
await run("line breaks can't be smuggled into the subject", async () => { await h(ev({ ...good, company: "Acme\r\nBcc: x@y.z" })); assert.doesNotMatch(sent[0].subject, /[\r\n]/); });
await run("honeypot filled: answered ok, nothing sent", async () => { const r = await h(ev({ ...good, website: "http://spam" })); assert.equal(r.statusCode, 200); assert.equal(sent.length, 0); });
await run("sent too fast: answered ok, nothing sent", async () => { const r = await h(ev({ ...good, startedAt: NOW - 800 })); assert.equal(r.statusCode, 200); assert.equal(sent.length, 0); });
await run("missing name / bad email / short phone are refused", async () => {
  const r = await h(ev({ ...good, name: " ", email: "nope", phone: "12" })); assert.equal(r.statusCode, 400);
  assert.deepEqual(JSON.parse(r.body).fields, ["name", "email", "phone"]); assert.equal(sent.length, 0);
});
await run("too-long details are refused", async () => { const r = await h(ev({ ...good, details: "x".repeat(5001) })); assert.equal(r.statusCode, 400); });
await run("other websites can't post", async () => { const r = await h(ev(good, { origin: "https://evil.example" })); assert.equal(r.statusCode, 403); assert.equal(sent.length, 0); });
await run("broken JSON is refused", async () => { const r = await h(ev("{nope")); assert.equal(r.statusCode, 400); });
await run("huge bodies are refused", async () => { const r = await h(ev({ ...good, details: "x".repeat(30000) })); assert.equal(r.statusCode, 413); });
await run("preflight (OPTIONS) answers 204", async () => { const r = await h(ev(good, { method: "OPTIONS" })); assert.equal(r.statusCode, 204); });
await run("GET is refused", async () => { const r = await h(ev(good, { method: "GET" })); assert.equal(r.statusCode, 405); });
await run("SES failing → 502, so the page can offer the email address", async () => { fail = true; const r = await h(ev(good)); assert.equal(r.statusCode, 502); });
console.log("all tests passed");
