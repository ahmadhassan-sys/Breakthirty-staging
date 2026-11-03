---
title: "How to Hide Powered by Shopify (Easy Few Steps)"
seoTitle: "How to Hide \"Powered by Shopify\" (Step-by-Step Methods)"
description: "Learn how to remove \"Powered by Shopify\" or replace it from your store footer in minutes. Apply these two simple methods without any coding experience."
excerpt: "Learn how to remove \"Powered by Shopify\" or replace it from your store footer in minutes. Apply these two simple methods without any coding experience."
lead: "Learn how to remove \"Powered by Shopify\" or replace it from your store footer in minutes. Apply these two simple methods without any coding experience."
date: "2025-06-02"
updated: "2026-02-02"
tags: ["Shopify Development"]
image: "/assets/images/blog/how-to-hide-powered-by-shopify/cover.webp"
imageAlt: "How to Hide Powered by Shopify"
keywords: ["how to hide powered by shopify", "how to remove powered by shopify", "remove powered by shopify", "delete powered by shopify"]
---

If you're building a brand on [Shopify](https://www.shopify.com/), there's a good chance you’ve noticed the small line of text in your footer that says “Powered by Shopify.”

It can feel a little generic when you’re aiming for a clean, custom look for your Shopify store.

For store owners who want every inch of their site to reflect their own brand (and not Shopify’s), removing this tag is one of the easiest yet most overlooked finishing touches.

In this guide, we’ll walk you through how to hide "Powered by Shopify" in just a few simple steps.

## What Does "Powered by Shopify" Mean?

It’s a default piece of text included in most Shopify themes.

It tells visitors your site was built using Shopify’s platform.

While it doesn’t harm your store, it doesn’t exactly help build a premium image either.

Many Shopify store owners choose to remove or replace this line to make their site feel more custom and professional.

## How to Hide "Powered by Shopify" (Simple Method)

Here’s the fastest method we use in our Shopify builds:

### 1. Open Your Shopify Admin

- Log in to your Shopify admin panel.
- From the left-hand sidebar, navigate to Online Store, then click Themes.

![](/assets/images/blog/how-to-hide-powered-by-shopify/1.mp4 "Online Store > Themes")

### 2. Open Default Theme Content

- Find your current live theme card at the top.
- Hover over it, and a three-dot menu icon (“…”) will appear in the upper right corner.
- Click on those dots, then select Edit default theme content (previously labeled as "Edit languages")

![](/assets/images/blog/how-to-hide-powered-by-shopify/2.mp4 "Open Default Theme Content")

### 3. Search and Locate the Footer Tagline

- In the editor that opens, look to the top for the search bar.
- Type in "powered". This filters the results to show any text fields containing that word.
- Locate the one labeled Powered by Shopify; this is what appears in your store's footer.

![](/assets/images/blog/how-to-hide-powered-by-shopify/3.mp4 "Remove or Replace 'Powered By'")

### 4. Remove or Replace It

- In the corresponding text field, delete "Powered by Shopify."
- You can either leave it blank, replace it with a single space (to preserve formatting).
- Click Save.

### 5. Check Your Storefront

- Open your store in a new browser tab and refresh the page.
- The Shopify branding in your footer should now be gone.<br>

![](/assets/images/blog/how-to-hide-powered-by-shopify/4.mp4 "Check Your Storefront")

This method works great for removing the text entirely.

But if you’re thinking of replacing it with your own message (like “Free shipping on all orders”), this won’t cut it.

The hyperlink still leads to Shopify’s site, and there’s no built-in option to remove that link without editing your store’s code.

The next method is the more advanced route, which is editing your theme code.

## How to Remove Powered by Shopify (Advanced Method)

If you want to remove "Powered by Shopify" text completely and even replace it with something custom, you’ll need to edit your store’s code.

Here's how to do it safely:

### 1. Open the Code Editor

- Go to Online Store &gt; Themes.
- Find your live theme and click the Actions dropdown.
- From there, select Edit code.

![](/assets/images/blog/how-to-hide-powered-by-shopify/5.mp4 "Store > Themes > Edit code")

### 2. Locate the Footer File

- In the left-hand sidebar of the code editor, scroll down to the **Sections** folder.
- Inside, click on footer.liquid.
- This file controls what shows up in your store’s footer.

