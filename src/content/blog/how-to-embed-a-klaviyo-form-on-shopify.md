---
title: "How to Embed a Klaviyo Form on Shopify (an easy, practical guide)"
seoTitle: "How to Embed Klaviyo Form on Shopify (Easy Step-by-Step Guide)"
description: "Learn how to embed a Klaviyo form on Shopify with our step-by-step guide. Master both code and no-code methods to add your form and troubleshoot common issues."
excerpt: "Learn how to embed Klaviyo form on Shopify with simple step-by-step instructions for pages, theme sections, and templates."
lead: "Learn how to embed Klaviyo form on Shopify with simple step-by-step instructions for pages, theme sections, and templates."
date: "2025-09-25"
updated: "2026-02-02"
tags: ["Email Marketing", "Klaviyo"]
image: "/assets/images/blog/how-to-embed-a-klaviyo-form-on-shopify/cover.webp"
imageAlt: "blog thumbnail image for How to Embed a Klaviyo Form on Shopify"
keywords: ["how to embed klaviyo form on shopify", "how to embed a klaviyo form on shopify", "embed klaviyo form on shopify page", "add klaviyo form to shopify", "how to add klaviyo form to shopify"]
---

You’ve built a beautiful Shopify store and set up your Klaviyo account to send powerful, personalized emails.

Now, the key is connecting the two so you can turn website visitors into subscribers.

You might’ve already designed a great signup form in Klaviyo.

The next step is getting it live on your Shopify site so visitors can actually use it.

This form is the essential link between your storefront and your growing email list.

If you’re wondering how to embed a Klaviyo form on Shopify, you’re in the right place.

The process is straightforward, but the exact steps depend on your theme and where you want the form to appear, whether it’s on a product page, in the footer, or as a standalone landing page.

In this guide, we’ll walk you through the options, from the simple drag-and-drop method to the slightly more technical code-based approach, so your form looks great and works seamlessly.

## The 3 Key Prerequisites to Embed a Klaviyo Form on Shopify

Before you even touch your form, there are three non-negotiable checks to make.

Skipping these steps is the number one reason forms don’t show up.

Once these three things are checked, you're ready to get to the fun part.

**1. Klaviyo-Shopify Integration<br>**Your Klaviyo account must be connected to your Shopify store. If it's not, do that now.

### 2. Onsite Tracking Enabled

Go to your Klaviyo Integrations tab, click on Shopify, and make sure "Onsite Tracking" is enabled. This is the crucial piece of JavaScript that allows forms to display and track visitor behavior.

**3. The Form Must Be "Embedded"<br>**In your Klaviyo account, when you create a new form, you must select "Embedded" as the form type. Pop-ups and flyouts work differently and are handled automatically by Klaviyo's scripts.

![Gif showing how to integrate shopify with Klaviyo](/assets/images/blog/how-to-embed-a-klaviyo-form-on-shopify/1.mp4)

## 1. The Universal Method for Any Page or Theme

This approach is perfect for older themes, for adding a form to a specific page's content, or for adding a Klaviyo form to Shopify blog posts.

It ensures the form renders exactly where you place the code, making it an excellent way to embed the Klaviyo form on a Shopify page with precision.

### 1. Get the Full Embed Code from Klaviyo

- Log into Klaviyo and open Sign-up Forms (or Onsite &gt; Sign-up forms).

![where to create sign up form on Klaviyo](/assets/images/blog/how-to-embed-a-klaviyo-form-on-shopify/2.mp4)

- Build your form (choose if you want to keep the form/coupon static or unique)

![Build your form on Klaviyo](/assets/images/blog/how-to-embed-a-klaviyo-form-on-shopify/3.mp4)

- If you already have a form, open the embedded form you want to use.
- Click the Publish button.
- Copy the entire code snippet from the modal.
- It will start with &lt;div class="klaviyo-form-... and include a &lt;script&gt; tag.

![Copy the entire code from the modal to embed it with Shopify](/assets/images/blog/how-to-embed-a-klaviyo-form-on-shopify/4.mp4)

### 2. Paste the Embed Code on a Specific Page

- In your Shopify admin, go to Online Store &gt; Pages or Online Store &gt; Blog posts.
- Select the page or blog post where you want the form to appear.
- In the content editor, click the "Show HTML" button. It looks like &lt;/&gt;.
- Paste the full embed code where you want the form to appear. For a form on its own, it’s best to paste it on a new line.
- Click the HTML button again to return to the rich text editor. You won't see the form itself, but you should see a placeholder.
- Click Save.

