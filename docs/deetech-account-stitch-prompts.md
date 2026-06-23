# DEETECH Account Redesign Prompts for Google Stitch

Use these prompts to generate dedicated account designs for desktop and mobile. Do not ask Stitch for one responsive screen that merely rearranges CSS. Generate a desktop design and a mobile design as separate screens placed side by side for each page/section.

## Master Design Direction

Design a polished ecommerce account dashboard for DEETECH Computers, a Ghana-based computer and gadget store. The experience is for logged-in customers managing orders, saved products, support messages, notifications, affiliate earnings, profile details, delivery address, password, and logout.

Use the existing DEETECH color language:

- Page background: light neutral gray `#f5f6f7`.
- Panels/cards: white `#ffffff`.
- Soft panel accent: warm cream `#f8f2e6`.
- Main text: near black `#1b1916`.
- Muted text: warm gray `#665d52`.
- Borders/dividers: warm beige `#e8e0d4`.
- Primary account action green: `#184f27`.
- Strong green/action gradient: `#1d6a33` to `#184f27`.
- Brand gold accent: `#d9a441`, strong gold `#b98014`.
- Danger: `#c0392b`.
- Success: deep green.
- Avoid purple, blue-purple, decorative blobs, and marketing hero layouts.

Visual style:

- Quiet premium ecommerce dashboard, not a landing page.
- Clean operational interface built for repeat use.
- Keep cards practical and compact; no cards inside cards.
- Use a full-width account workspace with structured panels.
- Rounded corners can be present but restrained: 8-16px preferred, 24px only for large account nav pills if needed.
- Use icon + label buttons where helpful: orders, invoice, review, address, message, notification, wishlist, password, logout.
- Use product thumbnails in order, wishlist, and review rows.
- Use badges for status: unread/read, order placed, accepted, on the way, delivered, cancelled, active affiliate, inactive affiliate, in stock, out of stock.
- Preserve accessibility: clear labels, good contrast, 44px+ tap targets on mobile, obvious selected state, visible disabled state.
- The design should feel fast, organized, trustworthy, and customer-service oriented.

Global desktop layout:

- Create a dedicated desktop account layout at about 1440px wide.
- Include the site header context lightly or assume the site header sits above; focus the design on the account area.
- Top account title area: "My Account" with breadcrumb "Home / My Account".
- Main account workspace: two-column layout.
- Left side: persistent vertical account navigation, about 300-360px wide, with large clickable rows for Personal Information, My Orders, Manage Address, Messages / Requests, Notifications, Affiliates, Wishlist, Reviews, Password Manager, Logout, and Admin only if user is admin.
- Right side: active section content. Content should be spacious, aligned, and scannable.
- Active nav item should be green filled or strongly highlighted.

Global mobile layout:

- Create a dedicated mobile account layout at about 390px wide.
- Do not simply shrink the desktop sidebar. Mobile should have its own design.
- First mobile screen should feel like an account home/menu: "My Account" at top, user summary, notification/order quick stats, and stacked account menu tiles.
- When a section is selected, mobile should show a section page with a sticky compact top bar: back to account menu, section title, optional action.
- Mobile section content should be single column, thumb-friendly, with cards/rows sized for quick scanning.
- Account nav on mobile should be a real mobile menu page, not a hidden desktop sidebar.
- For each page/section prompt below, show desktop and mobile side by side in the generated design.

## 1. Personal Information Page

Prompt:

Design the DEETECH account "Personal Information" section in two dedicated screens side by side: desktop on the left, mobile on the right.

Function and flow:

- Customer lands on My Account and sees Personal Information by default.
- User can edit First Name, Last Name, and Phone.
- Email is visible but disabled/read-only.
- Required fields: First Name, Last Name, Email, Phone.
- Primary action button: "Update Changes".
- Button loading state text: "Updating...".
- Success behavior: profile saves and the account remains on this section.

Desktop design:

- Keep the left account sidebar visible with Personal Information selected.
- Right content should have a section heading "Personal Information" and helper text "Update the main details tied to your DEETECH account."
- Form should be two columns: first name and last name side by side; email and phone can span full width or be cleanly grouped.
- Show read-only email with a muted disabled field style.
- Put the Update Changes button below the form, left aligned.
- Add a small account identity summary near the top if useful: initials/avatar placeholder, customer name, email, phone completeness status.

Mobile design:

