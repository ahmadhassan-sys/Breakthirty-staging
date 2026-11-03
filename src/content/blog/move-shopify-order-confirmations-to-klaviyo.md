---
title: "How to Move Shopify Order Confirmation Emails to Klaviyo (Step-by-Step Guide)"
seoTitle: "Step-by-Step: Move Shopify Order Confirmation Emails to Klaviyo"
description: "Learn how to move your Shopify order confirmation emails to Klaviyo and create a more personalized, branded customer experience."
excerpt: "A complete tutorial on routing Shopify order confirmations through Klaviyo including email template setup and flow automation."
lead: "A complete tutorial on routing Shopify order confirmations through Klaviyo including email template setup and flow automation."
date: "2025-05-06"
updated: "2026-02-02"
tags: ["Shopify Development", "Klaviyo"]
image: "/assets/images/blog/move-shopify-order-confirmations-to-klaviyo/cover.webp"
imageAlt: "How to Move Shopify Order Confirmation to Klaviyo"
keywords: ["how to move shopify order confirmation to klaviyo", "how to reauthenticate klaviyo in shopify"]
---

Moving your Shopify order confirmation emails to Klaviyo allows you to fully control branding, leverage customer data, and improve engagement with targeted messaging.

The order confirmation can do much more than just provide a digital receipt.

Leveraging this key moment in the customer journey can bring opportunities to strengthen your brand loyalty and encourage repeat business.

While Shopify’s default email notifications get the job done, they’re limited in customization and disconnected from your broader marketing tools.

That’s where Klaviyo comes in.

By moving your order confirmations (and other transactional emails) to Klaviyo, you can unlock the ability to personalize messages, segment audiences, and align your transactional emails with your brand’s voice and strategy.

This guide will walk you through the step-by-step process of how to move Shopify order confirmation emails to Klaviyo.

## Step-by-Step: Moving Shopify order confirmations to Klaviyo

Moving your order confirmations requires a few key steps for a smooth transition and to prevent duplicate emails.

Before you begin, ensure you have:

- An active Shopify store.
- An active Klaviyo account with the Shopify integration set up.
- An understanding that preventing duplicate emails differs slightly between the Shopify Standard and Plus plans.
- It's recommended that you back up the existing HTML code of your Shopify order confirmation template.

### 1. Integrate Your Shopify Store with Klaviyo

If not already connected, this is the crucial first step.

#### Initiating the Connection

1. Log in to your Klaviyo account.
2. Click your account name (bottom left) and select "Integrations."
3. Search for "Shopify" and click the card.
4. Click "Add Integration."

![](/assets/images/blog/move-shopify-order-confirmations-to-klaviyo/1.mp4 "Integrate Your Shopify Store with Klaviyo")

#### Configuring the Integration Settings

1. Enter your Shopify store URL (yourstore.myshopify.com).
2. Authorize the connection in your Shopify admin, review permissions, and click "Install app."
3. Back in Klaviyo, check data sync options, focusing on customer profiles, order history, and product details. Klaviyo will begin syncing historical data.
4. Verify the integration is active and data is syncing by checking the integration settings page in Klaviyo. Ensure "Placed Order" and "Fulfilled Order" metrics appear and sync.

![](/assets/images/blog/move-shopify-order-confirmations-to-klaviyo/2.mp4 "Configure the Integration Settings")

#### Troubleshooting: How to Reauthenticate Klaviyo in Shopify

Occasionally, the connection between Klaviyo and Shopify might be interrupted due to permission changes or other technical glitches.

If you notice data is no longer syncing correctly, you may need to reauthenticate the integration.

This typically involves going back to the integration settings in either Klaviyo or Shopify and following the prompts to re-establish the connection and re-authorize permissions.

Refer to Klaviyo's help documentation for specific steps on[how to reauthenticate Klaviyo in Shopify](https://help.klaviyo.com/hc/en-us/articles/4403927899291#:~:text=In%20Klaviyo%2C%20select%20the%20Integrations,refresh%20or%20try%20again%20later) if you encounter persistent syncing issues.

### 2. Design Your Order Confirmation Email Template in Klaviyo

Now, build your branded order confirmation email in Klaviyo.

#### Accessing Klaviyo's Template Library

1. In Klaviyo, navigate to "Content" &gt; "Templates."
2. Click "Create Template."
3. Select a pre-built "Shopify Notification Templates" &gt; "Order Confirmation" template or start from scratch. Give it a descriptive name.