![Paste the full embed code where you want the Klaviyo form to appear on Shopify](/assets/images/blog/how-to-embed-a-klaviyo-form-on-shopify/5.mp4)

## 2. The Easiest Way for Modern Shopify Themes

This is the recommended method if your Shopify theme is up-to-date.

It's clean, non-technical, and uses Shopify's built-in section editor.

This method works for placing the form on the homepage or any other page template that uses Shopify's section editor.

### 1. Get the Form ID from Klaviyo

- In your Klaviyo account, go to Forms.
- Open the "Embedded" form you want to add to your site.
- Click the Publish button in the top right corner.
- In the pop-up modal, you'll see a snippet of code.
- The only part you need is the unique string of six letters and numbers. This is your Form ID (e.g., M53u7k). Copy just this code.

### 2. Add the Form to Your Shopify Theme Editor

- In your Shopify admin, go to Online Store &gt; Themes.
- Find your live theme and click the Customize button.
- On the left-hand side, click "Add section."
- Search for a block called "Klaviyo Embedded Form." If your theme supports this, it's the fastest way to proceed. Click it to add it to your page.
- In the new Klaviyo block that appears on the left, paste the Form ID you copied in Step 1.
- Click Save. The form won’t appear in the preview until you save.

## The Best Spots for an Embedded Form

Placement is everything when it comes to conversions. Unlike a pop-up that interrupts the user, an embedded form is a passive way to collect information.

- **The Footer<br>**This is a classic spot. It's non-intrusive and appears on every single page of your site.
- **Blog Post Conclusion<br>**Once a reader has finished a helpful article, they're highly engaged. Offering them an email signup with a clear value proposition (e.g., "Get more tips like this delivered to your inbox") is a highly effective tactic.
- **Dedicated Landing Page<br>**Create a page just for signups. This is great for social media ads or links in your bio.
- **Product Page Tab<br>**For some stores, adding a signup form under a "Newsletter" tab on a product page can be a powerful way to capture interested shoppers without interrupting their journey.

## FAQs

### How do I embed a form on the Shopify footer?

For most modern themes, use Method 1 and drag the Klaviyo section down to the footer area.

For older themes, you'll need to use Method 2 and paste the code snippet directly into your footer.liquid theme file.

### Can I change the list a form sends subscribers to after it's live?

Yes. In your Klaviyo form editor, navigate to the "Behaviors" tab.

Under "Submit Action," you can change the list the form subscribes people to.

No need to re-embed the code on Shopify.

### Do I need the Klaviyo Shopify app to embed forms?

No. You can embed using Klaviyo’s embed code without the app.

The app helps with deeper integration (syncs, pre-built blocks) and may auto-insert the required script.

### Can I add a Klaviyo form to just one product page?

Yes. Use the theme editor (add a Custom Liquid block to that product template) or edit the product template and include a conditional so the form appears only on that product’s handle.

### Why isn't my Klaviyo Form appearing on Shopify?

Even with the correct steps, forms can sometimes be finicky.

If your form is published but not showing up, here are the most common culprits.

1\. You've likely already seen the form, and your browser has a cookie telling it not to show it again.

Open an Incognito or Private browsing window to test the form fresh.

2\. Also, check for targeting Rules. Go back to your form's Targeting & Behaviors tab in Klaviyo.

Is it set to "Show on all devices" and "Show on all pages?" Are there any restrictive rules for specific URLs or segments that might be preventing it from appearing?

3\. Go to your Klaviyo Integrations &gt; Shopify and make sure "Onsite Tracking" is enabled and correctly installed on your active theme.

4\. If you used the manual embed method, go back to your Shopify theme or page editor and verify that you copied and pasted the entire code snippet exactly as provided by Klaviyo. One missing character can break the form.

## Wrap Up

Adding a Klaviyo form to Shopify is about setting up your store to collect the right data and grow your email list in a way that actually drives sales. Whether you’re using Shopify’s theme editor for a quick, no-code setup or embedding manually for more control, the process is straightforward once you know where to look.

Strategically place your form on high-traffic pages, in popups, or post-checkout to convert visitors into subscribers and subscribers into repeat customers.

Get your form live, test where it performs best, and let it work for your business in the background while you focus on selling.

Interested in hands-off help? From quick embeds to full-store makeovers, our team can help you put together conversion-focused Klaviyo flows, [Shopify custom development](/services#engineering), speed & SEO audits, migrations, and ongoing support.

Tell us your goals and we’ll build a plan that turns subscribers into customers.
