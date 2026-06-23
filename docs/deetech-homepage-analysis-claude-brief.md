# DEETECH Homepage Analysis and Claude Redesign Brief

This document explains how the current homepage works, what styling it uses, and what to give Claude if we want a stronger homepage redesign without breaking the existing ecommerce logic.

## Current Homepage Files

- Route: `nextjs/src/app/page.js`
- Main component: `nextjs/src/components/home/home-page-client.jsx`
- Shared product card: `nextjs/src/components/products/product-card.jsx`
- Main styling: `nextjs/src/components/styles/global-styles.jsx`
- Product/category helpers: `nextjs/src/lib/products.js`
- Banner link helpers: `nextjs/src/lib/banner-links.js`

## How the Homepage Currently Works

The `/` route is a server page that only sets SEO metadata and renders `HomePageClient`.

`HomePageClient` is a client component. It fetches product data and banner data in the browser, then builds the visible homepage sections from live product fields.

### Data Flow

1. On load, `fetchProducts()` gets all products.
2. Products are filtered to in-stock products only for homepage sections.
3. `/banners` is fetched from the backend using `requestJson(`${API_BASE}/banners`)`.
4. Banner records are normalized into:
   - `imageUrl`
   - `link`
5. Banner links can come from:
   - custom banner link
   - CTA link
   - category/subcategory link
6. The homepage renders:
   - hero banner carousel
   - trusted brand logo marquee
   - category showcase
   - curated product sections

### Hero Banner Carousel

Current behavior:

- Uses dynamic backend banners.
- If no banners exist, it renders a fallback blank/dark banner.
- `bannerIndex` controls the active banner.
- If there is more than one banner, it auto-advances every 6.5 seconds.
- Left/right arrow buttons manually change slides.
- Dot buttons appear only when there are multiple banners.
- Each banner can be clickable if it has a link.
- Only the active slide image is rendered eagerly.

Current visual:

- Full-width hero area.
- Aspect ratio around `16 / 6`.
- Image uses `object-fit: cover`.
- Desktop has shadow; mobile removes the heavy shadow.
- Arrows are circular white buttons.
- Dots sit at bottom center in a pill container.

Important note:

- The old CSS still contains unused hero text/content styles such as `.hero-banner__content`, `.hero-banner__shade`, and speaker illustration styles, but the current JSX only renders image banners. The redesign should either remove the unused mental model or intentionally reintroduce useful hero text if needed.

### Trusted Brand Logo Marquee

Current behavior:

- Uses a hardcoded list of SVG logos from `/public/home-logo`.
- Duplicates the lane twice for infinite scrolling.
- Pure CSS animation moves the track.

Current visual:

- White full-width strip.
- Logos are in transparent rectangular cells.
- Desktop item size is about `148 x 78`.
- Mobile item size is about `102 x 56`.
- Animation duration is 34s desktop, 24s mobile.

### Category Showcase

Current behavior:

- Categories are derived from products using `deriveCategories(products)`.
- Category order is prioritized:
  1. laptops
  2. phones
  3. accessories
  4. monitors
  5. printers
  6. storage
  7. others
- Featured category is usually laptops.
- Featured category gets the large tile.
- Other categories become compact tiles.
- Clicking a category sends the user to `/products/{category}#shop-results`.

Current visual:

- Section heading:
  - kicker: `Categories`
  - title: `Quick Product Search`
  - copy: `Jump straight into the department you want so it is faster to find the right products.`
- Desktop grid:
  - one tall featured tile on the left
  - compact tiles in a 3-column / 2-row arrangement on the right
- Tablet grid:
  - 6-column system with featured tile spanning 3 columns and 2 rows
- Mobile:
  - horizontal/stacked category behavior through media queries
- Tiles use dark image backgrounds, actual transparent product art where available, and gradient overlays.
- Tile content is overlaid at the bottom:
  - item count or fallback label
  - category name
  - CTA text: `Open filter`

Current category art assets:

- laptops: `/home-edited/laptops-removebg-preview-mobile.png`
- phones: `/home-edited/mobilephones-removebg-preview-mobile.png`
- monitors: `/home-edited/monitors-removebg-preview-mobile.png`
- accessories: `/home-edited/accessories-removebg-preview-mobile.png`
- printers: `/home-edited/printers-removebg-preview-mobile.png`
- storage: `/home-edited/storage_devices-removebg-preview-mobile.png`
- others: `/home-edited/others-removebg-preview-mobile.png`
- projectors: `/home-edited/projectors-removebg-preview-mobile.png`

