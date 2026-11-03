---
title: "How to Set Up One-Time Codes in Klaviyo (Shopify Guide)"
seoTitle: "How to Set Up One-Time Codes in Klaviyo (Shopify Guide)"
description: "Learn how to set up one-time coupon codes in Klaviyo for Shopify. A step-by-step guide on creating, syncing, and using (dynamic) unique discount codes."
excerpt: "Learn how to set up one-time coupon codes in Klaviyo for Shopify. A step-by-step guide on creating, syncing, and using (dynamic) unique discount codes."
lead: "Learn how to set up one-time coupon codes in Klaviyo for Shopify. A step-by-step guide on creating, syncing, and using (dynamic) unique discount codes."
date: "2025-10-09"
updated: "2026-08-21"
tags: ["Email Marketing", "Klaviyo"]
image: "/assets/images/blog/how-to-set-up-one-time-codes-in-klaviyo/cover.webp"
imageAlt: "blog thumbnail A person creating a unique one-time coupon code on a laptop, symbolizing Klaviyo and Shopify integration for personalized discounts."
cardImage: "/assets/images/blog/how-to-set-up-one-time-codes-in-klaviyo/card.webp"
keywords: ["how to set up one time codes in klaviyo shopify", "unique coupon codes for shopify klaviyo", "klaviyo unique coupon codes", "dynamic coupon code klaviyo", "klaviyo promo code", "klaviyo discount code"]
---

One-time (unique or dynamic) coupon codes let every customer have their own exclusive discount.

Unlike a shared static code (e.g., WELCOME20), each one-time code is single-use and tied to one recipient.

This reduces abuse (no code sharing) and feels more personal.

