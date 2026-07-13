# cartbliss "Midnight" — build spec

The single buildable spec for the app. Consolidates the design system
(`DESIGN-midnight.md`), the resolved decisions (`DECISIONS-midnight.md`), and the
tokens as actually shipped in milestone 1. Where documents disagree, precedence is:

**`DECISIONS-midnight.md` > this file > `DESIGN-midnight.md`.**

Everything here is mobile-first (390px design width), one-handed, thumb-zone. All
styling flows from tokens → Tailwind utilities. No inline `style`, no arbitrary
`[...]` values, no hardcoded hex/px in `.tsx` (enforced by ESLint, §12).

---

## 1. Product in one paragraph

A midnight scroller in bed opens cartbliss, thumbs a vertical feed of desi snacks,
double-taps to hoard them (prices *melt down toward ₹0* as they linger), drags up the
hoard sheet, taps **Pay ₹0** once via fake UPI, and gets a full-screen confetti reward
("Delivered!"). No real money moves, no account. After the celebration settles, an
opt-in cooling-off sheet offers to nudge them about the real thing in an hour. Retention
runs on a daily craving streak. Monetization is *considered* conversion via the
post-reward affiliate bridge — never impulse pressure.

---

## 2. Token system (as shipped — milestone 1)

Source of truth: `src/app/tokens.css` (color + motion) and `tailwind.config.ts` (scale).
Colors are space-separated RGB channels so alpha works (`bg-primary/40`).

### Shell tokens — flip with theme

| Semantic token | Tailwind util | Light | Dark |
|---|---|---|---|
| `--color-bg` | `bg-bg` | `#FFFFFF` | `#0B0B0F` |
| `--color-surface` | `bg-surface` | `#F7F7F7` | `#16161D` |
| `--color-surface-elevated` | `bg-surface-elevated` | `#FFFFFF` | `#1F1F29` |
| `--color-border` | `border-border` / `bg-border` | `#EBEBEB` | `#2A2A35` |
| `--color-text-hi` | `text-hi` | `#222222` | `#FFFFFF` |
| `--color-text-mid` | `text-mid` | `#6A6A6A` | `#A0A0B0` |
| `--color-text-low` | `text-low` | `#929292` | `#5C5C6B` |
| `--elevation-card` | `shadow-card` | soft gray | deep |

### Reward tokens — constant across themes (loud in both)

| Semantic token | Tailwind util | Value | Dark override |
|---|---|---|---|
| `--color-primary` | `bg-primary` `text-primary` | `#FF385C` | — |
| `--color-reward-gold` | `bg-gold` | `#FFD24C` | — |
| `--color-accent-mango` | `bg-mango` | `#FFB800` | — |
| `--color-accent-mint` | `bg-mint` | `#00C48C` | `#00E0A4` (contrast lift) |
| `--color-accent-grape` | `bg-grape` | `#7C4DFF` | `#8B5CFF` (contrast lift) |
| `--glow-primary` | `shadow-glow` | `rausch/35` | `rausch/50` |

Only mint + grape lift in dark. Never remap the rest per theme.

### Theming mechanism

- `:root` = light (default). `[data-theme="dark"]` on `<html>` = explicit dark.
- `@media (prefers-color-scheme: dark)` auto-darks **only** when no explicit choice
  (`:root:not([data-theme="light"])`).
- `theme-toggle` sets `data-theme`, persists to `localStorage["cartbliss-theme"]`.
- Pre-paint script in `layout.tsx` applies the stored theme before first paint.

### Scale (tailwind.config.ts)

- Spacing: `xxs 2 · xs 4 · sm 8 · md 12 · base 16 · lg 24 · xl 32 · xxl 48 · section 64`.
- Radius: `xs 4 · sm 8 · md 14 · lg 20 · xl 32 · full`.
- Touch: `min-h-touch` 48px, `min-h-cta` 56px, `min-w-touch` 48px.

### Motion — utilities only, no ad-hoc keyframes in components

| Utility | Keyframe | Use |
|---|---|---|
| `animate-pop` | scale 1 → .92 → 1, `ease-back`, .2s | Any tap / add |
| `animate-burst` | scale .6 → 1.08 → 1 + fade, `ease-back`, .6s | Reward entrance |
| `animate-tick` | translateY .35em → 0 + fade, `ease-out`, .4s | Counter digit roll |