### Curated Home Collections

Current behavior:

- Uses in-stock products only.
- Builds sections based on product `homeSections`.
- Supports legacy aliases:
  - `popular` becomes `hot_deals`
  - `new_arrivals` becomes `just_landed`
  - `best_laptops` becomes `student_laptops`
  - `top_smartphones` becomes `budget_smartphones`
  - `shop_by_brands` becomes `trusted_brands`
- If a section has no tagged products, some sections can fall back:
  - Just Landed falls back to newest products.
  - Others mostly require admin-tagged products.
- Visible sections only render if they have at least one product.

Current section order:

1. Just Landed
2. Hot Deals
3. Laptops for Students
4. Laptops for Work & Business
5. Powerful/Gaming Laptops
6. Smartphones for Every Budget
7. Quality Accessories
8. Shop Trusted Brands

Each section has:

- title
- description
- `View all` link to product results with promotion filter
- up to 5 visible products on desktop/tablet
- mobile scroll mode can show up to 6 products
- mobile grid mode shows up to 4 products

Mobile product section behavior:

- Detects `max-width: 640px`.
- Shows a view toggle:
  - scroll/list icon
  - grid icon
- Default mobile view is horizontal scroll.
- Scroll view has left/right rail buttons.
- Rail nav enables/disables based on scroll position.
- Grid view uses normal product grid.

### Product Card Behavior on Homepage

Homepage uses `ProductCard` with default/home variant.

Product card features:

- Product image from first product image.
- Hover image from second product image on desktop hover devices.
- Discount badge when active discount exists.
- Product title, category, rating, description, price, old price if discounted.
- Wishlist icon:
  - requires login
  - saves/removes product from local wishlist entries
  - shows toast
- Share/copy icons:
  - uses Web Share API if available
  - falls back to clipboard copy
- Add to cart button:
  - calls homepage `handleAddToCart`
  - triggers a short just-added highlight
- Out-of-stock overlay if stock is less than 1.

Current product grid styling:

- Homepage product grid is border-based, almost table-like.
- Desktop: 5 columns.
- Tablet: 3 columns.
- Mobile: product cards are either horizontal rail cards or grid cards.
- Product cards have square-ish image areas, compact typography, and footer actions.

## Current Styling Language

Global design tokens:

- `--panel`: `#ffffff`
- `--panel-soft`: `#f8f2e6`
- `--text`: `#1b1916`
- `--muted`: `#665d52`
- `--line`: `#e8e0d4`
- `--brand`: `#d9a441`
- `--brand-strong`: `#b98014`
- `--accent`: `#1d1a16`
- `--danger`: `#c0392b`
- `--shadow`: `0 18px 60px rgba(27, 25, 22, 0.08)`

Homepage-specific colors currently used:

- Body/page background: `#f5f6f7`
- Hero fallback: dark gray/black gradients
- Hero blue CTA/dots: `#1693cf`, `#0f84bc`, `#0d85be`
- Product grid border: `#ece7de`
- Product card media backgrounds: white, `#f7f3ec`, `#fbfaf7`
- Product price: `#1f1d1b`
- Product title muted gray: `#737685`
- Product discount badge red: `#d92626`
- Cart hover blue: `#004aad`
- In-cart green: `#173d16`
- Category dark backgrounds: `#232323`, `#303030`, `#1d1d1d`
- Category CTA gold: `var(--brand)`

Current visual personality:

- Mix of clean ecommerce and hard-edged catalog grid.
- Hero is banner-ad driven.
- Category tiles are visually strong and dark.
- Product sections are functional but dense.
- Brand marquee creates trust but currently feels mechanically separate from the rest of the page.

## Current Strengths

- Real dynamic product and banner data.
- Homepage sections are admin-controllable through product `homeSections`.
- Category links are functional and direct.
- Mobile has deliberate scroll/grid toggle for product sections.
- Product cards already support wishlist, share/copy, add-to-cart, ratings, discounts, hover image, and stock overlay.
- SEO metadata is already present.
- The homepage does not need fake marketing content to work.

## Current Weaknesses / Redesign Opportunities

