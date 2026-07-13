# cartbliss — "Midnight" design system

Mobile-first dopamine site for the Indian snack-craving market. Extends the
Airbnb structural base (spacing, radius, card anatomy) but replaces its calm
with a **minimal shell + loud reward** model. Ships light-default with a
token-driven dark theme.

Companion files: `tokens.css` (source of truth for color/motion), `tailwind.config.ts` (utilities wired to the tokens).

---

## 1. Positioning rules (non-negotiable)

| Rule | Why |
|---|---|
| Steal gaming *juice + progression*, not casino *chrome* | Wholesome framing is what makes the trend shareable; casino skin reads predatory |
| Theme switches the **shell**, never the **celebration** | Minimal shell must not bleed into the reward moment |
| The affiliate bridge is a **post-reward, opt-in** cooling-off nudge | Protects the "no financial hangover" promise |
| India-native first (INR, Hinglish, desi snacks), global later | Differentiation vs foodnevercomes, which is generic |
| Mobile-first, one-handed, thumb-zone actions | User is a midnight scroller in bed |

---

## 2. Token architecture

Two tiers. Components read **only** semantic tokens.

| Tier | Example | Consumed by |
|---|---|---|
| Primitive | `--p-rausch: 255 56 92` | Semantic tokens only |
| Semantic — shell (flips) | `--color-bg`, `--color-text-hi` | Components |
| Semantic — reward (constant) | `--color-primary`, `--reward-gold`, `--confetti` | Components |

Colors are RGB channels, so Tailwind alpha works: `bg-primary/40`, `shadow-glow`.

### Shell tokens (theme-aware)

| Token | Light (default) | Dark |
|---|---|---|
| `--color-bg` | `#FFFFFF` | `#0B0B0F` |
| `--color-surface` | `#F7F7F7` | `#16161D` |
| `--color-surface-elevated` | `#FFFFFF` | `#1F1F29` |
| `--color-border` | `#EBEBEB` | `#2A2A35` |
| `--color-text-hi` | `#222222` | `#FFFFFF` |
| `--color-text-mid` | `#6A6A6A` | `#A0A0B0` |
| `--color-text-low` | `#929292` | `#5C5C6B` |
| `--elevation-card` | soft gray shadow | deep shadow |

### Reward tokens (constant — loud in both themes)

| Token | Value | Use |
|---|---|---|
| `--color-primary` | `#FF385C` | Every primary CTA |
| `--color-reward-gold` | `#FFD24C` | Win state |
| `--color-accent-mango` | `#FFB800` | Category, bursts |
| `--color-accent-mint` | `#00C48C` (→ `#00E0A4` dark) | Category, gradient |
| `--color-accent-grape` | `#7C4DFF` (→ `#8B5CFF` dark) | Category, gradient |
| `--glow-primary` | `rausch/35` (→ `/50` dark) | Reward-path depth |

Only mint + grape lift in dark (contrast). Everything else identical so the celebration feels the same.

---

## 3. Theming implementation

| Mechanism | Behavior |
|---|---|
| `:root { }` | Light semantic values → default |
| `[data-theme="dark"]` on `<html>` | Explicit dark override |
| `@media (prefers-color-scheme: dark)` | Auto-dark **only** if user hasn't chosen |
| Toggle | JS sets `data-theme` on `<html>`, persists the choice |
| Tailwind | `darkMode: ["selector", '[data-theme="dark"]']`; colors read `var(--…)` |

No component ever changes to support a new theme — add a `[data-theme="x"]` block and remap.

---

## 4. Mobile-first architecture

| Element | Spec |
|---|---|
| **Vertical craving feed** ⭐ | Full-bleed food, snap-scroll, double-tap-to-add (Reels/TikTok pattern) — the core loop |
| Layout | Single column, edge-to-edge photos |
| Primary action | Sticky bottom CTA in thumb zone (`Add` / `Checkout ₹0`) |
| Cart | Bottom sheet, drag-to-expand (not a side drawer) |
| Reward | Full-screen takeover burst |
| Nav | Bottom tab bar: Feed · Cart · Streak · Profile |
| Touch targets | 48px min, 56px primary |
| Motion | tap = `animate-pop`; reward = `animate-burst`; counter = `animate-tick` |

---

## 5. Components to build (extend Airbnb anatomy)

| Component | Extends | Core behavior |
|---|---|---|
| `craving-card` | property-card | Full-bleed photo, live-ticking fake ₹, spice/size customizer, `Add` pill with `animate-pop` |
| `cart-hoard-sheet` | reservation-card | Big `text-counter` running total that climbs; "monopoly money" framing |
| `checkout-oneshot` | text-input group | Pre-filled fake card / fake UPI, single `Pay ₹0` tap, no account |
| `reward-burst` ⭐ | new | Confetti + haptic + "Delivered!" + counter increment. Full-screen. The product. |
| `rider-tracker` | new | Live countdown + map ping → resolves to "Delivered!" |
| `daily-craving-streak` | badge | Daily hit + streak counter — retention loop |
| `affiliate-bridge` | modal/sheet | Cooling-off nudge (§6) |
| `theme-toggle` | icon-button | Flips `data-theme`, persists |