- Dedicated section page with top bar: back arrow/text "Account", title "Personal Information".
- Single-column form.
- Large, comfortable input fields.
- Read-only email clearly disabled.
- Sticky or bottom-visible primary action "Update Changes" if it improves usability.
- Avoid cramming sidebar nav into the form page.

## 2. My Orders Page

Prompt:

Design the DEETECH account "My Orders" section in two dedicated screens side by side: desktop on the left, mobile on the right.

Function and flow:

- Shows all customer orders.
- Section heading: "Orders (count)".
- Helper text: "Track active purchases, invoice downloads, and review actions from one place."
- Each order includes Order ID, Total Payment, subtotal and delivery note, payment method, product savings/discount if available, order/delivered date, product thumbnails, order status, status message, and actions.
- Actions per order: "Track Order", "Invoice", and "Add Review" when a product exists.
- Clicking Track Order opens `/orders/{orderId}`.
- Clicking Invoice downloads or opens invoice.
- Clicking Add Review opens the product review area.
- Empty state: "No orders yet" with "Browse products".

Desktop design:

- Persistent left account nav with My Orders selected.
- Right content should show order cards in a vertical stack.
- Each order card should have a structured summary row with four columns: Order ID, Total Payment, Payment Method, Date.
- Below summary, show product item row/grid with up to four product thumbnails and product names/categories.
- Footer: status badge and message on left; action buttons on right.
- Status badge colors:
  - Delivered: success green.
  - Accepted/processing: gold/warning.
  - On the Way: neutral/green.
  - Cancelled: red.
  - Order Placed: neutral.
- Keep actions visually distinct: Track Order as primary green, Invoice/Add Review as secondary outline.

Mobile design:

- Dedicated orders section page with top bar back to Account and title "My Orders".
- Use compact order cards optimized for scrolling.
- First line: Order ID and status badge.
- Second line: total payment and date.
- Product thumbnails should appear in a horizontal mini strip.
- Use stacked full-width buttons or a 2-column action grid: Track Order primary, Invoice secondary, Add Review secondary.
- Empty mobile state should include Browse products button.

## 3. Manage Address Page

Prompt:

Design the DEETECH account "Manage Address" section in two dedicated screens side by side: desktop on the left, mobile on the right.

Function and flow:

- Customer manages default delivery address used for faster checkout.
- Show a saved address preview card before the form.
- Fields: First Name, Last Name, Street Address, City, Region, Phone, Email.
- Region is a select/dropdown using Ghana regions.
- Email is read-only disabled.
- Required fields: First Name, Last Name, Street Address, City, Region, Phone, Email.
- Primary button: "Add Address"; loading state "Saving...".
- Saving updates profile/address and syncs checkout draft profile.

Desktop design:

- Left nav selected: Manage Address.
- Right content with heading and helper text.
- Address preview card should show account holder name, street address, city/region, phone.
- Form beneath should use two-column layout where appropriate.
- Street Address, Phone, Email can span full width.
- Region dropdown should look like a native select with clear affordance.
- Primary button left aligned below form.

Mobile design:

- Dedicated mobile section with back to Account and title "Manage Address".
- Address preview card first, then single-column form.
- Region selector must be full-width and tap-friendly.
- Button should be full-width or sticky at bottom if form is long.

## 4. Messages / Requests Page

Prompt:

Design the DEETECH account "Messages / Requests" support conversation section in two dedicated screens side by side: desktop on the left, mobile on the right.

Function and flow:

- Only appears in account navigation if the user has support tickets.
- Section heading: "Messages / Requests".
- Helper text: "Continue your support conversation with our team in real time."
- If no tickets: empty state with "No support requests yet" and button "Open support page".
- Active ticket shows subject, started date, last update date, and ticket status badge.
- Conversation thread has bubbles from "Support" and "You".
- Each message shows sender, timestamp, text, and optional image attachment thumbnail.
- Composer textarea placeholder: "Type a message...".
- Pressing Enter sends, Shift+Enter creates a new line.
- Send button text: "Send"; loading text: "...".
- Secondary contact panel: "Need another way to reach us?" with WhatsApp CTA "Chat on WhatsApp".

Desktop design:

- Left nav selected: Messages / Requests.
- Right content should feel like a support chat dashboard.
- Main chat panel should contain thread header, scrollable message area, and composer at bottom.
- Show support bubbles and user bubbles with distinct alignment/colors.
- WhatsApp support panel can sit beside or below chat, but should not be nested inside the chat card.
- Status badge: new/open/pending as gold; resolved as green.

Mobile design:

