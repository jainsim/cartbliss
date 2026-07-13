import type { Config } from "tailwindcss";

/** Wrap a token holding space-separated RGB channels so Tailwind alpha works:
 *  `bg-primary/40` -> rgb(var(--color-primary) / 0.4). */
const channel = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  // Light is default; dark applies via [data-theme="dark"] on <html>.
  darkMode: ["selector", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Semantic shell (theme-aware)
        bg: channel("--color-bg"),
        surface: {
          DEFAULT: channel("--color-surface"),
          elevated: channel("--color-surface-elevated"),
        },
        border: channel("--color-border"),
        // Text ramp -> text-hi / text-mid / text-low
        hi: channel("--color-text-hi"),
        mid: channel("--color-text-mid"),
        low: channel("--color-text-low"),
        // Semantic reward (constant)
        primary: channel("--color-primary"),
        gold: channel("--color-reward-gold"),
        mango: channel("--color-accent-mango"),
        mint: channel("--color-accent-mint"),
        grape: channel("--color-accent-grape"),
      },
      borderRadius: {
        none: "0px",
        xs: "4px",
        sm: "8px",
        md: "14px",
        lg: "20px",
        xl: "32px",
        full: "9999px",
      },
      spacing: {
        xxs: "2px",
        xs: "4px",
        sm: "8px",
        md: "12px",
        base: "16px",
        lg: "24px",
        xl: "32px",
        xxl: "48px",
        section: "64px",
      },
      minHeight: {
        touch: "48px",
        cta: "56px",
      },
      maxHeight: {
        sheet: "85vh",
      },
      zIndex: {
        nav: "45",
        sheet: "50",
        checkout: "60",
        reward: "70",
        toast: "80",
      },
      minWidth: {
        touch: "48px",
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "var(--elevation-card)",
        glow: "var(--glow-primary)",
      },
      // Motion utilities. Keyframes + durations/easings live in tokens.css.
      animation: {
        pop: "pop var(--dur-pop) var(--ease-back) both",
        burst: "burst var(--dur-burst) var(--ease-back) both",
        tick: "tick var(--dur-tick) var(--ease-out) both",
        "sheet-up": "sheet-up 0.32s var(--ease-out) both",
        "fade-in": "fade-in 0.2s var(--ease-out) both",
      },
    },
  },
  plugins: [],
};
export default config;
