# VAU Ketering

Catering website for VAU Ketering — built with Astro, React, Tailwind CSS, and Zustand.

## Stack

- **Astro** — static site generator
- **React** — islands for interactive components (cart, checkout, menu filters)
- **Tailwind CSS** — styling with custom warm food-marketing palette
- **Zustand** — cart state with localStorage persistence
- **react-hook-form + Zod** — checkout form validation

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero, features, CTA |
| About | `/o-nama` | Business story |
| Menu | `/ponuda` | Filterable menu with categories & subcategories |
| Cart | `/korpa` | Cart review & quantity management |
| Checkout | `/porudzbina` | Order form → WhatsApp redirect |
| Contact | `/kontakt` | Address, phone, hours, map |

## Project Structure

```
src/
  components/        # React & Astro components
  config/business.ts  # Business info (phone, address, WhatsApp)
  data/menu.json     # Hierarchical menu data
  layouts/           # Base layout
  pages/             # Astro pages
  schemas/order.ts   # Zod validation schema
  store/cart.ts      # Zustand cart store
  styles/global.css  # Tailwind + custom theme
```

## How it works

1. **Menu** is stored in `src/data/menu.json` — edit, branch, merge to `main`, Vercel auto-deploys.
2. **Cart** lives in localStorage via Zustand. Survives refresh.
3. **Checkout** validates form with Zod, builds WhatsApp pre-filled message, redirects to `wa.me`.

## Getting Started

```bash
bun install
bun run dev
```

## Build

```bash
bun run build
```

## Deploy (Vercel)

1. Push to GitHub
2. Connect repo on [vercel.com](https://vercel.com)
3. Framework preset: Astro
4. Merge to `main` → auto-deploy

## Customizing

- **Business details** → `src/config/business.ts`
- **Menu items** → `src/data/menu.json`
- **Colors** → `src/styles/global.css` (Tailwind custom theme)
- **WhatsApp number** → update `whatsappNumber` in `src/config/business.ts`

## Next Steps

- Replace Cloudinary demo image URLs with real food photography
- Update Google Maps embed URL in `src/pages/kontakt.astro`
- Add spam protection (Turnstile + Vercel API route) when ready
