# DEETECH Admin Redesign Map and Stitch/Claude Brief

Use this document to brief Google Stitch and Claude on a complete redesign of the DEETECH Computers admin area. The redesign must change presentation, layout, hierarchy, and admin experience only. Do not change the existing routes, API calls, permissions, form field names, product logic, order logic, export behavior, or mutation behavior.

The admin is an operations workspace for a Ghana-based ecommerce store selling laptops, phones, monitors, accessories, printers, storage devices, and other tech products.

## Non-Negotiables

- Keep every existing route and action working.
- Keep all API endpoints and request payloads intact.
- Keep admin authentication and role checks intact.
- Keep exports: CSV, JSON, and SQL.
- Keep all product image upload, URL image, upgrade option, and home section logic.
- Keep order status, payment status, ETA, delivery, payment proof, and affiliate resync logic.
- Keep support ticket status and reply logic.
- Keep user activation/deactivation and User 360 modal logic.
- Keep affiliate settings, MoMo verification, copy code, activation, and delete logic.
- Keep banner create/update/delete logic and category/custom link behavior.
- Keep discount generation, copy, and delete logic.
- Use dedicated desktop and mobile admin designs. Do not merely squeeze the desktop UI into mobile.
- Use icons, not emojis.

## Current Admin Files

- Admin dashboard route: `nextjs/src/app/admin/page.js`
- Orders route: `nextjs/src/app/admin/orders/page.js`
- Products route: `nextjs/src/app/admin/products/page.js`
- Product create route: `nextjs/src/app/admin/products/create/page.js`
- Product edit route: `nextjs/src/app/admin/products/[id]/edit/page.js`
- Users route: `nextjs/src/app/admin/users/page.js`
- Affiliates route: `nextjs/src/app/admin/affiliates/page.js`
- Reviews route: `nextjs/src/app/admin/reviews/page.js`
- Banners route: `nextjs/src/app/admin/banners/page.js`
- Messages route: `nextjs/src/app/admin/messages/page.js`
- Discounts route: `nextjs/src/app/admin/discounts/page.js`
- Shared layout shell: `nextjs/src/components/admin/admin-shell.jsx`
- Shared admin navigation: `nextjs/src/components/admin/admin-nav.jsx`
- Dashboard component: `nextjs/src/components/admin/admin-dashboard.jsx`
- Shared admin manager: `nextjs/src/components/admin/admin-manager.jsx`
- Main styling file: `nextjs/src/components/styles/global-styles.jsx`

## Current Shared Architecture

`AdminShell` wraps all admin pages in:

- `<main className="shell page-section">`
- `<div className="admin-layout">`
- `<AdminNav />`
- active page content

`AdminNav` contains:

- Dashboard: `/admin`
- Orders: `/admin/orders`
- Products: `/admin/products`
- Users: `/admin/users`
- Affiliates: `/admin/affiliates`
- Reviews: `/admin/reviews`
- Banners: `/admin/banners`
- Messages: `/admin/messages`
- Discounts: `/admin/discounts`

`AdminManager` powers every list/form page except the dashboard. It controls:

- admin gate
- page hero
- search
- filters
- refresh
- exports
- collapsible forms
- record list
- record actions
- loading/error states
- toast feedback

## Current CSS Surface To Redesign

Most admin styling is in `nextjs/src/components/styles/global-styles.jsx`.

Important selectors:

- `.admin-layout`
- `.admin-nav`
- `.admin-nav__brand`
- `.admin-nav__list`
- `.admin-nav__link`
- `.admin-manager`
- `.admin-state`
- `.admin-hero`
- `.admin-toolbar`
- `.admin-create-panel`
- `.admin-form`
- `.admin-record-list`
- `.admin-record`
- `.admin-record__summary`
- `.admin-record__body`
- `.admin-chip`
- `.admin-chip-row`
- `.admin-inline-control`
- `.admin-meta-grid`
- `.admin-actions`
- `.admin-stat-grid`
- `.admin-dashboard`
- `.admin-dash-*`
- `.admin-viz-*`
- `.admin-support-ticket*`
- `.admin-collapsible*`
- `.admin-affiliate-leaderboard*`
- `.admin-overlay`

