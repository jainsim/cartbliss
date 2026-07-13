# Claude Code kickoff prompt — cartbliss "Midnight"

Paste this into Claude Code with `DESIGN-midnight.md`, `tokens.css`, and
`tailwind.config.ts` present in the repo.

---

You are building **cartbliss** — a mobile-first "dopamine site": a fake food-ordering
experience for the Indian snack-craving market. Users browse snacks, hoard a cart,
"check out" for ₹0, and get a full-screen reward (confetti + "Delivered!"). No real
money moves. Read `DESIGN-midnight.md` fully before writing any code — it is the
source of truth. `tokens.css` and `tailwind.config.ts` are already authored; use them
as-is.

## Stack
- Next.js (App Router) + TypeScript + Tailwind CSS.
- Import `tokens.css` once at the app root. Use the provided `tailwind.config.ts`.

## Hard rules (do not violate)
1. **Mobile-first.** Design for a 390px viewport first; scale up with responsive
   utilities. One-handed: primary actions live in the bottom thumb zone.
2. **Light is the default theme.** Dark applies via `[data-theme="dark"]` on `<html>`
   or system preference (only when the user hasn't chosen). Build a `theme-toggle`
   that sets and persists `data-theme`.
3. **Everything centralised — see §9 of the spec.** No inline `style` objects. No
   arbitrary Tailwind values (`bg-[#...]`, `text-[13px]`). No hard-coded hex/px in
   `.tsx`. If a value doesn't exist as a token, add it to `tokens.css` or
   `tailwind.config.ts` first, then use it. Dynamic values drive a CSS custom
   property, never a JS style string.
4. **Shell minimal, reward loud.** Idle/browse screens use one accent max. Save
   saturated color, glow, gold, and confetti for the reward path. Theme switches the
   shell, never the celebration.
5. **Reward tokens are constant across themes** — don't remap `--color-primary`,
   `--reward-gold`, etc. per theme.
6. Set up ESLint to fail on the `style` prop and on arbitrary-value brackets in
   `className` (see §9 enforcement).

## Build order (stop after each milestone for review)
1. **Scaffold + tokens wired.** Next.js app, Tailwind config in place, `tokens.css`
   imported, `theme-toggle` working (light ↔ dark, persisted), ESLint guardrails on.
   Prove it with a throwaway page showing bg/surface/text/primary flipping by theme.
2. **`craving-card`** — full-bleed food photo, live-ticking fake ₹ price, spice/size
   customizer, `Add` pill with `animate-pop`. Mobile, token-only styling.
3. **Vertical craving feed** — snap-scroll of `craving-card`s, double-tap-to-add.
4. **`cart-hoard-sheet`** — bottom sheet, big `text-counter` running total.
5. **`checkout-oneshot` → `reward-burst`** — one-tap `Pay ₹0`, then full-screen
   confetti + haptic + "Delivered!" + counter increment.
6. **`affiliate-bridge`** — post-reward cooling-off sheet with Dismiss / "Remind me
   in an hour" / "Order for real". Swappable per-partner module (see §6).

## Conventions
- Components in `src/components/`, one folder each with the component + its variants.
- Use the Hinglish microcopy from §7. Currency is INR (₹), all prices imaginary.
- Every interactive element ≥ 48px touch target; primary CTAs 56px.
- Motion via the `animate-pop` / `animate-burst` / `animate-tick` utilities already
  defined — don't write ad-hoc keyframes in components.

Start with **milestone 1 only**. Show me the file tree and the theme-toggle proof
page, then wait.
