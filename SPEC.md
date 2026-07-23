# VAU Ketering — Spec

## Problem Statement

VAU Ketering needs a public website to present their catering menu, accept orders, and communicate with customers. The business owner wants everything version-controlled in code: change a price in a JSON file, merge to `main`, and the site auto-deploys. No CMS, no dashboard. Orders are handled via WhatsApp — the user fills a cart, submits a form, and a pre-formatted message opens in WhatsApp.

## Solution

Static website (SSG) built with Astro + React islands + Tailwind CSS, deployed on Vercel. Git merge to `main` triggers auto-deploy. Menu data lives in a JSON file in the repo. Cart state persists in localStorage. Checkout collects customer details and redirects to WhatsApp with a formatted order message.

## User Stories

1. As a potential customer, I want to see a beautiful homepage that explains what VAU Ketering offers, so that I trust them with my event.
2. As a customer, I want to browse the full menu organized by categories and subcategories, so that I can find the right food for my occasion.
3. As a customer, I want to filter menu items by category (e.g., "Slana jela" vs "Slatkiši") and subcategory (e.g., "Roštilj", "Torte"), so that I don't scroll through irrelevant items.
4. As a customer, I want to search menu items by name or description, so that I can quickly find a specific dish.
5. As a customer, I want to click on a menu item and see its full details in a modal, so that I can read the description and see the photo before deciding.
6. As a customer, I want to add multiple items to my cart with quantity selection, so that I can order the right amount of food.
7. As a customer, I want my cart to persist even if I refresh the page or close the tab, so that I don't lose my selections.
8. As a customer, I want to review my cart on a dedicated page, so that I can verify quantities and remove items before ordering.
9. As a customer, I want to adjust item quantities directly from the cart page, so that I can fix mistakes without re-browsing the menu.
10. As a customer, I want to navigate from the cart to checkout with one click, so that the ordering flow feels smooth.
11. As a customer, I want to enter my name, address, and phone number on checkout, so that the caterer knows where to deliver.
12. As a customer with a company, I want to optionally enter my company name and PIB, so that I can receive a proper invoice.
13. As a customer, I want form validation with clear error messages in Serbian, so that I know exactly what I filled wrong.
14. As a customer, I want to review my order total and item list on the checkout page before sending, so that I can catch mistakes.
15. As a customer, I want to submit my order and be redirected to WhatsApp with a pre-filled message containing all order details, so that I can confirm the order with one tap.
16. As a business owner, I want to edit menu prices directly in code, merge to `main`, and see the change live within minutes, so that I don't need a CMS or developer for every price update.
17. As a business owner, I want the website to be in Serbian Latin script, so that my local customers feel at home.
18. As a visitor, I want to see the business address, phone, hours, and a map on the contact page, so that I can reach or visit VAU Ketering.
19. As a visitor, I want to see links to Instagram and Facebook, so that I can follow the business on social media.
20. As a mobile user, I want the entire site to be responsive and usable on my phone, so that I can order while on the go.
21. As a business owner, I want the site to be fast and SEO-friendly, so that customers can find VAU Ketering via Google search.
22. As a business owner, I want the design to use warm food-marketing colors that stimulate appetite, so that visitors are more likely to order.

## Implementation Decisions

- **Framework:** Astro with React islands (`client:load` for Header, MenuCatalog, CartSummary, CheckoutForm). SSG output, static HTML pages.
- **Styling:** Tailwind CSS v4 with custom theme tokens: `base` (#F7F3E8 buttermilk), `paprika` (#C73E1D), `honey` (#D4A017), `copper` (#B87333), `walnut` (#3D2314), `wood` (#5C4033).
- **Typography:** Oswald Bold for display headings (uppercase, tracking), Inter for body text.
- **Menu data model:** Hierarchical JSON array. Top level `categories` → `subcategories` → `items`. Each item has `id`, `name`, `description`, `price` (number in RSD), `image` (full Cloudinary URL), `unit` (porcija/kom/torta).
- **Cart state:** Zustand store with `persist` middleware (localStorage key `vau-cart`). Actions: `addItem`, `removeItem`, `updateQuantity`, `clearCart`. Derived: `totalItems`, `totalPrice`.
- **Checkout validation:** react-hook-form + Zod schema. Fields: `name` (required, min 2), `address` (required, min 5), `phone` (required, min 6), `companyName` (optional), `companyId` (optional).
- **WhatsApp integration:** On valid submit, build formatted Serbian-Latin message string, URL-encode, redirect to `https://wa.me/{whatsappNumber}?text={message}` via `window.location.href`. Cart is cleared after redirect.
- **Routing:** `/` (home), `/o-nama` (about), `/ponuda` (menu), `/korpa` (cart), `/porudzbina` (checkout), `/kontakt` (contact).
- **Business config:** Central typed config object exported from `src/config/business.ts` — phone, WhatsApp number, address, email, hours, social URLs. Consumed by Contact page, Footer, and CheckoutForm.
- **Build & deploy:** Vercel with Astro preset. Merge to `main` auto-deploys.
- **Spam protection:** Deferred to future phase. No serverless function currently.

## Testing Decisions

- **Seams:** React island components are the primary seams for testing. Test at component behavior level, not implementation details.
- **MenuCatalog:** Test filtering logic (category, subcategory, search query) against fixture data. Verify correct items render.
- **CartSummary:** Test quantity increment/decrement, remove item, total calculation. Mock Zustand store with fixture items.
- **CheckoutForm:** Test validation messages (Serbian), form submission builds correct WhatsApp URL pattern, cart clears on submit.
- **MenuModal:** Test quantity selector and add-to-cart action.
- **No E2E for MVP.** Manual verification on preview deploy sufficient for static site.

## Out of Scope

- Spam protection / bot prevention (deferred).
- Real payment processing (WhatsApp-only ordering).
- Admin dashboard or CMS.
- Multi-language / i18n.
- Order history or customer accounts.
- Delivery date/time selection on checkout (needs client confirmation).
- Email notifications.
- Google Analytics or tracking pixels.
- SEO meta tags beyond basic title/description.

## Further Notes

- Image strategy: Full Cloudinary URLs stored in `menu.json`. Owner uploads to Cloudinary, pastes URL into JSON. No build-time image optimization.
- Map embed: Google Maps iframe in Contact page. URL needs updating to actual business coordinates.
- The WhatsApp redirect uses `window.location.href` rather than `window.open` to avoid popup blockers on mobile.
- Cart persists across sessions via localStorage. Hydration mismatch handled with `mounted` flag pattern.
- Design risk: Dark walnut header/footer on warm buttermilk body. Paprika red CTAs on honey gold secondary accents. Signature visual element: subtle wood-grain texture could be added to section dividers in future iteration.