Responsive admin CSS also lives in the same file. The redesign should separate desktop and mobile intent with clear admin-specific breakpoints and class structures.

## Design System Direction

Use the DEETECH account redesign language, adapted for admin density.

Colors:

- Page background: `#f5f6f7`
- Panels: `#ffffff`
- Soft panel accent: `#f8f2e6`
- Main text: `#1b1916`
- Muted text: `#665d52`
- Borders/dividers: `#e8e0d4`
- Primary green: `#184f27`
- Strong green: `#1d6a33`
- Gold accent: `#d9a441`
- Strong gold: `#b98014`
- Danger: `#c0392b`
- Success: deep green
- Warning: warm gold

Avoid:

- purple
- blue-purple
- neon colors
- decorative blobs
- marketing hero layouts
- oversized cards that waste admin workspace
- emojis
- fake placeholder data in implementation

Typography:

- Admin dashboard should feel dense and operational.
- Use strong headings, compact labels, and monospaced numerals for money, counts, dates, codes, order IDs, and affiliate codes.
- Keep body text short and scannable.

Interaction:

- Primary actions use green filled buttons.
- Secondary actions use outline buttons.
- Dangerous actions use red outline or filled red when final.
- Disabled actions must be visually obvious.
- Loading actions must preserve button width where possible.
- Collapsible records must clearly show expanded/collapsed state.

Desktop layout:

- Persistent left sidebar around 280px wide.
- Main workspace uses the full remaining width.
- Pages should be operational and spacious, not centered in a small column.
- Sticky sidebar is useful, but it must not cover the footer.
- Toolbars should sit near the top and stay readable.
- Use cards only for operational groupings: summary cards, filters, records, forms, modals.

Mobile layout:

- Dedicated admin mobile screen system.
- Do not reuse a cramped desktop sidebar.
- Mobile top bar: back/menu, section title, one key action or icon.
- Filters should be in a collapsible sheet or stacked control panel.
- Records should become compact cards with the main action visible.
- Dangerous actions should be separated from routine actions.

## Route and Page Map

| Route | Component | Purpose |
| --- | --- | --- |
| `/admin` | `AdminDashboard` | Operations overview and quick links |
| `/admin/orders` | `AdminManager type="orders"` | Manage order status, payment, ETA, delivery, affiliate resync |
| `/admin/products` | `AdminManager type="products"` | Search, filter, inspect, edit, delete products |
| `/admin/products/create` | `AdminManager productMode="create"` | Dedicated product creation form |
| `/admin/products/[id]/edit` | `AdminManager productMode="edit"` | Dedicated product editing form |
| `/admin/users` | `AdminManager type="users"` | Manage customers/admins and inspect User 360 |
| `/admin/affiliates` | `AdminManager type="affiliates"` | Manage affiliate accounts, settings, MoMo verification, leaderboard |
| `/admin/reviews` | `AdminManager type="reviews"` | Moderate and delete product reviews |
| `/admin/banners` | `AdminManager type="banners"` | Manage homepage banner images and links |
| `/admin/messages` | `AdminManager type="messages"` | Reply to support tickets and update ticket status |
| `/admin/discounts` | `AdminManager type="discounts"` | Generate, copy, filter, export, and delete discount codes |

## Shared Admin States

Design these states once and reuse them.

### Admin Loading

Current copy: `Loading admin...`

Design:

- compact white panel
- green/gold skeleton, not a generic spinner
- message: `Verifying admin access`
- helper: `Loading DEETECH operations workspace.`

### Not Authenticated

Current behavior:

- message says login is required
- link to `/login`