![](/assets/images/blog/move-shopify-order-confirmations-to-klaviyo/3.mp4 "Design Order Confirmation Email Template in Klaviyo")

#### Customizing Your Template for Brand Consistency

Use Klaviyo's drag-and-drop editor to customize the template. Add your logo, update colors, and fonts. Structure the email with a header, greeting, order summary, shipping details, billing details, and a footer with contact and social links.

#### Incorporating Dynamic Order Data

Use dynamic variables (template tags) to automatically pull in order and customer details. Key variables include customer name, order number, total price, shipping/billing address components, payment method, and line item details (using a loop).

#### Adding Value Beyond the Confirmation

Enhance the customer experience by adding:

- A link to a tracking page (or note that a separate shipping email will follow).
- Suggested related products.
- Links to customer support or FAQ.
- Encouragement to follow on social media.

### 3. Export Your Klaviyo Email Template

Get the HTML code of your designed template.

#### Preparing to Transfer the Design

1. Save your Klaviyo template.
2. Find the "Export" option while viewing your template (usually in a dropdown or button).

#### Obtaining the HTML Code

1. Select the option to export as HTML.
2. A window will display the raw HTML code.
3. Copy this entire block of code.

![](/assets/images/blog/move-shopify-order-confirmations-to-klaviyo/4.mp4 "Export Your Klaviyo Email Template")

### 4. Replace the Default Shopify Order Confirmation Email

Use the Klaviyo HTML to replace the standard Shopify notification.

#### Accessing Shopify's Notification Settings

1. Log in to your Shopify admin panel.
2. Click "Settings" &gt; "Notifications."

#### Editing the Order Confirmation Template

1. Find and click on "order confirmation."
2. Click the "Edit code" button.

#### Implementing the Klaviyo Template

1. In the code editor, delete all existing HTML code.
2. Paste the copied HTML code from your Klaviyo template.
3. Click "Save."

![](/assets/images/blog/move-shopify-order-confirmations-to-klaviyo/5.mp4 "Default Shopify Order Confirmation Email")

### 5. (For Shopify Plus Users) Disable Shopify's Default Email

This step is important for Shopify Plus users. It helps avoid sending two confirmation emails: one from Shopify and one from Klaviyo.

Standard Shopify users cannot turn off this notification directly. So, changing the HTML in the previous step is how to control the email content sent by Shopify's system.

#### Understanding Shopify Plus Capabilities

Shopify Plus offers more control over transactional notifications, including the ability to disable them entirely.

#### Steps to Disable

Usually, you need to go to advanced notification settings. You can also ask Shopify Plus support to help you turn off the default order confirmation email.

#### Alternative for Standard Shopify Users

As mentioned, Standard Shopify accounts cannot disable the default email trigger.

By changing the HTML in Step 4, you make Shopify send the email with your Klaviyo design and data. While Shopify still sends the email, you control its content through your Klaviyo template.

### 6. Test Thoroughly

Testing is crucial before going live. Use a separate email address (not linked to your admin) to make a test purchase on your live store.

1. Check the test email inbox immediately.
2. Confirm you received the Klaviyo-designed email, not the old Shopify default.
3. Check appearance on desktop and mobile, and in different email clients.
4. Verify all dynamic data (order number, items, addresses, etc.) is correct.
5. Test all links.
6. If on Shopify Plus, confirm you received *only* the email from Klaviyo.
7. Monitor Klaviyo analytics (open rates, click-through rates, revenue) for your flows.
8. Use A/B testing to optimize subject lines, content, and calls to action.
9. Continuously analyze data and make necessary adjustments based on testing.
10. Use Klaviyo segmentation to personalize flows based on customer type, purchase details, or order value.

## Optimizing Your Klaviyo Order Confirmation Flow

Moving the confirmation is just the start. Klaviyo allows for a sophisticated post-purchase experience.

You can also use Klaviyo flows triggered by "Placed Order" or "Fulfilled Order" for automated sequences:

- Shipping Confirmation (with tracking).
- Delivery Notification.
- Request for Review.
- Customer Education/Tips.
- Next Purchase Incentive.

## Conclusion

Moving your Shopify order confirmations to Klaviyo is not just a technical change. It is a smart choice to improve your customer experience and create new marketing opportunities.

By managing this high-engagement touchpoint, you can reinforce your brand, provide clear and personalized information, build loyalty, and encourage future purchases.
