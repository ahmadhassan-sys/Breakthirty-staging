---
title: "How to Make Products View Only on Shopify (Step-by-Step Guide)"
seoTitle: "How to Make Products View Only on Shopify (Step-by-Step Guide)"
description: "Learn how to make products view-only on Shopify with easy steps. Hide “Add to Cart,” create private collections & build catalogs for wholesale or B2B."
excerpt: "Learn how to make products view-only on Shopify with easy steps. Hide “Add to Cart,” create private collections & build catalogs for wholesale or B2B."
lead: "Learn how to make products view-only on Shopify with easy steps. Hide “Add to Cart,” create private collections & build catalogs for wholesale or B2B."
date: "2025-07-22"
updated: "2026-02-02"
tags: ["Shopify Development"]
image: "/assets/images/blog/how-to-make-products-view-only-on-shopify/cover.webp"
imageAlt: "How to Make Products View-Only on Shopify Blog Thumbnail"
keywords: ["how to make produts view only on shopify", "shopify make certain products available for some customer", "shopify hide price from one product", "Shopify view only products", "hide add to cart button shopify", "how to hide add to cart button in shopify", "Shopify private collections"]
---

Many Shopify store owners need to display products without enabling immediate purchases.

This can be useful if you're building a digital catalog, showcasing a "coming soon" collection, running a wholesale business where orders are taken offline, or simply wanting to highlight past work without a direct buy button.

But, Shopify lacks a simple "view-only" toggle to achieve this.

By default, is built for direct sales, but with a few clever adjustments to your theme code or the right app, you absolutely can make products view-only on Shopify.

In this guide, we’ll show you exactly how to make products view only on Shopify based on hands-on experience customizing Shopify themes for clients.

We’ll also explore alternative methods and private collections so you can pick the best fit for your store.

## Why "View Only" Products? Common Scenarios

There are several reasons you might want products to be visible but not purchasable.

Before we dive into the "how," let's quickly touch on the "why."

Understanding how to use view-only products can help you select the best option for your specific needs.

### Digital Catalogs

Presenting your full product range without enabling direct checkout, ideal for B2B or wholesale clients who order via custom quotes or offline channels.

### "Coming Soon" Collections

Building hype for new arrivals, allowing customers to browse and express interest before products are officially launched for sale.

### Wholesale or B2B Portals

Offering a distinct experience for wholesale buyers where pricing might be custom, or orders are managed through a separate process.

### Showcasing Past Work/Portfolio

Displaying examples of custom orders, sold-out items, or design portfolios without the expectation of immediate purchase.

### Out-of-stock displays

Keeping a product visible even when it's out of stock, but explicitly removing the ability to buy until inventory is replenished.

### Exclusive or Private Sales

Creating "treasure-box" sales or special offers accessible only to specific customers via private links or passwords.

## Step-by-Step: How to Make Products View-Only on Shopify

Shopify's product pages are designed with the main goal of converting visitors into buyers.

That's why the "Add to Cart" button is a central part of the product page template.

There isn't a simple checkbox in the Shopify admin to instantly turn a product into "view-only" mode.

There are several ways to create a view-only product display.

We'll discuss the most common methods, including simple code adjustments and app-based solutions, covering options for store-wide and selective view-only modes.

### 1. Remove the "Add to Cart" Button (Theme Customization)

This is often the cleanest and most cost-effective way to display products without a purchase option.

It involves making a small edit to your theme's Liquid code.