---

## 3. Information architecture

Bottom tab bar (thumb zone), 4 tabs only:

| Tab | Surface |
|---|---|
| **Feed** ⭐ | Vertical craving feed (home). Full-bleed, snap-scroll, double-tap-to-add. |
| **Cart** | Opens the `cart-hoard-sheet` (same surface as drag-up; not a second cart). |
| **Streak** | `daily-craving-streak` — daily hit + streak counter. |
| **Profile** | Saved cravings (rehomed wishlist), theme toggle, session settings. |

No search, no trending rows, no merchant storefronts, no merchant profiles
(demolished — see `DECISIONS-midnight.md §1`).

---

## 4. Data model

No backend. Seed data is a static module; user state is `localStorage`.

### Craving (seed item)

```ts
type Craving = {
  id: string;              // "samosa"
  name: string;            // "Samosa"
  tagline: string;         // Hinglish one-liner
  photo: string;           // full-bleed food photo URL
  basePrice: number;       // INR integer, e.g. 40
  floor: number;           // price stops melting here (e.g. 0 or a teasing 1)
  category: "chaat" | "fried" | "sweet" | "noodles" | "beverage" | "roll" | "curry";
  sizes: Size[];           // ["Regular","Large"]
  spices: Spice[];         // ["Mild","Medium","Hot"]
  toppings: Topping[];     // optional add-ons, all ₹0
};
```

~15 iconic desi midnight cravings (samosa, vada pav, Maggi, pav bhaji, chicken
biryani, momos, jalebi, masala chai, pani puri, chole bhature, egg roll, dosa, gulab
jamun, kathi roll, cutting chai). INR integer base prices. Real full-bleed food photos.

### Cart item (reuse existing `CartContext` shape)

Keep `cartId` keyed on `id+size+spice+sortedToppings`; keep add/remove/quantity.
Rewrite: prices to INR integers, currency formatting to `₹`, remove USD `.toFixed(2)`.

### Persisted state (`localStorage`)

| Key | Persist |
|---|---|
| `cartbliss-theme` | yes |
| `cartbliss-streak` `{count, lastHitISODate, freezeUsed}` | yes |
| `cartbliss-saved` (saved craving ids) | yes |
| `cartbliss-affiliate` `{suppressUntilSession, lastPartner}` | yes |
| **cart / hoard** | **no** — resets each session (on-thesis) |

---

## 5. Components

Folder-per-component under `src/components/<kebab-name>/`. Semantic tokens only.

### 5.1 `craving-card` (extends property-card)

- **Layout:** full-bleed photo fills the card; content overlays the lower third on a
  bottom-up scrim (token gradient, not decorative). One card ≈ one viewport in the feed.
- **Live price:** starts at `basePrice`, **melts down** toward `floor` while the card is
  the active/visible one (₹247 → ₹241 → …). Drives a CSS custom property / counter,
  never a JS style string. Uses `animate-tick` on digit change. Stops at `floor`.
- **Customizer:** inline spice (Mild/Medium/Hot) + size (Regular/Large) chips; toppings
  optional. All changes are ₹0 — framing is "customize the fantasy," not upcharge.
- **Add pill:** primary CTA, `min-h-cta`, `bg-primary`, `shadow-glow`, `animate-pop` on
  tap. Fires the fly-to-cart. Copy: `Add` → on success toast per §7.
- **States:** idle · active(price melting) · adding(pop) · added.
- **A11y:** photo has alt = craving name; price is `aria-live="polite"`.

### 5.2 Craving feed (repurpose `StoryOverlay`)

- Vertical snap-scroll (`snap-y snap-mandatory`), one `craving-card` per snap point.
- **Double-tap anywhere on the card = add** (Reels pattern): heart-burst (`animate-burst`)
  at tap point + fly-to-cart. Single tap toggles customizer focus.
- Only the active card melts its price (perf + meaning).
- Sticky bottom CTA region reserved for `Checkout ₹0` once cart non-empty.

### 5.3 `cart-hoard-sheet` (extends reservation-card)