Design:

- secure access panel
- primary CTA `Go to login`
- calm warning tone

### Not Admin

Current behavior:

- message says admin access is required

Design:

- restricted access panel
- no destructive or technical-looking error

### Loading Records

Current behavior:

- record list shows loading text/state

Design:

- layout-matched skeleton rows or cards
- preserve toolbar and page title

### Empty Records

Current copy: `No records yet`

Design:

- section-specific empty states
- one helpful CTA if the current page has a natural next action
- no fake data

### Error State

Current behavior:

- error text appears in the manager

Design:

- inline admin alert
- retry/refresh button where relevant
- do not hide filters or nav

### Delete Confirmation

Current behavior:

- browser `confirm()` says: `This admin action will delete this record. Continue?`

Design direction:

- if implementing a modal later, keep the same delete action and confirmation meaning
- show record name/code/order ID before deletion

## 1. Dashboard Page

Route: `/admin`

Files:

- `nextjs/src/app/admin/page.js`
- `nextjs/src/components/admin/admin-dashboard.jsx`
- `nextjs/src/components/admin/admin-shell.jsx`
- `nextjs/src/components/admin/admin-nav.jsx`
- `nextjs/src/components/styles/global-styles.jsx`

Current data behavior:

- verifies auth and admin role
- loads dashboard, orders, messages, users, products, and affiliates
- refreshes every 30 seconds
- refreshes on browser focus
- shows live/syncing state

Current dashboard content:

- title: `Operations Overview`
- last sync timestamp
- summary cards:
  - Total Orders
  - Unread Messages
  - Total Users
  - Products
  - Active Affiliates
  - Revenue
- charts/visual summaries:
  - Order Status Overview
  - Payment Method Mix
  - Top User Regions
- recent panels:
  - Recent Orders with `Open Orders`
  - New Messages with `Open Messages`
  - Recent Users with `Open Users`
- shortcuts:
  - Products
  - Orders
  - Messages
  - Users
  - Affiliates
  - Reviews

Required actions:

- `Open Orders` -> `/admin/orders`
- `Open Messages` -> `/admin/messages`
- `Open Users` -> `/admin/users`
- shortcut links to their admin routes
- automatic refresh remains unchanged

Desktop Stitch prompt:

Design a premium DEETECH admin dashboard desktop screen. Use a persistent left sidebar and full-width operations workspace. Show a compact live status top area, six KPI cards, three analytics panels, recent orders, new messages, recent users, and admin shortcuts. The screen should feel like a serious ecommerce control room, not a marketing dashboard. Use green for live/admin actions, gold for warnings, red for risk, white panels, warm beige borders, and monospaced numbers.

Mobile Stitch prompt:

Design a dedicated mobile admin dashboard. Replace the sidebar with a compact admin top bar and menu pattern. Show the most important KPIs first in a two-column grid, then alerts/messages, then shortcuts. Keep touch targets large and avoid wide tables.

## 2. Orders Page

Route: `/admin/orders`

Files:

- `nextjs/src/app/admin/orders/page.js`
- `nextjs/src/components/admin/admin-manager.jsx`
- `nextjs/src/components/styles/global-styles.jsx`

Endpoint:

- `API_BASE_ORDERS`

Current page purpose:

- inspect customer orders
- update order lifecycle
- update payment lifecycle
- set expected delivery date
- mark paid
- mark delivered
- delete order
- resync affiliate commissions
- export order data

Toolbar actions:

- search orders
- refresh
- export CSV
- export JSON
- export SQL
- `Resync Affiliates`

Order-specific actions:

- Order status select:
  - `pending`
  - `processing`
  - `shipped`
  - `delivered`
  - `cancelled`
- Payment status select:
  - `pending`
  - `paid`
  - `failed`
- Expected Delivery datetime input
- `Save ETA`
- `Mark Paid`
- `Delivered`
- `Delete`