In [Klaviyo](https://www.klaviyo.com/) (especially when connected to Shopify), you can easily generate these unique codes. For example, Klaviyo “can create one-time use dynamic coupon codes for Shopify stores, where each customer receives their own unique coupon code”.

This means each email or SMS you send can include a private code just for that person, boosting urgency and conversion.

This post covers the *what* and *why* of unique coupon codes, but most importantly, it gives you a precise roadmap on how to set up one-time codes in Klaviyo.

We also include the critical integration steps for your e-commerce platform (like Shopify) and proven methods for deploying code across every flow and campaign.

## Why use one-time codes?

They add personalization and security.

Each customer’s code feels like a special gift, and since it’s single-use, you avoid lost revenue from code-sharing.

It also gives you better tracking: you can see exactly who redeemed a code.

In practice, one-time codes shine in use cases like welcome emails, abandoned-cart flows, or VIP promotions. (For example, sending a unique discount to new subscribers can help convert them faster.)

Compared to a generic code, unique codes prevent misuse and let you control expiry per recipient.

All told, Klaviyo’s Shopify integration makes setting up these codes straightforward – once you link your store, the rest is mostly done in Klaviyo’s dashboard.

## Static Codes vs. One-Time Codes

Before diving in, it helps to contrast static vs. dynamic (one-time) codes.

### Static code

A single code used by everyone (e.g., “SUMMER50”).

It’s easy to create and remember, but anyone can share it, leading to overspend or fraud.

### One-time (Unique) code

A different code for each recipient. For example, every email gets a custom code like WELCOME\_AB12 or similar.

These codes work only once. They can be a bit longer or have a random suffix, but they prevent sharing.

Most marketers prefer one-time codes for email flows or gated promotions where exclusivity matters.

Klaviyo’s system handles the code generation – you just set up the rule and let Klaviyo create unique codes in Shopify behind the scenes.

## Start Setting Up One-Time Codes in Klaviyo (Complete Setup Walkthrough)

Follow this streamlined process to seamlessly connect your store, define your discount rules, and automatically deliver personalized, one-time-use codes that drive immediate sales.

### 1. Connect Klaviyo to Shopify

If you haven’t already done so, [integrate Klaviyo with your Shopify](https://help.klaviyo.com/hc/en-us/articles/115005080407) store.

This link allows Klaviyo to create discount codes in Shopify automatically.

In Klaviyo, go to Integrations and set up Shopify by following the prompts.

Once integrated, you should see a Coupons tab under Content in Klaviyo (If the Coupons tab doesn’t appear, try “Update Settings” on the Shopify integration and re-authenticate.)

Having Shopify connected ensures that when Klaviyo generates a one-time code, the corresponding discount exists in your Shopify admin and will work at checkout.

![Gif showing how to integrate klaviyo with shopify](/assets/images/blog/how-to-set-up-one-time-codes-in-klaviyo/1.mp4)

### 2. Create the One-Time Coupon in Klaviyo

With Shopify linked, next, [create a coupon template in Klaviyo](https://help.klaviyo.com/hc/en-us/articles/115005084727).

1. Navigate to Content &gt; Coupons, then click Create Shopify Coupon.
2. Give the coupon a Name (e.g., WLCM\_ONE\_TIME). This name is how Klaviyo refers to the coupon internally. You will use this exact name when placing the code in your emails.
3. (Optional) Set a Prefix, like “WELCOME” or “VIP.” Klaviyo will append random characters after this prefix (e.g., WELCOME-AB12). A prefix can make codes more readable or on-brand
4. Choose the Discount Type, e.g, percentage off, fixed amount off, or free shipping. For percentage or dollar discounts, you can specify product or collection restrictions, as well as a minimum purchase amount if you want.
5. Set the Activation Date (you can use “activate at send time”) and Expiration (e.g., expire after 48 hours or on a specific date). This determines when the code becomes valid and for how long. (Klaviyo shows expiration in UTC; Shopify applies it in your store’s timezone, so account for that discrepancy.
6. Click Create Coupon.

At this point, you have defined the discount in Klaviyo. Under the hood, Klaviyo will be ready to generate the actual unique codes in Shopify according to these rules.

![Gif showing how to Create the One-Time Coupon in Klaviyo](/assets/images/blog/how-to-set-up-one-time-codes-in-klaviyo/2.mp4)

### 3. Generate Unique Codes for Your Campaign

For campaign emails (one-off sends), you must pre-generate the codes.

1. In Klaviyo’s Coupons tab, find the coupon you just created.
2. Click the three-dot action menu next to it and select Add Codes.
3. Enter the number of codes to generate. This must be at least as many as your expected email recipients. In fact, Klaviyo will not allow you to send the campaign if there are fewer codes than recipients. (If you plan to send to, say, 1,000 people, generate 1,000 codes.)
4. Click Add Codes. Klaviyo will then create those codes, showing a progress bar. Note: generating a very large batch (tens of thousands) can take hours, so do this well before your send time.

Once generation finishes, Klaviyo has synced all those unique codes with Shopify.

Each code is now a valid discount in your store, ready to be emailed.

Tip: If you’re using this coupon in a flow email (e.g,. abandoned cart, welcome series), Klaviyo can auto-generate codes for you.

Klaviyo will create and replenish codes for flow campaigns behind the scenes, so you can actually skip manual generation for flows.

In practice, just ensure an initial code pool exists or let Klaviyo generate the first 100 codes (its default behavior), and it will handle the rest.

![How to Generate Unique Codes for Your Campaign](/assets/images/blog/how-to-set-up-one-time-codes-in-klaviyo/3.mp4)

### 4. Insert Codes into Emails or SMS

Now that codes exist, you add them to your messages.

#### 1. In Campaign Emails

In Klaviyo’s email editor, add a text block (or use a Coupon block) where you want the discount code to appear.

Insert the dynamic coupon tag using your coupon’s name, for example: {% coupon\_code 'WELCOME\_ONE\_TIME' %}\`

Klaviyo will replace this tag with a unique code for each recipient at send time (Alternatively, using the visual editor’s Personalization menu, choose Coupons and select your coupon; it handles the tag for you.)

When the campaign sends, every subscriber sees a different code.

#### 2. In Flow Emails

The process is the same – just include the {% coupon\_code 'YourCouponName' %} tag (or use a Coupon block) in the flow email template.

Since Klaviyo auto-generates codes for flows, each time a message is sent, it will assign an unused code to that recipient.

Note: if the same person enters the flow multiple times and the coupon hasn’t expired or been redeemed, they’ll get the same code as before.

To give returning customers a fresh code, set a short expiration on the coupon.

#### 3. In Signup Forms

You can even show a unique code immediately on a form.

Add a Coupon block to your signup form and choose your Shopify coupon (Shopify type, unique).

New subscribers will see their own code on screen or receive it by email.

#### 4. In SMS Messages

Klaviyo SMS supports one code per message. In your SMS content, simply paste the same tag {% coupon\_code 'YourCouponName' %}.

Each recipient will get a unique code via text.

Klaviyo links each delivered code back to Shopify’s pricing rules, so when a customer checks out and enters their code, the correct discount is applied automatically.

Remember that Klaviyo coupon codes do not work on subscription checkouts – they only apply to normal orders, per Klaviyo’s note.

## Best Practices and Tips

To truly optimize the effectiveness of your one-time codes, it’s important to adopt a range of best practices.

These strategies can help ensure that your codes are not only secure but also user-friendly, ultimately leading to a smoother and more efficient experience for everyone involved.

### 1. Generate Enough Codes Early

Always create the maximum expected number of codes.

If Klaviyo predicts 500 recipients, generate 500+ codes; otherwise, the send will be blocked.

For very large campaigns, start code generation a day or two in advance (it may take hours)

### 2. Separate Coupons for Flows vs. Campaigns

It’s wise to use different coupon names for flows and manual campaigns.

Flows auto-replenish codes and use variable expirations, whereas campaigns need pre-generated codes.

Using separate coupons avoids confusion and ensures that flows and campaigns don’t compete for the same code pool.

Also, create a new coupon if your terms change (e.g., different discount value or eligible products) so old codes aren’t mistakenly used under new rules.

### 3. Test Before Sending

Preview mode in Klaviyo won’t show a real code (it shows “YOURCOUPONNAME-preview”).

To see live code, send a test email to yourself (after generating codes). Klaviyo will pull one of your unique codes into the test message.

Verify that it works on your Shopify checkout and honors the correct discount.

### 4. Monitor Code Inventory

Keep an eye on the Coupons tab’s “Available” count.

For flows, Klaviyo auto-generates more codes as needed.

For campaigns, if you realize you’ve underestimated recipients, go back and “Add Codes” more.

You can even generate and save codes in advance (they won’t expire until you schedule the campaign).

If you ever run short, the campaign simply won’t send to the extras – Klaviyo will drop extra recipients rather than give duplicate codes.

### 5. Clear Customer Instructions

In your email copy, tell customers exactly how to use the code (e.g., “Enter this code at checkout for 20% off – one-time use only”).

Emphasize the exclusivity/expiry to create urgency.

Since codes are single-use, reassure customers that their code is unique and won’t work for anyone else.

## FAQs

### What are one-time (unique) coupon codes in Klaviyo?

One-time coupon codes, also called unique codes, are single-use discounts automatically generated for each subscriber or customer.

Instead of everyone using the same static code (like WELCOME10), each recipient gets their own private code that works only once.

It’s a secure, trackable way to reward customers while preventing code-sharing.

### Why should I use one-time codes instead of a shared code?

Shared (static) codes are easy to leak online.

One-time codes prevent that.

They also make your emails feel more personalized. Every subscriber gets a special discount just for them.

Plus, you can track exactly who redeemed a code, making performance reporting more accurate.

### Can I use one-time codes with Shopify in Klaviyo?

Yes! Klaviyo integrates directly with Shopify to create and manage unique coupon codes.

When you connect Shopify to Klaviyo, each generated code automatically syncs with your Shopify Discounts tab, so they work instantly at checkout.

### Can I track who uses their unique code?

Yes. Every one-time code Klaviyo generates is tied to a specific customer profile in Shopify.

When a customer redeems it, you can see the usage in Shopify’s Discounts section and in Klaviyo’s profile activity feed.

### What happens if I run out of one-time codes?

If your campaign runs out of codes, Klaviyo will block the send until you add more.

For flows, Klaviyo automatically generates new codes when the pool runs low, so you don’t have to worry about manual updates.

### Do unique codes work on subscription products?

Currently, one-time codes generated through Klaviyo for Shopify don’t work on subscription checkouts (per Shopify’s limitation).

They work on standard one-time purchases only.

### Can I reuse the same coupon name in future campaigns?

Technically, yes, but it’s not recommended.

It’s best practice to create a new coupon name for each campaign or flow type, especially if discount values, expiration, or eligibility rules change, to avoid confusion and code conflicts.

### How do I test if my one-time codes are working?

Send yourself a test email from Klaviyo (not just a preview). This generates a real code from your pool.

Then apply it at Shopify checkout to confirm it applies the correct discount and expiration settings.

## Conclusion

By following these steps, you’ll have a robust system of unique coupon codes in Klaviyo.

This not only helps protect your promotions from misuse but also lets you deliver a personalized, high-touch experience.

Klaviyo’s documentation and experts confirm that using one-time codes in campaigns and flows is straightforward once set up.

The result is a smarter discount strategy that’s fully integrated with Shopify – boosting conversions while safeguarding your margins.

Ready to turn your Klaviyo flows into a continuous revenue stream?

Our team of [email marketing experts](/services#marketing) specializes in auditing, building, and optimizing high-performing, revenue-generating email flows in Klaviyo.