- Bottom sheet, drag-to-expand/dismiss, `bg-surface-elevated`, `shadow-card`.
- **Big `text-counter` running total** that climbs with `animate-tick`; "monopoly money"
  framing (§7). Line items with qty steppers (reuse cart logic).
- **In-cart pairing prompt** stays but reframed as ₹0 hoard-juice (§7) — never a real
  upsell. Appears ~1.2s after an add, dismissible.
- Footer: sticky `Checkout ₹0` primary CTA in thumb zone.

### 5.4 `checkout-oneshot` (extends text-input group)

- Pre-filled **fake UPI** id (UPI only — no card, no toggle). One tap `Pay ₹0`.
- No account, no real fields to fill. Single `min-h-cta` primary button.
- On tap → dismiss sheet → trigger `reward-burst`. Never show the affiliate bridge here.

### 5.5 `reward-burst` ⭐ (new) — the product

- Full-screen takeover. Confetti (`--confetti`/accent tokens) + `animate-burst` +
  optional haptic (`navigator.vibrate` where supported) + **"Delivered! 🎉"** + streak
  counter increment (`animate-tick`).
- **Variable reward:** mostly the standard burst; ~1-in-N gives a **surprise**
  (gold burst / "mystery craving unlocked" / double-Delivered / streak bonus).
  Surprise pool is **non-monetary only** — never a free *real* item.
- Sacred: uninterrupted. Nothing overlaps it. Theme never changes the celebration.
- After ~800ms settle → hand off to `affiliate-bridge`.

### 5.6 `rider-tracker` (new)

- Optional pre-reward beat: live countdown + map ping that resolves into "Delivered!".
- Purely cosmetic anticipation; keep short so it doesn't delay the reward payoff.

### 5.7 `daily-craving-streak` (extends badge)

- Daily hit + streak counter. **One-night grace / freeze:** missing a single night does
  not break the streak (uses `freezeUsed` + date math on `lastHitISODate`). No bedtime
  guilt. Copy per §7.

### 5.8 `affiliate-bridge` (modal/sheet) — cooling-off

- Triggers **only after** `reward-burst` completes (~800ms). Bottom sheet slides up
  *below* the settled reward, never overlapping it. `bg-surface-elevated`, drag-to-dismiss.
- Options (thumb-zone order):
  1. **Dismiss** (default, largest) — protects the fantasy; remembers "not now".
  2. **Remind me in an hour** ⭐ — MVP: local stub. Store intent+timestamp in
     `localStorage`; fire a local `Notification` in ~1hr *if* permission granted; **honest
     copy** (no fake "email sent"). Tag intent per partner for future analytics.
  3. **Order it for real →** — immediate partner redirect (affiliate link).
- **Partner:** q-commerce first (Zepto / Blinkit) — open at midnight, 10-min fit.
  Structure as a swappable per-partner module for A/B testing.
- Frequency cap: max 1×/session; suppress N sessions after a dismiss.
- Tone: permission, not pressure. Dismiss is the easy path.

### 5.9 `theme-toggle` (shipped, milestone 1)

Icon-button; flips `data-theme`, persists, `active:animate-pop`, 48px target, a11y labels.

---

## 6. The core loop (end to end)

```
Feed (melting price) → double-tap add → hoard sheet climbs → Pay ₹0 (UPI)
   → [rider-tracker] → reward-burst (confetti, streak++, maybe surprise)
   → ~800ms settle → affiliate-bridge (dismiss / remind 1hr / order real)
```

The ₹0 price melt is the through-line: the number the user watched melt in the feed pays
off as "₹0 spent" in the reward.

---

## 7. Microcopy (Hinglish, India-native)