### 3. Search for the Tagline Code

- Press Ctrl + F (or Cmd + F on Mac) to open the search bar within the code editor.
- Type powered\_by\_link to find the exact line of code that outputs the “Powered by Shopify” text.

![](/assets/images/blog/how-to-hide-powered-by-shopify/6.mp4 "Remove Powered by Shopify")

### 4. Decide Whether to Remove or Hide It

You’ve got two options here, depending on what you want:

- To remove the text entirely, just delete that entire line of code that contains {{ powered\_by\_link }}.

- To hide the text but keep it in your code, wrap the line in Liquid comment tags.

- This way, Shopify won’t render it, but the code stays in place:

```javascript
{% comment %}  {{ powered_by_link }}{% endcomment %}
```

### 5. Save Your Changes

- After editing the code, click the Save button in the top right corner.
- Open your store in a new tab and refresh the page.
- The "Powered by Shopify" message should now be gone.

![](/assets/images/blog/how-to-hide-powered-by-shopify/7.mp4 "Check for Changes")

## How to Replace Powered by Shopify

If you want to replace it with a different link (e.g., “Free shipping on all orders”), just removing or commenting won’t help.

It’ll still point to Shopify’s site.

Instead, add this snippet at the top of your footer.liquid file:

```scheme
{% capture powered_by_link %}
<a target="_blank" rel="nofollow" href="https://YOURSTORE.com">
YOUR TEXT</a>
{% endcapture %}
```

This overrides the default link and text.

The target="\_blank" opens it in a new tab, and rel="nofollow" tells search engines not to pass link equity. Both are optional, but useful.

After making your changes, click the Save button in the top-right corner.

Then reload your storefront to confirm that the text is gone.

Before you dive into the code, it’s always better to duplicate your theme or back it up.

That way, if anything goes sideways, you’ve got a safe version to fall back on.

## How to Restore “Powered by Shopify” After Removing It

Should you ever need to re-add the "powered by Shopify" tagline to your website, simply undo your earlier changes.

### 1. Go to the Default Theme Content

- From your Shopify admin panel, click Online Store on the left sidebar.
- Click on Themes.
- On your current theme, click the three-dot menu (⋮) and select Edit default theme content.

### 2. Use the Search Bar

- In the editor that opens, locate the search bar in the top right corner.
- Type in "powered"

### 3. Restore the Text

- Find the field labeled Powered by Shopify.
- If it looks empty, that’s because we previously added a space character to hide it.
- Simply delete the space and type back in "Powered by Shopify".

### 4. Save and Confirm

- Click Save.
- Visit your storefront and refresh the page.
- The Shopify tagline should now be visible again.

## FAQ's - How to Hide Powered By Shopify

### Why Remove "Powered by Shopify"?

- **Branding control:** Your store, your identity. No distractions.
- **Cleaner look:** Removing it simplifies your footer.
- **Trust signals:** A polished footer gives customers more confidence.
- **Competitor awareness:** If you’re reselling or operating in a high-value niche, leaving the Shopify tag could make you look less established.

### What Should You Put in the Footer Instead?

A good footer builds trust and helps with navigation.

Here are a few useful ideas:

- Your own branding: "© 2025 \[Your Store Name\] – All rights reserved"
- Social media links or icons
- Quick links to shipping, returns, and privacy policy
- Trust badges or payment icons
- Contact information

### Can You Customize Shopify Footers?

Yes. Shopify lets you edit most parts of your footer, text, columns, menus, and more, depending on your theme.

You’ll find footer settings inside the theme editor (Online Store → Themes → Customize).

You can often add extra menu links, insert social media buttons, and toggle email sign-up sections.

If your theme is limited, [custom Shopify development](/services#engineering) can help.

## Conclusion

Removing the “Powered by Shopify” line is a small win, but it’s a win that elevates your brand’s identity and polish.

You don’t need to be a developer.

Whether you go with the language editor or dive into the Liquid code, the steps are straightforward.

And once it’s gone? Use that space to reinforce your brand and guide customers.

Because every part of your storefront, even the footer, should feel like yours.

Need help customizing your Shopify store?

Our [development](/services#engineering) team can help you fine-tune everything from footers to full redesigns.
