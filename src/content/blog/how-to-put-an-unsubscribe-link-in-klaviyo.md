---
title: "How to Put an Unsubscribe Link in Klaviyo: Your Guide to Email Compliance and Trust"
seoTitle: "How to Add an Unsubscribe Link in Klaviyo (Step-by-Step)"
description: "Know how to add and customize unsubscribe links in Klaviyo emails. Stay compliant, improve deliverability, and build trust with this step-by-step guide."
excerpt: "Know how to add and customize unsubscribe links in Klaviyo emails. Stay compliant, improve deliverability, and build trust with this step-by-step guide."
lead: "Know how to add and customize unsubscribe links in Klaviyo emails. Stay compliant, improve deliverability, and build trust with this step-by-step guide."
date: "2025-07-31"
updated: "2026-02-02"
tags: ["Email Marketing", "Klaviyo"]
image: "/assets/images/blog/how-to-put-an-unsubscribe-link-in-klaviyo/cover.webp"
imageAlt: "How to Put an Unsubscribe Link in Klaviyo"
cardImage: "/assets/images/blog/how-to-put-an-unsubscribe-link-in-klaviyo/card.webp"
keywords: ["how to put an unsubscribe link in klaviyo", "how to add unsubscribe link in klaviyo", "unsubscribe link in klaviyo", "how to put unsubscribe link in klaviyo"]
---

Seeing someone unsubscribe from your email list can sting.

But here’s a secret from seasoned email marketers: a visible, easy-to-use unsubscribe link is more than just a legal requirement; it’s a sign of a trustworthy email program.

Trying to hide it or making it difficult to find often backfires, leading to spam complaints and damaged sender reputation.