Order card data:

- order ID/order number
- customer name/email
- created date
- order status
- total amount
- subtotal
- product savings
- delivery fee/free delivery
- discount
- payment method
- payment status
- region
- estimated delivery date
- shipping email
- phone
- address
- affiliate tracking information
- payment proof image/link
- ordered items
- item quantity
- selected upgrades
- unit price including upgrade

Stats and analytics:

- Total
- Showing
- Revenue
- Order status distribution
- Payment method distribution
- Payment flow split

Desktop Stitch prompt:

Design the DEETECH admin Orders page as a full desktop operations table/card hybrid. The top should have page title, order count, search, refresh, exports, and a clear `Resync Affiliates` action. Each order should have a scannable summary row with order ID, customer, status, total, payment state, and date. Expanded details should show customer/delivery information, payment proof, affiliate tracking, items, and lifecycle controls. Primary actions should be easy to find, but destructive delete must be separated and red.

Mobile Stitch prompt:

Design a dedicated mobile orders admin page. Use compact order cards. First line: order ID and status. Second line: customer and total. Expose payment/order status controls in a detail sheet or expanded card. Keep `Mark Paid`, `Delivered`, and `Save ETA` touch-friendly. Put delete at the bottom as a danger action.

## 3. Products Page

Route: `/admin/products`

Files:

- `nextjs/src/app/admin/products/page.js`
- `nextjs/src/components/admin/admin-manager.jsx`
- `nextjs/src/components/styles/global-styles.jsx`

Endpoint:

- `API_BASE_PRODUCTS`

Current page purpose:

- browse product catalog
- search/filter/sort products
- open product create page
- open product edit page
- delete products
- export product data

Toolbar controls:

- search products
- category filter:
  - laptops
  - phones
  - monitors
  - accessories
  - printers
  - storage
  - others
- brand/subcategory filter
- stock filter:
  - all
  - in stock
  - out of stock
- featured filter:
  - featured and regular
  - featured only
  - regular only
- sort:
  - newest
  - oldest
  - name A-Z
  - name Z-A
  - price low-high
  - price high-low
  - stock high-low
  - stock low-high
- refresh
- export CSV
- export JSON
- export SQL
- clear filters

Product list actions:

- `Create Product` link -> `/admin/products/create`
- `Edit` link -> `/admin/products/{id}/edit`
- `Delete`

Product card data:

- product image
- name
- category
- subcategory/brand
- price
- discount price if present
- stock
- featured state
- home sections

Stats and analytics:

- Total
- Featured
- Out of stock
- Showing
- Category distribution
- Stock health

Desktop Stitch prompt:

Design the DEETECH admin Products page as a catalog command center. Keep filters visible and organized. Product records should show image, product name, category, brand, price, stock, featured state, and home section tags. `Create Product` should be a strong action. Edit and Delete should sit in the expanded record actions. Make out-of-stock and featured states instantly scannable.

Mobile Stitch prompt:

Design a dedicated mobile products admin page. Use a top action for `Create Product`, a collapsible filter drawer, and product cards with image, price, stock, and quick edit. Avoid dense desktop grids.

## 4. Product Create and Edit Pages

Routes:

- `/admin/products/create`
- `/admin/products/[id]/edit`

Files:

- `nextjs/src/app/admin/products/create/page.js`
- `nextjs/src/app/admin/products/[id]/edit/page.js`
- `nextjs/src/components/admin/admin-manager.jsx`
- `nextjs/src/components/styles/global-styles.jsx`

Current form fields:

- Product name, required
- Card description
- Full product description, required
- Category, required
- Subcategory/brand
- Hidden brand field mirrors subcategory
- Price, required
- Stock count, required
- Discount price
- Discount preset:
  - No timed discount
  - Instant discount
  - 24 hours
  - 72 hours
  - 168 hours