---

## 6. Affiliate bridge — cooling-off module

**Purpose:** give the satisfied user time to decide if they actually want to
spend. Optimizes *considered* conversion, not impulse.

### Timing sequence

| Step | Screen | Rule |
|---|---|---|
| 1 | Reward burst | Full-screen, uninterrupted — sacred |
| 2 | Burst settles, counter ticks | ~800ms breathing room |
| 3 | Bottom sheet slides up below the settled reward | Never overlaps the celebration |
| 4 | User picks | One-tap dismiss; remembers "not now" |

### Options

| Option | Action | Role |
|---|---|---|
| Dismiss (default, largest, thumb-zone) | Close | Protects the fantasy |
| **Remind me in an hour** ⭐ | Fire affiliate link later via push/email | Cooling-off + retention + highest-intent conversion |
| Order it for real → | Immediate partner redirect | For genuine present intent |

### Rules

- Trigger only after reward animation completes — never during checkout.
- Surface: bottom sheet, `surface-elevated`, drag-to-dismiss.
- Tone: permission, not pressure. Dismiss is the easy path.
- Frequency cap: max 1×/session; suppress N sessions after a dismiss.
- Affiliate fire tagged per partner (Swiggy / Zepto / Blinkit / local store).
- "Remind me" requires one-time push/email opt-in; store it.
- Structure as a swappable module w/ per-partner params for A/B testing.

### B2B metrics

| Metric | Why partners care |
|---|---|
| Reward → reminder opt-in rate | Considered-intent volume |
| Reminder → click (1hr later) | Survived cooling-off = high intent |
| Partner conversion + refund rate | Lower refunds = premium ad rate |

Test the delay window: 30min / 1hr / "tomorrow's craving".

---

## 7. Microcopy (India-native, Hinglish)

| Surface | Copy |
|---|---|
| Hero | "Bhookh lagi? 🌙 Order the craving, skip the bill." |
| Empty cart | "Cart khaali hai. Start hoarding →" |
| Add to cart | "Added! Total: monopoly money 🤑" |
| Checkout | "Pay ₹0 — forever free, forever fake" |
| Reward burst | "Delivered! 🎉 Craving satisfied · ₹0 spent" |
| Cooling-off nudge | "Craving won 🎉 Still want the real thing? Sleep on it — we'll nudge you in an hour." |
| Reminder push (1hr) | "Still craving that {dish}? It's a tap away →" |
| Streak | "{n}-day craving streak 🔥 Don't break it tonight" |

---

## 8. Keep / Avoid

| ✅ Keep | ❌ Avoid |
|---|---|
| Airbnb spacing, radius, card anatomy | Airbnb's single-accent restraint on the reward path |
| One accent per *browse* screen | Multi-color chrome on idle screens |
| Gaming juice: streaks, bursts, haptics | Casino chrome, slot spins, "buy chips" |
| Considered conversion via cooling-off | Impulse pressure / fake scarcity timers |
| Full-bleed food photo carries the color | Decorative gradients on idle surfaces |

---

## 9. Styling rules — everything centralised

No component invents a value. All styling flows from tokens → Tailwind utilities.

| ❌ Never | ✅ Instead |
|---|---|
| `style={{ color: "#222" }}` (inline style object) | `className="text-hi"` |
| `className="bg-[#0B0B0F]"` (arbitrary hex) | `className="bg-bg"` (semantic token) |
| `className="text-[13px] p-[7px]"` (arbitrary size) | scale tokens: `text-sm`, `p-sm` |
| Hard-coded hex/px anywhere in `.tsx` | Add a token in `tokens.css`, then use it |
| Per-component `<style>` blocks / CSS modules with raw values | Shared Tailwind utilities only |
| Dynamic color set via JS `el.style.background = …` | Toggle a class or a CSS var |

**Enforcement**
- Dynamic/runtime values → drive a CSS custom property, never a JS style string.
- Repeated utility clusters → extract to a component or a `@layer components` class, not copy-paste.
- Add ESLint rules to fail the build on violations:
  - `react/forbid-dom-props` / `react/forbid-component-props` → block the `style` prop.
  - `no-restricted-syntax` or a Tailwind lint plugin → block arbitrary-value brackets `[...]` in `className`.
- Single source of truth: color + motion live in `tokens.css`; scale (spacing, radius, type) lives in `tailwind.config.ts`. Nowhere else.

---

## 10. Open questions

- Fake payment: card, UPI, or both at MVP? (UPI = more India-native)
- Reward variability: fixed "Delivered!" every time, or occasional surprise (mystery craving / free item) for variable-reward pull?
- Streak reset policy: does missing a night break it, or grace period?
- Partner priority for the affiliate pilot: q-commerce (Zepto/Blinkit) vs local restaurants?