The good news? [Klaviyo](https://www.klaviyo.com/) makes this process fairly straightforward, often handling the basics for you. But understanding how to customize it, where to place it, and why it's so important will elevate your email game.

This guide will walk you through how to put an unsubscribe link in Klaviyo the right way.

We’ve been building Klaviyo flows and campaigns for DTC brands for years, and we’ve seen it all. Let’s make sure you’re doing it right (and cleanly).

## Why the Unsubscribe Link Matters

Beyond being legally required under laws like CAN-SPAM, GDPR, and CASL, giving subscribers an easy way to opt out is just good marketing hygiene.

It reduces spam complaints, keeps your deliverability high, and shows that you respect your audience.

### Legal Compliance

Laws like CAN-SPAM in the US, GDPR in Europe, and CASL in Canada legally mandate that every commercial email must include a clear and conspicuous way for recipients to opt out of future communications. Failing to do so can result in hefty fines.

### Deliverability

Email Service Providers (ISPs) like Gmail, Outlook, and Yahoo pay close attention to user engagement. If subscribers can't easily find an unsubscribe link, they're more likely to hit the "Spam" or "Junk" button. A high rate of spam complaints is a huge red flag for ISPs, signaling that your emails are unwanted and can lead to your messages being blocked or sent straight to spam folders for *all* your subscribers.

### Customer Experience & Trust

Giving your subscribers control over their inbox preferences builds trust. It shows that you respect their choices. A positive unsubscribe experience can even leave a good impression, making them more likely to engage with your brand in other ways in the future.

### List Hygiene

People's interests change. An unsubscribe is a clear signal that someone is no longer interested. Removing these unengaged contacts helps you maintain a cleaner, more active list, leading to more accurate analytics and better overall campaign performance.

## How to Put an Unsubscribe Link in Klaviyo Emails: Step-by-Step

Let's explore various ways to make sure your unsubscribe link is present and optimized in your Klaviyo emails.

### Method 1: Use Klaviyo’s Built-In Footer Block

This is the go-to method for most users.

Klaviyo’s default email templates come with a footer block that includes all the compliance must-haves like your company address, a manage preferences link, and (most importantly) the unsubscribe link.

1. Open your email in the Klaviyo editor (campaign or flow).
2. Scroll to the bottom or add a new section.
3. Drag in the “Footer” block if it’s not already there.
4. Verify that the unsubscribe link is visible (it’ll say something like “Unsubscribe” or “Manage Preferences”).

This method requires no coding, includes other compliance essentials, and is automatically wired to the recipient’s profile. But it offers limited styling control and cannot move the link outside the footer.

![how to open Klaviyo’s Built-In Footer Block to add unsubscribe link](/assets/images/blog/how-to-put-an-unsubscribe-link-in-klaviyo/1.mp4)

### Method 2: Customize the Footer Copy & Styling

Once you’ve dropped in the default footer, you can personalize it so it sounds less robotic and more like your brand.

1. Click the Footer block to edit.
2. In the text area, change the default copy to something more human: <br>
   - “Don’t want these emails anymore? \[Unsubscribe here\]”
   - “Too many updates? \[Click here to unsubscribe\].”
3. Keep the unsubscribe tag intact – it looks like this: {% unsubscribe\_link %}. If you remove or break it, the link won’t work.
4. Use the style panel to adjust font, size, color, etc.
5. Send a test email to confirm everything looks good and the link works.

The pros of this method include matching your brand voice, remaining 100% compliant, yet still being placed in the footer, which makes it easy to accidentally delete the working tag.

### Method 3: Add a Manual Unsubscribe Link Anywhere

Want your unsubscribe link in the header? Mid-email? Somewhere unexpected? You can do that if you’re comfortable with a little HTML.

1\. Drag in a Text or HTML block wherever you want the link to appear.

2\. Use this HTML to manually insert the unsubscribe tag:

```javascript
<p style="font-size:12px; text-align: center;">
  <a href="{% unsubscribe_link %}" 
  style="color:#666; text-decoration: underline;">
    Click here to unsubscribe
  </a>
</p>
```

3\. Send yourself a test email to confirm it displays and functions correctly.

You gain full control over design and placement with this method, making it ideal for highly customized templates. However, it is not beginner-friendly and can be easy to break if the tag isn't inserted correctly.

For more on custom placement of unsubscribe links, [Klaviyo covers the full process.](https://help.klaviyo.com/hc/en-us/articles/115006054267)

![How to add a manual unsubscribe link anywhere in the klaviyo email](/assets/images/blog/how-to-put-an-unsubscribe-link-in-klaviyo/2.mp4)

## Frequently Asked Questions (FAQs)

### What happens when someone clicks the unsubscribe link in Klaviyo?

When a subscriber clicks the unsubscribe link, Klaviyo automatically marks their profile as suppressed. This means they’ll no longer receive campaigns or flow emails from you. However, their profile data stays in your account unless you manually delete it. They can only receive emails again if they explicitly opt back in through a Klaviyo-connected signup form or other compliant method.

### Can I customize the unsubscribe page in Klaviyo?

Yes! Klaviyo lets you customize the unsubscribe confirmation page (also called the "consent page"). You can use it to redirect users to a branded page, offer a preferences center, collect feedback, or make a last-ditch offer. Go to: Settings &gt; Consent Pages or navigate via Audience &gt; Consent & Subscription Settings.

### Is an unsubscribe link legally required in all emails?

For marketing emails, yes, most email laws like CAN-SPAM (US), GDPR (EU), CASL (Canada), and PECR (UK) require a clear way to opt out. The unsubscribe link must be functional and easy to find.

However, transactional emails (like receipts or shipping updates) do not require an unsubscribe link, as long as the content is purely transactional and not promotional.

### Can I put the unsubscribe link anywhere in the email, or does it have to be in the footer?

Technically, you can place the {% unsubscribe\_link %} tag anywhere in the email. But legally, it must be “clear and conspicuous.” The footer is the standard and expected location for most users. Placing it in unusual spots (like the header or body) may be confusing or feel intrusive so the footer remains best practice.

### What's the benefit of offering "Manage Preferences" instead of just "Unsubscribe"?

"Manage Preferences" gives subscribers more control. Instead of opting out entirely, they can choose what types of emails they still want (e.g., promos only, no newsletters). This reduces full unsubscribes, improves engagement, and helps you keep your list healthier and more targeted.

## Conclusion

Understanding how to put an unsubscribe link in Klaviyo is a foundational element of ethical and effective email marketing.

Make sure your unsubscribe link is clear, functional, and supported by transparent practices.

When you build trust with your audience and maintain excellent ultimately you cultivate a healthier, more engaged email list.

Don't fear the unsubscribe; embrace it as a sign of a well-managed program.

Ready to refine your Klaviyo email strategy beyond the basics? [Our email marketing experts](/services#marketing) can help you optimize your flows, build sophisticated preference centers, and ensure your campaigns are always compliant and converting.