- Image URLs:
  - main image URL
  - additional image URLs up to 6 total
  - `+ Add image`
- Existing images preview on edit page
- Upload image slots:
  - accepts JPG, PNG, WEBP, GIF, BMP, HEIC, HEIF
  - starts with two slots
  - up to 6 total images
  - `+ Add image`
- Home section checkboxes:
  - Hot Deals
  - Just Landed
  - Laptops for Students
  - Laptops for Work & Business
  - Powerful/Gaming Laptops
  - Smartphones for Every Budget
  - Quality Accessories
  - Shop Trusted Brands
- Specs textarea, comma separated
- Upgrade Specs collapsible:
  - Enable upgrade options
  - RAM options
  - Storage options
  - each option has label and price delta
  - add/remove option rows
- Feature this product checkbox

Form actions:

- `Back to Products`
- `Create Product`
- `Update Product`
- loading text `Saving...`

Important validation:

- maximum 6 product images total
- form submits as `FormData`
- create redirects back to `/admin/products`
- edit redirects back to `/admin/products`

Desktop Stitch prompt:

Design Product Create/Edit as a serious admin form, not a long uncontrolled stack. Use grouped sections: Product Basics, Pricing and Stock, Images, Homepage Placement, Specifications, Upgrade Options, Publishing. Keep save action visible near the bottom and provide a clear back link. Image management must be visually obvious and must show the 6-image limit.

Mobile Stitch prompt:

Design a dedicated mobile product form with collapsible sections. Keep required basics first. Use sticky bottom `Create Product` or `Update Product` action. Image inputs must be touch-friendly and not cramped.

## 5. Users Page

Route: `/admin/users`

Files:

- `nextjs/src/app/admin/users/page.js`
- `nextjs/src/components/admin/admin-manager.jsx`
- `nextjs/src/components/styles/global-styles.jsx`

Endpoint:

- `${API_BASE_USERS}/admin/users`

Current page purpose:

- view customers/admins
- activate/deactivate users
- delete non-admin users
- inspect customer behavior in User 360 modal
- export users

Toolbar controls:

- search users
- role filter:
  - all
  - user
  - admin
- status filter:
  - all
  - active
  - inactive
- sort:
  - newest
  - oldest
  - name A-Z
  - name Z-A
  - email A-Z
  - email Z-A
- refresh
- export CSV
- export JSON
- export SQL
- clear filters

User card data:

- name
- email
- phone
- role
- active/inactive state
- region
- joined date
- wishlist count
- orders
- total spent
- reviews
- support tickets
- average rating
- top search
- top interest

Actions:

- `View User 360`
- `Activate` or `Deactivate`
- `Delete` for non-admin users
- protected admin account state for admin users

User 360 modal:

- name
- email
- joined date
- stats: orders, spent, wishlist, reviews, support, average rating
- top search terms
- category interests
- activity timeline with orders, reviews, and tickets
- close button
- backdrop click closes modal

Desktop Stitch prompt:

Design the Users page as a customer intelligence screen. User rows should prioritize identity, role, status, orders, spend, and engagement. User 360 should feel like a polished modal with behavior summaries and timeline, not a raw JSON dump. Admin users must look protected.

Mobile Stitch prompt:

Design a dedicated mobile users admin page. Use searchable customer cards, filter sheet, and a full-screen User 360 detail view. Keep activation/deactivation clear and delete separated.

## 6. Affiliates Page

Route: `/admin/affiliates`

Files:

- `nextjs/src/app/admin/affiliates/page.js`
- `nextjs/src/components/admin/admin-manager.jsx`
- `nextjs/src/components/styles/global-styles.jsx`

Endpoint:

- `${API_BASE}/affiliates/admin`

Current page purpose:

- manage affiliate accounts
- verify MoMo payout numbers
- activate/deactivate affiliates
- copy affiliate codes
- delete affiliates
- edit affiliate program settings
- view leaderboard
- export affiliate data

