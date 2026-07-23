# 02 — Component tests for cart, menu, and checkout

**What to build:** All interactive React islands have passing behavioral tests. A developer can change component internals with confidence that user-facing behavior remains correct.

**Blocked by:** 01 — Testing infrastructure

**Status:** ready-for-agent

- [ ] `CartSummary`: quantity increment/decrement updates total, remove item deletes from cart, empty cart shows CTA to menu
- [ ] `MenuCatalog`: category filter shows only matching items, subcategory filter narrows further, search query filters by name/description, combined filters work together
- [ ] `MenuModal`: quantity selector stays >= 1, add-to-cart adds item to store, modal closes after add
- [ ] `CheckoutForm`: empty required fields show Serbian validation errors, valid form builds WhatsApp `wa.me` URL with encoded order details, cart clears after submit