| Surface | Copy |
|---|---|
| Hero / empty feed | "Bhookh lagi? 🌙 Order the craving, skip the bill." |
| Empty cart | "Cart khaali hai. Start hoarding →" |
| Add success | "Added! Total: monopoly money 🤑" |
| Pairing prompt (reframed) | "₹0 anyway — add {dish} to the hoard? 🤑" |
| Checkout | "Pay ₹0 — forever free, forever fake" |
| Reward burst | "Delivered! 🎉 Craving satisfied · ₹0 spent" |
| Reward surprise | "Mystery craving unlocked! 🎁" (or "Double delivered! 🎉🎉") |
| Cooling-off nudge | "Craving won 🎉 Still want the real thing? Sleep on it — we'll nudge you in an hour." |
| Reminder confirm (honest) | "Cool. If this tab's still around in an hour, we'll nudge you. 🌙" |
| Streak | "{n}-day craving streak 🔥 Don't break it tonight" |
| Streak freeze used | "Freeze used 🧊 Streak's safe — hit it tonight to keep going." |

Currency always `₹`, prices imaginary, integers.

---

## 8. Keep / Avoid (design guardrails)

| ✅ Keep | ❌ Avoid |
|---|---|
| One accent per browse screen | Multi-color chrome on idle screens |
| Full-bleed food photo carries the color | Decorative gradients on idle surfaces |
| Gaming juice: streaks, bursts, haptics | Casino chrome, slot spins, "buy chips" |
| Price melting *down* to ₹0 | Prices ticking *up* / countdown scarcity timers |
| Considered conversion via cooling-off | In-cart impulse pressure at the real-money boundary |
| Reward moment sacred, uninterrupted | Affiliate/upsell overlapping the celebration |
| Minimal shell, loud reward | Theme bleeding into the celebration |

---

## 9. Build order (stop after each for review)

1. ✅ **Scaffold + tokens + theme-toggle + ESLint + proof** (milestone 1 — done).
2. `craving-card` — full-bleed, melting price, inline customizer, `Add` pop.
3. Vertical craving feed — snap-scroll, double-tap-to-add.
4. `cart-hoard-sheet` — bottom sheet, climbing counter.
5. `checkout-oneshot` → `reward-burst` — one-tap Pay ₹0, full-screen confetti + streak++.
6. `affiliate-bridge` — post-reward cooling-off, per-partner module.

Then: `rider-tracker`, `daily-craving-streak` surface, Profile/Saved cravings, bottom nav.

---

## 10. Migration backlog (demolish/migrate as milestones land)

Legacy Airbnb-era files still in `src/components/`, exempt from §12 guardrails until
handled (see `.eslintrc.json` overrides):

| File | Fate |
|---|---|
| `StoryOverlay.tsx` | → craving feed |
| `CustomizationDrawer.tsx` | → craving-card customizer |
| `CartDrawer.tsx` | → cart-hoard-sheet |
| `CheckoutFlow.tsx` | → checkout-oneshot (gut hard) |
| `DiscoveryGrid`, `SearchBar`, `TrendingCollections`, `StorefrontDrawer`, `Header` | delete |
| `CartContext.tsx` | keep shape; rewrite currency (USD→INR) + drop merchant/pairing-grocery data |

---

## 11. Accessibility & touch

- Every interactive element ≥ 48px; primary CTAs 56px (`min-h-cta`).
- Live price `aria-live="polite"`; reward announces "Delivered".
- Toggle exposes `aria-pressed` + descriptive `aria-label`.
- Respect `prefers-reduced-motion`: gate confetti/burst intensity (add a token/query
  before milestone 5).
- Color contrast holds in both themes (text-hi/mid on bg/surface verified milestone 1).

---

## 12. Styling enforcement (centralised — §9 of design system)

- No inline `style` prop (`react/forbid-dom-props` / `react/forbid-component-props`).
- No arbitrary `[...]` values in `className` (`no-restricted-syntax`).
- Dynamic/runtime values drive a CSS custom property or a class toggle, never a JS
  style string.
- New value doesn't exist? Add a token in `tokens.css` / `tailwind.config.ts` first.
- Color + motion live in `tokens.css`; scale lives in `tailwind.config.ts`. Nowhere else.

---

## 13. Open items (revisit before the relevant milestone)

- Surprise-reward ratio N and exact pool contents (milestone 5).
- `prefers-reduced-motion` token/strategy for confetti (before milestone 5).
- Affiliate suppression count N after a dismiss (milestone 6).
- Rider-tracker: include the beat, or go straight to reward? (milestone 5).
- Confetti implementation: canvas vs. DOM sprites vs. library (milestone 5).