Toolbar controls:

- search affiliates
- tier filter:
  - all
  - starter
  - bronze
  - silver
  - gold
- status filter:
  - all
  - active
  - inactive
- sort:
  - highest earned commission
  - highest pending commission
  - most referrals
  - newest
  - oldest
  - code A-Z
  - code Z-A
- refresh
- export CSV
- export JSON
- export SQL
- clear filters

Stats and analytics:

- Total
- Showing
- Active
- Inactive
- Referrals
- Pending
- Earned
- Tier distribution
- Affiliate status split
- Top earning affiliates

Leaderboard:

- collapsible
- ranks top affiliates by earnings/referrals
- shows code, user, earned, referrals, MoMo state
- rows anchor to the affiliate record

Program settings:

- default commission rate
- bronze threshold
- silver threshold
- gold threshold
- `Update Affiliate Settings`
- loading text `Saving...`

Affiliate card data:

- affiliate code
- user
- tier
- active/inactive state
- referrals
- pending commission
- earned commission
- commission rate
- MoMo payout number
- MoMo verification state
- user phone
- email

Actions:

- `Copy Code`
- `Verify MoMo` or `Mark MoMo Unverified`
- `Activate` or `Deactivate`
- `Delete`

Desktop Stitch prompt:

Design the admin Affiliates page as a payout and partner-management console. Keep the leaderboard and program settings visible but not overwhelming. Affiliate records should make code, user, tier, earnings, pending commission, and MoMo verification immediately scannable. Use the same icon language as the account/public affiliate designs.

Mobile Stitch prompt:

Design a dedicated mobile affiliate admin page. Use stat cards, a compact leaderboard, and affiliate cards. Program settings can be a separate collapsible panel. Copy and verify actions must be thumb-friendly.

## 7. Reviews Page

Route: `/admin/reviews`

Files:

- `nextjs/src/app/admin/reviews/page.js`
- `nextjs/src/components/admin/admin-manager.jsx`
- `nextjs/src/components/styles/global-styles.jsx`

Endpoint:

- `${API_BASE}/reviews`

Current page purpose:

- moderate product reviews
- approve/reject reviews
- delete reviews
- open reviewed product
- export review data

Toolbar controls:

- search reviews
- status filter:
  - all
  - approved
  - rejected
- rating filter:
  - all
  - 5
  - 4+
  - 3+
  - 2+
- sort:
  - newest
  - oldest
  - rating high-low
  - rating low-high
- refresh
- export CSV
- export JSON
- export SQL
- clear filters

Stats and analytics:

- Total
- Showing
- Approved
- Rejected
- Average rating
- Rating distribution
- Moderation split

Review card data:

- review title
- reviewer
- product
- approved/rejected state
- rating
- created date
- star rating
- comment
- product link if product ID exists

Actions:

- `Open Product`
- `Approve`
- `Reject`
- `Delete`

Desktop Stitch prompt:

Design Reviews as a moderation queue. Make rating, status, product, reviewer, and comment easy to scan. Use gold stars and green/red moderation badges. Approve and reject should be prominent but balanced. Delete should be separated.

Mobile Stitch prompt:

Design a mobile moderation queue with stacked review cards. Each card should show product, rating, comment preview, current moderation state, and actions.

## 8. Banners Page

Route: `/admin/banners`

Files:

- `nextjs/src/app/admin/banners/page.js`
- `nextjs/src/components/admin/admin-manager.jsx`
- `nextjs/src/components/styles/global-styles.jsx`

Endpoint:

- `${API_BASE}/banners`

Current page purpose:

- create homepage banners
- upload or link banner images
- set banner order
- link banners to category/subcategory or custom URL
- edit banners
- delete banners
- export banner data

Toolbar actions:

- search banners
- refresh
- export CSV
- export JSON
- export SQL

Create/update banner form:

- Image URL
- File upload
- Link mode:
  - none
  - category
  - custom