- Dedicated chat screen with top bar back to Account and title "Messages".
- Thread header compact below top bar.
- Message bubbles should fill the mobile width comfortably.
- Composer should be fixed/sticky near bottom when possible.
- Send button should be icon or compact button, but clearly tappable.
- WhatsApp CTA can be a small secondary card after the thread or in an overflow area.

## 5. Notifications Page

Prompt:

Design the DEETECH account "Notifications" section in two dedicated screens side by side: desktop on the left, mobile on the right.

Function and flow:

- Shows full account notification history for order updates and support replies.
- Section heading: "Notifications".
- Helper text: "Read your latest order and support updates here. The navbar only shows a quick preview, while the full history stays in this section."
- If notifications exist, show "Mark all as read" button.
- Each notification includes kind eyebrow: "Support update" or "Order update", title, body, read/unread status, timestamp, and action link "Open update".
- Clicking Open update marks the notification read and goes to the related href.
- Empty state: "No notifications yet".

Desktop design:

- Left nav selected: Notifications.
- Right content should show notification cards in a vertical history list.
- Unread cards should have a subtle green-tinted background or left border.
- Header row with title/helper and Mark all as read aligned right.
- Notification card layout: left title/body, right status/timestamp, action below.

Mobile design:

- Dedicated mobile notification page with back to Account, title "Notifications", and optional "Mark all read" compact button.
- Cards should be single column.
- Put unread/read badge near the top right of each card.
- "Open update" should be a full-width or clearly visible button.

## 6. Affiliates Page

Prompt:

Design the DEETECH account "Affiliates" summary section in two dedicated screens side by side: desktop on the left, mobile on the right.

Function and flow:

- Customer can see affiliate status, code, tier, commission rate, referral counts, pending commission, paid-out commission, cancelled referrals, success rate, and lifetime generated value.
- Section heading: "Affiliates".
- Helper text: "Track your referral code, commissions, and payout progress from your account."
- Hero status:
  - Active affiliate: badge "Active affiliate", headline "Your affiliate hub is ready."
  - Not active: badge "Not active yet", headline "Start earning with DEETECH referrals."
- Meta: Code, Tier, Rate.
- Stat cards:
  - Total Referrals
  - Pending Commission
  - Total Paid Out
  - Lifetime Generated
  - Cancelled Referrals
  - Success Rate
- Referral breakdown panel: total referrals, successful/pending/cancelled, next payout focus, lifetime value.
- CTA: "Open Affiliate Page".

Desktop design:

- Left nav selected: Affiliates.
- Right content with affiliate hero panel at top.
- Use a grid of six compact stat cards below hero.
- Breakdown section should use three columns.
- Use green and gold accent cards, but keep the overall design clean and not too colorful.
- CTA button should be primary green.

Mobile design:

- Dedicated mobile affiliate section with back to Account and title "Affiliates".
- Hero summary first, then a horizontal or 2-column stat grid if it fits, otherwise stacked stat cards.
- Code/tier/rate should be easy to copy/read.
- CTA full-width: Open Affiliate Page.

## 7. Wishlist Page

Prompt:

Design the DEETECH account "Wishlist" preview section in two dedicated screens side by side: desktop on the left, mobile on the right.

Function and flow:

- This account section shows a mini preview of saved products and links to the full wishlist page.
- Section heading: "Wishlist".
- Helper text: "A mini wishlist preview linked to your main saved-products page."
- Shows up to 3 saved products.
- Each row includes product thumbnail, product name, category, price, and stock status.
- Clicking product opens `/products/{id}`.
- CTA: "Open Wishlist".
- Empty state: "Your wishlist is empty" with helper text.

Desktop design:

- Left nav selected: Wishlist.
- Right content with up to three horizontal product rows.
- Each row: thumbnail left, product name/category center, price and stock right.
- Stock status: green for Instock, red/muted for Out of stock.
- Open Wishlist CTA below list.

Mobile design:

- Dedicated mobile wishlist section.
- Product rows should be thumb + name/category + price/status, with enough tap height.
- Avoid table layout.
- CTA "Open Wishlist" full-width at bottom of content.

## 8. Reviews Page

Prompt:

Design the DEETECH account "Reviews" section in two dedicated screens side by side: desktop on the left, mobile on the right.

Function and flow:

