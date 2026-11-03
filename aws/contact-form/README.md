# Contact form → email (AWS Lambda + Amazon SES)

The form on `/contact` posts to a small API on AWS. It emails every message to **ahmad.hassan@breakthirty.com**,
with **Reply-To set to the person who filled it in**, so pressing Reply answers them directly.

```
browser ──POST JSON──▶ API Gateway (HTTP API, throttled) ──▶ Lambda (index.mjs) ──▶ Amazon SES ──▶ ahmad.hassan@breakthirty.com
```

| File | What it is |
|---|---|
| `index.mjs` | the function: checks the form, drops spam, sends the email |
| `template.yaml` | everything AWS needs (API, function, permissions, logs) — deployed with the SAM CLI |
| `test.mjs` | tests, no AWS needed: `node aws/contact-form/test.mjs` |

**Spam protection:** a hidden "website" field (people never see it, bots fill it), forms sent less than 3 seconds
after the page opened are ignored, only the site's own domains may post (CORS + an origin check), the API is
throttled to 2 requests a second (bursts of 10), and each field has a length limit. Bots get an "ok" back so they
learn nothing. Nothing personal is written to the logs.

## One-time setup

You need an AWS account, the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
(signed in: `aws configure`) and the [SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html).
Pick one region and use it for every step (e.g. `us-east-1`).

### 1. Let SES send as breakthirty.com

1. AWS console → **Amazon SES** → *Identities* → **Create identity** → *Domain* → `breakthirty.com`, with *Easy DKIM* on.
2. Add the 3 CNAME records it shows to the domain's DNS. After a few minutes the identity turns **Verified**.
   (Optional but recommended: a DMARC record, e.g. `_dmarc.breakthirty.com TXT "v=DMARC1; p=none;"`.)
3. New SES accounts are in the **sandbox**: they can only send *to* verified addresses. Either
   - verify `ahmad.hassan@breakthirty.com` as an *Email address* identity too (click the link SES emails him), **or**
   - request production access: SES → *Account dashboard* → **Request production access** (use case: "transactional —
     website contact form notifications to our own team"). Usually approved within a day.

   Since every email goes to ahmad.hassan@ only, verifying that address is enough to start.

### 2. Deploy the API

```bash
cd aws/contact-form
sam build
sam deploy --guided      # first time; afterwards just `sam deploy`
```

Answers for `--guided`: stack name `breakthirty-contact-form`, your region, keep the defaults for `ToEmail`
(ahmad.hassan@breakthirty.com), `FromEmail` ("Break Thirty website <forms@breakthirty.com>"), `AllowedOrigins`
(https://www.breakthirty.com,https://breakthirty.com) and `MinFillMs` (3000), allow SAM to create the IAM role,
and save the answers to `samconfig.toml`.

At the end it prints **`FormEndpoint`**, e.g. `https://abc123.execute-api.us-east-1.amazonaws.com/contact`.

### 3. Point the website at it

In the site's `.env` (copy `.env.example`):

```
PUBLIC_FORM_ENDPOINT=https://abc123.execute-api.us-east-1.amazonaws.com/contact
```

On **Cloudflare Pages**, add the same variable under *Settings → Variables and Secrets* (Production and Preview), then
redeploy — it is read when the site is built. Until it's set, the form doesn't use this API.

### 4. Test it

Send a message from https://www.breakthirty.com/contact — it should arrive at ahmad.hassan@ within seconds.
If it doesn't: AWS console → CloudWatch → Log groups → `/aws/lambda/breakthirty-contact-form-…`
(`send_failed` with `MessageRejected` almost always means step 1 isn't finished: identity not verified, or still in the sandbox).

**Testing from a preview or staging address:** add it to `AllowedOrigins` (`sam deploy --parameter-overrides
AllowedOrigins="https://www.breakthirty.com,https://breakthirty.com,https://your-project.pages.dev"`).

## Changing things later

- **Send to someone else / several people:** change `ToEmail` (`sam deploy --parameter-overrides ToEmail=…`). For more than
  one recipient, list them in `index.mjs` (`ToAddresses`).
- **Wording on the page** (sending / thanks / error): `src/data/contact.js` → `sending.messages`.
- **Cost:** at a contact form's volume it stays inside the AWS free tier / a few cents a month (SES is $0.10 per 1,000 emails).