- Category select when category mode is active
- Subcategory select when category mode is active
- Custom URL input when custom mode is active
- Display order number
- `Create Banner`
- `Update Banner`
- loading text `Saving...`

Banner card data:

- thumbnail
- homepage banner label
- link description
- display order

Actions:

- `Edit`
- `Close Edit`
- `Delete`

Desktop Stitch prompt:

Design Banners as a homepage campaign manager. Show visual thumbnails first, then link destination and order. The create/edit form should clearly separate image source, link behavior, and display order.

Mobile Stitch prompt:

Design mobile banner management with image-first cards and a compact create/edit form. Link mode should be clear and tap-friendly.

## 9. Messages Page

Route: `/admin/messages`

Files:

- `nextjs/src/app/admin/messages/page.js`
- `nextjs/src/components/admin/admin-manager.jsx`
- `nextjs/src/components/styles/global-styles.jsx`

Endpoint:

- `API_BASE_SUPPORT`

Current page purpose:

- inspect customer support tickets
- view attachments
- view conversation thread
- update ticket status
- reply to customer
- export support data

Toolbar actions:

- search messages
- refresh
- export CSV
- export JSON
- export SQL

Stats:

- Total
- Showing
- Open
- Resolved

Ticket card summary:

- customer name
- customer email
- current ticket status
- updated date
- expanded/collapsed icon

Expanded ticket data:

- subject
- created date
- current status
- created timestamp chip
- updated timestamp chip
- thread count
- customer request
- primary attachment image if present
- conversation thread
- sender label: Support or Customer
- message timestamp
- message text
- message attachment image if present

Ticket form controls:

- Ticket status select:
  - `new`
  - `in-progress`
  - `resolved`
- Response textarea placeholder: `Type your reply...`
- Reply length counter: `0 / 2000 characters`
- `Update Ticket`
- loading text `Saving...`
- button disabled until status changes or response has text

Desktop Stitch prompt:

Design Messages as a support operations console. Use ticket cards with expanded conversation detail. The thread should read like a professional support timeline, not a casual chat app. The composer must make status and reply actions clear. Attachments should be visible without disrupting the workflow.

Mobile Stitch prompt:

Design a mobile support admin page with ticket cards and a full-screen ticket detail. Keep status select and reply composer sticky or bottom-visible. Attachments should be tappable.

## 10. Discounts Page

Route: `/admin/discounts`

Files:

- `nextjs/src/app/admin/discounts/page.js`
- `nextjs/src/components/admin/admin-manager.jsx`
- `nextjs/src/components/styles/global-styles.jsx`

Endpoint:

- `${API_BASE}/admin/discounts`

Current page purpose:

- generate discount codes
- filter/search/sort discount codes
- copy codes
- delete codes
- export code data

Toolbar controls:

- search discounts
- status filter:
  - all
  - available
  - used
- percent filter:
  - all
  - 2 through 10
- sort:
  - newest
  - oldest
  - percent high-low
  - percent low-high
  - code A-Z
  - code Z-A
- refresh
- export CSV
- export JSON
- export SQL
- clear filters

Generate form:

- Percent number input, min 2, max 10
- Count number input, min 1, max 50
- `Generate Codes`
- loading text `Generating...`

Stats and analytics:

- Total
- Showing
- Available
- Used
- Average percent
- Discount percent distribution
- Code usage split

Discount card data:

- code
- percent
- created date
- used/available state
- used by user
- used at date
- order reference

Actions:

- `Copy Code`
- `Delete`

Desktop Stitch prompt:

Design Discounts as a code operations page. The generator should be prominent but compact. Code records should show code, percent, availability, used by, order reference, and copy/delete actions. Use monospaced code text.

Mobile Stitch prompt:

Design mobile discount management with a top generator card, filter sheet, and code cards. Copy should be the primary per-code action.

## Export Behavior