- Shows recent reviews the customer has submitted.
- Section heading: "Reviews".
- Helper text: "Recent customer reviews you have submitted, with a quick jump back to the main product page."
- Shows up to 3 reviews.
- Each review includes product thumbnail, product name, review title, star rating, numeric rating, and "Open Product" link.
- Clicking product or Open Product goes to product reviews tab.
- Empty state: "No reviews yet" with helper text.

Desktop design:

- Left nav selected: Reviews.
- Right content with review cards/rows.
- Star rating should use gold filled stars.
- "Open Product" is a secondary outline action.

Mobile design:

- Dedicated mobile reviews section.
- Review cards stacked with product thumbnail, title, stars, and action.
- Keep text readable; no tiny review metadata.

## 9. Password Manager Page

Prompt:

Design the DEETECH account "Password Manager" section in two dedicated screens side by side: desktop on the left, mobile on the right.

Function and flow:

- Customer updates account password.
- Section heading: "Password Manager".
- Helper text: "Update your password securely from your account dashboard."
- Fields:
  - Password/current password, required.
  - New Password, required.
  - Confirm New Password, required.
- Primary action: "Update Password"; loading state "Updating...".
- Secondary link: "Forgot Password?".
- Validation behavior: if new password and confirm password do not match, show warning/toast.
- Current password is verified by login endpoint before saving the new password.

Desktop design:

- Left nav selected: Password Manager.
- Right content should be a compact security form, not overly wide.
- Include subtle security reassurance text or icon if helpful, but avoid long instructional copy.
- Fields full-width within form.
- Actions row: primary Update Password, secondary Forgot Password.

Mobile design:

- Dedicated mobile password page.
- Single-column full-width fields.
- Password inputs should have optional show/hide affordance in design if desired.
- Primary button full-width.
- Forgot Password link below.

## 10. Logout Page

Prompt:

Design the DEETECH account "Logout" section in two dedicated screens side by side: desktop on the left, mobile on the right.

Function and flow:

- Customer confirms they want to log out.
- Section heading: "Logout".
- Helper text: "Are you sure you want to log out?"
- Primary button: "Yes, Logout".
- Clicking button logs the user out and routes home.

Desktop design:

- Left nav selected: Logout.
- Right content should be a simple confirmation panel.
- Use clear but calm tone. Avoid alarming red unless used very subtly.
- Primary action can be green or dark; if a secondary cancel/back option is designed, it should return to Personal Information or Account menu.

Mobile design:

- Dedicated mobile logout confirmation screen.
- Clear short message and one primary action.
- Include "Back to Account" in the top bar.

## 11. Account Mobile Menu / Home Screen

Prompt:

Design a dedicated mobile-only DEETECH account menu/home screen, separate from the desktop account layout.

Function and flow:

- On mobile, when visiting `/account` without a specific tab, show a mobile account menu first.
- User can tap a menu item to open that section page.
- If a specific tab is loaded from URL, open that section directly with a back-to-menu control.
- Menu items:
  - Personal Information
  - My Orders
  - Manage Address
  - Messages / Requests, only if support tickets exist
  - Notifications
  - Affiliates
  - Wishlist
  - Reviews
  - Password Manager
  - Logout
  - Admin only if role is admin

Mobile design:

- Top: My Account title and breadcrumb or compact header.
- User summary card with name, email, phone/address completeness, and maybe a small avatar/initials.
- Quick stats row: orders count, unread notifications, wishlist count.
- Menu as large stacked tiles with icons, labels, short metadata badges where useful.
- Selected section should not appear here; this is a menu/home screen.
- Tapping a tile transitions to that section page.

## 12. Account Loading and Login Redirect States

Prompt:

Design DEETECH account loading and unauthenticated redirect states in desktop and mobile.

Function and flow:

- While authenticated profile is loading: show "My Account", "Account dashboard loading", and "Loading account...".
- If not authenticated: show "My Account", "Redirecting to login", and "Taking you to login...".
- These states should feel intentional, not broken.

Desktop design:

- Center a clean white panel within the account page area.
- Use a small loading skeleton or spinner in DEETECH green/gold.

Mobile design:

- Full-width compact panel below header.
- Clear message and loading indicator.

## Stitch Output Instruction

For each generated page:

- Put the desktop screen and mobile screen side by side in the same Stitch output.
- Label them "Desktop" and "Mobile" outside the app UI or in a small design annotation, not as user-facing in-app text.
- Keep all interactions represented visually: buttons, disabled fields, selected nav item, badges, empty states, loading states where relevant.
- Do not invent unrelated account features.
- Keep the design implementation-friendly for a Next.js ecommerce dashboard.
