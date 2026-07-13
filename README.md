# cartbliss 🌙

A mobile-first **"dopamine site"** — a fake food-ordering fantasy for the Indian
midnight snack-craving market. Browse a vertical feed of desi snacks, hoard a cart,
"check out" for **₹0**, and get a full-screen confetti reward. No real money moves,
ever.

> _"Bhookh lagi? 🌙 Order the craving, skip the bill."_

## The loop

Feed (prices **melt down to ₹0** as you linger) → double-tap to hoard → drag up the
hoard sheet → one-tap **Pay ₹0** (fake UPI) → full-screen **Delivered! 🎉** burst
(confetti + streak++, occasional surprise) → post-reward **cooling-off bridge**
(dismiss / remind me in an hour / order it for real on Zepto).

## Design principles

- **Minimal shell, loud reward.** Browse screens use one accent; saturated color,
  glow, gold, and confetti are saved for the reward path.
- **Theme switches the shell, never the celebration.** Light-default with a
  token-driven dark theme (`[data-theme="dark"]` + system preference).
- **Considered conversion, not impulse pressure.** Monetization is a post-reward,
  opt-in affiliate nudge — never in-cart scarcity.
- **Everything centralised.** All color + motion live in `src/app/tokens.css`; scale
  lives in `tailwind.config.ts`. No inline styles, no arbitrary Tailwind values,
  no hardcoded hex/px in components — enforced by ESLint.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · lucide-react.

## Run it

```bash
npm install
npm run dev      # http://localhost:3005
npm run build    # production build
npm run lint     # ESLint incl. the §9 styling guardrails
```

## Structure

```
src/
  app/            layout, tokens.css (color+motion), globals.css, page (tab shell)
  components/     one folder per component (craving-card, craving-feed,
                  cart-hoard-sheet, checkout-oneshot, reward-burst,
                  affiliate-bridge, daily-craving-streak, bottom-nav,
                  profile, theme-toggle, toast)
  context/        CartContext — cart, streak, saved cravings, reward flow
  data/           cravings.ts — 15 desi snacks (imaginary ₹, real photos)
```

## Docs

- [`DESIGN-midnight.md`](DESIGN-midnight.md) — the design system.
- [`SPEC-midnight.md`](SPEC-midnight.md) — the consolidated build spec.
- [`DECISIONS-midnight.md`](DECISIONS-midnight.md) — resolved product decisions.

---

All prices are imaginary. No account, no backend, no real money. Just the dopamine. 🤑