Every non-dashboard admin page supports:

- Export CSV
- Export JSON
- Export SQL

Design requirement:

- Keep export actions grouped together.
- On desktop, use a compact segmented action group or menu.
- On mobile, use an export menu/sheet to avoid clutter.
- Export applies to the current filtered list, so the UI should say or imply that.

## Claude Implementation Prompt

Use this prompt after Stitch generates visual references:

```text
You are redesigning the DEETECH Computers admin portal in a Next.js ecommerce codebase.

Do not change backend APIs, route paths, auth logic, admin role checks, request payloads, or mutation behavior. Redesign only JSX structure and CSS around the existing logic.

Relevant files:
- nextjs/src/app/admin/page.js
- nextjs/src/app/admin/orders/page.js
- nextjs/src/app/admin/products/page.js
- nextjs/src/app/admin/products/create/page.js
- nextjs/src/app/admin/products/[id]/edit/page.js
- nextjs/src/app/admin/users/page.js
- nextjs/src/app/admin/affiliates/page.js
- nextjs/src/app/admin/reviews/page.js
- nextjs/src/app/admin/banners/page.js
- nextjs/src/app/admin/messages/page.js
- nextjs/src/app/admin/discounts/page.js
- nextjs/src/components/admin/admin-shell.jsx
- nextjs/src/components/admin/admin-nav.jsx
- nextjs/src/components/admin/admin-dashboard.jsx
- nextjs/src/components/admin/admin-manager.jsx
- nextjs/src/components/styles/global-styles.jsx

Design direction:
- Premium ecommerce operations workspace.
- DEETECH colors: #f5f6f7 background, #ffffff panels, #f8f2e6 soft accent, #1b1916 text, #665d52 muted, #e8e0d4 border, #184f27 green, #1d6a33 strong green, #d9a441 gold, #b98014 strong gold, #c0392b danger.
- Use icons, badges, dense information hierarchy, and monospaced numbers/codes.
- Avoid emojis, purple/blue-purple, neon, decorative blobs, and marketing hero layouts.
- Build separate desktop and mobile admin experiences. Do not cram the desktop sidebar into mobile.

Preserve all page behavior:
- Dashboard refresh and quick links.
- Orders lifecycle controls, payment status, ETA, mark paid, delivered, delete, affiliate resync.
- Product filters, product create/edit/delete, image URLs/uploads, home sections, upgrade options.
- User filters, activate/deactivate, delete, User 360 modal.
- Affiliate filters, leaderboard, settings, copy code, MoMo verification, activate/deactivate, delete.
- Review moderation and deletion.
- Banner create/edit/delete with image URL/upload and category/custom links.
- Support ticket status, reply composer, thread, attachments.
- Discount generator, copy, delete, filters.
- CSV/JSON/SQL exports on all manager pages.

Implement incrementally:
1. Update admin shell and sidebar.
2. Update shared manager hero, toolbar, stats, empty/loading/error states.
3. Redesign each record type while preserving action handlers.
4. Redesign product create/edit form.
5. Add dedicated mobile admin CSS.
6. Verify every admin route still renders and every form/action still calls the existing handler.
```

## Stitch Output Instructions

For Stitch, generate screens in this order:

1. Admin Dashboard desktop and mobile
2. Orders desktop and mobile
3. Products list desktop and mobile
4. Product Create/Edit desktop and mobile
5. Users desktop and mobile
6. Affiliates desktop and mobile
7. Reviews desktop and mobile
8. Banners desktop and mobile
9. Messages desktop and mobile
10. Discounts desktop and mobile
11. Shared loading, permission, error, and empty states

For each screen:

- Label desktop and mobile outside the app UI only.
- Use real admin workflow structure from this document.
- Show all buttons and controls that exist in code.
- Use the DEETECH color system.
- Use icons, not emojis.
- Keep the design implementation-friendly for the current Next.js components.
