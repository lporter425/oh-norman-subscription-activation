# Oh Norman subscription activation email

Recharge **Subscription activation** notification for [Oh Norman](https://ohnorman.com). Header, footer, colors, and type match the order confirmation template in [lporter425/oh-norman-order-confirmation](https://github.com/lporter425/oh-norman-order-confirmation).

Repo: [github.com/lporter425/oh-norman-subscription-activation](https://github.com/lporter425/oh-norman-subscription-activation)

## Source of truth

**Canonical file:** [`oh-norman-subscription-activation.liquid`](oh-norman-subscription-activation.liquid) (also copied to [`templates/subscription-activation.liquid`](templates/subscription-activation.liquid)).

That full Recharge template is what to paste into the merchant portal. HTML copies at [`templates/subscription-activation.html`](templates/subscription-activation.html) and [`oh-norman-subscription-activation.html`](oh-norman-subscription-activation.html) stay in sync with the Liquid file. `email-preview.html` is a static sample render for local review only — do not treat the Vite preview as canonical.

**Vite snapshot backup:** the pre-iteration preview (`You're On Repeat!`, cadence as per-item bullets, Qty-only lines) is archived as tag [`vite-snapshot-backup`](https://github.com/lporter425/oh-norman-subscription-activation/tree/vite-snapshot-backup) and branch [`cursor/vite-snapshot-backup-49df`](https://github.com/lporter425/oh-norman-subscription-activation/tree/cursor/vite-snapshot-backup-49df) (commit `f04fc44`). Do not paste that snapshot into Recharge.

## Current copy

- **Headline:** You Started A New Subscription!
- **Intro:** Thanks for subscribing, first order is locked in (no questions line above the fold)
- **What’s next:** Rounded burgundy outline; shipping email, automatic next order, skip/swap/cancel anytime
- **Cadence:** `EVERY 30 DAYS` (and other intervals) rendered **above** the items in that group
- **Line items:** `Qty × unit price`, with line total on the right (`item.price` is the per-unit subscription price)
- **Primary button:** Manage subscription (`{{ link }}`) sits **below** the legal copy

Discounts and totals stay below the items. Total uses a grey rule (matching order confirmation), not a red subtotal divider.

## Does Recharge let you show a product image?

**Short answer:** not reliably on this specific email. Upcoming-order emails can. Omnisend cannot from the Recharge event.

| Channel | Product image on the subscription item? |
| --- | --- |
| Recharge **Subscription activation** (this template) | **Not documented.** Official `line_items` variables are title, variant, quantity, price, SKU, IDs — no `images` field. |
| Recharge **Upcoming order** / Flows | **Yes.** Use `{{ item.images.src }}` on `charge.line_items`. |
| **Omnisend** + Recharge app | **No.** The `recharge_started_subscription` event only passes `product_title`, `variant_title`, `price`, `quantity`, `order_interval_unit`, `order_interval_frequency`. |

This template shows product photos by matching `item.product_title` to Oh Norman CDN images (dental wipes, Stop Effing Itching, Calm, Gut, cat SKUs, wipes, etc.). Recharge does not support Liquid `contains`; the template uses `in`. Do **not** use `item.images.src` on this email — Subscription activation line items have no `images` field, and Recharge Jinja errors with `'dict object' has no attribute 'images'`. That field is only for Upcoming order (`charge.line_items`).

If a new SKU is added, add another `{% elif "Unique words" in item.product_title %}` block in `oh-norman-subscription-activation.liquid`.

**Omnisend vs Recharge:** Paste this HTML into **Recharge → Email → Subscription activation**. Omnisend is the right place for welcome/lifecycle flows, not this transactional receipt. If you also trigger an Omnisend automation on `recharge_started_subscription`, turn off this Recharge notification or customers get two emails. To show a product image in Omnisend, map `product_title` to a stored image the same way the fallback here does — the Recharge event will not send a photo URL.

## Paste into Recharge

1. Open **Recharge merchant portal → Email → Subscription activation**.
2. Edit the HTML email message.
3. Replace the body with [`oh-norman-subscription-activation.liquid`](oh-norman-subscription-activation.liquid).
4. Keep the `manage_subscription_link` class on the CTA (Recharge uses it).
5. Save, then send a test from a real checkout subscription (this notification does not send when you add a subscription in the merchant portal or via API).

## Local preview

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:43126/email-preview.html](http://127.0.0.1:43126/email-preview.html).

Without Node, you can still serve the static files:

```bash
python3 -m http.server 43126 --bind 0.0.0.0
```

## Brand fonts (from order confirmation)

Load these in the email `<head>` so Gmail/Apple Mail can use the real type. Outlook falls back via `mso-font-alt`.

| Role | Font | Fallback |
| --- | --- | --- |
| Headlines (`You Started A New Subscription!`, What’s next, section titles) | **Sharp Grotesk Bold** (`SharpGroteskBold`) | Open Sans, Arial Black in Outlook |
| Product titles, nav, cadence labels (`EVERY 30 DAYS`) | **Sharp Grotesk Medium** (`SharpGroteskMedium`) | Open Sans, Arial |
| Body, buttons, footer | **Sharp Sans Book** (`SharpSans-Book`) | Open Sans, Arial |

Hosted on the Oh Norman Shopify CDN. Do not swap in Inter or Poppins.

## Shared chrome (from order confirmation)

- Burgundy header (`#960000`) with left-aligned `Layer_1-2.png` wordmark
- Page canvas `#F3EDE1`, left-aligned copy, 40px side padding
- Sharp Grotesk Bold 32px / 25px titles, Sharp Sans Book 15px body, line-height 1.4
- Burgundy full-width primary button
- **Have questions?** and **Made For Pets** as type, not banner images
- Dog / Cat / Gift Card nav in Sharp Grotesk Medium (font applied on the cell, link, and inner span so it holds in email clients), cream (`#F3EDE1`), no underline
- Burgundy footer with social icons, legal links, and peeking Norman mascot

Outbound links include UTMs: `utm_source=recharge_email&utm_medium=email&utm_campaign=subscription_activation` plus a `utm_content` slug.

## Files

- `oh-norman-subscription-activation.liquid` — **canonical** Recharge paste-in (GitHub Liquid file)
- `templates/subscription-activation.liquid` — same Liquid, under the templates path
- `templates/subscription-activation.html` / `oh-norman-subscription-activation.html` — identical HTML copies
- `email-preview.html` — static sample render (not canonical)
- `index.html` — landing page that links to the preview
- Tag `vite-snapshot-backup` / branch `cursor/vite-snapshot-backup-49df` — archived Vite snapshot (`You're On Repeat!`); not canonical