- The hero is only a raw banner carousel; if admin uploads weak banners, the first viewport can feel like an ad slot rather than a polished storefront.
- Current hero has no visible store value proposition unless the banner image itself contains text.
- The old hero text CSS is unused, which suggests design drift.
- Logo marquee is useful but visually isolated.
- Category tiles are strong but heavy/dark, and may compete with product sections.
- Product section title "Curated Home Collections" sounds internal/admin-like rather than customer-focused.
- Product grid is very dense and border-heavy; it can feel more like a spreadsheet than a premium storefront.
- Mobile has useful controls, but the many repeated sections can become long and repetitive.
- There is no single "shopping mission" path at the top: customers must infer whether to use banner, categories, or product sections first.
- The homepage currently mixes blue hero/action accents with gold/green brand colors, which can feel inconsistent.

## Redesign Goals

Keep:

- Existing data flow.
- Dynamic banner support.
- Category links.
- Brand logo marquee.
- Product home sections and `View all` links.
- Product card actions and states.
- Mobile scroll/grid option if still useful.
- DEETECH color identity.

Improve:

- Make the first viewport feel like a proper tech storefront, not just a rotating image.
- Give customers clear paths:
  - shop laptops
  - shop phones
  - browse deals
  - view new arrivals
  - use quick categories
- Make desktop and mobile feel intentionally designed, not one layout stretched down.
- Reduce visual clutter.
- Create better hierarchy between hero, categories, and product sections.
- Keep product cards scannable but more polished.
- Preserve performance and avoid heavy decorative effects.

## Claude Redesign Prompt

Use this prompt with Claude for a homepage redesign plan or implementation proposal.

```text
You are redesigning the homepage for DEETECH Computers, a Ghana-based ecommerce store selling laptops, phones, monitors, accessories, printers, storage devices, and other tech products.

Analyze and redesign the existing Next.js homepage experience without breaking the current working data flow.

Current implementation:
- Route: nextjs/src/app/page.js
- Main client component: nextjs/src/components/home/home-page-client.jsx
- Product card: nextjs/src/components/products/product-card.jsx
- Styles: nextjs/src/components/styles/global-styles.jsx
- Products are fetched client-side with fetchProducts().
- Banners are fetched from `${API_BASE}/banners`.
- Homepage uses in-stock products only.
- Categories are derived from products using deriveCategories(products).
- Curated product sections are controlled by product.homeSections.
- The existing sections are:
  1. Just Landed
  2. Hot Deals
  3. Laptops for Students
  4. Laptops for Work & Business
  5. Powerful/Gaming Laptops
  6. Smartphones for Every Budget
  7. Quality Accessories
  8. Shop Trusted Brands
- Product cards already support image, hover image, discount badge, wishlist, share/copy, add to cart, rating, old/current price, description, and out-of-stock overlay.

Current visual language:
- Page background: #f5f6f7
- Panel/card background: #ffffff
- Soft cream: #f8f2e6
- Text: #1b1916
- Muted text: #665d52
- Lines/borders: #e8e0d4 and #ece7de
- Brand gold: #d9a441
- Strong gold: #b98014
- Account/brand green used elsewhere: #184f27 and #1d6a33
- Danger red: #c0392b
- Current homepage also uses blue accents (#1693cf, #004aad), but the redesign should reduce inconsistent blue unless there is a clear reason.

What the current homepage renders:
1. Hero banner carousel:
   - dynamic backend banners
   - auto-advance every 6.5 seconds
   - arrows and dots
   - click-through banner links
   - currently mostly raw image banner, no strong text/value-prop layer from code
2. Trusted brand logo marquee:
   - hardcoded SVG brand logos
   - infinite horizontal marquee
3. Category showcase:
   - heading "Quick Product Search"
   - featured large category, usually laptops
   - compact category tiles for phones, accessories, monitors, printers, storage, others
   - category tiles link directly to product category pages
4. Curated product collections:
   - repeated sections with title, description, View all link, and product cards
   - desktop product grid is 5 columns
   - mobile has scroll/grid toggle and carousel-style rail controls

Redesign objectives:
- Make the homepage feel like a polished tech storefront, not an ad carousel plus dense product grid.
- Keep all current functionality and dynamic data behavior.
- Create dedicated desktop and mobile design approaches, not just responsive CSS rearrangement.
- Improve first viewport hierarchy:
  - clear DEETECH shopping promise
  - banner/media area
  - fast paths to Laptops, Phones, Deals, New Arrivals, Accessories
- Keep the existing admin banner support, but do not let the page depend entirely on banner text being embedded in an image.
- Make categories easier to scan.
- Make product sections feel curated and premium.
- Keep product cards practical: image, title, price, discount, rating, cart/wishlist/share actions.
- Reduce inconsistent color usage; lean on DEETECH green, gold, white, black/warm neutrals.
- Avoid decorative gradient blobs, fake abstract illustrations, and marketing-page fluff.
- Use real product/category imagery when possible.
- Preserve performance: no heavy animation except subtle marquee/hover; avoid layout shift.

Desktop design direction:
- Use a strong first viewport with a structured hero:
  - left or top overlay: headline such as "Shop trusted laptops, phones and everyday tech in Ghana"
  - short value line: "Fast support, curated products, and reliable delivery from DEETECH Computers."
  - primary CTA: "Shop Laptops"
  - secondary CTA: "View Hot Deals"
  - quick category chips/tiles
  - dynamic banner image area remains visible and clickable
- Under hero, integrate the trusted brand logos in a cleaner trust strip, not a disconnected ad strip.
- Replace the heavy category tile grid with a more refined category command center:
  - one featured laptop/desktop card
  - compact category cards for Phones, Accessories, Monitors, Printers, Storage, Others
  - include product count if available
- Rename "Curated Home Collections" to something more customer-facing, e.g. "Featured Picks" or "Shop by Need".
- Product sections should have stronger hierarchy:
  - Just Landed and Hot Deals should appear first and feel most important
  - Laptop sections can be grouped under "Find the right laptop"
  - Phone/accessory sections can follow
- Product cards should feel cleaner than the current border-table grid while keeping actions.

Mobile design direction:
- Create a dedicated mobile homepage layout:
  - compact hero with store promise, banner image, and two clear CTAs
  - horizontal quick category chips/cards immediately below hero
  - brand trust strip shortened or horizontally scrollable
  - product sections as swipeable rails by default
  - keep grid toggle only if it does not add clutter
- Mobile first viewport must show what the store sells immediately: laptops, phones, accessories.
- Product cards on mobile should be thumb-friendly, not tiny.
- Avoid stacking too many repeated headings before products.

Deliverables:
1. Explain the proposed new homepage structure in order.
2. Explain desktop layout and mobile layout separately.
3. List exact component changes needed in home-page-client.jsx.
4. List exact CSS changes needed in global-styles.jsx.
5. Preserve the current data APIs and product-card behavior.
6. Mention any copy changes recommended.
7. Mention risks or edge cases, especially when there are no banners, no curated sections, or few products.
```