Before you start, always [duplicate your theme](https://help.shopify.com/en/manual/online-store/themes/managing-themes/duplicating-themes) first, to create a backup, so you can always revert if something goes wrong.

- Go to Online Store &gt; Themes.
- Find your current theme, click Actions &gt; Duplicate.

#### Steps to Hide the "Add to Cart" Button

Applying this method directly to the main product template will hide the "Add to Cart" button for all products using that template.

### 1. Access Your Theme Code

- From your Shopify admin, go to Online Store &gt; Themes.
- Find the theme you want to edit
- Click Actions &gt; Edit code.

### 2. Locate the Product Template File

- In the code editor, navigate to the Sections folder.
- Look for a file named main-product.liquid, product-template.liquid, or something similar.
- The exact name can vary slightly depending on your theme.

### 3. Find the "Add to Cart" Code

- Once you open the file, you'll see a lot of code. Use Ctrl + F (Windows) or Cmd + F (Mac) to search for common phrases associated with the add-to-cart button.
- Try searching for add-to-cart, button, submit, or form.
- You're looking for the HTML &lt;button&gt; or &lt;input type="submit"&gt; element that triggers the add-to-cart action, usually within a &lt;form&gt; tag.
- It often has classes like product-form\_\_submit or add-to-cart-button.<br>

```javascript
<button type="submit" name="add" id="Add-To-Cart-{{ section.id }}" 
class="button button--full-width button--secondary">
<span>{{ 'products.product.add_to_cart' | t }}</span>
</button>
```

### 4. Comment Out the Code

- Once you've identified the relevant button or the entire form section that contains it, you can "comment it out." This means the code won't be executed, but it remains in the file for future reference.
- Wrap the code you want to hide with Liquid comment tags: {% comment %} and {% endcomment %}.<br>

```javascript
{% comment %}
<button type="submit" name="add" id="Add-To-Cart-{{ section.id }}" 
class="button button--full-width button--secondary">
 <span>{{ 'products.product.add_to_cart' | t }}</span>
</button>
{% endcomment %}
```

### 5. Save Preview Your Store

- Click the "Save" button in the top right corner of the code editor.
- Visit a product page on your live store to confirm the "Add to Cart" button is gone.

### 2. Replace "Add to Cart" with a "Contact Us" or "Inquire Now" Button (Lead Generation Focus)

This is a variation of Method 1, where instead of just hiding the button, you replace it with a call to action for inquiry.

### 1. Steps (Builds on Method 1)

Follow steps 1-3 from Method 1 to locate the "Add to Cart" button code in your main-product.liquid or product-template.liquid file.

### 2. Replace the Button Code

Instead of commenting it out, replace the entire button (or the form if it's simpler) with a new HTML link or button that directs to your contact page or a specific inquiry form. Example (replacing with a link to contact page)

```javascript
<a href="/pages/contact-us" 
class="button button--full-width button--secondary">
 <span>Inquire About This Product</span>
</a>
```

**3. Save and Preview**

Save your changes and check a product page to double-check that the new button appears correctly.

### 3. Create a Private Collection (Unlinked from Navigation)

You can use Shopify's collection feature to create hidden, direct-URL catalogs ideal for exclusive previews, B2B sales, or limited "treasure-box" offerings.

### 1. Create a New Collection

- From your Shopify admin, go to Products &gt; Collections.
- Click Create collection.
- Give your collection a clear title (e.g., "Wholesale Catalog," "VIP Preview," "Special Access Items").

### 2. Add Products to the Collection

- Set the [collection type to "Manual"](https://help.shopify.com/en/manual/products/collections/manual-shopify-collection) if you want to hand-pick products, or "Automated" if products will be added based on conditions (e.g., a specific tag like private-access).
- Add all the products you want to make view-only for this specific audience.

### 3. Do NOT Link in Navigation

- Crucially, do not add this collection to any of your store's navigation menus like your main menu or footer menu.
- This keeps it "hidden" from general browsing.

### 4. Share the Direct URL

- Once the collection is created and saved, copy its direct URL
- Share this URL only with your targeted audience. They can then browse the products within this collection.

### 4. Custom Product Templates for Mixed Inventory

What if you want some products to be purchasable and others to be view-only?

This is a very common scenario for businesses with mixed inventory (e.g., new items for retail, custom items for inquiry).

### 1. Create a New Product Template

- In your Shopify admin, go to Online Store &gt; Themes &gt; Actions &gt; Edit code.
- In the Templates folder, click Add a new template.
- Choose Product from the dropdown, give it a descriptive name like product.view-only, and click Done.
- This creates a new Liquid file (e.g., product.view-only.liquid) that is a copy of your default product template.

### 2. Edit the New Template

- Open your newly created template (product.view-only.liquid).
- Follow **Method 1** (hiding the button) or **Method 2** (replacing with inquiry button) above to modify the "Add to Cart" functionality within this new template only.

### 3. Assign the Template to Products

- Go to the product you want to make view-only (Products &gt; All products &gt; \[Your Product\]).
- On the product page, in the right-hand sidebar under "Theme template," select your new product.view-only template from the dropdown.
- Save the product.

Now, only products assigned to this view-only template will have the modified behavior, while all other products will retain their standard "Add to Cart" functionality.

## Frequently Asked Questions (FAQs)

### Will making products view-only affect my SEO?

No, not inherently.

As long as the product pages remain accessible and indexable by search engines (i.e., they are not password-protected at the *store* level or set to "Draft"), they can still rank in search results.

The content (product title, description, images) is still there for Google to crawl. In fact, for catalog purposes, this can be beneficial as it expands your indexed content.

### Is there a built-in Shopify feature to make products view-only?

Shopify does not have a direct "view-only" toggle or a simple checkbox for this functionality on a per-product basis.

It requires either a theme code modification (for selective products) or the use of a third-party app, or activating the "Pause and Build" plan (for the entire store), as detailed in this guide.

### Can I make only certain collections view-only?

Yes, you can. If you use a theme code modification (Method 1 or 2) with a custom product template, you can assign that template only to products within specific collections.

Alternatively, apps (Method 3 or 5) often offer collection-specific catalog modes or password protection.

You can also create a "private" collection by simply not linking it in your store's navigation menus (Method 4), then sharing the direct URL.

### What if I want to re-enable purchasing for a view-only product?

If you used the theme code method (Method 1 or 2), simply go back into the main-product.liquid (or your custom template) file and either delete the {% comment %} tags or revert the button code you replaced.

If you used an app, you'd typically disable the "catalog mode" or "view-only" setting for that product within the app's interface.

## Conclusion

Making products view-only on Shopify allows you to create digital catalogs, generate leads for custom orders, and host private sales.

These strategies give you control over product presentation and the customer journey, enabling unique business models like wholesale, "coming soon" pages, or portfolio displays to inform and build interest, even without direct sales.

Need a hand implementing these code changes, or looking for a custom solution to make your Shopify store truly unique? Our [Shopify experts](/services#engineering) are here to help with theme customization, app integration, and development to showcase your products perfectly..
