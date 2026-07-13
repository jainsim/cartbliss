# cartbliss "Midnight" — resolved decisions

Companion to `DESIGN-midnight.md`. Records the decisions made during the grilling
session, including where we deliberately override or reconcile the spec. Where this
doc and `DESIGN-midnight.md` disagree, **this doc wins** (it's the later decision).

---

## 0. Root: migration path

**In-place migration**, not greenfield. The repo already contains a complete
light-only Airbnb-style food *discovery* app. We reshape it into Midnight, preserving
plumbing where it survives contact with the new thesis and demolishing the rest.

> Note: the kickoff prompt claims `tokens.css` and a Midnight `tailwind.config.ts` are
> "already authored." They are **not**. `tokens.css` does not exist; `tailwind.config.ts`
> is the old Airbnb config (hardcoded hex, no dark mode, no reward tokens, no
> `animate-*` utilities). Authoring both is part of milestone 1.

---

## 1. Surface scope

| Existing surface | Verdict | Becomes |
|---|---|---|
| `StoryOverlay` (full-bleed vertical) | **Keep, repurpose** | The **craving feed** — snap-scroll, double-tap-to-add. Home screen. |
| `CustomizationDrawer` | **Keep, reskin** | `craving-card` spice/size customizer (inline where possible) |
| `CartDrawer` | **Keep, reshape** | `cart-hoard-sheet` |
| `CheckoutFlow` (404 lines) | **Keep, gut** | `checkout-oneshot` — strip hard to one-tap ₹0 |
| Pairing prompt (`SUGGESTED_PAIRINGS`) | **Keep, reframe** | ₹0 "hoard more" juice (see §2) |
| Wishlist | **Keep, rehome** | "Saved cravings" under **Profile** tab |
| `CartContext` state shape | **Keep** | Reused; content/currency/cross-sell rewritten |
| `SearchBar` | **Demolish** | — |
| `TrendingCollections` | **Demolish** | — |
| `StorefrontDrawer` + merchant profiles | **Demolish** | — |
| `DiscoveryGrid` | **Demolish** | Replaced by craving feed |
| `Header` | **Demolish/replace** | Minimal shell; bottom tab bar instead |

Nav (§4): **Feed · Cart · Streak · Profile**. "Cart" tab opens the hoard sheet — same
surface as the drag-up sheet, not a second cart.

---

## 2. Monetization philosophy (reconciled)

- **In-cart pairing prompt stays**, but reframed. §6 forbids impulse pressure — resolved
  because *nothing costs money*. The prompt is **₹0 hoard juice**, not a sale. It only
  becomes predatory at the real-money boundary, which lives **only** in the affiliate
  bridge. Copy leans into the fakeness (see §7).
- All real-money intent is isolated to the **post-reward affiliate bridge** (§6 spec).

---

## 3. Core loop mechanics

- **Live-ticking price ticks DOWN toward ₹0.** A "midnight discount" that melts the
  longer you look (₹247 → ₹241 → …), paying off at the ₹0 checkout. Resolves the §5
  "ticking price" vs §8 "no fake scarcity" contradiction — no upward urgency.
- **Double-tap-to-add** in the feed (Reels pattern): heart-burst + fly-to-cart.
- Motion via `animate-pop` (tap) / `animate-burst` (reward) / `animate-tick` (counter)
  utilities — to be defined in config, not ad-hoc in components.

---

## 4. §10 open questions — resolved

| Question | Decision |
|---|---|
| Fake payment | **UPI only** — pre-filled fake UPI, one-tap `Pay ₹0` |
| Reward variability | **Occasional surprise** (~1-in-N variable reward) — see §5 |
| Streak reset | **One-night grace / freeze** (Duolingo-style); no bedtime guilt |
| Affiliate pilot partner | **Q-commerce (Zepto/Blinkit)** — open at midnight, 10-min fit |

---

## 5. Reward-burst variability

- Mostly `Delivered! 🎉`. ~1-in-N checkouts trigger a **surprise**.
- Surprise pool is **non-monetary only**: gold burst, "mystery craving unlocked,"
  double-`Delivered!`, streak bonus. **Never a free *real* item** — real money behind a
  variable-ratio reward crosses the predatory line (§1).

---

## 6. "Remind me in an hour" — MVP reality

Un-buildable as literal push/email (no account, no backend). Resolution:
**local stub + honest copy.** Store affiliate intent + timestamp in `localStorage`;
fire a local browser `Notification` in ~1hr **if** permission granted; copy stays honest
("we'll nudge you if this tab's around"). No fake "email sent." Real push/email is a
backend phase-2. Intent is tagged per partner for future analytics.

---

## 7. Data + copy

- **Seed data:** ~15 iconic desi midnight cravings (samosa, vada pav, Maggi, pav bhaji,
  biryani, momos, jalebi, chai, …), INR integer base prices, **real full-bleed food
  photos** (Unsplash/Pexels). §8: the photo carries the color.
- **Copy reframes required** (Hinglish, §7 tone):
  - Pairing prompt → hoard framing, e.g. *"₹0 anyway — add jalebi to the hoard? 🤑"*
    (replaces "Add fresh organic basil?").
  - Reminder confirm → honest, e.g. *"Cool. If this tab's still around in an hour,
    we'll nudge you. 🌙"* (not "Reminder sent to your email").
  - Keep existing §7 lines for hero / empty cart / checkout / reward / streak.

---

## 8. Persistence (localStorage, no backend)

| State | Persist? |
|---|---|
| `theme` | Yes (hard rule) |
| `streak` + last-hit date | Yes (date math for grace/freeze) |
| `wishlist` / saved cravings | Yes |
| affiliate suppression counter | Yes |
| **cart / hoard** | **No** — resets each session (thematically on-point) |

---

## 9. Design-critique of the inherited build (must-fix during migration)

- **§9 violations already on disk:** hardcoded hex in `globals.css`
  (`#ebebeb`, `#c1c1c1`), and `page.tsx` uses `setInterval`-polled
  `getBoundingClientRect` + JS coordinate math for the cart-fly animation. Both must be
  migrated to token-driven CSS vars / class toggles, and the ESLint guardrails (§9) must
  actually flag the `style` prop and arbitrary `[...]` brackets.
- **Currency assumption is baked into state** (`price`/`basePrice` as USD floats,
  `.toFixed(2)`). Rewrite to INR integers before any card renders.
- **`tailwind.config.ts` has no dark mode and no reward tokens** — it is not the Midnight
  config the prompt claims. Rewrite against `tokens.css`.

---

## 10. This session's deliverable — milestone 1 only

Per the kickoff prompt, stop after milestone 1:
1. Author `tokens.css` (shell tokens theme-aware, reward tokens constant) + import once.
2. Rewrite `tailwind.config.ts`: `darkMode: ["selector", '[data-theme="dark"]']`, colors
   read `var(--…)`, `animate-pop/burst/tick` utilities.
3. `theme-toggle` (light ↔ dark, persisted to `localStorage`, sets `data-theme` on `<html>`).
4. ESLint guardrails: fail on `style` prop + arbitrary-value brackets.
5. Throwaway proof page: bg / surface / text / primary flipping by theme.

Then show file tree + proof page and **wait** for review.