## Suggested New Homepage Structure

This is the structure I would ask Claude to design toward:

1. Storefront hero
   - headline and CTAs generated by code, not embedded in banner image
   - dynamic banner still used as the media/background area
   - quick links to Laptops, Phones, Hot Deals, Just Landed

2. Trust strip
   - short delivery/support/value points plus compact brand logos
   - make it feel connected to the hero

3. Shop by category
   - cleaner category tiles/cards
   - keep product counts
   - keep category links

4. Just Landed + Hot Deals
   - highest priority product sections
   - stronger section design and View all

5. Shop by need
   - Laptops for Students
   - Work & Business
   - Gaming/Powerful Laptops

6. Phones and accessories
   - Smartphones for Every Budget
   - Quality Accessories

7. Trusted brands products
   - only show if admin tagged products exist

## Implementation Notes for Future Redesign

- Avoid rewriting product filtering logic unless needed.
- Keep `visibleHomepageSections` and section keys because admin likely depends on those keys.
- If redesigning the hero, keep `banners`, `bannerIndex`, `goToPrevBanner`, `goToNextBanner`, and `renderHeroSlide`.
- Add code-driven hero copy beside/over the banner so the page still communicates when banner art has no text.
- Preserve category link generation through `getCategoryFilterHref`.
- Preserve product section link generation through `getHomeSectionFilterHref`.
- Preserve product card action API: `<ProductCard product={product} onAddToCart={handleAddToCart} />`.
- If product sections are grouped visually, do it in render/layout only; do not break underlying section URLs.
- Any mobile redesign should be explicit in JSX/CSS class structure, not just desktop grid media queries.

